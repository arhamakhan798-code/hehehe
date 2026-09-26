'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ShieldCheck, Heart, Github, Cpu, Database, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 mt-20">
      <div
        className="glass-card p-8 rounded-3xl"
        style={{
          border: '1px solid var(--glass-border)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/15">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  background: 'var(--accent-gradient)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12), 0 0 12px rgba(255, 51, 112, 0.4)',
                }}
              >
                <Bot size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-prominent-title">
                Loan<span className="heading-gradient">KNN</span> Prediction System
              </span>
            </div>
            <p className="text-sm text-prominent-sub max-w-md leading-relaxed">
              State-of-the-art Non-Parametric K-Nearest Neighbors inference engine for automated credit underwriting, applicant profiling, and transparent neighbor explainability.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="glass-pill text-xs">
                <Cpu size={12} /> Standardized Z-Score
              </span>
              <span className="glass-pill text-xs">
                <Database size={12} /> 614 Training Samples
              </span>
              <span className="glass-pill text-xs">
                <Activity size={12} /> 83.7% Validation Accuracy
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-sm text-prominent-title uppercase tracking-wider mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-sm text-prominent-sub">
              <li>
                <Link href="/" className="hover:text-prominent-title transition-colors no-underline">
                  Overview & Benchmark
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-prominent-title transition-colors no-underline">
                  User Guide & Intuition
                </Link>
              </li>
              <li>
                <Link href="/predict" className="hover:text-prominent-title transition-colors no-underline">
                  Interactive KNN Predictor
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-prominent-title transition-colors no-underline">
                  Personal Financial Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: ML Model Pipeline */}
          <div>
            <h4 className="font-bold text-sm text-prominent-title uppercase tracking-wider mb-3">
              ML Hyperparameters
            </h4>
            <ul className="space-y-2 text-xs text-prominent-muted">
              <li><strong className="text-prominent-sub">Algorithm:</strong> Scikit-Learn KNN Pipeline</li>
              <li><strong className="text-prominent-sub">Tuned Best K:</strong> 5 Neighbors</li>
              <li><strong className="text-prominent-sub">Distance Metric:</strong> Minkowski (p=1, p=2)</li>
              <li><strong className="text-prominent-sub">Weighting:</strong> Distance Inverse / Uniform</li>
              <li><strong className="text-prominent-sub">Validation Split:</strong> 80:20 Stratified Split</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-prominent-muted">
          <div className="flex items-center gap-2">
            <span>© 2026 LoanKNN AI Engine. Sleek Glassmorphic Experience.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-prominent-sub">
              Crafted with sleek glowing aesthetics & glassmorphism
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
