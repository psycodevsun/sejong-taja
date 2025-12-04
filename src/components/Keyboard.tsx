import styles from './Keyboard.module.css';
import type { Language } from '../types';
import { koreanFingerMap, numberFingerMap } from '../data/korean';
import { englishFingerMap } from '../data/english';

interface KeyboardProps {
  language: Language;
  activeKey?: string;
  showFingers?: boolean;
}

// 숫자 행 (공통)
const numberRow = [
  { key: '`', shift: '~' },
  { key: '1', shift: '!' },
  { key: '2', shift: '@' },
  { key: '3', shift: '#' },
  { key: '4', shift: '$' },
  { key: '5', shift: '%' },
  { key: '6', shift: '^' },
  { key: '7', shift: '&' },
  { key: '8', shift: '*' },
  { key: '9', shift: '(' },
  { key: '0', shift: ')' },
  { key: '-', shift: '_' },
  { key: '=', shift: '+' },
];

// 키보드 레이아웃 정의
const keyboardRows = {
  korean: {
    numberRow,
    row1: [
      { key: 'ㅂ', shift: 'ㅃ' },
      { key: 'ㅈ', shift: 'ㅉ' },
      { key: 'ㄷ', shift: 'ㄸ' },
      { key: 'ㄱ', shift: 'ㄲ' },
      { key: 'ㅅ', shift: 'ㅆ' },
      { key: 'ㅛ', shift: 'ㅛ' },
      { key: 'ㅕ', shift: 'ㅕ' },
      { key: 'ㅑ', shift: 'ㅑ' },
      { key: 'ㅐ', shift: 'ㅒ' },
      { key: 'ㅔ', shift: 'ㅖ' },
      { key: '[', shift: '{' },
      { key: ']', shift: '}' },
      { key: '\\', shift: '|' },
    ],
    row2: [
      { key: 'ㅁ', shift: 'ㅁ' },
      { key: 'ㄴ', shift: 'ㄴ' },
      { key: 'ㅇ', shift: 'ㅇ' },
      { key: 'ㄹ', shift: 'ㄹ' },
      { key: 'ㅎ', shift: 'ㅎ' },
      { key: 'ㅗ', shift: 'ㅗ' },
      { key: 'ㅓ', shift: 'ㅓ' },
      { key: 'ㅏ', shift: 'ㅏ' },
      { key: 'ㅣ', shift: 'ㅣ' },
      { key: ';', shift: ':' },
      { key: "'", shift: '"' },
    ],
    row3: [
      { key: 'ㅋ', shift: 'ㅋ' },
      { key: 'ㅌ', shift: 'ㅌ' },
      { key: 'ㅊ', shift: 'ㅊ' },
      { key: 'ㅍ', shift: 'ㅍ' },
      { key: 'ㅠ', shift: 'ㅠ' },
      { key: 'ㅜ', shift: 'ㅜ' },
      { key: 'ㅡ', shift: 'ㅡ' },
      { key: ',', shift: '<' },
      { key: '.', shift: '>' },
      { key: '/', shift: '?' },
    ],
  },
  english: {
    numberRow,
    row1: [
      { key: 'q', shift: 'Q' },
      { key: 'w', shift: 'W' },
      { key: 'e', shift: 'E' },
      { key: 'r', shift: 'R' },
      { key: 't', shift: 'T' },
      { key: 'y', shift: 'Y' },
      { key: 'u', shift: 'U' },
      { key: 'i', shift: 'I' },
      { key: 'o', shift: 'O' },
      { key: 'p', shift: 'P' },
      { key: '[', shift: '{' },
      { key: ']', shift: '}' },
      { key: '\\', shift: '|' },
    ],
    row2: [
      { key: 'a', shift: 'A' },
      { key: 's', shift: 'S' },
      { key: 'd', shift: 'D' },
      { key: 'f', shift: 'F' },
      { key: 'g', shift: 'G' },
      { key: 'h', shift: 'H' },
      { key: 'j', shift: 'J' },
      { key: 'k', shift: 'K' },
      { key: 'l', shift: 'L' },
      { key: ';', shift: ':' },
      { key: "'", shift: '"' },
    ],
    row3: [
      { key: 'z', shift: 'Z' },
      { key: 'x', shift: 'X' },
      { key: 'c', shift: 'C' },
      { key: 'v', shift: 'V' },
      { key: 'b', shift: 'B' },
      { key: 'n', shift: 'N' },
      { key: 'm', shift: 'M' },
      { key: ',', shift: '<' },
      { key: '.', shift: '>' },
      { key: '/', shift: '?' },
    ],
  },
};

