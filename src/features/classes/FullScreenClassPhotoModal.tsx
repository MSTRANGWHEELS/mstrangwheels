import React, { useEffect, useState, useMemo } from 'react';
import { ClassItem } from '../../types/classTypes';
import { WheelCanvas } from '../wheel/WheelCanvas';
import { POINTER_ANGLE } from '../../utils/wheelGeometry';
import {
  formatPhotoUrl,
  extractGoogleDriveId,
  getGoogleDriveCandidates,
} from '../../utils/urlValidator';
import { X, ImageOff, Sparkles } from 'lucide-react';

interface FullScreenClassPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: ClassItem | null;
  classes: ClassItem[];
  rotationAngle?: number;
}

export const FullScreenClassPhotoModal: React.FC<FullScreenClassPhotoModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
  classes,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset load error state & candidate index immediately when selected class changes
  useEffect(() => {
    setLoadError(false);
    setCandidateIndex(0);
  }, [selectedClass?.id, selectedClass?.imageUrl]);

  const classNames = useMemo(() => classes.map((c) => c.name), [classes]);

  // Calculate stationary angle for mini wheel so winning segment points directly at top pointer
  const winningAngle = useMemo(() => {
    if (!selectedClass || classes.length === 0) return 0;
    const idx = classes.findIndex((c) => c.id === selectedClass.id);
    if (idx === -1) return 0;

    const segmentAngle = (Math.PI * 2) / classes.length;
    // Align segment center with POINTER_ANGLE (-PI/2)
    return POINTER_ANGLE - (idx + 0.5) * segmentAngle;
  }, [selectedClass, classes]);

  const driveCandidates = useMemo(() => {
    if (!selectedClass?.imageUrl) return [];
    const driveId = extractGoogleDriveId(selectedClass.imageUrl);
    return driveId ? getGoogleDriveCandidates(driveId) : [];
  }, [selectedClass?.imageUrl]);

  const activeImgSrc = useMemo(() => {
    if (!selectedClass?.imageUrl) return '';
    if (driveCandidates.length > 0) {
      return driveCandidates[candidateIndex] || driveCandidates[0];
    }
    return formatPhotoUrl(selectedClass.imageUrl);
  }, [selectedClass?.imageUrl, driveCandidates, candidateIndex]);

  const handleImageError = () => {
    if (driveCandidates.length > 0 && candidateIndex + 1 < driveCandidates.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setLoadError(true);
    }
  };

  if (!isOpen || !selectedClass) return null;

  const rawName = selectedClass.name.trim();
  const displayName = rawName.toUpperCase().startsWith('CLASS')
    ? rawName.toUpperCase()
    : `CLASS ${rawName.toUpperCase()}`;

  // Extract clean number e.g. "4.1" or "5.8"
  const cleanNumber = rawName.replace(/^class\s*/i, '').trim();

  // Explicit check: Must be a non-empty string and not a fallback
  const hasValidPhotoUrl = Boolean(activeImgSrc && activeImgSrc.length > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo of ${selectedClass.name}`}
      className="fixed inset-0 z-50 flex flex-col justify-between p-2 sm:p-4 overflow-hidden animate-fadeIn select-none text-white"
      style={{
        background: 'linear-gradient(135deg, #B8E9FF 0%, #B5F2F5 30%, #91E8E4 55%, #C8F2CE 80%, #FFF1A6 100%)',
      }}
      onClick={onClose}
    >
      {/* ========================================================
          PASTEL AQUA FANTASY – SOFT WATERCOLOR BLEND OVERLAYS
          - Pastel sky blue: #B8E9FF
          - Light aqua: #B5F2F5
          - Soft turquoise: #91E8E4
          - Mint green: #C8F2CE
          - Lemon yellow: #FFF1A6
          - Light lavender: #E2D5FF
          ======================================================== */}
      {/* Upper-Left: Light sky blue & Lavender */}
      <div
        className="absolute -top-24 -left-24 w-[560px] h-[560px] rounded-full blur-[90px] opacity-75 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B8E9FF 0%, #E2D5FF 40%, transparent 70%)' }}
      />
      {/* Upper-Right: Soft aqua & Lavender */}
      <div
        className="absolute -top-20 -right-20 w-[540px] h-[540px] rounded-full blur-[90px] opacity-75 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B5F2F5 0%, #91E8E4 45%, #E2D5FF 65%, transparent 80%)' }}
      />
      {/* Center: Pale turquoise blended with sky blue */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[100px] opacity-65 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #91E8E4 0%, #B8E9FF 35%, transparent 70%)' }}
      />
      {/* Lower-Left: Light mint green */}
      <div
        className="absolute -bottom-24 -left-20 w-[560px] h-[560px] rounded-full blur-[90px] opacity-75 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8F2CE 0%, #B5F2F5 45%, transparent 70%)' }}
      />
      {/* Lower-Right: Soft lemon yellow and mint with lavender highlights */}
      <div
        className="absolute -bottom-24 -right-20 w-[580px] h-[580px] rounded-full blur-[90px] opacity-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFF1A6 0%, #C8F2CE 40%, #E2D5FF 65%, transparent 85%)' }}
      />

      {/* 1. TOP BAR: Compact Header + Close Button */}
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 py-1.5 select-none flex-shrink-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Class Name Badge with Golden Glow */}
        <div className="inline-flex items-center gap-2 bg-[#1A0E3C] border-2 border-[#FFD600] px-4 sm:px-6 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,214,0,0.4)]">
          <Sparkles className="w-5 h-5 text-[#FFD600] animate-spin" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FFD600] tracking-tight font-heading uppercase drop-shadow-[0_0_8px_#FFD600]">
            {displayName}
          </h2>
          <Sparkles className="w-5 h-5 text-[#FFD600] animate-spin" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close photo view"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4F91] to-[#E91E63] text-white font-black text-sm sm:text-base px-4 sm:px-5 py-2 rounded-full border-2 border-[#FF80AB] shadow-[0_0_15px_rgba(255,79,145,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-white stroke-[3]" />
          <span>CLOSE (ESC)</span>
        </button>
      </div>

      {/* 2. MAIN CONTENT AREA: MINI WHEEL ON LEFT + EXTRA-LARGE PHOTO ON RIGHT */}
      <div
        className="flex-1 w-full max-w-7xl mx-auto min-h-0 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 my-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EXACTLY ONE MINI WHEEL ON THE LEFT (~14% width) */}
        <div className="w-full md:w-[15%] lg:w-[14%] flex flex-row md:flex-col items-center justify-center gap-2 flex-shrink-0 py-1">
          <div className="w-24 sm:w-28 md:w-full max-w-[150px] aspect-square flex items-center justify-center">
            <WheelCanvas
              items={classNames}
              rotationAngle={winningAngle}
              size={150}
              winningIndex={classes.findIndex((c) => c.id === selectedClass.id)}
              isSpotlightActive={true}
            />
          </div>

          {/* Small Winner Badge below mini wheel */}
          <div className="bg-[#1A0E3C] border-2 border-[#00D9F5] rounded-xl px-3 py-1 shadow-[0_0_12px_rgba(0,217,245,0.35)] text-center">
            <span className="block text-[9px] font-black uppercase tracking-wider text-[#FFD600]">
              LUCKY WINNER
            </span>
            <span className="block text-sm sm:text-base font-black text-white font-heading">
              {selectedClass.name}
            </span>
          </div>
        </div>

        {/* EXTRA-LARGE CLASS PHOTO AREA (~82% width, dominant element) */}
        <div className="flex-1 w-full md:w-[85%] lg:w-[84%] h-full min-h-0 flex items-center justify-center relative p-1 sm:p-2">
          {!hasValidPhotoUrl || loadError ? (
            /* Friendly placeholder for Class 5.8 / no photo */
            <div className="flex flex-col items-center justify-center p-8 sm:p-10 text-center bg-[#170E3A]/90 rounded-3xl border-3 border-[#7C4DFF] shadow-[0_0_30px_rgba(124,77,255,0.4)] max-w-md animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-[#281559] text-[#00D9F5] border-2 border-[#00D9F5] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,217,245,0.4)]">
                <ImageOff className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-heading">
                Photo not available for Class {cleanNumber}
              </h3>
              <p className="text-[#B388FF] text-xs sm:text-sm font-bold leading-relaxed mb-4">
                A photo has not been uploaded for Class {cleanNumber} yet. You can upload one via Manage Classes.
              </p>
              <div className="inline-block bg-[#00D9F5]/20 border border-[#00D9F5] text-[#00D9F5] px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
                ✨ No Default or Shared Photo Fallback
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center overflow-hidden">
              {/* Golden Celestial Frame */}
              <img
                src={activeImgSrc}
                alt={`Class ${cleanNumber} group photo`}
                onError={handleImageError}
                className="max-w-full max-h-full object-contain rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-[#FFD600] shadow-[0_0_40px_rgba(255,214,0,0.35),0_15px_35px_rgba(0,0,0,0.7)] select-none animate-fadeIn"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM HINT BAR */}
      <div
        className="text-center py-1 select-none flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-block bg-[#170E3A]/80 border border-[#7C4DFF]/60 px-4 py-1 rounded-full text-[11px] font-bold text-[#E0E7FF] shadow-sm">
          Press <kbd className="bg-[#281559] text-[#00D9F5] px-1.5 py-0.5 rounded font-black border border-[#7C4DFF]">ESC</kbd> or click CLOSE to return to wheel
        </span>
      </div>
    </div>
  );
};
