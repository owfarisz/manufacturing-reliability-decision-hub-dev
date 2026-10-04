'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {Family} from '@/lib/landing-data';

type Scene={kicker:string;title:string;body:string};
type Dot={a:[number,number];b:[number,number];c:[number,number];fill:string;repeat:boolean};
type Layout={w:number;h:number;r:number;dots:Dot[];labels:{name:string;count:number;x:number;y:number;ny:number;anchor:'middle'|'start'}[]};
const tones=['#e0de50','#5fb6e6','#9fd0f2'];
const muted='#5f79a3';

// Wide screens stack each family as a column. Phones get a taller canvas with
// one band per family, so the dots stay large enough to read.
function buildLayout(families:Family[],total:number,compact:boolean):Layout{
 let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 const w=compact?600:1000,unit=compact?14:13;
 const order=Array.from({length:total},(_,i)=>i).sort(()=>rnd()-.5);
 const gridCols=compact?20:38,gridStep=compact?28:24,gridRow=compact?30:34;
 const gx=(w-(gridCols-1)*gridStep)/2,gy=compact?40:96;
 const perLine=compact?40:5;
 const dots:Dot[]=[],labels:Layout['labels']=[];
 let h=compact?0:520,n=0,cursor=compact?26:0;
 const blockW=perLine*unit,gap=compact?0:(w-families.length*blockW)/(families.length+1),base=446;
 families.forEach((f,fi)=>{
  const lines=Math.ceil(f.count/perLine);
  const x0=compact?(w-blockW)/2:gap+fi*(blockW+gap);
  if(compact)labels.push({name:f.name,count:f.count,x:x0,y:cursor,ny:cursor,anchor:'start'});
  else labels.push({name:f.name,count:f.count,x:x0+blockW/2,y:base+26,ny:base-lines*unit-6,anchor:'middle'});
  const top=cursor+16;
  for(let k=0;k<f.count;k++,n++){
   const slot=order[n];
   dots.push({
    a:[0,0],
    b:[gx+(slot%gridCols)*gridStep,gy+Math.floor(slot/gridCols)*gridRow],
    c:compact?[+(x0+(k%perLine)*unit+unit/2).toFixed(1),top+Math.floor(k/perLine)*unit+unit/2]:[+(x0+(k%perLine)*unit+unit/2).toFixed(1),base-Math.floor(k/perLine)*unit],
    fill:fi<3?tones[fi]:muted,
    repeat:slot===201||slot===202,
   });
  }
  if(compact)cursor=top+lines*unit+30;
 });
 if(compact)h=Math.max(cursor,gy+Math.ceil(total/gridCols)*gridRow+20);
 dots.forEach(d=>{d.a=[+(24+rnd()*(w-48)).toFixed(1),+(24+rnd()*(h-48)).toFixed(1)]});
 return {w,h,r:compact?5:4,dots,labels};
}

// One dot per recorded incident. The same 380 dots are arranged three ways:
// scattered, one per asset, and grouped by failure family.
export function IncidentField({families,total,scenes,share}:{families:Family[];total:number;scenes:Scene[];share:string}){
 const root=useRef<HTMLDivElement>(null);
 const [compact,setCompact]=useState(false);
 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 640px)');
  const sync=()=>setCompact(mq.matches);
  sync();mq.addEventListener('change',sync);
  return ()=>mq.removeEventListener('change',sync);
 },[]);
 const layout=useMemo(()=>buildLayout(families,total,compact),[families,total,compact]);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const el=root.current;if(!el)return;
  const mm=gsap.matchMedia();
  const build=(mode:'pin'|'play'|'static')=>{
   const circles=el.querySelectorAll<SVGCircleElement>('circle.dot');
   const caps=el.querySelectorAll<HTMLElement>('.lp-field-cap');
   const tl=gsap.timeline({defaults:{ease:'power3.inOut'},paused:mode==='static'});
   gsap.set(caps,{autoAlpha:0,y:24});gsap.set(caps[0],{autoAlpha:1,y:0});
   tl.to(circles,{attr:{cx:i=>layout.dots[i].b[0],cy:i=>layout.dots[i].b[1]},duration:1.4,stagger:{amount:.5,from:'random'}},.4)
    .to(caps[0],{autoAlpha:0,y:-24,duration:.4},.4).to(caps[1],{autoAlpha:1,y:0,duration:.5},.9)
    .to('.dot.repeat',{attr:{r:layout.r*2},fill:'#e0de50',duration:.5},1.9)
    .to(circles,{attr:{cx:i=>layout.dots[i].c[0],cy:i=>layout.dots[i].c[1],r:layout.r+.6},fill:i=>layout.dots[i].fill,duration:1.6,stagger:{amount:.6,from:'random'}},3)
    .to(caps[1],{autoAlpha:0,y:-24,duration:.4},3).to(caps[2],{autoAlpha:1,y:0,duration:.5},3.6)
    .fromTo(el.querySelectorAll('.lp-field-label'),{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.5,stagger:.04},4.4)
    .fromTo(el.querySelector('.lp-field-legend'),{autoAlpha:0},{autoAlpha:1,duration:.5},4.6)
    .to({}, {duration:.6});
   if(mode==='static'){tl.progress(1);return}
   ScrollTrigger.create(mode==='pin'
    ?{trigger:el,start:'top top',end:'+=260%',pin:true,scrub:.8,animation:tl,anticipatePin:1}
    :{trigger:el.querySelector('svg'),start:'top 70%',animation:tl,toggleActions:'play none none none'});
  };
  mm.add('(prefers-reduced-motion: reduce)',()=>build('static'));
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)',()=>build('pin'));
  mm.add('(prefers-reduced-motion: no-preference) and (max-width: 900px)',()=>build('play'));
  return ()=>mm.revert();
 },[layout]);
 const top=families.slice(0,3);
 return <div className={'lp-field'+(compact?' compact':'')} ref={root}>
  <div className="lp-field-caps">{scenes.map(s=><div className="lp-field-cap" key={s.title}><p className="lp-kicker">{s.kicker}</p><h3>{s.title}</h3><p>{s.body}</p></div>)}</div>
  <svg key={compact?'compact':'wide'} viewBox={`0 0 ${layout.w} ${layout.h}`} role="img" aria-label={`${total} recorded incidents shown as dots. Grouped by failure family, leakage has ${top[0].count}, vibration ${top[1].count} and worn out ${top[2].count}, together ${share} of all incidents.`}>
   {layout.dots.map((d,i)=><circle key={i} className={'dot'+(d.repeat?' repeat':'')} cx={d.a[0]} cy={d.a[1]} r={layout.r} fill="#8fc5ea"/>)}
   {layout.labels.map(l=><g className="lp-field-label" key={l.name}>{l.anchor==='start'?<text x={l.x} y={l.y} textAnchor="start"><tspan className="n">{l.count}</tspan><tspan dx="8">{l.name}</tspan></text>:<><text className="n" x={l.x} y={l.ny}>{l.count}</text><text x={l.x} y={l.y}>{l.name}</text></>}</g>)}
  </svg>
  <ul className="lp-field-legend">{top.map((f,i)=><li key={f.name}><i style={{background:tones[i]}}/>{f.name} <b>{f.count}</b></li>)}<li className="share"><b>{share}</b> of all incidents</li></ul>
  <p className="lp-source">Source: Incident Database, failure-mechanism field. Family labels are normalized and are not verified causes.</p>
 </div>;
}
