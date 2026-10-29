import React, { useState } from 'react';
import { ClassItem } from '../../types/classTypes';
import { ImageOff, Sparkles } from 'lucide-react';

interface ClassPhotoDisplayProps {
  selectedClass: ClassItem;
}

export const ClassPhotoDisplay: React.FC<ClassPhotoDisplayProps> = ({ selectedClass }) => {
  const [loadError, setLoadError] = useState(false);

  // Format header name as "CLASS 4.6", "CLASS 5.2", etc.
  const rawName = selectedClass.name.trim();
  const displayName = rawName.toUpperCase().startsWith('CLASS')
    ? rawName.toUpperCase()
    : `CLASS ${rawName.toUpperCase()}`;

  const hasImage = Boolean(selectedClass.imageUrl && selectedClass.imageUrl.trim());

  // Normalize image source path
  let imgSrc = selectedClass.imageUrl || '';
  if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('data:')) {
    if (!imgSrc.startsWith('./') && !imgSrc.startsWith('/')) {
      imgSrc = `./${imgSrc}`;
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fadeIn">
      {/* 1. Class Name Banner above photo */}
      <div className="mb-2 flex items-center gap-2 bg-[#FFFDF1] px-5 py-1.5 rounded-full border-2 border-[#FFECA8] shadow-sm">
        <Sparkles className="w-5 h-5 text-[#FFD747] animate-spin" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FF7628] tracking-tight font-heading uppercase text-center drop-shadow-sm">
          {displayName}
        </h2>
        <Sparkles className="w-5 h-5 text-[#FFD747] animate-spin" />
      </div>

      {/* 2. Big Photo Frame with object-contain (Full photo without distortion or crop) */}
      <div className="w-full bg-[#FFFDF1] rounded-3xl border-3 border-[#FFECA8] p-2 shadow-cream-card flex items-center justify-center max-h-[50vh] sm:max-h-[54vh] overflow-hidden">
        {!hasImage || loadError ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FFEAEA] text-[#FF4B4B] border border-[#FFCCD4] flex items-center justify-center mb-2">
              <ImageOff className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#263238] mb-0.5">
              No Photo Available for {selectedClass.name}
            </h3>
            <p className="text-[11px] text-[#78909C] font-bold">
              {loadError
                ? 'The image link could not be loaded. Please check the URL in "Manage Classes".'
                : 'No photo URL has been added for this class.'}
            </p>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={`${selectedClass.name} Photo`}
            onError={() => setLoadError(true)}
            className="w-full h-auto max-h-[48vh] sm:max-h-[52vh] object-contain rounded-2xl select-none transition-all duration-300 shadow-sm"
          />
        )}
      </div>
    </div>
  );
};
