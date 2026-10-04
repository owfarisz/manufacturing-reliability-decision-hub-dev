import Link from 'next/link';
import {ArrowUpRight,ArrowDown,ArrowRight,User,Check} from 'lucide-react';
import {hero,fieldScenes,sameSignal,dimensions,useCases,workflow,impact,demo,closing,navItems,type Dimension} from '@/content/landing';
import {evidenceStats,evidencePeriod,families,incidentTotal,topFamilyShare,heroReadings,useCaseSeries,useCaseImpact,impactBubbles} from '@/lib/landing-data';
import {routes,asset} from '@/lib/paths';
import {UseCaseExplorer} from './UseCaseExplorer';
import {SignalField} from './SignalField';
import {IncidentField} from './IncidentField';
import {WorkflowRelay} from './WorkflowRelay';

const css=(vars:Record<string,string|number>)=>vars as React.CSSProperties;

function Chapter({n,children}:{n:string;children:string}){return <p className="lp-chapter" data-reveal><span>{n}</span>{children}</p>}

function Orbit(){
 const nodes=[['R','Rank',210,40],['O','Organize',380,210],['O','Orchestrate',210,380],['T','Test',40,210]] as const;
 return <div className="lp-orbit" aria-hidden="true">
  <svg viewBox="0 0 420 420">
   <circle className="ring-outer" cx="210" cy="210" r="196"/>
   <circle className="ring" cx="210" cy="210" r="170"/>
   <circle className="ring-inner" cx="210" cy="210" r="112"/>
   <g className="comet"><circle cx="210" cy="40" r="7"/><path d="M210 40A170 170 0 0 0 96 84"/></g>
   {nodes.map(([l,name,x,y],i)=><g className="node" key={i} style={css({'--i':i})}><circle cx={x} cy={y} r="27"/><text x={x} y={y+8}>{l}</text><text className="name" x={x} y={i===0?y-40:i===2?y+52:y+50}>{name}</text></g>)}
  </svg>
  <div className="lp-orbit-core"><span>from</span><div className="lp-cycle">{[...hero.chain,hero.chain[0]].map((c,i)=><b key={i}>{c}</b>)}</div></div>
 </div>;
}

export function LandingHero(){
 const [vib]=heroReadings.ko,[dp]=heroReadings.he;
 return <section className="lp-hero" id="top" aria-labelledby="lp-hero-title">
  <SignalField/>
  <div className="lp-hero-inner">
   <div className="lp-hero-copy">
    <p className="lp-pill" data-intro><span aria-hidden="true"/>{hero.status}</p>
    <p className="lp-eyebrow" data-intro>{hero.eyebrow}</p>
    <h1 id="lp-hero-title">{hero.headline.map((line,i)=><span key={line} className={i===2?'accent':undefined}>{line} </span>)}</h1>
    <p className="lp-hero-body" data-intro>{hero.body}</p>
    <div className="lp-cta" data-intro>
     <Link className="lp-btn primary" href={routes.dashboard}>Launch Live Demo<ArrowUpRight size={17} aria-hidden="true"/></Link>
     <a className="lp-btn ghost" href="#evidence">Explore ROOTSYNC<ArrowDown size={17} aria-hidden="true"/></a>
    </div>
    <p className="lp-proposed" data-intro><img src={asset('/landing/caliber-logo.png')} alt="CALIBER, Chandra Asri Limitless Innovation and Business Strategy Challenge" width={530} height={275}/><span>Proposed for CALIBER 2026<b>by YAPYAP team</b></span></p>
   </div>
   <div className="lp-hero-visual">
    <Orbit/>
    <Link className="lp-hero-demo" href={routes.dashboard} aria-label="Open the live demo">
     <span className="lp-mock-bar" aria-hidden="true"><i/><i/><i/><span>rootsync / dashboard</span><b>Live demo</b></span>
     <span className="lp-hero-shots">{['dashboard','ko-3201','he-3301','actions'].map((n,i)=><img key={n} src={asset(`/landing/${n}.jpg`)} alt="" width={1440} height={900} style={css({'--i':i})} fetchPriority={i===0?'high':undefined} loading={i===0?undefined:'lazy'}/>)}</span>
     <span className="lp-hero-open">Open the workspace<ArrowUpRight size={15} aria-hidden="true"/></span>
    </Link>
    <ul className="lp-chips" aria-label="Recorded readings at the historical trip week">
     {[['KO-3201',vib],['HE-3301',dp]].map(([tag,r],i)=>{const x=r as typeof vib;return <li className={`lp-chip c${i}`} key={i}><small>{tag as string} · {x.label}</small><strong>{x.value} <em>{x.unit}</em></strong><small>recorded {x.date}</small></li>})}
    </ul>
   </div>
  </div>
  <div className="lp-ticker" aria-hidden="true"><div>{[...hero.ticker,...hero.ticker].map((t,i)=><span key={i}>{t}</span>)}</div></div>
 </section>;
}

