'use client';

import {useEffect,useState} from 'react';
import {Hub} from './Hub';
import {OnboardingTour,type Role} from './OnboardingTour';
import {RoleLanding} from './RoleLanding';

export function DevHub({view}:{view:'portfolio'|'ko'|'he'|'actions'}){
 const [role,setRole]=useState<Role|null>(null);
 useEffect(()=>{const saved=sessionStorage.getItem('kausync-role') as Role|null;if(saved)setRole(saved)},[]);
 const choose=(next:Role)=>{sessionStorage.setItem('kausync-role',next);sessionStorage.setItem('kausync-guide-open','page');setRole(next)};
 return <>{role?<><Hub view={view}/><div className="role-indicator">Viewing as <strong>{role}</strong></div><OnboardingTour view={view} role={role}/></>:<RoleLanding onChoose={choose}/>}</>;
}
