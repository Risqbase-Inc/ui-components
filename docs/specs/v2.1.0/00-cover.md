# @risqbase-inc/ui-components v2.1.0 — Component Pipeline

> **Authoring**: Claude Design (G4 design)
> **Implementation**: Claude Code on Web (PRs into `ui-components` main)
> **Review**: CEO orchestrator Claude Code (PR merge gate)
> **Design sign-off**: Elena Vasquez (G4) — spec + final UI
> **QA**: Sarah Mitchell (G5) — Storybook + Chromatic regression
> **CEO**: Fiyin Adeleke — release sign-off
> **Date**: 2026-05-20
> **DS version**: v4.3 → **v4.4** (4 derived tokens proposed; see [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md))
> **Package version**: @risqbase-inc/ui-components **v2.1.0** (semver-minor — additive)

This pipeline closes the four mandatory component gaps identified in the
2026-05-19 Claude Code verification, plus three optional clean-ups the
orchestrator flagged as cheap and high-value. All eight items ship together
in one v2.1.0 release.

---

## 1. Scope at a glance

| # | Item | Type | Stakes | Spec |
|---|---|---|---|---|
| 1 | **ImpactGraph** primitive + **MarketingImpactGraph** wrapper | new, `src/data-viz/ImpactGraph/` | HIGH | [01-ImpactGraph.md](./01-ImpactGraph.md) · [a11y](./01-ImpactGraph.accessibility.md) |
| 2 | **HeroVideo** | new wrapper, `src/marketing/HeroVideo/` | HIGH | [02-HeroVideo.md](./02-HeroVideo.md) · [a11y](./02-HeroVideo.accessibility.md) |
| 3a | **CompliancePostureStrip** | new, `src/ai/CompliancePostureStrip/` | MED | [03-CompliancePostureStrip.md](./03-CompliancePostureStrip.md) |
| 3b | **ClientGrid** | new, `src/ai/ClientGrid/` | MED | [04-ClientGrid.md](./04-ClientGrid.md) |
| 4 | **CitationChip** variant coverage + SR-friendly aria-labels | verification + a11y patch, `src/ai/CitationChip/` | confirmation + gating a11y | [05-CitationChip-variant-coverage.md](./05-CitationChip-variant-coverage.md) |
| 5 | **ArcDecoration** | new primitive, `src/primitives/ArcDecoration/` | LOW | [06-ArcDecoration.md](./06-ArcDecoration.md) |
| 6 | **Header polish** | patch existing, `src/core/Header/` | LOW | [07-Header-polish.md](./07-Header-polish.md) · [a11y](./07-Header-polish.accessibility.md) |
| 7 | **VideoEmbed** placeholder token swap | patch existing | trivial | [08-VideoEmbed-token-swap.md](./08-VideoEmbed-token-swap.md) |

Total: **6 new components** (1 primitive, 1 marketing, 2 ai, 1 data-viz primitive + 1 data-viz wrapper) and **2 in-place patches**. No deprecations. No breaking changes.

---

## 2. Cross-cutting decisions

### 2.1 Naming + namespace placement

Three new namespaces appear in v2.1.0:

- **`src/data-viz/`** — already in main (3 components at v2.0.0); receives `ImpactGraph` + `MarketingImpactGraph`.
- **`src/marketing/`** — *new* namespace. Receives `HeroVideo`. Rationale: marketing surfaces have different a11y/loading characteristics from in-product `core/` components (lazy-loaded by default, captions required, no live data binding). Promoting a `marketing/` namespace keeps these expectations legible. Future migrations can move marketing-only compositions out of `core/` into this directory.
- **`src/primitives/`** — *new* namespace. Receives `ArcDecoration`. Rationale: pure-decoration components (no semantics, no a11y surface) deserve a home that signals "drop me anywhere". Distinct from `core/` (semantic UI) and `data-viz/` (data-bound). Sized for growth — future entries: gradient backdrops, watermarks, scrim primitives.

