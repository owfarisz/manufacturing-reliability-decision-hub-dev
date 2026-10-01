'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';

type Hotspot={id:string;label:string;value:string;state:'normal'|'watch'|'critical'|'missing';limit:string;date:string;source:()=>void;position:{left:string;top:string}};
type Projected={id:string;left:number;top:number;visible:boolean};
type Kind='compressor'|'exchanger';
const colors={navy:0x263f77,blue:0x315a96,mid:0x4076b4,cyan:0x5fb6e6,pale:0x8fc5ea,yellow:0xe0de50,steel:0xc7dbe9};
function addMesh(group:THREE.Group,geometry:THREE.BufferGeometry,color:number,position:[number,number,number],rotation:[number,number,number]=[0,0,0],options?:THREE.MeshPhysicalMaterialParameters){
 const material=new THREE.MeshPhysicalMaterial({color,metalness:.58,roughness:.29,clearcoat:.38,...options});
 const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...position);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
}
function cylinder(group:THREE.Group,radius:number,length:number,color:number,position:[number,number,number],options?:THREE.MeshPhysicalMaterialParameters){return addMesh(group,new THREE.CylinderGeometry(radius,radius,length,40),color,position,[0,0,Math.PI/2],options)}
function pipe(group:THREE.Group,points:[number,number,number][],radius:number,color:number){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return addMesh(group,new THREE.TubeGeometry(curve,48,radius,9,false),color,[0,0,0])}
function buildMachine(kind:Kind){
 const machine=new THREE.Group();
 addMesh(machine,new THREE.BoxGeometry(6.3,.17,2.1),colors.navy,[0,-1.33,0]);
 for(const x of [-2.25,2.25])for(const z of [-.75,.75])addMesh(machine,new THREE.BoxGeometry(.27,.43,.27),colors.blue,[x,-1.63,z]);
 if(kind==='compressor'){
  cylinder(machine,.56,1.65,colors.blue,[-2.03,0,0]);
  cylinder(machine,.39,.48,colors.steel,[-.97,0,0]);
  cylinder(machine,.91,2.5,colors.mid,[.58,.02,0]);
  cylinder(machine,.99,.16,colors.navy,[-.65,.02,0]);
  cylinder(machine,.99,.16,colors.navy,[1.82,.02,0]);
  cylinder(machine,.67,.72,colors.blue,[2.21,.02,0]);
  addMesh(machine,new THREE.BoxGeometry(.37,.6,.95),colors.navy,[2.72,.02,0]);
  for(const x of [-.34,.5,1.3])addMesh(machine,new THREE.TorusGeometry(.91,.035,10,50),colors.pale,[x,.02,0],[0,Math.PI/2,0]);
  for(const x of [-1.9,.65,1.7])addMesh(machine,new THREE.BoxGeometry(.22,.65,.85),colors.blue,[x,-.93,0]);
  addMesh(machine,new THREE.BoxGeometry(1.15,.48,.78),colors.navy,[-1.37,-1.02,1.04]);
  for(const z of [.83,1.28])pipe(machine,[[-1.3,-.7,z],[-.65,-.7,z],[.35,-.7,z],[1.28,-.5,z]],.045,colors.yellow);
  pipe(machine,[[-1.1,-.7,1.1],[-.8,.35,1.1],[-.28,.56,1.08]],.045,colors.cyan);
  pipe(machine,[[1.25,-.56,.92],[1.63,-.5,1.05],[1.7,.32,.95]],.045,colors.yellow);
 }else{
  cylinder(machine,.93,4.35,colors.mid,[0,0,0],{transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide});
  for(const x of [-2.17,2.17]){cylinder(machine,.98,.22,colors.navy,[x,0,0]);addMesh(machine,new THREE.TorusGeometry(.97,.055,12,50),colors.cyan,[x+(x<0?-.12:.12),0,0],[0,Math.PI/2,0])}
  for(const y of [-.5,-.18,.18,.5])for(const z of [-.43,-.14,.14,.43])cylinder(machine,.046,3.9,colors.yellow,[0,y,z],{metalness:.4,roughness:.35});
  for(const x of [-1.4,1.4])addMesh(machine,new THREE.BoxGeometry(.32,.7,1.45),colors.blue,[x,-1.02,0]);
  cylinder(machine,.29,.86,colors.blue,[-2.68,.1,0]);cylinder(machine,.29,.86,colors.blue,[2.68,-.14,0]);
  pipe(machine,[[-1.02,.88,0],[-1.02,1.41,0],[-.46,1.41,0]],.16,colors.cyan);
  pipe(machine,[[1.0,-.83,0],[1.0,-1.03,1.05],[1.63,-1.03,1.05]],.13,colors.blue);
  for(const x of [-1.6,-.8,0,.8,1.6])addMesh(machine,new THREE.TorusGeometry(.94,.023,8,50),colors.pale,[x,0,0],[0,Math.PI/2,0]);
 }
 return machine;
}
function pinCoordinates(kind:Kind):Record<string,THREE.Vector3>{return kind==='compressor'?{
 vibration:new THREE.Vector3(1.22,.8,.76),water:new THREE.Vector3(-1.39,-.67,1.43),pressure:new THREE.Vector3(.68,-.54,1.21),temperature:new THREE.Vector3(2.04,.54,.63)
 }:{dp:new THREE.Vector3(-1.76,.48,.86),duty:new THREE.Vector3(1.23,.52,.87),outlet:new THREE.Vector3(2.37,-.09,.54),heavy:new THREE.Vector3(-1.1,1.46,.24)};}

