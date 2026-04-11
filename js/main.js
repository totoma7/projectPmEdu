// 단순 HTML 링크 방식 — fetch 없이 UI 인터랙션만 처리

(function () {
  'use strict';

  // --- Dark Mode ---
  var themeToggle = document.getElementById('theme-toggle');
  var themeIcon = themeToggle.querySelector('.theme-icon');

  function initTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  }

  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();

    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ theme: next === 'dark' ? 'dark' : 'default' });
      mermaid.run();
    }
  });

  // --- Mobile Sidebar ---
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var menuToggle = document.getElementById('menu-toggle');

  menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  overlay.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('active');
  }

  // 모바일에서 사이드바 링크 클릭 시 닫기
  sidebar.querySelectorAll('.nav-sub a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // --- Scroll to Top ---
  var scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', function () {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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

  // --- Init ---
  initTheme();
})();
