/* Particule 3D: glob -> telefon -> text ("0 €"), legat de scroll. Folosit de blocul ParticleStory. */
import { LITE } from './scope.js'

export function initParticles(pm, S, word){
  var D=document,rm=LITE,coarse=matchMedia('(pointer:coarse)').matches,pc=pm.querySelector('canvas')
  function prog(el){var r=el.getBoundingClientRect(),h=r.height-innerHeight;return h>0?Math.max(0,Math.min(1,-r.top/h)):0}
    if(!pm||!pc||LITE)return;var gl=null;try{gl=pc.getContext('webgl',{antialias:false,alpha:false})}catch(e){}if(!gl)return;
    var N=coarse?9000:22000,A=new Float32Array(N*3),B=new Float32Array(N*3),C=new Float32Array(N*3),R=new Float32Array(N);
    function rnd(){return Math.random()}
    for(var i=0;i<N;i++){
      R[i]=rnd();
      /* A: globe shell with a loose halo */
      var u=rnd()*2-1,th=rnd()*6.2832,s=Math.sqrt(1-u*u),rad=i%7===0?1.15+rnd()*.5:1.08+(rnd()-.5)*.04;
      A[i*3]=s*Math.cos(th)*rad;A[i*3+1]=u*rad;A[i*3+2]=s*Math.sin(th)*rad;
      /* B: phone slab with a screen layout */
      var W=.62,H=1.26,cr=.12,x,y,z,k=rnd();
      if(k<.30){ /* outline */
        var t=rnd()*4;if(t<1){x=-W;y=(rnd()*2-1)*(H-cr)}else if(t<2){x=W;y=(rnd()*2-1)*(H-cr)}else if(t<3){y=-H;x=(rnd()*2-1)*(W-cr)}else{y=H;x=(rnd()*2-1)*(W-cr)}
        if(rnd()<.3){var a=rnd()*1.5708,qx=rnd()<.5?-1:1,qy=rnd()<.5?-1:1;x=qx*(W-cr+Math.cos(a)*cr);y=qy*(H-cr+Math.sin(a)*cr)}
        z=(rnd()-.5)*.14;
      }else if(k<.52){x=(rnd()*2-1)*.5;y=.35+rnd()*.72;z=.08}       /* photo block */
      else if(k<.64){x=-.5+rnd()*.78;y=.14+rnd()*.07;z=.08}           /* headline */
      else if(k<.72){x=-.5+rnd()*.55;y=-.02+rnd()*.05;z=.08}
      else if(k<.80){x=-.5+rnd()*.9;y=-.2+rnd()*.04;z=.08}
      else if(k<.87){x=-.5+rnd()*.7;y=-.32+rnd()*.04;z=.08}
      else if(k<.97){x=-.5+rnd()*1.0;y=-.78+rnd()*.2;z=.08}            /* button */
      else{x=(rnd()*2-1)*.14;y=-1.12+rnd()*.03;z=.08}                  /* home bar */
      B[i*3]=x;B[i*3+1]=y;B[i*3+2]=z;
    }
    function text(){
      var o=D.createElement('canvas');o.width=900;o.height=420;var c=o.getContext('2d');
      c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.font='600 360px "Clash Display", system-ui, sans-serif';c.fillText(word,450,225);
      var d=c.getImageData(0,0,900,420).data,pts=[];
      for(var y=0;y<420;y+=2)for(var x=0;x<900;x+=2)if(d[(y*900+x)*4+3]>128)pts.push(x,y);
      if(!pts.length)return;
      for(var i=0;i<N;i++){var j=(Math.random()*pts.length/2|0)*2;
        C[i*3]=(pts[j]-450)/900*3.1+(Math.random()-.5)*.008;C[i*3+1]=-(pts[j+1]-210)/900*3.1+(Math.random()-.5)*.008;C[i*3+2]=(Math.random()-.5)*.22}
      gl.bindBuffer(gl.ARRAY_BUFFER,bc);gl.bufferData(gl.ARRAY_BUFFER,C,gl.STATIC_DRAW);
    }
    var VS=['attribute vec3 a;attribute vec3 b;attribute vec3 c;attribute float r;',
     'uniform float uP;uniform float uT;uniform vec2 uM;uniform float uA;uniform float uS;varying float vD;varying float vR;',
     'void main(){',
     ' float p1=smoothstep(.18,.82,clamp(uP,0.,1.));float p2=smoothstep(.18,.82,clamp(uP-1.,0.,1.));',
     ' vec3 p=mix(mix(a,b,p1),c,p2);',
     ' float tr=sin(3.14159*p1)*(1.-step(1.,uP))+sin(3.14159*p2);',
     ' vec3 n=vec3(sin(r*91.7+uT*.7),cos(r*57.3+uT*.9),sin(r*33.1-uT*.6));',
     ' p+=n*(tr*(.25+r*.9)+.012);',
     ' float spin=mix(uT*.25,sin(uT*.5)*.28,clamp(uP,0.,1.));',
     ' float ry=spin+uM.x*.6;float rx=uM.y*.35+.12*(1.-clamp(uP,0.,1.));',
     ' float cy=cos(ry),sy=sin(ry);p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);',
     ' float cx=cos(rx),sx=sin(rx);p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx);',
     ' float w=3.6-p.z;float f=2.6*min(1.,uA*1.15);',
     ' gl_Position=vec4(p.x*f/uA+.3*w*step(1.1,uA),p.y*f,0.,w);',
     ' gl_PointSize=uS*(.6+r*1.1)*3.6/w;vD=p.z;vR=r;',
     '}'].join('\n');
    var FS=['precision mediump float;varying float vD;varying float vR;',
     'void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float al=smoothstep(.5,.08,d);',
     ' vec3 col=mix(vec3(.16,.34,1.),vec3(.86,.91,1.),step(.72,vR));col=mix(col,vec3(1.),smoothstep(.2,1.2,vD)*.5);',
     ' gl_FragColor=vec4(col*al*(.55+.45*smoothstep(-1.4,1.,vD)),1.);}'].join('\n');
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null}
    var v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);if(!v||!f)return;
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
    function buf(name,data,size){var bb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bb);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);var l=gl.getAttribLocation(pr,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);return bb}
    buf('a',A,3);buf('b',B,3);var bc=buf('c',B,3);buf('r',R,1);
    var U={};['uP','uT','uM','uA','uS'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(.043,.043,.047,1);
    text();if(D.fonts&&D.fonts.ready)D.fonts.ready.then(text);
    pm.classList.add('on');
    var caps=pm.querySelectorAll('.pm-cap p'),vis=false,mx=0,my=0,tx=0,ty=0,w=0,h=0,cp=0,t0=performance.now();
    S.watch(pm,function(v){vis=v},{rootMargin:'100px 0px'});
    S.on(window,'pointermove',function(e){tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1},{passive:true});
    S.on(window,'touchmove',function(e){var t=e.touches[0];if(t){tx=t.clientX/innerWidth*2-1;ty=t.clientY/innerHeight*2-1}},{passive:true});
    if(coarse&&window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission!=='function')S.on(window,'deviceorientation',function(e){if(e.gamma==null)return;tx=Math.max(-1,Math.min(1,e.gamma/35));ty=Math.max(-1,Math.min(1,(e.beta-45)/35))},{passive:true});
    S.loop(function frame(now){
      if(vis&&!D.hidden){
        var r=pc.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,coarse?1.5:2),W=Math.round(r.width*d),H=Math.round(r.height*d);
        if(W!==w||H!==h){w=pc.width=W;h=pc.height=H;gl.viewport(0,0,W,H)}
        var p=prog(pm)*2;cp+=(p-cp)*.12;mx+=(tx-mx)*.06;my+=(ty-my)*.06;
        var idx=cp<.5?0:cp<1.5?1:2;for(var i=0;i<caps.length;i++)caps[i].classList.toggle('act',i===idx);
        gl.uniform1f(U.uP,cp);gl.uniform1f(U.uT,rm?2:(now-t0)/1000);gl.uniform2f(U.uM,mx,my);gl.uniform1f(U.uA,W/H);gl.uniform1f(U.uS,d*(coarse?2.1:2.4)*Math.min(1.25,H/800));
        gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.POINTS,0,N);
      }
    });
  return function(){pm.classList.remove('on');var lc=gl&&gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext()}
}
