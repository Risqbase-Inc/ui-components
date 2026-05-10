# U3.2 — Canonical glossary scope

**Owner:** Sophie Brennan (G8) | **Reviewer:** Elena Vasquez (G4)
**Audit row:** U3.2 (`audit.md` line 85) — "~80 canonical glossary entries"
**Spec anchor:** `spec.md` §10.6 (rules, structure, location)
**Sprint:** S4 per `implementation-plan.md` line 48 — confirmed.
**Date:** 2026-05-10
**Status:** Scope only. The term list is NOT in this file.

---

## Categories and per-category counts (target ~80)

| # | Category | ~Count | Source of authority |
|---|---|---:|---|
| 1 | **Risk-domain terms** (assessment, risk, mitigated, residual, inherent, severity, likelihood, control, finding, gap, remediation, owner, tier) | ~20 | RALIA assessment-outcome recipes + Dr. Amara (G3 Compliance) |
| 2 | **Compliance / regulatory terms** (DPIA, LIA, FRIA, vendor-review, lawful-basis, processor, controller, data-subject, breach, regulator) | ~15 | UK GDPR + EU AI Act + Dr. Amara |
| 3 | **Chart anatomy nouns** (plot-area, axis, gridline, legend, tooltip, mark, scale, annotation, rule-mark, series, category, value-encoding, null-marker) | ~13 | `spec.md` §7.0 (already enumerated; lift verbatim) |
| 4 | **AI / IRIS terms** (citation, hedge, refusal, clarification, completion, streaming, prompt, confidence, low-confidence, ground-truth) | ~10 | `spec.md` §10.8 (AI content rules) + IRIS UI audit |
| 5 | **Component anatomy nouns** (slot, role, variant, state, tier, density, surface) | ~7 | `spec.md` §7.0 + §22.2 + Elena |
| 6 | **Accessibility terms** (assistive technology, reduced-motion, forced-colors, screen-reader, focus-visible, AA contrast, AAA contrast) | ~8 | `spec.md` §6.x + WCAG 2.2 |
| 7 | **Product-surface terms** (RALIA, RisqBase, Cortex, Knowledge Bank, Operations, Dashboard, HorizonIris) | ~7 | RALIA branding rules + product team |

**Estimated total:** ~80. Numbers are budgets, not commitments — final list lands in S4.

---

## Entry format (per `spec.md` §10.6 rules)

Each entry is a JSON object in `content/glossary.json` with these fields:
`term` (canonical form, lowercase unless proper noun) · `definition` (one-line plain English, ≤25 words, Flesch ≥60) · `category` (one of the seven above) · `forbidden_synonyms` (array; per §10.6) · `acronym_expansion` (full form, null if not an acronym) · `scope` (array: `ralia` | `risqbase` | `cortex` | `all`) · `examples` (2-3 short product-copy sentences). No anatomy diagrams in entries — those live with §7.0 nouns.

---

## Delivery timeline

- **S4 (weeks 7-8 per `implementation-plan.md` line 48):** I author ~80 entries in `content/glossary.json` + `design.risqbase.com/glossary` view.
- **Reviewers:** Elena (G4 fit), Dr. Amara (G3 — categories 1, 2), Alex (G1 schema CI lint per audit U3.7).
- **Acceptance:** categories populated to budget ±2; CI lint passes; no contradictions with §10.4, §10.8, or RALIA branding.

---

## Out of scope for S4

Translations (§10.9 covers; v4.3+) · alias networks beyond §10.6 forbidden-synonyms · per-regulator term mappings (ICO vs CNIL → v4.3 flag).

The actual ~80 entries land in S4. This file is the contract for that work.
