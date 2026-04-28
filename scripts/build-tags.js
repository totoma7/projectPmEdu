#!/usr/bin/env node
/*
 * Auto-tag js/search-data.js entries based on existing kw/title/desc.
 * Adds a `tags` array to each entry — values like "role:PM", "topic:모델".
 *
 * Idempotent: re-running re-derives tags from scratch.
 *
 * Run: node scripts/build-tags.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SDPATH = path.join(ROOT, 'js/search-data.js');

const ROLE_RULES = [
  { role: 'PM', kw: ['PM', 'PRD', '기획서', '제안서', '요구사항', '회의록', '보고서', '리서치', '시장 조사', '경쟁사', '페르소나', '인터뷰', 'A/B', '문서 품질'] },
  { role: 'PL', kw: ['PL', '일정', 'WBS', '간트', '리더십', '리스크', '이슈 관리', '팀 리딩', '커뮤니케이션', '애자일', '스크럼', '칸반', '거버넌스 프레임워크'] },
  { role: '개발자', kw: ['Claude Code', '코딩', '바이브', 'MCP', 'DevOps', 'CICD', 'CI/CD', 'TDD', '테스팅', '테스트', '리팩토링', 'Flutter', '게시판', 'JavaScript', 'Python', 'JUnit', 'Jest', 'OpenAPI', 'Spring', 'Express', 'API 설계', 'Cursor', 'Copilot', 'Windsurf', 'Playwright'] },
];

const TOPIC_RULES = [
  { topic: '모델',     kw: ['LLM', 'GPT', 'Claude', 'Gemini', 'LLaMA', 'Opus', 'Sonnet', 'Haiku', '오픈 모델', '추론 모델', '멀티모달'] },
  { topic: '프롬프트', kw: ['프롬프트', '템플릿 활용'] },
  { topic: '에이전트', kw: ['에이전트', 'Agent', 'RAG', '도구 사용', '하네스'] },
  { topic: '도구',     kw: ['ChatGPT', '뤼튼', '클로바', 'Cursor', 'Copilot', 'Windsurf', 'AI 도구'] },
  { topic: '보안',     kw: ['보안', '인젝션', 'API키', '데이터 유출'] },
  { topic: '규제',     kw: ['규제', '거버넌스', 'GDPR', '윤리', '컴플라이언스', '정책'] },
  { topic: '문서',     kw: ['문서', 'PRD', '기획', '제안서', '요구사항', '회의록', '명세', 'API 명세'] },
  { topic: '도식',     kw: ['플로우차트', '아키텍처', '시스템 구조', 'ER 다이어그램', '여정', '시퀀스', 'Mermaid', 'draw.io'] },
  { topic: '비용',     kw: ['비용', '요금', '요금제', 'ROI', '예산', '토큰 비용'] },
  { topic: '트렌드',   kw: ['No-Code', '컨텍스트 엔지니어링', '추론', '멀티모달', '하네스', 'Harness', '2026 트렌드'] },
  { topic: '협업',     kw: ['AI 네이티브', '워크플로우 구축', '팀 협업'] },
  { topic: '실전',     kw: ['SaaS', 'MVP', '레거시', '마이그레이션', '케이스', '도입 사례', '국내'] },
];

function tagsFor(item) {
  const text = (item.title + ' ' + item.desc + ' ' + item.kw).toLowerCase();

  const roles = ROLE_RULES
    .filter(function (r) { return r.kw.some(function (k) { return text.indexOf(k.toLowerCase()) !== -1; }); })
    .map(function (r) { return 'role:' + r.role; });

  const topics = TOPIC_RULES
    .filter(function (t) { return t.kw.some(function (k) { return text.indexOf(k.toLowerCase()) !== -1; }); })
    .map(function (t) { return 'topic:' + t.topic; });

  return roles.concat(topics);
}

// --- Parse existing js/search-data.js ---
const src = fs.readFileSync(SDPATH, 'utf8');
const m = src.match(/var SEARCH_DATA = (\[[\s\S]*?\]);?\s*$/);
if (!m) {
  console.error('Could not find SEARCH_DATA array in ' + SDPATH);
  process.exit(1);
}
const data = Function('return ' + m[1])();

// --- Compute new entries (preserves title/desc/url/kw, replaces tags) ---
const tagged = data.map(function (item) {
  return {
    title: item.title,
    desc: item.desc,
    url: item.url,
    kw: item.kw,
    tags: tagsFor(item),
  };
});

// --- Serialize back in the same one-line-per-entry style ---
const lines = tagged.map(function (item) {
  const fields = [
    'title:' + JSON.stringify(item.title),
    'desc:' + JSON.stringify(item.desc),
    'url:' + JSON.stringify(item.url),
    'kw:' + JSON.stringify(item.kw),
    'tags:' + JSON.stringify(item.tags),
  ];
  return '  {' + fields.join(',') + '}';
});

const out = 'var SEARCH_DATA = [\n' + lines.join(',\n') + '\n];\n';
fs.writeFileSync(SDPATH, out, 'utf8');

console.log('✓ Wrote tags to ' + tagged.length + ' entries');

// --- Print tag distribution (for sanity-check) ---
const counts = {};
tagged.forEach(function (item) {
  item.tags.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
});
const sorted = Object.keys(counts).sort();
console.log('\nTag distribution:');
sorted.forEach(function (t) {
  console.log('  ' + t.padEnd(20) + counts[t]);
});

const untagged = tagged.filter(function (i) { return i.tags.length === 0; });
if (untagged.length) {
  console.log('\n⚠️  ' + untagged.length + ' untagged entries:');
  untagged.forEach(function (i) { console.log('   ' + i.title); });
}
