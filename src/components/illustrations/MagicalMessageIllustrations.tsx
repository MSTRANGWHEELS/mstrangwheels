import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * SHARED 3D CLAY DEFS
 * Provides common clay materials, glossy highlights, skin tones, and soft drop shadows
 */
export const Shared3DDefs: React.FC = () => (
  <defs>
    {/* Soft Clay Shadow Filter */}
    <filter id="softClayShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#164A9B" floodOpacity="0.18" />
    </filter>

    {/* Soft Golden Glow Filter */}
    <filter id="goldenGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFE17B" floodOpacity="0.75" />
    </filter>

    {/* Boy / Girl Skin Tone Gradients */}
    <radialGradient id="claySkin" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stopColor="#FFF2E8" />
      <stop offset="60%" stopColor="#FFE0CC" />
      <stop offset="100%" stopColor="#F5C4A3" />
    </radialGradient>

    {/* Hair Gradients (Warm Clay Brown) */}
    <radialGradient id="clayHair" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#8D6E63" />
      <stop offset="50%" stopColor="#6D4C41" />
      <stop offset="100%" stopColor="#4E342E" />
    </radialGradient>

    <radialGradient id="clayHairDark" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#5D4037" />
      <stop offset="50%" stopColor="#3E2723" />
      <stop offset="100%" stopColor="#271915" />
    </radialGradient>

    {/* Pastel School Uniform Gradients */}
    <linearGradient id="uniformSkyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#BCE8FA" />
      <stop offset="60%" stopColor="#8ED8F8" />
      <stop offset="100%" stopColor="#67BEE3" />
    </linearGradient>

    <linearGradient id="uniformLavender" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E9DEFC" />
      <stop offset="60%" stopColor="#D7C3FA" />
      <stop offset="100%" stopColor="#BAA0E8" />
    </linearGradient>

    <linearGradient id="uniformAqua" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C4F4EF" />
      <stop offset="60%" stopColor="#A8EDE5" />
      <stop offset="100%" stopColor="#84D8CE" />
    </linearGradient>

    {/* Pastel Aqua Clay Gradient */}
    <linearGradient id="clayAqua" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#D8FBF7" />
      <stop offset="50%" stopColor="#A8EDE5" />
      <stop offset="100%" stopColor="#79DDEA" />
    </linearGradient>

    {/* Sunshine Yellow 3D Star Gradient */}
    <radialGradient id="clayGold" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#FFFDE7" />
      <stop offset="45%" stopColor="#FFE17B" />
      <stop offset="85%" stopColor="#FFCA28" />
      <stop offset="100%" stopColor="#FF9800" />
    </radialGradient>

    {/* Pastel Pink Clay Gradient */}
    <radialGradient id="clayPink" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#FFF0F5" />
      <stop offset="50%" stopColor="#FFC9DD" />
      <stop offset="100%" stopColor="#F48FB1" />
    </radialGradient>

    {/* Mint Green Clay Gradient */}
    <radialGradient id="clayMint" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#E5F8EB" />
      <stop offset="50%" stopColor="#BDECC6" />
      <stop offset="100%" stopColor="#8FD89D" />
    </radialGradient>

    {/* Peach Orange Clay Gradient */}
    <radialGradient id="clayPeach" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#FFF3ED" />
      <stop offset="50%" stopColor="#FFB58F" />
      <stop offset="100%" stopColor="#F58F60" />
    </radialGradient>

    {/* Soft Cream Book Pages */}
    <linearGradient id="clayCream" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="50%" stopColor="#FFF8E8" />
      <stop offset="100%" stopColor="#F5ECD0" />
    </linearGradient>
  </defs>
);

/**
 * REUSABLE 3D KAWAII BOY FACE & HEAD
 */
