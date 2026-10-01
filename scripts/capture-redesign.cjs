const {chromium}=require('@playwright/test');
const fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const out=path.join(__dirname,'../docs/screenshots/redesign');
 fs.mkdirSync(out,{recursive:true});
 const shots=[
  ['portfolio','/'],
  ['ko-overview','/assets/ko-3201'],
  ['ko-decision','/assets/ko-3201','Decision'],
  ['he-overview-fouling','/assets/he-3301'],
  ['he-overview-rate-change','/assets/he-3301','rate-change'],
  ['shared-action-center','/actions']
 ];
 for(const [name,route,mode] of shots){
  await page.goto('http://127.0.0.1:3100'+route);
  if(mode==='Decision')await page.getByRole('button',{name:'Decision',exact:true}).click();
  if(mode==='rate-change')await page.getByLabel('Demo scenario').selectOption('rate-change');
  await page.screenshot({path:path.join(out,name+'.png'),fullPage:false,animations:'disabled'});
  console.log(name,await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight})));
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
