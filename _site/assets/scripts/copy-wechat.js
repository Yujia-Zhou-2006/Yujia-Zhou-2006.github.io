(function(){
  function toast(msg){
    const el = document.getElementById('toast');
    if(!el) return;
    el.textContent = msg;
    el.hidden = false;
    setTimeout(()=>{ el.hidden = true; }, 2000);
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest('[data-action="copy-wechat"]');
    if(!btn) return;
    const id = btn.getAttribute('data-id');
    if(!id) return;
    navigator.clipboard.writeText(id).then(()=>{
      // Copied提示
      const btn = document.getElementById('wechat-btn');
      const tip = document.getElementById('wechat-copied');
      if(btn && tip){
        tip.style.display = 'block';
        tip.style.left = (btn.offsetLeft + btn.offsetWidth/2) + 'px';
        setTimeout(()=>{ tip.style.display = 'none'; }, 1500);
      }
    }).catch(()=>toast('Copy failed'));
  });
})();
