/* Motorul "lichid" 3D (metaballs prin raymarching, WebGL).
   Un bloc cheamă addLiquidScene(canvas, config) și primește înapoi o funcție de oprire.
   Toate scenele împart o singură buclă de animație. */
import { LITE } from './scope.js'

function hex(h){return [parseInt(h.substr(1,2),16)/255,parseInt(h.substr(3,2),16)/255,parseInt(h.substr(5,2),16)/255]}
export const C={WHITE:hex('#ffffff'),INK:hex('#0b0b0c'),BLUE:hex('#1f44d6'),SKY:hex('#cfdcff'),PEARL:hex('#eef1f8')}
const BONE=C.WHITE,INK=C.INK
const isCoarse=typeof window!=='undefined'&&matchMedia('(pointer:coarse)').matches

const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS=[
  'precision highp float;',
  'uniform vec2 uR;uniform float uT;uniform float uOff;uniform float uMode;',
  'uniform vec4 uS[6];uniform vec3 uC[6];',
  'uniform vec3 uB0;uniform vec3 uB1;uniform vec3 uB2;uniform vec3 uB3;',
  'uniform vec3 uK0;uniform vec3 uK1;uniform vec3 uK2;uniform vec3 uK3;',
  'float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}',
  'float map(vec3 p){vec3 q=p+.05*sin(p.yzx*4.3+uT*vec3(1.1,.9,1.3))+.022*sin(p.zxy*9.1-uT*vec3(1.6,1.3,1.9));float d=10.;for(int i=0;i<6;i++){d=smin(d,length(q-uS[i].xyz)-uS[i].w,.42);}return d;}',
  'vec3 nrm(vec3 p){vec2 e=vec2(.004,-.004);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}',
  'vec3 tint(vec3 p){vec3 c=vec3(0.);float w=0.;for(int i=0;i<6;i++){float d=max(length(p-uS[i].xyz)-uS[i].w,0.);float k=exp(-9.*d);c+=uC[i]*k;w+=k;}return c/max(w,.0001);}',
  'void main(){',
  ' vec2 p=(gl_FragCoord.xy*2.-uR)/uR.y;',
  ' vec3 bg=uB0;vec3 kc=uK0;',
  ' if(uMode>.5){',
  '  float v=1.-gl_FragCoord.y/uR.y;float e=1.5/uR.y;',
  '  float yy=uOff+v+.03*sin(p.x*3.1+uT*1.2)+.017*sin(p.x*7.3-uT*1.7)+.008*sin(p.x*15.+uT*2.6);',
  '  float s1=smoothstep(1.-e,1.+e,yy),s2=smoothstep(2.-e,2.+e,yy),s3=smoothstep(3.-e,3.+e,yy);',
  '  bg=mix(mix(mix(uB0,uB1,s1),uB2,s2),uB3,s3);kc=mix(mix(mix(uK0,uK1,s1),uK2,s2),uK3,s3);',
  ' }',
  ' vec3 ro=vec3(p,1.7);float t=0.;float md=10.;vec3 pm=ro;float hit=0.;',
  ' for(int i=0;i<52;i++){vec3 q=ro+vec3(0.,0.,-t);float d=map(q);if(d<md){md=d;pm=q;}if(d<.003){hit=1.;break;}t+=d*.8;if(t>3.4)break;}',
  ' vec3 col=bg;float px=2.5/uR.y;',
  ' if(hit>.5||md<px){',
  '  vec3 q=hit>.5?ro+vec3(0.,0.,-t):pm;vec3 n=nrm(q);',
  '  vec3 base=uMode>.5?kc:tint(q);',
  '  vec3 L=normalize(vec3(-.45,.75,.6));',
  '  float df=clamp(dot(n,L),0.,1.);',
  '  float sp=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),64.);',
  '  float sp2=pow(clamp(dot(reflect(-normalize(vec3(.7,-.35,.5)),n),vec3(0.,0.,1.)),0.,1.),16.)*.16;',
  '  float fr=pow(1.-clamp(n.z,0.,1.),2.5);',
  '  vec3 c=base*(.74+.36*df)+vec3(sp*.9+sp2)+base*fr*.3-fr*.1;',
  '  c=mix(c,base*.5,smoothstep(.15,1.,-n.y)*.4);',
  '  float a=hit>.5?1.:smoothstep(px,0.,md);',
  '  col=mix(bg,c,a);',
  ' }',
  ' gl_FragColor=vec4(col,1.);',
  '}'].join('\n');


