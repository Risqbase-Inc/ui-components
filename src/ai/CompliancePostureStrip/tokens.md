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
