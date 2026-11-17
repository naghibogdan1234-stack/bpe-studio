/* Galeria de proiecte: taburi, clip + poze, săgeți, tastatură, swipe, avans automat. Blocul Gallery. */
import { LITE } from './scope.js'

export function initGallery(gal, S){
  var D=document
  var rm=LITE,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  function all(q){return [].slice.call(gal.querySelectorAll(q))}
  var slides=all('.gs'),thumbs=all('.gt'),tabs=all('.gtab'),infos=all('.gi'),phones=all('.phone'),prog=gal.querySelector('#gprog'),label=gal.querySelector('#glabel'),count=gal.querySelector('#gcount');
  var cur=-1,proj=-1,timer=0,vis=false,hold=false;
  function inProj(p){var a=[];slides.forEach(function(s,i){if(+s.getAttribute('data-p')===p)a.push(i)});return a}
  function setProj(p){if(p===proj)return;proj=p;
    [tabs,infos,phones].forEach(function(l){l.forEach(function(e){var on=+e.getAttribute('data-p')===p;e.classList.toggle('on',on);if(e.getAttribute('role')==='tab')e.setAttribute('aria-selected',on?'true':'false')})});
    thumbs.forEach(function(t){t.classList.toggle('show',+t.getAttribute('data-p')===p)})}
  function bar(ms){prog.style.animation='none';void prog.offsetWidth;if(ms&&!rm)prog.style.animation='gp '+ms+'ms linear forwards'}
  function arm(){clearTimeout(timer);if(!vis||hold||cur<0)return;var s=slides[cur],v=s.querySelector('video');
    if(v){try{v.currentTime=0}catch(e){}var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});bar((v.duration&&isFinite(v.duration)?v.duration:6)*1000)}
    else{bar(5200);timer=S.later(function(){step(1)},5200)}}
  function show(i,dir){
    if(i===cur)return;var s=slides[i],old=cur>=0?slides[cur]:null;
    slides.forEach(function(x){x.classList.remove('prev','inR','inL')});
    if(old){old.classList.remove('on');old.classList.add('prev');var ov=old.querySelector('video');if(ov)ov.pause()}
    setProj(+s.getAttribute('data-p'));
    s.classList.add('on');if(old&&!rm){void s.offsetWidth;s.classList.add(dir<0?'inL':'inR')}
    cur=i;var list=inProj(proj);
    thumbs.forEach(function(t,k){t.classList.toggle('on',k===i)});
    label.textContent=s.getAttribute('data-l');count.textContent=(list.indexOf(i)+1)+' / '+list.length;
    arm();
  }
  function step(d){var list=inProj(proj),k=list.indexOf(cur);show(list[(k+d+list.length)%list.length],d)}
  slides.forEach(function(sl){var v=sl.querySelector('video');if(v)S.on(v,'ended',function(){if(slides[cur]===sl)step(1)})});
  thumbs.forEach(function(t,k){S.on(t,'click',function(){show(k,k<cur?-1:1)})});
  tabs.forEach(function(t){S.on(t,'click',function(){var p=+t.getAttribute('data-p');if(p!==proj)show(inProj(p)[0],p<proj?-1:1)})});
  S.on(gal.querySelector('#gprev'),'click',function(){step(-1)});
  S.on(gal.querySelector('#gnext'),'click',function(){step(1)});
  S.on(window,'keydown',function(e){if(!vis||/input|textarea/i.test((e.target.tagName||'')))return;if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1)});
  var st=gal.querySelector('#gstage'),sx=0,sy=0;
  S.on(st,'touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  S.on(st,'touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.4)step(dx<0?1:-1)},{passive:true});
  if(fine&&!rm){var gv=gal.querySelector('.gview'),fr=gal.querySelector('#gframe');
    S.on(gv,'pointermove',function(e){var r=gv.getBoundingClientRect();fr.style.setProperty('--fy',(((e.clientX-r.left)/r.width-.5)*5).toFixed(2)+'deg');fr.style.setProperty('--fx',(-((e.clientY-r.top)/r.height-.5)*4).toFixed(2)+'deg')});
    S.on(gv,'pointerleave',function(){fr.style.setProperty('--fy','0deg');fr.style.setProperty('--fx','0deg')})}
  show(0,1);
  S.watch(st,function(v){vis=v;if(vis)arm();else{clearTimeout(timer);var v=cur>=0&&slides[cur].querySelector('video');if(v)v.pause()}},{threshold:.25});
  S.on(D,'visibilitychange',function(){if(D.hidden){clearTimeout(timer)}else arm()});
}
