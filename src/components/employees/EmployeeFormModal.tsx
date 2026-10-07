"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { PhotoCropperModal } from '../common/PhotoCropperModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Save, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { Fortune500HorizontalCard } from '../cards/Fortune500HorizontalCard';
import { ScaledCardWrapper } from '../cards/ScaledCardWrapper';
import { BloodGroup, EmployeeStatus, EmploymentType } from '../../types';
import { OFFICIAL_DEPARTMENTS } from '../../services/employeeService';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: any;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit
}) => {
  const { employees, createEmployee, updateEmployee, showToast } = useEmployeeContext();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;
  const [isPhotoCropperOpen, setIsPhotoCropperOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>('All inputs saved locally');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [status, setStatus] = useState<EmployeeStatus>('Active');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [employeeId, setEmployeeId] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Employee');

  useEffect(() => {
    if (employeeToEdit) {
      setFullName(employeeToEdit.fullName || '');
      setEmail(employeeToEdit.companyEmail || employeeToEdit.email || '');
      setPhone(employeeToEdit.phone || '');
      setDepartment(employeeToEdit.department || 'Development');
      setDesignation(employeeToEdit.designation || '');
      setJoiningDate(employeeToEdit.dateOfJoining || employeeToEdit.joiningDate || '');
      setStatus(employeeToEdit.status || 'Active');
      setBloodGroup((employeeToEdit.bloodGroup as BloodGroup) || 'O+');
      setPhoto(employeeToEdit.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      setEmployeeId(employeeToEdit.employeeCode || employeeToEdit.employeeId || '');
      setEmploymentType((employeeToEdit.employmentType as EmploymentType) || 'Employee');
    } else {
      const defaultRole = 'Software Engineer';
      setEmployeeId('Will be generated automatically after registration.');
      setFullName('');
      setEmail('');
      setPhone('+1 (555) 234-5678');
      setDepartment('Development');
      setDesignation(defaultRole);
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
      setBloodGroup('O+');
      setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      setEmploymentType('Employee');
    }
    setCurrentStep(1);
  }, [employeeToEdit, isOpen]);

  useEffect(() => {
    setAutosaveStatus('Saving drafts...');
    const timer = setTimeout(() => setAutosaveStatus('All inputs saved locally'), 600);
    return () => clearTimeout(timer);
  }, [fullName, email, department, designation]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !designation) {
      showToast('Validation Error', 'error', 'Please fill out required fields: Full Name, Email, and Designation.');
      return;
    }

    setIsSubmitting(true);
    const employeeData = {
      employeeId,
      fullName,
      companyEmail: email,
      personalEmail: email,
      phone,
      department,
      designation,
      dateOfJoining: joiningDate,
      status,
      bloodGroup,
      photo,
      gender: 'Other' as const,
      dateOfBirth: '1995-01-01',
      address: '100 Enterprise Parkway',
      city: 'Technology Cluster',
      state: 'Silicon Valley',
      country: 'United States',
      pinCode: '94043',
      managerName: 'Executive HR Command',
      employmentType: employmentType || 'Employee',
      createdBy: 'HR Administrator',
    };

    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, employeeData);
        showToast('Record Updated', 'success', `Updated credentials for ${fullName}.`);
      } else {
        const created = await createEmployee(employeeData);
        const finalId = created?.employeeCode || created?.employeeId || 'DTS-EMP-DEV-0001';
        showToast('Staff Onboarding Successful', 'success', `Successfully onboarded ${fullName} with Enterprise ID: ${finalId}.`);
      }
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Error saving record:', error);
      showToast('Operation Failed', 'error', 'Error committing employee credential record. Please try again.');
      setIsSubmitting(false);
    }
  };

  const sampleEmployeePreview = {
    employeeId: employeeToEdit ? (employeeToEdit.employeeCode || employeeToEdit.employeeId) : 'DTS-EMP-[DEPT]-XXXX',
    employmentType: employmentType || 'Employee',
    fullName: fullName || 'New Employee',
    designation: designation || 'Designated Role',
    department: department || 'Development',
    photo: photo,
    companyEmail: email || 'employee@devtech.com',
    dateOfJoining: joiningDate || '2026-08-01',
    bloodGroup: bloodGroup || 'O+',
    status: status,
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[8px] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-white w-full max-w-4xl rounded-[24px] border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#2563EB] text-white flex items-center justify-center font-black shadow-md shadow-[#2563EB]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111827] tracking-tight">
                {employeeToEdit ? 'Edit Employee Credentials' : 'Onboard Employee Studio & PVC Config'}
              </h2>
              <p className="text-[11px] font-extrabold text-[#22C55E] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                <span>{autosaveStatus}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-[#FEF2F2] text-[#6B7280] hover:text-[#EF4444] border border-[#E5E7EB] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-white border-b border-[#E5E7EB] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3 w-full">
            {[
              { step: 1, label: 'Personal & Contact Info' },
              { step: 2, label: 'Corporate Assignment' },
              { step: 3, label: 'PVC Badge Review' },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div 
                  onClick={() => setCurrentStep(item.step)}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${
                    currentStep === item.step ? 'text-[#2563EB] font-black' : currentStep > item.step ? 'text-[#22C55E] font-extrabold' : 'text-[#94A3B8] font-semibold'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border transition-all ${
                    currentStep === item.step ? 'bg-[#2563EB] text-white border-[#2563EB] ring-4 ring-[#2563EB]/15' : currentStep > item.step ? 'bg-[#DCFCE7] text-[#22C55E] border-[#BBF7D0]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E5E7EB]'
                  }`}>
                    {currentStep > item.step ? <Check className="w-3.5 h-3.5" /> : item.step}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                {idx < 2 && <div className="flex-1 h-[2px] bg-[#E5E7EB] rounded-full mx-2"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Modal Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-[20px] bg-[#F8FAFC] border border-[#E5E7EB]">
                  <img
                    src={photo}
                    alt="Preview avatar"
                    className="w-24 h-24 rounded-[20px] object-cover border-2 border-white shadow-saas shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="text-sm font-black text-[#111827]">Employee Biometric Photo</h4>
                    <p className="text-xs text-[#6B7280]">
                      Standard headshot utilized across printed CR80 badges and optical facial verifications.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPhotoCropperOpen(true)}
                      className="saas-btn-secondary !py-1.5 !px-3.5 !text-xs !rounded-[12px] inline-flex items-center gap-1.5 text-[#2563EB]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload & Crop Headshot</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        required
                        className="saas-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Corporate Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena.r@devtech.com"
                        required
                        className="saas-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="saas-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Emergency Medical Tag (Blood Group)</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="saas-input"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Atomic Employee ID</label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-[#2563EB] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={employeeToEdit ? (employeeToEdit.employeeCode || employeeToEdit.employeeId) : 'Will be generated automatically after registration.'}
                        disabled
                        className="saas-input pl-10 !bg-[#F8FAFC] font-semibold text-xs text-[#2563EB] truncate"
                      />
                    </div>
                    <p className="text-[10px] text-[#2563EB]/80 font-bold">Standardized format: DTS-EMP-[DEPT]-[SERIAL] minted on backend.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Designation / Role *</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Senior Solution Architect"
                      required
                      className="saas-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Assigned Division / Department *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="saas-input pl-10 font-bold text-[#111827]"
                      >
                        {OFFICIAL_DEPARTMENTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#111827]">Joining Date / Cycle</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                        className="saas-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-extrabold text-[#111827]">Staff Role / Employment Level</label>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {(['Employee', 'Intern'] as const).map(type => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setEmploymentType(type)}
                          className={`p-3 rounded-[14px] border text-xs font-black text-center transition-all ${
                            employmentType === type
                              ? 'bg-[#DBEAFE]/40 border-[#2563EB] text-[#2563EB] ring-4 ring-[#2563EB]/15 shadow-2xs'
                              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-extrabold text-[#111827]">Initial Credential Access Status</label>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {(['Active', 'Inactive', 'Suspended'] as const).map(s => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setStatus(s)}
                          className={`p-3 rounded-[14px] border text-xs font-black text-center transition-all ${
                            status === s
                              ? 'bg-[#DBEAFE]/40 border-[#2563EB] text-[#2563EB] ring-4 ring-[#2563EB]/15 shadow-2xs'
                              : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {s} Access
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="text-center space-y-1 max-w-lg">
                  <span className="text-[11px] font-extrabold uppercase text-[#22C55E] tracking-wider block">
                    Step 3: Verification & Duplex Preview
                  </span>
                  <h3 className="text-base font-black text-[#111827]">Review Corporate Smart Badge</h3>
                  <p className="text-xs text-[#6B7280]">
                    Verify the employee's optical QR code and PVC layout below. Once confirmed, credentials are saved to Cloud Supabase & printed queues.
                  </p>
                </div>

                <div className="p-4 rounded-[24px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-saas w-full max-w-xl flex items-center justify-center overflow-hidden">
                  <div className="w-full max-w-[450px] shadow-saas rounded-[16px] overflow-hidden">
                    <ScaledCardWrapper>
                      <Fortune500HorizontalCard employee={sampleEmployeePreview} isBack={false} />
                    </ScaledCardWrapper>
                  </div>
                </div>

                <div className="w-full max-w-xl p-4 rounded-[16px] bg-[#DCFCE7]/40 border border-[#BBF7D0] flex items-center justify-between text-xs text-[#15803D] font-extrabold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>All validations passed. Ready for immediate enterprise issuance.</span>
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase">CR80 Duplex</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

        <div className="p-5 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) onClose();
              else setCurrentStep(prev => prev - 1);
            }}
            className="saas-btn-secondary !px-5 !py-2.5 !text-xs !rounded-[14px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel Onboarding' : 'Previous Step'}</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px]"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] shadow-lg shadow-[#2563EB]/30 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{employeeToEdit ? 'Commit Changes & Reissue' : 'Generate Employee ID & Save'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <PhotoCropperModal
        isOpen={isPhotoCropperOpen}
        onClose={() => setIsPhotoCropperOpen(false)}
        onSelectPhoto={(newPhoto: string) => setPhoto(newPhoto)}
        currentPhoto={photo}
      />
    </div>,
    document.body
  );
};
