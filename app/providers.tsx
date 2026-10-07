"use client";

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { EmployeeProvider } from '@/context/EmployeeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmployeeProvider>
          {children}
        </EmployeeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
