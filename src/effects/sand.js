/* Nisip care cade și se adună pe text. Blocul SandText. text = un rând, lines = varianta pe 2 rânduri pentru telefon. */
export function initSand(sc, S, text, lines){
  var D=document,rm=false
    var sx=sc.getContext('2d'),W=0,H=0,g,img,cnt=0,sv=false,drain=false,mx=-1,my=-1,fr=0;
    var RGB=[[0,0,0],[255,255,255],[31,68,214],[207,220,255],[91,124,255],[255,255,255]];
    function build(){
      var r=sc.getBoundingClientRect(),c=r.width<700?2:3;if(r.width<2||r.height<2)return;W=Math.ceil(r.width/c);H=Math.ceil(r.height/c);sc.width=W;sc.height=H;
      g=new Uint8Array(W*H);img=sx.createImageData(W,H);cnt=0;drain=false;
      var o=D.createElement('canvas');o.width=W;o.height=H;var x=o.getContext('2d'),t=W<200?lines:[text],fs=H*(t.length>1?.3:.44);
      x.font='600 '+fs+'px "Clash Display", system-ui, sans-serif';var mw=Math.max.apply(null,t.map(function(s){return x.measureText(s).width}));
      if(mw>W*.92){fs*=W*.92/mw;x.font='600 '+fs+'px "Clash Display", system-ui, sans-serif'}
      x.textAlign='center';x.textBaseline='alphabetic';x.fillStyle='#fff';
      t.forEach(function(s,i){x.fillText(s,W/2,H*(t.length>1?.5:.66)+i*fs*.95)});
      var d=x.getImageData(0,0,W,H).data;for(var i=0;i<W*H;i++)if(d[i*4+3]>110)g[i]=1;
      paint();
    }
    function paint(){var d=img.data;for(var i=0;i<W*H;i++){var c=RGB[g[i]],j=i*4;d[j]=c[0]||11;d[j+1]=c[1]||11;d[j+2]=c[2]||12;d[j+3]=255}sx.putImageData(img,0,0)}
    function step(){
      fr++;var ltr=fr&1;
      for(var y=H-2;y>=0;y--){for(var k=0;k<W;k++){var x=ltr?k:W-1-k,i=y*W+x,v=g[i];if(v<2)continue;
        var b=i+W;if(!g[b]){g[b]=v;g[i]=0;continue}
        var dir=Math.random()<.5?-1:1,nx=x+dir;if(nx>=0&&nx<W&&!g[b+dir]&&!g[i+dir]){g[b+dir]=v;g[i]=0;continue}
        nx=x-dir;if(nx>=0&&nx<W&&!g[b-dir]&&!g[i-dir]){g[b-dir]=v;g[i]=0}}}
      if(drain){var n=0;for(var q=(H-1)*W;q<H*W;q++)if(g[q]>1){g[q]=0;cnt--}
        if(cnt<W)drain=false}
    }
    function pour(t){
      if(drain)return;var col=2+((t/2600|0)%3),ex,ey;
      if(mx>=0){ex=mx;ey=my}else{ex=W*(.5+.42*Math.sin(t/1700));ey=1}
      for(var n=0;n<Math.max(8,W/22|0);n++){var x=Math.round(ex+(Math.random()-.5)*W*.035),y=Math.max(0,Math.round(ey+(Math.random()-.5)*3));
        if(x>=0&&x<W&&y<H&&!g[y*W+x]){g[y*W+x]=col;cnt++}}
      if(cnt>W*H*.3)drain=true;
    }
    S.on(sc,'pointermove',function(e){var r=sc.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*W;my=(e.clientY-r.top)/r.height*H});
    S.on(sc,'pointerleave',function(){mx=-1});
    function st(e){var t=e.touches&&e.touches[0];if(!t)return;var r=sc.getBoundingClientRect();mx=(t.clientX-r.left)/r.width*W;my=(t.clientY-r.top)/r.height*H}
    S.on(sc,'touchstart',st,{passive:true});S.on(sc,'touchmove',st,{passive:true});S.on(sc,'touchend',function(){mx=-1},{passive:true});
    var rt;S.on(window,'resize',function(){clearTimeout(rt);rt=S.later(build,200)});
    build();if(D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){if(!S.dead)build()});
    S.watch(sc,function(v){sv=v});
    if(!rm)S.loop(function(t){if(sv&&g&&!D.hidden){pour(t);step();step();paint()}});
}
