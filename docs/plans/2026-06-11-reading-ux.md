# 가독성·학습 UX 개선 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 콜아웃 4종 체계화 + 본문 타이포 정비 + 페이지 내 TOC/진행바로 장문 학습 페이지의 가독성을 끌어올린다.

**Architecture:** 정적 사이트(HTML 38개 + css/style.css 1456줄 + js/main.js 322줄). CSS 토큰([data-theme] 변수) 위에 trend-box 토큰·스타일을 추가하고, 동향성 warning-box를 일괄 재분류한다. main.js의 IIFE에 리딩 레이어(진행바·TOC·표 래퍼) 함수를 추가한다. 테스트 프레임워크가 없으므로 검증은 Playwright 스크린샷(라이트/다크) + 콘솔 오류 0 + grep 카운트로 한다.

**Tech Stack:** Vanilla CSS/JS, Playwright MCP(검증), npm run check:links

**검증 공통 절차** (각 태스크의 "스크린샷 검증"이 의미하는 것):
1. `node server.js` 백그라운드 실행 (port 3000, 이미 떠 있으면 재사용)
2. Playwright로 `http://localhost:3000/module9-1.html` 접속, 1440×900
3. 라이트 → 스크린샷, `localStorage.setItem('theme','dark')` + data-theme 적용 → 스크린샷
4. 콘솔 오류 0 확인

---

### Task 1: trend-box CSS 토큰 + 스타일 추가

**Files:**
- Modify: `css/style.css` — `[data-theme="light"]`(13~58행), `[data-theme="dark"]`(60~105행), `.warning-box` 정의부(432행 부근)

**Step 1: 토큰 추가** — light 블록 `--warning-border` 아래:
```css
  --trend-bg: #eef1fd;
  --trend-border: #5b6ee1;
```
dark 블록 `--warning-border` 아래:
```css
  --trend-bg: rgba(91, 110, 225, 0.16);
  --trend-border: #93a4ff;
```

**Step 2: 스타일 추가** — `.warning-box` 정의 다음에:
```css
.trend-box {
  background: var(--trend-bg);
  border-left: 4px solid var(--trend-border);
  border-radius: var(--radius-sm);
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  line-height: 1.7;
}

/* 콜아웃 공통: 첫 strong 제목 줄을 캡션화 */
.info-box > strong:first-child,
.warning-box > strong:first-child,
.trend-box > strong:first-child {
  display: block;
  font-size: 0.85em;
  letter-spacing: 0.02em;
  margin-bottom: 0.4rem;
  opacity: 0.92;
}

/* 연속 콜아웃 간격 */
.info-box + .info-box, .info-box + .warning-box, .info-box + .trend-box,
.warning-box + .info-box, .warning-box + .warning-box, .warning-box + .trend-box,
.trend-box + .info-box, .trend-box + .warning-box, .trend-box + .trend-box {
  margin-top: 1.5rem;
}
```

**Step 3: 스크린샷 검증** (아직 trend-box 사용처 없음 — 회귀 없는지만 확인)

**Step 4: Commit** — `style(callout): trend-box 토큰·스타일 신설 + 콜아웃 캡션/간격 공통화`

### Task 2: 동향성 warning-box → trend-box 재분류

**Files:** Modify: 루트 `*.html` (대상 자동 탐지)

**Step 1: 대상 파악** — `grep -ln 'warning-box' *.html`, 각 파일에서 `📌` 동향/주요 변화/업데이트 패턴 확인:
```bash
grep -c 'class="warning-box"' *.html
grep -n 'warning-box">\s*$' module9-1.html  # 구조 확인용
```

**Step 2: 치환** — "warning-box 시작 태그 + 다음 줄 strong에 📌" 패턴만 trend-box로 변경하는 perl 멀티라인 치환:
```bash
perl -0pi -e 's/class="warning-box">(\s*\n\s*<strong>📌)/class="trend-box">$1/g' *.html
```

**Step 3: 수기 검수** — 치환 후 잔여 warning-box 목록을 열어 "진짜 경고"(EOL 마감·보안·비용 함정·면책)만 남았는지 확인. 동향인데 📌 없는 박스는 수동 전환, 경고인데 📌 달린 박스는 warning 복원.

**Step 4: 스크린샷 검증** — module9-1(동향 박스 다수)·module8-1 라이트/다크. 노란 박스가 진짜 경고에만 남았는지 확인.

**Step 5: Commit** — `refactor(callout): 동향성 warning-box를 trend-box로 재분류 (N개 파일)`

### Task 3: info-box 인라인 스타일 변형 흡수

**Files:** Modify: `css/style.css`, 인라인 `style="border-left..."` 쓰는 HTML

**Step 1: 변형 파악**: `grep -n 'info-box" style=\|info-box" style' *.html | head -30`

**Step 2: CSS 클래스 추가**:
```css
.info-box.success { border-left-color: var(--accent-2); }
.info-box.accent  { border-left-color: var(--accent-3); }
```

**Step 3: HTML 치환** — `class="info-box" style="border-left:4px solid #4caf50;..."` → `class="info-box success"` (색상별 매핑, margin 등 다른 인라인 속성은 유지 필요 시 보존)

**Step 4: 스크린샷 검증 + Commit** — `refactor(callout): info-box 인라인 변형을 클래스로 흡수`

### Task 4: 본문 타이포그래피

**Files:** Modify: `css/style.css` — `.module`(372행 부근), `.module h3`(376), `.module h4`(386)

