"use client";
import React, { useState } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { syncLocalDataToFirebase, clearAllDataAndReset } from '../services/employeeService';
import { isFirebaseConfigured } from '../services/firebase';
import { 
  Building2, 
  Save,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Trash2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast, refreshEmployees, refreshLogs } = useEmployeeContext();
  
  // Corporate Profile State
  const [companyName, setCompanyName] = useState(settings.companyName || 'DevTech IT Solution Pvt. Ltd.');
  const [website, setWebsite] = useState(settings.website || 'https://devtechitsolution.com');
  const [hrEmail, setHrEmail] = useState(settings.contactEmail || 'hr@devtechitsolution.com');
  const [supportPhone, setSupportPhone] = useState(settings.contactPhone || '+919321812345');

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      website,
      contactEmail: hrEmail,
      contactPhone: supportPhone,
      companyLogo: '/login-logo.png'
    });
    showToast('Corporate profile specifications saved successfully!', 'success');
  };

  const handleSyncFirebase = async () => {
    setIsSyncing(true);
    showToast('Syncing to Firebase', 'info', 'Uploading employees, interns, and settings to Firestore...');
    try {
      const result = await syncLocalDataToFirebase();
      showToast(
        'Firebase Sync Complete!', 
        'success', 
        `Successfully synced ${result.employeesCount} employees and ${result.internsCount} interns to Firestore!`
      );
    } catch (err: any) {
      if (err?.message?.includes('permission-denied') || err?.message?.includes('PERMISSION_DENIED')) {
        showToast(
          'Firebase Rules Locked!', 
          'error', 
          'Firestore denied permission. Please enable Firestore Rules in Firebase Console to allow read/write.'
        );
      } else {
        showToast('Firebase Sync Error', 'error', err?.message || 'Could not sync to Firebase.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleWipeDatabase = async () => {
    if (window.confirm('Are you sure you want to clear all local employee/intern records to start a clean production database?')) {
      await clearAllDataAndReset();
      await refreshEmployees();
      await refreshLogs();
      showToast('Database Wiped', 'warning', 'All dummy records cleared. System ready for production onboarding.');
    }
  };

  return (
    <div className="px-6 space-y-6 animate-fadeIn max-w-[1500px] mx-auto select-none py-2">
      
      {/* Firebase Database Status & One-Click Sync Banner */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 shadow-saas flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-amber-500/20">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Firebase Firestore Cloud Database (`devtechempid`)
              </h2>
              {isFirebaseConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Live Credentials Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Hybrid Local Storage Mode
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-1 max-w-2xl">
              Project ID: <code className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">devtechempid</code>. 
              Click the button on the right to sync all employees, interns, and settings directly into your Firebase Console!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleSyncFirebase}
            disabled={isSyncing}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing to Firebase...' : 'Push All Data to Firebase Console'}</span>
          </button>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Corporate Profile Settings (2 Columns) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight border-b border-[#E5E7EB] pb-4">
            Corporate Profile Settings
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="saas-input font-extrabold text-sm"
                />
              </div>

              {/* Company Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Company Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

              {/* HR Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">HR Contact Email</label>
                <input
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

              {/* Support Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Support Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
              <button
                type="submit"
                className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Database Clean & Wipe Controls (1 Column) */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E7EB]">
            <Database className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
              Production Database
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2">
              <h4 className="font-extrabold flex items-center gap-1.5 text-red-800">
                <Trash2 className="w-4 h-4" />
                Clear Local Data / Start Fresh
              </h4>
              <p>
                Wipe all dummy/test records to prepare a clean, empty production database.
              </p>
              <button
                onClick={handleWipeDatabase}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                Clear Dummy Data & Start Clean
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
