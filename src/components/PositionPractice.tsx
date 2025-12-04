import { useState, useEffect, useCallback } from 'react';
import styles from './PositionPractice.module.css';
import { Keyboard } from './Keyboard';
import type { Language } from '../types';
import { koreanPositionPractice } from '../data/korean';
import { englishPositionPractice } from '../data/english';

interface PositionPracticeProps {
  language: Language;
}

type PracticeLevel = 'homeRow' | 'topRow' | 'bottomRow' | 'numberRow' | 'symbols' | 'all';

const levelLabels: Record<PracticeLevel, string> = {
  homeRow: '홈 키',
  topRow: '윗줄',
  bottomRow: '아랫줄',
  numberRow: '숫자',
  symbols: '특수기호',
  all: '전체',
};

export function PositionPractice({ language }: PositionPracticeProps) {
  const [level, setLevel] = useState<PracticeLevel>('all');
  const [currentChar, setCurrentChar] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const practiceData = language === 'korean' ? koreanPositionPractice : englishPositionPractice;

  // 새 문자 생성
  const generateNewChar = useCallback(() => {
    const chars = practiceData[level];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    setCurrentChar(randomChar);
    setIsCorrect(null);
  }, [practiceData, level]);

  useEffect(() => {
    generateNewChar();
  }, [generateNewChar]);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        generateNewChar();
        return;
      }

      // 입력된 키 확인
      const pressedKey = e.key.toLowerCase();

      // 한글 입력의 경우 조합 중인 문자도 확인
      const isMatch =
        pressedKey === currentChar.toLowerCase() ||
        e.key === currentChar;

      if (isMatch) {
        setIsCorrect(true);
        setStreak((prev) => prev + 1);
        setTotalCorrect((prev) => prev + 1);
        setTotalAttempts((prev) => prev + 1);
        setTimeout(generateNewChar, 300);
      } else if (e.key.length === 1) {
        setIsCorrect(false);
        setStreak(0);
        setTotalAttempts((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChar, generateNewChar]);

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  return (
    <div className={styles.container}>
      <div className={styles.levelSelector}>
        {(Object.keys(levelLabels) as PracticeLevel[]).map((l) => (
          <button
            key={l}
            className={`${styles.levelBtn} ${level === l ? styles.active : ''}`}
            onClick={() => {
              setLevel(l);
              setStreak(0);
            }}
          >
            {levelLabels[l]}
          </button>
        ))}
      </div>

      <div className={styles.practiceArea}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{streak}</span>
            <span className={styles.statLabel}>연속 정답</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{accuracy}%</span>
            <span className={styles.statLabel}>정확도</span>
          </div>
        </div>

        <div className={styles.charDisplay}>
          <div
            className={`
              ${styles.targetChar}
              ${isCorrect === true ? styles.correct : ''}
              ${isCorrect === false ? styles.incorrect : ''}
            `}
          >
            {currentChar}
          </div>
          <p className={styles.hint}>위 글자를 입력하세요</p>
        </div>

        <Keyboard language={language} activeKey={currentChar} showFingers={true} />

        <p className={styles.tip}>
          ESC 키를 누르면 다른 글자로 넘어갑니다
        </p>
      </div>
    </div>
  );
}
