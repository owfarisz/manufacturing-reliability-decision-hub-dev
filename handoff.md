# ROOTSYNC Handoff

## Purpose of this handoff

This document transfers the ROOTSYNC work to the next coding session. It records the product direction, architecture, source-data rules, completed work, production deployment, known issues, and the precise work still outstanding.

Read this document before changing the app. Also read `arahan.md` and every document it requires, particularly `UI-REDESIGN-BRIEF.md`, before making a broad design or product change.

## Project location and active repository

- Workspace root: `/Users/owfaris/Documents/lomba/bcc/caliber/new case 2`
- Application root: `/Users/owfaris/Documents/lomba/bcc/caliber/new case 2/prototype`
- Framework: Next.js 16, React 19, TypeScript, Webpack build
- Package name: `rootsync`
- Current local branch at handoff: `dev`
- Current HEAD: `aed6e52 chore: exclude local build artifacts from vercel uploads`
- Previous branding commit: `5ba1f8b feat: align rootsync with root strategy`
- Working tree at handoff: expected clean, verify with `git status --short --branch`

Configured remotes:

- `rootsync`: `https://github.com/owfarisz/rootsync.git`
- `origin`: `https://github.com/owfarisz/manufacturing-reliability-decision-hub.git`
- `staging`: `https://github.com/owfarisz/manufacturing-reliability-decision-hub-staging.git`

The user explicitly does **not** want the production GitHub repository used for the current ROOTSYNC work. Keep using this existing working copy and Vercel deployment. The user requested that development-facing naming be removed for a jury-facing presentation. The intended next repository/branch name is `rootsync` or a ROOTSYNC-named main branch, but this has **not yet been renamed or pushed**. Confirm the preferred Git branch/remote mapping only if needed, then rename deliberately rather than mixing changes into `origin/main`.

## Product goal

ROOTSYNC is a jury-facing manufacturing reliability decision workspace based on the supplied Case 2 data. It must make the engineering story understandable to both operators and non-technical reviewers while remaining evidence-grounded.

The central story is R.O.O.T. from the CALIBER deck:

1. **Rank critical risk**
2. **Organize evidence**
3. **Orchestrate action**
4. **Test effectiveness**

The two highlighted root-cause investigations are:

- **KO-3201 centrifugal compressor**: contamination / water ingress leading to bearing distress and vibration trip.
- **HE-3301 shell-and-tube heat exchanger**: heavy-ends / fouling-related thermal and hydraulic deterioration.

The portfolio also shows five connected assets in a plant context. The two active focus assets are highlighted in color and with red alert markers. The other assets are intentionally subdued gray.

The user calls the product **ROOTSYNC**, never merely “Root”. All product UI text must be English.

## Source data and evidence rules

The authoritative inputs are read-only local artifacts under:

`/Users/owfaris/Documents/lomba/bcc/caliber/new case 2/Case 2_ Intelligence Manufacturing`

Important additional source material:

- `/Users/owfaris/Documents/lomba/bcc/caliber/[CALIBER] Deck (1).pdf`
- `arahan.md`
- `UI-REDESIGN-BRIEF.md`
- PRD and case documents referenced by `arahan.md`

Do not invent measurements, normal limits, causal evidence, or recovery values. The dashboard uses a generated, derived, committed UI snapshot at:

- `src/generated/ui.json`

The original workbooks stay local and are not exposed as a live connector. The dashboard is a static historical-source experience plus client-side decision-workflow interactions.

Known source limitations are deliberately surfaced in the app:

- KO hourly vibration velocity is not the same measurement or unit as weekly radial displacement.
- HE weekly date-only data cannot be safely joined to hourly feed data for a normalized correction.
- Source evidence must be labelled when it is historical, derived, assumed, or scenario-only.
- Do not represent browser workflow state as a plant control system, authenticated enterprise workflow, or live plant system.

## Current user-facing behavior

The app is already dynamic in the browser. It does not need Docker to make the experience interactive.

Interactive elements include:

- Role picker for **Reliability Engineer** and **Maintenance Planner**.
- Role-specific onboarding guidance and action filtering.
- Workflow transitions for evidence, decision, action, restoration, monitoring, and verification.
- Browser-local state persistence through `localStorage`.
- Scenario selector for KO-3201.
- Historical replay controls, including Start/play, selected historical date, interactive chart tooltips, and linked mini-trends.
- 3D WebGL equipment visuals for the compressor and exchanger.
- A 3D draggable five-asset plant composition in the portfolio page.
- Evidence and provenance drawers with recorded source snapshots.
- Responsive mobile and tablet layouts.

