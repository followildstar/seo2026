/* ═══════════════════════════════════════════════════════════════════════════ */
/* STATE MANAGEMENT (상태 관리)                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

let appState = {
  // 현재 선택된 각 폰트의 굵기
  selectedWeights: {
    ibm: 700,
    noto: 700,
    mplus: 700,
    yugothic: 700,
  },
  
  // 슬라이더 값들
  sliders: {
    weight: 700,
    fontSize: 24,
    lineHeight: 1.5,
    letterSpacing: 0, // -5 ~ 25 범위를 0.01em 단위로 변환
  },
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* UTILITY FUNCTIONS (유틸리티 함수들)                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 슬라이더 값(-5 ~ 25)을 em 단위로 변환
 * -5 = -0.05em, 0 = 0em, 25 = 0.25em
 */
function sliderToTrackingEm(sliderValue) {
  return (sliderValue / 100).toFixed(2);
}

/**
 * 폰트별 색상을 가져오기
 */
function getFontColor(fontKey) {
  return FONTS[fontKey].color;
}

/**
 * 폰트별 배경색(투명도 포함)을 가져오기
 */
function getFontBgColor(fontKey, opacity = 0.08) {
  const color = FONTS[fontKey].color;
  const rgb = hexToRgb(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * 16진수 색상을 RGB로 변환
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* RENDER FUNCTIONS (렌더링 함수들)                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 모든 폰트 카드를 렌더링
 */
function renderFontCards() {
  const container = document.getElementById('fontCardsContainer');
  container.innerHTML = '';

  FONT_LIST.forEach(fontKey => {
    const fontData = FONT_DETAILS[fontKey];
    const fontInfo = FONTS[fontKey];
    const isRecommended = fontData.recommended;

    // 카드 엘리먼트 생성
    const card = document.createElement('div');
    card.className = `font-card ${isRecommended ? 'recommended' : ''}`;

    // Recommended 배지
    let recommendedBadge = '';
    if (isRecommended) {
      recommendedBadge = '<div class="font-card-recommended-badge">RECOMMENDED</div>';
    }

    // 헤더 섹션 (샘플 텍스트)
    const headerHTML = `
      <div class="font-card-header">
        <div class="font-card-weights" id="weights-${fontKey}">
          ${fontInfo.weights.map(w => `
            <button class="weight-btn ${w == appState.selectedWeights[fontKey] ? 'active' : ''}" 
                    data-font="${fontKey}" 
                    data-weight="${w}">
              ${w}
            </button>
          `).join('')}
        </div>
        <p class="font-card-sample-title" style="font-family: ${fontInfo.css}; font-weight: ${appState.selectedWeights[fontKey]};">
          ${SAMPLES.sentence}
        </p>
        <p class="font-card-sample-body" style="font-family: ${fontInfo.css}; font-weight: ${Math.min(appState.selectedWeights[fontKey], 500)};">
          私たちは、革新的な素材技術で社会に貢献します。高品質な製品と確かな技術力で、お客様のビジネスを支えます。
        </p>
        <p class="font-card-sample-meta" style="font-family: ${fontInfo.css}; font-weight: ${appState.selectedWeights[fontKey]};">
          ABCDEFG 1234567890
        </p>
      </div>
    `;

    // 본문 섹션
    const bodyHTML = `
      <div class="font-card-body">
        ${recommendedBadge}
        
        <div>
          <div class="font-card-title-section">
            <h3 class="font-card-name">${fontInfo.name}</h3>
            <div class="font-card-uses">
              ${fontData.use.map(u => `<span class="font-card-use-tag">${u}</span>`).join('')}
            </div>
          </div>
          <p class="font-card-meta">${fontData.origin} · ${fontData.license}</p>
          <div class="font-card-tags">
            ${fontData.tags.map(t => `<span class="font-card-tag">${t}</span>`).join('')}
          </div>
        </div>

        <p class="font-card-description">${fontData.description}</p>

        <div class="scores-section">
          <div class="scores-list">
            ${Object.entries(fontData.scores).map(([key, value]) => `
              <div class="score-bar">
                <span class="score-label">${SCORE_LABELS[key]}</span>
                <div class="score-bar-bg">
                  <div class="score-bar-fill" style="width: ${value}%"></div>
                </div>
                <span class="score-value">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="strength-weakness-section">
          <div>
            <p class="strength-weakness-title">강점</p>
            <ul class="item-list">
              ${fontData.strengths.map(s => `
                <li class="list-item">
                  <span class="list-item-marker">+</span>
                  <span>${s}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <p class="strength-weakness-title">약점</p>
            <ul class="item-list">
              ${fontData.weaknesses.map(w => `
                <li class="list-item">
                  <span class="list-item-marker">−</span>
                  <span>${w}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="verdict-box">
          <strong>종합: </strong>${fontData.verdict}
        </div>
      </div>
    `;

    card.innerHTML = headerHTML + bodyHTML;
    container.appendChild(card);
  });

  // 무게 버튼 이벤트 리스너 추가
  document.querySelectorAll('.weight-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fontKey = e.target.dataset.font;
      const weight = parseInt(e.target.dataset.weight);
      updateFontWeight(fontKey, weight);
    });
  });
}

/**
 * 폰트 굵기 업데이트
 */
function updateFontWeight(fontKey, weight) {
  appState.selectedWeights[fontKey] = weight;
  
  // 활성 버튼 업데이트
  document.querySelectorAll(`.weight-btn[data-font="${fontKey}"]`).forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.weight) === weight) {
      btn.classList.add('active');
    }
  });

  // 샘플 텍스트 재렌더링
  const fontInfo = FONTS[fontKey];
  const card = document.querySelector(`.font-card:has(button[data-font="${fontKey}"])`);
  if (card) {
    const titleEl = card.querySelector('.font-card-sample-title');
    const bodyEl = card.querySelector('.font-card-sample-body');
    const metaEl = card.querySelector('.font-card-sample-meta');
    
    if (titleEl) titleEl.style.fontWeight = weight;
    if (bodyEl) bodyEl.style.fontWeight = Math.min(weight, 500);
    if (metaEl) metaEl.style.fontWeight = weight;
  }
}

/**
 * 비교표 렌더링
 */
function renderScoreTable() {
  const table = document.getElementById('scoreTable');
  table.innerHTML = '';

  // 테이블 헤더
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>평가 항목</th>';
  
  FONT_LIST.forEach(fontKey => {
    const fontName = FONTS[fontKey].name;
    const isRecommended = FONT_DETAILS[fontKey].recommended;
    const tdHTML = isRecommended 
      ? `<th style="color: #c8392b;">${fontName} ★</th>`
      : `<th>${fontName}</th>`;
    headerRow.innerHTML += tdHTML;
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // 테이블 본문
  const tbody = document.createElement('tbody');
  
  Object.entries(SCORE_LABELS).forEach(([key, label], idx) => {
    const row = document.createElement('tr');
    if (idx % 2 === 0) {
      row.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
    }
    
    row.innerHTML = `<td>${label}</td>`;
    
    // 각 폰트별 점수
    FONT_LIST.forEach(fontKey => {
      const score = FONT_DETAILS[fontKey].scores[key];
      
      // 해당 항목에서 최고점인지 확인
      const isHighest = FONT_LIST.every(other =>
        other === fontKey || FONT_DETAILS[other].scores[key] <= score
      );
      
      const tdClass = isHighest ? 'highlight' : '';
      row.innerHTML += `<td class="${tdClass}">${score}</td>`;
    });
    
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // 테이블 푸터 (합계)
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  footerRow.innerHTML = '<td>합계</td>';
  
  FONT_LIST.forEach(fontKey => {
    const total = Object.values(FONT_DETAILS[fontKey].scores)
      .reduce((a, b) => a + b, 0);
    const isRecommended = FONT_DETAILS[fontKey].recommended;
    const tdClass = isRecommended ? 'recommended' : '';
    footerRow.innerHTML += `<td class="${tdClass}">${total}</td>`;
  });
  
  tfoot.appendChild(footerRow);
  table.appendChild(tfoot);
}

/**
 * 비교 미리보기 카드들 렌더링
 */
function renderComparisonPreview() {
  const container = document.getElementById('comparisonPreview');
  container.innerHTML = '';

  const { weight, fontSize, lineHeight, letterSpacing } = appState.sliders;
  const trackingEm = sliderToTrackingEm(letterSpacing);

  FONT_LIST.forEach(fontKey => {
    const fontInfo = FONTS[fontKey];
    const fontColor = getFontColor(fontKey);

    const card = document.createElement('div');
    card.className = 'preview-card';

    card.innerHTML = `
      <div class="preview-card-header">
        <div class="preview-font-badge" style="background-color: ${fontColor}20; color: ${fontColor};">
          ${fontInfo.name}
        </div>
      </div>
      <div class="preview-card-content">
        <div class="preview-sample">
          <p class="preview-sample-title" 
             style="font-family: ${fontInfo.css}; 
                    font-weight: ${weight}; 
                    font-size: ${fontSize}px; 
                    line-height: ${lineHeight};
                    letter-spacing: ${trackingEm}em;">
            ${SAMPLES.sentence}
          </p>
          <p class="preview-sample-body"
             style="font-family: ${fontInfo.css};
                    font-weight: ${Math.min(weight, 500)};
                    line-height: ${lineHeight};
                    letter-spacing: ${trackingEm}em;">
            ${SAMPLES.bodyShort}
          </p>
          <p class="preview-sample-meta"
             style="font-family: ${fontInfo.css};
                    line-height: ${lineHeight};
                    letter-spacing: ${trackingEm}em;">
            ${SAMPLES.alpha}
          </p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* SLIDER EVENT HANDLERS (슬라이더 이벤트)                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function setupSliderListeners() {
  // 굵기 슬라이더
  const weightSlider = document.getElementById('weightSlider');
  const weightValue = document.getElementById('weightValue');
  
  weightSlider.addEventListener('input', (e) => {
    const newWeight = parseInt(e.target.value);
    appState.sliders.weight = newWeight;
    weightValue.textContent = newWeight;
    renderComparisonPreview();
  });

  // 크기 슬라이더
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  
  sizeSlider.addEventListener('input', (e) => {
    const newSize = parseInt(e.target.value);
    appState.sliders.fontSize = newSize;
    sizeValue.textContent = `${newSize}px`;
    renderComparisonPreview();
  });

  // 행간 슬라이더
  const leadingSlider = document.getElementById('leadingSlider');
  const leadingValue = document.getElementById('leadingValue');
  
  leadingSlider.addEventListener('input', (e) => {
    const newLeading = parseFloat(e.target.value);
    appState.sliders.lineHeight = newLeading;
    leadingValue.textContent = newLeading.toFixed(2);
    renderComparisonPreview();
  });

  // 자간 슬라이더
  const trackingSlider = document.getElementById('trackingSlider');
  const trackingValue = document.getElementById('trackingValue');
  
  trackingSlider.addEventListener('input', (e) => {
    const sliderVal = parseInt(e.target.value);
    appState.sliders.letterSpacing = sliderVal;
    const em = sliderToTrackingEm(sliderVal);
    trackingValue.textContent = `${em}em`;
    renderComparisonPreview();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* INITIALIZATION (초기화)                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function init() {
  // 모든 렌더링 함수 호출
  renderFontCards();
  renderScoreTable();
  renderComparisonPreview();
  
  // 슬라이더 이벤트 리스너 설정
  setupSliderListeners();

  console.log('✓ Font comparison tool initialized');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
