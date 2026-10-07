"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmployeeContext } from '../context/EmployeeContext';
import { InteractiveBadgePreview } from '../components/cards/InteractiveBadgePreview';
import { InternInteractiveBadgePreview } from '../components/cards/InternInteractiveBadgePreview';
import { InternHorizontalCard } from '../components/cards/InternHorizontalCard';
import { Fortune500HorizontalCard } from '../components/cards/Fortune500HorizontalCard';
import { EnterpriseDocumentManager } from '../components/documents/EnterpriseDocumentManager';
import { downloadCardAsPDF } from '../services/pdfService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Award,
  CreditCard,
  User,
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

type TabType = 'Overview' | 'Documents' | 'Certificates' | 'Badge';

export const EmployeeProfilePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employees, interns, showToast } = useEmployeeContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [isExportingBadge, setIsExportingBadge] = useState(false);
  const empFound = employees.find(e => e.employeeId === employeeId || e.id === employeeId);
  const internFound = !empFound ? (interns || []).find(i => (i.internId === employeeId || i.internCode === employeeId || i.id === employeeId)) : null;

  const employee = empFound || (internFound ? ({
    ...internFound,
    employeeId: internFound.internId || internFound.internCode || 'DTS-INT-0001',
    companyEmail: internFound.email || 'intern@devtech.com',
    dateOfJoining: internFound.startDate || 'Aug 2026',
    designation: internFound.role || 'Software Engineering Intern',
    department: internFound.department || 'Development',
    isIntern: true,
    rawIntern: internFound
  } as any) : null);

  if (!employee) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-[24px] border border-[#E5E7EB] shadow-saas">
        <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto font-black">
          !
        </div>
        <h3 className="text-lg font-black text-[#111827]">Workforce Record Not Found</h3>
        <p className="text-xs text-[#6B7280]">The ID code you are searching for is not registered in the DevTech IT Solution database.</p>
        <button onClick={() => router.push('/employees')} className="saas-btn-primary !w-full">Return to Directory</button>
      </div>
    );
  }

  const isInt = Boolean(employee.isIntern);
  const emailStr = employee.companyEmail || (employee as any).email || 'employee@devtech.com';
  const joiningStr = employee.dateOfJoining || (employee as any).joiningDate || 'January 14, 2026';
  const verificationUrl = isInt ? `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-intern/${employee.employeeId}` : `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${employee.employeeId}`;

  const headerId = employee.employeeId || employee.id || 'DTS-001';
  const headerFrontId = `header-pvc-front-${headerId}`;
  const headerBackId = `header-pvc-back-${headerId}`;

  const handleDownloadBadge = async () => {
    setIsExportingBadge(true);
    showToast(`Generating CR80 Duplex PVC PDF for ${employee.fullName}...`, 'info');
    const filename = `${employee.fullName || 'Employee'}_CR80_Duplex_Badge.pdf`;
    await downloadCardAsPDF(headerFrontId, headerBackId, filename);
    setIsExportingBadge(false);
    showToast(`Duplex PVC Badge PDF downloaded successfully!`, 'success');
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'Overview', label: 'Overview', icon: User },
    { id: 'Badge', label: 'Badge Studio', icon: CreditCard },
    { id: 'Documents', label: 'Documents', icon: FileText },
    { id: 'Certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="px-2 sm:px-6 space-y-4 sm:space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none">
      {/* Hidden render nodes for top header badge download */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -100, opacity: 0.01, pointerEvents: 'none', width: '450px', height: '1px', overflow: 'hidden' }}>
        {isInt ? (
          <>
            <InternHorizontalCard id={headerFrontId} intern={employee.rawIntern || employee} isBack={false} />
            <InternHorizontalCard id={headerBackId} intern={employee.rawIntern || employee} isBack={true} />
          </>
        ) : (
          <>
            <Fortune500HorizontalCard id={headerFrontId} employee={employee} isBack={false} />
            <Fortune500HorizontalCard id={headerBackId} employee={employee} isBack={true} />
          </>
        )}
      </div>

      <div>
        <button
          onClick={() => router.push('/employees')}
          className={`text-xs font-extrabold text-[#6B7280] transition-colors flex items-center gap-1.5 ${
            isInt ? 'hover:text-[#059669]' : 'hover:text-[#2563EB]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </button>
      </div>

      {/* Top Banner Hero */}
      <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] shadow-saas overflow-hidden">
        <div className={`h-24 sm:h-32 px-4 sm:px-8 pt-4 sm:pt-6 flex items-start justify-end relative ${
          isInt
            ? 'bg-gradient-to-r from-[#DCFCE7]/90 via-[#D1FAE5]/60 to-white'
            : 'bg-gradient-to-r from-[#DBEAFE]/80 via-[#E0F2FE]/50 to-white'
        }`}>
          <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] font-black text-[10px] sm:text-xs uppercase flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span>Status: {employee.status || 'Active'}</span>
          </span>
        </div>

        <div className="px-4 sm:px-8 pb-6 sm:pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
            <img
              src={employee.photo}
              alt={employee.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] object-cover border-4 border-white shadow-saas-md shrink-0 bg-white"
            />
            <div className="space-y-2 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">{employee.fullName}</h1>
                <span className={`px-3 py-1 rounded-[10px] font-mono text-xs font-black border uppercase shadow-2xs ${
                  isInt
                    ? 'bg-[#DCFCE7] text-[#059669] border-[#BBF7D0]'
                    : 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20'
                }`}>
                  {employee.employeeId}
                </span>
                {employee.bloodGroup && (
                  <span className={`px-2.5 py-1 rounded-[10px] text-white text-xs font-extrabold shadow-xs ${
                    isInt ? 'bg-[#059669]' : 'bg-[#2563EB]'
                  }`}>
                    Blood Tag: {employee.bloodGroup}
                  </span>
                )}
              </div>
              <div className={`flex flex-wrap items-center gap-2 text-sm font-bold ${
                isInt ? 'text-[#059669]' : 'text-[#2563EB]'
              }`}>
                <span>{employee.designation}</span>
                {employee.employmentType && !isInt && (
                  <>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[11px] bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2 py-0.5 rounded-md font-extrabold uppercase">
                      {employee.employmentType}
                    </span>
                  </>
                )}
                {isInt && (
                  <>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[11px] bg-[#DCFCE7] text-[#059669] border border-[#BBF7D0] px-2 py-0.5 rounded-md font-extrabold uppercase">
                      Internship Credential
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#6B7280] font-semibold flex flex-wrap items-center gap-2 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>{employee.department} Division</span>
                </span>
                <span className="text-[#94A3B8]">•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>{emailStr}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 xl:pb-1">
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs hover:border-[#CBD5E1] transition-colors">
              <QRCodeSVG value={verificationUrl} size={48} fgColor="#111827" bgColor="transparent" />
              <div className="text-left">
                <span className="text-[10px] font-mono font-extrabold uppercase text-[#94A3B8] block">Live QR Preview</span>
                <button
                  onClick={() => window.open(verificationUrl, '_blank')}
                  className={`text-xs font-black hover:underline flex items-center gap-1 mt-0.5 ${
                    isInt ? 'text-[#059669]' : 'text-[#2563EB]'
                  }`}
                >
                  <span>Public Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={handleDownloadBadge}
              disabled={isExportingBadge}
              className={`saas-btn-primary !py-3.5 !px-6 !rounded-[16px] flex items-center gap-2.5 font-black text-xs uppercase tracking-wide shrink-0 ${
                isInt ? '!bg-[#059669] hover:!bg-[#047857] shadow-md shadow-[#059669]/25' : 'shadow-md shadow-[#2563EB]/25'
              } ${isExportingBadge ? 'opacity-75 cursor-wait' : ''}`}
            >
              <Download className="w-4 h-4" />
              <span>{isExportingBadge ? 'Generating PDF...' : 'Download Badge'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB] select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs sm:text-sm font-extrabold transition-all shrink-0 ${
                isActive
                  ? isInt ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">

        {activeTab === 'Overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-5">
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider pb-3 border-b border-[#E5E7EB]">
                {isInt ? 'Internship Mentorship & Training Assignment' : 'Executive Employment Hierarchy & Assignment'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">
                    {isInt ? 'Full Candidate Name' : 'Full Employee Name'}
                  </span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">{employee.fullName}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">Assigned Division</span>
                  <strong className={`text-sm font-extrabold mt-0.5 block ${isInt ? 'text-[#059669]' : 'text-[#2563EB]'}`}>
                    {employee.department} {isInt ? 'Division' : 'HQ'}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">
                    {isInt ? 'Internship Role' : 'Designation Role'}
                  </span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">{employee.designation}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">
                    {isInt ? 'Tenure & Duration' : 'Official Onboarding Cycle'}
                  </span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">
                    {isInt ? `${employee.rawIntern?.duration || '6 Months'} (${employee.rawIntern?.startDate || joiningStr} - ${employee.rawIntern?.endDate || 'Jan 2027'})` : joiningStr}
                  </strong>
                </div>
              </div>
              <div className={`p-4 rounded-[16px] border text-xs font-medium leading-relaxed mt-4 ${
                isInt ? 'bg-[#DCFCE7]/30 border-[#BBF7D0] text-[#065F46]' : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#6B7280]'
              }`}>
                {isInt
                  ? 'This candidate holds active training access rights to DevTech IT Solution learning laboratories, development clusters, and mentorship programs.'
                  : 'This employee holds active physical access rights to DevTech IT Solution headquarters, technology server clusters, and biometric turnstiles.'}
              </div>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider pb-3 border-b border-[#E5E7EB]">
                Contact & Security Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                  <span className="text-[#6B7280]">Work Email:</span>
                  <span className="font-bold text-[#111827] truncate pl-2">{emailStr}</span>
                </div>
                {isInt ? (
                  <>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                      <span className="text-[#6B7280]">College / Univ:</span>
                      <span className="font-bold text-[#111827] truncate pl-2">{employee.rawIntern?.college || 'IIT Bombay'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                      <span className="text-[#6B7280]">Assigned Mentor:</span>
                      <span className="font-bold text-[#059669] truncate pl-2">{employee.rawIntern?.mentorName || 'Yash Sunil Mohite'}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                    <span className="text-[#6B7280]">Work Phone:</span>
                    <span className="font-bold text-[#111827]">{employee.phone || '+1 (555) 389-9800'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#6B7280]">Security Clearance:</span>
                  <span className="font-extrabold text-[#22C55E]">{isInt ? 'Tier 1 Trainee Access' : 'Tier 3 Master'}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('Badge')}
                className={`saas-btn-secondary !w-full text-center ${isInt ? '!text-[#059669] hover:!bg-[#DCFCE7]/40 hover:!border-[#BBF7D0]' : ''}`}
              >
                Launch Smart Badge Studio
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'Badge' && (
          <motion.div key="badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {employee.isIntern ? (
              <InternInteractiveBadgePreview intern={employee.rawIntern} />
            ) : (
              <InteractiveBadgePreview employee={employee} />
            )}
          </motion.div>
        )}

        {activeTab === 'Documents' && (
          <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <EnterpriseDocumentManager tabMode="Documents" employee={employee} />
          </motion.div>
        )}

        {activeTab === 'Certificates' && (
          <motion.div key="cert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <EnterpriseDocumentManager tabMode="Certificates" employee={employee} />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
