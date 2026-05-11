# v4.2 audit row counts (canonical)

**Owner:** G8 (Growth) (G8)
**Date:** 2026-05-10
**Purpose:** Reconcile every "X of 50" / "Y of 22" / "Z of 19" claim across the v4.2 corpus against `audit.md` ground truth, so PR #5 can merge without leaving stale numbers behind.

---

## Ground truth (from `audit.md` as of commit `9d858ab`)

The canonical aggregation is the **summary scorecard** at `audit.md` lines 147-156:

| Theme | `[x]` | `[~]` | `[ ]` | Total |
|-------|:---:|:---:|:---:|:---:|
| F1 — Data Visualisation | 11 | 3 | 0 | 14 |
| F2 — Signatures decoupled | 2 | 8 | 0 | 10 |
| F3 — Content design | 4 | 3 | 0 | 7 |
| F4 — Telemetry & adoption | 3 | 3 | 0 | 6 |
| F5 — Figma ↔ code sync | 3 | 4 | 0 | 7 |
| F6 — Cross-cutting | 5 | 1 | 0 | 6 |
| **Total** | **28** | **22** | **0** | **50** |

- **Total task rows:** 50
- **Spec rows complete `[x]`:** 28
- **Implementation rows pending `[~]`:** 22
- **Other states:** 0 (no `[ ]` rows; "zero regressions versus v4.1.1")

The 50 excludes the six theme-cluster header rows (F1-F6 themselves), which appear in the per-section tables but are not task rows. Including them, the raw row counts in the document are 34 `[x]` and 23 `[~]` — but the scorecard (and every downstream claim across the corpus) treats only the 50 atomic-update rows as canonical.

### Sub-counts derived from ground truth

- **`[~]` rows in F4 cluster:** U4.2, U4.3, U4.4 = 3 rows. U4.1 is `[x]` (it's a spec row).
- **Pure-telemetry `[~]` rows (those deferred per `implementation-plan.md` D10):** U4.2, U4.3 only — U4.4 is the deprecation-warning system, not telemetry.
- **`[~]` rows in v4.2 implementation scope (after telemetry deferral):** 22 − 2 = **20**, not 19.

---

## Cross-reference

| Source | Claims | Matches ground truth? |
|---|---|---|
| `audit.md` summary scorecard | 28 / 22 / 0 / 50 | yes (canonical) |
| `plan.md` | No row-count claim — every row is `[ ]` (the contract before execution); "v4.2 is complete when every row in the final tracker is `[x]`" | yes (no claim to drift) |
| `README.md` | "28 of 50 audit rows complete; 22 are spec'd-but-not-yet-implemented" | **yes** |
| `implementation-plan.md` §1 (executive summary) | "audit identifies 22 implementation rows that are spec'd-but-not-built; this programme ships **19** of them" | **no** — should be **20** |
| `implementation-plan.md` §4 heading | "Owner-by-row matrix (19 audit `[~]` rows in v4.2 scope)" | **no** — the matrix itself lists 20 rows; should be **20** |
| `implementation-plan.md` §7 DoD | "All 19 audit `[~]` rows in scope flipped to `[x]`" | **no** — should be **20** |
| `CHANGELOG.md` | No row-count claim — "see audit.md for the contract" | yes (no claim to drift) |
| PR #2 body | "Spec rows: 28 of 50 complete." / "Implementation rows: 22 of 50 queued." | **yes** |
| PR #2 commit message (`9d858ab`) | "Spec is complete (28 of 50 audit rows). Implementation rows … are queued — see audit.md." | **yes** |

---

## Actions

### Drift fixed in this PR

- **`implementation-plan.md` §1 / §4 heading / §7 DoD:** "19" → "20" (three occurrences). Math: 22 `[~]` rows minus 2 telemetry-deferred rows (U4.2, U4.3) = 20 in-scope implementation rows. The §4 owner-by-row matrix already lists 20 rows; the heading and prose were the drifted artefacts.

### Drift NOT fixed (intentional framing or upstream-author territory)

- **`implementation-plan.md` §1 "Out of v4.2 scope: telemetry rows U4.1, U4.2, U4.3 — deferred":** U4.1 is `[x]` in the audit, not `[~]`, so "deferring" it is a category error. But the meaning is clear: no telemetry-related work happens in v4.2, full stop, including treating U4.1's spec as the line at which telemetry stops. Left as-is; flagged here for v4.2.1 cleanup if G4 wants tighter framing.
- **`audit.md` F1 prose at line 54 ("9 of 14 fully done; 4 are `[~]`"):** 9 + 4 = 13, but F1 has 14 task rows. This is an internal inconsistency in the audit's own prose — the scorecard table at line 149 says 11 / 3 / 0 / 14 (which sums correctly). Per the constraint "don't modify audit ground-truth content", left as-is. Flag for v4.2.1 audit pass.
- **`audit.md` U1.9 and U1.13 status icons:** Both rows show `[x]` in the Status column but their Reality prose ends with "**Marking `[~]`**". The scorecard counts F1 as 11 `[x]` + 3 `[~]`, so it has counted ONE of these as `[~]` (the one with the strongest "real gap" framing) and left the other ambiguous. Per the "don't modify audit" constraint, left as-is. Flag for v4.2.1 audit pass.
- **`audit.md` F2 prose at line 75 ("1 of 10 fully done"):** scorecard at line 150 reports 2 / 8 / 0 / 10. Same pattern — prose under-counts scorecard. Flag for v4.2.1.

---

## Risks / follow-ups for v4.2.1

1. **Audit-internal scorecard-vs-prose reconciliation.** F1 and F2 cluster prose summaries disagree with the scorecard. Two F1 rows (U1.9, U1.13) have `[x]` icons paired with "Marking [~]" prose. G4 should run a v4.2.1 audit pass that picks one canonical state per row and brings every per-cluster prose summary into agreement with the scorecard.
2. **Implementation-plan §1 telemetry framing.** U4.1 is described as "deferred" but it's complete in the audit. Reword to "No further telemetry work in v4.2; the U4.1 spec stands and U4.2 / U4.3 collector + dashboard are post-launch."
3. **Add row-count assertions to a CI check.** The drift between three "19"s and the 20-row matrix would have been caught by a markdown lint that parses the matrix and verifies the heading number matches. Low priority but cheap.

None of these block PR #5. They are spec-side cleanup that fits naturally into the v4.2.1 patch backlog already named at `implementation-plan.md` §8.
