'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {Menu,X,ArrowUpRight} from 'lucide-react';
import {navItems} from '@/content/landing';
import {routes} from '@/lib/paths';

export function LandingNav(){
 const [solid,setSolid]=useState(false);
 const [active,setActive]=useState<string|null>(null);
 const [open,setOpen]=useState(false);
 const toggleRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const onScroll=()=>setSolid(window.scrollY>24);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
  return ()=>window.removeEventListener('scroll',onScroll);
 },[]);
 useEffect(()=>{
  const sections=navItems.map(n=>document.getElementById(n.id)).filter((el):el is HTMLElement=>!!el);
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive(e.target.id)},{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s=>io.observe(s));
  return ()=>io.disconnect();
 },[]);
 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggleRef.current?.focus()}};
  window.addEventListener('keydown',onKey);
  return ()=>window.removeEventListener('keydown',onKey);
 },[open]);
 const go=(id:string)=>(e:React.MouseEvent<HTMLAnchorElement>)=>{
  const el=document.getElementById(id);
  if(!el)return;
  e.preventDefault();
  setOpen(false);
  if(window.__lenis)window.__lenis.scrollTo(el,{offset:id==='top'?0:-64,duration:1.2});
  else el.scrollIntoView({block:'start'});
  history.replaceState(null,'',`#${id}`);
 };
 return <header className={'lp-nav'+(solid||open?' solid':'')}>
  <div className="lp-nav-bar">
   <a className="lp-wordmark" href="#top" onClick={go('top')} aria-label="ROOTSYNC, back to top"><span className="lp-mark" aria-hidden="true">R</span>ROOTSYNC</a>
   <nav className="lp-nav-links" aria-label="Page sections">
    {navItems.map(n=><a key={n.id} href={`#${n.id}`} onClick={go(n.id)} aria-current={active===n.id?'true':undefined}>{n.label}</a>)}
   </nav>
   <Link className="lp-btn primary small" href={routes.dashboard}>Launch Demo<ArrowUpRight size={15} aria-hidden="true"/></Link>
   <button ref={toggleRef} className="lp-nav-toggle" aria-expanded={open} aria-controls="lp-drawer" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X size={20} aria-hidden="true"/>:<Menu size={20} aria-hidden="true"/>}</button>
  </div>
  <nav id="lp-drawer" className="lp-drawer" aria-label="Page sections, mobile" hidden={!open}>
   {navItems.map(n=><a key={n.id} href={`#${n.id}`} onClick={go(n.id)} aria-current={active===n.id?'true':undefined}>{n.label}</a>)}
   <Link className="lp-btn primary" href={routes.dashboard}>Launch Live Demo<ArrowUpRight size={16} aria-hidden="true"/></Link>
  </nav>
 </header>;
}
