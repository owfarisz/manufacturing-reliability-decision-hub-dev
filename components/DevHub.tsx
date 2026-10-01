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
 return <>{role?<><Hub view={view} sidebarAddon={<button className="sidebar-role-switch" type="button" onClick={changeRole} aria-label={`Viewing as ${role}. Change role`} title={`Viewing as ${role}. Change role`} style={{position:'absolute',right:10,bottom:78,left:10,display:'grid',placeItems:'center',gap:2,width:54,minHeight:43,padding:5,border:'1px solid #607fa2',borderRadius:9,background:'#315a96',color:'#fff',fontSize:17,cursor:'pointer'}}><span aria-hidden="true">⇄</span><small>Role</small></button>}/><OnboardingTour view={view} role={role}/></>:<RoleLanding onChoose={choose}/>}</>;
}
