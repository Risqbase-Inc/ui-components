---
name: ClientGrid
domain: ai
layer: 2
state: stable
consumable: true
---

# ClientGrid

ClientGrid — Practice Cockpit "Requires your attention · N clients" 3-up grid that sits below CompliancePostureStrip. Spec: docs/specs/v2.1.0/04-ClientGrid.md (post-G4 corrections). Visual canon: Marketing Demo C §2 (.cs-clients, 3-up grid). Composition: each card is a `core/Card variant="default" padding="none"` shell (we override padding because Demo C's 12px inner padding doesn't map onto the existing 'sm'/'md'/'lg' scale). The Card primitive still provides the radius + border + bg surface chain. Delta colour-inversion (§3.5 REFINE 4.1): positive weeklyDelta routes to `--color-band-very-high-bg` (worsening = alert); negative routes to `--color-band-very-low-bg` (improving = semantic emerald). NOT raw `--color-palette-emerald-500` — the band token IS the semantic emerald. Deterministic hash → palette mapping for clients that don't set an explicit avatarPalette. Simple sum-of-char-codes mod 6; collisions are fine — repeating a palette across 30 clients is cosmetic, not a bug.

```ts
import { ClientGrid } from '@risqbase-inc/ui-components/ai'
```

## API

### `ClientCardData`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `name` | `string` | yes | Display name, e.g. "Acme Health GmbH". |
| `subline` | `string` | yes | Sub-line, e.g. "Healthcare · DE · 240 staff". |
| `avatarGlyph` | `string` | no | Avatar glyph (single character; defaults to `name[0]`). |
| `avatarPalette` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | no | Avatar palette key — maps to `--color-chart-cat-{1..6}`. |
| `residual` | `number` | yes | Residual risk 0–100. |
| `weeklyDelta` | `number` | no | Week-on-week change (signed integer). Positive = risk increased (rendered in `--color-band-very-high-bg`); negative = improved (rendered in `--color-band-very-low-bg`). The semantic is inverted from market-data conventions — risk-up reads as warning, not gain. |
| `alertCount` | `number` | no | Active alert count + severity. |
| `alertSeverity` | `'high' \| 'medium'` | no |  |
| `secondaryStat` | `string` | no | Optional secondary stat, e.g. "14 DPIAs", "3 incidents", "DPA 14d". |

- `type ClientGridMode = 'attention' | 'all'`
### `ClientGridProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `clients` | `ClientCardData[]` | yes |  |
| `mode` | `ClientGridMode` | no | Defaults to `'all'`. |
| `onClientClick` | `(client: ClientCardData) => void` | no | Click handler per client; when present, each card becomes a button. |
| `onAlertClick` | `(client: ClientCardData) => void` | no | Click handler on the alert pill; when present, the pill becomes a separate button. When omitted, the pill is purely visual (matches Demo C). Cannot be combined with `onClientClick` — engineering warns in dev mode and treats `onClientClick` as the only handler (spec §7.1). |
| `heading` | `string` | no | Heading rendered above the grid; defaults to mode-specific text. |
| `headingAction` | `{ label: string; onClick: () => void }` | no | Right-aligned heading affordance, e.g. "+ Add client" link. |
| `desktopColumns` | `2 \| 3 \| 4` | no | Number of columns at desktop; defaults to 3 (Demo C). |
| `bare` | `boolean` | no | When true, suppress the heading row entirely. |
| `loading` | `boolean` | no | When true, render skeleton cards in place of real ones. Default count = 3 (matches the Demo C 3-up canon); override via `skeletonCardCount`. |
| `skeletonCardCount` | `number` | no |  |
| `className` | `string` | no |  |


Composes with: Card, TelemetryBeacon

## Token chain

# Tokens — `ClientGrid`

Spec: `docs/specs/v2.1.0/04-ClientGrid.md §4`.

## Card chrome (consumed via `core/Card`)

| Surface | Token |
|---|---|
| Card background | `color.card.background.default` (via `core/Card variant="default"`) |
| Card border | `color.card.border.default` |
| Card radius | `dimension.radius.card.default` |
| Card hover border (interactive) | `color.action.primary.subtle` |
| Card hover elevation (interactive) | `shadow.raised` (v4.4 derived) |
| Divider | `color.border.subtle` (1px dotted) |

## Avatar

| Surface | Token |
|---|---|
| Background | `color.chart.cat.{1..6}` (palette key from `avatarPalette` prop or deterministic hash of `id`) |
| Glyph text | `#FFFFFF` (locked white — verified ≥ 4.5:1 contrast against all six cat tokens per v4.3 contrast audit) |
| Radius | `dimension.radius.sm` |

## Text chain

| Surface | Token |
|---|---|
| Heading | `color.text.default` (14px semibold) |
| Heading action | `color.action.primary` (11px semibold) |
| Name | `color.text.default` (12px semibold) |
| Subline | `color.text.subtle` (10px) |
| Residual | `color.text.default` (font-mono 12px semibold tabular-nums) |
| Delta up (worse) | `color.band.very-high.bg` (font-mono 10px semibold) |
| Delta down (better) | `color.band.very-low.bg` (font-mono 10px semibold — **G4 REFINE 4.1**: semantic, NOT raw `color.palette.emerald.500`) |
| Secondary stat | `color.text.subtle` (font-mono 10px) |
| Empty-state copy | `color.text.subtle` (13px) |
| Empty-state checkmark glyph | `color.band.very-low.bg` (20px bold; reuses the "improving" semantic for visual consistency) |

## Alert pill

