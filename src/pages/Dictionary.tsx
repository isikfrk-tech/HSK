import { useState } from 'react';
import { allWords } from '../data';
import type { Word } from '../types';
import { STUDENT, IMAGES } from '../config/character';

const levelColors: Record<string, string> = {
  '4': 'bg-blue-100 text-blue-700',
  '5': 'bg-purple-100 text-purple-700',
  '6': 'bg-red-100 text-red-700',
};

function DictEntry({ word }: { word: Word }) {
  const [expanded, setExpanded] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-3xl font-medium text-gray-900">{word.chinese}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelColors[String(word.level)]}`}>
              HSK {word.level}
            </span>
          </div>
          {showPinyin && (
            <div className="text-red-500 font-medium text-sm mb-1">{word.pinyin}</div>
          )}
          <div className="text-gray-700">{word.turkish}</div>
        </div>
        <button onClick={() => setShowPinyin(p => !p)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0">
          {showPinyin ? '拼音 ✕' : '拼音'}
        </button>
      </div>

      {word.examples && word.examples.length > 0 && (
        <div className="mt-3">
          <button onClick={() => setExpanded(e => !e)}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">
            {expanded ? '▲ Gizle' : '▼ Örnek Cümle'}
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

export function Dictionary() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'tr' | 'zh'>('tr');

  const results = query.length < 1
    ? []
    : allWords.filter(w => {
        if (searchMode === 'tr') return w.turkish.toLowerCase().includes(query.toLowerCase());
        return w.chinese.includes(query) || w.pinyin.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Üst banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
        <img src={IMAGES.ogluyla} alt="" className="w-full h-52 object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="font-bold text-lg drop-shadow">
            {STUDENT.name}，中文说得越来越棒！ 🌟
          </div>
          <div className="text-sm opacity-90 mt-1 drop-shadow">
            Öğrendiğin kelimeleri günlük hayatına taşı. Oğlunla Çince konuş！
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Türkçe–Çince Mini Sözlük</h1>
        <p className="text-gray-500 text-sm mt-1">HSK 4–6 kapsamındaki {allWords.length} kelime</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setSearchMode('tr')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${searchMode === 'tr' ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
          Türkçe ile Ara
        </button>
        <button onClick={() => setSearchMode('zh')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${searchMode === 'zh' ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
          Çince ile Ara
        </button>
      </div>

      <input
        type="text"
        placeholder={searchMode === 'tr' ? `${STUDENT.name}, Türkçe kelime gir...` : `${STUDENT.name}, 中文或拼音...`}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border-2 border-gray-200 focus:border-red-400 rounded-xl px-5 py-3 text-lg focus:outline-none transition-colors mb-2"
        autoFocus
      />

      {query.length > 0 && (
        <div className="text-sm text-gray-400 mb-4">
          {results.length > 0 ? `${results.length} sonuç` : 'Sonuç bulunamadı 🤔'}
        </div>
      )}

      {query.length === 0 && (
        <div className="text-center py-12 text-gray-300">
          <div className="text-5xl mb-3">汉字</div>
          <div className="text-sm">Aramak için yazmaya başla</div>
        </div>
      )}

      <div className="space-y-3">
        {results.map(word => (
          <DictEntry key={word.id} word={word} />
        ))}
      </div>
    </div>
  );
}
