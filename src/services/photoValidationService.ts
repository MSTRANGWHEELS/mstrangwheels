import { ClassItem, PhotoValidationStatus } from '../types/classTypes';
import { checkImageLoadsWithDetails, ImageValidationResult } from '../utils/urlValidator';

const CACHE_KEY = 'mstrang_photo_validation_cache_v3';

// In-memory cache for fast lookups: maps url -> status
const memoryCache = new Map<string, PhotoValidationStatus>();
// Diagnostic reason cache
const errorReasonCache = new Map<string, string>();

// Known local assets that are verified to exist in the public folder
const KNOWN_VALID_LOCAL_ASSETS = new Set([
  './classes/class-4-1.jpg',
  'classes/class-4-1.jpg',
  '/classes/class-4-1.jpg',
  './classes/class-4-6.jpg',
  'classes/class-4-6.jpg',
  '/classes/class-4-6.jpg',
  './classes/class-5-2.jpg',
  'classes/class-5-2.jpg',
  '/classes/class-5-2.jpg',
  './classes/class-5-6.jpg',
  'classes/class-5-6.jpg',
  '/classes/class-5-6.jpg',
]);

// Load persistent cache from localStorage (ONLY valid statuses are restored to prevent permanent lockout of fixed URLs)
function initCache() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, PhotoValidationStatus>;
      for (const [url, status] of Object.entries(parsed)) {
        if (status === 'valid') {
          memoryCache.set(url, 'valid');
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load photo validation cache', e);
  }
}

initCache();

function saveCache() {
  if (typeof window === 'undefined') return;
  try {
    // Only persist 'valid' statuses to prevent stale negative lockouts
    const obj: Record<string, PhotoValidationStatus> = {};
    for (const [url, status] of memoryCache.entries()) {
      if (status === 'valid') {
        obj[url] = status;
      }
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed to save photo validation cache', e);
  }
}

/**
 * Invalidate cache for a specific photo URL or all URLs
 */
export function invalidatePhotoCache(urlToClear?: string): void {
  if (urlToClear) {
    const trimmed = urlToClear.trim();
    memoryCache.delete(trimmed);
    errorReasonCache.delete(trimmed);
  } else {
    memoryCache.clear();
    errorReasonCache.clear();
  }
  saveCache();
}

/**
 * Validates a single class's photo URL with full diagnostic results.
 */
export async function validateClassPhotoDetailed(
  imageUrl: string | undefined | null,
  forceRefresh: boolean = false
): Promise<ImageValidationResult & { status: PhotoValidationStatus }> {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return {
      isValid: false,
      status: 'none',
      resolvedUrl: '',
      errorReason: 'No photo URL entered. A photo is required for the class to be eligible to win.',
    };
  }

  const trimmed = imageUrl.trim();

  // Fast-path known static images
  if (KNOWN_VALID_LOCAL_ASSETS.has(trimmed)) {
    memoryCache.set(trimmed, 'valid');
    return {
      isValid: true,
      status: 'valid',
      resolvedUrl: trimmed,
    };
  }

  // Check cache unless forceRefresh requested
  if (!forceRefresh && memoryCache.has(trimmed) && memoryCache.get(trimmed) === 'valid') {
    return {
      isValid: true,
      status: 'valid',
      resolvedUrl: trimmed,
    };
  }

  if (forceRefresh) {
    invalidatePhotoCache(trimmed);
  }

  const detail = await checkImageLoadsWithDetails(trimmed, 4500);
  const status: PhotoValidationStatus = detail.isValid ? 'valid' : 'invalid';

  memoryCache.set(trimmed, status);
  if (detail.errorReason) {
    errorReasonCache.set(trimmed, detail.errorReason);
  } else {
    errorReasonCache.delete(trimmed);
  }

  saveCache();

  return {
    ...detail,
    status,
  };
}

/**
 * Validates a single class's photo URL.
 * Returns 'valid', 'invalid', or 'none'.
 */
export async function validateClassPhoto(
  imageUrl: string | undefined | null,
  forceRefresh: boolean = false
): Promise<PhotoValidationStatus> {
  const result = await validateClassPhotoDetailed(imageUrl, forceRefresh);
  return result.status;
}

/**
 * Retrieves cached error reason for a URL if validation failed
 */
export function getPhotoErrorReason(imageUrl: string | undefined | null): string | undefined {
  if (!imageUrl) return undefined;
  return errorReasonCache.get(imageUrl.trim());
}

/**
 * Determines whether a class is eligible to win.
 * A class can win ONLY when:
 * 1. It is enabled (isEnabled !== false)
 * 2. It has a non-empty photo URL
 * 3. The photo URL is verified to load successfully ('valid')
 */
export function isClassEligible(
  cls: ClassItem,
  validationMap?: Record<string, PhotoValidationStatus>
): boolean {
  if (cls.isEnabled === false) return false;
  if (!cls.imageUrl || !cls.imageUrl.trim()) return false;

  const status = validationMap ? validationMap[cls.id] : cls.photoStatus;
  if (status === 'valid') return true;

  // Fallback to memory cache
  const cached = memoryCache.get(cls.imageUrl.trim());
  if (cached === 'valid') return true;

  if (KNOWN_VALID_LOCAL_ASSETS.has(cls.imageUrl.trim())) return true;

  return false;
}
