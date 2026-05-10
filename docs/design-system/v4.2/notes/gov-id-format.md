# GOV-DS-2026-* ID format — verified

**Status:** VERIFIED
**Owner:** Sophie Brennan (G8)
**Date opened:** 2026-05-10 (PR #11, status PENDING VERIFICATION)
**Date verified:** 2026-05-10 (this PR; CEO confirmed the canonical format)
**Trigger:** Claude Design flagged on PR #5 that `GOV-DS-2026-02-PLAN-420` and `GOV-DS-2026-02-AUDIT-420` (cited in PR #2's commit message `9d858ab`) may not resolve in the governance system. PR #11 captured the observation as PENDING VERIFICATION; the CEO has now confirmed the correct format.

---

## Canonical format

```
GOV-DS-<YEAR>-<SEQ>[-<DOC-TYPE>-<VERSION>]
```

Where:

| Segment | Required | Description | Example |
|---|:---:|---|---|
| `GOV-DS` | yes | Namespace — "Governance — Design System" | `GOV-DS` |
| `<YEAR>` | yes | Four-digit year | `2026` |
| `<SEQ>` | yes | Two-digit serial within year | `01` (v4.1.x baseline), `02` (v4.2 corpus) |
| `<DOC-TYPE>` | optional | Artefact type within the corpus | `PLAN`, `AUDIT` |
| `<VERSION>` | optional | Document version — **dotted, not concatenated** | `4.2`, not `420` |

The base ID `GOV-DS-2026-02` (no doc-type suffix) is the spec itself — `spec.md` **is** the v4.2 corpus, and plan/audit are sibling artefacts that decorate it.

### Corrected IDs for the v4.2 corpus

| File | Document ID |
|---|---|
| `docs/design-system/v4.2/spec.md` | `GOV-DS-2026-02` |
| `docs/design-system/v4.2/plan.md` | `GOV-DS-2026-02-PLAN-4.2` |
| `docs/design-system/v4.2/audit.md` | `GOV-DS-2026-02-AUDIT-4.2` |

The `-420` rendering observed in PR #2 (commit `9d858ab`) was **incorrect**. The version segment is the dotted document version (`4.2`), not a concatenated digit string (`420`). This PR corrects every occurrence in the working tree.

### Examples for future doc types

```
GOV-DS-2026-03                          # the v4.3 corpus (spec)
GOV-DS-2026-03-PLAN-4.3                 # v4.3 plan
GOV-DS-2026-03-AUDIT-4.3                # v4.3 audit
GOV-DS-2026-02-PATCH-4.2.1              # a v4.2.1 patch document
```

The version segment always matches the document's own semver (major.minor[.patch]) — it is not the year-serial sequence and not a build number.

---

## What this PR changes

`grep -rn 'GOV-DS-2026-02-PLAN-420\|GOV-DS-2026-02-AUDIT-420' .` (excluding `node_modules`, `dist`, `.git`) returned 4 occurrences before this PR:

| File | Line | Before | After |
|---|---|---|---|
| `docs/design-system/v4.2/plan.md` | 3 (Document ID) | `GOV-DS-2026-02-PLAN-420` | `GOV-DS-2026-02-PLAN-4.2` |
| `docs/design-system/v4.2/plan.md` | 303 (closing block) | `END OF GOV-DS-2026-02-PLAN-420` | `END OF GOV-DS-2026-02-PLAN-4.2` |
| `docs/design-system/v4.2/audit.md` | 3 (Document ID) | `GOV-DS-2026-02-AUDIT-420` | `GOV-DS-2026-02-AUDIT-4.2` |
| `docs/design-system/v4.2/audit.md` | 181 (closing block) | `END OF GOV-DS-2026-02-AUDIT-420` | `END OF GOV-DS-2026-02-AUDIT-4.2` |

After this PR, `grep -rn 'GOV-DS-2026-02-PLAN-420\|GOV-DS-2026-02-AUDIT-420' .` returns matches **only inside this note** (the historical-record table above). Both `plan.md` and `audit.md` are clean. To verify zero live matches: `grep -rn 'GOV-DS-2026-02-PLAN-420\|GOV-DS-2026-02-AUDIT-420' . --exclude-dir=notes --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git`.

## What this PR does NOT change

- **PR #2's commit message footer (commit `9d858ab`)** still cites the `-420` form. Rewriting commit messages on a merged PR is out of scope; the discrepancy is preserved as a historical artefact and flagged in the v4.2.1 patch backlog (`docs/design-system/v4.2/implementation-plan.md` §8) for note-only mention.
- **`docs/design-system/v4.2/spec.md`'s base ID `GOV-DS-2026-02`** is unchanged — the base form (no doc-type suffix) is canonical.
- **`docs/devops/secrets.md` and `docs/devops/branch-protection.md`** cite the parent `GOV-DS-2026-02` correctly — no edit needed.

---

## Lightweight CI check (recommendation, not in this PR)

Once this format is canonised in `spec.md` §0 or §18.5, a simple regex lint can prevent drift:

```bash
# in a v4.2.1 patch — prevents future drift
grep -REn '^\*\*Document ID:\*\* ' docs/design-system/ | \
  grep -vE 'GOV-DS-[0-9]{4}-[0-9]{2}(-[A-Z]+-[0-9]+(\.[0-9]+){1,2})?$' && exit 1 || exit 0
```

Add to a `format-lint` job in `.github/workflows/ci.yml`. Owner: Alex Chen (G1) — non-blocking suggestion for v4.2.1.

---

## Related notes from PR #11

PR #11 (commit `351c3bb`, branch `s1/cleanup-2-doc-consistency`) opened this question and added two sibling notes still in scope:

- `notes/audit-row-counts.md` — reconciles 19/20/22/28 row counts across plan/audit/implementation-plan.
- `notes/glossary-scope.md` — scopes U3.2 (~80 entries, seven categories, S4 timing).

Both are carried forward unchanged in this PR alongside the GOV-ID fixes; no further changes pending.
