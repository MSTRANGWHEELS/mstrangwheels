import React from 'react';

export type CuteButtonColor =
  | 'spin'
  | 'photo'
  | 'pink'
  | 'yellow'
  | 'cream'
  | 'turquoise'
  | 'mint'
  | 'blue'
  | 'green'
  | 'white'
  | 'coral';

interface CuteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: CuteButtonColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const COLOR_CLASSES: Record<CuteButtonColor, string> = {
  // 1. GALAXY POWER BUTTON (SPIN NOW)
  // Large, bold, glossy 3D capsule, bright orange-to-yellow gradient, white text with dark outline, glowing neon edge & soft purple glow
  spin:
    'galaxy-button-spin text-white font-black uppercase tracking-wider',

  // 2. VIEW PHOTO BUTTON (Bright Electric Cyan / Turquoise)
  photo:
    'bg-gradient-to-r from-[#00E5FF] via-[#00B0FF] to-[#2979FF] text-white border-2 border-[#80D8FF] shadow-[0_0_18px_rgba(0,229,255,0.5),0_4px_0_#01579B] hover:brightness-110 active:translate-y-1',

  // 3. COSMIC PURPLE / TOOLBAR BUTTON (Cream alias)
  cream:
    'bg-[#221551]/80 backdrop-blur-sm text-[#E0E7FF] border-2 border-[#7C4DFF]/70 shadow-[0_0_12px_rgba(124,77,255,0.35),0_2px_0_#4A148C] hover:bg-[#311B92]/80 hover:text-white active:translate-y-0.5',

  // 4. CANDY PINK
  pink:
    'bg-gradient-to-r from-[#FF4081] to-[#F50057] text-white border-2 border-[#FF80AB] shadow-[0_0_18px_rgba(255,64,129,0.5),0_4px_0_#880E4F] hover:brightness-110 active:translate-y-1',

  // 5. SUNSHINE YELLOW
  yellow:
    'bg-gradient-to-r from-[#FFD600] to-[#FF9100] text-[#1A0738] border-2 border-[#FFE082] shadow-[0_0_18px_rgba(255,214,0,0.5),0_4px_0_#E65100] hover:brightness-110 active:translate-y-1',

  // 6. CORAL CLOSE BUTTON
  coral:
    'bg-gradient-to-r from-[#FF4081] to-[#E91E63] text-white border-2 border-[#FF80AB] shadow-[0_0_15px_rgba(255,64,129,0.5),0_3px_0_#880E4F] hover:brightness-110 active:translate-y-1',

  // Aliases for compatibility
  turquoise:
    'bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-white border-2 border-[#80D8FF] shadow-[0_0_15px_rgba(0,229,255,0.4),0_3px_0_#01579B] hover:brightness-110 active:translate-y-0.5',
  mint:
    'bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#0A2E12] border-2 border-[#B9F6CA] shadow-[0_0_15px_rgba(0,230,118,0.4),0_3px_0_#1B5E20] hover:brightness-110 active:translate-y-0.5',
  blue:
    'bg-gradient-to-r from-[#2979FF] to-[#651FFF] text-white border-2 border-[#82B1FF] shadow-[0_0_15px_rgba(41,121,255,0.4),0_3px_0_#1A237E] hover:brightness-110 active:translate-y-0.5',
  green:
    'bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#0A2E12] border-2 border-[#B9F6CA] shadow-[0_0_15px_rgba(0,230,118,0.4),0_3px_0_#1B5E20] hover:brightness-110 active:translate-y-0.5',
  white:
    'bg-[#221551]/80 backdrop-blur-sm text-[#E0E7FF] border-2 border-[#7C4DFF]/70 shadow-[0_0_12px_rgba(124,77,255,0.35)] hover:bg-[#311B92]/80',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm rounded-xl gap-1.5 font-black',
  md: 'px-4 py-2.5 text-sm sm:text-base rounded-2xl gap-2 font-black',
  lg: 'px-6 py-3 text-base sm:text-lg rounded-2xl gap-2.5 font-black tracking-wide',
  xl: 'px-9 py-4 sm:px-14 sm:py-5 text-xl sm:text-3xl rounded-full gap-3.5 font-black tracking-wider uppercase',
};

export const CuteButton: React.FC<CuteButtonProps> = ({
  color = 'spin',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center select-none cursor-pointer font-sans overflow-hidden
        ${SIZE_CLASSES[size]}
        ${COLOR_CLASSES[color]}
        ${disabled ? 'opacity-40 cursor-not-allowed transform-none shadow-none hover:brightness-100 pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {/* 3D Glossy specular highlight */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[inherit]" />

      {icon && <span className="flex-shrink-0 relative z-10">{icon}</span>}
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{children}</span>
    </button>
  );
};
