"use client";
import React, { useState } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photoUrl: string) => void;
  currentPhoto?: string;
  title?: string;
  subtitle?: string;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
];

export const PhotoCropperModal: React.FC<PhotoCropperModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  currentPhoto,
  title = 'Employee Photo Manager',
  subtitle = 'Upload or select corporate badge headshot',
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentPhoto || SAMPLE_AVATARS[0]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSelectPhoto(selectedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-devtech-500/10 text-devtech-500 dark:text-devtech-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Preview Box */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-40 h-48 rounded-xl overflow-hidden border-4 border-devtech-500 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Badge Size Preview (3:4 Portrait Ratio)
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs transition-colors">
              <Upload className="w-4 h-4 text-devtech-500" />
              Upload Photo From Device
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preset Corporate Avatars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sample Corporate Headshots
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {SAMPLE_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(avatar)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === avatar
                      ? 'border-devtech-500 ring-2 ring-devtech-500/30 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt={`Sample ${idx}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-devtech-600 hover:bg-devtech-700 text-white text-xs font-semibold shadow-lg shadow-devtech-600/30 transition-all"
          >
            <Check className="w-4 h-4" />
            Apply Photo
          </button>
        </div>
      </div>
    </div>
  );
};
