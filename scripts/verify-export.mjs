// Checks a GitHub Pages static export in out/. Run after:
//   GITHUB_PAGES_BASE_PATH=/<repo> npm run build
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.GITHUB_PAGES_BASE_PATH;
assert.ok(base,'Set GITHUB_PAGES_BASE_PATH to the base path the export was built with.');
const out=new URL('../out/',import.meta.url);
for(const page of ['index.html','dashboard/index.html','assets/ko-3201/index.html','assets/he-3301/index.html','actions/index.html'])assert.ok(existsSync(new URL(page,out)),`${page} is missing from the export`);
const landing=readFileSync(new URL('index.html',out),'utf8');
assert.ok(landing.includes('From fragmented evidence'),'The root page is not the landing page');
for(const route of ['/dashboard/','/assets/ko-3201/','/assets/he-3301/','/actions/'])assert.ok(landing.includes(`href="${base}${route}"`),`Landing link to ${route} is not prefixed with ${base}`);
for(const image of ['dashboard','ko-3201','he-3301']){
 assert.ok(landing.includes(`src="${base}/landing/${image}.jpg"`),`Preview image ${image} is not prefixed with ${base}`);
 assert.ok(existsSync(new URL(`landing/${image}.jpg`,out)),`Preview image ${image} is missing from the export`);
}
assert.ok(!/(href|src)="\/(dashboard|assets|actions|landing)/.test(landing),'Found an internal URL without the base path');
assert.ok(readFileSync(new URL('dashboard/index.html',out),'utf8').includes('ROOTSYNC'),'Dashboard export is empty');
console.log(`Static export verified with base path ${base}: landing at /, dashboard at /dashboard, asset and action routes present.`);
