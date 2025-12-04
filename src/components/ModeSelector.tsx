import styles from './ModeSelector.module.css';
import type { PracticeMode } from '../types';

interface ModeSelectorProps {
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
}

const modes: { key: PracticeMode; label: string; icon: string; description: string }[] = [
  { key: 'position', label: '자리연습', icon: '⌨️', description: '키보드 자리 익히기' },
  { key: 'word', label: '단어연습', icon: '📝', description: '단어 타이핑 연습' },
  { key: 'sentence', label: '단문연습', icon: '📄', description: '짧은 문장 연습' },
  { key: 'paragraph', label: '장문연습', icon: '📚', description: '긴 문단 연습' },
];

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.modes}>
        {modes.map((m) => (
          <button
            key={m.key}
            className={`${styles.modeCard} ${mode === m.key ? styles.active : ''}`}
            onClick={() => onModeChange(m.key)}
          >
            <span className={styles.icon}>{m.icon}</span>
            <span className={styles.label}>{m.label}</span>
            <span className={styles.description}>{m.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
