// Landing page copy. Short on purpose: the visuals carry the story.
// Every figure is read from the committed snapshot (lib/landing-data.ts) or
// quoted from a named source. See docs/landing-evidence-map.md.
import type {RouteKey} from '@/lib/paths';

export type NavItem={id:string;label:string};
export const navItems:NavItem[]=[
 {id:'problem',label:'Problem'},
 {id:'root',label:'R.O.O.T.'},
 {id:'use-cases',label:'Use Cases'},
 {id:'workflow',label:'Workflow'},
 {id:'demo',label:'Demo'},
];

export const hero={
 eyebrow:'ROOTSYNC · R.O.O.T. Strategy',
 status:'Built on a historical case snapshot',
 headline:['From fragmented evidence','to accountable','reliability action.'],
 body:'One workspace that connects signals, failure evidence, and engineering judgement, then follows the decision until recovery is verified.',
 chain:['Signal','Evidence','Decision','Action','Verified'],
 ticker:['KO3201_VIB · MM/S','DE radial displacement · micron','Lube-oil water · ppm','Bearing metal temp · °C','Tube-side dP · bar','Heat duty · % design','Feed heavy-ends · %','RCA chronology','Incident register','Owner · approver · criteria','Post-action reading'],
};

export const fieldScenes=[
 {kicker:'What was recorded',title:'380 incidents.',body:'January 2024 to July 2026, across twelve plants.'},
 {kicker:'Look for the repeat offender',title:'379 different assets.',body:'Each failed once. A single tag shows up twice.'},
 {kicker:'Look again, by mechanism',title:'Three mechanisms keep coming back.',body:'Leakage, vibration and wear hold more than half of all incidents.'},
];

export const sameSignal={
 title:'Same signal. Different cause.',
 signal:'High vibration',
 cases:[
  {tag:'KO-3201',kind:'Compressor',cause:['Cooler tube leak','Water in lube oil','Bearing distress']},
  {tag:'BL-5702',kind:'Blower',cause:['Misalignment','Soft foot','Aged coupling element']},
 ],
 takeaway:'A family label finds similar cases. Proving the cause still takes an RCA.',
};

export type Dimension={letter:string;name:string;definition:string;question:string;from:string;to:string;visual:'rank'|'organize'|'orchestrate'|'test'};
export const dimensions:Dimension[]=[
 {letter:'R',name:'Rank Critical Risk',definition:'Prioritize the most consequential and actionable asset conditions.',question:'What needs a decision first?',from:'Unclear priority',to:'Clear priority',visual:'rank'},
 {letter:'O',name:'Organize Evidence',definition:'Transform fragmented signals into an explainable view.',question:'What does the evidence support?',from:'Fragmented evidence',to:'Trusted context',visual:'organize'},
 {letter:'O',name:'Orchestrate Action',definition:'Convert technical judgement into owned and approved intervention.',question:'Who owns it, and who approves?',from:'Fragmented handoffs',to:'Accountable execution',visual:'orchestrate'},
 {letter:'T',name:'Test Effectiveness',definition:'Confirm sustained recovery before closing the case.',question:'Did the condition actually improve?',from:'Incomplete closure',to:'Verified closure',visual:'test'},
];

export type UseCase={id:'ko'|'he';tag:string;title:string;service:string;operator:string;hook:string;mechanism:string[];cards:{label:string;text:string}[];limits:string[];cta:{label:string;route:RouteKey}};
export const useCases:UseCase[]=[
 {id:'ko',tag:'KO-3201',title:'Compressor Causal Health',service:'Cracked-gas compressor',operator:'Rotating Equipment Reliability Engineer',
  hook:'Water showed up in the oil weeks before the vibration did.',
  mechanism:['Cooler tube leak','Water in lube oil','Oil film degrades','Bearing distress','Vibration rises','TRIP'],
  cards:[
   {label:'Hypothesis',text:'Water ingress weighed against surge, bearing wear, and a sensor fault.'},
   {label:'Intervention',text:'Oil sample, cooler leak test, bearing inspection, each with an owner and approver.'},
   {label:'Verification',text:'Closed only when water-in-oil and vibration stay stable.'},
  ],
  limits:['MM/S velocity and micron displacement stay on separate charts','One recorded failure, so no promised warning window','Advisory only'],
  cta:{label:'Explore KO-3201',route:'ko'}},
 {id:'he',tag:'HE-3301',title:'Fouling and Cleaning Decision',service:'Feed/effluent heat exchanger',operator:'Process Engineer',
  hook:'Clean too early and you waste availability. Too late and the unit is forced to cut rate.',
  mechanism:['Heavy-ends rise','Coke and polymer deposit','Tube-side dP rises','Heat duty falls','Rate cut','OFFLINE'],
  cards:[
   {label:'Hypothesis',text:'Fouling weighed against a plain rate effect before anyone schedules cleaning.'},
   {label:'Trade-off',text:'Continue, adjust, inspect, or clean, each with its consequence and approver.'},
   {label:'Verification',text:'Cleaning done, performance restored, upstream cause controlled. Three separate checks.'},
  ],
  limits:['Rate-normalized dP and duty are unavailable','Hourly discharge pressure is a different signal from tube-side dP','Boundary window is illustrative'],
  cta:{label:'Explore HE-3301',route:'he'}},
];

