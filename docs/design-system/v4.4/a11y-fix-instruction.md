# A11y remediation instruction — Chromatic build 6a1c1e6f

**Document ID:** GOV-DS-2026-02 rev. v4.4 · A11Y-FIX
**Date:** 10 June 2026
**Authorised by:** Fiyin Adeleke (CEO), via design
**Applies to:** `Risqbase-Inc/ui-components` PR #84 branch (`claude/keen-lovelace-spcnqa`)
**Amends:** ledger rows A5.6 · B5.3 · F.4 · DoD-3c (their close condition changes — see D-120)
**Companion file:** `a11y-triage-chromatic-6a1c1e6f.html` (the triage — clusters C1–C6, fix specs, computed numbers). Read it first; this instruction is the work order over it.

---

## 0 · Context in one paragraph

Chromatic build 101's accessibility pass reports **1,344 violations** across the new theme-mode snapshots: 93.5% in dark mode, light/hc pairwise identical (same ~39 bugs counted twice), counts scaling with text density. Triage clusters them into **~12 root causes (C1–C6)**. `verify-contrast` passed 8/8 because it checks 8 curated pairs; axe checks every element — that gap is itself a deliverable (step 6).

## 1 · Decisions locked (do not re-open)

| ID | Decision |
|---|---|
| **D-120** | **Chromatic baseline acceptance is HELD** until the post-fix build. Supersedes the earlier "review build 101 and accept" instruction. Ledger rows A5.6 / B5.3 / F.4 / DoD-3c now close only on the post-fix build being green and accepted (single acceptance pass). Light zero-drift proof (A5.5) is unaffected. |
| **D-121** | **Fix at the token layer first.** Component code changes only where the token chain cannot express the fix (C5/C6 story+structural items). No visual changes to the approved light theme. |
| **D-122** | **ClientGrid + CompliancePostureStrip migrate onto semantic text tokens** (C4) — in scope even though they're not Layer 1/2 catalogue primitives, because they're 52% of all violations and carry baselined R9 debt. If they turn out to be imported from another repo rather than living in this one: file the fix spec as an issue on that repo with the token mapping attached, mark the rows BLOCKED(external), and report — do not cross repos uninvited. |
| **D-123** | **Hypothesis-driven, not hypothesis-bound.** The triage's C1–C6 are ranked hypotheses from counts alone. Run the five probes first; where a probe kills a hypothesis, follow the actual rule IDs, record the reconciliation in the brief §13 + ledger, and continue. Do not stop to ask. |
| **D-124** | **Permanent gates ship with this work** (not later): (a) `verify-contrast` extended to every token whose name matches a text role, asserted per theme, CI-blocking; (b) Chromatic a11y deltas documented as review-blocking for theme-affecting PRs (docs-site contribution page). |

## 2 · Work order

Execute in this order. Each step has an acceptance condition; tick it in the ledger with evidence per DoD-1.

1. **Commit the inputs.** Add the companion triage HTML to `docs/design-system/v4.4/a11y-triage-chromatic-6a1c1e6f.html` and the source CSV to `docs/design-system/v4.4/reports/`. *(Acceptance: both in the tree, linked from the ledger.)*
2. **Five confirmation probes.** Pull axe rule lists (Chromatic UI a11y tab, or local `axe-core` against Storybook with the theme globals) for: ClientGrid *All Mode 12 Clients* (dark **and** light) · Footer *Default* (dark) · Callout *Intents* (dark) · StreamingText *Default* (dark) · Header *Gallery* (light). Post the rule IDs against each cluster in the ledger. *(Acceptance: every cluster C1–C6 has confirmed rule IDs or a recorded reconciliation per D-123.)*
3. **C1 — dark faint-text tier.** Dark overrides for every component token resolving to stone-500/stone-400 in a text role (re-point per B1: stone-400 or stone-300 on dark surfaces). *(Acceptance: probe stories' contrast counts for this tier = 0; derivation recorded in `derive-dark.mjs`.)*
4. **C2 — on-inverse chain.** Derive the full dark `on-inverse` set (text, subtle, dividers, hover) for Footer/Header chrome; add contrastPairs pinned to `surface.inverse`. *(Acceptance: Footer Default + Mobile dark = 0.)*
5. **C3 — intent/band tinted surfaces.** Re-derive intent/band text+icon tokens for dark (lighten toward 200–300 weights, hue-preserving); one contrastPair per intent per theme. *(Acceptance: Callout Intents, Badge Gallery, CitationChip All Variants, Toast Intents dark = 0.)*
6. **C4 — ClientGrid family token migration** per D-122. *(Acceptance: ClientGrid + CompliancePostureStrip = 0 in light AND dark, or BLOCKED(external) per D-122.)*
7. **C5 — gallery landmark duplicates.** Story-level only: one canonical landmark per gallery story, duplicates wrapped `role="presentation"`. *(Acceptance: Footer Print Gallery + Header Gallery/Variants + ClientScopeBanner Stack = 0 in light/hc/print.)*
8. **C6 — structurals + not-run.** Fix ImpactGraph *Interactive* (mode-independent rule) and MarketingImpactGraph's light-chrome caption; make Modal *Interactive* mount its dialog before the a11y pass; mark TelemetryBeacon stories as intentionally a11y-excluded with a comment (it renders nothing). *(Acceptance: no empty-count rows except documented exclusions; ImpactGraph/MarketingImpactGraph = 0.)*
9. **D-124 permanent gates.** *(Acceptance: expanded verify-contrast fails on a seeded bad text-role token — DoD-5 negative proof — and passes on clean source; policy text on the contribution page.)*
10. **One re-run, one acceptance.** Trigger Chromatic on the fixed branch; verify the a11y report is clean (target: 0 serious/moderate outside documented exclusions); flag the build for owner baseline acceptance (the acceptance click stays with Fiyin). Then update ledger rows A5.6 / B5.3 / F.4 / DoD-3c and re-issue the done report per DoD-7.

## 3 · Verification & reporting

- DoD §11.5 applies in full: evidence ledger rows for every step above, clean-state gauntlet re-run at the final HEAD (now including the expanded verify-contrast), negative checks for the new gate, and a DoD-7 two-state report (done/blocked — expected blocked-on: owner baseline acceptance + the existing external gates).
- Report before/after totals from the CSV shape: per-mode and per-component, so the 1,344 → N collapse is auditable.
- Expected outcome if C1–C4 hypotheses hold: ~1,100 of 1,257 dark violations collapse from token edits alone. If your probe results imply materially different mass, say so in the report rather than forcing the estimate.

## 4 · Escalation boundary (the only two reasons to stop and ask)

1. A fix would visibly change the **approved light theme** (D-121 forbids it silently).
2. A contrast floor is unreachable without changing a **brand-locked hue** (e.g. an Iris teal pairing) — propose options in the ledger and wait, mirroring the v4.3 `iris.accent-on` AA-Large exception precedent.

Everything else is pre-authorised.

---
**END · GOV-DS-2026-02 rev. v4.4 · A11Y-FIX**
