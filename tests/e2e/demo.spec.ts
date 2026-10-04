import {test,expect} from '@playwright/test';

test('portfolio opens sourced KO evidence and decision',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'What needs a decision now'})).toBeVisible();
 await page.getByRole('button',{name:'RCA source'}).first().click();
 await expect(page.getByRole('dialog',{name:'Evidence and provenance'})).toContainText('Slides 2-11');
 await page.getByRole('button',{name:'Close'}).click();
 await page.getByRole('link',{name:/Open asset/}).first().click();
 await expect(page.getByRole('heading',{name:/KO-3201/})).toBeVisible();
 await page.getByRole('button',{name:'Evidence',exact:true}).click();
 await page.getByRole('button',{name:'Open hourly tag metadata'}).click();
 await expect(page.getByRole('dialog',{name:'Evidence and provenance'})).toContainText('MM/S');
 await page.getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Decision',exact:true}).click();
 await expect(page.getByRole('heading',{name:'1 · Compare and select'})).toBeVisible();
});

test('KO displays recorded lube-oil water evidence',async({page})=>{
 await page.goto('/assets/ko-3201');
 await expect(page.getByText('Lube-oil water',{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('img',{name:/Lube-oil water interactive historical trend/})).toBeVisible();
 await expect(page.getByText('Water sample withheld',{exact:true})).toHaveCount(0);
});
test('HE rate-change does not authorize cleaning and normalization stays unavailable',async({page})=>{
 await page.goto('/assets/he-3301');
 await page.getByLabel('Demo scenario').selectOption('rate-change');
 await expect(page.getByText('Do not approve cleaning on a rate-change hypothesis',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Evidence',exact:true}).click();
 await page.getByRole('button',{name:'Normalized view'}).click();
 await expect(page.getByText('NOT CALCULABLE FROM SUPPLIED DATA')).toBeVisible();
 await page.getByRole('button',{name:'Decision',exact:true}).click();
 await expect(page.getByRole('button',{name:'Select'}).nth(3)).toBeDisabled();
});

test('KO intervention keeps approval, execution and verification separate',async({page})=>{
 await page.goto('/assets/ko-3201');
 await page.getByRole('button',{name:'Decision',exact:true}).click();
 await page.getByRole('button',{name:'Select'}).nth(3).click();
 await page.getByLabel('Decision rationale').fill('Weekly water and vibration justify planned inspection.');
 await page.getByLabel('Engineer disposition').selectOption('Accept');
 await page.getByLabel('Disposition reason').fill('Review cooler integrity and bearing condition.');
 await page.getByLabel('Numeric acceptance criteria').fill('Water below 500 ppm and displacement below 45 micron.');
 await page.getByRole('button',{name:'Validate operating state'}).click();
 await page.getByRole('button',{name:'Engineer assessment'}).click();
 await page.getByRole('button',{name:'Propose decision'}).click();
 await expect(page.getByText('Manager approval required.')).toBeVisible();
 await page.getByLabel('Acting role').selectOption('Maintenance / Reliability Manager');
 await page.getByRole('button',{name:'Record manager approval'}).click();
 await page.getByRole('button',{name:'Planner starts work'}).click();
 await page.getByRole('button',{name:'Action',exact:true}).click();
 await page.getByLabel('Field execution evidence').fill('Cooler leak test and bearing work pack');
 await page.getByRole('button',{name:'Technician completes work'}).click();
 await page.getByLabel('Post-action result / operation confirmation').fill('Restart confirmed by supervisor.');
 await page.getByRole('button',{name:'Supervisor confirms restoration'}).click();
 await page.getByRole('button',{name:'Engineer starts monitoring'}).click();
 await expect(page.getByRole('button',{name:'Verify technical closure'})).toBeEnabled();
 await page.goto('/actions');
 await expect(page.getByText('EFFECTIVENESS MONITORING',{exact:true})).toBeVisible();
});

test('My actions responds to role, while All actions retains both cases',async({page})=>{
 await page.goto('/actions');
 await expect(page.locator('.table tbody tr')).toHaveCount(2);
 await page.getByRole('button',{name:'My actions'}).click();
 await expect(page.locator('.table tbody tr')).toHaveCount(1);
 await expect(page.locator('.table tbody')).toContainText('KO-3201');
 await page.getByLabel('View as role (demo)').selectOption('Process Engineer');
 await expect(page.locator('.table tbody')).toContainText('HE-3301');
});

test('3D equipment rotates and pins reveal sourced readings',async({page})=>{
 await page.goto('/assets/ko-3201');
 const stage=page.locator('.machine-stage');
 await expect(stage).toHaveAttribute('data-ready','true');
 const pin=stage.getByRole('button',{name:/DE radial displacement/});
 await pin.hover();
 await expect(stage.getByRole('tooltip')).toContainText('DE radial displacement');
 await expect(stage.getByRole('tooltip')).toContainText('micron');
 const before=await pin.boundingBox();
 const canvas=stage.locator('canvas');
 const box=await canvas.boundingBox();
 if(!box||!before)throw new Error('3D canvas or evidence pin is missing');
 await page.mouse.move(box.x+box.width*.48,box.y+box.height*.55);
 await page.mouse.down();
 await page.mouse.move(box.x+box.width*.72,box.y+box.height*.55,{steps:8});
 await page.mouse.up();
 const after=await pin.boundingBox();
 expect(after?.x).not.toBe(before.x);
 await stage.getByRole('button',{name:'Reset 3D view'}).click();
});

test('Review decision scrolls the opened panel into view',async({page})=>{
 await page.goto('/assets/he-3301');
 await page.getByRole('button',{name:'Review decision'}).click();
 await expect(page.getByRole('heading',{name:'1 · Compare and select'})).toBeInViewport();
});
