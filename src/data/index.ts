import { hsk4Words } from './hsk4';
import { hsk5Words } from './hsk5';
import { hsk6Words } from './hsk6';
import type { Word } from '../types';

export const allWords: Word[] = [...hsk4Words, ...hsk5Words, ...hsk6Words];

export const wordsByLevel = {
  4: hsk4Words,
  5: hsk5Words,
  6: hsk6Words,
};

export { hsk4Words, hsk5Words, hsk6Words };