const KawaiiBoyHead: React.FC<{ cx: number; cy: number; scale?: number }> = ({ cx, cy, scale = 1 }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
    {/* Hair Back */}
    <circle cx="0" cy="-2" r="23" fill="url(#clayHair)" filter="url(#softClayShadow)" />
    {/* Rounded Clay Face */}
    <circle cx="0" cy="0" r="20" fill="url(#claySkin)" />
    {/* Hair Bangs (Rounded clay tufts) */}
    <path
      d="M -20 -3 C -18 -18 18 -18 20 -3 C 17 -11 7 -15 0 -13 C -7 -15 -17 -11 -20 -3 Z"
      fill="url(#clayHair)"
    />
    <circle cx="-6" cy="-12" r="6" fill="url(#clayHair)" />
    <circle cx="6" cy="-13" r="6.5" fill="url(#clayHair)" />
    {/* Glossy Specular Sheen */}
    <ellipse cx="-7" cy="-7" rx="5" ry="3" transform="rotate(-20 -7 -7)" fill="#FFFFFF" opacity="0.45" />
    {/* Left Eye: Large glossy dark eye with twin catchlights */}
    <circle cx="-7" cy="2" r="3.2" fill="#1A0738" />
    <circle cx="-8" cy="1" r="1.3" fill="#FFFFFF" />
    <circle cx="-6.2" cy="2.8" r="0.6" fill="#FFFFFF" />
    {/* Right Eye */}
    <circle cx="7" cy="2" r="3.2" fill="#1A0738" />
    <circle cx="6" cy="1" r="1.3" fill="#FFFFFF" />
    <circle cx="7.8" cy="2.8" r="0.6" fill="#FFFFFF" />
    {/* Rosy Kawaii Cheeks */}
    <circle cx="-12" cy="6" r="3.2" fill="#FF8EA8" opacity="0.6" />
    <circle cx="12" cy="6" r="3.2" fill="#FF8EA8" opacity="0.6" />
    {/* Adorable Open Smile */}
    <path d="M -4 5 Q 0 10 4 5" stroke="#1A0738" strokeWidth="2" strokeLinecap="round" fill="#D81B60" />
  </g>
);

/**
 * REUSABLE 3D KAWAII GIRL FACE & HEAD
 */
const KawaiiGirlHead: React.FC<{ cx: number; cy: number; scale?: number }> = ({ cx, cy, scale = 1 }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
    {/* Hair Pigtails / Buns */}
    <circle cx="-20" cy="-6" r="8" fill="url(#clayHairDark)" filter="url(#softClayShadow)" />
    <circle cx="20" cy="-6" r="8" fill="url(#clayHairDark)" filter="url(#softClayShadow)" />
    <circle cx="-16" cy="-2" r="3" fill="#FFC9DD" />
    <circle cx="16" cy="-2" r="3" fill="#FFC9DD" />
    {/* Rounded Face */}
    <circle cx="0" cy="0" r="20" fill="url(#claySkin)" filter="url(#softClayShadow)" />
    {/* Hair Front Bangs */}
    <path
      d="M -19 -4 C -16 -18 16 -18 19 -4 C 14 -10 6 -14 -1 -12 C -8 -14 -15 -10 -19 -4 Z"
      fill="url(#clayHairDark)"
    />
    {/* Glossy Specular Sheen */}
    <ellipse cx="-7" cy="-7" rx="5" ry="3" transform="rotate(-20 -7 -7)" fill="#FFFFFF" opacity="0.45" />
    {/* Eyes */}
    <circle cx="-7" cy="2" r="3.2" fill="#1A0738" />
    <circle cx="-8" cy="1" r="1.3" fill="#FFFFFF" />
    <circle cx="-6.2" cy="2.8" r="0.6" fill="#FFFFFF" />
    <circle cx="7" cy="2" r="3.2" fill="#1A0738" />
    <circle cx="6" cy="1" r="1.3" fill="#FFFFFF" />
    <circle cx="7.8" cy="2.8" r="0.6" fill="#FFFFFF" />
    {/* Rosy Cheeks */}
    <circle cx="-12" cy="6" r="3.2" fill="#FF8EA8" opacity="0.65" />
    <circle cx="12" cy="6" r="3.2" fill="#FF8EA8" opacity="0.65" />
    {/* Smile */}
    <path d="M -4 5 Q 0 10 4 5" stroke="#1A0738" strokeWidth="2" strokeLinecap="round" fill="#D81B60" />
  </g>
);

