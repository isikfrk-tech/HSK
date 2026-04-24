export type HSKLevel = 4 | 5 | 6;

export interface Example {
  chinese: string;
  pinyin: string;
  turkish: string;
}

export interface Word {
  id: string;
  chinese: string;
  pinyin: string;
  turkish: string;
  level: HSKLevel;
  category?: string;
  examples?: Example[];
}

export interface WordProgress {
  wordId: string;
  known: boolean;
  reviewCount: number;
  lastReviewed: number;
  nextReview: number;
}

export type Page = 'home' | 'words' | 'flashcard' | 'quiz' | 'dictionary' | 'exercise';
