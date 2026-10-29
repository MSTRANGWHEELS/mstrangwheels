/**
 * Sound synthesis engine using Web Audio API
 * Provides zero-latency, zero-dependency cute audio effects
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio API not supported or blocked:', e);
    return null;
  }
}

/**
 * Play a cute mechanical/bubble click/tick sound when the pointer hits a peg
 */
export function playTickSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Quick pitch drop creates a distinct wooden/bubble click
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.045);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a celebratory fanfare with cute cheerful arpeggio notes
 */
export function playVictorySound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.1);

      const noteStart = startTime + idx * 0.1;
      const noteEnd = noteStart + 0.45;

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });

    // Final cheerful chord
    const chordTime = startTime + 0.55;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, chordTime);

      gain.gain.setValueAtTime(0.2, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(chordTime);
      osc.stop(chordTime + 0.95);
    });
  } catch {
    // Graceful fallback
  }
}
