export type AssetId = 'KO-3201' | 'HE-3301';
export type Scenario = 'confirmed' | 'insufficient' | 'fouling' | 'rate-change';
export type EvidenceState = 'Supported' | 'Contradicted' | 'Missing' | 'Not applicable';
export type Evidence = { label: string; state: EvidenceState; explanation: string; source: string };
export type Assessment = { tier: 'Strong' | 'Moderate' | 'Insufficient'; mechanism: string; recommendation: string; nextStep: string; evidence: Evidence[]; candidates: { name: string; rank: number; reason: string }[]; approval: boolean };
export const HE_SOURCE_DP_TRIP = 0.9;
export function boundaryWindow(dp: number, weeklySlope: number, boundary = HE_SOURCE_DP_TRIP) {
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
export function assessHe(input: { rawDp: number; rawDuty: number; heavyEnds?: number | null; rateHypothesis?: boolean; recentWeeklySlope?: number; persistenceWeeks?: number }): Assessment & { runway: ReturnType<typeof boundaryWindow> } {
  const degraded=input.rawDp>=.6 && input.rawDuty<90;
  const feed=input.heavyEnds!=null && input.heavyEnds>=1.5;
  const rateGap=input.rateHypothesis===true;
  const evidence:Evidence[]=[
    {label:'Raw tube-side dP',state:input.rawDp>=.6?'Supported':'Contradicted',explanation:`${input.rawDp.toFixed(3)} bar in the dated weekly record; source alert/trip limits are 0.6/0.9 bar.`,source:'HE Condition History / Equipment Info'},
    {label:'Raw heat duty',state:input.rawDuty<90?'Supported':'Contradicted',explanation:`${input.rawDuty.toFixed(1)}% of design in the same weekly row; source alert/trip limits are 90/70%.`,source:'HE Condition History / Equipment Info'},
    {label:'Feed heavy-ends',state:input.heavyEnds==null?'Missing':feed?'Supported':'Contradicted',explanation:input.heavyEnds==null?'Weekly reading unavailable.':`${input.heavyEnds.toFixed(3)}% in the weekly record versus 1.5% source alert.`,source:'HE Condition History / Equipment Info'},
    {label:'Synchronized rate and pressure pair',state:'Missing',explanation:'Hourly feed exists for May but cannot be paired reliably with date-only weekly dP and duty. Tube inlet/outlet pressure and filter dP are absent.',source:'HE Sheet2 / Condition History / PI Tag'}
  ];
  const fouling=degraded&&feed&&(input.persistenceWeeks??0)>=2;
  const runway=fouling&&!rateGap?boundaryWindow(input.rawDp,input.recentWeeklySlope??0):null;
  return {tier:rateGap?'Insufficient':fouling?'Moderate':'Insufficient',mechanism:rateGap?'Rate effect cannot be ruled out from supplied measurements':fouling?'Persistent hydraulic and thermal deterioration; historical RCA reports fouling':'Cause not established by current weekly record',recommendation:rateGap?'Do not approve cleaning on a rate-change hypothesis without synchronized measurements.':fouling?'Inspect and plan a controlled intervention; verify rate and pressure context before approval.':'Continue monitoring and gather synchronized operating evidence.',nextStep:'Request time-aligned feed, tube pressure pair, filter dP and thermal basis from the process engineer.',approval:false,evidence,candidates:[{name:'Progressive fouling',rank:fouling&&!rateGap?1:2,reason:'At least two consecutive weekly dP, duty and heavy-ends readings cross alerts; RCA inspection is post-event evidence.'},{name:'Throughput or rate effect',rank:rateGap?1:2,reason:'May affect raw performance, but weekly values cannot be normalized from the supplied hourly period.'},{name:'Feed-quality change',rank:3,reason:'Heavy-ends is measured weekly; upstream source remains unresolved.'},{name:'Instrument or other thermal disturbance',rank:4,reason:'No synchronized pressure pair, filter dP or complete thermal balance.'}],runway};
}
