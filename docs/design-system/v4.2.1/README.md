# RisqBase Design System v4.2.1 — Complete

This folder holds the v4.2.1 patch artefacts. v4.2.1 was a **documentation-only** patch against v4.2 — no `@risqbase-inc/ui-components` version bump, no spec re-publish. Each of the 14 spec amendments landed as an in-place edit to `../v4.2/spec.md` in its own PR (#17–#27) over 2026-05-10 → 2026-05-11.

| File | Purpose |
|------|---------|
| [`v4.2.1-COMPLETE.md`](./v4.2.1-COMPLETE.md) | The patch plan (`GOV-DS-2026-02-PATCH-4.2.1`), now closed. 14-row tracker (all ticked `[x]`) grouped P0 (substrate) / P1 (audit-flagged) / P2 (governance hygiene). Resolution log records the 11 PRs that landed each row, including the five section-ID corrections discovered during execution. Outstanding handoffs section names the post-v4.2.1 work (Claude Design value-selection, dark/HC pass, lint-script implementations) — commissioned in detail by `docs/briefs/BRIEF-401-DS-IMPL-AUDIT.md`. |

## How v4.2.1 shipped

1. The patch plan landed as a planning artefact in PR #16 (2026-05-11).
2. Each of the 14 tracker rows became its own follow-up PR against `../v4.2/spec.md`, ticking from `[ ]` to `[x]` as the spec edit landed (PRs #17–#27).
3. When all 14 rows closed, `RisqBase-DS-v4.2.1-Patch.md` was renamed `v4.2.1-COMPLETE.md` and the v4.2 audit's "What needs honest attention before v4.2.1" section was updated to reference the completion artefact (this housekeeping PR).

## Sequencing as executed

- **P2 governance hygiene (G1–G4) shipped first** in PR #17 as a single bundle — fast warm-up.
- **P1 audit-flagged items (A2, A4, A5, A6, A7) shipped one PR per row** in parallel with the rest.
- **P0 substrate (T1, T2, T3) shipped one PR per row.** T2 (chart taxonomy) shipped before A1 + A3 because both depend on its 28-type catalogue.
- **A1 + A3 shipped last** as derivatives — A1 (print variants) maps each chart type from T2's catalogue; A3 (composite recipes) uses §20.0 schema with §20.0.1 voice_examples template binding (A6).

The "P0 first, then P1, then P2" sequencing recommendation in the original patch plan was inverted in practice — P2 shipped first as a low-risk warm-up — but the dependency chain was respected (T2 before A1/A3, A6 before A3).

## What's next

The follow-up commission **BRIEF-401** (`docs/briefs/BRIEF-401-DS-IMPL-AUDIT.md`) handles the post-v4.2.1 implementation audit + value-selection pass: 38 TBD primitive hex values, dark + HC + print theme values, the `scopes[]` patch per A7, and the full system audit against the spec.

## Status

✅ **COMPLETE.** See [`v4.2.1-COMPLETE.md`](./v4.2.1-COMPLETE.md) for the resolution log + outstanding handoffs.
