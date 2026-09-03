import { useMemo } from 'react';
import type { HSKLevel, Word } from '../types';
import { allWords as builtinAllWords, wordsByLevel as builtinWordsByLevel } from '../data';
import { useCustomWords } from './useCustomWords';

// Kullanıcının kendi eklediği kelimeleri, HSK4/5/6 gibi built-in listelerle birleştirir.
// "HSK5"/"HSK6" seçilen özel kelimeler ilgili seviyeye eklenir; "Kendi Kelimelerim"
// (level 7) seçilenler ayrı bir havuzda tutulur.
export function useWordLibrary() {
  const { customWords, addCustomWord, removeCustomWord } = useCustomWords();

  const wordsByLevel = useMemo<Record<HSKLevel, Word[]>>(() => ({
    4: builtinWordsByLevel[4],
    5: [...builtinWordsByLevel[5], ...customWords.filter(w => w.level === 5)],
    6: [...builtinWordsByLevel[6], ...customWords.filter(w => w.level === 6)],
    7: customWords.filter(w => w.level === 7),
  }), [customWords]);

  const allWords = useMemo<Word[]>(
    () => [...builtinAllWords, ...customWords],
    [customWords]
  );

  return { allWords, wordsByLevel, customWords, addCustomWord, removeCustomWord };
}
