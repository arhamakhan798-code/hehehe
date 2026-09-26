'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AuthGuard } from '../../context/AuthContext';
import {
  defaultKnnEngine,
  PRESET_APPLICANTS,
  FIXED_K,
} from '../../lib/loanData';
import { LoanRecord, PredictionResult } from '../../lib/knnEngine';
import KNNVisualizer from '../../components/KNNVisualizer';
import confetti from 'canvas-confetti';
import {
  Zap,
  Sliders,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function PredictionPage() {
  const { user, savePrediction } = useAuth();

  // Fixed constant K = 7
  const kValue = FIXED_K;
  const metric = 'euclidean';
  const weighting = 'distance';

  // Single Prediction Form State
  const [formData, setFormData] = useState<LoanRecord>({
    Gender: 'Male',
    Married: 'Yes',
    Dependents: '0',
    Education: 'Graduate',
    Self_Employed: 'No',
    ApplicantIncome: 5800,
    CoapplicantIncome: 1500,
    LoanAmount: 140,
    Loan_Amount_Term: 360,
    Credit_History: 1,
    Property_Area: 'Semiurban',
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Run initial prediction on load
  useEffect(() => {
    runInference();
  }, []);

  const runInference = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = defaultKnnEngine.predict(formData, kValue, metric, weighting);
      setPrediction(res);
      setIsCalculating(false);

      if (res.predictedStatus === 'Y' && res.confidenceScore > 0.7) {
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.65 },
          });
        } catch (e) {}
      }
    }, 150);
  };

  const handleInputChange = (field: keyof LoanRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadPreset = (presetIndex: number) => {
    if (PRESET_APPLICANTS[presetIndex]) {
      setFormData(PRESET_APPLICANTS[presetIndex].data);
    }
  };

  const loadUserProfile = () => {
    if (!user) return;
    setFormData({
      Gender: user.gender === 'Female' ? 'Female' : 'Male',
      Married: user.married,
      Dependents: user.dependents,
      Education: user.education,
      Self_Employed: user.selfEmployed,
      ApplicantIncome: user.monthlyIncome,
      CoapplicantIncome: user.coapplicantIncome,
      LoanAmount: user.defaultLoanAmount,
      Loan_Amount_Term: user.defaultLoanTerm,
      Credit_History: user.creditHistory,
      Property_Area: user.preferredPropertyArea,
    });
  };

  const handleSaveToHistory = () => {
    if (!prediction) return;
    savePrediction({
      title: `${formData.Property_Area} Loan - $${(formData.LoanAmount || 0) * 1000}`,
      inputs: formData,
      predictedStatus: prediction.predictedStatus,
      approvalProbability: prediction.approvalProbability,
      kUsed: prediction.k,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AuthGuard>
      <div className="space-y-8 py-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="glass-pill text-xs">
                <Zap size={12} className="text-yellow-400" /> Interactive Predictor
              </span>
              <span className="glass-pill text-xs">
                Fixed K = 7 Nearest Neighbors
              </span>
              <span className="glass-pill text-xs hidden sm:inline-flex">
                614 Training Cases
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-prominent-title mt-2">
              Loan Underwriting & Prediction Studio
            </h1>
            <p className="text-xs sm:text-sm text-prominent-sub mt-0.5">
              Input applicant parameters to calculate instantaneous credit risk using the optimized 7-neighbor KNN engine.
            </p>
          </div>
        </div>

        {/* PREDICTION WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Applicant Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
              {/* Presets Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-prominent-title">
                  Quick-Fill Archetypes:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        loadPreset(Number(e.target.value));
                      }
                    }}
                    defaultValue=""
                    className="glass-select text-xs py-1.5 px-3 w-auto"
                  >
                    <option value="" disabled>
                      Select Preset Archetype...
                    </option>
                    {PRESET_APPLICANTS.map((p, idx) => (
                      <option key={idx} value={idx}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {user && (
                    <button
                      onClick={loadUserProfile}
                      className="text-xs font-bold btn-glowing-secondary py-1.5 px-3"
                      title="Load your saved profile parameters"
                    >
                      Use My Saved Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Applicant Income */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Applicant Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    value={formData.ApplicantIncome ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        'ApplicantIncome',
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="e.g. 5800"
                    className="glass-input"
                  />
                </div>

                {/* Coapplicant Income */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Coapplicant Income ($)
                  </label>
                  <input
                    type="number"
                    value={formData.CoapplicantIncome ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        'CoapplicantIncome',
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="e.g. 1500"
                    className="glass-input"
                  />
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Loan Amount (in $1,000s)
                  </label>
                  <input
                    type="number"
                    value={formData.LoanAmount ?? ''}
                    onChange={(e) =>
                      handleInputChange(
                        'LoanAmount',
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="e.g. 140 (= $140,000)"
                    className="glass-input"
                  />
                </div>

                {/* Loan Amount Term */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Loan Term (Months)
                  </label>
                  <select
                    value={formData.Loan_Amount_Term ?? 360}
                    onChange={(e) =>
                      handleInputChange('Loan_Amount_Term', Number(e.target.value))
                    }
                    className="glass-select"
                  >
                    <option value={360}>360 Months (30 Years)</option>
                    <option value={180}>180 Months (15 Years)</option>
                    <option value={240}>240 Months (20 Years)</option>
                    <option value={120}>120 Months (10 Years)</option>
                  </select>
                </div>

                {/* Credit History */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Credit History Standing
                  </label>
                  <select
                    value={formData.Credit_History ?? 1}
                    onChange={(e) =>
                      handleInputChange('Credit_History', Number(e.target.value))
                    }
                    className="glass-select"
                  >
                    <option value={1}>1.0 - Meets Guidelines (Good)</option>
                    <option value={0}>0.0 - Delinquent / Default (Poor)</option>
                  </select>
                </div>

                {/* Property Area */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Property Location Area
                  </label>
                  <select
                    value={formData.Property_Area ?? 'Semiurban'}
                    onChange={(e) =>
                      handleInputChange('Property_Area', e.target.value)
                    }
                    className="glass-select"
                  >
                    <option value="Semiurban">Semiurban</option>
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Education Level
                  </label>
                  <select
                    value={formData.Education ?? 'Graduate'}
                    onChange={(e) =>
                      handleInputChange('Education', e.target.value)
                    }
                    className="glass-select"
                  >
                    <option value="Graduate">Graduate</option>
                    <option value="Not Graduate">Not Graduate</option>
                  </select>
                </div>

                {/* Self Employed */}
                <div>
                  <label className="text-xs font-bold text-prominent-title block mb-1">
                    Self-Employed Status
                  </label>
                  <select
                    value={formData.Self_Employed ?? 'No'}
                    onChange={(e) =>
                      handleInputChange('Self_Employed', e.target.value)
                    }
                    className="glass-select"
                  >
                    <option value="No">No (Salaried Employee)</option>
                    <option value="Yes">Yes (Business / Founder)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  onClick={runInference}
                  disabled={isCalculating}
                  className="btn-glowing flex-1 py-3.5 text-base"
                >
                  <Zap size={18} className={isCalculating ? 'animate-spin' : ''} />
                  <span>
                    {isCalculating
                      ? 'Computing Nearest 7 Neighbors...'
                      : 'Calculate KNN Prediction (K = 7)'}
                  </span>
                </button>

                <button
                  onClick={handleSaveToHistory}
                  className={`btn-glowing-secondary py-3.5 px-5 transition-all ${
                    savedSuccess ? 'border-emerald-400 text-emerald-400 font-bold' : ''
                  }`}
                  title="Save Scenario to Account History"
                >
                  <BookmarkPlus size={18} />
                  <span className="hidden sm:inline">
                    {savedSuccess ? 'Saved!' : 'Save Scenario'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Live Inference Results Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {prediction && (
              <div
                className={`glass-card p-6 sm:p-8 rounded-3xl space-y-6 transition-all duration-500 ${
                  prediction.predictedStatus === 'Y'
                    ? 'border-emerald-400/40 bg-emerald-950/20'
                    : 'border-red-400/40 bg-red-950/20'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-prominent-muted">
                    Model Classification
                  </span>
                  <span className="glass-pill text-xs">
                    K = 7 Nearest Neighbors
                  </span>
                </div>

                {/* Primary Decision Banner */}
                <div className="text-center py-2">
                  {prediction.predictedStatus === 'Y' ? (
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl font-extrabold shadow-lg">
                      <CheckCircle2 size={30} /> Approved
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 text-2xl font-extrabold shadow-lg">
                      <XCircle size={30} /> High Risk / Reject
                    </div>
                  )}

                  <p className="text-xs text-prominent-muted mt-2">
                    Predicted Outcome for Loan Application
                  </p>
                </div>

                {/* Probability Meter */}
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between text-xs font-bold text-prominent-title">
                    <span>Approval Confidence</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-sm">
                      {(prediction.approvalProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-700 bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{
                        width: `${prediction.approvalProbability * 100}%`,
                      }}
                    />
                    <div
                      className="h-full transition-all duration-700 bg-gradient-to-r from-red-500 to-rose-600"
                      style={{
                        width: `${prediction.rejectionProbability * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-prominent-muted pt-1">
                    <span>Approval: {(prediction.approvalProbability * 100).toFixed(0)}%</span>
                    <span>Rejection: {(prediction.rejectionProbability * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-prominent-title">
                    <Info size={14} className="text-cyan-400" />
                    <span>Inference Summary:</span>
                  </div>
                  <p className="text-xs text-prominent-sub leading-relaxed">
                    {prediction.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Full-Width Section: Nearest Neighbors Visualizer */}
          {prediction && (
            <div className="lg:col-span-12">
              <div className="glass-card p-6 sm:p-8 rounded-3xl">
                <KNNVisualizer
                  neighbors={prediction.neighbors}
                  k={7}
                  metric="euclidean"
                  weights="distance"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
