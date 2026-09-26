'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Database,
  Users,
  LogIn,
  Layers,
} from 'lucide-react';
import ConfusionMatrixChart from '../components/ConfusionMatrixChart';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 py-8 sm:py-14">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-white/40 text-xs font-extrabold uppercase tracking-widest text-prominent-title shadow-lg">
          <Sparkles size={14} className="text-yellow-400 animate-pulse" />
          <span>Intelligent Loan Underwriting AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-prominent-title leading-[1.15]">
          Precision Loan Approvals with{' '}
          <span className="heading-gradient">7-Neighbor Explainability</span>
        </h1>

        {/* Concise, Professional Description */}
        <p className="text-base sm:text-lg text-prominent-sub max-w-2xl mx-auto leading-relaxed font-medium">
          Evaluate borrower creditworthiness instantaneously using an optimized K-Nearest Neighbors AI (K = 7). Explore historical borrower clustering, test custom financial parameters, and make confident credit decisions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          {isAuthenticated ? (
            <Link
              href="/predict"
              className="btn-glowing text-base px-8 py-4 no-underline group"
            >
              <span>Enter Prediction Studio</span>
              <Zap size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn-glowing text-base px-8 py-4 no-underline group"
            >
              <span>Sign In to Access Studio</span>
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          <Link
            href="/home"
            className="btn-glowing-secondary text-base px-7 py-4 no-underline"
          >
            <span>Platform User Guide</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-bold text-prominent-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Instant Risk Scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            <span>614 Real Training Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-purple-500" />
            <span>Top-7 Historical Neighbors</span>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM FEATURES (3 CLEAN CARDS) */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-prominent-title">
            Key Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-prominent-muted max-w-lg mx-auto">
            Everything you need to predict, understand, and manage loan risk scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-7 rounded-3xl space-y-4 glass-card-interactive">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <Users size={22} />
            </div>
            <h3 className="text-lg font-extrabold text-prominent-title">
              Top-7 Neighbor Explainability
            </h3>
            <p className="text-xs sm:text-sm text-prominent-sub leading-relaxed">
              Transparent inference revealing the exact 7 closest matching historical borrowers, similarity scores, and their actual repayment outcomes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-7 rounded-3xl space-y-4 glass-card-interactive">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)' }}
            >
              <Cpu size={22} />
            </div>
            <h3 className="text-lg font-extrabold text-prominent-title">
              Standardized Z-Score Engine
            </h3>
            <p className="text-xs sm:text-sm text-prominent-sub leading-relaxed">
              Mathematically standardized features and one-hot encodings ensure income and loan amounts are evaluated with balanced Euclidean weighting.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-7 rounded-3xl space-y-4 glass-card-interactive">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
            >
              <Layers size={22} />
            </div>
            <h3 className="text-lg font-extrabold text-prominent-title">
              Scenario History Management
            </h3>
            <p className="text-xs sm:text-sm text-prominent-sub leading-relaxed">
              Save customized applicant parameters to your account history to track approval trends and compare borrower profiles over time.
            </p>
          </div>
        </div>
      </section>

      {/* ML MODEL BENCHMARK & VALIDATION SECTION */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-bold text-prominent-title">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Empirical Validation & Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-prominent-title">
            Model Performance & Confusion Matrix
          </h2>
          <p className="text-xs sm:text-sm text-prominent-muted max-w-xl mx-auto">
            Scikit-Learn K-Nearest Neighbors validation results evaluated across stratified historical loan records.
          </p>
        </div>

        <ConfusionMatrixChart />
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-3xl mx-auto text-center pb-6">
        <div className="glass-card p-8 sm:p-12 rounded-3xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-prominent-title">
            Ready to Begin?
          </h2>
          <p className="text-xs sm:text-sm text-prominent-sub max-w-md mx-auto">
            Sign in to start calculating loan predictions, adjusting your applicant profile, and saving custom underwriting runs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={isAuthenticated ? '/predict' : '/login'}
              className="btn-glowing px-8 py-3.5 no-underline"
            >
              <span>{isAuthenticated ? 'Launch Prediction Studio' : 'Sign In / Get Started'}</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/home" className="btn-glowing-secondary px-6 py-3.5 no-underline">
              <span>View User Guide</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
