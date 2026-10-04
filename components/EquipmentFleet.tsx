'use client';

import {useState,type CSSProperties,type PointerEvent} from 'react';

type Tone='focus'|'context';

function Pipe({d}:{d:string}){
 return <g aria-hidden="true">
  <path d={d} fill="none" stroke="#07151f" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
  <path d={d} fill="none" stroke="#426574" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
  <path d={d} fill="none" stroke="#a5c3ca" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".62"/>
 </g>;
}

function Base({x,y,w=150}:{x:number;y:number;w?:number}){
 return <g aria-hidden="true"><path d={`M${x} ${y}h${w}l26 18H${x+26}z`} fill="#07151f"/><path d={`M${x+9} ${y-5}h${w-9}l24 17H${x+33}z`} fill="#355563"/><path d={`M${x+9} ${y-5}l24 17v9L${x+9} ${y+4}z`} fill="#1c3543"/></g>;
}

function Pump({x,y,tone}:{x:number;y:number;tone:Tone}){
 const focus=tone==='focus'; const body=focus?'#1686b9':'#71818a'; const side=focus?'#07517f':'#4b5961'; const metal=focus?'#e6d954':'#aeb9bd';
 return <g transform={`translate(${x} ${y})`}><title>PU-2101B feed charge pump, mechanical seal leakage</title><Base x={-28} y={72}/><ellipse cx="36" cy="48" rx="42" ry="42" fill={side}/><path d="M-6 48c0-28 18-47 43-47 29 0 49 21 49 49 0 24-18 43-42 43H3V75h43c11 0 20-10 20-24 0-16-12-30-30-30-17 0-27 12-27 27z" fill={body}/><ellipse cx="36" cy="48" rx="17" ry="17" fill="#0b2634"/><circle cx="36" cy="48" r="7" fill={metal}/><path d="M73 49h28" stroke="#0c1d27" strokeWidth="17"/><path d="M73 46h28" stroke={metal} strokeWidth="7"/><rect x="99" y="24" width="80" height="49" rx="13" fill={body}/><ellipse cx="179" cy="48" rx="11" ry="24" fill={side}/><path d="M111 25v47m15-47v47m15-47v47m15-47v47" stroke="#e9f4f4" strokeWidth="3" opacity=".25"/><path d="M-2 21V2h28v13" fill="none" stroke={metal} strokeWidth="10" strokeLinecap="round"/><path d="M12 89v17m138-32v32" stroke={metal} strokeWidth="9"/></g>;
}

function Compressor({x,y,tone}:{x:number;y:number;tone:Tone}){
 const focus=tone==='focus'; const body=focus?'#1686b9':'#74848d'; const side=focus?'#0a4574':'#4a5962'; const metal=focus?'#e6d954':'#b3bdc1';
 return <g transform={`translate(${x} ${y})`}><title>KO-3201 cracked-gas compressor, bearing distress and radial vibration trip</title><Base x={-36} y={76} w={184}/><path d="M-9 68V27h31l16-18h97l18 18h27v41l-24 19H19z" fill={body}/><path d="M-9 68V27h31l16-18v60H19z" fill={side}/><ellipse cx="1" cy="48" rx="19" ry="25" fill={metal}/><ellipse cx="1" cy="48" rx="8" ry="12" fill="#0a2433"/><path d="M52 11v73m28-75v77m28-77v77m28-75v73" stroke="#edf7f6" strokeWidth="4" opacity=".26"/><circle cx="100" cy="48" r="17" fill="none" stroke="#edf7f6" strokeWidth="3" opacity=".55"/><path d="M43 11V-10h23V10m79 18V-2h23v30" fill="none" stroke={metal} strokeWidth="10" strokeLinecap="round"/><path d="M38 87v21m87-21v21" stroke={metal} strokeWidth="9"/></g>;
}

