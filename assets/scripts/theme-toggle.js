
(function(){
  const STORAGE_KEY = 'colorMode';
  const html = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const appleStatusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  const COLOR_VARS = {
    light: '--status-bar-light',
    dark: '--status-bar-dark'
  };
  const COLOR_FALLBACKS = {
    light: '#edf0f3',
    dark: '#020408'
  };

  let fabButton;
  let scrollNav;
  let lastScrollY = 0;

  function readStoredMode() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'auto';
    } catch (_error) {
      return 'auto';
    }
  }

  function writeStoredMode(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_error) {
      /* ignore */
    }
  }

  function resolveCssColor(varName, fallback) {
    try {
      const value = getComputedStyle(html).getPropertyValue(varName);
      return value ? value.trim() : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function getStatusBarColor(mode) {
    const varName = COLOR_VARS[mode] || COLOR_VARS.light;
    const fallback = COLOR_FALLBACKS[mode] || COLOR_FALLBACKS.light;
    return resolveCssColor(varName, fallback) || fallback;
  }

  function syncStatusBar(mode) {
    const normalized = mode === 'dark' ? 'dark' : 'light';
    const color = getStatusBarColor(normalized);
    if (themeMeta) {
      themeMeta.setAttribute('content', color);
    }
    if (appleStatusMeta) {
      appleStatusMeta.setAttribute('content', normalized === 'dark' ? 'black' : 'default');
    }
  }

  function prefersDark() {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function resolveMode(mode) {
    if (mode === 'light' || mode === 'dark') {
      return mode;
    }
    return prefersDark() ? 'dark' : 'light';
  }

  function applyMode(mode) {
    const effective = resolveMode(mode);
    html.setAttribute('data-color-mode', effective);
    syncStatusBar(effective);
    updateToggleIcons(effective);
  }

  function updateToggleIcons(mode) {
    const icon = mode === 'dark' ? '☀️' : '🌙';
    const aria = mode === 'dark' ? '切换到亮色模式' : '切换到暗色模式';
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      if (btn.innerHTML !== icon) {
        btn.innerHTML = icon;
      }
      btn.setAttribute('aria-label', aria);
    });
  }

  function computeScrollPosition() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function handleScroll() {
    const currentY = computeScrollPosition();
    const isMobile = window.innerWidth <= 767;

    if (fabButton) {
      if (currentY < 50 || currentY < lastScrollY - 10) {
        fabButton.classList.remove('hidden');
      } else if (currentY > lastScrollY + 10) {
        fabButton.classList.add('hidden');
      }
    }

    if (isMobile) {
      if (currentY > 30) {
        document.body.classList.add('header-title-hidden');
      } else {
        document.body.classList.remove('header-title-hidden');
      }

      if (scrollNav && scrollNav.classList) {
        if (currentY > 150 && currentY > lastScrollY + 10) {
          scrollNav.classList.add('scroll-nav-hidden');
        } else if (currentY < lastScrollY - 10 || currentY <= 150) {
          scrollNav.classList.remove('scroll-nav-hidden');
        }
      }
    }

    lastScrollY = currentY;
  }

  function initScrollFeatures() {
    fabButton = document.querySelector('.theme-fab');
    scrollNav = document.getElementById('scrollNav');
    if (!fabButton && !scrollNav) {
      return;
    }
    handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  }

  function toggleTheme() {
    const current = resolveMode(readStoredMode());
    const next = current === 'light' ? 'dark' : 'light';
    writeStoredMode(next);
    applyMode(next);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    }, 350);
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const target = event.target.closest('[data-action="toggle-theme"]');
      if (!target) {
        return;
      }
      event.preventDefault();
      toggleTheme();
    });

    if (!window.matchMedia) {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const stored = readStoredMode();
      if (stored === 'auto') {
        applyMode('auto');
      } else {
        const effective = resolveMode(stored);
        syncStatusBar(effective);
        updateToggleIcons(effective);
      }
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener);
    } else if (typeof media.addListener === 'function') {
      media.addListener(listener);
    }
  }

  applyMode(readStoredMode());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFeatures);
  } else {
    initScrollFeatures();
  }

  bindEvents();
})();
