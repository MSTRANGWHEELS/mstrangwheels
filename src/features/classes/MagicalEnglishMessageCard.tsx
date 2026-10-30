import React, { useState, useEffect } from 'react';
import { EnglishMessageItem } from '../../types/messageTypes';
import { MagicalMessageIllustration } from '../../components/illustrations/MagicalMessageIllustrations';
import { Sparkles } from 'lucide-react';

interface MagicalEnglishMessageCardProps {
  message: EnglishMessageItem;
  className?: string;
  illustrationSize?: number;
}

export const MagicalEnglishMessageCard: React.FC<MagicalEnglishMessageCardProps> = ({
  message,
  className = '',
  illustrationSize = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation: wait ~0.4s then smoothly fade in & glide up over 0.8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 450);
    return () => clearTimeout(timer);
  }, [message.id]);

  return (
    <div
      role="region"
      aria-label={`Magical English Message: ${message.text}. ${message.ariaDescription}`}
      className={`relative w-full max-w-[210px] mx-auto rounded-2xl bg-gradient-to-b from-[#FFFDF7]/95 via-[#F2FAFD]/95 to-[#E5F5FB]/95 border-2 border-[#8ED8F8] shadow-[0_6px_20px_rgba(22,74,155,0.18),0_0_12px_rgba(142,216,248,0.4)] p-2.5 flex flex-col items-center justify-center text-center select-none transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
      } ${className}`}
    >
      {/* Soft Decorative Star Sparkle in Top Corner */}
      <div className="absolute -top-1.5 -right-1.5 pointer-events-none">
        <Sparkles className="w-4 h-4 text-[#FFE17B] animate-spin" />
      </div>

      {/* Tiny Header Badge */}
      <div className="inline-flex items-center gap-1 bg-[#8ED8F8]/30 px-2 py-0.5 rounded-full mb-1 border border-[#8ED8F8]/60">
        <span className="text-[8px] font-black uppercase tracking-wider text-[#1265A8]">
          ✨ Magical Message ✨
        </span>
      </div>

      {/* 3D Illustration Container with Smooth Floating Animation */}
      <div className="my-0.5 flex items-center justify-center pointer-events-none drop-shadow-sm">
        <MagicalMessageIllustration index={message.index} size={illustrationSize} />
      </div>

      {/* Motivational English Sentence in Dark Blue Typography (#164A9B) */}
      <h3 className="font-heading font-black text-xs sm:text-sm md:text-[15px] leading-tight text-[#164A9B] drop-shadow-[0_1px_4px_rgba(142,216,248,0.45)] tracking-tight my-0.5 px-1">
        "{message.text}"
      </h3>

      {/* Educational Meaning Tooltip / Sub-caption */}
      <p className="text-[9px] sm:text-[10px] font-bold text-[#1265A8]/85 leading-tight mt-0.5 px-0.5">
        {message.meaning}
      </p>
    </div>
  );
};
