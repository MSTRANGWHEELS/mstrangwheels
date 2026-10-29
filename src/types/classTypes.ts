export type PhotoValidationStatus = 'valid' | 'invalid' | 'none' | 'checking';

export interface ClassItem {
  id: string;
  name: string;
  students: string[];
  imageUrl?: string;
  isEnabled?: boolean; // Defaults to true
  photoStatus?: PhotoValidationStatus;
  createdAt: number;
  updatedAt: number;
}

export interface StoredRoundData {
  roundNumber: number;
  wonClassIds: string[];
  rotationOffset: number;
}

export interface WheelSpinResult {
  winner: string;
  winnerIndex: number;
}

export interface SoundConfig {
  soundEnabled: boolean;
}

export interface DuplicateStudentNotice {
  name: string;
  count: number;
}
