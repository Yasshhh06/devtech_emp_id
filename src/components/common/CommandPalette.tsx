"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { 
  Search, 
  Users, 
  CreditCard, 
  BarChart3, 
  FileText, 
  UserPlus, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Command, 
  X, 
  Briefcase,
  ExternalLink
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenAddModal,
  onOpenScanner,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { employees } = useEmployeeContext();
  const router = useRouter();

  // Reset query on close/open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter employees
  const matchedEmployees = useMemo(() => {
    if (!query) return employees.slice(0, 4);
    const q = query.toLowerCase();
    return employees.filter(e => 
      e.fullName.toLowerCase().includes(q) || 
      e.employeeId.toLowerCase().includes(q) || 
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [employees, query]);

  const quickActions = [
    { label: 'Onboard New Employee', icon: UserPlus, action: () => { onClose(); onOpenAddModal(); }, category: 'Actions', shortcut: 'N' },
    { label: 'Scan QR Verification Badge', icon: QrCode, action: () => { onClose(); onOpenScanner(); }, category: 'Actions', shortcut: 'S' },
    { label: 'Go to Dashboard', icon: BarChart3, action: () => { onClose(); router.push('/'); }, category: 'Navigation', shortcut: 'G D' },
    { label: 'Employee Directory & Table', icon: Users, action: () => { onClose(); router.push('/employees'); }, category: 'Navigation', shortcut: 'G E' },
    { label: 'PVC Badge Print Studio', icon: CreditCard, action: () => { onClose(); router.push('/generate-cards'); }, category: 'Navigation', shortcut: 'G B' },
  ];

  const matchedActions = useMemo(() => {
    if (!query) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(a => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl shadow-saas-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 transition-all">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, employee name, ID (DTS-...), or department..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden font-medium"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs">ESC</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
          
          {/* Section: Quick Commands */}
          {matchedActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Commands & Navigation
              </div>
              <div className="space-y-1 mt-1">
                {matchedActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/60 dark:border-slate-700">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Employee Lookup */}
          {matchedEmployees.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Employee Records ({employees.length} Total)
              </div>
              <div className="space-y-1 mt-1">
                {matchedEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      onClose();
                      router.push(`/employees/${emp.employeeId}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={emp.photo} 
                        alt={emp.fullName} 
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {emp.fullName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold border border-blue-200/50">
                            {emp.employeeId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {emp.designation} • <strong className="text-slate-600 dark:text-slate-400">{emp.department}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1">
                      Profile <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedActions.length === 0 && matchedEmployees.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
              <Command className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No matching actions or employee identities found for "<strong>{query}</strong>"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px]">↑↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px]">ESC</kbd> to dismiss</span>
          </div>
          <span className="text-blue-600 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> DevTech ID Smart Search
          </span>
        </div>
      </div>
    </div>
  );
};
