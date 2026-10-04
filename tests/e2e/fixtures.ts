import {test as base,expect} from '@playwright/test';

// The dashboard opens behind a role picker. Tests start as a Reliability Engineer
// with the first-run guide closed, the same state a returning user has.
export const test=base.extend({page:async({page},use)=>{
 await page.addInitScript(()=>{
  if(!localStorage.getItem('rootsync-dashboard-role'))localStorage.setItem('rootsync-dashboard-role','Reliability Engineer');
  sessionStorage.setItem('rootsync-guide-open','closed');
 });
 await use(page);
}});
export {expect};
