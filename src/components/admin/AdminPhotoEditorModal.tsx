"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Sliders 
} from 'lucide-react';

interface AdminPhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onSavePhoto: (newPhotoUrl: string | undefined) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
];

export const AdminPhotoEditorModal: React.FC<AdminPhotoEditorModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
  onShowToast
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    currentPhoto || PRESET_AVATARS[0]
  );
  const [zoom, setZoom] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedPhoto(event.target.result);
        setZoom(1);
        setPositionX(0);
        setPositionY(0);
        onShowToast('Image loaded into cropping studio.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto('');
    onShowToast('Avatar cleared. Will revert to company acronym monogram.', 'warning');
  };

  const handleSave = () => {
    onSavePhoto(selectedPhoto || undefined);
    onShowToast('Executive profile avatar updated across all corporate systems.', 'success');
    onClose();
  };

  const handleResetCrop = () => {
    setZoom(1);
    setPositionX(0);
    setPositionY(0);
    onShowToast('Crop view coordinates reset to center default.', 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[14px] bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Sliders className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111827]">Executive Avatar Studio</h3>
                <p className="text-xs text-[#6B7280] font-medium">Upload, crop, and scale your corporate identification photo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-[12px] hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Preview Studio */}
          <div className="flex flex-col items-center gap-5">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !selectedPhoto && fileInputRef.current?.click()}
              className={`relative w-48 h-48 rounded-[32px] overflow-hidden border-2 transition-all flex items-center justify-center shadow-md ${
                isDraggingOver
                  ? 'border-[#2563EB] bg-[#EFF6FF] scale-105'
                  : selectedPhoto
                  ? 'border-[#E5E7EB] bg-slate-900'
                  : 'border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] cursor-pointer'
              }`}
            >
              {selectedPhoto ? (
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedPhoto}
                    alt="Preview"
                    className="w-full h-full object-cover origin-center transition-transform duration-75"
                    style={{
                      transform: `scale(${zoom}) translate(${positionX}px, ${positionY}px)`,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <Upload className="w-8 h-8 text-[#94A3B8] mx-auto" />
                  <p className="text-xs font-extrabold text-[#475569]">Drag & Drop or Click</p>
                  <span className="text-[10px] text-[#94A3B8] block">300 DPI Recommended</span>
                </div>
              )}

              {isDraggingOver && (
                <div className="absolute inset-0 bg-[#2563EB]/20 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black">
                  Release to Load Photo
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Action Tools */}
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="saas-btn-secondary !px-4 !py-2 !text-xs !rounded-[12px] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
              {selectedPhoto && (
                <>
                  <button
                    onClick={handleResetCrop}
                    type="button"
                    title="Reset Coordinates"
                    className="p-2 rounded-[12px] border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#475569] transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRemovePhoto}
                    type="button"
                    title="Remove Photo"
                    className="p-2 rounded-[12px] border border-[#FECB52]/40 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] transition-colors shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Zoom & Crop Sliders */}
          {selectedPhoto && (
            <div className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#334155]">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Optical Zoom Level</span>
                  </span>
                  <span className="font-mono text-[#2563EB]">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-[#94A3B8] shrink-0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB]/60">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#64748B]">Horizontal Pan (X)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={positionX}
                    onChange={(e) => setPositionX(parseInt(e.target.value, 10))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-[#64748B]">Vertical Pan (Y)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={positionY}
                    onChange={(e) => setPositionY(parseInt(e.target.value, 10))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preset Executive Avatars */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-[#111827] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Enterprise Executive Presets</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((avatarUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(avatarUrl);
                    setZoom(1);
                    setPositionX(0);
                    setPositionY(0);
                  }}
                  className={`relative w-12 h-12 rounded-[14px] overflow-hidden border-2 transition-all ${
                    selectedPhoto === avatarUrl
                      ? 'border-[#2563EB] scale-105 shadow-md shadow-[#2563EB]/30 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E5E7EB] hover:border-[#94A3B8]'
                  }`}
                >
                  <img src={avatarUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Control Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="saas-btn-secondary !px-5 !py-2.5 !text-xs !rounded-[14px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-1.5 shadow-md shadow-[#2563EB]/25"
            >
              <Check className="w-4 h-4" />
              <span>Apply Executive Avatar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
