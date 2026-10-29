import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CuteButton } from '../../components/ui/CuteButton';
import { Sparkles, Trophy, X, RotateCcw } from 'lucide-react';
import { playVictorySound } from '../../utils/soundEffects';

interface WinnerModalProps {
  isOpen: boolean;
  winnerName: string | null;
  classNameTitle: string;
  onClose: () => void;
  onRemoveWinner?: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winnerName,
  classNameTitle,
  onClose,
  onRemoveWinner,
}) => {
  useEffect(() => {
    if (!isOpen || !winnerName) return;

    // Play celebration audio
    playVictorySound();

    // Fire cute confetti cannon sequence
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF6B8B', '#4D96FF', '#FFD93D', '#6BCB77', '#9B5DE5'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF6B8B', '#4D96FF', '#FFD93D', '#6BCB77', '#9B5DE5'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isOpen, winnerName]);

  if (!isOpen || !winnerName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border-8 border-candy-yellow shadow-2xl p-6 md:p-10 max-w-lg w-full text-center relative overflow-hidden transform animate-bounce-gentle">
        
        {/* Top close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Stars */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
          <Trophy className="w-16 h-16 text-candy-yellow drop-shadow-md" />
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
        </div>

        <span className="inline-block bg-pink-100 text-pink-700 text-sm font-extrabold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          {classNameTitle} • Lucky Star
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
          Hooray! Congratulations! 🎉
        </h2>

        {/* Huge winner student name badge for projector visibility */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-r from-candy-pink via-candy-orange to-candy-yellow text-white shadow-xl border-4 border-white">
          <p className="text-sm uppercase tracking-widest font-bold opacity-90 mb-1">
            Selected Student
          </p>
          <p className="text-4xl md:text-5xl font-black tracking-wide drop-shadow-md">
            {winnerName}
          </p>
        </div>

        <p className="text-slate-600 font-bold mb-6 text-base">
          Give a big round of applause to {winnerName}! 👏⭐
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <CuteButton
            color="green"
            size="lg"
            onClick={onClose}
            icon={<RotateCcw className="w-5 h-5" />}
          >
            Spin Again!
          </CuteButton>

          {onRemoveWinner && (
            <CuteButton
              color="white"
              size="md"
              onClick={onRemoveWinner}
              className="text-xs text-rose-500 hover:border-rose-300"
            >
              Remove from list
            </CuteButton>
          )}
        </div>

      </div>
    </div>
  );
};
