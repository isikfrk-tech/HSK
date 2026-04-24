import { useState, useEffect, useCallback } from 'react';
import type { WordProgress } from '../types';

const STORAGE_KEY = 'hsk_progress';

function loadProgress(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, WordProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, WordProgress>>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markKnown = useCallback((wordId: string) => {
    setProgress(prev => {
      const existing = prev[wordId];
      const reviewCount = (existing?.reviewCount ?? 0) + 1;
      const interval = Math.min(reviewCount * 2, 30);
      return {
        ...prev,
        [wordId]: {
          wordId,
          known: true,
          reviewCount,
          lastReviewed: Date.now(),
          nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
        },
      };
    });
  }, []);

  const markUnknown = useCallback((wordId: string) => {
    setProgress(prev => ({
      ...prev,
      [wordId]: {
        wordId,
        known: false,
        reviewCount: 0,
        lastReviewed: Date.now(),
        nextReview: Date.now() + 60 * 60 * 1000,
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  const getKnownCount = useCallback(
    (wordIds: string[]) => wordIds.filter(id => progress[id]?.known).length,
    [progress]
  );

  return { progress, markKnown, markUnknown, resetProgress, getKnownCount };
}
