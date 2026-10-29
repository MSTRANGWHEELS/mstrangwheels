import { ClassItem, StoredRoundData, PhotoValidationStatus } from '../types/classTypes';

const STORAGE_KEY_CLASSES = 'mstrang_wheel_classes_v3';
const STORAGE_KEY_SELECTED = 'mstrang_wheel_selected_id_v3';
const STORAGE_KEY_ROUND = 'mstrang_wheel_round_v4';

const LEGACY_KEYS = [
  'mstrang_wheel_classes_v2',
  'mstrang_wheel_classes_v1',
  'wheel_classes',
  'ms_trang_classes',
  'mstrang_classes',
];

// The primary starter classes with exact verified photo mappings & Vibrant Galaxy Neon colors
export const FIVE_TARGET_CLASSES: { id: string; name: string; url: string; color: string }[] = [
  { id: 'cls_class_4_1', name: 'Class 4.1', url: './classes/class-4-1.jpg', color: '#00E676' }, // Bright green
  { id: 'cls_class_4_6', name: 'Class 4.6', url: './classes/class-4-6.jpg', color: '#FFD600' }, // Golden yellow
  { id: 'cls_class_5_2', name: 'Class 5.2', url: './classes/class-5-2.jpg', color: '#00D9F5' }, // Bright cyan
  { id: 'cls_class_5_6', name: 'Class 5.6', url: './classes/class-5-6.jpg', color: '#FF4F91' }, // Vibrant pink
  { id: 'cls_class_5_8', name: 'Class 5.8', url: '', color: '#B388FF' }, // Bright lavender (NO photo available - cannot win)
];

const DEFAULT_STARTER_CLASSES: ClassItem[] = FIVE_TARGET_CLASSES.map((c, i) => ({
  id: c.id,
  name: c.name,
  students: [],
  imageUrl: c.url,
  isEnabled: true,
  photoStatus: c.url ? ('valid' as PhotoValidationStatus) : ('none' as PhotoValidationStatus),
  createdAt: i + 1,
  updatedAt: Date.now(),
}));

export function generateClassId(): string {
  return 'cls_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

export function loadStoredClasses(): { classes: ClassItem[]; error?: string } {
  if (typeof window === 'undefined') {
    return { classes: DEFAULT_STARTER_CLASSES };
  }

  try {
    let raw = localStorage.getItem(STORAGE_KEY_CLASSES);

    if (!raw) {
      for (const legacyKey of LEGACY_KEYS) {
        const legacyData = localStorage.getItem(legacyKey);
        if (legacyData) {
          raw = legacyData;
          break;
        }
      }
    }

    if (!raw) {
      saveStoredClasses(DEFAULT_STARTER_CLASSES);
      return { classes: DEFAULT_STARTER_CLASSES };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveStoredClasses(DEFAULT_STARTER_CLASSES);
      return { classes: DEFAULT_STARTER_CLASSES };
    }

    const loadedClasses: ClassItem[] = parsed.map((item: unknown, index: number) => {
      const obj = (typeof item === 'object' && item !== null ? item : {}) as Record<string, unknown>;

      const id = typeof obj.id === 'string' && obj.id.trim() ? obj.id.trim() : `cls_migrated_${index}_${Date.now()}`;
      const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim() : `Class ${index + 1}`;
      let imageUrl = typeof obj.imageUrl === 'string' ? obj.imageUrl.trim() : '';

      // Critical Guard: Class 5.8 must never use Class 5.2 local photo asset as fallback
      if (id === 'cls_class_5_8' || name.includes('5.8')) {
        const isClass52Asset =
          imageUrl === './classes/class-5-2.jpg' ||
          imageUrl === '/classes/class-5-2.jpg' ||
          imageUrl === 'classes/class-5-2.jpg' ||
          imageUrl.endsWith('/class-5-2.jpg') ||
          imageUrl.includes('class-5-2.');
        if (isClass52Asset) {
          imageUrl = '';
        }
      }

      const isEnabled = typeof obj.isEnabled === 'boolean' ? obj.isEnabled : true;
      const photoStatus =
        typeof obj.photoStatus === 'string' ? (obj.photoStatus as PhotoValidationStatus) : undefined;

      return {
        id,
        name,
        students: Array.isArray(obj.students) ? (obj.students as string[]) : [],
        imageUrl,
        isEnabled,
        photoStatus,
        createdAt: typeof obj.createdAt === 'number' ? obj.createdAt : Date.now(),
        updatedAt: Date.now(),
      };
    });

    return { classes: loadedClasses };
  } catch (err) {
    console.error('Failed to parse classes from storage:', err);
    saveStoredClasses(DEFAULT_STARTER_CLASSES);
    return {
      classes: DEFAULT_STARTER_CLASSES,
      error: 'Could not load your saved classes. Restored default classes.',
    };
  }
}

export function saveStoredClasses(classes: ClassItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  } catch (err) {
    console.error('Failed to save classes to storage:', err);
  }
}

export function loadSelectedClassId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_SELECTED);
}

export function saveSelectedClassId(classId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SELECTED, classId);
}

// =============================================================================
// ROUND PERSISTENCE & MANAGEMENT (NON-REPEATING WINNERS)
// =============================================================================

const DEFAULT_ROUND_DATA: StoredRoundData = {
  roundNumber: 1,
  wonClassIds: [],
  rotationOffset: 0,
};

export function loadStoredRound(): StoredRoundData {
  if (typeof window === 'undefined') return DEFAULT_ROUND_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROUND);
    if (!raw) return DEFAULT_ROUND_DATA;

    const parsed = JSON.parse(raw);
    return {
      roundNumber: typeof parsed.roundNumber === 'number' && parsed.roundNumber > 0 ? parsed.roundNumber : 1,
      wonClassIds: Array.isArray(parsed.wonClassIds) ? parsed.wonClassIds : [],
      rotationOffset: typeof parsed.rotationOffset === 'number' ? parsed.rotationOffset : 0,
    };
  } catch (e) {
    console.warn('Failed to load round data, using default', e);
    return DEFAULT_ROUND_DATA;
  }
}

export function saveStoredRound(data: StoredRoundData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ROUND, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save round data:', e);
  }
}

export function resetStoredRound(nextRoundNumber?: number): StoredRoundData {
  const roundNumber = nextRoundNumber !== undefined ? nextRoundNumber : 1;
  const resetData: StoredRoundData = {
    roundNumber,
    wonClassIds: [],
    rotationOffset: 0,
  };
  saveStoredRound(resetData);
  return resetData;
}
