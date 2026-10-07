"use client";
import React, { useState, useMemo } from 'react';
import { EmployeeTable, UnifiedPersonnel } from '../components/employees/EmployeeTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { InternFormModal } from '../components/employees/InternFormModal';
import { BulkUploadStudioModal } from '../components/employees/BulkUploadStudioModal';
import { InteractiveBadgePreview } from '../components/cards/InteractiveBadgePreview';
import { InternInteractiveBadgePreview } from '../components/cards/InternInteractiveBadgePreview';
import { downloadSampleEmployeeExcel, downloadSampleInternExcel } from '../services/excelService';
import { useEmployeeContext } from '../context/EmployeeContext';
import { Employee, Intern } from '../types';
import { Users, UserPlus, Upload, X, CreditCard, ChevronDown, GraduationCap, User, Download, Sparkles } from 'lucide-react';
import { EmployeeFilters, PersonnelFilterType } from '../components/employees/EmployeeFilters';

interface EmployeesProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const EmployeesPage: React.FC<EmployeesProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const { 
    employees, 
    interns, 
    createEmployee,
    createIntern,
    deleteEmployee, 
    deleteIntern, 
    showToast, 
    searchQuery, 
    selectedDepartment, 
    selectedStatus 
  } = useEmployeeContext();

  const [personnelType, setPersonnelType] = useState<PersonnelFilterType>('all');
  const [selectedJoiningYear, setSelectedJoiningYear] = useState<string>('All');

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [previewModalData, setPreviewModalData] = useState<{ record: any; type: 'Employee' | 'Intern' } | null>(null);
  
  const [isBulkStudioOpen, setIsBulkStudioOpen] = useState<boolean>(false);
  const [isInternAddModalOpen, setIsInternAddModalOpen] = useState<boolean>(false);
  const [isOnboardMenuOpen, setIsOnboardMenuOpen] = useState<boolean>(false);

  // Unify Employees and Interns into standardized rows
  const { allRecords, availableYears, availableDepartments } = useMemo(() => {
    const empRecords: (UnifiedPersonnel & { year: string })[] = (employees || []).map(emp => {
      const yearStr = emp.dateOfJoining || '2026';
      const year = yearStr.match(/\d{4}/)?.[0] || '2026';
      return {
        id: emp.id,
        publicId: emp.employeeId,
        fullName: emp.fullName,
        photo: emp.photo,
        personnelType: 'Employee' as const,
        designation: emp.designation,
        department: emp.department,
        status: emp.status || 'Active',
        emailOrCollege: emp.companyEmail || (emp as any).email || 'employee@devtech.com',
        joiningOrStartDate: emp.dateOfJoining || 'Jan 2026',
        rawRecord: emp,
        year
      };
    });

    const intRecords: (UnifiedPersonnel & { year: string })[] = (interns || []).map(i => {
      const yearStr = i.startDate || '2026';
      const year = yearStr.match(/\d{4}/)?.[0] || '2026';
      const emailCol = i.college ? `${i.college} • ${i.email}` : i.email || 'IIT Bombay';
      return {
        id: i.id,
        publicId: i.internId || i.internCode || 'DTS-INT-0001',
        fullName: i.fullName,
        photo: i.photo,
        personnelType: 'Intern' as const,
        designation: i.role || 'Software Engineering Intern',
        department: i.department || 'Development',
        status: i.status || 'Active',
        emailOrCollege: emailCol,
        joiningOrStartDate: i.startDate || 'Aug 2026',
        rawRecord: i,
        year
      };
    });

    const combined = [...empRecords, ...intRecords];
    const yearsSet = new Set(combined.map(r => r.year));
    const deptsSet = new Set(combined.map(r => r.department));

    return {
      allRecords: combined,
      availableYears: Array.from(yearsSet).sort().reverse(),
      availableDepartments: ['All', ...Array.from(deptsSet)]
    };
  }, [employees, interns]);

  // Filter unified records in real-time
  const filteredRecords = useMemo(() => {
    return allRecords.filter(item => {
      if (personnelType === 'employees' && item.personnelType !== 'Employee') return false;
      if (personnelType === 'interns' && item.personnelType !== 'Intern') return false;

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches = (
          item.fullName.toLowerCase().includes(q) ||
          item.publicId.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.emailOrCollege.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      if (selectedDepartment !== 'All' && item.department !== selectedDepartment) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (selectedJoiningYear !== 'All' && item.year !== selectedJoiningYear) return false;

      return true;
    });
  }, [allRecords, personnelType, searchQuery, selectedDepartment, selectedStatus, selectedJoiningYear]);

  const handleEditRecord = (record: any, type: 'Employee' | 'Intern') => {
    if (type === 'Employee') {
      setEditingEmployee(record);
    } else {
      setEditingIntern(record);
    }
  };

  const handleDeleteRecord = async (id: string, name: string, type: 'Employee' | 'Intern') => {
    if (type === 'Employee') {
      await deleteEmployee(id);
      showToast('Credential Revoked', 'warning', `Employee record for ${name} removed from active registry.`);
    } else {
      await deleteIntern(id);
      showToast('Credential Revoked', 'warning', `Intern record for ${name} removed from active registry.`);
    }
  };

  const handleSaveBulkEmployees = async (bulkData: Partial<Employee>[]) => {
    for (const item of bulkData) {
      await createEmployee({
        employeeId: item.employeeId || '',
        employeeCode: item.employeeCode || '',
        fullName: item.fullName || 'New Employee',
        department: item.department || 'Development',
        designation: item.designation || 'Software Engineer',
        companyEmail: item.companyEmail || 'emp@devtech.com',
        personalEmail: item.personalEmail || '',
        phone: item.phone || '+91 98000 00000',
        dateOfJoining: item.dateOfJoining || new Date().toISOString().split('T')[0],
        bloodGroup: item.bloodGroup || 'O+',
        gender: item.gender || 'Male',
        photo: item.photo || '',
        status: item.status || 'Active',
        dateOfBirth: item.dateOfBirth || '1995-01-01',
        emergencyContact: item.emergencyContact || '+91 98000 00001',
        employmentType: 'Employee',
        address: item.address || 'Main Office',
        city: item.city || 'Pune',
        state: item.state || 'Maharashtra',
        country: item.country || 'India',
        pinCode: item.pinCode || '411001',
        managerName: item.managerName || 'HR Manager',
        createdBy: 'HR Admin'
      });
    }
  };

  const handleSaveBulkInterns = async (bulkData: Partial<Intern>[]) => {
    for (const item of bulkData) {
      await createIntern({
        internId: item.internId || '',
        internCode: item.internCode || '',
        fullName: item.fullName || 'New Intern',
        department: item.department || 'Development',
        role: item.role || 'Software Engineering Intern',
        college: item.college || 'IIT Bombay',
        duration: item.duration || '6 Months',
        startDate: item.startDate || new Date().toISOString().split('T')[0],
        endDate: item.endDate || '2026-12-31',
        mentorName: item.mentorName || 'Senior Lead',
        photo: item.photo || '',
        status: item.status || 'Active',
        email: item.email || 'intern@devtech.com',
        phone: item.phone || '+91 98000 00000'
      });
    }
  };

  return (
    <div className="px-2 sm:px-6 space-y-4 sm:space-y-6 animate-fadeIn max-w-[1600px] mx-auto select-none" onClick={() => setIsOnboardMenuOpen(false)}>
      
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-[18px] sm:rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[14px] bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-black shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                Workforce Directory & ID Studio
              </h1>
              <span className="text-[11px] font-bold text-[#6B7280]">
                Manage Employees & Interns separately, bulk import Excel sheets, edit photos, and print smart ID badges.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative" onClick={(e) => e.stopPropagation()}>
          
          {/* Sample Templates Download Button */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={downloadSampleEmployeeExcel}
              className="px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-white text-[11px] font-extrabold text-[#2563EB] flex items-center gap-1.5 transition-colors"
              title="Download sample Excel format for Employee bulk upload"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Emp Excel Format</span>
            </button>

            <button
              onClick={downloadSampleInternExcel}
              className="px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-white text-[11px] font-extrabold text-[#059669] flex items-center gap-1.5 transition-colors"
              title="Download sample Excel format for Intern bulk upload"
            >
              <Download className="w-3.5 h-3.5 text-[#059669]" />
              <span>Intern Excel Format</span>
            </button>
          </div>

          {/* Bulk Import Studio Button */}
          <button
            onClick={() => setIsBulkStudioOpen(true)}
            className="saas-btn-secondary !px-3.5 sm:!px-4 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#22C55E]" />
            <span>Excel Bulk Studio</span>
          </button>

          {/* Onboard Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsOnboardMenuOpen(!isOnboardMenuOpen)}
              className="saas-btn-primary !px-3.5 sm:!px-4 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-1.5 shadow-md shadow-[#2563EB]/25"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Person</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOnboardMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOnboardMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-[18px] shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <button
                  onClick={() => {
                    setIsOnboardMenuOpen(false);
                    onOpenAddModal();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#DBEAFE]/40 text-left text-xs font-bold text-[#111827] transition-colors"
                >
                  <div className="w-7 h-7 rounded-[10px] bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-[#111827]">New Employee</div>
                    <div className="text-[10px] text-[#6B7280]">Full-time / Permanent Staff</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOnboardMenuOpen(false);
                    setIsInternAddModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#D1FAE5]/40 text-left text-xs font-bold text-[#111827] transition-colors"
                >
                  <div className="w-7 h-7 rounded-[10px] bg-[#D1FAE5] text-[#059669] flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-[#111827]">New Intern</div>
                    <div className="text-[10px] text-[#6B7280]">Student / Trainee Assignment</div>
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modern Section Tabs & Filters */}
      <EmployeeFilters
        personnelType={personnelType}
        onPersonnelTypeChange={setPersonnelType}
        selectedJoiningYear={selectedJoiningYear}
        onJoiningYearChange={setSelectedJoiningYear}
        availableYears={availableYears}
        availableDepartments={availableDepartments}
        employeesCount={employees.length}
        internsCount={(interns || []).length}
        filteredCount={filteredRecords.length}
      />

      {/* Main Table View */}
      <EmployeeTable
        records={filteredRecords}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        onOpenCardModal={(record, type) => setPreviewModalData({ record, type })}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Employee Add/Edit Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen || !!editingEmployee}
        onClose={() => {
          onCloseAddModal();
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />

      {/* Intern Add/Edit Modal */}
      <InternFormModal
        isOpen={isInternAddModalOpen || !!editingIntern}
        onClose={() => {
          setIsInternAddModalOpen(false);
          setEditingIntern(null);
        }}
        internToEdit={editingIntern}
      />

      {/* Bulk Upload & Photo Studio Modal */}
      <BulkUploadStudioModal
        isOpen={isBulkStudioOpen}
        onClose={() => setIsBulkStudioOpen(false)}
        onSaveEmployees={handleSaveBulkEmployees}
        onSaveInterns={handleSaveBulkInterns}
        showToast={showToast}
      />

      {/* Live Badge Preview Modal */}
      {previewModalData && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] p-6 max-w-xl w-full border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setPreviewModalData(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              {previewModalData.type} Smart Badge Preview
            </h3>
            <div className="flex justify-center py-4 bg-gray-900/5 rounded-2xl">
              {previewModalData.type === 'Employee' ? (
                <InteractiveBadgePreview employee={previewModalData.record} />
              ) : (
                <InternInteractiveBadgePreview intern={previewModalData.record} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
