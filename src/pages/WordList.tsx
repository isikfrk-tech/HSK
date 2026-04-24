import { useState } from 'react';
import { HSKLevel, Word } from '../types';
import { allWords, wordsByLevel } from '../data';
import { useProgress } from '../hooks/useProgress';

interface WordListProps {
  initialLevel?: HSKLevel;
}

const levelColors: Record<string, string> = {
  '4': 'bg-blue-100 text-blue-700',
  '5': 'bg-purple-100 text-purple-700',
  '6': 'bg-red-100 text-red-700',
};

function WordCard({ word, showPinyin }: { word: Word; showPinyin: boolean }) {
  const { progress, markKnown, markUnknown } = useProgress();
  const [expanded, setExpanded] = useState(false);
  const [localPinyin, setLocalPinyin] = useState(false);
  const isKnown = progress[word.id]?.known ?? false;

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${isKnown ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl font-medium text-gray-900">{word.chinese}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelColors[String(word.level)]}`}>
              HSK {word.level}
            </span>
            {isKnown && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">✓ Öğrenildi</span>}
          </div>
          {(showPinyin || localPinyin) && (
            <div className="text-red-500 font-medium mt-1">{word.pinyin}</div>
          )}
          <div className="text-gray-700 mt-1">{word.turkish}</div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={() => setLocalPinyin(p => !p)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            title="Pinyin göster/gizle"
          >
            {localPinyin ? '拼音 ✕' : '拼音'}
          </button>
          <button
            onClick={() => isKnown ? markUnknown(word.id) : markKnown(word.id)}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
              isKnown
                ? 'border-green-400 text-green-600 hover:bg-green-50'
                : 'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'
            }`}
          >
            {isKnown ? '✓ Biliyorum' : 'Öğrendim'}
          </button>
        </div>
      </div>

      {word.examples && word.examples.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            {expanded ? '▲ Örnek Cümleleri Gizle' : '▼ Örnek Cümleleri Göster'}
          </button>
          {expanded && (
            <div className="mt-2 space-y-2">
              {word.examples.map((ex, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-gray-900 font-medium">{ex.chinese}</div>
                  <div className="text-red-400 text-sm">{ex.pinyin}</div>
                  <div className="text-gray-600 text-sm">{ex.turkish}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WordList({ initialLevel }: WordListProps) {
  const [selectedLevel, setSelectedLevel] = useState<HSKLevel | 'all'>(initialLevel ?? 'all');
  const [search, setSearch] = useState('');
  const [showPinyin, setShowPinyin] = useState(false);
  const [filterKnown, setFilterKnown] = useState<'all' | 'known' | 'unknown'>('all');
  const { progress } = useProgress();

  const sourceWords = selectedLevel === 'all' ? allWords : wordsByLevel[selectedLevel];

  const filtered = sourceWords.filter(w => {
    const matchSearch =
      !search ||
      w.chinese.includes(search) ||
      w.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      w.turkish.toLowerCase().includes(search.toLowerCase());

    const matchKnown =
      filterKnown === 'all' ||
      (filterKnown === 'known' && progress[w.id]?.known) ||
      (filterKnown === 'unknown' && !progress[w.id]?.known);

    return matchSearch && matchKnown;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelime Listesi</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{filtered.length} kelime</span>
          <button
            onClick={() => setShowPinyin(p => !p)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors font-medium ${
              showPinyin ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showPinyin ? 'Pinyin Gizle' : 'Pinyin Göster'}
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Çince, Pinyin veya Türkçe ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="flex gap-2">
          {(['all', 4, 5, 6] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLevel === lvl ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {lvl === 'all' ? 'Tümü' : `HSK ${lvl}`}
            </button>
          ))}
        </div>
        <select
          value={filterKnown}
          onChange={e => setFilterKnown(e.target.value as 'all' | 'known' | 'unknown')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tüm Kelimeler</option>
          <option value="known">Öğrenilenler</option>
          <option value="unknown">Öğrenilmeyenler</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Arama sonucu bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(word => (
            <WordCard key={word.id} word={word} showPinyin={showPinyin} />
          ))}
        </div>
      )}
    </div>
  );
}
