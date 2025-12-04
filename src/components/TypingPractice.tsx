import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TypingPractice.module.css';
import { StatsDisplay } from './StatsDisplay';
import { useTypingStats } from '../hooks/useTypingStats';
import type { Language, PracticeMode } from '../types';
import { koreanWords, koreanSentences, koreanParagraphs, koreanParagraphsData } from '../data/korean';
import { englishWords, englishSentences, englishParagraphs } from '../data/english';

interface TypingPracticeProps {
  language: Language;
  mode: PracticeMode;
}

// 자동 다음 이동 딜레이 (밀리초)
const AUTO_ADVANCE_DELAY = 150;

// 영어 단문에서 번역 분리 (괄호 안의 한글)
function separateTranslation(text: string): { mainText: string; translation: string } {
  const match = text.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { mainText: match[1].trim(), translation: match[2].trim() };
  }
  return { mainText: text, translation: '' };
}

// 연습 텍스트 가져오기 (평면 배열에서 랜덤 선택)
function getPracticeText(
  language: Language,
  mode: PracticeMode,
  usedTexts: Set<string>
): string {
  let pool: string[] = [];

  if (language === 'korean') {
    if (mode === 'word') {
      pool = koreanWords;
    } else if (mode === 'sentence') {
      pool = koreanSentences;
    } else if (mode === 'paragraph') {
      pool = koreanParagraphs;
    }
  } else {
    if (mode === 'word') {
      pool = englishWords;
    } else if (mode === 'sentence') {
      pool = englishSentences;
    } else if (mode === 'paragraph') {
      pool = englishParagraphs;
    }
  }

  // 사용하지 않은 텍스트 필터링
  const available = pool.filter((t) => !usedTexts.has(t));
  const finalPool = available.length > 0 ? available : pool;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export function TypingPractice({ language, mode }: TypingPracticeProps) {
  const [targetText, setTargetText] = useState('');
  const [translation, setTranslation] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [usedTexts] = useState<Set<string>>(new Set());
  const [isComposing, setIsComposing] = useState(false);
  const [showParagraphSelector, setShowParagraphSelector] = useState(false);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);
  const [currentParagraphTitle, setCurrentParagraphTitle] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [scrollRequested, setScrollRequested] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);
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

  // 다음 시리즈 파트 찾기
  const getNextSeriesPart = useCallback((currentIndex: number): number | null => {
    const current = koreanParagraphsData[currentIndex];
    if (!current.series) return null;

    // 같은 시리즈에서 다음 파트 찾기
    const nextPartIndex = koreanParagraphsData.findIndex(
      (p) => p.series === current.series && p.part === (current.part || 0) + 1
    );

    return nextPartIndex >= 0 ? nextPartIndex : null;
  }, []);

  // 새 텍스트 생성 (통계는 유지)
  const generateNewText = useCallback((resetAllStats: boolean = false, paragraphIndex?: number, continueToNextPart: boolean = false) => {
    // 타이머 정리
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    let rawText: string;
    let title = '';
    let targetIndex: number;

    // 장문 모드에서 특정 인덱스가 지정된 경우
    if (mode === 'paragraph' && language === 'korean' && paragraphIndex !== undefined) {
      targetIndex = paragraphIndex;
    } else if (mode === 'paragraph' && language === 'korean' && continueToNextPart && selectedParagraphIndex !== null) {
      // 다음 시리즈 파트로 이동
      const nextPart = getNextSeriesPart(selectedParagraphIndex);
      targetIndex = nextPart !== null ? nextPart : Math.floor(Math.random() * koreanParagraphsData.length);
    } else if (mode === 'paragraph' && language === 'korean') {
      // 랜덤 선택
      targetIndex = Math.floor(Math.random() * koreanParagraphsData.length);
    } else {
      rawText = getPracticeText(language, mode, usedTexts);
      usedTexts.add(rawText);
      setCurrentParagraphTitle('');

      // 영어 단어/단문일 때 번역 분리
      if (language === 'english' && (mode === 'word' || mode === 'sentence')) {
        const { mainText, translation: trans } = separateTranslation(rawText);
        setTargetText(mainText);
        setTranslation(trans);
      } else {
        setTargetText(rawText);
        setTranslation('');
      }

      setUserInput('');
      setIsStarted(false);
      setIsCompleted(false);
      setIsComposing(false);

      if (resetAllStats) {
        resetStats();
        setLiveStats({ wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 });
      }

      inputRef.current?.focus({ preventScroll: true });
      return;
    }

    // 한글 장문 처리
    const paragraphData = koreanParagraphsData[targetIndex];
    rawText = paragraphData.content;
    title = `${paragraphData.title} - ${paragraphData.author}`;
    setSelectedParagraphIndex(targetIndex);

    usedTexts.add(rawText);
    setCurrentParagraphTitle(title);
    setTargetText(rawText);
    setTranslation('');

    setUserInput('');
    setIsStarted(false);
    setIsCompleted(false);
    setIsComposing(false);

    // 다시 시작일 때만 통계 초기화
    if (resetAllStats) {
      resetStats();
      setLiveStats({ wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 });
    }

    inputRef.current?.focus({ preventScroll: true });
  }, [language, mode, usedTexts, resetStats, selectedParagraphIndex, getNextSeriesPart]);

  // 다음 시리즈 파트가 있는지 확인
  const hasNextSeriesPart = useCallback((): boolean => {
    if (selectedParagraphIndex === null) return false;
    return getNextSeriesPart(selectedParagraphIndex) !== null;
  }, [selectedParagraphIndex, getNextSeriesPart]);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  // 초기 텍스트 생성 (language나 mode가 바뀔 때만 실행)
  useEffect(() => {
    setCompletedCount(0);
    generateNewText(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, mode]);

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

  // 한글 조합 시작
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 조합 종료
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    // 조합 완료 후 입력 처리
    const value = e.currentTarget.value;
    processInput(value, true);
  };

  // 키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 스페이스바 기본 동작(페이지 스크롤) 방지
    if (e.key === ' ') {
      e.stopPropagation();
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      // 단어/단문 모드에서 완료 후 엔터키로 바로 다음으로 이동
      if ((mode === 'word' || mode === 'sentence') && isCompleted) {
        // 타이머가 있으면 취소하고 바로 이동
        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
        generateNewText(false);
        return;
      }

      // 장문 모드에서 줄 끝에서 다음 줄로 이동
      if (mode === 'paragraph') {
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
              setCompletedCount((prev) => prev + 1);
              endTyping();
            }
          }
        }

        // 엔터 칠 때마다 스크롤 요청 (상태 업데이트 후 useEffect에서 처리)
        setScrollRequested((prev) => prev + 1);
      }
    }
  };

  // 장문 선택 핸들러
  const handleSelectParagraph = (index: number) => {
    setShowParagraphSelector(false);
    generateNewText(true, index);
  };

  // 입력 처리 공통 함수
  const processInput = (value: string, fromComposition: boolean = false) => {
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

    // 완료 확인 - 한글 조합 중이 아닐 때만
    if (!isComposing || fromComposition) {
      if (value.length === targetText.length) {
        setIsCompleted(true);
        setCompletedCount((prev) => prev + 1);
        endTyping();

        // 단어/단문 모드에서 자동으로 다음으로 이동 (통계 유지)
        if (mode === 'word' || mode === 'sentence') {
          autoAdvanceTimerRef.current = window.setTimeout(() => {
            generateNewText(false);
          }, AUTO_ADVANCE_DELAY);
        }
      }
    }
  };

  // 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 한글 조합 중일 때는 UI만 업데이트하고 완료 판단은 하지 않음
    if (isComposing) {
      // 첫 입력 시 시작
      if (!isStarted && value.length > 0) {
        setIsStarted(true);
        startTyping();
      }
      setUserInput(value);
      return;
    }

    processInput(value);
  };

  // 결과 계산
  const result = isCompleted ? calculateResult(userInput, targetText) : null;

  // 현재 입력 중인 라인 인덱스 계산
  const getCurrentLineIndex = () => {
    if (mode !== 'paragraph') return 0;

    const sentences = targetText.split(/(?<=\.) /);
    let currentIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentenceLength = sentences[i].length;
      const lineEnd = currentIndex + sentenceLength + (i < sentences.length - 1 ? 1 : 0);

      if (userInput.length <= lineEnd) {
        return i;
      }
      currentIndex = lineEnd;
    }
    return sentences.length - 1;
  };

  // 스크롤 요청 시 현재 라인으로 스크롤 (화면에서 벗어났을 때만)
  useEffect(() => {
    if (scrollRequested === 0 || !currentLineRef.current) return;

    const rect = currentLineRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const lineCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;

    // 현재 줄이 화면 중앙에서 30% 이상 벗어났을 때만 스크롤
    const threshold = viewportHeight * 0.3;
    if (Math.abs(lineCenter - viewportCenter) > threshold) {
      currentLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollRequested]);

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

    const currentLineIdx = getCurrentLineIndex();

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

      // 현재 입력 중인 라인에 ref 할당
      const isCurrentLine = lineIndex === currentLineIdx;

      return (
        <div
          key={lineIndex}
          className={styles.lineGroup}
          ref={isCurrentLine ? currentLineRef : null}
        >
          <div className={styles.targetLine}>{lineChars}</div>
          {/* 단어/단문 모드에서 번역을 원문 바로 아래에 표시 */}
          {mode !== 'paragraph' && translation && lineIndex === 0 && (
            <div className={styles.translation}>({translation})</div>
          )}
          <div className={styles.inputLine}>{inputChars}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.practiceArea}>
        <StatsDisplay
          wpm={liveStats.wpm}
          cpm={liveStats.cpm}
          accuracy={liveStats.accuracy}
          errorRate={liveStats.errorRate}
          completedCount={completedCount}
          countLabel={mode === 'word' ? '단어' : mode === 'sentence' ? '단문' : '장문'}
        />

        {/* 장문 모드에서 제목과 글 선택 버튼 표시 */}
        {mode === 'paragraph' && language === 'korean' && (
          <div className={styles.paragraphHeader}>
            {currentParagraphTitle && (
              <span className={styles.paragraphTitle}>{currentParagraphTitle}</span>
            )}
            <button
              className={styles.selectBtn}
              onClick={() => setShowParagraphSelector(!showParagraphSelector)}
            >
              {showParagraphSelector ? '닫기' : '글 선택'}
            </button>
          </div>
        )}

        {/* 장문 선택 모달 */}
        {showParagraphSelector && mode === 'paragraph' && language === 'korean' && (
          <div className={styles.paragraphSelector}>
            <div className={styles.selectorHeader}>
              <span>연습할 글을 선택하세요</span>
              <button
                className={styles.randomBtn}
                onClick={() => {
                  setShowParagraphSelector(false);
                  generateNewText(true);
                }}
              >
                랜덤 선택
              </button>
            </div>
            <div className={styles.paragraphList}>
              {koreanParagraphsData.map((p, index) => (
                <button
                  key={index}
                  className={`${styles.paragraphItem} ${selectedParagraphIndex === index ? styles.selected : ''}`}
                  onClick={() => handleSelectParagraph(index)}
                >
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span className={styles.itemAuthor}>{p.author}</span>
                  <span className={styles.itemLength}>{p.content.length}자</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isCompleted && result && mode === 'paragraph' && (
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
            <div className={styles.nextBtnGroup}>
              {hasNextSeriesPart() && (
                <button className={styles.nextBtn} onClick={() => generateNewText(false, undefined, true)}>
                  다음편 계속
                </button>
              )}
              <button className={`${styles.nextBtn} ${styles.randomBtn}`} onClick={() => generateNewText(false)}>
                {hasNextSeriesPart() ? '랜덤 선택' : '다음 연습'}
              </button>
            </div>
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
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className={styles.hiddenInput}
          disabled={isCompleted}
          autoFocus
        />

        {!isStarted && (
          <p className={styles.startHint}>타이핑을 시작하면 측정이 시작됩니다</p>
        )}

        <button className={styles.resetBtn} onClick={() => generateNewText(true)}>
          다시 시작
        </button>
      </div>
    </div>
  );
}
