"use client";
import React, { useState, useRef } from 'react';
import { Fortune500HorizontalCard } from './Fortune500HorizontalCard';
import { ScaledCardWrapper } from './ScaledCardWrapper';
import { downloadElementAsPNG, downloadCardAsPDF, triggerPrint } from '../../services/pdfService';
import { useEmployeeContext } from '../../context/EmployeeContext';
import {
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Share2,
  CreditCard,
  Layers,
  Check
} from 'lucide-react';

interface InteractiveBadgePreviewProps {
  employee: any;
}

export const InteractiveBadgePreview: React.FC<InteractiveBadgePreviewProps> = ({ employee }) => {
  const { showToast } = useEmployeeContext();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeLayout, setActiveLayout] = useState<'horizontal' | 'duplex-grid'>('horizontal');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const frontId = `pvc-front-${employee.employeeId}`;
  const backId = `pvc-back-${employee.employeeId}`;

  const handleExportPNG = async () => {
    setIsExporting(true);
    showToast(`Rendering 300 DPI high-resolution PNG for ${employee.fullName}...`, 'info');
    await downloadElementAsPNG(frontId, `${employee.fullName}_ID_Badge.png`);
    setIsExporting(false);
    showToast(`PNG export completed successfully.`, 'success');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    showToast(`Generating CR80 Duplex PVC PDF for thermal printing...`, 'info');
    await downloadCardAsPDF(frontId, backId, `${employee.fullName}_CR80_Duplex.pdf`);
    setIsExporting(false);
    showToast(`Duplex PVC PDF ready for immediate card printing.`, 'success');
  };

  const handleShareLink = () => {
    const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${employee.employeeId}`;
    navigator.clipboard.writeText(verificationUrl);
    showToast(`Public verification URL copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-6">

      {/* Studio Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#DBEAFE] text-[#2563EB] font-black flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#111827]">Microsoft & Google Minimal PVC Studio</h3>
            <p className="text-xs text-[#6B7280] font-medium">Standard CR80 horizontal dual-side physical access badge.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsFlipped(prev => !prev)}
            className="saas-btn-secondary !py-2 !px-3.5 !text-xs !rounded-[12px] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{isFlipped ? 'Show Front Side' : 'Flip to Reverse'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className="saas-btn-secondary !py-2 !px-3.5 !text-xs !rounded-[12px] flex items-center gap-1.5 text-[#2563EB]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy QR Link</span>
          </button>

          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="saas-btn-secondary !py-2 !px-3.5 !text-xs !rounded-[12px] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="saas-btn-primary !py-2 !px-4 !text-xs !rounded-[12px] shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export CR80 Duplex PDF</span>
          </button>
        </div>
      </div>

      {/* PVC Card Render Workspace */}
      <div className="p-8 rounded-[24px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-saas flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">

        <div className="absolute top-4 left-6 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          <span>Viewing: {isFlipped ? 'Reverse Magnetic Side (Side B)' : 'Primary Optical Credential (Side A)'}</span>
        </div>

        {/* Hidden render nodes for PDF export of both sides simultaneously */}
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -100, opacity: 0.01, pointerEvents: 'none', width: '450px', height: '1px', overflow: 'hidden' }}>
          <Fortune500HorizontalCard id={frontId} employee={employee} isBack={false} />
          <Fortune500HorizontalCard id={backId} employee={employee} isBack={true} />
        </div>

        {/* Visible Live Studio Render */}
        <div
          onClick={() => setIsFlipped(prev => !prev)}
          className="mt-6 w-full max-w-[450px] cursor-pointer hover:scale-[1.01] transition-transform duration-300 shadow-saas hover:shadow-saas-hover rounded-[16px] overflow-hidden"
          title="Click card to flip side"
        >
          <ScaledCardWrapper>
            <Fortune500HorizontalCard employee={employee} isBack={isFlipped} />
          </ScaledCardWrapper>
        </div>

        <p className="mt-6 text-xs font-extrabold text-[#6B7280] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
          <span>Click physical badge to flip between front cryptographic details and reverse magnetic stripe.</span>
        </p>
      </div>

    </div>
  );
};
