import styles from './Header.module.css';
import type { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1 className={styles.title}>
            <span className={styles.accent}>을지</span>타자연습
          </h1>
          <p className={styles.subtitle}>타자 연습의 정석</p>
        </div>

        <nav className={styles.nav}>
          <div className={styles.languageToggle}>
            <button
              className={`${styles.langBtn} ${language === 'korean' ? styles.active : ''}`}
              onClick={() => onLanguageChange('korean')}
            >
              한글타자
            </button>
            <button
              className={`${styles.langBtn} ${language === 'english' ? styles.active : ''}`}
              onClick={() => onLanguageChange('english')}
            >
              영문타자
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
