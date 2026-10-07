"use client";

export interface WorkforceDocument {
  id: string;
  documentName: string;
  documentCategory: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'JPEG';
  fileSize: string;
  rawSize: number;
  uploadDate: string;
  uploadedBy: string;
  downloadUrl: string;
  personnelId: string;
  personnelName: string;
  personnelType: 'Employee' | 'Intern';
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  remarks?: string;
  status?: 'Verified' | 'Pending' | 'Rejected';
}

export interface WorkforceCertificate {
  id: string;
  certificateName: string;
  issuingOrganization: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  fileName?: string;
  fileType?: 'PDF' | 'JPG' | 'PNG';
  downloadUrl?: string;
  personnelId: string;
  personnelName: string;
  personnelType: 'Employee' | 'Intern';
}

const LOCAL_STORAGE_KEYS = {
  DOCUMENTS: 'devtech_workforce_vault_documents',
  CERTIFICATES: 'devtech_workforce_vault_certificates'
};

const INITIAL_DOCUMENTS: WorkforceDocument[] = [];

const INITIAL_CERTIFICATES: WorkforceCertificate[] = [];

export function initDocumentVault(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CERTIFICATES, JSON.stringify([]));
  }
}

export function getDocumentsByPersonnel(personnelId: string): WorkforceDocument[] {
  initDocumentVault();
  const docs: WorkforceDocument[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS) || '[]');
  return docs.filter(d => d.personnelId === personnelId);
}

export function getAllDocuments(): WorkforceDocument[] {
  initDocumentVault();
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS) || '[]');
}

export async function uploadWorkforceDocument(docItem: WorkforceDocument): Promise<WorkforceDocument> {
  initDocumentVault();
  const docs: WorkforceDocument[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS) || '[]');
  const existingIndex = docs.findIndex(d => d.id === docItem.id || (d.personnelId === docItem.personnelId && d.documentCategory === docItem.documentCategory && d.fileName === docItem.fileName));
  
  if (existingIndex >= 0) {
    docs[existingIndex] = docItem;
  } else {
    docs.unshift(docItem);
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  return docItem;
}

export function deleteWorkforceDocument(docId: string): void {
  initDocumentVault();
  let docs: WorkforceDocument[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS) || '[]');
  docs = docs.filter(d => d.id !== docId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function getCertificatesByPersonnel(personnelId: string): WorkforceCertificate[] {
  initDocumentVault();
  const certs: WorkforceCertificate[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES) || '[]');
  return certs.filter(c => c.personnelId === personnelId);
}

export function getAllCertificates(): WorkforceCertificate[] {
  initDocumentVault();
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES) || '[]');
}

export async function saveWorkforceCertificate(certItem: WorkforceCertificate): Promise<WorkforceCertificate> {
  initDocumentVault();
  const certs: WorkforceCertificate[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES) || '[]');
  const existingIndex = certs.findIndex(c => c.id === certItem.id);
  
  if (existingIndex >= 0) {
    certs[existingIndex] = certItem;
  } else {
    certs.unshift(certItem);
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
  return certItem;
}

export function deleteWorkforceCertificate(certId: string): void {
  initDocumentVault();
  let certs: WorkforceCertificate[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES) || '[]');
  certs = certs.filter(c => c.id !== certId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
}

export function checkMandatoryProgress(personnelId: string, personnelType: 'Employee' | 'Intern'): { completed: number; total: number; missing: string[] } {
  const docs = getDocumentsByPersonnel(personnelId);
  const existingCategories = new Set(docs.map(d => d.documentCategory.toLowerCase()));
  
  const employeeMandatory = ['aadhaar card', 'pan card', 'resume / cv', 'offer letter'];
  const internMandatory = ['aadhaar card', 'resume / cv', 'appointment letter'];
  
  const required = personnelType === 'Employee' ? employeeMandatory : internMandatory;
  let completed = 0;
  const missing: string[] = [];

  required.forEach(req => {
    if (existingCategories.has(req.toLowerCase())) {
      completed++;
    } else {
      missing.push(req);
    }
  });

  return { completed, total: required.length, missing };
}
