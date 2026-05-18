# RisqBase Design System v4.3 — Comprehensive

**Document ID:** GOV-DS-2026-02
**Version:** 4.3
**Classification:** MANDATORY
**Date:** 18 May 2026
**Prepared by:** Elena Vasquez (Principal Designer)
**Contributors:** Priya Sharma (Frontend Lead), Alex Chen (Technical Lead), Sophie Brennan (Content)
**Approved by:** Fiyin Adeleke (CEO) · 18 May 2026
**Supersedes:** v4.2, v4.2.1 patch
**Package version:** `@risqbase-inc/ui-components@2.0.0`
**Implementation handover:** Claude Code

---

## Reading order

1. **§1 Summary** — the structural changes and what's new.
2. **§2 Three-layer model** — the governance principle that shapes the rest.
3. **§3 Domain architecture** — `core/` + `ai/` + `data-viz/`, mapped to layers.
4. **§4 Token graph** — every primitive, semantic, and component token enumerated.
5. **§5 Component catalogue** — Layer 1 + Layer 2 primitives with full API.
6. **§6 §20 pattern recipes** — seven composition recipes.
7. **§7 Promotion lifecycle** — `private → beta → stable → deprecated`.
8. **§8 Docs-site structure** — `design.risqbase.com/v4.3/...` layout.
9. **§9 Migration guide** — v4.2.1 → v4.3 in three PRs per consumer.
10. **§10 Scanner rules** — R1–R10 (3 new, 2 rewritten).
11. **§11 Acceptance criteria** — what "v4.3 shipped" means.
12. **§12 Audit findings closed** — cross-reference to RALIA + marketing audits.
13. **§13 Appendix · index of deliverables** — every HTML demo, redesign, audit linked.
14. **§14 Approval block.**

This document is the **contract for the v4.3 implementation programme**. The
engineering work runs against it. When Claude Code (or any implementer)
finishes a row, they tick the acceptance checklist in §11. Until every row
is ticked, v4.3 is not shipped.

---

## §1 Summary

v4.3 is a **major** package release (`@risqbase-inc/ui-components` v2.0.0)
and a **major** spec revision. Three things change at once:

### 1.1 Twenty net-new primitives across three domains

`core/` gains 12 primitives previously RALIA-local (IconButton, SkipLink,
Card, Callout, Skeleton, EmptyState, WizardProgress, Modal, Drawer, Sheet,
Toast, ToastViewport). `ai/` is a new domain with five primitives
(CitationChip, IrisThinking, StreamingText, PromptChip, ClientScopeBanner).
`data-viz/` is a new domain with three primitives (Gauge, RiskGauge,
ChartContainer — the latter ships line/bar/sparkline in v4.3, with
heatmap/area/choropleth deferred to v4.4).

### 1.2 The `iris.*` semantic-token namespace

Iris gets its own semantic chain — nine tokens (`accent`, `accent-hover`,
`accent-subtle`, `accent-on`, `surface`, `streamhead`, `thinking-outer`,
`thinking-mid`, `thinking-inner`). Each resolves through the teal palette
but is named explicitly so RALIA / Cortex / future products can re-bind
the Iris character per product without touching primitives.

### 1.3 The three-layer model

This is the **structural** change in v4.3. Up to v4.2.1 the system was
flat: components either ship in the package or they don't. v4.3 codifies a
three-layer model (Primer / Carbon / Polaris convergence) that separates
system primitives from product configurations. RALIA-private signature
elements (Risk Gauge configuration, Iris character, Practice Cockpit,
HorizonIris Impact Graph) move into a **Layer 3 product showcase** that's
documented but not consumable. See §2.

Three resolutions to known doc/code drift land in this release:

- **D-001 · Button radius:** `rounded-xl` (12px) ratified. BASELINE.md
  §4.3–4.6 updated to match. `--dimension-radius-button-default` stays
  at 12px.
- **D-002 · Header logo weight:** `font-bold` ratified (what shipped).
  BASELINE.md §4.1 updated.
- **D-003 · Footer surface:** `surface-inverse` (dark, `stone-900`)
  ratified. BASELINE.md §4.2 updated.

---

> **Note.** The canonical text of GOV-DS-2026-02 v4.3 (sections §2 through §14)
> is reproduced from the source-of-truth document the CEO approved on
> 18 May 2026. Refer to that approval-tracked artefact for the complete
> running text. Below this point, the docs in this repo carry only the
> sections directly relevant to the package implementation (notably the
> per-component API summary, token graph, and acceptance criteria as ticked
> by this PR).

---

## §3 Domain architecture (as shipped)

```
@risqbase-inc/ui-components/
├── core/           Layer 1 · universally applicable
├── ai/             Layer 2 · AI surface primitives
└── data-viz/       Layer 2 · chart + gauge primitives
```

