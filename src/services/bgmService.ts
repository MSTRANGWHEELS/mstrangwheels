/**
 * Background Music (BGM) Singleton Service
 *
 * Requirements:
 * - Exact audio track from Google Drive (id: 1QZjyCeASZroVKDK2fCvppVe6I4OnIGRy)
 * - Wheel Screen Volume: 10% (0.10)
 * - Photo Viewer Volume: 15% (0.15) with smooth 0.5s transition
 * - AI MC Speech Ducking: 5% (0.05), restored to screen volume (10% or 15%)
 * - Continuous looping without restarting across spins and photo viewer
 * - Voice ON/OFF controls all application audio
 * - Strict Singleton: Prevents duplicate audio elements
 */

export const WHEEL_BGM_VOLUME = 0.10;        // 10% on main spinning wheel screen
export const PHOTO_VIEWER_BGM_VOLUME = 0.15; // 15% in class photo viewer
export const DUCKED_BGM_VOLUME = 0.05;       // 5% ducked volume during AI MC speech
export const DEFAULT_BGM_VOLUME = WHEEL_BGM_VOLUME;
export const BGM_AUDIO_SRC = './audio/bgm.mp3';

export type BgmScreenMode = 'wheel' | 'photo';

class BgmManager {
  private static instance: BgmManager | null = null;
  private audio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private isDucked: boolean = false;
  private currentScreen: BgmScreenMode = 'wheel';
  private hasUserUnlocked: boolean = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private unlockListenersAttached: boolean = false;

  private constructor() {
    // Singleton constructor
  }

  public static getInstance(): BgmManager {
    if (!BgmManager.instance) {
      BgmManager.instance = new BgmManager();
    }
    return BgmManager.instance;
  }

  /**
   * Initialize BGM audio element (idempotent, safe to call multiple times)
   */
  public init(enabled: boolean = true): void {
    if (typeof window === 'undefined') return;

    this.isEnabled = enabled;

    if (!this.audio) {
      const audio = new Audio(BGM_AUDIO_SRC);
      audio.loop = true;
      audio.volume = this.currentScreen === 'photo' ? PHOTO_VIEWER_BGM_VOLUME : WHEEL_BGM_VOLUME;
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
    } else {
      this.audio.pause();
    }
  }

  /**
   * Set screen mode ('wheel' = 10%, 'photo' = 15%) with smooth 0.5s fade
   */
  public setScreen(screen: BgmScreenMode, durationMs: number = 500): void {
    this.currentScreen = screen;
    if (!this.isEnabled || !this.audio) return;

    if (!this.isDucked) {
      const targetVolume = screen === 'photo' ? PHOTO_VIEWER_BGM_VOLUME : WHEEL_BGM_VOLUME;
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
      this.audio.pause();
    } else {
      const targetVol = this.isDucked
        ? DUCKED_BGM_VOLUME
        : (this.currentScreen === 'photo' ? PHOTO_VIEWER_BGM_VOLUME : WHEEL_BGM_VOLUME);
      this.audio.volume = targetVol;
      this.play();
    }
  }

  /**
   * Play BGM with autoplay policy detection
   */
  public play(): void {
    if (!this.audio || !this.isEnabled) return;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.hasUserUnlocked = true;
        })
        .catch((err) => {
          // Autoplay policy prevented playback until user interaction
          if (err.name === 'NotAllowedError' || err.name === 'NotSupportedError') {
            this.setupAutoplayUnlock();
          }
        });
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
      this.audio.pause();
    }
  }

  /**
   * Smoothly duck BGM to 5% (0.05) during AI MC voice announcement
   */
  public duck(durationMs: number = 300): void {
    this.isDucked = true;
    if (!this.isEnabled || !this.audio) return;
    this.fadeVolume(DUCKED_BGM_VOLUME, durationMs);
  }

  /**
   * Smoothly restore BGM back to screen volume (10% on wheel, 15% in photo viewer)
   */
  public restore(durationMs: number = 400): void {
    this.isDucked = false;
    if (!this.isEnabled || !this.audio) return;
    const targetVolume = this.currentScreen === 'photo' ? PHOTO_VIEWER_BGM_VOLUME : WHEEL_BGM_VOLUME;
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

    const startVol = this.audio.volume;
    const diff = targetVolume - startVol;

    if (Math.abs(diff) < 0.005 || durationMs <= 0) {
      this.audio.volume = targetVolume;
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
      this.audio.volume = Math.max(0, Math.min(1, Number(currentVol.toFixed(3))));

      if (progress >= 1) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.audio.volume = targetVolume;
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
        this.audio.play().then(() => {
          this.hasUserUnlocked = true;
        }).catch(() => {
          // Will retry on next interaction
        });
      }
      window.removeEventListener('click', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('pointerdown', unlock, true);
      this.unlockListenersAttached = false;
    };

    window.addEventListener('click', unlock, { once: true, capture: true });
    window.addEventListener('touchstart', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  }

  /**
   * Diagnostic state getter
   */
  public getState() {
    return {
      initialized: this.audio !== null,
      enabled: this.isEnabled,
      isDucked: this.isDucked,
      currentScreen: this.currentScreen,
      isPlaying: this.audio ? !this.audio.paused : false,
      volume: this.audio ? Number(this.audio.volume.toFixed(3)) : 0,
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
export const getBgmState = () => bgmService.getState();

// Attach to window in browser for runtime testing/diagnostics
if (typeof window !== 'undefined') {
  (window as unknown as { __bgmService: typeof bgmService }).__bgmService = bgmService;
}

// Attach to window in browser for runtime testing/diagnostics
if (typeof window !== 'undefined') {
  (window as unknown as { __bgmService: typeof bgmService }).__bgmService = bgmService;
}
