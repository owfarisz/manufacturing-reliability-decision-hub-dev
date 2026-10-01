'use client';
import {useState} from 'react';

type Hotspot={id:string;label:string;value:string;state:'normal'|'watch'|'critical'|'missing';limit:string;date:string;source:()=>void;position:{left:string;top:string}};
export function EquipmentVisual({kind,hotspots}:{kind:'compressor'|'exchanger';hotspots:Hotspot[]}){
 const [active,setActive]=useState(hotspots[0]?.id);
 const selected=hotspots.find(h=>h.id===active)??hotspots[0];
 return <div className="equipment-card card">
  <div className="equipment-head"><div><span className="eyebrow">Equipment anatomy</span><h2>{kind==='compressor'?'Centrifugal compressor':'Shell-and-tube exchanger'}</h2></div><span className="representative">Representative visual</span></div>
  <div className={'equipment-stage '+kind} role="group" aria-label="Equipment evidence hotspots">
   {kind==='compressor'?<svg viewBox="0 0 600 360" role="img" aria-label="Generic centrifugal compressor and lubrication path">
    <defs><linearGradient id="metal" x1="0" x2="1"><stop stopColor="#233b4e"/><stop offset=".5" stopColor="#516779"/><stop offset="1" stopColor="#183143"/></linearGradient><linearGradient id="steel" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#496273"/><stop offset="1" stopColor="#122d3f"/></linearGradient></defs>
    <path d="M54 260h492M80 267v39m440-39v39" stroke="#6e8899" strokeWidth="7"/>
    <path d="M82 168h54v65H82zM136 181h43v43h-43zM179 156h30v91h-30z" fill="url(#steel)" stroke="#8ca3ae" strokeWidth="3"/>
    <path d="M208 127c88-42 175-26 242 38v78c-70 25-151 25-242-12z" fill="url(#metal)" stroke="#9bafb7" strokeWidth="4"/>
    <path d="M232 144c73-19 143-6 193 37v44c-52 22-120 22-193-3z" fill="none" stroke="#80a0b0" strokeWidth="3" opacity=".8"/>
    <path d="M272 131v103m42-104v109m42-107v112m42-100v95" stroke="#91a9b2" strokeWidth="2" opacity=".45"/>
    <path d="M460 166h48v69h-48zM508 183h52v35h-52z" fill="url(#steel)" stroke="#8ca3ae" strokeWidth="3"/>
    <path d="M299 251v31h134v-31m-46 31v23h-60v-23" fill="none" stroke="#dcad43" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M359 305h-168v-48h84v-20" fill="none" stroke="#d2a840" strokeWidth="5" strokeDasharray="9 6"/>
    <rect x="132" y="260" width="76" height="47" rx="6" fill="#324a56" stroke="#7c9197" strokeWidth="3"/><path d="M145 273h50m-50 11h50m-50 11h50" stroke="#95a9a7" strokeWidth="3"/>
    <text x="90" y="121" fill="#a8bbc4" fontSize="15">DRIVE</text><text x="249" y="98" fill="#a8bbc4" fontSize="15">CASING / ROTOR</text><text x="425" y="291" fill="#d4b267" fontSize="14">LUBE-OIL LOOP</text>
   </svg>:<svg viewBox="0 0 600 360" role="img" aria-label="Generic shell-and-tube exchanger with feed and outlet paths">
    <defs><linearGradient id="shell" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#536979"/><stop offset=".5" stopColor="#263f51"/><stop offset="1" stopColor="#112c3e"/></linearGradient></defs>
    <path d="M40 300h520M130 275v25m340-25v25" stroke="#7892a0" strokeWidth="7"/>
    <rect x="105" y="118" width="395" height="150" rx="75" fill="url(#shell)" stroke="#96abb2" strokeWidth="4"/>
    <path d="M142 131v125m37-139v151m244-151v151m37-137v125" stroke="#86a0aa" strokeWidth="5"/>
    <path d="M182 154h238m-238 24h238m-238 24h238m-238 24h238" stroke="#d2ab59" strokeWidth="4" opacity=".8"/>
    <path d="M84 165h61m315 58h65M268 119V60h72v59m-72 150v43h72v-43" stroke="#8ca6b0" strokeWidth="15" fill="none"/><path d="M76 165h-29m478 58h31M303 60V31m0 281v24" stroke="#d2aa49" strokeWidth="8"/>
    <path d="M96 111v167m411-167v167" stroke="#5d7887" strokeWidth="3"/>
    <text x="62" y="142" fill="#a8bbc4" fontSize="14">FEED</text><text x="472" y="190" fill="#a8bbc4" fontSize="14">OUTLET</text><text x="250" y="96" fill="#a8bbc4" fontSize="14">SHELL SIDE</text><text x="238" y="341" fill="#d4b267" fontSize="14">TUBE SIDE</text>
   </svg>}
   {hotspots.map((h,index)=><button key={h.id} type="button" className={'hotspot '+h.state+(active===h.id?' active':'')} style={h.position} onClick={()=>setActive(h.id)} aria-label={`${h.label}: ${h.value}, ${h.state}`} aria-pressed={active===h.id}><span>{index+1}</span></button>)}
  </div>
  {selected&&<div className="hotspot-detail" aria-live="polite"><div><div className="tiny muted">SELECTED EVIDENCE · {selected.date}</div><h3>{selected.label}</h3><strong>{selected.value}</strong></div><div className="hotspot-side"><span className={'evidence-state '+selected.state}>{selected.state}</span><small>{selected.limit}</small><button className="sourcebtn" onClick={selected.source}>Open source detail</button></div></div>}
  <p className="tiny muted equipment-caption">Generic equipment silhouette. Hotspots show the selected recorded weekly sample; positions do not represent surveyed sensor locations.</p>
 </div>
}
