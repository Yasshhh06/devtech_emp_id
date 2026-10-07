"use client";
import React, { useState } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { Fortune500HorizontalCard } from '../components/cards/Fortune500HorizontalCard';
import { InternHorizontalCard } from '../components/cards/InternHorizontalCard';
import { ScaledCardWrapper } from '../components/cards/ScaledCardWrapper';
import { generatePDFFromElements } from '../services/pdfService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Printer, 
  Search, 
  Check, 
  User,
  Users,
  UserPlus,
  GraduationCap,
  Plus
} from 'lucide-react';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { InternFormModal } from '../components/employees/InternFormModal';

interface CardTypeOption {
  id: 'employee' | 'intern';
  tabLabel: string;
  panelTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  countLabel: string;
  cardTypeLabel: string;
  usageLabel: string;
  iconTheme: 'blue' | 'green';
}

const CARD_TYPES: CardTypeOption[] = [
  { 
    id: 'employee', 
    tabLabel: 'Employee ID', 
    panelTitle: 'Employee ID Card',
    icon: User,
    description: 'Generate official identity cards for employees.',
    countLabel: 'Active Employees',
    cardTypeLabel: 'PVC Employee Card',
    usageLabel: 'Permanent Workforce',
    iconTheme: 'blue'
  },
  { 
    id: 'intern', 
    tabLabel: 'Intern ID', 
    panelTitle: 'Intern ID Card',
    icon: GraduationCap,
    description: 'Generate internship identity cards.',
    countLabel: 'Active Interns',
    cardTypeLabel: 'PVC Intern Card',
    usageLabel: 'Training Workforce',
    iconTheme: 'green'
  },
];

