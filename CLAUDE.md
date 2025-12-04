# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

을지타자연습 - 한글 타자 연습 웹사이트 (Vite + React + TypeScript)

- **서비스 URL**: https://eztaza.com
- **운영사**: 주식회사 소프트모아 (www.softmoa.com)
- **문의**: support@softmoa.com

## 개발 명령어

```bash
./startup.sh     # 개발 서버 실행 (의존성 자동 설치)
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (TypeScript 컴파일 + Vite 빌드)
npm run lint     # ESLint 실행
npm run preview  # 빌드된 결과물 미리보기
```

## 배포

- Vercel에 GitHub 저장소 연동하여 자동 배포
- main 브랜치 푸시 시 자동으로 빌드 및 배포
- 커스텀 도메인: eztaza.com

## 기술 스택

- React 19 + TypeScript
- Vite 7 (빌드 도구)
- ESLint (코드 린팅)
- CSS Modules (컴포넌트 스타일링)

## 프로젝트 구조

```
src/
├── components/     # React 컴포넌트 (*.tsx, *.module.css)
│   ├── Header.tsx          # 헤더 (로고, 언어 선택)
│   ├── ModeSelector.tsx    # 연습 모드 선택 탭
│   ├── PositionPractice.tsx # 자리연습 컴포넌트
│   ├── TypingPractice.tsx  # 단어/단문/장문 연습 컴포넌트
│   ├── Keyboard.tsx        # 가상 키보드 표시
│   ├── StatsDisplay.tsx    # 실시간 통계 표시
│   └── Footer.tsx          # 푸터 (회사 정보)
├── data/           # 연습용 텍스트 데이터
│   ├── korean.ts   # 한글 단어/단문/장문 데이터
│   └── english.ts  # 영문 단어/단문/장문 데이터
├── hooks/          # 커스텀 훅
│   └── useTypingStats.ts   # 타이핑 통계 계산
├── styles/         # 글로벌 스타일
│   └── global.css  # CSS 변수, 리셋 스타일
└── types/          # TypeScript 타입 정의
    └── index.ts    # Language, PracticeMode 등

public/
├── favicon.svg     # 파비콘 (SVG)
└── og-image.svg    # Open Graph 이미지
```

## 주요 기능

- **언어 선택**: 한글/영문 타자 연습
- **연습 모드**: 자리연습, 단어연습, 단문연습, 장문연습
- **자리연습**: 키보드에 손가락 위치 색상 표시 (왼손/오른손 구분)
- **타이핑 통계**: 타/분(CPM), WPM, 정확도, 오타율 실시간 표시
- **완료 카운트**: 단어/단문/장문 몇 개 완료했는지 표시
- **장문 연습**:
  - 한글: 저작권 없는 한국 고전 소설 (~600자씩, 시리즈별 연속 연습)
  - 영문: 다양한 주제의 영문 글 20편 (~600자씩)
- **글 선택 기능**: 장문 모드에서 랜덤 또는 직접 글 선택 가능

## SEO 설정

- 네이버 서치어드바이저 등록 완료
- Open Graph / Twitter Card 메타태그 설정
- robots 메타태그로 검색엔진 크롤링 허용

## 언어 요구사항

- 모든 응답과 코드 주석은 한글로 작성
- 사용자 인터페이스 텍스트는 한글로 작성
