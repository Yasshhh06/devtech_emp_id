"use client";
import { Employee, EmployeeStatus, VerificationLog, AuditLog, SystemSettings, Intern } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';
import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from './firebase';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEYS = {
  EMPLOYEES: 'devtech_employees_v1',
  SETTINGS: 'devtech_settings_v1',
  AUDIT_LOGS: 'devtech_audit_logs_v1',
  VERIFICATION_LOGS: 'devtech_verification_logs_v1',
  INTERNS: 'devtech_interns_v1',
};

// Helper to sanitize documents before saving to Firestore (prevents 1MB property size error)
const sanitizeForFirestore = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  
  for (const key in clone) {
    if (typeof clone[key] === 'string' && clone[key].length > 450000) {
      if (key === 'companyLogo' || key === 'logo') {
        clone[key] = '/login-logo.png';
      } else if (key === 'photo') {
        clone[key] = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
      } else {
        clone[key] = clone[key].substring(0, 1000);
      }
    } else if (typeof clone[key] === 'object' && clone[key] !== null) {
      clone[key] = sanitizeForFirestore(clone[key]);
    }
  }
  return clone;
};

export const OFFICIAL_DEPARTMENTS = [
  'Development',
  'Cyber Security',
  'Human Resources',
  'Artificial Intelligence',
  'Operations',
  'Marketing',
  'Finance',
  'Administration',
  'Sales',
  'Design',
  'Quality Assurance',
  'Networking',
  'Cloud Computing',
  'Data Science',
  'Support',
] as const;

export const getDepartmentCode = (department?: string): string => {
  if (!department) return 'DEV';
  const clean = department.trim().toUpperCase();
  const codeMap: Record<string, string> = {
    'DEVELOPMENT': 'DEV',
    'ENGINEERING': 'DEV',
    'SOFTWARE ENGINEERING': 'DEV',
    'CYBER SECURITY': 'CYB',
    'SECURITY': 'CYB',
    'INFORMATION SECURITY': 'CYB',
    'HUMAN RESOURCES': 'HR',
    'EXECUTIVE HR': 'HR',
    'HR': 'HR',
    'ARTIFICIAL INTELLIGENCE': 'AI',
    'AI': 'AI',
    'OPERATIONS': 'OPS',
    'MARKETING': 'MKT',
    'FINANCE': 'FIN',
    'ADMINISTRATION': 'ADM',
    'ADMIN': 'ADM',
    'SALES': 'SAL',
    'SALES & GROWTH': 'SAL',
    'DESIGN': 'DSG',
    'DESIGN STUDIO': 'DSG',
    'UI/UX': 'DSG',
    'QUALITY ASSURANCE': 'QA',
    'QA': 'QA',
    'NETWORKING': 'NET',
    'NETWORK': 'NET',
    'CLOUD COMPUTING': 'CLD',
    'CLOUD ARCHITECTURE': 'CLD',
    'CLOUD': 'CLD',
    'DATA SCIENCE': 'DS',
    'SUPPORT': 'SUP',
  };
  if (codeMap[clean]) return codeMap[clean];
  
  if (clean.includes('DEV') || clean.includes('ENG') || clean.includes('TECH') || clean.includes('SOFT')) return 'DEV';
  if (clean.includes('SEC') || clean.includes('CYB')) return 'CYB';
  if (clean.includes('CLOUD')) return 'CLD';
  if (clean.includes('DESIGN') || clean.includes('STUDIO')) return 'DSG';
  if (clean.includes('HR')) return 'HR';
  if (clean.includes('SALE') || clean.includes('GROWTH')) return 'SAL';
  
  return 'ADM';
};

