# RisqBase Design System v4.4 — State-of-the-Art Brief (GOV-DS-2026-03)

**Document ID:** GOV-DS-2026-03
**Version:** 4.4 (implementation brief)
**Classification:** MANDATORY — implementation contract
**Date:** 10 June 2026
**Prepared by:** Claude (Design) — State-of-the-Art Assessment programme
**Decisions locked by:** Fiyin Adeleke (CEO) · decision questionnaire, 10 June 2026
**Supersedes:** nothing — extends GOV-DS-2026-02 (v4.3). v4.3 remains canonical for everything not amended here. The v4.4 *token extension* (docs/specs/v2.1.0/00b-v4.4-token-extension.md, shipped 2026-05-21 with package 2.1.0) is folded into this v4.4 programme.
**Implementation handover:** Claude Code
**Target:** 30 June 2026 — single date, aligned to docs-site launch (D-113).

> **Repo excerpt.** As with GOV-DS-2026-02, the canonical running text of this
> brief is the approval-tracked artefact delivered in conversation on
> 10 June 2026. This file carries the sections the implementation programme
> works against: locked decisions, workstream acceptance rows, scanner-rule
> additions, the descope ladder, the §11.5 Definition of Done, and the live
> §13 implementation-decisions table.

---

## §1 Gaps closed by v4.4

| # | Gap | Workstream |
|---|---|---|
| G-1 | No agent surface (MCP + machine-readable docs + Code Connect) | C, D |
| G-2 | Token source predates DTCG 2025.10 stable | A |
| G-3 | Dark + HC themes incomplete | B |
| G-4 | Motion preference is media-query-only | E |
| G-5 | Chart taxonomy incomplete (v4.4 commitment) | F |

## §2 Locked decisions (summary)

| ID | Locked choice |
|---|---|
| D-101 ⚠ | MCP both transports at once: npm `@risqbase-inc/ui-components-mcp` (stdio) + remote Streamable HTTP at `design.risqbase.com/mcp`. Risk mitigated by descope rung 3. |
| D-102 | MCP v1 read-only. No codegen/write tools. |
| D-103 | Full machine-readable docs: `llms.txt` + `llms-full.txt` + per-page `.md` mirrors. |
| D-104 | Layer-3 exposed to agents with `consumable: false` + `license: "RALIA-private"` flags. |
| D-105 | Full DTCG 2025.10 conformance: `.tokens.json`, `$deprecated`, resolver/`$extends` theming. Build outputs byte-stable. |
| D-106 | OKLCH `$value`s in color primitives; build emits `oklch()` + hex fallback; round-trip-exact to current hex. |
| D-107 | Full dark theme + forced-colors/`prefers-contrast` HC compliance pass. No custom HC token theme. |
| D-108 | Dark rollout is DS-level only (tokens, components, docs-site switcher). |
| D-109 | Figma Code Connect in scope: all Layer 1 + Layer 2 components. |
| D-110 | `MotionProvider` + `useReducedMotion` + documented toggle pattern in `core/`. localStorage persistence; OS default; user override. |
| D-111 | Spec v4.4 · package minor. Nothing breaks consumers. v5.0 reserved for root-barrel removal. |
| D-112 | Charts kept: `heatmap`, `area`, `choropleth`, `metric-card` complete the 7-type taxonomy. |
| D-113 ⚠ | Everything targets 30 June 2026. Descope ladder §10.3 applies unilaterally. |
| D-114 | Out of scope: Web Components, MCP write tools, RALIA dark mode, telemetry expansion, custom HC theme, remote-MCP auth. |

## §3–§8 Workstream acceptance rows

### A — DTCG 2025.10 token-source migration (§A5)
- [ ] A5.1 All token files renamed `.tokens.json`; build + lint green
- [ ] A5.2 All color primitives OKLCH; round-trip report shows 100% exact or `legacyHex`-pinned
- [ ] A5.3 `$deprecated` supported by lint + build
- [ ] A5.4 Resolver-based theming in place; theme stubs deleted
- [ ] A5.5 `dist/tokens.css` diff vs v4.3-era build: zero changes outside (a) hex→`oklch()`+fallback notation, (b) the Workstream-B dark block
- [ ] A5.6 Chromatic visual regression: zero diffs in light theme
- [ ] A5.7 README.md updated

### B — Dark theme + high-contrast pass (§B5)
- [ ] B5.1 Dark values for every semantic + component color token; lint enforces completeness
- [ ] B5.2 All `contrastPair` checks pass in dark
- [ ] B5.3 Chromatic dark baseline: all 25 components snapshotted, reviewed, accepted
- [ ] B5.4 Forced-colors audit complete; explicit `forced-colors` CSS where required; documented
- [ ] B5.5 Docs-site theme switcher live
- [ ] B5.6 RALIA / marketing unchanged

