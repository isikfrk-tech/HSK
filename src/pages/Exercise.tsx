import { useState, useCallback, useRef, useEffect } from 'react';
import type { HSKLevel, Word } from '../types';
import { allWords, wordsByLevel } from '../data';
import { useProgress } from '../hooks/useProgress';
import { STUDENT } from '../config/character';

type WordFilter = 'all' | 'known';

type Status = 'idle' | 'correct' | 'wrong' | 'revealed';

interface Question {
  word: Word;
  sentence: string;       // Çince cümle, boşluklu
  sentenceFull: string;   // Orijinal tam cümle
  pinyin: string;         // Boşluklu cümlenin pinyini
  pinyinFull: string;
  translation: string;    // Türkçe çeviri
}

function buildQuestion(word: Word): Question | null {
  const ex = word.examples?.[0];
  if (!ex || !ex.chinese.includes(word.chinese)) return null;

  const blank = '＿'.repeat(word.chinese.length);
  return {
    word,
    sentence: ex.chinese.replace(word.chinese, blank),
    sentenceFull: ex.chinese,
    pinyin: ex.pinyin.replace(
      new RegExp(word.pinyin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      '＿＿'
    ),
    pinyinFull: ex.pinyin,
    translation: ex.turkish,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Exercise() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<HSKLevel | 'all'>('all');
  const [wordFilter, setWordFilter] = useState<WordFilter>('all');
  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showPinyin, setShowPinyin] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const knownCount = (level === 'all' ? allWords : wordsByLevel[level as HSKLevel])
    .filter(w => progress[w.id]?.known).length;

  const buildQueue = useCallback(() => {
    const levelPool = level === 'all' ? allWords : wordsByLevel[level as HSKLevel];
    const pool = wordFilter === 'known'
      ? levelPool.filter(w => progress[w.id]?.known)
      : levelPool;
    const questions = shuffle(
      pool.flatMap(w => {
        const q = buildQuestion(w);
        return q ? [q] : [];
      })
    );
    setQueue(questions);
    setIndex(0);
    setScore({ correct: 0, wrong: 0 });
    setInput('');
    setStatus('idle');
    setStarted(true);
  }, [level, wordFilter, progress]);

  const current = queue[index];
  const finished = started && index >= queue.length;

  useEffect(() => {
    if (started && !finished) inputRef.current?.focus();
  }, [index, started, finished]);

  const check = useCallback(() => {
    if (!current || status !== 'idle') return;
    const answer = input.trim();
    if (!answer) return;
    if (answer === current.word.chinese) {
      setStatus('correct');
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setStatus('wrong');
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }
  }, [current, input, status]);

  const next = useCallback(() => {
    setIndex(i => i + 1);
    setInput('');
    setStatus('idle');
    setShowPinyin(false);
    setShowHint(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (status === 'idle') check();
      else next();
    }
  };

  const reveal = () => {
    setStatus('revealed');
    setScore(s => ({ ...s, wrong: s.wrong + 1 }));
  };

  const total = score.correct + score.wrong;
  const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;

  // --- Başlangıç ekranı ---
  if (!started) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">✍️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Boşluk Doldurma</h1>
        <p className="text-gray-500 mb-8">
          Cümlede eksik Çince kelimeyi yaz. {STUDENT.name}, hazır mısın？
        </p>

        {/* Seviye seçimi */}
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Seviye</p>
        <div className="flex gap-2 justify-center mb-6">
          {(['all', 4, 5, 6] as const).map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                level === l
                  ? 'bg-red-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {l === 'all' ? 'Tümü' : `HSK ${l}`}
            </button>
          ))}
        </div>

        {/* Kelime filtresi */}
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Kelimeler</p>
        <div className="flex gap-2 justify-center mb-8">
          <button
            onClick={() => setWordFilter('all')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              wordFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Hepsi
          </button>
          <button
            onClick={() => setWordFilter('known')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              wordFilter === 'known'
                ? 'bg-gray-800 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Çalıştığım Kelimeler
            {knownCount > 0 && (
              <span className="ml-1.5 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                {knownCount}
              </span>
            )}
          </button>
        </div>

        {wordFilter === 'known' && knownCount === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            Henüz "Öğrendim" işaretlediğin kelime yok. Önce Flashcard veya Quiz çalışmanı tamamla!
          </p>
        )}

        <button
          onClick={buildQueue}
          disabled={wordFilter === 'known' && knownCount === 0}
          className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Başla
        </button>
      </div>
    );
  }

  // --- Bitiş ekranı ---
  if (finished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {pct >= 80 ? `Harika, ${STUDENT.name}！` : pct >= 50 ? `İyi iş, ${STUDENT.name}！` : `Devam et, ${STUDENT.name}！`}
        </h2>
        <p className="text-gray-500 mb-6">
          {total} sorudan <span className="font-bold text-green-600">{score.correct}</span> doğru,{' '}
          <span className="font-bold text-red-500">{score.wrong}</span> yanlış — %{pct}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={buildQueue}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Tekrar Başla
          </button>
          <button
            onClick={() => setStarted(false)}
            className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Seviye Seç
          </button>
        </div>
      </div>
    );
  }

  // --- Soru ekranı ---
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isRevealed = status === 'revealed';
  const answered = isCorrect || isWrong || isRevealed;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* İlerleme */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>{index + 1} / {queue.length}</span>
        <span>
          <span className="text-green-600 font-semibold">{score.correct}</span>
          {' '}doğru · {' '}
          <span className="text-red-500 font-semibold">{score.wrong}</span>
          {' '}yanlış
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-red-500 rounded-full transition-all"
          style={{ width: `${((index) / queue.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Seviye rozeti */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            current.word.level === 4 ? 'bg-blue-100 text-blue-700' :
            current.word.level === 5 ? 'bg-purple-100 text-purple-700' :
            'bg-red-100 text-red-700'
          }`}>
            HSK {current.word.level}
          </span>
          {!answered && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(p => !p)}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors"
              >
                {showHint ? 'İpucu ✕' : '💡 İpucu'}
              </button>
              <button
                onClick={() => setShowPinyin(p => !p)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                {showPinyin ? '拼音 ✕' : '拼音'}
              </button>
            </div>
          )}
        </div>

        {/* Cümle */}
        <div className="text-2xl font-medium text-gray-900 mb-1 leading-relaxed text-center">
          {answered ? current.sentenceFull : current.sentence}
        </div>

        {/* Pinyin */}
        {(showPinyin || answered) && (
          <div className="text-red-400 text-sm text-center mb-1">
            {answered ? current.pinyinFull : current.pinyin}
          </div>
        )}

        {/* Türkçe çeviri */}
        <div className="text-gray-500 text-sm text-center mb-6">{current.translation}</div>

        {/* Türkçe anlam ipucu — sadece istenince */}
        {(showHint || answered) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-center mb-5">
            <span className="text-xs text-amber-600 font-medium">Türkçe anlamı: </span>
            <span className="text-amber-800 font-semibold text-sm">{current.word.turkish}</span>
            <span className="text-xs text-amber-500 ml-2">({current.word.pinyin})</span>
          </div>
        )}

        {/* Input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={answered ? current.word.chinese : input}
            onChange={e => { if (!answered) setInput(e.target.value); }}
            onKeyDown={handleKeyDown}
            disabled={answered}
            placeholder="Çince yaz..."
            className={`w-full border-2 rounded-xl px-4 py-3 text-xl text-center focus:outline-none transition-colors ${
              isCorrect ? 'border-green-400 bg-green-50 text-green-700' :
              isWrong   ? 'border-red-400 bg-red-50 text-red-700' :
              isRevealed ? 'border-orange-400 bg-orange-50 text-orange-700' :
              'border-gray-200 focus:border-red-400'
            }`}
          />
          {isCorrect && <span className="absolute right-4 top-3 text-2xl">✅</span>}
          {(isWrong || isRevealed) && <span className="absolute right-4 top-3 text-2xl">❌</span>}
        </div>

        {/* Yanlış ise doğru cevap göster */}
        {isWrong && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Doğru cevap: <span className="text-red-600 font-bold text-lg">{current.word.chinese}</span>
            <span className="text-gray-400 ml-2">({current.word.pinyin})</span>
          </div>
        )}
        {isRevealed && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Cevap: <span className="text-orange-600 font-bold text-lg">{current.word.chinese}</span>
            <span className="text-gray-400 ml-2">({current.word.pinyin})</span>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex gap-3">
          {!answered ? (
            <>
              <button
                onClick={check}
                disabled={!input.trim()}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Kontrol Et
              </button>
              <button
                onClick={reveal}
                className="px-4 py-2.5 border border-gray-300 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Göster
              </button>
            </>
          ) : (
            <button
              onClick={next}
              className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Sonraki →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
