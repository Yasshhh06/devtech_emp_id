export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other';
export type EmploymentType = 'Employee' | 'Intern' | 'Manager' | 'Full Time' | 'Part Time' | 'Contract';
export type EmployeeStatus = 'Active' | 'Inactive' | 'Suspended' | 'Resigned' | 'Terminated';

export interface EmployeeNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  fileUrl: string;
  uploadDate: string;
  fileType: string;
}

export interface EmployeeExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
}

export interface EmployeeCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
}

export interface Employee {
  id: string; // Internal unique doc ID
  employeeId: string; // Public Unique Format: DTS-EMP-DEV-0001
  employeeCode?: string; // Permanent immutable database code
  fullName: string;
  photo: string;
  department: string;
  designation: string;
  companyEmail: string;
  personalEmail: string;
  phone: string;
  emergencyContact?: string;
  dateOfJoining: string;
  validTill?: string; // e.g. "30 Apr 2028" or "Until Employment"
  bloodGroup: BloodGroup;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  managerName: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  emergencyNotes?: string;
  signature?: string;
  skills?: string[];
  notes?: EmployeeNote[];
  documents?: EmployeeDocument[];
  experience?: EmployeeExperience[];
  certificates?: EmployeeCertificate[];
  qrUrl?: string;
  verificationCount: number;
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface VerificationLog {
  id: string;
  employeeId: string;
  employeeName: string;
  timestamp: string;
  browser: string;
  deviceType: string;
  location?: string;
  ip?: string;
  status: EmployeeStatus | 'NotFound';
}

export interface AuditLog {
  id: string;
  action: 'Employee Created' | 'Employee Updated' | 'Employee Deleted' | 'Status Changed' | 'Card Printed' | 'PDF Downloaded' | 'QR Generated' | 'Bulk Imported';
  performedBy: string;
  targetEmployeeId?: string;
  targetEmployeeName?: string;
  timestamp: string;
  details: string;
}

export interface CompanyBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
}

export type CardTemplateTheme = 'corporate-navy' | 'modern-dark' | 'glassmorphism' | 'executive-gold';

export interface BadgeTemplateConfig {
  id: CardTemplateTheme;
  name: string;
  description: string;
  bgGradient: string;
  headerBg: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  tagline: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  headquartersAddress: string;
  autoLogoutMinutes: number;
  cardTemplate: CardTemplateTheme;
  branches: CompanyBranch[];
}

export interface Intern {
  id: string; // Internal unique doc ID
  internId: string; // e.g. DTS-INT-DEV-0001
  internCode?: string; // Permanent immutable database code
  fullName: string;
  photo: string;
  department: string;
  role: string;
  college: string;
  duration: string;
  startDate: string;
  endDate: string;
  mentorName: string;
  status: 'Active' | 'Completed' | 'Terminated';
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
