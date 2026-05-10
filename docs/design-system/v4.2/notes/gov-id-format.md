# GOV-DS-2026-* ID format — observed and pending verification

**Status:** PENDING VERIFICATION
**Owner:** Sophie Brennan (G8)
**Date:** 2026-05-10
**Trigger:** Claude Design flagged that `GOV-DS-2026-02-PLAN-420` and `GOV-DS-2026-02-AUDIT-420` (cited in PR #2's commit message `9d858ab`) may not resolve in the governance system. The CEO asked for verification before PR #5 merges.

---

## What I could verify

I do not have access to the RisqBase governance system from this agent. I could only verify **internal consistency within the repo** as of commit `9d858ab` on `s1/src-restructure`.

### Observed IDs (from `grep -rn 'GOV-DS-2026' docs/`)

| ID | Where declared (Document ID line) | Where else cited |
|---|---|---|
| `GOV-DS-2026-02` | `docs/design-system/v4.2/spec.md` line 3; closing block line 2281 | `docs/devops/secrets.md` line 5; `docs/devops/branch-protection.md` line 5 |
| `GOV-DS-2026-02-PLAN-420` | `docs/design-system/v4.2/plan.md` line 3; closing block line 303 | PR #2 commit message `9d858ab` `Refs:` line |
| `GOV-DS-2026-02-AUDIT-420` | `docs/design-system/v4.2/audit.md` line 3; closing block line 181 | PR #2 commit message `9d858ab` `Refs:` line |
| `GOV-DS-2026-01` | (no declaration in this repo — referenced only as the parent design-system ID) | `CLAUDE.md` line 72 ("Reference Document"); `CLAUDE.md` line 363 (session note) |

### Inferred format

Looking at the four IDs together, the visible pattern is:

```
GOV-DS-<YEAR>-<SEQ>[-<DOC-TYPE>-<VERSION>]
```

- `GOV-DS` — namespace, "Governance — Design System"
- `<YEAR>` — four-digit year (e.g., `2026`)
- `<SEQ>` — two-digit serial within year (`01` = v4.1.x baseline; `02` = v4.2 corpus)
- `<DOC-TYPE>` — optional, naming the artefact within the corpus (`PLAN`, `AUDIT`)
- `<VERSION>` — optional, three-digit version code; the observed `420` aligns with version 4.2.0 (`v4.2`)

The base ID `GOV-DS-2026-02` (with no doc-type suffix) is treated as the spec itself — i.e., spec.md **is** the v4.2 corpus, and plan/audit are sibling artefacts that decorate it.

### Internal consistency

Within the repo, the three v4.2 corpus IDs are mutually consistent:

- All share the `GOV-DS-2026-02` parent prefix.
- `-PLAN-420` and `-AUDIT-420` share the version suffix `420`.
- Each artefact's Document ID matches its closing-block sign-off ID.
- Cross-references (PR #2 commit, devops runbooks) cite the parent `GOV-DS-2026-02` correctly.

No internal contradictions. The IDs are well-formed *within the corpus*.

---

## What I could NOT verify

- **External governance-system resolution.** I do not have access to the system Claude Design referenced when flagging "may not resolve". If that system maintains a registry of GOV-DS-* IDs, I cannot reach it from this worktree.
- **Whether the canonical format requires `<DOC-TYPE>-<VERSION>` for child artefacts** (vs e.g. `<DOC-TYPE>-<DATE>` or `<DOC-TYPE>-<MAJOR>-<MINOR>`). The format appears reasonable but could conflict with a convention defined elsewhere in RisqBase governance.
- **Whether `420` is the correct rendering of v4.2.0** (vs `4-2-0`, `0420`, `42`). All three are common in similar schemes.

---

## Recommendation for CEO

Before PR #5 merges:

1. **Confirm the format.** Either:
   - The format `GOV-DS-<YEAR>-<SEQ>[-<DOC-TYPE>-<VERSION>]` is canonical → add a one-paragraph format definition to `spec.md` §0 or §18.5 (Contributor governance), so future authors and Claude Design reviews can self-verify without round-tripping the CEO.
   - The format is wrong → CEO names the correct one; Elena (or I) update `spec.md`, `plan.md`, `audit.md`, the PR #2 commit message footer (cannot rewrite history on a merged PR; add an addendum commit on `s1/src-restructure` instead), `docs/devops/secrets.md`, `docs/devops/branch-protection.md`. PR #5 absorbs the corrections.

2. **Lightweight CI check.** Once the canonical format is named, a simple regex lint (e.g. `grep -E '^GOV-DS-\d{4}-\d{2}(-(PLAN|AUDIT|...)-\d{3})?$'`) on every Document ID block prevents drift in v4.2.1+.

---

## What this PR does NOT change

- No GOV-ID strings are edited in `spec.md`, `plan.md`, `audit.md`, `CHANGELOG.md`, or `docs/devops/*` as part of this PR.
- The PR #2 commit message footer is preserved (history-rewriting commit messages on a merged PR is out of scope here).
- This file is informational only and waits on CEO confirmation.

If the CEO confirms the format is canonical, this file's status flips from PENDING VERIFICATION to VERIFIED in a v4.2.1 patch (single-line edit). If a correction is needed, this file becomes the changelog of the correction.
