import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TypingPractice.module.css';
import { StatsDisplay } from './StatsDisplay';
import { useTypingStats } from '../hooks/useTypingStats';
import type { Language, PracticeMode } from '../types';
import { koreanWords, koreanSentences, koreanParagraphs } from '../data/korean';
import { englishWords, englishSentences, englishParagraphs } from '../data/english';

interface TypingPracticeProps {
  language: Language;
  mode: PracticeMode;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyLabels: Record<Difficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

// 연습 텍스트 가져오기
function getPracticeText(
  language: Language,
  mode: PracticeMode,
  difficulty: Difficulty,
  usedTexts: Set<string>
): string {
  let pool: string[] = [];

  if (language === 'korean') {
    if (mode === 'word') pool = koreanWords[difficulty];
    else if (mode === 'sentence') pool = koreanSentences[difficulty];
    else if (mode === 'paragraph') pool = koreanParagraphs;
  } else {
    if (mode === 'word') pool = englishWords[difficulty];
    else if (mode === 'sentence') pool = englishSentences[difficulty];
    else if (mode === 'paragraph') pool = englishParagraphs;
  }

  // 사용하지 않은 텍스트 필터링
  const available = pool.filter((t) => !usedTexts.has(t));
  const finalPool = available.length > 0 ? available : pool;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export function TypingPractice({ language, mode }: TypingPracticeProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [usedTexts] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    startTyping,
    endTyping,
    recordCorrect,
    recordIncorrect,
    resetStats,
    calculateResult,
    getCurrentStats,
  } = useTypingStats();

  const [liveStats, setLiveStats] = useState({ wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 });

  // 새 텍스트 생성
  const generateNewText = useCallback(() => {
    const text = getPracticeText(language, mode, difficulty, usedTexts);
    usedTexts.add(text);
    setTargetText(text);
    setUserInput('');
    setIsStarted(false);
    setIsCompleted(false);
    resetStats();
    setLiveStats({ wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 });
    inputRef.current?.focus();
  }, [language, mode, difficulty, usedTexts, resetStats]);

  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  // 실시간 통계 업데이트
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    const interval = setInterval(() => {
      const stats = getCurrentStats(userInput, targetText);
      setLiveStats({
        wpm: stats.wpm || 0,
        cpm: stats.cpm || 0,
        accuracy: stats.accuracy || 100,
        errorRate: stats.errorRate || 0,
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isStarted, isCompleted, getCurrentStats, userInput, targetText]);

  // 장문 모드에서 현재 줄의 끝 인덱스 계산
  const getCurrentLineEndIndex = (inputLength: number): number => {
    if (mode !== 'paragraph') return targetText.length;

    const sentences = targetText.split(/(?<=\.) /);
    let currentIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentenceLength = sentences[i].length;
      const lineEnd = currentIndex + sentenceLength;

      if (inputLength <= lineEnd) {
        return lineEnd;
      }
      // 마지막 문장이 아니면 공백 포함
      currentIndex = lineEnd + (i < sentences.length - 1 ? 1 : 0);
    }

    return targetText.length;
  };

  // 엔터 키 처리 (장문 모드에서 줄 끝에서 다음 줄로 이동)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && mode === 'paragraph') {
      e.preventDefault();

      const currentLineEnd = getCurrentLineEndIndex(userInput.length);

      // 현재 줄 끝에 도달했을 때만 처리
      if (userInput.length === currentLineEnd && userInput.length < targetText.length) {
        // 다음 문자가 공백이면 자동으로 추가
        const nextChar = targetText[userInput.length];
        if (nextChar === ' ') {
          const newValue = userInput + ' ';

          if (!isStarted) {
            setIsStarted(true);
            startTyping();
          }

          recordCorrect();
          setUserInput(newValue);

          // 완료 확인
          if (newValue.length === targetText.length) {
            setIsCompleted(true);
            endTyping();
          }
        }
      }
    }
  };

