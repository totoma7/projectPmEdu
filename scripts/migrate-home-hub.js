#!/usr/bin/env node
/*
 * Migrate to home-hub layout + prev/next navigation.
 *
 * What it does:
 *   1. Copies current index.html → module1-1.html (preserves the 1.1~1.5 content)
 *   2. Patches sidebar URLs in every module HTML: index.html → module1-1.html (only the 모듈1 link)
 *   3. Patches js/search-data.js the same way (1.1~1.5 entries)
 *   4. Inserts a <nav class="prev-next"> block before </main> in every module HTML
 *   5. Writes a brand-new index.html that is a home hub (10 module cards + role paths + resources)
 *   6. Appends new component styles to css/style.css
 *
 * Idempotent: safe to re-run; checks for existing artifacts before overwriting.
 *
 * Run: node scripts/migrate-home-hub.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const MODULE_ORDER = [
  'module1-1.html',
  'module1-2.html',
  'module6-1.html', 'module6-2.html', 'module6-3.html',
  'module2-1.html', 'module2-2.html',
  'module3.html',
  'module4-1.html', 'module4-2.html',
  'module5-1.html', 'module5-2.html', 'module5-3.html', 'module5-4.html', 'module5-5.html',
  'module7-1.html', 'module7-2.html',
  'module8-1.html', 'module8-2.html',
  'module9-1.html', 'module9-2.html',
  'module10-1.html', 'module10-2.html',
];

const HOME_CARDS = [
  { href: 'module1-1.html', n: 1, title: 'AI 기초 개념', desc: 'AI/LLM 개념, 프롬프트 엔지니어링, RAG, 에이전트, 멀티모달까지', tag: '필수' },
  { href: 'module2-1.html', n: 2, title: 'AI 활용 문서 작성', desc: 'PRD·기획서·요구사항·회의록 자동화 + 프롬프트 템플릿', tag: 'PM' },
  { href: 'module3.html',   n: 3, title: 'AI 도식화 활용',   desc: '플로우차트·아키텍처·ER·시퀀스·여정맵 — Mermaid/draw.io', tag: '도식' },
  { href: 'module4-1.html', n: 4, title: 'AI 자료 조사 활용', desc: '시장조사·경쟁사·페르소나·인터뷰·A/B 테스트', tag: 'PM' },
  { href: 'module5-1.html', n: 5, title: '바이브 코딩 실습',   desc: 'Claude Code·MCP·DevOps·테스팅·API 설계 — 16개 섹션', tag: '개발' },
  { href: 'module6-1.html', n: 6, title: 'PM vs PL 역할 이해', desc: '역할 비교·일정관리·리스크·팀리딩·거버넌스·애자일', tag: 'PL' },
  { href: 'module7-1.html', n: 7, title: 'AI 실전 케이스 스터디', desc: 'SaaS MVP·레거시 마이그레이션·국내 도입 사례', tag: '실전' },
  { href: 'module8-1.html', n: 8, title: 'AI 도구 비용/ROI 관리', desc: '요금제·토큰 비용·ROI·예산·도구 선정 매트릭스', tag: '경영' },
  { href: 'module9-1.html', n: 9, title: 'AI 코딩 도구 & 보안', desc: 'Cursor/Copilot/Windsurf 비교 + 프롬프트 인젝션·GDPR', tag: '보안' },
  { href: 'module10-1.html', n: 10, title: 'No-Code & 2026 트렌드', desc: '컨텍스트 엔지니어링·추론 모델·하네스 엔지니어링', tag: '트렌드' },
];

const RESOURCE_LINKS = [
  ['resource_ai-regulations-kr.html', '한국 AI 규제 가이드'],
  ['resource_glossary.html',          'AI 용어 사전'],
  ['resource_prompt-patterns.html',   '프롬프트 패턴'],
  ['resource_agent-patterns.html',    '에이전트 패턴'],
  ['resource_llm-eval.html',          'LLM 평가 방법'],
  ['resource_opus-1m-context.html',   'Opus 1M 컨텍스트'],
  ['resource_on-device-llm.html',     '온디바이스 LLM'],
  ['resource_mcp-server-dev.html',    'MCP 서버 개발'],
  ['resource_kr-case-studies.html',   '국내 케이스 스터디'],
  ['resource_checklist.html',         '실무 체크리스트'],
  ['resource_changelog.html',         '변경 이력'],
  ['resource_roadmap.html',           '로드맵'],
  ['ai-engineering-evolution.html',   'AI 엔지니어링 4년간의 진화'],
];

const r = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const w = (rel, content) => fs.writeFileSync(path.join(ROOT, rel), content, 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

// ---------------------------------------------------------------------------
// Step 1: Snapshot current index.html → module1-1.html
// ---------------------------------------------------------------------------
const oldIndex = r('index.html');
const looksLikeOldIndex = /AI 기초 개념 \(상\)/.test(oldIndex) && /id="s1-1"/.test(oldIndex);

if (!exists('module1-1.html')) {
  if (!looksLikeOldIndex) {
    console.error('  ! index.html does not look like the old module 1-1 page. Aborting to avoid data loss.');
    console.error('    (Expected to find "AI 기초 개념 (상)" and id="s1-1" in index.html)');
    process.exit(1);
  }
  w('module1-1.html', oldIndex);
  console.log('  + Created module1-1.html from old index.html');
} else {
  console.log('  = module1-1.html already exists, leaving it alone');
}

// ---------------------------------------------------------------------------
// Step 2: Build pretty-title map by extracting <title> from each module
// ---------------------------------------------------------------------------
const TITLE_MAP = {};
for (const f of MODULE_ORDER) {
  if (!exists(f)) continue;
  const m = r(f).match(/<title>([^<]+)<\/title>/);
  if (m) {
    TITLE_MAP[f] = m[1].replace(/\s*-\s*2026 AI 실무 플레이북\s*$/, '').trim();
  }
}

// ---------------------------------------------------------------------------
// Step 3: Patch each module HTML — sidebar URLs + insert prev/next nav
// ---------------------------------------------------------------------------
function buildPrevNext(idx) {
  const prev = idx > 0 ? MODULE_ORDER[idx - 1] : null;
  const next = idx < MODULE_ORDER.length - 1 ? MODULE_ORDER[idx + 1] : null;
  const lines = [];
  lines.push('    <nav class="prev-next" aria-label="이전/다음 모듈">');
  if (prev) {
    lines.push(`      <a class="prev-next-link prev" href="${prev}">`);
    lines.push(`        <span class="prev-next-label">← 이전</span>`);
    lines.push(`        <span class="prev-next-title">${TITLE_MAP[prev] || prev}</span>`);
    lines.push(`      </a>`);
  } else {
    lines.push(`      <span class="prev-next-link prev disabled"><span class="prev-next-label">처음</span></span>`);
  }
  lines.push(`      <a class="prev-next-link home" href="index.html"><span class="prev-next-label">홈</span></a>`);
  if (next) {
    lines.push(`      <a class="prev-next-link next" href="${next}">`);
    lines.push(`        <span class="prev-next-label">다음 →</span>`);
    lines.push(`        <span class="prev-next-title">${TITLE_MAP[next] || next}</span>`);
    lines.push(`      </a>`);
  } else {
    lines.push(`      <span class="prev-next-link next disabled"><span class="prev-next-label">마지막</span></span>`);
  }
  lines.push('    </nav>');
  return '\n' + lines.join('\n') + '\n  ';
}

let patched = 0;
MODULE_ORDER.forEach((file, idx) => {
  if (!exists(file)) {
    console.log(`  ! Missing ${file}, skipping`);
    return;
  }
  const original = r(file);
  let html = original;

  // Patch sidebar 모듈1 link variants
  html = html.replace(/href="index\.html(#s1-[1-5])"/g, 'href="module1-1.html$1"');
  html = html.replace(/href="index\.html"(\s+class="nav-title")/g, 'href="module1-1.html"$1');

  // Insert prev/next before </main> if not already there
  if (!html.includes('class="prev-next"')) {
    const block = buildPrevNext(idx);
    // Replace the first </main> we encounter
    html = html.replace(/(\n\s*)<\/main>/, block + '</main>');
  }

  if (html !== original) {
    w(file, html);
    patched++;
  }
});
console.log(`  + Patched ${patched} module pages (sidebar + prev/next)`);

// ---------------------------------------------------------------------------
// Step 4: Patch js/search-data.js (1.1~1.5 url paths)
// ---------------------------------------------------------------------------
const sdPath = 'js/search-data.js';
const sdOrig = r(sdPath);
const sdNew = sdOrig.replace(/url:"index\.html(#s1-[1-5])"/g, 'url:"module1-1.html$1"');
if (sdNew !== sdOrig) {
  w(sdPath, sdNew);
  console.log('  + Patched js/search-data.js');
} else {
  console.log('  = js/search-data.js already patched');
}

// ---------------------------------------------------------------------------
// Step 5: Build new home-hub index.html (using module1-2.html as boilerplate template)
// ---------------------------------------------------------------------------
const tplHtml = r('module1-2.html');

// 5a. Capture the head block (everything up to and including </head>)
const headMatch = tplHtml.match(/^[\s\S]*?<\/head>/);
let head = headMatch[0];
head = head
  .replace(/<title>[^<]*<\/title>/, '<title>2026 AI 실무 플레이북 — PM·PL·개발자를 위한 한국 기준 실무서</title>')
  .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="2026 AI 실무 플레이북 — PM·PL·개발자를 위한 한국 기준 AI 실무 교육자료. 10개 모듈, 60+ 섹션, 12개 심화 리소스. 한국 AI 규제(2026-04-17 갱신) 반영.">');

// 5b. Capture sidebar block; strip "active" so no module is highlighted on home
const sidebarMatch = tplHtml.match(/<nav id="sidebar"[\s\S]*?<\/nav>/);
if (!sidebarMatch) {
  console.error('  ! Could not extract sidebar from template. Aborting index.html generation.');
  process.exit(1);
}
let sidebar = sidebarMatch[0]
  .replace(/class="nav-item active"/g, 'class="nav-item"')
  .replace(/href="index\.html(#s1-[1-5])?"/g, (m, anchor) => `href="module1-1.html${anchor || ''}"`);

// 5c. Capture footer (after </main>)
const footerMatch = tplHtml.match(/<\/main>([\s\S]*)$/);
const footer = footerMatch ? footerMatch[1] : '\n</body>\n</html>\n';

// 5d. Build new <main> content
const cardsHtml = HOME_CARDS.map(c => `        <a class="module-card" href="${c.href}">
          <div class="module-card-num">${c.n}</div>
          <div class="module-card-body">
            <span class="module-card-tag">${c.tag}</span>
            <h3 class="module-card-title">${c.title}</h3>
            <p class="module-card-desc">${c.desc}</p>
          </div>
        </a>`).join('\n');

const resourceHtml = RESOURCE_LINKS.map(([href, label]) =>
  `        <li><a href="${href}">${label}</a></li>`).join('\n');

const newMain = `  <main id="content">
    <header class="home-hero">
      <h1>2026 AI 실무 플레이북</h1>
      <p class="home-lede">PM·PL·개발자를 위한 한국 기준 AI 실무 교육자료. 10개 모듈, 60+ 섹션.</p>
      <p class="home-meta">최근 갱신: 2026-04-22 · 한국 AI 기본법(2026-01-22 시행) 반영</p>
    </header>

    <section class="home-section">
      <h2>역할별 추천 학습 경로</h2>
      <table class="role-paths">
        <thead>
          <tr><th>역할</th><th>추천 순서</th><th>핵심 모듈</th></tr>
        </thead>
        <tbody>
          <tr><td>개발자</td><td>5 → 9 → 10 → 1</td><td>바이브 코딩 · AI 코딩 도구 &amp; 보안 · 2026 트렌드</td></tr>
          <tr><td>PM/기획자</td><td>1 → 2 → 4 → 6 → 7</td><td>AI 기초 · 문서 작성 · 자료 조사 · PM vs PL</td></tr>
          <tr><td>PL/리더</td><td>6 → 8 → 7 → 9</td><td>PM vs PL · 비용/ROI · 케이스 스터디 · 코딩 도구</td></tr>
        </tbody>
      </table>
    </section>

    <section class="home-section">
      <h2>전체 모듈</h2>
      <div class="module-grid">
${cardsHtml}
      </div>
    </section>

    <section class="home-section">
      <h2>참고자료 모음</h2>
      <ul class="resource-list">
${resourceHtml}
      </ul>
    </section>
  </main>`;

const newIndex = `${head}
<body>
  <button id="menu-toggle" aria-label="메뉴 열기">
    <span class="hamburger"></span>
  </button>

  <div id="sidebar-overlay"></div>

  ${sidebar}

${newMain}
${footer.replace(/^\s*/, '')}`;

w('index.html', newIndex);
console.log('  + Wrote new index.html (home hub)');

// ---------------------------------------------------------------------------
// Step 6: Append home-hub & prev/next CSS components
// ---------------------------------------------------------------------------
const CSS_MARK = '/* === Home hub & module navigation (migrate-home-hub.js) ===';
const CSS_APPEND = `