const scenes=[],mouse={x:-1,y:-1,on:false,p:0},perf={n:0,sum:0,k:1}
let running=false,fid=0
  function mk(canvas,cfg){
    if(LITE)return null;
    var gl=null;try{gl=canvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'})}catch(e){}
    if(!gl)return null;
    function sh(t,src){var s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
    var v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);if(!v||!f)return null;
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
    gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
    var U={};['uR','uT','uOff','uMode','uS[0]','uC[0]','uB0','uB1','uB2','uB3','uK0','uK1','uK2','uK3'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
    var s={c:canvas,gl:gl,U:U,cfg:cfg,vis:false,w:0,h:0,mx:0,my:0,S:new Float32Array(24),C:new Float32Array(18),drawn:false};
    var bg=cfg.bg,kc=cfg.kc||[INK,INK,INK,INK];
    gl.uniform3fv(U.uB0,bg[0]);gl.uniform3fv(U.uB1,bg[1]||bg[0]);gl.uniform3fv(U.uB2,bg[2]||bg[0]);gl.uniform3fv(U.uB3,bg[3]||bg[0]);
    gl.uniform3fv(U.uK0,kc[0]);gl.uniform3fv(U.uK1,kc[1]);gl.uniform3fv(U.uK2,kc[2]);gl.uniform3fv(U.uK3,kc[3]);
    gl.uniform1f(U.uMode,cfg.mode||0);
    cfg.sph.forEach(function(q,i){s.C.set(q.c||INK,i*3)});gl.uniform3fv(U['uC[0]'],s.C);
    scenes.push(s);return s;
  }
  function draw(s,t){
    var gl=s.gl,c=s.c,r=c.getBoundingClientRect();if(r.width<2||r.height<2)return;
    var cap=isCoarse?520000:2600000,dpr=Math.min(window.devicePixelRatio||1,1.5);
    var k=Math.min(1,Math.sqrt(cap/(r.width*r.height*dpr*dpr)))*dpr*perf.k;
    var w=Math.max(2,Math.round(r.width*k)),h=Math.max(2,Math.round(r.height*k));
    if(w!==s.w||h!==s.h){s.w=c.width=w;s.h=c.height=h;gl.viewport(0,0,w,h)}
    var asp=w/h,sc=Math.max(.5,Math.min(1,asp/1.25));
    /* pointer in scene units */
    var tx,ty,cfg=s.cfg;
    if(mouse.on){tx=((mouse.x-r.left)/r.width*2-1)*asp;ty=-((mouse.y-r.top)/r.height*2-1)}
    else{tx=asp*.35*Math.sin(t*.5);ty=.3*Math.cos(t*.37)}
    s.mx+=(tx-s.mx)*.08;s.my+=(ty-s.my)*.08;
    cfg.sph.forEach(function(q,i){
      var x,y,z;
      if(q.m){x=s.mx;y=s.my;z=.25}
      else{x=q.x*asp+q.ax*sc*Math.sin(t*q.f+q.p);y=q.y+(asp<.8?(cfg.my||0):0)+q.ay*sc*Math.cos(t*q.g+q.p*1.7);z=.28*Math.sin(t*q.f*.8+q.p*3.)}
      s.S[i*4]=x;s.S[i*4+1]=y;s.S[i*4+2]=z;s.S[i*4+3]=q.r*sc*(q.m?1+.9*(mouse.p||0):1);
    });
    gl.uniform4fv(s.U['uS[0]'],s.S);
    gl.uniform2f(s.U.uR,w,h);gl.uniform1f(s.U.uT,t);
    if(cfg.mode){var hr=cfg.host.getBoundingClientRect();gl.uniform1f(s.U.uOff,(r.top-hr.top)/r.height)}
    gl.drawArrays(gl.TRIANGLES,0,3);s.drawn=true;
  }

function start(){
  if(running)return;running=true
  if(!start.bound){start.bound=true
    addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.on=true},{passive:true})
    function tch(e){var t=e.touches&&e.touches[0];if(t){mouse.x=t.clientX;mouse.y=t.clientY;mouse.on=true}}
    addEventListener('touchstart',function(e){tch(e);mouse.p=1},{passive:true});addEventListener('touchmove',tch,{passive:true})
    addEventListener('pointerdown',function(){mouse.p=1},{passive:true})}
  var t0=performance.now(),lt=t0
  ;(function frame(now){
    if(!scenes.length){running=false;return}
    var dt=now-lt;lt=now;mouse.p=(mouse.p||0)*.94;var t=(now-t0)/1000+4.2,any=false
    if(!document.hidden)scenes.forEach(function(s){if(s.vis){draw(s,t);any=true}})
    /* rezoluția se adaptează lin: scade puțin dacă merge greu, urcă la loc când merge bine; primele 4 secunde (încărcarea) nu contează */
    if(any&&dt<400&&now-t0>4000){perf.sum+=dt;perf.n++;if(perf.n>=60){var a=perf.sum/perf.n;perf.n=0;perf.sum=0;if(a>40&&perf.k>.72)perf.k=Math.max(.72,perf.k*.9);else if(a<22&&perf.k<1)perf.k=Math.min(1,perf.k*1.1)}}
    requestAnimationFrame(frame)
  })(t0)
}