/**
 * REUSABLE 3D SMILING STAR
 */
const KawaiiStar: React.FC<{ cx: number; cy: number; r?: number }> = ({ cx, cy, r = 16 }) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.48;
    points.push(`${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`);
  }
  return (
    <g filter="url(#goldenGlow)">
      <polygon points={points.join(' ')} fill="url(#clayGold)" stroke="#FFF" strokeWidth="1.2" strokeLinejoin="round" />
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.3} rx={r * 0.25} ry={r * 0.15} transform={`rotate(-15 ${cx} ${cy})`} fill="#FFF" opacity="0.6" />
      {/* Eyes */}
      <circle cx={cx - r * 0.2} cy={cy} r={r * 0.14} fill="#2E1600" />
      <circle cx={cx - r * 0.23} cy={cy - r * 0.05} r={r * 0.06} fill="#FFF" />
      <circle cx={cx + r * 0.2} cy={cy} r={r * 0.14} fill="#2E1600" />
      <circle cx={cx + r * 0.17} cy={cy - r * 0.05} r={r * 0.06} fill="#FFF" />
      {/* Blush */}
      <circle cx={cx - r * 0.35} cy={cy + r * 0.15} r={r * 0.12} fill="#FF5252" opacity="0.6" />
      <circle cx={cx + r * 0.35} cy={cy + r * 0.15} r={r * 0.12} fill="#FF5252" opacity="0.6" />
      {/* Smile */}
      <path d={`M ${cx - r * 0.12} ${cy + r * 0.1} Q ${cx} ${cy + r * 0.26} ${cx + r * 0.12} ${cy + r * 0.1}`} stroke="#2E1600" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>
  );
};

// ============================================================================
// 1. MESSAGE 1: "English is fun!"
// Child holding smiling schoolbook + floating ABC letters
// ============================================================================
export const MsgIllustration0: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Floating Colorful 3D ABC Letters */}
    <g className="animate-msg-float-1">
      <rect x="22" y="10" width="16" height="16" rx="4" fill="url(#clayGold)" filter="url(#softClayShadow)" />
      <text x="30" y="22" fill="#164A9B" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Fredoka, sans-serif">A</text>
    </g>
    <g className="animate-msg-float-2">
      <rect x="52" y="4" width="16" height="16" rx="4" fill="url(#clayPink)" filter="url(#softClayShadow)" />
      <text x="60" y="16" fill="#164A9B" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Fredoka, sans-serif">B</text>
    </g>
    <g className="animate-msg-float-3">
      <rect x="82" y="10" width="16" height="16" rx="4" fill="url(#clayMint)" filter="url(#softClayShadow)" />
      <text x="90" y="22" fill="#164A9B" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Fredoka, sans-serif">C</text>
    </g>

    {/* Schoolchild Body (Sky Blue Uniform) */}
    <g className="animate-msg-child-bounce" transform="translate(60, 68)">
      <path d="M -16 12 C -18 36 18 36 16 12 Z" fill="url(#uniformSkyBlue)" filter="url(#softClayShadow)" />
      <path d="M -6 12 L 0 20 L 6 12 Z" fill="#FFF8E8" />
      {/* Arms holding the book */}
      <path d="M -15 15 C -22 24 -15 32 -6 28" stroke="url(#uniformSkyBlue)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 15 15 C 22 24 15 32 6 28" stroke="url(#uniformSkyBlue)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Boy Head */}
      <KawaiiBoyHead cx={0} cy={0} scale={0.9} />
    </g>

    {/* Smiling Pastel Schoolbook held in front */}
    <g className="animate-msg-gentle-sway" transform="translate(60, 95)">
      {/* Book Cover */}
      <rect x="-24" y="-12" width="48" height="24" rx="4" fill="url(#clayAqua)" filter="url(#softClayShadow)" />
      {/* Book Spine & Pages */}
      <rect x="-20" y="-9" width="40" height="18" rx="2" fill="url(#clayCream)" />
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#A8EDE5" strokeWidth="1.5" />
      {/* Cute Book Face */}
      <circle cx="-8" cy="-1" r="1.8" fill="#1A0738" />
      <circle cx="8" cy="-1" r="1.8" fill="#1A0738" />
      <circle cx="-12" cy="1" r="2" fill="#FF8EA8" opacity="0.6" />
      <circle cx="12" cy="1" r="2" fill="#FF8EA8" opacity="0.6" />
      <path d="M -3 1 Q 0 4 3 1" stroke="#1A0738" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

