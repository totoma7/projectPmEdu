// 단순 HTML 링크 방식 — fetch 없이 UI 인터랙션만 처리

(function () {
  'use strict';

  // --- Dark Mode ---
  var themeToggle = document.getElementById('theme-toggle');
  var themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

  // Mermaid 원본 소스 캡처: 이 스크립트는 mermaid의 startOnLoad(DOMContentLoaded) 렌더 전에
  // 동기 실행되므로 .mermaid 요소가 아직 원본 텍스트를 보유. 테마 토글 시 재렌더에 사용.
  var mermaidEls = document.querySelectorAll('.mermaid');
  var mermaidSrc = [];
  mermaidEls.forEach(function (el) { mermaidSrc.push(el.textContent); });

  function rerenderMermaid(theme) {
    if (typeof mermaid === 'undefined' || !mermaidEls.length) return;
    mermaidEls.forEach(function (el, i) {
      el.removeAttribute('data-processed');
      el.innerHTML = mermaidSrc[i];
    });
    mermaid.initialize({ startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'default' });
    try { mermaid.run({ nodes: mermaidEls }); } catch (e) { mermaid.run(); }
  }

  function initTheme() {
    var saved = localStorage.getItem('theme');
    var current = document.documentElement.getAttribute('data-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (current === 'light' || current === 'dark') {
      localStorage.setItem('theme', current);
    } else {
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', preferred);
      localStorage.setItem('theme', preferred);
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeIcon) return;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon();
      rerenderMermaid(next);
    });
  }

  // --- Mobile Sidebar ---
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var menuToggle = document.getElementById('menu-toggle');

  // resource 페이지에는 사이드바·메뉴 토글이 없으므로 가드
  if (sidebar && overlay && menuToggle) {
    menuToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    overlay.addEventListener('click', closeSidebar);

    // 모바일에서 사이드바 링크 클릭 시 닫기
    sidebar.querySelectorAll('.nav-sub a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('active');
  }

  // --- Scroll to Top ---
  var scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll-based Section Highlight ---
  var sections = document.querySelectorAll('section[id]');

  if (sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            document.querySelectorAll('.nav-sub a').forEach(function (a) {
              a.classList.remove('current');
            });
            var active = document.querySelector('.nav-sub a[href="#' + entry.target.id + '"]');
            if (active) active.classList.add('current');
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  // --- Prism.js ---
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }

  // --- Search ---
  if (typeof SEARCH_DATA !== 'undefined') {
    var header = document.querySelector('.sidebar-header');
    var searchBox = document.createElement('div');
    searchBox.className = 'search-container';
    searchBox.innerHTML = '<input type="text" class="search-input" placeholder="검색 (Ctrl+K)" aria-label="섹션 검색"><div class="search-results"></div>';
    header.parentNode.insertBefore(searchBox, header.nextSibling);

    var searchInput = searchBox.querySelector('.search-input');
    var searchResults = searchBox.querySelector('.search-results');

    function doSearch(query) {
      if (query.length < 2) { searchResults.innerHTML = ''; searchResults.style.display = 'none'; return; }
      var q = query.toLowerCase();
      var matches = SEARCH_DATA.filter(function(item) {
        return item.title.toLowerCase().indexOf(q) !== -1 ||
               item.desc.toLowerCase().indexOf(q) !== -1 ||
               item.kw.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">검색 결과 없음</div>';
      } else {
        searchResults.innerHTML = matches.map(function(item) {
          var t = item.title.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<span class="search-highlight">$1</span>');
          return '<a class="search-result-item" href="' + item.url + '"><div class="search-result-title">' + t + '</div><div class="search-result-desc">' + item.desc + '</div></a>';
        }).join('');
      }
      searchResults.style.display = 'block';
    }

    searchInput.addEventListener('input', function() { doSearch(this.value.trim()); });
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { this.value = ''; searchResults.style.display = 'none'; }
    });
    document.addEventListener('click', function(e) {
      if (!searchBox.contains(e.target)) searchResults.style.display = 'none';
    });
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); }
    });
  }

  // --- Progress Tracking (localStorage) ---
  function initProgress() {
    if (typeof SEARCH_DATA === 'undefined') return;
    var TOTAL = SEARCH_DATA.length;
    var KEY = 'progress_v1';

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; }
    }
    function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

    var state = load();

    // Inject checkboxes next to section headers on the current page
    document.querySelectorAll('section[id^="s"]').forEach(function (sec) {
      var id = sec.id;
      if (!/^s\d+-\d+$/.test(id)) return;
      var heading = sec.querySelector('h2, h3, h4');
      if (!heading || heading.querySelector('.section-check')) return;
      var label = document.createElement('label');
      label.className = 'section-check';
      label.title = '학습 완료 체크';
      label.innerHTML = '<input type="checkbox" data-section="' + id + '"' + (state[id] ? ' checked' : '') + '><span class="section-check-mark">✓</span>';
      heading.appendChild(label);
    });

    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.matches || !t.matches('.section-check input')) return;
      var id = t.dataset.section;
      if (t.checked) state[id] = true; else delete state[id];
      save(state);
      renderProgress();
    });

    function renderProgress() {
      // ✓ on sidebar links
      document.querySelectorAll('.nav-sub a').forEach(function (a) {
        var m = a.getAttribute('href').match(/#(s\d+-\d+)/);
        if (!m) return;
        a.classList.toggle('done', !!state[m[1]]);
      });
      // Summary in sidebar header
      var done = Object.keys(state).length;
      var pct = TOTAL ? Math.round((done / TOTAL) * 100) : 0;
      var summary = document.querySelector('.progress-summary');
      if (!summary) {
        summary = document.createElement('div');
        summary.className = 'progress-summary';
        var sh = document.querySelector('.sidebar-header');
        if (sh) sh.appendChild(summary);
      }
      summary.innerHTML = '<span class="progress-bar"><span class="progress-fill" style="width:' + pct + '%"></span></span><span class="progress-text">학습 진도 ' + done + ' / ' + TOTAL + ' (' + pct + '%)</span>';
    }
    renderProgress();
  }

  // --- Tag Filter (sidebar chips) ---
  function initTagFilter() {
    if (typeof SEARCH_DATA === 'undefined') return;
    var byCat = { role: [], topic: [] };
    var seen = {};
    SEARCH_DATA.forEach(function (item) {
      (item.tags || []).forEach(function (t) {
        if (seen[t]) return;
        seen[t] = true;
        var parts = t.split(':');
        if (byCat[parts[0]]) byCat[parts[0]].push(parts[1]);
      });
    });
    if (byCat.role.length === 0 && byCat.topic.length === 0) return;
    byCat.role.sort(); byCat.topic.sort();

    var sidebar = document.getElementById('sidebar');
    var navList = sidebar && sidebar.querySelector('.nav-list');
    if (!navList) return;

    var wrap = document.createElement('div');
    wrap.className = 'tag-filter';
    var labels = { role: '역할', topic: '주제' };
    ['role', 'topic'].forEach(function (cat) {
      if (!byCat[cat] || byCat[cat].length === 0) return;
      var group = document.createElement('div');
      group.className = 'tag-filter-group';
      group.innerHTML = '<span class="tag-filter-label">' + labels[cat] + '</span>';
      byCat[cat].forEach(function (name) {
        var btn = document.createElement('button');
        btn.className = 'tag-chip';
        btn.type = 'button';
        btn.dataset.tag = cat + ':' + name;
        btn.textContent = name;
        group.appendChild(btn);
      });
      wrap.appendChild(group);
    });
    var clear = document.createElement('button');
    clear.className = 'tag-filter-clear';
    clear.type = 'button';
    clear.textContent = '필터 해제';
    clear.style.display = 'none';
    wrap.appendChild(clear);

    sidebar.insertBefore(wrap, navList);

    // Build section→tags lookup
    var sectionTags = {};
    SEARCH_DATA.forEach(function (item) {
      var m = item.url.match(/#(s\d+-\d+)/);
      if (m) sectionTags[m[1]] = item.tags || [];
    });

    var active = new Set();

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag-chip');
      if (btn) {
        var t = btn.dataset.tag;
        if (active.has(t)) { active.delete(t); btn.classList.remove('active'); }
        else { active.add(t); btn.classList.add('active'); }
        applyFilter();
        return;
      }
      if (e.target === clear) {
        active.clear();
        wrap.querySelectorAll('.tag-chip.active').forEach(function (c) { c.classList.remove('active'); });
        applyFilter();
      }
    });

    function applyFilter() {
      clear.style.display = active.size > 0 ? 'inline-block' : 'none';
      // Filter sub-items
      document.querySelectorAll('.nav-sub li').forEach(function (li) {
        var a = li.querySelector('a');
        if (!a) return;
        var m = a.getAttribute('href').match(/#(s\d+-\d+)/);
        if (!m) { li.classList.remove('filtered-out'); return; }
        var tags = sectionTags[m[1]] || [];
        var match = active.size === 0 || Array.from(active).every(function (t) { return tags.indexOf(t) !== -1; });
        li.classList.toggle('filtered-out', !match);
      });
      // Hide module groups whose every sub-item is filtered out
      document.querySelectorAll('.nav-list > .nav-item').forEach(function (item) {
        var subs = item.querySelectorAll('.nav-sub li');
        if (subs.length === 0) return;
        var allHidden = Array.from(subs).every(function (li) { return li.classList.contains('filtered-out'); });
        item.classList.toggle('module-filtered-out', active.size > 0 && allHidden);
      });
    }
  }

  // --- Table Scroll Wrapper ---
  function wrapTables() {
    document.querySelectorAll('.module .comparison-table').forEach(function (t) {
      if (t.parentElement.classList.contains('table-scroll')) return;
      var w = document.createElement('div');
      w.className = 'table-scroll';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  // --- Reading Progress Bar (홈 제외) ---
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

  // --- Page TOC + Scroll Spy (홈 제외, h3 3개 이상일 때만) ---
  function initPageToc() {
    if (document.querySelector('.home-hero')) return;
    var heads = Array.prototype.slice.call(document.querySelectorAll('#content .module h3'));
    if (heads.length < 3) return;
    heads.forEach(function (h, i) { if (!h.id) h.id = 'toc-h' + i; });

    // initProgress()가 주입한 ✓ 체크 라벨을 제외한 제목 텍스트
    function headingText(h) {
      var clone = h.cloneNode(true);
      var check = clone.querySelector('.section-check');
      if (check) check.parentNode.removeChild(check);
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    var nav = document.createElement('nav');
    nav.id = 'page-toc';
    nav.setAttribute('aria-label', '페이지 목차');
    var title = document.createElement('p');
    title.className = 'toc-title';
    title.textContent = '이 페이지';
    nav.appendChild(title);
    heads.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = headingText(h);
      a.title = headingText(h);
      nav.appendChild(a);
    });
    document.body.appendChild(nav);

    var links = nav.querySelectorAll('a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-10% 0px -75% 0px' });
    heads.forEach(function (h) { spy.observe(h); });
  }

  // --- Init ---
  initTheme();
  initProgress();
  initTagFilter();
  wrapTables();
  initReadProgress();
  initPageToc();
})();