export const generateEnterpriseId = (
  typeCode: 'EMP' | 'INT' | string,
  department: string,
  existingRecords: Array<{ employeeId?: string; internId?: string; employeeCode?: string; internCode?: string }> = []
): string => {
  const deptCode = getDepartmentCode(department);
  const prefix = `DTS-${typeCode.toUpperCase()}-${deptCode}-`;

  let maxSeq = 0;
  existingRecords.forEach(rec => {
    const idsToTest = [rec.employeeId, rec.internId, rec.employeeCode, rec.internCode].filter(Boolean) as string[];
    idsToTest.forEach(idStr => {
      if (idStr.startsWith(prefix)) {
        const remainder = idStr.slice(prefix.length);
        const match = remainder.match(/^(\d+)$/);
        if (match && match[1]) {
          const seq = parseInt(match[1], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    });
  });

  let nextSeq = maxSeq + 1;
  while (true) {
    const candidate = `${prefix}${nextSeq.toString().padStart(4, '0')}`;
    const collision = existingRecords.some(rec => 
      rec.employeeId === candidate || rec.internId === candidate || rec.employeeCode === candidate || rec.internCode === candidate
    );
    if (!collision) return candidate;
    nextSeq++;
  }
};

const mapRowToEmployee = (row: any): Employee => ({
  id: row.id,
  employeeId: row.employeeId || row.employee_id || row.id,
  employeeCode: row.employeeCode || row.employee_code || row.employeeId || row.employee_id,
  fullName: row.fullName || row.full_name || '',
  photo: row.photo || '',
  department: row.department || 'Development',
  designation: row.designation || 'Software Engineer',
  companyEmail: row.companyEmail || row.company_email || '',
  personalEmail: row.personalEmail || row.personal_email || '',
  phone: row.phone || '',
  emergencyContact: row.emergencyContact || row.emergency_contact || '',
  dateOfJoining: row.dateOfJoining || row.date_of_joining || '',
  validTill: row.validTill || row.valid_till || '',
  bloodGroup: row.bloodGroup || row.blood_group || 'O+',
  gender: row.gender || 'Male',
  dateOfBirth: row.dateOfBirth || row.date_of_birth || '',
  address: row.address || '',
  city: row.city || '',
  state: row.state || '',
  country: row.country || '',
  pinCode: row.pinCode || row.pin_code || '',
  managerName: row.managerName || row.manager_name || '',
  employmentType: row.employmentType || row.employment_type || 'Employee',
  status: row.status || 'Active',
  emergencyNotes: row.emergencyNotes || row.emergency_notes || '',
  signature: row.signature || '',
  skills: Array.isArray(row.skills) ? row.skills : [],
  notes: Array.isArray(row.notes) ? row.notes : [],
  documents: Array.isArray(row.documents) ? row.documents : [],
  experience: Array.isArray(row.experience) ? row.experience : [],
  certificates: Array.isArray(row.certificates) ? row.certificates : [],
  qrUrl: row.qrUrl || row.qr_url || '',
  verificationCount: row.verificationCount || row.verification_count || 0,
  lastVerifiedAt: row.lastVerifiedAt || row.last_verified_at || '',
  createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  updatedAt: row.updatedAt || row.updated_at || new Date().toISOString(),
  createdBy: row.createdBy || row.created_by || 'HR Admin',
});

const mapRowToIntern = (row: any): Intern => ({
  id: row.id,
  internId: row.internId || row.intern_id || row.id,
  internCode: row.internCode || row.intern_code || row.internId || row.intern_id,
  fullName: row.fullName || row.full_name || '',
  photo: row.photo || '',
  department: row.department || 'Development',
  role: row.role || 'Intern',
  college: row.college || '',
  duration: row.duration || '3 Months',
  startDate: row.startDate || row.start_date || '',
  endDate: row.endDate || row.end_date || '',
  mentorName: row.mentorName || row.mentor_name || '',
  status: row.status || 'Active',
  email: row.email || '',
  phone: row.phone || '',
  createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  updatedAt: row.updatedAt || row.updated_at || new Date().toISOString(),
});

const initLocalStorage = () => {
  if (typeof window === 'undefined') return;

  const CLEAN_KEY = 'devtech_db_cleaned_v2';
  if (!localStorage.getItem(CLEAN_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify([]));
    localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify([]));
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify([]));
    localStorage.setItem('devtech_workforce_vault_documents', JSON.stringify([]));
    localStorage.setItem('devtech_workforce_vault_certificates', JSON.stringify([]));
    localStorage.setItem(CLEAN_KEY, 'true');
  }

  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.INTERNS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify([]));
  }
};

