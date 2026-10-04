import {expect, test} from './fixtures';

test('mobile workspaces remain readable without page-wide horizontal overflow', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of ['/', '/dashboard', '/assets/ko-3201', '/assets/he-3301', '/actions']) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, `horizontal overflow on ${route}`).toBeLessThanOrEqual(390);
  }
  await page.goto('/dashboard');
  await page.screenshot({path: 'docs/screenshots/redesign/portfolio-mobile.png', fullPage: true});
});