export type SceneRow={text:string;tone?:'alert'|'ok'|'pick'};
export type WorkflowStep={step:string;owner:string;does:string;window:string;rows:SceneRow[]};
export const workflow={
 title:'Eight steps. Every one has an owner.',
 note:'Illustrated with the KO-3201 case. Roles come from the two PRDs. The prototype walks these transitions without authentication.',
 steps:[
  {step:'Detect',owner:'Control-Room Operator',does:'Acknowledges the alert and checks the reading is real.',window:'Alert',rows:[{text:'Lube-oil water above alert limit',tone:'alert'},{text:'Sensor reading validated',tone:'ok'},{text:'Escalate to Reliability',tone:'pick'}]},
  {step:'Review evidence',owner:'Reliability / Process Engineer',does:'Reads each signal with its unit and its source.',window:'Evidence',rows:[{text:'Water content · ppm · weekly record'},{text:'Radial displacement · micron · weekly record'},{text:'Vibration velocity · MM/S · kept separate',tone:'pick'}]},
  {step:'Validate hypothesis',owner:'Reliability / Process Engineer',does:'Sorts the evidence, then accepts, modifies or rejects.',window:'Hypothesis · water ingress',rows:[{text:'Supporting · water rose before vibration',tone:'ok'},{text:'Missing · cooler leak test',tone:'alert'},{text:'Request test',tone:'pick'}]},
  {step:'Propose',owner:'Reliability / Process Engineer',does:'Picks an intervention and writes numeric acceptance criteria.',window:'Decision',rows:[{text:'Bearing inspection'},{text:'Cooler leak test',tone:'pick'},{text:'Criteria · water below 500 ppm',tone:'ok'}]},
  {step:'Approve',owner:'Shift Supervisor · Manager',does:'Weighs equipment risk against production continuity.',window:'Approval',rows:[{text:'Owner named',tone:'ok'},{text:'Window agreed',tone:'ok'},{text:'Record approval',tone:'pick'}]},
  {step:'Execute',owner:'Planner · Technician',does:'Plans the window, does the work, attaches field evidence.',window:'Work order',rows:[{text:'Scope and window planned',tone:'ok'},{text:'Work completed',tone:'ok'},{text:'Attach field evidence',tone:'pick'}]},
  {step:'Verify recovery',owner:'Reliability / Process Engineer',does:'Checks post-action readings against the agreed criteria.',window:'Verification',rows:[{text:'Water back below limit',tone:'ok'},{text:'Vibration stable',tone:'ok'},{text:'Confirm observation period',tone:'pick'}]},
  {step:'Capture learning',owner:'Reliability Manager',does:'Keeps the disposition and the outcome with the case.',window:'Case record',rows:[{text:'Mechanism confirmed',tone:'ok'},{text:'Outcome recorded',tone:'ok'},{text:'File for the next similar case',tone:'pick'}]},
 ] as WorkflowStep[],
};

export const impact={
 title:'What the record cost, and the small part we claim.',
 note:'Circle areas are to scale. The 20% figure is the benchmark scenario used in the deck, shown here as a what-if.',
};

export const demo={
 title:'See R.O.O.T. move from signal to verified action.',
 disclosure:'Runs on a frozen case-data snapshot. Workflow records are demonstration data stored in your browser. Plant equipment is never controlled from here.',
 links:[
  {label:'Launch ROOTSYNC Demo',route:'dashboard',primary:true},
  {label:'Explore KO-3201',route:'ko'},
  {label:'Explore HE-3301',route:'he'},
  {label:'Open Action Center',route:'actions'},
 ] as {label:string;route:RouteKey;primary?:boolean}[],
};

export const closing={
 lead:'The goal is not to predict every failure.',
 main:['It is to make critical maintenance decisions ',{mark:'earlier'},', ',{mark:'better informed'},', and ',{mark:'verifiable'},'.'] as (string|{mark:string})[],
};
