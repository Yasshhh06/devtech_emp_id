"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  QrCode,
  FolderOpen,
  FileCheck2,
  User,
  Sparkles,
  ChevronRight,
  Shield,
  Building2,
  GraduationCap,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmployeeContext } from '../../context/EmployeeContext';

interface SidebarProps {
  onOpenScanner?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenScanner, isMobileOpen = false, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { employees, interns, verificationLogs } = useEmployeeContext();
  const router = useRouter();
  const pathname = usePathname();
  const isSuperAdmin = user?.role === 'superadmin' || user?.email?.toLowerCase().includes('admin');

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const navGroups = [
    {
      title: 'Workforce Platform',
      items: [
        { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Employee Section', path: '/employees', icon: Users, badge: employees.length || 0 },
        { label: 'Intern Section', path: '/interns', icon: GraduationCap, badge: (interns || []).length || 0 },
      ]
    },
    {
      title: 'Badging & Printing',
      items: [
        { label: 'Batch ID Card Studio', path: '/generate-cards', icon: CreditCard },
        { label: 'Verification Logs', path: '/verification-logs', icon: FileCheck2, badge: verificationLogs.length || 0 },
      ]
    },
    {
      title: 'Administration & Database',
      items: [
        { label: 'Firebase DB & Settings', path: '/settings', icon: Settings },
        { label: 'Admin Profile', path: '/profile', icon: User },
      ]
    }
  ];

  const renderContent = (isMobileView: boolean = false) => (
    <>
      {/* Brand Header */}
      <div className="w-full flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-white rounded-t-[20px] select-none">
        <img
          src="/sidebar-logo.png"
          alt="DevTech IT Solution"
          loading="eager"
          decoding="async"
          className="h-10 w-auto object-contain drop-shadow-sm select-none"
        />
        {isMobileView && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F8FAFC] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Group items */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-6 pb-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h3 className="px-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <Link
                  key={idx}
                  href={item.path}
                  onClick={() => {
                    if (isMobileView && onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition-all duration-200 ${isActive
                    ? 'bg-[#DBEAFE]/40 text-[#2563EB] shadow-xs font-extrabold border border-[#2563EB]/10'
                    : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#2563EB]' : 'bg-transparent'} transition-colors -ml-1`}></span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && (
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold ${isActive ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Quick Optical Scanner Box */}
        <div className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-2.5">
          <div className="flex items-center gap-2 text-[#111827] font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
            <span>Cryptographic Scan</span>
          </div>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Verify employee & intern badges in real-time via camera reader or scanner.
          </p>
          <button
            onClick={() => {
              if (onOpenScanner) onOpenScanner();
              if (isMobileView && onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 rounded-[12px] bg-[#111827] hover:bg-[#1E293B] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
          >
            <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Launch Verifier</span>
          </button>
        </div>
      </div>

      {/* User Profile Container at Bottom */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] rounded-b-[20px] space-y-3">
        <div
          onClick={() => {
            router.push('/profile');
            if (isMobileView && onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 px-2 py-1.5 rounded-[14px] hover:bg-white cursor-pointer transition-all border border-transparent hover:border-[#E5E7EB]"
        >
          <div className={`w-9 h-9 rounded-[12px] ${isSuperAdmin ? 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#2563EB]' : 'bg-[#059669]/15 border-[#059669]/30 text-[#059669]'} border font-black flex items-center justify-center text-xs shrink-0`}>
            {isSuperAdmin ? 'SA' : 'HR'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-[#111827] truncate leading-tight">
              {isSuperAdmin ? 'Super Admin' : 'HR Admin'}
            </p>
            <span className="text-[10px] text-[#22C55E] font-extrabold flex items-center justify-start gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Active Session
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] bg-white hover:bg-[#FEF2F2] text-[#6B7280] hover:text-[#EF4444] border border-[#E5E7EB] hover:border-[#FECACA] text-xs font-bold transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#94A3B8] group-hover:text-[#EF4444] transition-colors" />
            <span>Sign Out Session</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white text-[#6B7280] flex-col justify-between rounded-[20px] border border-[#E5E7EB] shadow-saas shrink-0 sticky top-4 h-[calc(100vh-2rem)] m-4 mr-0 transition-all select-none z-30">
        {renderContent(false)}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <aside className="relative w-72 max-w-[85vw] bg-white text-[#6B7280] flex flex-col justify-between h-full shadow-2xl z-10 overflow-hidden animate-fadeIn">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