Import paths:

```ts
import { Button, IconButton, Modal, Toast } from '@risqbase-inc/ui-components/core'
import { CitationChip, IrisThinking } from '@risqbase-inc/ui-components/ai'
import { Gauge, RiskGauge } from '@risqbase-inc/ui-components/data-viz'

// Backward-compatible root barrel (soft-deprecated in v2.0; removal v5.0)
import { Button, CitationChip } from '@risqbase-inc/ui-components'
```

---

## §4 Token graph (as shipped)

Full primitive / semantic / component enumeration lives in the source-of-truth
document. Two v4.3 additions and one contract change are recorded here because
they carry runtime constraints.

### §4.1 New `iris.*` semantic chain (10 tokens)

| Token | Resolves to | Purpose |
|---|---|---|
| `iris.accent` | `palette.teal.600` | Signature colour — lettermark, focus halo, prompt-chip |
| `iris.accent-hover` | `palette.teal.700` | Hover state |
| `iris.accent-subtle` | `palette.teal.100` | Focus halo, prompt-chip hover background |
| `iris.accent-on` | `neutral.white` | Text / icon on Iris accent — **AA Large + Non-Text only** (see §4.2) |
| `iris.accent-on-dark` | `neutral.stone.900` | Text / icon on Iris accent — **AA Normal-safe** (see §4.2) |
| `iris.surface` | `palette.teal.50` | Iris panel background, conversation strip |
| `iris.streamhead` | `palette.teal.600` | StreamingText cursor |
| `iris.thinking-outer` | `palette.teal.300` | IrisThinking outer arc |
| `iris.thinking-mid` | `palette.teal.500` | IrisThinking middle arc |
| `iris.thinking-inner` | `palette.teal.700` | IrisThinking inner arc |

### §4.2 `iris.*` contrast contract

`iris.accent-on` paired with `iris.accent` computes to **3.74:1** — below WCAG 2.2 AA Normal (4.5:1), above AA Large + Non-Text (3:1). Rather than darken `iris.accent` (which cascades through `gauge.arc-teal`, `chart.cat.2`, the Risk Gauge family, and every Layer-3 showcase composition), the system **accepts the ratio and constrains where the white glyph applies**. Body-sized text on `iris.accent` resolves through the new `iris.accent-on-dark` token (= `stone-900`, computes to ~4.67:1 — AA Normal-safe).

| Surface category | `iris.accent-on` (white) | `iris.accent-on-dark` (stone-900) | Rationale |
|---|:---:|:---:|---|
| FAB · ≥24px font on ≥56px container | ✓ | ✓ | AA Large + Non-Text · 3:1 floor |
| Lettermark sz-48 / sz-72 / sz-120 · ≥26px font | ✓ | ✓ | AA Large |
| Streamhead cursor / status dot / arc strokes | ✓ | — | Non-Text · 3:1 floor |
| Icon strokes on `iris.accent` surfaces | ✓ | — | Non-Text · 3:1 floor |
| Lettermark sz-16, sz-24 · 10–14px glyph | **✗** | ✓ | Below AA Large — switch to dark glyph |
| Body text · captions · fine print on `iris.accent` | **✗** | ✓ | Below AA Normal — switch to dark glyph |
| Any label below 18.66px bold or 24px regular | **✗** | ✓ | Below AA Large |
| Body text on `iris.surface` (teal-50) ground | use `iris.accent` text | n/a | Inverted pairing — `iris.accent` text on `iris.surface` ≈ 6.8:1 |

**Rationale.** `iris.accent` (teal-600) is the canonical Iris signature colour. The 3.74:1 contrast is genuinely sufficient at the sizes Iris actually ships at; the constraint above makes "where it isn't" explicit and enforceable via:

1. Two distinct token names (`accent-on` vs `accent-on-dark`) — consumers pick the right one at authoring time.
2. **Scanner rule R11** (CI-blocking in consumer scanners; see [`scanner-rule-r11.md`](./scanner-rule-r11.md)) — flags small text using `iris.accent-on` on an `iris.accent` surface where AA Large doesn't apply.
3. A small-size glyph variant in any Iris lettermark / character composition (Layer-3, lives in RALIA — see §5.4 showcase pages).

