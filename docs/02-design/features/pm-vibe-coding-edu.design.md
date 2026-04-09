# PM 바이브 코딩 교육자료 Design Document

> **Created**: 2026-04-09
> **Architecture**: Option B — 완전 분리 (모듈별 HTML)
> **Level**: Starter

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | PM/비개발자의 AI 활용 바이브 코딩 교육자료 부재 |
| **WHO** | PM, 기획자, 비개발 직군 (AI 코딩 입문자) |
| **RISK** | 콘텐츠 범위가 넓어 깊이가 부족해질 수 있음 |
| **SUCCESS** | 5개 교육 모듈 완성, 목차 네비게이션 동작, 각 섹션 독립 학습 가능 |
| **SCOPE** | 모듈별 분리된 HTML + CSS + JS 정적 사이트 |

---

## 1. Overview

### 1.1 Goal

PM/비개발자 대상 AI 바이브 코딩 교육자료를 모듈별 HTML 파일로 분리하여 제작한다.
메인 셸(index.html)이 목차 네비게이션을 제공하고, 각 모듈 콘텐츠를 동적으로 로딩한다.

### 1.2 Architecture Decision

**선택: Option B — 완전 분리**

| 기준 | 결정 | 이유 |
|------|------|------|
| 구조 | 모듈별 HTML 분리 | 각 모듈 독립 관리, 협업 용이 |
| CORS 해결 | 로컬 서버 사용 (Live Server / npx serve) | file:// CORS 문제 우회 |
| 콘텐츠 로딩 | fetch API + innerHTML | 단순하고 직관적 |
| 폴백 | 로딩 실패 시 에러 메시지 표시 | 사용자 경험 보호 |

---

## 2. How It Works

```
사용자가 목차 클릭
  → JS가 해당 모듈 HTML fetch
  → 메인 콘텐츠 영역에 렌더링
  → URL hash 업데이트 (#module1)
  → 목차에서 현재 섹션 하이라이트
  → Prism.js/Mermaid.js 재초기화
```

### 2.1 페이지 흐름

