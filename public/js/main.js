const BASE_URL = window.location.origin;

// URL 단축 폼 제출
document.getElementById('url-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalUrl = document.getElementById('original-url').value;

  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: originalUrl })
    });

    const data = await res.json();

    if (res.ok) {
      showResult(data);
      loadRecentUrls();
      document.getElementById('original-url').value = '';
    } else {
      alert(data.error || '오류가 발생했습니다');
    }
  } catch (err) {
    console.error('단축 실패:', err);
    alert('서버 오류가 발생했습니다');
  }
});

// 결과 표시
function showResult(data) {
  const resultSection = document.getElementById('result');
  const shortUrlInput = document.getElementById('short-url');
  const clickCount = document.getElementById('click-count');

  const shortUrl = `${BASE_URL}/${data.code}`;
  shortUrlInput.value = shortUrl;
  clickCount.textContent = data.clicks || 0;

  resultSection.classList.remove('hidden');
}

// 복사 버튼
document.getElementById('copy-btn').addEventListener('click', () => {
  const shortUrlInput = document.getElementById('short-url');
  shortUrlInput.select();
  navigator.clipboard.writeText(shortUrlInput.value);

  const btn = document.getElementById('copy-btn');
  btn.textContent = '복사됨!';
  setTimeout(() => btn.textContent = '복사', 1500);
});

// 최근 URL 목록 불러오기
async function loadRecentUrls() {
  try {
    const res = await fetch('/api/urls');
    const urls = await res.json();
    renderUrlList(urls);
  } catch (err) {
    console.error('목록 로딩 실패:', err);
  }
}

// URL 목록 렌더링
function renderUrlList(urls) {
  const container = document.getElementById('url-list');

  if (urls.length === 0) {
    container.innerHTML = '<p class="empty">아직 단축한 URL이 없습니다</p>';
    return;
  }

  container.innerHTML = urls.map(url => `
    <div class="url-item">
      <div>
        <div class="short">${escapeHtml(url.code)}</div>
        <div class="original">${escapeHtml(url.original_url)}</div>
      </div>
      <div class="clicks">${url.clicks}회 클릭</div>
    </div>
  `).join('');
}

// XSS 방지
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 페이지 로드 시 최근 URL 불러오기
loadRecentUrls();
