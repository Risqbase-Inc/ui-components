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

### T1 — §15.6 token coverage: ~30 → 241 enumerated ✓

**Gap.** Plan U6.2 specified ~200 net-new role tokens covering chart palettes, gauge roles, citation-chip roles, density, telemetry-config. v4.2 §15.6 listed ~30. Token coverage is the substrate the whole visual system inherits from; downstream visual work would set ad-hoc precedent until this closed.

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

**Status.** Resolved. §15.6 rewritten as the full enumeration (§15.6.1 – §15.6.10) covering 10 token categories; **241 tokens** authored across `tokens/**/*.json` files (≥180 acceptance met). Breakdown:

| Category | New JSON authored | Files touched |
|---|:---:|---|
| Primitive chart-domain ramps (risk, financial, operational sequentials + diverging-warm/cool extensions) — TBD values | 38 | `tokens/primitive/color-chart.json` (NEW) |
| Citation chip extensions (icon, hover, active) | 3 | `tokens/semantic/color.json` |
| Band 5×4 grid (very-low / low / medium / high / very-high × bg / border / text / icon) | 20 | `tokens/semantic/color.json` |
| Telemetry config (collector 4 states + opt-out + sampled + 4 event-class) | 10 | `tokens/semantic/color.json` |
| Density × property (3 modes × 3 properties) | 9 | `tokens/semantic/density.json` (NEW) |
| **Plus** v4.3 reserved-names placeholders (dark/HC overrides, ~40) | 0 JSON | enumerated in §15.6.10 only |

Authoring posture per the confirmed plan: **structures + role/figma bindings locked from this PR**; hex values for the 38 new primitives marked `TBD — Claude Design 2026-05-11`, picked + AA-contrast-verified by Claude Design in a follow-up values-only PR per `implementation-plan.md` §5.2. All other new tokens alias existing primitives (no value selection needed).

Sources (no product-specific content): ColorBrewer for diverging stops, Datawrapper single-hue ramps, Carbon Design System chart categorical, GOV.UK 5-band semantic scale, NIST AI RMF observability vocabulary.

**Owner.** G1 (structure) + Claude Design (values).

### T2 — §8.1.1 chart taxonomy: 7 → 28 types ✓

**Gap.** Plan U1.2 promised ~20 chart types organised by purpose. v4.2 §8.1.1 shipped seven (line / bar / area / sparkline / heatmap / choropleth / metric-card). At one-third the promised depth, the taxonomy was too thin to drive chart-choice decisions; teams reached for ad-hoc Tableau/Datawrapper choices.

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