### C — Agent surface (§C5)
- [ ] C5.1 `@risqbase-inc/ui-components-mcp` published; works via `npx` with zero config
- [ ] C5.2 All 11 tools implemented per C2 contract; integration test per tool
- [ ] C5.3 Remote endpoint live at `design.risqbase.com/mcp`
- [ ] C5.4 Layer-3 flags present in every showcase response and mirror page
- [ ] C5.5 `/llms.txt`, `/llms-full.txt`, all `.md` mirrors live and CI-checked for staleness
- [ ] C5.6 Smoke tests: low-confidence-citation prompt → `CitationChip variant="low-confidence"` + token chain; risk-band-chip prompt → `BandBadge`

### D — Figma Code Connect (§6)
- [ ] D.1 25/25 Layer 1+2 components mapped and published
- [ ] D.2 Variable code syntax set for all color/dimension variables
- [ ] D.3 Spot-check set (Button, Badge, Card, Modal, CitationChip, Gauge) returns package imports in Dev Mode
- [ ] D.4 Publish step wired into release pipeline

### E — Motion preference (§7)
- [ ] E.1 `MotionProvider` + `useReducedMotion` shipped in `core/`, state `beta`
- [ ] E.2 4 animated primitives consume the hook; media-query fallback intact when no provider present
- [ ] E.3 `motion-preference` recipe page live
- [ ] E.4 Reduced mode verified on all animated primitives in Storybook

### F — ChartContainer completion (§8)
- [ ] F.1 4 new chart types shipped; 7/7 taxonomy complete
- [ ] F.2 Token-only color consumption (R9 clean); dark verified
- [ ] F.3 A11y table fallback on all 7 types
- [ ] F.4 Chromatic light + dark baselines accepted

## §9 Scanner rules — additions

