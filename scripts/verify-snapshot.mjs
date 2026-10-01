import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ui=JSON.parse(readFileSync(new URL('../src/generated/ui.json',import.meta.url),'utf8'));
assert.equal(ui.snapshot.workbooks,11);
assert.equal(Object.keys(ui.snapshot.sourceHashes).length,11);
assert.equal(ui.snapshot.rcaDecks,5);
assert.equal(Object.keys(ui.snapshot.rcaHashes).length,5);
assert.equal(ui.snapshot.incidentRows,380);
assert.equal(ui.portfolio.count,380);
assert.equal(ui.portfolio.downtime,2261.1);
assert.equal(ui.portfolio.totalLoss,67194.43);
for(const asset of ['KO-3201','HE-3301']){
 assert.equal(ui.assets[asset].hourly.length,720);
 assert.equal(ui.assets[asset].weekly.length,26);
 assert.equal(ui.snapshot.hourlyRows[asset],720);
 assert.equal(ui.snapshot.weeklyRows[asset],26);
 assert.equal(ui.anchors[asset]['Tag Number'],asset);
 assert.ok(ui.assets[asset].fields.every(field=>ui.registry[`${asset}:weekly:${field}`]));
}
assert.equal(ui.anchors['KO-3201']['AR No.'],'AR-2026-ZCU-0142');
assert.equal(ui.anchors['KO-3201']['Downtime (hrs)'],32);
assert.equal(ui.anchors['HE-3301']['AR No.'],'AR-2026-ZCU-0165');
assert.equal(ui.anchors['HE-3301']['Downtime (hrs)'],12);
assert.equal(ui.assets['KO-3201'].tags.find(t=>t.Name==='KO3201_VIB').engunits,'MM/S');
assert.equal(ui.assets['HE-3301'].tags.find(t=>t.Name==='HE3301_DISP').engunits,'BARG');
for(const hash of Object.values(ui.snapshot.sourceHashes))assert.match(hash,/^[a-f0-9]{64}$/);
for(const hash of Object.values(ui.snapshot.rcaHashes))assert.match(hash,/^[a-f0-9]{64}$/);
assert.match(ui.snapshot.explanationHash,/^[a-f0-9]{64}$/);
assert.equal(ui.rcaEvents['KO-3201'].length,5);
assert.equal(ui.rcaEvents['HE-3301'].length,4);
assert.equal(ui.rcaEvents['KO-3201'][1].reportedTime,'29-Apr-2026 06:40');
assert.equal(ui.rcaEvents['HE-3301'][1].reportedTime,'21-May-2026 09:00');
assert.ok(Object.values(ui.registry).every(source=>source.sheet&&source.timestampOrRange),'Measured and incident sources need a location and time range');
assert.ok(ui.conflicts.every(conflict=>conflict.sheet),'Reconciliation items need an explicit sheet or slide');
if(process.argv.includes('--with-sources')){
 const root=process.env.CASE2_DATA_ROOT??fileURLToPath(new URL('../../Case 2_ Intelligence Manufacturing/',import.meta.url));
 for(const [relative,want] of Object.entries({...ui.snapshot.sourceHashes,...ui.snapshot.rcaHashes})){
  const have=createHash('sha256').update(readFileSync(join(root,relative))).digest('hex');
  assert.equal(have,want,`${relative} no longer matches the frozen snapshot`);
 }
 const explanation=createHash('sha256').update(readFileSync(join(root,'Data Set Explanation for Case 2 Intelligence Manufacturing.pptx'))).digest('hex');
 assert.equal(explanation,ui.snapshot.explanationHash,'The source explanation deck no longer matches the frozen snapshot');
 console.log('All 17 original source files match the committed snapshot hashes.');
}
console.log('KAUSYNC source snapshot verified: 11 workbooks, 5 RCA decks, 380 incidents, 1,440 focus hourly rows, 52 focus weekly rows.');
