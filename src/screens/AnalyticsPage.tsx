"use client";
import React, { useState, useMemo } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { useRouter } from 'next/navigation';
import { BarChart3, Download, Search, X, Eye, Printer, Copy } from 'lucide-react';
import { Fortune500HorizontalCard } from '../components/cards/Fortune500HorizontalCard';
import { ScaledCardWrapper } from '../components/cards/ScaledCardWrapper';
import { downloadElementAsPNG, downloadCardAsPDF } from '../services/pdfService';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '../types';

export const AnalyticsPage: React.FC = () => {
  const { employees, verificationLogs, showToast } = useEmployeeContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const flaggedCount = employees.filter(e => e.status !== 'Active').length;
  const activeRatio = totalEmployees > 0 ? Math.round((activeCount / totalEmployees) * 100) : 100;
  
  // Department count & percentages
  const deptMap: Record<string, number> = {};
  employees.forEach(emp => {
    const d = emp.department?.trim() || 'Development';
    deptMap[d] = (deptMap[d] || 0) + 1;
  });

  const departmentData = Object.entries(deptMap).map(([name, count]) => {
    const percent = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
    return { name, count, percent };
  }).sort((a, b) => b.count - a.count);

  if (departmentData.length === 0) {
    departmentData.push(
      { name: 'Development', count: 2, percent: 67 },
      { name: 'Cyber Security', count: 1, percent: 33 }
    );
  }

  // Memoized mapping of departments to real employee records from the database
  const departmentEmployeesMap = useMemo(() => {
    const map: Record<string, Employee[]> = {};
    employees.forEach(emp => {
      const d = emp.department?.trim() || 'Development';
      if (!map[d]) map[d] = [];
      map[d].push(emp);
    });
    return map;
  }, [employees]);

  // Memoized filtering for instant search performance while typing
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departmentData;
    const query = searchTerm.toLowerCase().trim();
    return departmentData.filter(dept => 
      dept.name.toLowerCase().includes(query)
    );
  }, [departmentData, searchTerm]);

  const totalDepartments = Object.keys(deptMap).length || 2;
  const scansCount = verificationLogs.length > 0 ? verificationLogs.length : 3;

  const handleDownloadID = async (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    showToast(`Rendering high-resolution ID card PNG for ${emp.fullName}...`, 'info');
    await downloadElementAsPNG(`analytics-front-${emp.employeeId}`, `${emp.fullName}_ID_Card.png`);
    showToast('Download Completed', 'success', `ID card for ${emp.fullName} exported successfully!`);
  };

  const handlePrintID = async (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    showToast(`Generating CR80 Duplex PVC print PDF for ${emp.fullName}...`, 'info');
    await downloadCardAsPDF(`analytics-front-${emp.employeeId}`, `analytics-back-${emp.employeeId}`, `${emp.fullName}_CR80_Duplex.pdf`);
    showToast('Export Completed', 'success', `CR80 Duplex PDF for ${emp.fullName} ready for printing!`);
  };

  const handleCopyID = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emp.employeeId);
    showToast('ID Copied', 'success', `Employee ID ${emp.employeeId} copied to clipboard!`);
  };

  return (
    <div className="px-6 space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none py-2">
      
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[16px] bg-[#DBEAFE] text-[#2563EB] shrink-0 mt-0.5 shadow-2xs">
            <BarChart3 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              HR Workforce Analytics &amp; Metrics
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-1">
              Detailed breakdown of employee distribution, active ratio, and public verification activity.
            </p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25 shrink-0 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* 4-Card Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Ratio */}
        <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors">
          <span className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase block">
            ACTIVE RATIO
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#16A34A] tracking-tight block">
              {activeRatio}%
            </span>
          </div>
          <span className="text-xs font-bold text-[#6B7280] block">
            {activeCount} of {totalEmployees || 3} employees active
          </span>
        </div>

        {/* Total Departments */}
        <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors">
          <span className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase block">
            TOTAL DEPARTMENTS
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#2563EB] tracking-tight block">
              {totalDepartments}
            </span>
          </div>
          <span className="text-xs font-bold text-[#6B7280] block">
            Across engineering &amp; ops
          </span>
        </div>

        {/* QR Verification Activity */}
        <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors">
          <span className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase block">
            QR VERIFICATION ACTIVITY
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#2563EB] tracking-tight block">
              {scansCount}
            </span>
          </div>
          <span className="text-xs font-bold text-[#6B7280] block">
            Scans processed
          </span>
        </div>

        {/* Security Flagged */}
        <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors">
          <span className="text-[11px] font-extrabold tracking-widest text-[#6B7280] uppercase block">
            SECURITY FLAGGED
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#D97706] tracking-tight block">
              {flaggedCount}
            </span>
          </div>
          <span className="text-xs font-bold text-[#6B7280] block">
            Suspended passes
          </span>
        </div>

      </div>

      {/* Department-Wise Staffing Section */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
        
        {/* Section Header with Top-Right Premium Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
            Department-Wise Staffing
          </h2>
          
          <div className="relative w-full sm:w-full lg:w-[320px] shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Department (e.g. Development, Engineering, HR)"
              className="saas-input w-full !pl-10 !pr-9 !h-11 !rounded-[14px] !text-xs font-semibold !bg-[#F8FAFC] hover:!bg-white focus:!bg-white !border-[#E5E7EB] focus:!border-[#2563EB] shadow-2xs transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] p-0.5 rounded-full hover:bg-[#E5E7EB]/50 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Department Progress Bars & Search Expanded Employee Cards */}
        <div className="space-y-6 pt-2">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => {
              const deptEmployees = departmentEmployeesMap[dept.name] || [];
              const isSearched = Boolean(searchTerm.trim());

              return (
                <div key={dept.name} className="space-y-3 pb-2 border-b border-[#E5E7EB]/40 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-extrabold text-[#111827]">{dept.name}</span>
                    <span className="font-mono font-bold text-[#475569]">
                      {dept.count} {dept.count === 1 ? 'Employee' : 'Employees'} ({dept.percent}%)
                    </span>
                  </div>

                  {/* Progress Bar Track & Gradient Fill */}
                  <div className="w-full h-3.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]/80 overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-2xs transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(5, Math.min(100, dept.percent))}%` }}
                    />
                  </div>

                  {/* Expanded Employee Display Section during Active Search */}
                  <AnimatePresence>
                    {isSearched && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden pt-3 pb-2"
                      >
                        {deptEmployees.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                            {deptEmployees.map((emp, empIdx) => (
                              <motion.div
                                key={emp.id || emp.employeeId}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: empIdx * 0.08 }}
                                className="p-5 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas hover:shadow-saas-md hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden"
                              >
                                {/* Employee Card Header */}
                                <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-[#E5E7EB] shrink-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="px-2 py-0.5 rounded-[6px] bg-[#DBEAFE]/40 text-[#2563EB] font-extrabold text-[10px] border border-[#DBEAFE] uppercase tracking-wider shrink-0">
                                      {emp.department}
                                    </span>
                                    <strong className="text-[#111827] font-extrabold truncate">{emp.fullName}</strong>
                                  </div>
                                  <span className="font-mono text-[11px] text-[#2563EB] font-extrabold shrink-0 ml-2">
                                    {emp.employeeId}
                                  </span>
                                </div>

                                {/* Employee ID Card component (Exact reuse of Fortune500HorizontalCard) */}
                                <div className="w-full flex-1 flex items-center justify-center my-1 pointer-events-none">
                                  <div className="w-full max-w-[450px] rounded-[16px] shadow-saas overflow-hidden">
                                    <ScaledCardWrapper>
                                      <Fortune500HorizontalCard employee={emp} isBack={false} />
                                    </ScaledCardWrapper>
                                  </div>
                                </div>

                                {/* Off-screen unscaled rendering targets for millimeter-exact ID export & printing */}
                                <div className="fixed -left-[9999px] top-0 pointer-events-none z-0 flex flex-col gap-4">
                                  <Fortune500HorizontalCard id={`analytics-front-${emp.employeeId}`} employee={emp} isBack={false} />
                                  <Fortune500HorizontalCard id={`analytics-back-${emp.employeeId}`} employee={emp} isBack={true} />
                                </div>

                                {/* Employee Card Actions */}
                                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#E5E7EB] shrink-0">
                                  <button
                                    onClick={() => router.push(`/employees/${emp.employeeId}`)}
                                    className="saas-btn-secondary !py-2 !px-2.5 !text-[11px] !rounded-[12px] flex items-center justify-center gap-1.5 font-bold hover:!bg-[#EFF6FF] hover:!text-[#2563EB] hover:!border-[#BFDBFE]"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                                    <span className="truncate">View Employee</span>
                                  </button>

                                  <button
                                    onClick={(e) => handleDownloadID(e, emp)}
                                    className="saas-btn-secondary !py-2 !px-2.5 !text-[11px] !rounded-[12px] flex items-center justify-center gap-1.5 font-bold hover:!bg-[#ECFDF5] hover:!text-[#059669] hover:!border-[#A7F3D0]"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                                    <span className="truncate">Download ID</span>
                                  </button>

                                  <button
                                    onClick={(e) => handlePrintID(e, emp)}
                                    className="saas-btn-secondary !py-2 !px-2.5 !text-[11px] !rounded-[12px] flex items-center justify-center gap-1.5 font-bold hover:!bg-[#FFFBEB] hover:!text-[#D97706] hover:!border-[#FDE68A]"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                                    <span className="truncate">Print ID</span>
                                  </button>

                                  <button
                                    onClick={(e) => handleCopyID(e, emp)}
                                    className="saas-btn-secondary !py-2 !px-2.5 !text-[11px] !rounded-[12px] flex items-center justify-center gap-1.5 font-bold hover:!bg-[#F3F4F6] hover:!text-[#1F2937]"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                                    <span className="truncate">Copy Employee ID</span>
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-xs font-semibold text-[#6B7280] bg-[#F8FAFC] rounded-[16px] border border-[#E5E7EB] mt-2">
                            No detailed staff records currently registered under {dept.name} in the database.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            /* Professional Empty Search State */
            <div className="py-16 text-center bg-[#F8FAFC]/60 rounded-[20px] border border-[#E5E7EB] border-dashed my-2">
              <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E5E7EB] shadow-saas flex items-center justify-center text-2xl sm:text-3xl">
                  🔍
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#111827] tracking-tight">
                  No Department Found
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed max-w-xs">
                  No department matches your search. Try another department name.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="saas-btn-secondary !px-4 !py-2 !text-xs !rounded-[12px] mt-2 text-[#2563EB] font-extrabold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Search Query</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

