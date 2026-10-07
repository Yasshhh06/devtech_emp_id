"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Award, Upload, Trash2, Download, Eye, RefreshCw, Plus, 
  Search, ShieldCheck, AlertCircle, CheckCircle2, Lock, FileCheck, 
  User, Building2, CreditCard, ExternalLink, Calendar, X, Save, Check, Filter, Image as ImageIcon
} from 'lucide-react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useDropzone } from 'react-dropzone';
import { 
  WorkforceDocument, WorkforceCertificate, 
  getDocumentsByPersonnel, uploadWorkforceDocument, deleteWorkforceDocument, 
  getCertificatesByPersonnel, saveWorkforceCertificate, deleteWorkforceCertificate, 
  checkMandatoryProgress 
} from '../../services/documentService';

interface EnterpriseDocumentManagerProps {
  tabMode: 'Documents' | 'Certificates';
  employee: any;
}

const DOCUMENT_CATEGORIES = [
  'Aadhaar Card', 'PAN Card', 'Passport', 'Driving License', 'Resume / CV', 
  'Offer Letter', 'Appointment Letter', 'Joining Letter', 'Experience Letter', 
  'Relieving Letter', 'Salary Slip', 'Bank Passbook / Cancelled Cheque', 
  'Address Proof', 'Education Certificate', 'Medical Certificate', 
  'Police Verification', 'Background Verification', 'Employment Contract', 
  'NDA Agreement', 'Other'
];

