"use client";
import { EmployeesPage } from '@/screens/Employees';
import { useLayoutContext } from '@/context/LayoutContext';

export default function EmployeesRoutePage() {
  const { isAddModalOpen, setIsAddModalOpen } = useLayoutContext();
  return (
    <EmployeesPage 
      isAddModalOpen={isAddModalOpen} 
      onCloseAddModal={() => setIsAddModalOpen(false)} 
      onOpenAddModal={() => setIsAddModalOpen(true)} 
    />
  );
}
