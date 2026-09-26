'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isCute = theme === 'cute';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none"
      style={{
        background: 'var(--badge-bg)',
        border: '1px solid var(--glass-border-light)',
        backdropFilter: 'blur(14px)',
        cursor: 'pointer',
        boxShadow: isCute
          ? '0 2px 12px rgba(255, 51, 112, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.7)'
          : '0 2px 12px rgba(0, 242, 254, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
      }}
      title={`Switch to ${isCute ? 'Rough Marble ⚡' : 'Cute Dreamy 🌸'} Theme`}
      aria-label="Toggle theme"
    >
      {/* Animated icon circle */}
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300"
        style={{
          background: isCute
            ? 'linear-gradient(135deg, #ff3370, #c026d3)'
            : 'linear-gradient(135deg, #00f2fe, #3b82f6)',
          boxShadow: isCute
            ? '0 0 10px rgba(255, 51, 112, 0.6)'
            : '0 0 10px rgba(0, 242, 254, 0.6)',
        }}
      >
        {isCute ? (
          <Sparkles size={13} className="text-white" style={{ animation: 'spin 6s linear infinite' }} />
        ) : (
          <Moon size={13} className="text-white" />
        )}
      </span>

      <span
        className="text-xs font-extrabold tracking-wide hidden sm:block"
        style={{ color: 'var(--text-primary)' }}
      >
        {isCute ? 'Cute 🌸' : 'Rough ⚡'}
      </span>
    </button>
  );
}
