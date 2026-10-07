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

const INITIAL_DOCUMENTS: WorkforceDocument[] = [
  {
    id: 'doc-emp-1',
    documentName: 'Aadhaar Card',
    documentCategory: 'Aadhaar Card',
    documentNumber: 'XXXX-XXXX-4921',
    fileName: 'Aadhaar_Card_Arjun_Mehta.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    rawSize: 1887436,
    uploadDate: '15 Jul 2026',
    uploadedBy: 'HR Admin',
    downloadUrl: '#',
    personnelId: 'DTS-EMP-DEV-0001',
    personnelName: 'Arjun Mehta',
    personnelType: 'Employee',
    status: 'Verified'
  },
  {
    id: 'doc-emp-2',
    documentName: 'Permanent Account Number',
    documentCategory: 'PAN Card',
    documentNumber: 'ABCDE1234F',
    fileName: 'PAN_Card_Arjun.pdf',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    rawSize: 1258291,
    uploadDate: '15 Jul 2026',
    uploadedBy: 'HR Admin',
    downloadUrl: '#',
    personnelId: 'DTS-EMP-DEV-0001',
    personnelName: 'Arjun Mehta',
    personnelType: 'Employee',
    status: 'Verified'
  },
  {
    id: 'doc-emp-3',
    documentName: 'Senior Architecture Resume',
    documentCategory: 'Resume / CV',
    fileName: 'Arjun_Mehta_Senior_Architecture_Resume.pdf',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    rawSize: 3250585,
    uploadDate: '10 Jul 2026',
    uploadedBy: 'Arjun Mehta',
    downloadUrl: '#',
    personnelId: 'DTS-EMP-DEV-0001',
    personnelName: 'Arjun Mehta',
    personnelType: 'Employee',
    status: 'Verified'
  },
  {
    id: 'doc-int-1',
    documentName: 'Aadhaar Card',
    documentCategory: 'Aadhaar Card',
    documentNumber: 'XXXX-XXXX-8842',
    fileName: 'Aadhaar_Card_Priyanshi.pdf',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    rawSize: 1572864,
    uploadDate: '01 Aug 2026',
    uploadedBy: 'HR Admin',
    downloadUrl: '#',
    personnelId: 'DTS-INT-DEV-0002',
    personnelName: 'Priyanshi',
    personnelType: 'Intern',
    status: 'Verified'
  }
];

const INITIAL_CERTIFICATES: WorkforceCertificate[] = [
  {
    id: 'cert-1',
    certificateName: 'Google Cybersecurity Professional Certificate',
    issuingOrganization: 'Google Career Certificates & Coursera',
    certificateNumber: 'GCC-2026-98921',
    issueDate: '12 Jan 2026',
    expiryDate: 'Never',
    credentialId: 'ABC123XYZ',
    credentialUrl: 'https://coursera.org/verify/professional-cert/ABC123XYZ',
    description: 'Mastery in threat vector intelligence, network intrusion detection, SIEM analytics, and cryptographic corporate asset defense.',
    fileName: 'Google_Cybersecurity_Certificate.pdf',
    fileType: 'PDF',
    downloadUrl: '#',
    personnelId: 'DTS-EMP-DEV-0001',
    personnelName: 'Arjun Mehta',
    personnelType: 'Employee'
  },
  {
    id: 'cert-3',
    certificateName: 'Google Cybersecurity Professional Certificate',
    issuingOrganization: 'Google',
    certificateNumber: 'GCC-INT-44219',
    issueDate: '15 Jul 2026',
    expiryDate: 'Never',
    credentialId: 'GCP-CYB-INT99',
    credentialUrl: 'https://coursera.org/verify/GCP-CYB-INT99',
    description: 'Comprehensive training in modern zero-trust network protocols, packet forensics, and enterprise endpoint protection.',
    fileName: 'Priyanshi_Google_Cybersecurity.pdf',
    fileType: 'PDF',
    downloadUrl: '#',
    personnelId: 'DTS-INT-DEV-0002',
    personnelName: 'Priyanshi',
    personnelType: 'Intern'
  }
];

export function initDocumentVault(): void {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
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