// ============================================================================
// 2. MESSAGE 2: "You can do it!"
// Child with thumbs-up + smiling golden star
// ============================================================================
export const MsgIllustration1: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Child Body */}
    <g className="animate-msg-child-wave" transform="translate(48, 62)">
      <path d="M -15 14 C -18 38 18 38 15 14 Z" fill="url(#uniformSkyBlue)" filter="url(#softClayShadow)" />
      <path d="M -5 14 L 0 20 L 5 14 Z" fill="#FFF8E8" />
      {/* Left arm relaxed */}
      <path d="M -14 16 C -20 25 -18 34 -14 36" stroke="url(#uniformSkyBlue)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Right arm confident thumbs-up */}
      <path d="M 14 16 C 24 18 26 12 28 8" stroke="url(#uniformSkyBlue)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
      {/* Thumbs up hand */}
      <circle cx="28" cy="7" r="4.5" fill="url(#claySkin)" />
      <rect x="27" y="0" width="3.2" height="6" rx="1.5" fill="url(#claySkin)" />
      {/* Girl Head */}
      <KawaiiGirlHead cx={0} cy={0} scale={0.92} />
    </g>

    {/* Smiling Golden 3D Star */}
    <g className="animate-msg-star-sparkle" transform="translate(96, 42)">
      <KawaiiStar cx={0} cy={0} r={17} />
    </g>
  </svg>
);

// ============================================================================
// 3. MESSAGE 3: "Keep trying!"
// Child climbing 3 colorful steps toward a glowing golden star
// ============================================================================
export const MsgIllustration2: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* 3 Colorful Pastel 3D Steps */}
    <g filter="url(#softClayShadow)">
      {/* Step 1 (Pink) */}
      <rect x="12" y="86" width="30" height="24" rx="4" fill="url(#clayPink)" />
      {/* Step 2 (Mint) */}
      <rect x="42" y="68" width="32" height="42" rx="4" fill="url(#clayMint)" />
      {/* Step 3 (Sky Blue) */}
      <rect x="74" y="50" width="34" height="60" rx="4" fill="url(#uniformSkyBlue)" />
    </g>

    {/* Child climbing onto Step 2 */}
    <g className="animate-msg-climb" transform="translate(56, 42)">
      <path d="M -12 12 C -14 30 14 30 12 12 Z" fill="url(#uniformLavender)" filter="url(#softClayShadow)" />
      {/* Climbing legs */}
      <path d="M -6 28 L -12 38" stroke="url(#uniformLavender)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 6 28 L 12 34" stroke="url(#uniformLavender)" strokeWidth="5" strokeLinecap="round" />
      <KawaiiBoyHead cx={0} cy={0} scale={0.85} />
    </g>

    {/* Small glowing star at the top step */}
    <g className="animate-msg-star-twinkle" transform="translate(92, 32)">
      <KawaiiStar cx={0} cy={0} r={13} />
    </g>
  </svg>
);

