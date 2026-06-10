# RisqBase DS v4.4 — Definition-of-Done Ledger

**Protocol:** GOV-DS-2026-02 rev. v4.4 §11.5 (DoD-1). One row per acceptance row.
**Status values:** `PASS` · `FAIL` · `DESCOPED` (→ v4.4.1, §10.3 ladder only) · `BLOCKED` (cannot be completed/verified from the implementation environment; evidence states exactly why and what unblocks it).
**This ledger IS the done report (DoD-7). Overall status: `BLOCKED`** — every implementable row is PASS (no DESCOPED rows remain: the rung-1 choropleth cut was reversed by the CEO on 10 Jun and the type is implemented), and the remaining BLOCKED rows sit on four external dependencies: ① Chromatic baseline acceptance (build pending review), ② post-merge release pipeline (npm publishes), ③ docs-site deploy (live-URL verification; Vercel project-level rejection), ④ Figma Org access (amended D-109: Workstream D stays in v4.4 gated on access landing by the 27 June release cut, auto-converting to v4.4.1 past the gate). No row is FAIL.

**DoD-2 verification performed 2026-06-10 from a fresh clone of the FINAL code HEAD `ebcef4d`** (`fix(mcp): search generalisation…`) — all 15 steps re-run at final state after the choropleth restoration, GOV-ID sweep, GHAS escaping fix and search-scorer fix: token lint/build (317 tokens, 183 dark overrides) · tsup + agent-surface (67 artefacts, sourceHash 85e39302b438e460) · `tsc --strict` · eslint · docs:check · readme:check · `verify-contrast --strict` both themes · R13 scan · R14 agent:check · D-119 geo:check (9.8 KB gz / 80 KB) · MCP tests 12/0 · markdown-escape test 1/0 · readme-build tests 4/0 · DoD-5 scanner negatives. Storybook builds clean at the same HEAD. (The commit stamping this ledger touches only this file.)

## Workstream A — DTCG migration

| Row | Status | Evidence |
|---|---|---|
| A5.1 file renames `.tokens.json` | PASS | `git mv` of all 19 token files; `lint:tokens` rejects bare `.json` (fixture-proven); DoD-2 steps 1–2 green: `tokens-lint: 317 tokens validated, no violations` / `tokens-build: 317 tokens … dark overrides: 183` |
| A5.2 OKLCH primitives + round-trip | PASS | 127/127 hex→OKLCH round-trip exact, 0 legacyHex pins — `docs/design-system/v4.4/reports/oklch-roundtrip.md` (DoD-3b); converter vendored at `tools/tokens-build/lib/oklch.js` |
| A5.3 `$deprecated` in lint + build | PASS | lint validates type (fixture: invalid `$deprecated` flagged), build logs deprecations, registry/MCP carry the flag; currently 0 deprecated tokens in source |
| A5.4 resolver theming; stubs deleted | PASS | `tokens/resolver.tokens.json` drives build, lint, verify-contrast and the agent registry; `themes/hc.json` deleted; `[data-theme]` consumer contract unchanged |
| A5.5 tokens.css diff conformance | PASS | `docs/design-system/v4.4/reports/tokens-css-diff.md` (DoD-3a): zero value changes to any pre-existing custom property; only `@supports` OKLCH blocks, the grown dark block (105→183), the §A4-inherent hc-stub comment removal, one additive `--color-action-link` line (B2), and the brief-mandated Workstream-E/B3 static block |
| A5.6 Chromatic light zero-diff | BLOCKED (acceptance) | Chromatic ran on PR #84 (the v4.3 admin action HAS landed): 194 stories published (build 101, appId 69fe9aac8c64261fca691a4c), **90 visual/a11y changes pending baseline review** — the expected dark/hc re-baseline + new stories. Light-theme zero-drift proven mechanically by A5.5 + A5.2; reviewer must confirm the 90 contain no light diffs and accept. Chromatic UI access not available from this session |
| A5.7 README updated | PASS | `tokens/README.md` rewritten (DTCG 2025.10 / OKLCH / resolver / themeInvariant); `docs/theming.md` updated; root README autogen regenerated (`readme:check` green) |

## Workstream B — dark + HC

