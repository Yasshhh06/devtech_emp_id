"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { parseVerificationIdFromUrl } from '../../services/qrService';
import { QrCode, X, Camera, Upload, Search, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useEmployeeContext } from '../../context/EmployeeContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { showToast } = useEmployeeContext();
  const [manualInput, setManualInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [scanningError, setScanningError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const containerId = 'qr-reader-container';
      const timer = setTimeout(() => {
        try {
          const html5QrCode = new Html5Qrcode(containerId);
          scannerRef.current = html5QrCode;

          html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
            },
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            (errorMessage) => {
              // Ignore standard frame scan errors
            }
          ).then(() => {
            setIsScanning(true);
            setScanningError(null);
          }).catch((err) => {
            console.warn('Camera access error:', err);
            setScanningError('Camera access unavailable. Try uploading QR image or manual ID entry.');
            setIsScanning(false);
          });
        } catch (e) {
          console.warn('QR initialization error:', e);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      };
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleScanSuccess = (rawResult: string) => {
    const empId = parseVerificationIdFromUrl(rawResult);
    if (empId) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
      showToast('QR Code Scanned!', 'success', `Redirecting to verification for ${empId}`);
      onClose();
      router.push(`/verify/${empId}`);
    } else {
      showToast('Invalid QR Code', 'error', 'No DevTech Employee ID detected in QR');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-temp');
        const result = await html5QrCode.scanFile(file, true);
        handleScanSuccess(result);
      } catch (err) {
        showToast('Unable to read QR code from file', 'error', 'Please try a clearer image');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim().toUpperCase();
    if (!clean) return;
    const empId = parseVerificationIdFromUrl(clean);
    onClose();
    router.push(`/verify/${empId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-devtech-600/10 text-devtech-600 dark:text-devtech-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">QR Code Scanner</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scan employee badge to verify</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 p-2 gap-1">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-slate-800 text-devtech-600 dark:text-devtech-400 shadow'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Camera
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-800 text-devtech-600 dark:text-devtech-400 shadow'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-800 text-devtech-600 dark:text-devtech-400 shadow'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Manual ID
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full max-w-[280px] h-[260px] rounded-2xl overflow-hidden bg-slate-950 border-2 border-devtech-500 flex items-center justify-center">
                <div id="qr-reader-container" className="w-full h-full"></div>

                {/* Overlay viewfinder box */}
                <div className="absolute inset-0 border-4 border-devtech-400/40 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-devtech-400 rounded-xl animate-pulse"></div>
                </div>
              </div>

              {scanningError ? (
                <p className="text-xs text-rose-500 text-center font-medium">{scanningError}</p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Position employee badge QR code within the camera frame
                </p>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-10 h-10 text-devtech-500 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Upload Employee Badge Photo or QR Image
              </p>
              <p className="text-[11px] text-slate-400 mb-4">Supports PNG, JPG, WEBP</p>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-devtech-600 hover:bg-devtech-700 text-white text-xs font-bold shadow-lg shadow-devtech-600/30 transition-all">
                Select QR Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <div id="qr-reader-temp" className="hidden"></div>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Employee ID (e.g., DTS-SDE-0001)
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="DTS-SDE-0001"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-devtech-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-devtech-600 hover:bg-devtech-700 text-white text-xs font-bold shadow-lg shadow-devtech-600/30 transition-all"
              >
                Verify Employee Record
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
