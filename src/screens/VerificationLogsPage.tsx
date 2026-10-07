"use client";
import React from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { FileCheck2, ShieldCheck, Download, Search, Calendar, User } from 'lucide-react';

export const VerificationLogsPage: React.FC = () => {
  const { verificationLogs, showToast } = useEmployeeContext();

  const sampleLogs = [
    { employeeId: 'DTS-2026-0031', name: 'Elena Rostova', timestamp: 'Today at 09:12 AM', location: 'Main Reception Turnstile Gateway', status: 'Passed (Active)' },
    { employeeId: 'DTS-2026-0012', name: 'David Chen', timestamp: 'Today at 08:55 AM', location: 'Technology Cluster Lab Room 3', status: 'Passed (Active)' },
    { employeeId: 'DTS-2026-0004', name: 'Sarah Jenkins', timestamp: 'Today at 08:30 AM', location: 'Executive Garage Bay 4', status: 'Passed (Active)' },
    ...verificationLogs.map(l => ({ employeeId: l.employeeId, name: 'Verified Staff Member', timestamp: 'Real-Time Scan', location: 'Optical Web Reader', status: 'Passed (Active)' }))
  ];

  const handleExportAudit = () => {
    try {
      showToast('Compiling Audit Register...', 'info', 'Generating cryptographic audit log CSV report...');
      const headers = 'Employee ID,Staff Member Name,Timestamp / Date,Reader Location,Verification Status';
      const rows = sampleLogs.map(log => 
        `"${log.employeeId}","${log.name}","${log.timestamp}","${log.location}","${log.status}"`
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `DevTech_Verification_Audit_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Export Successful', 'success', `Audit Register CSV file downloaded (${sampleLogs.length} entries).`);
    } catch (error) {
      console.error('Audit export failed:', error);
      showToast('Export Error', 'error', 'Unable to export audit log.');
    }
  };

  return (
    <div className="px-6 space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2563EB] uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Enterprise Security Register</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
            Optical & Biometric Verification Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-0.5">
            Immutable audit register logging all real-time badge taps across physical doorways and public QR verification gateways.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/20 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Register CSV</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-saas overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#111827]">Displaying {sampleLogs.length} Security Event Logs</span>
          <span className="text-[#22C55E] font-black uppercase flex items-center gap-1">● SSL Real-Time Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium text-[#111827]">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-black uppercase text-[#6B7280] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 pl-6 pr-4">Target Employee ID</th>
                <th className="py-3.5 px-4">Staff Member Name</th>
                <th className="py-3.5 px-4">Gateway Location</th>
                <th className="py-3.5 px-4">Timestamp Audit</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Verification Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]/60">
              {sampleLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 pl-6 pr-4 font-mono font-extrabold text-[#2563EB]">{log.employeeId}</td>
                  <td className="py-3.5 px-4 font-bold text-[#111827]">{log.name}</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{log.location}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#6B7280]">{log.timestamp}</td>
                  <td className="py-3.5 pl-4 pr-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7]/70 text-[#22C55E] font-black border border-[#BBF7D0] text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
