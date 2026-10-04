'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Lenis from 'lenis';

declare global{interface Window{__lenis?:Lenis}}

// All scroll and entrance motion for the landing page. With reduced motion the
// page is left exactly as rendered: nothing is hidden, pinned or moved.
export function LandingMotion(){
 useEffect(()=>{
  const page=document.querySelector<HTMLElement>('.lp');if(!page)return;
  page.classList.add('lp-ready');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){page.querySelectorAll('[data-live]').forEach(el=>el.classList.add('live'));return}
  // Looping scenes run only while they are actually visible. An IntersectionObserver is used
  // because it stays correct inside the pinned, sideways-moving R.O.O.T. track.
  const liveObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('live',e.isIntersecting)),{threshold:.2});
  page.querySelectorAll('[data-live]').forEach(el=>liveObserver.observe(el));
  gsap.registerPlugin(ScrollTrigger,SplitText);
  page.classList.add('lp-anim');
  const lenis=new Lenis({duration:1.1,smoothWheel:true});
  window.__lenis=lenis;
  lenis.on('scroll',ScrollTrigger.update);
  const tick=(t:number)=>lenis.raf(t*1000);
  gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  const ctx=gsap.context(()=>{
   // Hero entrance
   const h1=new SplitText('.lp-hero h1',{type:'lines',mask:'lines'});
   gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.lp-nav',{y:-24,autoAlpha:0,duration:.6},0)
    .fromTo('.lp-hero [data-intro]',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.7,stagger:.09},.15)
    .from(h1.lines,{yPercent:110,duration:1,stagger:.12},.25)
    .fromTo('.lp-orbit',{autoAlpha:0,scale:.9,rotate:-12},{autoAlpha:1,scale:1,rotate:0,duration:1.2,ease:'expo.out'},.45)
    .fromTo('.lp-hero-demo',{autoAlpha:0,y:60,rotationY:-30},{autoAlpha:1,y:0,rotationY:-14,rotationX:6,duration:1.3,ease:'expo.out'},.6)
    .fromTo('.lp-chip',{autoAlpha:0,scale:.8},{autoAlpha:1,scale:1,duration:.6,stagger:.12,ease:'back.out(1.6)'},1.1);
   gsap.to('.lp-hero-inner',{yPercent:-10,autoAlpha:.25,ease:'none',scrollTrigger:{trigger:'.lp-hero',start:'top top',end:'bottom top',scrub:true}});

   // Section headings: word-by-word rise
   gsap.utils.toArray<HTMLElement>('.lp [data-split]').forEach(el=>{
    const s=new SplitText(el,{type:'words',mask:'words'});
    gsap.from(s.words,{yPercent:110,duration:.8,ease:'power4.out',stagger:.035,scrollTrigger:{trigger:el,start:'top 86%'}});
   });
   // Generic reveals
   ScrollTrigger.batch('.lp [data-reveal]',{start:'top 88%',once:true,onEnter:els=>gsap.fromTo(els,{opacity:0,y:36},{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.08,overwrite:true})});
   // Opacity only: content waiting to be revealed stays reachable by keyboard and screen readers
   gsap.set('.lp [data-reveal]',{opacity:0,y:36});
   // Count-up numbers
   gsap.utils.toArray<HTMLElement>('.lp [data-count]').forEach(el=>{
    const end=Number(el.dataset.count),decimals=Number(el.dataset.decimals??0),o={v:0};
    const write=()=>{el.textContent=o.v.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})};
    gsap.to(o,{v:end,duration:1.8,ease:'power2.out',onUpdate:write,scrollTrigger:{trigger:el,start:'top 90%',once:true}});
   });
   // Parallax
   gsap.utils.toArray<HTMLElement>('.lp [data-parallax]').forEach(el=>gsap.fromTo(el,{yPercent:Number(el.dataset.parallax)},{yPercent:-Number(el.dataset.parallax),ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}}));
   // Demo screenshot unfolds from a tilted plane
   gsap.fromTo('.lp-mock-main',{rotateX:38,scale:.84,y:80},{rotateX:0,scale:1,y:0,ease:'none',scrollTrigger:{trigger:'.lp-mock',start:'top 95%',end:'top 25%',scrub:.6}});
   // Closing statement: the lead rises, the main line unrolls, then the three key words are marked one by one
   gsap.timeline({scrollTrigger:{trigger:'.lp-closing',start:'top 68%'},defaults:{ease:'power4.out'}})
    .from('.lp-closing-lead',{y:30,opacity:0,duration:.8})
    .fromTo('.lp-closing-main',{clipPath:'inset(0 0 100% 0)',y:50},{clipPath:'inset(0 0 0% 0)',y:0,duration:1.3},.25)
    .call(()=>document.querySelectorAll('.lp-closing mark').forEach((m,i)=>window.setTimeout(()=>m.classList.add('lit'),i*380)),undefined,1.2)
    .from('.lp-closing-wrap .lp-btn',{y:20,opacity:0,duration:.6},2.2);
   gsap.to('.lp-closing-wrap',{'--glow':1,ease:'none',scrollTrigger:{trigger:'.lp-closing-wrap',start:'top 90%',end:'top 20%',scrub:true}});
   // Hero demo window leans toward the pointer
   const demoCard=document.querySelector<HTMLElement>('.lp-hero-demo'),heroEl=document.querySelector<HTMLElement>('.lp-hero');
   if(demoCard&&heroEl&&window.matchMedia('(pointer: fine)').matches){
    const rx=gsap.quickTo(demoCard,'rotationX',{duration:.6,ease:'power3'}),ry=gsap.quickTo(demoCard,'rotationY',{duration:.6,ease:'power3'});
    heroEl.addEventListener('pointermove',e=>{const r=heroEl.getBoundingClientRect();ry(-14+((e.clientX-r.left)/r.width-.5)*14);rx(6-((e.clientY-r.top)/r.height-.5)*10)});
   }
   // Same-signal waveform draws in
   gsap.fromTo('.lp-wave path',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut',stagger:.2,scrollTrigger:{trigger:'.lp-wave',start:'top 78%'}});

   const mm=gsap.matchMedia();
   mm.add('(min-width: 901px)',()=>{
    // R.O.O.T. panels travel sideways while the section is pinned
    const track=document.querySelector<HTMLElement>('.lp-h-track');
    page.classList.add('lp-hpin');
    if(track){
     const dist=()=>track.scrollWidth-document.documentElement.clientWidth;
     gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.lp-hscroll',start:'top top',end:()=>`+=${dist()}`,pin:true,scrub:.7,invalidateOnRefresh:true,anticipatePin:1,
      onUpdate:self=>gsap.set('.lp-h-progress i',{scaleX:self.progress})}});
    }
    return ()=>page.classList.remove('lp-hpin');
   });
  },page);
  const refresh=()=>{ScrollTrigger.sort();ScrollTrigger.refresh()};
  refresh();
  document.fonts?.ready.then(refresh);window.addEventListener('load',refresh);
  return ()=>{window.removeEventListener('load',refresh);liveObserver.disconnect();page.classList.remove('lp-anim');ctx.revert();gsap.ticker.remove(tick);lenis.destroy();delete window.__lenis;page.classList.remove('lp-ready')};
 },[]);
 return null;
}
