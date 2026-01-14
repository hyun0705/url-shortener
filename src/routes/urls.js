const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const crypto = require('crypto');

// Prepared Statement (지연 초기화)
let stmts = null;

function getStmts() {
  if (!stmts) {
    stmts = {
      getByOriginalUrl: db.prepare('SELECT code, clicks FROM urls WHERE original_url = ?'),
      getByCode: db.prepare('SELECT code FROM urls WHERE code = ?'),
      insert: db.prepare('INSERT INTO urls (code, original_url) VALUES (?, ?)'),
      getRecent: db.prepare('SELECT code, original_url, clicks, created_at FROM urls ORDER BY created_at DESC LIMIT 10'),
      getStats: db.prepare('SELECT code, original_url, clicks, created_at FROM urls WHERE code = ?'),
      delete: db.prepare('DELETE FROM urls WHERE code = ?')
    };
  }
  return stmts;
}

// 단축 코드 생성 (6자리)
function generateCode() {
  return crypto.randomBytes(3).toString('hex');
}

// URL 유효성 검사
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// URL 단축 (CREATE)
router.post('/shorten', (req, res) => {
  try {
    const { url } = req.body;

    // 입력값 검증
    if (!url) {
      return res.status(400).json({ error: 'URL을 입력해주세요' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: '유효한 URL을 입력해주세요' });
    }

    // 이미 등록된 URL인지 확인
    const existing = getStmts().getByOriginalUrl.get(url);
    if (existing) {
      return res.json({ code: existing.code, clicks: existing.clicks });
    }

    // 새 단축 코드 생성
    let code = generateCode();

    // 중복 체크
    while (getStmts().getByCode.get(code)) {
      code = generateCode();
    }

    // DB 저장
    getStmts().insert.run(code, url);

    res.status(201).json({ code, clicks: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 최근 URL 목록 (READ)
router.get('/urls', (req, res) => {
  try {
    const urls = getStmts().getRecent.all();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// URL 통계 조회 (READ)
router.get('/stats/:code', (req, res) => {
  try {
    const url = getStmts().getStats.get(req.params.code);

    if (!url) {
      return res.status(404).json({ error: 'URL을 찾을 수 없습니다' });
    }

    res.json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// URL 삭제 (DELETE)
router.delete('/urls/:code', (req, res) => {
  try {
    const result = getStmts().delete.run(req.params.code);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'URL을 찾을 수 없습니다' });
    }

    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