Existing namespaces unchanged: `core/`, `ai/`, `data-viz/`.

### 2.2 Token usage — v4.3 chain + 4 derived v4.4 additions

**Revised after Elena G4 review (2026-05-20).** The original draft claimed "zero new tokens proposed in this cycle." Empirical verification by Elena against `tokens/{primitive,semantic,component}/*.json` + `dist/tokens.css` showed that 4 tokens referenced across specs **do not exist** in the v2.0.0 ui-components release: `--shadow-{raised,floating,overlay}` and `--color-skeleton-shimmer`. The audit-pack demo CSS (`audit-deliverable/styles/tokens-v4.2.1.css`) defines them; the canonical token source does not. The drift was masked because demos consume the audit-pack CSS, not `dist/tokens.css`.

**Resolution**: file the small v4.4 derived-token brief (see [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md)) promoting the existing audit-pack values into canonical `tokens/` JSON. No new primitive colours; the shimmer composes from `--color-surface-muted` + `--color-surface-subtle` (existing v4.3). Net effect: v2.1.0 ships against v4.4, with 4 derived tokens added in `tokens/semantic/elevation.json` + `tokens/semantic/loading.json`.

For the ImpactGraph category palette specifically: the v4.3 `--color-chart-cat-{1..8}` chain covers it cleanly (DPIA → cat-1, ROPA → cat-4, Vendor → cat-3, Training → cat-6). Build against `chart-cat-*` directly; do not introduce category aliases.

| Component | Primary token surfaces |
|---|---|
| ImpactGraph | `--color-chart-cat-{1..8}`, `--color-band-{very-high,high,medium,low}-border` (edges — see Spec 01 REFINE 1.2), `--color-band-{very-high,high,medium,low}-bg` (centre ring fill), `--color-iris-{surface,accent,accent-hover}`, `--color-surface-inverse`, `--color-text-on-inverse{,-subtle}`, **v4.4** `--color-skeleton-shimmer` (loading state) |
| MarketingImpactGraph | inherits from ImpactGraph + **v4.4** `--shadow-floating`, `--dimension-radius-2xl` for the screenshot frame |
| HeroVideo | `--color-iris-surface` (placeholder), `--color-iris-accent` (play affordance), `--color-text-on-inverse-subtle` (caption), **v4.4** `--shadow-floating` |
| CompliancePostureStrip | `--color-gauge-track`, `--color-gauge-arc-teal`, `--color-band-{very-high,medium}-bg`, `--color-surface-{subtle,muted}`, `--color-border-{default,subtle}`, **v4.4** `--color-skeleton-shimmer` |
| ClientGrid | `--color-chart-cat-{1..6}` (avatars), `--color-band-{very-high,medium}-bg` (alert pills), `--color-band-very-low-bg` (improvement delta colour — see Spec 04 REFINE 4.1), `--color-surface-default`, `--color-border-default`, **v4.4** `--color-skeleton-shimmer` |
| ArcDecoration | `--color-palette-teal-{300,500,600}`, `--color-palette-stone-300` (terminator) |
| Header polish | inherits existing header tokens; **v4.4** `--shadow-floating` (dropdown panel); aria attributes only |

### 2.3 Presentational vs client-state convention

Existing convention (v2.0.0): components are **purely presentational** by default. `'use client'` is added only when a component requires browser APIs or React state. The convention is documented per-component in story doc-blocks.

Three v2.1.0 components break the purely-presentational rule:

- **HeroVideo** — needs IntersectionObserver for muted-autoplay-on-visibility + media-query listener for `prefers-reduced-motion`. Client component. Document the boundary.
- **Header polish dropdown** — needs `useState` for open/closed + outside-click handler + ESC key handler. The patch is gated to the dropdown sub-tree; the rest of Header stays presentational. We add a `<HeaderNavDropdown>` client island within Header so the surrounding chrome remains server-rendered.
- **ClientGrid** card alert-pill click-to-filter — *optional* consumer-supplied `onAlertClick`. If passed, the card becomes client-interactive. If omitted, ClientGrid stays presentational.

