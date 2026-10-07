"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Employee, 
  EmployeeStatus, 
  EmploymentType, 
  AuditLog, 
  VerificationLog, 
  SystemSettings, 
  CardTemplateTheme,
  Intern
} from '../types';
import * as employeeService from '../services/employeeService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  filteredEmployees: Employee[];
  interns: Intern[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedEmploymentType: string;
  setSelectedEmploymentType: (type: string) => void;
  
  // Selection
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  // Actions
  refreshEmployees: () => Promise<void>;
  createEmployee: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'verificationCount'>) => Promise<Employee>;
  createIntern: (data: Omit<Intern, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Intern>;
  updateIntern: (id: string, updates: Partial<Intern>) => Promise<Intern>;
  deleteIntern: (id: string) => Promise<void>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  changeStatus: (id: string, status: EmployeeStatus) => Promise<Employee>;
  bulkImport: (imported: Partial<Employee>[]) => Promise<number>;

  // Settings & Theme
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  cardTemplate: CardTemplateTheme;
  setCardTemplate: (template: CardTemplateTheme) => void;

  // Logs
  auditLogs: AuditLog[];
  verificationLogs: VerificationLog[];
  refreshLogs: () => Promise<void>;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, type?: ToastMessage['type'], message?: string) => void;
  removeToast: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('All');

  // System Settings & Badge Theme
  const [settings, setSettings] = useState<SystemSettings>(() => employeeService.getSystemSettings());
  const [cardTemplate, setCardTemplateState] = useState<CardTemplateTheme>(settings.cardTemplate || 'corporate-navy');

  // Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, type: ToastMessage['type'] = 'success', message?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
      if (data.length > 0 && !selectedEmployee) {
        setSelectedEmployee(data[0]);
      }
    } catch (e) {
      console.warn('Failed to load employees:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  const refreshLogs = useCallback(async () => {
    try {
      const aLogs = await employeeService.getAuditLogs();
      const vLogs = await employeeService.getVerificationLogs();
      setAuditLogs(aLogs);
      setVerificationLogs(vLogs);
    } catch (e) {
      console.warn('Failed to load logs:', e);
    }
  }, []);

  const refreshInterns = useCallback(async () => {
    try {
      const data = await employeeService.getInterns();
      setInterns(data);
    } catch (e) {
      console.warn('Failed to load interns:', e);
    }
  }, []);

  useEffect(() => {
    refreshEmployees();
    refreshLogs();
    refreshInterns();
  }, [refreshEmployees, refreshLogs, refreshInterns]);

  const createIntern = async (data: Omit<Intern, 'id' | 'createdAt' | 'updatedAt'>): Promise<Intern> => {
    const newInt = await employeeService.createIntern(data);
    setInterns(prev => [newInt, ...prev]);
    showToast('Intern Created', 'success', `Credential created for ${newInt.fullName} (${newInt.internId})`);
    return newInt;
  };

  const updateIntern = async (id: string, updates: Partial<Intern>): Promise<Intern> => {
    const updated = await employeeService.updateIntern(id, updates);
    await refreshInterns();
    showToast('Intern Profile Updated', 'success', updated.fullName);
    return updated;
  };

  const deleteIntern = async (id: string): Promise<void> => {
    await employeeService.deleteIntern(id);
    await refreshInterns();
    showToast('Intern Record Revoked', 'info');
  };

  // Filtered employees memo
  const filteredEmployees = employees.filter(emp => {
    // Search query check
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      emp.fullName.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(q)) ||
      emp.department.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.companyEmail.toLowerCase().includes(q) ||
      emp.phone.includes(q)
    );

    // Department filter
    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;

    // Status filter
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    // Employment Type filter
    const matchesEmpType = selectedEmploymentType === 'All' || emp.employmentType === selectedEmploymentType;

    return matchesSearch && matchesDept && matchesStatus && matchesEmpType;
  });

  const createEmployee = async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'verificationCount'>) => {
    try {
      const created = await employeeService.createEmployee(data);
      await refreshEmployees();
      await refreshLogs();
      setSelectedEmployee(created);
      showToast('Employee Added Successfully!', 'success', `Employee ID: ${created.employeeId}`);
      return created;
    } catch (e) {
      showToast('Failed to create employee', 'error');
      throw e;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await employeeService.updateEmployee(id, updates);
      await refreshEmployees();
      await refreshLogs();
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(updated);
      }
      showToast('Employee Profile Updated', 'success', updated.fullName);
      return updated;
    } catch (e) {
      showToast('Failed to update employee', 'error');
      throw e;
    }
  };

  const changeStatus = async (id: string, status: EmployeeStatus) => {
    try {
      const updated = await employeeService.updateEmployeeStatus(id, status);
      await refreshEmployees();
      await refreshLogs();
      showToast(`Status updated to ${status}`, status === 'Active' ? 'success' : 'warning', updated.fullName);
      return updated;
    } catch (e) {
      showToast('Status change failed', 'error');
      throw e;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.deleteEmployee(id);
      await refreshEmployees();
      await refreshLogs();
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
      showToast('Employee Record Deleted', 'info');
    } catch (e) {
      showToast('Failed to delete employee', 'error');
      throw e;
    }
  };

  const bulkImport = async (importedList: Partial<Employee>[]): Promise<number> => {
    let count = 0;
    const currentEmployees: { employeeId?: string }[] = [...(await employeeService.getEmployees())];
    
    for (const item of importedList) {
      if (!item.fullName) continue;
      const targetDesignation = item.designation || 'Software Engineer';
      const nextId = item.employeeId || employeeService.generateNextEmployeeId(currentEmployees, targetDesignation);
      currentEmployees.push({ employeeId: nextId });
      
      const empData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'verificationCount'> = {
        employeeId: nextId,
        fullName: item.fullName,
        photo: item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        department: item.department || 'Engineering',
        designation: targetDesignation,
        companyEmail: item.companyEmail || `${item.fullName.toLowerCase().replace(/\s+/g, '.')}@devtechitsolution.com`,
        personalEmail: item.personalEmail || '',
        phone: item.phone || '+1 555-0100',
        emergencyContact: item.emergencyContact || '+1 555-0999',
        dateOfJoining: item.dateOfJoining || new Date().toISOString().split('T')[0],
        bloodGroup: item.bloodGroup || 'O+',
        gender: item.gender || 'Male',
        dateOfBirth: item.dateOfBirth || '1995-01-01',
        address: item.address || '750 Tech Blvd',
        city: item.city || 'San Francisco',
        state: item.state || 'California',
        country: item.country || 'USA',
        pinCode: item.pinCode || '94107',
        managerName: item.managerName || 'HR Manager',
        employmentType: item.employmentType || 'Employee',
        status: item.status || 'Active',
        createdBy: 'Bulk Import',
      };

      await employeeService.createEmployee(empData);
      count++;
    }

    await refreshEmployees();
    await refreshLogs();
    showToast(`Bulk Import Complete!`, 'success', `Successfully imported ${count} employee records.`);
    return count;
  };

  const setCardTemplate = (template: CardTemplateTheme) => {
    setCardTemplateState(template);
    employeeService.updateSystemSettings({ cardTemplate: template });
    showToast('Badge Template Updated', 'info', template.toUpperCase().replace('-', ' '));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updated = employeeService.updateSystemSettings(newSettings);
    setSettings(updated);
    showToast('Company Settings Updated', 'success');
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        interns,
        loading,
        searchQuery,
        setSearchQuery,
        selectedDepartment,
        setSelectedDepartment,
        selectedStatus,
        setSelectedStatus,
        selectedEmploymentType,
        setSelectedEmploymentType,
        selectedEmployee,
        setSelectedEmployee,
        refreshEmployees,
        createEmployee,
        createIntern,
        updateIntern,
        deleteIntern,
        updateEmployee,
        deleteEmployee,
        changeStatus,
        bulkImport,
        settings,
        updateSettings,
        cardTemplate,
        setCardTemplate,
        auditLogs,
        verificationLogs,
        refreshLogs,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};
