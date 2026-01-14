# URL 단축 서비스

긴 URL을 짧게 줄여주는 서비스

## 기능

- URL 단축
- 클릭 수 통계
- 최근 단축 URL 목록

## 기술 스택

- **프론트엔드**: HTML, CSS, Vanilla JavaScript
- **백엔드**: Node.js, Express
- **데이터베이스**: SQLite (better-sqlite3)

## 실행 방법

```bash
npm install
npm start
```

http://localhost:3000 접속

## 배포

Render 무료 티어로 배포됨.

⚠️ 무료 티어는 비활성 시 서버가 꺼집니다. 첫 접속 시 30초~1분 정도 기다려주세요.

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/shorten | URL 단축 |
| GET | /api/urls | 최근 URL 목록 |
| GET | /api/stats/:code | 통계 조회 |
| DELETE | /api/urls/:code | URL 삭제 |
| GET | /:code | 리다이렉트 |
