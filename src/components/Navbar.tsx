'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';
import {
  Compass,
  Zap,
  User,
  LogIn,
  Home,
  Menu,
  X,
  Bot,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = isAuthenticated
    ? [
        { name: 'Overview', href: '/', icon: Compass },
        { name: 'Guide', href: '/home', icon: Home },
        { name: 'Predictor', href: '/predict', icon: Zap },
        { name: 'Account', href: '/account', icon: User },
      ]
    : [
        { name: 'Overview', href: '/', icon: Compass },
        { name: 'Guide', href: '/home', icon: Home },
      ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <nav
        className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{
          borderRadius: '24px',
          boxShadow: scrolled
            ? 'var(--glass-shadow), 0 0 0 1.5px var(--glass-border-light)'
            : 'var(--glass-shadow)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105"
            style={{
              background: 'var(--accent-gradient)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12), 0 0 12px rgba(255, 51, 112, 0.4)',
            }}
          >
            <Bot size={22} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span
                className="font-extrabold text-lg tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Loan<span className="heading-gradient">KNN</span>
              </span>
              <span className="glass-pill text-[10px] px-2 py-0.5 font-bold" style={{ borderRadius: '8px' }}>
                AI
              </span>
            </div>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              Credit Risk Studio
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl"
          style={{
            background: 'var(--badge-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 no-underline ${
                  isActive ? 'btn-glowing text-white shadow-md' : ''
                }`}
                style={
                  !isActive
                    ? {
                        color: 'var(--text-secondary)',
                      }
                    : {}
                }
              >
                <Icon size={15} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl no-underline transition-all hover:scale-105"
                style={{
                  background: 'var(--badge-bg)',
                  border: '1px solid var(--glass-border-light)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <UserAvatar avatar={user.avatar} size="sm" className="rounded-xl" />
                <div className="hidden sm:block">
                  <p
                    className="text-xs font-extrabold leading-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    My Profile
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="btn-glowing text-xs py-2 px-4 no-underline">
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl transition-all cursor-pointer"
            style={{
              background: 'var(--badge-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden mt-2 p-3 glass-card rounded-2xl flex flex-col gap-1.5 animate-fadeIn"
          style={{ borderRadius: '20px' }}
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold no-underline transition-all ${
                  isActive ? 'btn-glowing' : ''
                }`}
                style={
                  !isActive
                    ? { color: 'var(--text-secondary)' }
                    : {}
                }
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {!isAuthenticated ? (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-glowing text-center text-sm py-3 mt-1 no-underline flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>Sign In / Register</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="text-center text-sm py-2.5 mt-1 text-red-400 font-bold flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
