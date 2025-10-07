// theme-fab-visibility.js
// 隐藏/显示悬浮主题按钮（theme-fab）——下滑隐藏，上滑/回顶部显示

(function(){
  let lastScrollY = window.scrollY;
  let ticking = false;
  let fab = null;
  function updateFab(){
    if(!fab) fab = document.querySelector('.theme-fab-fix, .theme-fab');
    if(!fab) {
      // 按钮还没渲染，延迟重试
      setTimeout(updateFab, 100);
      return;
    }
    const currentY = window.scrollY;
    // 用 setProperty 强制 !important，防止被任何 CSS 覆盖
    if(currentY < 10) {
      fab.style.setProperty('transform', 'translateY(0)', 'important');
      fab.style.setProperty('opacity', '1', 'important');
      fab.style.pointerEvents = 'auto';
    } else if(currentY > lastScrollY) {
      // 下滑，隐藏
      fab.style.setProperty('transform', 'translateY(120%)', 'important');
      fab.style.setProperty('opacity', '0', 'important');
      fab.style.pointerEvents = 'none';
    } else {
      // 上滑，显示
      fab.style.setProperty('transform', 'translateY(0)', 'important');
      fab.style.setProperty('opacity', '1', 'important');
      fab.style.pointerEvents = 'auto';
    }
    // 调试输出
    console.log('[theme-fab-fix]', {
      currentY,
      lastScrollY,
      transform: fab.style.transform,
      opacity: fab.style.opacity,
      computedTransform: getComputedStyle(fab).transform,
      computedOpacity: getComputedStyle(fab).opacity
    });
    lastScrollY = currentY;
    ticking = false;
  }
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(updateFab);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  // DOM 渲染后立即设置一次
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFab);
  } else {
    updateFab();
  }
})();
