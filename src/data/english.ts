// 영문 타자 연습 데이터

// 영문 키보드 자리 배열 (QWERTY)
export const englishKeyboardLayout = {
  row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
};

// 손가락 위치 매핑
export const englishFingerMap: Record<string, { finger: string; hand: string }> = {
  // 왼손 새끼손가락
  'q': { finger: 'pinky', hand: 'left' },
  'a': { finger: 'pinky', hand: 'left' },
  'z': { finger: 'pinky', hand: 'left' },
  // 왼손 약지
  'w': { finger: 'ring', hand: 'left' },
  's': { finger: 'ring', hand: 'left' },
  'x': { finger: 'ring', hand: 'left' },
  // 왼손 중지
  'e': { finger: 'middle', hand: 'left' },
  'd': { finger: 'middle', hand: 'left' },
  'c': { finger: 'middle', hand: 'left' },
  // 왼손 검지
  'r': { finger: 'index', hand: 'left' },
  't': { finger: 'index', hand: 'left' },
  'f': { finger: 'index', hand: 'left' },
  'g': { finger: 'index', hand: 'left' },
  'v': { finger: 'index', hand: 'left' },
  'b': { finger: 'index', hand: 'left' },
  // 오른손 검지
  'y': { finger: 'index', hand: 'right' },
  'u': { finger: 'index', hand: 'right' },
  'h': { finger: 'index', hand: 'right' },
  'j': { finger: 'index', hand: 'right' },
  'n': { finger: 'index', hand: 'right' },
  'm': { finger: 'index', hand: 'right' },
  // 오른손 중지
  'i': { finger: 'middle', hand: 'right' },
  'k': { finger: 'middle', hand: 'right' },
  ',': { finger: 'middle', hand: 'right' },
  // 오른손 약지
  'o': { finger: 'ring', hand: 'right' },
  'l': { finger: 'ring', hand: 'right' },
  '.': { finger: 'ring', hand: 'right' },
  // 오른손 새끼손가락
  'p': { finger: 'pinky', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  '/': { finger: 'pinky', hand: 'right' },
  // 스페이스바
  ' ': { finger: 'thumb', hand: 'right' },
};

// 자리 연습용 문자 세트
export const englishPositionPractice = {
  homeRow: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  topRow: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  bottomRow: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  numberRow: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  symbols: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '[', ']', '\\', ';', "'", ',', '.', '/'],
  all: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
};

// 단어 연습용 단어 목록
export const englishWords = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
    'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  ],
  medium: [
    'about', 'would', 'there', 'their', 'what', 'which', 'when', 'make', 'can', 'like',
    'time', 'just', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
    'could', 'them', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'over',
  ],
  hard: [
    'programming', 'development', 'application', 'technology', 'information',
    'communication', 'experience', 'environment', 'international', 'organization',
    'professional', 'performance', 'infrastructure', 'implementation', 'architecture',
    'functionality', 'authentication', 'authorization', 'configuration', 'documentation',
  ],
};

// 단문 연습용 문장
export const englishSentences = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'Hello, how are you today?',
    'I love to learn new things.',
    'The sun is shining brightly.',
    'She sells seashells by the seashore.',
    'A journey of a thousand miles begins with a single step.',
    'Practice makes perfect.',
    'Time flies when you are having fun.',
  ],
  medium: [
    'The early bird catches the worm, but the second mouse gets the cheese.',
    'In the middle of difficulty lies opportunity.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    'The only way to do great work is to love what you do.',
    'Life is what happens when you are busy making other plans.',
    'The best time to plant a tree was twenty years ago. The second best time is now.',
  ],
  hard: [
    'Programming is the art of telling another human being what one wants the computer to do.',
    'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    'Artificial intelligence is transforming the way we live, work, and interact with technology.',
    'In the age of information, digital literacy has become an essential skill for everyone.',
    'The development of full artificial intelligence could spell the end of the human race.',
  ],
};

// 장문 연습용 텍스트
export const englishParagraphs = [
  `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet and is commonly used for typing practice. It helps develop muscle memory for all keys on the keyboard.`,

  `Typing is an essential skill in today's digital world. Whether you're writing emails, coding, or chatting with friends, being able to type quickly and accurately can save you a lot of time. Practice regularly and focus on accuracy before speed.`,

  `The history of computing dates back to the early 20th century. From room-sized machines to smartphones that fit in our pockets, technology has evolved at an incredible pace. Today, computers are an integral part of our daily lives, helping us work, learn, and connect with others.`,

  `Learning to type without looking at the keyboard is called touch typing. This skill allows you to focus on what you're writing rather than searching for keys. Start by learning the home row keys, then gradually add more keys as you become comfortable. With consistent practice, you can achieve speeds of 60 words per minute or more.`,
];
