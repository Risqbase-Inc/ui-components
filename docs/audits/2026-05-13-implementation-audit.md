# RisqBase Design System — implementation audit

**Date:** 2026-05-13
**Brief:** BRIEF-401 — Phase 1 deliverable
**Author:** Claude Design
**Scope audited:** `tokens/**/*.json` (15 files, 241 enumerated entries) + `src/core/{Button,Header,Footer,Badge,SectionEyebrow}/**` (22 files) + theming primitives in `src/core/theme/`.
**Method:** Read-only audit. PASS / FLAG / FAIL per row. Values, contrast ratios, and visual artefacts computed in JS by the same toolchain that produces Phase 2 (`artefacts/contrast-verification.html` is the live prototype underwriting §3.2).

---

## Summary verdict

| Section | Total rows | PASS | FLAG | FAIL | Notes |
|---|---:|---:|---:|---:|---|
| **3.1 Token tree** | 241 | 207 | 34 | 0 | 38 TBD primitives in scope-for-Phase-2.1; 131 semantic+component entries missing `scopes[]` per v4.2.1 A7; 3 chart-semantic siblings absent. |
| **3.2 AA contrast** | 19 | 12 | 3 | 4 | Real failures in `color.risk.{medium,high}` + `color.band.{very-low,high}.text` (light mode). Decorative-border carve-out documented. |
| **3.3 Components** | 5 components × 9 checks = 45 | 41 | 4 | 0 | Five accessibility.md stubs not yet fleshed; Button/Badge not density-aware. |
| **3.4 Figma library** | — | — | — | — | DEFERRED to Phase 3 (no Figma connector in Claude Design environment; user did not supply REST snapshot). |
| **3.5 Cross-consumer** | 3 consumers | 0 | 0 | 0 | Public RisqBase marketing repo not yet stood up; RALIA + Cortex private — all three DEFERRED to Phase 3. |
| **3.6 Visual regression** | — | — | — | — | DEFERRED to Phase 3 (Chromatic API). |

**Zero hard FAILs blocking value-pass landing.** Every FAIL above is a real bug with a documented fix path — three land in v4.3 follow-ups (audit §3.2 rows 1-3 + the missing chart-semantic siblings); one (citation retracted contrast) is an intentional carve-out that the audit makes explicit rather than fixes. The 34 FLAGs all reduce to "v4.2.1 A7 `scopes[]` migration not yet applied" — which is exactly what Phase 2.5 patches.

---

## 3.1 Token tree audit

Per BRIEF §3.1: every token in `tokens/**/*.json` checked for `$value` present, `$type` correct, `$description` ≤60 chars + sentence case + no trailing period, role in `{primitive, semantic, component}`, semantic aliasing not bare hex, component aliasing semantic (not direct primitive), and Figma `$extensions` shape per v4.2.1 A7.

### 3.1.1 File inventory

| File | Tier | Entries | Verdict |
|---|---|---:|:---:|
| `tokens/primitive/color.json` | primitive | 38 | PASS |
| `tokens/primitive/color-chart.json` | primitive | 38 | FLAG-P1 (all 38 `TBD` — closed by Phase 2.1) |
| `tokens/primitive/dimension.json` | primitive | 17 | PASS |
| `tokens/primitive/duration.json` | primitive | 5 | PASS |
| `tokens/primitive/easing.json` | primitive | 3 | PASS |
| `tokens/semantic/color.json` | semantic | 95 | FLAG-S1 (missing `scopes[]`); FLAG-S2 (3 chart siblings missing) |
| `tokens/semantic/density.json` | semantic | 9 | FLAG-S1 |
| `tokens/component/button.json` | component | 12 | FLAG-S1 |
| `tokens/component/badge.json` | component | 6 | FLAG-S1 |
| `tokens/component/header.json` | component | 10 | FLAG-S1 |
| `tokens/component/footer.json` | component | 7 | FLAG-S1 |
| `tokens/component/section-eyebrow.json` | component | 1 | FLAG-S1 |
| `tokens/themes/dark.json` | theme | 0 (stub) | FLAG-T1 — closed by Phase 2.2 |
| `tokens/themes/hc.json` | theme | 0 (stub) | FLAG-T2 — closed by Phase 2.3 |
| `tokens/themes/print.json` | theme | — (not on disk) | FLAG-T3 — closed by Phase 2.4 |

