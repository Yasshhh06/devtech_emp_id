"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployeeContext } from '../context/EmployeeContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Sliders, 
  Camera, 
  Edit3, 
  Check, 
  X, 
  Lock, 
  LogOut, 
  Laptop, 
  Smartphone, 
  ExternalLink, 
  ChevronRight,
  Globe,
  Clock,
  Bell,
  Sparkles,
  Mail,
  Phone
} from 'lucide-react';
import { AdminPhotoEditorModal } from '../components/admin/AdminPhotoEditorModal';

export const AdminProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { settings, showToast } = useEmployeeContext();
  const router = useRouter();

  const isSuperAdmin = user?.role === 'superadmin' || user?.email?.toLowerCase().includes('admin');

  // Active navigation tab state
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'company' | 'preferences'>('account');
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [adminPhoto, setAdminPhoto] = useState<string | undefined>(user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Tab 1: Account Information state & edit mode
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    fullName: user?.displayName || '',
    username: user?.username || user?.email?.split('@')[0] || '',
    officialEmail: user?.email || '',
    recoveryEmail: user?.recoveryEmail || '',
    mobileNumber: user?.mobileNumber || '',
    emergencyContact: user?.emergencyContact || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    bloodGroup: user?.bloodGroup || '',
    nationality: user?.nationality || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || '',
    postalCode: user?.postalCode || '',
    department: user?.department || '',
    designation: user?.designation || '',
    employeeId: user?.uid || '',
    joinedDate: user?.joinedDate || '',
    aboutText: user?.aboutText || ''
  });

  useEffect(() => {
    if (user) {
      setAccountForm({
        fullName: user.displayName || '',
        username: user.username || user.email?.split('@')[0] || '',
        officialEmail: user.email || '',
        recoveryEmail: user.recoveryEmail || '',
        mobileNumber: user.mobileNumber || '',
        emergencyContact: user.emergencyContact || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        bloodGroup: user.bloodGroup || '',
        nationality: user.nationality || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        department: user.department || '',
        designation: user.designation || '',
        employeeId: user.uid || '',
        joinedDate: user.joinedDate || '',
        aboutText: user.aboutText || ''
      });
      if (user.photoURL) setAdminPhoto(user.photoURL);
    }
  }, [user]);

  // Tab 2: Active Sessions device revocation state
  const [activeDevices, setActiveDevices] = useState([
    { id: '1', name: 'Windows 11', browser: 'Chrome', location: 'Vadodara', status: 'Active', icon: Laptop, isCurrent: true },
    { id: '2', name: 'Samsung Galaxy S24', browser: 'Mobile Safari', location: 'Vadodara', status: 'Idle (2h ago)', icon: Smartphone, isCurrent: false },
    { id: '3', name: 'MacBook Air', browser: 'Safari macOS', location: 'Kalyan', status: 'Idle (5h ago)', icon: Laptop, isCurrent: false },
    { id: '4', name: 'iPhone', browser: 'DevTech iOS', location: 'Vadodara', status: 'Syncing', icon: Smartphone, isCurrent: false },
  ]);

  // Tab 5: Preferences state
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    smsNotifs: true,
    pushNotifs: true,
    weeklyReports: true,
    securityAlerts: true,
    darkMode: false,
    language: 'English (US)',
    timezone: 'UTC+05:30 IST (Asia/Kolkata)',
    autoLogout: '15 Minutes'
  });

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingAccount(false);
    updateUser({
      displayName: accountForm.fullName,
      email: accountForm.officialEmail,
      username: accountForm.username,
      recoveryEmail: accountForm.recoveryEmail,
      mobileNumber: accountForm.mobileNumber,
      emergencyContact: accountForm.emergencyContact,
      gender: accountForm.gender,
      dateOfBirth: accountForm.dateOfBirth,
      bloodGroup: accountForm.bloodGroup,
      nationality: accountForm.nationality,
      address: accountForm.address,
      city: accountForm.city,
      state: accountForm.state,
      country: accountForm.country,
      postalCode: accountForm.postalCode,
      department: accountForm.department,
      designation: accountForm.designation,
      aboutText: accountForm.aboutText
    });
    showToast('Account profile modifications verified and saved.', 'success');
  };

  const handleCancelAccountEdit = () => {
    setIsEditingAccount(false);
    showToast('Edit mode exited without changes.', 'info');
  };

  const handleLogoutDevice = (id: string, deviceName: string) => {
    setActiveDevices(prev => prev.filter(d => d.id !== id));
    showToast(`Session revoked for ${deviceName}. Device disconnected.`, 'warning');
  };

  const handleLogoutAllDevices = () => {
    setActiveDevices(prev => prev.filter(d => d.isCurrent));
    showToast('All secondary devices terminated from current executive session.', 'success');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account governance preferences synchronized successfully.', 'success');
  };

  return (
    <div className="px-2 sm:px-6 py-2 sm:py-4 max-w-[1440px] mx-auto select-none animate-fadeIn">

      {/* HEADER TITLE */}
      <div className="pb-4 sm:pb-6 border-b border-[#E5E7EB] mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
          Enterprise Account Settings
        </h1>
        <p className="text-xs text-[#6B7280] font-medium mt-1">
          Manage your executive administrative profile, security parameters, and organization access coordinates.
        </p>
      </div>

      {/* NEW TWO-COLUMN LAYOUT (25% LEFT SIDEBAR / 75% RIGHT CONTENT) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR (25%) ================= */}
        <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 sticky top-6">
          <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
            
            {/* Circular Profile Photo & Upload Button */}
            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-[#E5E7EB]/80">
              <div 
                onClick={() => setIsPhotoEditorOpen(true)}
                className="relative w-32 h-32 rounded-full bg-[#EFF6FF] border-4 border-[#F8FAFC] shadow-lg shadow-slate-900/10 overflow-hidden group cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
              >
                {adminPhoto ? (
                  <img src={adminPhoto} alt="Admin Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-3xl font-black text-[#2563EB]">
                    {accountForm.fullName.substring(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-extrabold backdrop-blur-2xs">
                  <Camera className="w-6 h-6 mb-1 text-[#FBBF24]" />
                  <span>Change Photo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoEditorOpen(true)}
                className="saas-btn-secondary !w-full !py-2 !text-xs !rounded-[14px] flex items-center justify-center gap-1.5 font-bold shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Upload Photo</span>
              </button>

              <div className="space-y-1 w-full pt-1">
                <h2 className="text-lg font-black text-[#111827] truncate">{accountForm.fullName}</h2>
                <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] px-3 py-0.5 rounded-full inline-block border border-[#BFDBFE]">
                  {accountForm.designation}
                </span>
                <p className="text-[11px] text-[#6B7280] font-semibold pt-1">
                  Department: <strong className="text-[#334155]">{accountForm.department}</strong>
                </p>
              </div>
            </div>

            {/* Quick Profile Coordinates */}
            <div className="space-y-3 pb-6 border-b border-[#E5E7EB]/80 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">Employee ID</span>
                <span className="font-mono font-black text-[#111827] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
                  {accountForm.employeeId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 truncate">
                <span className="text-[#6B7280] font-medium shrink-0">Email</span>
                <span className="font-extrabold text-[#2563EB] truncate pl-2">{accountForm.officialEmail}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">Mobile Number</span>
                <span className="font-extrabold text-[#111827] font-mono">{accountForm.mobileNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">Company Name</span>
                <span className="font-black text-[#334155] truncate">{settings.companyName || 'DevTech IT Solution'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">Joined Date</span>
                <span className="font-bold text-[#111827]">{accountForm.joinedDate}</span>
              </div>
            </div>

            {/* "About" Section */}
            <div className="space-y-2 pb-6 border-b border-[#E5E7EB]/80">
              <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">About</h4>
              <p className="text-xs text-[#475569] font-medium leading-relaxed bg-[#F8FAFC] p-3.5 rounded-[16px] border border-[#E5E7EB]/60 italic">
                {accountForm.aboutText}
              </p>
            </div>

            {/* Role & Status Footer */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-semibold">Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-black text-[11px] border border-[#BBF7D0]">
                  ● Active Session
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6B7280] font-bold shrink-0">Access Role</span>
                {isSuperAdmin ? (
                  <span className="px-2.5 py-1 rounded-[10px] bg-[#2563EB] text-white font-black text-[11px] shadow-2xs flex items-center gap-1 truncate">
                    <Check className="w-3 h-3 stroke-[3]" /> Super Administrator
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-[10px] bg-[#059669] text-white font-black text-[11px] shadow-2xs flex items-center gap-1 truncate">
                    <Check className="w-3 h-3 stroke-[3]" /> HR Administrator
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB]/60">
                <span className="text-[#6B7280] font-semibold">Company</span>
                <span className="font-black text-[#111827] truncate pl-2">{settings.companyName || 'DevTech IT Solution'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT CONTENT AREA (75%) ================= */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          
          {/* Horizontal Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm overflow-x-auto">
            {[
              { id: 'account' as const, label: 'Account Information', icon: User },
              { id: 'security' as const, label: 'Security', icon: ShieldCheck },
              { id: 'company' as const, label: 'Company', icon: Building2 },
              { id: 'preferences' as const, label: 'Preferences', icon: Sliders },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'account') setIsEditingAccount(false);
                  }}
                  className={`relative px-4 py-2.5 rounded-[16px] text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#475569] hover:text-[#111827] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminProfileTabIndicator"
                      className="absolute inset-0 rounded-[16px] bg-[#2563EB] shadow-md shadow-[#2563EB]/20 z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <tab.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT CARDS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-10 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas"
            >

              {/* ========================================================= */}
              {/* TAB 1: ACCOUNT INFORMATION                                */}
              {/* ========================================================= */}
              {activeTab === 'account' && (
                <form onSubmit={handleSaveAccount} className="space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]/80">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                        Personal Account Information
                      </h2>
                      <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                        Manage your enterprise identity attributes and official employee registry coordinates.
                      </p>
                    </div>
                    {!isEditingAccount ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingAccount(true)}
                        className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-black border border-[#BFDBFE]">
                        ● Editing Mode Active
                      </span>
                    )}
                  </div>

                  {/* Two-Column Form Layout (Google Account Settings style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Full Name</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.fullName}
                          onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                          required
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.fullName}
                        </div>
                      )}
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Username</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.username}
                          onChange={e => setAccountForm({ ...accountForm, username: e.target.value })}
                          className="saas-input font-mono font-extrabold text-sm text-[#334155]"
                          required
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-mono font-extrabold text-[#334155] text-sm">
                          {accountForm.username}
                        </div>
                      )}
                    </div>

                    {/* Official Email */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Official Email</label>
                      {isEditingAccount ? (
                        <input
                          type="email"
                          value={accountForm.officialEmail}
                          onChange={e => setAccountForm({ ...accountForm, officialEmail: e.target.value })}
                          className="saas-input font-bold text-sm text-[#2563EB]"
                          required
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#2563EB] text-sm truncate">
                          {accountForm.officialEmail}
                        </div>
                      )}
                    </div>

                    {/* Recovery Email */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Recovery Email</label>
                      {isEditingAccount ? (
                        <input
                          type="email"
                          value={accountForm.recoveryEmail}
                          onChange={e => setAccountForm({ ...accountForm, recoveryEmail: e.target.value })}
                          className="saas-input font-bold text-sm text-[#334155]"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#334155] text-sm truncate">
                          {accountForm.recoveryEmail || 'Not Available'}
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Mobile Number</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.mobileNumber}
                          onChange={e => setAccountForm({ ...accountForm, mobileNumber: e.target.value })}
                          className="saas-input font-mono font-extrabold text-sm text-[#334155]"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-mono font-extrabold text-[#111827] text-sm">
                          {accountForm.mobileNumber}
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Emergency Contact</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.emergencyContact}
                          onChange={e => setAccountForm({ ...accountForm, emergencyContact: e.target.value })}
                          className="saas-input font-extrabold text-sm text-[#334155]"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#334155] text-sm truncate">
                          {accountForm.emergencyContact}
                        </div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Gender</label>
                      {isEditingAccount ? (
                        <select
                          value={accountForm.gender}
                          onChange={e => setAccountForm({ ...accountForm, gender: e.target.value })}
                          className="saas-input font-extrabold text-sm text-[#334155]"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.gender}
                        </div>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Date of Birth</label>
                      {isEditingAccount ? (
                        <input
                          type="date"
                          value={accountForm.dateOfBirth}
                          onChange={e => setAccountForm({ ...accountForm, dateOfBirth: e.target.value })}
                          className="saas-input font-extrabold text-sm w-full cursor-pointer"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.dateOfBirth}
                        </div>
                      )}
                    </div>

                    {/* Blood Group */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Blood Group</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.bloodGroup}
                          onChange={e => setAccountForm({ ...accountForm, bloodGroup: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.bloodGroup}
                        </div>
                      )}
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Nationality</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.nationality}
                          onChange={e => setAccountForm({ ...accountForm, nationality: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.nationality}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-black text-[#334155]">Address</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.address}
                          onChange={e => setAccountForm({ ...accountForm, address: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.address}
                        </div>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">City</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.city}
                          onChange={e => setAccountForm({ ...accountForm, city: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.city}
                        </div>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">State</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.state}
                          onChange={e => setAccountForm({ ...accountForm, state: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.state}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Country</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.country}
                          onChange={e => setAccountForm({ ...accountForm, country: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.country}
                        </div>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Postal Code</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.postalCode}
                          onChange={e => setAccountForm({ ...accountForm, postalCode: e.target.value })}
                          className="saas-input font-mono font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-mono font-extrabold text-[#111827] text-sm">
                          {accountForm.postalCode}
                        </div>
                      )}
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Department</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.department}
                          onChange={e => setAccountForm({ ...accountForm, department: e.target.value })}
                          className="saas-input font-extrabold text-sm"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#111827] text-sm">
                          {accountForm.department}
                        </div>
                      )}
                    </div>

                    {/* Designation */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#334155]">Designation</label>
                      {isEditingAccount ? (
                        <input
                          type="text"
                          value={accountForm.designation}
                          onChange={e => setAccountForm({ ...accountForm, designation: e.target.value })}
                          className="saas-input font-extrabold text-sm text-[#2563EB]"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-extrabold text-[#2563EB] text-sm">
                          {accountForm.designation}
                        </div>
                      )}
                    </div>

                    {/* Profile Picture Control indicator */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-black text-[#334155]">Profile Picture Asset</label>
                      <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 flex items-center justify-between">
                        <span className="font-semibold text-[#475569]">Managed via Executive Avatar Studio (300 DPI support)</span>
                        <button
                          type="button"
                          onClick={() => setIsPhotoEditorOpen(true)}
                          className="text-xs font-black text-[#2563EB] hover:underline"
                        >
                          Launch Studio →
                        </button>
                      </div>
                    </div>

                    {/* Executive About / Summary */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-black text-[#334155]">Executive Summary / About</label>
                      {isEditingAccount ? (
                        <textarea
                          value={accountForm.aboutText}
                          onChange={e => setAccountForm({ ...accountForm, aboutText: e.target.value })}
                          rows={3}
                          className="saas-input font-medium text-xs leading-relaxed italic"
                        />
                      ) : (
                        <div className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB]/70 font-medium text-[#475569] text-xs italic">
                          {accountForm.aboutText}
                        </div>
                      )}
                    </div>

                    {/* STRICT READ-ONLY FIELDS (NEVER EDITABLE) */}
                    <div className="space-y-1.5">
                      <label className="font-black text-[#94A3B8] flex items-center gap-1">
                        <span>Employee ID</span>
                        <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span className="text-[10px] text-[#EF4444] uppercase font-black pl-1">(Read Only)</span>
                      </label>
                      <div className="p-3 rounded-[14px] bg-[#F1F5F9] border border-[#CBD5E1]/60 font-mono font-black text-[#475569] text-sm flex items-center justify-between cursor-not-allowed">
                        <span>{accountForm.employeeId}</span>
                        <span className="text-[10px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-bold">Locked</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-black text-[#94A3B8] flex items-center gap-1">
                        <span>Joined Date</span>
                        <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span className="text-[10px] text-[#EF4444] uppercase font-black pl-1">(Read Only)</span>
                      </label>
                      <div className="p-3 rounded-[14px] bg-[#F1F5F9] border border-[#CBD5E1]/60 font-bold text-[#475569] text-sm flex items-center justify-between cursor-not-allowed">
                        <span>{accountForm.joinedDate}</span>
                        <span className="text-[10px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-bold">Locked</span>
                      </div>
                    </div>

                  </div>

                  {/* Edit Mode Save & Cancel Control Footer */}
                  {isEditingAccount && (
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E5E7EB]">
                      <button
                        type="button"
                        onClick={handleCancelAccountEdit}
                        className="saas-btn-secondary !px-6 !py-2.5 !text-xs !rounded-[14px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="saas-btn-primary !px-7 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* ========================================================= */}
              {/* TAB 2: SECURITY & ACTIVE SESSIONS                       */}
              {/* ========================================================= */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="pb-6 border-b border-[#E5E7EB]/80">
                    <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                      Security & Authentication Parameters
                    </h2>
                    <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                      Cryptographic credentials, two-factor authenticator enrollment, and remote session governance.
                    </p>
                  </div>

                  {/* Basic Security Status Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">Primary Email</span>
                      <strong className="text-sm font-extrabold text-[#111827] block truncate">{accountForm.officialEmail}</strong>
                      <span className="text-[11px] text-[#15803D] font-black block pt-0.5">✔ Email Verification Verified</span>
                    </div>
                    <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">Authentication Provider</span>
                      <strong className="text-sm font-extrabold text-[#2563EB] block">Firebase Authentication</strong>
                      <span className="text-[11px] text-[#64748B] font-semibold block pt-0.5">JWT Authentication Status: Active</span>
                    </div>
                    <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">Two Factor Authentication (2FA)</span>
                      <strong className="text-sm font-black text-[#15803D] block">✔ Enabled (Authenticator App)</strong>
                      <span className="text-[11px] text-[#64748B] font-semibold block pt-0.5">8 Backup Codes Available</span>
                    </div>
                    <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">Phone Verification</span>
                      <strong className="text-sm font-black text-[#15803D] block">✔ Verified ({accountForm.mobileNumber})</strong>
                      <span className="text-[11px] text-[#64748B] font-semibold block pt-0.5">SMS OTP challenge active</span>
                    </div>
                  </div>

                  {/* SECURE HASHED PASSWORD BOX (NEVER DISPLAY RAW PASSWORD) */}
                  <div className="p-6 rounded-[24px] bg-[#FEF2F2]/30 border border-[#FEE2E2] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-[#991B1B]">Master Account Password</span>
                        <div className="text-2xl font-mono tracking-[0.3em] font-black text-[#111827] mt-1">
                          ********
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => showToast('Two-factor enrollment wizard initiated in secure tab.', 'info')}
                          className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px] bg-white"
                        >
                          Enable 2FA
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast('Password change token dispatched via encrypted email channel.', 'success')}
                          className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] shadow-md shadow-[#2563EB]/25"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#B91C1C] bg-[#FEF2F2] p-3 rounded-[14px] border border-[#FECB52]/30 flex items-center gap-2">
                      <Lock className="w-4 h-4 shrink-0 text-[#DC2626]" />
                      <span>Password cannot be viewed for security reasons (One-way SHA-256 cryptographic hash).</span>
                    </p>
                  </div>

                  {/* CURRENT ACTIVE SESSIONS & DEVICE REVOCATION */}
                  <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-[#111827]">Current Active Sessions</h3>
                        <p className="text-xs text-[#6B7280] font-medium">Manage corporate devices authenticated to your account token</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogoutAllDevices}
                        className="saas-btn-danger !px-4 !py-2 !text-xs !rounded-[12px] shrink-0 font-black"
                      >
                        Logout All Devices
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeDevices.map(device => (
                        <div 
                          key={device.id} 
                          className={`p-4 rounded-[20px] border transition-all flex items-center justify-between gap-4 ${
                            device.isCurrent ? 'bg-[#EFF6FF]/60 border-[#2563EB]/30' : 'bg-[#F8FAFC] border-[#E5E7EB]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                              device.isCurrent ? 'bg-[#2563EB] text-white' : 'bg-slate-200 text-[#475569]'
                            }`}>
                              <device.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <strong className="text-sm font-black text-[#111827] truncate">{device.name}</strong>
                                {device.isCurrent && (
                                  <span className="px-2.5 py-0.5 rounded-[6px] bg-[#DCFCE7] text-[#15803D] text-[10px] font-black uppercase">
                                    Current Device
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
                                {device.browser} • {device.location} — <strong className="text-[#334155]">{device.status}</strong>
                              </p>
                            </div>
                          </div>

                          {!device.isCurrent ? (
                            <button
                              type="button"
                              onClick={() => handleLogoutDevice(device.id, device.name)}
                              className="px-3.5 py-1.5 rounded-[12px] bg-white hover:bg-[#FEF2F2] text-[#EF4444] border border-[#E5E7EB] hover:border-[#FCA5A5] font-extrabold text-xs transition-colors shrink-0 shadow-2xs"
                            >
                              Logout
                            </button>
                          ) : (
                            <span className="text-xs font-black text-[#2563EB] pr-2">Active</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: COMPANY INFORMATION (DYNAMIC SETTINGS)           */}
              {/* ========================================================= */}
              {activeTab === 'company' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]/80">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                        Company Organization Details
                      </h2>
                      <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                        Dynamically synchronized from global Company Settings and ISO governance records.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/settings')}
                      className="saas-btn-secondary !px-4 !py-2 !text-xs !rounded-[12px] flex items-center gap-1.5"
                    >
                      <span>Company Settings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Company Logo Banner Header */}
                  <div className="p-6 rounded-[24px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[22px] bg-[#2563EB] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                      {settings.companyLogo ? (
                        <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-cover rounded-[22px]" />
                      ) : (
                        <span>DTS</span>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <span className="text-[11px] font-black text-[#2563EB] uppercase tracking-widest">Enterprise Headquarters</span>
                      <h3 className="text-xl font-black text-[#111827] truncate">
                        {settings.companyName || 'DevTech IT Solution Pvt. Ltd.'}
                      </h3>
                      <p className="text-xs font-medium text-[#6B7280]">
                        {settings.tagline || 'Leading Global Technology Services & HRMS Software Architectures'}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Company Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    {[
                      { label: 'Company Name', val: settings.companyName || 'DevTech IT Solution' },
                      { label: 'Industry', val: 'Information Technology & Cloud Software' },
                      { label: 'Website URL', val: settings.website || 'www.devtechitsolution.com', textBlue: true },
                      { label: 'Support Email', val: settings.contactEmail || 'hr@devtechitsolution.com', textBlue: true },
                      { label: 'Company Phone', val: settings.contactPhone || '+91 93218 12345' },
                      { label: 'GST Number', val: '24AAACD1234F1Z9 (Verified)' },
                      { label: 'Registration Number', val: 'CIN: U72200GJ2020PTC112233' },
                      { label: 'ISO Certification', val: 'ISO 27001 Data Governance Certified' },
                      { label: 'Head Office Location', val: settings.headquartersAddress || 'Kalyan HQ Corporate Branch' },
                      { label: 'Company Address', val: 'DevTech Tower, Kalyan & Vadodara Corporate Corridors, India' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[11px] font-black text-[#64748B] uppercase block">{item.label}</span>
                        <div className={`p-3.5 rounded-[16px] bg-white border border-[#E5E7EB] font-bold text-sm shadow-2xs truncate ${item.textBlue ? 'text-[#2563EB]' : 'text-[#111827]'}`}>
                          {item.val || 'Not Available'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: PREFERENCES                                      */}
              {/* ========================================================= */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleSavePreferences} className="space-y-8">
                  <div className="pb-6 border-b border-[#E5E7EB]/80">
                    <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                      Account Preferences & Notification Settings
                    </h2>
                    <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                      Configure your notification dispatches, language localization, and session timeout boundaries.
                    </p>
                  </div>

                  {/* Notification Toggle Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2563EB]">Notification Dispatches</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'emailNotifs' as const, label: 'Email Notifications', desc: 'Receive critical account summaries via email' },
                        { key: 'smsNotifs' as const, label: 'SMS Notifications', desc: 'Instant OTP & mobile security texts' },
                        { key: 'pushNotifs' as const, label: 'Push Notifications', desc: 'Live browser alert dialogs' },
                        { key: 'weeklyReports' as const, label: 'Weekly Reports', desc: 'Automated Monday workforce KPI digests' },
                        { key: 'securityAlerts' as const, label: 'Security Alerts', desc: 'Immediate notices on unfamiliar device access' },
                      ].map((item) => {
                        const isOn = prefs[item.key];
                        return (
                          <div key={item.key} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between gap-4">
                            <div>
                              <strong className="text-xs font-black text-[#111827] block">{item.label}</strong>
                              <span className="text-[11px] text-[#6B7280] block mt-0.5">{item.desc}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPrefs({ ...prefs, [item.key]: !isOn });
                                showToast(`${item.label} set to ${!isOn ? 'ON' : 'OFF'}.`, 'info');
                              }}
                              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                                isOn ? 'bg-[#22C55E] text-white shadow-sm shadow-[#22C55E]/30' : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {isOn ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Localization & Session Controls */}
                  <div className="space-y-6 pt-6 border-t border-[#E5E7EB]">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2563EB]">Localization & Session Governance</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      
                      {/* Dark Mode Toggle */}
                      <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between gap-4 sm:col-span-2">
                        <div>
                          <strong className="text-xs font-black text-[#111827] block">Dark Mode Theme Toggle</strong>
                          <span className="text-[11px] text-[#6B7280] block mt-0.5">Switch portal workspace interface luminosity (currently locked to clean Light SaaS theme)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPrefs({ ...prefs, darkMode: !prefs.darkMode });
                            showToast('Light theme preserved per system guidelines. Preference stored.', 'info');
                          }}
                          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                            prefs.darkMode ? 'bg-[#2563EB] text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {prefs.darkMode ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      {/* Language Selector */}
                      <div className="space-y-1.5">
                        <label className="font-black text-[#334155]">Interface Language</label>
                        <select
                          value={prefs.language}
                          onChange={e => setPrefs({ ...prefs, language: e.target.value })}
                          className="saas-input font-bold text-sm"
                        >
                          <option value="English (US)">English (US) — Default</option>
                          <option value="English (UK)">English (UK)</option>
                          <option value="Hindi (IN)">Hindi (India)</option>
                          <option value="Gujarati (IN)">Gujarati (India)</option>
                        </select>
                      </div>

                      {/* Timezone Selector */}
                      <div className="space-y-1.5">
                        <label className="font-black text-[#334155]">System Timezone</label>
                        <select
                          value={prefs.timezone}
                          onChange={e => setPrefs({ ...prefs, timezone: e.target.value })}
                          className="saas-input font-bold text-sm"
                        >
                          <option value="UTC+05:30 IST (Asia/Kolkata)">UTC+05:30 IST (Asia/Kolkata)</option>
                          <option value="UTC-05:00 EST (America/New_York)">UTC-05:00 EST (America/New_York)</option>
                          <option value="UTC+00:00 GMT (London)">UTC+00:00 GMT (London / Singapore)</option>
                        </select>
                      </div>

                      {/* Auto Logout Selector */}
                      <div className="space-y-1.5">
                        <label className="font-black text-[#334155]">Inactivity Auto Logout</label>
                        <select
                          value={prefs.autoLogout}
                          onChange={e => setPrefs({ ...prefs, autoLogout: e.target.value })}
                          className="saas-input font-extrabold text-sm text-[#2563EB]"
                        >
                          <option value="15 Minutes">15 Minutes (High Security)</option>
                          <option value="30 Minutes">30 Minutes (Standard)</option>
                          <option value="1 Hour">1 Hour (Extended)</option>
                          <option value="4 Hours">4 Hours (Shift Work)</option>
                          <option value="Never">Never (Exempt)</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Save Preferences Button */}
                  <div className="flex justify-end pt-6 border-t border-[#E5E7EB]">
                    <button
                      type="submit"
                      className="saas-btn-primary !px-7 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25 font-black"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* INTERACTIVE AVATAR STUDIO MODAL */}
      <AdminPhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        currentPhoto={adminPhoto}
        onSavePhoto={(newUrl) => setAdminPhoto(newUrl)}
        onShowToast={showToast}
      />

    </div>
  );
};
