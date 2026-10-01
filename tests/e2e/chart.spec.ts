import {test,expect} from '@playwright/test';
test('weekly charts render both sourced series immediately',async({page})=>{
 await page.goto('/assets/ko-3201');
 await expect(page.locator('.recharts-line-curve')).toHaveCount(2);
 await page.goto('/assets/he-3301');
 await expect(page.locator('.recharts-line-curve')).toHaveCount(2);
});
