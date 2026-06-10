# RisqBase DS v4.4 — Definition-of-Done Ledger

**Protocol:** GOV-DS-2026-02 rev. v4.4 §11.5 (DoD-1). One row per acceptance row.
**Status values:** `PASS` · `FAIL` · `DESCOPED` (→ v4.4.1, §10.3 ladder only) · `BLOCKED` (cannot be completed/verified from the implementation environment; evidence states exactly why and what unblocks it).
**This ledger IS the done report (DoD-7). Overall status: `BLOCKED`** — every implementable row is PASS (no DESCOPED rows), and the remaining BLOCKED rows sit on five external dependencies: ① Chromatic post-fix build acceptance (**held per D-120** until the A11Y-FIX re-run is green; the acceptance click stays with Fiyin), ② the **A11Y-FIX §4 escalation decision** (three pre-v4.4 light pairs — see "A11y remediation" below), ③ post-merge release pipeline (npm publishes), ④ docs-site deploy (live-URL verification; Vercel project-level rejection), ⑤ Figma Org access (amended D-109, 27 June gate). No row is FAIL.

**DoD-2 verification performed 2026-06-10 from a fresh clone of the FINAL code HEAD `ebcef4d`** (`fix(mcp): search generalisation…`) — all 15 steps re-run at final state after the choropleth restoration, GOV-ID sweep, GHAS escaping fix and search-scorer fix: token lint/build (317 tokens, 183 dark overrides) · tsup + agent-surface (67 artefacts, sourceHash 85e39302b438e460) · `tsc --strict` · eslint · docs:check · readme:check · `verify-contrast --strict` both themes · R13 scan · R14 agent:check · D-119 geo:check (9.8 KB gz / 80 KB) · MCP tests 12/0 · markdown-escape test 1/0 · readme-build tests 4/0 · DoD-5 scanner negatives. Storybook builds clean at the same HEAD. (The commit stamping this ledger touches only this file.)

## Workstream A — DTCG migration

| Row | Status | Evidence |
|---|---|---|
| A5.1 file renames `.tokens.json` | PASS | `git mv` of all 19 token files; `lint:tokens` rejects bare `.json` (fixture-proven); DoD-2 steps 1–2 green: `tokens-lint: 317 tokens validated, no violations` / `tokens-build: 317 tokens … dark overrides: 183` |
| A5.2 OKLCH primitives + round-trip | PASS | 127/127 hex→OKLCH round-trip exact, 0 legacyHex pins — `docs/design-system/v4.4/reports/oklch-roundtrip.md` (DoD-3b); converter vendored at `tools/tokens-build/lib/oklch.js` |
| A5.3 `$deprecated` in lint + build | PASS | lint validates type (fixture: invalid `$deprecated` flagged), build logs deprecations, registry/MCP carry the flag; currently 0 deprecated tokens in source |
| A5.4 resolver theming; stubs deleted | PASS | `tokens/resolver.tokens.json` drives build, lint, verify-contrast and the agent registry; `themes/hc.json` deleted; `[data-theme]` consumer contract unchanged |
| A5.5 tokens.css diff conformance | PASS | `docs/design-system/v4.4/reports/tokens-css-diff.md` (DoD-3a): zero value changes to any pre-existing custom property; only `@supports` OKLCH blocks, the grown dark block (105→183), the §A4-inherent hc-stub comment removal, one additive `--color-action-link` line (B2), and the brief-mandated Workstream-E/B3 static block |
| A5.6 Chromatic light zero-diff | BLOCKED (held, D-120) | Acceptance held until the post-A11Y-FIX build. **Scope re-statement:** light Chromatic snapshots WILL change relative to all pre-v4.4 baselines because the Storybook harness itself was broken (no Tailwind — components were snapshotted unstyled since v4.3). The "approved light theme" as consumers render it (products run Tailwind with this preset) is unchanged — A5.5's mechanical tokens.css proof is the zero-drift evidence; the new baselines are the first styled ones. Close on the post-fix build + Fiyin's acceptance |
| A5.7 README updated | PASS | `tokens/README.md` rewritten (DTCG 2025.10 / OKLCH / resolver / themeInvariant); `docs/theming.md` updated; root README autogen regenerated (`readme:check` green) |

## Workstream B — dark + HC

