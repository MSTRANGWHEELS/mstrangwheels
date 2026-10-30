import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ClassItem, PhotoValidationStatus, StoredRoundData } from './types/classTypes';
import {
  loadStoredClasses,
  saveStoredClasses,
  loadSelectedClassId,
  saveSelectedClassId,
  loadStoredRound,
  saveStoredRound,
  resetStoredRound,
  safeStorage,
} from './services/storageService';
import { validateClassPhoto, isClassEligible } from './services/photoValidationService';
import { ClassManagerModal } from './features/classes/ClassManagerModal';
import { ClassResultCard } from './features/classes/ClassResultCard';
import { FullScreenClassPhotoModal } from './features/classes/FullScreenClassPhotoModal';
import { WheelCanvas } from './features/wheel/WheelCanvas';
import { useWheel } from './features/wheel/useWheel';
import { CuteButton } from './components/ui/CuteButton';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { CartoonLandscapeBackground } from './components/ui/CartoonLandscapeBackground';
import { playVictorySound } from './utils/soundEffects';
import { announceWinner, stopVoice } from './services/voiceService';
import { initBgm, setBgmEnabled, setBgmScreen } from './services/bgmService';
import { Volume2, VolumeX, Settings, Sparkles, Play, PlusCircle, RotateCw } from 'lucide-react';

