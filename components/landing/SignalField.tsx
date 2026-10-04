'use client';
import {useEffect,useRef} from 'react';

// Decorative hero background: drifting signal points that link when they come
// close and lean toward the pointer. No data is represented here.
export function SignalField(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,raf=0,running=true;
  const pointer={x:-9999,y:-9999};
  type P={x:number;y:number;vx:number;vy:number;r:number;hot:boolean};
  let points:P[]=[];
  const resize=()=>{
   const dpr=Math.min(window.devicePixelRatio||1,2);
   w=canvas.clientWidth;h=canvas.clientHeight;
   canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
   const n=Math.min(110,Math.round(w*h/13000));
   points=Array.from({length:n},(_,i)=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1+Math.random()*1.8,hot:i%11===0}));
  };
  const draw=()=>{
   ctx.clearRect(0,0,w,h);
   for(const p of points){
    if(!reduce){
     const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.hypot(dx,dy);
     if(d<220&&d>1){p.vx+=dx/d*.012;p.vy+=dy/d*.012}
     p.vx*=.992;p.vy*=.992;p.x+=p.vx;p.y+=p.vy;
     if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;if(p.y<-20)p.y=h+20;if(p.y>h+20)p.y=-20;
    }
   }
   for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<130){ctx.strokeStyle=`rgba(143,197,234,${(1-d/130)*.32})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
   }
   for(const p of points){ctx.fillStyle=p.hot?'rgba(224,222,80,.95)':'rgba(143,197,234,.8)';ctx.beginPath();ctx.arc(p.x,p.y,p.hot?p.r+1:p.r,0,Math.PI*2);ctx.fill()}
   if(!reduce&&running)raf=requestAnimationFrame(draw);
  };
  const onMove=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top};
  const io=new IntersectionObserver(([e])=>{const was=running;running=e.isIntersecting;if(running&&!was&&!reduce)raf=requestAnimationFrame(draw)});
  resize();draw();io.observe(canvas);
  window.addEventListener('resize',resize);window.addEventListener('pointermove',onMove,{passive:true});
  return ()=>{running=false;cancelAnimationFrame(raf);io.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',onMove)};
 },[]);
 return <canvas ref={ref} className="lp-signal-field" aria-hidden="true"/>;
}
