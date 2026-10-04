// Server-side view of the committed snapshot for the landing page. Values are
// read from src/generated/ui.json so the landing page and the dashboard cannot
// drift apart. Only the small derived shapes below reach the client.
import raw from '@/src/generated/ui.json';

type Weekly=Record<string,string|number|null>;
type Threshold={field:string;alarm:number;trip:number};
type AssetData={weekly:Weekly[];fields:string[];thresholds:Threshold[]};
type SnapshotFamily={name:string;count:number;actualLoss:number};
type Anchor=Record<string,string|number|null>;
type Snapshot={assets:Record<string,AssetData>;portfolio:{count:number;downtime:number;actualLoss:number;potentialLoss:number;totalLoss:number;statuses:Record<string,number>;families:SnapshotFamily[]};anchors:Record<string,Anchor>;incidentSource:{timestampOrRange:string};snapshot:{workbooks:number;rcaDecks:number}};
const data=raw as unknown as Snapshot;

const fmt=(n:number,d=0)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const usdM=(k:number)=>`US$${fmt(k/1000,1)}M`;
const clean=(field:string)=>field.replace('\n',' ');

export type Reading={label:string;value:string;unit:string;date:string;limit:string};
export type Series={label:string;unit:string;points:{date:string;value:number;status:string}[];alarm:number;trip:number;tripIndex:number;summary:string};

function weeklySeries(tag:string,fieldIndex:number):Series{
 const a=data.assets[tag],field=a.fields[fieldIndex],label=clean(field);
 const threshold=a.thresholds.find(t=>t.field===label)??a.thresholds[fieldIndex];
 const points=a.weekly.map(w=>({date:String(w.Date),value:Number(w[field]),status:String(w['Health Status'])}));
 const tripIndex=points.findIndex(p=>p.status==='TRIP');
 const unit=label.match(/\(([^)]+)\)/)?.[1]??'';
 const name=label.replace(/\s*\([^)]*\)/,'');
 const first=points[0],peak=points[tripIndex],last=points[points.length-1];
 const d=peak.value<3?3:1;
 return {label:name,unit,points,alarm:threshold.alarm,trip:threshold.trip,tripIndex,
  summary:`${name} over ${points.length} weekly records from ${first.date} to ${last.date}. It starts at ${fmt(first.value,d)} ${unit}, reaches ${fmt(peak.value,d)} ${unit} at the recorded trip on ${peak.date} against a source limit of ${threshold.trip} ${unit}, and reads ${fmt(last.value,d)} ${unit} in the last record.`};
}
function tripReading(tag:string,fieldIndex:number):Reading{
 const s=weeklySeries(tag,fieldIndex),p=s.points[s.tripIndex];
 return {label:s.label,value:p.value.toLocaleString('en-US',{maximumFractionDigits:3}),unit:s.unit,date:p.date,limit:`source limit ${s.trip} ${s.unit}`};
}

const p=data.portfolio;
const [from,to]=data.incidentSource.timestampOrRange.split(' to ');
const monthYear=(iso:string)=>new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});
const leakage=p.families.find(f=>f.name.startsWith('Leakage'))!;
const vibration=p.families.find(f=>f.name.startsWith('Vibration'))!;
// Worn Out is not one of the four families kept in the snapshot. Count from the register.
const wornOut=47;
const ko=data.anchors['KO-3201'],he=data.anchors['HE-3301'];
const focusDowntime=Number(ko['Downtime (hrs)'])+Number(he['Downtime (hrs)']);
const focusActual=Number(ko['Act. Loss (k US$)'])+Number(he['Act. Loss (k US$)']);
// Production loss in tonnes is reported in the two RCA decks and both PRDs.
// It is not a field of the incident register, so it is stated here with that source.
const focusTonnes=1760+216;
const benchmark=0.2;

export type Stat={prefix:string;value:number;decimals:number;suffix:string;label:string;source:string};
export const evidenceStats:Stat[]=[
 {prefix:'',value:p.count,decimals:0,suffix:'',label:'recorded incidents',source:'Incident Database · rows 4–383'},
 {prefix:'',value:p.downtime,decimals:1,suffix:' h',label:'recorded downtime',source:'Incident Database · Downtime (hrs)'},
 {prefix:'US$',value:p.totalLoss/1000,decimals:1,suffix:'M',label:'recorded exposure, actual plus potential',source:'Incident Database · Total Loss (k US$)'},
];
export const evidencePeriod=`${monthYear(from)} to ${monthYear(to)}`;

// Incidents per failure family, all 380 rows. The snapshot keeps only four families,
// so the full distribution was counted once from the local register (F Mechanism,
// with the five RCA anchor rows assigned by title) and matches the deck appendix.
// The leakage and vibration counts are asserted against the snapshot below.
export type Family={name:string;count:number};
export const families:Family[]=[
 {name:'Leakage',count:leakage.count},{name:'Vibration',count:vibration.count},{name:'Worn out',count:wornOut},
 {name:'Malfunction',count:25},{name:'Low perf.',count:22},{name:'Fouling',count:21},{name:'Crack',count:20},{name:'Error',count:20},
 {name:'Loose',count:18},{name:'Overheat',count:16},{name:'Stuck',count:15},{name:'Breakage',count:15},
];
if(families.reduce((n,f)=>n+f.count,0)!==p.count)throw new Error('Failure-family counts no longer add up to the incident total in the snapshot.');
export const topFamilyShare=`${fmt((leakage.count+vibration.count+wornOut)/p.count*100,1)}%`;
export const incidentTotal=p.count;

export const heroReadings:{ko:Reading[];he:Reading[]}={
 ko:[tripReading('KO-3201',0),tripReading('KO-3201',1)],
 he:[tripReading('HE-3301',0),tripReading('HE-3301',1)],
};
export const useCaseSeries:Record<'ko'|'he',Series[]>={
 ko:[weeklySeries('KO-3201',1),weeklySeries('KO-3201',0)],
 he:[weeklySeries('HE-3301',3),weeklySeries('HE-3301',0)],
};
export const useCaseImpact:Record<'ko'|'he',{label:string;value:string}[]>={
 ko:[{label:'Recorded downtime',value:`${ko['Downtime (hrs)']} h`},{label:'Production loss',value:'1,760 t'},{label:'Actual loss',value:`US$${fmt(Number(ko['Act. Loss (k US$)'])/1000,3)}M`}],
 he:[{label:'Recorded downtime',value:`${he['Downtime (hrs)']} h`},{label:'Production loss',value:'216 t'},{label:'Actual loss',value:`US$${fmt(Number(he['Act. Loss (k US$)']),1)}K`}],
};

export type Bubble={kind:string;prefix:string;value:number;decimals:number;suffix:string;amount:number;label:string;tone:'history'|'address'|'scenario'};
export const impactBubbles:Bubble[]=[
 {kind:'Recorded exposure',prefix:'US$',value:p.totalLoss/1000,decimals:1,suffix:'M',amount:p.totalLoss,label:`${fmt(p.count)} incidents. The baseline.`,tone:'history'},
 {kind:'Two anchor cases',prefix:'US$',value:focusActual/1000,decimals:2,suffix:'M',amount:focusActual,label:`KO-3201 and HE-3301 actual loss · ${focusDowntime} h · ${fmt(focusTonnes)} t`,tone:'address'},
 {kind:'20% benchmark scenario',prefix:'~US$',value:focusActual*benchmark,decimals:0,suffix:'K',amount:focusActual*benchmark,label:`~${fmt(focusDowntime*benchmark,1)} h and ~${fmt(focusTonnes*benchmark)} t on the two anchor cases`,tone:'scenario'},
];
