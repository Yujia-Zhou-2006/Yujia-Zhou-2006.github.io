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
    navigator.clipboard.writeText(id).then(()=>toast('Copied')).catch(()=>toast('Copy failed'));
  });
})();
