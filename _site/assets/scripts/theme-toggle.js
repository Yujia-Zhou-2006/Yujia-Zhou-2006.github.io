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
  function updateIcons(){
    const mode = getMode();
    const icon = mode==='dark' ? '☀️' : '🌙';
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