function MotorPump({x,y,tone}:{x:number;y:number;tone:Tone}){
 const focus=tone==='focus'; const body=focus?'#1686b9':'#72818a'; const side=focus?'#0a4c78':'#46545d'; const metal=focus?'#e6d954':'#aeb9bd';
 return <g transform={`translate(${x} ${y})`}><title>PM-4405B cooling-water pump, motor bearing overheating</title><Base x={-26} y={72}/><ellipse cx="28" cy="48" rx="39" ry="39" fill={side}/><path d="M-7 49C-7 20 10 1 34 1c28 0 46 20 46 47 0 24-16 44-39 44H3V72h39c11 0 19-10 19-23 0-15-10-28-27-28-15 0-24 11-24 27z" fill={body}/><circle cx="28" cy="48" r="17" fill="#0b2634"/><circle cx="28" cy="48" r="6" fill={metal}/><path d="M68 48h27" stroke="#0b1d27" strokeWidth="18"/><path d="M68 45h27" stroke={metal} strokeWidth="7"/><rect x="94" y="20" width="89" height="55" rx="14" fill={body}/><ellipse cx="183" cy="48" rx="12" ry="27" fill={side}/><path d="M107 21v52m16-52v52m16-52v52m16-52v52" stroke="#eff8f7" strokeWidth="3" opacity=".25"/><path d="M-1 19V0h26v13" fill="none" stroke={metal} strokeWidth="10" strokeLinecap="round"/><path d="M7 88v18m143-31v31" stroke={metal} strokeWidth="9"/></g>;
}

function Exchanger({x,y,tone}:{x:number;y:number;tone:Tone}){
 const focus=tone==='focus'; const shell=focus?'#1686b9':'#798991'; const shade=focus?'#0a4d79':'#4a5962'; const metal=focus?'#e6d954':'#b7c0c3';
 return <g transform={`translate(${x} ${y})`}><title>HE-3301 feed effluent exchanger, tube fouling and duty loss</title><Base x={-20} y={81} w={192}/><path d="M11 21h142c19 0 34 16 34 36s-15 36-34 36H11c-14 0-25-16-25-36s11-36 25-36z" fill={shell}/><path d="M11 21h142c19 0 34 16 34 36s-15 36-34 36H11z" fill={shade} opacity=".48"/><ellipse cx="11" cy="57" rx="18" ry="36" fill={metal}/><ellipse cx="153" cy="57" rx="18" ry="36" fill={metal}/><path d="M34 22v70m28-70v70m55-70v70m27-70v70" stroke="#eff8f8" strokeWidth="3" opacity=".28"/><path d="M44 21V-4h25v25m69 72v27h25V93m0-72V-1h25v22" fill="none" stroke={metal} strokeWidth="11" strokeLinecap="round"/><path d="M30 94v25m108-25v25" stroke={metal} strokeWidth="9"/></g>;
}

function Blower({x,y,tone}:{x:number;y:number;tone:Tone}){
 const focus=tone==='focus'; const body=focus?'#1686b9':'#718089'; const side=focus?'#084b78':'#475660'; const metal=focus?'#e6d954':'#b5bec2';
 return <g transform={`translate(${x} ${y})`}><title>BL-5702 product blower, coupling misalignment and high vibration</title><Base x={-30} y={75} w={180}/><path d="M-3 83V28C-3 7 14-10 38-10c29 0 51 22 51 52 0 24-17 43-42 43z" fill={body}/><circle cx="38" cy="41" r="30" fill="#0a2736" opacity=".68"/><path d="M38 12c9 15 9 35 0 59M13 27c16 6 29 19 39 37M50 13C36 23 25 38 19 57" stroke={metal} strokeWidth="6" strokeLinecap="round"/><path d="M76 27h31v22H86m-10 35h31V62H86" fill="none" stroke={metal} strokeWidth="11" strokeLinecap="round"/><path d="M106 49h23" stroke="#0b1d27" strokeWidth="18"/><path d="M106 46h23" stroke={metal} strokeWidth="7"/><rect x="127" y="21" width="76" height="54" rx="13" fill={body}/><ellipse cx="203" cy="48" rx="11" ry="26" fill={side}/><path d="M140 22v51m16-51v51m16-51v51m16-51v51" stroke="#eef8f8" strokeWidth="3" opacity=".25"/><path d="M12 84v20m146-28v28" stroke={metal} strokeWidth="9"/></g>;
}

