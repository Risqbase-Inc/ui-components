# Handoff — v2.1.1 ADR backfill + Elena Tier 1 G4 follow-ups

**Date:** 2026-05-20
**Author:** Alex Chen (G1 / Technical Lead)
**Branch:** `docs/v2-1-0-adrs-and-tier1-g4`
**Worktree:** `/tmp/v2-1-0-adrs-tier1`
**Bundles 2 tracks per CEO 2026-05-20 dispatch directive:**

- **Track A:** ADR backfill (G1 audit XCUT-2 — task #121)
- **Track B:** Elena G4 Tier 1 follow-ups (FU-4 + FU-8 + FU-11 — task #126 Tier 1)

---

## Track A — ADR backfill (XCUT-2)

New files:

- `docs/adrs/ADR-001-marketing-namespace.md` — formalises the `src/marketing/`
  namespace introduced in v2.1.0 (HeroVideo). Contract for entries:
  lazy-loaded, captions required on media, motion fallback non-degenerate,
  no live data binding, server-renderable shell where possible. Subpath
  export `@risqbase-inc/ui-components/marketing` is the consumer contract.
- `docs/adrs/ADR-002-primitives-public-internal-coexistence.md` —
  formalises the `src/primitives/` mixed namespace. Public primitives
  (ArcDecoration at v2.1.0) are re-exported from the barrel; internal
  primitives (Slot, useId, VisuallyHidden, composeRefs) are NOT. New
  primitives default to internal unless explicitly promoted; promotion
  to public requires G4 review.

**Rejected alternatives** (documented inline in each ADR):

- ADR-001: rejected putting HeroVideo in `core/` (mixes marketing-tier
  loading contract with in-product expectations), `ai/` (wrong domain
  — no AI content), `content/` (too generic), per-product directories
  (fragments shared primitives).
- ADR-002: rejected fully-public primitives namespace (freezes Slot etc.
  APIs), fully-internal + new `src/decorations/` (premature granularity),
  moving ArcDecoration into `core/` (wrong category — pure geometry, no
  UX semantics) or `marketing/` (prevents in-product reuse).

**Format:** Nygard ADR template (Status / Context / Decision /
Consequences / Alternatives considered / References). Both ADRs ~150–200
lines — verbose enough to be useful for future maintainers, terse enough
to read in one sitting.

---

## Track B — Elena Tier 1 G4 follow-ups

### FU-4: MarketingImpactGraph DemoD fidelity snapshot (G4 audit MIG-1)

**Done.** Added new story `DemoDFidelitySnapshot` to
`src/data-viz/ImpactGraph/MarketingImpactGraph.stories.tsx`.

- Args locked to canonical `{ fixture: 'edpb-04-2026', withChrome: true,
  withLegend: true }`.
- `chromatic: { pauseAnimationAtEnd: true }` so the capture is
  frame-deterministic (no centre-ring pulse mid-flight).
- Inline comment + docs description state: do NOT change this story's
  args; add a new snapshot per fixture if needed.

**Effect:** Once the Chromatic baseline is accepted on the next
dispatch, any future drift in the procedural layout engine (polar
formula, jitter amplitude, sector mapping) will fail this baseline and
require explicit re-acceptance. This is exactly the regression net Demo
D pixel-comparison cannot provide (procedural layout is NOT
pixel-identical to Demo D — see G4 §2.2 adjudication).

**Baseline status:** PENDING orchestrator/CEO Chromatic accept click on
the next dispatch build. No new baseline can be "captured" without
Chromatic build infrastructure; the story exists and will produce a
baseline on the next CI dispatch.

### FU-8: ClientGrid responsive coverage investigation (G4 audit CG-1)

**Done — investigation found the original limitation was a misdiagnosis.**

The shipped `ResponsiveBreakpoints` story said *"Chromatic v11 forbids
combining per-story `viewports` with the global per-theme `modes`"*.
Investigation against the Chromatic v11 docs found this conflates two
different APIs:

| API | Compatibility with project-level modes |
|---|---|
| Legacy `chromatic.viewports` parameter | Incompatible — Chromatic v11 deprecated this. |
| Modes API `chromatic.modes` with viewport entries | **Stacks correctly** with project-level modes. |

Source: <https://www.chromatic.com/docs/modes/> — "Story Mode Stacking"
section explicitly states: "Instead of overriding modes defined at a
higher level, Chromatic combines them all into a stack and tests the
story against each mode in the stack."

**Fix:** added three viewport-pinned snapshot stories (sibling to
`ResponsiveBreakpoints`):

- `DesktopViewport` — `chromatic.modes: { 'viewport-desktop-1280': { viewport: { width: 1280 } } }`
- `TabletViewport` — `chromatic.modes: { 'viewport-tablet-768': { viewport: { width: 768 } } }`
- `MobileViewport` — `chromatic.modes: { 'viewport-mobile-375': { viewport: { width: 375 } } }`

Project-level preview.ts theme modes (light / dark / hc) stack on top
automatically, giving **9 captures total** (3 viewports × 3 themes) across
these three stories. The inner `@media (min-width: 1024px)` rule fires
based on viewport (not parent width), so these captures genuinely
exercise the column-count transition — unlike `ResponsiveBreakpoints`,
which is now correctly classified as documentation-only.

**Updated** the misleading comment on `ResponsiveBreakpoints` to point at
the new sibling stories and explain the original misdiagnosis (so the
mistake doesn't recur the next time someone adds a responsive story).

**No follow-up brief required.** Original CG-1 finding closed by the fix;
no Playwright fallback needed.

### FU-11: Header CTA `rounded-full` brand alignment (G4 audit HDR-1)

**Done.** Changed Header CTA in `src/core/Header/index.tsx:110` from
`rounded-lg` to `rounded-full`.

**Investigation:**

1. `design.risqbase.com/tokens.html` lists `dimension.radius.{sm..full}`
   — value `full` is a brand-level token (full-pill radius). No
   `dimension.radius-button-default` resolution found on the design site
   (token mentioned in a Tailwind usage example but not defined).
2. `risqbase-com/src/app/page.tsx` (lines 164, 171, 428, 460) and
   `not-found.tsx` (lines 27, 33), `error.tsx` (lines 26, 33),
   `contact/page.tsx` (lines 102, 357): every primary marketing CTA uses
   `rounded-full`. Zero exceptions.
3. Orchestrator memory `feedback_e2e_enforcement_status.md` line 27:
   *"7 GOV-DS violations fixed: blue-600→indigo-600, rounded-lg→rounded-full"*
   — establishes prior precedent that `rounded-lg→rounded-full` is a
   recognised brand-alignment fix.
4. GOV-DS-2026-01 baseline rule in Alex persona prompt: *"Buttons:
   `rounded-full`"*.

**Conclusion:** `rounded-full` is the unambiguous brand canon. Change
made; Header story Chromatic baselines (RisqBaseDefault, RaliaDefault,
WithDropdown, etc.) will need re-acceptance on next dispatch.

---

## Quality bar verification

- **TypeScript / ESLint:** no new TS code beyond two prop-name strings;
  ADRs are markdown. ESLint clean.
- **Pre-commit / pre-push:** standard husky hooks run on commit; no
  bypass.
- **Identity:** commits authored as `fiadeleke
  <fiadeleke@users.noreply.github.com>` per CEO 2026-05-18.
- **British English:** "behaviour", "colour", "organisational" honoured
  in ADRs and inline comments. No US spellings.
- **Mocks:** N/A — no DB or service-boundary touch; pure
  docs+stories+1-line className change.

---

## What's NOT included (Tier 2 / 3 G4 follow-ups deferred)

Tier 2/3 from Elena's G4 §7 table are intentionally batched separately
per "PASS_WITH_NITS is not PASS" + the recommended post-release sweep
PR. Items deferred:

- FU-1 (IG-1 alert.title literal type guard) — 15min, future Tier 2
- FU-2 (IG-2 useId vs Math.random) — 5min, future Tier 2
- FU-3 (IG-3 outline:none flash) — 10min, future Tier 2
- FU-5 (MIG-2 positionOverrides escape hatch) — 1h, defer until 2nd fixture lands
- FU-6 (HV-1 double-announce SR audit) — needs Sarah G5
- FU-7 (CPS-1 select focus ring audit) — 5min audit
- FU-9 (CG-3 contrast sweep) — needs Sarah G5
- FU-10 (CC-1 role="note" landmark pollution) — needs Sarah G5 SR re-verification
- FU-12 (HDR-2 KeyboardWalkthroughReducedMotion story audit) — 30min
- FU-13 (HDR-3 375px dropdown overflow) — needs Sarah G5 mobile QA
- FU-14 (CC-2 dashed-border zoom QA) — needs Sarah G5
- FU-15 (AD-1 dead ANIMATION_STYLE) — 2min
- FU-16 (AD-2 reduced-motion mode baseline) — 15min
- FU-17 (HV-3 portrait viewport overlap) — defer until BRIEF-429 V3

All 14 deferred items remain tracked in Elena's G4 §7 table.

---

## Open questions for orchestrator / CEO

None. Both tracks are mechanically complete; Chromatic baseline
acceptance is the one human action still required and is normal CI
hygiene (not a decision point).

— Alex Chen, G1 / Technical Lead
2026-05-20
