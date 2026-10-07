"use client";
import React, { useState } from 'react';
import { Employee, Intern } from '../../types';
import { 
  parseEmployeesFromExcel, 
  parseInternsFromExcel, 
  downloadSampleEmployeeExcel, 
  downloadSampleInternExcel 
} from '../../services/excelService';
import { Fortune500HorizontalCard } from '../cards/Fortune500HorizontalCard';
import { InternHorizontalCard } from '../cards/InternHorizontalCard';
import { generatePDFFromElements } from '../../services/pdfService';
import { 
  Upload, 
  X, 
  FileSpreadsheet, 
  Download, 
  Image as ImageIcon, 
  Edit2, 
  Check, 
  Sparkles, 
  Users, 
  GraduationCap, 
  AlertCircle,
  CreditCard,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

interface BulkUploadStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEmployees: (employees: Partial<Employee>[]) => Promise<void>;
  onSaveInterns: (interns: Partial<Intern>[]) => Promise<void>;
  showToast: (title: string, type: 'success' | 'error' | 'warning' | 'info', message?: string) => void;
}

const DEFAULT_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
];

export const BulkUploadStudioModal: React.FC<BulkUploadStudioModalProps> = ({
  isOpen,
  onClose,
  onSaveEmployees,
  onSaveInterns,
  showToast
}) => {
  const [recordType, setRecordType] = useState<'Employee' | 'Intern'>('Employee');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedEmployees, setParsedEmployees] = useState<Partial<Employee>[]>([]);
  const [parsedInterns, setParsedInterns] = useState<Partial<Intern>[]>([]);
  const [activeTabStep, setActiveTabStep] = useState<'upload' | 'studio'>('upload');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      if (recordType === 'Employee') {
        const result = await parseEmployeesFromExcel(file);
        if (result.length === 0) {
          showToast('Empty Excel File', 'warning', 'No valid employee rows found in file.');
          return;
        }
        setParsedEmployees(result);
        showToast('Excel Parsed!', 'success', `Loaded ${result.length} employee records. Ready for photo editing.`);
      } else {
        const result = await parseInternsFromExcel(file);
        if (result.length === 0) {
          showToast('Empty Excel File', 'warning', 'No valid intern rows found in file.');
          return;
        }
        setParsedInterns(result);
        showToast('Excel Parsed!', 'success', `Loaded ${result.length} intern records. Ready for photo editing.`);
      }
      setActiveTabStep('studio');
    } catch (err) {
      console.error(err);
      showToast('Parsing Failed', 'error', 'Could not read Excel file. Please download our template format.');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePhotoUploadForRecord = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImage(file, 300, 300, 0.75);
      if (recordType === 'Employee') {
        const updated = [...parsedEmployees];
        updated[index] = { ...updated[index], photo: dataUrl };
        setParsedEmployees(updated);
      } else {
        const updated = [...parsedInterns];
        updated[index] = { ...updated[index], photo: dataUrl };
        setParsedInterns(updated);
      }
      showToast('Photo Updated', 'success', `Photo assigned & optimized for badge #${index + 1}`);
    } catch {
      showToast('Photo Error', 'error', 'Failed to process image');
    }
  };

  const handlePresetPhotoSelect = (index: number, photoUrl: string) => {
    if (recordType === 'Employee') {
      const updated = [...parsedEmployees];
      updated[index] = { ...updated[index], photo: photoUrl };
      setParsedEmployees(updated);
    } else {
      const updated = [...parsedInterns];
      updated[index] = { ...updated[index], photo: photoUrl };
      setParsedInterns(updated);
    }
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    if (recordType === 'Employee') {
      const updated = [...parsedEmployees];
      updated[index] = { ...updated[index], [field]: value };
      setParsedEmployees(updated);
    } else {
      const updated = [...parsedInterns];
      updated[index] = { ...updated[index], [field]: value };
      setParsedInterns(updated);
    }
  };

  const handleSaveAllToDatabase = async () => {
    try {
      if (recordType === 'Employee') {
        await onSaveEmployees(parsedEmployees);
        showToast('Saved to Database', 'success', `Successfully saved ${parsedEmployees.length} employees to Database.`);
      } else {
        await onSaveInterns(parsedInterns);
        showToast('Saved to Database', 'success', `Successfully saved ${parsedInterns.length} interns to Database.`);
      }
      onClose();
    } catch (err) {
      showToast('Save Failed', 'error', 'Could not save records to database.');
    }
  };

  const handleBatchPDFExport = async () => {
    setIsExporting(true);
    showToast('Rendering Cards', 'info', 'Building print-ready PDF bundle for all cards...');
    try {
      const activeList = recordType === 'Employee' ? parsedEmployees : parsedInterns;
      const elements: HTMLElement[] = [];

      activeList.forEach((_, i) => {
        const frontEl = document.getElementById(`bulk-card-front-${i}`);
        const backEl = document.getElementById(`bulk-card-back-${i}`);
        if (frontEl) elements.push(frontEl);
        if (backEl) elements.push(backEl);
      });

      if (elements.length === 0) {
        showToast('Render Warning', 'warning', 'No card elements found to export.');
        return;
      }

      await generatePDFFromElements(elements, `DevTech_Bulk_${recordType}_Cards_${Date.now()}.pdf`, { orientation: 'landscape' });
      showToast('Export Complete', 'success', 'All ID Cards generated and saved successfully as PDF!');
    } catch (err) {
      console.error(err);
      showToast('PDF Export Error', 'error', 'Failed to generate PDF bundle.');
    } finally {
      setIsExporting(false);
    }
  };

  const activeCount = recordType === 'Employee' ? parsedEmployees.length : parsedInterns.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                Bulk Excel Upload & ID Badge Studio
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Batch Processor
                </span>
              </h2>
              <p className="text-xs font-semibold text-gray-500">
                Upload Excel data sheet, customize photo for each person, preview ID card, and download PDF cards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Selector */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Target Section:</span>
            <button
              onClick={() => { setRecordType('Employee'); setActiveTabStep('upload'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                recordType === 'Employee' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Employee ID Cards
            </button>
            <button
              onClick={() => { setRecordType('Intern'); setActiveTabStep('upload'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                recordType === 'Intern' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Intern ID Cards
            </button>
          </div>

          {activeCount > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabStep('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeTabStep === 'upload' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                1. Re-upload File
              </button>
              <button
                onClick={() => setActiveTabStep('studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeTabStep === 'studio' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                2. Cards & Photo Editor ({activeCount})
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTabStep === 'upload' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Template Download Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      Step 1: Download Sample Excel Template
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Download pre-formatted Excel template for {recordType} records with all required column headings.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {recordType === 'Employee' ? (
                    <button
                      onClick={downloadSampleEmployeeExcel}
                      className="px-4 py-2.5 rounded-xl bg-white text-blue-700 border border-blue-300 font-extrabold text-xs shadow-sm hover:bg-blue-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      Employee Template (.xlsx)
                    </button>
                  ) : (
                    <button
                      onClick={downloadSampleInternExcel}
                      className="px-4 py-2.5 rounded-xl bg-white text-emerald-700 border border-emerald-300 font-extrabold text-xs shadow-sm hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      Intern Template (.xlsx)
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Drag & Drop Dropzone */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/30 transition-all text-center group cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900">
                      Click to upload or drag & drop {recordType} Excel sheet
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports .xlsx, .xls, or .csv files with employee/intern data rows
                    </p>
                  </div>

                  {isParsing && (
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Parsing Excel file...
                    </div>
                  )}
                </div>
              </div>

              {/* Format Column Guide */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Required Excel Format Columns ({recordType}):
                </h4>
                
                {recordType === 'Employee' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">1. Full Name</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">2. Department</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">3. Designation</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">4. Company Email</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">5. Phone</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">6. Date of Joining</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">7. Blood Group</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">8. Photo URL (Optional)</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">1. Full Name</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">2. Department</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">3. Role</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">4. College</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">5. Email</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">6. Duration</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">7. Start Date / End Date</div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 font-bold text-gray-800">8. Photo URL (Optional)</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTabStep === 'studio' && activeCount > 0 && (
            <div className="space-y-8">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-black text-gray-900">
                    Loaded {activeCount} {recordType} Records. Customize photos & preview ID cards below:
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBatchPDFExport}
                    disabled={isExporting}
                    className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-black text-xs hover:bg-black shadow-md flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Generating PDF...' : `Download All ${activeCount} ID Cards (PDF)`}
                  </button>
                  <button
                    onClick={handleSaveAllToDatabase}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Save All to Database
                  </button>
                </div>
              </div>

              {/* Individual Record Cards & ID Preview */}
              <div className="space-y-6">
                {(recordType === 'Employee' ? parsedEmployees : parsedInterns).map((rec: any, idx: number) => {
                  const tempId = rec.employeeId || rec.internId || `DTS-${recordType === 'Employee' ? 'EMP' : 'INT'}-2026-${(idx + 1).toString().padStart(4, '0')}`;
                  const photoUrl = rec.photo || DEFAULT_PHOTO_PRESETS[idx % DEFAULT_PHOTO_PRESETS.length];

                  return (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                    >
                      {/* Left: Metadata & Photo Uploader */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                            Record #{idx + 1} • {tempId}
                          </span>
                          <button
                            onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                            className="text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            {editingIndex === idx ? 'Close Edit' : 'Edit Text'}
                          </button>
                        </div>

                        {/* Inline Editable Form */}
                        {editingIndex === idx ? (
                          <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs">
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">Full Name:</label>
                              <input 
                                type="text" 
                                value={rec.fullName || ''} 
                                onChange={(e) => handleFieldChange(idx, 'fullName', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-semibold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="font-bold text-gray-700 block mb-1">Department:</label>
                                <input 
                                  type="text" 
                                  value={rec.department || ''} 
                                  onChange={(e) => handleFieldChange(idx, 'department', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-gray-700 block mb-1">{recordType === 'Employee' ? 'Designation' : 'Role'}:</label>
                                <input 
                                  type="text" 
                                  value={(recordType === 'Employee' ? rec.designation : rec.role) || ''} 
                                  onChange={(e) => handleFieldChange(idx, recordType === 'Employee' ? 'designation' : 'role', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-base font-black text-gray-900">{rec.fullName}</h3>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">
                              {rec.department} • {recordType === 'Employee' ? rec.designation : (rec.role || rec.college)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Email: {rec.companyEmail || rec.email || 'N/A'} | Phone: {rec.phone || 'N/A'}
                            </p>
                          </div>
                        )}

                        {/* Photo Assignment Tools */}
                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-extrabold text-gray-700 block flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-blue-600" />
                            Assign / Change Photo for this Badge:
                          </label>

                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              Upload Custom Pic
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handlePhotoUploadForRecord(idx, e)}
                                className="hidden" 
                              />
                            </label>

                            {DEFAULT_PHOTO_PRESETS.map((pUrl, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => handlePresetPhotoSelect(idx, pUrl)}
                                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                                  photoUrl === pUrl ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'
                                }`}
                              >
                                <img src={pUrl} alt="Preset Avatar" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Card Preview */}
                      <div className="lg:col-span-7 bg-gray-900/5 p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center space-y-4">
                        <div className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          Live ID Badge Preview (CR80 Standard Template)
                        </div>

                        {/* Card Front & Back Hidden Container for PDF Capture */}
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          <div id={`bulk-card-front-${idx}`} className="shrink-0 scale-[0.82] origin-center">
                            {recordType === 'Employee' ? (
                              <Fortune500HorizontalCard 
                                employee={{
                                  employeeId: tempId,
                                  fullName: rec.fullName || 'Employee Name',
                                  department: rec.department || 'Development',
                                  designation: rec.designation || 'Software Engineer',
                                  companyEmail: rec.companyEmail || 'emp@devtech.com',
                                  phone: rec.phone || '+91 98000 00000',
                                  dateOfJoining: rec.dateOfJoining || '2026-01-01',
                                  bloodGroup: rec.bloodGroup || 'O+',
                                  photo: photoUrl,
                                  status: 'Active',
                                  gender: rec.gender || 'Male',
                                  emergencyContact: rec.emergencyContact || '+91 98000 00001',
                                  employmentType: 'Employee'
                                }}
                              />
                            ) : (
                              <InternHorizontalCard
                                intern={{
                                  id: tempId,
                                  internId: tempId,
                                  fullName: rec.fullName || 'Intern Name',
                                  department: rec.department || 'Development',
                                  role: rec.role || 'Software Intern',
                                  college: rec.college || 'IIT Bombay',
                                  duration: rec.duration || '6 Months',
                                  startDate: rec.startDate || '2026-01-01',
                                  endDate: rec.endDate || '2026-06-30',
                                  mentorName: rec.mentorName || 'Senior Lead',
                                  photo: photoUrl,
                                  status: 'Active',
                                  email: rec.email || 'intern@devtech.com',
                                  phone: rec.phone || '+91 98000 00000'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500 font-semibold">
            {activeCount > 0 ? `${activeCount} ${recordType} cards loaded in preview studio` : 'Select or upload file to start'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100"
            >
              Close Studio
            </button>
            {activeCount > 0 && activeTabStep === 'studio' && (
              <button
                onClick={handleSaveAllToDatabase}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                Save All {activeCount} Records to DB
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
