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
 const roleControl=<div className="role-switcher" aria-label="Current dashboard role"><span>Viewing as</span><strong>{role}</strong><button onClick={()=>{window.localStorage.removeItem(roleStorageKey);setRole(null)}}>Change role</button></div>;
 return <><Hub view={view} role={role} sidebarAddon={roleControl}/><OnboardingTour view={view} role={role}/></>;
}