  // 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 첫 입력 시 시작
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTyping();
    }

    // 마지막으로 입력된 문자 확인
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1];
      const expectedChar = targetText[value.length - 1];

      if (newChar === expectedChar) {
        recordCorrect();
      } else {
        recordIncorrect();
      }
    }

    setUserInput(value);

    // 완료 확인
    if (value.length === targetText.length) {
      setIsCompleted(true);
      endTyping();
    }
  };

  // 결과 계산
  const result = isCompleted ? calculateResult(userInput, targetText) : null;

  // 줄 단위로 예문과 입력을 렌더링
  const renderLines = () => {
    // 장문 모드: 문장 단위로 나눔, 각 문장 끝에 공백 추가 (마지막 문장 제외)
    // 단어/단문 모드: 한 줄로
    let lines: { text: string; startIndex: number }[] = [];

    if (mode === 'paragraph') {
      // 마침표+공백 기준으로 나누되, 각 줄에 공백 포함
      const sentences = targetText.split(/(?<=\.) /);
      let currentIndex = 0;
      sentences.forEach((sentence, idx) => {
        // 마지막 문장이 아니면 공백 추가
        const text = idx < sentences.length - 1 ? sentence + ' ' : sentence;
        lines.push({ text: sentence, startIndex: currentIndex });
        currentIndex += text.length;
      });
    } else {
      lines = [{ text: targetText, startIndex: 0 }];
    }

    return lines.map((lineData, lineIndex) => {
      const { text: line, startIndex: lineStartIndex } = lineData;
      // 마지막 줄이 아니면 공백 포함
      const lineLength = mode === 'paragraph' && lineIndex < lines.length - 1
        ? line.length + 1
        : line.length;

      const lineChars = [];
      for (let i = 0; i < lineLength; i++) {
        const globalIndex = lineStartIndex + i;
        const char = targetText[globalIndex];
        let className = styles.char;

        if (globalIndex < userInput.length) {
          if (userInput[globalIndex] === char) {
            className += ` ${styles.correct}`;
          } else {
            className += ` ${styles.incorrect}`;
          }
        } else if (globalIndex === userInput.length) {
          className += ` ${styles.current}`;
        }

        lineChars.push(
          <span key={globalIndex} className={className}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      }

      // 해당 줄에 대한 사용자 입력
      const lineInput = userInput.slice(lineStartIndex, lineStartIndex + lineLength);
      const inputChars = lineInput.split('').map((char, i) => {
        const globalIndex = lineStartIndex + i;
        const isCorrect = char === targetText[globalIndex];
        const className = `${styles.char} ${isCorrect ? styles.correct : styles.incorrect}`;

        return (
          <span key={globalIndex} className={className}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });

      return (
        <div key={lineIndex} className={styles.lineGroup}>
          <div className={styles.targetLine}>{lineChars}</div>
          <div className={styles.inputLine}>{inputChars}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      {mode !== 'paragraph' && (
        <div className={styles.difficultySelector}>
          {(Object.keys(difficultyLabels) as Difficulty[]).map((d) => (
            <button
              key={d}
              className={`${styles.diffBtn} ${difficulty === d ? styles.active : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {difficultyLabels[d]}
            </button>
          ))}
        </div>
      )}

      <div className={styles.practiceArea}>
        {!isCompleted && (
          <StatsDisplay
            wpm={liveStats.wpm}
            cpm={liveStats.cpm}
            accuracy={liveStats.accuracy}
            errorRate={liveStats.errorRate}
          />
        )}

        {isCompleted && result && (
          <div className={styles.result}>
            <h3 className={styles.resultTitle}>연습 완료!</h3>
            <div className={styles.resultStats}>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{result.cpm}</span>
                <span className={styles.resultLabel}>타/분</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{result.wpm}</span>
                <span className={styles.resultLabel}>WPM</span>
              </div>
              <div className={styles.resultItem}>
                <span className={`${styles.resultValue} ${styles.success}`}>{result.accuracy}%</span>
                <span className={styles.resultLabel}>정확도</span>
              </div>
              <div className={styles.resultItem}>
                <span className={`${styles.resultValue} ${result.errorRate > 10 ? styles.error : ''}`}>
                  {result.errorRate}%
                </span>
                <span className={styles.resultLabel}>오타율</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{result.totalTime}초</span>
                <span className={styles.resultLabel}>소요시간</span>
              </div>
            </div>
            <button className={styles.nextBtn} onClick={generateNewText}>
              다음 연습
            </button>
          </div>
        )}

        <div
          className={`${styles.typingSection} ${mode === 'paragraph' ? styles.paragraph : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {renderLines()}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.hiddenInput}
          disabled={isCompleted}
          autoFocus
        />

        {!isStarted && (
          <p className={styles.startHint}>타이핑을 시작하면 측정이 시작됩니다</p>
        )}

        <button className={styles.resetBtn} onClick={generateNewText}>
          다시 시작
        </button>
      </div>
    </div>
  );
}
