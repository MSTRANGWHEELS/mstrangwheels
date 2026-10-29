import React from 'react';

export const CartoonLandscapeBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none -z-10"
      style={{
        background: 'linear-gradient(180deg, #0F1742 0%, #141C4E 35%, #101742 70%, #0A0F30 100%)',
      }}
    >
      {/* ========================================================
          1. GALAXY BLUE FANTASY – SOFT, WATERCOLOR-BLENDED GRADIENT GLOWS
          - Electric sky blue: #328DF5
          - Royal blue: #4169E1
          - Aqua turquoise: #43D9EF
          - Soft violet: #9475E8
          - Pastel lavender: #C5A9F5
          - Soft mint green: #B9EFCB
          - Warm lemon yellow highlights: #FFE88B
          ======================================================== */}

      {/* 1A. Soft Violet & Pastel Lavender Glow (Upper-Left) */}
      <div
        className="absolute -top-24 -left-20 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full blur-[90px] opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9475E8 0%, #C5A9F5 42%, rgba(148, 117, 232, 0.15) 62%, transparent 75%)',
        }}
      />

      {/* 1B. Bright Blue & Royal Blue Glow (Directly behind the spinning wheel centerpiece) */}
      <div
        className="absolute top-[28%] left-[6%] sm:left-[12%] w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full blur-[85px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #328DF5 0%, #4169E1 45%, rgba(50, 141, 245, 0.15) 65%, transparent 80%)',
        }}
      />

      {/* 1C. Aqua Turquoise & Lavender Mixture (Upper-Right behind cards) */}
      <div
        className="absolute top-[15%] -right-16 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full blur-[90px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #43D9EF 0%, #C5A9F5 45%, rgba(67, 217, 239, 0.15) 65%, transparent 75%)',
        }}
      />

      {/* 1D. Soft Violet & Aqua Turquoise Mixture (Mid-Right / Lower-Right) */}
      <div
        className="absolute top-[52%] right-[4%] w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full blur-[85px] opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9475E8 0%, #43D9EF 45%, transparent 70%)',
        }}
      />

      {/* 1E. Soft Mint Green & Warm Lemon Yellow Glow (Near the Bottom) */}
      <div
        className="absolute -bottom-24 left-[15%] w-[480px] h-[360px] sm:w-[720px] sm:h-[420px] rounded-full blur-[85px] opacity-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #B9EFCB 0%, #FFE88B 35%, rgba(185, 239, 203, 0.15) 60%, transparent 75%)',
        }}
      />

      {/* 1F. Warm Lemon Yellow & Mint Accent (Bottom-Right) */}
      <div
        className="absolute -bottom-20 -right-16 w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full blur-[80px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFE88B 0%, #B9EFCB 45%, transparent 70%)',
        }}
      />

      {/* ========================================================
          2. TOP-LEFT: CUTE 3D SMILING SATURN (Lavender with Golden Rings)
          - Slowly rotates planet & ring (18-25s) with subtle 5-10px float
          ======================================================== */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 animate-float-planet pointer-events-none">
        <svg
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 xl:w-48 xl:h-48 drop-shadow-[0_10px_25px_rgba(179,136,255,0.45)]"
          viewBox="0 0 160 160"
          fill="none"
        >
          <defs>
            <radialGradient id="saturnBody" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#E1BEE7" />
              <stop offset="45%" stopColor="#BA68C8" />
              <stop offset="85%" stopColor="#7B1FA2" />
              <stop offset="100%" stopColor="#4A148C" />
            </radialGradient>
            <linearGradient id="saturnRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
            <linearGradient id="saturnCheek" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF80AB" />
              <stop offset="100%" stopColor="#FF4081" />
            </linearGradient>
          </defs>

          {/* Back Ring Segment */}
          <ellipse
            cx="80"
            cy="80"
            rx="66"
            ry="22"
            transform="rotate(-22 80 80)"
            stroke="url(#saturnRing)"
            strokeWidth="9"
            strokeDasharray="180 180"
            strokeDashoffset="180"
            opacity="0.95"
          />

          {/* Planet Spherical Body */}
          <circle cx="80" cy="80" r="44" fill="url(#saturnBody)" />
          {/* Subtle 3D glossy highlight */}
          <ellipse cx="66" cy="62" rx="16" ry="10" transform="rotate(-30 66 62)" fill="#FFFFFF" opacity="0.32" />

          {/* Cute Rosy Cheeks */}
          <circle cx="63" cy="88" r="6" fill="url(#saturnCheek)" opacity="0.85" />
          <circle cx="97" cy="88" r="6" fill="url(#saturnCheek)" opacity="0.85" />

          {/* Smiling Kawaii Eyes */}
          <circle cx="67" cy="78" r="4.5" fill="#1A0738" />
          <circle cx="65.5" cy="76" r="1.8" fill="#FFFFFF" />
          <circle cx="93" cy="78" r="4.5" fill="#1A0738" />
          <circle cx="91.5" cy="76" r="1.8" fill="#FFFFFF" />

          {/* Sweet Open Smile */}
          <path
            d="M 72 87 Q 80 97 88 87"
            stroke="#1A0738"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="#FF4081"
          />

          {/* Front Ring Segment */}
          <ellipse
            cx="80"
            cy="80"
            rx="66"
            ry="22"
            transform="rotate(-22 80 80)"
            stroke="url(#saturnRing)"
            strokeWidth="9"
            strokeDasharray="180 180"
            strokeDashoffset="0"
            opacity="0.95"
          />
          {/* Ring Inner Groove */}
          <ellipse
            cx="80"
            cy="80"
            rx="56"
            ry="18"
            transform="rotate(-22 80 80)"
            stroke="#FFE082"
            strokeWidth="2"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ========================================================
          3. TOP-RIGHT: CUTE SMILING STAR / GOLDEN SUN PLANET
          - Gently sways side to side with soft warm glow
          - Sun rays rotate 360° continuously
          - Smiling kawaii face remains upright and readable
          ======================================================== */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 animate-sway-sun pointer-events-none">
        <svg
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 xl:w-48 xl:h-48 drop-shadow-[0_8px_24px_rgba(255,214,0,0.5)]"
          viewBox="0 0 160 160"
          fill="none"
        >
          <defs>
            <radialGradient id="sunBody" cx="36%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="30%" stopColor="#FFEE58" />
              <stop offset="70%" stopColor="#FFCA28" />
              <stop offset="100%" stopColor="#FF9800" />
            </radialGradient>
            <linearGradient id="starBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
          </defs>

          {/* Continuously Rotating Star Points / Beams (22s slow rotation) */}
          <g className="animate-rotate-rays origin-center" style={{ transformOrigin: '80px 80px' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <polygon
                key={deg}
                points="76,8 84,8 80,26"
                fill="url(#starBeam)"
                transform={`rotate(${deg} 80 80)`}
                opacity="0.9"
              />
            ))}
          </g>

          {/* Golden Smiling Spherical Core (Always Upright!) */}
          <circle cx="80" cy="80" r="46" fill="url(#sunBody)" />
          {/* 3D highlight */}
          <circle cx="68" cy="64" r="14" fill="#FFFFFF" opacity="0.38" />

          {/* Rosy Cheeks */}
          <circle cx="61" cy="90" r="6.5" fill="#FF5252" opacity="0.75" />
          <circle cx="99" cy="90" r="6.5" fill="#FF5252" opacity="0.75" />

          {/* Sparkling Joyful Eyes */}
          <circle cx="66" cy="78" r="5" fill="#2E1600" />
          <circle cx="64" cy="76" r="2" fill="#FFFFFF" />
          <circle cx="94" cy="78" r="5" fill="#2E1600" />
          <circle cx="92" cy="76" r="2" fill="#FFFFFF" />

          {/* Big Cheerful Smile */}
          <path
            d="M 68 88 Q 80 102 92 88"
            stroke="#2E1600"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="#FF1744"
          />
        </svg>
      </div>

      {/* ========================================================
          4. MID-LEFT: CUTE CARTOON SPACESHIP / RETRO ROCKET
          - Gently hovers up and down with slight tilt
          - Soft pulsing engine glow
          ======================================================== */}
      <div className="absolute top-[38%] left-1 sm:left-2 md:left-3 xl:left-4 animate-float-rocket pointer-events-none">
        <svg
          className="w-22 h-22 sm:w-28 sm:h-28 md:w-34 md:h-34 xl:w-38 xl:h-38 drop-shadow-[0_8px_22px_rgba(0,229,255,0.45)]"
          viewBox="0 0 120 120"
          fill="none"
        >
          <defs>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#ECEFF1" />
              <stop offset="100%" stopColor="#CFD8DC" />
            </linearGradient>
            <linearGradient id="rocketRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#D50000" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFEA00" />
              <stop offset="50%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#FF1744" />
            </linearGradient>
          </defs>

          {/* Glowing Flame Trail with Soft Pulsing Glow */}
          <path
            d="M 54 86 Q 44 112 50 118 Q 60 106 60 114 Q 62 106 70 118 Q 76 112 66 86 Z"
            fill="url(#flameGrad)"
            className="animate-engine-glow"
          />
          {/* Inner Cyan Flame Core */}
          <path
            d="M 57 86 Q 52 102 56 106 Q 60 100 64 106 Q 68 102 63 86 Z"
            fill="#00E5FF"
            opacity="0.8"
          />

          {/* Left and Right Fins */}
          <path d="M 44 68 L 32 86 L 46 82 Z" fill="url(#rocketRed)" />
          <path d="M 76 68 L 88 86 L 74 82 Z" fill="url(#rocketRed)" />

          {/* Main Rocket Body */}
          <path
            d="M 60 16 C 46 36 42 66 44 86 L 76 86 C 78 66 74 36 60 16 Z"
            fill="url(#rocketBody)"
            stroke="#90A4AE"
            strokeWidth="1.5"
          />

          {/* Nose Cone Red Tip */}
          <path
            d="M 60 16 C 53 26 50 36 49 42 L 71 42 C 70 36 67 26 60 16 Z"
            fill="url(#rocketRed)"
          />

          {/* Round Porthole Window with Glass Reflection */}
          <circle cx="60" cy="56" r="11" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="60" cy="56" r="8.5" fill="#0091EA" />
          <path d="M 56 50 Q 64 50 65 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* Thruster Ring */}
          <rect x="49" y="84" width="22" height="5" rx="2.5" fill="#455A64" />
        </svg>
      </div>

      {/* ========================================================
          5. MID-RIGHT: ADORABLE CARTOON ASTRONAUT KID
          - Float slowly in zero gravity with gentle rocking
          - Upright character orientation preserved
          ======================================================== */}
      <div className="absolute top-[38%] right-1 sm:right-2 md:right-3 xl:right-4 animate-float-astronaut pointer-events-none">
        <svg
          className="w-22 h-22 sm:w-28 sm:h-28 md:w-34 md:h-34 xl:w-38 xl:h-38 drop-shadow-[0_10px_25px_rgba(0,229,255,0.4)]"
          viewBox="0 0 120 120"
          fill="none"
        >
          <defs>
            <radialGradient id="visorGlow" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#80D8FF" />
              <stop offset="40%" stopColor="#00E5FF" />
              <stop offset="80%" stopColor="#0091EA" />
              <stop offset="100%" stopColor="#01579B" />
            </radialGradient>
          </defs>

          {/* Small Backpack Thruster */}
          <rect x="30" y="46" width="16" height="34" rx="7" fill="#CFD8DC" stroke="#90A4AE" strokeWidth="2" />
          <circle cx="34" cy="52" r="3" fill="#00E5FF" />
          <circle cx="34" cy="62" r="3" fill="#FFD600" />

          {/* Astronaut Suit Body */}
          <ellipse cx="60" cy="74" rx="20" ry="22" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="2" />
          <rect x="52" y="68" width="16" height="10" rx="3" fill="#00E5FF" />
          <circle cx="60" cy="73" r="2.5" fill="#FFD600" />

          {/* Waving Right Hand */}
          <path
            d="M 76 66 Q 92 56 88 44 Q 82 42 76 58"
            fill="#ECEFF1"
            stroke="#90A4AE"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="89" cy="45" r="5" fill="#FF4081" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Left Hand Floating */}
          <path
            d="M 44 68 Q 36 78 40 86 Q 46 88 48 76"
            fill="#ECEFF1"
            stroke="#90A4AE"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="40" cy="85" r="4.5" fill="#FF4081" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Helmet Dome */}
          <circle cx="60" cy="42" r="24" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2.5" />
          {/* Visor */}
          <ellipse cx="60" cy="43" rx="17" ry="14" fill="url(#visorGlow)" />
          <ellipse cx="55" cy="37" rx="7" ry="4" transform="rotate(-25 55 37)" fill="#FFFFFF" opacity="0.65" />
          {/* Cute Face inside */}
          <circle cx="56" cy="45" r="1.8" fill="#FFFFFF" />
          <circle cx="64" cy="45" r="1.8" fill="#FFFFFF" />
          <path d="M 58 48 Q 60 51 62 48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Antenna */}
          <line x1="60" y1="18" x2="60" y2="10" stroke="#B0BEC5" strokeWidth="2.5" strokeLinecap="round" />
          <polygon
            points="60,3 62,8 67,8 63,11 65,16 60,13 55,16 57,11 53,8 58,8"
            fill="#FFD600"
            stroke="#FFA000"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ========================================================
          6. BOTTOM-LEFT: CUTE MINT GREEN 3D PLANET
          - Slow gentle 3D float and tilt
          ======================================================== */}
      <div className="absolute -bottom-4 -left-4 sm:bottom-1 sm:left-2 md:bottom-2 md:left-3 animate-float-planet-alt pointer-events-none">
        <svg
          className="w-24 h-24 sm:w-30 sm:h-30 md:w-38 md:h-38 drop-shadow-[0_10px_25px_rgba(0,230,118,0.4)]"
          viewBox="0 0 140 140"
          fill="none"
        >
          <defs>
            <radialGradient id="mintPlanet" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#B9F6CA" />
              <stop offset="45%" stopColor="#00E676" />
              <stop offset="85%" stopColor="#00C853" />
              <stop offset="100%" stopColor="#1B5E20" />
            </radialGradient>
          </defs>

          <circle cx="70" cy="70" r="42" fill="url(#mintPlanet)" />
          <circle cx="54" cy="55" r="7" fill="#69F0AE" opacity="0.6" />
          <circle cx="86" cy="65" r="9" fill="#00C853" opacity="0.7" />
          <circle cx="65" cy="90" r="6" fill="#00C853" opacity="0.7" />

          <circle cx="58" cy="72" r="3.5" fill="#053110" />
          <circle cx="56.5" cy="70.5" r="1.3" fill="#FFFFFF" />
          <circle cx="78" cy="72" r="3.5" fill="#053110" />
          <circle cx="76.5" cy="70.5" r="1.3" fill="#FFFFFF" />
          <circle cx="52" cy="80" r="4.5" fill="#FF80AB" opacity="0.8" />
          <circle cx="84" cy="80" r="4.5" fill="#FF80AB" opacity="0.8" />
          <path d="M 64 78 Q 68 85 72 78" stroke="#053110" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* ========================================================
          7. BOTTOM-RIGHT: CUTE CANDY PINK 3D PLANET
          - Slow gentle 3D float and tilt
          ======================================================== */}
      <div className="absolute -bottom-4 -right-4 sm:bottom-1 sm:right-2 md:bottom-2 md:right-3 animate-float-planet pointer-events-none">
        <svg
          className="w-24 h-24 sm:w-30 sm:h-30 md:w-38 md:h-38 drop-shadow-[0_10px_25px_rgba(255,64,129,0.4)]"
          viewBox="0 0 140 140"
          fill="none"
        >
          <defs>
            <radialGradient id="pinkPlanet" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FF80AB" />
              <stop offset="45%" stopColor="#FF4081" />
              <stop offset="85%" stopColor="#F50057" />
              <stop offset="100%" stopColor="#880E4F" />
            </radialGradient>
          </defs>

          <circle cx="70" cy="70" r="42" fill="url(#pinkPlanet)" />
          <path
            d="M 32 64 Q 70 80 108 64"
            stroke="#FF80AB"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
            fill="none"
          />

          <circle cx="58" cy="68" r="3.5" fill="#3E0020" />
          <circle cx="56.5" cy="66.5" r="1.3" fill="#FFFFFF" />
          <circle cx="80" cy="68" r="3.5" fill="#3E0020" />
          <circle cx="78.5" cy="66.5" r="1.3" fill="#FFFFFF" />
          <circle cx="52" cy="76" r="4.5" fill="#FFD54F" opacity="0.85" />
          <circle cx="86" cy="76" r="4.5" fill="#FFD54F" opacity="0.85" />
          <path d="M 64 74 Q 69 82 74 74" stroke="#3E0020" strokeWidth="2.8" strokeLinecap="round" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ========================================================
          8. GLOWING COMETS / SHOOTING STARS
          ======================================================== */}
      <div className="absolute top-16 left-1/4 -rotate-45 pointer-events-none opacity-85">
        <div className="w-24 sm:w-36 h-1.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-[#FFFFFF] rounded-full shadow-[0_0_12px_#00E5FF]" />
        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_16px_#00E5FF] -mt-1 ml-auto" />
      </div>

      <div className="absolute top-24 right-1/4 rotate-45 pointer-events-none opacity-80">
        <div className="w-20 sm:w-32 h-1.5 bg-gradient-to-r from-transparent via-[#FFD600] to-[#FFFFFF] rounded-full shadow-[0_0_12px_#FFD600]" />
        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_16px_#FFD600] -mt-1 ml-auto" />
      </div>

      {/* ========================================================
          9. SPARKLING 4-POINT STARS & GLOWING COSMIC PARTICLES
          ======================================================== */}
      {[
        { top: '8%', left: '18%', size: 'w-4 h-4', color: '#FFD600', delay: '0s' },
        { top: '14%', left: '8%', size: 'w-3 h-3', color: '#00E5FF', delay: '1s' },
        { top: '22%', left: '22%', size: 'w-5 h-5', color: '#FFFFFF', delay: '0.5s' },
        { top: '6%', right: '22%', size: 'w-4 h-4', color: '#FF4081', delay: '1.2s' },
        { top: '18%', right: '12%', size: 'w-5 h-5', color: '#FFD600', delay: '0.3s' },
        { top: '28%', right: '20%', size: 'w-3 h-3', color: '#00E5FF', delay: '1.7s' },
        { bottom: '18%', left: '16%', size: 'w-4 h-4', color: '#B388FF', delay: '0.8s' },
        { bottom: '12%', left: '26%', size: 'w-3 h-3', color: '#FFD600', delay: '1.4s' },
        { bottom: '22%', right: '18%', size: 'w-4 h-4', color: '#00E676', delay: '0.6s' },
        { bottom: '14%', right: '26%', size: 'w-5 h-5', color: '#FFFFFF', delay: '1.1s' },
      ].map((star, i) => (
        <svg
          key={i}
          className={`absolute ${star.size} pointer-events-none ${i % 3 === 0 ? 'animate-twinkle-1' : i % 3 === 1 ? 'animate-twinkle-2' : 'animate-twinkle-3'}`}
          style={{
            top: star.top,
            bottom: star.bottom,
            left: star.left,
            right: star.right,
            animationDelay: star.delay,
            filter: `drop-shadow(0 0 6px ${star.color})`,
          }}
          viewBox="0 0 24 24"
          fill={star.color}
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      ))}

      {/* Tiny Sparkling Dots */}
      {[
        { t: '12%', l: '14%' },
        { t: '20%', l: '5%' },
        { t: '30%', l: '12%' },
        { t: '8%', r: '32%' },
        { t: '15%', r: '5%' },
        { t: '25%', r: '8%' },
        { b: '25%', l: '6%' },
        { b: '15%', l: '12%' },
        { b: '28%', r: '10%' },
        { b: '16%', r: '8%' },
      ].map((dot, idx) => (
        <div
          key={idx}
          className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-80 shadow-[0_0_8px_#FFF] animate-ping"
          style={{
            top: dot.t,
            bottom: dot.b,
            left: dot.l,
            right: dot.r,
            animationDuration: `${2.5 + (idx % 3)}s`,
          }}
        />
      ))}
    </div>
  );
};