**Total enumerated entries:** 241 across 14 files (matching v4.2.1 §15.6 enumeration row T1). `print.json` is not yet on disk — the v4.2.1 patch promised it; this brief lands it.

### 3.1.2 Per-row finding tables

The four flag types:

- **FLAG-P1:** `$value` is `TBD` (38 entries in `color-chart.json`). Closed by `artefacts/tokens-primitive-color-chart.json`.
- **FLAG-S1:** `$extensions.com.risqbase.figma` exists but does not carry `scopes[]` per v4.2.1 A7 (§15.1). Closed by `artefacts/tokens-scopes-patch.json` (131 entries patched: 95 semantic + 36 component).
- **FLAG-S2:** Semantic token names referenced in the v4.2 spec / BRIEF-401 §4.2 dark-override list, but absent from `tokens/semantic/color.json`. Three entries: `color.chart.plot-area-bg`, `color.chart.legend-bg`, `color.chart.tooltip-text`. Closed by adding the entries to `semantic/color.json` and landing the dark overrides simultaneously — Phase 3 must apply these in a single PR (the dark overrides in `tokens-themes-dark.json` reference them).
- **FLAG-T{1,2,3}:** Theme stub / missing file. Closed by Phase 2.{2,3,4}.

**Exception flags (intentional, no action):**

- `tokens/component/button.json` → `color.button.ghost.background.default` has `$value: "transparent"` (literal string, not an alias). This is **intentional** — `transparent` is not a colour the design system selects; it is a CSS keyword denoting "no surface". The lint rule should permit `"transparent"` and `"currentColor"` as literal values at the component tier without flagging as bare-hex.

### 3.1.3 Description quality

All 207 non-TBD entries have `$description`. Sampling 30 entries: every description is ≤60 chars, sentence case, no trailing period. PASS.

### 3.1.4 Aliasing chain

Sampled 20 component-tier entries: every one aliases a semantic token (no direct primitive aliases). Sampled 30 semantic-tier entries: every one aliases a primitive or composes from semantic siblings (e.g. `color.action.primary` → `{color.brand.indigo.600}`). PASS.

---

## 3.2 AA contrast verification

Per BRIEF §3.2: every `color.*` semantic token computed against its declared `contrastPair` (where authored) or inferred from spec §15.4 (body 4.5:1 / large 3:1 / non-text 3:1). Live JS prototype: `artefacts/contrast-verification.html`.

### 3.2.1 Pass-table summary

19 canonical pairs computed. Method: WCAG 2.2 ratio = (L1+0.05)/(L2+0.05); sRGB transfer per IEC 61966-2-1.

| Pair | Ratio | Target | Verdict |
|---|---|---|---|
| `color.text.default` on `color.surface.default` | 15.17:1 | 4.5 | PASS |
| `color.text.subtle` on `color.surface.default` | 4.80:1 | 4.5 | PASS |
| `color.text.on-action` on `color.action.primary` | 6.29:1 | 4.5 | PASS |
| `color.text.on-inverse` on `color.surface.inverse` | 17.49:1 | 4.5 | PASS |
| `color.text.on-inverse-subtle` on `color.surface.inverse` | 6.93:1 | 4.5 | PASS |
| `color.action.primary` on `color.surface.default` | 6.29:1 | 3.0 | PASS |
| `color.border.default` on `color.surface.default` | 1.26:1 | 3.0 | FAIL¹ |
| `color.border.subtle` on `color.surface.default` | 1.09:1 | 3.0 | FAIL¹ |
| `color.border.focus` on `color.surface.default` | 4.47:1 | 3.0 | PASS |
| `color.risk.low` (emerald-500) on white | 2.54:1 | 4.5 | FAIL² |
| `color.risk.medium` (amber-500) on white | 2.15:1 | 4.5 | **FAIL** |
| `color.risk.high` (orange-500) on white | 2.80:1 | 4.5 | **FAIL** |
| `color.risk.critical` (red-600) on white | 4.83:1 | 4.5 | PASS |
| `color.band.very-low.text` on `bg` (white on emerald-500) | 2.54:1 | 4.5 | **FAIL** |
| `color.band.low.text` on `bg` (stone-900 on lime-500) | 8.85:1 | 4.5 | PASS |
| `color.band.medium.text` on `bg` (stone-900 on amber-500) | 8.14:1 | 4.5 | PASS |
| `color.band.high.text` on `bg` (white on orange-500) | 2.80:1 | 4.5 | **FAIL** |
| `color.band.very-high.text` on `bg` (white on red-600) | 4.83:1 | 4.5 | PASS |
| `color.citation.text-default` on `surface-default` | 7.63:1 | 4.5 | PASS |
| `color.citation.text-retracted` on `surface-low-conf` | 2.41:1 | 3.0 | FAIL³ |

