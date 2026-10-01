# KAUSYNC staging

KAUSYNC is a static manufacturing intelligence dashboard for the KO-3201 compressor, HE-3301 exchanger, and the recorded incident portfolio. This repository deploys to the separate public staging site at `https://owfarisz.github.io/manufacturing-reliability-decision-hub-staging/`. The production repository and its GitHub Pages deployment are separate.

## Frozen source snapshot

The read-only builder in `scripts/build-fixtures.py` reads the sibling source directory `Case 2_ Intelligence Manufacturing`. It reads `PI Tag` before `Sheet2` in all five production workbooks, all 720 hourly rows per workbook, all three equipment sheets and 26 weekly rows per asset, and all 380 incident rows with the header on row 3. It checks SHA-256 hashes before and after reading. The 11 workbook hashes, five RCA deck hashes and extracted event chronologies, 720 KO and 720 HE hourly samples, 26 weekly samples per focus asset, and the two original incident records are stored in `src/generated/ui.json`. Other assets and the full incident corpus remain in the ignored local `src/generated/fixtures.json`. Original source files are never written or uploaded.

The site is a **build-time snapshot**, not a live connector. The GitHub runner cannot reach the user's local workbooks. To update the snapshot after a deliberate source change, run the builder locally, inspect the validation report, and commit the derived `ui.json` to staging. The current sources are expected to remain frozen.

```sh
PYTHONPATH=/path/to/openpyxl python3 scripts/build-fixtures.py
npm ci
npm run verify:snapshot
npm run verify:source
npm run typecheck
npm test
npm run build
```

The local Python environment needs `openpyxl`. The source directory may be overridden with `CASE2_DATA_ROOT`. Derived local validation is written to ignored `docs/data-validation.json`.

## Reading the dashboard

Every measured number links to a source file, sheet, field, and timestamp range. The portfolio contains 380 recorded incidents, 2,261.1 hours of downtime, and US$67,194.43k total recorded loss, including potential loss. The KO and HE incident impact panels use their corresponding records, not typed-in display figures.

Weekly condition values and hourly process values are shown separately. KO hourly `KO3201_VIB` is velocity in `MM/S`; weekly radial vibration is displacement in micron. HE hourly `HE3301_DISP` is generic discharge pressure in `BARG`; it is not tube-side differential pressure. No conversion or comparison between those unlike signals is made.

HE rate-normalized dP and duty are unavailable because weekly date-only values cannot be reliably paired with hourly feed rate, and a validated correction model is absent. The rate-effect view preserves every original measurement and records the evidence gap. The boundary window uses only the observed week-to-week dP slope and is explicitly illustrative. At a measured trip-limit breach it shows the breach instead of a zero or missing forecast.

Workflow records are local demonstration data stored under a staging-specific browser key. Engineers must record a disposition and numeric acceptance criteria before a proposal. A manager records approval. Technical closure requires a selected final post-action source week, numeric recovery against source alert limits, an evidence reference, monitoring and upstream attestations, and the relevant engineer role. No action controls plant equipment or updates the historical RCA.

## Deployment

The `staging` branch is pushed to `main` of the separate staging repository. `.github/workflows/pages.yml` verifies the committed source snapshot, typechecks, runs unit tests, builds a static export using the staging repository base path, and publishes that export. Only that staging repository is targeted by this branch's deployment command.