```
┌─ index.html ──────────────────────────────────────┐
│                                                    │
│  ┌─ nav (사이드바) ──┐  ┌─ main (콘텐츠) ────────┐ │
│  │                   │  │                        │ │
│  │ ☰ PM 바이브코딩   │  │  [모듈 콘텐츠 영역]     │ │
│  │                   │  │                        │ │
│  │ 1. AI 기초 개념   │  │  fetch()로 동적 로딩    │ │
│  │   1.1 AI와 LLM   │  │                        │ │
│  │   1.2 동작 원리   │  │  modules/module1.html  │ │
│  │   1.3 프롬프트    │  │  modules/module2.html  │ │
│  │                   │  │  modules/module3.html  │ │
│  │ 2. 문서 작성      │  │  modules/module4.html  │ │
│  │ 3. 도식화         │  │  modules/module5.html  │ │
│  │ 4. 자료 조사      │  │                        │ │
│  │ 5. 바이브 코딩    │  │                        │ │
│  │                   │  │                        │ │
│  │ [🌙 다크모드]     │  │                        │ │
│  └───────────────────┘  └────────────────────────┘ │
│                                                    │
│  ┌─ footer ──────────────────────────────────────┐ │
│  │  © 2026 PM 바이브 코딩 교육자료                 │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### 2.2 모바일 레이아웃

```
┌─ 모바일 (<768px) ──────────┐
│  ┌─ header ──────────────┐ │
│  │ ☰ 메뉴  PM 바이브코딩  │ │
│  └───────────────────────┘ │
│                            │
│  ┌─ 사이드바 (오버레이) ──┐ │
│  │ (☰ 클릭 시 슬라이드)   │ │
│  └───────────────────────┘ │
│                            │
│  ┌─ main ────────────────┐ │
│  │  [모듈 콘텐츠]         │ │
│  │  (전체 너비 사용)      │ │
│  └───────────────────────┘ │
└────────────────────────────┘
```

---

## 3. What We Need to Build

### 3.1 File Structure

```
projectPmEdu/
├── index.html                 ← 메인 셸 (네비게이션 + 콘텐츠 로더)
├── css/
│   └── style.css              ← 전체 스타일 (레이아웃, 타이포, 다크모드)
├── js/
│   └── main.js                ← 모듈 로딩, 목차 동작, 다크모드, 스크롤
├── modules/
│   ├── module1.html           ← AI 기초 개념
│   ├── module2.html           ← AI 활용 문서 작성
│   ├── module3.html           ← AI 도식화 활용
│   ├── module4.html           ← AI 자료 조사 활용
│   └── module5.html           ← 바이브 코딩 실습
├── assets/
│   └── images/                ← 교육용 이미지/스크린샷
└── docs/                      ← PDCA 문서
```

### 3.2 Files Detail

| File | Purpose | Est. Lines |
|------|---------|:----------:|
| `index.html` | 메인 셸: 사이드바 목차 + 콘텐츠 영역 + CDN 로드 | ~120 |
| `css/style.css` | 레이아웃, 타이포그래피, 사이드바, 반응형, 다크모드 | ~350 |
| `js/main.js` | 모듈 로딩(fetch), 목차 토글, 다크모드, 스크롤 하이라이트 | ~150 |
| `modules/module1.html` | AI 기초 개념 콘텐츠 (fragment, body 없음) | ~200 |
| `modules/module2.html` | AI 문서 작성 콘텐츠 | ~200 |
| `modules/module3.html` | AI 도식화 콘텐츠 + Mermaid 다이어그램 | ~250 |
| `modules/module4.html` | AI 자료 조사 콘텐츠 | ~200 |
| `modules/module5.html` | 바이브 코딩 실습 콘텐츠 + 코드 예시 | ~250 |

**Total: ~1,720 lines (8 files)**

---

## 4. Technical Design

### 4.1 CDN Dependencies

| Library | Version | Purpose | Size |
|---------|---------|---------|------|
| Prism.js | latest | 코드 블록 syntax highlighting | ~15KB |
| Mermaid.js | latest | 다이어그램 렌더링 | ~180KB (lazy load) |
| Lucide Icons | latest | UI 아이콘 (메뉴, 다크모드 등) | ~5KB (개별 로드) |

### 4.2 index.html 구조

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PM 바이브 코딩 교육자료</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="[prism-css-cdn]">
</head>
<body>
  <!-- 사이드바 -->
  <nav id="sidebar">
    <div class="sidebar-header">
      <h1>PM 바이브 코딩</h1>
      <button id="theme-toggle" aria-label="테마 전환">🌙</button>
    </div>
    <ul class="nav-list">
      <li data-module="module1">
        <span class="nav-title">1. AI 기초 개념</span>
        <ul class="nav-sub">
          <li><a href="#s1-1">1.1 AI와 LLM이란?</a></li>
          <li><a href="#s1-2">1.2 생성형 AI의 동작 원리</a></li>
          <!-- ... -->
        </ul>
      </li>
      <!-- module2~5 동일 구조 -->
    </ul>
  </nav>

  <!-- 모바일 메뉴 버튼 -->
  <button id="menu-toggle" aria-label="메뉴 열기">☰</button>

  <!-- 메인 콘텐츠 -->
  <main id="content">
    <div id="module-container">
      <!-- fetch로 모듈 HTML이 여기에 삽입됨 -->
    </div>
  </main>

  <!-- CDN Scripts -->
  <script src="[prism-js-cdn]"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### 4.3 main.js 핵심 로직

```javascript
// 모듈 로딩 함수
async function loadModule(moduleName) {
  const container = document.getElementById('module-container');
  try {
    const response = await fetch(`modules/${moduleName}.html`);
    if (!response.ok) throw new Error('모듈 로딩 실패');
    container.innerHTML = await response.text();

    // Prism.js 재초기화 (코드 하이라이팅)
    Prism.highlightAll();

    // Mermaid.js 재초기화 (다이어그램)
    if (typeof mermaid !== 'undefined') {
      mermaid.run();
    }

    // 현재 모듈 하이라이트
    updateActiveNav(moduleName);

    // URL hash 업데이트
    history.pushState(null, '', `#${moduleName}`);
  } catch (error) {
    container.innerHTML = `
      <div class="error-message">
        <p>콘텐츠를 불러올 수 없습니다.</p>
        <p>로컬 서버를 사용해주세요: <code>npx serve</code></p>
      </div>`;
  }
}

