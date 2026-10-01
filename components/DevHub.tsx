'use client';

import {Hub} from './Hub';
import {OnboardingTour} from './OnboardingTour';

export function DevHub({view}:{view:'portfolio'|'ko'|'he'|'actions'}){
 return <><Hub view={view}/><OnboardingTour/></>;
}