export function EvidenceSection(){
 return <section className="lp-section lp-evidence" id="evidence" aria-labelledby="evidence-title">
  <Chapter n="01">The record</Chapter>
  <h2 id="evidence-title" data-split>Start from what the record says.</h2>
  <dl className="lp-stats">{evidenceStats.map(s=><div className="lp-stat" key={s.label} data-reveal><dd className="lp-stat-value">{s.prefix}<span data-count={s.value} data-decimals={s.decimals}>{s.value.toLocaleString('en-US',{minimumFractionDigits:s.decimals,maximumFractionDigits:s.decimals})}</span>{s.suffix}</dd><dt>{s.label}</dt><dd className="lp-source">{s.source}</dd></div>)}</dl>
  <p className="lp-source" data-reveal>Historical actuals from the case dataset, {evidencePeriod}. Recorded loss is not projected benefit.</p>
 </section>;
}

export function MechanismProblemSection(){
 // Eight identical 80-unit periods, so sliding the path left by one period loops without a seam.
 const wave='M-80 60'+Array.from({length:6},(_,i)=>{const x=-80+i*80;return ` C${x+13} 60 ${x+7} 14 ${x+20} 14 S${x+47} 106 ${x+60} 106 S${x+67} 60 ${x+80} 60`}).join('');
 return <section className="lp-section dark flush" id="problem" aria-labelledby="problem-title">
  <div className="lp-problem-head"><Chapter n="02">The problem</Chapter><h2 id="problem-title" data-split>379 assets failed once. Three mechanisms keep coming back.</h2></div>
  <IncidentField families={families} total={incidentTotal} scenes={fieldScenes} share={topFamilyShare}/>
  <div className="lp-same">
   <h3 data-split>{sameSignal.title}</h3>
   <div className="lp-same-grid" data-live>
    <div className="lp-same-signal"><svg className="lp-wave" viewBox="0 0 280 120" aria-hidden="true"><line x1="0" x2="280" y1="22" y2="22"/><g><path className="ghost" d={wave}/><path d={wave}/></g></svg><p><i aria-hidden="true"/>{sameSignal.signal}</p></div>
    <svg className="lp-fork" viewBox="0 0 120 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100C60 100 60 40 120 40"/><path d="M0 100C60 100 60 160 120 160"/></svg>
    <div className="lp-same-cases">{sameSignal.cases.map(c=><article key={c.tag}><p className="lp-tag">{c.tag} <span>{c.kind}</span></p><ol>{c.cause.map(x=><li key={x}>{x}</li>)}</ol></article>)}</div>
   </div>
   <p className="lp-takeaway" data-reveal>{sameSignal.takeaway}</p>
  </div>
 </section>;
}