// 다크모드 토글
function toggleTheme() { /* ... */ }

// 모바일 메뉴 토글
function toggleSidebar() { /* ... */ }

// 스크롤 기반 섹션 하이라이트
function handleScroll() { /* IntersectionObserver 활용 */ }

// 초기화: URL hash 확인 → 해당 모듈 로드 (기본: module1)
function init() {
  const hash = location.hash.slice(1) || 'module1';
  loadModule(hash);
}
```

### 4.4 modules/moduleN.html 구조 (fragment)

```html
<!-- modules/module1.html -->
<article class="module" id="module1">
  <h2>1. AI 기초 개념</h2>

  <section id="s1-1">
    <h3>1.1 AI와 LLM이란?</h3>
    <p>설명 텍스트...</p>
    <div class="info-box">
      <strong>핵심 개념</strong>: ...
    </div>
  </section>

  <section id="s1-2">
    <h3>1.2 생성형 AI의 동작 원리</h3>
    <p>설명 텍스트...</p>
    <pre><code class="language-text">
    프롬프트 입력 → 토큰화 → 모델 추론 → 텍스트 생성
    </code></pre>
  </section>

  <!-- 나머지 섹션... -->
</article>
```

### 4.5 CSS 핵심 설계

```css
/* 레이아웃: 사이드바 + 메인 */
body { display: flex; min-height: 100vh; }
#sidebar { width: 280px; position: fixed; height: 100vh; overflow-y: auto; }
#content { margin-left: 280px; flex: 1; padding: 2rem; max-width: 900px; }

