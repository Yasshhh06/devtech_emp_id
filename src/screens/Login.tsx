"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEmployeeContext } from '../context/EmployeeContext';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const Login: React.FC = () => {
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login } = useAuth();
  const { showToast } = useEmployeeContext();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      await login(email, password);
      const isSup = email.toLowerCase().includes('admin') || email.toLowerCase().includes('super');
      showToast('Login Successful', 'success', `Welcome to DevTech ID Suite (${isSup ? 'Super Admin' : 'HR Admin'} Access)!`);
      router.replace('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid corporate login credentials or password.');
      showToast('Authentication Failed', 'error', 'Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div className="bg-white w-full max-w-4xl rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] shadow-saas-floating overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-fadeIn transition-all duration-300">
        
        {/* Left Side: Enterprise Value Proposition */}
        <div className="bg-gradient-to-br from-[#DBEAFE]/80 via-[#E0F2FE]/50 to-white p-5 sm:p-8 lg:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5E7EB] md:col-span-6">
          <div>
            <div className="flex items-center">
              <img 
                src="/login-logo.png" 
                alt="DevTech IT Solution Pvt Ltd" 
                className="w-[180px] sm:w-[240px] h-auto max-w-full object-contain object-left mix-blend-multiply drop-shadow-sm"
              />
            </div>

            <div className="mt-6 sm:mt-12 space-y-2 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] leading-tight tracking-tight">
                Modern Employee Identity & Smart Badging.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed hidden sm:block">
                Manage corporate staff onboarding, generate cryptographic PVC CR80 credentials, and verify external QR turnstile taps with zero-PII security.
              </p>
            </div>
          </div>

          <div className="hidden sm:space-y-2 pt-6 sm:pt-8 text-xs text-[#6B7280] font-bold border-t border-[#E5E7EB]/80 mt-6 sm:mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Microsoft & Google Style Minimal PVC Studios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Zebra Thermal Printer & Duplex Integration</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-5 max-h-[90vh] overflow-y-auto md:col-span-6">
          
          {loginError && (
            <div className="p-3.5 rounded-[14px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-extrabold animate-fadeIn">
              {loginError}
            </div>
          )}

          {/* SIGN IN FORM */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#111827]">Sign In to Workspace</h3>
              <p className="text-xs text-[#6B7280] font-medium">Enter your administrative HR credentials to open the dashboard.</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-extrabold text-[#111827]">Corporate Email or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yashm@gmail.com"
                  required
                  className="saas-input pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#111827]">Password</label>
                <span className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Forgot access key?</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="saas-input pl-10 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#6B7280] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="saas-btn-primary !w-full !py-3 !text-sm !rounded-[14px] shadow-md shadow-[#2563EB]/30 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Sign In to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>


          </form>

          <p className="text-center text-[10px] text-[#94A3B8] font-bold pt-2">
            Protected by DevTech IT Solution Cloud Security SLA & Zero-PII Gateway.
          </p>
        </div>

      </div>
    </div>
  );
};
