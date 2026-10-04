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
  // Below this width the hero stacks and the demo window sits nearly flat so nothing is cut off
  const stacked=window.matchMedia('(max-width: 1080px)').matches;
  const ctx=gsap.context(()=>{
   // Hero entrance
   const h1=new SplitText('.lp-hero h1',{type:'lines',mask:'lines'});
   gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.lp-nav',{y:-24,autoAlpha:0,duration:.6},0)
    .fromTo('.lp-hero [data-intro]',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.7,stagger:.09},.15)
    .from(h1.lines,{yPercent:110,duration:1,stagger:.12},.25)
    .fromTo('.lp-orbit',{autoAlpha:0,scale:.9,rotate:-12},{autoAlpha:1,scale:1,rotate:0,duration:1.2,ease:'expo.out'},.45)
    .fromTo('.lp-hero-demo',{autoAlpha:0,y:60,rotationY:stacked?-12:-30},{autoAlpha:1,y:0,rotationY:stacked?-4:-14,rotationX:stacked?2:6,duration:1.3,ease:'expo.out'},.6)
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
   if(demoCard&&heroEl&&!stacked&&window.matchMedia('(pointer: fine)').matches){
    const rx=gsap.quickTo(demoCard,'rotationX',{duration:.6,ease:'power3'}),ry=gsap.quickTo(demoCard,'rotationY',{duration:.6,ease:'power3'});
    heroEl.addEventListener('pointermove',e=>{const r=heroEl.getBoundingClientRect();ry(-14+((e.clientX-r.left)/r.width-.5)*14);rx(6-((e.clientY-r.top)/r.height-.5)*10)});
   }
   // Same signal, different cause: the vibrating signal lands first, the fork draws, then each asset slides in and its cause chain pops step by step
   gsap.timeline({scrollTrigger:{trigger:'.lp-same-grid',start:'top 74%'},defaults:{ease:'power3.out'}})
    .from('.lp-same-signal',{x:stacked?0:-70,y:stacked?40:0,opacity:0,duration:.7})
    .from('.lp-wave g',{scaleY:0,transformOrigin:'50% 50%',duration:1.1,ease:'elastic.out(1.1,.35)'},.2)
    .from('.lp-fork',{clipPath:'inset(0 100% 0 0)',duration:.6,ease:'power2.inOut'},.7)
    .from('.lp-same-cases article',{x:stacked?0:110,y:stacked?50:0,opacity:0,rotate:stacked?0:2,duration:.75,stagger:.28,ease:'back.out(1.5)'},1)
    .from('.lp-same-cases li',{scale:.4,opacity:0,duration:.4,stagger:.11,ease:'back.out(2.2)'},1.35);

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