initLocalStorage();

export const getDesignationShortForm = (designation?: string): string => {
  if (!designation) return 'SDE';
  const clean = designation.trim().toUpperCase();
  if (!clean) return 'SDE';

  const map: Record<string, string> = {
    'SOFTWARE ENGINEER': 'SDE',
    'SOFTWARE DEVELOPMENT ENGINEER': 'SDE',
    'SENIOR SOFTWARE ENGINEER': 'SSDE',
    'JUNIOR SOFTWARE ENGINEER': 'JSDE',
    'PRODUCT MANAGER': 'PM',
    'PROJECT MANAGER': 'PJM',
    'HR EXECUTIVE': 'HR',
    'HR MANAGER': 'HRM',
    'EXECUTIVE HR': 'HR',
    'UI/UX DESIGNER': 'UX',
    'PRODUCT DESIGNER': 'DES',
    'DESIGNER': 'DES',
    'DEVOPS ENGINEER': 'DEVOPS',
    'DATA SCIENTIST': 'DS',
    'DATA ENGINEER': 'DE',
    'BUSINESS ANALYST': 'BA',
    'QUALITY ASSURANCE': 'QA',
    'QA ENGINEER': 'QA',
    'SYSTEM ADMINISTRATOR': 'SYS',
    'TECH LEAD': 'TL',
    'TECHNICAL LEAD': 'TL',
    'ENGINEERING MANAGER': 'EM',
    'ACCOUNTANT': 'FIN',
    'FINANCE MANAGER': 'FIN',
    'MARKETING MANAGER': 'MKT',
    'SALES EXECUTIVE': 'SALES',
    'CHIEF EXECUTIVE OFFICER': 'CEO',
    'CHIEF TECHNOLOGY OFFICER': 'CTO',
    'CHIEF OPERATING OFFICER': 'COO',
    'SECURITY SPECIALIST': 'SEC',
    'CYBERSECURITY SPECIALIST': 'SEC',
    'CYBERSECURITY ENGINEER': 'SEC',
    'CLOUD ARCHITECT': 'ARC',
    'SYSTEMS ARCHITECT': 'ARC',
    'SOLUTIONS ARCHITECT': 'ARC',
    'INTERN': 'INT',
    'MANAGER': 'MGR',
    'EMPLOYEE': 'EMP',
  };

  if (map[clean]) return map[clean];
  return clean.replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'EMP';
};

export const generateNextEmployeeId = (employees: { employeeId?: string }[], designation?: string): string => {
  return generateEnterpriseId('EMP', designation || 'Development', employees as any);
};