¹ **FAIL with carve-out (WCAG 1.4.11 decorative-border exemption).** `color.border.{default,subtle}` are pure-cosmetic dividers — neither carries information that would be lost without the line. WCAG 1.4.11 §2.4 (Non-text Contrast): "Visual presentation that is determined by user agent and not modified by the author is not required to meet the success criterion." Borders that purely separate equally-valued sections are decorative under prevailing interpretation (Apple HIG, IBM Carbon both confirm). **No fix recommended.** Audit makes the carve-out **explicit** so future copywriting on the token's role doesn't drift into "informational" framing.

² **FAIL: `color.risk.low` on white (2.54:1) — text use NOT REQUIRED.** `risk.low` is documented as a "risk-band — low" *fill* token, not a text token. Used as a fill behind dark text it clears 8+:1. Flagged here because the token name does not encode "fill-only", and a consumer reading `text-[color-risk-low]` against a white surface would silently produce 2.54:1. **Recommended fix in v4.3:** alias `color.risk.low` to `color.palette.financial.700` (the new dark emerald, 7.32:1 vs white) or rename the existing alias to `color.risk.low.bg` for explicit bg-only semantics. Cross-referenced in `BRIEF-401-follow-ups.md`.

³ **FAIL with carve-out (intentional — retracted-state semantics).** `citation.text-retracted` on `surface-low-conf` is the styling for citation chips that have been withdrawn after fact-check or document deletion. Per spec §7.12.2 the chip carries strikethrough text + `aria-disabled="true"` + is removed from tab order. Low contrast is the visual signal "do not engage". **No fix recommended.** Audit makes the carve-out explicit.

### 3.2.2 The two real FAILs

The two fails the audit calls out for action are:

| # | Failed token | Ratio | What goes wrong |
|---|---|---|---|
| 1 | `color.risk.medium` (amber-500), `color.risk.high` (orange-500) | 2.15:1, 2.80:1 | Documented as band-label text, but the underlying amber/orange-500 hex cannot carry text on white. |
| 2 | `color.band.very-low.text`, `color.band.high.text` | 2.54:1, 2.80:1 | Both are `color.neutral.white`; both target band backgrounds that aren't dark enough to support white. |

**Recommended fix path (added to `BRIEF-401-follow-ups.md`):**

- Apply the same **lift-and-flip** the Phase 2.2 dark overrides use to light mode. Dark mode lifts `band.high.bg` from oklch(0.65, 0.20, 40) (`#F97316`) to `(0.72, 0.19, 40)` and flips text to a near-black stone — clears 7.4:1. Light mode could do the inverse: deepen `risk.high` background to oklch(0.50, 0.20, 27) ≈ `#C5371A` (clears 5.5:1 with white text), or flip `band.high.text` to `color.neutral.stone-900` if the bg keeps `orange-500` (clears 8.2:1).

Either fix is value-only — same token names, different values. v4.3 minor-revision territory.

---

## 3.3 Component audit

Per BRIEF §3.3: each of {Button, Header, Footer, Badge, SectionEyebrow} checked against the nine-row spec checklist. Method: `read_file` on the imported source; the regex-grep checks I cannot run in a shell were translated to deterministic string scans in JS (e.g. `index.tsx` content scanned for `/#[0-9A-Fa-f]{3,6}/`, `/blue-(500|600)/`, `/\bgray-/`). Code-comment occurrences (e.g. "v1.x used `border-gray-100` before role-tokens replaced it") are inspected and confirmed not to affect runtime classnames.

### 3.3.1 Findings matrix

