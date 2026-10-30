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

      {/* ========================================================
          FOUR CUTE ANIMATED 3D CARTOON ICONS
          1. Upper-Left: Cute Purple Planet (~8s slow float & ring tilt)
          2. Upper-Right: Smiling Yellow Star (~4s gentle pulse & twinkle)
          3. Lower-Left: Colorful Schoolbooks (~6s gentle rocking float)
          4. Lower-Right: Cute Space Rocket (~5s hover & soft engine glow)
          ======================================================== */}
      {/* 1. Upper-Left: Cute Pastel Purple Planet with Colorful Ring */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-5 md:left-6 pointer-events-none select-none z-0 animate-pv-planet">
        <svg
          className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 drop-shadow-[0_4px_18px_rgba(179,136,255,0.65)]"
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
          {/* Back half of planetary ring */}
          <g className="animate-pv-ring" style={{ transformOrigin: '50px 50px' }}>
            <ellipse cx="50" cy="50" rx="44" ry="14" stroke="url(#pvColorfulRing)" strokeWidth="6" opacity="0.9" strokeDasharray="120 120" strokeDashoffset="120" />
          </g>
          {/* Planet sphere */}
          <circle cx="50" cy="50" r="28" fill="url(#pvPurplePlanet)" />
          {/* Gloss highlight */}
          <ellipse cx="42" cy="38" rx="10" ry="6" transform="rotate(-25 42 38)" fill="#FFFFFF" opacity="0.4" />
          {/* Kawaii Face */}
          <circle cx="42" cy="49" r="2.8" fill="#1A0738" />
          <circle cx="41" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="49" r="2.8" fill="#1A0738" />
          <circle cx="57" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="39" cy="55" r="3.5" fill="#FF4081" opacity="0.85" />
          <circle cx="61" cy="55" r="3.5" fill="#FF4081" opacity="0.85" />
          <path d="M 45 54 Q 50 60 55 54" stroke="#1A0738" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Front half of planetary ring */}
          <g className="animate-pv-ring" style={{ transformOrigin: '50px 50px' }}>
            <ellipse cx="50" cy="50" rx="44" ry="14" stroke="url(#pvColorfulRing)" strokeWidth="6" opacity="0.95" strokeDasharray="120 120" strokeDashoffset="0" />
          </g>
        </svg>
      </div>

      {/* 2. Upper-Right: Cute Smiling Golden 3D Star (Positioned clear of Close button) */}
      <div className="absolute top-2 right-36 sm:top-3 sm:right-44 md:top-4 md:right-56 pointer-events-none select-none z-0 animate-pv-star">
        <svg
          className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20"
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
          {/* 5-Point Rounded 3D Star */}
          <path
            d="M 50 6 L 61 33 L 90 35 L 67 54 L 74 83 L 50 68 L 26 83 L 33 54 L 10 35 L 39 33 Z"
            fill="url(#pvStarBody)"
            stroke="url(#pvStarBorder)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Specular Highlight */}
          <ellipse cx="44" cy="36" rx="8" ry="4" transform="rotate(-15 44 36)" fill="#FFFFFF" opacity="0.5" />
          {/* Cute Smiling Face */}
          <circle cx="43" cy="46" r="3" fill="#2E1600" />
          <circle cx="42" cy="45" r="1.2" fill="#FFFFFF" />
          <circle cx="57" cy="46" r="3" fill="#2E1600" />
          <circle cx="56" cy="45" r="1.2" fill="#FFFFFF" />
          <circle cx="38" cy="52" r="3.5" fill="#FF5252" opacity="0.8" />
          <circle cx="62" cy="52" r="3.5" fill="#FF5252" opacity="0.8" />
          <path d="M 46 51 Q 50 56 54 51" stroke="#2E1600" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 3. Lower-Left: Cute Stack of 3D Colorful Schoolbooks */}
      <div className="hidden sm:block absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 pointer-events-none select-none z-0 animate-pv-books">
        <svg
          className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 drop-shadow-[0_6px_18px_rgba(0,184,212,0.5)]"
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
          {/* Bottom Book (Cyan/Teal) */}
          <rect x="18" y="66" width="64" height="15" rx="3.5" fill="url(#pvBookTeal)" stroke="#006064" strokeWidth="1.8" />
          <rect x="22" y="69" width="56" height="9" fill="#FFFDE7" />
          <line x1="22" y1="73.5" x2="78" y2="73.5" stroke="#E0E0E0" strokeWidth="1" />
          {/* Middle Book (Coral Pink) */}
          <rect x="22" y="50" width="58" height="14" rx="3" fill="url(#pvBookCoral)" stroke="#880E4F" strokeWidth="1.8" transform="rotate(3 51 57)" />
          <rect x="26" y="53" width="50" height="8" fill="#FFFDE7" transform="rotate(3 51 57)" />
          {/* Top Book (Golden Yellow) */}
          <rect x="26" y="35" width="52" height="13" rx="3" fill="url(#pvBookGold)" stroke="#E65100" strokeWidth="1.8" transform="rotate(-4 52 41)" />
          <circle cx="52" cy="41" r="3.5" fill="#FFFFFF" opacity="0.9" />
          {/* Cute Bookmark Ribbon hanging down */}
          <path d="M 66 40 L 71 58 L 66 54 L 61 58 Z" fill="#7C4DFF" />
        </svg>
      </div>

      {/* 4. Lower-Right: Cute Miniature 3D Cartoon Rocket */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 pointer-events-none select-none z-0 animate-pv-rocket">
        <svg
          className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_4px_18px_rgba(255,112,67,0.55)]"
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
          {/* Engine Flame with Soft Glow */}
          <g className="animate-pv-flame" style={{ transformOrigin: '40px 58px' }}>
            <path d="M 36 58 Q 28 76 34 78 Q 40 70 40 76 Q 42 70 46 78 Q 52 76 44 58 Z" fill="url(#pvFlameGrad)" filter="drop-shadow(0 0 6px #FF6D00)" />
          </g>
          {/* Left and Right Fins */}
          <path d="M 28 45 L 18 58 L 30 55 Z" fill="#FF5252" stroke="#B71C1C" strokeWidth="1.2" />
          <path d="M 52 45 L 62 58 L 50 55 Z" fill="#FF5252" stroke="#B71C1C" strokeWidth="1.2" />
          {/* Rocket Fuselage */}
          <path d="M 40 10 C 30 24 28 44 30 58 L 50 58 C 52 44 50 24 40 10 Z" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.8" />
          {/* Red Nose Cone */}
          <path d="M 40 10 C 35 18 33 24 33 28 L 47 28 C 47 24 45 18 40 10 Z" fill="#FF5252" />
          {/* Porthole Window with Glass Reflection */}
          <circle cx="40" cy="38" r="7" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 37 34 Q 40 33 43 36" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ambient Twinkling Stars */}
      {[
        { top: '12%', left: '22%', size: 'w-3.5 h-3.5', color: '#FFD600', anim: 'animate-twinkle-1' },
        { top: '15%', right: '30%', size: 'w-3 h-3', color: '#FF4081', anim: 'animate-twinkle-2' },
        { top: '48%', left: '6%', size: 'w-3.5 h-3.5', color: '#00E5FF', anim: 'animate-twinkle-3' },
        { bottom: '26%', right: '10%', size: 'w-3.5 h-3.5', color: '#7C4DFF', anim: 'animate-twinkle-1' },
      ].map((star, i) => (
        <svg
          key={i}
          className={`absolute ${star.size} pointer-events-none select-none z-0 ${star.anim}`}
          style={{ top: star.top, bottom: star.bottom, left: star.left, right: star.right, filter: `drop-shadow(0 0 6px ${star.color})` }}
          viewBox="0 0 24 24"
          fill={star.color}
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      ))}

      {/* 1. TOP BAR: Volume Controls (left) + Close Button (right) */}
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 py-1 select-none flex-shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Audio Volume Controls (Tăng / Giảm Âm Lượng Nhạc Nền) */}
        <div className="inline-flex items-center gap-1 bg-[#1A0E3C]/80 backdrop-blur-sm border border-[#7C4DFF]/70 px-2.5 py-1 rounded-full shadow-sm text-xs font-black text-[#E0E7FF]">
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
            className="w-5 h-5 flex items-center justify-center rounded bg-[#12092E] hover:bg-[#311B92] text-[#FFD600] font-black text-xs transition-all cursor-pointer disabled:opacity-30"
          >
            -
          </button>
          <span className="w-8 text-center text-[#00E676]">{bgmVolume}%</span>
          <button
            type="button"
            onClick={() => {
              const next = increaseBgmVolume(10);
              setBgmVolume(next);
            }}
            disabled={bgmVolume >= 100}
            title="Tăng âm lượng (+10%)"
            aria-label="Increase volume"
            className="w-5 h-5 flex items-center justify-center rounded bg-[#12092E] hover:bg-[#311B92] text-[#00E676] font-black text-xs transition-all cursor-pointer disabled:opacity-30"
          >
            +
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close photo view"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF4F91] to-[#E91E63] text-white font-black text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-full border-2 border-[#FF80AB] shadow-[0_0_15px_rgba(255,79,145,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-4 h-4 text-white stroke-[3]" />
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

        {/* EXTRA-LARGE CLASS PHOTO AREA (~85% width, dominant element) */}
        <div className="flex-1 w-full md:w-[85%] lg:w-[84%] h-full min-h-0 flex flex-col items-center justify-center relative p-1 sm:p-2">
          
          {/* DYNAMIC CLASS TITLE – CENTERED RELATIVE TO MAIN CLASS PHOTO CONTAINER (+25% Font Size) */}
          <div className="w-full flex items-center justify-center mb-1.5 sm:mb-2 z-20 flex-shrink-0">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#1A0E3C]/95 border-2 sm:border-3 border-[#FFD600] px-6 sm:px-10 py-1.5 sm:py-2 rounded-full shadow-[0_0_28px_rgba(255,214,0,0.55),0_6px_20px_rgba(0,0,0,0.6)]">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD600] animate-spin flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#FFD600] tracking-tight font-heading uppercase drop-shadow-[0_0_15px_rgba(255,214,0,0.85),0_3px_6px_rgba(0,0,0,0.9)] whitespace-nowrap leading-none">
                {displayName}
              </h2>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD600] animate-spin flex-shrink-0" />
            </div>
          </div>

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
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
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
