(function(){
  const KEY='colorMode';
  const html=document.documentElement;
  function apply(mode){
    if(mode==='light' || mode==='dark'){ html.setAttribute('data-color-mode', mode); }
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');
    }
  }
  apply(localStorage.getItem(KEY) || 'auto');
  document.addEventListener('click', function(e){
    const t=e.target.closest('[data-action="toggle-theme"]');
    if(!t) return;
    const current = localStorage.getItem(KEY) || 'auto';
    const next = current==='light' ? 'dark' : current==='dark' ? 'auto' : 'light';
    localStorage.setItem(KEY, next);
    apply(next);
    t.setAttribute('aria-label','Theme: '+next);
  });
})();
