# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

세종타자 - 한글 타자 연습 웹사이트 (Vite + React + TypeScript)

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

## 기술 스택

- React 19 + TypeScript
- Vite 7 (빌드 도구)
- ESLint (코드 린팅)
- CSS Modules (컴포넌트 스타일링)

## 프로젝트 구조

```
src/
├── components/     # React 컴포넌트 (*.tsx, *.module.css)
├── data/           # 연습용 텍스트 데이터 (korean.ts, english.ts)
├── hooks/          # 커스텀 훅 (useTypingStats)
├── styles/         # 글로벌 스타일 (global.css)
└── types/          # TypeScript 타입 정의
```

## 주요 기능

- **언어 선택**: 한글/영문 타자 연습
- **연습 모드**: 자리연습, 단어연습, 단문연습, 장문연습
- **자리연습**: 키보드에 손가락 위치 색상 표시
- **타이핑 통계**: 타/분(CPM), WPM, 정확도, 오타율 실시간 표시

## 언어 요구사항

- 모든 응답과 코드 주석은 한글로 작성
- 사용자 인터페이스 텍스트는 한글로 작성
