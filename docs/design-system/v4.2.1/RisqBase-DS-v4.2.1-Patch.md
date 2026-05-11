# RisqBase Design System v4.2.1 — Patch Plan

**Document ID:** GOV-DS-2026-02-PATCH-4.2.1
**Patches:** GOV-DS-2026-02 v4.2 → v4.2.1
**Date:** 10 May 2026
**Prepared by:** G4 (Design / Principal Designer)
**Approved by:** Pending — CEO
**Type:** Non-breaking patch revision (documentation-only; spec amendments)
**Package version:** no `@risqbase-inc/ui-components` version bump (docs-only patch)

---

## Summary

The v4.2 audit flagged **seven** spec-side gaps for a patch release. A post-audit sweep against the original plan surfaced **three** more — substrate gaps where the spec shipped meaningfully less than the plan promised — plus **four** governance-hygiene items where plan→spec drift was undocumented. v4.2.1 closes all fourteen.

This is a documentation-only patch. The 22 implementation `[~]` rows from the v4.2 audit remain on the engineering programme and are out of scope.

| Bucket | Items | Why this bucket |
|--------|:---:|-----------------|
| **P0 — Substrate** | 3 (T1–T3) | Tokens, charts taxonomy, glossary content. Each shipped at 15–35% of plan depth. Must close before downstream work (marketing redesign, new product surfaces) sets ad-hoc precedent the system has to retrofit. |
| **P1 — Audit-flagged** | 7 (A1–A7) | The spec-side gaps the v4.2 audit identified explicitly. Self-reported; cheap to close. |
| **P2 — Governance hygiene** | 4 (G1–G4) | Plan→spec drift that wasn't tracked. Each is a one-line fix that also prevents the next round of drift. |

**Acceptance for v4.2.1.** Every row in the tracker below ticks `[x]`. Spec-text changes land as in-place edits to `docs/design-system/v4.2/spec.md` in subsequent PRs against this plan; v4.2.1 itself does not re-publish the spec. When all rows close, this document is renamed `v4.2.1-COMPLETE.md` and the v4.2 audit's "What needs honest attention before v4.2.1" section is updated to reference this artefact.

---

## P0 — Substrate gaps

### T1 — §15.6 token coverage: ~30 → ~200 net-new role tokens

**Gap.** Plan U6.2 specified ~200 net-new role tokens covering chart palettes, gauge roles, citation-chip roles, density, telemetry-config. v4.2 §15.6 lists ~30. Token coverage is the substrate the whole visual system inherits from; downstream visual work will set ad-hoc precedent until this closes.

**Resolution.** Expand §15.6 with the full enumeration:

- Chart categorical palette: `--chart-categorical-1..8` (8)
- Chart sequential single-hue (teal): `--chart-sequential-50..900` (10)
- Chart sequential per-domain ramps (risk, financial, operational): 10 × 3 = 30
- Chart diverging (warm/cool): 9 stops × 2 ramps = 18
- Gauge role tokens: `--color-gauge-{track,arc,terminus,band-label}` × {default, success, warning, danger} (16)
- Citation chip role tokens: `--color-citation-{surface,border,text,icon,hover,active}` (6)
- Density tokens: `--density-{compact,default,comfortable}-{padding-x,padding-y,gap}` (9)
- Telemetry-config role tokens: collector-state, opt-out-marker, sampled-marker, event-class (~10)
- Status / risk-band semantic tokens harmonised across charts and gauges: `--color-band-{very-low,low,medium,high,very-high}` × {bg, border, text, icon} (20)
- Surface-density tokens for chart containers: plot, axis, gridline, annotation, legend-bg, tooltip-bg, tooltip-text × {light, print} (~14)
- Reserved expansion budget for v4.3 dark/HC themes (the override files): named placeholders only (~40)

**Acceptance.** §15.6 enumerates ≥ 180 net-new tokens, each with `$value`, `$type`, `$description`, `$extensions.com.risqbase.role`. `npm run lint:tokens` (when shipped) passes.

**Owner.** G1.

### T2 — §8.1.1 chart taxonomy: 7 → 20+ types

**Gap.** Plan U1.2 promised ~20 chart types organised by purpose. v4.2 §8.1.1 ships seven (line / bar / area / sparkline / heatmap / choropleth / metric-card). At one-third the promised depth, the taxonomy is too thin to drive chart-choice decisions; teams will reach for ad-hoc Tableau/Datawrapper choices.

**Resolution.** Expand §8.1.1 to the full taxonomy organised by purpose:

