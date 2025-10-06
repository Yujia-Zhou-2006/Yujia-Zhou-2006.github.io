// Project filter script for front-end filtering

document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.project-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const type = this.dataset.type;
      // 切换tab高亮
      tabs.forEach(t => t.classList.remove('selected'));
      this.classList.add('selected');
      // 显示/隐藏卡片
      cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
