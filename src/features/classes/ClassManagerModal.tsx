import React, { useState, useMemo, useEffect } from 'react';
import { ClassItem, PhotoValidationStatus } from '../../types/classTypes';
import { generateClassId } from '../../services/storageService';
import { formatPhotoUrl } from '../../utils/urlValidator';
import {
  isClassEligible,
  validateClassPhotoDetailed,
} from '../../services/photoValidationService';
import { CuteButton } from '../../components/ui/CuteButton';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Trophy,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface ClassManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  selectedClassId: string | null;
  roundNumber?: number;
  wonClassIds: string[];
  validationMap: Record<string, PhotoValidationStatus>;
  onSaveClass: (cls: ClassItem) => void;
  onDeleteClass: (classId: string) => void;
  onSelectClass: (classId: string) => void;
  onResetRound: () => void;
}

export const ClassManagerModal: React.FC<ClassManagerModalProps> = ({
  isOpen,
  onClose,
  classes,
  selectedClassId,
  roundNumber: _roundNumber,
  wonClassIds,
  validationMap,
  onSaveClass,
  onDeleteClass,
  onSelectClass,
  onResetRound,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'batch'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Single class form
  const [className, setClassName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Live photo preview state in form with detailed error reporting
  const [liveValidation, setLiveValidation] = useState<{
    status: 'checking' | 'valid' | 'invalid' | 'none';
    url: string;
    errorMessage?: string;
    isGoogleDrive?: boolean;
    resolvedUrl?: string;
  }>({ status: 'none', url: '' });

  // Batch paste classes text
  const [batchClassesText, setBatchClassesText] = useState('');

  // Live validation debouncer when typing URL in form
  useEffect(() => {
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      setLiveValidation({ status: 'none', url: '' });
      return;
    }

    setLiveValidation({ status: 'checking', url: trimmed });
    let isCurrent = true;

    const timer = setTimeout(async () => {
      // Force real-time validation without stale cache
      const detail = await validateClassPhotoDetailed(trimmed, true);
      if (isCurrent) {
        setLiveValidation({
          status: detail.isValid ? 'valid' : 'invalid',
          url: trimmed,
          errorMessage: detail.errorReason,
          isGoogleDrive: detail.isGoogleDrive,
          resolvedUrl: detail.resolvedUrl,
        });
      }
    }, 400);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  const startEditing = (cls: ClassItem) => {
    setEditingId(cls.id);
    setClassName(cls.name);
    setImageUrl(cls.imageUrl || '');
    setIsEnabled(cls.isEnabled !== false);
    setFormError(null);
    setActiveTab('form');
  };

  const startCreating = () => {
    setEditingId(null);
    setClassName('');
    setImageUrl('');
    setIsEnabled(true);
    setFormError(null);
    setActiveTab('form');
  };

  // Duplicate class names detection
  const duplicateClassNames = useMemo(() => {
    const counts: Record<string, number> = {};
    classes.forEach((c) => {
      const lower = c.name.toLowerCase().trim();
      counts[lower] = (counts[lower] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([_, count]) => count > 1)
      .map(([name, count]) => ({ name, count }));
  }, [classes]);

  // Statistics
  const totalClasses = classes.length;
  const eligibleClasses = useMemo(() => {
    return classes.filter((c) => isClassEligible(c, validationMap));
  }, [classes, validationMap]);

  const wonClassesCount = useMemo(() => {
    return eligibleClasses.filter((c) => wonClassIds.includes(c.id)).length;
  }, [eligibleClasses, wonClassIds]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = className.trim();

    if (!trimmedName) {
      setFormError('Class name is required (e.g. "4.1" or "Class 4.1").');
      return;
    }

    const trimmedUrl = imageUrl.trim();
    const existingClass = editingId ? classes.find((c) => c.id === editingId) : null;

    let photoStatus: PhotoValidationStatus = 'none';
    if (trimmedUrl) {
      // Force fresh re-check on save
      const detail = await validateClassPhotoDetailed(trimmedUrl, true);
      photoStatus = detail.isValid ? 'valid' : 'invalid';
    }

    const itemToSave: ClassItem = {
      id: editingId || generateClassId(),
      name: trimmedName,
      students: existingClass ? existingClass.students : [],
      imageUrl: trimmedUrl,
      isEnabled,
      photoStatus,
      createdAt: existingClass ? existingClass.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    onSaveClass(itemToSave);
    setActiveTab('list');
  };

  const handleBatchImport = () => {
    const lines = batchClassesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    lines.forEach((line) => {
      const parts = line.split(',');
      const name = parts[0]?.trim();
      const url = parts[1]?.trim() || '';

      if (!name) return;

      const newClass: ClassItem = {
        id: generateClassId(),
        name,
        students: [],
        imageUrl: url,
        isEnabled: true,
        photoStatus: url ? 'checking' : 'none',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      onSaveClass(newClass);
    });

    setBatchClassesText('');
    setActiveTab('list');
  };

  const handleDelete = (cls: ClassItem) => {
    if (window.confirm(`Are you sure you want to delete "${cls.name}"?`)) {
      onDeleteClass(cls.id);
    }
  };

  const handleToggleEnable = (cls: ClassItem) => {
    onSaveClass({
      ...cls,
      isEnabled: cls.isEnabled === false ? true : false,
    });
  };

  const handleConfirmResetRound = () => {
    if (
      window.confirm(
        'Reset winner selection progress? This will allow all eligible classes to be selected again.'
      )
    ) {
      onResetRound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A051D]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#160E36] rounded-3xl border-3 border-[#7C4DFF] shadow-[0_0_35px_rgba(124,77,255,0.45)] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden font-sans text-white">
        
        {/* Modal Header */}
        <div className="relative bg-[#221551] border-b-2 border-[#7C4DFF] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#00D9F5] tracking-tight font-heading">
                Manage Galaxy Classes
              </h2>
              <p className="text-xs text-[#B388FF] font-bold">
                Trang Tấn Khương Primary School • Unlimited Classes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Winner Round Button */}
            <CuteButton
              color="spin"
              size="sm"
              onClick={handleConfirmResetRound}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              title="Reset winner progress so all classes can win again"
              className="py-1 px-3 text-xs"
            >
              Reset Winners
            </CuteButton>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#FF4F91] text-white border-2 border-[#FF80AB] hover:brightness-110 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Subnav Tabs */}
        <div className="flex border-b border-[#7C4DFF]/50 bg-[#12092E]/70 px-4 pt-2.5 gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 font-black text-xs sm:text-sm rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-[#160E36] text-[#00D9F5] border-t-2 border-x-2 border-[#7C4DFF] -mb-[1px]'
                : 'text-[#B388FF] hover:text-white'
            }`}
          >
            Class List ({classes.length})
          </button>
          <button
            onClick={startCreating}
            className={`px-3.5 py-1.5 font-black text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'form' && !editingId
                ? 'bg-[#160E36] text-[#00D9F5] border-t-2 border-x-2 border-[#7C4DFF] -mb-[1px]'
                : 'text-[#B388FF] hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3.5 py-1.5 font-black text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-[#160E36] text-[#00D9F5] border-t-2 border-x-2 border-[#7C4DFF] -mb-[1px]'
                : 'text-[#B388FF] hover:text-white'
            }`}
          >
            <span>Batch Add</span>
          </button>
        </div>

        {/* Summary Statistics Bar */}
        <div className="bg-[#12092E]/90 border-b border-[#7C4DFF]/40 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#E0E7FF]">
              Total: <strong className="text-white">{totalClasses}</strong>
            </span>
            <span className="font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full border border-[#00E676]/40">
              Eligible to Win: {eligibleClasses.length}
            </span>
            {totalClasses > eligibleClasses.length && (
              <span className="font-bold text-[#FFD600] bg-[#FFD600]/10 px-2 py-0.5 rounded-full border border-[#FFD600]/40">
                Ineligible (No photo/disabled): {totalClasses - eligibleClasses.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#7C4DFF]/40 text-[#E0E7FF] font-bold px-2 py-0.5 rounded-full border border-[#7C4DFF]">
              Selected: {wonClassesCount}/{eligibleClasses.length}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              
              {/* Duplicate check warning */}
              {duplicateClassNames.length > 0 && (
                <div className="bg-[#FFD600]/20 border-2 border-[#FFD600] text-[#FFD600] p-3 rounded-2xl text-xs font-black flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black">Duplicate class notice:</span>
                    {duplicateClassNames.map((d, i) => (
                      <span key={i} className="ml-1">
                        "{d.name}" appears {d.count} times.
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#B388FF]">
                  Only classes with <strong className="text-[#00E676]">Valid Photos</strong> and enabled status can participate on the wheel.
                </span>
                <CuteButton color="photo" size="sm" onClick={startCreating} icon={<Plus className="w-3.5 h-3.5" />}>
                  New Class
                </CuteButton>
              </div>

              {classes.length === 0 ? (
                <div className="text-center py-10 bg-[#1F134A] rounded-2xl border-2 border-dashed border-[#7C4DFF] p-6">
                  <span className="text-3xl mb-2 block">🌟</span>
                  <h3 className="text-base font-black text-white mb-1">No Classes Yet</h3>
                  <p className="text-xs text-[#B388FF] font-bold mb-4">
                    Add your classes with photos to launch the prize wheel!
                  </p>
                  <CuteButton color="photo" size="sm" onClick={startCreating} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add First Class
                  </CuteButton>
                </div>
              ) : (
                <div className="space-y-2">
                  {classes.map((cls) => {
                    const isCurrent = cls.id === selectedClassId;
                    const eligible = isClassEligible(cls, validationMap);
                    const photoStatus = validationMap[cls.id] || cls.photoStatus || 'none';
                    const hasWon = wonClassIds.includes(cls.id);
                    const isEnabled = cls.isEnabled !== false;

                    return (
                      <div
                        key={cls.id}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-wrap items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-[#2E1A66] border-[#00D9F5] shadow-[0_0_12px_rgba(0,217,245,0.4)]'
                            : isEnabled
                            ? 'bg-[#1F134A] border-[#7C4DFF]/50 hover:border-[#7C4DFF]'
                            : 'bg-[#140C2E] border-white/10 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Mini Thumbnail or Placeholder */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#12092E] border border-white/20 flex-shrink-0 flex items-center justify-center">
                            {cls.imageUrl && photoStatus === 'valid' ? (
                              <img
                                src={formatPhotoUrl(cls.imageUrl)}
                                alt={cls.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-white/30" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => onSelectClass(cls.id)}
                                className={`text-left font-black text-sm sm:text-base cursor-pointer hover:text-[#00D9F5] transition-colors ${
                                  isEnabled ? 'text-white' : 'text-white/60 line-through'
                                }`}
                                title="Click to select class preview"
                              >
                                {cls.name}
                              </button>

                              {/* Eligibility Badge */}
                              {eligible ? (
                                <span className="bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> CAN WIN
                                </span>
                              ) : (
                                <span className="bg-[#FF7628]/20 text-[#FF7628] border border-[#FF7628]/50 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  {!isEnabled ? 'DISABLED' : !cls.imageUrl ? 'NO PHOTO' : 'PHOTO BROKEN'}
                                </span>
                              )}

                              {/* Winner Status */}
                              {hasWon && (
                                <span className="bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/50 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                                  <Trophy className="w-3 h-3" /> SELECTED WINNER
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-[#B388FF] font-bold mt-0.5">
                              {photoStatus === 'valid' ? (
                                <span className="text-[#00E676] flex items-center gap-1 font-black">
                                  ✓ Valid photo verified
                                </span>
                              ) : photoStatus === 'invalid' ? (
                                <span className="text-[#FF80AB] flex items-center gap-1 text-[11px] font-bold">
                                  ✗ Photo not loading (Click Edit to inspect & fix)
                                </span>
                              ) : (
                                <span className="text-white/40">No photo URL</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          {/* Toggle Enable/Disable */}
                          <CuteButton
                            color="cream"
                            size="sm"
                            onClick={() => handleToggleEnable(cls)}
                            title={isEnabled ? 'Disable class from wheel' : 'Enable class'}
                            icon={isEnabled ? <Eye className="w-3.5 h-3.5 text-[#00D9F5]" /> : <EyeOff className="w-3.5 h-3.5 text-white/40" />}
                          >
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </CuteButton>

                          <CuteButton
                            color="yellow"
                            size="sm"
                            onClick={() => startEditing(cls)}
                            icon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </CuteButton>

                          <CuteButton
                            color="pink"
                            size="sm"
                            onClick={() => handleDelete(cls)}
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </CuteButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'form' ? (
            /* Single Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white">
                  {editingId ? `Edit Class: ${className || 'Untitled'}` : 'Create New Class'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs text-[#B388FF] font-bold hover:underline"
                >
                  Back to list
                </button>
              </div>

              {formError && (
                <div className="bg-[#FF4F91]/20 border-2 border-[#FF4F91] text-[#FF80AB] p-3 rounded-2xl text-xs font-black">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-[#E0E7FF] uppercase mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. 4.1 or Class 4.1"
                  className="w-full bg-[#12092E] border-2 border-[#7C4DFF] rounded-xl px-3 py-2 text-sm text-white font-bold placeholder-white/40 focus:outline-none focus:border-[#00D9F5]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#E0E7FF] uppercase mb-1">
                  Photo URL (Required for Winner Eligibility)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. classes/class-4-1.jpg or Google Drive / web link"
                  className="w-full bg-[#12092E] border-2 border-[#7C4DFF] rounded-xl px-3 py-2 text-sm text-white font-bold placeholder-white/40 focus:outline-none focus:border-[#00D9F5]"
                />
                <p className="text-[11px] text-[#B388FF] mt-1 font-bold">
                  Classes without a valid photo <strong className="text-[#FF7628]">cannot win</strong> and will not appear on the spinning wheel.
                </p>

                {/* Real-Time Live Photo Preview Box */}
                <div className="mt-2.5 p-3 rounded-2xl bg-[#12092E] border-2 border-[#7C4DFF]/50 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1D0E44] border border-white/20 flex-shrink-0 flex items-center justify-center">
                    {liveValidation.status === 'valid' ? (
                      <img
                        src={formatPhotoUrl(liveValidation.url)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : liveValidation.status === 'checking' ? (
                      <Sparkles className="w-6 h-6 text-[#FFD600] animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>

                  <div>
                    <span className="block text-xs font-black">
                      {liveValidation.status === 'valid' ? (
                        <span className="text-[#00E676] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Photo verified & valid! Eligible to win.
                        </span>
                      ) : liveValidation.status === 'checking' ? (
                        <span className="text-[#FFD600] flex items-center gap-1">
                          Checking photo link...
                        </span>
                      ) : liveValidation.status === 'invalid' ? (
                        <div className="space-y-1.5">
                          <span className="text-[#FF4F91] flex items-center gap-1 font-black">
                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> Photo Validation Failed (Cannot Win)
                          </span>
                          {liveValidation.errorMessage && (
                            <p className="text-[#FF80AB] text-[11px] font-bold leading-normal bg-[#FF4F91]/15 p-2 rounded-lg border border-[#FF4F91]/40">
                              {liveValidation.errorMessage}
                            </p>
                          )}
                          {liveValidation.isGoogleDrive && (
                            <div className="bg-[#1A0E3C] border border-[#FFD600]/60 rounded-xl p-2.5 text-[11px] text-[#E0E7FF] mt-1 space-y-1">
                              <span className="font-black text-[#FFD600] flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5 text-[#FFD600]" /> How to fix Google Drive link permissions:
                              </span>
                              <ol className="list-decimal list-inside text-white/90 space-y-0.5 pl-1 font-medium">
                                <li>Open the photo in your Google Drive.</li>
                                <li>Click the blue <strong>Share</strong> button (top-right).</li>
                                <li>Under <strong>General access</strong>, change from <em>Restricted</em> to <strong>Anyone with the link</strong>.</li>
                                <li>Ensure role is set to <strong>Viewer</strong>, then click <strong>Copy link</strong> and paste here.</li>
                              </ol>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-white/50">
                          No photo link entered. This class will be ineligible to win until a photo is added.
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#B388FF] block mt-0.5">
                      Supports direct image URLs, Google Drive file links, and local classes/*.jpg paths.
                    </span>
                  </div>
                </div>
              </div>

              {/* Enable / Disable toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="class-enabled"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#00D9F5] rounded cursor-pointer"
                />
                <label htmlFor="class-enabled" className="text-xs font-black text-[#E0E7FF] cursor-pointer">
                  Enable class (checked = active, unchecked = excluded from wheel)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <CuteButton
                  type="button"
                  color="cream"
                  size="sm"
                  onClick={() => setActiveTab('list')}
                >
                  Cancel
                </CuteButton>

                <CuteButton
                  type="submit"
                  color="photo"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  {editingId ? 'Save Changes' : 'Create Class'}
                </CuteButton>
              </div>
            </form>
          ) : (
            /* Batch Add */
            <div className="space-y-3">
              <h3 className="text-base font-black text-white">Batch Add Classes</h3>
              <p className="text-xs text-[#B388FF] font-bold">
                Add 10, 20, 30 or more classes at once. Enter each class on a new line.<br />
                Format: <code className="bg-[#12092E] px-1 py-0.5 rounded text-[#00D9F5]">Class Name, Optional Photo URL</code>
              </p>
              <textarea
                value={batchClassesText}
                onChange={(e) => setBatchClassesText(e.target.value)}
                placeholder={'Class 4.1, classes/class-4-1.jpg\nClass 4.6, classes/class-4-6.jpg\nClass 5.2, classes/class-5-2.jpg\nClass 5.6, classes/class-5-6.jpg\nClass 5.8'}
                rows={7}
                className="w-full bg-[#12092E] border-2 border-[#7C4DFF] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00D9F5]"
              />

              <div className="flex justify-end gap-2">
                <CuteButton
                  type="button"
                  color="cream"
                  size="sm"
                  onClick={() => setActiveTab('list')}
                >
                  Cancel
                </CuteButton>
                <CuteButton
                  color="photo"
                  size="sm"
                  onClick={handleBatchImport}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Import Classes
                </CuteButton>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#12092E] border-t border-[#7C4DFF]/50 px-4 py-2.5 flex justify-end">
          <CuteButton color="cream" size="sm" onClick={onClose}>
            Done
          </CuteButton>
        </div>

      </div>
    </div>
  );
};