// ============================================================================
// 4. MESSAGE 4: "Believe in yourself!"
// Child with superhero cape + glowing golden heart
// ============================================================================
export const MsgIllustration3: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Fluttering Pastel Lavender Superhero Cape */}
    <g className="animate-msg-cape" transform="translate(52, 60)">
      <path
        d="M -12 8 C -28 14 -32 46 -22 52 C -14 42 -8 30 -6 14 Z"
        fill="url(#uniformLavender)"
        opacity="0.95"
        filter="url(#softClayShadow)"
      />
    </g>

    {/* Confident Child with Hands on Hips */}
    <g transform="translate(56, 58)">
      <path d="M -14 14 C -16 36 16 36 14 14 Z" fill="url(#uniformSkyBlue)" filter="url(#softClayShadow)" />
      {/* Arms akimbo */}
      <path d="M -12 16 C -22 22 -20 28 -14 26" stroke="url(#uniformSkyBlue)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 12 16 C 22 22 20 28 14 26" stroke="url(#uniformSkyBlue)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <KawaiiBoyHead cx={0} cy={0} scale={0.92} />
    </g>

    {/* Glowing Golden 3D Heart */}
    <g className="animate-msg-heart-pulse" transform="translate(96, 40)">
      <path
        d="M 0 6 C -8 -6 -20 4 -8 16 L 0 24 L 8 16 C 20 4 8 -6 0 6 Z"
        fill="url(#clayGold)"
        filter="url(#goldenGlow)"
      />
      <ellipse cx="-4" cy="4" rx="3.5" ry="2" transform="rotate(-30 -4 4)" fill="#FFF" opacity="0.6" />
    </g>
  </svg>
);

// ============================================================================
// 5. MESSAGE 5: "Learn and shine!"
// Open schoolbook + rising golden star
// ============================================================================
export const MsgIllustration4: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Open 3D Pastel Schoolbook */}
    <g className="animate-msg-gentle-sway" transform="translate(60, 84)">
      {/* Left Page */}
      <path
        d="M 0 8 C -18 4 -38 0 -42 6 C -44 18 -42 32 -40 36 C -36 32 -16 36 0 40 Z"
        fill="url(#clayAqua)"
        filter="url(#softClayShadow)"
      />
      <path
        d="M -1 11 C -16 7 -34 3 -38 9 C -39 18 -38 28 -36 32 C -32 28 -14 32 -1 36 Z"
        fill="url(#clayCream)"
      />
      {/* Right Page */}
      <path
        d="M 0 8 C 18 4 38 0 42 6 C 44 18 42 32 40 36 C 36 32 16 36 0 40 Z"
        fill="url(#clayAqua)"
        filter="url(#softClayShadow)"
      />
      <path
        d="M 1 11 C 16 7 34 3 38 9 C 39 18 38 28 36 32 C 32 28 14 32 1 36 Z"
        fill="url(#clayCream)"
      />
      {/* Lines on pages */}
      <line x1="-30" y1="16" x2="-8" y2="19" stroke="#A8EDE5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-30" y1="22" x2="-10" y2="25" stroke="#A8EDE5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="19" x2="30" y2="16" stroke="#A8EDE5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="25" x2="30" y2="22" stroke="#A8EDE5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cute Book Smile */}
      <circle cx="-16" cy="27" r="1.5" fill="#FF8EA8" />
      <circle cx="16" cy="27" r="1.5" fill="#FF8EA8" />
    </g>

    {/* Rising Glowing Golden 3D Star */}
    <g className="animate-msg-star-rise" transform="translate(60, 36)">
      <KawaiiStar cx={0} cy={0} r={22} />
      {/* Sparkle Rays */}
      <circle cx="-28" cy="-12" r="2" fill="#FFE17B" />
      <circle cx="28" cy="-10" r="2.5" fill="#FFE17B" />
      <circle cx="24" cy="18" r="1.8" fill="#FFC9DD" />
      <circle cx="-22" cy="16" r="2" fill="#A8EDE5" />
    </g>
  </svg>
);

