"use client";
import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { Search, Building2, ShieldCheck, RefreshCw, Calendar, Users, GraduationCap, LayoutGrid } from 'lucide-react';

export type PersonnelFilterType = 'all' | 'employees' | 'interns';

interface EmployeeFiltersProps {
  personnelType: PersonnelFilterType;
  onPersonnelTypeChange: (type: PersonnelFilterType) => void;
  selectedJoiningYear: string;
  onJoiningYearChange: (year: string) => void;
  totalPersonnelCount?: number;
  employeesCount: number;
  internsCount: number;
  filteredCount?: number;
  availableYears: string[];
  availableDepartments: string[];
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  personnelType,
  onPersonnelTypeChange,
  selectedJoiningYear,
  onJoiningYearChange,
  totalPersonnelCount,
  employeesCount,
  internsCount,
  filteredCount,
  availableYears,
  availableDepartments,
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedDepartment, 
    setSelectedDepartment, 
    selectedStatus, 
    setSelectedStatus 
  } = useEmployeeContext();

  const statuses = ['All', 'Active', 'Inactive', 'Suspended', 'On Leave', 'Completed', 'Terminated', 'Resigned'];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    onPersonnelTypeChange('all');
    onJoiningYearChange('All');
  };

  const isFiltered = searchQuery !== '' || selectedDepartment !== 'All' || selectedStatus !== 'All' || personnelType !== 'all' || selectedJoiningYear !== 'All';
  const totalCount = totalPersonnelCount ?? (employeesCount + internsCount);

  return (
    <div className="p-3.5 sm:p-5 rounded-[16px] sm:rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
      
      {/* Top Controls: Personnel Type Segmented Tabs + Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]/60">
        
        {/* Personnel Section Segmented Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-black uppercase text-[#6B7280] tracking-wider">Directory Section:</span>
          <div className="inline-flex p-1 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <button
              onClick={() => onPersonnelTypeChange('all')}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-black transition-all flex items-center gap-1.5 ${
                personnelType === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs border border-[#E5E7EB]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gray-500" />
              All Directory ({totalCount})
            </button>
            <button
              onClick={() => onPersonnelTypeChange('employees')}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-black transition-all flex items-center gap-1.5 ${
                personnelType === 'employees'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Employees Section ({employeesCount})
            </button>
            <button
              onClick={() => onPersonnelTypeChange('interns')}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-black transition-all flex items-center gap-1.5 ${
                personnelType === 'interns'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Interns Section ({internsCount})
            </button>
          </div>
        </div>

        {/* Filtered Results Pill */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {filteredCount !== undefined && (
            <div className="px-3 py-1 rounded-[10px] bg-gray-100 border border-gray-200 text-gray-800 font-bold shadow-2xs">
              Showing: <span className="font-black text-blue-600">{filteredCount}</span> records
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workforce by Name, ID, Role, College..."
            className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-xs sm:text-sm text-[#111827] placeholder-[#94A3B8] font-medium focus:outline-hidden focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all duration-200 shadow-2xs"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6B7280] shrink-0" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#111827] focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Divisions</option>
              {availableDepartments.filter(d => d !== 'All').map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Chip Filter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB] shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#111827] focus:outline-hidden cursor-pointer w-full"
            >
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Joining Year Filter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#059669] shrink-0" />
            <select
              value={selectedJoiningYear}
              onChange={(e) => onJoiningYearChange(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#111827] focus:outline-hidden cursor-pointer w-full"
            >
              <option value="All">All Years</option>
              {availableYears.map((year, i) => (
                <option key={i} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 sm:py-2 rounded-[14px] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              title="Reset all search criteria"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
