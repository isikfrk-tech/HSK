import { useState } from 'react';
import type { Page } from '../types';
import { AddWordModal } from './AddWordModal';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: 'home',       label: 'Ana Sayfa', icon: '🏠' },
  { page: 'words',      label: 'Kelimeler', icon: '📚' },
  { page: 'flashcard',  label: 'Flashcard', icon: '🃏' },
  { page: 'quiz',       label: 'Quiz',      icon: '✏️' },
  { page: 'dictionary', label: 'Sözlük',    icon: '🔍' },
  { page: 'exercise',   label: 'Alıştırma', icon: '✍️' },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addWordOpen, setAddWordOpen] = useState(false);

  const go = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <button
            className="flex items-center gap-2 cursor-pointer min-w-0"
            onClick={() => go('home')}
          >
            <span className="text-2xl shrink-0">🐼</span>
            <div className="text-left min-w-0">
              <div className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">
                Pınar'ın HSK Günlüğü
              </div>
              <div className="hidden sm:block text-xs text-gray-400 leading-tight">HSK 4 · 5 · 6 Hazırlık</div>
            </div>
          </button>

          {/* Masaüstü menü */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setAddWordOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-1"
            >
              <span>➕</span>
              <span>Kelime Ekle</span>
            </button>
          </div>

          {/* Mobil menü butonu */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0 text-xl"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobil açılır menü */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                  currentPage === item.page
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); setAddWordOpen(true); }}
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-lg">➕</span>
              <span>Kelime Ekle</span>
            </button>
          </div>
        </div>
      )}

      <AddWordModal open={addWordOpen} onClose={() => setAddWordOpen(false)} />
    </nav>
  );
}
