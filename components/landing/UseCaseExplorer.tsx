'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,FlaskConical,Wrench,BadgeCheck,AlertTriangle} from 'lucide-react';
import type {UseCase} from '@/content/landing';
import type {Series} from '@/lib/landing-data';
import {routes} from '@/lib/paths';

type Props={cases:UseCase[];series:Record<'ko'|'he',Series[]>;impact:Record<'ko'|'he',{label:string;value:string}[]>};
const icons=[FlaskConical,Wrench,BadgeCheck];

function Trend({s}:{s:Series}){
 const w=320,h=130,padX=6,padTop=16,padBottom=10;
 const values=s.points.map(p=>p.value);
 const max=Math.max(...values,s.trip,s.alarm),min=Math.min(...values,s.trip,s.alarm),span=max-min||1;
 const x=(i:number)=>padX+i*(w-padX*2)/(s.points.length-1);
 const y=(v:number)=>padTop+(1-(v-min)/span)*(h-padTop-padBottom);
 const path=s.points.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
 const peak=s.points[s.tripIndex];
 return <figure className="lp-trend">
  <figcaption><strong>{s.label}</strong><span>{peak.value.toLocaleString('en-US')} {s.unit} at trip</span></figcaption>
  <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={s.summary}>
   <line x1={padX} x2={w-padX} y1={y(s.trip)} y2={y(s.trip)} className="trip"/>
   <line x1={padX} x2={w-padX} y1={y(s.alarm)} y2={y(s.alarm)} className="alarm"/>
   <path d={`${path} L${x(s.points.length-1)} ${h} L${x(0)} ${h} Z`} className="area"/>
   <path d={path} className="line" pathLength={1}/>
   <circle cx={x(s.tripIndex)} cy={y(peak.value)} r="9" className="ping"/>
   <circle cx={x(s.tripIndex)} cy={y(peak.value)} r="4" className="peak"/>
  </svg>
  <p className="lp-source">Weekly record · alert {s.alarm} · trip {s.trip} {s.unit}</p>
 </figure>;
}

export function UseCaseExplorer({cases,series,impact}:Props){
 const [selected,setSelected]=useState(cases[0].id);
 const tabs=useRef<Record<string,HTMLButtonElement|null>>({});
 const onKey=(e:React.KeyboardEvent)=>{
  const i=cases.findIndex(c=>c.id===selected);
  const next=e.key==='ArrowRight'?(i+1)%cases.length:e.key==='ArrowLeft'?(i-1+cases.length)%cases.length:e.key==='Home'?0:e.key==='End'?cases.length-1:-1;
  if(next<0)return;
  e.preventDefault();
  setSelected(cases[next].id);
  tabs.current[cases[next].id]?.focus();
 };
 return <div className="lp-usecases" data-live>
  <div className="lp-tabs" role="tablist" aria-label="Use case" onKeyDown={onKey}>
   {cases.map(c=><button key={c.id} ref={el=>{tabs.current[c.id]=el}} role="tab" id={`uc-tab-${c.id}`} aria-selected={selected===c.id} aria-controls={`uc-panel-${c.id}`} tabIndex={selected===c.id?0:-1} onClick={()=>setSelected(c.id)}><span>{c.tag}</span>{c.title}</button>)}
  </div>
  {cases.map(c=><section key={c.id} role="tabpanel" id={`uc-panel-${c.id}`} aria-labelledby={`uc-tab-${c.id}`} hidden={selected!==c.id} className="lp-usecase" tabIndex={0}>
   <div className="lp-usecase-top">
    <div>
     <p className="lp-kicker">{c.service} · {c.operator}</p>
     <h3>{c.hook}</h3>
     <dl className="lp-usecase-impact">{impact[c.id].map(m=><div key={m.label}><dd>{m.value}</dd><dt>{m.label}</dt></div>)}</dl>
    </div>
    <div className="lp-usecase-trends">{series[c.id].map(s=><Trend key={s.label} s={s}/>)}</div>
   </div>
   <ol className="lp-chain" aria-label="Mechanism reported by the post-event RCA">{c.mechanism.map((m,i)=><li key={m} className={i===c.mechanism.length-1?'trip':undefined} style={{'--i':i} as React.CSSProperties}><span>{i===c.mechanism.length-1&&<AlertTriangle size={16} aria-hidden="true"/>}{m}</span></li>)}</ol>
   <p className="lp-source">Mechanism as reported by the post-event RCA. Before the event it is a hypothesis to test.</p>
   <ul className="lp-cards">{c.cards.map((b,i)=>{const Icon=icons[i];return <li key={b.label}><Icon size={22} aria-hidden="true"/><h4>{b.label}</h4><p>{b.text}</p></li>})}</ul>
   <footer className="lp-usecase-foot"><Link className="lp-btn navy" href={routes[c.cta.route]}>{c.cta.label}<ArrowUpRight size={16} aria-hidden="true"/></Link><ul className="lp-limits" aria-label="Evidence limits kept visible">{c.limits.map(l=><li key={l}>{l}</li>)}</ul></footer>
  </section>)}
 </div>;
}
