'use client';

import {useEffect,useState} from 'react';
import {Hub} from './Hub';
import {OnboardingTour,RolePicker,type Role} from './OnboardingTour';

const dashboardRoles:Role[]=['Reliability Engineer','Maintenance Planner'];
const roleStorageKey='kausync-dashboard-role';

export function DevHub({view}:{view:'portfolio'|'ko'|'he'|'actions'}){
 const [role,setRole]=useState<Role|null>(null);
 useEffect(()=>{const saved=window.localStorage.getItem(roleStorageKey) as Role|null;if(saved&&dashboardRoles.includes(saved))setRole(saved)},[]);
 const choose=(next:Role)=>{window.localStorage.setItem(roleStorageKey,next);setRole(next)};
 if(!role)return <RolePicker roles={dashboardRoles} onChoose={choose}/>;
 const roleInitials=role==='Maintenance Planner'?'MP':'RE';
 const roleControl=<button className="role-switcher" aria-label={`Change dashboard role, currently ${role}`} title={`Viewing as ${role}. Change role`} onClick={()=>{window.localStorage.removeItem(roleStorageKey);setRole(null)}}><span aria-hidden="true">{roleInitials}</span></button>;
 return <><Hub view={view} role={role} sidebarAddon={roleControl}/><OnboardingTour view={view} role={role}/></>;
}