${CSS_MARK} */
.home-hero {
  margin: 0 0 2rem 0;
  padding: 2.5rem 0 1.5rem 0;
  border-bottom: 1px solid var(--border);
}
.home-hero h1 {
  font-size: 2.2rem;
  margin: 0 0 0.4rem 0;
  letter-spacing: -0.02em;
}
.home-lede {
  margin: 0 0 0.4rem 0;
  font-size: 1.05rem;
  color: var(--text-secondary);
}
.home-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  opacity: 0.85;
}
.home-section { margin: 2.5rem 0; }
.home-section h2 { margin: 0 0 1rem 0; }

.role-paths {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}
.role-paths th, .role-paths td {
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
.role-paths th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin: 0;
}
.module-card {
  display: flex;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card-bg);
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.module-card:hover {
  border-color: var(--link);
  transform: translateY(-2px);
  box-shadow: var(--card-shadow);
}
.module-card-num {
  flex: 0 0 auto;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 8px;
  background: var(--link);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.05rem;
}
.module-card-body { flex: 1 1 auto; min-width: 0; }
.module-card-tag {
  display: inline-block;
  font-size: 0.72rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  margin-bottom: 0.35rem;
  letter-spacing: 0.02em;
}
.module-card-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.05rem;
  line-height: 1.3;
}
.module-card-desc {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.3rem 1rem;
}
.resource-list a {
  display: block;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text);
}
.resource-list a:hover {
  background: var(--bg-secondary);
  color: var(--link);
}

