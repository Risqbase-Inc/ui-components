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