function DimVisual({kind}:{kind:Dimension['visual']}){
 if(kind==='rank')return <div className="lp-viz rank">
  <p className="lp-viz-head"><span>Incoming alerts</span><b>Ranked queue</b></p>
  <ol>{[['Asset C',38,0,2],['Asset A',92,1,0],['Asset D',22,2,3],['Asset B',64,3,1]].map(([t,w,from,to])=><li key={t} style={css({'--w':`${w}%`,'--from':from,'--to':to})}><span>{t}</span><i/>{to===0&&<b>Decide first</b>}</li>)}</ol>
  <p className="lp-viz-foot">Illustrative · scored on consequence, evidence, urgency</p>
 </div>;
 if(kind==='organize')return <div className="lp-viz organize">
  <ul className="src">{['Hourly tag · mm/s','Weekly record · micron','Lab sample · ppm','RCA deck'].map((t,i)=><li key={t} style={css({'--i':i})}>{t}</li>)}</ul>
  <ArrowRight className="flow" size={22}/>
  <div className="ledger"><p>One incident view</p><ul>{[['ok','Supporting','Water rose before vibration'],['no','Contradicting','Surge margin normal'],['gap','Missing','Cooler leak test']].map(([c,k,t],i)=><li key={k} className={c} style={css({'--i':i})}><b>{k}</b>{t}</li>)}</ul></div>
  <p className="lp-viz-foot">Unlike units stay separate. Every value keeps its source.</p>
 </div>;
 if(kind==='orchestrate')return <div className="lp-viz orchestrate">
  <div className="ticket"><p><span>Intervention</span>Cooler leak test</p><ul>{['Owner','Approver','Window','Criteria'].map((t,i)=><li key={t} style={css({'--i':i})}><i><Check size={13}/></i>{t}</li>)}</ul><b>Approved</b></div>
  <div className="stations"><i className="token"/>{['Engineer','Approver','Planner','Technician'].map((t,i)=><div key={t} style={css({'--i':i})}><User size={16}/><span>{t}</span></div>)}</div>
 </div>;
 return <div className="lp-viz test">
  <svg viewBox="0 0 300 110"><line x1="0" x2="300" y1="38" y2="38"/><path pathLength={1} d="M0 96C50 90 80 64 120 38S160 10 176 10L182 96C220 100 260 98 300 97"/></svg>
  <ul>{['Equipment restored','Actions completed','Risk reduction verified'].map((t,i)=><li key={t} style={css({'--i':i})}><i><Check size={13}/></i>{t}</li>)}</ul>
  <b>Case closed</b>
 </div>;
}

export function RootFrameworkSection(){
 return <section className="lp-hscroll" id="root" aria-labelledby="root-title">
  <div className="lp-h-head"><Chapter n="03">How R.O.O.T. works</Chapter><h2 id="root-title" data-split>One governed loop. Four moves.</h2><div className="lp-h-progress" aria-hidden="true"><i/></div></div>
  <div className="lp-h-track">{dimensions.map((d,i)=><article className="lp-dim" key={i} data-live>
   <span className="lp-dim-letter" aria-hidden="true">{d.letter}</span>
   <div className="lp-dim-copy"><p className="lp-kicker">{String(i+1).padStart(2,'0')} · {d.question}</p><h3>{d.name}</h3><p>{d.definition}</p><p className="lp-shift"><span>{d.from}</span><ArrowRight size={15} aria-hidden="true"/><strong>{d.to}</strong></p></div>
   <div aria-hidden="true"><DimVisual kind={d.visual}/></div>
  </article>)}</div>
 </section>;
}

export function UseCaseSection(){
 return <section className="lp-section" id="use-cases" aria-labelledby="usecases-title">
  <Chapter n="04">Use cases</Chapter>
  <h2 id="usecases-title" data-split>Two anchor cases. Two different mechanisms.</h2>
  <div data-reveal><UseCaseExplorer cases={useCases} series={useCaseSeries} impact={useCaseImpact}/></div>
 </section>;
}

export function WorkflowSection(){
 return <section className="lp-section tint" id="workflow" aria-labelledby="workflow-title">
  <Chapter n="05">Human workflow</Chapter>
  <h2 id="workflow-title" data-split>{workflow.title}</h2>
  <div data-reveal><WorkflowRelay steps={workflow.steps}/></div>
  <p className="lp-source" data-reveal>{workflow.note}</p>
 </section>;
}