// ============================================================================
// 6. MESSAGE 6: "Every day, we grow!"
// Cute seedling sprout in pastel pot + smiling sun
// ============================================================================
export const MsgIllustration5: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Smiling Sun in Top Right */}
    <g className="animate-msg-sun-pulse" transform="translate(88, 32)">
      {/* Sun Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="0"
          y1="0"
          x2="0"
          y2="-22"
          transform={`rotate(${deg})`}
          stroke="#FFE17B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      ))}
      <circle cx="0" cy="0" r="15" fill="url(#clayGold)" filter="url(#goldenGlow)" />
      {/* Sun Eyes & Smile */}
      <circle cx="-4" cy="-2" r="1.6" fill="#2E1600" />
      <circle cx="4" cy="-2" r="1.6" fill="#2E1600" />
      <circle cx="-6.5" cy="1.5" r="1.8" fill="#FF5252" opacity="0.6" />
      <circle cx="6.5" cy="1.5" r="1.8" fill="#FF5252" opacity="0.6" />
      <path d="M -3 1 Q 0 4 3 1" stroke="#2E1600" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>

    {/* Cute Pastel Flowerpot with Sprout */}
    <g transform="translate(48, 86)">
      {/* Flowerpot */}
      <polygon points="-18,-8 18,-8 14,24 -14,24" fill="url(#clayPeach)" filter="url(#softClayShadow)" />
      <rect x="-21" y="-14" width="42" height="7" rx="3.5" fill="url(#clayPeach)" />
      {/* Pot Face */}
      <circle cx="-6" cy="6" r="1.8" fill="#2E1600" />
      <circle cx="6" cy="6" r="1.8" fill="#2E1600" />
      <circle cx="-10" cy="9" r="2" fill="#FF8EA8" opacity="0.6" />
      <circle cx="10" cy="9" r="2" fill="#FF8EA8" opacity="0.6" />
      <path d="M -2.5 9 Q 0 12 2.5 9" stroke="#2E1600" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      
      {/* Sprouting Seedling (Swaying gently) */}
      <g className="animate-msg-plant-sway" transform="translate(0, -12)">
        <path d="M 0 0 C 0 -14 -4 -22 0 -30" stroke="#7CB342" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Left Leaf */}
        <path
          d="M 0 -18 C -14 -22 -16 -8 0 -14 Z"
          fill="url(#clayMint)"
          filter="url(#softClayShadow)"
        />
        {/* Right Leaf */}
        <path
          d="M 0 -26 C 14 -30 16 -16 0 -22 Z"
          fill="url(#clayMint)"
          filter="url(#softClayShadow)"
        />
        <circle cx="0" cy="-30" r="3" fill="#BDECC6" />
      </g>
    </g>
  </svg>
);