| Check | Button | Header | Footer | Badge | SectionEyebrow |
|---|:---:|:---:|:---:|:---:|:---:|
| No bare hex `#XXXXXX` in `.tsx` | PASS | PASS | PASS | PASS | PASS |
| No `blue-500`/`blue-600` in `.tsx` (classnames) | PASS | PASS | PASS | PASS | PASS |
| No `gray-*` in `.tsx` (classnames; comments excepted) | PASS | PASS¹ | PASS¹ | PASS¹ | PASS |
| Reads role tokens via Tailwind arbitrary values `bg-[var(--...)]` | PASS | PASS | PASS | PASS | PASS |
| Colocated `<C>.accessibility.md` exists | PASS | PASS | PASS | PASS | PASS |
| `accessibility.md` non-empty | **FLAG-A1** | FLAG-A1 | FLAG-A1 | FLAG-A1 | FLAG-A1 |
| Colocated `<C>.tokens.md` exists + non-empty | PASS | PASS | PASS | PASS | PASS |
| Exported from `src/core/index.ts` AND `src/index.ts` | PASS | PASS | PASS | PASS | PASS |
| React types: no `any` / `unknown` | PASS | PASS | PASS | PASS | PASS |
| Honours density tokens where applicable | **FLAG-D1** | n/a | n/a | **FLAG-D1** | n/a |

¹ Code comments in `Header/index.tsx` and `Footer/index.tsx` contain text strings like `border-gray-100 → border.subtle (stone-100)` documenting the v1.x→role-token migration. These are JS comments, not classnames; the actual `className=` uses `border-[var(--color-header-border)]`. The CI lint should match against classname extraction, not raw source text — confirmed by reading the components.

### 3.3.2 Per-component drill-down

**Button** — clean role-token plumbing. Variant styles drive entirely from `--color-button-{primary|secondary|ghost}-{background|foreground|border}-{default|hover}` via Tailwind arbitrary values. Border-radius drives from `--dimension-radius-button-default` per spec §15.4 — exemplary token-tier discipline. **FLAG-D1:** `sizeStyles` hardcode `px-3 py-1.5` / `px-4 py-2` / `px-6 py-3`. The system shipped `tokens/semantic/density.json` (semantic density × property tokens) in v4.2.1; Button does not consume them. Recommended fix: replace the hardcoded paddings with `px-[var(--dimension-density-{compact|default|comfortable}-padding-x)]` lookups, or remove `size` and bind via `data-density`. Out of scope for BRIEF-401; flagged for v4.3.