export function ImpactSection(){
 const max=impactBubbles[0].amount;
 return <section className="lp-section" id="impact" aria-labelledby="impact-title">
  <Chapter n="06">Impact</Chapter>
  <h2 id="impact-title" data-split>{impact.title}</h2>
  <ol className="lp-bubbles">{impactBubbles.map(b=><li key={b.kind} className={b.tone} data-reveal><div className="lp-bubble-stage" aria-hidden="true"><i style={css({'--k':Math.sqrt(b.amount/max).toFixed(4)})}/></div><p className="lp-kicker">{b.kind}</p><p className="lp-bubble-value">{b.prefix}<span data-count={b.value} data-decimals={b.decimals}>{b.value.toLocaleString('en-US',{minimumFractionDigits:b.decimals,maximumFractionDigits:b.decimals})}</span>{b.suffix}</p><p>{b.label}</p></li>)}</ol>
  <p className="lp-source" data-reveal>{impact.note}</p>
 </section>;
}

export function DemoCTASection(){
 return <section className="lp-section dark" id="demo" aria-labelledby="demo-title">
  <Chapter n="07">Live demo</Chapter>
  <h2 id="demo-title" data-split>{demo.title}</h2>
  <div className="lp-mock">
   <figure className="lp-mock-main"><div className="lp-mock-bar" aria-hidden="true"><i/><i/><i/><span>rootsync / dashboard</span></div><img src={asset('/landing/dashboard.jpg')} alt="ROOTSYNC portfolio dashboard showing the priority decision queue for KO-3201 and HE-3301" width={1440} height={900} loading="lazy" decoding="async"/></figure>
   <figure className="lp-mock-side s1" data-parallax="14"><img src={asset('/landing/ko-3201.jpg')} alt="KO-3201 causal health workspace with the 3D compressor model and weekly condition trend" width={1440} height={900} loading="lazy" decoding="async"/><figcaption>KO-3201 · causal health</figcaption></figure>
   <figure className="lp-mock-side s2" data-parallax="22"><img src={asset('/landing/he-3301.jpg')} alt="HE-3301 cleaning decision workspace with the 3D exchanger model and tube-side dP trend" width={1440} height={900} loading="lazy" decoding="async"/><figcaption>HE-3301 · cleaning decision</figcaption></figure>
  </div>
  <div className="lp-cta center" data-reveal>{demo.links.map(l=><Link key={l.route} className={'lp-btn '+(l.primary?'primary':'ghost')} href={routes[l.route]}>{l.label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div>
  <p className="lp-disclosure" data-reveal>{demo.disclosure}</p>
 </section>;
}

export function ClosingSection(){
 return <section className="lp-closing-wrap" aria-label="Closing statement">
  <blockquote className="lp-closing">
   <p className="lp-closing-lead">{closing.lead}</p>
   <p className="lp-closing-main">{closing.main.map((part,i)=>typeof part==='string'?part:<mark key={i}>{part.mark}</mark>)}</p>
  </blockquote>
  <Link className="lp-btn primary" href={routes.dashboard}>Launch Live Demo<ArrowUpRight size={17} aria-hidden="true"/></Link>
 </section>;
}

export function LandingFooter(){
 return <footer className="lp-footer">
  <div className="lp-footer-row">
   <p className="lp-wordmark"><span className="lp-mark" aria-hidden="true">R</span>ROOTSYNC</p>
   <nav aria-label="Footer">{navItems.map(n=><a key={n.id} href={`#${n.id}`}>{n.label}</a>)}<Link href={routes.dashboard}>Dashboard</Link></nav>
  </div>
  <p className="lp-footer-team"><img src={asset('/landing/caliber-logo.png')} alt="CALIBER, Chandra Asri Limitless Innovation and Business Strategy Challenge" width={530} height={275} loading="lazy"/><span>R.O.O.T. Strategy · a proposal for CALIBER 2026<b>YAPYAP team · Abel Gani · Muhammad Faris Daffa · Adelia Rifani</b></span></p>
  <p className="lp-source">Built on a frozen historical case snapshot. Advisory only. Protective systems remain authoritative. The CALIBER logo belongs to its owner and is shown to identify the competition.</p>
 </footer>;
}