// ==========================================
// FIREBASE & LOCAL STORAGE HYBRID EMPLOYEES CRUD
// ==========================================
export const getEmployees = async (): Promise<Employee[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'employees'));
      const firebaseDocs = snap.docs.map(docSnap => mapRowToEmployee({ id: docSnap.id, ...docSnap.data() }));
      localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(firebaseDocs));
      return firebaseDocs;
    } catch (e) {
      console.warn('Firebase employees fetch failed, falling back:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.EMPLOYEES);
  return raw ? JSON.parse(raw) : [];
};

export const getEmployeeByEmployeeId = async (employeeId: string): Promise<Employee | null> => {
  const cleanId = employeeId.trim().toUpperCase();
  const employees = await getEmployees();
  return employees.find(emp => 
    emp.employeeId.toUpperCase() === cleanId || 
    (emp.employeeCode && emp.employeeCode.toUpperCase() === cleanId) ||
    emp.id === cleanId
  ) || null;
};

export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'verificationCount'>): Promise<Employee> => {
  const employees = await getEmployees();
  
  let enterpriseId = employeeData.employeeId;
  const validEnterpriseRegex = /^DTS-EMP-[A-Z0-9]+-\d{4}$/;
  if (!enterpriseId || !validEnterpriseRegex.test(enterpriseId) || enterpriseId.includes('Will be generated') || employees.some(e => e.employeeId === enterpriseId || e.employeeCode === enterpriseId)) {
    enterpriseId = generateEnterpriseId('EMP', employeeData.department || 'Development', employees);
  }

  const now = new Date().toISOString();
  const newDocId = `emp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newEmployee: Employee = {
    ...employeeData,
    id: newDocId,
    employeeId: enterpriseId,
    employeeCode: enterpriseId,
    verificationCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'employees', newDocId), sanitizeForFirestore(newEmployee));
    } catch (e) {
      console.warn('Firebase save employee failed:', e);
    }
  }

  const updatedList = [newEmployee, ...employees];
  localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedList));

  await addAuditLog({
    action: 'Employee Created',
    performedBy: employeeData.createdBy || 'HR Admin',
    targetEmployeeId: enterpriseId,
    targetEmployeeName: employeeData.fullName,
    details: `Created new enterprise record in ${employeeData.department} department (ID: ${enterpriseId}).`
  });

  return newEmployee;
};

export const updateEmployee = async (id: string, updates: Partial<Employee>, updatedBy: string = 'HR Admin'): Promise<Employee> => {
  const employees = await getEmployees();
  const index = employees.findIndex(emp => emp.id === id || emp.employeeId === id || emp.employeeCode === id);
  if (index === -1) throw new Error('Employee not found');

  const existing = employees[index];
  const updated: Employee = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'employees', existing.id), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firebase update employee failed:', e);
    }
  }

  employees[index] = updated;
  localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));

  await addAuditLog({
    action: 'Employee Updated',
    performedBy: updatedBy,
    targetEmployeeId: updated.employeeId,
    targetEmployeeName: updated.fullName,
    details: `Updated employee parameters (${Object.keys(updates).join(', ')}).`
  });

  return updated;
};

export const updateEmployeeStatus = async (id: string, status: EmployeeStatus, updatedBy: string = 'HR Admin'): Promise<Employee> => {
  return updateEmployee(id, { status }, updatedBy);
};

export const deleteEmployee = async (id: string, deletedBy: string = 'HR Admin'): Promise<void> => {
  const employees = await getEmployees();
  const existing = employees.find(emp => emp.id === id || emp.employeeId === id);
  
  if (existing) {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'employees', existing.id));
      } catch (e) {
        console.warn('Firebase delete employee failed:', e);
      }
    }

    const filtered = employees.filter(emp => emp.id !== existing.id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));

    await addAuditLog({
      action: 'Employee Deleted',
      performedBy: deletedBy,
      targetEmployeeId: existing.employeeId,
      targetEmployeeName: existing.fullName,
      details: `Removed employee from database.`
    });
  }
};

// ==========================================
// INTERNS CRUD (FIREBASE + LOCALSTORAGE)
// ==========================================
export const getInterns = async (): Promise<Intern[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'interns'));
      const firebaseDocs = snap.docs.map(docSnap => mapRowToIntern({ id: docSnap.id, ...docSnap.data() }));
      localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(firebaseDocs));
      return firebaseDocs;
    } catch (e) {
      console.warn('Firebase interns fetch failed:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.INTERNS);
  return raw ? JSON.parse(raw) : [];
};

export const getInternByInternId = async (internId: string): Promise<Intern | null> => {
  const cleanId = internId.trim().toUpperCase();
  const interns = await getInterns();
  return interns.find(i => 
    i.internId.toUpperCase() === cleanId || 
    (i.internCode && i.internCode.toUpperCase() === cleanId) ||
    i.id === cleanId
  ) || null;
};

export const createIntern = async (data: Omit<Intern, 'id' | 'createdAt' | 'updatedAt'>): Promise<Intern> => {
  const internsList = await getInterns();
  
  let enterpriseId = data.internId;
  const validInternRegex = /^DTS-INT-[A-Z0-9]+-\d{4}$/;
  if (!enterpriseId || !validInternRegex.test(enterpriseId) || enterpriseId.includes('Will be generated') || internsList.some(i => i.internId === enterpriseId || i.internCode === enterpriseId)) {
    enterpriseId = generateEnterpriseId('INT', data.department || 'Development', internsList);
  }

  const newId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const newIntern: Intern = {
    ...data,
    id: newId,
    internId: enterpriseId,
    internCode: enterpriseId,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'interns', newId), sanitizeForFirestore(newIntern));
    } catch (e) {
      console.warn('Firebase create intern failed:', e);
    }
  }

  const updated = [newIntern, ...internsList];
  localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(updated));

  await addAuditLog({
    action: 'Employee Created',
    performedBy: 'HR Admin',
    targetEmployeeId: newIntern.internId,
    targetEmployeeName: newIntern.fullName,
    details: `Created enterprise intern credential for ${newIntern.role} in ${newIntern.department} department (ID: ${enterpriseId}).`
  });

  return newIntern;
};

export const updateIntern = async (id: string, updates: Partial<Intern>, updatedBy: string = 'HR Admin'): Promise<Intern> => {
  const internsList = await getInterns();
  const index = internsList.findIndex(i => i.id === id || i.internId === id);
  if (index === -1) throw new Error('Intern not found');

  const existing = internsList[index];
  const updated: Intern = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'interns', existing.id), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firebase update intern failed:', e);
    }
  }

  internsList[index] = updated;
  localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(internsList));

  await addAuditLog({
    action: 'Employee Updated',
    performedBy: updatedBy,
    targetEmployeeId: updated.internId,
    targetEmployeeName: updated.fullName,
    details: `Updated intern credentials.`
  });

  return updated;
};

export const deleteIntern = async (id: string, deletedBy: string = 'HR Admin'): Promise<void> => {
  const internsList = await getInterns();
  const existing = internsList.find(i => i.id === id || i.internId === id);

  if (existing) {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'interns', existing.id));
      } catch (e) {
        console.warn('Firebase delete intern failed:', e);
      }
    }

    const filtered = internsList.filter(i => i.id !== existing.id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(filtered));

    await addAuditLog({
      action: 'Employee Deleted',
      performedBy: deletedBy,
      targetEmployeeId: existing.internId,
      targetEmployeeName: existing.fullName,
      details: `Revoked intern credential.`
    });
  }
};

// ==========================================
// VERIFICATION LOGS & AUDIT LOGS & SETTINGS
// ==========================================
export const recordVerification = async (employeeId: string, status: EmployeeStatus | 'NotFound', employeeName: string = 'Unknown'): Promise<void> => {
  const now = new Date();
  const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser';
  let deviceType = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  if (/ipad|tablet/i.test(ua)) deviceType = 'Tablet';

  let browser = 'Modern Web Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  const logId = `vlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newLog: VerificationLog = {
    id: logId,
    employeeId,
    employeeName,
    timestamp: timestampStr,
    browser: `${browser} (${deviceType})`,
    deviceType,
    location: 'Verified via Live Web Portal',
    status
  };

  const existingLogsRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS);
  const existingLogs: VerificationLog[] = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
  localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify([newLog, ...existingLogs]));

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'verification_logs', logId), sanitizeForFirestore(newLog));
    } catch (e) {
      console.warn('Firebase verification log insert failed:', e);
    }
  }

  if (status !== 'NotFound') {
    try {
      const employee = await getEmployeeByEmployeeId(employeeId);
      if (employee) {
        await updateEmployee(employee.id, {
          verificationCount: (employee.verificationCount || 0) + 1,
          lastVerifiedAt: timestampStr,
        }, 'Public Verification Portal');
      }
    } catch (e) {
      console.warn('Silent fallback for verification count update:', e);
    }
  }
};

