'use client';

import {useEffect,useState} from 'react';
import {Hub} from './Hub';
import {OnboardingTour,type Role} from './OnboardingTour';
import {RoleLanding} from './RoleLanding';

export function DevHub({view}:{view:'portfolio'|'ko'|'he'|'actions'}){
 const [role,setRole]=useState<Role|null>(null);
 useEffect(()=>{const saved=sessionStorage.getItem('kausync-role') as Role|null;if(saved)setRole(saved)},[]);
 const choose=(next:Role)=>{sessionStorage.setItem('kausync-role',next);sessionStorage.setItem('kausync-guide-open','page');setRole(next)};
 const changeRole=()=>{sessionStorage.removeItem('kausync-role');sessionStorage.removeItem('kausync-guide-open');sessionStorage.removeItem('kausync-flow-step');setRole(null)};
 return <>{role?<><Hub view={view}/><div className="role-indicator">Viewing as <strong>{role}</strong><button type="button" onClick={changeRole} style={{marginLeft:8,border:0,borderRadius:999,padding:'3px 7px',background:'#263f77',color:'#fff',fontSize:10,fontWeight:800,cursor:'pointer'}}>Change role</button></div><OnboardingTour view={view} role={role}/></>:<RoleLanding onChoose={choose}/>}</>;
}