export function EquipmentVisual({kind,hotspots}:{kind:Kind;hotspots:Hotspot[]}){
 const mount=useRef<HTMLDivElement>(null),engine=useRef<{reset:()=>void;rotate:(direction:number)=>void}|null>(null);
 const [active,setActive]=useState(hotspots[0]?.id),[hovered,setHovered]=useState<string|null>(null),[pins,setPins]=useState<Projected[]>([]),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const selected=hotspots.find(h=>h.id===active)??hotspots[0],hover=hotspots.find(h=>h.id===hovered);
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}catch{setFailed(true);return}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.domElement.className='machine-canvas';renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100),machine=buildMachine(kind),coordinates=pinCoordinates(kind);
  scene.add(machine);camera.position.set(6.4,3.7,8.5);camera.lookAt(0,-.12,0);
  scene.add(new THREE.AmbientLight(0xffffff,2.0));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const fill=new THREE.DirectionalLight(colors.cyan,1.7);fill.position.set(5,3,-5);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.85;floor.receiveShadow=true;scene.add(floor);
  let width=0,height=0,dragging=false,lastX=0,lastY=0,travel=0;
  function draw(){if(!host)return;const nextWidth=host.clientWidth,nextHeight=host.clientHeight;if(!nextWidth||!nextHeight)return;if(width!==nextWidth||height!==nextHeight){width=nextWidth;height=nextHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
   renderer.render(scene,camera);machine.updateMatrixWorld(true);
   setPins(Object.entries(coordinates).map(([id,point])=>{const projected=machine.localToWorld(point.clone()).project(camera);return{id,left:(projected.x+1)*50,top:(1-projected.y)*50,visible:projected.z<1&&projected.z>-1}}));
  }
  machine.rotation.y=-.26;draw();setReady(true);
  const resize=new ResizeObserver(draw);resize.observe(host);
  const down=(e:PointerEvent)=>{if(e.button!==0)return;dragging=true;travel=0;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
  const move=(e:PointerEvent)=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;travel+=Math.abs(dx)+Math.abs(dy);lastX=e.clientX;lastY=e.clientY;machine.rotation.y+=dx*.009;machine.rotation.x=Math.max(-.35,Math.min(.35,machine.rotation.x+dy*.006));draw()};
  const up=()=>{dragging=false};const wheel=(e:WheelEvent)=>{e.preventDefault();camera.position.multiplyScalar(e.deltaY>0?1.07:.93);camera.position.clampLength(7.5,17);draw()};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('wheel',wheel,{passive:false});
  engine.current={reset:()=>{machine.rotation.set(0,-.26,0);camera.position.set(6.4,3.7,8.5);camera.lookAt(0,-.12,0);draw()},rotate:(direction)=>{machine.rotation.y+=direction*.42;draw()}};
  return()=>{resize.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',up);renderer.domElement.removeEventListener('wheel',wheel);host.removeChild(renderer.domElement);machine.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose())}});floor.geometry.dispose();(floor.material as THREE.Material).dispose();renderer.dispose();engine.current=null};
 },[kind]);
 return <div className="equipment-card card"><div className="equipment-head"><div><span className="eyebrow">Equipment anatomy · interactive 3D</span><h2>{kind==='compressor'?'Centrifugal compressor':'Shell-and-tube exchanger'}</h2></div><span className="representative">Representative model</span></div>
  <div className={'equipment-stage machine-stage '+kind} role="group" aria-label={`Draggable 3D ${kind} model and evidence pins`} data-ready={ready}>
   <div className="machine-mount" ref={mount}/>
   {kind==='exchanger'&&<div className="exchanger-flow" aria-label="Illustrated exchanger process flow"><svg viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden="true"><path id="shell-flow" d="M22 82 H125 C150 82 155 122 185 122 H305 C330 122 336 165 378 165"/><path id="tube-flow" d="M20 178 H112 C145 178 150 145 182 145 H284 C315 145 330 96 378 96"/><circle r="6" className="flow-particle"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#shell-flow"/></animateMotion></circle><circle r="5" className="flow-particle secondary"><animateMotion dur="3.5s" repeatCount="indefinite"><mpath href="#tube-flow"/></animateMotion></circle></svg><div className="flow-legend"><span><b>1</b> Hot shell-side inlet</span><span><b>2</b> Heat transfers across tubes</span><span><b>3</b> Cooled shell-side outlet</span></div></div>}
   {failed&&<div className="machine-fallback">3D view unavailable in this browser. Evidence pins and readings remain available below.</div>}
   {hotspots.map((h,index)=>{const pin=pins.find(p=>p.id===h.id);return <button key={h.id} type="button" className={'hotspot '+h.state+(active===h.id?' active':'')} style={{left:`${pin?.left??Number.parseFloat(h.position.left)}%`,top:`${pin?.top??Number.parseFloat(h.position.top)}%`,visibility:pin&&!pin.visible?'hidden':'visible'}} onClick={()=>setActive(h.id)} onMouseEnter={()=>setHovered(h.id)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(h.id)} onBlur={()=>setHovered(null)} aria-label={`${h.label}: ${h.value}, ${h.state}`} aria-pressed={active===h.id}><span>{index+1}</span></button>})}
   {hover&&<div className="pin-tooltip" role="tooltip" style={{left:`${Math.min(80,Math.max(20,pins.find(p=>p.id===hover.id)?.left??50))}%`,top:`${Math.max(8,(pins.find(p=>p.id===hover.id)?.top??40)-19)}%`}}><strong>{hover.label}</strong><span>{hover.value}</span><small>{hover.limit}</small></div>}
   <div className="machine-controls"><button onClick={()=>engine.current?.rotate(-1)} aria-label="Rotate model left">↶</button><button onClick={()=>engine.current?.reset()} aria-label="Reset 3D view">Reset view</button><button onClick={()=>engine.current?.rotate(1)} aria-label="Rotate model right">↷</button></div>
  </div>
  {selected&&<div className="hotspot-detail" aria-live="polite"><div><div className="tiny muted">SELECTED EVIDENCE · {selected.date}</div><h3>{selected.label}</h3><strong>{selected.value}</strong></div><div className="hotspot-side"><span className={'evidence-state '+selected.state}>{selected.state}</span><small>{selected.limit}</small><button className="sourcebtn" onClick={selected.source}>Open source detail</button></div></div>}
  <p className="tiny muted equipment-caption">Drag to rotate, scroll to zoom or use the controls. Hover or focus a pin for its reading. Model geometry and pin locations are illustrative.</p>
 </div>;
}
