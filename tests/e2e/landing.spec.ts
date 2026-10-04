import {test,expect} from './fixtures';

const viewports=[[1440,900],[1280,720],[1024,768],[768,1024],[390,844],[360,800]] as const;

test('root route is the landing page and explains problem, solution and demo',async({page})=>{
 const errors:string[]=[];
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('From fragmented evidence');
 await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
 await expect(page.getByText('Built on a historical case snapshot')).toBeVisible();
 await expect(page.getByRole('link',{name:'Open the live demo'})).toHaveAttribute('href',/\/dashboard\/?$/);
 await expect(page.getByRole('link',{name:'Launch Live Demo'}).first()).toBeVisible();
 await expect(page.locator('#evidence')).toContainText('380');
 await expect(page.locator('#evidence')).toContainText('2,261.1 h');
 await expect(page.locator('#evidence')).toContainText('US$67.2M');
 await expect(page.locator('#problem')).toContainText('Three mechanisms keep coming back.');
 await expect(page.locator('#problem svg circle.dot')).toHaveCount(380);
 await expect(page.locator('#root')).toContainText('Rank Critical Risk');
 await expect(page.locator('#root')).toContainText('Test Effectiveness');
 await expect(page.locator('#impact')).toContainText('benchmark scenario');
 for(const dropped of ['FCFF','NPV','Payback','Phase gates','visible boundaries'])await expect(page.locator('main')).not.toContainText(dropped);
 await expect(page.getByRole('heading',{name:'What needs a decision now'})).toHaveCount(0);
 expect(errors,'console or hydration errors on the landing page').toEqual([]);
});

test('dashboard route renders the existing portfolio',async({page})=>{
 await page.goto('/dashboard');
 await expect(page.getByRole('heading',{name:'What needs a decision now'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Portfolio'})).toHaveAttribute('aria-current','page');
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'KO-3201'}).click();
 await expect(page).toHaveURL(/\/assets\/ko-3201\/?$/);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Portfolio'}).click();
 await expect(page).toHaveURL(/\/dashboard\/?$/);
});

test('a first-time visitor reaches the role picker from the landing page',async({browser})=>{
 const context=await browser.newContext();
 const page=await context.newPage();
 await page.goto('/');
 await page.getByRole('link',{name:'Launch Live Demo'}).first().click();
 await expect(page).toHaveURL(/\/dashboard\/?$/);
 await expect(page.getByRole('dialog',{name:'Choose your dashboard role'})).toBeVisible();
 await context.close();
});

test('navbar anchors scroll to their sections',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 const nav=page.getByRole('navigation',{name:'Page sections',exact:true});
 for(const [label,id] of [['Problem','problem'],['R.O.O.T.','root'],['Use Cases','use-cases'],['Workflow','workflow'],['Demo','demo']] as const){
  await nav.getByRole('link',{name:label,exact:true}).click();
  await expect(page.locator(`#${id}`)).toBeInViewport();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
 }
});

test('mobile menu opens, navigates and closes',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const toggle=page.getByRole('button',{name:'Open menu'});
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await toggle.click();
 const drawer=page.getByRole('navigation',{name:'Page sections, mobile'});
 await expect(drawer).toBeVisible();
 await expect(drawer.getByRole('link',{name:'Launch Live Demo'})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(drawer).toBeHidden();
 await page.getByRole('button',{name:'Open menu'}).click();
 await drawer.getByRole('link',{name:'Workflow'}).click();
 await expect(drawer).toBeHidden();
 await expect(page.locator('#workflow')).toBeInViewport();
});

test('use-case selector switches panels by click and keyboard',async({page})=>{
 await page.goto('/');
 const ko=page.getByRole('tab',{name:/KO-3201/}),he=page.getByRole('tab',{name:/HE-3301/});
 await expect(ko).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tabpanel')).toContainText('Rotating Equipment Reliability Engineer');
 await expect(page.getByRole('tabpanel')).toContainText('stay on separate charts');
 await he.click();
 await expect(he).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tabpanel')).toContainText('Rate-normalized dP and duty are unavailable');
 await expect(page.getByRole('tabpanel').getByRole('link',{name:'Explore HE-3301'})).toHaveAttribute('href',/\/assets\/he-3301\/?$/);
 await he.press('ArrowLeft');
 await expect(ko).toHaveAttribute('aria-selected','true');
 await expect(ko).toBeFocused();
 await expect(page.getByRole('tabpanel').getByRole('link',{name:'Explore KO-3201'})).toHaveAttribute('href',/\/assets\/ko-3201\/?$/);
});

test('demo calls to action point at the preserved routes',async({page})=>{
 await page.goto('/');
 const demo=page.locator('#demo');
 await expect(demo.getByRole('link',{name:'Launch ROOTSYNC Demo'})).toHaveAttribute('href',/\/dashboard\/?$/);
 await expect(demo.getByRole('link',{name:'Explore KO-3201'})).toHaveAttribute('href',/\/assets\/ko-3201\/?$/);
 await expect(demo.getByRole('link',{name:'Explore HE-3301'})).toHaveAttribute('href',/\/assets\/he-3301\/?$/);
 await expect(demo.getByRole('link',{name:'Open Action Center'})).toHaveAttribute('href',/\/actions\/?$/);
 await expect(demo).toContainText('frozen case-data snapshot');
 for(const img of await demo.locator('img').all()){
  await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
 }
 await demo.getByRole('link',{name:'Open Action Center'}).click();
 await expect(page).toHaveURL(/\/actions\/?$/);
});

