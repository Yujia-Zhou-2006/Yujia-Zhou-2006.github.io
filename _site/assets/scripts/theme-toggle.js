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
    const headerHideThreshold = 30; // Header第一行隐藏阈值
    
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
    
    // 控制Header第一行隐藏（仅手机端，所有模式统一）
    if (window.innerWidth <= 767) {
      if (currentScrollY > headerHideThreshold) {
        document.body.classList.add('header-title-hidden');
        console.log('Header title hidden');
      } else {
        document.body.classList.remove('header-title-hidden');
        console.log('Header title shown');
      }
    }
    
    // 控制GitHub风格的滚动导航条（仅手机端，默认显示，向下滚动隐藏）
    const scrollNav = document.getElementById('scrollNav');
    if (scrollNav && window.innerWidth <= 767) {
      const hideThreshold = 150; // 滚动150px后才开始响应
      
      if (currentScrollY > hideThreshold) {
        if (currentScrollY > lastScrollY + 10) {
          // 向下滚动，隐藏导航条
          scrollNav.classList.add('scroll-nav-hidden');
          console.log('Scroll nav hidden - scrolling down');
        } else if (currentScrollY < lastScrollY - 10) {
          // 向上滚动，显示导航条
          scrollNav.classList.remove('scroll-nav-hidden');
          console.log('Scroll nav shown - scrolling up');
        }
      } else {
        // 接近顶部，始终显示导航条
        scrollNav.classList.remove('scroll-nav-hidden');
        console.log('Scroll nav shown - near top');
      }
    }
    
    lastScrollY = currentScrollY;
  }
  
  // 初始化
  apply(localStorage.getItem(KEY) || 'auto');
  
  // 简化事件绑定 - 修复版本
  function initScrollHandler() {
    fab = document.querySelector('.theme-fab');
    console.log('Init scroll handler, FAB found:', fab);
    
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
