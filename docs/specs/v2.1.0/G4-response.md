# G4 review response — per-finding resolution log

> **Reviewer**: Elena Vasquez (G4 — Principal Designer)
> **Verdict**: CONCERNS · conditional GREEN
> **Reviewed at**: 2026-05-20T14:45Z · commit 6c0e40c1b1261c7d5c36451afc2867d3b60ae4fa
> **Response by**: Claude Design
> **Responded at**: 2026-05-20 (same day)
> **Status after this response**: 3 blockers closed · 11 non-blocking refines incorporated · pack ready for G4 re-pass 21 May PM
> **Net spec edits**: 6 markdown files modified, 1 markdown file rewritten (05-CitationChip), 1 new file (00b-v4.4-token-extension.md), 1 new file (this response), index.html updated.

---

## Headline

Every blocker and every refine is acted on. The pack ships a **v4.4 derived-token brief** alongside the eight component specs (the original "zero new tokens" claim was the single most consequential error in the draft — Elena's verification surfaced it; the brief codifies it). Spec 05 (CitationChip) is rewritten from the verified shipped source rather than from memory, with an explicit **Annex A · current-state grep** so future spec authoring has a reference and the next reviewer can verify in seconds.

The dispatch impact landed: **5 specs unblocked for 22 May (01, 04, 06, 07, 08); 3 specs (02, 03, 05) gated on the corrections above**. With this revision shipping EOD 20 May, all 8 should dispatch 22 May as Elena projected.

---

## Blockers

### BLOCKER 1 · "Zero new tokens" claim empirically false

**Elena's finding**: `--shadow-floating`, `--color-skeleton-shimmer`, `--color-finding-resolved-*`, `--color-finding-mandatory-*` referenced across specs 01/02/03/04/07 + index.html but absent from `tokens/{primitive,semantic,component}/*.json` and `dist/tokens.css` in the canonical ui-components source.

**Resolution**:

1. **New file**: [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md) — proposes 4 derived tokens for promotion into `tokens/semantic/`:
   - `--shadow-raised`, `--shadow-floating`, `--shadow-overlay` (3-token elevation stack, values lifted verbatim from `audit-deliverable/styles/tokens-v4.2.1.css` lines 213-215 where they have been de-facto canon for the V2 demo HTMLs)
   - `--color-skeleton-shimmer` (composed from `--color-surface-muted` + `--color-surface-subtle`; zero new primitive colours)
2. **`--color-finding-*` tokens** — out of scope for v4.4. They're only consumed by the spec-pack cover's own pill styling; rewriting against existing `--color-band-very-low-*` / `--color-band-very-high-*` is cleaner than codifying audit-pack-internal tokens into the production source. **`index.html` was updated** to use existing band tokens for the pill styles.
3. **Cover §2.2 rewritten** — original "Zero net-new tokens proposed" replaced with explicit acknowledgement of the demo-vs-source drift, citation of the brief, and per-component token surface table updated to flag v4.4-derived entries.
4. **Component spec token chains updated** — 01, 02, 03, 04, 07 all annotate v4.4-derived tokens in their `§token chain` sections with a pointer to the brief.
5. **Lesson encoded** in `00b-v4.4-token-extension.md §7`: future spec authoring should grep `dist/tokens.css`, not demo CSS; the audit-pack demo CSS should be re-exported from `dist/tokens.css` rather than hand-authored, to eliminate the drift surface that triggered this issue. v4.5+ work.

**Status**: ✓ closed. Brief authored; cover + 5 specs updated; lesson documented.

---

### BLOCKER 2 · Gauge API mismatch (Spec 03)

**Elena's finding**: Spec 03 §3.4 called `<Gauge size="sm" />`. Actual `GaugeSize` enum is `'inline' | 'accessory' | 'summary' | 'headline'` (verified at `src/data-viz/Gauge/types.ts` line 2). No `'sm'` exists.

**Resolution**:

- Spec 03 §3.4 updated to use `size="accessory"` (likely the 32×32 mapping matching the §3.2 cell anatomy diagram).
- Embedded a **pre-build check note** directing Sarah G5 to verify the rendered pixel size against Demo C's `.cs-posture-strip` cell artwork; if `accessory` doesn't render at 32×32, fall back to `inline`. The contract is "match Demo C's geometry", not the named enum value. Documented in the MDX doc-block.
- Elena's secondary observation on `grid-template-columns: repeat(auto-fit, minmax(72px, 1fr))` vs Demo C's fixed `repeat(12, 1fr)`: addressed in Spec 03 §3.1 with a layout note explaining the auto-fit behaviour matches at 12-client width but wraps beyond; recommend `auto-fit` as primary with `repeat(min(N, 12), 1fr)` as a fallback if wrap behaviour proves problematic. Sophie to confirm marketing-case acceptable.

**Status**: ✓ closed. Spec 03 §3.1 and §3.4 updated.

---

### BLOCKER 3 · Spec 05 describes wrong CitationChip API

**Elena's finding**: Multiple inaccuracies in the verification spec — prop is `label: string` not `children: ReactNode`; existing `aria-label` is `variantDescription[variant]` only (no content); the proposed `variantSrDescription` map already exists in production as `variantDescription`; token references use `--color-citation-chip-*` (with `-chip-` infix), not `--color-citation-*`.

**Resolution**: Spec 05 rewritten from scratch against verified shipped source. Changes:

1. **§1 status note** explicitly calls out the three drifts and the rewrite.
2. **§2 verification result** scoped to "all 9 variants present" — the actual original ask. ✓ verified.
3. **§3 gating actions** restructured:
   - Action A · stories — marked as **provisional**; the implementing engineer must grep `CitationChip.stories.tsx` directly before adding (the original audit table was unverified, per Elena's specific call-out).
   - Action B · combined-announcement `aria-label` — re-scoped. The patch is no longer "add `variantSrDescription`" (it exists); it's "edit the aria-label template to combine variant description + label content, and remove the duplicate SR-only suffix span". New announcement table provided (e.g. "Verified source: Art. 35(3)(c)" instead of just "Verified source").
   - **Action C · NEW** · WCAG 2.5.8 interactive target-size — covers Elena's a11y observation that interactive chips at `py-0.5 text-xs` ≈ 22px tall fail the 24×24 minimum. Patch: bump interactive variant to `py-1`; static (in-prose) variant unchanged.
4. **§4 token-tier correction** — documents that the component uses `--color-citation-chip-*` (component-tier), not `--color-citation-*` (semantic-tier). Both exist; the drift is pre-existing and **out of v2.1.0 scope** to consolidate. Names documented for future-spec accuracy.
5. **§6 Annex A · current-state grep** — verbatim citation of Elena's verification (types.ts, index.tsx line-by-line) with file:line references. This is the artefact Elena specifically asked for.
6. **§7 non-actions** — `external` icon, token-tier consolidation, opacity-suffix lint config, ESLint rule for duplicate-string case all listed as out-of-scope with rationale.

**Status**: ✓ closed. Spec 05 fully rewritten. Index.html card description updated to reflect three gating actions instead of two.

---

## Non-blocking REFINEs · all 11 incorporated

| # | Refine | Resolution | Diff lands in |
|---|---|---|---|
| 1.1 | Unknown-category fallback in ImpactGraph layout | `__dev__` throws; prod renders with `--color-text-subtle` + `console.warn`. Documented in MDX. | 01-ImpactGraph.md §7 |
| 1.2 | Edge stroke uses `--color-band-{severity}-bg`; reads as misnamed (bg used as stroke) | Switched to `--color-band-{severity}-border` for edges; `-bg` reserved for centre alert ring **fill**. Token table updated. | 01-ImpactGraph.md §2.2, §2.4, §7 |
| 2.1 | `CaptionsOff` story note vs "captions required" a11y contract | Explicit note added in the story description: the VTT track is still loaded and parseable; only the default-on display flag flips. No contradiction; documented in MDX. | 02-HeroVideo.md §6 |
| 2.2 | Mobile caption sizing (16px mobile / 14px desktop) needs MDX justification | Added the exact MDX sentence Elena asked for, distinguishing in-video VTT cues (dark scrim) from fallback-grid caption panes (teal-50 substrate). | 02-HeroVideo.md §8 Q3 |
| 3.1 | PostureStrip pill text colour-only | Pill text now reads `{count} high` / `{count} med` (band word in text, not colour-only). Colour-blind-safe by construction. | 03-CompliancePostureStrip.md §3.3, §7.4 |
| 3.2 | PostureStrip cell markup needs `role="img"` wrapper | Cell content wrapped in `<div role="img" aria-label="…">`; markup rewritten with the new shape. `<button>` wraps the role=img only when `onClick` is provided. | 03-CompliancePostureStrip.md §7.1 |
| 4.1 | ClientGrid uses raw `--color-palette-emerald-500` for improvement delta; should reach for semantic | Swapped to `--color-band-very-low-bg` (which resolves to palette-emerald-500 but carries the semantic). Token chain and empty-state check glyph both updated. | 04-ClientGrid.md §3.5, §4, §5 |
| 5.1 | After Blocker 3, add `AllVariantsRow_Mobile` story (375px viewport) for flex-wrap regression | Added to the candidate-stories list in §3 with `parameters: { viewport: { defaultViewport: 'mobile1' } }`. Always-add, no grep-skip path. | 05-CitationChip §3 |
| 6.1 | Verify ArcDecoration dasharray values vs Demo B | Re-stated the table with explicit `Dasharray` column + rotation seeds + opacity per ring; noted grep-verification against Demo B lines ~169-176; noted ring-1 dasharray is computed (Demo B doesn't render it explicitly). Recommended pinning all 4 values + 4 rotation seeds as build-time constants in `ArcDecoration/constants.ts`. | 06-ArcDecoration.md §3.1 |
| 7.1 | Header polish: add `KeyboardWalkthroughReducedMotion` story | Added to the story list (now 11 stories total); rationale: catches regressions in reduced-motion handling specifically under keyboard nav that manual a11y walkthroughs surface late. | 07-Header-polish.md §6 |
| WCAG 2.5.8 (cross-cutting a11y refine) | CitationChip interactive variant ~22px tall — fails 24×24 minimum | New gating Action C in Spec 05: bump `py-0.5` to `py-1` for interactive variant only. Sarah G5 measures rendered height as part of the a11y regression sweep. | 05-CitationChip §3 Action C |

---

## Visual-fidelity + a11y-posture check observations

Elena's per-card visual-fidelity check returned **PASS on all 8 cards** — the mini-SVG renders in `index.html` are accurate to Demo source. Her WCAG 2.2 AA cross-cutting posture check returned **PASS with one REFINE** (WCAG 2.5.8 on CitationChip, addressed as new Action C). Storybook coverage assessment returned **PASS** across all 8 components.

No spec edits required from these checks beyond the WCAG 2.5.8 patch.

---

## Sequencing impact

Elena's recommended sequencing (21 May = spec-correction day; 22 May = clean implementation start) is **adopted**:

- **2026-05-20 (today)**: Claude Design ships this revision + the v4.4 token brief.
- **2026-05-21 AM**: Orchestrator dispatches v4.4 token PR (small — JSON entries + build); engineer picks up; tokens lint + build pass.
- **2026-05-21 PM**: Elena G4 re-pass on the corrected spec pack against `git diff` of this revision.
- **2026-05-22**: All 8 component specs dispatch in parallel.

If timing tightens: per Elena's note, specs **01, 04, 06, 07, 08** can dispatch 22 May **independently** of the v4.4 token PR (their PRs can land with inline-fallback values and migrate to `var(--shadow-*)` once tokens are in main; small risk). Specs **02, 03, 05** hold until v4.4 tokens are in main. This is the orchestrator's call.

The 5 June v2.1.0 publish date + 6-10 June marketing-migration window remain on track. No slip.

---

## What went well from the original draft

Per Elena's review, the **a11y companion docs** (01, 02, 07) were called out as "best a11y artefacts in any spec pack to date" — they document WCAG-equivalent contracts (disclosure-not-menu in 07; structured-summary in 01; captions-required in 02) at a level Sarah G5 can test against directly. **Visual fidelity** of the SVG mini-renders on the cover was rated **excellent** — load-bearing for at-a-glance review. **Cross-cutting decisions** (new namespaces, presentational-vs-client boundary, separate-vs-inline a11y matrix) all returned PASS.

These are preserved in this revision. The corrections are surgical; they do not displace what worked.

---

## What we learn from this review for next time

1. **Token-existence verification belongs in the spec-authoring loop**, not in G4 review. Every `var(--*)` reference in a spec should be checked against `dist/tokens.css` at the cutoff SHA. If a token doesn't exist, either the spec changes or a token brief lands alongside the spec — never both unwritten.
2. **Component-source verification likewise**. Every TypeScript signature, every existing aria-label, every shipped lookup table claimed in a spec should be grep-citation-backed at a specific SHA. Annex-A-style appendices become standard.
3. **Demo CSS is not source-of-truth**. The `audit-deliverable/styles/tokens-v4.x.css` files have been drifting from `dist/tokens.css` for several spec cycles. v4.5+ should re-export from `dist/tokens.css` rather than hand-author, eliminating the drift surface.

These are encoded in `00b-v4.4-token-extension.md §7` and in this response; the orchestrator + G4 alignment on (3) is a separate workstream.

---

**End of G4 response.** Pack ready for Elena's re-pass.
