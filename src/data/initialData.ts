import { Employee, SystemSettings, AuditLog, VerificationLog, Intern } from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'DevTech IT Solution Pvt. Ltd.',
  tagline: 'YOUR VISION OUR TECH',
  website: 'https://devtechitsolution.com',
  contactEmail: 'hr@devtechitsolution.com',
  contactPhone: '+919321812345',
  headquartersAddress: 'Kalyan, Maharashtra, India',
  autoLogoutMinutes: 15,
  cardTemplate: 'executive-gold',
  branches: [
    {
      id: 'br-hq',
      name: 'Kalyan HQ Branch',
      address: 'Kalyan',
      city: 'Kalyan',
      state: 'Maharashtra',
      country: 'India',
      pinCode: '421301',
      phone: '+919321812345',
      email: 'hr@devtechitsolution.com',
      isHeadquarters: true,
    }
  ]
};

// Clean initial states ready for actual real production data entry
export const INITIAL_EMPLOYEES: Employee[] = [];
export const INITIAL_INTERNS: Intern[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_VERIFICATION_LOGS: VerificationLog[] = [];