/* prev/next navigation at the bottom of each module page */
.prev-next {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.6rem;
  margin: 3rem 0 1rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.prev-next-link {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text);
  background: var(--bg-secondary);
  transition: border-color 0.15s ease, background 0.15s ease;
  min-height: 2.6rem;
}
.prev-next-link:hover {
  border-color: var(--link);
  background: var(--bg);
}
.prev-next-link.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
.prev-next-link.next { text-align: right; align-items: flex-end; }
.prev-next-link.home {
  align-self: stretch;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-weight: 600;
}
.prev-next-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.prev-next-title {
  font-size: 0.95rem;
  line-height: 1.3;
}
@media (max-width: 640px) {
  .prev-next { grid-template-columns: 1fr; }
  .prev-next-link.next { text-align: left; align-items: flex-start; }
}
`;

const cssPath = 'css/style.css';
const cssOrig = r(cssPath);
if (!cssOrig.includes(CSS_MARK)) {
  w(cssPath, cssOrig + CSS_APPEND);
  console.log('  + Appended home-hub CSS to css/style.css');
} else {
  console.log('  = home-hub CSS already present');
}

console.log('\n✓ Migration complete.');
console.log(`  Module pages patched: ${patched}/${MODULE_ORDER.length}`);
console.log('  Test: npm start  →  open http://localhost:3000/');
