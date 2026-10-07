"use client";
import React, { useState } from 'react';
import { EmployeesPage } from '@/screens/Employees';
import { useLayoutContext } from '@/context/LayoutContext';

export default function InternsRoutePage() {
  const { isAddModalOpen, setIsAddModalOpen } = useLayoutContext();
  return (
    <EmployeesPage 
      isAddModalOpen={isAddModalOpen} 
      onCloseAddModal={() => setIsAddModalOpen(false)} 
      onOpenAddModal={() => setIsAddModalOpen(true)} 
    />
  );
}
