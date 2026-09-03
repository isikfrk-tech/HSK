import { useSyncExternalStore } from 'react';
import type { Word } from '../types';

const STORAGE_KEY = 'hsk_custom_words';

function load(): Word[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let words: Word[] = load();
const listeners = new Set<() => void>();

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return words;
}

export function addCustomWord(word: Omit<Word, 'id'>): Word {
  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const newWord: Word = { ...word, id };
  words = [...words, newWord];
  emit();
  return newWord;
}

export function removeCustomWord(id: string) {
  words = words.filter(w => w.id !== id);
  emit();
}

export function isCustomWord(id: string): boolean {
  return id.startsWith('custom_');
}

export function useCustomWords() {
  const customWords = useSyncExternalStore(subscribe, getSnapshot);
  return { customWords, addCustomWord, removeCustomWord };
}