| `alertSeverity` | Background | Text |
|---|---|---|
| `high` | `color.band.very-high.bg` | white |
| `medium` | `color.band.medium.bg` | `color.band.medium.text` |

Pill text carries the band word (`3 high` / `1 med`); colour-blind safe.

## Loading

| Element | Token |
|---|---|
| Skeleton card fill | `color.skeleton.shimmer` (v4.4 derived) |

## Focus

| Surface | Token |
|---|---|
| Interactive card focus | `color.action.primary` (2px outline, 2px offset, `:focus-visible` only) |
| Interactive pill focus | `color.action.primary` (2px outline, 2px offset, `:focus-visible` only) |
| Heading-action focus | `color.action.primary` (2px outline, 2px offset, `:focus-visible` only) |

## Notes

- Zero new primitive tokens.
- Delta colour-inversion is the right semantic for residual risk: positive (risk rose) reads as alert; negative (risk fell) reads as improvement. Inverse of stock-ticker conventions.
- v4.4 tokens (`shadow.raised`, `color.skeleton.shimmer`) are referenced; the worktree includes the v4.4 JSON (cherry-picked from `feat/v2-1-0-impact-graph`). Byte-identical to Liam's commit; rebase-clean when his PR merges first.

## Accessibility contract

# ClientGrid — accessibility

A responsive grid of client cards. Spec §7.

## Markup

- The grid is a `<section>` with `aria-labelledby` pointing at the heading (`bare={false}`) or no landmark when `bare={true}`.
- Cards live in a `<ul role="list">`; each card is an `<article>` with `aria-labelledby` + `aria-describedby` pointing at name and meta paragraphs.
- The visible meta paragraph is followed by an `sr-only` span carrying the alert sentence when applicable, so SR users hear the full statement: `"{name}. {subline}. Residual {N}{, up/down N from last week}{, secondary stat}{, N high/medium-severity alert(s)}."`.

## Interactive states

- **Card-only interactive** (`onClientClick`): the `<article>` is wrapped in a `<button>` whose `aria-label` carries the full sentence plus `" Activate to open."`. The inner `aria-labelledby` / `aria-describedby` are dropped to avoid duplicate announcements.
- **Pill-only interactive** (`onAlertClick`): the alert pill is a `<button>` with its own `aria-label` (`"{count} {sev}-severity alert(s) for {name}. Activate to filter."`) and `event.stopPropagation` on click. The card chrome stays presentational.
- **Both supplied (invalid)**: dev-mode console warning; production fallback treats card-click as the only handler. Nested buttons would be a structural a11y violation.

## Avatar

Avatar tile is `aria-hidden="true"` — the glyph is decorative; the name is already in the SR sentence.

## Delta direction

The delta arrow (↑/↓) is `aria-hidden`; the SR sentence carries the word ("up 20 from last week"). Colour reinforces but is not the sole channel.

## Focus order

- Heading action (if present)
- Each card in DOM order
- Alert pill within each card (if `onAlertClick` is supplied) — receives focus after the card-wrapper button
- The grid does not loop or trap focus.

## Empty states

- Attention mode with zero alerts: a `✓` glyph (aria-hidden) + text-default message. The glyph reuses `--color-band-very-low-bg` for the "improving" semantic.
- All mode with zero clients: text message + optional `headingAction`.
- Loading: `role="presentation" aria-hidden="true"` cards; AT skips the loading block.

## Colour contrast

| Surface | Min | Status |
|---|---|---|
| Name on card bg | 4.5:1 | `text-default` on `card.background.default` — locked v4.3 |
| Subline on card bg | 4.5:1 | `text-subtle` on `card.background.default` — verified v4.3 |
| Avatar glyph (white) on chart-cat tokens | 3:1 (graphic-text floor; SR-skipped via `aria-hidden`) | all six cat tokens — see G4 FU-9 verification note below |
| Alert pill (high) | 4.5:1 | white on `band.very-high.bg` — verified |
| Alert pill (medium) | 4.5:1 | `band.medium.text` on `band.medium.bg` — verified |

### G4 FU-9 (CG-3) — avatar contrast verification note (v2.1.1 sweep, 2026-05-20)

The single-letter avatar glyph is rendered `aria-hidden="true"` (the
client name is the SR carrier of meaning), so it is decorative for AT
purposes and falls under WCAG 1.4.11 (Non-text Contrast, 3:1 floor)
rather than 1.4.3 (Contrast Minimum, 4.5:1). The white glyph on the
six `--color-chart-cat-{1..6}` tokens is verified ≥3:1 at all six
positions when the canonical v4.4 chart-cat palette is in effect.

Re-verification trigger: any future palette refresh that changes
`--color-chart-cat-{1..6}` semantic tokens MUST re-run contrast check
against `#FFFFFF`; if any position drops below 3:1, swap the glyph to
a tone-adjusted colour from the same palette family (NOT a generic
text token, which would break the palette identity).

## Don't

- Don't combine `onClientClick` with `onAlertClick` — nested buttons. The component will warn + fall back; consumers should pick one model per surface.
- Don't read the delta arrow as the primary signal. The SR sentence carries the word; colour reinforces.
- Don't set `mode="attention"` then hand-filter the clients prop. The component does the attention filter itself; pre-filtering produces a misleading `"Requires your attention · N clients"` count.

## Verified

- axe-core clean on Default, AllMode, InteractiveCards, InteractivePill, Loading, EmptyAttention stories during implementation.
- Sarah G5 to re-baseline in Chromatic regression sweep + record SR walkthrough.
