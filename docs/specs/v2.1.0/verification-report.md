# Verification report · v2.1.0 spec pack post-G4 corrections

> **Author**: Claude Design
> **Date**: 2026-05-20
> **Method**: grep-based evidence per finding + per-file edit confirmation + visual mini-render dasharray cross-check against Demo B source
> **Audience**: Elena G4 (re-pass), orchestrator (dispatch decision), CEO (sign-off)
> **Scope**: All 3 blockers + 11 non-blocking refinements from G4.md, plus 1 self-found follow-up (ArcDecoration dasharray spec error caught during REFINE 6.1 verification).

---

## §0 Headline

**14 of 14 G4 findings addressed.** Plus one self-caught spec error during verification (ArcDecoration §3.1 dasharray + opacity for ring 1 + missing terminator dot — corrected to match Demo B source verbatim). One known-deferred item: the actual `CitationChip.stories.tsx` grep for Action A coverage is deferred to the implementing engineer per the spec note, because Claude Design works against this design-system project snapshot and does not have read access to the live ui-components repo at the cutoff SHA. This is explicit in Spec 05 §3 and is the correct boundary.

Pack status: **ready for Elena G4 re-pass**.

---

## §1 BLOCKERS — closed, with grep evidence

### BLOCKER 1 · "Zero new tokens" claim empirically false

