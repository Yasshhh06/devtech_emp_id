"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'superadmin' | 'hr' | string;
  username?: string;
  recoveryEmail?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  department?: string;
  designation?: string;
  joinedDate?: string;
  aboutText?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isHRAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AdminUser>) => void;
  isFirebaseMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLocalSession = () => {
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('devtech_demo_user');
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo));
        } catch {
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLocalSession();
  }, []);

  const performLocalLogin = (inputEmailOrUser: string, pass: string) => {
    const cleanInput = inputEmailOrUser.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isTargetUser = 
      cleanInput === 'yasshhh' || 
      cleanInput === 'yasshhh@devtech.com' || 
      cleanInput === 'yashm@gmail.com' ||
      cleanInput === 'yash' ||
      cleanInput === 'admin' ||
      cleanInput === 'admin@devtech.com' ||
      cleanInput === 'admin@devtechitsolution.com';

    // Allow user credentials: Yasshhh / DevTech@#2004 or legacy passwords
    const isValidPass = 
      cleanPass === 'DevTech@#2004' || 
      cleanPass === 'Yash@#06' || 
      cleanPass === 'admin123' ||
      cleanPass === 'hr123456';

    if (!isValidPass && isTargetUser) {
      throw new Error('Invalid credentials or password. Please use password: DevTech@#2004');
    }

    const mockUser: AdminUser = {
      uid: `user_${Date.now()}`,
      email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@devtechitsolution.com`,
      username: 'Yasshhh',
      displayName: 'Yasshhh (Super Administrator)',
      role: 'superadmin',
    };

    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('devtech_demo_user', JSON.stringify(mockUser));
    }
  };

  const login = async (email: string, pass: string) => {
    const emailClean = email.trim();
    const passClean = pass.trim();

    if (!emailClean || !passClean) {
      throw new Error('Please enter both username/email and password.');
    }

    performLocalLogin(emailClean, passClean);
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devtech_demo_user');
    }
    setUser(null);
  };

  const updateUser = (updates: Partial<AdminUser>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('devtech_demo_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: Boolean(user),
        isSuperAdmin: user?.role === 'superadmin',
        isHRAdmin: user?.role === 'hr',
        login,
        logout,
        updateUser,
        isFirebaseMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
