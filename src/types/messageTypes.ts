export interface EnglishMessageItem {
  id: string;
  index: number;
  text: string;
  meaning: string;
  ariaDescription: string;
}

export interface MessageRotationState {
  sequence: number[];
  currentIndex: number;
  cycleCount: number;
}
