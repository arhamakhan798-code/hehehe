'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoanRecord } from '../lib/knnEngine';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  education: 'Graduate' | 'Not Graduate';
  gender: 'Male' | 'Female' | 'Other';
  married: 'Yes' | 'No';
  dependents: string;
  selfEmployed: 'Yes' | 'No';
  monthlyIncome: number;
  coapplicantIncome: number;
  creditHistory: number;
  preferredPropertyArea: 'Urban' | 'Semiurban' | 'Rural';
  defaultLoanAmount: number;
  defaultLoanTerm: number;
  bio: string;
  joinedDate: string;
}

export interface SavedPrediction {
  id: string;
  timestamp: string;
  title: string;
  inputs: LoanRecord;
  predictedStatus: 'Y' | 'N';
  approvalProbability: number;
  kUsed: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  savedPredictions: SavedPrediction[];
  savePrediction: (prediction: Omit<SavedPrediction, 'id' | 'timestamp'>) => void;
  deletePrediction: (id: string) => void;
  clearHistory: () => void;
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr-9042',
  name: 'Alex Morgan',
  email: 'alex.morgan@financeai.io',
  avatar: '👩‍💼',
  education: 'Graduate',
  gender: 'Female',
  married: 'Yes',
  dependents: '1',
  selfEmployed: 'No',
  monthlyIncome: 6200,
  coapplicantIncome: 2400,
  creditHistory: 1,
  preferredPropertyArea: 'Semiurban',
  defaultLoanAmount: 180,
  defaultLoanTerm: 360,
  bio: 'Senior Mortgage & Real Estate Risk Analyst.',
  joinedDate: 'August 2026',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication in localStorage
    const authStatus = localStorage.getItem('knn_is_authenticated');
    const savedUser = localStorage.getItem('knn_user_profile');

    if (authStatus === 'true' && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        setUser(DEFAULT_USER);
        setIsAuthenticated(false);
      }
    } else {
      setUser(savedUser ? JSON.parse(savedUser) : DEFAULT_USER);
      setIsAuthenticated(false);
    }

    const savedHistory = localStorage.getItem('knn_saved_predictions');
    if (savedHistory) {
      try {
        setSavedPredictions(JSON.parse(savedHistory));
      } catch (e) {
        setSavedPredictions([]);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email?: string, name?: string) => {
    const updated: UserProfile = {
      ...(user || DEFAULT_USER),
      email: email || (user ? user.email : DEFAULT_USER.email),
      name: name || (user ? user.name : DEFAULT_USER.name),
    };
    setUser(updated);
    setIsAuthenticated(true);
    localStorage.setItem('knn_user_profile', JSON.stringify(updated));
    localStorage.setItem('knn_is_authenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('knn_is_authenticated', 'false');
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedData };
    setUser(nextUser);
    localStorage.setItem('knn_user_profile', JSON.stringify(nextUser));
  };

  const savePrediction = (pred: Omit<SavedPrediction, 'id' | 'timestamp'>) => {
    const newEntry: SavedPrediction = {
      ...pred,
      id: 'pred-' + Date.now(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const updatedList = [newEntry, ...savedPredictions];
    setSavedPredictions(updatedList);
    localStorage.setItem('knn_saved_predictions', JSON.stringify(updatedList));
  };

  const deletePrediction = (id: string) => {
    const updatedList = savedPredictions.filter((p) => p.id !== id);
    setSavedPredictions(updatedList);
    localStorage.setItem('knn_saved_predictions', JSON.stringify(updatedList));
  };

  const clearHistory = () => {
    setSavedPredictions([]);
    localStorage.setItem('knn_saved_predictions', JSON.stringify([]));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        savedPredictions,
        savePrediction,
        deletePrediction,
        clearHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Component to guard protected routes from unauthenticated access
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 rounded-3xl text-center space-y-3 max-w-sm">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-prominent-title">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
