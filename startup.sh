#!/bin/bash

# 세종타자 - 개발 서버 실행 스크립트

cd "$(dirname "$0")"

# 의존성 확인 및 설치
if [ ! -d "node_modules" ]; then
    echo "의존성을 설치합니다..."
    npm install
fi

# 개발 서버 실행
echo "세종타자 개발 서버를 시작합니다..."
npm run dev
