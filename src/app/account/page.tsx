'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, UserProfile, AuthGuard } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import UserAvatar, { isImageAvatar } from '../../components/UserAvatar';
import {
  User,
  Save,
  CheckCircle2,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  Zap,
  LogOut,
  Upload,
  Image as ImageIcon,
  Camera,
  RotateCcw,
  Link2,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  '👩‍💼', '👨‍💻', '🧑‍🔬', '🧙‍♂️', '🦊', '🚀', '🌟', '💼',
  '🐱', '🦄', '🐼', '🎨', '🦁', '🦉', '🎯', '⚡'
];

export default function AccountPage() {
  const {
    user,
    updateProfile,
    savedPredictions,
    deletePrediction,
    clearHistory,
    logout,
  } = useAuth();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, avatar: compressedDataUrl }));
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setFormData((prev) => ({ ...prev, avatar: customUrl.trim() }));
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleResetToDefaultEmoji = () => {
    setFormData((prev) => ({ ...prev, avatar: '👩‍💼' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AuthGuard>
      <div className="space-y-10 py-6">
        {/* HEADER BANNER */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border border-white/40 flex-shrink-0 relative overflow-hidden"
              style={{
                background: 'var(--glass-bg)',
              }}
            >
              <UserAvatar avatar={formData.avatar} size="xl" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-prominent-title">
                  {formData.name || 'User Profile'}
                </h1>
                <span className="glass-pill text-xs">
                  ID: {formData.id || 'usr-9042'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-prominent-sub">
                {formData.email}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-prominent-muted">
                <Calendar size={12} />
                <span>Joined: {formData.joinedDate || 'August 2026'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/predict"
              className="btn-glowing text-xs py-2.5 px-4 no-underline"
            >
              <Zap size={14} />
              <span>Launch Predictor</span>
            </Link>
            <button
              onClick={logout}
              className="btn-glowing-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 text-red-400 hover:text-red-300"
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: EDIT DATA FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-prominent-title flex items-center gap-2">
                    <User size={20} className="text-purple-400" />
                    Manage Account & Parameters
                  </h2>
                  <p className="text-xs text-prominent-muted">
                    Alter your personal credentials and default applicant metrics
                  </p>
                </div>

                {saveSuccess && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold animate-bounce">
                    <CheckCircle2 size={14} /> Saved!
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Profile Picture & Avatar Management */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-prominent-title block">
                      Profile Picture & Avatar
                    </label>
                    <span className="text-[11px] text-prominent-muted">
                      Choose an emoji or upload your own photo
                    </span>
                  </div>

                  {/* Custom Photo Preview & Upload Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-glowing-secondary text-xs py-2 px-3.5 flex items-center gap-2"
                    >
                      <Upload size={14} className="text-purple-400" />
                      <span>Upload Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="btn-glowing-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-prominent-sub"
                    >
                      <Link2 size={13} />
                      <span>Image URL</span>
                    </button>

                    {isImageAvatar(formData.avatar) && (
                      <button
                        type="button"
                        onClick={handleResetToDefaultEmoji}
                        className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 transition-colors"
                        title="Reset to default emoji"
                      >
                        <RotateCcw size={12} />
                        <span>Reset to Emoji</span>
                      </button>
                    )}
                  </div>

                  {/* URL Input Form (if toggled) */}
                  {showUrlInput && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="glass-input text-xs py-2 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="btn-glowing text-xs py-2 px-3"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Preset Emojis Grid */}
                  <div>
                    <span className="text-[11px] font-bold text-prominent-muted block mb-2">
                      Or Pick a Cute Persona Emoji:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: av })}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                            formData.avatar === av
                              ? 'btn-glowing scale-110 border-2 border-white'
                              : 'glass-card hover:scale-105'
                          }`}
                          title={`Select ${av}`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-prominent-title block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="glass-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-prominent-title block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="glass-input"
                      required
                    />
                  </div>
                </div>

                {/* Financial Inputs */}
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-prominent-title mb-3">
                    Default Financial Metrics
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Monthly Applicant Income ($)
                      </label>
                      <input
                        type="number"
                        value={formData.monthlyIncome ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monthlyIncome: Number(e.target.value),
                          })
                        }
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Coapplicant Income ($)
                      </label>
                      <input
                        type="number"
                        value={formData.coapplicantIncome ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coapplicantIncome: Number(e.target.value),
                          })
                        }
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Typical Loan Amount ($1,000s)
                      </label>
                      <input
                        type="number"
                        value={formData.defaultLoanAmount ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultLoanAmount: Number(e.target.value),
                          })
                        }
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Credit History Record
                      </label>
                      <select
                        value={formData.creditHistory ?? 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditHistory: Number(e.target.value),
                          })
                        }
                        className="glass-select"
                      >
                        <option value={1}>1.0 - Meets Guidelines (Good)</option>
                        <option value={0}>0.0 - Delinquent (Poor)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Categorical Profile Attributes */}
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-prominent-title mb-3">
                    Demographic & Property Info
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Education Level
                      </label>
                      <select
                        value={formData.education || 'Graduate'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            education: e.target.value as any,
                          })
                        }
                        className="glass-select"
                      >
                        <option value="Graduate">Graduate</option>
                        <option value="Not Graduate">Not Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-prominent-title block mb-1">
                        Preferred Property Area
                      </label>
                      <select
                        value={formData.preferredPropertyArea || 'Semiurban'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredPropertyArea: e.target.value as any,
                          })
                        }
                        className="glass-select"
                      >
                        <option value="Semiurban">Semiurban</option>
                        <option value="Urban">Urban</option>
                        <option value="Rural">Rural</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Application / Bio Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Underwriting or borrower background notes..."
                    className="glass-input"
                  />
                </div>

                {/* Submit Save Button */}
                <div className="pt-2">
                  <button type="submit" className="btn-glowing w-full py-3.5 text-base">
                    <Save size={18} />
                    <span>Save Altered Data & Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: SAVED PREDICTIONS & THEME SETTINGS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* THEME PREFERENCE CARD */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-prominent-title flex items-center gap-2">
                <Sparkles size={18} className="text-pink-400" />
                Theme & Lighting Style
              </h3>
              <p className="text-xs text-prominent-muted">
                Switch between cute dreamy pastel and rough dark marble aesthetics
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('cute')}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                    theme === 'cute'
                      ? 'border-pink-400 shadow-lg shadow-pink-500/25 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-transparent'
                      : 'border-transparent glass-card hover:border-pink-300/40'
                  }`}
                >
                  <span className="text-xl block mb-1">🌸</span>
                  <span className="font-extrabold text-xs block text-prominent-title">
                    Cute Pastel Sky
                  </span>
                  <span className="text-[10px] text-prominent-muted block mt-0.5">
                    Dreamy clouds & stars
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('rough')}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                    theme === 'rough'
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/25 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-transparent'
                      : 'border-transparent glass-card hover:border-cyan-300/40'
                  }`}
                >
                  <span className="text-xl block mb-1">⚡</span>
                  <span className="font-extrabold text-xs block text-prominent-title">
                    Rough Dark Marble
                  </span>
                  <span className="text-[10px] text-prominent-muted block mt-0.5">
                    Sleek dark veins
                  </span>
                </button>
              </div>
            </div>

            {/* SAVED PREDICTION HISTORY */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-prominent-title flex items-center gap-2">
                    <Layers size={18} className="text-cyan-400" />
                    Saved Scenarios ({savedPredictions.length})
                  </h3>
                  <p className="text-xs text-prominent-muted">
                    Saved prediction runs and financial profiles
                  </p>
                </div>

                {savedPredictions.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {savedPredictions.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <span className="text-3xl">📁</span>
                  <p className="text-xs text-prominent-muted">
                    No saved scenarios yet. Run predictions and click &quot;Save Scenario&quot;.
                  </p>
                  <Link
                    href="/predict"
                    className="btn-glowing-secondary text-xs py-2 px-4 inline-block no-underline mt-2"
                  >
                    Go to Predictor
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {savedPredictions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl glass-card space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-extrabold text-prominent-title">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-prominent-muted">
                            {item.timestamp} • K={item.kUsed}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.predictedStatus === 'Y'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {item.predictedStatus === 'Y' ? 'Approved' : 'Rejected'} (
                            {(item.approvalProbability * 100).toFixed(0)}%)
                          </span>

                          <button
                            onClick={() => deletePrediction(item.id)}
                            className="text-white/40 hover:text-red-400 transition-colors p-1"
                            title="Delete scenario"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-[10px] text-prominent-sub pt-1">
                        <span>Income: ${item.inputs.ApplicantIncome}</span>
                        <span>Loan: ${(item.inputs.LoanAmount || 0) * 1000}</span>
                        <span>Credit: {Number(item.inputs.Credit_History) === 1 ? 'Good' : 'Poor'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
