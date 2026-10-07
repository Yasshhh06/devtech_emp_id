"use client";
import * as XLSX from 'xlsx';
import { Employee, Intern, BloodGroup, Gender, EmploymentType, EmployeeStatus } from '../types';

export const downloadSampleEmployeeExcel = () => {
  const sampleData = [
    {
      'Full Name': 'Rahul Sharma',
      'Department': 'Development',
      'Designation': 'Senior Software Engineer',
      'Company Email': 'rahul.sharma@devtechitsolution.com',
      'Phone': '+91 98765 43210',
      'Date of Joining': '2026-01-15',
      'Blood Group': 'O+',
      'Gender': 'Male',
      'Photo URL': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      'Emergency Contact': '+91 98765 00000',
      'Date of Birth': '1996-05-20',
      'Address': 'Tech Park, Tower A, Pune',
      'Manager Name': 'Alexander Wright',
      'Status': 'Active'
    },
    {
      'Full Name': 'Priya Nair',
      'Department': 'Cyber Security',
      'Designation': 'Security Specialist',
      'Company Email': 'priya.nair@devtechitsolution.com',
      'Phone': '+91 98111 22334',
      'Date of Joining': '2026-02-01',
      'Blood Group': 'A+',
      'Gender': 'Female',
      'Photo URL': '',
      'Emergency Contact': '+91 98111 00000',
      'Date of Birth': '1997-09-12',
      'Address': 'Cyber City, Phase II, Mumbai',
      'Manager Name': 'Vikramaditya Roy',
      'Status': 'Active'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees_Bulk_Upload');

  worksheet['!cols'] = [
    { wch: 20 }, { wch: 20 }, { wch: 28 }, { wch: 35 },
    { wch: 18 }, { wch: 16 }, { wch: 12 }, { wch: 10 },
    { wch: 45 }, { wch: 18 }, { wch: 16 }, { wch: 30 },
    { wch: 20 }, { wch: 12 }
  ];

  XLSX.writeFile(workbook, 'DevTech_Employees_Sample_Upload.xlsx');
};

export const downloadSampleInternExcel = () => {
  const sampleData = [
    {
      'Full Name': 'Ananya Patel',
      'Department': 'Artificial Intelligence',
      'Role': 'AI Research Intern',
      'College': 'COEP Technological University',
      'Email': 'ananya.patel@devtechitsolution.com',
      'Phone': '+91 98222 33445',
      'Duration': '6 Months',
      'Start Date': '2026-02-01',
      'End Date': '2026-07-31',
      'Mentor Name': 'Alexander Wright',
      'Photo URL': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      'Status': 'Active'
    },
    {
      'Full Name': 'Rohan Mehta',
      'Department': 'Development',
      'Role': 'Software Engineer Intern',
      'College': 'IIT Bombay',
      'Email': 'rohan.mehta@devtechitsolution.com',
      'Phone': '+91 98333 44556',
      'Duration': '3 Months',
      'Start Date': '2026-03-01',
      'End Date': '2026-05-31',
      'Mentor Name': 'Priya Nair',
      'Photo URL': '',
      'Status': 'Active'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interns_Bulk_Upload');

  worksheet['!cols'] = [
    { wch: 20 }, { wch: 22 }, { wch: 25 }, { wch: 30 },
    { wch: 35 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 20 }, { wch: 45 }, { wch: 12 }
  ];

  XLSX.writeFile(workbook, 'DevTech_Interns_Sample_Upload.xlsx');
};

export const exportEmployeesToExcel = (employees: Employee[], filename = 'DevTech_Employees_Export.xlsx') => {
  const exportData = employees.map(emp => ({
    'Employee ID': emp.employeeId,
    'Full Name': emp.fullName,
    'Department': emp.department,
    'Designation': emp.designation,
    'Company Email': emp.companyEmail,
    'Personal Email': emp.personalEmail || '',
    'Phone': emp.phone,
    'Emergency Contact': emp.emergencyContact,
    'Date of Joining': emp.dateOfJoining,
    'Blood Group': emp.bloodGroup,
    'Gender': emp.gender,
    'Date of Birth': emp.dateOfBirth,
    'Status': emp.status,
    'Employment Type': emp.employmentType,
    'Manager Name': emp.managerName,
    'Address': emp.address,
    'City': emp.city,
    'State': emp.state,
    'Country': emp.country,
    'PIN Code': emp.pinCode,
    'Verifications': emp.verificationCount || 0,
    'Created At': emp.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  const colWidths = Object.keys(exportData[0] || {}).map(key => ({
    wch: Math.max(key.length + 3, 15)
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};

export const exportEmployeesToCSV = (employees: Employee[], filename = 'DevTech_Employees.csv') => {
  const exportData = employees.map(emp => ({
    'Employee ID': emp.employeeId || '',
    'Full Name': emp.fullName || '',
    'Department': emp.department || '',
    'Designation': emp.designation || '',
    'Company Email': emp.companyEmail || '',
    'Personal Email': emp.personalEmail || '',
    'Phone': emp.phone || '',
    'Emergency Contact': emp.emergencyContact || '',
    'Date of Joining': emp.dateOfJoining || '',
    'Blood Group': emp.bloodGroup || '',
    'Gender': emp.gender || '',
    'Date of Birth': emp.dateOfBirth || '',
    'Status': emp.status || 'Active',
    'Employment Type': emp.employmentType || 'Employee',
    'Manager Name': emp.managerName || '',
    'Address': emp.address || '',
    'City': emp.city || '',
    'State': emp.state || '',
    'Country': emp.country || '',
    'PIN Code': emp.pinCode || '',
    'Verifications': emp.verificationCount || 0,
    'Created At': emp.createdAt || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportInternsToExcel = (interns: Intern[], filename = 'DevTech_Interns_Export.xlsx') => {
  const exportData = interns.map(i => ({
    'Intern ID': i.internId,
    'Full Name': i.fullName,
    'Department': i.department,
    'Role': i.role,
    'College': i.college,
    'Email': i.email,
    'Phone': i.phone,
    'Duration': i.duration,
    'Start Date': i.startDate,
    'End Date': i.endDate,
    'Mentor Name': i.mentorName,
    'Status': i.status,
    'Created At': i.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interns');

  const colWidths = Object.keys(exportData[0] || {}).map(key => ({
    wch: Math.max(key.length + 3, 15)
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};

export const parseEmployeesFromExcel = (file: File): Promise<Partial<Employee>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const parsedEmployees: Partial<Employee>[] = jsonData.map((row) => ({
          fullName: row['Full Name'] || row['FullName'] || row['Name'] || 'New Employee',
          department: row['Department'] || 'Development',
          designation: row['Designation'] || 'Software Engineer',
          companyEmail: row['Company Email'] || row['Email'] || row['CompanyEmail'] || '',
          personalEmail: row['Personal Email'] || '',
          phone: row['Phone'] || row['Phone Number'] || '+91 98000 00000',
          emergencyContact: row['Emergency Contact'] || '+91 98000 00001',
          dateOfJoining: row['Date of Joining'] || row['Joining Date'] || new Date().toISOString().split('T')[0],
          bloodGroup: (row['Blood Group'] || 'O+') as BloodGroup,
          gender: (row['Gender'] || 'Male') as Gender,
          photo: row['Photo URL'] || row['Photo'] || '',
          dateOfBirth: row['Date of Birth'] || '1995-01-01',
          address: row['Address'] || 'Main Office',
          city: row['City'] || 'Pune',
          state: row['State'] || 'Maharashtra',
          country: row['Country'] || 'India',
          pinCode: row['PIN Code'] || row['Zip'] || '411001',
          managerName: row['Manager Name'] || row['Manager'] || 'HR Manager',
          employmentType: (row['Employment Type'] || 'Employee') as EmploymentType,
          status: (row['Status'] || 'Active') as EmployeeStatus,
        }));

        resolve(parsedEmployees);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export const parseInternsFromExcel = (file: File): Promise<Partial<Intern>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const parsedInterns: Partial<Intern>[] = jsonData.map((row) => {
          const rawStatus = (row['Status'] || 'Active').toString().trim();
          const status: 'Active' | 'Terminated' | 'Completed' = 
            (rawStatus === 'Terminated' || rawStatus === 'Completed') ? rawStatus : 'Active';

          return {
            fullName: row['Full Name'] || row['FullName'] || row['Name'] || 'New Intern',
            department: row['Department'] || 'Development',
            role: row['Role'] || row['Role / Position'] || 'Software Engineer Intern',
            college: row['College'] || row['University'] || 'Tech University',
            email: row['Email'] || row['Company Email'] || '',
            phone: row['Phone'] || row['Mobile'] || '+91 98000 00000',
            duration: row['Duration'] || '3 Months',
            startDate: row['Start Date'] || new Date().toISOString().split('T')[0],
            endDate: row['End Date'] || '2026-12-31',
            mentorName: row['Mentor Name'] || row['Mentor'] || 'Senior Lead',
            photo: row['Photo URL'] || row['Photo'] || '',
            status,
          };
        });

        resolve(parsedInterns);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
