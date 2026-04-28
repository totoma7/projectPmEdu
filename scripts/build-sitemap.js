#!/usr/bin/env node
/*
 * Generate sitemap.xml from all root-level *.html files.
 *
 * - Production base URL: https://totoma7.github.io/projectPmEdu/
 * - lastmod: pulled from `git log -1 --format=%aI <file>` per file (falls back to mtime)
 * - priority: home (1.0) > module pages (0.8) > resources (0.6)
 *
 * Run: node scripts/build-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://totoma7.github.io/projectPmEdu/';

function listHtml() {
  return fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .sort();
}

function lastmodFor(file) {
  try {
    const out = execSync(`git log -1 --format=%aI -- "${file}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return out;
  } catch (_) { /* fall through */ }
  const stat = fs.statSync(path.join(ROOT, file));
  return stat.mtime.toISOString();
}

function priorityFor(file) {
  if (file === 'index.html') return '1.0';
  if (file.startsWith('module')) return '0.8';
  return '0.6';
}

function changefreqFor(file) {
  if (file === 'resource_changelog.html' || file === 'resource_roadmap.html') return 'weekly';
  if (file === 'index.html') return 'weekly';
  return 'monthly';
}

const urls = listHtml().map(file => {
  const loc = file === 'index.html' ? BASE_URL : `${BASE_URL}${file}`;
  return {
    loc,
    lastmod: lastmodFor(file),
    changefreq: changefreqFor(file),
    priority: priorityFor(file),
  };
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ Wrote sitemap.xml with ${urls.length} URLs`);