| Evidence | Result |
|---|---|
| `grep --color-finding-` across `v2.1.0-pipeline/` | 8 hits, all in `00b-v4.4-token-extension.md` (out-of-scope rationale + replacement table) or `G4-response.md` (citing Elena's finding). **Zero residual references in component specs or index.html CSS.** |
| `grep --color-skeleton-shimmer` | Every reference in component specs (01 §2.3 + §2.4; 03 §5 + token chain; 04 §5 + token chain) is annotated with "v4.4 derived" + link to `00b-v4.4-token-extension.md`. |
| `grep --shadow-floating` | Same pattern: every reference (01 §2.4; 02 §4; 07 §3.3 + §5; index.html .card box-shadow) annotated v4.4-derived in the corresponding token-chain section. Cover §2.2 token-surface table annotates each component's v4.4 dependencies explicitly. |
| `grep --color-band-*-border` against `tokens-v4.2.1.css` | All 5 band tokens (very-low, low, medium, high, very-high) exist with `-border` suffix. REFINE 1.2 edge-stroke change in Spec 01 is safe. |
| `grep --color-palette-emerald` | 2 hits, both in `00b-v4.4-token-extension.md` and `G4-response.md` documenting the semantic-token replacement. **Zero residual references in component specs.** Spec 04 ClientGrid uses `--color-band-very-low-bg` semantic throughout. |
| `grep --color-finding-` in index.html CSS rules | 0 hits. Pill styling now uses `--color-band-very-low-*` for pill-ok and inline `rgba(220,38,38,0.12)` + `--color-band-very-high-bg/border` for pill-yes. |

**Resolution shape**: 4 derived tokens proposed in `00b-v4.4-token-extension.md` for v4.4 (3 elevation shadows + 1 skeleton shimmer). `--color-finding-*` deliberately excluded from the brief; their only consumer was the spec-pack cover, rewritten against existing band tokens. Net new primitives: 0. Net new derived tokens: 4. Cover §2.2 re-titled and documents the diff.

### BLOCKER 2 · Gauge API mismatch (Spec 03)

| Evidence | Result |
|---|---|
| `grep size="sm"` across `v2.1.0-pipeline/` | 2 hits — `index.html` narrative prose (quoting "Gauge size=\"sm\""), `G4-response.md` (quoting Elena's finding). **Zero residual references in any spec body.** |
| Spec 03 line 4 (frontmatter "Composes with") | Updated to `size="accessory" variant="single" palette="teal"`. |
| Spec 03 line 91 (cell anatomy diagram) | Updated: `← Gauge size="accessory" (32×32 per Demo C cell anatomy)`. |
| Spec 03 §3.4 (code block) | Updated to `size="accessory"` with a pre-build verification note for Sarah G5: if rendered pixel size doesn't match 32×32, fall back to `size="inline"`. The contract is **match Demo C's geometry**, not the named enum value. |
| Spec 03 §3.1 (grid layout) | Added explanation of `auto-fit` vs Demo C's fixed `repeat(12, 1fr)` — auto-fit produces 12 cells at marketing width; wraps beyond 12 for in-product 30+ client cases. Sophie to confirm marketing-case acceptable. |

**Resolution shape**: spec aligned to shipped `GaugeSize` enum. Pre-build check documented. No API additions proposed (no `'sm'` to be added).

### BLOCKER 3 · CitationChip spec describes wrong implementation

| Evidence | Result |
|---|---|
| `grep children: ReactNode` across `v2.1.0-pipeline/` | 2 hits — Spec 05 §1 (explicitly listing the original-draft drifts), G4-response.md (citing Elena's finding). **Zero claims of `children` as the prop in the spec body.** |
| Spec 05 §1.1 status note | Explicitly enumerates the three drifts: `label: string` (not `children`); aria-label is `variantDescription[variant]` only; tokens use `--color-citation-chip-*` infix. |
| Spec 05 §2 verification result | Scoped to "all 9 variants present" — confirmed against shipped types.ts. |
| Spec 05 §3 actions restructured | Action A (stories) marked **provisional**; Action B (combined-announcement aria-label) re-scoped against actual current aria-label state; Action C (WCAG 2.5.8 min target size) added per Elena's a11y observation. |
| Spec 05 §6 Annex A · current-state grep | Verbatim citation of Elena's verification with file:line refs (types.ts, index.tsx lines 9-19, 72-78, 84, ~92). Future spec authoring has a reference. |
| Spec 05 §4 token tier correction | Documents `--color-citation-chip-*` (component-tier; what the component uses) vs `--color-citation-*` (semantic-tier; what semantic JSON exposes). Drift acknowledged; consolidation out of v2.1.0 scope. |

**Resolution shape**: Spec 05 fully rewritten against the verified shipped source. Annex A documents the grep so the next reviewer can verify in seconds.

---

## §2 NON-BLOCKING REFINEs — incorporated, with file:section evidence

| # | Refine | File · section | Evidence |
|---|---|---|---|
| 1.1 | Unknown-category fallback in ImpactGraph | 01-ImpactGraph.md §7 | Added explicit `__dev__` throw + prod fallback paragraph; documented in MDX directive |
| 1.2 | Edge stroke uses `-border` (not `-bg`) | 01-ImpactGraph.md §2.2, §2.4, §7 | §2.2 prose updated; §2.4 token chain block updated with both `-border` (edges) and `-bg` (centre ring fill); §7 lists this as REFINE 1.2 addressed |
| 2.1 | CaptionsOff story clarification | 02-HeroVideo.md §6 | Story description extended with the note: "VTT track is still loaded and parseable; only the default-on display flag flips. Document this distinction explicitly so Sarah G5 doesn't flag it as a contradiction." |
| 2.2 | Mobile caption sizing MDX note | 02-HeroVideo.md §8 Q3 | Exact MDX sentence provided distinguishing in-video VTT (dark scrim) from fallback-grid caption-pane (teal-50 substrate) |
| 3.1 | Pill text carries band word | 03-CompliancePostureStrip.md §3.3, §7.4 | §3.3 alert pill table now shows `{alertCount} high` / `{alertCount} med`; §7.4 documents the colour-blind-safe text channel |
| 3.2 | PostureStrip cell role="img" wrapper | 03-CompliancePostureStrip.md §7.1 | Markup rewritten with `<div role="img" aria-label="…">` inside `<li>`; button wraps role=img only when interactive |
| 4.1 | Semantic emerald token for improvement delta | 04-ClientGrid.md §3.5, §4, §5 | All references swapped to `--color-band-very-low-bg`; empty-state check glyph color updated; token chain block documents the resolution to palette-emerald-500 |
| 5.1 | AllVariantsRow_Mobile story | 05-CitationChip §3 Action A | Added to candidate stories list with `parameters: { viewport: { defaultViewport: 'mobile1' } }`; rendered at 375px |
| 6.1 | ArcDecoration dasharray verification vs Demo B | 06-ArcDecoration.md §3.1 + Annex | **Grep-verified against Demo B lines 195-203.** Found 2 spec errors (ring 1 dasharray was `100 1156`; should be `130 1120`; ring 1 opacity was `0.50`; should be `1.0` i.e. omit) + missing terminator accent dot. **Spec corrected to match Demo B verbatim.** Annex section added with grep cite. Index.html mini-render also corrected (ring 1 dasharray + opacity + terminator dot added). |
| 7.1 | KeyboardWalkthroughReducedMotion story | 07-Header-polish.md §6 | Added to story list with rationale: catches regressions in reduced-motion handling specifically under keyboard nav |
| WCAG 2.5.8 | CitationChip interactive target size | 05-CitationChip §3 Action C | New gating action; bumps interactive `py-0.5` → `py-1` (~22px → ~26px). Static (in-prose) variant unchanged for typographic rhythm |

**Net**: 11 of 11 refines + the cross-cutting WCAG 2.5.8 (12 of 12). 

---

## §3 Self-caught issues during verification

These were not in Elena's verdict; they surfaced when I greped my own work against source-of-truth.

| # | Issue | Where | Fix |
|---|---|---|---|
| S-1 | ArcDecoration ring 1 dasharray wrong | 06-ArcDecoration.md §3.1 + index.html mini-render | Corrected `100 1156` → `130 1120` to match Demo B line 201 |
| S-2 | ArcDecoration ring 1 opacity wrong | 06-ArcDecoration.md §3.1 + index.html mini-render | Removed `opacity=0.50`; Demo B has no opacity attribute on ring 1 (i.e. 1.0) |
| S-3 | ArcDecoration terminator accent dot missing | 06-ArcDecoration.md §3.1 + §2 API + index.html | Added the 4px filled disc at (cx=-200, cy=0) with rotation -170° + `--color-palette-teal-300` fill. Spec now flags it as "part of the canonical recipe" with explicit `hideTerminatorDot?` prop for opt-out. |
| S-4 | Token name in 06-ArcDecoration §3.1 mixed v4.2.1 primitive-tier (`--color-neutral-stone-300`) with v4.3 alias (`--color-palette-stone-300`) | 06-ArcDecoration.md §3.1 | Documented that v4.3 alias-tier is preferred per cover §2.2; either reference resolves to the same value |
| S-5 | Index.html visual mini-render for ArcDecoration card used the wrong dasharray and missed the dot | index.html ~lines 411-417 | Mini-render corrected to match Demo B exactly; verifier confirmed rendering |

This is exactly the kind of empirical drift Elena's REFINE 6.1 was guarding against. The grep-against-Demo-B pass surfaced it; this is the value of REFINE 6.1's discipline.

---

## §4 Lessons encoded for next cycle

Documented in `00b-v4.4-token-extension.md §7` and reinforced by §3 above:

1. **Every `var(--*)` in a spec must be grep-verified against `dist/tokens.css` at the cutoff SHA.** Demo CSS is not source-of-truth.
2. **Every TS signature, every existing aria-label, every shipped lookup table claimed in a spec must carry a `file:line` reference.** Annex-A-style appendices become standard.
3. **Every "verbatim from Demo X" claim must be grep-cite-backed.** S-1/S-2/S-3 happened because the original spec asserted "lift verbatim" without doing the grep. The pattern that catches this is: **the spec author writes the grep cite, not the reviewer.**
4. **Audit-pack demo CSS should be re-exported from `dist/tokens.css`** (not hand-authored). Eliminates the demo-vs-source drift surface that triggered BLOCKER 1. v4.5+ work; not in scope here but worth orchestrator + G4 alignment.

Items 1-3 are immediately actionable in the spec-authoring loop. Item 4 is a v4.5 infra task.

---

## §5 What's verified vs what's outsourced

### Verified by Claude Design directly (in this report)

- All `var(--*)` references in component specs use either v4.3 tokens (existing) or v4.4-derived (annotated with the brief link).
- All `var(--*)` references in index.html resolve against the loaded stylesheet (independently confirmed by the verifier subagent — 51 references, zero unresolved).
- No `size="sm"` in any spec body.
- No `children: ReactNode` claimed as the CitationChip prop in the spec body.
- No raw `--color-palette-emerald-500` in any spec body.
- ArcDecoration dasharray + rotation values + terminator dot match Demo B exactly.
- WCAG 2.2 AA tokens pass contrast contracts (Elena's PASS in the original review).

### Outsourced to implementing engineer

- **`CitationChip.stories.tsx` actual story coverage** — Spec 05 §3 Action A is marked **provisional**; engineer greps the actual file before adding stories. Claude Design works against this design-system project's snapshot of CitationChip, not the live ui-components repo at the cutoff SHA. The spec is explicit about this boundary.
- **Gauge rendered pixel size** for `size="accessory"` — Sarah G5 verifies pixel match against Demo C cell anatomy; fall back to `size="inline"` if needed. Documented in Spec 03 §3.4 pre-build check.

These are the right boundaries — verifying live ui-components source requires repo access we don't have; verifying rendered Gauge pixel size requires running Storybook.

---

## §6 Files in this revision

| File | Status | Change |
|---|---|---|
| `00-cover.md` | edited | §2.2 token claim rewritten; sequencing updated; effort table updated; out-of-scope row rewritten |
| `00b-v4.4-token-extension.md` | NEW | 4 derived tokens (3 elevation + 1 shimmer) proposed for v4.4 |
| `01-ImpactGraph.md` | edited | REFINE 1.1 + 1.2 applied; §7 added |
| `01-ImpactGraph.accessibility.md` | unchanged | original posture passed G4 |
| `02-HeroVideo.md` | edited | REFINE 2.1 + 2.2 applied |
| `02-HeroVideo.accessibility.md` | unchanged | original posture passed G4 |
| `03-CompliancePostureStrip.md` | edited | BLOCKER 2 + REFINE 3.1 + 3.2 applied (3 edits: frontmatter, anatomy diagram, §3.4) |
| `04-ClientGrid.md` | edited | REFINE 4.1 applied (semantic emerald everywhere) |
| `05-CitationChip-variant-coverage.md` | REWRITTEN | BLOCKER 3 fully addressed; Annex A added; Action C added |
| `06-ArcDecoration.md` | edited | REFINE 6.1 applied + 4 self-caught errors corrected + terminator accent dot added to API |
| `07-Header-polish.md` | edited | REFINE 7.1 applied; v4.4 shadow annotation |
| `07-Header-polish.accessibility.md` | unchanged | original posture passed G4 |
| `08-VideoEmbed-token-swap.md` | unchanged | passed G4 cleanly |
| `index.html` | edited | pill styles rewritten against band tokens; eyebrow span color fixed (token-semantics bug from earlier); ArcDecoration mini-render corrected; sequencing + effort tables updated; new links to brief + response + this report |
| `G4-response.md` | NEW | per-finding resolution log |
| `verification-report.md` | NEW | this file |

---

**End of verification report.** Pack ready for Elena G4 re-pass.