Brief numbering R11–R13 collides with the shipped v4.3 R11
(`iris.accent-on` contrast guard, PR #52). Renumbered **R12–R14** — see
§13 row 2026-06-09·2.

| Rule | Description |
|---|---|
| **R12** (brief "R11") | Token source hygiene — `tokens/**` passes DTCG 2025.10 validation; color primitives OKLCH-only; dark theme may not omit keys present in light |
| **R13** (brief "R12") | Motion gating — animated CSS in component code must be gated on `[data-motion]` or `prefers-reduced-motion` |
| **R14** (brief "R13") | Agent-surface freshness — registry, llms.txt family, and `.md` mirrors regenerate in the same commit as any change to component types, tokens, or recipes |

## §10.3 Descope ladder — pre-agreed, apply unilaterally, in order

| Rung | Cut | Ships instead |
|---|---|---|
| 1 | `choropleth` chart type | 6/7 taxonomy; choropleth → v4.4.1 |
| 2 | `metric-card` chart type | 5/7 taxonomy → v4.4.1 |
| 3 | Remote MCP endpoint | npm stdio package only; remote → v4.4.1 |
| 4 | Code Connect long tail | Spot-check set of 6 mapped; remaining 19 → v4.4.1 |
| 5 | Forced-colors audit | Dark still ships; HC pass → v4.4.1 |

**Never cut:** Workstream A, dark theme tokens + component verification,
npm MCP package + tool surface, llms.txt family, MotionProvider.

## §11 Master checklist

### 11.1 Package
- [ ] P.1 `@risqbase-inc/ui-components` next minor published (no breaking changes; root barrel still warns)
- [ ] P.2 `@risqbase-inc/ui-components-mcp` published (lockstep version)
- [ ] P.3–P.6 Workstream A, B, E, F rows complete
- [ ] P.7 `tsc --strict` clean; type tests pass; Chromatic light + dark baselines accepted

### 11.2 Agent surface
- [ ] AS.1 Workstream C rows complete, including the two smoke-test prompts
- [ ] AS.2 Workstream D rows complete

### 11.3 Governance
- [ ] G.1 Brief approved by Elena + Fiyin (§14)
- [ ] G.2 R12–R14 implemented + tested; baselines regenerated per consumer
- [ ] G.3 PLATFORM-STANDARDS.md updated (MotionProvider, MCP package, chart types)
- [ ] G.4 Promotion log: `MotionProvider → beta` row; `ChartContainer` promotion row only if §7.2 criteria genuinely met
- [ ] G.5 `/changelog/v4.4` page live
- [ ] G.6 If descope ladder used: `RisqBase-DS-v4.4.1-Patch.md` created with the cut rows

### 11.4 Docs site
- [ ] DS.1 `/llms.txt`, `/llms-full.txt`, `.md` mirrors served
- [ ] DS.2 `/mcp` endpoint live (or DESCOPED per rung 3)
- [ ] DS.3 Theme switcher live; `/tokens/theming` page documents dark + HC contract
- [ ] DS.4 `/patterns/motion-preference` recipe page live

### 11.5 Definition of Done

DoD-1 evidence ledger (`RisqBase-DS-v4.4-DoD-Ledger.md`) · DoD-2
clean-state re-verification · DoD-3 output-diff proofs · DoD-4 functional
smoke tests executed · DoD-5 negative scanner-rule checks
(`scripts/__fixtures__/`) · DoD-6 descope integrity · DoD-7 the done
report is the completed ledger; any FAIL/BLOCKED row makes the report
status **blocked**, never "done with caveats".

## §12 Out of scope (D-114)

Web Components distribution · MCP write/codegen tools · RALIA/marketing
dark mode · custom high-contrast token theme · telemetry expansion ·
remote-MCP auth.

## §13 Decisions made during implementation

| Date | Decision | Choice | Analogue |
|---|---|---|---|
| 2026-06-09 | Package version target. Brief says 2.1.0, but 2.1.0 already shipped (2026-06-05, with the v4.4 token extension) and the repo is at 2.1.3. | Next **minor** via release-please (`feat:` commits → 2.2.0). MCP package versioned in lockstep. | D-111 ("minor; nothing breaks consumers"); release-please is the repo's versioning authority. |
| 2026-06-09 | Scanner-rule numbering. Brief's new R11 collides with shipped v4.3 R11 (iris contrast guard). | New rules renumbered R12 (token hygiene), R13 (motion gating), R14 (agent-surface freshness). | v4.3 added R11 sequentially after R1–R10; continue the sequence. |
| 2026-06-09 | Dark derivation baseline. Brief §B1 assumes empty dark stubs, but 47 dark tokens shipped in 2.1.x (BRIEF-401 Phase 2.2, documented OKLCH rationale, different values than B1's table — e.g. surfaces #101214-family, not stone-900). | Keep the shipped 47 values (already consumer-visible in 2.1.x; B1's "derived, not improvised" intent is satisfied by their documented derivation). Derive the missing tokens with the same methodology, B1 contrast contract enforced for all. | v4.3 D-001..D-003 pattern: ratify what shipped when doc and code drift. |
| 2026-06-09 | OKLCH fallback emission. Brief A3 says "emit hex first, oklch() second as override, @supports not required" — but CSS custom properties are not validated at declaration time, so a bare second declaration always wins regardless of support. | Hex declared in the base block; `oklch()` override wrapped in `@supports (color: oklch(0% 0 0))`. Same progressive-enhancement intent, actually functional. | A3's zero-visual-drift contract. |
| 2026-06-09 | OKLCH conversion library. `culori` adds a runtime dep for a build-only concern. | Deterministic in-repo converter (`tools/tokens-build/lib/oklch.js`), CSS Color 4 reference math, round-trip-verified against every token by the report script. Pinned by being vendored. | A3 allows "culori or equivalent; pin the library version". |
| 2026-06-09 | Derived outputs other than tokens.css (`tailwind-tokens.js`, `figma-tokens.json`, `src/tokens/generated.ts`) | Keep emitting sRGB hex (computed from the OKLCH source). A5.5's byte-stability contract covers consumer-visible outputs; Figma payload requires hex. | A4 "build outputs stay byte-stable". |
| 2026-06-09 | `Theme` type / `setTheme('hc')`. A4 deletes the HC token theme, but removing the `'hc'` union member breaks consumers. | Keep `'hc'` in the runtime `Theme` type, JSDoc-deprecated; `[data-theme="hc"]` no longer emits a CSS block (it never had values). Removal lands v5.0. | D-111 nothing breaks consumers. |
| 2026-06-09 | Recipes source location. Brief C2 reads recipes from `docs/recipes/*.mdx` frontmatter; the directory did not exist. | Created `docs/recipes/*.md` with YAML frontmatter matching the v4.1 §20 schema; agent-surface build parses these. | C2's stated source path, minus the JSX dependency of `.mdx` (nothing renders MDX in this repo). |
| 2026-06-09 | Showcase (Layer-3) registry source. No machine-readable Layer-3 source existed in this repo (Layer-3 lives in RALIA). | Authored `docs/showcase/*.json` carrying the four v4.3 Layer-3 entries with composition data; flagged `consumable: false`, `license: "RALIA-private"` per D-104. | D-104; v4.3 §2 Layer-3 catalogue. |
| 2026-06-09 | PLATFORM-STANDARDS.md (§11.3 G.3) does not exist in this repo or its docs tree. | Standards updates recorded in `docs/design-system/v4.4/platform-standards-delta.md` for transplant into the canonical document wherever it lives (likely the org-level repo). Row reported BLOCKED, not silently skipped. | §13 protocol: nearest-analogue + record. |
