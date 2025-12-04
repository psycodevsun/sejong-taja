import { useState } from 'react';
import './styles/global.css';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { PositionPractice } from './components/PositionPractice';
import { TypingPractice } from './components/TypingPractice';
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

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        borderTop: '1px solid var(--bg-tertiary)',
        marginTop: 'auto',
      }}>
        을지타자연습 - 타자 연습의 정석
      </footer>
    </div>
  );
}

export default App;