- **Comparison:** bar (vertical), bar (horizontal), grouped bar, lollipop, dot plot
- **Distribution:** histogram, box plot, violin, density curve
- **Composition:** stacked bar, stacked area, treemap, sunburst, waffle
- **Relationship:** scatter, bubble, paired-bar
- **Time:** line, area, sparkline, candlestick *(deferred to v5)*
- **Geographic:** choropleth, symbol map, flow map *(flow deferred to v5)*
- **Part-to-whole:** donut (with prohibition rules), waffle, stacked-bar-100%
- **Single-value:** metric-card, gauge, sparkbar
- **Flow:** Sankey *(deferred to v5)*, funnel

Each type carries: one-line `use when`, one-line `do not use when`, anatomy noun set (from §7.0 + §8.2), a link to its accessibility row in §8.6, and a citation to the relevant decision-rule row in §8.1.2. Deferrals are explicit, not silent.

**Acceptance.** §8.1.1 lists ≥ 20 chart types with the structure above. §8.1.2 decision matrix has a row per data-shape pointing to a canonical type.

**Owner.** G4.

### T3 — §10.6 canonical glossary: structure → content

**Gap.** Plan U3.2 promised ~80 canonical terms with prohibited synonyms and scope. v4.2 §10.6 has the structural spec but the term body is not enumerated. For a compliance product the glossary *is* the design system: the difference between "we have voice & tone" and "every word in our product is the same word everywhere."

**Resolution.** Author the canonical entries. Minimum coverage:

- **Risk vocabulary (~25):** assessment, risk, mitigated, residual, inherent, control, finding, gap, exposure, treatment, accept/avoid/transfer/mitigate, likelihood, impact, severity, etc.
- **Compliance vocabulary (~20):** regulator, audit, attestation, evidence, owner, accountable, reviewer, sign-off, escalation, breach, incident, etc.
- **AI vocabulary (~15):** citation, source, hedge, confidence, retrieval, generation, refusal, clarification, etc.
- **Product nouns (~10):** assessment, dashboard, panel, drawer, modal, toast, etc.
- **User-class vocabulary (~10):** owner, reviewer, observer, admin, etc.

Each entry: canonical form, definition (≤ 25 words), prohibited synonyms (named explicitly), scope (which surfaces it applies to), first-use convention (defined-on-first-use threshold).

**Acceptance.** §10.6 contains ≥ 80 entries. CI lint script `lint:glossary` (queued in §15.8) flags any product-surface copy using a prohibited synonym.

**Owner.** G8 (drafting), G4 (review).

---

## P1 — Audit-flagged

### A1 — U1.8 Print variants per chart type
**Gap.** v4.2 §15.2.1 names the print theme file but §8 does not specify per-chart-type print variants.
**Resolution.** Add §8.13 "Print variants": monochrome rule per chart type; B&W-safe pattern fills (cross-hatch / dot / diagonal at 4 densities); print legend convention; page-break behaviour; footnote rule for omitted interactive states.
**Acceptance.** §8.13 covers every chart type in the T2 taxonomy. `tokens/themes/print.json` carries matching tokens.
**Owner.** G4 + Frontend.

### A2 — U1.9 Library + version pin
**Gap.** §8.7 implies Visx / Recharts / Observable Plot without picking. "Library decision" is the rest of the chapter's predicate.
**Resolution.** §8.7 names: `Library: visx@3.x` (or final selection). One-paragraph rationale. List of Visx-wrapped components, list of direct-Visx components, list of custom (D3-only) components.
**Acceptance.** §8.7 names exactly one library with version range. §22.4 dependency list aligns.
**Owner.** G1 + G4.

### A3 — U1.13 Composite chart-pattern recipe bodies
**Gap.** §8.12 has index entries; recipe bodies (per §20.0 schema) live "elsewhere".
**Resolution.** Inline three recipes in §8.12: `dashboard-chart-row`, `time-comparison-chart`, `distribution-drilldown`. Each with trigger, data shape, composed_of, layout, states, voice_examples, anti-patterns. Per §20.0.
**Acceptance.** §8.12 has three full recipe bodies, not links.
**Owner.** G4.

