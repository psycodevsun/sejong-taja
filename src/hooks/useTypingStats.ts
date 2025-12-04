import { useState, useCallback, useRef } from 'react';
import type { TypingStats, TypingResult } from '../types';

// 한글 자모 분리를 통한 타수 계산
// 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
// 초성 19개, 중성 21개, 종성 28개 (종성 없음 포함)
function getKoreanStrokeCount(char: string): number {
  const code = char.charCodeAt(0);

  // 한글 완성형 범위
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const offset = code - 0xAC00;
    const jongsung = offset % 28; // 종성 인덱스

    // 초성 + 중성 = 2타, 종성이 있으면 +1타
    return jongsung === 0 ? 2 : 3;
  }

  // 한글 자모 (ㄱ~ㅎ, ㅏ~ㅣ)
  if ((code >= 0x3131 && code <= 0x3163) || (code >= 0x1100 && code <= 0x11FF)) {
    return 1;
  }

  // 그 외 문자 (영문, 숫자, 특수문자 등)
  return 1;
}

// 문자열의 총 타수 계산
function calculateTotalStrokes(text: string): number {
  let strokes = 0;
  for (const char of text) {
    strokes += getKoreanStrokeCount(char);
  }
  return strokes;
}

// 타자 통계 관리 훅
export function useTypingStats() {
  const [stats, setStats] = useState<TypingStats>({
    totalChars: 0,
    correctChars: 0,
    incorrectChars: 0,
    startTime: null,
    endTime: null,
  });

  const statsRef = useRef(stats);
  statsRef.current = stats;

  // 타이핑 시작
  const startTyping = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      startTime: Date.now(),
      endTime: null,
    }));
  }, []);

  // 타이핑 종료
  const endTyping = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      endTime: Date.now(),
    }));
  }, []);

  // 올바른 입력 기록
  const recordCorrect = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalChars: prev.totalChars + 1,
      correctChars: prev.correctChars + 1,
    }));
  }, []);

  // 틀린 입력 기록
  const recordIncorrect = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalChars: prev.totalChars + 1,
      incorrectChars: prev.incorrectChars + 1,
    }));
  }, []);

  // 통계 초기화
  const resetStats = useCallback(() => {
    setStats({
      totalChars: 0,
      correctChars: 0,
      incorrectChars: 0,
      startTime: null,
      endTime: null,
    });
  }, []);

  // 결과 계산 - 현재 입력 기반으로 계산
  const calculateResult = useCallback((userInput?: string, targetText?: string): TypingResult | null => {
    const { startTime, endTime } = statsRef.current;

    if (!startTime) {
      return null;
    }

    const end = endTime || Date.now();
    const totalTimeSeconds = (end - startTime) / 1000;
    const totalTimeMinutes = totalTimeSeconds / 60;

    // userInput과 targetText가 제공되면 현재 입력 기준으로 계산
    if (userInput !== undefined && targetText !== undefined) {
      const totalChars = userInput.length;
      if (totalChars === 0) {
        return null;
      }

      let correctChars = 0;
      let incorrectChars = 0;
      let correctStrokes = 0; // 정확하게 입력한 타수

      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === targetText[i]) {
          correctChars++;
          correctStrokes += getKoreanStrokeCount(userInput[i]);
        } else {
          incorrectChars++;
        }
      }

      // 타/분은 자모 기준 타수로 계산
      const cpm = Math.round(correctStrokes / totalTimeMinutes);
      const wpm = Math.round(cpm / 5);
      const accuracy = Math.round((correctChars / totalChars) * 100);
      const errorRate = Math.round((incorrectChars / totalChars) * 100);

      return {
        wpm,
        cpm,
        accuracy,
        errorRate,
        totalTime: Math.round(totalTimeSeconds),
      };
    }

    // 기존 방식 (호환성 유지)
    const { totalChars, correctChars, incorrectChars } = statsRef.current;
    if (totalChars === 0) {
      return null;
    }

    const cpm = Math.round(correctChars / totalTimeMinutes);
    const wpm = Math.round(cpm / 5);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    const errorRate = totalChars > 0 ? Math.round((incorrectChars / totalChars) * 100) : 0;

    return {
      wpm,
      cpm,
      accuracy,
      errorRate,
      totalTime: Math.round(totalTimeSeconds),
    };
  }, []);

  // 실시간 통계 (현재 진행 중인 타이핑) - 현재 입력 기반으로 계산
  const getCurrentStats = useCallback((userInput?: string, targetText?: string): Partial<TypingResult> => {
    const { startTime } = statsRef.current;

    if (!startTime) {
      return { wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 };
    }

    // userInput과 targetText가 제공되면 현재 입력 기준으로 계산
    if (userInput !== undefined && targetText !== undefined) {
      const totalChars = userInput.length;
      if (totalChars === 0) {
        return { wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 };
      }

      let correctChars = 0;
      let incorrectChars = 0;
      let correctStrokes = 0;

      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === targetText[i]) {
          correctChars++;
          correctStrokes += getKoreanStrokeCount(userInput[i]);
        } else {
          incorrectChars++;
        }
      }

      const totalTimeMinutes = (Date.now() - startTime) / 1000 / 60;
      const cpm = totalTimeMinutes > 0 ? Math.round(correctStrokes / totalTimeMinutes) : 0;
      const wpm = Math.round(cpm / 5);
      const accuracy = Math.round((correctChars / totalChars) * 100);
      const errorRate = Math.round((incorrectChars / totalChars) * 100);

      return { wpm, cpm, accuracy, errorRate };
    }

    // 기존 방식 (호환성 유지)
    const { totalChars, correctChars, incorrectChars } = statsRef.current;
    if (totalChars === 0) {
      return { wpm: 0, cpm: 0, accuracy: 100, errorRate: 0 };
    }

    const totalTimeMinutes = (Date.now() - startTime) / 1000 / 60;
    const cpm = totalTimeMinutes > 0 ? Math.round(correctChars / totalTimeMinutes) : 0;
    const wpm = Math.round(cpm / 5);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const errorRate = totalChars > 0 ? Math.round((incorrectChars / totalChars) * 100) : 0;

    return { wpm, cpm, accuracy, errorRate };
  }, []);

  return {
    stats,
    startTyping,
    endTyping,
    recordCorrect,
    recordIncorrect,
    resetStats,
    calculateResult,
    getCurrentStats,
  };
}
