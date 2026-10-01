import {describe,it,expect} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {assessKo,assessHe,boundaryWindow} from '../domain/decision';
import {initialCase,transition} from '../domain/workflow';
const sourceFixturePath=new URL('../src/generated/fixtures.json',import.meta.url);
const hasSourceFixture=existsSync(sourceFixturePath);
type SourceFixture={
 validation:unknown[];
 assets:Record<string,{hourly:Record<string,unknown>[];weekly:Record<string,unknown>[];tags:{Name?:string;engunits?:string;Description?:string}[];fields:string[];off:{count:number}}>;
 incidents:unknown[];
 portfolio:{totalLoss:number;families:{name:string;count:number}[]};
 registry:Record<string,unknown>;
};
const data:SourceFixture=hasSourceFixture?JSON.parse(readFileSync(sourceFixturePath,'utf8')):{validation:[],assets:{},incidents:[],portfolio:{totalLoss:0,families:[]},registry:{}};

describe.skipIf(!hasSourceFixture)('source data contract',()=>{
 it('loads the complete source corpus with preserved units',()=>{
  expect(data.validation).toHaveLength(11);
  expect(Object.values(data.assets).map(a=>a.hourly.length)).toEqual([720,720,720,720,720]);
  expect(Object.values(data.assets).map(a=>a.weekly.length)).toEqual([26,26,26,26,26]);
  expect(data.incidents).toHaveLength(380);
  expect(data.assets['KO-3201'].tags.find(t=>t.Name==='KO3201_VIB')?.engunits).toBe('MM/S');
  expect(data.assets['KO-3201'].fields[0]).toContain('micron');
  expect(data.assets['HE-3301'].tags.find(t=>t.Name==='HE3301_DISP')?.Description).toContain('DISCHARGE PRESSURE');
  expect(data.assets['HE-3301'].fields[0]).toContain('Tube-side dP');
  expect(data.assets['HE-3301'].off.count).toBe(13);
  expect(data.portfolio.totalLoss).toBe(67194.43);
  expect(data.portfolio.families.find(f=>f.name==='Vibration-related')?.count).toBe(59);
 });
 it('registers provenance for every normalized input field',()=>{
  const registry:Record<string,unknown>=data.registry;
  for(const [asset,a] of Object.entries(data.assets)){
   for(const field of Object.keys(a.hourly[0]))expect(registry[`${asset}:hourly:${field}`]).toBeDefined();
   for(const field of Object.keys(a.weekly[0]))expect(registry[`${asset}:weekly:${field}`]).toBeDefined();
  }
 });
});
describe('explainable assessment',()=>{
 it('ranks cooler ingress with verified weekly evidence, but abstains without water',()=>{
  const strong=assessKo({vibration:76.5,water:1530,pressure:1.078,temperature:112.2,coolerConfirmed:true});
  expect(strong.tier).toBe('Strong');expect(strong.candidates[0].name).toContain('Cooler');
  const weak=assessKo({vibration:76.5,water:null,pressure:1.078,temperature:112.2,waterStale:true});
  expect(weak.tier).toBe('Insufficient');expect(weak.approval).toBe(false);
 });
 it('keeps HE raw values and abstains on an unverified rate hypothesis',()=>{
  const review=assessHe({rawDp:.854,rawDuty:72.706,heavyEnds:2.288,rateHypothesis:true,recentWeeklySlope:.064});
  expect(review.tier).toBe('Insufficient');
  expect(review.approval).toBe(false);
  expect(review.runway).toBeNull();
  expect(review.evidence.find(e=>e.label==='Synchronized rate and pressure pair')?.state).toBe('Missing');
  const observed=assessHe({rawDp:.918,rawDuty:68.6,heavyEnds:2.448,recentWeeklySlope:.064,persistenceWeeks:2});
  expect(observed.mechanism).toContain('historical RCA');
  expect(observed.approval).toBe(false);
  expect(observed.runway).toBeNull();
  expect(boundaryWindow(.854,.064)?.central).toBeCloseTo(5.03125);
 });
});
describe('human workflow gates',()=>{
 it('requires manager approval, separates technician completion, and reserves closure for engineer',()=>{
  let c=initialCase('KO-3201','confirmed');
  c=transition(c,'validate','Shift Supervisor','Validated operation','hourly status');
  c=transition(c,'assess','Reliability Engineer','Reviewed weekly samples','weekly KO');
  c={...c,selectedAction:'Plan controlled intervention',rationale:'Water and vibration are both elevated',disposition:'Accept',dispositionReason:'Weekly readings and RCA support inspection',acceptanceCriteria:'Water below 500 ppm and displacement below 45 micron through week 26'};
  c=transition(c,'propose','Reliability Engineer','Proposed repair','RCA2');
  expect(c.state).toBe('APPROVAL_REQUIRED');
  expect(()=>transition(c,'approve','Technician','Looks good','RCA2')).toThrow();
  c=transition(c,'approve','Maintenance / Reliability Manager','Approved planned intervention','RCA2');
  c=transition(c,'start','Maintenance Planner','Plan ready','work package');
  c={...c,executionEvidence:'Leak test reference and repair record'};
  c=transition(c,'complete','Technician','Physical work complete','repair record');
  expect(c.state).toBe('ACTION_IN_PROGRESS');
  expect(()=>transition(c,'verify','Technician','Close now','repair record')).toThrow();
  c={...c,postActionResult:'Operation at 55 t/h; monitored weekly values available'};
  c=transition(c,'restore','Shift Supervisor','Restart confirmed','operating log');
  expect(c.state).toBe('PERFORMANCE_RESTORED');
  c=transition(c,'monitor','Reliability Engineer','Monitoring begun','weekly KO');
  expect(()=>transition(c,'verify','Reliability Engineer','Close now','weekly KO')).toThrow();
  c={...c,criteriaChecked:true,observationComplete:true,upstreamControlled:true,verificationWeek:25,verificationEvidence:'2026-06-03 weekly condition record and work pack',followupAction:'Cooler leak test assigned to planner'};
  expect(()=>transition(c,'verify','Technician','Close now','weekly KO')).toThrow();
  c=transition(c,'verify','Reliability Engineer','Criteria met after observation','weekly KO');
  expect(c.state).toBe('VERIFIED_CLOSED');expect(c.audit).toHaveLength(9);
 });
});
