import React from 'react';
import { ClassItem, PhotoValidationStatus } from '../../types/classTypes';
import { CuteButton } from '../../components/ui/CuteButton';
import { isClassEligible } from '../../services/photoValidationService';
import { CLASS_COLOR_MAP } from '../../utils/wheelGeometry';
import { Sparkles, Image as ImageIcon, HelpCircle, Trophy, RotateCw, CheckCircle2 } from 'lucide-react';

interface ClassResultCardProps {
  selectedClass: ClassItem | null;
  classes: ClassItem[];
  activeWheelClasses: ClassItem[];
  wonClassIds: string[];
  roundNumber: number;
  validationMap: Record<string, PhotoValidationStatus>;
  isSpinning: boolean;
  isSpotlightActive?: boolean;
  onViewPhoto: () => void;
  onSelectClassPreview?: (cls: ClassItem) => void;
  onRotateWheelGroup?: () => void;
}

// Map class to vibrant galaxy badge colors
function getClassBadgeStyle(className: string): { bg: string; border: string; text: string } {
  for (const [key, color] of Object.entries(CLASS_COLOR_MAP)) {
    if (className.includes(key)) {
      const isBright = color === '#FFD600' || color === '#00E676';
      return { bg: color, border: '#FFFFFF', text: isBright ? '#1A0738' : '#FFFFFF' };
    }
  }
  return { bg: '#00D9F5', border: '#FFFFFF', text: '#1A0738' };
}