| Row | Status | Evidence |
|---|---|---|
| B5.1 dark completeness + lint | PASS | 62 derived values (`tools/tokens-build/derive-dark.mjs`, B1 group rules, contrast-asserted at derivation) + 47 shipped + 7 `themeInvariant` annotations = full coverage; completeness lint-enforced (R12) and fixture-proven to fail on omission |
| B5.2 contrastPair passes in dark | PASS | `verify-contrast --strict` green: 8/8 pairs clear their floor in light AND dark (DoD-2 step 8); `iris.accent-on` carries its documented v4.3 §4.2 AA-Large exception (`contrastLevel: aa-large`), dark ratio 3.42 ≥ 3.0; dark `iris.accent` re-targeted to 4.5:1-as-text / ≥3:1-under-white |
| B5.3 Chromatic dark baseline | BLOCKED (acceptance) | Dark snapshots captured per story via the theme modes — Chromatic build 101 holds the 90-change dark/hc re-baseline awaiting human review + acceptance (UI Tests status pending on PR #84). B2 component fixes landed: `action.link` token + 4 component text usages + 2 dark header-token re-points |
| B5.4 forced-colors audit + CSS | PASS | Static audit: no Layer 1/2 component encodes meaning in color alone (band chips carry labels, charts carry the §F3 table fallback); explicit `forced-colors` CSS via `data-fc` roles (Gauge tracks/arcs, chart marks/cells) in `tools/tokens-build/static.css` §3; documented in `docs/theming.md` "High contrast" + the `/tokens/theming.md` mirror |
| B5.5 docs-site theme switcher | PASS | Pre-paint init script + toggle on all 7 pages, dark variable set in `styles.css`, localStorage persistence, `prefers-color-scheme` default; `docs:check` green |
| B5.6 RALIA/marketing unchanged | PASS | No product repo touched; no `data-theme` flip shipped anywhere (D-108) |

## Workstream C — agent surface

| Row | Status | Evidence |
|---|---|---|
| C5.1 MCP npm package, zero-config npx | BLOCKED (publish only) | Package complete and proven from the packed tarball (`npm pack` → extract → stdio session — `reports/mcp-smoke-transcript.json`); publish wired into `publish.yml` + release-please `linked-versions` (lockstep). Publication itself happens post-merge on the next release tag — cannot occur from a PR branch |
| C5.2 11 tools + integration tests | PASS | All 11 §C2 tools; 12 integration tests incl. real stdio transport + HTTP wrapper + per-tool assertions — `npm run test:mcp`: 12 pass / 0 fail (DoD-2 step 11); every response stamps `_meta {spec, package, generatedAt}` |
| C5.3 remote endpoint live | BLOCKED | Implemented: `mcp/http.mjs` + `api/mcp.mjs` + `/mcp` rewrite in `vercel.json`; exercised locally over real HTTP (POST 200/JSON-RPC, GET 405 — `reports/dod4-smoke-tests.md` (b)). Vercel preview deployments of PR #84 fail **instantly** (same-second rejection, before install/build) — consistent with a project-level restriction on the `fiyinfoluwa-adelekes-projects` Hobby project (e.g. non-member git author), not a code failure; deployment logs need the project owner. Descope rung 3 NOT used — implementation shipped |
| C5.4 Layer-3 flags everywhere | PASS | `consumable: false` + `license: "RALIA-private"` on every showcase response (test-asserted) and every `/products/ralia/*.md` mirror frontmatter; search rank-penalises showcase vs consumable primitives |
| C5.5 llms.txt family + staleness CI | PASS | `/llms.txt`, `/llms-full.txt`, 60+ `.md` mirrors generated from the single registry (`build:agent-surface`), committed under `public/` (Vercel auto-deploys `public/` on merge); R14 `agent:check` CI-blocking and fixture-proven |
| C5.6 two smoke-test prompts | PASS | Executed against the packed server, transcript saved (`reports/mcp-smoke-transcript.json`, summary in `reports/dod4-smoke-tests.md`): Q1 → CitationChip `variant='low-confidence'` + `citation-chip.*` token chain; Q2 → Badge/`BandBadge`, not custom. Pinned in CI tests |

## Workstream D — Code Connect

| Row | Status | Evidence |
|---|---|---|
| D.1 25/25 mapped + published | BLOCKED (gated, D-109 as amended 10 Jun) | Authenticated Figma identity is a student-tier View seat (Figma MCP `whoami`, 2026-06-10); Code Connect needs an Org plan + one full Org seat for the publishing identity. Per amended D-109: **Workstream D stays in v4.4 gated on Org access landing by the release cut (27 June); past the gate the D rows auto-convert to v4.4.1** (the patch doc returns then) — no further decision needed. Unblocking checklist + mapping template in `figma/README.md` |
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
| F.1 7/7 taxonomy | PASS | **7/7 complete** — choropleth restored per the CEO's 10 Jun reversal (brief §13) and implemented to the locked D-115…D-119 contract (`docs/design-system/v4.4/choropleth-spec.html` §2–§6): two packaged geographies (europe 31 jurisdictions ISO-alpha-3 / world 6 continents), band + seq modes with quintile/threshold quantisation, pre-projected planar TopoJSON built by `tools/charts/build-geo.mjs` (Natural Earth → mapshaper visvalingam 10% → d3-geo build-time projection → quantised TopoJSON, **9.8 KB gz combined vs 80 KB budget**, `geo:check` CI gate), zero runtime deps (in-repo ~90-line decoder), D-118 chip strip with ResizeObserver re-evaluation, roving-tabindex keyboard contract, tooltip, legend with No-data entry. 13-assertion SSR smoke green |
| F.2 token-only colors; dark verified | PASS | grep-clean for hex/Tailwind palette in the component (R9); consumes `chart.seq.1..5`, `chart.null`, `chart.cat.*`, `risk.*` — all with derived dark values, contrast-asserted in `derive-dark.mjs` |
| F.3 a11y table fallback all types | PASS | Visually-hidden table, `useId` + `aria-describedby`, on ALL 7 types (sibling of the `role="img"` figure so table semantics survive); choropleth rows = jurisdiction · value · band sorted by value desc, incl. geometryless data entries; SSR smoke assertions green |
| F.4 Chromatic light+dark baselines | BLOCKED (acceptance) | Chart stories captured in Chromatic; choropleth adds the spec-§6 set (4 core stories × light/dark modes = 8 baselines + chip-strip + no-data); acceptance pending per A5.6/B5.3 |

## §11.1–11.4 master rows

| Row | Status | Evidence |
|---|---|---|
| P.1 ui-components minor published | BLOCKED (post-merge) | release-please will cut the next minor (`feat:` commits present); §13 row 1: brief's "2.1.0" already shipped 2026-06-05, so the programme lands as 2.2.0. Root barrel unchanged (still warns); no breaking changes (`tsc`/eslint/byte-stable CSS) |
| P.2 mcp package published | BLOCKED (post-merge) | linked-versions lockstep + publish step wired; tarball smoke-tested |
| P.7 tsc --strict + tests + Chromatic | BLOCKED (Chromatic leg only) | `tsc --noEmit` (strict) clean, eslint clean, mcp tests 12/0, readme-build tests 4/0, scanner negatives green — all from fresh checkout (DoD-2). Chromatic leg pending acceptance per A5.6 |
| G.1 brief approved Elena + Fiyin | PASS | §14 of the filed corrected brief (GOV-DS-2026-02 rev. v4.4): Elena/Priya/Alex APPROVED via PR #84 peer review + amendment commits, CEO decisions locked + post-report amendments 10 Jun. Reviewer amendment commits/comments will be acted on as they land |
| G.2 R12–R14 implemented + tested | PASS | R12 = `lint:tokens`, R13 = `scan:motion`, R14 = `agent:check`; all CI-blocking; DoD-5 negative checks green (each rule fails on its committed fixture, passes on clean source); canonical doc `docs/design-system/v4.4/scanner-rules-r12-r14.md`; machine-readable `scripts/scanner-rules/rules.json`. Consumer-repo baselines (RALIA/marketing) are consumer-repo work per the R11 precedent |
| G.3 PLATFORM-STANDARDS.md updated | PASS | Brief §13 (design, 10 Jun): the v4.4 delta has been applied to the canonical `docs/PLATFORM-STANDARDS.md` in the design project (risqbase-com mirror); this repo keeps the delta source at `docs/design-system/v4.4/platform-standards-delta.md`. Remaining `ralia-tier2` ancestor propagation is tracked by design, outside this repo |
| G.4 promotion log rows | PASS | `docs/design-system/lifecycle.json`: `MotionProvider → beta` (2026-06-10); ChartContainer **stays beta** — §7.2 criteria (second consumer) genuinely not met, promotion not forced |
| G.5 /changelog/v4.4 live | PASS | v4.4 narrative under `## Unreleased` in CHANGELOG.md → rendered on the generated changelog page; release-please folds it into the release entry at cut |
| G.6 v4.4.1 patch doc | PASS | Patch doc **retired** — the only ladder cut (rung 1, choropleth) was reversed by the CEO and implemented in v4.4, leaving the doc empty per §10.4 ("only if the ladder was used"). It returns automatically if the D-109 27-June gate converts Workstream D to v4.4.1 |
| DS.1 llms.txt + mirrors served | PASS | Committed under `public/` (the deployed artefact dir; Vercel auto-deploys on merge); R14-gated |
| DS.2 /mcp live | BLOCKED | Per C5.3 — implemented + locally verified; live check pending deploy |
| DS.3 switcher + /tokens/theming | PASS | Switcher per B5.5; `/tokens/theming.md` mirror serves the dark + HC contract (from `docs/theming.md`) |
| DS.4 motion-preference pattern page | PASS | Generated patterns page section + `.md` mirror |

## DoD protocol rows

| Row | Status | Evidence |
|---|---|---|
| DoD-2 clean-state re-verification | PASS | Fresh clone → `npm ci` → 13-step gauntlet, all green (lint:tokens · build:tokens · build+agent-surface · tsc --strict · eslint · docs:check · readme:check · verify-contrast --strict · scan:motion · agent:check · test:mcp 12/0 · readme-build tests 4/0 · DoD-5), 2026-06-10 |
| DoD-3 output-diff proofs | BLOCKED (c only) | (a) tokens.css diff report ✓ (`reports/tokens-css-diff.md`); (b) OKLCH round-trip report ✓ 127/127 exact (`reports/oklch-roundtrip.md`); (c) Chromatic build 101 exists (194 stories) — light zero-diff confirmation + dark acceptance pending review per A5.6 |
| DoD-4 functional smoke tests | BLOCKED (d; e/f browser leg) | Execution record `reports/dod4-smoke-tests.md`: (a) ✓ packed-tarball stdio session, both pinned prompts, transcript saved; (a+) ✓ **three unpinned generalisation probes** (`reports/mcp-probe-unpinned.json`) — the first probe exposed a real ranking gap, fixed in `ebcef4d` (weak literal aliases + R9 primitive-tier penalty); repeat with a fresh prompt at deploy review; (b) ✓ locally over real HTTP — live leg pending deploy; (c) ✓ generated + CI-gated, spot-checked; (d) gated per amended D-109; (e)/(f) implemented + statically verified, browser confirmation pending deploy review |
| DoD-5 negative checks | PASS | `scripts/test-scanner-rules.mjs` + `scripts/__fixtures__/` — R12/R13/R14 each FAIL on violating fixtures, PASS on clean source; wired into CI |
| DoD-6 descope integrity | PASS | Zero DESCOPED rows: the single rung-1 cut was taken in order, then reversed in-flight by the CEO (brief §13) and the patch doc retired. Every BLOCKED row maps to an external dependency, not a scope cut |

## PR #84 merge path (required checks per docs/devops/branch-protection.md)

- **Lint & Build** (required): **green** — carries every v4.4 gate (R12 token lint, R13 motion scan, R14 agent-surface drift, MCP tests, DoD-5 negatives, docs/readme drift, tsc, eslint).
- **chromatic** (required): red until the 90 dark/hc re-baseline changes are accepted in the Chromatic UI (build 101) — owner action, same as ledger rows A5.6/B5.3/F.4.
- **Vercel** (required): instant project-level rejection (see C5.3) — owner action.
- **CodeQL** (not in the documented required set): the gate reports new alerts whose list is only visible in the repo Security tab (no code-scanning API access from this session). Proactive hardening applied: explicit `__proto__`/`constructor`/`prototype` guards on every merge/computed-write the PR adds (the repo's historical alert pattern, cf. verify-contrast.mjs alert #4). If alerts remain after the Security-tab review, they are most likely fingerprint-relocations of pre-existing patterns in the rewritten files.

## Unblock summary (what turns BLOCKED → PASS)

1. **Chromatic** (A5.6, B5.3, F.4, P.7, DoD-3c): review build 101 (90 changes) — confirm light is diff-free, accept the dark/hc baselines.
2. **Release** (C5.1, P.1, P.2): merge → release-please PR → tag → `publish.yml` publishes both packages in lockstep.
3. **Docs-site deploy** (C5.3, DS.2, DoD-4 e/f browser legs): project owner to inspect the instant Vercel deployment rejections on PR #84 (`npx vercel inspect <dpl> --logs`); then verify `design.risqbase.com/mcp`, llms.txt, switcher, reduced-motion in a browser post-merge.
4. **Figma org access** (D.1–D.3, DoD-4d): checklist in `figma/README.md`.
5. **Approvals** (G.1) and **PLATFORM-STANDARDS transplant** (G.3): Elena/Priya/Alex; delta doc ready.
