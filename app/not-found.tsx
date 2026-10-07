"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  QrCode,
  CreditCard,
  FileCheck2,
  ArrowLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  KeyRound
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/employees?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/employees');
    }
  };

  const quickLinks = [
    {
      title: 'Dashboard Overview',
      description: 'View real-time system metrics, analytics & personnel status.',
      icon: LayoutDashboard,
      href: '/dashboard',
      badge: 'Main Hub',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600'
    },
    {
      title: 'Workforce Directory',
      description: 'Browse, search, and manage full employee & intern records.',
      icon: Users,
      href: '/employees',
      badge: 'Personnel',
      color: 'from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-600'
    },
    {
      title: 'Public ID Scanner',
      description: 'Verify employee credentials and scan QR badges instantly.',
      icon: QrCode,
      href: '/verify',
      badge: 'Verifier',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600'
    },
    {
      title: 'PVC Badge Generator',
      description: 'Issue & print Fortune 500 CR80 duplex physical ID cards.',
      icon: CreditCard,
      href: '/generate-cards',
      badge: 'Badge Studio',
      color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20 text-purple-600'
    },
    {
      title: 'Verification Logs',
      description: 'Audit live scan history, security status, and optical logs.',
      icon: FileCheck2,
      href: '/verification-logs',
      badge: 'Audit Logs',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600'
    },
    {
      title: 'System Access Portal',
      description: 'Sign into HR Admin or Super Admin administrative tools.',
      icon: KeyRound,
      href: '/login',
      badge: 'Authentication',
      color: 'from-slate-500/10 to-zinc-500/10 border-slate-500/20 text-slate-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between selection:bg-[#2563EB] selection:text-white relative overflow-hidden font-sans">
      {/* Background Tech Glow Orbs & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#0EA5E9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
              DevTech <span className="text-[#3B82F6]">IT Solution</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">
              Smart Employee ID Suite
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Systems Operational
          </span>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/60 transition-all hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* 404 Glowing Badge */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl animate-pulse" />
          <div className="relative px-6 py-3 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-[#3B82F6] flex items-center gap-3 shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-6 h-6 text-blue-400 animate-bounce" />
            <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              404
            </span>
            <span className="h-6 w-px bg-slate-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Resource Not Found
            </span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-2xl leading-tight">
          Oops! The page you were looking for could not be found.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-8 leading-relaxed font-medium">
          The requested URL or credential route doesn't exist on the DevTech IT Solution server. 
          Please check the link for typos, or use the quick portal links below.
        </p>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mb-12 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3B82F6] transition-colors pointer-events-none">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search employee by name, ID (e.g. DTS-0001) or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-28 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/20 backdrop-blur-sm transition-all shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Quick Links Grid */}
        <div className="w-full text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Available System Hubs</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="group relative p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${link.color} border`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {link.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {link.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {link.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>DevTech IT Solutions © {new Date().getFullYear()} — Enterprise ID Card System</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/employees" className="hover:text-white transition-colors">Employees</Link>
          <Link href="/verify" className="hover:text-white transition-colors">Public Verifier</Link>
        </div>
      </footer>
    </div>
  );
}
