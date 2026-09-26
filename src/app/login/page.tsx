'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  LogIn,
  Bot,
  Lock,
  Mail,
  User,
  ArrowRight,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

function LoginForm() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/home';

  const [tab, setTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('alex.morgan@financeai.io');
  const [name, setName] = useState('Alex Morgan');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Optional: don't auto-redirect if they explicitly visit login, but let them continue
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, name);
      setLoading(false);
      router.push(redirectUrl);
    }, 400);
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    setLoading(true);
    setTimeout(() => {
      login(demoEmail, demoName);
      setLoading(false);
      router.push(redirectUrl);
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="glass-card p-7 sm:p-9 rounded-3xl space-y-6 relative overflow-hidden">
        {/* Brand Icon Header */}
        <div className="text-center space-y-2">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center font-bold text-white shadow-xl"
            style={{
              background: 'var(--accent-gradient)',
              boxShadow: 'var(--accent-glow)',
            }}
          >
            <Bot size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-prominent-title">
            {tab === 'signin'
              ? 'Sign in to LoanKNN'
              : tab === 'signup'
              ? 'Create New Account'
              : 'Quick Demo Personas'}
          </h1>
          <p className="text-xs text-prominent-muted">
            Authentication is required to access the Prediction Studio and Account tools.
          </p>
        </div>

        {/* If Already Logged In Banner */}
        {isAuthenticated && user && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 size={16} />
              <span>Signed In as {user.name}</span>
            </div>
            <p className="text-[11px] text-prominent-sub">
              You already have active access to all tools.
            </p>
            <Link
              href={redirectUrl}
              className="btn-glowing text-xs py-2 px-4 inline-flex no-underline w-full justify-center"
            >
              <span>Continue to Platform</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signin'
                ? 'btn-glowing'
                : 'text-prominent-sub hover:text-prominent-title'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'btn-glowing'
                : 'text-prominent-sub hover:text-prominent-title'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setTab('demo')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'demo'
                ? 'btn-glowing'
                : 'text-prominent-sub hover:text-prominent-title'
            }`}
          >
            ⚡ Demo (1-Click)
          </button>
        </div>

        {/* TAB: SIGN IN & SIGN UP FORM */}
        {tab !== 'demo' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="text-xs font-bold text-prominent-title block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-prominent-muted"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="glass-input pl-10 text-xs py-2.5"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-prominent-title block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-prominent-muted"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="glass-input pl-10 text-xs py-2.5"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-prominent-title mb-1">
                <span>Password</span>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-prominent-muted"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="glass-input pl-10 text-xs py-2.5"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-glowing w-full py-3 text-sm"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* TAB: DEMO PERSONAS */
          <div className="space-y-3">
            <p className="text-xs text-prominent-muted text-center mb-1">
              Select an archetype to instantly authenticate and test:
            </p>

            <button
              onClick={() =>
                handleDemoLogin(
                  'Alex Morgan (Senior Underwriter)',
                  'alex.morgan@financeai.io'
                )
              }
              className="w-full p-3.5 rounded-2xl glass-card text-left transition-all hover:scale-[1.02] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👩‍💼</span>
                <div>
                  <h4 className="text-xs font-extrabold text-prominent-title">
                    Alex Morgan
                  </h4>
                  <p className="text-[11px] text-prominent-muted">
                    Senior Underwriter • Complete Model Access
                  </p>
                </div>
              </div>
              <Zap size={16} className="text-yellow-400" />
            </button>

            <button
              onClick={() =>
                handleDemoLogin(
                  'Jordan Vance (Risk Quant)',
                  'jordan.vance@bankcorp.com'
                )
              }
              className="w-full p-3.5 rounded-2xl glass-card text-left transition-all hover:scale-[1.02] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍💻</span>
                <div>
                  <h4 className="text-xs font-extrabold text-prominent-title">
                    Jordan Vance
                  </h4>
                  <p className="text-[11px] text-prominent-muted">
                    Risk & Portfolio Quant • Hyperparameter Tuning
                  </p>
                </div>
              </div>
              <Zap size={16} className="text-cyan-400" />
            </button>

            <button
              onClick={() =>
                handleDemoLogin(
                  'Elena Rostova (Borrower)',
                  'elena.rostova@techco.io'
                )
              }
              className="w-full p-3.5 rounded-2xl glass-card text-left transition-all hover:scale-[1.02] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <h4 className="text-xs font-extrabold text-prominent-title">
                    Elena Rostova
                  </h4>
                  <p className="text-[11px] text-prominent-muted">
                    First-Time Loan Applicant • Prime Score
                  </p>
                </div>
              </div>
              <Zap size={16} className="text-pink-400" />
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 text-center text-xs text-prominent-muted">
          <p>Local simulated authentication • Data persists in browser storage.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-10 px-4 text-center">
          <div className="glass-card p-8 rounded-3xl">
            <div className="animate-pulse space-y-4">
              <div className="w-12 h-12 rounded-2xl mx-auto bg-white/20" />
              <div className="h-4 w-32 mx-auto rounded bg-white/20" />
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