test('reduced motion keeps every section visible and nothing pinned',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:900}});
 const page=await context.newPage();
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.locator('.lp.lp-ready')).toHaveCount(1);
 const hidden=await page.evaluate(()=>Array.from(document.querySelectorAll('.lp [data-reveal], .lp [data-intro], .lp h1, .lp h2')).filter(el=>getComputedStyle(el).opacity!=='1'||getComputedStyle(el).visibility==='hidden').length);
 expect(hidden).toBe(0);
 expect(await page.locator('.pin-spacer').count()).toBe(0);
 await expect(page.locator('#problem .lp-field-cap').last()).toBeVisible();
 for(const name of ['Rank Critical Risk','Organize Evidence','Orchestrate Action','Test Effectiveness']){
  const heading=page.getByRole('heading',{name});
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeInViewport();
 }
 await context.close();
});

test('landing page has no horizontal overflow at the required viewports',async({page})=>{
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  await page.goto('/');
  await expect(page.getByRole('link',{name:'Launch Live Demo'}).first()).toBeInViewport();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,`horizontal overflow at ${width}x${height}`).toBeLessThanOrEqual(0);
 }
});

test('scrolling the pinned problem scene regroups the incidents by mechanism',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 const first=page.locator('#problem svg circle.dot').first();
 const before=await first.getAttribute('cx');
 await page.locator('#problem .lp-field').scrollIntoViewIfNeeded();
 for(let i=0;i<14;i++){await page.mouse.wheel(0,400);await page.waitForTimeout(120)}
 await expect.poll(()=>first.getAttribute('cx'),{timeout:15000}).not.toBe(before);
 await expect(page.locator('#problem .lp-field-cap').last()).toBeVisible();
});

test('workflow walkthrough shows what each owner does',async({page})=>{
 await page.goto('/');
 const flow=page.locator('#workflow');
 await flow.getByRole('button',{name:/Approve/}).click();
 await expect(flow.getByRole('button',{name:/Approve/})).toHaveAttribute('aria-pressed','true');
 await expect(flow.locator('.lp-scene')).toContainText('Step 5 of 8');
 await expect(flow.locator('.lp-scene')).toContainText('Weighs equipment risk against production continuity.');
 await flow.getByRole('button',{name:/Capture learning/}).click();
 await expect(flow.locator('.lp-scene')).toContainText('Reliability Manager');
});

test('closing statement is fully marked once it is on screen',async({page})=>{
 await page.goto('/');
 const closing=page.locator('.lp-closing');
 await closing.scrollIntoViewIfNeeded();
 await expect(closing).toContainText('The goal is not to predict every failure.');
 await expect(closing.locator('mark.lit')).toHaveCount(3,{timeout:15000});
});

test('phone and tablet hero keeps every element inside the screen and unobstructed',async({browser})=>{
 for(const [width,height] of [[360,800],[390,844],[768,1024],[820,1180],[1024,768]] as const){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true});
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.locator('.lp.lp-ready')).toHaveCount(1);
  await page.waitForTimeout(2600);
  const report=await page.evaluate(()=>{
   const vw=document.documentElement.clientWidth;
   const box=(sel:string)=>Array.from(document.querySelectorAll(sel)).map(el=>el.getBoundingClientRect());
   const outside=['.lp-hero h1','.lp-hero-body','.lp-proposed','.lp-hero-demo','.lp-chip','.lp-cta .lp-btn'].flatMap(sel=>box(sel).filter(r=>r.left<-1||r.right>vw+1).map(()=>sel));
   const demo=box('.lp-hero-demo')[0],proposed=box('.lp-proposed')[0],ticker=box('.lp-ticker')[0];
   const chipBottom=Math.max(...box('.lp-chip').map(r=>r.bottom));
   return {outside,demoBelowCredit:demo.top>=proposed.bottom-1,chipsAboveTicker:chipBottom<=ticker.top+1};
  });
  expect(report,`hero layout at ${width}x${height}`).toEqual({outside:[],demoBelowCredit:true,chipsAboveTicker:true});
  await context.close();
 }
});

test('phone layout groups the incidents into readable bands',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();
 await page.goto('/');
 const field=page.locator('#problem .lp-field');
 await expect(field).toHaveClass(/compact/);
 await field.locator('svg').scrollIntoViewIfNeeded();
 await expect(field.locator('.lp-field-cap').last()).toBeVisible({timeout:15000});
 await expect(field.locator('.lp-field-label').first()).toBeVisible();
 const box=await field.locator('svg').boundingBox();
 expect(box&&box.width<=390).toBe(true);
 await context.close();
});
