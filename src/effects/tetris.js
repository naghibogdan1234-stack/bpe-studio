/* Tetris: piesele cad și se blochează într-un zid plin, apoi zidul se golește. Blocul TetrisWall. */
export function initTetris(tc, S, palette){
  var D=document,rm=false,PAL=palette||['#1f44d6','#cfdcff','#5b7cff','#ffffff'],ctx=tc.getContext('2d'),tv=false,cs=0
    var COLS=10,ROWS=14,FILL=8;
    var BASE=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[1,1]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[2,0],[2,1]],[[0,0],[1,0],[1,1],[2,1]],[[1,0],[2,0],[0,1],[1,1]]];
    var ORI=[],seenO={};
    BASE.forEach(function(b){var c=b;for(var r=0;r<4;r++){c=c.map(function(p){return [p[1],-p[0]]});
      var s=c.slice().sort(function(a,b){return a[1]-b[1]||a[0]-b[0]}),a=s[0],n=s.map(function(p){return [p[0]-a[0],p[1]-a[1]]}),k=JSON.stringify(n);if(!seenO[k]){seenO[k]=1;ORI.push(n)}}});
    function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=a[i];a[i]=a[j];a[j]=t}return a}
    function tiling(){
      for(var tries=0;tries<60;tries++){
        var g=new Int16Array(COLS*FILL).fill(-1),ps=[],nodes=0;
        var ok=(function rec(){
          if(++nodes>4000)return false;
          var i=g.indexOf(-1);if(i<0)return true;var x=i%COLS,y=i/COLS|0,os=shuffle(ORI.slice());
          for(var o=0;o<os.length;o++){var c=os[o].map(function(p){return [x+p[0],y+p[1]]});
            if(c.every(function(p){return p[0]>=0&&p[0]<COLS&&p[1]>=0&&p[1]<FILL&&g[p[1]*COLS+p[0]]<0})){
              var id=ps.length;c.forEach(function(p){g[p[1]*COLS+p[0]]=id});ps.push({c:c,col:PAL[(Math.random()*4)|0]});
              if(rec())return true;ps.pop();c.forEach(function(p){g[p[1]*COLS+p[0]]=-1})}}
          return false})();
        if(!ok)continue;
        /* drop order: a piece waits for everything beneath it */
        var done=[],order=[],left=ps.length,prog=true;
        while(left&&prog){prog=false;for(var k=0;k<ps.length;k++){if(done[k])continue;
          var free=ps[k].c.every(function(p){for(var yy=0;yy<p[1];yy++){var b=g[yy*COLS+p[0]];if(b!==k&&!done[b])return false}return true});
          if(free){done[k]=1;order.push(ps[k]);left--;prog=true;break}}}
        if(!left)return order;
      }
      return [];
    }
    var order=[],idx=0,py=0,locked=[],phase='fall',pt=0,lockT=[];
    function reset(){order=tiling();idx=0;locked=[];lockT=[];phase='fall';py=ROWS+1}
    function size(){var r=tc.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);tc.width=Math.round(r.width*d);tc.height=Math.round(r.height*d);cs=tc.width/COLS}
    function cell(x,y,col,sq){var g=Math.max(1.5,cs*.04);ctx.fillStyle=col;ctx.fillRect(x*cs+g,tc.height-(y+1)*cs+g+(sq||0),cs-2*g,cs-2*g-(sq||0))}
    function draw(now,dt){
      ctx.clearRect(0,0,tc.width,tc.height);
      locked.forEach(function(p,i){var a=Math.min(1,(now-lockT[i])/160),sq=(1-a)*cs*.18;p.c.forEach(function(c){cell(c[0],c[1],p.col,sq)})});
      if(phase==='fall'){
        var p=order[idx];if(!p){phase='hold';pt=now;return}
        py-=dt*.03*(1+ (ROWS-py)*.08);
        if(py<=0){locked.push(p);lockT.push(now);idx++;py=ROWS-FILL+2}
        else p.c.forEach(function(c){cell(c[0],c[1]+py,p.col)});
      }else if(phase==='hold'){if(now-pt>900){phase='clear';pt=now}}
      else{ /* rows flash bone then vanish, bottom to top */
        var k=(now-pt)/110;
        ctx.clearRect(0,0,tc.width,tc.height);
        locked.forEach(function(p){p.c.forEach(function(c){var d=k-c[1];if(d<0)cell(c[0],c[1],p.col);else if(d<1.6)cell(c[0],c[1],'#ffffff')})});
        if(k>FILL+2.5)reset();
      }
    }
    size();S.on(window,'resize',size);reset();S.watch(tc,function(v){tv=v});
    if(rm){order.forEach(function(p){locked.push(p);lockT.push(0)});draw(1e6,0)}
    else{var tl=performance.now();S.loop(function(now){var dt=Math.min(50,now-tl);tl=now;if(tv&&!D.hidden)draw(now,dt)})}
  
}