Everything else (ImpactGraph, MarketingImpactGraph, CompliancePostureStrip, ClientGrid default, CitationChip, ArcDecoration) is server-renderable.

### 2.4 Accessibility matrix

Each component lists the a11y posture engineering should hit; a separate `<component>.accessibility.md` exists only where the patterns are not obvious from the props.

| Component | Surface | A11y artefact |
|---|---|---|
| ImpactGraph | complex SVG; nodes navigable; needs SR summary + per-node detail | **separate a11y.md** |
| MarketingImpactGraph | static export; `role="img"` + structured `aria-label` | (inherits) |
| HeroVideo | captions required, autoplay rules, motion-reduced fallback, focus management | **separate a11y.md** |
| CompliancePostureStrip | list semantics, sort announcement, alert-pill `aria-label` | inline (in main spec) |
| ClientGrid | grid semantics, card focus order, alert-pill labels | inline |
| CitationChip | already shipped; v2.1.0 patches aria-label to human-readable variant descriptions (gating) + adds 4 missing stories | inline (in main spec) |
| ArcDecoration | `aria-hidden="true"`, `role="presentation"` | trivial — inline |
| Header polish | aria-current, disclosure pattern, ESC, focus restore | **separate a11y.md** |
| VideoEmbed token swap | no semantic change | n/a |

### 2.5 Storybook + Chromatic

Every new component ships with:

1. **Stories** — at minimum `Default`, plus every variant prop value enumerated. Component-specific stories listed per spec below.
2. **Chromatic baseline** — re-baselined as part of merging PR #57 (the v2.1.0 release PR). Each story is a snapshot; Sarah G5's regression review happens against the diff.
3. **MDX doc-block** — short narrative + the prop table + a single canonical-usage code sample. No marketing copy; spec material only.

---

## 3. Consumption guide — marketing repo migration

The marketing repo (`risqbase-com`) will be the first production consumer of @risqbase-inc/ui-components@^2.1.0 post-25-May. This is the swap table the wholesale-migration PR will execute against.

| Inline pattern in marketing repo | v2.1.0 swap | Demo |
|---|---|---|
| `marketing/components/HorizonIrisVisual.tsx` (impact-graph artwork inline SVG, ~300 lines) | `<MarketingImpactGraph fixture={mockEDPB04_2026} />` | Demo D |
| Hero video poster + `<video>` element on `/` (BRIEF-429 implementation) | `<HeroVideo src=… captions=… poster=… fallback="storyboard-grid">` | Demo I |
| `/practice` hero — inline 12-gauge mini-strip artwork | `<CompliancePostureStrip clients={mockClients} sort="risk">` | Demo C |
| `/practice` hero — inline 3-card client grid | `<ClientGrid clients={mockAttentionClients} mode="attention">` | Demo C |
| Hero arc decoration inline SVG (3–4 instances across `/`, `/platform`, `/practice`) | `<ArcDecoration position="bottom-right" rings={4} palette="teal">` | Demo B |
| Header — manually-coded dropdown in marketing repo Header wrapper | (after polish) consume `<Header variant=…>` from ui-components; dropdown + aria-current land inside the published component | Demo E |

The migration PR will be ~1 day; most of the cost is removing the inline artwork files and lifting the fixture data into ui-components-facing shape.

---

## 4. Sequencing

