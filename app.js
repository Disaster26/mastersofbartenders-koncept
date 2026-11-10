(function(){
  // menu mobilne
  var b=document.querySelector('.burger'),m=document.querySelector('.mnav');
  if(b&&m){
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);m.classList.toggle('open',!o)});
    m.addEventListener('click',function(e){if(e.target.closest('a')){b.setAttribute('aria-expanded','false');m.classList.remove('open')}});
  }
  // karty przesuwane palcem i mysza
  document.querySelectorAll('.track-wrap').forEach(function(w){
    var t=w.querySelector('.track'),prev=w.querySelector('[data-prev]'),next=w.querySelector('[data-next]');
    var sec=w.closest('section');if(sec&&!prev){prev=sec.querySelector('[data-prev]');next=sec.querySelector('[data-next]')}
    function step(){var c=t.children[0];return c?c.getBoundingClientRect().width+16:300}
    function upd(){if(!prev)return;prev.disabled=t.scrollLeft<4;next.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4}
    if(prev){prev.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'})});next.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'})})}
    t.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
    var down=false,sx=0,sl=0,moved=false;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=t.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;t.classList.add('drag')}t.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;setTimeout(function(){t.classList.remove('drag')},0)});
    t.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    t.addEventListener('dragstart',function(e){e.preventDefault()});
  });
  // rok w stopce
  document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

  // zapis i platnosc (pokazowo)
  var bk=document.getElementById('zapis-form');if(!bk)return;
  var panes=bk.querySelectorAll('.pane'),lis=document.querySelectorAll('.steps li'),parts=document.querySelectorAll('.steps-sh .part');
  var cur=0;
  function go(i){
    cur=i;panes.forEach(function(p,k){p.classList.toggle('on',k===i)});
    lis.forEach(function(l,k){l.classList.toggle('cur',k===i);l.classList.toggle('done',k<i)});
    parts.forEach(function(p,k){p.classList.toggle('on',k<i);p.classList.toggle('cur',k===i)});
    var tg=innerWidth<900?document.querySelector('.steps'):document.getElementById('zapis');var top=tg.getBoundingClientRect().top+scrollY-76;
    if(Math.abs(scrollY-top)>200)scrollTo({top:top,behavior:'smooth'});
  }
  // termin z adresu ?t=
  var q=new URLSearchParams(location.search).get('t');
  if(q){var r=bk.querySelector('input[name=termin][value="'+q+'"]');if(r)r.checked=true}
  bk.querySelectorAll('[data-next-step]').forEach(function(btn){btn.addEventListener('click',function(){
    if(cur===0){if(!bk.querySelector('input[name=termin]:checked')){bk.querySelector('.dates').animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:250});return}}
    if(cur===1){if(!valid())return;fillSum()}
    go(cur+1);
  })});
  bk.querySelectorAll('[data-back]').forEach(function(btn){btn.addEventListener('click',function(){go(cur-1)})});
  function valid(){
    var ok=true;
    bk.querySelectorAll('[data-req]').forEach(function(f){
      var i=f.querySelector('input'),v=i.value.trim(),good=v.length>1;
      if(i.type==='email')good=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      if(i.type==='tel')good=v.replace(/\D/g,'').length>=9;
      f.classList.toggle('err',!good);if(!good&&ok){i.focus();ok=false}
    });
    var c=bk.querySelector('#regul');c.closest('.chk').classList.toggle('err',!c.checked);if(!c.checked)ok=false;
    return ok;
  }
  bk.querySelectorAll('[data-req] input').forEach(function(i){i.addEventListener('input',function(){i.closest('.fld').classList.remove('err')})});
  function fillSum(){
    var t=bk.querySelector('input[name=termin]:checked'),d=+bk.querySelector('input[name=rabat]:checked').value;
    var price=990-d;
    document.getElementById('s-termin').textContent=t.dataset.label;
    document.getElementById('s-osoba').textContent=bk.querySelector('#imie').value.trim()+' '+bk.querySelector('#nazwisko').value.trim();
    document.getElementById('s-rabat-row').style.display=d?'flex':'none';
    document.getElementById('s-rabat').textContent='-'+d+' zł';
    document.getElementById('s-tot').textContent=price+' zł';
    document.getElementById('pay-btn-amt').textContent=price+' zł';
  }
  document.getElementById('pay-btn').addEventListener('click',function(){
    var btn=this;btn.disabled=true;btn.innerHTML='<i class="spin"></i> Łączymy z operatorem płatności...';
    setTimeout(function(){
      document.getElementById('d-mail').textContent=bk.querySelector('#email').value.trim();
      document.getElementById('d-termin').textContent=bk.querySelector('input[name=termin]:checked').dataset.label;
      go(3);parts.forEach(function(p){p.classList.add('on');p.classList.remove('cur')});
      lis.forEach(function(l){l.classList.add('done');l.classList.remove('cur')});
    },1400);
  });
})();
