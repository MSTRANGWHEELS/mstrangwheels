import { useState, useRef, useCallback, useEffect } from 'react';
import {
  calculateTargetAngle,
  getSegmentIndexAtPointer,
  normalizeAngle,
} from '../../utils/wheelGeometry';
import { playTickSound } from '../../utils/soundEffects';
import { stopVoice } from '../../services/voiceService';

interface UseWheelProps {
  items: string[];
  soundEnabled?: boolean;
  onSpinEnd?: (winnerIdentifier: string, winnerIndex: number) => void;
}

export function useWheel({ items, soundEnabled = true, onSpinEnd }: UseWheelProps) {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  // Animation frame and rotation tracking
  const animFrameRef = useRef<number | null>(null);
  const currentAngleRef = useRef<number>(0);
  const lastIndexRef = useRef<number>(-1);

  useEffect(() => {
    currentAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  /**
   * Initiates spin toward an authoritative targetIndex & targetId selected by caller (Single Source of Truth)
   */
  const spin = useCallback(
    (explicitWinnerIndex?: number, explicitWinnerId?: string, explicitCount?: number) => {
      const count =
        typeof explicitCount === 'number' && explicitCount > 0
          ? explicitCount
          : items.length;

      if (isSpinning || count === 0) return;

      // Cancel any ongoing voice announcement
      stopVoice();

      // Use authoritative target winner index if provided, or pick fair random
      const targetWinnerIndex =
        typeof explicitWinnerIndex === 'number' &&
        explicitWinnerIndex >= 0 &&
        explicitWinnerIndex < count
          ? explicitWinnerIndex
          : Math.floor(Math.random() * count);

      const targetIdentifier = explicitWinnerId || items[targetWinnerIndex] || '';

      const startAngle = currentAngleRef.current;
      const targetAngle = calculateTargetAngle(startAngle, targetWinnerIndex, count, 8);

      setIsSpinning(true);
      setWinnerName(null);
      setWinnerIndex(null);

      const spinDuration = 5000; // 5.0 seconds
      const startTime = performance.now();

      // Ease-out quintic deceleration curve: 1 - (1 - t)^5
      const easeOutQuint = (t: number): number => {
        return 1 - Math.pow(1 - t, 5);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / spinDuration);
        const easedProgress = easeOutQuint(progress);

        const newAngle = startAngle + (targetAngle - startAngle) * easedProgress;
        currentAngleRef.current = newAngle;
        setRotationAngle(newAngle);

        // Sound tick on segment crossing
        if (soundEnabled && count > 1) {
          const currentIndex = getSegmentIndexAtPointer(newAngle, count);
          if (currentIndex !== lastIndexRef.current) {
            lastIndexRef.current = currentIndex;
            playTickSound();
          }
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          const finalNormalizedAngle = normalizeAngle(targetAngle);
          currentAngleRef.current = finalNormalizedAngle;
          setRotationAngle(finalNormalizedAngle);
          setIsSpinning(false);

          setWinnerIndex(targetWinnerIndex);
          setWinnerName(targetIdentifier);

          if (onSpinEnd) {
            onSpinEnd(targetIdentifier, targetWinnerIndex);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [isSpinning, items, soundEnabled, onSpinEnd]
  );

  const resetWinner = useCallback(() => {
    setWinnerName(null);
    setWinnerIndex(null);
  }, []);

  return {
    rotationAngle,
    isSpinning,
    winnerName,
    winnerIndex,
    spin,
    resetWinner,
  };
}
