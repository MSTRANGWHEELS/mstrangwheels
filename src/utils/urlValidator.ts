/**
 * URL Validator & Image Loader Utilities
 * Supports Google Drive links, local project paths, and direct HTTP/HTTPS URLs.
 * Upgraded with robust multi-endpoint Google Drive resolution, detailed error diagnostics,
 * and support for all Google Drive share URL formats.
 */

export interface ImageValidationResult {
  isValid: boolean;
  resolvedUrl: string;
  errorReason?: string;
  isGoogleDrive?: boolean;
  googleDriveId?: string;
}

/**
 * Extracts a Google Drive File ID from various link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.usercontent.google.com/download?id=FILE_ID
 */
export function extractGoogleDriveId(rawUrl: string | undefined | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Pattern 1: /file/d/ID
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: ?id=ID or &id=ID
  const matchParamId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchParamId && matchParamId[1]) return matchParamId[1];

  // Pattern 3: googleusercontent.com/d/ID
  const matchLh3 = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  return null;
}

/**
 * Checks if the URL points to a Google Drive folder rather than a file
 */
export function isGoogleDriveFolder(rawUrl: string | undefined | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  return /drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\//i.test(rawUrl.trim());
}

/**
 * Generates candidate browser-compatible image URLs for a Google Drive file ID
 * in order of highest reliability and image quality.
 */
export function getGoogleDriveCandidates(fileId: string): string[] {
  return [
    // 1. High-Resolution Google Drive Direct Thumbnail (w1600) - No cookie warnings, direct image bytes
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
    // 2. Google User Content CDN Direct Link (w1600)
    `https://lh3.googleusercontent.com/d/${fileId}=w1600`,
    // 3. User Content direct download stream
    `https://drive.usercontent.google.com/download?id=${fileId}&export=view`,
    // 4. Standard uc export
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ];
}

/**
 * Converts Google Drive sharing links and relative paths into direct image URLs.
 */
export function formatPhotoUrl(rawUrl: string | undefined | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Google Drive file
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    // Primary high-res thumbnail endpoint (highest reliability across all modern browsers)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
  }

  // Local assets: classes/... -> ./classes/...
  if (/^classes\//i.test(trimmed)) {
    return `./${trimmed}`;
  }

  return trimmed;
}

/**
 * Validates if the given string is syntactically a plausible image path
 */
export function isValidImageUrl(stringToTest: string | undefined | null): boolean {
  if (!stringToTest || typeof stringToTest !== 'string') {
    return false;
  }

  const trimmed = stringToTest.trim();
  if (!trimmed) {
    return false;
  }

  // Local project resource path (e.g. classes/..., ./classes/..., /classes/...)
  if (/^(\.\/|\/)?classes\/[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(trimmed)) {
    return true;
  }

  // Google Drive URL
  if (extractGoogleDriveId(trimmed) !== null) {
    return true;
  }

  // HTTP or HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  return false;
}

export const isValidHttpUrl = isValidImageUrl;

/**
 * Helper to test loading a single image URL in browser Image object
 */
function testSingleImageUrl(url: string, timeoutMs: number): Promise<{ success: boolean; timedOut: boolean }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve({ success: isValidImageUrl(url), timedOut: false });
      return;
    }

    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        img.src = '';
        resolve({ success: false, timedOut: true });
      }
    }, timeoutMs);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ success: img.naturalWidth > 0 && img.naturalHeight > 0, timedOut: false });
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ success: false, timedOut: false });
      }
    };

    img.src = url;
  });
}

/**
 * Checks whether an image URL can actually be loaded into the browser,
 * returning full diagnostic details and error reason if loading fails.
 */
export async function checkImageLoadsWithDetails(
  rawUrl: string | undefined | null,
  timeoutMs: number = 4500
): Promise<ImageValidationResult> {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      isValid: false,
      resolvedUrl: '',
      errorReason: 'No photo URL entered. A photo is required for the class to be eligible to win.',
    };
  }

  const trimmed = rawUrl.trim();

  // Check if user accidentally pasted a Google Drive folder link
  if (isGoogleDriveFolder(trimmed)) {
    return {
      isValid: false,
      resolvedUrl: '',
      isGoogleDrive: true,
      errorReason:
        'This link points to a Google Drive folder. Please open the specific photo file in Drive, click Share, and copy its file link.',
    };
  }

  // Google Drive File Handling
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    const candidates = getGoogleDriveCandidates(driveId);
    let anyTimedOut = false;

    // Test each candidate URL sequentially until one loads successfully
    for (const candidate of candidates) {
      const res = await testSingleImageUrl(candidate, timeoutMs);
      if (res.success) {
        return {
          isValid: true,
          resolvedUrl: candidate,
          isGoogleDrive: true,
          googleDriveId: driveId,
        };
      }
      if (res.timedOut) {
        anyTimedOut = true;
      }
    }

    // If all candidates failed:
    return {
      isValid: false,
      resolvedUrl: candidates[0],
      isGoogleDrive: true,
      googleDriveId: driveId,
      errorReason: anyTimedOut
        ? 'Google Drive request timed out. Please check your internet connection or Google Drive availability.'
        : "Google Drive photo cannot be loaded. Ensure General Access is set to 'Anyone with the link' (Viewer) and not 'Restricted', and verify the file is a valid image (JPG, PNG, WebP).",
    };
  }

  // Local assets or standard web URLs
  const formatted = formatPhotoUrl(trimmed);
  const testRes = await testSingleImageUrl(formatted, timeoutMs);

  if (testRes.success) {
    return {
      isValid: true,
      resolvedUrl: formatted,
    };
  }

  return {
    isValid: false,
    resolvedUrl: formatted,
    errorReason: testRes.timedOut
      ? 'Image loading timed out. The server took too long to respond.'
      : 'Image failed to load. Please verify the URL points to a publicly accessible image file (JPG, PNG, WebP).',
  };
}

/**
 * Checks whether an image URL can actually be loaded into the browser.
 * Returns true only if the browser successfully loads the image.
 */
export async function checkImageLoads(
  rawUrl: string | undefined | null,
  timeoutMs: number = 4500
): Promise<boolean> {
  const result = await checkImageLoadsWithDetails(rawUrl, timeoutMs);
  return result.isValid;
}

/**
 * Sanitizes and opens a URL in a new tab safely
 */
export function openUrlSafely(url: string): boolean {
  if (!isValidImageUrl(url)) {
    return false;
  }

  window.open(formatPhotoUrl(url), '_blank', 'noopener,noreferrer');
  return true;
}
