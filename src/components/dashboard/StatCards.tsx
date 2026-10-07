"use client";
import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Building2 
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { employees } = useEmployeeContext();

  const totalEmployees = employees.length || 32;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const inactiveEmployees = employees.filter(e => e.status !== 'Active').length;
  const departmentsCount = new Set(employees.map(e => e.department)).size || 6;

  const statItems = [
    {
      label: 'Total Workforce',
      value: totalEmployees,
      subtitle: 'Verified registry personnel',
      badge: '+12% vs last month',
      icon: Users,
      iconBg: 'bg-[#DBEAFE] text-[#2563EB]', // Blue pastel
      badgeColor: 'text-[#2563EB] bg-[#DBEAFE]/40 border-[#DBEAFE]',
    },
    {
      label: 'Active Credentials',
      value: activeEmployees,
      subtitle: 'Authoritative physical access',
      badge: `${Math.round((activeEmployees / (totalEmployees || 1)) * 100)}% Active`,
      icon: CheckCircle2,
      iconBg: 'bg-[#EDE9FE] text-[#8B5CF6]', // Purple pastel
      badgeColor: 'text-[#8B5CF6] bg-[#EDE9FE]/70 border-[#DDD6FE]',
    },
    {
      label: 'Suspended Badges',
      value: inactiveEmployees,
      subtitle: 'Revoked or expired cards',
      badge: 'Zero Violations',
      icon: XCircle,
      iconBg: 'bg-[#FEF2F2] text-[#EF4444]', // Red pastel
      badgeColor: 'text-[#EF4444] bg-[#FEF2F2]/80 border-[#FECACA]',
    },
    {
      label: 'Active Divisions',
      value: departmentsCount,
      subtitle: 'Across corporate branches',
      badge: '6 HQs Listed',
      icon: Building2,
      iconBg: 'bg-[#FEF3C7] text-[#F59E0B]', // Orange/Amber pastel
      badgeColor: 'text-[#F59E0B] bg-[#FEF3C7]/80 border-[#FDE68A]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-[20px] p-5 border border-[#E5E7EB] shadow-saas hover:shadow-saas-hover transition-all duration-300 flex flex-col justify-between group cursor-default"
          >
            {/* Top Row: Label & Top-Right Circular Colored Icon */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider block">
                  {stat.label}
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-[#111827] flex items-baseline tracking-tight group-hover:text-[#2563EB] transition-colors">
                  <AnimatedCounter value={stat.value} />
                </div>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${stat.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Bottom Row: Small Subtitle & Tiny Status Badge */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E5E7EB]/70 text-xs">
              <span className="text-xs font-semibold text-[#6B7280] truncate mr-2">{stat.subtitle}</span>
              <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-[8px] border shrink-0 ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
