import type {AssetId,Scenario} from './decision';
export const STATES=['DETECTED','VALIDATION_REQUIRED','ASSESSMENT_IN_PROGRESS','DECISION_PROPOSED','APPROVAL_REQUIRED','ACTION_PLANNED','ACTION_IN_PROGRESS','PERFORMANCE_RESTORED','EFFECTIVENESS_MONITORING','VERIFIED_CLOSED','EVIDENCE_INSUFFICIENT','DECISION_DEFERRED','RISK_ACCEPTED','ACTION_BLOCKED','REOPENED'] as const;
export type State=typeof STATES[number];
export type Role='Operations Manager'|'Reliability Engineer'|'Process Engineer'|'Shift Supervisor'|'Maintenance Planner'|'Technician'|'Maintenance / Reliability Manager'|'Data Steward';
export type Audit={actor:Role;timestamp:string;rationale:string;evidenceReference:string;previousState:State;newState:State};
export type Case={asset:AssetId;scenario:Scenario;state:State;selectedAction:string;owner:Role;ownerName:string;operationsOwnerName:string;maintenanceOwnerName:string;approver:Role;dueDate:string;plannedWindow:string;blocker:string;executionEvidence:string;postActionResult:string;rationale:string;acceptanceCriteria:string;evidenceOverride:string;disposition:'Accept'|'Modify'|'Reject'|'Request test'|'';dispositionReason:string;verificationWeek:number;verificationEvidence:string;followupAction:string;approvalRecorded:boolean;physicalDone:boolean;restored:boolean;criteriaChecked:boolean;observationComplete:boolean;upstreamControlled:boolean;audit:Audit[]};
export const DEMO_NOW='2026-10-01T09:00:00';
export function initialCase(asset:AssetId,scenario:Scenario):Case{return {asset,scenario,state:'DETECTED',selectedAction:'',owner:'Maintenance Planner',ownerName:'Demo assignee',operationsOwnerName:'Demo shift supervisor',maintenanceOwnerName:'Demo maintenance planner',approver:'Maintenance / Reliability Manager',dueDate:'2026-10-03',plannedWindow:'2026-10-03',blocker:'',executionEvidence:'',postActionResult:'',rationale:'',acceptanceCriteria:'',evidenceOverride:'',disposition:'',dispositionReason:'',verificationWeek:-1,verificationEvidence:'',followupAction:'',approvalRecorded:false,physicalDone:false,restored:false,criteriaChecked:false,observationComplete:false,upstreamControlled:false,audit:[]};}
const decisionOwner=(a:AssetId):Role=>a==='KO-3201'?'Reliability Engineer':'Process Engineer';
export type Event='validate'|'assess'|'insufficient'|'propose'|'defer'|'approve'|'plan'|'start'|'block'|'complete'|'restore'|'monitor'|'verify'|'reopen'|'accept-risk';
export function transition(c:Case,event:Event,actor:Role,rationale:string,evidenceReference:string):Case{
 if (!rationale.trim()||!evidenceReference.trim()) throw new Error('Rationale and evidence reference are required.');
 const owner=decisionOwner(c.asset);
 const rules:Record<Event,{from:State[];to:State;roles:Role[];guard?:(c:Case)=>boolean}>={
  validate:{from:['DETECTED','REOPENED'],to:'VALIDATION_REQUIRED',roles:['Shift Supervisor',owner]},
  assess:{from:['VALIDATION_REQUIRED','EVIDENCE_INSUFFICIENT'],to:'ASSESSMENT_IN_PROGRESS',roles:[owner]},
  insufficient:{from:['ASSESSMENT_IN_PROGRESS','VALIDATION_REQUIRED'],to:'EVIDENCE_INSUFFICIENT',roles:[owner]},
  propose:{from:['ASSESSMENT_IN_PROGRESS','DECISION_DEFERRED'],to:'DECISION_PROPOSED',roles:[owner],guard:c=>!!c.selectedAction.trim()&&!!c.acceptanceCriteria.trim()&&['Accept','Modify'].includes(c.disposition)&&!!c.dispositionReason.trim()},
  defer:{from:['ASSESSMENT_IN_PROGRESS','DECISION_PROPOSED'],to:'DECISION_DEFERRED',roles:[owner]},
  approve:{from:['DECISION_PROPOSED','APPROVAL_REQUIRED'],to:'ACTION_PLANNED',roles:['Operations Manager','Maintenance / Reliability Manager'],guard:c=>!!c.selectedAction&&!!c.dueDate&&!!c.plannedWindow&&!!c.ownerName&&!!c.operationsOwnerName&&!!c.maintenanceOwnerName&&!!c.rationale&&!!c.approver&&!!c.acceptanceCriteria&&['Accept','Modify'].includes(c.disposition)&&(!c.selectedAction.toLowerCase().includes('clean')||!!c.evidenceOverride.trim())},
  plan:{from:['ACTION_PLANNED'],to:'ACTION_IN_PROGRESS',roles:['Maintenance Planner'],guard:c=>c.approvalRecorded},
  start:{from:['ACTION_PLANNED'],to:'ACTION_IN_PROGRESS',roles:['Maintenance Planner'],guard:c=>c.approvalRecorded},
  block:{from:['ACTION_PLANNED','ACTION_IN_PROGRESS'],to:'ACTION_BLOCKED',roles:['Maintenance Planner','Technician'],guard:c=>!!c.blocker},
  complete:{from:['ACTION_IN_PROGRESS','ACTION_BLOCKED'],to:'ACTION_IN_PROGRESS',roles:['Technician'],guard:c=>!!c.executionEvidence},
  restore:{from:['ACTION_IN_PROGRESS'],to:'PERFORMANCE_RESTORED',roles:['Shift Supervisor'],guard:c=>c.physicalDone&&!!c.postActionResult},
  monitor:{from:['PERFORMANCE_RESTORED'],to:'EFFECTIVENESS_MONITORING',roles:[owner]},
  verify:{from:['EFFECTIVENESS_MONITORING'],to:'VERIFIED_CLOSED',roles:[owner],guard:c=>c.criteriaChecked&&c.observationComplete&&c.upstreamControlled&&!!c.executionEvidence&&!!c.postActionResult&&c.verificationWeek>=25&&!!c.verificationEvidence.trim()&&!!c.followupAction.trim()},
  reopen:{from:['VERIFIED_CLOSED','EFFECTIVENESS_MONITORING'],to:'REOPENED',roles:[owner]},
  'accept-risk':{from:['ASSESSMENT_IN_PROGRESS','DECISION_PROPOSED'],to:'RISK_ACCEPTED',roles:['Operations Manager','Maintenance / Reliability Manager']}
 };
 const rule=rules[event];if(!rule.from.includes(c.state))throw new Error(`Cannot ${event} from ${c.state}.`);if(!rule.roles.includes(actor))throw new Error(`${actor} cannot ${event}.`);if(rule.guard&&!rule.guard(c))throw new Error(`Prerequisites missing for ${event}.`);
 const next={...c};if(event==='propose')rule.to='APPROVAL_REQUIRED';if(event==='approve')next.approvalRecorded=true;if(event==='complete')next.physicalDone=true;if(event==='restore')next.restored=true;
 next.state=rule.to;next.audit=[...c.audit,{actor,timestamp:new Date(Date.parse(DEMO_NOW)+c.audit.length*60000).toISOString(),rationale,evidenceReference,previousState:c.state,newState:next.state}];return next;
}
