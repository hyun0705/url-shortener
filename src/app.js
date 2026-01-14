const express = require('express');
const path = require('path');
const urlRouter = require('./routes/urls');
const { initDB, db } = require('./db/database');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 라우트
app.use('/api', urlRouter);

// 리다이렉트 (단축 URL 접속 시)
app.get('/:code', (req, res) => {
  const { code } = req.params;

  try {
    const url = db.prepare('SELECT * FROM urls WHERE code = ?').get(code);

    if (!url) {
      return res.status(404).send('URL을 찾을 수 없습니다');
    }

    // 클릭 수 증가
    db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE code = ?').run(code);

    // 리다이렉트
    res.redirect(url.original_url);
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

// DB 초기화 후 서버 시작
initDB();

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
