'use client';
import {useEffect,useMemo,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {Family} from '@/lib/landing-data';

type Scene={kicker:string;title:string;body:string};
const W=1000,H=520,UNIT=13,COLS=5,BASE=446;
const tones=['#e0de50','#5fb6e6','#9fd0f2'];
const muted='#5f79a3';

// One dot per recorded incident. The same 380 dots are arranged three ways:
// scattered, one per asset, and stacked by failure family.
export function IncidentField({families,total,scenes,share}:{families:Family[];total:number;scenes:Scene[];share:string}){
 const root=useRef<HTMLDivElement>(null);
 const dots=useMemo(()=>{
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const gridCols=38,gx=(W-gridCols*24)/2+12,gy=96;
  const order=Array.from({length:total},(_,i)=>i).sort(()=>rnd()-.5);
  const out:{a:[number,number];b:[number,number];c:[number,number];fill:string;repeat:boolean}[]=[];
  const blockW=COLS*UNIT,gap=(W-families.length*blockW)/(families.length+1);
  let n=0;
  families.forEach((f,fi)=>{
   const x0=gap+fi*(blockW+gap);
   for(let k=0;k<f.count;k++,n++){
    const slot=order[n];
    out.push({
     a:[+(30+rnd()*(W-60)).toFixed(1),+(30+rnd()*(H-60)).toFixed(1)],
     b:[gx+(slot%gridCols)*24,gy+Math.floor(slot/gridCols)*34],
     c:[+(x0+(k%COLS)*UNIT+UNIT/2).toFixed(1),BASE-Math.floor(k/COLS)*UNIT],
     fill:fi<3?tones[fi]:muted,
     repeat:slot===201||slot===202,
    });
   }
  });
  return {out,blockW,gap};
 },[families,total]);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const el=root.current;if(!el)return;
  const mm=gsap.matchMedia();
  const build=(mode:'pin'|'play'|'static')=>{
   const circles=el.querySelectorAll<SVGCircleElement>('circle.dot');
   const caps=el.querySelectorAll<HTMLElement>('.lp-field-cap');
   const tl=gsap.timeline({defaults:{ease:'power3.inOut'},paused:mode==='static'});
   gsap.set(caps,{autoAlpha:0,y:24});gsap.set(caps[0],{autoAlpha:1,y:0});
   tl.to(circles,{attr:{cx:i=>dots.out[i].b[0],cy:i=>dots.out[i].b[1]},duration:1.4,stagger:{amount:.5,from:'random'}},.4)
    .to(caps[0],{autoAlpha:0,y:-24,duration:.4},.4).to(caps[1],{autoAlpha:1,y:0,duration:.5},.9)
    .to('.dot.repeat',{attr:{r:8},fill:'#e0de50',duration:.5},1.9)
    .to(circles,{attr:{cx:i=>dots.out[i].c[0],cy:i=>dots.out[i].c[1],r:4.6},fill:i=>dots.out[i].fill,duration:1.6,stagger:{amount:.6,from:'random'}},3)
    .to(caps[1],{autoAlpha:0,y:-24,duration:.4},3).to(caps[2],{autoAlpha:1,y:0,duration:.5},3.6)
    .fromTo(el.querySelectorAll('.lp-field-label'),{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.5,stagger:.04},4.4)
    .fromTo(el.querySelector('.lp-field-legend'),{autoAlpha:0},{autoAlpha:1,duration:.5},4.6)
    .to({}, {duration:.6});
   if(mode==='static'){tl.progress(1);return}
   ScrollTrigger.create(mode==='pin'
    ?{trigger:el,start:'top top',end:'+=260%',pin:true,scrub:.8,animation:tl,anticipatePin:1}
    :{trigger:el,start:'top 65%',animation:tl,toggleActions:'play none none none'});
   if(mode==='play')tl.timeScale(.75);
  };
  mm.add('(prefers-reduced-motion: reduce)',()=>build('static'));
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)',()=>build('pin'));
  mm.add('(prefers-reduced-motion: no-preference) and (max-width: 900px)',()=>build('play'));
  return ()=>mm.revert();
 },[dots]);
 const top=families.slice(0,3);
 return <div className="lp-field" ref={root}>
  <div className="lp-field-caps">{scenes.map(s=><div className="lp-field-cap" key={s.title}><p className="lp-kicker">{s.kicker}</p><h3>{s.title}</h3><p>{s.body}</p></div>)}</div>
  <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${total} recorded incidents shown as dots. Grouped by failure family, leakage has ${top[0].count}, vibration ${top[1].count} and worn out ${top[2].count}, together ${share} of all incidents.`}>
   {dots.out.map((d,i)=><circle key={i} className={'dot'+(d.repeat?' repeat':'')} cx={d.a[0]} cy={d.a[1]} r="4" fill="#8fc5ea"/>)}
   {families.map((f,i)=>{const x=dots.gap+i*(dots.blockW+dots.gap)+dots.blockW/2,rows=Math.ceil(f.count/COLS);return <g className="lp-field-label" key={f.name}><text className="n" x={x} y={BASE-rows*UNIT-6}>{f.count}</text><text x={x} y={BASE+26}>{f.name}</text></g>})}
  </svg>
  <ul className="lp-field-legend">{top.map((f,i)=><li key={f.name}><i style={{background:tones[i]}}/>{f.name} <b>{f.count}</b></li>)}<li className="share"><b>{share}</b> of all incidents</li></ul>
  <p className="lp-source">Source: Incident Database, failure-mechanism field. Family labels are normalized and are not verified causes.</p>
 </div>;
}
