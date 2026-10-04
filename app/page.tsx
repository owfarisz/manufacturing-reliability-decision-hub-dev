import './landing.css';
import type {Metadata} from 'next';
import {Plus_Jakarta_Sans} from 'next/font/google';
import {LandingNav} from '@/components/landing/LandingNav';
import {LandingMotion} from '@/components/landing/LandingMotion';
import {LandingHero,EvidenceSection,MechanismProblemSection,RootFrameworkSection,UseCaseSection,WorkflowSection,ClosingSection,ImpactSection,DemoCTASection,LandingFooter} from '@/components/landing/Sections';

const jakarta=Plus_Jakarta_Sans({subsets:['latin'],weight:['400','500','600','700','800'],display:'swap',variable:'--lp-font'});

export const metadata:Metadata={
 title:'ROOTSYNC | From fragmented evidence to accountable reliability action',
 description:'ROOTSYNC runs the R.O.O.T. operating model: rank critical risk, organize evidence, orchestrate action, and test effectiveness. See the evidence, the two anchor use cases, and the live decision workspace.',
};

export default function Page(){
 return <div className={`lp ${jakarta.variable}`}>
  <a className="lp-skip" href="#main">Skip to content</a>
  <LandingNav/>
  <main id="main">
   <LandingHero/>
   <EvidenceSection/>
   <MechanismProblemSection/>
   <RootFrameworkSection/>
   <UseCaseSection/>
   <WorkflowSection/>
   <ImpactSection/>
   <DemoCTASection/>
   <ClosingSection/>
  </main>
  <LandingFooter/>
  <LandingMotion/>
 </div>;
}
