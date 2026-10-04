import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['tests/decision.test.ts','tests/paths.test.ts'],exclude:['node_modules-broken/**','**/node_modules/**']}});
