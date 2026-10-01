export type AssetId = 'KO-3201' | 'HE-3301';
export type Scenario = 'confirmed' | 'insufficient' | 'fouling' | 'rate-change';
export type EvidenceState = 'Supported' | 'Contradicted' | 'Missing' | 'Not applicable';
export type Evidence = { label: string; state: EvidenceState; explanation: string; source: string };
export type Assessment = { tier: 'Strong' | 'Moderate' | 'Insufficient'; mechanism: string; recommendation: string; nextStep: string; evidence: Evidence[]; candidates: { name: string; rank: number; reason: string }[]; approval: boolean };
export const ASSUMPTIONS = { referenceRate: 30, pressureExponent: 2, dutyExponent: 1, dpBoundary: 0.9 } as const;
export function normalizeHe(dp: number, duty: number, rate: number, referenceRate = ASSUMPTIONS.referenceRate) {
  if (rate <= 0 || referenceRate <= 0) throw new Error('Positive rate required');
  return { dp: dp * (referenceRate / rate) ** ASSUMPTIONS.pressureExponent, duty: duty * (referenceRate / rate) ** ASSUMPTIONS.dutyExponent };
}
export function boundaryWindow(dp: number, weeklySlope: number, boundary = ASSUMPTIONS.dpBoundary) {
  if (weeklySlope <= 0 || dp >= boundary) return null;
  const days = (boundary - dp) / (weeklySlope / 7);
  return { low: Math.max(0, Math.floor(days * .7)), high: Math.ceil(days * 1.3), central: days };
}
export function assessKo(input: { vibration: number; water?: number | null; pressure: number; temperature: number; coolerConfirmed?: boolean; waterStale?: boolean; unitValid?: boolean }): Assessment {
  const missing = input.water == null || input.waterStale || input.unitValid === false;
  const evidence: Evidence[] = [
    {label:'Weekly radial displacement rises',state:input.vibration >= 45?'Supported':'Contradicted',explanation:`${input.vibration.toFixed(1)} micron, compared only with the weekly micron threshold.`,source:'KO-3201 weekly condition record'},
    {label:'Water in lube oil exceeds specification',state:missing?'Missing':input.water! >= 500?'Supported':'Contradicted',explanation:missing?'Sample missing, stale, or its semantics require validation.':`${input.water!.toFixed(0)} ppm versus the RCA <500 ppm specification.`,source:'KO-3201 weekly condition record / RCA2'},
    {label:'Oil pressure and bearing temperature are consistent',state:input.pressure < 1.4 && input.temperature >= 95?'Supported':'Contradicted',explanation:`${input.pressure.toFixed(2)} barg and ${input.temperature.toFixed(1)} °C. RCA oil-pressure statement conflicts with the weekly failure row.`,source:'KO-3201 weekly condition record / RCA2'},
    {label:'Cooler leak physically confirmed',state:input.coolerConfirmed?'Supported':'Missing',explanation:input.coolerConfirmed?'RCA records cooler tube leakage after inspection.':'Pre-intervention cooler integrity test is unavailable.',source:'RCA2 slide 3 and slide 7'},
    {label:'Surge/process disturbance',state:'Contradicted',explanation:'RCA reports maintained anti-surge margin and no surge event; no aligned live anti-surge series is supplied.',source:'RCA2 slide 6'}
  ];
  if (missing) return {tier:'Insufficient',mechanism:'Bearing distress not established',recommendation:'Validate the water sample and vibration-unit definition before attributing cause.',nextStep:'Request a fresh oil sample and engineering unit check.',evidence,candidates:[{name:'Cooler leakage / water ingress',rank:1,reason:'Possible, but required water evidence is unavailable.'},{name:'Sensor or instrument issue',rank:2,reason:'Unit conflict remains unresolved.'},{name:'Process disturbance / surge',rank:3,reason:'RCA does not record a surge event.'},{name:'Normal bearing wear',rank:4,reason:'RCA says bearing was within design life.'}],approval:false};
  const strong=input.vibration>=45 && input.water!>=500 && input.temperature>=95;
  return {tier:strong?'Strong':'Moderate',mechanism:'Cooler leakage → water contamination → oil-film degradation → bearing distress',recommendation:strong?'Inspect cooler integrity and plan a controlled intervention.':'Continue enhanced monitoring and obtain corroborating inspection evidence.',nextStep:input.coolerConfirmed?'Reliability Engineer to propose intervention with manager approval.':'Confirm cooler integrity by inspection or leak test.',evidence,candidates:[{name:'Cooler leakage / water ingress',rank:1,reason:'Water rise, bearing heat, vibration trend, and post-event cooler confirmation align.'},{name:'Process disturbance / surge',rank:2,reason:'Contradicted by RCA anti-surge check; aligned live trend unavailable.'},{name:'Normal bearing wear',rank:3,reason:'Bearing was within stated design service life.'},{name:'Sensor or instrument issue',rank:4,reason:'Weekly displacement is coherent, while hourly velocity unit remains unresolved.'}],approval:strong};
}
export function assessHe(input: { rawDp: number; rawDuty: number; rate: number; heavyEnds?: number | null; rateAvailable?: boolean; simulated?: boolean; recentWeeklySlope?: number }): Assessment & { normalized?: {dp:number;duty:number}; runway: ReturnType<typeof boundaryWindow> } {
  if (input.rateAvailable===false || input.rate<=0) return {tier:'Insufficient',mechanism:'Performance assessment deferred',recommendation:'Validate feed rate and tube-side dP before selecting an intervention.',nextStep:'Request synchronized operating rate and pressure evidence.',approval:false,evidence:[{label:'Rate basis',state:'Missing',explanation:'Normalization cannot be calculated without a valid rate.',source:'Hourly production workbook / assumed scenario'}],candidates:[],runway:null};
  const n=normalizeHe(input.rawDp,input.rawDuty,input.rate);
  const degraded=n.dp>=.6 && n.duty<90;
  const feed=(input.heavyEnds??0)>=1.5;
  const e:Evidence[]=[
    {label:'Normalized tube-side dP',state:degraded?'Supported':'Contradicted',explanation:`${n.dp.toFixed(3)} bar at an assumed 30 t/h reference rate. Pressure exponent 2 is an unvalidated demo assumption.`,source:'Weekly HE condition record / assumed normalization'},
    {label:'Normalized heat duty',state:degraded?'Supported':'Contradicted',explanation:`${n.duty.toFixed(1)}% at the same reference rate; linear duty scaling is an unvalidated demo assumption.`,source:'Weekly HE condition record / assumed normalization'},
    {label:'Feed heavy-ends',state:input.heavyEnds==null?'Missing':feed?'Supported':'Contradicted',explanation:input.heavyEnds==null?'Lab evidence unavailable.':`${input.heavyEnds.toFixed(2)}% versus RCA design <1.5%.`,source:'HE weekly condition record / RCA4'},
    {label:'Filter differential pressure',state:'Missing',explanation:'RCA names a monitoring gap; no aligned filter dP series is supplied.',source:'RCA4 slide 7'}
  ];
  const fouling=degraded&&feed;
  const runway=fouling?boundaryWindow(n.dp,input.recentWeeklySlope ?? .064):null;
  return {tier:fouling?'Strong':degraded?'Moderate':'Moderate',mechanism:fouling?'Progressive tube-side coke/polymer fouling':'Rate effect or other operating variation',recommendation:fouling?'Plan cleaning after engineering and manager review.':'Do not recommend cleaning from raw duty change alone. Continue monitoring and validate the operating context.',nextStep:fouling?'Confirm cleaning window and upstream heavy-ends control.':'Check the rate-normalized trend and pressure instrumentation.',approval:fouling,evidence:e,candidates:[{name:'Progressive fouling',rank:fouling?1:2,reason:fouling?'Normalized dP and duty deteriorate with elevated heavy-ends.':'Normalized performance is stable in this scenario.'},{name:'Throughput/rate change',rank:fouling?2:1,reason:fouling?'Cannot explain the combined normalized degradation.':'Raw values change in proportion to the simulated rate.'},{name:'Feed-quality change',rank:3,reason:feed?'Elevated heavy-ends supports deposit formation; source of carry-over remains unverified.':'Heavy-ends remain near baseline.'},{name:'Sensor/data issue',rank:4,reason:'Pressure pair and aligned rate must be validated in a real deployment.'},{name:'Other thermal/hydraulic disturbance',rank:5,reason:'Shell-side aligned temperatures are unavailable.'}],normalized:n,runway};
}
