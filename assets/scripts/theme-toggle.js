(function(){
  const KEY = 'theme'; // 使用标准的 theme 键名
  const html = document.documentElement;
  
  let lastScrollY = 0;
  let fab = null;
  
  function getTheme(){
    return localStorage.getItem(KEY) || 'auto';
  }
  
  function getCurrentTheme(){
    const theme = getTheme();
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    // auto 模式下检测系统偏好
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  
  function setTheme(theme){
    // 始终保持 auto 模式，不保存用户选择
    html.setAttribute('data-theme', 'auto');
    
    // 根据系统偏好设置实际显示的主题
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');
    
    updateIcons();
  }
  
  function updateIcons(){
    const currentTheme = getCurrentTheme();
    const icon = currentTheme === 'dark' ? '☀️' : '🌙';
    const label = currentTheme === 'dark' ? '当前深色模式 (跟随系统)' : '当前浅色模式 (跟随系统)';
    
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn=>{
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
    });
  }
  
  function toggleTheme(){
    // 重新检测系统主题并更新显示
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');
    updateIcons();
    console.log('已刷新主题状态，当前跟随系统:', prefersDark ? '深色' : '浅色');
  }
  
  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = function() {
      // 始终响应系统变化，因为我们总是在 auto 模式
      const prefersDark = mediaQuery.matches;
      html.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');
      updateIcons();
      console.log('系统主题已变更为:', prefersDark ? '深色' : '浅色');
    };
    
    // 添加监听器（兼容不同浏览器）
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    } else if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
  }
  
  // 初始化主题 - 始终设为 auto
  setTheme('auto');
  
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
    
    // 控制手机端悬浮导航栏（仅手机端，反转逻辑：下滑时显示，离顶部更近时触发）
    const mobileFloatNav = document.getElementById('mobileFloatNav');
    if (mobileFloatNav && window.innerWidth <= 767) {
      if (currentScrollY < 50) { // 从100px改为50px，更早触发
        // 接近顶部时隐藏（添加.hidden类）
        mobileFloatNav.classList.add('hidden');
        console.log('Mobile nav hidden - near top, scrollY =', currentScrollY);
      } else if (currentScrollY > lastScrollY + 10) {
        // 向下滚动时显示（移除.hidden类）
        mobileFloatNav.classList.remove('hidden');
        console.log('Mobile nav shown - scrolling down, scrollY =', currentScrollY);
      } else if (currentScrollY < lastScrollY - 10) {
        // 向上滚动时隐藏（添加.hidden类）
        mobileFloatNav.classList.add('hidden');
        console.log('Mobile nav hidden - scrolling up, scrollY =', currentScrollY);
      }
    }
    
    // Header不再需要隐藏逻辑，因为已改为静态滚动
    // 只保留浮动主题按钮功能
    
    lastScrollY = currentScrollY;
  }
  
  // 简化事件绑定 - 修复版本
  function initScrollHandler() {
    fab = document.querySelector('.theme-fab');
    console.log('Init scroll handler, FAB found:', fab);
    
    // 初始化胶囊导航栏：添加动画类但保持隐藏状态
    const mobileFloatNav = document.getElementById('mobileFloatNav');
    if (mobileFloatNav) {
      // 延迟一帧后添加动画类和隐藏类，确保没有初始动画
      requestAnimationFrame(() => {
        mobileFloatNav.classList.add('nav-ready', 'hidden');
        console.log('Mobile nav initialized: nav-ready and hidden classes added');
      });
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
    const t = e.target.closest('[data-action="toggle-theme"]');
    if (!t) return;
    
    // 添加点击反馈动画
    t.style.transform = 'scale(0.9)';
    setTimeout(() => {
      t.style.transform = '';
    }, 75);
    
    toggleTheme();
  });
  
  // 胶囊导航栏点击延迟处理
  document.addEventListener('click', function(e){
    const navBtn = e.target.closest('.mobile-float-nav .nav-btn');
    if (!navBtn) return;
    
    // 阻止默认跳转
    e.preventDefault();
    
    // 获取目标链接
    const href = navBtn.getAttribute('href');
    if (!href) return;
    
    // 等待动画完成后跳转（200ms让 scale 动画走完）
    setTimeout(() => {
      window.location.href = href;
    }, 200);
  });
  
  // 头像点击切换功能 - 支持多张图片循环（优化版）
  let availableAvatars = []; // 缓存可用的头像列表
  let isCheckingAvatars = false; // 防止重复检查
  
  // 异步检查并缓存可用的头像
  function checkAvailableAvatars() {
    if (isCheckingAvatars) return Promise.resolve(availableAvatars);
    isCheckingAvatars = true;
    
    const allAvatars = [
      '/assets/avatar.jpg',
      '/assets/avatar2.jpg',
      '/assets/avatar3.jpg',
      '/assets/avatar4.jpg',
      '/assets/avatar5.jpg'
    ];
    
    return Promise.all(allAvatars.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    })).then(results => {
      availableAvatars = results.filter(src => src !== null);
      console.log('Available avatars cached:', availableAvatars);
      return availableAvatars;
    });
  }
  
  document.addEventListener('click', function(e){
    const avatar = e.target.closest('[data-action="toggle-avatar"]');
    if (!avatar) return;
    
    // 添加点击动画
    avatar.style.transform = 'scale(0.95)';
    avatar.style.transition = 'transform 0.15s ease';
    
    // 如果还没有缓存可用头像，先检查
    if (availableAvatars.length === 0) {
      checkAvailableAvatars().then(() => {
        switchToNextAvatar(avatar);
      });
    } else {
      // 直接切换，无延迟
      switchToNextAvatar(avatar);
    }
  });
  
  function switchToNextAvatar(avatar) {
    if (availableAvatars.length === 0) {
      console.log('No available avatars found');
      avatar.style.transform = 'scale(1)';
      setTimeout(() => { avatar.style.transition = ''; }, 75);
      return;
    }
    
    const currentSrc = avatar.getAttribute('src');
    let currentIndex = availableAvatars.findIndex(src => currentSrc.includes(src.split('/').pop()));
    
    // 如果没找到或者只有一张图片，使用第一张
    if (currentIndex === -1) currentIndex = 0;
    
    // 计算下一张图片索引
    const nextIndex = (currentIndex + 1) % availableAvatars.length;
    const nextAvatar = availableAvatars[nextIndex];
    
    // 立即切换图片，无额外延迟
    avatar.setAttribute('src', nextAvatar);
    localStorage.setItem('selectedAvatarIndex', nextIndex.toString());
    
    // 恢复动画
    setTimeout(() => {
      avatar.style.transform = 'scale(1)';
      setTimeout(() => { avatar.style.transition = ''; }, 75);
    }, 10); // 很短的延迟，确保图片加载开始
  }
  
  // 页面分层淡入动画控制
  document.addEventListener('DOMContentLoaded', function(){
    // 延迟一点时间让页面完全渲染
    setTimeout(() => {
      const fadeContainer = document.querySelector('.page-fade-container');
      if (fadeContainer) {
        fadeContainer.classList.add('loaded');
        
        // 可选：添加动画完成后的回调
        const lastLayer = fadeContainer.querySelector('.fade-layer-5');
        if (lastLayer) {
          const handleTransitionEnd = function(e) {
            if (e.target === lastLayer && e.propertyName === 'opacity') {
              // 所有分层动画完成
              console.log('分层动画完成');
              lastLayer.removeEventListener('transitionend', handleTransitionEnd);
            }
          };
          lastLayer.addEventListener('transitionend', handleTransitionEnd);
        }
      }
    }, 100);
  });

  // 页面加载时恢复用户选择的头像（优化版）
  document.addEventListener('DOMContentLoaded', function(){
    const avatar = document.getElementById('profileAvatar');
    if (!avatar) return;
    
    const selectedIndex = localStorage.getItem('selectedAvatarIndex');
    if (selectedIndex) {
      // 先检查可用头像，然后恢复选择
      checkAvailableAvatars().then(() => {
        const index = parseInt(selectedIndex);
        if (availableAvatars[index]) {
          avatar.setAttribute('src', availableAvatars[index]);
          console.log('Restored avatar:', availableAvatars[index]);
        } else {
          // 如果保存的索引无效，重置为第一张
          if (availableAvatars.length > 0) {
            avatar.setAttribute('src', availableAvatars[0]);
            localStorage.setItem('selectedAvatarIndex', '0');
          }
        }
      });
    } else {
      // 没有保存的选择，检查可用头像以备后用
      checkAvailableAvatars();
    }
  });

  // 个人信息卡片点击功能
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.clickable-card');
    if (!card) return;

    const profileType = card.getAttribute('data-profile');
    const dataScript = document.getElementById('profileDetailsData');
    
    if (!dataScript || !profileType) return;

    try {
      const profileData = JSON.parse(dataScript.textContent);
      const data = profileData[profileType];
      
      if (!data) return;

      // 显示弹窗
      showProfileModal(data.title, data.value, data.description);
    } catch (error) {
      console.error('Error parsing profile data:', error);
    }
  });

  function showProfileModal(title, value, description) {
    const modal = document.getElementById('profileModal');
    const titleElement = document.getElementById('profileModalTitle');
    const subtitleElement = document.getElementById('profileModalSubtitle');
    const descElement = document.getElementById('profileModalDescription');
    
    if (!modal || !titleElement || !subtitleElement || !descElement) return;

    titleElement.textContent = title;
    subtitleElement.textContent = value;
    descElement.textContent = description;
    modal.style.display = 'flex';
    
    // 触发动画
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    // 防止body滚动
    document.body.style.overflow = 'hidden';
  }

  function hideProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
      modal.classList.remove('show');
      // 等待动画完成后隐藏
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
    }
  }

  // 弹窗关闭事件
  document.addEventListener('DOMContentLoaded', function() {
    // 标记页面已加载，确保淡入效果完成
    setTimeout(() => {
      document.documentElement.classList.add('loaded');
    }, 400);
    
    const closeBtn = document.getElementById('profileModalClose');
    const backdrop = document.getElementById('profileModalBackdrop');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', hideProfileModal);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', hideProfileModal);
    }
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideProfileModal();
      }
    });

    // 鼠标光晕效果
    const cards = document.querySelectorAll('.card-like');
    const profileItems = document.querySelectorAll('.profile-item');
    
    // 为卡片添加光晕效果
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });

    // 为个人信息卡片添加光晕效果
    profileItems.forEach(item => {
      item.addEventListener('mousemove', function(e) {
        const rect = item.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        item.style.setProperty('--mouse-x', `${x}%`);
        item.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  });
})();
