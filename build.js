/**
 * build.js - @include 지시자 처리
 * 
 * 사용법:
 * node build.js
 * 
 * 역할:
 * - src/ 폴더의 모든 .html 파일에서 @include 찾기
 * - components/ 폴더의 해당 파일 내용 삽입
 * - dist/ 폴더에 최종 파일 생성
 */

const fs = require('fs');
const path = require('path');

// 디렉토리 생성 헬퍼
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// @include 지시자 처리
function processIncludes(content, componentsDir) {
  // @include directive 정규식: @include componentName
  return content.replace(/@include\s+(\w+)/g, (match, componentName) => {
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    
    try {
      if (fs.existsSync(componentPath)) {
        return fs.readFileSync(componentPath, 'utf-8');
      } else {
        console.warn(`⚠️  파일을 찾을 수 없음: ${componentPath}`);
        return match; // 지시자 유지
      }
    } catch (error) {
      console.error(`❌ ${componentName} 처리 중 오류:`, error.message);
      return match;
    }
  });
}

// 메인 빌드 함수
function build() {
  const srcDir = './src';
  const componentsDir = './components';
  const distDir = './dist';

  // 디렉토리 확인
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ src/ 폴더가 없습니다. 생성해주세요.`);
    return;
  }

  if (!fs.existsSync(componentsDir)) {
    console.error(`❌ components/ 폴더가 없습니다. 생성해주세요.`);
    return;
  }

  // dist 폴더 생성
  ensureDir(distDir);

  // src 폴더의 모든 .html 파일 처리
  const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.html'));

  console.log(`\n🔨 빌드 시작...\n`);

  let successCount = 0;
  let failCount = 0;

  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);

    try {
      let content = fs.readFileSync(srcPath, 'utf-8');
      content = processIncludes(content, componentsDir);
      fs.writeFileSync(distPath, content, 'utf-8');
      console.log(`✅ ${file} → ${distPath}`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${file} 처리 실패:`, error.message);
      failCount++;
    }
  });

  console.log(`\n📊 결과: 성공 ${successCount}, 실패 ${failCount}\n`);
  console.log(`✨ 최종 파일은 dist/ 폴더에 있습니다.\n`);
}

// 실행
build();
