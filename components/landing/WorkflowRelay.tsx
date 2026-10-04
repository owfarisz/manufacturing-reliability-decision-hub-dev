'use client';
import {useEffect,useRef,useState} from 'react';
import {AlertTriangle,Check,MousePointer2,Pause,Play} from 'lucide-react';
import type {WorkflowStep} from '@/content/landing';

const STEP_MS=1700;

// The eight workflow steps as a relay. A pulse moves from owner to owner and the
// small screen underneath shows what that person does at that step.
export function WorkflowRelay({steps}:{steps:WorkflowStep[]}){
 const [active,setActive]=useState(0);
 const [playing,setPlaying]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const stopped=useRef(false);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const io=new IntersectionObserver(([e])=>{if(!stopped.current)setPlaying(e.isIntersecting)},{threshold:.35});
  io.observe(el);
  return ()=>io.disconnect();
 },[]);
 useEffect(()=>{
  if(!playing)return;
  const t=window.setInterval(()=>setActive(a=>(a+1)%steps.length),STEP_MS);
  return ()=>window.clearInterval(t);
 },[playing,steps.length]);
 const pick=(i:number)=>{stopped.current=true;setPlaying(false);setActive(i)};
 const toggle=()=>{stopped.current=playing;setPlaying(!playing)};
 const s=steps[active];
 return <div className="lp-relay-wrap" ref={root}>
  <ol className="lp-relay" style={{'--p':active/(steps.length-1)} as React.CSSProperties}>
   {steps.map((x,i)=><li key={x.step} className={i<active?'done':i===active?'on':undefined}>
    <button type="button" aria-pressed={i===active} onClick={()=>pick(i)}><span className="lp-relay-node">{i<active?<Check size={20} aria-hidden="true"/>:i+1}</span><strong>{x.step}</strong><small>{x.owner}</small></button>
   </li>)}
  </ol>
  <div className="lp-scene" aria-live="polite">
   <div className="lp-scene-who" key={`who-${active}`}>
    <p className="lp-kicker">Step {active+1} of {steps.length}</p>
    <h3>{s.step}</h3>
    <p className="lp-scene-role"><span aria-hidden="true">{s.owner.split(/[ ·/]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('')}</span>{s.owner}</p>
    <p>{s.does}</p>
   </div>
   <div className="lp-scene-screen" key={`screen-${active}`} aria-hidden="true">
    <div className="lp-scene-bar"><i/><i/><i/><span>{s.window}</span></div>
    <ul>{s.rows.map((r,i)=><li key={r.text} className={r.tone} style={{'--i':i} as React.CSSProperties}>{r.tone==='alert'?<AlertTriangle size={15}/>:r.tone==='ok'?<Check size={15}/>:<span className="dot"/>}{r.text}</li>)}</ul>
    <MousePointer2 className="lp-scene-cursor" size={22}/>
   </div>
   <ul className="lp-scene-rows">{s.rows.map(r=><li key={r.text}>{r.text}</li>)}</ul>
   <button type="button" className="lp-scene-toggle" onClick={toggle} aria-label={playing?'Pause the walkthrough':'Play the walkthrough'}>{playing?<Pause size={16} aria-hidden="true"/>:<Play size={16} aria-hidden="true"/>}</button>
  </div>
 </div>;
}
