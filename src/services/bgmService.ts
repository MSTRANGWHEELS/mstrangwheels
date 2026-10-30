import { safeStorage } from './storageService';

/**
 * Background Music (BGM) Singleton Service
 *
 * Requirements:
 * - Exact audio track from Google Drive (id: 1QZjyCeASZroVKDK2fCvppVe6I4OnIGRy)
 * - Wheel Screen Volume: 4% base volume (gentle, soft, unobtrusive)
 * - Photo Viewer Volume: 6% base volume
 * - AI MC Speech Ducking: 1.5% ducked volume during AI MC speech
 * - Volume Level Adjustments (+ / - buttons, 0-100%, default 40%)
 * - Continuous looping without restarting across spins and photo viewer
 * - Voice ON/OFF controls all application audio
 * - Strict Singleton: Prevents duplicate audio elements
 */

export const BASE_WHEEL_VOLUME = 0.04;        // Gentle 4% base on main spinning wheel screen
export const BASE_PHOTO_VIEWER_VOLUME = 0.06; // Gentle 6% base in class photo viewer
export const BASE_DUCKED_VOLUME = 0.015;      // 1.5% ducked volume during AI MC speech

export const DEFAULT_BGM_VOLUME = BASE_WHEEL_VOLUME;
export const BGM_AUDIO_SRC = './audio/bgm.mp3';
const STORAGE_KEY_BGM_VOLUME = 'mstrang_bgm_volume_level_v1';

export type BgmScreenMode = 'wheel' | 'photo';

/**
 * Safe audio volume setter. In iOS Safari / WebKit, HTMLMediaElement.prototype.volume is
 * strictly read-only (physical hardware buttons only). Setting it throws a TypeError in
 * strict mode or is silently ignored.
 */
function safeSetVolume(audio: HTMLAudioElement | null, volume: number): void {
  if (!audio) return;
  try {
    audio.volume = Math.max(0, Math.min(1, volume));
  } catch {
    // In iOS Safari / WebKit, HTMLMediaElement.prototype.volume is strictly read-only.
  }
}

let isVolumeAdjustable: boolean | null = null;
function checkVolumeAdjustable(audio: HTMLAudioElement): boolean {
  if (isVolumeAdjustable !== null) return isVolumeAdjustable;
  try {
    const orig = audio.volume;
    audio.volume = 0.5;
    isVolumeAdjustable = (audio.volume === 0.5);
    audio.volume = orig;
  } catch {
    isVolumeAdjustable = false;
  }
  return isVolumeAdjustable ?? false;
}

class BgmManager {
  private static instance: BgmManager | null = null;
  private audio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private isDucked: boolean = false;
  private currentScreen: BgmScreenMode = 'wheel';
  private hasUserUnlocked: boolean = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private unlockListenersAttached: boolean = false;
  private volumePercent: number = 40; // Default: 40% (delicately quiet and pleasant)
  private volumeListeners: Set<(percent: number) => void> = new Set();

