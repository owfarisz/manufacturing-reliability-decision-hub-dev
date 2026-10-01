# KAUSYNC staging requirement trace

This trace covers the Must Have sections of the two source PRDs. The user's later instruction to use only actual source measurements takes precedence over simulated numeric values in the PRDs. A missing source field is shown as missing, rather than filled with a guessed value.

| Requirement | Staging implementation | Source-limited remainder |
| --- | --- | --- |
| KO M1 Historical replay | 26 source weeks, scrubber, play/pause, water/condition alerts, trip and first normal markers, linked chart and condition cards, plus RCA-reported sub-day event log | Weekly date-only samples cannot be synchronized precisely with RCA sub-day events |
| KO M2 Condition overview | Four weekly condition metrics with source, units, date, quality and trip distance, plus four same-day hourly context ranges with source and derivation | Hourly velocity in MM/S is not converted to weekly displacement in micron; no aligned sample timestamp |
| KO M3 Causal health | Causal ribbon, evidence states, ranked alternatives, engineer disposition and reason, evidence-insufficient path | Post-event cooler confirmation is identified as historical evidence, not a pre-trip observation |
| KO M4 Trip runway | Source limit, selected and previous measured displacement, observed slope, illustrative range, breach banner, immediate checks and escalation role | One event and weekly sampling do not support a calibrated predictive confidence interval |
| KO M5 Intervention | Monitoring, sample, cooler, bearing, sensor, load and controlled-shutdown options; named owners, window, approval, prerequisites and numeric criteria | Future production impact and downtime are qualitative because no supported estimate exists |
| KO M6 Verified closure | Baseline, pre-trip, trip, first post-action and final observed readings; distinct work completion, restoration and technical verification gates | Source post-action readings support numeric recovery, while field work and observation attestations remain local demo records |
| KO M7 Demo controls | Reset, local state, recorded and missing-evidence views | Missing-water view is explicitly a simulated quality condition; numeric source readings are never changed |
| HE M1 Progression replay | 26 source weeks, play/pause, feed/condition alerts, trip and recovery markers, linked chart and condition strip, plus RCA-reported isolation, inspection and cleaning times | Filter-change and acknowledgement events are not supplied as aligned measurements |
| HE M2 Raw vs normalized | Actual raw dP and duty beside an explicit unavailable normalized panel, with provenance and missing-input explanation | No synchronized weekly flow, tube pressure pair or approved normalization formula; numeric normalized dP/duty cannot be calculated |
| HE M3 Cause workspace | Weekly dP, duty, heavy-ends trend; same-day hourly feed context; evidence matrix and competing rate hypothesis | Filter dP, approach temperature and an aligned pressure pair are absent. They are not fabricated or used to prove fouling |
| HE M4 Runway | Source dP trip boundary, one-week observed slope, persistence across consecutive weekly samples, illustrative window or breach banner | No rate-normalized predictive forecast or calibrated confidence from the supplied data |
| HE M5 Trade-off | Monitoring, filtration/process adjustment, inspection and cleaning options; owner, approver, window, evidence, criteria, explicit cleaning override | Future energy exposure and estimated cleaning downtime are unavailable from source |
| HE M6 Shared action | One accountable owner plus named Operations and Maintenance owners, planned window, due date, approval and audit transitions | All action edits are local demo records, not historical work-order updates |
| HE M7 Effectiveness | Numeric pre/post and final weekly readings, recovery gate, upstream follow-up, HE dP re-deterioration watch | Filter condition is unmeasured and requires a tracked follow-up; sustainable cause control cannot be claimed from recovery alone |
| HE M8 Demo controls | Reset, recorded-investigation and rate-effect evidence views, offline static deployment | The rate-effect view does not invent a counterfactual numerical series |

The deployed browser bundle includes a fixed derived `ui.json` snapshot and SHA-256 hashes of 11 original workbooks and five RCA decks. `npm run verify:snapshot` checks completeness and key incident/asset records before every staging deployment. Source files, full incident corpus, and local validation extracts stay outside the published repository.

Role selection, state-aware "My actions" filtering, and workflow transition checks in staging demonstrate the MVP approval flow, not authenticated RBAC. Both PRDs place full role-based access and approvals in their Phase 3 roadmap. The public, static GitHub Pages site has no identity provider or trusted server to enforce user permissions; production RBAC remains unimplemented.
