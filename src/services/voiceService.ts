/**
 * Professional Female American English AI MC Announcer Service
 *
 * Requirements:
 * - Language: English (United States), en-US
 * - Gender presentation: Female
 * - Accent: Natural American English
 * - Style: Energetic, enthusiastic, charismatic, and professional live-event MC
 *
 * 5 Exact Scripts in strict rotation:
 * 1. "Let's welcome, go to the stage!"
 * 2. "Congratulations! You're the lucky one! Come on up to the stage, please!"
 * 3. "It's your turn! Come on up!"
 * 4. "Welcome to the stage!"
 * 5. "Hooray! We have a winner!"
 *
 * Implementation:
 * - Primary: Neural AI voice audio files (generated with Microsoft Neural Jenny voice)
 * - Fallback: Web SpeechSynthesis API with en-US female voice selection
 */

import { duckBgm, restoreBgm } from './bgmService';

export const MC_SCRIPTS = [
  "Let's welcome, go to the stage!",
  "Congratulations! You're the lucky one! Come on up to the stage, please!",
  "It's your turn! Come on up!",
  "Welcome to the stage!",
  "Hooray! We have a winner!",
] as const;

let currentScriptIndex = 0;
let activeAudio: HTMLAudioElement | null = null;

/**
 * Resets voice rotation back to script 1 (e.g. on page reload)
 */
export function resetVoiceRotation(): void {
  currentScriptIndex = 0;
  stopVoice();
}

/**
 * Stop any currently playing audio or speech synthesis immediately
 */
export function stopVoice(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // Ignore abort errors
    }
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  // Restore BGM volume if it was ducked
  restoreBgm();
}

/**
 * Fallback: Play using Web SpeechSynthesis API with an en-US female voice
 */
function playSpeechSynthesisFallback(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.05; // Energetic, celebratory pace
    utterance.pitch = 1.1; // Friendly, enthusiastic tone
    utterance.volume = 1.0;

    let finished = false;
    const handleEnd = () => {
      if (!finished) {
        finished = true;
        onEnd?.();
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    // Safety timeout in case speech synthesis stalls or browser suppresses onend
    const safetyTimeoutMs = Math.max(2500, text.length * 80 + 1000);
    setTimeout(handleEnd, safetyTimeoutMs);

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural American female voices
    const preferredFemaleNames = [
      'Jenny',
      'Ava',
      'Aria',
      'Samantha',
      'Google US English',
      'Microsoft Zira',
      'Victoria',
      'Allison',
      'Susan',
    ];

    let chosenVoice: SpeechSynthesisVoice | null = null;

    for (const name of preferredFemaleNames) {
      const match = voices.find(
        (v) =>
          v.name.toLowerCase().includes(name.toLowerCase()) &&
          (v.lang.startsWith('en-US') || v.lang.startsWith('en_US'))
      );
      if (match) {
        chosenVoice = match;
        break;
      }
    }

    if (!chosenVoice) {
      // Any en-US voice
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en-US') ||
            v.lang.startsWith('en_US') ||
            v.lang.startsWith('en')
        ) || null;
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis fallback error:', err);
    onEnd?.();
  }
}

/**
 * Announces the winner using the next script in the 5-script rotation.
 * Alternates: 1 -> 2 -> 3 -> 4 -> 5 -> 1...
 * If className is provided, follows up with a personalized congratulation.
 *
 * Smoothly ducks BGM to 8% (0.08) during announcement, then restores to 20% (0.20).
 */
export function announceWinner(className?: string): { scriptNumber: number; text: string } {
  // Clear any existing voice
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  // Smoothly reduce BGM to 8% during AI MC speech
  duckBgm(300);

  const scriptNumber = (currentScriptIndex % MC_SCRIPTS.length) + 1;
  const scriptText = MC_SCRIPTS[currentScriptIndex % MC_SCRIPTS.length];
  currentScriptIndex++;

  const audioPath = `./audio/mc-${scriptNumber}.mp3`;

  try {
    const audio = new Audio(audioPath);
    activeAudio = audio;

    audio.play().catch((err) => {
      console.warn('Neural audio playback failed, using SpeechSynthesis fallback:', err);
      const fallbackText = className
        ? `Congratulations, ${className}! You are the lucky winner!`
        : scriptText;
      playSpeechSynthesisFallback(fallbackText, () => {
        restoreBgm(400);
      });
    });

    audio.onended = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      if (className) {
        playSpeechSynthesisFallback(`Congratulations, ${className}!`, () => {
          restoreBgm(400);
        });
      } else {
        restoreBgm(400);
      }
    };

    audio.onerror = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      const fallbackText = className
        ? `Congratulations, ${className}! You are the lucky winner!`
        : scriptText;
      playSpeechSynthesisFallback(fallbackText, () => {
        restoreBgm(400);
      });
    };
  } catch {
    const fallbackText = className
      ? `Congratulations, ${className}! You are the lucky winner!`
      : scriptText;
    playSpeechSynthesisFallback(fallbackText, () => {
      restoreBgm(400);
    });
  }

  return { scriptNumber, text: scriptText };
}
