import React, { useEffect, useState, useMemo } from 'react';
import { ClassItem } from '../../types/classTypes';
import { WheelCanvas } from '../wheel/WheelCanvas';
import { POINTER_ANGLE } from '../../utils/wheelGeometry';
import {
  formatPhotoUrl,
  extractGoogleDriveId,
  getGoogleDriveCandidates,
} from '../../utils/urlValidator';
import {
  getBgmVolumePercent,
  increaseBgmVolume,
  decreaseBgmVolume,
  onBgmVolumeChange,
} from '../../services/bgmService';
import { X, ImageOff, Sparkles, Volume2 } from 'lucide-react';

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
  const [bgmVolume, setBgmVolume] = useState<number>(() => getBgmVolumePercent());

  // Viewport tracking for intelligent photo sizing and mini wheel scaling
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mini wheel diameter tuned to available vertical height
  const miniWheelSize = useMemo(() => {
    if (viewportHeight < 750) return 115;
    if (viewportHeight < 880) return 130;
    return 145;
  }, [viewportHeight]);

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

  // Sync BGM volume with background service singleton
  useEffect(() => {
    setBgmVolume(getBgmVolumePercent());
    return onBgmVolumeChange((vol) => setBgmVolume(vol));
  }, [isOpen]);

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
      className="fixed inset-0 z-50 flex flex-col justify-between p-1 sm:p-2 md:p-2.5 overflow-hidden animate-fadeIn select-none text-white"
      style={{
        background: 'linear-gradient(135deg, #B8E9FF 0%, #B5F2F5 30%, #91E8E4 55%, #C8F2CE 80%, #FFF1A6 100%)',
      }}
      onClick={onClose}
    >
      {/* ========================================================
          PASTEL AQUA FANTASY – SOFT WATERCOLOR BLEND OVERLAYS
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

      {/* Ambient Twinkling Stars (Low opacity background depth) */}
      {[
        { top: '8%', left: '18%', size: 'w-3 h-3', color: '#FFD600', anim: 'animate-twinkle-1' },
        { top: '10%', right: '22%', size: 'w-3 h-3', color: '#FF4081', anim: 'animate-twinkle-2' },
        { top: '48%', left: '4%', size: 'w-3 h-3', color: '#00E5FF', anim: 'animate-twinkle-3' },
        { bottom: '18%', right: '8%', size: 'w-3 h-3', color: '#7C4DFF', anim: 'animate-twinkle-1' },
      ].map((star, i) => (
        <svg
          key={i}
          className={`absolute ${star.size} pointer-events-none select-none -z-10 ${star.anim}`}
          style={{ top: star.top, bottom: star.bottom, left: star.left, right: star.right, filter: `drop-shadow(0 0 6px ${star.color})` }}
          viewBox="0 0 24 24"
          fill={star.color}
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      ))}

      {/* ========================================================
          1. TOP BAR: BGM Volume (left) + Cute Star (center) + Close Button (right)
          Compact height (~36px) to maximize vertical space for the photo
          ======================================================== */}
      <div
        className="w-full flex items-center justify-between gap-2 px-2 sm:px-3 py-0.5 sm:py-1 flex-shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Audio Volume Controls (Tăng / Giảm Âm Lượng Nhạc Nền) */}
        <div className="inline-flex items-center gap-1 bg-[#1A0E3C]/85 backdrop-blur-sm border border-[#7C4DFF]/70 px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm text-xs font-black text-[#E0E7FF]">
          <Volume2 className="w-3.5 h-3.5 text-[#00D9F5]" />
          <span className="text-[#00D9F5]">BGM:</span>
          <button
            type="button"
            onClick={() => {
              const next = decreaseBgmVolume(10);
              setBgmVolume(next);
            }}
            disabled={bgmVolume <= 0}
            title="Giảm âm lượng (-10%)"
            aria-label="Decrease volume"
            className="w-5 h-5 flex items-center justify-center rounded bg-[#12092E] hover:bg-[#311B92] text-[#FFD600] font-black text-xs transition-all cursor-pointer disabled:opacity-30 active:scale-95"
          >
            -
          </button>
          <span className="w-7 text-center text-[#00E676]">{bgmVolume}%</span>
          <button
            type="button"
            onClick={() => {
              const next = increaseBgmVolume(10);
              setBgmVolume(next);
            }}
            disabled={bgmVolume >= 100}
            title="Tăng âm lượng (+10%)"
            aria-label="Increase volume"
            className="w-5 h-5 flex items-center justify-center rounded bg-[#12092E] hover:bg-[#311B92] text-[#00E676] font-black text-xs transition-all cursor-pointer disabled:opacity-30 active:scale-95"
          >
            +
          </button>
        </div>

        {/* 2. ICON: Cute Smiling Golden 3D Star (Icon 2) in Top Bar Safe Zone */}
        <div className="flex items-center gap-1.5 pointer-events-none select-none animate-pv-star">
          <svg
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 drop-shadow-[0_2px_10px_rgba(255,214,0,0.6)]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <defs>
              <radialGradient id="pvStarBody" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="35%" stopColor="#FFEE58" />
                <stop offset="75%" stopColor="#FFCA28" />
                <stop offset="100%" stopColor="#FF9800" />
              </radialGradient>
              <linearGradient id="pvStarBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFA000" />
              </linearGradient>
            </defs>
            <path
              d="M 50 6 L 61 33 L 90 35 L 67 54 L 74 83 L 50 68 L 26 83 L 33 54 L 10 35 L 39 33 Z"
              fill="url(#pvStarBody)"
              stroke="url(#pvStarBorder)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <ellipse cx="44" cy="36" rx="8" ry="4" transform="rotate(-15 44 36)" fill="#FFFFFF" opacity="0.5" />
            <circle cx="43" cy="46" r="3" fill="#2E1600" />
            <circle cx="42" cy="45" r="1.2" fill="#FFFFFF" />
            <circle cx="57" cy="46" r="3" fill="#2E1600" />
            <circle cx="56" cy="45" r="1.2" fill="#FFFFFF" />
            <circle cx="38" cy="52" r="3.5" fill="#FF5252" opacity="0.8" />
            <circle cx="62" cy="52" r="3.5" fill="#FF5252" opacity="0.8" />
            <path d="M 46 51 Q 50 56 54 51" stroke="#2E1600" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#FF9800] uppercase tracking-wider drop-shadow-sm hidden sm:inline">
            Lucky Star
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close photo view"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF4F91] to-[#E91E63] text-white font-black text-xs sm:text-sm px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border-2 border-[#FF80AB] shadow-[0_0_15px_rgba(255,79,145,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-4 h-4 text-white stroke-[3]" />
          <span>CLOSE (ESC)</span>
        </button>
      </div>

      {/* ========================================================
          2. MAIN CONTENT AREA: RESPONSIVE CSS GRID
          - Left: Exactly ONE Mini Wheel + Cute Planet + Schoolbooks + Winner Badge (150-170px)
          - Right (1fr): Auto-Fit Photo Container (Maximizes width and height with object-contain)
          - Gap: 12-16px on desktop (meets 12-20px specification)
          ======================================================== */}
      <div
        className="flex-1 w-full min-h-0 grid grid-cols-1 md:grid-cols-[145px_1fr] lg:grid-cols-[160px_1fr] xl:grid-cols-[170px_1fr] gap-3 sm:gap-4 lg:gap-4 px-1 sm:px-2 mt-0.5 mb-1.5 sm:mb-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EXACTLY ONE MINI WHEEL ON THE LEFT (Dedicated layout region, zero photo overlap) */}
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-around h-full py-0.5 px-0.5 flex-shrink-0 z-10">
          
          {/* 1. ICON: Cute Pastel Purple Planet with Colorful Ring (Upper Left) */}
          <div className="hidden md:flex items-center justify-center pointer-events-none select-none animate-pv-planet">
            <svg
              className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 drop-shadow-[0_4px_16px_rgba(179,136,255,0.6)]"
              viewBox="0 0 100 100"
              fill="none"
            >
              <defs>
                <radialGradient id="pvPurplePlanet" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#F3E5F5" />
                  <stop offset="40%" stopColor="#CE93D8" />
                  <stop offset="85%" stopColor="#9C27B0" />
                  <stop offset="100%" stopColor="#6A1B9A" />
                </radialGradient>
                <linearGradient id="pvColorfulRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9C4" />
                  <stop offset="35%" stopColor="#00E5FF" />
                  <stop offset="70%" stopColor="#FF80AB" />
                  <stop offset="100%" stopColor="#FFD54F" />
                </linearGradient>
              </defs>
              <g className="animate-pv-ring" style={{ transformOrigin: '50px 50px' }}>
                <ellipse cx="50" cy="50" rx="44" ry="14" stroke="url(#pvColorfulRing)" strokeWidth="6" opacity="0.9" strokeDasharray="120 120" strokeDashoffset="120" />
              </g>
              <circle cx="50" cy="50" r="28" fill="url(#pvPurplePlanet)" />
              <ellipse cx="42" cy="38" rx="10" ry="6" transform="rotate(-25 42 38)" fill="#FFFFFF" opacity="0.4" />
              <circle cx="42" cy="49" r="2.8" fill="#1A0738" />
              <circle cx="41" cy="48" r="1" fill="#FFFFFF" />
              <circle cx="58" cy="49" r="2.8" fill="#1A0738" />
              <circle cx="57" cy="48" r="1" fill="#FFFFFF" />
              <circle cx="39" cy="55" r="3.5" fill="#FF4081" opacity="0.85" />
              <circle cx="61" cy="55" r="3.5" fill="#FF4081" opacity="0.85" />
              <path d="M 45 54 Q 50 60 55 54" stroke="#1A0738" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <g className="animate-pv-ring" style={{ transformOrigin: '50px 50px' }}>
                <ellipse cx="50" cy="50" rx="44" ry="14" stroke="url(#pvColorfulRing)" strokeWidth="6" opacity="0.95" strokeDasharray="120 120" strokeDashoffset="0" />
              </g>
            </svg>
          </div>

          {/* Miniature Wheel Centerpiece */}
          <div className="w-20 sm:w-24 md:w-full max-w-[150px] aspect-square flex items-center justify-center my-0.5">
            <WheelCanvas
              items={classNames}
              rotationAngle={winningAngle}
              size={miniWheelSize}
              winningIndex={classes.findIndex((c) => c.id === selectedClass.id)}
              isSpotlightActive={true}
            />
          </div>

          {/* Small Winner Badge */}
          <div className="bg-[#1A0E3C] border-2 border-[#00D9F5] rounded-xl px-2.5 sm:px-3 py-1 shadow-[0_0_12px_rgba(0,217,245,0.35)] text-center my-0.5 flex-shrink-0">
            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#FFD600]">
              LUCKY WINNER
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-black text-white font-heading whitespace-nowrap">
              {selectedClass.name}
            </span>
          </div>

          {/* 3. ICON: Cute 3D Colorful Schoolbooks (Lower Left) */}
          <div className="hidden md:flex items-center justify-center pointer-events-none select-none animate-pv-books">
            <svg
              className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 drop-shadow-[0_6px_16px_rgba(0,184,212,0.5)]"
              viewBox="0 0 100 100"
              fill="none"
            >
              <defs>
                <linearGradient id="pvBookTeal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#0091EA" />
                </linearGradient>
                <linearGradient id="pvBookCoral" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF80AB" />
                  <stop offset="100%" stopColor="#E91E63" />
                </linearGradient>
                <linearGradient id="pvBookGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF59D" />
                  <stop offset="100%" stopColor="#FFB300" />
                </linearGradient>
              </defs>
              <rect x="18" y="66" width="64" height="15" rx="3.5" fill="url(#pvBookTeal)" stroke="#006064" strokeWidth="1.8" />
              <rect x="22" y="69" width="56" height="9" fill="#FFFDE7" />
              <line x1="22" y1="73.5" x2="78" y2="73.5" stroke="#E0E0E0" strokeWidth="1" />
              <rect x="22" y="50" width="58" height="14" rx="3" fill="url(#pvBookCoral)" stroke="#880E4F" strokeWidth="1.8" transform="rotate(3 51 57)" />
              <rect x="26" y="53" width="50" height="8" fill="#FFFDE7" transform="rotate(3 51 57)" />
              <rect x="26" y="35" width="52" height="13" rx="3" fill="url(#pvBookGold)" stroke="#E65100" strokeWidth="1.8" transform="rotate(-4 52 41)" />
              <circle cx="52" cy="41" r="3.5" fill="#FFFFFF" opacity="0.9" />
              <path d="M 66 40 L 71 58 L 66 54 L 61 58 Z" fill="#7C4DFF" />
            </svg>
          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: CENTERED CLASS TITLE + AUTO-FIT CLASS PHOTO
            - Takes 100% of remaining grid space (1fr)
            - Automatically maximizes photo in BOTH width & height
            - Strict object-fit: contain (no cropping, no stretching, no cutoffs)
            ======================================================== */}
        <div className="flex flex-col items-center justify-between h-full min-h-0 w-full overflow-hidden z-10">
          
          {/* DYNAMIC CLASS TITLE – CENTERED RELATIVE TO MAIN CLASS PHOTO CONTAINER */}
          {/* Positioned slightly higher, compact vertical footprint to maximize photo space */}
          <div className="w-full flex items-center justify-center mb-1 flex-shrink-0 z-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#1A0E3C]/95 border-2 sm:border-3 border-[#FFD600] px-5 sm:px-8 py-1 sm:py-1.5 rounded-full shadow-[0_0_24px_rgba(255,214,0,0.55),0_4px_16px_rgba(0,0,0,0.6)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD600] animate-spin flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] font-black text-[#FFD600] tracking-tight font-heading uppercase drop-shadow-[0_0_15px_rgba(255,214,0,0.85),0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap leading-none">
                {displayName}
              </h2>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD600] animate-spin flex-shrink-0" />
            </div>
          </div>

          {!hasValidPhotoUrl || loadError ? (
            /* Friendly placeholder for Class 5.8 / no photo */
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-[#170E3A]/90 rounded-3xl border-3 border-[#7C4DFF] shadow-[0_0_30px_rgba(124,77,255,0.4)] max-w-md my-auto animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-[#281559] text-[#00D9F5] border-2 border-[#00D9F5] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,217,245,0.4)]">
                <ImageOff className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 font-heading">
                Photo not available for Class {cleanNumber}
              </h3>
              <p className="text-[#B388FF] text-xs sm:text-sm font-bold leading-relaxed mb-3">
                A photo has not been uploaded for Class {cleanNumber} yet. You can upload one via Manage Classes.
              </p>
              <div className="inline-block bg-[#00D9F5]/20 border border-[#00D9F5] text-[#00D9F5] px-3.5 py-1 rounded-full text-xs font-black shadow-sm">
                ✨ No Default or Shared Photo Fallback
              </div>
            </div>
          ) : (
            /* SMART AUTO-FIT PHOTO CONTAINER: Expands to full remaining width and height */
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-0.5 overflow-hidden">
              <img
                src={activeImgSrc}
                alt={`Class ${cleanNumber} group photo`}
                onError={handleImageError}
                className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl md:rounded-3xl border-3 sm:border-4 border-[#FFD600] shadow-[0_0_36px_rgba(255,214,0,0.4),0_12px_30px_rgba(0,0,0,0.65)] select-none animate-fadeIn"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM BAR: Keyboard Hint (center) + Cute Rocket (right)
          Compact height (~28px) with no vertical overflow
          ======================================================== */}
      <div
        className="w-full flex items-center justify-between gap-2 px-2 sm:px-4 py-0.5 select-none flex-shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left balance spacer */}
        <div className="w-8 sm:w-16 md:w-24 flex-shrink-0" />

        {/* Center: Hint */}
        <div className="text-center flex-1">
          <span className="inline-block bg-[#170E3A]/85 border border-[#7C4DFF]/60 px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#E0E7FF] shadow-sm">
            Press <kbd className="bg-[#281559] text-[#00D9F5] px-1.5 py-0.5 rounded font-black border border-[#7C4DFF]">ESC</kbd> or click CLOSE to return to wheel
          </span>
        </div>

        {/* 4. ICON: Cute Miniature 3D Cartoon Rocket (Lower Right Safe Zone) */}
        <div className="w-8 sm:w-16 md:w-24 flex items-center justify-end flex-shrink-0 pointer-events-none select-none">
          <div className="animate-pv-rocket">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 drop-shadow-[0_2px_10px_rgba(255,112,67,0.5)]"
              viewBox="0 0 80 80"
              fill="none"
            >
              <defs>
                <linearGradient id="pvFlameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFEA00" />
                  <stop offset="60%" stopColor="#FF6D00" />
                  <stop offset="100%" stopColor="#FF1744" />
                </linearGradient>
              </defs>
              <g className="animate-pv-flame" style={{ transformOrigin: '40px 58px' }}>
                <path d="M 36 58 Q 28 76 34 78 Q 40 70 40 76 Q 42 70 46 78 Q 52 76 44 58 Z" fill="url(#pvFlameGrad)" filter="drop-shadow(0 0 6px #FF6D00)" />
              </g>
              <path d="M 28 45 L 18 58 L 30 55 Z" fill="#FF5252" stroke="#B71C1C" strokeWidth="1.2" />
              <path d="M 52 45 L 62 58 L 50 55 Z" fill="#FF5252" stroke="#B71C1C" strokeWidth="1.2" />
              <path d="M 40 10 C 30 24 28 44 30 58 L 50 58 C 52 44 50 24 40 10 Z" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.8" />
              <path d="M 40 10 C 35 18 33 24 33 28 L 47 28 C 47 24 45 18 40 10 Z" fill="#FF5252" />
              <circle cx="40" cy="38" r="7" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M 37 34 Q 40 33 43 36" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
