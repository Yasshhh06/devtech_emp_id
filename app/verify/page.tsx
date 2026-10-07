"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { parseVerificationIdFromUrl } from '@/services/qrService';
import { 
  QrCode, 
  Camera, 
  Upload, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Sparkles,
  Building2,
  AlertCircle
} from 'lucide-react';
import devtechLogo from '@/assets/devtech-logo.png';

export default function PublicVerifyScannerPage() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [scanningError, setScanningError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (activeTab === 'camera') {
      const containerId = 'public-qr-reader-container';
      const timer = setTimeout(() => {
        try {
          const html5QrCode = new Html5Qrcode(containerId);
          scannerRef.current = html5QrCode;

          html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 240, height: 240 },
            },
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            () => {
              // Ignore standard frame scan iterations
            }
          ).then(() => {
            setIsScanning(true);
            setScanningError(null);
          }).catch((err) => {
            console.warn('Camera initialization error:', err);
            setScanningError('Camera access unavailable. Please enable camera permissions, upload a QR card photo, or enter Employee ID manually.');
            setIsScanning(false);
          });
        } catch (e) {
          console.warn('QR scanner initialization error:', e);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      };
    }
  }, [activeTab]);

  const handleScanSuccess = (rawResult: string) => {
    const empId = parseVerificationIdFromUrl(rawResult);
    if (empId) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
      setStatusMessage(`Found ID: ${empId}. Redirecting to official verification record...`);
      setTimeout(() => {
        router.push(`/verify/${encodeURIComponent(empId)}`);
      }, 400);
    } else {
      setScanningError('Invalid QR Code. No valid DevTech Employee or Intern ID detected.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanningError(null);
      setStatusMessage('Scanning uploaded image for QR code...');
      try {
        const html5QrCode = new Html5Qrcode('public-qr-temp-reader');
        const result = await html5QrCode.scanFile(file, true);
        handleScanSuccess(result);
      } catch (err) {
        setStatusMessage('');
        setScanningError('Unable to detect QR code in uploaded image. Please ensure image is clear or enter Employee ID manually.');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim();
    if (!clean) return;
    const empId = parseVerificationIdFromUrl(clean);
    router.push(`/verify/${encodeURIComponent(empId)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans p-4 sm:p-8 flex flex-col items-center justify-center animate-fadeIn select-none">
      
      {/* Top Header Navigation */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/login')}
          className="text-xs font-extrabold text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>DevTech Portal Login</span>
        </button>
        <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-white text-[#6B7280] border border-[#E5E7EB] shadow-2xs flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-[#2563EB]" /> Official Verification Hub
        </span>
      </div>

      {/* Main Verification & Scanner Box */}
      <div className="bg-white w-full max-w-2xl rounded-[28px] border border-[#E5E7EB] shadow-saas-floating p-6 sm:p-8 space-y-6">
        
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]/80">
          <div className="flex items-center gap-3">
            <img src={devtechLogo.src} alt="DevTech Logo" className="h-10 sm:h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-extrabold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Official Identity Verification</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#111827]">
            Scan Employee or Intern ID Badge
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium max-w-md mx-auto">
            Scan the QR code printed on the identity card using your device camera, upload an image of the card, or enter the ID manually.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] gap-1 shadow-2xs">
          <button
            onClick={() => {
              setActiveTab('camera');
              setScanningError(null);
              setStatusMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-[12px] flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-white text-[#2563EB] shadow-md shadow-black/5 border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scanner</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              setScanningError(null);
              setStatusMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-[12px] flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-[#2563EB] shadow-md shadow-black/5 border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('manual');
              setScanningError(null);
              setStatusMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-[12px] flex items-center justify-center gap-2 transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-[#2563EB] shadow-md shadow-black/5 border border-[#E5E7EB]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Manual ID</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full max-w-[320px] h-[280px] rounded-[24px] overflow-hidden bg-[#0F172A] border-4 border-[#2563EB] shadow-saas flex items-center justify-center">
                <div id="public-qr-reader-container" className="w-full h-full"></div>
                
                {/* Viewfinder scanning frame */}
                <div className="absolute inset-0 border-4 border-[#3B82F6]/30 rounded-[20px] pointer-events-none flex items-center justify-center">
                  <div className="w-52 h-52 border-2 border-[#60A5FA] rounded-2xl animate-pulse flex items-center justify-center">
                    <div className="w-44 h-44 border border-[#93C5FD]/40 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {statusMessage ? (
                <div className="p-3 rounded-[14px] bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              ) : scanningError ? (
                <div className="p-3.5 rounded-[14px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-bold text-center max-w-md">
                  {scanningError}
                </div>
              ) : (
                <p className="text-xs font-bold text-[#6B7280] text-center">
                  Position the QR code on the ID card within the frame above.
                </p>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-[#CBD5E1] rounded-[24px] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111827]">Upload ID Card Photo or QR Image</h3>
                <p className="text-xs text-[#6B7280] font-medium mt-1">
                  Supports JPG, PNG, WEBP formats.
                </p>
              </div>

              {statusMessage ? (
                <div className="p-3 rounded-[14px] bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              ) : scanningError ? (
                <div className="p-3 rounded-[14px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-bold">
                  {scanningError}
                </div>
              ) : null}

              <label className="cursor-pointer px-6 py-3 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-lg shadow-[#2563EB]/25 transition-all">
                Select Card Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <div id="public-qr-temp-reader" className="hidden"></div>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4 p-2">
              <div>
                <label className="block text-xs font-extrabold text-[#374151] mb-2">
                  Enter Employee or Intern ID Code
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. DTS-EMP-DEV-0001 or DTS-INT-DEV-0001"
                  className="w-full px-4 py-3.5 rounded-[16px] bg-[#F8FAFC] border border-[#CBD5E1] text-[#111827] font-mono font-extrabold text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#2563EB] focus:outline-none shadow-2xs"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-[16px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-lg shadow-[#2563EB]/25 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Verify Credentials Now</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-[#E5E7EB]/80 text-center text-[11px] text-[#6B7280] font-bold">
          © DevTech IT Solution Pvt. Ltd. Corporate Verification Network
        </div>

      </div>
    </div>
  );
}