  private constructor() {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_BGM_VOLUME);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
          this.volumePercent = val;
        }
      }
    } catch {
      this.volumePercent = 40;
    }
  }

  public static getInstance(): BgmManager {
    if (!BgmManager.instance) {
      BgmManager.instance = new BgmManager();
    }
    return BgmManager.instance;
  }

  /**
   * Calculate effective target volume factoring in user volume level (0-100%)
   */
  private getEffectiveVolume(baseVolume: number): number {
    const factor = this.volumePercent / 50; // 50% = 1.0x, 40% = 0.8x, 100% = 2.0x, 0% = 0
    return Math.max(0, Math.min(1, baseVolume * factor));
  }

  /**
   * Get active target volume based on current screen mode and ducked status
   */
  public getCurrentTargetVolume(): number {
    const base = this.isDucked
      ? BASE_DUCKED_VOLUME
      : (this.currentScreen === 'photo' ? BASE_PHOTO_VIEWER_VOLUME : BASE_WHEEL_VOLUME);
    return this.getEffectiveVolume(base);
  }

  /**
   * Get user volume scale (0 to 100%)
   */
  public getVolumePercent(): number {
    return this.volumePercent;
  }

  /**
   * Set user volume scale (0 to 100%)
   */
  public setVolumePercent(percent: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    this.volumePercent = clamped;
    safeStorage.setItem(STORAGE_KEY_BGM_VOLUME, String(clamped));
    this.applyCurrentVolume();
    this.volumeListeners.forEach((listener) => {
      try {
        listener(clamped);
      } catch {
        // Safe notify
      }
    });
  }

  /**
   * Subscribe to volume changes
   */
  public subscribeVolume(listener: (percent: number) => void): () => void {
    this.volumeListeners.add(listener);
    return () => {
      this.volumeListeners.delete(listener);
    };
  }

  /**
   * Increase volume step (+10%)
   */
  public increaseVolume(step: number = 10): number {
    const next = Math.min(100, this.volumePercent + step);
    this.setVolumePercent(next);
    return next;
  }

  /**
   * Decrease volume step (-10%)
   */
  public decreaseVolume(step: number = 10): number {
    const next = Math.max(0, this.volumePercent - step);
    this.setVolumePercent(next);
    return next;
  }

  /**
   * Immediately apply current volume to audio element
   */
  private applyCurrentVolume(): void {
    if (!this.audio || !this.isEnabled) return;
    const target = this.getCurrentTargetVolume();
    safeSetVolume(this.audio, target);
  }

  /**
   * Initialize BGM audio element (idempotent, safe to call multiple times)
   */
  public init(enabled: boolean = true): void {
    if (typeof window === 'undefined') return;

    this.isEnabled = enabled;

    try {
      if (!this.audio) {
        const audio = new Audio(BGM_AUDIO_SRC);
        audio.loop = true;
        safeSetVolume(audio, this.getCurrentTargetVolume());
        audio.preload = 'auto';
        this.audio = audio;

        // Handle unexpected pauses/errors
        audio.addEventListener('error', (e) => {
          console.warn('BGM audio load error, retrying with absolute path:', e);
          if (audio.src !== window.location.origin + '/audio/bgm.mp3') {
            audio.src = '/audio/bgm.mp3';
            if (this.isEnabled) this.play();
          }
        });
      }

      if (this.isEnabled) {
        this.play();
      } else if (this.audio) {
        this.audio.pause();
      }
    } catch (e) {
      console.warn('BGM initialization warning:', e);
    }
  }

  /**
   * Set screen mode ('wheel' or 'photo') with smooth 0.5s fade
   */
  public setScreen(screen: BgmScreenMode, durationMs: number = 500): void {
    this.currentScreen = screen;
    if (!this.isEnabled || !this.audio) return;

    if (!this.isDucked) {
      const targetVolume = this.getCurrentTargetVolume();
      this.fadeVolume(targetVolume, durationMs);
    }
  }

  /**
   * Get active screen mode
   */
  public getScreen(): BgmScreenMode {
    return this.currentScreen;
  }

  /**
   * Set enabled state (toggled by Voice ON/OFF button)
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;

    if (!this.audio) {
      if (enabled) {
        this.init(true);
      }
      return;
    }

    if (!enabled) {
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      try {
        this.audio.pause();
      } catch {
        // Safe pause
      }
    } else {
      const targetVol = this.getCurrentTargetVolume();
      safeSetVolume(this.audio, targetVol);
      this.play();
    }
  }

  /**
   * Play BGM with autoplay policy detection
   */
  public play(): void {
    if (!this.audio || !this.isEnabled) return;

    try {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.hasUserUnlocked = true;
          })
          .catch((err) => {
            // Autoplay policy prevented playback until user interaction
            if (err && (err.name === 'NotAllowedError' || err.name === 'NotSupportedError' || err.name === 'AbortError')) {
              this.setupAutoplayUnlock();
            }
          });
      }
    } catch {
      this.setupAutoplayUnlock();
    }
  }

  /**
   * Pause BGM immediately
   */
  public pause(): void {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.audio) {
      try {
        this.audio.pause();
      } catch {
        // Safe pause
      }
    }
  }

  /**
   * Smoothly duck BGM during AI MC voice announcement
   */
  public duck(durationMs: number = 300): void {
    this.isDucked = true;
    if (!this.isEnabled || !this.audio) return;
    const target = this.getCurrentTargetVolume();
    this.fadeVolume(target, durationMs);
  }

  /**
   * Smoothly restore BGM back to screen volume
   */
  public restore(durationMs: number = 400): void {
    this.isDucked = false;
    if (!this.isEnabled || !this.audio) return;
    const targetVolume = this.getCurrentTargetVolume();
    this.fadeVolume(targetVolume, durationMs);
  }

  /**
   * Smooth volume interpolation
   */
  private fadeVolume(targetVolume: number, durationMs: number): void {
    if (!this.audio) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // If volume is read-only (iOS Safari), skip interval
    if (!checkVolumeAdjustable(this.audio)) {
      safeSetVolume(this.audio, targetVolume);
      return;
    }

    let startVol = targetVolume;
    try {
      startVol = this.audio.volume;
    } catch {
      safeSetVolume(this.audio, targetVolume);
      return;
    }

    const diff = targetVolume - startVol;

    if (Math.abs(diff) < 0.003 || durationMs <= 0) {
      safeSetVolume(this.audio, targetVolume);
      return;
    }

    const startTime = Date.now();
    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const currentVol = startVol + diff * progress;
      safeSetVolume(this.audio, Math.max(0, Math.min(1, Number(currentVol.toFixed(3)))));

      if (progress >= 1) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        safeSetVolume(this.audio, targetVolume);
      }
    }, 25);
  }

  /**
   * Listen for the first user interaction to start playback if blocked by browser autoplay
   */
  private setupAutoplayUnlock(): void {
    if (this.unlockListenersAttached || typeof window === 'undefined') return;
    this.unlockListenersAttached = true;

    const unlock = () => {
      if (this.audio && this.isEnabled) {
        try {
          this.audio.play().then(() => {
            this.hasUserUnlocked = true;
          }).catch(() => {
            // Will retry on next interaction
          });
        } catch {
          // Ignore
        }
      }
      window.removeEventListener('click', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('touchend', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('pointerdown', unlock, true);
      this.unlockListenersAttached = false;
    };

    window.addEventListener('click', unlock, { once: true, capture: true });
    window.addEventListener('touchstart', unlock, { once: true, capture: true });
    window.addEventListener('touchend', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  }

  /**
   * Diagnostic state getter
   */
  public getState() {
    let vol = 0;
    try {
      vol = this.audio ? Number(this.audio.volume.toFixed(3)) : 0;
    } catch {
      vol = 1;
    }
    return {
      initialized: this.audio !== null,
      enabled: this.isEnabled,
      isDucked: this.isDucked,
      currentScreen: this.currentScreen,
      isPlaying: this.audio ? !this.audio.paused : false,
      volume: vol,
      volumePercent: this.volumePercent,
      loop: this.audio ? this.audio.loop : false,
      currentTime: this.audio ? this.audio.currentTime : 0,
      hasUserUnlocked: this.hasUserUnlocked,
    };
  }
}

// Global Singleton Export
export const bgmService = BgmManager.getInstance();

// Convenience helper functions
export const initBgm = (enabled?: boolean) => bgmService.init(enabled);
export const setBgmEnabled = (enabled: boolean) => bgmService.setEnabled(enabled);
export const setBgmScreen = (screen: BgmScreenMode, durationMs?: number) => bgmService.setScreen(screen, durationMs);
export const duckBgm = (durationMs?: number) => bgmService.duck(durationMs);
export const restoreBgm = (durationMs?: number) => bgmService.restore(durationMs);
export const getBgmVolumePercent = () => bgmService.getVolumePercent();
export const setBgmVolumePercent = (percent: number) => bgmService.setVolumePercent(percent);
export const increaseBgmVolume = (step?: number) => bgmService.increaseVolume(step);
export const decreaseBgmVolume = (step?: number) => bgmService.decreaseVolume(step);
export const onBgmVolumeChange = (listener: (percent: number) => void) => bgmService.subscribeVolume(listener);
export const getBgmState = () => bgmService.getState();

// Attach to window in browser for runtime testing/diagnostics
if (typeof window !== 'undefined') {
  (window as unknown as { __bgmService: typeof bgmService }).__bgmService = bgmService;
}
