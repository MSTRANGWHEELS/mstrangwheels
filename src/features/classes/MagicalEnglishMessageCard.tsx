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
  illustrationSize = 135,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation: wait ~0.4s then smoothly scale up (95% -> 100%) and fade in over 0.7s
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [message.id]);

  return (
    <div
      role="region"
      aria-label={`Magical English Message: ${message.text}. ${message.ariaDescription}`}
      className={`relative w-full max-w-[245px] lg:max-w-[260px] xl:max-w-[270px] mx-auto rounded-3xl bg-gradient-to-b from-[#FFFDF3] via-[#DDF9FA] to-[#D8F1FF] border-2 border-[#79DDEA] shadow-[0_8px_24px_rgba(121,221,234,0.36),0_0_18px_rgba(255,217,106,0.3),inset_0_1px_3px_rgba(255,255,255,0.95)] p-3 sm:p-3.5 flex flex-col items-center justify-center text-center select-none transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
      } ${className}`}
    >
      {/* Subtle Top Glossy Sheen Highlight */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/70 to-transparent rounded-t-3xl pointer-events-none" />

      {/* Decorative Golden Sparkles on Corners */}
      <div className="absolute -top-2 -right-2 pointer-events-none drop-shadow-[0_2px_6px_rgba(255,217,106,0.6)]">
        <Sparkles className="w-5 h-5 text-[#FFD96A] animate-spin" />
      </div>
      <div className="absolute -top-1.5 -left-1.5 pointer-events-none drop-shadow-[0_2px_4px_rgba(255,217,106,0.5)]">
        <Sparkles className="w-3.5 h-3.5 text-[#FFD96A] animate-pulse" />
      </div>

      {/* TOP: Small Decorative Header Label (Increased ~15-20%) */}
      <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-[#DDF9FA] via-[#FFFDF3] to-[#DDF9FA] border border-[#79DDEA] px-3 py-0.5 rounded-full mb-1 shadow-[0_1px_6px_rgba(121,221,234,0.35)] flex-shrink-0">
        <span className="text-[8px] text-[#FFD96A]">✨</span>
        <span className="text-[9px] sm:text-[9.5px] md:text-[10px] font-black uppercase tracking-wider text-[#164A9B] font-heading">
          MAGICAL ENGLISH MESSAGE
        </span>
        <span className="text-[8px] text-[#FFD96A]">✨</span>
      </div>

      {/* MIDDLE: Large 3D Illustration Container with Gentle Moving Animations (+35-45% size) */}
      <div className="relative my-1 flex items-center justify-center pointer-events-none drop-shadow-sm flex-shrink-0">
        <MagicalMessageIllustration index={message.index} size={illustrationSize} />
      </div>

      {/* BOTTOM: Motivational English Sentence – Primary Focus in Deep Royal Blue (#164A9B) – NO quotation marks! */}
      <h3
        className="relative font-heading font-black text-base sm:text-[17px] md:text-[19px] lg:text-[20px] xl:text-[21px] leading-tight text-[#164A9B] tracking-tight my-0.5 px-1"
        style={{
          textShadow: '0 1px 1px rgba(255, 253, 243, 0.95), 0 2px 6px rgba(22, 74, 155, 0.22)',
        }}
      >
        {message.text}
      </h3>

      {/* LOCKED VIETNAMESE TRANSLATION (Immediately BELOW English sentence) */}
      {/* Font size: ~65% of English text | Color: Warm Deep Orange #C76A25 | Weight: 600-700 */}
      <p className="relative font-bold text-[10.5px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13px] xl:text-[13.5px] text-[#C76A25] leading-snug mt-1 px-1 tracking-normal">
        {message.vietnamese}
      </p>
    </div>
  );
};
