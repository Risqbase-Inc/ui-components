---
name: CompliancePostureStrip
domain: ai
layer: 2
state: stable
consumable: true
---

# CompliancePostureStrip

CompliancePostureStrip — Practice Cockpit "12-clients-at-a-glance" strip. Spec: docs/specs/v2.1.0/03-CompliancePostureStrip.md (post-G4 corrections). Visual canon: Marketing Demo C §2 (.cs-posture, 12 mini-gauges). Layout (§3.1): grid with `auto-fit, minmax(72px, 1fr)` so the strip wraps gracefully beyond 12 entries while pinning to a single row at the cockpit canon width (~1232px ÷ 12 cells ≥ 72px each). A11y (§7): list of summary statistics, NOT a chart. Each cell is wrapped in a `role="img"` div carrying a single structured `aria-label`; when `onClick` is supplied, the cell is additionally wrapped in a `<button>` whose `aria-label` supersedes (the button is the SR entry point). Token chain (§4): every visual surface routes through `--color-*` custom properties; the loading skeleton uses the v4.4 derived `--color-skeleton-shimmer` (spec 00b-v4.4-token-extension §1.2).

```ts
import { CompliancePostureStrip } from '@risqbase-inc/ui-components/ai'
```

## API

### `ClientPosture`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `name` | `string` | yes | Display name; truncates at 10 characters in the strip via CSS ellipsis. |
| `residual` | `number` | yes | Residual risk 0–100; drives gauge fill + band derivation. |
| `alertCount` | `number` | no | Optional active-alert count; renders the pill when > 0. |
| `alertSeverity` | `'high' \| 'medium'` | no | Alert severity for the pill colour (driven from the client's highest open finding). Required when `alertCount > 0`; ignored otherwise. |
| `onClick` | `() => void` | no | Optional click handler; when present, each gauge cell becomes a button. |

- `type PostureSort = 'risk' | 'name' | 'alerts'`
### `CompliancePostureStripProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `clients` | `ClientPosture[]` | yes | Clients to render. Order respected unless a sort is applied. |
| `sort` | `PostureSort` | no | Active sort. Defaults to undefined — respect the order passed in. |
| `onSortChange` | `(next: PostureSort) => void` | no | Fire when the user changes sort via the inline sort affordance. |
| `heading` | `string` | no | Heading rendered above the strip; defaults to `"Posture across clients · N total"` where N is `clients.length`. |
| `bare` | `boolean` | no | When true, hide the heading + sort affordance (use inside a section that already provides them). Defaults to false. |
| `gaugePalette` | `'teal' \| 'indigo'` | no | Override the gauge palette across all cells; defaults to 'teal' to match the Practice cockpit visual canon (Demo C). |
| `loading` | `boolean` | no | When true, render the skeleton-shimmer loading state in place of gauges. Cell count defaults to 12 (matches the Cockpit canon). |
| `skeletonCellCount` | `number` | no | Number of skeleton cells to render when `loading` is true. |
| `className` | `string` | no |  |


Composes with: Gauge, TelemetryBeacon

## Token chain

# Tokens — `CompliancePostureStrip`

Spec: `docs/specs/v2.1.0/03-CompliancePostureStrip.md §4`.

## Surface chain

| Surface | Token |
|---|---|
| Cell background | `color.surface.subtle` |
| Cell background (hover, interactive) | `color.surface.default` |
| Cell border | `color.border.subtle` |
| Cell hover ring | `color.action.primary.subtle` |
| Cell radius | `dimension.radius.md` |

## Text chain

| Surface | Token |
|---|---|
| Heading | `color.text.default` (14px medium) |
| Sort affordance | `color.text.subtle` (font-mono 10px, 0.04em tracking) |
| Client name | `color.text.subtle` (9px) |
| Residual numeric | `color.text.default` (font-mono 10px medium tabular-nums) |
| Empty-state message | `color.text.subtle` (12px) |

## Gauge

The gauge consumes `data-viz/Gauge` at `size="accessory"` (32×32 in the v4.3 dimension chain). Palette `teal` by default; `indigo` available via prop. The gauge handles its own track + arc token plumbing.

## Alert pill

| `alertSeverity` | Background | Text |
|---|---|---|
| `high` | `color.band.very-high.bg` | white |
| `medium` | `color.band.medium.bg` | `color.band.medium.text` |

Pill text carries the band word (`3 high` / `1 med`) — colour-blind safe by construction (G4 REFINE 3.1).

## Loading

| Element | Token |
|---|---|
| Skeleton fill | `color.skeleton.shimmer` (v4.4 derived; composes from `color.surface.muted` + `color.surface.subtle`) |

The 1.4s linear shimmer keyframe is provided by the `animate-skeleton-shimmer` utility in the Tailwind preset; `motion-reduce:animate-none` honours `prefers-reduced-motion`.

## Focus

| Surface | Token |
|---|---|
| Cell focus outline | `color.action.primary` (2px, 2px offset, `:focus-visible` only) |
| Sort affordance focus outline | `color.action.primary` (2px, 2px offset, `:focus-visible` only) |

## Notes

- No new primitive tokens introduced.
- Every visual surface flows through a declared semantic-tier token; consumers cannot override via inline overrides without explicitly threading a token-aware `className`.
- v4.4 skeleton-shimmer token is referenced at runtime — the worktree includes the v4.4 token JSON (cherry-picked from `feat/v2-1-0-impact-graph`). When that branch merges to `main` first, this PR rebases cleanly because the token commit is byte-identical.

## Accessibility contract

# CompliancePostureStrip — accessibility

A horizontal strip of N client posture indicators — modelled as a **list of summary statistics**, NOT a chart.

## Markup

- The strip is a `<section>` with `aria-labelledby` pointing at the heading (`bare={false}`) or no landmark when `bare={true}`.
- The data lives in a `<ul role="list" aria-label="Client posture summary">`.
- Each cell content is wrapped in a `<div role="img" aria-label="…">` carrying a single structured statement per client (G4 REFINE 3.2). This avoids the "12 gauges + 12 names + 12 residuals + 12 pills" announcement explosion of a naïve inner-element a11y approach.
- Per-cell sentence: `"{name}: residual {N} out of 100, {band} band[, {count} {sev}-severity alert(s)]."`. Bands: `very-high` (≥70), `high` (≥40), `medium` (≥20), `low` (≥10), `very-low` otherwise.
- When `onClick` is supplied per-client, the cell is additionally wrapped in a `<button>` whose `aria-label` supersedes (the same sentence + `" Activate to open."`). The button is the SR's entry point; the nested `role="img"` becomes effectively redundant for AT walks.

## Sort affordance

- When `onSortChange` is wired, the sort affordance is a native `<select>` with `aria-label="Sort clients"`. Native selects inherit OS-level keyboard + AT support — no custom disclosure pattern needed. (v2.1.1 G4 FU-7 / CPS-1: the select carries `appearance-none` + `pr-3` + the same focus-visible chain as the cells, so Safari and the Chromium themes that would otherwise override our outline with the UA focus ring now render the canonical 2px `--color-action-primary` ring instead.)
- The component does **not** own the sort-change live region. Consumers should mount a `role="status" aria-live="polite"` element nearby and update it on `onSortChange`. See the `WithLiveSortAndAnnouncer` story for reference wiring.

## Colour-only contracts

- Alert pill text carries the band word (`3 high` / `1 med`) — colour is reinforcement, not the sole channel.
- The gauge fill colour reinforces the residual numeric beneath it — colour-blind users get the number.
- The cell's `aria-label` carries the band word explicitly — SR users never depend on the gauge fill.

## Focus

- Cells with `onClick` are focusable in DOM order.
- Focus ring: 2px `--color-action-primary` outline, 2px offset, `:focus-visible` only — matches the library-wide focus contract.
- The strip does not trap focus or implement roving tabindex; users tab from cell to cell as normal list items would. This is appropriate for ≤30 entries; if a consumer routinely renders 100+ clients, prefer a grid wrapper that opts into roving tabindex.

## Loading

- The skeleton state renders `<div role="presentation" aria-hidden="true">` cells; AT skips the loading block entirely.
- `motion-reduce:animate-none` honours `prefers-reduced-motion`.

## Don't

- Don't expose the strip as a chart (`role="figure"` / `role="img"` on the whole strip). It is a list of summary stats; AT users navigate it via list semantics.
- Don't add per-pill click handlers — pill clicks duplicate the cell-click target with a smaller hit area; the spec deliberately defers an `onAlertClick?` until product demand surfaces (§9 Q2).
- Don't substitute an icon for the band word in the pill — colour-only severity is the failure mode REFINE 3.1 corrects.

## Verified

- axe-core clean on Default, Interactive, Loading, Empty, SortedByRisk stories (manual run during implementation; Sarah G5 to re-baseline in Chromatic regression sweep).
- Nested `role="img"` inside `<button>` is intentional per spec §7.1; modern AT (NVDA 2024.1, VoiceOver macOS 14, JAWS 2024) report only the button's accessible name.
