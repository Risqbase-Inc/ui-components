# Brand mark v3 — implementation evidence (ui-components leg)

**Source:** design hand-off `artefacts/brand/design_handoff_brand_mark_v3` (LOCKED 2026-06-11, Claude Design), brief `ui-components#43`.
**Spec revision:** A1 **v1.1** (hand-off update, 2026-06-11 post-implementation) restates A1 as **surface-relative** — indigo-700 on light surfaces / indigo-300 on dark, independent of theme — and adopts the `e9e7855` token shape as spec: `color.brand.mark` for default surfaces, `color.brand.mark-on-inverse` for inverse surfaces, inverse text re-aliasing `on-inverse-subtle`, and the narrowed R15 scope (RATIONALE-ADDENDUM §11).
**Scope here:** the `ui-components` PR leg only. Consumer repos (`ralia-tier2`, `risqbase-com`, `internal-tools`) and their favicon/Logo-component/footer-tint migrations are tracked separately per the hand-off propagation plan.

## What shipped

| File | Bytes | Placement |
|---|---|---|
| `public/icon.svg` | 661 | Replaces the drifted Helvetica-`<text>` mark; docs-site favicon (`<link rel="icon">` already pointed here) |
| `public/mark.svg` | 547 | Bare `currentColor` mark; inlined in the docs-site topbar |
| `public/favicon-inverse-optional.svg` | 594 | Optional inverse favicon — shipped as an exported asset, **not** wired as the default favicon |
| `public/favicon.ico` | 15,086 | Regenerated from `icon.svg` only (16/32/48 via sharp + png-to-ico); was 3,743 B of the drifted mark |

npm surface: all three SVGs added to `files` and exported as `./assets/icon.svg`, `./assets/mark.svg`, `./assets/favicon-inverse.svg` (verified present in `npm pack --dry-run`).

Docs-site tint migration (A1): new `--color-header-logo` — `#4338CA` (indigo-700) light / `#A5B4FC` (indigo-300) dark — used by the topbar logo (mark + wordmark). `--color-action-primary` untouched. The mark is inlined as `<svg>` (`aria-hidden`, the link text carries the name), never `<img>`, so it themes via `currentColor`.

## Acceptance checklist (hand-off §Acceptance)

- [x] SVGO pass (preset-default + `keepRoleAttr` — plain defaults strip `role="img"`, which the assets carry deliberately). icon −35.9%, mark −38%, inverse −40.7%.
- [x] Visual identity before/after: rasterised original vs optimised at 512² (sharp, density 300) — **0 differing bytes** across all three, max channel delta 0.
- [x] DOMParser parse: all three parse error-free in the `http://www.w3.org/2000/svg` namespace (jsdom). **W3C Nu validator unreachable from this environment (network policy: `validator.w3.org` not in allowlist)** — DOMParser + namespace check substituted; re-run Nu post-merge if required.
- [x] ≤ 2 KB each (547–661 B).
- [x] No `<text>`, no `font-family`, no `stroke`, no gray-\* hex in any of the three.
- [x] Renders checked at 16/32/48/64/180/512 (`brand-mark-v3-render-sheet.png`) + themed mark light/dark.
- [x] `mark.svg` inlined (not `<img>`) where it themes — docs topbar, screenshots `brand-mark-v3-header-{light,dark}.png`.
- [x] Tint tokens migrated **surface-relatively** (A1 v1.1): default-surface header logos consume `color.brand.mark` (docs site mirrors it in `--color-header-logo`); the inverse-surface Footer consumes `color.brand.mark-on-inverse` (PR-A commit `e9e7855`); no action colours changed.
- [x] Placement rule: docs topbar surfaces give 7.9:1 (light, `#FAFAF9`) / 8.6:1 (dark, `#101214`) against the active tint — clears the ≥3:1 floor and the AAA ≥7:1 target.
- [x] PR description states the A1 tint adoption, the deliberate `color.action.primary` divergence (spec amendment needed on #43's audit row), and the 1.4.6/1.4.9 logotype exemption as belt-and-braces.

## Not touched (deliberate)

- `public/_canvas/dark-mode-canvas.html` — frozen BRIEF-401 evidence artefact with a demo "RALIA" logo; not a live brand surface.
- `color.action.primary` and every other action token — the mark's divergence from action indigo is a locked decision (hand-off §Locked decisions, item 6).
- The SVG geometry/hex — production artefacts shipped as delivered (post-SVGO only).
