const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// HTML 템플릿
const templates = {
  home: (content) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MONO PORTFOLIO</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body data-page="home">
  @include header

  <div class="site-wrap">
    <div class="issue-meta">
      <span>Issue 2026 / Selected Works</span>
      <span>Design · Publishing · UI/UX</span>
    </div>
    ${content}
  </div>

  @include footer

  <div class="modal" id="accessModal">
    <div class="modal-card">
      <h2 class="modal-title">Private access</h2>
      <p class="modal-copy">안서현의 개인 포트폴리오 웹페이지 입니다. 비밀번호를 입력해주세요!</p>
      <form onsubmit="handlePasswordSubmit(event)">
        <input id="passwordInput" class="input" type="password" placeholder="Enter password" autocomplete="off" />
        <div id="passwordError" class="error-text"></div>
        <div class="modal-actions">
          <button type="button" class="btn" onclick="handleAccessCancel()">Close</button>
          <button type="submit" class="btn btn-primary">Enter</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal" id="contactModal">
    <div class="modal-card">
      <h2 class="modal-title">Contact</h2>
      <p class="modal-copy">Email: your@email.com<br />Phone: 010-0000-0000<br />Location: Seoul, Korea</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" onclick="closeModal(this)">Close</button>
      </div>
    </div>
  </div>

  <div class="modal" id="snsModal">
    <div class="modal-card">
      <h2 class="modal-title">SNS</h2>
      <p class="modal-copy">Behance: your-link<br />Instagram: your-link<br />Blog / Notion: your-link</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" onclick="closeModal(this)">Close</button>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
  <script src="js/include.js"></script>
</body>
</html>`,

  sub: (content, prev, next) => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MONO PORTFOLIO</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body data-protected="true" data-prev="${prev}" data-next="${next}">
  @include header

  <div class="site-wrap">
    ${content}
  </div>

  <script src="script.js"></script>
  <script src="js/include.js"></script>
  <script src="js/project-footer.js"></script>
</body>
</html>`
};

// @include 처리
function processIncludes(content, componentsDir) {
  return content.replace(/@include\s+(\w+)/g, (match, componentName) => {
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    try {
      if (fs.existsSync(componentPath)) {
        return fs.readFileSync(componentPath, 'utf-8');
      }
      return match;
    } catch (error) {
      console.error(`Error loading ${componentName}:`, error.message);
      return match;
    }
  });
}

// pages.json 읽기
function loadPagesMeta() {
  try {
    const pagesPath = './pages.json';
    if (fs.existsSync(pagesPath)) {
      return JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
    }
  } catch (error) {
    console.warn('pages.json을 찾을 수 없거나 형식이 잘못됨');
  }
  return {};
}

function build() {
  const srcDir = './src';
  const componentsDir = './components';
  const distDir = './dist';
  const pages = loadPagesMeta();

  if (!fs.existsSync(srcDir)) {
    console.error('❌ src/ 폴더가 없습니다.');
    return;
  }

  ensureDir(distDir);

  const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.html'));

  console.log(`\n🔨 빌드 시작...\n`);

  let successCount = 0;

  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);
    const fileName = file.replace('.html', '');

    try {
      let content = fs.readFileSync(srcPath, 'utf-8').trim();
      let finalHtml;

      // index.html 처리
      if (fileName === 'index') {
        finalHtml = templates.home(content);
      }
      // 서브페이지 처리
      else {
        const meta = pages[fileName] || {};
        const prev = meta.prev || 'index.html';
        const next = meta.next || '';
        finalHtml = templates.sub(content, prev, next);
      }

      // @include 처리
      finalHtml = processIncludes(finalHtml, componentsDir);

      fs.writeFileSync(distPath, finalHtml, 'utf-8');
      console.log(`✅ ${file}`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${file} 실패:`, error.message);
    }
  });

  console.log(`\n✨ 완료: ${successCount}개 파일 생성\n`);
}

build();
