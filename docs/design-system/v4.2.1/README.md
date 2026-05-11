# RisqBase Design System v4.2.1

This folder holds the v4.2.1 patch artefacts. v4.2.1 is a **documentation-only** patch against v4.2 — no `@risqbase-inc/ui-components` version bump, no spec re-publish. Spec amendments land as in-place edits to `../v4.2/spec.md` in subsequent PRs that tick rows in the patch tracker.

| File | Purpose |
|------|---------|
| [`RisqBase-DS-v4.2.1-Patch.md`](./RisqBase-DS-v4.2.1-Patch.md) | The patch plan (`GOV-DS-2026-02-PATCH-4.2.1`). 14-row tracker grouped P0 (substrate) / P1 (audit-flagged) / P2 (governance hygiene). |

## How v4.2.1 ships

1. This PR lands the patch plan as a planning artefact. No spec text changes.
2. Each of the 14 tracker rows becomes its own follow-up PR against `../v4.2/spec.md`, ticking from `[ ]` to `[x]` as the spec edit lands.
3. When all 14 rows close, `RisqBase-DS-v4.2.1-Patch.md` is renamed `v4.2.1-COMPLETE.md` and the v4.2 audit's "What needs honest attention before v4.2.1" section is updated to reference the completion artefact.

## Sequencing

Per the patch plan:

- **P0 (substrate) is gate-keeping.** Token enumeration (T1), chart taxonomy (T2), and glossary content (T3) must close before any downstream visual work (marketing-site redesign, new product surfaces) so that work doesn't set ad-hoc precedent the system has to retrofit.
- **P1 (audit-flagged)** can run in parallel with P0 and with each other.
- **P2 (governance hygiene)** items are day-each tasks; any time.

## Owners

Per the tracker. Roles use the standard gate identifiers (G1 = Architecture, G4 = Design, G8 = Growth, Frontend = reports to G1). Final approval: CEO.

## Status

Patch plan **approved**. Spec-amendment PRs to follow.
