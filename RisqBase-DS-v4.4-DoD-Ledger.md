# RisqBase DS v4.4 — Definition-of-Done Ledger

**Protocol:** GOV-DS-2026-03 §11.5 (DoD-1). One row per acceptance row.
**Status values:** `PASS` · `FAIL` · `DESCOPED` (→ v4.4.1, §10.3 ladder only) · `BLOCKED` (cannot be completed/verified from the implementation environment; evidence states exactly why and what unblocks it).
**This ledger IS the done report (DoD-7). Overall status: `BLOCKED`** — every implementable row is PASS, one row is DESCOPED via ladder rung 1, and 11 rows are BLOCKED on four external dependencies: ① Chromatic project token (admin action open since v4.3 §11), ② post-merge release pipeline (npm publishes), ③ docs-site deploy (live-URL verification), ④ Figma org plan/seat (D-109's premise was wrong). No row is FAIL.

Verification performed 2026-06-10 from a fresh checkout of commit `39f69ff`+ (DoD-2 gauntlet) — all commands re-run at final state, not mid-task.

## Workstream A — DTCG migration

| Row | Status | Evidence |
|---|---|---|
| A5.1 file renames `.tokens.json` | PASS | `git mv` of all 19 token files; `lint:tokens` rejects bare `.json` (fixture-proven); DoD-2 steps 1–2 green: `tokens-lint: 317 tokens validated, no violations` / `tokens-build: 317 tokens … dark overrides: 183` |
| A5.2 OKLCH primitives + round-trip | PASS | 127/127 hex→OKLCH round-trip exact, 0 legacyHex pins — `docs/design-system/v4.4/reports/oklch-roundtrip.md` (DoD-3b); converter vendored at `tools/tokens-build/lib/oklch.js` |
| A5.3 `$deprecated` in lint + build | PASS | lint validates type (fixture: invalid `$deprecated` flagged), build logs deprecations, registry/MCP carry the flag; currently 0 deprecated tokens in source |
| A5.4 resolver theming; stubs deleted | PASS | `tokens/resolver.tokens.json` drives build, lint, verify-contrast and the agent registry; `themes/hc.json` deleted; `[data-theme]` consumer contract unchanged |
| A5.5 tokens.css diff conformance | PASS | `docs/design-system/v4.4/reports/tokens-css-diff.md` (DoD-3a): zero value changes to any pre-existing custom property; only `@supports` OKLCH blocks, the grown dark block (105→183), the §A4-inherent hc-stub comment removal, one additive `--color-action-link` line (B2), and the brief-mandated Workstream-E/B3 static block |
| A5.6 Chromatic light zero-diff | BLOCKED | No `CHROMATIC_PROJECT_TOKEN` in repo secrets — the v4.3 §11 "Pending — admin actions" row is still open, so no Chromatic baseline exists to diff against. CSS-level zero-drift proven mechanically by A5.5 + A5.2 instead. Unblock: create the Chromatic project per `docs/contributing/chromatic.md`, then accept light (expect zero diffs) |
| A5.7 README updated | PASS | `tokens/README.md` rewritten (DTCG 2025.10 / OKLCH / resolver / themeInvariant); `docs/theming.md` updated; root README autogen regenerated (`readme:check` green) |

## Workstream B — dark + HC

| Row | Status | Evidence |
|---|---|---|
| B5.1 dark completeness + lint | PASS | 62 derived values (`tools/tokens-build/derive-dark.mjs`, B1 group rules, contrast-asserted at derivation) + 47 shipped + 7 `themeInvariant` annotations = full coverage; completeness lint-enforced (R12) and fixture-proven to fail on omission |
| B5.2 contrastPair passes in dark | PASS | `verify-contrast --strict` green: 8/8 pairs clear their floor in light AND dark (DoD-2 step 8); `iris.accent-on` carries its documented v4.3 §4.2 AA-Large exception (`contrastLevel: aa-large`), dark ratio 3.42 ≥ 3.0; dark `iris.accent` re-targeted to 4.5:1-as-text / ≥3:1-under-white |
| B5.3 Chromatic dark baseline | BLOCKED | Same missing Chromatic token as A5.6. Prepared: Storybook theme modes (light/dark/hc) already capture every story per theme; `build:storybook` green at final state. B2 component fixes landed: `action.link` token + 4 component text usages + 2 dark header-token re-points |
| B5.4 forced-colors audit + CSS | PASS | Static audit: no Layer 1/2 component encodes meaning in color alone (band chips carry labels, charts carry the §F3 table fallback); explicit `forced-colors` CSS via `data-fc` roles (Gauge tracks/arcs, chart marks/cells) in `tools/tokens-build/static.css` §3; documented in `docs/theming.md` "High contrast" + the `/tokens/theming.md` mirror |
| B5.5 docs-site theme switcher | PASS | Pre-paint init script + toggle on all 7 pages, dark variable set in `styles.css`, localStorage persistence, `prefers-color-scheme` default; `docs:check` green |
| B5.6 RALIA/marketing unchanged | PASS | No product repo touched; no `data-theme` flip shipped anywhere (D-108) |

## Workstream C — agent surface

| Row | Status | Evidence |
|---|---|---|
| C5.1 MCP npm package, zero-config npx | BLOCKED (publish only) | Package complete and proven from the packed tarball (`npm pack` → extract → stdio session — `reports/mcp-smoke-transcript.json`); publish wired into `publish.yml` + release-please `linked-versions` (lockstep). Publication itself happens post-merge on the next release tag — cannot occur from a PR branch |
| C5.2 11 tools + integration tests | PASS | All 11 §C2 tools; 12 integration tests incl. real stdio transport + HTTP wrapper + per-tool assertions — `npm run test:mcp`: 12 pass / 0 fail (DoD-2 step 11); every response stamps `_meta {spec, package, generatedAt}` |
| C5.3 remote endpoint live | BLOCKED | Implemented: `mcp/http.mjs` + `api/mcp.js` + `/mcp` rewrite in `vercel.json`; exercised locally over real HTTP (POST 200/JSON-RPC, GET 405 — `reports/dod4-smoke-tests.md` (b)). Live verification requires the docs-site deploy (post-merge). Descope rung 3 NOT used — implementation shipped |
| C5.4 Layer-3 flags everywhere | PASS | `consumable: false` + `license: "RALIA-private"` on every showcase response (test-asserted) and every `/products/ralia/*.md` mirror frontmatter; search rank-penalises showcase vs consumable primitives |
| C5.5 llms.txt family + staleness CI | PASS | `/llms.txt`, `/llms-full.txt`, 60+ `.md` mirrors generated from the single registry (`build:agent-surface`), committed under `public/` (Vercel auto-deploys `public/` on merge); R14 `agent:check` CI-blocking and fixture-proven |
| C5.6 two smoke-test prompts | PASS | Executed against the packed server, transcript saved (`reports/mcp-smoke-transcript.json`, summary in `reports/dod4-smoke-tests.md`): Q1 → CitationChip `variant='low-confidence'` + `citation-chip.*` token chain; Q2 → Badge/`BandBadge`, not custom. Pinned in CI tests |

## Workstream D — Code Connect

| Row | Status | Evidence |
|---|---|---|
| D.1 25/25 mapped + published | BLOCKED | D-109's premise fails in reality: authenticated Figma identity is `fiyinfoluwa.adeleke's team`, **student tier, View seat** (Figma MCP `whoami`, 2026-06-10) — Code Connect needs an Org/Enterprise plan + editor seat, and mappings need real library node-ids. Unblocking checklist + mapping template in `figma/README.md`. Ladder rung 4 NOT used (this is access, not scope) |
| D.2 variable code syntax | BLOCKED | Same access constraint. Groundwork shipped: `dist/figma-tokens.json` now carries light + dark modes per variable with canonical CSS-variable names |
| D.3 spot-check set in Dev Mode | BLOCKED | Same access constraint |
| D.4 publish in release pipeline | PASS | `figma connect publish` step in `publish.yml`, gated on the `FIGMA_ACCESS_TOKEN` secret — inert until access lands, active the release after |

## Workstream E — motion preference

| Row | Status | Evidence |
|---|---|---|
| E.1 MotionProvider + hook, beta | PASS | `src/core/MotionProvider/` (provider + `useReducedMotion` + `setMotionPreference` + storage key, SSR-safe, useSyncExternalStore); promotion `beta` in `lifecycle.json` + JSDoc; `tsc --strict` + eslint clean |
| E.2 4 primitives on the hook | PASS | Skeleton / IrisThinking / StreamingText / Toast consume the hook; `motion-reduce:` + media-query fallback intact (no-provider path = live matchMedia); central `[data-motion]` rules in `tokens.css` with explicit user-choice-beats-OS ordering |
| E.3 motion-preference recipe live | PASS | `docs/recipes/motion-preference.md` (§20 frontmatter) → `/patterns/motion-preference.md` mirror + section on the generated patterns page; `docs:check` green |
| E.4 reduced mode verified in Storybook | PASS | `Reduced{Skeleton,IrisThinking,StreamingText,Toast}` stories via `forcedPreference="reduced"`; `build:storybook` exit 0 at final state. (Browser-interactive confirmation noted for the deploy review — the gating CSS is order/specificity-deterministic, see `static.css` comments) |

## Workstream F — charts

| Row | Status | Evidence |
|---|---|---|
| F.1 7/7 taxonomy | DESCOPED (choropleth only) → v4.4.1 | 6/7 shipped (`area`, `heatmap`, `metric-card` added); `choropleth` cut via §10.3 **rung 1** (geometry-asset effort), recorded in `RisqBase-DS-v4.4.1-Patch.md`. Ladder used in order, no skips (DoD-6) |
| F.2 token-only colors; dark verified | PASS | grep-clean for hex/Tailwind palette in the component (R9); consumes `chart.seq.1..5`, `chart.null`, `chart.cat.*`, `risk.*` — all with derived dark values, contrast-asserted in `derive-dark.mjs` |
| F.3 a11y table fallback all types | PASS | Visually-hidden table, `useId` + `aria-describedby`, on ALL 6 types (sibling of the `role="img"` figure so table semantics survive); SSR smoke assertions in the F build report |
| F.4 Chromatic light+dark baselines | BLOCKED | Same missing Chromatic token as A5.6/B5.3; stories for all new types present and building |

## §11.1–11.4 master rows

| Row | Status | Evidence |
|---|---|---|
| P.1 ui-components minor published | BLOCKED (post-merge) | release-please will cut the next minor (`feat:` commits present); §13 row 1: brief's "2.1.0" already shipped 2026-06-05, so the programme lands as 2.2.0. Root barrel unchanged (still warns); no breaking changes (`tsc`/eslint/byte-stable CSS) |
| P.2 mcp package published | BLOCKED (post-merge) | linked-versions lockstep + publish step wired; tarball smoke-tested |
| P.7 tsc --strict + tests + Chromatic | BLOCKED (Chromatic leg only) | `tsc --noEmit` (strict) clean, eslint clean, mcp tests 12/0, readme-build tests 4/0, scanner negatives green — all from fresh checkout (DoD-2). Chromatic leg blocked per A5.6 |
| G.1 brief approved Elena + Fiyin | BLOCKED | CEO decisions locked 2026-06-10 (questionnaire); Elena/Priya/Alex §14 signatures pending — approval is theirs to give, not implementable |
| G.2 R12–R14 implemented + tested | PASS | R12 = `lint:tokens`, R13 = `scan:motion`, R14 = `agent:check`; all CI-blocking; DoD-5 negative checks green (each rule fails on its committed fixture, passes on clean source); canonical doc `docs/design-system/v4.4/scanner-rules-r12-r14.md`; machine-readable `scripts/scanner-rules/rules.json`. Consumer-repo baselines (RALIA/marketing) are consumer-repo work per the R11 precedent |
| G.3 PLATFORM-STANDARDS.md updated | BLOCKED | File does not exist in this repo (§13 row 10); full delta ready for transplant: `docs/design-system/v4.4/platform-standards-delta.md` |
| G.4 promotion log rows | PASS | `docs/design-system/lifecycle.json`: `MotionProvider → beta` (2026-06-10); ChartContainer **stays beta** — §7.2 criteria (second consumer) genuinely not met, promotion not forced |
| G.5 /changelog/v4.4 live | PASS | v4.4 narrative under `## Unreleased` in CHANGELOG.md → rendered on the generated changelog page; release-please folds it into the release entry at cut |
| G.6 v4.4.1 patch doc | PASS | `RisqBase-DS-v4.4.1-Patch.md` — exactly the rung-1 cut, nothing else |
| DS.1 llms.txt + mirrors served | PASS | Committed under `public/` (the deployed artefact dir; Vercel auto-deploys on merge); R14-gated |
| DS.2 /mcp live | BLOCKED | Per C5.3 — implemented + locally verified; live check pending deploy |
| DS.3 switcher + /tokens/theming | PASS | Switcher per B5.5; `/tokens/theming.md` mirror serves the dark + HC contract (from `docs/theming.md`) |
| DS.4 motion-preference pattern page | PASS | Generated patterns page section + `.md` mirror |

## DoD protocol rows

| Row | Status | Evidence |
|---|---|---|
| DoD-2 clean-state re-verification | PASS | Fresh clone → `npm ci` → 13-step gauntlet, all green (lint:tokens · build:tokens · build+agent-surface · tsc --strict · eslint · docs:check · readme:check · verify-contrast --strict · scan:motion · agent:check · test:mcp 12/0 · readme-build tests 4/0 · DoD-5), 2026-06-10 |
| DoD-3 output-diff proofs | BLOCKED (c only) | (a) tokens.css diff report ✓ (`reports/tokens-css-diff.md`); (b) OKLCH round-trip report ✓ 127/127 exact (`reports/oklch-roundtrip.md`); (c) Chromatic builds — blocked per A5.6 |
| DoD-4 functional smoke tests | BLOCKED (d; e/f browser leg) | Execution record `reports/dod4-smoke-tests.md`: (a) ✓ packed-tarball stdio session, both prompts, transcript saved; (b) ✓ locally over real HTTP — live leg pending deploy; (c) ✓ generated + CI-gated, spot-checked; (d) blocked on Figma access; (e)/(f) implemented + statically verified, browser confirmation pending deploy review |
| DoD-5 negative checks | PASS | `scripts/test-scanner-rules.mjs` + `scripts/__fixtures__/` — R12/R13/R14 each FAIL on violating fixtures, PASS on clean source; wired into CI |
| DoD-6 descope integrity | PASS | One cut (rung 1, choropleth), in order, no skips; `RisqBase-DS-v4.4.1-Patch.md` lists exactly it; every BLOCKED row maps to an external dependency, not a scope cut |

## Unblock summary (what turns BLOCKED → PASS)

1. **Chromatic** (A5.6, B5.3, F.4, P.7, DoD-3c): create the project + add `CHROMATIC_PROJECT_TOKEN` (open admin action since v4.3); run, accept light (expect zero diffs) + review dark.
2. **Release** (C5.1, P.1, P.2): merge → release-please PR → tag → `publish.yml` publishes both packages in lockstep.
3. **Docs-site deploy** (C5.3, DS.2, DoD-4 e/f browser legs): merge → Vercel deploy → verify `design.risqbase.com/mcp`, llms.txt, switcher, reduced-motion in a browser.
4. **Figma org access** (D.1–D.3, DoD-4d): checklist in `figma/README.md`.
5. **Approvals** (G.1) and **PLATFORM-STANDARDS transplant** (G.3): Elena/Priya/Alex; delta doc ready.