The app is a Next.js client-rendered interactive site. It has no backend, database, Docker configuration, authentication provider, or server-side RBAC. Docker is not required for its current dynamic interactions. If a future landing page needs a Docker image, add it as a deployment convenience only, not as a substitute for a real database or authentication service.

## Production deployment

Vercel deployment is already complete and verified.

- Production URL: `https://rootyapyapcaliber.vercel.app`
- Vercel project: `rootyapyapcaliber`
- Production deployment: `https://rootyapyapcaliber-9cbci9ogt-owfaris.vercel.app`
- Deployment ID: `dpl_6nq9EzFubXH25LuAuwtJh1roD91V`
- Vercel status at handoff: **Ready**
- Domain alias confirmed: `rootyapyapcaliber.vercel.app`
- HTTP verification completed: `200`, source HTML contained `ROOTSYNC` and `R.O.O.T.`
- Vercel build completed successfully, reported build duration one minute.
- No runtime environment variables or secrets are required.

The Vercel CLI used locally is installed outside the repository:

`/private/tmp/root-vercel/node_modules/.bin/vercel`

The local CLI was authenticated as the user account `owfarisz` during this session. Do not print, commit, or copy any credentials. Before deployment, check authentication with:

```bash
/private/tmp/root-vercel/node_modules/.bin/vercel whoami
```

Deploy the currently linked project with:

```bash
/private/tmp/root-vercel/node_modules/.bin/vercel deploy --prod --yes
```

Do not create an alternative Vercel domain automatically. The user authorized only free Vercel Hobby usage and does not want paid plans, trials, domains, or services.

## Deployment configuration

`next.config.ts` supports two modes:

- GitHub Pages mode when `GITHUB_PAGES_BASE_PATH` is set. It creates a static export and base path.
- Normal Vercel mode when it is not set. This is the desired mode for ROOTSYNC production.

`vercel.json` does not exist and is not required.

`.vercelignore` was added in commit `aed6e52`. It prevents stale local artifacts from bloating uploads:

- `.next`
- `node_modules`
- `node_modules-broken`
- `.npm-cache`
- test artifacts
- generated local validation artifacts

`.vercel/` is ignored by `.gitignore` and must remain uncommitted.

## Major completed work

### Naming and R.O.O.T. alignment

- Renamed visible product branding from the former product brand to **ROOTSYNC**.
- Updated metadata title and description in `app/layout.tsx`.
- Updated sidebar brand mark from K to R.
- Added the R.O.O.T. framing in the portfolio header.
- Updated relevant product storage keys from the former product brand values to ROOTSYNC values.

### Portfolio and evidence experience

- Portfolio has a priority decision queue for KO-3201 and HE-3301.
- Five-asset plant visualization sits beneath the queue and is an actual draggable 3D composition, not a flat image.
- KO-3201 and HE-3301 have attached red alert markers that should move with their 3D equipment geometry.
- Portfolio has evidence-driven incident distribution and actual-loss charts.
- Data quality and source reconciliation section documents limitations and opens evidence detail.
- Evidence drawers provide source metadata and checkpoint tables.

### Asset workspaces

- KO-3201 uses a centrifugal-compressor 3D visual.
- HE-3301 uses a shell-and-tube exchanger 3D visual.
- Historical replay is interactive and linked across related charts and mini-trends.
- Thresholds identify normal, attention, and trip bands so a non-technical reviewer can understand the condition.
- Tooltips supply time and measurement context.
- The HE rate-effect area describes “No rising pace” as stable recorded raw behavior rather than missing data, subject to source limitations.
- The previously problematic animated exchanger flow was intentionally rolled back so it behaves consistently with the compressor visual.

### Role and onboarding

- Roles were reduced to two user-requested personas:
  - Reliability Engineer
  - Maintenance Planner
- The role switcher is in the sidebar, not overlaying the main content.
- A role picker appears before entering the workspace.
- Onboarding has both page explanation and guided flow concepts, guide navigation, back/next controls, scroll-to-focus, and a supplied memoji image.
- The guide highlights the relevant target while fading other content.
- The guide includes instructions for Historical replay and its Start control.

