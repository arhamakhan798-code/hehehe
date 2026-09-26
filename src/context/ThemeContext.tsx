'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'cute' | 'rough';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  backgroundUrl: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('cute');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('knn_app_theme') as AppTheme;
    if (saved === 'cute' || saved === 'rough') {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('knn_app_theme', newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'cute' ? 'rough' : 'cute';
    setTheme(next);
  };

  const backgroundUrl =
    theme === 'cute'
      ? '/backgrounds/cute-theme.png'
      : '/backgrounds/rough-theme.png';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        backgroundUrl,
      }}
    >
      <div
        className={`theme-root ${theme}-theme min-h-screen transition-all duration-700`}
        data-theme={theme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