function PlantScene(){
 return <svg className="plant-svg" viewBox="0 0 1100 400" role="img" aria-label="Connected equipment plant showing five equipment trains, with the compressor and exchanger highlighted"><defs><linearGradient id="plant-floor" x1="0" x2="1"><stop stopColor="#183746"/><stop offset=".5" stopColor="#254e5d"/><stop offset="1" stopColor="#102633"/></linearGradient><linearGradient id="plant-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2c5968"/><stop offset="1" stopColor="#102632"/></linearGradient><filter id="plant-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1100" height="400" fill="url(#plant-sky)"/><path d="M60 250 834 250l210 108H276z" fill="url(#plant-floor)"/><path d="M60 250 834 250l210 108" fill="none" stroke="#8bb5c1" strokeWidth="2" opacity=".35"/><path d="M276 358 1044 358" stroke="#071922" strokeWidth="10" opacity=".45"/>
 <g opacity=".36" stroke="#8fc0c8" fill="none"><path d="M100 238 300 342M260 238l200 104M420 238l200 104M580 238l200 104M740 238l200 104"/><path d="M180 278h760M245 314h760"/></g>
 <Pipe d="M105 189H226v-32h62M368 157h74v30h60M587 187h65v-40h54M848 147h56v41h63"/>
 <g filter="url(#plant-glow)"><circle cx="257" cy="157" r="8" fill="#e6d954"/><circle cx="717" cy="147" r="8" fill="#e6d954"/></g>
 <Pump x={80} y={155} tone="context"/><Compressor x={230} y={136} tone="focus"/><MotorPump x={445} y={155} tone="context"/><Exchanger x={635} y={130} tone="focus"/><Blower x={860} y={151} tone="context"/>
 <g aria-hidden="true" opacity=".8"><path d="M110 250v-42m218 42v-48m228 48v-38m223 38v-42m218 42v-39" stroke="#132c39" strokeWidth="12"/><path d="M110 208v42m218-48v48m228-38v38m223-42v42m218-39v39" stroke="#8baeb5" strokeWidth="3"/></g>
 </svg>;
}

export function EquipmentFleet(){
 const [dragging,setDragging]=useState(false);
 const [rotation,setRotation]=useState({x:0,y:0});
 const rotate=(event:PointerEvent<HTMLButtonElement>)=>{if(!dragging)return;const box=event.currentTarget.getBoundingClientRect();setRotation({x:Math.max(-9,Math.min(9,(event.clientY-box.top)/box.height*18-9)),y:Math.max(-12,Math.min(12,(event.clientX-box.left)/box.width*24-12))})};
 const style={'--plant-x':`${rotation.x}deg`,'--plant-y':`${rotation.y}deg`} as CSSProperties;
 return <section className="equipment-fleet" aria-labelledby="fleet-title"><div className="fleet-heading"><div><div className="eyebrow">Connected equipment landscape</div><h2 id="fleet-title">Five assets in one decision landscape</h2><p>Drag the plant to inspect its 3D form. The coloured compressor and exchanger are the two active investigations.</p></div></div><button type="button" className={'plant-viewport'+(dragging?' dragging':'')} style={style} onPointerDown={event=>{setDragging(true);event.currentTarget.setPointerCapture(event.pointerId)}} onPointerMove={rotate} onPointerUp={()=>setDragging(false)} onPointerCancel={()=>setDragging(false)} aria-label="Drag to rotate the connected equipment plant"><PlantScene/></button></section>;
}