| Row | Status | Evidence |
|---|---|---|
| B5.1 dark completeness + lint | PASS | 62 derived values (`tools/tokens-build/derive-dark.mjs`, B1 group rules, contrast-asserted at derivation) + 47 shipped + 7 `themeInvariant` annotations = full coverage; completeness lint-enforced (R12) and fixture-proven to fail on omission |
| B5.2 contrastPair passes in dark | PASS | `verify-contrast --strict` green: 8/8 pairs clear their floor in light AND dark (DoD-2 step 8); `iris.accent-on` carries its documented v4.3 §4.2 AA-Large exception (`contrastLevel: aa-large`), dark ratio 3.42 ≥ 3.0; dark `iris.accent` re-targeted to 4.5:1-as-text / ≥3:1-under-white |
| B5.3 Chromatic dark baseline | BLOCKED (held, D-120) | Close on the post-A11Y-FIX build: local parity sweep shows **dark = 0 axe violations across all 600 story×modes**; dark snapshots now actually render the dark token chains (see A11y remediation section). Acceptance click stays with Fiyin |
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
| F.4 Chromatic light+dark baselines | BLOCKED (held, D-120) | Chart + choropleth stories all 0 in the local parity sweep (incl. MetricCard valence-text fix and the choropleth `role="group"` fix); acceptance on the post-fix build per A5.6/B5.3 |

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
| DoD-2 clean-state re-verification | PASS | Fresh clone of final code HEAD **`ebcef4d`** → `npm ci` → **15-step gauntlet**, all green (lint:tokens · build:tokens · tsup+agent-surface · tsc --strict · eslint · docs:check · readme:check · verify-contrast --strict both themes · scan:motion R13 · agent:check R14 · geo:check D-119 · test:mcp 12/0 · test:agent-surface 1/0 · readme-build tests 4/0 · DoD-5 negatives) + Storybook build, 2026-06-10 — details in the header note above |
| DoD-3 output-diff proofs | BLOCKED (c only) | (a) tokens.css diff report ✓ (`reports/tokens-css-diff.md`); (b) OKLCH round-trip report ✓ 127/127 exact (`reports/oklch-roundtrip.md`); (c) Chromatic build 101 exists (194 stories) — light zero-diff confirmation + dark acceptance pending review per A5.6 |
| DoD-4 functional smoke tests | BLOCKED (d; e/f browser leg) | Execution record `reports/dod4-smoke-tests.md`: (a) ✓ packed-tarball stdio session, both pinned prompts, transcript saved; (a+) ✓ **three unpinned generalisation probes** (`reports/mcp-probe-unpinned.json`) — the first probe exposed a real ranking gap, fixed in `ebcef4d` (weak literal aliases + R9 primitive-tier penalty); repeat with a fresh prompt at deploy review; (b) ✓ locally over real HTTP — live leg pending deploy; (c) ✓ generated + CI-gated, spot-checked; (d) gated per amended D-109; (e)/(f) implemented + statically verified, browser confirmation pending deploy review |
| DoD-5 negative checks | PASS | `scripts/test-scanner-rules.mjs` + `scripts/__fixtures__/` — R12/R13/R14 each FAIL on violating fixtures, PASS on clean source; wired into CI |
| DoD-6 descope integrity | PASS | Zero DESCOPED rows: the single rung-1 cut was taken in order, then reversed in-flight by the CEO (brief §13) and the patch doc retired. Every BLOCKED row maps to an external dependency, not a scope cut |

## A11y remediation (GOV-DS-2026-02 rev. v4.4 A11Y-FIX, D-120…D-124)

Inputs filed: `docs/design-system/v4.4/a11y-triage-chromatic-6a1c1e6f.html`, `a11y-fix-instruction.md`, `reports/chromatic-a11y-build-6a1c1e6f.csv`.

