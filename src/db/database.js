const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// db 폴더 없으면 생성
const dbDir = path.join(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'urls.db');
const db = new Database(dbPath);

// DB 초기화
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 인덱스 생성 (단축 코드 검색 최적화)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code)
  `);

  // 클릭 수 정렬용 인덱스
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_urls_clicks ON urls(clicks DESC)
  `);

  console.log('DB 초기화 완료');
}

module.exports = { db, initDB };
