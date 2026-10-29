import React from 'react';
import { ClassItem } from '../../types/classTypes';
import { CuteButton } from '../../components/ui/CuteButton';
import { isValidHttpUrl, openUrlSafely } from '../../utils/urlValidator';
import { ExternalLink, Image as ImageIcon, Settings, Users, Sparkles } from 'lucide-react';

interface ClassHeaderBarProps {
  classes: ClassItem[];
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
  onOpenManager: () => void;
  isSpinning: boolean;
}

export const ClassHeaderBar: React.FC<ClassHeaderBarProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  onOpenManager,
  isSpinning,
}) => {
  const currentClass = classes.find((c) => c.id === selectedClassId) || null;
  const hasValidImage = currentClass ? isValidHttpUrl(currentClass.imageUrl) : false;

  const handleOpenPhoto = () => {
    if (currentClass && hasValidImage && currentClass.imageUrl) {
      openUrlSafely(currentClass.imageUrl);
    }
  };

  const studentCount = currentClass ? currentClass.students.length : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-5 border-4 border-candy-yellow shadow-cute-card flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Class Selection Dropdown & Count */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <label htmlFor="class-select" className="font-extrabold text-slate-700 text-lg md:text-xl">
              Class:
            </label>
          </div>

          {classes.length > 0 ? (
            <div className="relative">
              <select
                id="class-select"
                value={selectedClassId || ''}
                onChange={(e) => onSelectClass(e.target.value)}
                disabled={isSpinning}
                className="appearance-none bg-candy-softPink/60 hover:bg-candy-softPink text-pink-900 font-extrabold text-lg md:text-xl px-5 py-2.5 pr-10 rounded-2xl border-2 border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id} className="text-slate-800 font-bold bg-white">
                    {cls.name} ({cls.students.length} students)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-pink-700">
                ▼
              </div>
            </div>
          ) : (
            <span className="text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200">
              No classes created yet
            </span>
          )}

          {/* Student Count Badge */}
          {currentClass && (
            <div className="flex items-center gap-1.5 bg-candy-sky/15 text-sky-800 border-2 border-sky-200 px-3.5 py-1.5 rounded-2xl font-extrabold text-sm md:text-base">
              <Users className="w-4 h-4 text-sky-600" />
              <span>{studentCount} Students</span>
            </div>
          )}
        </div>

        {/* Right: View Class Photo Button & Manage Classes */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Requirement 3: View Class Photo Button */}
          {currentClass ? (
            <CuteButton
              color={hasValidImage ? 'blue' : 'white'}
              size="md"
              disabled={isSpinning || !hasValidImage}
              onClick={handleOpenPhoto}
              title={
                hasValidImage
                  ? `Open class photo for ${currentClass.name}`
                  : 'Chưa thêm hình lớp / No class photo added'
              }
              icon={hasValidImage ? <ExternalLink className="w-5 h-5" /> : <ImageIcon className="w-5 h-5 text-slate-400" />}
              className="font-extrabold"
            >
              {hasValidImage ? (
                <span>🖼️ Xem hình lớp {currentClass.name}</span>
              ) : (
                <span className="text-slate-400 font-bold">Chưa thêm hình lớp</span>
              )}
            </CuteButton>
          ) : null}

          {/* Manage Classes Button */}
          <CuteButton
            color="yellow"
            size="md"
            disabled={isSpinning}
            onClick={onOpenManager}
            icon={<Settings className="w-5 h-5 text-amber-800" />}
          >
            Manage Classes
          </CuteButton>
        </div>

      </div>

      {/* Quick encouragement banner */}
      {currentClass && studentCount > 0 && (
        <div className="flex items-center justify-center gap-2 mt-2 text-pink-600 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-candy-yellow animate-spin" />
          <span>Ready for lucky draw in <strong className="underline">{currentClass.name}</strong>!</span>
          <Sparkles className="w-4 h-4 text-candy-yellow animate-spin" />
        </div>
      )}
    </div>
  );
};
