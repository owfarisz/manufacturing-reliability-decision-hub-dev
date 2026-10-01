# Manufacturing Reliability Decision Hub

An interactive, local prototype for **CALIBER 2026 Case 2: Manufacturing Intelligence**. It joins a portfolio command center, KO-3201 compressor causal-health assessment, HE-3301 fouling/cleaning assessment, and one governed action and verification workflow. All visible application copy is in English.

The casebook problem is fragmented manufacturing evidence: operating measurements, weekly equipment records, retrospective RCAs, incident materiality, and action ownership live in different places. This prototype connects an abnormal signal to a probable mechanism, source-linked evidence, a human decision, an approved action, and an effectiveness check. It is advisory and sends no command to plant control systems.

## Actors and decisions

- **Operations Manager / Plant Manager:** prioritizes portfolio exposure and approves production-impacting interventions.
- **Rotating Equipment Reliability Engineer:** owns KO assessment, technical criteria, and final KO verification.
- **Process Engineer / Heat Exchanger Performance Owner:** owns HE normalization review, trade-off, and final HE verification.
- **Shift Supervisor / Console Operator:** validates operating context and confirms restored operation.
- **Maintenance Planner:** schedules approved work, owner, resources, and due date.
- **Technician:** attaches field execution evidence and marks physical work complete. This cannot close the case.
- **Maintenance / Reliability Manager:** approves high-impact work and receives closure status.
- **Data Steward:** validates mappings, timestamps, thresholds, and source conflicts, without changing technical decisions.
- **AI decision support:** presents explainable, rule-based assessments. It does not change state without a human action.

## Architecture

Next.js App Router, TypeScript, Recharts, local JSON fixtures, and localStorage for repeatable demo workflow state. The read-only Python fixture builder is the source adapter. `domain/decision.ts` owns explainable KO and HE rules; `domain/workflow.ts` owns role-gated transitions and audit history. `components/Hub.tsx` renders all four workspaces and the one-click provenance drawer. No runtime network or database is required.

### Source mapping

| Local source | Read by adapter | Used for |
|---|---|---|
| Five Production Data workbooks | `PI Tag` before all 720 `Sheet2` rows each | Hourly run status, operating context, original tag units and descriptions |
| Five Equipment Performance workbooks | `Equipment Info`, all 26 `Condition History` rows, `Performance Summary` | Weekly engineering metrics, source thresholds, post-repair observations |
| Incident Database workbook | `Dashboard` and 380 records from `Incident Database`, header at Excel row 3 | Portfolio materiality, statuses, loss, failure-title families |
| Five RCA decks | Manually verified, source-linked fixture statements | Retrospective physical mechanisms, timelines, reported impact and actions |
| Booklet and casebook | Read during implementation | Competition scope and required English deliverables |

All app-facing source metrics carry a provenance type and source registry reference. Click the source label on a metric, insight, chart, warning, or recommendation to see file, sheet/field, time range, formula, and limitation. `src/generated/fixtures.json` contains the complete normalized workbook rows; `src/generated/ui.json` is a small display adapter for the two anchor assets. `docs/data-validation.json` stores row counts, ranges, null counts, source SHA-256 hashes, and reconciliations. The generated files are local fixtures, not claims of live plant connectivity.

### Regenerate fixtures

The builder defaults to the sibling `Case 2_ Intelligence Manufacturing` directory. Override the location if needed:

```bash
export CASE2_DATA_ROOT='/absolute/path/to/Case 2_ Intelligence Manufacturing'
python3 -m pip install openpyxl
cd prototype
npm install
npm run fixtures
```

The script opens each workbook read-only, never saves to the source, and verifies its SHA-256 hash before and after parsing. Timestamps retain their source strings; no timezone is invented. The source files should remain unchanged.

If your shell uses a Python without `openpyxl`, run the builder with another environment that has it, for example `python3 scripts/build-fixtures.py` after activating that environment. The app runs from committed generated fixtures after npm dependencies are installed.

### Run and test

```bash
cd prototype
npm install
npm run dev
```

Open `http://127.0.0.1:3000`. Use `npm run build`, `npm run typecheck`, and `npm test` for validation. Run `npm run build` before `npm run test:e2e`: browser tests start the production server on port 3100 and use the installed local Chrome channel. On a machine without Chrome, update `playwright.config.ts` to use an installed Playwright browser.

### GitHub Pages preparation

The optional GitHub Actions workflow exports static pages under `/manufacturing-reliability-decision-hub`. The regular local build and browser tests retain the root path. To validate the Pages export locally, run `GITHUB_PAGES_BASE_PATH=/manufacturing-reliability-decision-hub npm run build` and inspect `out/`. The workflow requires GitHub Pages to use GitHub Actions as its publishing source.

The repository ignore rules exclude the original source extracts, full normalized fixture corpus, and validation report. The published app still includes `src/generated/ui.json` in its browser bundle: it contains the displayed case figures, weekly KO/HE samples, provenance labels, and scenario inputs. Anyone able to visit the Pages site can inspect that data. The app has no login or server-side access control. The full source-contract tests run only when the local normalized fixture is present; assessment and workflow tests run in either case.

