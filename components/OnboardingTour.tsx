'use client';

import {useEffect,useMemo,useState} from 'react';

const steps=[
 {target:'.priority-stack',title:'Mulai dari prioritas',body:'Lihat dua aset yang perlu keputusan. Kartu ini menjelaskan risiko, dampak tercatat, sinyal utama, dan pemilik langkah berikutnya.'},
 {target:'.equipment-card',title:'Baca kondisi peralatan',body:'Putar model 3D, arahkan kursor ke pin, lalu lihat arti setiap sinyal. Warna merah berarti batas trip terlewati, kuning berarti perlu perhatian.'},
 {target:'.cockpit-trend',title:'Ikuti waktu dan batasnya',body:'Arahkan kursor ke grafik atau mini tren untuk melihat tanggal, nilai, dan statusnya. Garis kuning dan merah menunjukkan batas sumber.'},
 {target:'.decision-rail',title:'Pilih keputusan dengan konteks',body:'Ringkasan ini menerjemahkan sinyal menjadi keputusan manusia berikutnya. Tombol Review decision membawa Anda ke pilihan dan bukti pendukung.'},
 {target:'.workspace-tabs',title:'Pisahkan kerja dan pembuktian',body:'Decision memilih tindakan. Action mencatat kerja lapangan. Verification memastikan hasilnya benar-benar bertahan.'},
];

export function OnboardingTour(){
 const [step,setStep]=useState<number|null>(null);
 const [rect,setRect]=useState<DOMRect|null>(null);
 const active=step==null?null:steps[step];
 const update=()=>{if(!active)return;setRect(document.querySelector(active.target)?.getBoundingClientRect()??null)};
 useEffect(()=>{if(sessionStorage.getItem('kausync-tour-seen'))return;const id=window.setTimeout(()=>setStep(0),550);return()=>window.clearTimeout(id)},[]);
 useEffect(()=>{update();window.addEventListener('resize',update);window.addEventListener('scroll',update,true);return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true)}},[step]);
 const spot=useMemo(()=>rect?{left:Math.max(8,rect.left-8),top:Math.max(8,rect.top-8),width:Math.max(0,rect.width+16),height:Math.max(0,rect.height+16)}:undefined,[rect]);
 const close=()=>{sessionStorage.setItem('kausync-tour-seen','1');setStep(null)};
 if(!active)return <button className="guide-reopen" onClick={()=>setStep(0)} aria-label="Open KAUSYNC guide"><span className="guide-face">👋</span> Panduan</button>;
 return <div className="tour" aria-live="polite"><div className="tour-dim"/><div className="tour-spot" style={spot}/><section className="tour-card" role="dialog" aria-label="KAUSYNC guide"><div className="tour-avatar" aria-hidden="true"><span>🙂</span></div><div className="eyebrow">Panduan KAUSYNC · {step+1} / {steps.length}</div><h2>{active.title}</h2><p>{active.body}</p><div className="tour-actions"><button className="secondary" onClick={close}>Lewati</button><button className="primary" onClick={()=>step===steps.length-1?close():setStep(step+1)}>{step===steps.length-1?'Mulai eksplorasi':'Lanjut'}</button></div></section></div>;
}
