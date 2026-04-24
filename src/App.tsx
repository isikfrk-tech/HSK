import { useState } from 'react';
import type { Page, HSKLevel } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { WordList } from './pages/WordList';
import { Flashcard } from './pages/Flashcard';
import { Quiz } from './pages/Quiz';
import { Dictionary } from './pages/Dictionary';
import { Exercise } from './pages/Exercise';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedLevel, setSelectedLevel] = useState<HSKLevel | undefined>();

  const navigate = (p: Page, level?: HSKLevel) => {
    setPage(p);
    setSelectedLevel(level);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main>
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'words' && <WordList initialLevel={selectedLevel} />}
        {page === 'flashcard' && <Flashcard initialLevel={selectedLevel} />}
        {page === 'quiz' && <Quiz initialLevel={selectedLevel} />}
        {page === 'dictionary' && <Dictionary />}
        {page === 'exercise' && <Exercise />}
      </main>
    </div>
  );
}

export default App;