export function App() {
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const { classes: storedClasses } = loadStoredClasses();
    return storedClasses;
  });
  const [validationMap, setValidationMap] = useState<Record<string, PhotoValidationStatus>>({});
  const [roundData, setRoundData] = useState<StoredRoundData>(() => loadStoredRound());
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // =========================================================================
  // SINGLE SOURCE OF TRUTH FOR WINNER & GOLDEN SPOTLIGHT
  // =========================================================================
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [isSpotlightActive, setIsSpotlightActive] = useState<boolean>(false);
  const [displayedWheelClasses, setDisplayedWheelClasses] = useState<ClassItem[]>([]);

  // Toast notification helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Initial Load & Selected Class Restore
  useEffect(() => {
    try {
      const { classes: storedClasses, error } = loadStoredClasses();
      if (error) {
        addToast({
          type: 'error',
          title: 'Storage Warning',
          message: error,
        });
      }

      setClasses(storedClasses);
      setRoundData(loadStoredRound());

      const savedId = loadSelectedClassId();
      if (savedId && storedClasses.some((c) => c.id === savedId)) {
        setSelectedClassId(savedId);
      }

      // Initialize gentle background music (10% default volume on wheel, looped)
      initBgm(soundEnabled);
    } catch (err) {
      console.warn('Initial storage or audio load error caught gracefully:', err);
    }
  }, [addToast]);

  // Screen-based BGM volume control:
  // Wheel screen: exactly 10% (0.10)
  // Photo viewer modal: exactly 15% (0.15) with smooth 0.5s fade
  useEffect(() => {
    setBgmScreen(isPhotoModalOpen ? 'photo' : 'wheel', 500);
  }, [isPhotoModalOpen]);

  // 2. Real-Time Photo Validation for All Classes
  useEffect(() => {
    let isSubscribed = true;

    const runValidation = async () => {
      const map: Record<string, PhotoValidationStatus> = {};
      for (const cls of classes) {
        const status = await validateClassPhoto(cls.imageUrl);
        map[cls.id] = status;
      }
      if (isSubscribed) {
        setValidationMap(map);
      }
    };

    runValidation();

    return () => {
      isSubscribed = false;
    };
  }, [classes]);

  // 3. Filter Eligible Classes (Enabled + Non-Empty + Validated Photo)
  const eligibleClasses = useMemo(() => {
    return classes.filter((c) => isClassEligible(c, validationMap));
  }, [classes, validationMap]);

  // 4. Remaining Eligible Classes in Current Round (Non-Repeating Winners)
  const unwonEligibleClasses = useMemo(() => {
    return eligibleClasses.filter((c) => !roundData.wonClassIds.includes(c.id));
  }, [eligibleClasses, roundData.wonClassIds]);

  // 5. Automatic Round Completion & New Round Transition
  useEffect(() => {
    if (eligibleClasses.length > 0 && unwonEligibleClasses.length === 0) {
      // All eligible classes have won in this round! Start new round automatically.
      const nextRound = roundData.roundNumber + 1;
      const nextData = resetStoredRound(nextRound);
      setRoundData(nextData);

      addToast({
        type: 'success',
        title: '🎉 All Eligible Classes Have Won!',
        message: `All ${eligibleClasses.length} eligible classes have been selected! Ready to spin again...`,
      });

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#00E676', '#FFD600', '#00D9F5', '#FF4F91', '#B388FF', '#FF7628', '#FFFFFF'],
      });
    }
  }, [eligibleClasses.length, unwonEligibleClasses.length, roundData.roundNumber, addToast]);

  // 6. Active Wheel Classes (MAXIMUM 10 CLASSES with Fair Rotation)
  const activeWheelClasses = useMemo(() => {
    if (unwonEligibleClasses.length === 0) return [];

    if (unwonEligibleClasses.length <= 10) {
      return unwonEligibleClasses;
    }

    const count = 10;
    const offset = roundData.rotationOffset % unwonEligibleClasses.length;
    const selected: ClassItem[] = [];

    for (let i = 0; i < count; i++) {
      const candidate = unwonEligibleClasses[(offset + i) % unwonEligibleClasses.length];
      if (!selected.some((s) => s.id === candidate.id)) {
        selected.push(candidate);
      }
    }

    return selected;
  }, [unwonEligibleClasses, roundData.rotationOffset]);

  // Synchronize displayed wheel classes when not spinning and no spotlight is active
  useEffect(() => {
    if (!isSpotlightActive && displayedWheelClasses.length === 0 && activeWheelClasses.length > 0) {
      setDisplayedWheelClasses(activeWheelClasses);
    }
  }, [activeWheelClasses, isSpotlightActive, displayedWheelClasses.length]);

  // Current wheel classes (locked during spin & spotlight to maintain exact pointer and spotlight segment alignment)
  const currentWheelClasses = useMemo(() => {
    if (displayedWheelClasses.length > 0) return displayedWheelClasses;
    return activeWheelClasses;
  }, [displayedWheelClasses, activeWheelClasses]);

  // Segment names for the wheel
  const classNames = useMemo(() => {
    return currentWheelClasses.map((c) => c.name);
  }, [currentWheelClasses]);

  // Authoritative selected class object
  const selectedClass = useMemo(() => {
    const targetId = selectedWinnerId || selectedClassId;
    if (!targetId) return null;
    return classes.find((c) => c.id === targetId) || null;
  }, [classes, selectedWinnerId, selectedClassId]);

  // Authoritative winning segment index on current wheel
  const winningSegmentIndex = useMemo(() => {
    if (!selectedWinnerId) return null;
    const idx = currentWheelClasses.findIndex((c) => c.id === selectedWinnerId);
    return idx >= 0 ? idx : null;
  }, [selectedWinnerId, currentWheelClasses]);

  // 7. Wheel Spin Completion Callback
  const handleSpinEnd = useCallback(
    (winnerIdentifier: string, winnerIndex: number) => {
      // Find winner strictly by authoritative winner ID
      const matched =
        classes.find((c) => c.id === winnerIdentifier) ||
        currentWheelClasses[winnerIndex];

      if (matched) {
        // Step 1: Set authoritative Single Source of Truth
        setSelectedWinnerId(matched.id);
        setSelectedClassId(matched.id);
        saveSelectedClassId(matched.id);

        // Step 2: Record winner in round progress
        const updatedWonIds = roundData.wonClassIds.includes(matched.id)
          ? roundData.wonClassIds
          : [...roundData.wonClassIds, matched.id];

        const nextOffset =
          unwonEligibleClasses.length > 10
            ? (roundData.rotationOffset + 10) % unwonEligibleClasses.length
            : roundData.rotationOffset;

        const updatedRound: StoredRoundData = {
          ...roundData,
          wonClassIds: updatedWonIds,
          rotationOffset: nextOffset,
        };

        setRoundData(updatedRound);
        saveStoredRound(updatedRound);

        // Step 3: Activate Golden Spotlight immediately on wheel and right panel
        setIsSpotlightActive(true);

        // Step 4: Celebratory confetti
        confetti({
          particleCount: 120,
          spread: 95,
          origin: { y: 0.58 },
          colors: ['#00E676', '#FFD600', '#00D9F5', '#FF4F91', '#B388FF', '#FF7628', '#FFFFFF'],
        });

        // Step 5: Victory sound effect
        if (soundEnabled) {
          playVictorySound();
        }

        // Step 6: Female American English AI MC announcement
        if (soundEnabled) {
          setTimeout(() => {
            announceWinner(matched.name);
          }, 350);
        }
      }
    },
    [classes, currentWheelClasses, roundData, unwonEligibleClasses.length, soundEnabled]
  );

  // Wheel Hook (Handles quintic eased rotation to exact segment center)
  const { rotationAngle, isSpinning, spin } = useWheel({
    items: classNames,
    soundEnabled,
    onSpinEnd: handleSpinEnd,
  });

  // Start spinning: clear previous spotlight, select winner authoritatively, spin to target index
  const handleStartSpin = () => {
    if (isSpinning) return;

    // Clear previous voice and spotlight
    stopVoice();
    setIsSpotlightActive(false);

    // Determine candidate classes available for this spin
    const availablePool = unwonEligibleClasses.length > 0 ? unwonEligibleClasses : eligibleClasses;
    if (availablePool.length === 0) return;

    // Determine wheel classes for this spin
    let spinWheelClasses: ClassItem[];
    if (unwonEligibleClasses.length > 0) {
      spinWheelClasses = activeWheelClasses;
    } else {
      // Auto round reset
      const nextRound = roundData.roundNumber + 1;
      const resetData = resetStoredRound(nextRound);
      setRoundData(resetData);
      spinWheelClasses = eligibleClasses.slice(0, 10);
    }

    // Strict photo eligibility: Only classes with verified photo URLs can win
    const eligibleOnWheel = spinWheelClasses.filter((c) => isClassEligible(c, validationMap));
    if (eligibleOnWheel.length === 0) return;

    // 100% fair random selection from eligible classes on the wheel
    const chosenWinner = eligibleOnWheel[Math.floor(Math.random() * eligibleOnWheel.length)];
    const targetWinnerId = chosenWinner.id;
    const targetIndex = spinWheelClasses.findIndex((c) => c.id === targetWinnerId);

    if (targetIndex === -1) return;

    // Lock wheel classes for the duration of this spin and spotlight display
    setDisplayedWheelClasses(spinWheelClasses);

    // Clear current selection during spin
    setSelectedWinnerId(null);
    setSelectedClassId(null);

    // Spin wheel directly to targetIndex with exact segment count & zero pointer offset
    spin(targetIndex, targetWinnerId, spinWheelClasses.length);
  };

  // User clicks "View Photo" -> opens full-screen modal
  const handleOpenPhotoModal = () => {
    if (selectedClass) {
      setIsPhotoModalOpen(true);
    }
  };

  // Manual rotation to preview next group of 10 classes
  const handleRotateWheelGroup = () => {
    if (isSpinning || unwonEligibleClasses.length <= 10) return;
    const nextOffset = (roundData.rotationOffset + 10) % unwonEligibleClasses.length;
    const updatedRound: StoredRoundData = {
      ...roundData,
      rotationOffset: nextOffset,
    };
    setRoundData(updatedRound);
    saveStoredRound(updatedRound);
    addToast({
      type: 'info',
      title: 'Wheel Classes Rotated',
      message: 'Displaying the next group of eligible classes.',
    });
  };

  // Reset Winner Round
  const handleResetRound = () => {
    const resetData = resetStoredRound(roundData.roundNumber);
    setRoundData(resetData);
    setSelectedClassId(null);
    addToast({
      type: 'info',
      title: 'Winner Progress Reset',
      message: 'Selection progress reset. All eligible classes are ready to win again.',
    });
  };

  // Save (Add or Update) Class
  const handleSaveClass = (classItem: ClassItem) => {
    const index = classes.findIndex((c) => c.id === classItem.id);
    let updated: ClassItem[];

    if (index >= 0) {
      updated = [...classes];
      updated[index] = classItem;
    } else {
      updated = [...classes, classItem];
    }

    if (classItem.photoStatus) {
      setValidationMap((prev) => ({ ...prev, [classItem.id]: classItem.photoStatus! }));
    }

    setClasses(updated);
    saveStoredClasses(updated);

    addToast({
      type: 'success',
      title: 'Class Saved',
      message: `"${classItem.name}" has been updated.`,
    });
  };

  // Delete Class
  const handleDeleteClass = (classId: string) => {
    const updated = classes.filter((c) => c.id !== classId);
    setClasses(updated);
    saveStoredClasses(updated);

    // Clean up won ids if needed
    if (roundData.wonClassIds.includes(classId)) {
      const cleanedWon = roundData.wonClassIds.filter((id) => id !== classId);
      const updatedRound = { ...roundData, wonClassIds: cleanedWon };
      setRoundData(updatedRound);
      saveStoredRound(updatedRound);
    }

    if (selectedClassId === classId) {
      setSelectedClassId(null);
      setIsPhotoModalOpen(false);
      safeStorage.removeItem('mstrang_wheel_selected_id_v3');
    }

    addToast({
      type: 'info',
      title: 'Class Removed',
      message: 'Class removed from the wheel database.',
    });
  };

  // Select class directly via chip click for preview
  const handleSelectClassPreview = (cls: ClassItem) => {
    if (isSpinning) return;
    setSelectedClassId(cls.id);
    saveSelectedClassId(cls.id);
  };

  // Viewport tracking for 100% viewport fit at 100% zoom across all desktop/laptop resolutions
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute dynamic responsive wheel size (enlarged by ~15% per specification)
  const responsiveWheelSize = useMemo(() => {
    const isDesktop = viewportSize.width >= 1024;
    if (!isDesktop) {
      // Mobile / Tablet portrait: width-constrained
      const maxWidth = Math.min(viewportSize.width - 24, 420);
      const maxHeight = viewportSize.height * 0.44;
      return Math.max(260, Math.min(maxWidth, maxHeight, 410));
    }

    // Height-based desktop scaling (enlarged by ~15%):
    // 1080p (h >= 1000): 440px * 1.15 = 506px
    // 900p  (h >= 850):  380px * 1.15 = 437px
    // 768p  (h >= 750):  340px * 1.15 = 391px
    // 720p  (h < 750):   300px * 1.15 = 345px
    let heightCap = 506;
    if (viewportSize.height < 750) {
      heightCap = 345;
    } else if (viewportSize.height < 850) {
      heightCap = 391;
    } else if (viewportSize.height < 1000) {
      heightCap = 437;
    }

    // Available space reserved: Header ~95px, Footer ~28px, Compact 50% SPIN NOW button & labels ~68px, Margins ~14px = ~205px
    const availableVerticalForWheel = Math.max(260, viewportSize.height - 205);
    // Left column takes ~58% of max-w-[1440px]
    const availableHorizontalForWheel = (Math.min(viewportSize.width, 1440) * 0.58) - 28;

    const calculated = Math.min(availableVerticalForWheel, availableHorizontalForWheel, heightCap);
    return Math.max(260, Math.round(calculated));
  }, [viewportSize.width, viewportSize.height]);

  const canSpin = !isSpinning && classNames.length > 0;

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between font-sans selection:bg-[#00D9F5] selection:text-[#1A0738] overflow-x-hidden text-white overflow-y-auto">
      
      {/* ========================================================
          FULL-SCREEN VIBRANT GALAXY NEON BACKGROUND
          ======================================================== */}
      <CartoonLandscapeBackground />

      {/* ========================================================
          1. HEADER: COMPACT, PROPORTIONAL 3D TITLES & TEACHER PHOTO
          - 25-30% narrower dark-purple container (max-w-[800px] vs 1152px)
          - 15-20% shorter height (~110px vs 140px)
          - Proportional shortened golden ribbon
          - Clear side buttons without title overlapping
          ======================================================== */}
      <header className="pt-0.5 sm:pt-1 pb-0.5 px-2 sm:px-4 relative flex-shrink-0 z-10">
        <div className="max-w-[760px] lg:max-w-[800px] xl:max-w-[820px] w-full mx-auto galaxy-card rounded-2xl sm:rounded-3xl px-3 py-1 sm:px-4 sm:py-1 relative flex flex-col items-center">
          
          {/* Centered 3-Row Header Content */}
          <div className="text-center w-full max-w-2xl mx-auto px-1 flex flex-col items-center">
            
            {/* Row 1: Premium 3D Golden Ribbon School Name Banner (Shortened & Proportional) */}
            <div className="relative inline-flex items-center justify-center my-0.5 select-none max-w-full">
              {/* Left Ribbon Wing */}
              <div
                className="hidden sm:block absolute -left-3.5 sm:-left-4.5 top-0.5 w-3.5 sm:w-4.5 h-[85%] bg-gradient-to-r from-[#FF8F00] via-[#FFB300] to-[#FFD54F] -z-10 shadow-sm"
                style={{ clipPath: 'polygon(100% 0%, 0% 0%, 30% 50%, 0% 100%, 100% 100%)' }}
              />
              {/* Left Underfold Shadow Triangle */}
              <div className="hidden sm:block absolute -left-1 top-full -mt-1.5 w-0 h-0 border-t-[6px] sm:border-t-[7px] border-t-[#8D4B00] border-l-[4px] border-l-transparent -z-10" />

              {/* Main Golden Ribbon Body */}
              <div className="ribbon-golden-3d relative px-3 sm:px-4 md:px-5 py-0.5 rounded-sm sm:rounded flex items-center justify-center gap-1 sm:gap-1.5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-[inherit]" />

                <span className="text-[11px] sm:text-xs animate-pulse drop-shadow-[0_0_6px_#FF8F00]">✨</span>

                {/* Exact School Name in Deep Red Bold Italic Lettering */}
                <span className="ribbon-text-red uppercase tracking-wider text-xs sm:text-[13px] md:text-sm lg:text-[15px] xl:text-[16px] whitespace-nowrap font-black">
                  TRANG TẤN KHƯƠNG PRIMARY SCHOOL
                </span>

                <span className="text-[11px] sm:text-xs animate-pulse drop-shadow-[0_0_6px_#FF8F00]">✨</span>
              </div>

              {/* Right Underfold Shadow Triangle */}
              <div className="hidden sm:block absolute -right-1 top-full -mt-1.5 w-0 h-0 border-t-[6px] sm:border-t-[7px] border-t-[#8D4B00] border-r-[4px] border-r-transparent -z-10" />
              {/* Right Ribbon Wing */}
              <div
                className="hidden sm:block absolute -right-3.5 sm:-right-4.5 top-0.5 w-3.5 sm:w-4.5 h-[85%] bg-gradient-to-l from-[#FF8F00] via-[#FFB300] to-[#FFD54F] -z-10 shadow-sm"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%)' }}
              />
            </div>

            {/* Row 2: Teacher Photo + 3D Word Art Title + Decorative Mini Planet */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-0.5 max-w-full px-1">
              <img
                src="./ms-trang.jpg"
                alt="Ms. Trang"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 aspect-square object-cover rounded-xl sm:rounded-2xl border-2 border-[#FFD600] shadow-[0_0_12px_rgba(255,214,0,0.5)] flex-shrink-0"
              />
              
              <div className="relative">
                <h1 className="wordart-galaxy text-base sm:text-lg md:text-xl lg:text-[23px] xl:text-[25px] leading-tight text-center sm:text-left whitespace-nowrap font-black tracking-tight">
                  Ms. Trang's English Classes
                </h1>
                
                {/* Decorative Mini Saturn Planet near heading */}
                <div className="absolute -top-2 -right-4 sm:-top-2.5 sm:-right-5 pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_8px_#00D9F5]" viewBox="0 0 40 40" fill="none">
                    <ellipse cx="20" cy="20" rx="17" ry="6" transform="rotate(-20 20 20)" stroke="#00D9F5" strokeWidth="2" />
                    <circle cx="20" cy="20" r="10" fill="#FF4F91" />
                    <circle cx="17" cy="17" r="3" fill="#FFF" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 3: Subtitle badge */}
            <div className="mt-0.5 inline-flex items-center gap-1 bg-[#12092E]/90 border border-[#7C4DFF] text-[#E0E7FF] px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-black shadow-[0_0_8px_rgba(124,77,255,0.4)]">
              <span className="text-[#FFD600] animate-pulse">⭐</span>
              <span className="text-[#00D9F5] uppercase tracking-wide">Lucky Class Picker Wheel</span>
              <span className="text-[#FFD600] animate-pulse">⭐</span>
            </div>
          </div>

          {/* Audio Toggle & Manage Classes Toolbar (Stacked vertically on right for clean clearance) */}
          <div className="mt-1 sm:mt-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-3 flex flex-row sm:flex-col items-center gap-1">
            <CuteButton
              color="cream"
              size="sm"
              disabled={isSpinning}
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                setBgmEnabled(next);
                if (!next) stopVoice();
              }}
              icon={soundEnabled ? <Volume2 className="w-3 h-3 text-[#00D9F5]" /> : <VolumeX className="w-3 h-3 text-white/50" />}
              title={soundEnabled ? 'Music, sound effects & AI MC Voice ON' : 'Audio MUTED'}
              className="py-0.5 px-2 text-[11px] rounded-lg"
            >
              {soundEnabled ? 'Voice ON' : 'Muted'}
            </CuteButton>

            <CuteButton
              color="cream"
              size="sm"
              disabled={isSpinning}
              onClick={() => setIsManagerOpen(true)}
              icon={<Settings className="w-3 h-3 text-[#FFD600]" />}
              className="py-0.5 px-2 text-[11px] rounded-lg"
            >
              Manage
            </CuteButton>
          </div>

        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT AREA
          - Left: Galaxy Lucky Wheel (25-30% larger) + SPIN NOW Button (20% larger)
          - Right: Cosmic Glass Selected Class Card + Badges (40% larger)
          ======================================================== */}
      <main className="flex-1 min-h-0 max-w-[1440px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-1 sm:py-1.5 flex flex-col justify-center relative z-10">
        
        {classes.length === 0 ? (
          /* Empty Onboarding State: No classes added */
          <div className="max-w-md mx-auto my-8 galaxy-card rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7C4DFF]/30 text-[#00D9F5] flex items-center justify-center mx-auto mb-3 border border-[#00D9F5]">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-xl font-black text-white mb-1 font-heading">
              No Classes Added Yet
            </h2>
            <p className="text-xs font-bold text-[#B388FF] mb-5 leading-relaxed">
              Add your classes with photos to launch the space prize wheel.
            </p>
            <CuteButton
              color="spin"
              size="md"
              onClick={() => setIsManagerOpen(true)}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Add Classes to Wheel
            </CuteButton>
          </div>
        ) : eligibleClasses.length === 0 ? (
          /* Ineligible State: Classes exist, but none have valid photos */
          <div className="max-w-lg mx-auto my-8 galaxy-card rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7628]/20 text-[#FF7628] flex items-center justify-center mx-auto mb-3 border border-[#FF7628]">
              <span className="text-3xl">📷</span>
            </div>
            <h2 className="text-xl font-black text-white mb-1 font-heading">
              Valid Photos Required to Spin
            </h2>
            <p className="text-xs font-bold text-[#B388FF] mb-5 leading-relaxed">
              Only classes with verified photo URLs can win. Please open the Manage panel and add photos for your classes.
            </p>
            <CuteButton
              color="photo"
              size="md"
              onClick={() => setIsManagerOpen(true)}
              icon={<Settings className="w-4 h-4" />}
            >
              Open Class Manager
            </CuteButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 items-center w-full min-h-0">
            
            {/* CỘT TRÁI (Centerpiece Wheel + Galaxy Power Button) – ~58% width */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center w-full py-0.5 min-h-0">
              
              {/* Vòng quay Galaxy Lucky Wheel: Enlarged by ~15% */}
              <div className="relative w-full flex justify-center items-center">
                <WheelCanvas
                  items={classNames}
                  rotationAngle={rotationAngle}
                  size={responsiveWheelSize}
                  winningIndex={winningSegmentIndex}
                  isSpotlightActive={isSpotlightActive}
                />
              </div>

              {/* SPIN NOW! Galaxy Power Button – Compact 50% Size, min 44px touch height */}
              <div className="mt-1 sm:mt-1.5 lg:mt-2 flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <CuteButton
                  color="spin"
                  size="md"
                  disabled={!canSpin}
                  onClick={handleStartSpin}
                  className="min-h-[44px] py-1.5 sm:py-2 px-6 sm:px-8 text-sm sm:text-base font-black rounded-full shadow-[0_0_16px_rgba(255,145,0,0.5)] active:scale-95 transition-all tracking-wider"
                  icon={
                    isSpinning ? (
                      <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 animate-spin text-white" />
                    ) : (
                      <Play className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white" />
                    )
                  }
                >
                  {isSpinning ? 'SPINNING...' : 'SPIN NOW!'}
                </CuteButton>

                {/* Sub-label showing wheel status */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#00D9F5] bg-[#12092E]/80 border border-[#00D9F5]/40 px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,217,245,0.25)]">
                  <span>Showing {classNames.length} classes on wheel</span>
                  {unwonEligibleClasses.length > 10 && (
                    <button
                      onClick={handleRotateWheelGroup}
                      disabled={isSpinning}
                      className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-[#7C4DFF] hover:bg-[#9254DE] text-white px-2 py-0.5 rounded border border-[#B388FF] transition-colors cursor-pointer"
                      title="Rotate to next group of 10 classes"
                    >
                      <RotateCw className="w-2.5 h-2.5" /> Rotate Group
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: Selected Class Card & Participating Classes – ~20% more compact */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center w-full max-w-[440px] xl:max-w-[460px] mx-auto lg:mx-0 mt-1 lg:mt-0 min-h-0">
              <ClassResultCard
                selectedClass={selectedClass}
                classes={classes}
                activeWheelClasses={currentWheelClasses}
                wonClassIds={roundData.wonClassIds}
                validationMap={validationMap}
                isSpinning={isSpinning}
                isSpotlightActive={isSpotlightActive}
                onViewPhoto={handleOpenPhotoModal}
                onSelectClassPreview={handleSelectClassPreview}
                onRotateWheelGroup={unwonEligibleClasses.length > 10 ? handleRotateWheelGroup : undefined}
              />
            </div>

          </div>
        )}

      </main>

      {/* ========================================================
          3. FOOTER – Clean School Branding (No Round Text)
          ======================================================== */}
      <footer className="py-0.5 sm:py-1 px-4 text-center flex-shrink-0 z-10">
        <div className="inline-block bg-[#160E36]/80 backdrop-blur-sm px-4 py-0.5 rounded-full border border-[#7C4DFF]/50 text-[10px] sm:text-[11px] font-black text-[#B388FF] shadow-[0_0_8px_rgba(124,77,255,0.3)]">
          Trang Tấn Khương Primary School • Ms. Trang's English Classes • Lucky Class Picker Wheel
        </div>
      </footer>

      {/* Full-Screen Class Photo Celebration View (Features EXACTLY ONE Mini Wheel on Left & Extra-Large Photo on Right) */}
      <FullScreenClassPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        selectedClass={selectedClass}
        classes={currentWheelClasses.length > 0 ? currentWheelClasses : classes}
      />

      {/* Class Manager Modal (Unlimited Classes, Photo Validation, Reset Winner Round) */}
      <ClassManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        classes={classes}
        selectedClassId={selectedClassId}
        roundNumber={roundData.roundNumber}
        wonClassIds={roundData.wonClassIds}
        validationMap={validationMap}
        onSaveClass={handleSaveClass}
        onDeleteClass={handleDeleteClass}
        onSelectClass={(id) => {
          setSelectedClassId(id);
          saveSelectedClassId(id);
        }}
        onResetRound={handleResetRound}
      />

      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;
