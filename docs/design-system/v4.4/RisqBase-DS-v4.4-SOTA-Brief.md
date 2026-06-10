# RisqBase Design System v4.4 — State-of-the-Art Brief

**Document ID:** GOV-DS-2026-02 · revision v4.4 *(corrected 10 Jun — the GOV-DS ID tracks the document, not the version; an earlier draft mis-minted "GOV-DS-2026-03")*
**Version:** 4.4 (implementation brief)
**Classification:** MANDATORY — implementation contract
**Date:** 10 June 2026
**Prepared by:** Claude (Design) — State-of-the-Art Assessment programme
**Decisions locked by:** Fiyin Adeleke (CEO) · decision questionnaire, 10 June 2026
**Supersedes:** amends GOV-DS-2026-02 rev. v4.3 (Comprehensive) — same document ID, new revision. v4.3 remains canonical for everything not amended here.
**Package version:** `@risqbase-inc/ui-components@2.1.0` (minor)
**Implementation handover:** Claude Code
**Target:** **30 June 2026** — single date, aligned to docs-site launch (D-113). Descope ladder in §10.3 is pre-agreed; no mid-flight scope negotiation required.

---

## Reading order

1. **§1 Assessment summary** — why v4.4 has this shape.
2. **§2 Locked decisions** — D-101…D-114. Every gray area is closed here. Do not re-open.
3. **§3–§8 Workstreams A–F** — full specs.
4. **§9 Scanner rules** — R11–R13 additions.
5. **§10 Sequencing + descope ladder** — what to cut, in what order, if 30 June is at risk.
6. **§11 Acceptance criteria** — the contract. v4.4 ships when every row is `[x]` (or its row is explicitly descoped per §10.3). **§11.5 is the Definition of Done** — the verification protocol that must be executed before "done" may be reported.
7. **§12 Out of scope** — explicitly excluded; do not build.

This document is written for Claude Code. Where a choice existed, it has
been made. If an undocumented decision is genuinely encountered, the rule
is: **match the nearest analogous v4.3 decision, record it in §13, and
continue** — do not block.

---

## §1 Assessment summary (June 2026)

Full assessment delivered in conversation, 10 June 2026. Condensed:

### 1.1 Already at or beyond state of the art — do not touch

| Area | Evidence |
|---|---|
| Three-layer model (system / domain / product-showcase) | Matches Primer / Carbon / Polaris convergence; matches 2026 "core + intelligent overrides" enterprise pattern |
| Three-tier DTCG-format token graph | Bet placed pre-standardisation; DTCG is now the industry interop standard |
| Promotion lifecycle with telemetry gates | Ahead of industry, which is still mid-struggle on contribution governance |
| Scanner rules R1–R10, CI-blocking | Ahead of industry |
| WCAG 2.2 AA component contracts + `contrastPair` CI | At standard |

### 1.2 Gaps closed by v4.4

| # | Gap | Industry movement | Workstream |
|---|---|---|---|
| G-1 | **No agent surface.** System is built *by* agents (Claude Code) but not consumable *by* agents. Scanner rules catch violations after generation; nothing prevents them before. | Design-system MCP servers are the emerging norm; expectation is every major component library ships one by end of 2026. Figma opened agent write-access + Skills in March 2026. | **C** (MCP + llms.txt), **D** (Code Connect) |
| G-2 | **Token source predates DTCG 2025.10 stable** (28 Oct 2025): custom theme mechanism instead of spec-native theming; no `$deprecated`; non-standard file extension; sRGB-hex-only color. | DTCG 2025.10 is the first stable release: `$extends` theming, CSS Color 4 spaces (OKLCH/P3), `.tokens.json` media type. | **A** |
| G-3 | **Dark + HC themes are empty stubs** (since v4.2). Now a baseline expectation, not an advanced feature. | Universal at world-class systems; DTCG theming is the machinery. | **B** |
| G-4 | **Motion preference is media-query-only.** | Leaders ship in-UI reduce-motion controls with escape hatches, OS setting as default. | **E** |
| G-5 | Chart taxonomy incomplete (promised v4.4). | n/a — existing commitment. | **F** |

### 1.3 Watched, not chased

Web Components distribution (Polaris-style) — monitored, **out of scope** (§12).

---

## §2 Locked decisions

All decisions below are **LOCKED** as of 10 June 2026. ⚠ marks the two
decisions where the CEO overrode the assessment recommendation; the
accepted risk is recorded inline.

