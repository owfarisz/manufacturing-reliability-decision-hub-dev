// Captures the real dashboard views used as the landing-page demo preview, plus
// landing-page QA screenshots. Run against a production server on port 3100:
//   npm run build && npm run start -- --port 3100 &  node scripts/capture-landing.cjs
const {chromium}=require('@playwright/test');
const fs=require('fs');
const path=require('path');
const base=process.env.CAPTURE_BASE_URL||'http://127.0.0.1:3100';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const preview=path.join(__dirname,'../public/landing');
 const qa=path.join(__dirname,'../docs/screenshots/landing');
 fs.mkdirSync(preview,{recursive:true});fs.mkdirSync(qa,{recursive:true});
 const dash=await browser.newContext({viewport:{width:1440,height:900}});
 await dash.addInitScript(()=>{localStorage.setItem('rootsync-dashboard-role','Reliability Engineer');sessionStorage.setItem('rootsync-guide-open','closed')});
 const page=await dash.newPage();
 for(const [name,route] of [['dashboard','/dashboard'],['ko-3201','/assets/ko-3201'],['he-3301','/assets/he-3301']]){
  await page.goto(base+route);
  await page.locator('h1').first().waitFor({state:'visible'});
  if(route.startsWith('/assets/'))await page.locator('.machine-stage[data-ready="true"]').waitFor({state:'visible'});
  await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(preview,name+'.jpg'),type:'jpeg',quality:72,animations:'disabled'});
  console.log('preview',name);
 }
 await dash.close();
 if(process.argv.includes('--previews-only')){await browser.close();return}
 for(const [w,h] of [[1440,900],[1280,720],[1024,768],[768,1024],[390,844],[360,800]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto(base+'/');
  await p.waitForLoadState('networkidle');
  await p.evaluate(async()=>{for(const img of document.images){img.loading='eager';if(!img.complete)await new Promise(r=>{img.onload=img.onerror=r})}});
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  await p.screenshot({path:path.join(qa,`landing-${w}x${h}-hero.png`)});
  await p.screenshot({path:path.join(qa,`landing-${w}x${h}-full.jpg`),type:'jpeg',quality:60,fullPage:true});
  console.log('landing',w,h,'horizontal overflow px:',overflow);
  await ctx.close();
 }
 await browser.close();
})();