**Step 1: 측정폭·행간** :
```css
.module p, .module li { max-width: 72ch; }
.module { line-height: 1.75; }
.module li { margin-bottom: 0.35rem; }
```
(표·다이어그램·코드는 max-width 없음 — 셀렉터가 p/li 한정이므로 자동 충족. 콜아웃 내부 p/li도 포함되나 콜아웃 폭 자체가 본문 폭이라 무해.)

**Step 2: 위계 강화**:
```css
.module h3 { /* 기존 속성 유지하며 */ padding-bottom: 0.45rem; border-bottom: 2px solid var(--border); margin-top: 3rem; }
.module h4 { margin-top: 2.2rem; font-size: 1.08rem; }
```
기존 정의와 충돌 시 기존 블록을 직접 수정(중복 선언 금지).

**Step 3: 스크린샷 검증** (module9-1 본문 밀도) **+ Commit** — `style(typography): 본문 측정폭 72ch·행간 1.75·h3/h4 위계 강화`

### Task 5: 표 가독성

**Files:** Modify: `css/style.css`(.comparison-table 443행~), `js/main.js`(표 래퍼)

**Step 1: CSS**:
```css
.table-scroll { overflow-x: auto; margin: 1.25rem 0; }
.table-scroll .comparison-table { margin: 0; min-width: 640px; }
.comparison-table thead th { position: sticky; top: 0; z-index: 2; }
```
(지브라는 481행에 이미 있음 — 유지)

**Step 2: JS** — main.js IIFE 내부에 추가 후 호출:
```js
function wrapTables() {
  document.querySelectorAll('.module .comparison-table').forEach(function (t) {
    if (t.parentElement.classList.contains('table-scroll')) return;
    var w = document.createElement('div');
    w.className = 'table-scroll';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
}
```

**Step 3: 검증** — 뷰포트 900px로 줄여 module8-1 표가 가로 스크롤되는지, 스티키 헤더 동작 확인. **Commit** — `feat(table): 가로 스크롤 래퍼 + 스티키 헤더`

### Task 6: 읽기 진행바

**Files:** Modify: `js/main.js`, `css/style.css`

**Step 1: CSS**:
```css
#read-progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; background: var(--link); z-index: 1200; transition: width 0.08s linear; }
```

**Step 2: JS** (홈 제외 — `.home-hero` 존재 시 스킵):
```js
function initReadProgress() {
  if (document.querySelector('.home-hero')) return;
  var bar = document.createElement('div');
  bar.id = 'read-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }, { passive: true });
}
```

**Step 3: 검증 + Commit** — `feat(reading): 상단 읽기 진행바`

### Task 7: 페이지 내 TOC (스크롤 스파이)

**Files:** Modify: `js/main.js`, `css/style.css`

**Step 1: JS** — `#content` 안의 h3(id 있는 섹션 헤더) 수집 → ≥1280px에서 우측 플로팅 `<nav id="page-toc">`, 미만이면 본문 첫 h3 앞에 `<details>` 접이식. IntersectionObserver로 현재 섹션 `.active` 표시. h3에 id가 없으면 텍스트 기반 slug 부여.
```js
function initPageToc() {
  if (document.querySelector('.home-hero')) return;
  var heads = Array.prototype.slice.call(document.querySelectorAll('#content .module h3'));
  if (heads.length < 3) return;
  heads.forEach(function (h, i) { if (!h.id) h.id = 'toc-h' + i; });
  var nav = document.createElement('nav');
  nav.id = 'page-toc';
  nav.innerHTML = '<p class="toc-title">이 페이지</p>' + heads.map(function (h) {
    return '<a href="#' + h.id + '">' + h.textContent.replace(/</g, '&lt;') + '</a>';
  }).join('');
  document.body.appendChild(nav);
  var links = nav.querySelectorAll('a');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
    });
  }, { rootMargin: '-10% 0 -75% 0' });
  heads.forEach(function (h) { io.observe(h); });
}
```

**Step 2: CSS** — 1280px 미만에서 숨김(접이식은 YAGNI — 플로팅만, 좁은 화면은 기존 사이드바 목차로 충분하면 details 생략 가능. 구현 중 판단해 단순한 쪽 선택):
```css
#page-toc { position: fixed; top: 96px; right: 24px; width: 220px; max-height: 70vh; overflow-y: auto; font-size: 0.82rem; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--card-shadow); }
#page-toc .toc-title { font-weight: 700; font-size: 0.78rem; color: var(--text-secondary); margin: 0 0 0.5rem; }
#page-toc a { display: block; padding: 0.22rem 0; color: var(--text-secondary); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#page-toc a.active { color: var(--link); font-weight: 600; }
@media (max-width: 1535px) { #page-toc { display: none; } }
```
주의: 본문 max-width 960 + 사이드바 280 구조에서 우측 여백이 충분한 뷰포트(≥1536px)에서만 표시. 1440 스크린샷에서는 안 보이는 게 정상이므로 검증은 1680px 뷰포트로.

**Step 3: 검증** — 1680×1000 뷰포트에서 TOC 표시·스파이 동작, 1280px에서 숨김. **Commit** — `feat(reading): 페이지 내 TOC + 스크롤 스파이`

### Task 8: 종합 검증 & 마무리

1. 라이트/다크 × index/module9-1/module8-1 풀 스크린샷 — 콜아웃 색·타이포·진행바·TOC 확인
2. 콘솔 오류 0 (`browser_console_messages`)
3. `npm run check:links` 통과
4. 잔여 검증 grep: `grep -c 'trend-box' *.html`(재분류 수), `grep -c 'warning-box' *.html`(경고만 잔존)
5. 설계 문서와 결과 대조 후 필요 시 changelog에 한 줄 추가
6. 최종 커밋(잔여 변경) — `docs: 가독성 개선 결과 changelog 반영`
