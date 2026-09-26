'use client';

import React from 'react';
import { NearestNeighborInfo } from '../lib/knnEngine';
import { CheckCircle2, XCircle, User, DollarSign, Shield, Home, Sparkles } from 'lucide-react';

interface Props {
  neighbors: NearestNeighborInfo[];
  k: number;
  metric: string;
  weights: string;
}

export default function KNNVisualizer({ neighbors, k, metric, weights }: Props) {
  if (!neighbors || neighbors.length === 0) return null;

  const maxDist = Math.max(...neighbors.map((n) => n.distance), 0.001);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="font-extrabold text-lg text-prominent-title flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-400" />
            Top {k} Nearest Historical Neighbors
          </h3>
          <p className="text-xs text-prominent-muted">
            Inspecting the closest matching profiles from the training dataset
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="glass-pill text-xs">
            Metric: <strong>{metric}</strong>
          </span>
          <span className="glass-pill text-xs">
            Weighting: <strong>{weights}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {neighbors.map((item, idx) => {
          const isApproved = item.status === 'Y';
          const similarityScore = Math.max(0, 100 - (item.distance / (maxDist * 1.5)) * 100);

          return (
            <div
              key={idx}
              className={`glass-card p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-l-4 ${
                isApproved ? 'border-l-emerald-400' : 'border-l-rose-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold bg-white/20 text-prominent-title">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-prominent-title">
                    ID: {item.record.Loan_ID || `REC-${item.index + 1}`}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 size={12} /> Approved
                    </>
                  ) : (
                    <>
                      <XCircle size={12} /> Rejected
                    </>
                  )}
                </span>
              </div>

              {/* Similarity & Distance Bar */}
              <div className="space-y-1 my-2.5">
                <div className="flex justify-between text-[11px] font-semibold text-prominent-sub">
                  <span>Similarity Index</span>
                  <span className="font-mono">{similarityScore.toFixed(1)}% (dist: {item.distance.toFixed(3)})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${similarityScore}%`,
                      background: isApproved
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                    }}
                  />
                </div>
              </div>

              {/* Neighbor Key Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-prominent-sub">
                <div className="flex items-center gap-1.5 truncate">
                  <DollarSign size={12} className="text-emerald-400 shrink-0" />
                  <span>
                    Income: <strong>${item.record.ApplicantIncome?.toLocaleString() || 0}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <DollarSign size={12} className="text-blue-400 shrink-0" />
                  <span>
                    Loan: <strong>${(item.record.LoanAmount || 0) * 1000}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Shield size={12} className="text-purple-400 shrink-0" />
                  <span>
                    Credit: <strong>{Number(item.record.Credit_History) === 1 ? 'Good (1)' : 'Poor (0)'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Home size={12} className="text-amber-400 shrink-0" />
                  <span>
                    Area: <strong>{item.record.Property_Area || 'Urban'}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
