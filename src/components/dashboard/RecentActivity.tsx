"use client";
import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface RecentActivityProps {
  onOpenAddModal?: () => void;
  onOpenScanner?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ onOpenAddModal, onOpenScanner }) => {
  const { employees, verificationLogs } = useEmployeeContext();
  const router = useRouter();

  const recentEmployees = [...employees].reverse().slice(0, 5);

  const upcomingBirthdays = [
    { name: 'Sarah Jenkins', date: 'Aug 4', dept: 'Engineering', age: 29, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { name: 'David Chen', date: 'Aug 11', dept: 'Operations', age: 34, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Elena Rostova', date: 'Aug 19', dept: 'Design Studio', age: 27, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  ];

  const recentVerifications = verificationLogs.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Widget 1: Recent Hires & IDs */}
      <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:shadow-saas-md transition-all duration-300">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-extrabold">
                <UserPlus className="w-4 h-4" />
              </span>
              <h3 className="font-black text-[#111827] text-sm">Recent Hires & IDs</h3>
            </div>
            <button 
              onClick={() => router.push('/employees')} 
              className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#E5E7EB]/60 mt-3">
            {recentEmployees.map(emp => (
              <div 
                key={emp.id}
                onClick={() => router.push(`/employees/${emp.employeeId}`)}
                className="py-3 flex items-center justify-between hover:bg-[#F8FAFC] px-2 rounded-[14px] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={emp.photo} alt={emp.fullName} className="w-9 h-9 rounded-[12px] object-cover border border-[#E5E7EB] shadow-xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                      {emp.fullName}
                    </p>
                    <span className="text-[11px] text-[#94A3B8] font-mono font-semibold">{emp.employeeId}</span>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DCFCE7]/70 text-[#22C55E] font-black border border-[#BBF7D0] shrink-0">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="saas-btn-secondary !w-full text-center"
        >
          + Launch Onboarding Studio
        </button>
      </div>

      {/* Widget 2: Upcoming Birthdays */}
      <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:shadow-saas-md transition-all duration-300">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center font-extrabold">
                <Calendar className="w-4 h-4" />
              </span>
              <h3 className="font-black text-[#111827] text-sm">Upcoming Birthdays</h3>
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B] border border-[#FDE68A]">
              August 2026
            </span>
          </div>

          <div className="divide-y divide-[#E5E7EB]/60 mt-3">
            {upcomingBirthdays.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.photo} alt={item.name} className="w-9 h-9 rounded-[12px] object-cover border border-[#E5E7EB] shadow-xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#111827] truncate">{item.name}</p>
                    <span className="text-[11px] text-[#6B7280] font-semibold">{item.dept}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-[12px] bg-[#F59E0B] text-white text-[11px] font-extrabold shadow-2xs block">
                    🎂 {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-[14px] bg-[#FEF3C7]/40 border border-[#FDE68A] text-center text-[11px] text-[#D97706] font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Automated birthday e-badges active
        </div>
      </div>

      {/* Widget 3: Live Verification Logs */}
      <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:shadow-saas-md transition-all duration-300">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#06B6D4] flex items-center justify-center font-extrabold">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="font-black text-[#111827] text-sm">Recent Verifications</h3>
            </div>
            <button 
              onClick={() => router.push('/verification-logs')} 
              className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center gap-0.5"
            >
              <span>Audit Logs</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {recentVerifications.length > 0 ? recentVerifications.map((log, idx) => (
              <div key={idx} className="p-3 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-xs flex items-center justify-between gap-2 transition-all">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                    <strong className="text-[#111827] font-mono font-extrabold truncate">{log.employeeId}</strong>
                  </div>
                  <p className="text-[11px] text-[#6B7280] font-medium mt-0.5 truncate">Verified via optical QR gateway</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] shrink-0">Live</span>
              </div>
            )) : (
              <div className="py-8 text-center text-xs text-[#94A3B8] font-medium">
                No optical scans logged yet today.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onOpenScanner}
          className="saas-btn-primary !w-full text-center flex items-center justify-center gap-2 shadow-md shadow-[#2563EB]/20"
        >
          <Lock className="w-4 h-4" />
          <span>Launch Optical Scanner</span>
        </button>
      </div>
    </div>
  );
};
