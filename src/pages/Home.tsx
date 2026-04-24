import { Page, HSKLevel } from '../types';
import { wordsByLevel } from '../data';
import { useProgress } from '../hooks/useProgress';
import { STUDENT, getHomeImage, getHomeMessage } from '../config/character';

interface HomeProps {
  onNavigate: (page: Page, level?: HSKLevel) => void;
}

const levelColors: Record<HSKLevel, string> = {
  4: 'from-blue-500 to-blue-600',
  5: 'from-purple-500 to-purple-600',
  6: 'from-red-500 to-red-600',
};

const levelBg: Record<HSKLevel, string> = {
  4: 'bg-blue-50 border-blue-200',
  5: 'bg-purple-50 border-purple-200',
  6: 'bg-red-50 border-red-200',
};

export function Home({ onNavigate }: HomeProps) {
  const { getKnownCount } = useProgress();

  const levels: HSKLevel[] = [4, 5, 6];
  const totalWords = Object.values(wordsByLevel).reduce((s, w) => s + w.length, 0);
  const totalKnown = getKnownCount(Object.values(wordsByLevel).flatMap(w => w.map(x => x.id)));
  const progressPct = totalWords > 0 ? Math.round((totalKnown / totalWords) * 100) : 0;

  const heroImage = getHomeImage(progressPct);
  const { title: heroTitle, sub: heroSub } = getHomeMessage(progressPct);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Hero motivasyon kartı */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-10">
        <img
          src={heroImage}
          alt={STUDENT.name}
          className="w-full h-80 object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
          <div className="text-2xl font-bold leading-tight drop-shadow-lg">{heroTitle}</div>
          <div className="text-sm opacity-90 mt-2 drop-shadow leading-relaxed max-w-xl">{heroSub}</div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-sm font-bold text-gray-800">
          {STUDENT.name} · {STUDENT.pinyin}
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-gray-800">{totalWords}</div>
          <div className="text-gray-500 text-sm mt-1">Toplam Kelime</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-600">{totalKnown}</div>
          <div className="text-gray-500 text-sm mt-1">Öğrenilen</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-orange-500">{progressPct}%</div>
          <div className="text-gray-500 text-sm mt-1">İlerleme</div>
        </div>
      </div>

      {/* Seviye kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {levels.map(level => {
          const words = wordsByLevel[level];
          const known = getKnownCount(words.map(w => w.id));
          const pct = words.length > 0 ? Math.round((known / words.length) * 100) : 0;
          return (
            <div key={level} className={`bg-white rounded-2xl border ${levelBg[level]} overflow-hidden shadow-sm`}>
              <div className={`bg-gradient-to-r ${levelColors[level]} p-5 text-white`}>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Seviye</div>
                <div className="text-4xl font-bold mt-1">HSK {level}</div>
                <div className="text-sm opacity-90 mt-1">{words.length} kelime</div>
              </div>
              <div className="p-5">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{known} öğrenildi</span>
                  <span className="font-semibold">{pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${levelColors[level]} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('flashcard', level)}
                    className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Flashcard
                  </button>
                  <button
                    onClick={() => onNavigate('words', level)}
                    className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Listele
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hızlı erişim */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kelime Listesi', desc: 'Tüm kelimelere göz at', icon: '📖', page: 'words' as Page },
          { label: 'Flashcard', desc: 'Kart çevirerek çalış', icon: '🃏', page: 'flashcard' as Page },
          { label: 'Quiz', desc: 'Çoktan seçmeli test', icon: '✏️', page: 'quiz' as Page },
          { label: 'Sözlük', desc: 'Türkçe–Çince ara', icon: '🔍', page: 'dictionary' as Page },
        ].map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
            <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
