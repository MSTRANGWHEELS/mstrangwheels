import React from 'react';

export const SchoolDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      
      {/* 1. Top-Left: Stack of 3D Books 📚 */}
      <div
        className="absolute top-3 left-3 sm:top-5 sm:left-5 text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] animate-float-subtle"
        title="Books"
      >
        <span className="inline-block transform -rotate-12 hover:scale-110 transition-transform">
          📚
        </span>
      </div>

      {/* 2. Top-Center Left: Little Star ⭐ */}
      <div className="absolute top-2 left-1/4 text-lg sm:text-xl filter drop-shadow-[0_2px_4px_rgba(251,188,5,0.4)] animate-bounce-subtle">
        <span>⭐</span>
      </div>

      {/* 3. Top-Center Right: 3D Rainbow 🌈 */}
      <div
        className="absolute top-2 right-1/4 text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] animate-float-delayed"
        title="Rainbow"
      >
        <span className="inline-block transform rotate-6">
          🌈
        </span>
      </div>

      {/* 4. Top-Right: 3D ABC Alphabet Block 🔤 */}
      <div
        className="absolute top-3 right-3 sm:top-5 sm:right-5 text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] animate-float-delayed"
        title="ABC Blocks"
      >
        <span className="inline-block transform rotate-12">
          🔤
        </span>
      </div>

      {/* 5. Middle-Left: Sparkle ✨ */}
      <div className="hidden sm:block absolute top-1/2 left-2.5 -translate-y-1/2 text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <span>✨</span>
      </div>

      {/* 6. Middle-Right: Sparkle ✨ */}
      <div className="hidden sm:block absolute top-1/2 right-2.5 -translate-y-1/2 text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <span>✨</span>
      </div>

      {/* 7. Bottom-Left: 3D Pencil ✏️ */}
      <div
        className="absolute bottom-4 left-3 sm:bottom-6 sm:left-5 text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] animate-float-subtle"
        title="Pencil"
      >
        <span className="inline-block transform rotate-45">
          ✏️
        </span>
      </div>

      {/* 8. Bottom-Right: 3D Earth Globe 🌍 */}
      <div
        className="absolute bottom-4 right-3 sm:bottom-6 sm:right-5 text-2xl sm:text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] animate-float-delayed"
        title="Globe"
      >
        <span className="inline-block transform -rotate-6">
          🌍
        </span>
      </div>

      {/* 9. Bottom-Center Star ⭐ */}
      <div className="absolute bottom-2 left-1/3 text-sm sm:text-base filter drop-shadow-[0_2px_4px_rgba(251,188,5,0.4)]">
        <span>⭐</span>
      </div>

    </div>
  );
};
