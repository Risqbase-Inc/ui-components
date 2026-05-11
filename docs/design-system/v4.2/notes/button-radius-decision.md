# Button border-radius — S1 decision

**Date:** 2026-05-10 · **Author:** G4 (Design) (G4) · **PR:** `s1/cleanup-3-design`

## Decision
Keep `rounded-xl` (12px) for `<Button>`. Add a `dimension.radius.button.default` role token (alias to `{dimension.radius.lg}`); component reads it via `rounded-[var(--dimension-radius-button-default)]`.

## Why not migrate to `rounded-full`
Two anchors in the v4.2 system disagree:
1. `tokens/primitive/dimension.json:15` describes `radius.lg` as `"Large radius — buttons"` — the canonical statement on button rounding inside the v4.2 spec/token tree. v1.x consumers ship `rounded-xl` (= `radius.lg` = 12px).
2. `GOV-DS-2026-01` (brand baseline) says buttons are `rounded-full`. `spec.md:198` describes skip links as "indigo brand pill style".

Spec line 28 makes v4.2 the system-level baseline, but GOV-DS-2026-01 is the brand baseline three consumer apps already ship against. Migrating to `rounded-full` is a visible v1.x → v1.3 regression and contradicts the primitive token's `"Large radius — buttons"` description. CEO directive is "implement spec as presented" and the spec's strongest signal is the primitive token annotation.

Resolution: keep the current shape, log the brand-baseline tension in `v4.2.1-backlog.md` for CEO + G4 to adjudicate at v4.2.1 patch time.

## Why a role token rather than a Tailwind utility
`src/core/Button/tokens.md:10` already lists `dimension.radius.button` as the role token Button consumes. Spec §15.4 requires components to consume role tokens declared in their `tokens.md` — the contract existed; only the implementation lagged. With the role token in place, a future shape change (e.g. CEO chooses pill at v4.2.1) is a one-line edit to `tokens/component/button.json`, no component touch.

## Pixel delta for G5 (S5 Chromatic)
Zero. `rounded-xl` = 0.75rem = 12px; `{dimension.radius.lg}` = 12px. Class string changed but rendered output is identical. Re-baseline only if Chromatic flags any drift.

## Verification
`npm run build` succeeds; `npm run lint:tokens` passes (new role token has `$type`, `$description`, both `$extensions` keys per lint rule).
