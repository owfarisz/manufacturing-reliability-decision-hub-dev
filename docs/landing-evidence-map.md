# Landing page evidence and claim map

Reviewed 4 October 2026. Each claim on `/` is listed with where it comes from. Source priority when documents disagree: case dataset, then PRD, then financial workbook, then deck, then `ui.json`.

## Naming

| Decision | Basis |
| --- | --- |
| Product name is ROOTSYNC | Dashboard branding, package name, handoff note |
| R.O.O.T. is the operating model | Deck title "R.O.O.T. Strategy", solution and conclusion slides |
| The four dimensions and their one-line definitions | Deck solution slide, quoted without change |
| CALIBER logo and "Proposed by YAPYAP team" | Logo image and team names taken from the deck cover and team profile slide |
| Hero headline "From fragmented evidence to accountable reliability action" | Deck cover subtitle |

The brief uses "ROOT" and the older timeline workbook uses "KAUSYNC". Neither is shown on the page.

## Evidence figures

| Claim | Value | Source | Read from |
| --- | --- | --- | --- |
| Recorded incidents | 380 | Incident Database, rows 4 to 383, January 2024 to July 2026 | `ui.json` portfolio.count |
| Recorded downtime | 2,261.1 h | Incident Database, Downtime (hrs) | `ui.json` portfolio.downtime |
| Recorded exposure | US$67.2M, of which US$61.9M actual and US$5.3M potential | Incident Database, loss columns | `ui.json` portfolio |
| Three failure families | 102 leakage, 59 high vibration, 47 worn out, 54.7% of 380 | Incident Database, F Mechanism, with the deck's normalization | `ui.json` families for the first two, register count for worn out |
| Distinct equipment tags | 379 across 380 incidents, one tag appears twice | Incident Database, Tag Number | Computed from the local workbook |
| Top 20% of incidents | 55.3% of total recorded exposure | Incident Database, Total Loss | Computed from the local workbook |
| Workflow status | 220 active, 113 risk closed, 47 canceled | Incident Database, Overall Status | `ui.json` portfolio.statuses |
| KO-3201 and BL-5702 share a signal with different causes | Cooler leak and water ingress, coupling misalignment and soft foot | RCA2 and RCA5 decks | Static copy |

Notes on the family counts. The raw F Mechanism column gives 101, 57 and 47, because the five RCA anchor rows carry truncated labels such as "High" and "Mechanical". The deck and the snapshot assign those five rows to their family by title, which gives 102 and 59. The page states that labels are normalized and are not verified causes.

## Use cases

| Claim | Source |
| --- | --- |
| KO-3201 mechanism chain, candidate causes, intervention options, three closure states, advisory boundary | PRD-01 sections 1, 2, 5 |
| KO-3201 32 h, US$1.584M actual loss | Incident Database anchor row in `ui.json` |
| KO-3201 1,760 t production loss | RCA2 deck and PRD-01 |
| HE-3301 mechanism chain, four intervention options, three cleaning outcomes | PRD-02 sections 1, 2, 5 |
| HE-3301 12 h, US$183.6K actual loss | Incident Database anchor row in `ui.json` |
| HE-3301 216 t production loss | RCA4 deck and PRD-02 |
| Weekly trend charts, trip-week readings and source limits | Equipment Performance workbooks through `ui.json` |
| Velocity in MM/S is not compared with displacement in micron | PI Tag sheet and Condition History, repository data boundary |
| Rate-normalized dP and duty are unavailable | Repository data boundary, `ui.json` conflicts |
| Roles and what each may do | Target-user tables in both PRDs |

## Business impact

The page shows three quantities as circles whose areas are to scale. It shows no project economics, no roadmap and no risk register. Those stay in the deck.

| Claim | Value | Source and status |
| --- | --- | --- |
| Recorded exposure | US$67.2M | Incident Database through `ui.json`. Stated as a baseline, not savings |
| Two anchor cases | US$1.77M, 44 h, 1,976 t | Sum of KO-3201 and HE-3301. Dataset and RCA decks |
| 20% benchmark scenario | About US$354K, 8.8 h, 395 t | 20% of the anchor figures. The 20% is the deck's benchmark scenario anchor, labelled as a scenario and not a forecast |

## Failure-family distribution

The 380-dot scene stacks every incident by failure family: leakage 102, vibration 59, worn out 47, malfunction 25, low performance 22, fouling 21, crack 20, error 20, loose 18, overheat 16, stuck 15, breakage 15. These were counted from the local register with the five RCA anchor rows assigned by title, and they match the deck's portfolio-profile appendix. `lib/landing-data.ts` fails the build if they stop adding up to the snapshot total.

## Illustrative elements

The hero particle field, the orbit, the four scenes in the R.O.O.T. section and the rows in the workflow walkthrough are illustrations. The ranking scene uses placeholder asset names and is labelled illustrative. The workflow walkthrough follows the KO-3201 flow described in PRD-01 and uses the source alert limit of 500 ppm. The two hero chips, the trend charts and every figure are recorded values.

## Open conflicts

1. **No financial workbook was supplied, and the deck contradicts itself on economics.** The feasibility slide shows NPV Rp 4.4B, IRR 31.3% and payback 3.5 years with FCFF wording. The conclusion slide shows IDR 20.9B, MIRR 42.5% and 2.1 years. The landing page shows none of these.
2. **The deck says 53.3% for the top 20% of incidents on the background slide and 55.3% in the appendix.** The dataset gives 55.3%, which is the figure to use. The page no longer shows this number.
3. **"Upstream is about 68% of actual loss"** in the deck refers to the five RCA cases, not the 380-incident portfolio. The page does not repeat it as a portfolio figure.
