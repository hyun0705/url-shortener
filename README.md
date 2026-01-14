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

[https://url-shortener-lr73.onrender.com] 접속

## 배포

Render 무료 티어로 배포됨.

⚠️ 무료 티어는 비활성 시 서버가 꺼집니다. 첫 접속 시 30초~1분 정도 기다려주세요.

## 동작 흐름

### URL 단축

```
1. [main.js] 사용자가 URL 입력 후 버튼 클릭
2. [main.js] fetch('/api/shorten', { url }) 요청
3. [app.js] /api 요청 → urls.js로 전달
4. [urls.js] URL 유효성 검사
5. [urls.js] crypto.randomBytes(3)로 6자리 랜덤 코드 생성
6. [urls.js] DB에 INSERT (code, original_url)
7. [urls.js] { code, clicks } 응답
8. [main.js] 화면에 단축 URL 표시
```

### 리다이렉트

```
1. [브라우저] 단축 URL 접속 (예: /a1b2c3)
2. [app.js] /:code 라우트에서 받음
3. [app.js] DB에서 code로 원본 URL 조회
4. [app.js] clicks + 1 업데이트
5. [app.js] res.redirect(원본 URL)
6. [브라우저] 원본 URL로 이동
```

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/shorten | URL 단축 |
| GET | /api/urls | 최근 URL 목록 |
| GET | /api/stats/:code | 통계 조회 |
| DELETE | /api/urls/:code | URL 삭제 |
| GET | /:code | 리다이렉트 |