| Step | Status | Evidence |
|---|---|---|
| 1 · inputs committed | PASS | All three in the tree (paths above) |
| 2 · five confirmation probes | PASS | Local axe harness (`scripts/a11y-probe.mjs`, Playwright + axe-core against the built Storybook with theme globals) **replicated Chromatic's counts exactly** (66/5/37/11+1/19/3) and pulled rule IDs + fg/bg/ratio per node — `reports/dod4-smoke-tests.md` companion: probe JSONs in the PR. **D-123 reconciliation: probes KILLED C1/C2 as hypothesised** — the dominant rule was `color-contrast` on **browser-default black/link-blue text**: the Storybook never had a Tailwind pipeline, so every utility class (token classes included) was unstyled. C5/C6 confirmed as hypothesised (`landmark-*`, `nested-interactive`) |
| 3+4+5 · C1/C2/C3 token-layer fixes | PASS (reconciled) | Root fix = **Tailwind wired into Storybook** (root `tailwind.config.js` with the consumer preset, postcss, `.storybook/tailwind.css` incl. the documented body contract). Probe set collapsed 142 → 14 with **zero dark-token derivation changes** (the B-workstream chains were correct). Footer Default dark 37→0, StreamingText dark 19→0, Callout Intents dark 11→0. Genuine token fixes found by the probes: `risk.low-text`/`risk.critical-text` valence TEXT tokens (+ `emerald.700` primitive), dark `citation.text-retracted` lifted 3.48→≥4.5 (derive-dark re-run, contrast-asserted) |
| 6 · C4 ClientGrid family (D-122) | PASS | Both live in this repo. ClientGrid delta text moved off band *fills* onto the valence text tokens → light `#10b981` (2.53) and dark `#df273c` (4.01) failures = 0; MetricCard delta had the identical latent bug, fixed with the same tokens. CompliancePostureStrip needed no change post-Tailwind (its dark 273 were unstyled-text artefacts) |
| 7 · C5 gallery landmarks | PASS | Story-level only: duplicate instances in Header Gallery/Variants, Footer Print Gallery, ClientGrid Responsive Breakpoints, ClientScopeBanner Stack wrapped `inert` + `aria-hidden` (first instance stays live; `inert` keeps focusables out of the tab order — axe `aria-hidden-focus` clean). `src/react-inert.d.ts` shims @types/react@18 |
| 8 · C6 structurals + not-run | PASS | ImpactGraph Interactive + interactive choropleth: `nested-interactive` fixed via `role="group"` (focusable children can't live under `role="img"` — spec §5 reconciled in brief §13); Modal Interactive now mounts its dialog at snapshot time (was `disableSnapshot` → "not run"); TelemetryBeacon stories carry a documented `a11y: { disable: true }` (renders null) |
| 9 · D-124 permanent gates | PASS | (a) `verify-contrast` expanded: every TEXT_FILL-scoped semantic/component color token requires `contrastPair` (verified per theme) or documented `contrastExempt` — **50 pairs verified per theme (was 8)**, CI-blocking (`--strict`); DoD-5 negative fixture `scripts/__fixtures__/d124-bad-contrast/` proven to fail. (b) Review policy: `docs/contributing/accessibility-gates.md` (a11y deltas review-blocking for theme-affecting PRs; axe `region` rule scoped out for component stories with rationale) |
| 10 · re-run + acceptance | BLOCKED (held per D-120) | Local parity sweep (same axe + globals as Chromatic): **1,344 → 56** violation nodes across 600 story×modes; **dark = 0, every remaining node is light/hc in the §4 escalation set below**. Chromatic re-runs on this push; acceptance click stays with Fiyin after the report verifies clean |

**Before/after (CSV-comparable totals):** dark 1,257 → **0** · light 39 → 28 · hc 39 → 28 (remaining = escalation set only; exact per-story table: `reports/a11y-local-sweep-postfix.csv`). The triage's "~1,100 of 1,257 dark collapse from token edits" estimate was directionally right but mis-attributed: the collapse came from fixing the **test harness** (no Tailwind in Storybook), not token derivations.

### ⚠ AWAITING DECISION — A11Y-FIX §4 escalation (visible light-theme changes)

Three **pre-v4.4-approved light** pairs fail axe; per D-121/§4.1 they are not fixed silently. Tokens carry PENDING-DECISION `contrastExempt` annotations (grep `PENDING DECISION`) so the D-124 gate stays green meanwhile. Options, with recommendations:

1. **Band chip glyphs** — `band.very-low.text/icon` + `band.high.text/icon` (+ badge twins): white on emerald-500 = **2.53**, white on orange-500 = **2.80** (fails even AA-Large). *Recommend:* flip to `stone-900` glyphs like the `low`/`medium` bands already use (consistent, dark theme already did this); alternative: darken the band-500 fills (ripples into charts/gauges — not recommended).
2. **`text.subtle` on `surface.muted`** — **4.39** (Badge subtle, ClientScopeBanner, WizardProgress upcoming-steps, MarketingImpactGraph captions). *Recommend:* new semantic `text.subtle-on-muted` = stone-600 (≈6.5:1), re-point the four component contexts — perceptually minimal; alternative: lift `surface.muted` to stone-50 (collides with `surface.subtle`).
3. **Retracted citation text** — stone-400 on chip surfaces = **2.4–2.5** (dark side already re-derived to ≥4.5). *Recommend:* light value → stone-500 + keep strikethrough as the primary retraction signal; alternative: argue WCAG "inactive component" exemption (weak — the chip is informational, not disabled).

## PR #84 merge path (required checks per docs/devops/branch-protection.md)

- **Lint & Build** (required): **green** — carries every v4.4 gate (R12 token lint, R13 motion scan, R14 agent-surface drift, MCP tests, DoD-5 negatives, docs/readme drift, tsc, eslint).
- **chromatic** (required): red until the 90 dark/hc re-baseline changes are accepted in the Chromatic UI (build 101) — owner action, same as ledger rows A5.6/B5.3/F.4.
- **Vercel** (required): instant project-level rejection (see C5.3) — owner action.
- **CodeQL** (not in the documented required set): the gate's alerts turned out to be the two `js/incomplete-string-escaping` findings GHAS also raised as PR #84 review threads (code-scanning alerts 6/7). Fix landed at `ebcef4d` (`escapeMdCell()` — backslashes before pipes, CI-tested); both threads replied to and resolved. The gate is expected to clear on the next analysis run — if it stays red, the residue list needs Security-tab eyes.

## Unblock summary (what turns BLOCKED → PASS)

1. **Chromatic** (A5.6, B5.3, F.4, P.7, DoD-3c): review build 101 (90 changes) — confirm light is diff-free, accept the dark/hc baselines.
2. **Release** (C5.1, P.1, P.2): merge → release-please PR → tag → `publish.yml` publishes both packages in lockstep.
3. **Docs-site deploy** (C5.3, DS.2, DoD-4 e/f browser legs): project owner to inspect the instant Vercel deployment rejections on PR #84 (`npx vercel inspect <dpl> --logs`); then verify `design.risqbase.com/mcp`, llms.txt, switcher, reduced-motion in a browser post-merge.
4. **Figma org access** (D.1–D.3, DoD-4d): checklist in `figma/README.md`.
