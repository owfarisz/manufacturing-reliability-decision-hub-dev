# KAUSYNC staging redesign decisions and QA

Reviewed 1 October 2026. This release changes the existing staging prototype. Production was not used as a target.

## Decisions tied to the brief

- The 76 px icon rail and persistent context bar keep asset identity visible. Navigation has text alternatives and a visible active state.
- The portfolio begins with two priority decisions, the recorded impact, selected source signal and next owner. The 380-incident aggregate and workflow status remain visible but secondary.
- KO and HE begin with a procedural 3D equipment model, actual weekly trend and next human decision in the same 1440 × 900 view. The model rotates by drag, zooms by wheel and has keyboard-operable rotation and reset controls. Hotspots respond to hover, click and keyboard focus; the selected weekly replay changes their values, thresholds and source links.
- Charts use one main variable with source alert/trip lines. Water or duty and temperature or heavy-ends have separate mini trends because their units differ. A scenario changes the assessment, not the recorded data.
- Overview, Evidence, Decision, Action and Verification expose detail in workflow order. Approval, physical work, restoration and effectiveness remain distinct states. No button represents direct plant control.
- The current staging palette uses the six sampled user swatches (`#263F77`, `#315A96`, `#4076B4`, `#5FB6E6`, `#8FC5EA`, `#E0DE50`) over white and very pale blue. Red is limited to a critical condition or breach. Every severity state also has a text label. Focus styling and reduced-motion behavior are present.
- The Decision brief CTA now changes the tab and scrolls the newly opened Decision panel into the viewport. Previously the panel changed below the fold, making the click appear inert.

## Source guardrails

The eleven workbooks and six RCA decks are read-only. Weekly dates have no sampling time and are not joined to hourly rows. KO hourly vibration velocity in MM/S is never compared with weekly displacement in micron. HE generic discharge pressure is not relabelled tube-side differential pressure. The unavailable normalized HE view does not calculate or display an invented value. Both 3D equipment models are explicitly representative; hotspot positions are explanatory, not surveyed locations. The public staging role picker demonstrates workflow rules without authentication or server-side RBAC.

## Screenshot QA

Captured final 1440 × 900 viewport screenshots in `docs/screenshots/redesign/`: `portfolio.png`, `ko-overview.png`, `ko-decision.png`, `he-overview-fouling.png`, `he-overview-rate-change.png`, and `shared-action-center.png`. `ko-pin-hover.png` and `ko-rotated.png` show the interactive states. A 390 px mobile portfolio capture is also present. Previous screenshots outside this directory were preserved.

The first visual review found that HE dP and heavy-ends shared an axis, making the trend hard to read. The chart was revised to one dominant measured series and separate mini trends before the final capture. Final review checked portfolio priority, both asset first views, the rate-change evidence state, decision form, action center and page-wide overflow. No horizontal overflow was found at 1440 px or 390 px.

## Verification

`npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e` passed in the local staging validation copy. The browser suite covers source provenance, KO missing-evidence scenario, HE rate-change block, workflow gates, role-specific actions, replay and mobile overflow. The final repository verification is run again before staging deployment.
