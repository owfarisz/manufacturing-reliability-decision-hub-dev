import {afterEach,describe,expect,it,vi} from 'vitest';

afterEach(()=>{vi.unstubAllEnvs();vi.resetModules()});

describe('internal URL helper',()=>{
 it('keeps routes base-free so next/link can prefix them',async()=>{
  vi.stubEnv('NEXT_PUBLIC_BASE_PATH','/rootsync');
  const {routes}=await import('../lib/paths');
  expect(routes).toEqual({home:'/',dashboard:'/dashboard',ko:'/assets/ko-3201',he:'/assets/he-3301',actions:'/actions'});
 });
 it('prefixes raw asset URLs with the static-export base path',async()=>{
  vi.stubEnv('NEXT_PUBLIC_BASE_PATH','/rootsync');
  const {asset}=await import('../lib/paths');
  expect(asset('/landing/dashboard.jpg')).toBe('/rootsync/landing/dashboard.jpg');
  expect(asset('landing/dashboard.jpg')).toBe('/rootsync/landing/dashboard.jpg');
 });
 it('leaves asset URLs unprefixed on Vercel and local development',async()=>{
  vi.stubEnv('NEXT_PUBLIC_BASE_PATH','');
  const {asset}=await import('../lib/paths');
  expect(asset('/landing/dashboard.jpg')).toBe('/landing/dashboard.jpg');
 });
});