### Responsive QA

- Prior mobile/tablet overflow issues were addressed with responsive CSS and page-level QA.
- The app should be tested again after any landing-page or layout change at mobile, tablet, and desktop widths.

## Important files

### Application entry points

- `app/page.tsx`
- `app/actions/page.tsx`
- `app/assets/ko-3201/page.tsx`
- `app/assets/he-3301/page.tsx`
- `app/layout.tsx`
- `app/globals.css`

### Core components

- `components/DevHub.tsx` — top-level role gate and shell orchestrator. **Rename this to `RootHub.tsx` as part of the pending cleanup**, then update imports in app route files.
- `components/Hub.tsx` — portfolio, asset pages, actions, charts, evidence drawer, workflow UI.
- `components/OnboardingTour.tsx` — role picker and guided tours.
- `components/EquipmentFleet.tsx` — draggable 3D five-asset plant composition.
- `components/EquipmentVisual.tsx` — 3D compressor/exchanger visuals.
- `components/RoleLanding.tsx` — alternate role landing implementation, inspect before changing/removing.

### Domain and data

- `domain/decision.ts`
- `domain/workflow.ts`
- `src/generated/ui.json`
- `scripts/build-fixtures.py`
- `scripts/verify-snapshot.mjs`

### Documentation and validation

- `arahan.md`
- `UI-REDESIGN-BRIEF.md`
- `README.md`
- `docs/requirements-status.md`
- `docs/redesign-decisions.md`
- `docs/ui-reference-audit.md`
- `tests/e2e/demo.spec.ts`

## Pending work at the time of handoff

The latest user request has not yet been implemented. It has two parts.

### 1. Remove development-facing language for the jury-facing production experience

The Vercel site is production and already has no `DEV PREVIEW` or `STAGING DEMO` banner because its current storage namespace does not match those suffixes. However, visible product copy still uses “demo”, “simulated”, and “staging” in several places. These labels should be cleaned up without claiming that the application has live plant control or authenticated enterprise RBAC.

Current examples found in `components/Hub.tsx` include:

- `Reset demo`
- `Demo awaiting approval`
- `Demo blocked`
- `Named demo assignee`
- `Deterministic local demo state`
- `demo cases`
- `No demo cases match this filter`
- `No human transition recorded in this demo session`
- wording that calls the public workflow a “staging demo”

Suggested safe replacements:

- `Reset workspace`
- `Cases awaiting approval`
- `Blocked cases`
- `Named assignee`
- `Browser workspace state`
- `active cases`
- `No cases match this filter`
- `No human transition recorded in this session`
- `Roles guide workflow access in this browser workspace. Authentication is not configured for this presentation.`

Do not remove the factual distinctions between historical source records, locally entered workflow state, and plant controls. The copy can be polished while retaining that boundary.

`components/OnboardingTour.tsx` and `components/RoleLanding.tsx` also say “public demo”. Change these to “presentation workspace” or equivalent.

`components/Hub.tsx` currently includes this environment-label logic:

```ts
const demoNamespace=process.env.NEXT_PUBLIC_DEMO_STORAGE_NAMESPACE??'local';
const storageKey=demoNamespace==='local'?'rootsync-demo-v1':`rootsync-demo-v1:${demoNamespace}`;
const environmentLabel=demoNamespace.endsWith('-staging')?'STAGING DEMO':demoNamespace.endsWith('-dev')?'DEV PREVIEW':null;
```

Recommended cleanup:

- Rename `demoNamespace` and `NEXT_PUBLIC_DEMO_STORAGE_NAMESPACE` to a neutral workspace storage name.
- Use a storage key such as `rootsync-workspace-v1`.
- Remove `environmentLabel` UI entirely.
- Preserve a simple migration fallback only if older browser state compatibility matters.

This is a text and local-storage namespace cleanup. It should not change the data model or workflow behavior.

### 2. Rename the working branch / delivery identity

The user said: “do not go to the production repo, keep using this repository, but rename it to main ROOTSYNC.” The intent is to stop presenting the current work as `dev` to the jury.

Safest proposed sequence:

1. Complete the UI copy cleanup and test it.
2. Rename local `dev` branch to `rootsync`:

   ```bash
   git branch -m dev rootsync
   ```

