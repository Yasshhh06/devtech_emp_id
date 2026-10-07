"use client";
import { Dashboard } from '@/screens/Dashboard';
import { useLayoutContext } from '@/context/LayoutContext';

export default function DashboardPage() {
  const { setIsAddModalOpen, setIsScannerOpen } = useLayoutContext();
  return (
    <Dashboard 
      onOpenAddModal={() => setIsAddModalOpen(true)} 
      onOpenScanner={() => setIsScannerOpen(true)} 
    />
  );
}