// ============================================================================
// 7. MESSAGE 7: "Mistakes help us learn!"
// Smiling pastel pencil correcting notebook + friendly glowing light bulb
// ============================================================================
export const MsgIllustration6: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Glowing Friendly Light Bulb */}
    <g className="animate-msg-bulb-glow" transform="translate(90, 36)">
      <path
        d="M 0 -16 C -12 -16 -14 0 -8 8 L -6 15 L 6 15 L 8 8 C 14 0 12 -16 0 -16 Z"
        fill="url(#clayAqua)"
        filter="url(#goldenGlow)"
      />
      {/* Base */}
      <rect x="-5" y="15" width="10" height="4" rx="1.5" fill="#B0BEC5" />
      {/* Kawaii Bulb Face */}
      <circle cx="-4" cy="-2" r="1.6" fill="#1A0738" />
      <circle cx="4" cy="-2" r="1.6" fill="#1A0738" />
      <path d="M -2.5 2 Q 0 5 2.5 2" stroke="#1A0738" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </g>

    {/* Notebook Page */}
    <g transform="translate(36, 76)">
      <rect x="-20" y="-20" width="42" height="38" rx="4" fill="url(#clayCream)" filter="url(#softClayShadow)" />
      {/* Spiral Bindings */}
      <circle cx="-16" cy="-14" r="2" fill="#D7C3FA" />
      <circle cx="-16" cy="-4" r="2" fill="#D7C3FA" />
      <circle cx="-16" cy="6" r="2" fill="#D7C3FA" />
      {/* Checkmark in Green */}
      <path d="M -2 -4 L 4 2 L 14 -8" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Smiling 3D Pastel Pencil */}
    <g className="animate-msg-pencil" transform="translate(68, 64) rotate(-35)">
      {/* Pencil Body */}
      <rect x="-5" y="-26" width="10" height="34" rx="2" fill="url(#clayGold)" filter="url(#softClayShadow)" />
      {/* Eraser */}
      <rect x="-5" y="-34" width="10" height="8" rx="2" fill="url(#clayPink)" />
      <rect x="-5" y="-26" width="10" height="3" fill="#CFD8DC" />
      {/* Tip */}
      <polygon points="-5,8 5,8 0,16" fill="url(#claySkin)" />
      <polygon points="-2,13 2,13 0,16" fill="#37474F" />
      {/* Face on pencil */}
      <circle cx="-2" cy="-8" r="1.2" fill="#2E1600" />
      <circle cx="2" cy="-8" r="1.2" fill="#2E1600" />
      <path d="M -1 -4 Q 0 -2 1 -4" stroke="#2E1600" strokeWidth="1" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

// ============================================================================
// 8. MESSAGE 8: "Be kind, be brave!"
// Two schoolchildren helping each other + glowing heart
// ============================================================================
export const MsgIllustration7: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Child 1 (Boy on left in Sky Blue) */}
    <g className="animate-msg-child-wave" transform="translate(40, 64)">
      <path d="M -14 12 C -16 34 14 34 12 12 Z" fill="url(#uniformSkyBlue)" filter="url(#softClayShadow)" />
      {/* Arm around friend */}
      <path d="M 8 16 C 18 18 22 22 28 20" stroke="url(#uniformSkyBlue)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <KawaiiBoyHead cx={0} cy={0} scale={0.84} />
    </g>

    {/* Child 2 (Girl on right in Lavender) */}
    <g className="animate-msg-child-bounce" transform="translate(80, 64)">
      <path d="M -12 12 C -14 34 14 34 12 12 Z" fill="url(#uniformLavender)" filter="url(#softClayShadow)" />
      {/* Arm holding hands */}
      <path d="M -8 16 C -18 18 -22 22 -28 20" stroke="url(#uniformLavender)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <KawaiiGirlHead cx={0} cy={0} scale={0.84} />
    </g>

    {/* Glowing Golden Heart between them */}
    <g className="animate-msg-heart-pulse" transform="translate(60, 24)">
      <path
        d="M 0 4 C -7 -5 -18 3 -7 14 L 0 20 L 7 14 C 18 3 7 -5 0 4 Z"
        fill="url(#clayGold)"
        filter="url(#goldenGlow)"
      />
    </g>
  </svg>
);