export const GenerateCardsPage: React.FC = () => {
  const { employees, interns, createIntern, showToast } = useEmployeeContext();
  const [selectedCardType, setSelectedCardType] = useState<'employee' | 'intern'>('employee');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [selectedInternIds, setSelectedInternIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState<boolean>(false);
  const [isInternModalOpen, setIsInternModalOpen] = useState<boolean>(false);

  // Active workforce summary statistics
  const activeEmployeesCount = employees.filter(e => e.status === 'Active').length;
  const activeInternsCount = (interns || []).filter(i => i.status === 'Active').length;

  // Filtered queues based on active tab category
  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.employeeCode && e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInterns = (interns || []).filter(i => 
    i.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.internId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.internCode && i.internCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    i.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Active selection state helpers
  const currentSelectedIds = selectedCardType === 'employee' ? selectedEmployeeIds : selectedInternIds;
  const currentFilteredLength = selectedCardType === 'employee' ? filteredEmployees.length : filteredInterns.length;

  const toggleSelect = (id: string) => {
    if (selectedCardType === 'employee') {
      if (selectedEmployeeIds.includes(id)) {
        setSelectedEmployeeIds(selectedEmployeeIds.filter(i => i !== id));
      } else {
        setSelectedEmployeeIds([...selectedEmployeeIds, id]);
      }
    } else {
      if (selectedInternIds.includes(id)) {
        setSelectedInternIds(selectedInternIds.filter(i => i !== id));
      } else {
        setSelectedInternIds([...selectedInternIds, id]);
      }
    }
  };

  const selectAll = () => {
    if (selectedCardType === 'employee') {
      if (selectedEmployeeIds.length === filteredEmployees.length && filteredEmployees.length > 0) {
        setSelectedEmployeeIds([]);
      } else {
        setSelectedEmployeeIds(filteredEmployees.map(e => e.employeeId));
      }
    } else {
      if (selectedInternIds.length === filteredInterns.length && filteredInterns.length > 0) {
        setSelectedInternIds([]);
      } else {
        setSelectedInternIds(filteredInterns.map(i => i.internId));
      }
    }
  };

  const handleBatchDownloadPDF = async () => {
    if (currentSelectedIds.length === 0) {
      showToast('Queue Empty', 'warning', `Please check at least one ${selectedCardType === 'employee' ? 'employee' : 'intern'} badge from the queue below.`);
      return;
    }

    setIsProcessing(true);
    const label = selectedCardType === 'employee' ? 'Employee' : 'Intern';
    showToast('Rendering Duplex PDF', 'info', `Compiling CR80 Duplex PVC print bundle for ${currentSelectedIds.length} ${label.toLowerCase()}s...`);

    try {
      const elementsToRender: HTMLElement[] = [];
      const prefix = selectedCardType === 'employee' ? 'batch' : 'batch-intern';

      for (const id of currentSelectedIds) {
        const frontEl = document.getElementById(`${prefix}-front-${id}`);
        const backEl = document.getElementById(`${prefix}-back-${id}`);
        if (frontEl) elementsToRender.push(frontEl);
        if (backEl) elementsToRender.push(backEl);
      }

      const fileName = `DevTech_Batch_${label}_PVC_${currentSelectedIds.length}_Cards.pdf`;
      await generatePDFFromElements(elementsToRender, fileName, { orientation: 'landscape' });
      showToast('Export Completed', 'success', `Batch PVC Duplex PDF generated and saved successfully!`);
      
      if (selectedCardType === 'employee') {
        setSelectedEmployeeIds([]);
      } else {
        setSelectedInternIds([]);
      }
    } catch (error) {
      console.error('Batch export failed:', error);
      showToast('Export Error', 'error', 'Error generating batch PDF file. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateSampleIntern = async () => {
    try {
      const nextNum = (interns || []).length + 1;
      const newInt = await createIntern({
        internId: `DTS-INT-2026-00${nextNum}`,
        fullName: 'New Intern Credential',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        department: 'Cloud AI Research',
        role: 'AI Research Intern',
        college: 'BITS Pilani',
        duration: '6 Months',
        startDate: '01 Aug 2026',
        endDate: '31 Jan 2027',
        mentorName: 'Alexander Wright',
        status: 'Active',
        email: `intern.new${nextNum}@devtechitsolution.com`,
        phone: '+91 98200 88990'
      });
      showToast('Intern Added', 'success', `Created active intern record for ${newInt.fullName}`);
    } catch (e) {
      showToast('Creation failed', 'error');
    }
  };

  return (
    <div className="px-2 sm:px-6 space-y-4 sm:space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-6 rounded-[18px] sm:rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2563EB] uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Smart Badge Studio • Duplex PVC Generation</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-[#111827] mt-1">
            Batch Credential & PVC Card Generator
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-0.5">
            Select workforce personnel to generate millimeter-exact CR80 credit card sized PDF documents formatted for thermal PVC printers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={selectAll}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px] justify-center"
          >
            <span>{currentSelectedIds.length === currentFilteredLength && currentFilteredLength > 0 ? 'Deselect All' : 'Select All Filtered'}</span>
          </button>

          <button
            onClick={handleBatchDownloadPDF}
            disabled={isProcessing || currentSelectedIds.length === 0}
            className="saas-btn-primary !px-5 sm:!px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/25 disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            <span>
              {selectedCardType === 'employee'
                ? `Generate Employee PVC PDF (${currentSelectedIds.length})`
                : `Generate Intern PVC PDF (${currentSelectedIds.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* COMPACT ENTERPRISE CONTROL PANEL */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-[18px] sm:rounded-[24px] bg-white border border-[#E5E7EB] shadow-2xs transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0">
          
          {/* COLUMN 1 — CREDENTIAL TYPE */}
          <div className="flex flex-col justify-between lg:pr-8">
            <div>
              <span className="text-[11px] font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block mb-3 text-left">
                CARD GENERATION MODE
              </span>
              <div className="h-[46px] p-1 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] inline-flex items-center gap-1 w-full shadow-2xs relative">
                {CARD_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedCardType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedCardType(type.id)}
                      className={`relative flex-1 h-full flex items-center justify-center gap-2 px-3 rounded-[10px] text-xs sm:text-sm font-black transition-colors duration-250 z-10 ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#475569] hover:text-[#111827] bg-white sm:bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeGenerationTab"
                          className="absolute inset-0 bg-[#2563EB] rounded-[10px] shadow-sm -z-10"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-colors duration-250 ${
                        isSelected ? 'text-white' : type.iconTheme === 'blue' ? 'text-[#2563EB]' : 'text-[#059669]'
                      }`} />
                      <span className="truncate">{type.tabLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-2.5 truncate block text-left">
              {selectedCardType === 'employee' 
                ? 'Generate official employee PVC ID cards.'
                : 'Generate internship PVC ID cards.'}
            </p>
          </div>

          {/* COLUMN 2 — ACTIVE SUMMARY */}
          <div className="flex flex-col justify-between md:border-l lg:border-l lg:border-r border-[#E5E7EB] md:pl-6 lg:pl-8 lg:pr-8 border-t md:border-t-0 pt-5 md:pt-0 border-[#E5E7EB]">
            <span className="text-[11px] font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block mb-3 text-left">
              ACTIVE SUMMARY
            </span>
            <div className="flex items-center justify-between sm:justify-around lg:justify-center gap-6 xl:gap-8 h-[46px]">
              {/* Employee Summary Item */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[14px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE]/70 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-xs font-semibold text-[#6B7280] block truncate">Employees</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#111827] leading-none">{activeEmployeesCount}</span>
                    <span className="text-[11px] font-extrabold text-[#2563EB]">Active</span>
                  </div>
                </div>
              </div>

              {/* Intern Summary Item */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[14px] bg-[#DCFCE7] text-[#059669] flex items-center justify-center shrink-0 border border-[#BBF7D0]/70 shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-xs font-semibold text-[#6B7280] block truncate">Interns</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#111827] leading-none">{activeInternsCount}</span>
                    <span className="text-[11px] font-extrabold text-[#059669]">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-2.5 truncate block text-left opacity-0 pointer-events-none">
              Spacer for vertical alignment
            </p>
          </div>

          {/* COLUMN 3 — REGISTER NEW ID BADGE */}
          <div className="flex flex-col justify-between md:col-span-2 lg:col-span-1 border-t lg:border-t-0 md:pt-6 lg:pt-0 lg:pl-8 border-[#E5E7EB]">
            <span className="text-[11px] font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block mb-3 text-left">
              REGISTER NEW ID BADGE
            </span>
            <div className="grid grid-cols-2 gap-3 w-full h-[46px]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEmployeeModalOpen(true)}
                className={`h-[46px] px-3 rounded-[14px] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs ${
                  selectedCardType === 'employee'
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25 hover:bg-[#1D4ED8] border border-[#2563EB]'
                    : 'bg-white text-[#2563EB] border border-[#2563EB]/60 hover:bg-[#2563EB] hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="truncate">Register Employee</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsInternModalOpen(true)}
                className={`h-[46px] px-3 rounded-[14px] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs ${
                  selectedCardType === 'intern'
                    ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/25 hover:bg-[#047857] border border-[#059669]'
                    : 'bg-white text-[#059669] border border-[#059669]/60 hover:bg-[#059669] hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span className="truncate">Register Intern</span>
              </motion.button>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-2.5 truncate block text-left">
              Directly add new credentials to active queue.
            </p>
          </div>

        </div>
      </div>
      {/* Search Input Filter */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            selectedCardType === 'employee'
              ? "Search Employee by Name, Employee ID or Department..."
              : "Search Intern by Name, Intern ID or College..."
          }
          className="saas-input pl-12 h-12 !bg-white shadow-2xs"
        />
      </div>

      {/* Grid of Selectable Badges with Subtle Framer Motion Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCardType}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {selectedCardType === 'employee' ? (
            /* ================= EMPLOYEE ID CARD QUEUE ================= */
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmployeeIds.includes(emp.employeeId);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleSelect(emp.employeeId)}
                    className={`p-5 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#DBEAFE]/30 border-[#2563EB] shadow-saas-hover ring-2 ring-[#2563EB]'
                        : 'bg-white border-[#E5E7EB] shadow-saas hover:shadow-saas-md hover:border-[#2563EB]/40'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-[#E5E7EB] shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-[6px] border flex items-center justify-center text-white text-[10px] font-black shrink-0 transition-colors ${
                          isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#94A3B8]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <strong className="text-[#111827] font-extrabold truncate">{emp.fullName}</strong>
                      </div>
                      <span className="font-mono text-[11px] text-[#2563EB] font-extrabold shrink-0 ml-2">{emp.employeeId}</span>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center my-1 pointer-events-none">
                      <div className="w-full max-w-[450px] rounded-[16px] shadow-saas overflow-hidden">
                        <ScaledCardWrapper>
                          <Fortune500HorizontalCard employee={emp} isBack={false} />
                        </ScaledCardWrapper>
                      </div>
                    </div>

                    {/* Off-screen unscaled rendering targets for millimeter-exact CR80 PDF export */}
                    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -100, opacity: 0.01, pointerEvents: 'none', width: '450px', height: '1px', overflow: 'hidden' }}>
                      <Fortune500HorizontalCard id={`batch-front-${emp.employeeId}`} employee={emp} isBack={false} />
                      <Fortune500HorizontalCard id={`batch-back-${emp.employeeId}`} employee={emp} isBack={true} />
                    </div>

                    <div className="w-full flex items-center justify-between text-[11px] text-[#6B7280] font-semibold pt-2 border-t border-[#E5E7EB] shrink-0">
                      <span className="truncate pr-2">{emp.department} Division</span>
                      <span className={`font-black uppercase shrink-0 ${isSelected ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                        {isSelected ? '● Queued for Duplex Print' : '○ Unchecked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= INTERN ID CARD QUEUE ================= */
            filteredInterns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredInterns.map((intern) => {
                  const isSelected = selectedInternIds.includes(intern.internId);
                  return (
                    <div
                      key={intern.id}
                      onClick={() => toggleSelect(intern.internId)}
                      className={`p-5 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#D1FAE5]/30 border-[#059669] shadow-saas-hover ring-2 ring-[#059669]'
                          : 'bg-white border-[#E5E7EB] shadow-saas hover:shadow-saas-md hover:border-[#059669]/40'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-[#E5E7EB] shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-[6px] border flex items-center justify-center text-white text-[10px] font-black shrink-0 transition-colors ${
                            isSelected ? 'bg-[#059669] border-[#059669]' : 'bg-white border-[#94A3B8]'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <strong className="text-[#111827] font-extrabold truncate">{intern.fullName}</strong>
                        </div>
                        <span className="font-mono text-[11px] text-[#059669] font-extrabold shrink-0 ml-2">{intern.internId}</span>
                      </div>

                      <div className="w-full flex-1 flex items-center justify-center my-1 pointer-events-none">
                        <div className="w-full max-w-[450px] rounded-[16px] shadow-saas overflow-hidden">
                          <ScaledCardWrapper>
                            <InternHorizontalCard intern={intern} isBack={false} />
                          </ScaledCardWrapper>
                        </div>
                      </div>

                      {/* Off-screen unscaled rendering targets for millimeter-exact CR80 PDF export */}
                      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -100, opacity: 0.01, pointerEvents: 'none', width: '450px', height: '1px', overflow: 'hidden' }}>
                        <InternHorizontalCard id={`batch-intern-front-${intern.internId}`} intern={intern} isBack={false} />
                        <InternHorizontalCard id={`batch-intern-back-${intern.internId}`} intern={intern} isBack={true} />
                      </div>

                      <div className="w-full flex items-center justify-between text-[11px] text-[#6B7280] font-semibold pt-2 border-t border-[#E5E7EB] shrink-0">
                        <span className="truncate pr-2">{intern.role} • 🎓 {intern.college}</span>
                        <span className={`font-black uppercase shrink-0 ${isSelected ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                          {isSelected ? '● Queued for Duplex Print' : '○ Unchecked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ================= INTERN EMPTY STATE ================= */
              <div className="p-12 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-[#94A3B8] shadow-2xs">
                  <GraduationCap className="w-8 h-8 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#111827]">No Intern Records Found</h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-1 max-w-sm mx-auto">
                    No active internship records are available.
                  </p>
                </div>
                <button
                  onClick={handleCreateSampleIntern}
                  className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25 font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Intern</span>
                </button>
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Registration Modals */}
      <EmployeeFormModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />

      <InternFormModal
        isOpen={isInternModalOpen}
        onClose={() => setIsInternModalOpen(false)}
        onSuccess={() => {
          if (selectedCardType !== 'intern') {
            setSelectedCardType('intern');
          }
        }}
      />

    </div>
  );
};
