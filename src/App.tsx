import { useState } from 'react';
import './styles/global.css';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { PositionPractice } from './components/PositionPractice';
import { TypingPractice } from './components/TypingPractice';
import { Footer } from './components/Footer';
import type { Language, PracticeMode } from './types';

function App() {
  const [language, setLanguage] = useState<Language>('korean');
  const [mode, setMode] = useState<PracticeMode>('position');

  return (
    <div className="app">
      <Header language={language} onLanguageChange={setLanguage} />

      <main>
        <ModeSelector mode={mode} onModeChange={setMode} />

        <section className="container">
          {mode === 'position' ? (
            <PositionPractice language={language} />
          ) : (
            <TypingPractice language={language} mode={mode} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
