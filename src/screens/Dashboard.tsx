"use client";
import React, { useState, useEffect } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { useEmployeeContext } from '../context/EmployeeContext';
import { exportEmployeesToCSV } from '../services/excelService';
import {
  UserPlus,
  CreditCard,
  QrCode,
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
}

const getISTGreeting = (): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find(part => part.type === 'hour');
    const hour = hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
    const istHour = hour % 24;

    if (istHour >= 5 && istHour < 12) {
      return 'Good Morning';
    } else if (istHour >= 12 && istHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  } catch {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ onOpenAddModal, onOpenScanner }) => {
  const { employees, showToast } = useEmployeeContext();
  const router = useRouter();
  const [greeting, setGreeting] = useState<string>(getISTGreeting);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentGreeting = getISTGreeting();
      setGreeting(prev => (prev !== currentGreeting ? currentGreeting : prev));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleExportData = () => {
    try {
      showToast('Generating Data Export...', 'info', 'Compiling full workforce database & analytics report...');
      const dateStr = new Date().toISOString().split('T')[0];
      exportEmployeesToCSV(employees, `DevTech_Workforce_Data_${dateStr}.csv`);
      showToast('Export Completed Successfully', 'success', `Workforce data for ${employees.length} employee records downloaded as CSV.`);
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export Failed', 'error', 'Unable to generate export file at this time.');
    }
  };

  return (
    <div className="px-2 sm:px-6 space-y-4 sm:space-y-8 animate-fadeIn max-w-[1600px] mx-auto">

      {/* Dashboard Welcome Hero */}
      <div className="p-4 sm:p-8 rounded-[18px] sm:rounded-[24px] bg-gradient-to-r from-[#DBEAFE]/70 via-white to-[#E0F2FE]/50 border border-[#E5E7EB] shadow-saas-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2.5 relative z-10 max-w-2xl">

          <h1 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            {greeting}, HR Executive
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
            Welcome back to DevTech IT Solution. Here are today's authoritative workforce insights, smart badge issuance queues, and real-time employee verification overviews.
          </p>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={onOpenAddModal}
            className="saas-btn-primary !px-4 !py-2.5 !text-xs !rounded-[14px] shadow-md shadow-[#2563EB]/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>

          <button
            onClick={() => router.push('/generate-cards')}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px]"
          >
            <CreditCard className="w-4 h-4 text-[#2563EB]" />
            <span>Generate Badge</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px]"
          >
            <QrCode className="w-4 h-4 text-[#0EA5E9]" />
            <span>Verify QR</span>
          </button>

          <button
            onClick={handleExportData}
            className="saas-btn-secondary !px-3.5 !py-2.5 !text-xs !rounded-[14px] text-[#6B7280]"
            title="Export workforce Data"
          >
            <Download className="w-4 h-4 text-[#6B7280]" />
            <span className="hidden xl:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* 20px Pastel Metric Statistic Cards Grid */}
      <StatCards />

      {/* Widgets: Recent Hires, Birthdays & Live Scans */}
      <RecentActivity onOpenAddModal={onOpenAddModal} onOpenScanner={onOpenScanner} />

    </div>
  );
};