export const getVerificationLogs = async (): Promise<VerificationLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'verification_logs'));
      return snap.docs.map(d => d.data() as VerificationLog);
    } catch (e) {
      console.warn('Firebase verification logs fetch failed:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS);
  return raw ? JSON.parse(raw) : [];
};

export const addAuditLog = async (logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newLog: AuditLog = {
    id: logId,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    ...logData
  };

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
  const logs: AuditLog[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...logs]));

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'audit_logs', logId), sanitizeForFirestore(newLog));
    } catch (e) {
      console.warn('Firebase audit log failed:', e);
    }
  }
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'audit_logs'));
      return snap.docs.map(d => d.data() as AuditLog);
    } catch (e) {
      console.warn('Firebase audit logs fetch failed:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
  return raw ? JSON.parse(raw) : [];
};

export const getSystemSettings = (): SystemSettings => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
  if (!raw) return INITIAL_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    const cleaned = sanitizeForFirestore(parsed);
    return { ...INITIAL_SETTINGS, ...cleaned };
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const updateSystemSettings = (newSettings: Partial<SystemSettings>): SystemSettings => {
  const current = getSystemSettings();
  const updated = { ...current, ...newSettings };
  const sanitized = sanitizeForFirestore(updated);
  localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(sanitized));

  if (isFirebaseConfigured && db) {
    setDoc(doc(db, 'settings', 'system_settings'), sanitized, { merge: true }).catch(err => {
      console.warn('Firebase settings update error:', err);
    });
  }

  return sanitized;
};

