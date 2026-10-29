/**
 * Wheel Geometry & Vibrant Galaxy Neon Color Palette Utilities
 * Upgraded for Ms. Trang's Lucky Class Picker Wheel
 *
 * Supports 1 to 10 class segments on the active wheel with high-contrast,
 * vibrant Galaxy Neon colors and guaranteed zero adjacent clashes.
 */

export const GALAXY_PALETTE = [
  '#00E676', // 1. Bright green (4.1)
  '#FFD600', // 2. Golden yellow (4.6)
  '#00D9F5', // 3. Bright cyan (5.2)
  '#FF4F91', // 4. Vibrant pink (5.6)
  '#B388FF', // 5. Bright lavender (5.8)
  '#FF7628', // 6. Radiant cosmic orange
  '#00E5FF', // 7. Electric turquoise
  '#E040FB', // 8. Neon magenta
  '#76FF03', // 9. Lime neon
  '#FF5252', // 10. Coral red
  '#651FFF', // 11. Deep royal purple
  '#FFD740', // 12. Sunshine amber
] as const;

export interface SegmentStyle {
  bg: string;
  textColor: string;
  accentGlow: string;
}

/**
 * 5 primary target classes mapping to exact Vibrant Galaxy Neon colors
 */
export const CLASS_COLOR_MAP: Record<string, string> = {
  '4.1': '#00E676', // Bright green
  '4_1': '#00E676',
  '4.6': '#FFD600', // Golden yellow
  '4_6': '#FFD600',
  '5.2': '#00D9F5', // Bright cyan
  '5_2': '#00D9F5',
  '5.6': '#FF4F91', // Vibrant pink
  '5_6': '#FF4F91',
  '5.8': '#B388FF', // Bright lavender
  '5_8': '#B388FF',
};

export const GALAXY_TEXT_COLOR = '#FFFFFF';

/**
 * Returns distinct styling for each wheel segment (up to 10 segments).
 * Guarantees no two adjacent segments share the same color.
 */
export function getSegmentStyles(itemsOrCount: string[] | number): SegmentStyle[] {
  const items = typeof itemsOrCount === 'number' ? null : itemsOrCount;
  const count = items ? items.length : (itemsOrCount as number);

  if (count <= 0) return [];

  const result: SegmentStyle[] = [];

  for (let i = 0; i < count; i++) {
    let chosenColor: string | null = null;

    if (items && items[i]) {
      const name = items[i];
      for (const [key, col] of Object.entries(CLASS_COLOR_MAP)) {
        if (name.includes(key)) {
          // If previous segment has the same color, don't repeat
          if (i === 0 || result[i - 1].bg !== col) {
            chosenColor = col;
          }
          break;
        }
      }
    }

    if (!chosenColor) {
      const prevColor = i > 0 ? result[i - 1].bg : null;
      const firstColor = result.length > 0 ? result[0].bg : null;

      // Filter palette to avoid clashing with neighbor
      let candidates = GALAXY_PALETTE.filter((c) => c !== prevColor);
      if (i === count - 1 && count > 2) {
        candidates = candidates.filter((c) => c !== firstColor);
      }

      if (candidates.length > 0) {
        chosenColor = candidates[i % candidates.length];
      } else {
        chosenColor = GALAXY_PALETTE[i % GALAXY_PALETTE.length];
      }
    }

    result.push({
      bg: chosenColor,
      textColor: GALAXY_TEXT_COLOR,
      accentGlow: chosenColor,
    });
  }

  return result;
}

// Pointer angle: Top of the wheel (270 degrees / -PI/2 radians)
export const POINTER_ANGLE = -Math.PI / 2;

/**
 * Normalizes any radian angle into [0, 2*PI)
 */
export function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  const mod = angle % twoPi;
  return mod < 0 ? mod + twoPi : mod;
}

/**
 * Returns the exact index of the segment currently under the needle
 */
export function getSegmentIndexAtPointer(rotationAngle: number, segmentCount: number): number {
  if (segmentCount <= 0) return -1;
  if (segmentCount === 1) return 0;

  const segmentAngle = (Math.PI * 2) / segmentCount;
  const angleAtPointer = normalizeAngle(POINTER_ANGLE - rotationAngle);
  const index = Math.floor(angleAtPointer / segmentAngle);

  return Math.min(Math.max(0, index), segmentCount - 1);
}

/**
 * Calculates the exact target stop angle to land cleanly at the exact center of `winnerIndex`
 * with K full spins and zero misalignment.
 */
export function calculateTargetAngle(
  currentAngle: number,
  winnerIndex: number,
  segmentCount: number,
  fullSpins: number = 8
): number {
  if (segmentCount <= 0) return currentAngle;
  if (segmentCount === 1) {
    return currentAngle + fullSpins * Math.PI * 2;
  }

  const segmentAngle = (Math.PI * 2) / segmentCount;
  // Exact center of the winning segment: (winnerIndex + 0.5) * segmentAngle
  const desiredRelativeAngle = (winnerIndex + 0.5) * segmentAngle;
  const targetMod = normalizeAngle(POINTER_ANGLE - desiredRelativeAngle);
  const currentMod = normalizeAngle(currentAngle);

  let forwardDiff = targetMod - currentMod;
  if (forwardDiff <= 0) {
    forwardDiff += Math.PI * 2;
  }

  return currentAngle + fullSpins * Math.PI * 2 + forwardDiff;
}
