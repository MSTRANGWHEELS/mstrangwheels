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

      {/* ========================================================
          ANIMATED 3D CARTOON DECORATIONS IN PHOTO VIEWER
          - Top-Left: Cute Smiling 3D Yellow Sun (Rotating rays)
          - Top-Right: Pastel Purple Planet with glowing golden ring
          - Mid-Left: Cute Stack of 3D Colorful Schoolbooks (Rocking float)
          - Mid-Right: Friendly Cartoon Astronaut (Gentle float & tilt)
          - Bottom-Left: Cute Miniature Rocket (Hovering engine glow)
          - Bottom-Right: Small Turquoise Planet (Gentle float)
          - Surrounding: Tiny Twinkling Stars & Magical Sparkles
          ======================================================== */}
      {/* 1. Top-Left: Cute Smiling 3D Yellow Sun */}
      <div className="absolute top-2 left-3 sm:top-4 sm:left-6 md:top-5 md:left-8 pointer-events-none select-none z-0 animate-rotate-sun">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-[0_4px_16px_rgba(255,214,0,0.6)]" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="pvSun" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFDE7" />
              <stop offset="35%" stopColor="#FFEE58" />
              <stop offset="75%" stopColor="#FFCA28" />
              <stop offset="100%" stopColor="#FF9800" />
            </radialGradient>
            <linearGradient id="pvSunRay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
          </defs>
          {/* 8 Sun Beams */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <polygon key={deg} points="47,4 53,4 50,16" fill="url(#pvSunRay)" transform={`rotate(${deg} 50 50)`} opacity="0.9" />
          ))}
          <circle cx="50" cy="50" r="30" fill="url(#pvSun)" />
          <circle cx="42" cy="40" r="9" fill="#FFFFFF" opacity="0.4" />
          {/* Eyes & Smile */}
          <circle cx="41" cy="48" r="3.2" fill="#2E1600" />
          <circle cx="39.5" cy="46.5" r="1.2" fill="#FFFFFF" />
          <circle cx="59" cy="48" r="3.2" fill="#2E1600" />
          <circle cx="57.5" cy="46.5" r="1.2" fill="#FFFFFF" />
          <circle cx="37" cy="56" r="4" fill="#FF5252" opacity="0.7" />
          <circle cx="63" cy="56" r="4" fill="#FF5252" opacity="0.7" />
          <path d="M 42 55 Q 50 64 58 55" stroke="#2E1600" strokeWidth="2.4" strokeLinecap="round" fill="#FF1744" />
        </svg>
      </div>

      {/* 2. Top-Right: Cute Pastel Purple Planet with Glowing Ring */}
      <div className="absolute top-3 right-36 sm:top-4 sm:right-44 md:top-5 md:right-56 pointer-events-none select-none z-0 animate-float-planet">
        <svg className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 drop-shadow-[0_4px_16px_rgba(179,136,255,0.6)]" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="pvPurple" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#F3E5F5" />
              <stop offset="40%" stopColor="#CE93D8" />
              <stop offset="85%" stopColor="#9C27B0" />
              <stop offset="100%" stopColor="#6A1B9A" />
            </radialGradient>
            <linearGradient id="pvGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="50" rx="44" ry="14" transform="rotate(-20 50 50)" stroke="url(#pvGoldRing)" strokeWidth="6" opacity="0.9" strokeDasharray="120 120" strokeDashoffset="120" />
          <circle cx="50" cy="50" r="28" fill="url(#pvPurple)" />
          <ellipse cx="42" cy="38" rx="10" ry="6" transform="rotate(-25 42 38)" fill="#FFFFFF" opacity="0.35" />
          {/* Kawaii Face */}
          <circle cx="42" cy="49" r="2.8" fill="#1A0738" />
          <circle cx="41" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="49" r="2.8" fill="#1A0738" />
          <circle cx="57" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="39" cy="55" r="3.5" fill="#FF4081" opacity="0.8" />
          <circle cx="61" cy="55" r="3.5" fill="#FF4081" opacity="0.8" />
          <path d="M 45 54 Q 50 60 55 54" stroke="#1A0738" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="50" cy="50" rx="44" ry="14" transform="rotate(-20 50 50)" stroke="url(#pvGoldRing)" strokeWidth="6" opacity="0.9" strokeDasharray="120 120" strokeDashoffset="0" />
        </svg>
      </div>

      {/* 3. Mid-Left: Cute Stack of 3D Colorful Schoolbooks */}
      <div className="hidden sm:block absolute bottom-16 left-3 md:bottom-20 md:left-6 pointer-events-none select-none z-0 animate-rock-books">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-[0_6px_18px_rgba(0,184,212,0.45)]" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="bookTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0091EA" />
            </linearGradient>
            <linearGradient id="bookCoral" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF80AB" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
            <linearGradient id="bookGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
          </defs>
          {/* Bottom Book (Teal) */}
          <rect x="18" y="66" width="64" height="15" rx="3.5" fill="url(#bookTeal)" stroke="#006064" strokeWidth="1.5" />
          <rect x="22" y="69" width="56" height="9" fill="#FFFDE7" />
          <line x1="22" y1="73.5" x2="78" y2="73.5" stroke="#E0E0E0" strokeWidth="1" />
          {/* Middle Book (Coral Pink) */}
          <rect x="22" y="50" width="58" height="14" rx="3" fill="url(#bookCoral)" stroke="#880E4F" strokeWidth="1.5" transform="rotate(3 51 57)" />
          <rect x="26" y="53" width="50" height="8" fill="#FFFDE7" transform="rotate(3 51 57)" />
          {/* Top Book (Golden Yellow with cute star) */}
          <rect x="26" y="35" width="52" height="13" rx="3" fill="url(#bookGold)" stroke="#E65100" strokeWidth="1.5" transform="rotate(-4 52 41)" />
          <circle cx="52" cy="41" r="3.5" fill="#FFFFFF" opacity="0.9" />
          {/* Cute Bookmark Ribbon hanging down */}
          <path d="M 66 40 L 71 58 L 66 54 L 61 58 Z" fill="#7C4DFF" />
        </svg>
      </div>

      {/* 4. Mid-Right: Friendly Cartoon Astronaut */}
      <div className="hidden sm:block absolute top-1/3 right-3 md:right-6 pointer-events-none select-none z-0 animate-float-astronaut">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-[0_6px_18px_rgba(0,229,255,0.45)]" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="pvVisor" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#80D8FF" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0277BD" />
            </radialGradient>
          </defs>
          {/* Suit Body */}
          <ellipse cx="50" cy="62" rx="16" ry="18" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
          <rect x="43" y="57" width="14" height="8" rx="2.5" fill="#00E5FF" />
          {/* Waving Hand */}
          <path d="M 64 54 Q 78 44 74 34 Q 68 34 62 46" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="75" cy="35" r="4" fill="#FF4081" />
          {/* Helmet Dome */}
          <circle cx="50" cy="34" r="20" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="2" />
          <ellipse cx="50" cy="35" rx="14" ry="11" fill="url(#pvVisor)" />
          <ellipse cx="46" cy="30" rx="5" ry="3" transform="rotate(-20 46 30)" fill="#FFFFFF" opacity="0.65" />
          {/* Cute Face inside */}
          <circle cx="47" cy="36" r="1.5" fill="#FFFFFF" />
          <circle cx="53" cy="36" r="1.5" fill="#FFFFFF" />
          <path d="M 48 39 Q 50 41 52 39" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 5. Bottom-Left: Cute Miniature Rocket */}
      <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-14 md:bottom-5 md:left-24 pointer-events-none select-none z-0 animate-float-rocket">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 -rotate-12 drop-shadow-[0_4px_16px_rgba(255,112,67,0.5)]" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient id="pvFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFEA00" />
              <stop offset="60%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#FF1744" />
            </linearGradient>
          </defs>
          <path d="M 36 58 Q 28 76 34 78 Q 40 70 40 76 Q 42 70 46 78 Q 52 76 44 58 Z" fill="url(#pvFlame)" className="animate-pulse" />
          <path d="M 28 45 L 20 58 L 30 55 Z" fill="#FF5252" />
          <path d="M 52 45 L 60 58 L 50 55 Z" fill="#FF5252" />
          <path d="M 40 10 C 30 24 28 44 30 58 L 50 58 C 52 44 50 24 40 10 Z" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.5" />
          <path d="M 40 10 C 35 18 33 24 33 28 L 47 28 C 47 24 45 18 40 10 Z" fill="#FF5252" />
          <circle cx="40" cy="38" r="7" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </div>

      {/* 6. Bottom-Right: Small Cute Turquoise Planet */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-8 md:bottom-5 md:right-12 pointer-events-none select-none z-0 animate-float-planet-alt">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_4px_16px_rgba(0,229,255,0.45)]" viewBox="0 0 80 80" fill="none">
          <defs>
            <radialGradient id="pvTurq" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#E0F7FA" />
              <stop offset="40%" stopColor="#4DD0E1" />
              <stop offset="85%" stopColor="#00ACC1" />
              <stop offset="100%" stopColor="#006064" />
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="26" fill="url(#pvTurq)" />
          <circle cx="30" cy="32" r="5" fill="#80DEEA" opacity="0.6" />
          <circle cx="50" cy="38" r="6" fill="#00838F" opacity="0.6" />
          <circle cx="34" cy="42" r="2.2" fill="#004D40" />
          <circle cx="46" cy="42" r="2.2" fill="#004D40" />
          <circle cx="28" cy="47" r="3" fill="#FF80AB" opacity="0.75" />
          <circle cx="52" cy="47" r="3" fill="#FF80AB" opacity="0.75" />
          <path d="M 37 45 Q 40 49 43 45" stroke="#004D40" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 7. Tiny Twinkling Stars & Soft Magical Sparkles */}
      {[
        { top: '10%', left: '20%', size: 'w-4 h-4', color: '#FFD600', anim: 'animate-twinkle-1' },
        { top: '12%', right: '28%', size: 'w-3 h-3', color: '#FF4081', anim: 'animate-twinkle-2' },
        { top: '45%', left: '8%', size: 'w-4 h-4', color: '#00E5FF', anim: 'animate-twinkle-3' },
        { bottom: '24%', right: '12%', size: 'w-4 h-4', color: '#7C4DFF', anim: 'animate-twinkle-1' },
        { bottom: '15%', left: '22%', size: 'w-3 h-3', color: '#FFD600', anim: 'animate-twinkle-2' },
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
