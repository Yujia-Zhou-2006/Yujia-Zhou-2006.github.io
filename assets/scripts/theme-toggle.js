(function(){
  const KEY='colorMode';
  const html=document.documentElement;
  
  let lastScrollY = 0;
  let fab = null;
  
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
  
  // 智能隐藏悬浮按钮和Header第一行
  function handleScroll() {
    if (!fab) {
      fab = document.querySelector('.theme-fab');
    }
    if (!fab) return;
    
    // 尝试多种方式获取滚动位置
    const scrollY1 = window.scrollY;
    const scrollY2 = window.pageYOffset;
    const scrollY3 = document.documentElement.scrollTop;
    const scrollY4 = document.body.scrollTop;
    
    const currentScrollY = scrollY1 || scrollY2 || scrollY3 || scrollY4 || 0;
    const scrollThreshold = 50;
    
    console.log('Scroll values - window.scrollY:', scrollY1, 'pageYOffset:', scrollY2, 'docElement:', scrollY3, 'body:', scrollY4, 'final:', currentScrollY);
    
    // 控制悬浮按钮
    if (currentScrollY < scrollThreshold) {
      fab.classList.remove('hidden');
      console.log('FAB shown - near top, scrollY =', currentScrollY);
    } else if (currentScrollY > lastScrollY + 10) {
      fab.classList.add('hidden');
      console.log('FAB hidden - scrolling down, scrollY =', currentScrollY);
    } else if (currentScrollY < lastScrollY - 10) {
      fab.classList.remove('hidden');
      console.log('FAB shown - scrolling up, scrollY =', currentScrollY);
    }
    
    // 控制手机端悬浮导航栏（仅手机端，反转逻辑：下滑时显示）
    const mobileFloatNav = document.getElementById('mobileFloatNav');
    if (mobileFloatNav && window.innerWidth <= 767) {
      if (currentScrollY < 100) {
        // 接近顶部时隐藏
        mobileFloatNav.classList.add('hidden');
        console.log('Mobile nav hidden - near top, scrollY =', currentScrollY);
      } else if (currentScrollY > lastScrollY + 10) {
        // 向下滚动时显示
        mobileFloatNav.classList.remove('hidden');
        console.log('Mobile nav shown - scrolling down, scrollY =', currentScrollY);
      } else if (currentScrollY < lastScrollY - 10) {
        // 向上滚动时隐藏
        mobileFloatNav.classList.add('hidden');
        console.log('Mobile nav hidden - scrolling up, scrollY =', currentScrollY);
      }
    }
    
    // Header不再需要隐藏逻辑，因为已改为静态滚动
    // 只保留浮动主题按钮功能
    
    lastScrollY = currentScrollY;
  }
  
  // 初始化
  apply(localStorage.getItem(KEY) || 'auto');
  
  // 简化事件绑定 - 修复版本
  function initScrollHandler() {
    fab = document.querySelector('.theme-fab');
    console.log('Init scroll handler, FAB found:', fab);
    
    // 初始化胶囊导航栏为隐藏状态
    const mobileFloatNav = document.getElementById('mobileFloatNav');
    if (mobileFloatNav) {
      mobileFloatNav.classList.add('hidden');
      console.log('Mobile nav initialized as hidden');
    }
    
    if (fab) {
      // 尝试多种绑定方式
      console.log('Binding scroll events...');
      
      // 方式1：绑定到window
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // 方式2：绑定到document
      document.addEventListener('scroll', handleScroll, { passive: true });
      
      // 方式3：绑定到document.documentElement
      document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
      
      // 方式4：绑定到body
      document.body.addEventListener('scroll', handleScroll, { passive: true });
      
      console.log('All scroll events bound');
      
      // 简单测试：直接输出滚动位置
      setInterval(function() {
        const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        if (y > 0) console.log('Interval check - ScrollY:', y);
      }, 1000);
    }
  }
  
  // 等待DOM加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollHandler);
  } else {
    initScrollHandler();
  }
  
  // 主题切换点击事件
  document.addEventListener('click', function(e){
    const t=e.target.closest('[data-action="toggle-theme"]');
    if(!t) return;
    const current = getMode();
    const next = current==='light' ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    apply(next);
  });
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
    apply(localStorage.getItem(KEY) || 'auto');
  });
})();