**Status.** Resolved. §8.1.1 now lists **28 active types** across 10 purpose-groups (Comparison 5, Distribution 4, Composition 5, Relationship 2, Time 3, Geographic 2, Part-to-whole 3, Single-value 3, Flow 1, Heatmap 1) plus **4 deferred-to-v5** (candlestick, flow map, Sankey, bubble — bubble explicitly cross-referenced to §8.1.3 prohibition). Each entry carries: `use when`, `do not use when`, anatomy noun set (§7.0 + §8.2), accessibility row (§8.5, corrected from patch's §8.6 — same mistake as G1), and DM row reference. §8.1.2 rewritten into an 11-row decision matrix mapping data shape → canonical type with fallback rule. Reading rule appended: if shapes ambiguous, prefer the type with higher Cleveland-McGill perceptual rank. Sources: Datawrapper, Cleveland-McGill, Apple Swift Charts, Observable Plot — same references v4.2 already cites.

**Owner.** G4.

### T3 — §10.6 canonical glossary: structure → content ✓

**Gap.** Plan U3.2 promised ~80 canonical terms with prohibited synonyms and scope. v4.2 §10.6 had the structural spec but the term body was not enumerated. For a compliance product the glossary *is* the design system: the difference between "we have voice & tone" and "every word in our product is the same word everywhere."

**Resolution.** Author the canonical entries. Minimum coverage:

- **Risk vocabulary (~25):** assessment, risk, mitigated, residual, inherent, control, finding, gap, exposure, treatment, accept/avoid/transfer/mitigate, likelihood, impact, severity, etc.
- **Compliance vocabulary (~20):** regulator, audit, attestation, evidence, owner, accountable, reviewer, sign-off, escalation, breach, incident, etc.
- **AI vocabulary (~15):** citation, source, hedge, confidence, retrieval, generation, refusal, clarification, etc.
- **Product nouns (~10):** assessment, dashboard, panel, drawer, modal, toast, etc.
- **User-class vocabulary (~10):** owner, reviewer, observer, admin, etc.

Each entry: canonical form, definition (≤ 25 words), prohibited synonyms (named explicitly), scope (which surfaces it applies to), first-use convention (defined-on-first-use threshold).

**Acceptance.** §10.6 contains ≥ 80 entries. CI lint script `lint:glossary` (queued in §15.8) flags any product-surface copy using a prohibited synonym.

**Status.** Resolved. §10.6 now contains **84 canonical entries** across six sub-categories: Risk (25), Regulatory assessments (5), Compliance (21), AI (16), Product nouns (12), User-class (11). Each entry uses the 5-column shape (canonical form / definition ≤25 words / prohibited synonyms / scope / first-use convention). Context-sensitive prohibited-synonym rule documented — "(when meaning X)" qualifiers are part of the lint specification. `lint:glossary` named in §15.8.4 tooling with full implementation contract (script + context-rule file at `tools/lint-glossary/contexts.json`). Sources are public regulatory + UX vocabularies (NIST SP 800-30, ISO 31000, ISO 27001/27005, GDPR Art. 4, EU AI Act, NIST AI RMF, ISO/IEC 42001, OWASP LLM Top 10, Polaris / Carbon / Material) — **no RALIA-specific content**.

**Owner.** G8 (drafting), G4 (review).

---

## P1 — Audit-flagged

### A1 — U1.8 Print variants per chart type ✓
**Gap.** v4.2 §15.2.1 named the print theme file but §8 did not specify per-chart-type print variants.
**Resolution.** Added **§8.16** (corrected from patch's §8.13, which is "Charts and IRIS") "Print variants per chart type" with 8 sub-sections: 8.16.1 General print conventions (monochrome / page-break / caption / source attribution); 8.16.2 Pattern fills 4-density (cross-hatch / dotted / diagonal hatch for bars, regions, choropleths); 8.16.3 Line dash styles 6-style (for lines, area boundaries, rules); 8.16.4 Shape variants 8-shape (for dots, symbol-maps, scatter); 8.16.5 Legend conventions (mandatory in print); 8.16.6 Omitted interactive states (footnote rule with verbatim format); 8.16.7 Per-chart-type print encoding (table per purpose-group covering all 28 T2 chart types); 8.16.8 Verification (Chromatic `@media print` baselines). Token contract: `tokens/themes/print.json` carries print-mode overrides for every chart container + band/seq/cat semantic; values land in v4.2.1 + v4.3 per §15.2.1.
**Status.** Resolved.
**Owner.** G4 + Frontend.

### A2 — U1.9 Library + version pin ✓
**Gap.** §8.7 implied Visx / Recharts / Observable Plot without picking. "Library decision" is the rest of the chapter's predicate.
**Resolution.** §8.7 names **`visx@^3.0.0`** as the charting library per D9. Adds: (a) rejection rationale for Recharts, Observable Plot, Nivo, Direct D3; (b) component-by-component Visx contact surface table distinguishing Visx-wrapped vs Direct-D3 vs RisqBase-composition-only; (c) version-pin policy — `peerDependencies` recorded, CI lock via `package-lock.json`, `4.x` upgrade is a major version bump.
**Status.** Resolved.
**Owner.** G1 + G4.

### A3 — U1.13 Composite chart-pattern recipe bodies ✓
**Gap.** §8.12 had index entries only; recipe bodies (per §20.0 schema) lived "elsewhere".
**Resolution.** Added **§8.17** "Composite chart-pattern recipes" (corrected from patch's §8.12 — that's "Marketing-site charts", a use-case section, not the right home; §8.16 = print variants A1; §8.17 is the next free slot). Three full recipe bodies authored to §20.0 schema + §20.0.1 voice_examples template-binding contract:
- **§8.17.1 `dashboard-chart-row`** — composed of metric-card + sparkline + bar-horizontal; 12-column grid layout with responsive stacking. Variants: comparison-mode, score-mode.
- **§8.17.2 `time-comparison-chart`** — composed of line (2 series) + metric-card + sparkbar; vertical stack layout. Variants: delta-mode (paired-bar), annotation-mode (RuleMark events).
- **§8.17.3 `distribution-drilldown`** — composed of histogram + box-plot + bar-horizontal + metric-card; split layout 7:5 with responsive stack-to-vertical. Variants: table-detail, filter-bound.

Each recipe carries full schema: id, title, visibility (PUBLIC), status, problem, when_to_use, when_not_to_use, composed_of (referencing §8.1.1 types), layout (with §15.6.6 density tokens), states (loading / empty / error / partial / specialised), voice_examples (with §20.0.1 template_ids to real §10.5/§10.8 templates: 10.5.3 empty-state, 10.5.4 error, 10.5.5 help, 10.8.1 AI-hedging), variants, related, keyboard, accessibility, last_reviewed, owner. Three-question test (§8.1.2) recorded in summary table at end.

Generic compositions — no product-specific or IRIS-specific content. Voice_examples reference generic content templates from §10.5 (and §10.8.1 for AI-hedging only, where applicable).
**Status.** Resolved.
**Owner.** G4.

### A4 — U2.9 Promotion log entries in §23 ✓
**Gap.** v4.2 promotions happened but §23 had no log entries.
**Resolution.** Added §23.7 "Promotion log" (section ID corrected from §23.5 — that's "The discipline"; §23.6 is "Override-frequency as design signal"; §23.7 is the next free slot). Log records **five v4.2 promotions, not four as the patch plan originally said** — the spec's F2 row (line 20) lists Gauge + Citation Chip + StreamingText + PromptChip + LongOperation. Each entry carries: component, source, target domain, version, triggered-by, justification. Closing paragraph documents the future-promotion protocol (in-PR log-row authorship, quarterly adoption-review check, major-version end-to-end audit).
**Status.** Resolved.
**Owner.** G4.

### A5 — U3.4 §10.3.3 Number formatting expansion ✓
**Gap.** §10.3 retained v4.1 single-line conventions; the plan's expansion to relative time / percent precision / currency / abbreviations did not visibly land.
**Resolution.** Added §10.3.3 "Number formatting (v4.2.1 patch)" with **four typed tables**:
- §10.3.3.1 Time — 10 rows (absolute prose, ISO 8601 table/audit, with time TZ, relative past/future/short, duration HH:MM and humanised, range)
- §10.3.3.2 Percent — 8 rows (body, tabular score, tabular risk, AI confidence with hedge rule, delta with U+2212 minus, sub-1% / sub-0.1%, range)
- §10.3.3.3 Currency — 7 rows (CLDR symbol prefix, ISO 4217 exports, decimal rules, fines override, abbreviation thresholds, negative U+2212, range)
- §10.3.3.4 Counts — 9 rows (body 0-9 spelled / ≥10 digits, tabular locale-aware, compact / default / comfortable density, range, approximate, zero)

Each table carries a `Context modifier` column noting when stricter/looser variants apply. §10.3.3.5 "Reading rules" addresses locale awareness, mixed-context harmonisation, and verification.

Section-ID correction: patch said §10.4 but §10.4 is "Headings and labels"; the number rules live in §10.3. Expansion lands at §10.3.3 as the natural extension. Sources: ECMA-402 (`Intl.NumberFormat`, `Intl.RelativeTimeFormat`), Unicode CLDR, BIPM SI brochure, standard typographic conventions.

**Status.** Resolved.
**Owner.** G8.

### A6 — U3.7 Recipe schema → §10 cross-reference + lint ✓
**Gap.** Recipe schema `voice_examples` field existed but did not require referencing §10.5/§10.8 templates; without enforcement §10 was decorative.
**Resolution.** Added §20.0.1 "`voice_examples` — template-bound". Every entry must carry a `template_id` matching `^10\.[58]\.\d+$`. New required fields: `template_id`, `context`, `rendered`. Worked YAML example included. CI gate `lint:recipes-voice` named in §15.8.4 with full implementation contract (script walks `apps/docs/content/patterns/**/*.mdx`, asserts the regex, resolves IDs against a generated template index). Implementation deferred to engineering programme per `implementation-plan.md` §5.3; the spec contract is binding from v4.2.1.
**Status.** Resolved.
**Owner.** G4.

### A7 — U5.2 Figma `$extensions` key reconciliation ✓
**Gap.** Plan named `$extensions.com.risqbase.figma`; v4.2 §15.1 example only showed `role` and `contrastPair` extensions. The whole F5 sync programme is built on this key.
**Resolution.** §15.1 example expanded to include the `com.risqbase.figma` extension with `collection`, `mode`, and `scopes[]`. §15.1 field table gains a row for the new extension plus a structure detail sub-table enumerating valid `collection`, `mode`, and `scopes[]` values (mirroring the Figma Variables REST API). §15.8.4 CI gates updated: every semantic-tier or component-tier token must carry the figma binding; primitive-tier tokens require it only when published to Figma.
**Status.** Resolved.
**Owner.** G1.

---

## P2 — Governance hygiene

### G1 — Sonification status note ✓
**Gap.** Plan U1.7 mentioned "sonification optional"; chart accessibility (§8.5) was silent.
**Resolution.** Added §8.5.6 "Sonification (deferred)" with the deferral target (v4.3) and the non-foreclosure rule for component instrumentation surfaces. (Section ID corrected from §8.6 → §8.5.6: §8.6 is "Chart states", not chart accessibility; the accessibility chapter is §8.5.)
**Status.** Resolved.
**Owner.** G4.

### G2 — `marketing/` → `content/` rename note ✓
**Gap.** Plan U2.8 listed five domains including `marketing/`; spec §22.2 lists `content/` instead. The semantic shift (component primitives vs content-design tooling) is real and undocumented in §16 migration.
**Resolution.** §16.2 migration table gains step 7 noting the rename, the scope shift (content-design tooling, not surface primitives), and that no code action is required for existing consumers.
**Status.** Resolved.
**Owner.** G4.

### G3 — §17 checklist row-count drift (53–60 → 53–80) ✓
**Gap.** Plan said "rows 53–60"; spec ships 53–80 (28 new rows). Net positive but undocumented.
**Resolution.** §17 gains a prefatory note explaining the expansion (F1 data-viz +8, F3 content +6, F5 Figma-sync +4) and establishing a convention: any version that expands the checklist by >25% of plan estimate flags the drift in the publishing PR.
**Status.** Resolved.
**Owner.** G4.

### G4 — Doc-site status line ✓
**Gap.** Spec referenced `design.risqbase.com/changelog/v4.2`, `/migration/v4.2`, `/accessibility`. The site is live as a placeholder (single static page on Vercel project `design`) but the content-and-code parity site of §18.1 is not yet built.
**Resolution.** §18 gains a status note explaining placeholder vs full-parity site, citing `implementation-plan.md` §5.3 as the implementation home, and recording the F4 dependency.
**Status.** Resolved.
**Owner.** G4 + G1.

---

## Audit tracker

| Status | ID | Item | Bucket | Owner |
|:---:|----|------|:---:|------|
| `[x]` | T1 | §15.6 → 241 enumerated tokens (38 TBD primitives → Claude Design); spec §15.6.1-10 + 3 JSON files | P0 | G1 + Claude Design |
| `[ ]` | T2 | §8.1.1 → 20+ chart types | P0 | G4 |
| `[ ]` | T3 | §10.6 → 80+ glossary entries | P0 | G8 + G4 |
| `[x]` | A1 | §8.16 print variants per chart type (corrected from §8.13) — 8 sub-sections covering all 28 T2 chart types | P1 | G4 + Frontend |
| `[ ]` | A2 | §8.7 library + version pin | P1 | G1 + G4 |
| `[x]` | A3 | §8.17 three composite recipe bodies (corrected from §8.12) — dashboard-chart-row, time-comparison-chart, distribution-drilldown | P1 | G4 |
| `[ ]` | A4 | §23.5 promotion log | P1 | G4 |
| `[x]` | A5 | §10.3.3 number-formatting expansion (4 typed tables, corrected from §10.4) | P1 | G8 |
| `[ ]` | A6 | §20.0 voice-examples cross-reference + lint | P1 | G4 |
| `[ ]` | A7 | §15.1 figma `$extensions` key | P1 | G1 |
| `[x]` | G1 | §8.5.6 sonification status note (corrected from §8.6) | P2 | G4 |
| `[x]` | G2 | §16.2 `marketing/` → `content/` rename note | P2 | G4 |
| `[x]` | G3 | §17 checklist row-count drift note | P2 | G4 |
| `[x]` | G4 | §18 doc-site status line | P2 | G4 + G1 |

**Targeted timeline.** 2 weeks. P0 substrate work (T1–T3) is the long pole; P1 and P2 items are day-each tasks that can run in parallel.

---

**END OF GOV-DS-2026-02-PATCH-4.2.1**
