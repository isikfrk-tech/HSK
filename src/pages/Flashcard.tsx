import { useState, useCallback, useMemo } from 'react';
import { HSKLevel, Word } from '../types';
import { allWords, wordsByLevel } from '../data';
import { useProgress } from '../hooks/useProgress';
import { FloatingCharacter } from '../components/FloatingCharacter';
import { MotivationCard } from '../components/MotivationCard';
import { STUDENT, IMAGES, getFlashcardResult } from '../config/character';

interface FlashcardProps {
  initialLevel?: HSKLevel;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcard({ initialLevel }: FlashcardProps) {
  const [selectedLevel, setSelectedLevel] = useState<HSKLevel | 'all'>(initialLevel ?? 'all');
  const [mode, setMode] = useState<'ch-to-tr' | 'tr-to-ch'>('ch-to-tr');
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });
  const [showFloating, setShowFloating] = useState(true);

  const { progress, markKnown, markUnknown } = useProgress();

  const sourceWords = useMemo(
    () => selectedLevel === 'all' ? allWords : wordsByLevel[selectedLevel],
    [selectedLevel]
  );

  const startSession = useCallback(() => {
    let words = onlyUnknown ? sourceWords.filter(w => !progress[w.id]?.known) : sourceWords;
    if (words.length === 0) words = sourceWords;
    setSessionWords(shuffle(words));
    setIndex(0);
    setFlipped(false);
    setSessionStats({ known: 0, unknown: 0 });
    setShowFloating(true);
    setStarted(true);
  }, [sourceWords, onlyUnknown, progress]);

  const currentWord = sessionWords[index];
  const isLast = index >= sessionWords.length - 1;
  const isLongSession = index >= 20;

  const handleKnown = () => {
    markKnown(currentWord.id);
    setSessionStats(s => ({ ...s, known: s.known + 1 }));
    if (isLast) { setStarted(false); return; }
    setIndex(i => i + 1);
    setFlipped(false);
  };

  const handleUnknown = () => {
    markUnknown(currentWord.id);
    setSessionStats(s => ({ ...s, unknown: s.unknown + 1 }));
    if (isLast) { setStarted(false); return; }
    setIndex(i => i + 1);
    setFlipped(false);
  };

  // Oturum sonu ekranı
  if (!started && (sessionStats.known + sessionStats.unknown > 0)) {
    const result = getFlashcardResult(sessionStats.known, sessionStats.known + sessionStats.unknown);
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <MotivationCard
          image={result.image}
          title={result.title}
          sub={result.sub}
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={startSession}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Tekrar Başla
          </button>
          <button
            onClick={() => setSessionStats({ known: 0, unknown: 0 })}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Ayarlar
          </button>
        </div>
      </div>
    );
  }

  // Başlangıç ekranı
  if (!started) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Motivasyon başlık görseli */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <img src={IMAGES.calismaMaratonu} alt="" className="w-full h-52 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="font-bold text-lg">HSK Maratonu seni bekliyor, {STUDENT.name}！</div>
            <div className="text-sm opacity-90 mt-1">一步一个词，一步一个进步！ 🏃</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">Seviye</label>
            <div className="flex gap-2 justify-center flex-wrap">
              {(['all', 4, 5, 6] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === lvl ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {lvl === 'all' ? 'Tümü' : `HSK ${lvl}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">Yön</label>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setMode('ch-to-tr')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'ch-to-tr' ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Çince → Türkçe
              </button>
              <button
                onClick={() => setMode('tr-to-ch')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'tr-to-ch' ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Türkçe → Çince
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 justify-center cursor-pointer">
            <input
              type="checkbox"
              checked={onlyUnknown}
              onChange={e => setOnlyUnknown(e.target.checked)}
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-sm text-gray-700">Sadece bilinmeyenleri çalış</span>
          </label>
          <button
            onClick={startSession}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors text-lg"
          >
            加油，{STUDENT.name}！ Başla 🏃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStarted(false)} className="text-sm text-gray-500 hover:text-gray-700">← Geri</button>
        <span className="text-sm text-gray-500 font-medium">{index + 1} / {sessionWords.length}</span>
        <span className="text-sm text-gray-500">✓{sessionStats.known} ✗{sessionStats.unknown}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
        <div
          className="h-1.5 rounded-full bg-red-500 transition-all"
          style={{ width: `${(index / sessionWords.length) * 100}%` }}
        />
      </div>

      {/* Kart */}
      <div className="card-flip h-72 cursor-pointer mb-6" onClick={() => setFlipped(f => !f)}>
        <div className={`card-flip-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-front flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
            {mode === 'ch-to-tr' ? (
              <>
                <div className="text-6xl font-medium text-gray-900 mb-3">{currentWord.chinese}</div>
                <div className="text-gray-400 text-sm">Çevirmek için dokun</div>
              </>
            ) : (
              <>
                <div className="text-2xl text-gray-700 text-center mb-2">{currentWord.turkish}</div>
                <div className="text-gray-400 text-sm">Çevirmek için dokun</div>
              </>
            )}
          </div>
          <div className="card-back flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-red-200 shadow-lg p-8">
            {mode === 'ch-to-tr' ? (
              <>
                <div className="text-4xl font-medium text-gray-900 mb-1">{currentWord.chinese}</div>
                <div className="text-red-500 font-medium text-lg mb-2">{currentWord.pinyin}</div>
                <div className="text-xl text-gray-700 text-center">{currentWord.turkish}</div>
              </>
            ) : (
              <>
                <div className="text-5xl font-medium text-gray-900 mb-1">{currentWord.chinese}</div>
                <div className="text-red-500 font-medium text-lg mb-2">{currentWord.pinyin}</div>
                <div className="text-gray-600 text-center">{currentWord.turkish}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {flipped && currentWord.examples && currentWord.examples.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-amber-600 mb-1">Örnek Cümle</div>
          <div className="text-gray-900 font-medium">{currentWord.examples[0].chinese}</div>
          <div className="text-red-400 text-sm">{currentWord.examples[0].pinyin}</div>
          <div className="text-gray-600 text-sm">{currentWord.examples[0].turkish}</div>
        </div>
      )}

      {flipped ? (
        <div className="flex gap-3">
          <button onClick={handleUnknown} className="flex-1 bg-red-50 border-2 border-red-200 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition-colors text-lg">
            ✗ Bilmiyorum
          </button>
          <button onClick={handleKnown} className="flex-1 bg-green-50 border-2 border-green-200 text-green-600 font-bold py-4 rounded-xl hover:bg-green-100 transition-colors text-lg">
            ✓ Biliyorum
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm">Cevabı görmek için kartı çevir</div>
      )}

      {/* Uzun oturum floating mesajı */}
      {isLongSession && showFloating && (
        <FloatingCharacter
          image={IMAGES.sikilmisCalisiyor}
          message={`好想睡觉… ama sen ${STUDENT.name}! Bırakmıyoruz! 再学10分钟就休息！ 💪`}
          onDismiss={() => setShowFloating(false)}
        />
      )}
    </div>
  );
}
