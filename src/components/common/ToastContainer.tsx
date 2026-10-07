"use client";
import React from 'react';
import { useEmployeeContext, ToastMessage } from '../../context/EmployeeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEmployeeContext();

  if (!toasts || toasts.length === 0) return null;

  const getToastColors = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return { border: 'border-l-4 border-l-[#22C55E]', icon: CheckCircle2, iconColor: 'text-[#22C55E]' };
      case 'error':
        return { border: 'border-l-4 border-l-[#EF4444]', icon: XCircle, iconColor: 'text-[#EF4444]' };
      case 'warning':
        return { border: 'border-l-4 border-l-[#F59E0B]', icon: AlertTriangle, iconColor: 'text-[#F59E0B]' };
      default:
        return { border: 'border-l-4 border-l-[#2563EB]', icon: Info, iconColor: 'text-[#2563EB]' };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none select-none space-y-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const { border, icon: Icon, iconColor } = getToastColors(toast.type);
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 pr-5 rounded-[16px] bg-white/95 backdrop-blur-[12px] border border-[#E5E7EB] ${border} shadow-saas-floating`}
            >
              <div className={`w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-[#111827] leading-tight">
                  {toast.title || 'System Alert'}
                </h4>
                {toast.message && (
                  <p className="text-xs font-semibold text-[#6B7280] mt-0.5 leading-normal">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#94A3B8] hover:text-[#111827] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
