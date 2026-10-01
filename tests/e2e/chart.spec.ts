import {test,expect} from '@playwright/test';
test('weekly charts render all sourced series immediately',async({page})=>{
 await page.goto('/assets/ko-3201');
 await expect(page.locator('.recharts-line-curve')).toHaveCount(2);
 await page.goto('/assets/he-3301');
 await expect(page.locator('.recharts-line-curve')).toHaveCount(3);
});
test('replay selection updates measured cards and boundary state',async({page})=>{
 await page.goto('/assets/ko-3201');
 await page.getByRole('button',{name:/Recorded trip/}).click();
 await expect(page.locator('.condition').first()).toContainText('76.5');
 await page.getByRole('button',{name:'Play replay'}).click();
 await expect(page.getByRole('button',{name:'Pause replay'})).toBeVisible();
 await page.getByRole('button',{name:'Pause replay'}).click();
 await page.goto('/assets/he-3301');
 await page.getByRole('button',{name:/Recorded trip/}).click();
 await expect(page.locator('.condition').first()).toContainText('0.918');
 await expect(page.getByText('SOURCE TRIP LIMIT BREACHED')).toBeVisible();
});
