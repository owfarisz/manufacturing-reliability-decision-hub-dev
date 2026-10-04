# Landing page implementation report

4 October 2026, third pass.

## Purpose

The landing page introduces the ROOTSYNC workspace to a jury: what problem it answers, how the R.O.O.T. loop works, what the two use cases look like, and where to open the live demo. It is a visual narrative, not a copy of the deck. Implementation roadmap, project economics and the risk register are left to the deck.

## Story

| Chapter | What the visitor sees |
| --- | --- |
| Hero | Particle field that reacts to the pointer, an orbiting R.O.O.T. loop, and a tilted window cycling through three real dashboard views that opens the live demo |
| 01 The record | Three numbers counting up: 380 incidents, 2,261.1 h, US$67.2M |
| 02 The problem | A pinned scene of 380 dots. Scattered, then one per asset, then stacked by failure family. Followed by one waveform forking into two causes |
| 03 R.O.O.T. | Four panels travelling sideways while the section is pinned. Each plays a short scene: alerts sorting into a ranked queue, sources feeding one evidence ledger, a decision collecting owner and approval, a reading recovering before the case closes |
| 04 Use cases | Tabs for KO-3201 and HE-3301 with trend lines that draw themselves and a mechanism chain that runs to a flashing red trip |
| 05 Workflow | An eight-step walkthrough. The relay advances on its own and a small screen shows what each owner does at that step. Steps can be clicked and the walkthrough paused |
| 06 Impact | Three circles with areas to scale |
| 07 Demo | The real dashboard unfolding from a tilted plane, with links into every route |
| Closing | The closing statement on a dark stage, with the three key words marked one after another |

## Motion stack

GSAP 3.15 with ScrollTrigger and SplitText, and Lenis for smooth scrolling. Both were added as dependencies. GSAP is free for commercial use under its standard licence and Lenis is MIT. The hero background is a small canvas component with no library. Three.js and Recharts are not loaded on the landing page.

With reduced motion requested, nothing is hidden, pinned or moved: the dot scene shows its final grouped state and the R.O.O.T. panels stack vertically. On screens up to 900 px wide nothing depends on pinning. Content waiting for its entrance animation stays in the accessibility tree.

## Files

| Area | Files |
| --- | --- |
| Routes | `app/page.tsx`, `app/landing.css`, `app/icon.svg`, `app/dashboard/page.tsx` |
| Components | `components/landing/Sections.tsx`, `LandingNav.tsx`, `LandingMotion.tsx`, `IncidentField.tsx`, `SignalField.tsx`, `UseCaseExplorer.tsx`, `WorkflowRelay.tsx` |
| Content and data | `content/landing.ts`, `lib/landing-data.ts`, `lib/paths.ts` |
| Dashboard links | `components/Hub.tsx`, `components/OnboardingTour.tsx` |
| Tests and checks | `tests/e2e/landing.spec.ts`, `tests/e2e/fixtures.ts`, `tests/paths.test.ts`, `scripts/verify-export.mjs`, `scripts/capture-landing.cjs` |
| Docs | `README.md`, `docs/landing-evidence-map.md`, `docs/screenshots/landing/` |

Dashboard business logic, `ui.json`, the snapshot builder and the source workbooks are untouched.

## Verification

- `npm run verify:snapshot` and `npm run verify:source` pass.
- `npm run typecheck` passes.
- `npm test` passes, 8 tests.
- `npm run build` passes.
- `npm run test:e2e` passes, 22 tests, including the pinned scene regrouping on scroll and the reduced-motion fallback.
- A GitHub Pages export with a base path passes `npm run verify:export`.
- No horizontal overflow at 1440×900, 1280×720, 1024×768, 768×1024, 390×844 and 360×800.

## Existing tests that were updated

Three dashboard tests were already out of date before this work. They now start with a stored role and assert the current labels. What they protect is unchanged.

## Deployment

- GitHub Pages: pushing to `main` of `owfarisz/rootsync` runs `.github/workflows/pages.yml`, which verifies the snapshot, typechecks, tests, builds a static export under `/rootsync`, checks it with `verify:export`, and publishes to `https://owfarisz.github.io/rootsync/`.
- Vercel: no configuration or environment variables are needed. The same source serves the landing page at `/` and the workspace at `/dashboard`. Deploy the linked project with `vercel deploy --prod` once the page is approved.

## Limitations

- Lighthouse was not run. GSAP and Lenis add to the landing bundle.
- Two figures in the dot scene come from the local workbook and not from the committed snapshot: the full failure-family distribution, and the fact that 379 distinct tags appear across 380 rows.
- The two external reference sites were not opened.
- Motion was checked through scripted scrolling and screenshots in Chrome only, not by hand and not in Safari or Firefox.
- The workflow walkthrough rows and the R.O.O.T. scenes are illustrations of the KO-3201 case flow, not recorded workflow data.
