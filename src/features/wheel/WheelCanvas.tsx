import React, { useRef, useEffect } from 'react';
import { getSegmentStyles } from '../../utils/wheelGeometry';

export interface WheelCanvasProps {
  items: string[];
  rotationAngle: number;
  size?: number; // width/height in px
  winningIndex?: number | null;
  isSpotlightActive?: boolean;
  isSegmentGlowing?: boolean;
  isNumberZoomed?: boolean;
  dimOtherLabels?: boolean;
}

// Perimeter stars/gems alternating glowing colors
const GALAXY_BORDER_LIGHTS = [
  '#FFD600', // Golden yellow star
  '#00D9F5', // Bright cyan star
  '#FF4F91', // Vibrant pink gem
  '#00E676', // Bright green star
  '#B388FF', // Bright lavender gem
  '#FF7628', // Radiant cosmic orange
];

// Helper to draw clean 5-pointed star
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  items,
  rotationAngle,
  size = 480,
  winningIndex = null,
  isSpotlightActive = false,
  isSegmentGlowing = false,
  isNumberZoomed = false,
  dimOtherLabels = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSpotlight = isSpotlightActive || isSegmentGlowing || isNumberZoomed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const isSmall = size < 250;

    const outerRadius = size / 2 - (isSmall ? 8 : 16);
    const innerRadius = Math.max(20, Math.floor(outerRadius * 0.22));

    ctx.clearRect(0, 0, size, size);

    // =========================================================================
    // 1. COSMIC NEON GLOW / SHADOW BEHIND WHEEL
    // =========================================================================
    ctx.save();
    const glowGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      outerRadius * 0.8,
      centerX,
      centerY,
      outerRadius + (isSmall ? 8 : 14)
    );
    glowGrad.addColorStop(0, 'rgba(0, 217, 245, 0.45)');
    glowGrad.addColorStop(0.6, 'rgba(124, 77, 255, 0.35)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius + (isSmall ? 8 : 14), 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();
    ctx.restore();

    // =========================================================================
    // 2. THICK GLOSSY 3D OUTER RIM (Deep Cosmic Purple with Bright Cyan Ring)
    // =========================================================================
    ctx.save();
    const rimGrad = ctx.createLinearGradient(0, centerY - outerRadius, 0, centerY + outerRadius);
    rimGrad.addColorStop(0, '#311468');
    rimGrad.addColorStop(0.5, '#1B0942');
    rimGrad.addColorStop(1, '#0F0429');

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Outer neon bright cyan glow ring
    ctx.lineWidth = isSmall ? 3 : 5.5;
    ctx.strokeStyle = '#00D9F5';
    ctx.shadowColor = '#00D9F5';
    ctx.shadowBlur = isSmall ? 6 : 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner bevel ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius - (isSmall ? 7 : 14), 0, Math.PI * 2);
    ctx.lineWidth = isSmall ? 1.5 : 3;
    ctx.strokeStyle = '#7C4DFF';
    ctx.stroke();

    // Luminous Stars & Gems around wheel border
    const lightCount = isSmall ? 18 : 28;
    const lightDistance = outerRadius - (isSmall ? 4 : 7.5);
    const starOuter = isSmall ? 2.5 : 5.0;
    const starInner = isSmall ? 1.2 : 2.6;

    for (let b = 0; b < lightCount; b++) {
      const angle = (b * (Math.PI * 2)) / lightCount;
      const lx = centerX + lightDistance * Math.cos(angle);
      const ly = centerY + lightDistance * Math.sin(angle);
      const col = GALAXY_BORDER_LIGHTS[b % GALAXY_BORDER_LIGHTS.length];

      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur = isSmall ? 4 : 8;
      ctx.fillStyle = col;
      drawStar(ctx, lx, ly, 5, starOuter, starInner);
      ctx.fill();

      // Specular glint
      ctx.beginPath();
      ctx.arc(lx - 0.8, ly - 0.8, isSmall ? 0.6 : 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Inner wheel radius for colored segments
    const wheelRadius = outerRadius - (isSmall ? 9 : 17);
    const count = items.length;

    // Empty state
    if (count === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, wheelRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#160E36';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#7C4DFF';
      ctx.stroke();

      ctx.fillStyle = '#00D9F5';
      ctx.font = `bold ${isSmall ? 11 : 20}px "Nunito", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No classes yet', centerX, centerY);
      ctx.restore();
      return;
    }

    // =========================================================================
    // LAYER 1: ROTATING 5 VIBRANT GALAXY SEGMENTS
    // =========================================================================
    const segmentAngle = (Math.PI * 2) / count;
    const styles = getSegmentStyles(items);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < count; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const style = styles[i] || { bg: '#00D9F5', textColor: '#FFFFFF' };

      // Wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = style.bg;
      ctx.fill();

      // Segment bevel / inner gloss gradient
      const segGrad = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, wheelRadius);
      segGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      segGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      segGrad.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
      ctx.fillStyle = segGrad;
      ctx.fill();

      // Winning Segment Golden Spotlight Illumination & Border
      if (winningIndex !== undefined && winningIndex !== null && i === winningIndex && activeSpotlight) {
        ctx.save();

        // 1. Radiant golden-yellow spotlight glow over the segment
        const spotGrad = ctx.createRadialGradient(0, 0, innerRadius * 0.6, 0, 0, wheelRadius);
        spotGrad.addColorStop(0, 'rgba(255, 245, 157, 0.58)');
        spotGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.42)');
        spotGrad.addColorStop(1, 'rgba(255, 179, 0, 0.25)');
        ctx.fillStyle = spotGrad;
        ctx.fill();

        // 2. Subtle golden light rays radiating within the segment
        const midRay = startAngle + segmentAngle / 2;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 220, 0.5)';
        ctx.lineWidth = isSmall ? 1.5 : 2.5;
        for (let r = -2; r <= 2; r++) {
          const rayAngle = midRay + (r * segmentAngle * 0.35) / 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(rayAngle) * innerRadius, Math.sin(rayAngle) * innerRadius);
          ctx.lineTo(Math.cos(rayAngle) * wheelRadius * 0.94, Math.sin(rayAngle) * wheelRadius * 0.94);
          ctx.stroke();
        }
        ctx.restore();

        // 3. Thin, sparkling golden border following the winning segment's shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.lineWidth = isSmall ? 3 : 5;
        ctx.strokeStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = isSmall ? 10 : 20;
        ctx.stroke();
        ctx.restore();
      }

      // Crisp White separator line between segments
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = isSmall ? 1.8 : 3.5;
      ctx.stroke();
    }
    ctx.restore();

    // =========================================================================
    // LAYER 2: CLASS LABELS – ALWAYS HORIZONTAL, 100% UPRIGHT, EXTRA-BOLD, HIGH CONTRAST
    // With Super Winner Zoom, glowing golden outline, sparkling stars & dimmed non-winners
    // =========================================================================
    const rLabel = innerRadius + (wheelRadius - innerRadius) * 0.54;
    const baseScale = size / 480;

    // Dynamic base font size: 72px for 1-6 segments, 56px for 7-8 segments, 46px for 9-10 segments
    const baseTargetFontSize = Math.floor((count >= 9 ? 46 : count >= 7 ? 56 : 72) * baseScale);

    for (let i = 0; i < count; i++) {
      const sliceMid = (i + 0.5) * segmentAngle;
      const screenMidAngle = rotationAngle + sliceMid;

      const labelX = centerX + rLabel * Math.cos(screenMidAngle);
      const labelY = centerY + rLabel * Math.sin(screenMidAngle);

      // Extract clean class number (e.g. "Class 4.1" -> "4.1")
      const raw = items[i].trim();
      let displayNumber = raw;
      const classMatch = raw.match(/^class\s*(.+)$/i);
      if (classMatch) {
        displayNumber = classMatch[1].trim();
      }

      const isWinner = winningIndex !== undefined && winningIndex !== null && i === winningIndex;

      ctx.save();
      // Counter-rotate: Translate to (labelX, labelY) with fixed 0 angle relative to screen!
      ctx.translate(labelX, labelY);

      // Dim non-winning class labels when spotlight is active
      if (!isWinner && (activeSpotlight || dimOtherLabels)) {
        ctx.globalAlpha = 0.45;
      } else {
        ctx.globalAlpha = 1.0;
      }

      // Usable width: ~88% of segment arc width
      const usableWidth = rLabel * segmentAngle * 0.88;

      let fontSize = baseTargetFontSize;

      if (isWinner && activeSpotlight) {
        // Enlarge winning class number approximately 1.5–1.8 times (1.65x)
        fontSize = Math.floor(baseTargetFontSize * 1.65);
      }

      ctx.font = `900 ${fontSize}px "Nunito", "Quicksand", Arial, sans-serif`;
      while (ctx.measureText(displayNumber).width > usableWidth && fontSize > (isSmall ? 10 : 16)) {
        fontSize -= 2;
        ctx.font = `900 ${fontSize}px "Nunito", "Quicksand", Arial, sans-serif`;
      }

      ctx.font = `900 ${fontSize}px "Nunito", "Quicksand", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (isWinner && activeSpotlight) {
        // Golden Spotlight highlight:
        // 1. Soft 3D text shadow
        ctx.fillStyle = 'rgba(15, 4, 38, 0.95)';
        ctx.fillText(displayNumber, 0, 4.5 * baseScale);

        // 2. Sparkling golden outline around the winning class number
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = Math.max(isSmall ? 3.5 : 7, Math.floor(8.5 * baseScale));
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 18 * baseScale;
        ctx.lineJoin = 'round';
        ctx.strokeText(displayNumber, 0, 0);

        // 3. Crisp bright white lettering
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(displayNumber, 0, 0);

        // 4. Twinkling golden stars around the selected class number
        const starOffset = fontSize * 0.68;
        const starSize = Math.max(3, Math.floor(5.5 * baseScale));
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
        drawStar(ctx, -starOffset, -fontSize * 0.35, 5, starSize, starSize * 0.45);
        ctx.fill();
        drawStar(ctx, starOffset, -fontSize * 0.35, 5, starSize, starSize * 0.45);
        ctx.fill();
        drawStar(ctx, -starOffset * 0.9, fontSize * 0.38, 5, starSize * 0.85, starSize * 0.4);
        ctx.fill();
        drawStar(ctx, starOffset * 0.9, fontSize * 0.38, 5, starSize * 0.85, starSize * 0.4);
        ctx.fill();
      } else {
        // Normal state
        // 1. Deep cosmic purple 3D drop shadow
        ctx.fillStyle = 'rgba(15, 4, 38, 0.85)';
        ctx.fillText(displayNumber, 0, 4 * baseScale);

        // 2. Thick cosmic dark outline for 100% legibility on vibrant bright backgrounds
        ctx.strokeStyle = '#150934';
        ctx.lineWidth = Math.max(isSmall ? 2.5 : 5, Math.floor(7 * baseScale));
        ctx.lineJoin = 'round';
        ctx.strokeText(displayNumber, 0, 0);

        // 3. Crisp, bright white lettering
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(displayNumber, 0, 0);
      }

      ctx.restore();
    }

    // =========================================================================
    // 3. CENTER HUB: GLOWING 3D GOLDEN STAR WITH NEON CYAN / PURPLE RING
    // =========================================================================
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY + 2, innerRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Outer Hub Circle (Royal Galaxy Purple)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1D0E44';
    ctx.fill();
    ctx.lineWidth = isSmall ? 2 : 4.5;
    ctx.strokeStyle = '#00D9F5'; // Glowing neon cyan
    ctx.shadowColor = '#00D9F5';
    ctx.shadowBlur = isSmall ? 5 : 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner Hub Circle (Deep violet)
    const innerSubRadius = Math.max(10, innerRadius - (isSmall ? 4 : 9));
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerSubRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#311468';
    ctx.fill();

    // Glowing 3D Golden Star at Center Hub
    const hubStarOuter = innerSubRadius * 0.82;
    const hubStarInner = hubStarOuter * 0.45;

    ctx.save();
    ctx.shadowColor = '#FFD600';
    ctx.shadowBlur = isSmall ? 6 : 12;

    const starGrad = ctx.createLinearGradient(
      centerX - hubStarOuter,
      centerY - hubStarOuter,
      centerX + hubStarOuter,
      centerY + hubStarOuter
    );
    starGrad.addColorStop(0, '#FFF59D');
    starGrad.addColorStop(0.4, '#FFD600');
    starGrad.addColorStop(1, '#FF8F00');

    ctx.fillStyle = starGrad;
    drawStar(ctx, centerX, centerY, 5, hubStarOuter, hubStarInner);
    ctx.fill();

    ctx.lineWidth = isSmall ? 1 : 1.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Specular shine
    ctx.beginPath();
    ctx.arc(centerX - hubStarOuter * 0.25, centerY - hubStarOuter * 0.25, isSmall ? 1 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // =========================================================================
    // 4. POINTER: BRIGHT GOLDEN SHOOTING STAR POINTING DOWN INTO SEGMENT
    // =========================================================================
    ctx.save();
    const pointerWidth = isSmall ? 18 : 36;
    const pointerHeight = isSmall ? 25 : 50;
    const pointerTop = isSmall ? 2 : 4;
    const tipY = pointerTop + pointerHeight;

    // Glowing Trail
    ctx.beginPath();
    ctx.moveTo(centerX - pointerWidth / 2, pointerTop + (isSmall ? 3 : 6));
    ctx.lineTo(centerX + pointerWidth / 2, pointerTop + (isSmall ? 3 : 6));
    ctx.lineTo(centerX, tipY + (isSmall ? 2 : 4));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 214, 0, 0.45)';
    ctx.shadowColor = '#FFD600';
    ctx.shadowBlur = isSmall ? 8 : 16;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pointer Flame Body
    const pointerGrad = ctx.createLinearGradient(centerX, pointerTop, centerX, tipY);
    pointerGrad.addColorStop(0, '#FFF59D');
    pointerGrad.addColorStop(0.3, '#FFD600');
    pointerGrad.addColorStop(0.7, '#FF9100');
    pointerGrad.addColorStop(1, '#FF3D00');

    ctx.beginPath();
    ctx.moveTo(centerX - pointerWidth / 2, pointerTop + (isSmall ? 5 : 10));
    ctx.lineTo(centerX + pointerWidth / 2, pointerTop + (isSmall ? 5 : 10));
    ctx.lineTo(centerX, tipY);
    ctx.closePath();
    ctx.fillStyle = pointerGrad;
    ctx.fill();
    ctx.lineWidth = isSmall ? 1.5 : 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Bright 5-pointed Golden Shooting Star Head
    const starHeadRadius = isSmall ? 7 : 14;
    const starHeadCenterY = pointerTop + starHeadRadius;

    ctx.save();
    ctx.shadowColor = '#FFD600';
    ctx.shadowBlur = isSmall ? 7 : 14;

    const headStarGrad = ctx.createRadialGradient(
      centerX,
      starHeadCenterY,
      2,
      centerX,
      starHeadCenterY,
      starHeadRadius
    );
    headStarGrad.addColorStop(0, '#FFFFFF');
    headStarGrad.addColorStop(0.4, '#FFEA00');
    headStarGrad.addColorStop(1, '#FF8F00');

    ctx.fillStyle = headStarGrad;
    drawStar(ctx, centerX, starHeadCenterY, 5, starHeadRadius, starHeadRadius * 0.46);
    ctx.fill();
    ctx.lineWidth = isSmall ? 1 : 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }, [items, rotationAngle, size, winningIndex, isSegmentGlowing, isNumberZoomed, dimOtherLabels]);

  const maxContainer =
    size < 250
      ? 'max-w-[170px]'
      : 'max-w-[360px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[500px]';

  return (
    <div className={`relative flex items-center justify-center p-1 w-full ${maxContainer} mx-auto`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', maxWidth: `${size}px` }}
        className="w-full h-auto aspect-square drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)] select-none block"
      />
    </div>
  );
};