// ============================================================================
// 9. MESSAGE 9: "Dream big, little star!"
// Smiling golden star + flying pastel space rocket
// ============================================================================
export const MsgIllustration8: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Smiling Golden 3D Star */}
    <g className="animate-msg-star-twinkle" transform="translate(36, 42)">
      <KawaiiStar cx={0} cy={0} r={22} />
    </g>

    {/* Cute Miniature 3D Pastel Rocket zooming up to right */}
    <g className="animate-msg-rocket" transform="translate(82, 68) rotate(-35)">
      {/* Rocket Flame */}
      <path d="M -4 18 Q 0 30 0 24 Q 0 30 4 18 Z" fill="url(#clayGold)" filter="url(#goldenGlow)" />
      {/* Fins */}
      <path d="M -8 8 L -14 18 L -6 16 Z" fill="url(#clayPeach)" />
      <path d="M 8 8 L 14 18 L 6 16 Z" fill="url(#clayPeach)" />
      {/* Fuselage */}
      <path d="M 0 -16 C -10 -2 -8 12 -6 18 L 6 18 C 8 12 10 -2 0 -16 Z" fill="#FFFFFF" filter="url(#softClayShadow)" />
      {/* Nose cone */}
      <path d="M 0 -16 C -6 -10 -5 0 -4 0 L 4 0 C 5 0 6 -10 0 -16 Z" fill="url(#clayPink)" />
      {/* Window */}
      <circle cx="0" cy="4" r="4.5" fill="url(#uniformSkyBlue)" stroke="#FFF" strokeWidth="1.5" />
    </g>
  </svg>
);

// ============================================================================
// 10. MESSAGE 10: "Speak English with a smile!"
// Two cartoon schoolchildren talking joyfully + Hello / Hi speech bubbles
// ============================================================================
export const MsgIllustration9: React.FC<IllustrationProps> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="overflow-visible">
    <Shared3DDefs />
    {/* Speech Bubble 1: "Hello!" above Left Child */}
    <g className="animate-msg-float-1" transform="translate(24, 18)">
      <rect x="-14" y="-10" width="28" height="18" rx="6" fill="url(#clayCream)" filter="url(#softClayShadow)" />
      <polygon points="0,8 -4,14 4,8" fill="#FFF8E8" />
      <text x="0" y="2" fill="#164A9B" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Fredoka, sans-serif">
        Hello!
      </text>
    </g>

    {/* Speech Bubble 2: "Hi!" above Right Child */}
    <g className="animate-msg-float-2" transform="translate(94, 20)">
      <rect x="-12" y="-10" width="24" height="18" rx="6" fill="url(#clayAqua)" filter="url(#softClayShadow)" />
      <polygon points="0,8 -3,14 3,8" fill="#A8EDE5" />
      <text x="0" y="2" fill="#164A9B" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Fredoka, sans-serif">
        Hi!
      </text>
    </g>

    {/* Child 1 (Boy on left) */}
    <g className="animate-msg-child-bounce" transform="translate(38, 70)">
      <path d="M -12 12 C -14 34 14 34 12 12 Z" fill="url(#uniformSkyBlue)" filter="url(#softClayShadow)" />
      <KawaiiBoyHead cx={0} cy={0} scale={0.84} />
    </g>

    {/* Child 2 (Girl on right) */}
    <g className="animate-msg-child-wave" transform="translate(82, 70)">
      <path d="M -12 12 C -14 34 14 34 12 12 Z" fill="url(#uniformLavender)" filter="url(#softClayShadow)" />
      <KawaiiGirlHead cx={0} cy={0} scale={0.84} />
    </g>
  </svg>
);

/**
 * MASTER ILLUSTRATION MAPPER COMPONENT
 */
export const MagicalMessageIllustration: React.FC<{ index: number; size?: number }> = ({
  index,
  size = 110,
}) => {
  switch (index) {
    case 0:
      return <MsgIllustration0 size={size} />;
    case 1:
      return <MsgIllustration1 size={size} />;
    case 2:
      return <MsgIllustration2 size={size} />;
    case 3:
      return <MsgIllustration3 size={size} />;
    case 4:
      return <MsgIllustration4 size={size} />;
    case 5:
      return <MsgIllustration5 size={size} />;
    case 6:
      return <MsgIllustration6 size={size} />;
    case 7:
      return <MsgIllustration7 size={size} />;
    case 8:
      return <MsgIllustration8 size={size} />;
    case 9:
      return <MsgIllustration9 size={size} />;
    default:
      return <MsgIllustration0 size={size} />;
  }
};
