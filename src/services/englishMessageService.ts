import { EnglishMessageItem } from '../types/messageTypes';
import { safeStorage } from './storageService';

/**
 * EXACT 10 MOTIVATIONAL ENGLISH MESSAGES
 * Designed for primary school students (aged 6-11)
 * Colors: Dark Blue typography (#164A9B)
 */
export const ENGLISH_MESSAGES: EnglishMessageItem[] = [
  {
    id: 'msg_english_is_fun',
    index: 0,
    text: 'English is fun!',
    meaning: 'English learning is fun and enjoyable.',
    ariaDescription: 'Smiling schoolbook with ABC letters and a cheerful child holding it.',
  },
  {
    id: 'msg_you_can_do_it',
    index: 1,
    text: 'You can do it!',
    meaning: 'Confidence and self-belief.',
    ariaDescription: 'Smiling schoolchild giving an encouraging thumbs-up with a golden star.',
  },
  {
    id: 'msg_keep_trying',
    index: 2,
    text: 'Keep trying!',
    meaning: 'Perseverance and effort.',
    ariaDescription: 'Cute schoolchild climbing three colorful steps toward a glowing golden star.',
  },
  {
    id: 'msg_believe_in_yourself',
    index: 3,
    text: 'Believe in yourself!',
    meaning: 'Confidence and courage.',
    ariaDescription: 'Smiling schoolchild wearing a pastel superhero cape with a glowing golden heart.',
  },
  {
    id: 'msg_learn_and_shine',
    index: 4,
    text: 'Learn and shine!',
    meaning: 'Learning helps children shine.',
    ariaDescription: 'Adorable open schoolbook with a glowing golden star rising above it.',
  },
  {
    id: 'msg_every_day_we_grow',
    index: 5,
    text: 'Every day, we grow!',
    meaning: 'Daily growth and improvement.',
    ariaDescription: 'Cute green seedling in a pastel pot with a smiling warm sun.',
  },
  {
    id: 'msg_mistakes_help_us_learn',
    index: 6,
    text: 'Mistakes help us learn!',
    meaning: 'Learning from mistakes.',
    ariaDescription: 'Smiling pastel pencil in a notebook with a friendly glowing light bulb.',
  },
  {
    id: 'msg_be_kind_be_brave',
    index: 7,
    text: 'Be kind, be brave!',
    meaning: 'Kindness, friendship, and courage.',
    ariaDescription: 'Two adorable schoolchildren helping each other with a warm golden heart.',
  },
  {
    id: 'msg_dream_big_little_star',
    index: 8,
    text: 'Dream big, little star!',
    meaning: 'Dreams and ambition.',
    ariaDescription: 'Smiling golden star and a cute pastel rocket flying toward the cosmos.',
  },
  {
    id: 'msg_speak_english_with_a_smile',
    index: 9,
    text: 'Speak English with a smile!',
    meaning: 'Confident and joyful English communication.',
    ariaDescription: 'Two cartoon schoolchildren talking happily with Hello and Hi speech bubbles.',
  },
];

const STORAGE_KEY_MSG_SEQ = 'mstrang_english_msg_seq_v2';
const STORAGE_KEY_MSG_IDX = 'mstrang_english_msg_idx_v2';
const STORAGE_KEY_LAST_MSG = 'mstrang_english_msg_last_v2';

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleIndices(count: number, avoidFirstValue: number | null = null): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Prevent immediate repetition across cycle boundary
  if (avoidFirstValue !== null && arr[0] === avoidFirstValue && arr.length > 1) {
    const swapTarget = 1 + Math.floor(Math.random() * (arr.length - 1));
    [arr[0], arr[swapTarget]] = [arr[swapTarget], arr[0]];
  }

  return arr;
}

/**
 * English Message Rotation Manager (Singleton)
 * Guarantees a randomized, non-repeating cycle of all 10 messages
 */
class EnglishMessageManager {
  private static instance: EnglishMessageManager | null = null;
  private sequence: number[] = [];
  private currentIndex: number = 0;
  private lastMessageIndex: number | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): EnglishMessageManager {
    if (!EnglishMessageManager.instance) {
      EnglishMessageManager.instance = new EnglishMessageManager();
    }
    return EnglishMessageManager.instance;
  }

  private loadState(): void {
    try {
      const rawSeq = safeStorage.getItem(STORAGE_KEY_MSG_SEQ);
      const rawIdx = safeStorage.getItem(STORAGE_KEY_MSG_IDX);
      const rawLast = safeStorage.getItem(STORAGE_KEY_LAST_MSG);

      if (rawSeq) {
        const parsed = JSON.parse(rawSeq);
        if (Array.isArray(parsed) && parsed.length === ENGLISH_MESSAGES.length) {
          this.sequence = parsed;
        }
      }

      if (rawIdx !== null) {
        const idx = parseInt(rawIdx, 10);
        if (!isNaN(idx) && idx >= 0 && idx <= ENGLISH_MESSAGES.length) {
          this.currentIndex = idx;
        }
      }

      if (rawLast !== null) {
        const last = parseInt(rawLast, 10);
        if (!isNaN(last) && last >= 0 && last < ENGLISH_MESSAGES.length) {
          this.lastMessageIndex = last;
        }
      }
    } catch {
      // Safe fallback
    }

    if (this.sequence.length !== ENGLISH_MESSAGES.length) {
      this.sequence = shuffleIndices(ENGLISH_MESSAGES.length, this.lastMessageIndex);
      this.currentIndex = 0;
      this.saveState();
    }
  }

  private saveState(): void {
    try {
      safeStorage.setItem(STORAGE_KEY_MSG_SEQ, JSON.stringify(this.sequence));
      safeStorage.setItem(STORAGE_KEY_MSG_IDX, String(this.currentIndex));
      if (this.lastMessageIndex !== null) {
        safeStorage.setItem(STORAGE_KEY_LAST_MSG, String(this.lastMessageIndex));
      }
    } catch {
      // Safe save
    }
  }

  /**
   * Advance to the next non-repeating message in the sequence
   */
  public getNextMessage(): EnglishMessageItem {
    // If we reached the end of the current 10-message cycle, reshuffle
    if (this.currentIndex >= this.sequence.length) {
      const last = this.sequence[this.sequence.length - 1];
      this.sequence = shuffleIndices(ENGLISH_MESSAGES.length, last);
      this.currentIndex = 0;
    }

    const messageIndex = this.sequence[this.currentIndex];
    this.lastMessageIndex = messageIndex;
    this.currentIndex += 1;
    this.saveState();

    return ENGLISH_MESSAGES[messageIndex] || ENGLISH_MESSAGES[0];
  }

  /**
   * Peek current message without advancing (for re-renders)
   */
  public getCurrentMessage(): EnglishMessageItem {
    const targetIdx = this.currentIndex > 0 ? this.currentIndex - 1 : 0;
    const msgIdx = this.sequence[targetIdx] ?? 0;
    return ENGLISH_MESSAGES[msgIdx] || ENGLISH_MESSAGES[0];
  }
}

export const englishMessageService = EnglishMessageManager.getInstance();
export const getNextEnglishMessage = () => englishMessageService.getNextMessage();
export const getCurrentEnglishMessage = () => englishMessageService.getCurrentMessage();
