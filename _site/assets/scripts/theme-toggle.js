(function(){
  const KEY='colorMode';
  const html=document.documentElement;
  function getMode(){
    const mode = localStorage.getItem(KEY) || 'auto';
    if(mode==='light'||mode==='dark') return mode;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  function apply(mode){
    if(mode==='light' || mode==='dark'){ html.setAttribute('data-color-mode', mode); }
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');
    }
    updateIcons();
  }
  // SVG icons
  const svgMoon = '<svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 0 1 12.79 3a7 7 0 1 0 8.21 9.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const svgSun = '<svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function updateIcons(){
    const mode = getMode();
    const icon = mode==='dark' ? svgSun : svgMoon;
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn=>{
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', mode==='dark' ? '切换到亮色模式' : '切换到暗色模式');
    });
  }
  apply(localStorage.getItem(KEY) || 'auto');
  document.addEventListener('click', function(e){
    const t=e.target.closest('[data-action="toggle-theme"]');
    if(!t) return;
  const current = getMode();
  const next = current==='light' ? 'dark' : 'light';
  localStorage.setItem(KEY, next);
  apply(next);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
    apply(localStorage.getItem(KEY) || 'auto');
  });
})();
