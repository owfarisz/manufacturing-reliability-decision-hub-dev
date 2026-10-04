'use client';

import {Hub} from './Hub';
import {OnboardingTour,type Role} from './OnboardingTour';

const primaryRole:Role='Reliability Engineer';

export function DevHub({view}:{view:'portfolio'|'ko'|'he'|'actions'}){
 return <><Hub view={view}/><OnboardingTour view={view} role={primaryRole}/></>;
}