## Data semantics and limitations

- **Actual hourly** means source historian workbook rows. **Actual weekly** means equipment condition rows. **RCA reported** and **incident recorded** refer to their original files. **Derived** means a disclosed calculation. **Assumed** and **simulated** are visibly labelled demonstration inputs and state.
- KO hourly `KO3201_VIB` is labelled `MM/S`; weekly DE radial displacement is `micron`. These series are not converted or joined. The weekly 45/75 micron limits never apply to the hourly tag. The RCA also refers to a historical 60 micron alert. Engineering validation is required.
- KO RCA slide 6 calls oil pressure normal at 1.8 barg; its weekly failure row reports 1.078 barg. The app shows both rather than reconciling without evidence.
- HE hourly `HE3301_DISP` is generic discharge pressure. Fouling logic uses weekly `Tube-side dP (bar)` only.
- HE hourly workbook has 13 inclusive OFF samples from 09:00 through 21:00 on 21 May. The RCA reports 12 elapsed hours. These are distinct event representations.
- Water content, oil pressure, tube-side dP, duty and heavy-ends exist in weekly records, but not in the hourly production tags. Weekly and hourly values do not have fully aligned timestamps.
- The HE demonstration normalizes pressure using `dP_norm = dP_raw × (30 / rate)^2` and duty using `duty_norm = duty_raw × (30 / rate)`. The 30 t/h reference rate, exponent 2, and linear duty scaling are **unvalidated assumptions**. There is no actual rate aligned to the full weekly history; no physical UA, Cp, or density is fabricated. The counterfactual rate-change scenario is simulated. The runway is a broad range derived from the prior weekly dP slope and the source 0.9 bar boundary. It is not certified remaining useful life.
- KO and HE have one recorded failure each in 26 weekly samples, with a post-repair reset. Correlation is not causal proof, and the prototype makes no ML accuracy or guaranteed warning-lead-time claim.
- Portfolio failure-family counts are keyword groups of incident titles and may overlap. They do not prove repeat failures of a given asset. Source actions and incidents are historical; demo workflow actions are separate simulated records.

## Explainable decision logic

KO ranks cooler ingress highest only when weekly displacement, water, and bearing evidence align. A missing or stale water sample yields `EVIDENCE_INSUFFICIENT` and requests validation. The RCA cooler test is post-event confirmation, so pre-intervention use still calls for inspection. Alternative causes include surge, bearing wear, and sensor issues, each with an explanation.

HE compares raw and normalized dP/duty with heavy-ends. Genuine degradation supports a planned cleaning decision after review. In the rate-change scenario, raw duty falls but normalized performance stays near baseline, so cleaning is not recommended. Missing filter dP and time-aligned flow remain visible evidence gaps.

Both assets share a workflow state machine, role permissions, a recorded audit entry per transition, and a closure gate. An action requires owner, named assignee, due date, rationale, and manager approval before work starts. Technician completion, supervisor restoration, engineer monitoring, and engineer-verified closure are separate events. The verification screen requires field evidence, post-action result, technical criteria, observation window, and upstream cause control or tracked follow-up.

## Three-minute demo walkthrough

1. **0:00–0:30 — Portfolio.** Show 380 incidents, 2,261.1 hours and US$67.194M recorded total loss. Open the KO priority card and explain why the next decision is an engineer assessment.
2. **0:30–1:15 — KO.** Replay the weekly rise in water and vibration, open the provenance drawer, and show the unresolved hourly-vibration unit conflict. Compare candidate causes. Switch briefly to `Evidence insufficient` to show the system abstaining, then return to the confirmed chain.
3. **1:15–2:00 — HE.** Show actual weekly dP/duty deterioration and the assumed normalized view. Switch to `Rate-change false positive` to show no cleaning recommendation. Return to fouling and inspect the bounded runway and trade-off board.
4. **2:00–3:00 — Action and verification.** Propose planned cleaning as Process Engineer, select Manager to approve, record planner start and technician completion, confirm restoration as supervisor, then verify only after monitoring criteria are checked by the Process Engineer. Open Actions to see the audit trail. Use `Reset demo` to restore deterministic initial state.

## Productionization roadmap

1. Validate tag units, sensor locations, threshold authority, operating state alignment, and weekly versus hourly temporal semantics with engineering and data stewardship.
2. Integrate read-only historian, lab, RCA, and CMMS APIs with freshness and quality monitoring. Run the assessment in shadow mode and measure false positives.
3. Agree on the HE normalization basis, flow exponents, duty model, boundary persistence, and consequence calculation with Process and Operations.
4. Add authenticated roles, approved authority matrix, immutable audit records, real work-order links, and monitored effectiveness windows. Keep protective alarms and control systems independent.

## Reference and source notes

- `docs/data-validation.json` records machine-checked source counts, hashes, and eight material conflicts.
- `docs/external-references.md` lists external framework documentation used for implementation. No external value is presented as an actual plant fact.
- `docs/source-extracts/` contains local read-only extracts prepared while reviewing the supplied booklet, casebook, and RCA decks.