export const ClassResultCard: React.FC<ClassResultCardProps> = ({
  selectedClass,
  classes,
  activeWheelClasses,
  wonClassIds,
  roundNumber,
  validationMap,
  isSpinning,
  isSpotlightActive = false,
  onViewPhoto,
  onSelectClassPreview,
  onRotateWheelGroup,
}) => {
  const eligibleClasses = classes.filter((c) => isClassEligible(c, validationMap));
  const wonCount = eligibleClasses.filter((c) => wonClassIds.includes(c.id)).length;
  const isSelectedWon = selectedClass ? wonClassIds.includes(selectedClass.id) : false;

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 max-h-full">
      {/* 1. SELECTED CLASS CARD (Cosmic Glassmorphism with Neon Border) */}
      <div className="galaxy-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden transition-all duration-300 flex-shrink-0">
        
        {/* Ribbon Header Banner: 🏆 SELECTED CLASS */}
        <div className="flex items-center justify-between -mt-0.5 mb-1.5">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#7C4DFF] via-[#00D9F5] to-[#7C4DFF] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(0,217,245,0.45)] border border-[#00D9F5]/70">
            <Trophy className="w-3.5 h-3.5 text-[#FFD600]" />
            <span>SELECTED CLASS</span>
          </div>

          <div className="inline-flex items-center gap-1 bg-[#12092E]/90 text-[#FFD600] px-2.5 py-0.5 rounded-full text-[11px] font-black border border-[#FFD600]/40">
            <span>Round {roundNumber}</span>
          </div>
        </div>

        {/* State A: Before First Spin OR During Spin */}
        {isSpinning || !selectedClass ? (
          <div className="py-2.5 px-1 text-center flex flex-col items-center justify-center">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-1.5 shadow-md border-2 transition-all ${
                isSpinning
                  ? 'bg-[#FFD600] border-[#FFF59D] animate-spin shadow-[0_0_15px_#FFD600]'
                  : 'bg-[#7C4DFF]/50 border-[#B388FF] animate-bounce-subtle shadow-[0_0_12px_rgba(124,77,255,0.5)]'
              }`}
            >
              {isSpinning ? (
                <Sparkles className="w-6 h-6 text-[#1A0738]" />
              ) : (
                <HelpCircle className="w-6 h-6 text-[#00D9F5]" />
              )}
            </div>

            <h3 className="text-base sm:text-lg lg:text-xl font-black text-white mb-0.5 tracking-tight font-heading drop-shadow-sm">
              Which class will be next?
            </h3>

            <p className="text-[#B388FF] font-bold text-xs max-w-xs mb-1 leading-snug">
              {isSpinning
                ? 'Galaxy Wheel is spinning! Who will win?'
                : eligibleClasses.length === 0
                ? 'Please add classes with valid photos to spin.'
                : 'Press SPIN NOW to launch the space prize wheel!'}
            </p>

            {eligibleClasses.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#00D9F5] bg-[#12092E]/80 px-2.5 py-0.5 rounded-full border border-[#00D9F5]/50 shadow-[0_0_8px_rgba(0,217,245,0.3)]">
                  <Sparkles className="w-3 h-3 text-[#FFD600]" />
                  <span>{activeWheelClasses.length} on wheel</span>
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#00E676] bg-[#12092E]/80 px-2.5 py-0.5 rounded-full border border-[#00E676]/40">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{wonCount}/{eligibleClasses.length} won</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* State B: Winner Selected */
          <div className="py-0.5 text-center flex flex-col items-center animate-fadeIn">
            {/* Winner Display Box with Synchronized Golden Spotlight Effects */}
            <div
              className={`w-full my-0.5 py-2.5 px-2.5 rounded-2xl bg-[#12092E]/95 relative overflow-hidden transition-all duration-300 ${
                isSpotlightActive
                  ? 'border-3 border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.65),inset_0_0_15px_rgba(255,215,0,0.25)]'
                  : 'border-3 border-[#00D9F5] shadow-[0_0_20px_rgba(0,217,245,0.4)]'
              }`}
            >
              {/* Soft golden spotlight glow behind the winning class number */}
              {isSpotlightActive && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.3)_0%,rgba(255,215,0,0.1)_45%,transparent_75%)]"
                />
              )}

              <div className="flex items-center justify-center gap-1.5 mb-0.5 relative z-10">
                <span className={`text-xs ${isSpotlightActive ? 'text-[#FFD700] animate-bounce' : 'text-[#FFD600] animate-pulse'}`}>
                  {isSpotlightActive ? '✨' : '⭐'}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${
                    isSpotlightActive
                      ? 'text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]'
                      : 'text-[#FFD600] drop-shadow-[0_0_6px_#FFD600]'
                  }`}
                >
                  GALAXY WINNER • ROUND {roundNumber}
                </span>
                <span className={`text-xs ${isSpotlightActive ? 'text-[#FFD700] animate-bounce' : 'text-[#FFD600] animate-pulse'}`}>
                  {isSpotlightActive ? '✨' : '⭐'}
                </span>
              </div>

              {/* Large, bold winning class number */}
              <h2
                className={`text-2xl sm:text-3xl lg:text-[28px] xl:text-[32px] font-black tracking-tight font-heading uppercase break-words relative z-10 leading-tight ${
                  isSpotlightActive
                    ? 'text-white drop-shadow-[0_0_18px_rgba(255,215,0,0.85)] scale-105 transition-transform duration-300'
                    : 'text-white drop-shadow-[0_0_14px_rgba(0,217,245,0.7)]'
                }`}
              >
                {selectedClass.name}
              </h2>

              {isSelectedWon && (
                <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-black text-[#00E676] bg-[#00E676]/10 px-2.5 py-0.5 rounded-full border border-[#00E676]/30 relative z-10">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed for Round {roundNumber}</span>
                </div>
              )}
            </div>

            {/* View Class Photo button: Electric cyan / turquoise */}
            <div className="w-full mt-1.5">
              <CuteButton
                color="photo"
                size="md"
                disabled={isSpinning}
                onClick={onViewPhoto}
                title={`View photo for ${selectedClass.name}`}
                icon={<ImageIcon className="w-3.5 h-3.5 text-white" />}
                className="w-full justify-center text-xs sm:text-sm py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-[0_0_12px_rgba(0,217,245,0.4)]"
              >
                <span>View {selectedClass.name} Photo</span>
              </CuteButton>
            </div>
          </div>
        )}
      </div>

      {/* 2. PARTICIPATING CLASSES (All Real Classes Added by Teacher) */}
      <div className="galaxy-card rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5 border-b border-[#7C4DFF]/40 pb-1 flex-wrap gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚀</span>
            <h4 className="text-[11px] sm:text-xs font-black text-[#E0E7FF] font-heading uppercase tracking-wide">
              Participating Classes
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="bg-[#7C4DFF] text-white font-black text-[11px] px-2 py-0.5 rounded-full border border-[#B388FF] shadow-[0_0_6px_rgba(124,77,255,0.5)]">
              {classes.length} Total
            </span>
            <span className="bg-[#00E676]/20 text-[#00E676] font-black text-[11px] px-2 py-0.5 rounded-full border border-[#00E676]/50">
              {wonCount}/{eligibleClasses.length} Won
            </span>
          </div>
        </div>

        {/* Multi-Group Rotation Notice when eligible classes > 10 */}
        {eligibleClasses.length > 10 && (
          <div className="mb-1.5 bg-[#12092E]/90 border border-[#00D9F5]/40 rounded-xl px-2 py-1 flex items-center justify-between text-[11px] font-bold text-[#00D9F5] flex-shrink-0">
            <div className="flex items-center gap-1">
              <span>🎯 Wheel shows max 10 classes</span>
            </div>
            {onRotateWheelGroup && (
              <button
                onClick={onRotateWheelGroup}
                disabled={isSpinning}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-[#7C4DFF] hover:bg-[#9254DE] text-white px-2 py-0.5 rounded-lg border border-[#B388FF] transition-all cursor-pointer"
                title="Rotate to the next group of 10 eligible classes"
              >
                <RotateCw className="w-2.5 h-2.5" />
                <span>Rotate 🔄</span>
              </button>
            )}
          </div>
        )}

        {classes.length === 0 ? (
          <p className="text-xs text-[#B388FF] font-bold py-1.5 text-center">
            No classes added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1 pt-0.5 max-h-[clamp(75px,15vh,135px)] overflow-y-auto pr-1">
            {classes.map((cls) => {
              const isSelected = !isSpinning && selectedClass?.id === cls.id;
              const badgeStyle = getClassBadgeStyle(cls.name);
              const eligible = isClassEligible(cls, validationMap);
              const isOnWheel = activeWheelClasses.some((c) => c.id === cls.id);
              const hasWon = wonClassIds.includes(cls.id);
              const isEnabled = cls.isEnabled !== false;

              let statusEmoji = '';
              let statusTooltip = '';

              if (!isEnabled) {
                statusEmoji = '🚫';
                statusTooltip = 'Disabled';
              } else if (!eligible) {
                statusEmoji = '📷❌';
                statusTooltip = 'No valid photo (Ineligible to win)';
              } else if (hasWon) {
                statusEmoji = '🏆';
                statusTooltip = `Won in Round ${roundNumber}`;
              } else if (isOnWheel) {
                statusEmoji = '🎯';
                statusTooltip = 'Active on wheel right now';
              } else {
                statusEmoji = '⏳';
                statusTooltip = 'In pool (waiting to rotate onto wheel)';
              }

              return (
                <button
                  key={cls.id}
                  onClick={() => onSelectClassPreview?.(cls)}
                  disabled={isSpinning}
                  style={{
                    backgroundColor: isEnabled && eligible ? badgeStyle.bg : '#24144A',
                    borderColor: isSelected
                      ? '#FFFFFF'
                      : isOnWheel
                      ? '#00D9F5'
                      : isEnabled && eligible
                      ? badgeStyle.border
                      : 'rgba(255,255,255,0.2)',
                    color: isEnabled && eligible ? badgeStyle.text : 'rgba(255,255,255,0.6)',
                  }}
                  className={`
                    inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border transition-all cursor-pointer select-none shadow-sm
                    ${isSelected ? 'ring-2 ring-[#00D9F5] scale-105 shadow-[0_0_12px_rgba(0,217,245,0.6)]' : 'hover:scale-105 hover:brightness-110'}
                    ${isOnWheel ? 'ring-1 ring-[#00D9F5]' : ''}
                    ${hasWon ? 'opacity-85' : ''}
                    ${!eligible || !isEnabled ? 'opacity-50' : ''}
                    ${isSpinning ? 'pointer-events-none opacity-50' : ''}
                  `}
                  title={`${cls.name} • ${statusTooltip}`}
                >
                  <span>{cls.name}</span>
                  <span className="text-[9px]" title={statusTooltip}>
                    {statusEmoji}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