The `accent-on-dark` token carries a `contrastPair` annotation against `iris.accent` so the contrast verifier (PR #51 / `scripts/verify-contrast.mjs`) reports it on every run.

---

## §5 Component catalogue (as shipped in v2.0.0)

| Component | Layer | Domain | Promotion |
|---|---|---|---|
| Button + Primary/Secondary/GhostButton | 1 | core | stable |
| Badge (+ band variants, BandBadge) | 1 | core | stable |
| Header | 1 | core | stable |
| Footer | 1 | core | stable |
| SectionEyebrow | 1 | core | stable |
| **IconButton** | 1 | core | stable (v4.3) |
| **SkipLink** | 1 | core | stable (v4.3) |
| **Card** | 1 | core | stable (v4.3) |
| **Callout** | 1 | core | stable (v4.3) |
| **Skeleton** | 1 | core | stable (v4.3) |
| **EmptyState** | 1 | core | stable (v4.3) |
| **WizardProgress** | 1 | core | stable (v4.3) |
| **Modal · Drawer · Sheet** | 1 | core | stable (v4.3) |
| **Toast · ToastViewport** | 1 | core | stable (v4.3) |
| **CitationChip** | 2 | ai | stable (v4.3) |
| **IrisThinking** | 2 | ai | stable (v4.3) |
| **StreamingText** | 2 | ai | stable (v4.3) |
| **PromptChip** | 2 | ai | stable (v4.3) |
| **ClientScopeBanner** | 2 | ai | stable (v4.3) |
| **Gauge** | 2 | data-viz | stable (v4.3) |
| **RiskGauge** | 2 | data-viz | stable (v4.3) |
| **ChartContainer** | 2 | data-viz | beta (v4.3 — 3 of 7 types) |

Per-component API, accessibility contract, and token chain live alongside
each component in `src/{core,ai,data-viz}/<name>/{accessibility,tokens}.md`.

---

## §11 Acceptance criteria — package side (this PR)

- [x] `@risqbase-inc/ui-components` bumped to `2.0.0`
- [x] Root barrel + `core/` + `ai/` + `data-viz/` barrels exist and re-export the v4.3 surface
- [x] All 20 new components have: `index.tsx`, `types.ts`, `tokens.md`, `accessibility.md`
- [x] `tokens.css` regenerated with `iris.*` semantic chain + `badge.band.*` component tokens + 5 new component-tier files
- [x] Tailwind preset (`@risqbase-inc/ui-components/tailwind.preset`) updated with Geist font defaults and v4.3 keyframes/animations
- [x] D-001 / D-002 / D-003 resolutions reflected in tokens + component code
- [x] Root barrel emits soft-deprecation warning in dev (§9.2)
- [x] `tsc --strict` + `eslint` clean
- [x] `<TelemetryBeacon>` instrumentation on every primitive (5 v4.2.1 + 20 v4.3 = 25 components) — *closed by PR #49 addendum 1*
- [x] Modal / Drawer / Sheet rebased on `@radix-ui/react-dialog` — *closed by PR #49 addendum 1*
- [x] `ChartContainer` rebased on visx@^3 — *closed by PR #49 addendum 1*
- [x] Radix / visx scoped as `peerDependencies` with visx flagged optional — *closed by PR #49 addendum 2*
- [x] Storybook stories for the 20 new components + extended Badge — *closed by PR #50*
- [x] Chromatic workflow updated (`push:main`, `chromaui/action@v11`, `exitZeroOnChanges:false`) — *closed by PR #50*
- [x] Per-component contrast verification (`scripts/verify-contrast.mjs` + CI hook) — *closed by PR #51*
- [x] `iris.*` §4.2 contrast contract — accept the 3.74:1 ratio for `iris.accent-on` on `iris.accent`, add companion `iris.accent-on-dark` (~4.67:1) for AA-Normal-safe text, enforce via R11 — *closed by PR #52 (this addendum)*
- [x] Scanner rule R11 canonical definition + reference implementation — *closed by PR #52*

### Pending — admin actions (cannot land via a PR)

- [ ] Create Chromatic project; add `CHROMATIC_PROJECT_TOKEN` to repo secrets; enable `Chromatic` as a required status check on `main`. Step-by-step in `docs/contributing/chromatic.md`.

### Out of scope for this PR (downstream)

- [ ] `design.risqbase.com` docs site (target 30 June 2026)
- [ ] Consumer migrations per §9.3 / §9.4 (RALIA, marketing)
- [ ] Layer-3 RALIA showcase pages (live on the docs site)
- [ ] Scanner rules R9 + R10 + R11 wired into consumer scanners (live in `Risqbase-Inc/Ralia` and the marketing-site repo)
- [ ] Updates to the 10 RALIA redesigns + 8 marketing demos for small-lettermark dark-glyph variant per §4.2 (consumer-repo work)

---

## §14 Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| Principal Designer | Elena Vasquez | 18 May 2026 | APPROVED |
| Frontend Lead | Priya Sharma | 18 May 2026 | APPROVED |
| Technical Lead | Alex Chen | 18 May 2026 | APPROVED |
| Content | Sophie Brennan | 18 May 2026 | APPROVED |
| CEO | Fiyin Adeleke | 18 May 2026 | APPROVED |

---

**END OF GOV-DS-2026-02 v4.3 · COMPREHENSIVE — package excerpt**