### A4 — U2.9 Promotion log entries in §23 ✓
**Gap.** v4.2 promotions happened but §23 had no log entries.
**Resolution.** Added §23.7 "Promotion log" (section ID corrected from §23.5 — that's "The discipline"; §23.6 is "Override-frequency as design signal"; §23.7 is the next free slot). Log records **five v4.2 promotions, not four as the patch plan originally said** — the spec's F2 row (line 20) lists Gauge + Citation Chip + StreamingText + PromptChip + LongOperation. Each entry carries: component, source, target domain, version, triggered-by, justification. Closing paragraph documents the future-promotion protocol (in-PR log-row authorship, quarterly adoption-review check, major-version end-to-end audit).
**Status.** Resolved.
**Owner.** G4.

### A5 — U3.4 §10.4 Number formatting expansion
**Gap.** §10.4 retains v4.1 conventions; the plan's expansion to relative time / percent precision / currency / abbreviations did not visibly land.
**Resolution.** Expand §10.4 with one table per data type: time (absolute, relative, duration, range); percent (precision by context); currency (symbol placement, decimals, abbreviation thresholds); counts (compact / default / comfortable). Per-context modifier column.
**Acceptance.** §10.4 has ≥ 4 typed tables; verification rows referenced in §17.
**Owner.** G8.

### A6 — U3.7 Recipe schema → §10 cross-reference + lint
**Gap.** Recipe schema `voice_examples` field exists but does not require referencing §10.5/§10.8 templates; without enforcement §10 is decorative.
**Resolution.** §20.0 schema docs require `voice_examples[].template_id` referencing a §10.5 or §10.8 template. CI lint script `lint:recipes-voice` named in §15.8 (implementation deferred to engineering programme).
**Acceptance.** §20.0 spec updated; lint script named; verification row in §17.
**Owner.** G4.

### A7 — U5.2 Figma `$extensions` key reconciliation
**Gap.** Plan named `$extensions.com.risqbase.figma`; v4.2 §15.1 example only shows `role` and `contrastPair` extensions. Whole F5 sync programme is built on this key.
**Resolution.** §15.1 example expanded to include `$extensions.com.risqbase.figma: { collection, mode, scopes[] }`. §15.8.4 references the same key. CI lint enforces presence on any token tagged for Figma export.
**Acceptance.** §15.1 example carries the figma key; §15.8 references match; verification row in §17.
**Owner.** G1.

---

## P2 — Governance hygiene

### G1 — Sonification status note
**Gap.** Plan U1.7 mentioned "sonification optional"; spec §8.6 is silent.
**Resolution.** §8.6 gains a one-line note: sonification deferred (target version), components must not block instrumentation hooks for it.
**Owner.** G4.

### G2 — `marketing/` → `content/` rename note
**Gap.** Plan U2.8 listed five domains including `marketing/`; spec §22.2 lists `content/` instead. The semantic shift (component primitives vs content-design tooling) is real and undocumented in §16 migration.
**Resolution.** §16.2 migration table gains a row noting the rename, the scope shift, and the rationale.
**Owner.** G4.

### G3 — §17 checklist row-count drift (53–60 → 53–80)
**Gap.** Plan said "rows 53–60"; spec ships 53–80 (28 new rows). Net positive but undocumented.
**Resolution.** §17 prefatory note acknowledges the row-count expansion and the rationale. Establishes a convention for tracking future drift.
**Owner.** G4.

### G4 — Doc-site status line
**Gap.** Spec references `design.risqbase.com/changelog/v4.2`. The site does not exist. F4 telemetry/adoption story is hard to land without it.
**Resolution.** §18 notes doc-site status (not yet live), target date, and which other rows depend on it. F4 audit rows in `audit.md` cross-reference this dependency.
**Owner.** G4 + G1.

---

## Audit tracker

| Status | ID | Item | Bucket | Owner |
|:---:|----|------|:---:|------|
| `[ ]` | T1 | §15.6 → ~200 net-new role tokens | P0 | G1 |
| `[ ]` | T2 | §8.1.1 → 20+ chart types | P0 | G4 |
| `[ ]` | T3 | §10.6 → 80+ glossary entries | P0 | G8 + G4 |
| `[ ]` | A1 | §8.13 print variants per chart type | P1 | G4 + Frontend |
| `[ ]` | A2 | §8.7 library + version pin | P1 | G1 + G4 |
| `[ ]` | A3 | §8.12 three composite recipe bodies | P1 | G4 |
| `[x]` | A4 | §23.7 promotion log (5 rows; corrected from §23.5/4-row count) | P1 | G4 |
| `[ ]` | A5 | §10.4 number-formatting expansion | P1 | G8 |
| `[ ]` | A6 | §20.0 voice-examples cross-reference + lint | P1 | G4 |
| `[ ]` | A7 | §15.1 figma `$extensions` key | P1 | G1 |
| `[ ]` | G1 | §8.6 sonification status note | P2 | G4 |
| `[ ]` | G2 | §16.2 `marketing/` → `content/` rename note | P2 | G4 |
| `[ ]` | G3 | §17 checklist row-count drift note | P2 | G4 |
| `[ ]` | G4 | §18 doc-site status line | P2 | G4 + G1 |

**Targeted timeline.** 2 weeks. P0 substrate work (T1–T3) is the long pole; P1 and P2 items are day-each tasks that can run in parallel.

---

**END OF GOV-DS-2026-02-PATCH-4.2.1**
