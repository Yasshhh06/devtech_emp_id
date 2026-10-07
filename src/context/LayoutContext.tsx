"use client";
import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (val: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (val: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{
      isAddModalOpen, setIsAddModalOpen,
      isScannerOpen, setIsScannerOpen,
      isCommandPaletteOpen, setIsCommandPaletteOpen
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayoutContext must be used within LayoutProvider");
  return ctx;
};
