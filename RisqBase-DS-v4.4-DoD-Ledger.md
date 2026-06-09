# RisqBase DS v4.4 — Definition-of-Done Ledger

**Protocol:** GOV-DS-2026-03 §11.5 (DoD-1). One row per acceptance row.
**Status values:** `PENDING` (work not finished) · `PASS` · `FAIL` · `DESCOPED` (→ v4.4.1, §10.3 ladder only) · `BLOCKED` (cannot be completed/verified from this environment; evidence states why).
**This ledger IS the done report (DoD-7).** Any FAIL or BLOCKED row ⇒ overall status "blocked".

Row IDs reference `docs/design-system/v4.4/RisqBase-DS-v4.4-SOTA-Brief.md`.

## Workstream A — DTCG migration

| Row | Status | Evidence |
|---|---|---|
| A5.1 file renames `.tokens.json` | PENDING | |
| A5.2 OKLCH primitives + round-trip report | PENDING | |
| A5.3 `$deprecated` in lint + build | PENDING | |
| A5.4 resolver theming; stubs deleted | PENDING | |
| A5.5 tokens.css diff conformance | PENDING | |
| A5.6 Chromatic light zero-diff | PENDING | |
| A5.7 README updated | PENDING | |

## Workstream B — dark + HC

| Row | Status | Evidence |
|---|---|---|
| B5.1 dark completeness + lint rule | PENDING | |
| B5.2 contrastPair passes in dark | PENDING | |
| B5.3 Chromatic dark baseline | PENDING | |
| B5.4 forced-colors audit + CSS | PENDING | |
| B5.5 docs-site theme switcher | PENDING | |
| B5.6 RALIA/marketing unchanged | PENDING | |

## Workstream C — agent surface

| Row | Status | Evidence |
|---|---|---|
| C5.1 MCP npm package, zero-config npx | PENDING | |
| C5.2 11 tools + integration tests | PENDING | |
| C5.3 remote endpoint live | PENDING | |
| C5.4 Layer-3 flags everywhere | PENDING | |
| C5.5 llms.txt family + staleness CI | PENDING | |
| C5.6 two smoke-test prompts | PENDING | |

## Workstream D — Code Connect

| Row | Status | Evidence |
|---|---|---|
| D.1 25/25 mapped + published | PENDING | |
| D.2 variable code syntax | PENDING | |
| D.3 spot-check set in Dev Mode | PENDING | |
| D.4 publish in release pipeline | PENDING | |

## Workstream E — motion preference

| Row | Status | Evidence |
|---|---|---|
| E.1 MotionProvider + hook, beta | PENDING | |
| E.2 4 primitives on the hook | PENDING | |
| E.3 motion-preference recipe live | PENDING | |
| E.4 reduced mode verified in Storybook | PENDING | |

## Workstream F — charts

| Row | Status | Evidence |
|---|---|---|
| F.1 7/7 taxonomy | PENDING | |
| F.2 token-only colors; dark verified | PENDING | |
| F.3 a11y table fallback all types | PENDING | |
| F.4 Chromatic light+dark baselines | PENDING | |

## §11.1–11.4 master rows

| Row | Status | Evidence |
|---|---|---|
| P.1 ui-components minor published | PENDING | |
| P.2 mcp package published | PENDING | |
| P.7 tsc --strict + type tests + Chromatic | PENDING | |
| G.1 brief approved Elena + Fiyin | PENDING | CEO decisions locked 2026-06-10 (questionnaire); Elena PENDING |
| G.2 R12–R14 implemented + tested | PENDING | |
| G.3 PLATFORM-STANDARDS.md updated | PENDING | |
| G.4 promotion log rows | PENDING | |
| G.5 /changelog/v4.4 live | PENDING | |
| G.6 v4.4.1 patch doc if ladder used | PENDING | |
| DS.1 llms.txt + mirrors served | PENDING | |
| DS.2 /mcp live or DESCOPED | PENDING | |
| DS.3 switcher + /tokens/theming | PENDING | |
| DS.4 motion-preference pattern page | PENDING | |

## DoD protocol rows

| Row | Status | Evidence |
|---|---|---|
| DoD-2 clean-state re-verification | PENDING | |
| DoD-3 output-diff proofs | PENDING | |
| DoD-4 functional smoke tests | PENDING | |
| DoD-5 negative scanner checks | PENDING | |
| DoD-6 descope integrity | PENDING | |