// ==========================================
// FIREBASE ONE-CLICK DATA SYNC & PURGE UTILITY
// ==========================================
export const syncLocalDataToFirebase = async (): Promise<{ employeesCount: number; internsCount: number }> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured yet. Please enter your Firebase API credentials in .env.local first.');
  }

  const employees = await getEmployees();
  const interns = await getInterns();

  for (const emp of employees) {
    await setDoc(doc(db, 'employees', emp.id), sanitizeForFirestore(emp), { merge: true });
  }

  for (const intern of interns) {
    await setDoc(doc(db, 'interns', intern.id), sanitizeForFirestore(intern), { merge: true });
  }

  const settings = getSystemSettings();
  await setDoc(doc(db, 'settings', 'system_settings'), sanitizeForFirestore(settings), { merge: true });

  return {
    employeesCount: employees.length,
    internsCount: interns.length
  };
};

export const clearAllDataAndReset = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify([]));
  localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify([]));
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify([]));
  localStorage.setItem('devtech_workforce_vault_documents', JSON.stringify([]));
  localStorage.setItem('devtech_workforce_vault_certificates', JSON.stringify([]));
  localStorage.setItem('devtech_db_cleaned_v2', 'true');

  if (isFirebaseConfigured && db) {
    try {
      const empSnap = await getDocs(collection(db, 'employees'));
      for (const d of empSnap.docs) {
        await deleteDoc(doc(db, 'employees', d.id));
      }
      const intSnap = await getDocs(collection(db, 'interns'));
      for (const d of intSnap.docs) {
        await deleteDoc(doc(db, 'interns', d.id));
      }
      const vlogSnap = await getDocs(collection(db, 'verification_logs'));
      for (const d of vlogSnap.docs) {
        await deleteDoc(doc(db, 'verification_logs', d.id));
      }
      const auditSnap = await getDocs(collection(db, 'audit_logs'));
      for (const d of auditSnap.docs) {
        await deleteDoc(doc(db, 'audit_logs', d.id));
      }
    } catch (e) {
      console.warn('Firebase wipe failed:', e);
    }
  }
};