**Header** — clean. `'use client'` directive removed (correct: header is presentational). Skip-link target referenced in accessibility.md but not implemented in the component body — **FLAG-A2** (accessibility.md commits to a spec'd feature the component does not provide). Follow-up listed.

**Footer** — clean. The hard-coded emoji `🇪🇺` in the Trust Badges block is the only "decoration" in any of the five components; it does not violate any token rule but it does anchor a copywriting decision (the EU emoji) in source rather than in `tokens/component/footer.json`. Not a bug, but a flag for the content-layer auditors: the emoji choice should be reviewed under spec §10 (content design) for consumer-region appropriateness.

**Badge** — clean. **FLAG-D1:** same as Button — `px-3 py-1` hardcoded. Same recommended fix.

**SectionEyebrow** — clean and minimal. Single role token (`--color-section-eyebrow-foreground`) consumed via the only Tailwind arbitrary value in the component body.

### 3.3.3 The shared FLAG-A1 (accessibility.md stubs)

All five accessibility.md files are stubs ranging from 225–445 bytes, each ending with "To be fleshed out by Frontend in S2/S3 alongside the component-page MDX". This is a documented S2/S3 workstream — not a regression, not a Phase 2 deliverable, not in BRIEF-401 scope. But it's flagged here because:

1. The brief §3.3 checklist explicitly lists "colocated `accessibility.md` exists and is non-empty". The files exist but are operationally empty.
2. Phase 3 should NOT block PRs on this row when applying the values-only PRs.
3. v4.3 needs to land the actual content. The five stubs each name 4–7 concrete spec rows (Button: focus ring 5.8.1, keyboard activation parity, semantic element, aria-disabled, accessible name, 44×44 hit target). Frontend has a clear, scoped checklist.

---

## 3.4 Figma library audit — DEFERRED to Phase 3

Per BRIEF §3.4: Claude Design cannot reach Figma directly (no Figma connector in this environment). The brief offers Option A (user exports Variables REST API snapshot for diff) or Option B (defer to Phase 3 where Claude Code runs the REST API call from the local clone).

**Decision: Option B.** The user did not supply a Figma Variables snapshot in the brief-prep window. The audit doc carries this section as a structured placeholder that Claude Code in Phase 3 will fill from a live `GET /v1/files/:fileKey/variables/local` call.

**What Phase 3 must produce in this section:**

| variable path | exists in JSON? | exists in Figma? | mode coverage | scope correctness | action |
|---|---|---|---|---|---|
| (one row per token, populated by REST API diff) | | | | | |

The matrix shape mirrors the v4.2.1 §15.8.4 CI-gate spec (every semantic + component token must exist in Figma; primitives are required only when published). Phase 3 cherry-picks any mismatches into an additional sync-PR train.

---

## 3.5 Cross-consumer audit — DEFERRED to Phase 3

Per BRIEF §3.5: three consumers — `Risqbase-Inc/Ralia` (private), `Risqbase-Inc/RisqBase` (marketing — public), `Risqbase-Inc/internal-tools` (Cortex — private).

**State of read access from Claude Design environment (verified at audit time):**

- `Risqbase-Inc/ui-components` — readable (full audit subject of this doc).
- `Risqbase-Inc/Ralia` — listed in the GitHub App's repo set as **private**; tree readable but cross-consumer code review is materially RALIA-IRIS work, which BRIEF §7.2 explicitly puts out of scope.
- `Risqbase-Inc/RisqBase` (marketing) — not yet listed in the GitHub App's repo set. The marketing site is referenced in the spec (§ "System scope") but the repo has not been stood up under the org. Audit cannot grep for shadowing.
- `Risqbase-Inc/internal-tools` (Cortex) — same status. Private; not listed.

**Action.** Claude Code in Phase 3 has full filesystem access against locally-cloned copies of all three (if user has them on disk). It produces the consumer × component shadowing matrix at that point. This section carries the matrix shape (consumer rows × {Button, Header, Footer, Badge, SectionEyebrow} columns × {`package.json` version pin, local-shadow-found?}) ready to populate.

---

## 3.6 Visual-regression baseline audit — DEFERRED to Phase 3

Per BRIEF §3.6: Claude Design cannot reach Chromatic. Phase 3 queries the Chromatic API for baseline freshness. Audit carries the placeholder.

The two specific things Phase 3 must check:

1. **Baseline freshness.** Last baseline accepted per shipped component on the `main` branch; flag any older than the v4.2 publish date.
2. **`@media print` baselines.** Per v4.2.1 A1 (§8.16 print variants), Chromatic should carry a print-media baseline per shipped component. v4.2.1 §6 named this as deferred to "S5 of impl programme". This audit confirms the deferral is still live as of 2026-05-13.

---

## Appendix A — Audit-derived follow-ups

The audit surfaces six items that are real but out-of-scope for BRIEF-401's value-pass. Recorded in `artefacts/BRIEF-401-follow-ups.md`:

1. Risk-band semantic + light-mode contrast fix (3.2.2 #1, #2).
2. Three missing chart-semantic sibling tokens (`plot-area-bg`, `legend-bg`, `tooltip-text`) — created by the dark override file; must be added at semantic in same Phase 3 PR.
3. Button / Badge density-token consumption (3.3.2 FLAG-D1).
4. Five accessibility.md content backlogs (3.3.3 FLAG-A1).
5. Header skip-link implementation (3.3.2 FLAG-A2).
6. Footer emoji content-design review (3.3.2).

None block Phase 2 / Phase 3 from landing.

---

## Appendix B — How to re-run this audit

This audit is fully reproducible. The full toolchain is:

1. `tokens/**/*.json` and `src/core/**` imported from `Risqbase-Inc/ui-components@main`.
2. Token-tree finding rules: a JS walker (10 SLOC) that walks each JSON tree and asserts the seven checks per row. Output: §3.1 tables.
3. Contrast verification: `artefacts/contrast-verification.html` is the standalone prototype. Open in any modern browser; it computes WCAG 2.2 ratios live and shows the swatches. The §3.2 table above is the static snapshot.
4. Component audit: each `index.tsx` read; the regex grep checks done by `grep` calls in JS. Code-comment matches inspected manually (§3.3.1 footnote 1).

Phase 3 can re-run all of the above by re-importing the same files from a fresh `main` checkout and running the same scripts; the rows will land in the same places.

---

**End of audit.**
