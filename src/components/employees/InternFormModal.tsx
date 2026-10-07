"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { OFFICIAL_DEPARTMENTS } from '../../services/employeeService';
import { PhotoCropperModal } from '../common/PhotoCropperModal';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, GraduationCap, Building2, Mail, Phone, Calendar, User, Sparkles, Upload } from 'lucide-react';

import { Intern } from '../../types';

interface InternFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newInternId: string) => void;
  internToEdit?: Intern | null;
}

export const InternFormModal: React.FC<InternFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  internToEdit
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { interns, createIntern, updateIntern, showToast } = useEmployeeContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPhotoCropperOpen, setIsPhotoCropperOpen] = useState<boolean>(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Development');
  const [role, setRole] = useState('Software Engineering Intern');
  const [college, setCollege] = useState('IIT Bombay');
  const [duration, setDuration] = useState('6 Months');
  const [startDate, setStartDate] = useState('01 Aug 2026');
  const [endDate, setEndDate] = useState('31 Jan 2027');
  const [mentorName, setMentorName] = useState('Yash Sunil Mohite');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80');
  const [internId, setInternId] = useState('Will be generated automatically after registration.');

  useEffect(() => {
    if (isOpen) {
      if (internToEdit) {
        setInternId(internToEdit.internCode || internToEdit.internId || 'DTS-INT-DEV-0001');
        setFullName(internToEdit.fullName || '');
        setEmail(internToEdit.email || '');
        setPhone(internToEdit.phone || '');
        setDepartment(internToEdit.department || 'Development');
        setRole(internToEdit.role || 'Software Engineering Intern');
        setCollege(internToEdit.college || 'IIT Bombay');
        setDuration(internToEdit.duration || '6 Months');
        setStartDate(internToEdit.startDate || '01 Aug 2026');
        setEndDate(internToEdit.endDate || '31 Jan 2027');
        setMentorName(internToEdit.mentorName || 'Yash Sunil Mohite');
        setPhoto(internToEdit.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80');
      } else {
        const currentCount = (interns || []).length + 1;
        setInternId('Will be generated automatically after registration.');
        setFullName('');
        setEmail(`intern.${currentCount}@devtechitsolution.com`);
        setPhone('+91 98200 88990');
        setDepartment('Development');
        setRole('Software Engineering Intern');
        setCollege('IIT Bombay');
        setDuration('6 Months');
        setStartDate('01 Aug 2026');
        setEndDate('31 Jan 2027');
        setMentorName('Yash Sunil Mohite');
      }
    }
  }, [isOpen, internToEdit, interns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Validation Error', 'error', 'Please enter intern full name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (internToEdit) {
        const updated = await updateIntern(internToEdit.id || internToEdit.internId, {
          fullName: fullName.trim(),
          photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
          department: department.trim(),
          role: role.trim(),
          college: college.trim(),
          duration: duration.trim(),
          startDate: startDate.trim(),
          endDate: endDate.trim(),
          mentorName: mentorName.trim(),
          email: email.trim(),
          phone: phone.trim()
        });
        showToast('Intern Updated', 'success', `Updated intern record for ${updated.fullName}`);
        if (onSuccess) onSuccess(updated.id);
      } else {
        const newInt = await createIntern({
          internId: 'Will be generated automatically after registration.',
          fullName: fullName.trim(),
          photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
          department: department.trim(),
          role: role.trim(),
          college: college.trim(),
          duration: duration.trim(),
          startDate: startDate.trim(),
          endDate: endDate.trim(),
          mentorName: mentorName.trim(),
          status: 'Active',
          email: email.trim(),
          phone: phone.trim()
        });
        const mintedId = newInt.internCode || newInt.internId || 'DTS-INT-DEV-0001';
        showToast('Intern Registered', 'success', `Registered active intern credential for ${newInt.fullName} (ID: ${mintedId})`);
        if (onSuccess) {
          onSuccess(newInt.id);
        }
      }
      onClose();
    } catch (err) {
      showToast(internToEdit ? 'Update Error' : 'Registration Error', 'error', `Failed to ${internToEdit ? 'update' : 'register'} intern credential.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted || typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-[8px] select-none animate-fadeIn overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[28px] border border-[#E5E7EB] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* Header */}
          <div className="p-6 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#DCFCE7] text-[#059669] border border-[#BBF7D0] flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#111827]">{internToEdit ? 'Edit Intern Record' : 'Register New Intern'}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-[#DCFCE7] text-[#059669] border border-[#BBF7D0]">
                    CR80 COMPLIANT
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                  {internToEdit ? 'Update training candidate parameters and ID badge configuration.' : 'Register a training workforce candidate to immediately generate their PVC ID card.'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-[12px] text-[#6B7280] hover:text-[#111827] hover:bg-[#E2E8F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-[20px] bg-[#F8FAFC] border border-[#E5E7EB]">
              <img
                src={photo}
                alt="Intern photo preview"
                className="w-20 h-20 rounded-[18px] object-cover border-2 border-white shadow-saas shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left flex-1">
                <h4 className="text-sm font-black text-[#111827]">Intern Biometric Photo</h4>
                <p className="text-xs text-[#6B7280]">
                  Standard headshot utilized across printed CR80 trainee badges and optical verification records.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPhotoCropperOpen(true)}
                    className="saas-btn-secondary !py-1.5 !px-3.5 !text-xs !rounded-[12px] inline-flex items-center gap-1.5 text-[#059669] hover:!bg-[#DCFCE7]/50 hover:!border-[#BBF7D0] transition-all font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Crop Headshot</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Intern ID Code
                </label>
                <input
                  type="text"
                  value="Will be generated automatically after registration."
                  disabled
                  className="saas-input !bg-[#F8FAFC] font-semibold text-xs !text-[#059669] truncate"
                />
                <p className="text-[10px] text-[#059669]/80 font-bold mt-1">Standardized format: DTS-INT-[DEPT]-[SERIAL] minted on backend.</p>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshi Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="saas-input !pl-10 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. IIT Bombay, VJTI Mumbai"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="saas-input !pl-10 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Department Division
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="saas-input !pl-10 font-semibold text-[#111827]"
                  >
                    {OFFICIAL_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Internship Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="saas-input font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Assigned Mentor
                </label>
                <input
                  type="text"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="saas-input font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Duration & Tenure
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 6 Months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="saas-input !pl-10 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-extrabold text-[#6B7280] uppercase block mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="saas-input !text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#6B7280] uppercase block mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="saas-input !text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="saas-input !pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#475569] uppercase tracking-wider block mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="saas-input !pl-10 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="saas-btn-secondary !px-5 !py-2.5 !text-xs !rounded-[14px]"
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="saas-btn-primary !bg-[#059669] hover:!bg-[#047857] !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-lg shadow-[#059669]/25"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : internToEdit ? 'Update Intern Credential' : 'Register Intern Credential'}</span>
              </button>
            </div>
          </form>
        </motion.div>

        <PhotoCropperModal
          isOpen={isPhotoCropperOpen}
          onClose={() => setIsPhotoCropperOpen(false)}
          onSelectPhoto={(newPhoto: string) => setPhoto(newPhoto)}
          currentPhoto={photo}
          title="Intern Photo Manager"
          subtitle="Upload or select training credential headshot"
        />
      </div>
    </AnimatePresence>,
    document.body
  );
};