export const EnterpriseDocumentManager: React.FC<EnterpriseDocumentManagerProps> = ({ tabMode, employee }) => {
  const { showToast } = useEmployeeContext();
  const isIntern = Boolean(employee.isIntern);
  const personnelId = employee.employeeId || employee.id || 'DTS-EMP-DEV-0001';
  const personnelName = employee.fullName || 'Workforce Personnel';
  const personnelType: 'Employee' | 'Intern' = isIntern ? 'Intern' : 'Employee';

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Documents State
  const [documents, setDocuments] = useState<WorkforceDocument[]>(() => getDocumentsByPersonnel(personnelId));
  const [showDocForm, setShowDocForm] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetDoc, setReplaceTargetDoc] = useState<WorkforceDocument | null>(null);

  // New Document Form State
  const [docCategory, setDocCategory] = useState<string>('Aadhaar Card');
  const [docName, setDocName] = useState<string>('');
  const [docNumber, setDocNumber] = useState<string>('');
  const [docIssueDate, setDocIssueDate] = useState<string>('');
  const [docExpiryDate, setDocExpiryDate] = useState<string>('');
  const [docRemarks, setDocRemarks] = useState<string>('');
  const [attachedDocFile, setAttachedDocFile] = useState<{ file: File; name: string; size: string; type: 'PDF' | 'JPG' | 'PNG' | 'JPEG'; rawSize: number; preview?: string } | null>(null);

  // Certificates State
  const [certificates, setCertificates] = useState<WorkforceCertificate[]>(() => getCertificatesByPersonnel(personnelId));
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState({
    certificateName: '', issuingOrganization: '', certificateNumber: '',
    issueDate: new Date().toISOString().split('T')[0], expiryDate: 'Never',
    credentialId: '', credentialUrl: '', description: '', fileName: '', fileType: 'PDF' as 'PDF' | 'JPG' | 'PNG'
  });

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<{ type: 'document' | 'certificate'; data: any } | null>(null);

  useEffect(() => {
    setDocuments(getDocumentsByPersonnel(personnelId));
    setCertificates(getCertificatesByPersonnel(personnelId));
  }, [personnelId]);

  // Dropzone for Document Upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const maxSize = 20 * 1024 * 1024;
    
    if (file.size > maxSize) {
      showToast('File size exceeds maximum limit of 20 MB.', 'error');
      return;
    }

    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    const validTypes: ('PDF' | 'JPG' | 'PNG' | 'JPEG')[] = ['PDF', 'JPG', 'PNG', 'JPEG'];
    const assignedType = validTypes.includes(ext as any) ? (ext as any) : 'PDF';
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = file.size > 1048576 ? `${sizeInMB} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    let previewUrl = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    setAttachedDocFile({
      file, name: file.name, size: formattedSize, type: assignedType, rawSize: file.size, preview: previewUrl
    });
    
    if (!docName) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      setDocName(nameWithoutExt || file.name);
    }
  }, [docName, showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1 
  });

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (attachedDocFile?.preview) {
        URL.revokeObjectURL(attachedDocFile.preview);
      }
    };
  }, [attachedDocFile]);

  // Auto-fill Document Name when Category changes if empty
  useEffect(() => {
    if (!docName || DOCUMENT_CATEGORIES.includes(docName)) {
      setDocName(docCategory);
    }
    // Reset specific fields when category changes to avoid dirty data
    if (!['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License'].includes(docCategory)) {
      setDocNumber('');
    }
    if (!['Passport', 'Driving License'].includes(docCategory)) {
      setDocIssueDate('');
      setDocExpiryDate('');
    }
  }, [docCategory]);

  const resetDocForm = () => {
    setShowDocForm(false);
    setAttachedDocFile(null);
    setDocCategory('Aadhaar Card');
    setDocName('Aadhaar Card');
    setDocNumber('');
    setDocIssueDate('');
    setDocExpiryDate('');
    setDocRemarks('');
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachedDocFile) {
      showToast('Please attach a document file.', 'error');
      return;
    }
    if (!docName) {
      showToast('Document Name is required.', 'error');
      return;
    }

    setIsSubmittingDoc(true);

    const newDoc: WorkforceDocument = {
      id: `doc-${personnelId}-${Date.now()}`,
      documentName: docName,
      documentCategory: docCategory,
      fileName: attachedDocFile.name,
      fileType: attachedDocFile.type,
      fileSize: attachedDocFile.size,
      rawSize: attachedDocFile.rawSize,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: 'HR Admin',
      downloadUrl: '#',
      personnelId,
      personnelName,
      personnelType,
      status: 'Verified',
      remarks: docRemarks,
      ...(docNumber && { documentNumber: docNumber }),
      ...(docIssueDate && { issueDate: docIssueDate }),
      ...(docExpiryDate && { expiryDate: docExpiryDate }),
    };

    await uploadWorkforceDocument(newDoc);
    setDocuments(getDocumentsByPersonnel(personnelId));
    setIsSubmittingDoc(false);
    resetDocForm();
    showToast(`Document uploaded and secured in Vault.`, 'success');
  };

  const handleReplaceUpload = async (files: FileList | null, replacingDoc: WorkforceDocument) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size exceeds maximum limit of 20 MB.', 'error');
      return;
    }
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    const validTypes: ('PDF' | 'JPG' | 'PNG' | 'JPEG')[] = ['PDF', 'JPG', 'PNG', 'JPEG'];
    const assignedType = validTypes.includes(ext as any) ? (ext as any) : 'PDF';
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = file.size > 1048576 ? `${sizeInMB} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const updatedDoc: WorkforceDocument = {
      ...replacingDoc,
      fileName: file.name,
      fileType: assignedType,
      fileSize: formattedSize,
      rawSize: file.size,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: 'HR Admin'
    };

    await uploadWorkforceDocument(updatedDoc);
    setDocuments(getDocumentsByPersonnel(personnelId));
    showToast(`Document successfully replaced.`, 'success');
  };

  const handleDeleteDocument = (docId: string, docNameStr: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${docNameStr}"?`)) {
      deleteWorkforceDocument(docId);
      setDocuments(getDocumentsByPersonnel(personnelId));
      showToast(`Document deleted from Vault.`, 'info');
    }
  };

  // Certificates Handlers (Kept Intact)
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.certificateName || !certForm.issuingOrganization) return;
    const newCert: WorkforceCertificate = {
      id: editingCertId || `cert-${personnelId}-${Date.now()}`,
      ...certForm,
      certificateNumber: certForm.certificateNumber || `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
      credentialId: certForm.credentialId || `CRED-${Math.floor(10000 + Math.random() * 90000)}`,
      credentialUrl: certForm.credentialUrl || 'https://devtech.id/verify-cert',
      fileName: certForm.fileName || `${certForm.certificateName.replace(/ /g, '_')}.pdf`,
      downloadUrl: '#',
      personnelId, personnelName, personnelType
    };
    await saveWorkforceCertificate(newCert);
    setCertificates(getCertificatesByPersonnel(personnelId));
    setShowCertForm(false);
    setEditingCertId(null);
    showToast(`Certificate archived successfully!`, 'success');
  };

  const handleDeleteCertificate = (certId: string, certName: string) => {
    if (window.confirm(`Delete certificate "${certName}"?`)) {
      deleteWorkforceCertificate(certId);
      setCertificates(getCertificatesByPersonnel(personnelId));
      showToast('Certificate removed from archive.', 'info');
    }
  };

  const handleDownload = (fileName: string, fileType: string) => {
    showToast(`Downloading ${fileName}...`, 'info');
    // Generate a mock blob to trigger an actual browser download
    const content = `Secure Vault Document: ${fileName}\nType: ${fileType}\nThis is a securely generated mock download for demonstration purposes.`;
    const blob = new Blob([content], { type: fileType === 'PDF' ? 'application/pdf' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter Logic
  const filteredDocuments = documents.filter(d => {
    const matchesSearch = d.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.documentCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.personnelName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || d.documentCategory === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredCertificates = certificates.filter(c => 
    c.certificateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progress = checkMandatoryProgress(personnelId, personnelType);

  // Smart Form Conditional Logic Helpers
  const showDocNumber = ['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License'].includes(docCategory);
  const showDates = ['Passport', 'Driving License'].includes(docCategory);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hidden file replace input */}
      <input
        type="file"
        ref={replaceInputRef}
        onChange={(e) => {
          if (replaceTargetDoc && e.target.files) {
            handleReplaceUpload(e.target.files, replaceTargetDoc);
            setReplaceTargetDoc(null);
          }
        }}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Global Search & Info Bar */}
      <div className="p-4 rounded-[16px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input pl-10 text-xs py-2 !w-full rounded-xl bg-[#F8FAFC]"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-[#6B7280]">
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] px-3 py-1.5 rounded-lg">
            <User className="w-3.5 h-3.5" />
            <span>{personnelName} ({personnelType})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#2563EB]">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Encrypted</span>
          </div>
        </div>
      </div>

      {/* TAB 1: DOCUMENTS */}
      {tabMode === 'Documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" /> Employee Document Vault
            </h3>
            <button
              onClick={() => {
                if (showDocForm) resetDocForm();
                else setShowDocForm(true);
              }}
              className="saas-btn-primary !py-2 !px-4 !text-xs flex items-center gap-2"
            >
              {showDocForm ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              {showDocForm ? 'Cancel Upload' : 'Upload Document'}
            </button>
          </div>

          <AnimatePresence>
            {showDocForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm overflow-hidden"
              >
                <form onSubmit={handleSaveDocument} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Smart Fields */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#374151]">Document Type</label>
                          <select 
                            value={docCategory}
                            onChange={(e) => setDocCategory(e.target.value)}
                            className="saas-input text-xs !w-full"
                          >
                            {DOCUMENT_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#374151]">Document Name</label>
                          <input 
                            type="text" 
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            placeholder="e.g. 10th Marksheet"
                            className="saas-input text-xs !w-full"
                            required
                          />
                        </div>
                      </div>

                      {showDocNumber && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#374151]">Document Number</label>
                          <input 
                            type="text" 
                            value={docNumber}
                            onChange={(e) => setDocNumber(e.target.value)}
                            placeholder="Enter exact ID number"
                            className="saas-input text-xs !w-full font-mono uppercase"
                          />
                        </div>
                      )}

                      {showDates && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#374151]">Issue Date</label>
                            <input 
                              type="date" 
                              value={docIssueDate}
                              onChange={(e) => setDocIssueDate(e.target.value)}
                              className="saas-input text-xs !w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-[#374151]">Expiry Date</label>
                            <input 
                              type="date" 
                              value={docExpiryDate}
                              onChange={(e) => setDocExpiryDate(e.target.value)}
                              className="saas-input text-xs !w-full cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#374151]">Remarks (Optional)</label>
                        <textarea 
                          value={docRemarks}
                          onChange={(e) => setDocRemarks(e.target.value)}
                          placeholder="Add any verification notes here..."
                          maxLength={300}
                          rows={2}
                          className="saas-input text-xs !w-full resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Column: File Dropzone */}
                    <div className="lg:col-span-5">
                      <label className="text-xs font-extrabold text-[#374151] block mb-1.5">Upload File</label>
                      <div 
                        {...getRootProps()} 
                        className={`h-[240px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors relative overflow-hidden ${
                          isDragActive ? 'border-[#2563EB] bg-[#EFF6FF]' : 
                          attachedDocFile ? 'border-[#22C55E] bg-[#F0FDF4]' : 'border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <input {...getInputProps()} />
                        {attachedDocFile ? (
                          <div className="flex flex-col items-center gap-3 z-10">
                            {attachedDocFile.preview ? (
                              <img src={attachedDocFile.preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[#E5E7EB]" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                                <FileCheck className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-black text-[#111827] truncate max-w-[200px]">{attachedDocFile.name}</p>
                              <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">{attachedDocFile.size} • {attachedDocFile.type}</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); setAttachedDocFile(null); }}
                              className="text-[10px] font-bold text-[#EF4444] hover:underline"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-[#111827]">Drag & Drop to Upload</p>
                              <p className="text-[10px] text-[#6B7280] mt-1">PDF, JPG, PNG (Max 20MB)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-5 mt-5 border-t border-[#E5E7EB]">
                    <button
                      type="submit"
                      disabled={isSubmittingDoc || !attachedDocFile}
                      className="saas-btn-primary !py-2.5 !px-6 !text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmittingDoc ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>Save to Vault</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex items-center gap-2 text-[#94A3B8] mr-2 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-bold">Filters:</span>
            </div>
            <button 
              onClick={() => setFilterType('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-colors ${filterType === 'All' ? 'bg-[#111827] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F1F5F9]'}`}
            >
              All Types
            </button>
            {Array.from(new Set(documents.map(d => d.documentCategory))).map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-colors ${filterType === cat ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F1F5F9]'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <div className="p-12 bg-white rounded-[16px] border border-[#E5E7EB] border-dashed text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-[#111827]">No documents found</h4>
              <p className="text-xs text-[#6B7280] mt-1 max-w-xs">Upload documents using the button above to store them securely in the vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`p-2 rounded-lg shrink-0 ${doc.fileType === 'PDF' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                        {doc.fileType === 'PDF' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wide truncate">{doc.documentCategory}</p>
                        <h4 className="text-sm font-black text-[#111827] truncate" title={doc.documentName}>{doc.documentName}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 mb-4 text-xs">
                    {doc.documentNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Doc ID:</span>
                        <span className="font-mono text-[#111827] font-bold truncate max-w-[120px]">{doc.documentNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">Added on:</span>
                      <span className="text-[#111827] font-medium">{doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">Size:</span>
                      <span className="text-[#111827] font-mono">{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">Status:</span>
                      <span className="text-[#059669] font-black bg-[#DCFCE7] px-2 py-0.5 rounded text-[10px] uppercase">
                        {doc.status || 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mt-auto pt-3 border-t border-[#F1F5F9]">
                    <button 
                      title="View Document"
                      onClick={() => setPreviewItem({ type: 'document', data: doc })}
                      className="flex items-center justify-center p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      title="Download"
                      onClick={() => handleDownload(doc.fileName, doc.fileType)}
                      className="flex items-center justify-center p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      title="Replace File"
                      onClick={() => { setReplaceTargetDoc(doc); replaceInputRef.current?.click(); }}
                      className="flex items-center justify-center p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#D97706] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      title="Delete"
                      onClick={() => handleDeleteDocument(doc.id, doc.documentName)}
                      className="flex items-center justify-center p-1.5 rounded-lg text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CERTIFICATES (Simplified preserved section) */}
      {tabMode === 'Certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2563EB]" /> Training & Certifications
            </h3>
            <button
              onClick={() => { setShowCertForm(!showCertForm); setEditingCertId(null); }}
              className="saas-btn-primary !py-2 !px-4 !text-xs flex items-center gap-2"
            >
              {showCertForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showCertForm ? 'Cancel' : 'Add Certificate'}
            </button>
          </div>

          <AnimatePresence>
            {showCertForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm p-6"
              >
                <form onSubmit={handleSaveCertificate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div><label className="font-bold block mb-1">Certificate Name *</label><input type="text" className="saas-input w-full" value={certForm.certificateName} onChange={e => setCertForm({...certForm, certificateName: e.target.value})} required/></div>
                    <div><label className="font-bold block mb-1">Issuing Org *</label><input type="text" className="saas-input w-full" value={certForm.issuingOrganization} onChange={e => setCertForm({...certForm, issuingOrganization: e.target.value})} required/></div>
                    <div><label className="font-bold block mb-1">Expiry Date (Optional)</label><input type="date" className="saas-input w-full" value={certForm.expiryDate === 'Never' ? '' : certForm.expiryDate} onChange={e => setCertForm({...certForm, expiryDate: e.target.value || 'Never'})} /></div>
                  </div>
                  <div className="text-xs">
                    <label className="font-bold block mb-1">Upload Certificate *</label>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="saas-input w-full py-2 cursor-pointer" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCertForm({...certForm, fileName: file.name, fileType: file.type.includes('pdf') ? 'PDF' : 'JPG'});
                        }
                      }} 
                      required 
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="saas-btn-primary !py-2 !px-4 !text-xs">Save Certificate</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map(cert => (
              <div key={cert.id} className="p-4 bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm">
                <h4 className="text-sm font-black text-[#111827]">{cert.certificateName}</h4>
                <p className="text-xs text-[#6B7280]">{cert.issuingOrganization}</p>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
                  <button onClick={() => handleDeleteCertificate(cert.id, cert.certificateName)} className="text-xs text-[#DC2626] font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
                <div>
                  <h3 className="text-lg font-black text-[#111827]">
                    {previewItem.type === 'document' ? previewItem.data.documentName : previewItem.data.certificateName}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-bold mt-1">
                    {previewItem.type === 'document' ? previewItem.data.documentCategory : previewItem.data.issuingOrganization}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-full hover:bg-[#E2E8F0] text-[#64748B] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-[#F1F5F9] flex items-center justify-center min-h-[400px]">
                {/* Mock Preview Content */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#94A3B8]">
                    {previewItem.data.fileType === 'PDF' ? <FileText className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#111827]">Document Preview Not Available</p>
                    <p className="text-xs text-[#6B7280] max-w-sm mt-2 mx-auto leading-relaxed">
                      This is a secure vault item. In a production environment, this would render a secure iframe or image viewer connecting to your encrypted storage bucket.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      handleDownload(previewItem.data.fileName || 'certificate.pdf', previewItem.data.fileType || 'PDF');
                      setPreviewItem(null);
                    }}
                    className="saas-btn-primary !px-6 !py-2.5 mt-4 flex items-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File Directly</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