/* cfg: { bg:[culoare,...], sph:[{x,y,ax,ay,f,g,p,r,c}, {m:1,r,c} = bila care urmărește mouse-ul],
          mode:1 + host:element = fundal în benzi care se schimbă la scroll, my = deplasare pe telefon } */
export function addLiquidScene(canvas,cfg){
  var s=mk(canvas,cfg);if(!s)return null
  document.documentElement.classList.add('gl-on')
  var io=null
  if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){s.vis=es[es.length-1].isIntersecting},{rootMargin:'120px 0px'});io.observe(canvas)}else s.vis=true
  start()
  return function(){var i=scenes.indexOf(s);if(i>=0)scenes.splice(i,1);if(io)io.disconnect();var lc=s.gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext()}
}

/* Distorsiune lichidă SVG pe un element (ex. numele din bilet când scrii). */
export function liquidFilter(el,freq){
  if(LITE)return {to:function(){},burst:function(){}}
  var D=document,defs=D.getElementById('defs'),NS='http://www.w3.org/2000/svg'
  if(!defs)return {to:function(){},burst:function(){}}

    var id='lq'+(fid++),f=D.createElementNS(NS,'filter');
    f.setAttribute('id',id);f.setAttribute('x','-10%');f.setAttribute('y','-10%');f.setAttribute('width','120%');f.setAttribute('height','120%');f.setAttribute('color-interpolation-filters','sRGB');
    var tu=D.createElementNS(NS,'feTurbulence');tu.setAttribute('type','fractalNoise');tu.setAttribute('baseFrequency',freq||'.009 .016');tu.setAttribute('numOctaves','2');tu.setAttribute('seed',String(3+fid));tu.setAttribute('result','n');
    var dm=D.createElementNS(NS,'feDisplacementMap');dm.setAttribute('in','SourceGraphic');dm.setAttribute('in2','n');dm.setAttribute('scale','0');dm.setAttribute('xChannelSelector','R');dm.setAttribute('yChannelSelector','G');
    f.appendChild(tu);f.appendChild(dm);defs.appendChild(f);
    var cur=0,target=0,raf=0,bf=parseFloat((freq||'.009').split(' ')[0]),ph=Math.random()*6;
    function step(){
      cur+=(target-cur)*.09;
      if(Math.abs(target-cur)<.3&&target===0){cur=0;el.style.filter='';raf=0;return}
      ph+=.03;tu.setAttribute('baseFrequency',(bf+bf*.25*Math.sin(ph)).toFixed(5)+' '+(bf*1.8+bf*.3*Math.cos(ph*.8)).toFixed(5));
      dm.setAttribute('scale',cur.toFixed(1));raf=requestAnimationFrame(step);
    }
    return {to:function(v){target=v;if(!raf){el.style.filter='url(#'+id+')';raf=requestAnimationFrame(step)}},
            burst:function(v){cur=v;target=0;if(!raf){el.style.filter='url(#'+id+')';raf=requestAnimationFrame(step)}}};
  
}
