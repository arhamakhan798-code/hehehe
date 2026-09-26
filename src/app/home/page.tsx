'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, AuthGuard } from '../../context/AuthContext';
import {
  Sparkles,
  Zap,
  BookOpen,
  Users,
  ArrowRight,
  Calculator,
  UserCheck,
  BookmarkPlus,
  Layers,
} from 'lucide-react';
import { PRESET_APPLICANTS } from '../../lib/loanData';
import UserAvatar from '../../components/UserAvatar';

export default function HomePage() {
  const { user } = useAuth();

  const guideSteps = [
    {
      step: '01',
      title: 'Review or Customize Profile',
      desc: 'Visit the Account page to alter your default monthly income, coapplicant income, loan amounts, and credit history.',
      icon: UserCheck,
      link: '/account',
      linkText: 'Open Account Settings',
    },
    {
      step: '02',
      title: 'Configure Loan Inputs',
      desc: 'In the Predictor, input the requested loan amount, loan term, credit standing, property area, and employment details.',
      icon: Calculator,
      link: '/predict',
      linkText: 'Go to Predictor',
    },
    {
      step: '03',
      title: 'Inspect Nearest Neighbors',
      desc: 'Click "Calculate KNN Prediction" to view the predicted outcome, approval confidence, and inspect the 7 most similar historical borrowers.',
      icon: Users,
      link: '/predict',
      linkText: 'Run Prediction',
    },
    {
      step: '04',
      title: 'Save & Compare Scenarios',
      desc: 'Save your customized scenarios to your account history to track credit profiles, review approval trends, and compare loan requests.',
      icon: BookmarkPlus,
      link: '/account',
      linkText: 'View Saved History',
    },
  ];

  return (
    <AuthGuard>
      <div className="space-y-10 py-6">
        {/* WELCOME BANNER */}
        <section className="glass-card p-7 sm:p-10 rounded-3xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-bold text-prominent-title">
              <Sparkles size={14} className="text-yellow-400" />
              <span>LoanKNN Platform Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border border-white/40 flex-shrink-0"
                style={{ background: 'var(--glass-bg)' }}
              >
                <UserAvatar avatar={user?.avatar} size="lg" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-prominent-title tracking-tight leading-tight">
                  Welcome back,{' '}
                  <span className="heading-gradient">
                    {user ? user.name.split(' ')[0] : 'Underwriter'}
                  </span>{' '}
                  👋
                </h1>
              </div>
            </div>

            <p className="text-sm sm:text-base text-prominent-sub leading-relaxed font-medium">
              You have active access to the K-Nearest Neighbors Credit Risk Platform. Follow our step-by-step guide below to evaluate loan applications, test borrower profiles, and inspect historical underwriting matches with the optimized 7-neighbor engine.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/predict" className="btn-glowing px-6 py-3 no-underline">
                <Zap size={16} />
                <span>Launch Prediction Studio</span>
              </Link>
              <Link href="/account" className="btn-glowing-secondary px-6 py-3 no-underline">
                <UserCheck size={16} />
                <span>Manage Profile & Scenarios</span>
              </Link>
            </div>
          </div>
        </section>

        {/* STEP-BY-STEP USER GUIDE */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-prominent-title flex items-center gap-2">
                <BookOpen size={22} className="text-purple-400" />
                How to Use This Website
              </h2>
              <p className="text-xs text-prominent-muted">
                Follow these simple steps to run credit evaluations and manage your portfolio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guideSteps.map((g, idx) => {
              const Icon = g.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-3xl space-y-4 glass-card-interactive flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-2xl font-extrabold heading-gradient">
                        {g.step}
                      </span>
                      <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-prominent-title">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-base font-extrabold text-prominent-title">
                      {g.title}
                    </h3>
                    <p className="text-xs text-prominent-sub leading-relaxed mt-2">
                      {g.desc}
                    </p>
                  </div>

                  <Link
                    href={g.link}
                    className="text-xs font-bold btn-glowing-secondary py-2 px-3.5 no-underline self-start flex items-center gap-1.5 mt-2"
                  >
                    <span>{g.linkText}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRESET BORROWER ARCHETYPES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-prominent-title flex items-center gap-2">
                <Layers size={22} className="text-cyan-400" />
                Quick-Test Borrower Archetypes
              </h2>
              <p className="text-xs text-prominent-muted">
                Select a pre-configured applicant profile to instantly test in the predictor
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRESET_APPLICANTS.map((preset, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl space-y-4 glass-card-interactive flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-extrabold text-prominent-title">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-prominent-sub mt-1.5 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs p-3 rounded-2xl bg-white/5 border border-white/10 my-1">
                  <div>
                    <span className="text-[10px] text-prominent-muted block">Income:</span>
                    <strong className="text-prominent-title font-mono">${preset.data.ApplicantIncome?.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-prominent-muted block">Loan Req:</span>
                    <strong className="text-prominent-title font-mono">${(preset.data.LoanAmount || 0) * 1000}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-prominent-muted block">Credit:</span>
                    <strong className="text-prominent-title">{Number(preset.data.Credit_History) === 1 ? 'Good (1.0)' : 'Delinquent (0.0)'}</strong>
                  </div>
                </div>

                <Link
                  href="/predict"
                  className="btn-glowing text-xs py-2.5 px-4 text-center no-underline flex items-center justify-center gap-2"
                >
                  <Zap size={14} />
                  <span>Test this Profile in Predictor</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
