"use client";
import React, { useState } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { Fortune500HorizontalCard } from '../components/cards/Fortune500HorizontalCard';
import { ScaledCardWrapper } from '../components/cards/ScaledCardWrapper';
import { Printer, CheckCircle2, Layers, ShieldCheck } from 'lucide-react';

export const PrintPage: React.FC = () => {
  const { employees, showToast } = useEmployeeContext();
  const [printSide, setPrintSide] = useState<'both' | 'front-only' | 'back-only'>('both');

  const handleTriggerPrint = () => {
    showToast('Sending formatted CR80 grid directly to local operating system printing service...', 'info');
    window.print();
  };

  return (
    <div className="px-6 space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none">
      
      {/* Non-Printable Header & Toolbar */}
      <div className="print:hidden p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2563EB] uppercase tracking-wider">
            <Printer className="w-4 h-4" />
            <span>Hardware Printer Integration</span>
          </div>
          <h1 className="text-2xl font-black text-[#111827] mt-1">
            Zebra PVC Duplex Print Grid
          </h1>
          <p className="text-xs text-[#6B7280] font-medium mt-0.5">
            Pre-calibrated in standard CR80 format (`85.6mm x 54.0mm`). Ready for thermal card printing or standard A4 sheet slicing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={printSide}
            onChange={(e: any) => setPrintSide(e.target.value)}
            className="saas-input w-44 !h-10 font-extrabold text-xs"
          >
            <option value="both">Duplex Front & Back</option>
            <option value="front-only">Side A (Front Only)</option>
            <option value="back-only">Side B (Reverse Only)</option>
          </select>

          <button
            onClick={handleTriggerPrint}
            className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet Now</span>
          </button>
        </div>
      </div>

      {/* Printable Grid Area */}
      <div className="bg-white p-8 rounded-[24px] border border-[#E5E7EB] shadow-saas space-y-8 print:border-0 print:p-0 print:shadow-none">
        <div className="print:hidden pb-4 border-b border-[#E5E7EB] flex items-center justify-between text-xs font-black text-[#111827]">
          <span>Previewing {employees.length} Active Staff Badges</span>
          <span className="text-[#22C55E] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> ISO/IEC 7810 CR80 Ready</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 print:grid-cols-2 print:gap-4 print:space-y-0">
          {employees.slice(0, 8).map((emp) => (
            <React.Fragment key={emp.id}>
              {(printSide === 'both' || printSide === 'front-only') && (
                <div className="w-full flex flex-col items-center justify-center p-5 border border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] overflow-hidden print:bg-white print:border-0 print:p-0 print:overflow-visible">
                  <span className="print:hidden text-[10px] font-mono font-bold text-[#94A3B8] mb-2">{emp.employeeId} • SIDE A (FRONT)</span>
                  <div className="w-full max-w-[450px] print:max-w-none shadow-saas rounded-[16px] print:shadow-none print:rounded-none">
                    <ScaledCardWrapper>
                      <Fortune500HorizontalCard employee={emp} isBack={false} />
                    </ScaledCardWrapper>
                  </div>
                </div>
              )}

              {(printSide === 'both' || printSide === 'back-only') && (
                <div className="w-full flex flex-col items-center justify-center p-5 border border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] overflow-hidden print:bg-white print:border-0 print:p-0 print:overflow-visible">
                  <span className="print:hidden text-[10px] font-mono font-bold text-[#94A3B8] mb-2">{emp.employeeId} • SIDE B (MAGNETIC)</span>
                  <div className="w-full max-w-[450px] print:max-w-none shadow-saas rounded-[16px] print:shadow-none print:rounded-none">
                    <ScaledCardWrapper>
                      <Fortune500HorizontalCard employee={emp} isBack={true} />
                    </ScaledCardWrapper>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
};