| Date | Milestone | Owner |
|---|---|---|
| **2026-05-20** | Spec pack published → **Elena G4 returns CONCERNS** (3 blockers, 11 refines). Claude Design files [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md) + [`G4-response.md`](./G4-response.md) the same day. | Claude Design |
| **2026-05-21 AM** | Token JSON entries land in `tokens/semantic/{elevation,loading}.json`; `dist/tokens.css` rebuilt | Claude Code on Web (orchestrator-dispatched) |
| **2026-05-21 PM** | Elena re-pass on the corrected spec pack | Elena |
| **2026-05-22 → 06-03** | Implementation PRs land into `ui-components` main (one per component; CI-gated on Chromatic + contrast script + token-lint). Specs 01, 04, 06, 07, 08 may dispatch 22 May even if v4.4 tokens land mid-day; specs 02, 03, 05 dispatch after token+spec corrections settle. | Claude Code on Web |
| **2026-05-25** | Marketing launch (independent — runs against inline V2 demos) | Sophie G8 |
| **2026-06-04** | Sarah G5 visual regression sweep on Storybook + Chromatic baselines | Sarah |
| **2026-06-05** | CEO release sign-off; **v2.1.0 published** to GitHub Packages | Fiyin / orchestrator |
| **2026-06-06 → 06-10** | Wholesale marketing repo migration PR (inline → ui-components imports) | Priya |
| **2026-06-15+** | RALIA + Practice port cycle (BRIEF-433) begins consuming v2.1.0 | RALIA team |

Quality-bar pace, not deadline pace. The 25 May launch is **independent** of this delivery — marketing hand-ports from the V2 demo HTMLs for launch; the wholesale ui-components swap is a post-launch cleanup.

---

## 5. Out of scope for v2.1.0 — captured for future

These came up in the gap report and were considered:

- **DS v4.4** — ~~deferred~~ **PROMOTED** to in-scope after Elena G4 review (2026-05-20). 4 derived tokens added; see [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md). The `--color-impact-graph-edge-cascade` semantic remains deferred (cascade edges are a single visual use case in this cycle; don't generalise prematurely).
- **Real-product ImpactGraph data binding** (live HorizonIris alerts feeding a runtime graph) — the primitive exposes the API for it, but consumer wiring lives in the RALIA app, not in ui-components. RALIA team picks up post-1-July.
- **HeroVideo analytics** — view-progress + completion-rate telemetry hooks. The component exposes `onPlay` / `onProgress` / `onComplete` callbacks; analytics binding is consumer-side.
- **`<PracticeCockpitSurface>` monolith** — explicitly rejected. CompliancePostureStrip and ClientGrid are independent for composition flexibility; the marketing demo's full Cockpit screenshot is reproducible by composing both.

---

## 6. Effort estimates (engineering-side, ranked)

| Component | Estimate | Driver of cost |
|---|---|---|
| ImpactGraph + MarketingImpactGraph | 3 days | Radial-layout engine + label-collision avoidance; SVG a11y story |
| HeroVideo | 1.5 days | IntersectionObserver gating + 2×2 fallback + VTT captions |
| CompliancePostureStrip | 1 day | 12-gauge horizontal strip; consumes existing Gauge |
| ClientGrid | 1 day | Composes existing Card; alert-pill story |
| ArcDecoration | 0.5 day | Static SVG with prop-driven ring count + palette |
| Header polish | 1 day | Dropdown disclosure pattern + a11y + ESC/outside-click |
| CitationChip verification + a11y labels | 0.5 day | Re-scope to actual v2.0.0 source (Spec 05 rewrite Annex A) + add 4 missing stories + combined-announcement aria-label patch + WCAG 2.5.8 min-height |
| VideoEmbed token swap | 0.25 day | Token rename + visual-regression snapshot |
| **v4.4 token-extension brief** | 0.5 day | 4 derived tokens, 2 new JSON files, build + Chromatic re-baseline |
| **Total** | **~9.25 dev-days** | Sequential within one engineer; parallelisable to ~4 calendar days with two. The v4.4 token PR can run in parallel with all 8 component PRs once the JSON entries land EOD 21 May. |

Three calendar weeks at quality-bar pace gives slack for review cycles, Chromatic baselines, and the Storybook MDX writing pass.