// 특수기호 손가락 매핑
const symbolFingerMap: Record<string, { finger: string; hand: string }> = {
  '`': { finger: 'pinky', hand: 'left' },
  '~': { finger: 'pinky', hand: 'left' },
  '!': { finger: 'pinky', hand: 'left' },
  '@': { finger: 'ring', hand: 'left' },
  '#': { finger: 'middle', hand: 'left' },
  '$': { finger: 'index', hand: 'left' },
  '%': { finger: 'index', hand: 'left' },
  '^': { finger: 'index', hand: 'right' },
  '&': { finger: 'index', hand: 'right' },
  '*': { finger: 'middle', hand: 'right' },
  '(': { finger: 'ring', hand: 'right' },
  ')': { finger: 'pinky', hand: 'right' },
  '-': { finger: 'pinky', hand: 'right' },
  '_': { finger: 'pinky', hand: 'right' },
  '=': { finger: 'pinky', hand: 'right' },
  '+': { finger: 'pinky', hand: 'right' },
  '[': { finger: 'pinky', hand: 'right' },
  '{': { finger: 'pinky', hand: 'right' },
  ']': { finger: 'pinky', hand: 'right' },
  '}': { finger: 'pinky', hand: 'right' },
  '\\': { finger: 'pinky', hand: 'right' },
  '|': { finger: 'pinky', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  ':': { finger: 'pinky', hand: 'right' },
  "'": { finger: 'pinky', hand: 'right' },
  '"': { finger: 'pinky', hand: 'right' },
  ',': { finger: 'middle', hand: 'right' },
  '<': { finger: 'middle', hand: 'right' },
  '.': { finger: 'ring', hand: 'right' },
  '>': { finger: 'ring', hand: 'right' },
  '/': { finger: 'pinky', hand: 'right' },
  '?': { finger: 'pinky', hand: 'right' },
};

// 손가락 색상 클래스 반환
function getFingerClass(key: string, language: Language): string {
  const fingerMap = language === 'korean' ? koreanFingerMap : englishFingerMap;
  const keyLower = key.toLowerCase();

  // 숫자 매핑 확인
  if (numberFingerMap[key]) {
    const fingerInfo = numberFingerMap[key];
    return `${fingerInfo.finger}_${fingerInfo.hand}`;
  }

  // 특수기호 매핑 확인
  if (symbolFingerMap[key]) {
    const fingerInfo = symbolFingerMap[key];
    return `${fingerInfo.finger}_${fingerInfo.hand}`;
  }

  const fingerInfo = fingerMap[keyLower] || fingerMap[key];

  if (!fingerInfo) return '';

  return `${fingerInfo.finger}_${fingerInfo.hand}`;
}

export function Keyboard({ language, activeKey, showFingers = true }: KeyboardProps) {
  const layout = keyboardRows[language];

  const renderKey = (keyData: { key: string; shift: string }, isHome: boolean = false) => {
    const isActive = activeKey?.toLowerCase() === keyData.key.toLowerCase() || activeKey === keyData.key;
    const fingerClass = showFingers ? getFingerClass(keyData.key, language) : '';

    return (
      <div
        key={keyData.key}
        className={`
          ${styles.key}
          ${isActive ? styles.active : ''}
          ${isHome ? styles.home : ''}
          ${fingerClass ? styles[fingerClass] : ''}
        `}
      >
        <span className={styles.keyLabel}>{keyData.key}</span>
        {isHome && <div className={styles.homeIndicator} />}
      </div>
    );
  };

  // 홈 키 인덱스 (왼손: F/ㄹ, 오른손: J/ㅓ)
  const homeKeys = language === 'korean' ? ['ㄹ', 'ㅓ'] : ['f', 'j'];

  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
        {layout.numberRow.map((k) => renderKey(k))}
      </div>
      <div className={styles.row}>
        {layout.row1.map((k) => renderKey(k))}
      </div>
      <div className={`${styles.row} ${styles.row2}`}>
        {layout.row2.map((k) => renderKey(k, homeKeys.includes(k.key)))}
      </div>
      <div className={`${styles.row} ${styles.row3}`}>
        {layout.row3.map((k) => renderKey(k))}
      </div>
      <div className={styles.row}>
        <div className={`${styles.key} ${styles.space} ${styles.thumb_right} ${activeKey === ' ' ? styles.active : ''}`}>
          <span className={styles.keyLabel}>Space</span>
        </div>
      </div>

      {showFingers && (
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.pinky_left}`} />
            <span>새끼</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.ring_left}`} />
            <span>약지</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.middle_left}`} />
            <span>중지</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.index_left}`} />
            <span>검지</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.thumb_right}`} />
            <span>엄지</span>
          </div>
        </div>
      )}
    </div>
  );
}
