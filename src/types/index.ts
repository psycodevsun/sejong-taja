// 타자 연습 타입 정의

export type Language = 'korean' | 'english';

export type PracticeMode = 'position' | 'word' | 'sentence' | 'paragraph';

export interface TypingStats {
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  startTime: number | null;
  endTime: number | null;
}

export interface TypingResult {
  wpm: number; // Words per minute
  cpm: number; // Characters per minute
  accuracy: number; // 정확도 (%)
  errorRate: number; // 오타율 (%)
  totalTime: number; // 총 소요 시간 (초)
}

export interface KeyPosition {
  key: string;
  finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
  hand: 'left' | 'right';
}

export interface PracticeContent {
  id: string;
  text: string;
  language: Language;
  mode: PracticeMode;
  difficulty?: 'easy' | 'medium' | 'hard';
}