/* 다크모드 */
[data-theme="dark"] { --bg: #1a1a2e; --text: #e0e0e0; --sidebar-bg: #16213e; }
[data-theme="light"] { --bg: #ffffff; --text: #333333; --sidebar-bg: #f8f9fa; }

/* 반응형: 모바일 */
@media (max-width: 768px) {
  #sidebar { transform: translateX(-100%); transition: transform 0.3s; z-index: 100; }
  #sidebar.open { transform: translateX(0); }
  #content { margin-left: 0; }
  #menu-toggle { display: block; }
}

/* 콘텐츠 스타일 */
.info-box { background: var(--info-bg); border-left: 4px solid #4a9eff; padding: 1rem; }
.warning-box { border-left-color: #ff9800; }
.code-example { background: var(--code-bg); border-radius: 8px; }
```

---

## 5. Component Design

### 5.1 콘텐츠 컴포넌트 (재사용 CSS 클래스)

| 클래스 | 용도 | 사용 모듈 |
|--------|------|-----------|
| `.info-box` | 핵심 개념/팁 강조 박스 | 전체 |
| `.warning-box` | 주의사항 박스 | 모듈 1, 5 |
| `.step-list` | 단계별 순서 리스트 | 모듈 2, 3, 4, 5 |
| `.comparison-table` | 도구 비교 테이블 | 모듈 1, 3 |
| `.prompt-example` | 프롬프트 예시 블록 | 전체 |
| `.diagram-container` | Mermaid 다이어그램 영역 | 모듈 3 |
| `.practice-section` | 실습 과제 영역 | 모듈 2, 4, 5 |

### 5.2 네비게이션 상태

| 상태 | CSS 클래스 | 설명 |
|------|-----------|------|
| 기본 | `.nav-item` | 일반 목차 항목 |
| 활성 모듈 | `.nav-item.active` | 현재 열린 모듈 하이라이트 |
| 활성 섹션 | `.nav-sub a.current` | 스크롤 위치 기반 현재 섹션 |
| 펼침/접힘 | `.nav-item.expanded` | 하위 목차 표시/숨김 |

---

## 6. CORS 해결 전략

| 방법 | 명령어 | 설명 |
|------|--------|------|
| **npx serve** (권장) | `npx serve .` | Node.js 설치 시 즉시 사용 |
| VS Code Live Server | 확장 설치 → Go Live | VS Code 사용 시 편리 |
| Python 서버 | `python -m http.server 3000` | Python 설치 시 사용 |

> README에 서버 실행 방법을 안내하여 사용자가 쉽게 따라할 수 있도록 함

---

## 7. Mermaid.js 통합 (모듈 3 전용)

```html
<!-- Mermaid는 모듈 3 로딩 시에만 CDN 로드 (lazy) -->
<div class="mermaid">
graph TD
    A[사용자 요구] --> B[AI 프롬프트 작성]
    B --> C[다이어그램 코드 생성]
    C --> D[Mermaid 렌더링]
    D --> E[수정/반복]
</div>
```

- `loadModule('module3')` 호출 시 Mermaid CDN 스크립트 동적 삽입
- 다른 모듈에서는 로딩하지 않아 성능 최적화

---

## 8. 다크모드 설계

```
사용자 클릭 (🌙/☀️)
  → data-theme 속성 토글 (light ↔ dark)
  → localStorage에 저장
  → 다음 방문 시 자동 적용
  → CSS 변수로 전체 색상 전환
```

| 요소 | Light | Dark |
|------|-------|------|
| 배경 | `#ffffff` | `#1a1a2e` |
| 텍스트 | `#333333` | `#e0e0e0` |
| 사이드바 | `#f8f9fa` | `#16213e` |
| 코드 블록 | `#f5f5f5` | `#0d1117` |
| 강조 박스 | `#e8f4fd` | `#1a3a5c` |
| 링크 | `#4a9eff` | `#64b5f6` |

---

## 9. Accessibility

- 시맨틱 HTML5 태그 (`nav`, `main`, `article`, `section`)
- `aria-label` 버튼에 적용 (메뉴 토글, 테마 전환)
- 키보드 네비게이션: Tab으로 목차 이동, Enter로 선택
- 충분한 색상 대비 (WCAG AA 기준)
- `prefers-reduced-motion` 미디어 쿼리 적용

---

## 10. Completion Checklist

- [ ] index.html 메인 셸 구현
- [ ] css/style.css 전체 스타일 구현
- [ ] js/main.js 인터랙션 구현
- [ ] modules/module1.html — AI 기초 개념
- [ ] modules/module2.html — AI 문서 작성
- [ ] modules/module3.html — AI 도식화
- [ ] modules/module4.html — AI 자료 조사
- [ ] modules/module5.html — 바이브 코딩 실습
- [ ] 반응형 디자인 (모바일 대응)
- [ ] 다크모드 동작 확인
- [ ] 브라우저 테스트 (Chrome, Edge, Safari)

---

## 11. Implementation Guide

### 11.1 Implementation Order

```
Phase 1: 셸 구조 (index.html + style.css + main.js 기본)
  → 사이드바 목차 + 콘텐츠 영역 + 모듈 로딩 로직
Phase 2: 스타일링 (style.css 완성)
  → 레이아웃, 타이포, 반응형, 다크모드
Phase 3: 콘텐츠 모듈 (module1~5.html)
  → 각 모듈 교육 콘텐츠 작성
Phase 4: 인터랙션 고도화 (main.js 완성)
  → 스크롤 하이라이트, Mermaid lazy load, 모바일 메뉴
```

### 11.2 Dependencies

```bash
# 로컬 서버 실행 (개발 시)
npx serve .
# 또는
python -m http.server 3000
```

CDN만 사용하므로 npm install 불필요.

### 11.3 Session Guide

| Session | Module | Scope Key | Files | Est. |
|---------|--------|-----------|-------|------|
| Session 1 | 셸 + 기본 스타일 | `shell` | index.html, css/style.css, js/main.js | 기본 구조 |
| Session 2 | 모듈 1-2 콘텐츠 | `content-1` | modules/module1.html, module2.html | 콘텐츠 작성 |
| Session 3 | 모듈 3-4 콘텐츠 | `content-2` | modules/module3.html, module4.html | 콘텐츠 + Mermaid |
| Session 4 | 모듈 5 + 마무리 | `content-3` | modules/module5.html, 전체 점검 | 콘텐츠 + QA |

```
/pdca do pm-vibe-coding-edu                        # 전체 구현
/pdca do pm-vibe-coding-edu --scope shell          # Session 1만
/pdca do pm-vibe-coding-edu --scope content-1      # Session 2만
/pdca do pm-vibe-coding-edu --scope content-2      # Session 3만
/pdca do pm-vibe-coding-edu --scope content-3      # Session 4만
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-09 | Initial design — Option B selected | totom |
