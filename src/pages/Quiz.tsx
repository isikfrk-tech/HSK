import { useState, useCallback, useMemo } from 'react';
import type { HSKLevel, Word } from '../types';
import { allWords, wordsByLevel } from '../data';
import { useProgress } from '../hooks/useProgress';
import { MotivationCard } from '../components/MotivationCard';
import { STUDENT, IMAGES, getQuizResult } from '../config/character';

interface QuizProps {
  initialLevel?: HSKLevel;
}

interface Question {
  word: Word;
  options: string[];
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(words: Word[], count = 10): Question[] {
  const shuffled = shuffle(words).slice(0, count);
  return shuffled.map(word => {
    const others = shuffle(words.filter(w => w.id !== word.id)).slice(0, 3).map(w => w.turkish);
    const allOptions = shuffle([word.turkish, ...others]);
    return { word, options: allOptions, correctIndex: allOptions.indexOf(word.turkish) };
  });
}

export function Quiz({ initialLevel }: QuizProps) {
  const [selectedLevel, setSelectedLevel] = useState<HSKLevel | 'all'>(initialLevel ?? 'all');
  const [quizSize, setQuizSize] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);

  const { markKnown, markUnknown } = useProgress();

  const sourceWords = useMemo(
    () => selectedLevel === 'all' ? allWords : wordsByLevel[selectedLevel],
    [selectedLevel]
  );

  const startQuiz = useCallback(() => {
    const qs = buildQuestions(sourceWords, Math.min(quizSize, sourceWords.length));
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setWrongAnswers([]);
    setStarted(true);
  }, [sourceWords, quizSize]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const q = questions[current];
    if (idx === q.correctIndex) {
      setScore(s => s + 1);
      markKnown(q.word.id);
    } else {
      markUnknown(q.word.id);
      setWrongAnswers(w => [...w, q]);
    }
  };

  const handleNext = () => {
    if (current >= questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  // Başlangıç ekranı
  if (!started) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
          <img src={IMAGES.calismaMaratonu} alt="" className="w-full h-52 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="font-bold text-lg">HSK Maratonu — Quiz Zamanı, {STUDENT.name}！</div>
            <div className="text-sm opacity-90 mt-1">累吗？Evet. 放弃吗？Asla！ ✊</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">Seviye</label>
            <div className="flex gap-2 justify-center flex-wrap">
              {(['all', 4, 5, 6] as const).map(lvl => (
                <button key={lvl} onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLevel === lvl ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {lvl === 'all' ? 'Tümü' : `HSK ${lvl}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">Soru Sayısı</label>
            <div className="flex gap-2 justify-center">
              {[5, 10, 20].map(n => (
                <button key={n} onClick={() => setQuizSize(n)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${quizSize === n ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {n} Soru
                </button>
              ))}
            </div>
          </div>
          <button onClick={startQuiz}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors text-lg">
            冲啊，{STUDENT.name}！ Başlat 🏁
          </button>
        </div>
      </div>
    );
  }

  // Sonuç ekranı
  if (finished) {
    const result = getQuizResult(score, questions.length);
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <MotivationCard
          image={result.image}
          title={result.title}
          sub={result.sub}
          gradientClass={result.color}
        />

        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-5">
            <div className="font-semibold text-red-700 mb-2">
              {STUDENT.name}, bunları tekrar çalış:
            </div>
            {wrongAnswers.map((q, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-red-100 last:border-0">
                <span className="text-xl text-gray-900">{q.word.chinese}</span>
                <span className="text-red-400 text-sm">{q.word.pinyin}</span>
                <span className="text-gray-600 text-sm">= {q.word.turkish}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={startQuiz}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors">
            Tekrar Çöz
          </button>
          <button onClick={() => setStarted(false)}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Ayarlar
          </button>
        </div>
      </div>
    );
  }

  // Quiz sorusu
  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStarted(false)} className="text-sm text-gray-500 hover:text-gray-700">← Geri</button>
        <span className="text-sm text-gray-500 font-medium">{current + 1} / {questions.length}</span>
        <span className="text-sm text-green-600 font-semibold">✓ {score}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
        <div className="h-1.5 rounded-full bg-red-500 transition-all"
          style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center mb-6">
        <div className="text-sm text-gray-400 mb-3 font-medium">
          Bu kelimenin Türkçe karşılığı nedir, {STUDENT.name}？
        </div>
        <div className="text-6xl font-medium text-gray-900 mb-2">{q.word.chinese}</div>
        {selected !== null && (
          <div className="text-red-500 text-lg font-medium">{q.word.pinyin}</div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          let cls = 'border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50';
          if (selected !== null) {
            if (idx === q.correctIndex) cls = 'border-green-400 bg-green-50 text-green-800';
            else if (idx === selected && selected !== q.correctIndex) cls = 'border-red-400 bg-red-50 text-red-700';
            else cls = 'border-gray-200 text-gray-400';
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${cls}`}>
              <span className="text-gray-400 mr-3">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="space-y-3">
          {q.word.examples && q.word.examples.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-amber-600 mb-1">Örnek Cümle</div>
              <div className="text-gray-900 font-medium">{q.word.examples[0].chinese}</div>
              <div className="text-red-400 text-sm">{q.word.examples[0].pinyin}</div>
              <div className="text-gray-600 text-sm">{q.word.examples[0].turkish}</div>
            </div>
          )}
          <button onClick={handleNext}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">
            {current >= questions.length - 1 ? '📊 Sonuçları Gör' : 'Sonraki →'}
          </button>
        </div>
      )}
    </div>
  );
}
