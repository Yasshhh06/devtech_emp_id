"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ToastContainer } from '@/components/common/ToastContainer';
import { QRScannerModal } from '@/components/scanner/QRScannerModal';
import { CommandPalette } from '@/components/common/CommandPalette';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';
import { LayoutProvider, useLayoutContext } from '@/context/LayoutContext';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState<boolean>(false);

  const {
    isAddModalOpen, setIsAddModalOpen,
    isScannerOpen, setIsScannerOpen,
    isCommandPaletteOpen, setIsCommandPaletteOpen
  } = useLayoutContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-extrabold text-[#6B7280] tracking-wider uppercase">Loading DevTech ID SaaS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827] antialiased font-sans overflow-x-hidden">
      <Sidebar
        onOpenScanner={() => setIsScannerOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 px-2 sm:px-4 pb-4 pt-0">
        <Navbar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto pt-4 sm:pt-6 pb-12 px-1 sm:px-2">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export function ProtectedLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <LayoutInner>{children}</LayoutInner>
    </LayoutProvider>
  );
}
