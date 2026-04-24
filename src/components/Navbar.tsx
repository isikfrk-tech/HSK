import { Page } from '../types';
import { STUDENT } from '../config/character';

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
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <span className="text-2xl">🐼</span>
            <div className="text-left">
              <div className="font-bold text-gray-800 text-base leading-tight">
                {STUDENT.name} 的 HSK 之旅
              </div>
              <div className="text-xs text-gray-400 leading-tight">HSK 4 · 5 · 6 Hazırlık</div>
            </div>
          </button>

          <div className="flex gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="hidden sm:inline">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