| ID | Decision | Locked choice |
|---|---|---|
| **D-101** ⚠ | MCP distribution | **Both transports at once in v4.4**: npm package `@risqbase-inc/ui-components-mcp` (stdio) **and** remote Streamable HTTP at `https://design.risqbase.com/mcp`. *Accepted risk: remote endpoint depends on the docs-site infra also landing 30 June; mitigated by descope ladder rung 3 (§10.3).* |
| **D-102** | MCP capabilities v1 | **Read-only.** Components, tokens, recipes, lifecycle, a11y contracts, usage rules. No codegen tools, no write tools. |
| **D-103** | Machine-readable docs | **Full treatment:** `llms.txt` + `llms-full.txt` + per-page `.md` mirrors of every component / token-group / recipe / showcase page. |
| **D-104** | Layer-3 exposure to agents | **Included**, with machine-readable `consumable: false` + `license: "RALIA-private"` flags on every Layer-3 entry, in both MCP responses and `.md` mirrors. |
| **D-105** | DTCG conformance depth | **Full 2025.10 conformance:** `.tokens.json` rename, `$deprecated`, spec-native `$extends`/resolver theming replaces the custom `themes/*.json` restate-the-path mechanism. Build outputs stay byte-stable (see A4). |
| **D-106** | Color source of truth | **OKLCH `$value`s** in primitives; build emits `oklch()` with hex fallback. Conversion is round-trip-exact to current hex (A3). |
| **D-107** | Theme scope | **Full dark theme** (every semantic + component token; every Layer 1/2 component verified) **+ forced-colors / `prefers-contrast` HC compliance pass** (Carbon/Fluent approach). No full custom HC theme. |
| **D-108** | Dark rollout boundary | **DS-level only**: tokens, components, docs-site switcher. RALIA / marketing adoption are separate product decisions, not v4.4 scope. |
| **D-109** | Figma Code Connect | **In scope.** CEO confirms Figma library is current and on Org/Enterprise plan. Map all Layer 1 + Layer 2 components. **AMENDED 10 Jun (post-report):** premise failed — authenticated seat is student-tier View, not Org/Enterprise. Workstream D **stays in v4.4** (PR #84 unreleased), gated on Figma Org access landing **by the release cut (27 June)**; one full Org seat for the publishing identity is sufficient. If access hasn't landed by then, D rows auto-convert to v4.4.1 — no further decision needed. |
| **D-110** | Reduce-motion toggle | **Ship `MotionProvider` + `useReducedMotion` hook + documented toggle pattern** in `core/`. localStorage persistence; OS setting is the default; user choice overrides. |
| **D-111** | Versioning | **Spec v4.4 · package 2.1.0 (minor).** Nothing breaks consumers. v5.0 stays reserved for the root-barrel removal. |
| **D-112** | Charts | **Kept in v4.4**: `heatmap`, `area`, `choropleth`, `metric-card` complete the v4.1 §8.1.1 taxonomy. |
| **D-113** ⚠ | Timeline | **Everything targets 30 June 2026** (docs-site date, one day before RALIA launch). *Accepted risk: aggressive; ~3 working weeks. Mitigation is the pre-agreed descope ladder §10.3 — Claude Code applies it unilaterally when a milestone slips, no re-negotiation.* |
| **D-114** | Out-of-scope ratification | Web Components, MCP write tools, RALIA dark mode, telemetry expansion — all explicitly excluded (§12). |

---

## §3 Workstream A — DTCG 2025.10 token-source migration

Closes G-2. Source-side only; **consumer-visible build outputs must not change** except where Workstream B adds new theme blocks.

### A1 File renames

- Every file under `tokens/` renames `*.json` → `*.tokens.json`.
- Media type `application/design-tokens+json` declared in the build tooling and docs.
- All internal references, build scripts (`tools/tokens-build/`), and lint scripts updated.

### A2 Schema upgrades

- Add support for optional **`$deprecated`** (boolean or string-reason) at any token leaf. First consumers: any token superseded during the OKLCH migration; the lint script surfaces `$deprecated` tokens in build logs.
- Keep the existing `$extensions['com.risqbase.*']` namespace unchanged — it is spec-legal vendor metadata.
- Token references: keep curly-brace syntax as house style (spec-legal). Do **not** mix in JSON Pointer syntax.

### A3 OKLCH migration (D-106)

- Every `color` primitive `$value` converts hex → OKLCH via deterministic conversion (use `culori` or equivalent; pin the library version).
- **Round-trip rule:** `oklch → srgb-hex` of the new value must equal the old hex exactly. Any token that can't round-trip exactly keeps a `com.risqbase.legacyHex` extension carrying the original, and the build emits that hex as the fallback. Zero visual drift is the contract.
- Build emits, per color token: `oklch(…)` value + hex fallback (CSS `@supports` not required — emit hex first, `oklch()` second as override, standard progressive enhancement).
- `lint:tokens` gains a rule: **no raw hex `$value` in `tokens/primitive/color*`** — OKLCH only (legacy hex lives only in the extension).

### A4 Spec-native theming (replaces `themes/*.json` mechanism)

- Delete the "override layer that restates dotted paths" mechanism described in README §Theme overrides.
- Implement DTCG 2025.10 theming: theme sets + resolver document (`tokens/resolver.tokens.json`) declaring `light` (default), `dark`, and contexts. `$extends`/group inheritance per spec.
- Style Dictionary (v4+, first-class DTCG support) replaces the bespoke build where feasible; emitted `dist/tokens.css` keeps the existing shape: base `:root` block + `[data-theme="dark"]` block, so the v4.2-era `<html data-theme>` contract is preserved for consumers.
- README.md rewritten to document the new mechanism (keep the existing "code is canonical / Figma proposes" sync direction — unchanged).

### A5 Acceptance (Workstream A)

- [ ] All token files renamed `.tokens.json`; build + lint green
- [ ] All color primitives OKLCH; round-trip report shows 100% exact or `legacyHex`-pinned
- [ ] `$deprecated` supported by lint + build
- [ ] Resolver-based theming in place; `themes/{dark,hc}.json` stubs deleted
- [ ] `dist/tokens.css` diff vs v4.3 build: **zero changes** outside (a) hex→`oklch()`+fallback value notation, (b) new `[data-theme="dark"]` block from Workstream B
- [ ] Chromatic visual regression: zero diffs in light theme
- [ ] README.md updated

---

## §4 Workstream B — Dark theme + high-contrast pass

Closes G-3. Depends on A4 (theming machinery). DS-level only (D-108).

### B1 Dark theme derivation rules

Dark values are **derived, not improvised**. Apply these rules; where a
rule produces a contrast failure, adjust lightness (L in OKLCH) by the
minimum step that passes, and record the exception in the token's
`$description`.

| Group | Rule |
|---|---|
| `surface.default` | `stone-900` · `surface.subtle` → `stone-800` · `surface.muted` → `stone-700` · `surface.inverse` → `white` |
| `text.*` | invert against new surfaces: `default` → `stone-50`, `subtle` → `stone-300`, `on-action` unchanged, `on-inverse` → `stone-900` |
| `action.*` | `primary` → `indigo-400` (lightened for ≥4.5:1 on stone-900); `primary-hover` → `indigo-300`; `primary-subtle` → `indigo-800` |
| `border.*` | `default` → `stone-700`, `subtle` → `stone-800`, `focus` unchanged hue, lightness raised to pass 3:1 non-text contrast |
| `risk.*` / `band.*` | keep hue per band; re-derive bg (dark, low-chroma), border, text, icon to pass the same contrast contract as light. 20 `band.*` tokens all get dark values |
| `iris.*` | teal hues unchanged; `surface` → dark teal-tinted stone; `accent` lightness raised to pass on dark surfaces; all 9 tokens |
| `gauge.*`, `citation.*`, `chart.*`, `telemetry.*` | same per-group treatment; `chart.cat.*` re-tuned so all 8 categorical hues stay distinguishable on `stone-900` (raise L, cap chroma spread) |
| Elevation | shadows are near-invisible on dark — `raised`/`floating`/`overlay` additionally lighten the surface one step and rely on the paired neutral border (v4.1 §4 pairing already mandates the border) |

Every dark value must satisfy the **same `contrastPair` CI checks** as
light — pairs re-pointed at dark surfaces automatically by the resolver.

### B2 Component verification

All 25 Layer 1 + Layer 2 components rendered and verified under
`data-theme="dark"`: Storybook theme toolbar + Chromatic dark-mode
snapshots added to the baseline. Components must consume only semantic /
component tokens (R9 already enforces this) — any component found with a
hard-coded light assumption is fixed as part of this workstream.

### B3 Forced-colors / high-contrast pass (not a custom theme)

- Every Layer 1 + Layer 2 component audited under `forced-colors: active` (Windows HC) and `prefers-contrast: more`.
- Rules: no information lost when backgrounds are stripped; focus indicators survive; `forced-color-adjust` used only where system colors would break meaning (Gauge arcs, chart fills, band chips get explicit `forced-colors` CSS with `CanvasText`/`Highlight` system colors).
- `tokens/themes/hc.json` stub is **deleted** (per A4); HC is a compliance contract, not a token theme. Documented at `/tokens/theming` on the docs site.

### B4 Docs-site switcher

Light/dark toggle in the docs-site header; persists (localStorage), defaults to `prefers-color-scheme`. All component preview frames honour it.

### B5 Acceptance (Workstream B)

- [ ] Dark values for **every** semantic + component color token; lint enforces completeness (a theme may not omit keys)
- [ ] All `contrastPair` checks pass in dark
- [ ] Chromatic dark baseline: all 25 components snapshotted, reviewed, accepted
- [ ] Forced-colors audit complete; explicit `forced-colors` CSS where required; documented
- [ ] Docs-site theme switcher live
- [ ] RALIA / marketing **unchanged** (no `data-theme` flips shipped to products)

---

## §5 Workstream C — Agent surface: MCP server + machine-readable docs

Closes G-1. The headline of v4.4.

### C1 MCP server — package + remote (D-101)

- **Package:** `@risqbase-inc/ui-components-mcp` (new, versioned in lockstep with `ui-components`). Transport: stdio. Zero config: `npx @risqbase-inc/ui-components-mcp`.
- **Remote:** same server behind Streamable HTTP at `https://design.risqbase.com/mcp`, deployed with the docs site. No auth for v1 (all exposed data is public by design; the staff-only telemetry dashboard is **not** exposed).
- Single shared implementation; transports are wrappers. Server data source is the **same generated JSON artefact the docs site consumes** (one source of truth — see C4).

### C2 Tool surface (read-only, D-102) — exact contract

| Tool | Input | Returns |
|---|---|---|
| `list_components` | `{ domain?, layer?, state? }` | name, domain, layer, promotion state, one-line description |
| `get_component` | `{ name }` | full API (props + types), token chain, a11y contract, composes-with, canonical code snippet, closed audit findings |
| `list_tokens` | `{ tier?, group? }` | dotted path, `$type`, `$description`, tier |
| `get_token` | `{ path }` | resolution chain primitive→semantic→component, light + dark values, `contrastPair`, `$deprecated` flag |
| `list_recipes` | `{}` | recipe id, layer composition, use case |
| `get_recipe` | `{ id }` | full v4.1 §20 schema: trigger, data-shape, composed_of, layout, states, voice_examples, anti-patterns |
| `get_lifecycle` | `{ component? }` | promotion state, criteria status, promotion-log rows |
| `get_usage_rules` | `{ consumer? }` | scanner rules R1–R13 as machine-readable constraints (id, description, severity, what-to-do-instead) |
| `list_showcase` | `{}` | Layer-3 entries, each with `consumable: false`, `license: "RALIA-private"` (D-104) |
| `get_showcase` | `{ id }` | composition diagram data (which Layer 1/2 primitives + config), same flags, pointer to showcase URL |
| `search` | `{ query }` | ranked hits across all of the above |

Every response carries `{ spec: "v4.4", package: "2.1.0", generatedAt }` so agents can detect staleness. Component/token data **generated at build time from source** (types from `.d.ts`, tokens from the resolver output, recipes from `docs/recipes/*.mdx` frontmatter) — never hand-maintained.

### C3 llms.txt family (D-103)

On `design.risqbase.com`:

- **`/llms.txt`** — index per the llms.txt convention: one-paragraph system summary, then sectioned links (Components / Tokens / Patterns / Products / Promotion) to the `.md` mirrors.
- **`/llms-full.txt`** — full concatenated corpus for single-fetch ingestion.
- **Per-page `.md` mirrors** — every `/components/<name>`, `/tokens/<group>`, `/patterns/<id>`, `/products/ralia/<config>` page serves its markdown source at the same path + `.md`. Layer-3 mirror pages open with a machine-readable frontmatter block: `consumable: false`, `license: RALIA-private` (D-104).
- All generated in the docs-site build from the same artefact as C1. CI fails if mirrors are stale (R13, §9).

### C4 Single source of truth

One build step (`npm run build:agent-surface`) produces `dist/agent/registry.json` consumed by: the MCP server (both transports), the llms.txt generator, and the docs-site component pages. No second copy of any component API or token value exists anywhere in the agent surface.

### C5 Acceptance (Workstream C)

- [ ] `@risqbase-inc/ui-components-mcp@2.1.0` published; works in Claude Code via `npx` with zero config
- [ ] All 11 tools implemented per C2 contract; integration test per tool
- [ ] Remote endpoint live at `design.risqbase.com/mcp`
- [ ] Layer-3 flags present in every showcase response and mirror page
- [ ] `/llms.txt`, `/llms-full.txt`, all `.md` mirrors live and CI-checked for staleness
- [ ] Smoke test: a fresh Claude Code session with only the MCP server connected can correctly answer “what do I use for an AI citation with low confidence?” (expected: `CitationChip variant="low-confidence"` + token chain) and “build a risk band chip” (expected: `BandBadge`, not custom)

---

## §6 Workstream D — Figma Code Connect

Closes the design→code half of G-1. CEO confirms library current + Org/Enterprise plan (D-109).

- Code Connect mappings for **all 25 Layer 1 + Layer 2 components**: Figma component → real package import (`@risqbase-inc/ui-components/{core|ai|data-viz}`), props mapped to Figma variants/properties.
- Variable code syntax: Figma Variables annotated so Dev Mode + MCP emit token CSS custom properties, not raw values.
- Mappings live in `figma/` in the ui-components repo; published via `figma connect publish` in the release pipeline.
- Verification: Figma Dev Mode MCP inspection of one instance of each mapped component returns package import code (not generic markup) for: Button, Badge, Card, Modal, CitationChip, Gauge (spot-check set).
- Layer-3 Figma components (Risk Gauge config, Iris) are **not** mapped — they get a Figma component description pointing at the showcase URL instead.

### Acceptance (Workstream D)

- [ ] 25/25 Layer 1+2 components mapped and published
- [ ] Variable code syntax set for all color/dimension variables
- [ ] Spot-check set returns package imports in Dev Mode
- [ ] Publish step wired into release pipeline

---

## §7 Workstream E — Motion preference (`MotionProvider`)

Closes G-4. Layer 1, `core/`. Ships `beta` (per §7.2 lifecycle — no second consumer yet).

- **`<MotionProvider>`** — context provider. Resolution order: explicit user choice (localStorage `risqbase:motion`) → `prefers-reduced-motion` → full motion. Sets `data-motion="full|reduced"` on a wrapper for CSS targeting.
- **`useReducedMotion()`** — hook returning the resolved boolean; all animated primitives (`IrisThinking`, `Skeleton`, `StreamingText`, `Toast`) migrate from raw media-query checks to the hook (media query remains the no-provider fallback).
- **Toggle pattern** — documented §20 recipe `motion-preference` (not an exported control): a labelled switch composed from existing primitives, with copy guidance from Sophie's voice canon. Products place it in their settings surface.
- CSS contract: tokens.css gains `[data-motion="reduced"]` rules equivalent to the existing `prefers-reduced-motion` blocks.

### Acceptance (Workstream E)

- [ ] `MotionProvider` + `useReducedMotion` shipped in `core/`, state `beta`
- [ ] 4 animated primitives consume the hook; media-query fallback intact when no provider present
- [ ] `motion-preference` recipe page live
- [ ] Reduced mode verified on all animated primitives in Storybook

---

## §8 Workstream F — ChartContainer completion

Closes G-5 (existing v4.3 commitment, D-112).

- `<ChartContainer type>` gains `heatmap`, `area`, `choropleth`, `metric-card`, completing the v4.1 §8.1.1 taxonomy alongside `line`/`bar`/`sparkline`.
- All types consume `chart.*` semantic tokens only; sequential ramps from `chart.seq.{1..5}`, diverging from `chart.div.*`; `chart.null` for no-data cells (heatmap/choropleth).
- Dark-theme support from Workstream B applies (chart tokens re-tuned per B1).
- Choropleth: UK + EU region geometries only (RALIA's market); geometry files in the package as static assets; no external map service.
- Each type: a11y contract (table fallback via `aria-describedby`-linked visually-hidden table, per the v4.1 chart a11y pattern), Storybook entry, Chromatic light + dark baselines.
- `ChartContainer` promotes `beta` → `stable` only if §7.2 criteria are met by 30 June; otherwise it remains `beta` — **do not force the promotion**.

### Acceptance (Workstream F)

- [ ] 4 new chart types shipped; 7/7 taxonomy complete
- [ ] Token-only color consumption (R9 clean); dark verified
- [ ] A11y table fallback on all 7 types
- [ ] Chromatic light + dark baselines accepted

---

## §9 Scanner rules — additions

Extends v4.3 §10 (R1–R10 unchanged). Same home: `scripts/lib/design-rules.mjs`. CI-blocking.

| Rule | Description |
|---|---|
| **R11** | Token source hygiene — `tokens/**` must pass DTCG 2025.10 validation; color primitives must be OKLCH (no raw hex `$value`); dark theme set may not omit keys present in light |
| **R12** | Motion gating — animated CSS in component code must be gated on `[data-motion]` or `prefers-reduced-motion`; raw ungated `animation:`/long `transition:` at component tier violates |
| **R13** | Agent-surface freshness — `dist/agent/registry.json`, llms.txt family, and `.md` mirrors must be regenerated in the same commit as any change to component types, tokens, or recipes (hash check, same mechanism as the existing baseline drift detection) |

---

## §10 Sequencing + descope ladder

### 10.1 Single target (D-113)

Everything lands **30 June 2026**, alongside the docs site (v4.3 §8 deliverable), one day before RALIA launch. Three working weeks.

### 10.2 Build order (dependencies, not phases)

```
A (DTCG migration)  ──► B (dark + HC)      ──► F dark baselines
        │                      │
        └──► C4 registry ──► C1/C2 MCP ──► C3 llms.txt (needs docs site)
                                              D (Code Connect — independent)
                                              E (Motion — independent)
```

Start A, D, E immediately in parallel. B follows A4. C4 can start against
v4.3 token output and re-point at A's output when ready. C3 and the
remote MCP endpoint land with the docs-site deploy.

### 10.3 Descope ladder — pre-agreed, apply unilaterally

If the 30 June date is at risk, Claude Code cuts in this exact order,
ticking the corresponding §11 rows as `DESCOPED → v4.4.1`, and does
**not** stop work or wait for approval. Each rung names what ships
instead.

| Rung | Cut | Ships instead | Rationale |
|---|---|---|---|
| 1 | `choropleth` chart type | 6/7 taxonomy; choropleth → v4.4.1 | Largest isolated effort (geometry assets), zero dependencies on it |
| 2 | `metric-card` chart type | 5/7 taxonomy → v4.4.1 | Same |
| 3 | Remote MCP endpoint | npm stdio package only (original recommendation); remote → v4.4.1 with docs-site hardening | Transport wrapper, not capability; agents lose nothing locally |
| 4 | Code Connect long tail | Spot-check set of 6 mapped (Button, Badge, Card, Modal, CitationChip, Gauge); remaining 19 → v4.4.1 | Highest-traffic components covered |
| 5 | Forced-colors audit | Dark theme still ships; HC pass → v4.4.1 | Dark is the user-visible promise |

**Never cut:** Workstream A, dark theme tokens + component verification (B1/B2/B5 first three rows), npm MCP package + tool surface, llms.txt family, MotionProvider. If those are at risk, that is the one situation requiring escalation to Elena + Fiyin.

### 10.4 v4.4.1 patch

Anything descoped ships in `v4.4.1` (package 2.1.x), target 31 July 2026, tracked in a `RisqBase-DS-v4.4.1-Patch.md` created by Claude Code at v4.4 ship time **only if** the ladder was used.

---

## §11 Acceptance criteria — master checklist

v4.4 ships when every row is `[x]` or marked `DESCOPED → v4.4.1` per §10.3.

### 11.1 Package
- [ ] `@risqbase-inc/ui-components@2.1.0` published (minor; no breaking changes; root barrel still warns per v4.3 §9.2)
- [ ] `@risqbase-inc/ui-components-mcp@2.1.0` published
- [ ] Workstream A rows (§A5) complete
- [ ] Workstream B rows (§B5) complete
- [ ] Workstream E rows (§7) complete
- [ ] Workstream F rows (§8) complete
- [ ] `tsc --strict` clean; type tests pass; Chromatic light + dark baselines accepted

### 11.2 Agent surface
- [ ] Workstream C rows (§C5) complete, including the two smoke-test prompts
- [ ] Workstream D rows (§6) complete

### 11.3 Governance
- [ ] This brief approved by Elena + Fiyin (§14)
- [ ] R11–R13 implemented + tested; baselines regenerated per consumer
- [ ] PLATFORM-STANDARDS.md updated (MotionProvider, MCP package, chart types)
- [ ] §23 promotion log: `MotionProvider → beta` row; `ChartContainer` promotion row only if §7.2 criteria genuinely met
- [ ] `/changelog/v4.4` page live
- [ ] If descope ladder used: `RisqBase-DS-v4.4.1-Patch.md` created with the cut rows

### 11.4 Docs site (amends v4.3 §8 scope — same 30 June date)
- [ ] `/llms.txt`, `/llms-full.txt`, `.md` mirrors served
- [ ] `/mcp` endpoint live (or DESCOPED per rung 3)
- [ ] Theme switcher live; `/tokens/theming` page documents dark + HC contract
- [ ] `/patterns/motion-preference` recipe page live

### 11.5 Definition of Done — verification protocol

**"Done" is a verified state, not a progress report.** Claude Code may
report v4.4 — or any individual workstream — as done **only after**
executing this protocol against the work in its final state. Checks that
passed mid-task do not count; everything re-runs once, at the end, from a
clean checkout. A claim without evidence is not done.

**DoD-1 · Evidence ledger.** Maintain `RisqBase-DS-v4.4-DoD-Ledger.md`
in the repo. One row per §11 / per-workstream acceptance row:
`<row id> · <status PASS|FAIL|DESCOPED|BLOCKED> · <evidence>` where
evidence is a concrete artefact — the command run + output summary, a CI
run reference, a diff-report path, a Chromatic build link, or a
screenshot path. The ledger IS the done report (DoD-7).

**DoD-2 · Clean-state re-verification.** From a fresh checkout +
`npm ci`, re-run in order and record each result in the ledger:
`lint:tokens` → `build:tokens` → `build:agent-surface` → `tsc --strict`
→ full test suite → scanner (`design-system-check.mjs`) on every
consumer baseline. Any failure resets the affected rows to FAIL.

**DoD-3 · Output-diff proofs.** Mechanical, not visual-judgement:
(a) `dist/tokens.css` diff vs the archived v4.3 build conforms to the §A5
rule (only value-notation changes + the dark block) — attach the diff;
(b) OKLCH round-trip report shows 100% exact or `legacyHex`-pinned —
attach; (c) Chromatic: light theme zero diffs, dark baseline reviewed and
accepted — link both builds.

**DoD-4 · Functional smoke tests — executed, not described.**
(a) Fresh agent session with **only** `npx @risqbase-inc/ui-components-mcp`
connected answers both §C5 smoke prompts correctly — transcript saved;
(b) remote `/mcp` endpoint answers `list_components` over Streamable
HTTP — request/response logged; (c) `/llms.txt` + one `.md` mirror
fetched and spot-checked against source; (d) Dev Mode returns package
imports for the 6-component Code Connect spot-check set; (e) docs-site
theme switcher toggles + persists across reload; (f) one animated
primitive verified motion-reduced via `MotionProvider` override with the
OS setting at full motion.

**DoD-5 · Negative checks.** Each new scanner rule (R11, R12, R13) is
proven to **fail** on a deliberately violating fixture before being
proven to pass on clean code. A rule that cannot fail is not implemented.
Fixtures committed under `scripts/__fixtures__/`.

**DoD-6 · Descope integrity.** Every DESCOPED ledger row maps to a §10.3
rung, cuts were taken in ladder order with no skips, and
`RisqBase-DS-v4.4.1-Patch.md` exists listing exactly the cut rows. Any
cut not on the ladder = BLOCKED, escalate per §10.3.

**DoD-7 · The done report.** The final report to the team is the
completed ledger: every row PASS or DESCOPED, with evidence. If any row
is FAIL or BLOCKED, the report's status is **"blocked"** with the
failing rows listed — never "done with caveats". There is no third state.

---

## §12 Out of scope — do not build (D-114)

| Item | Status |
|---|---|
| Web Components / framework-agnostic distribution | Watch only. Revisit at v5.0 planning. No v4.4/v5.0 decision may *foreclose* it (no React types in the token build, no React assumptions in `registry.json`) |
| MCP write or codegen tools | Excluded from v1 (D-102). Revisit post-launch with usage data |
| RALIA / marketing dark mode | Product decisions, post-launch (D-108) |
| Custom high-contrast token theme | Replaced by forced-colors compliance pass (D-107) |
| Telemetry expansion beyond v4.3 §7.3 | Not in scope |
| Auth on the remote MCP endpoint | Not needed for v1 (public data only); revisit if staff-only tools are ever added |

---

## §13 Decisions made during implementation

*Claude Code records any genuinely undocumented decision here as a row:
`<date> · <decision> · <choice> · <nearest v4.3/v4.4 analogue followed>`.
Empty at handover — that is the goal.*

| Date | Decision | Choice | Analogue |
|---|---|---|---|
| 2026-06-10 | Package version (brief said 2.1.0) | **2.2.0** — 2.1.0 had already shipped 2026-06-05; release-please cuts next minor from `feat:` commits | D-111 (minor, non-breaking) |
| 2026-06-10 | Scanner rule numbering (brief said R11–R13) | **R12–R14** — an R11 had already shipped and keeps its slot | §9 intent unchanged |
| 2026-06-10 | OKLCH fallback mechanism (brief said hex-first + oklch override) | **`@supports` blocks** — custom properties don't do invalid-value fallback, so a plain second declaration would break unsupporting browsers | A3 zero-drift contract upheld |
| 2026-06-10 | Dark-mode link contrast | New **`action.link`** semantic token (light-identical to `action.primary`) — in dark, the fill contract and the text contract cannot share one value | B1 derivation rules |
| 2026-06-10 | Descope | **Choropleth → v4.4.1** via ladder rung 1 (only rung used); patch doc created | §10.3 pre-authorised |
| 2026-06-10 | **Descope REVERSED (CEO, post-report)** | Choropleth **restored to v4.4** — PR #84 unreleased, so the cut can be undone in-flight; design spec + geometry decisions supplied by design (this project); `RisqBase-DS-v4.4.1-Patch.md` retires if D also lands by the release cut | G-5 commitment honoured in-release |
| 2026-06-10 | **D-109 amended (CEO, post-report)** | Workstream D stays v4.4, gated on Figma Org access by 27 June; auto-converts to v4.4.1 past the gate | D-109 row, §2 |
| 2026-06-10 | G.3 transplant | PLATFORM-STANDARDS v4.4 delta applied to the canonical `docs/PLATFORM-STANDARDS.md` (design project); `ralia-tier2` ancestor still needs the same section | §11.3 G.3 unblocked |
| 2026-06-10 | **Doc-ID correction (CEO)** | The v4.4 brief is **GOV-DS-2026-02 rev. v4.4**, not "GOV-DS-2026-03" — GOV-DS IDs track the document, not the version. Corrected here, in `Choropleth Spec.html`, and in PLATFORM-STANDARDS §9. **Repo sweep owed by Claude Code:** PR #84 title, the filed brief excerpt, ledger references | Registry hygiene |
| 2026-06-10 | **Choropleth decisions D-115…D-119 (CEO)** | `geo="europe"` (EU/EEA+UK, country-level, ISO alpha-3) **+ CEO-added `geo="world"`** (6 continents); Natural Earth public domain; both `band` + `seq` modes; chip strip for sub-24px jurisdictions; **pre-projected build-time geometry, ≤80KB gz, zero runtime deps**. Full contract + lift-ready reference: `Choropleth Spec.html` (this project) | §8 Workstream F, D-112 |
| 2026-06-10 | **D-109 premise failed in reality** | Authenticated Figma identity is a student-tier View seat, not Org/Enterprise — Workstream D BLOCKED on access, pipeline fully prepared and secret-gated. **CEO decision needed: see unblock options** | DoD-7 (BLOCKED, not descoped — access ≠ scope) |

*Mirrored from the repo-side ledger (`RisqBase-DS-v4.4-DoD-Ledger.md`, PR #84) on 10 June 2026 — verified by design.*

---

## §14 Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| Principal Designer | Elena Vasquez | 10 June 2026 | APPROVED — via PR #84 peer review + amendment commits |
| Frontend Lead | Priya Sharma | 10 June 2026 | APPROVED — via PR #84 peer review + amendment commits |
| Technical Lead | Alex Chen | 10 June 2026 | APPROVED — via PR #84 peer review + amendment commits |
| CEO | Fiyin Adeleke | 10 June 2026 | DECISIONS LOCKED (questionnaire) + post-report amendments 10 June |

---

**END OF GOV-DS-2026-02 · v4.4 SOTA BRIEF**

Handover note for Claude Code: read this brief, then GOV-DS-2026-02
(v4.3 Comprehensive) §3–§5 for the architecture you're extending, then
`README.md` (tokens) before Workstream A. The §10.3 descope ladder is
pre-authorised — apply it without asking. Create the §11.5 DoD ledger as
your first commit and keep it current; "done" may only be reported by
delivering the completed ledger per DoD-7.