3. Push it to the existing `dev` remote as its `main` branch only if the user wants GitHub updated:

   ```bash
   git push dev rootsync:main
   ```

4. Do **not** push to `origin` unless the user explicitly asks to update the old production repository.
5. Optionally rename the GitHub repository through `gh repo edit` only after confirming, because it changes external repository URLs. This was not performed.

The Vercel deployment is independent of the Git branch and will keep working after local branch rename. Redeploy from this working directory after code cleanup.

## Failed or problematic attempts and what to avoid

### Local Next build lock

`npm run build` was attempted several times. It started normally but an earlier Next build left `.next/lock` behind. A later detached build reported:

```text
Another next build process is already running.
```

The lock was removed and the visible process was later terminated after Vercel had already completed a successful clean production build. The tool environment sometimes returned before the local build child reported completion, so do not infer a code compilation error from the incomplete local terminal output.

Before retrying a local build:

```bash
rm -f .next/lock
npm run build
```

Only remove the specific `.next/lock` file, never wipe project directories broadly. If it still hangs, identify a `next build` process and stop only that process, then retry. Vercel’s verified production build has already compiled the same committed source successfully.

### Vercel deployment initially appeared stalled

The first Vercel deployment scan found roughly 22,716 files because local `.next` and package artifacts were included in the upload tree. It appeared to stall before creating a deployment.

Resolution: add `.vercelignore` in commit `aed6e52`. A retry found 56 files, created the deployment, and completed successfully.

Do not remove `.vercelignore` unless replacing it with an equivalent upload exclusion policy.

### Vercel CLI quirks

- `vercel alias ls <domain>` is invalid. Use `vercel alias ls` with no domain argument.
- `--name` is deprecated but worked sufficiently to create the project. The linked `.vercel/project.json` now identifies the right project.
- Do not use an alternate domain if the requested alias becomes unavailable. Stop and report that exact reason.

### Earlier UI regressions already fixed

Prior issues included broken role-picker styling, a GitHub Pages route error, guide overlays that blocked normal usage, an unreadable exchanger animation, missing-water scenario inconsistencies, and side-role controls overlapping content. These were fixed in the current code. Re-test them after structural changes.

## Validation commands

Run from the application root:

```bash
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Source snapshot validation:

```bash
npm run verify:snapshot
npm run verify:source
```

When browser QA is available, test at least:

- Portfolio page
- KO-3201 overview, evidence, decision, action, verification
- HE-3301 overview, evidence, decision, action, verification
- Action center with both roles
- Role change/logout and first-run guide
- Historical replay with Start/play
- 3D asset model rotation
- Five-asset plant drag/rotation and attached markers
- Responsive mobile and tablet layouts
- Production URL after redeploy

## Next step recommended for the next agent

1. Read `arahan.md`, `UI-REDESIGN-BRIEF.md`, and this handoff.
2. Replace all jury-visible development/demo/staging copy with presentation-ready wording while retaining source and safety boundaries.
3. Rename `DevHub.tsx` to `RootHub.tsx` and update its imports, to remove the remaining development-oriented code identity.
4. Change browser storage naming from `rootsync-demo-v1` to `rootsync-workspace-v1` without breaking normal entry.
5. Run typecheck and focused browser QA.
6. Commit with a clear ROOTSYNC production-readiness message.
7. Rename branch `dev` to `rootsync` locally. Push only to the existing `dev` remote’s `main` branch if requested, never to `origin` without explicit user direction.
8. Deploy to the same Vercel production project and verify `https://rootyapyapcaliber.vercel.app` still returns ROOTSYNC.
9. For the planned landing page, treat it as an additional route or entry page that leads into the existing workspace. Preserve all current routes and interactive dashboard behavior.

## Communication preferences from the user

- Operate in auto mode. Ask only for genuinely dangerous, destructive, charged, or irreversible actions.
- Use Indonesian conversationally, but all product UI text must be English.
- Avoid semicolons in UI copy.
- Avoid generic AI-sounding text.
- User prefers concise progress updates and expects work to be carried through rather than stopped for routine confirmation.
- Do not claim source data is live, do not make up numbers, and do not expose local source files or secrets.
- Palette should remain white / very pale blue with deep blue and yellow accents. Red is reserved for urgent or abnormal conditions.

