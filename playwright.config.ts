import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',timeout:90000,expect:{timeout:20000},use:{baseURL:'http://127.0.0.1:3100',...devices['Desktop Chrome'],launchOptions:{channel:'chrome'}},webServer:{command:'npm run start -- --port 3100',url:'http://127.0.0.1:3100',timeout:120000,reuseExistingServer:true}});
