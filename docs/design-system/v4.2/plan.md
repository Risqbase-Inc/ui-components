# RisqBase Design System v4.2 — Comprehensive Update Plan + Audit Tracker

**Document ID:** GOV-DS-2026-02-PLAN-420
**Date:** 7 May 2026
**Prepared by:** Elena Vasquez
**Status:** Plan (not yet executed)
**Approved by:** Pending — Fiyin Adeleke
**Scope:** Five fundamental improvements identified after v4.1.1 to elevate the system from "world-class specification" to "world-class lived system"

---

## Purpose of this document

Three things:

1. **Plan.** Each fundamental improvement broken into atomic updates, with the gap each addresses, the canonical source(s) it draws from, and the expected outcome.
2. **Source pack.** Every external source named with URL, what to extract from it, and licence considerations for our own published work.
3. **Audit tracker.** A row-by-row checklist (final table) that we tick off as v4.2 is executed. After v4.2 ships, we audit the design system against this same table — anything unchecked is a regression.

This document is the contract. v4.2 is complete when every row in the final tracker is `[x]`.

---

## The five fundamental improvements (recap from prior session)

| # | Theme | Why it's fundamental |
|---|-------|---------------------|
| **F1** | Data Visualisation System (first-class chart layer) | Three data products with no chart taxonomy, no library decision, no chart accessibility, no world-map specification. The single largest visible gap. |
| **F2** | Signatures decoupled from RALIA (generic primitives + new `ai/` domain) | Risk Gauge, Citation Chip, IRIS are RALIA-private by accident. The shared system has thin substance. Cortex needs the same primitives the moment it has any AI feature. |
| **F3** | Content design as a first-class layer (beyond §10 Voice & Tone) | Every word reaches a regulator. No content patterns, no glossary, no AI-specific copy rules. Compliance products live or die by precision of language. |
| **F4** | Component telemetry and adoption discipline | "We have a design system" vs "we know our design system is being used correctly." Without telemetry, governance is a hope. |
| **F5** | Figma ↔ code token sync | Closes the designer↔engineer loop; removes a class of synchronisation work that doesn't scale for a small team. |

---

## Source canon

These are the public references v4.2 draws from. Every update in the tracker cites one or more of these.

### Charts and data visualisation

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-DV1 | Adobe Spectrum — Color for data visualization | https://spectrum.adobe.com/page/color-for-data-visualization/ | Categorical / sequential / diverging palette taxonomy; semantic palette construction; accessibility constraints on chart colour | Reference (proprietary docs) |
| S-DV2 | Adobe Spectrum — Color fundamentals + Color system | https://spectrum.adobe.com/page/color-fundamentals/, /page/color-system/ | Perceptually-balanced lightness curves; Stevens' Power Law approach; how to engineer chart palettes around target contrast ratios | Reference |
| S-DV3 | Adobe — Reinventing Spectrum's colors (case study) | https://adobe.design/stories/design-for-scale/reinventing-adobe-spectrum-s-colors | The methodology behind a science-backed palette: <cite index="3-7,3-9">Spectrum colors as a science-backed update that helps design teams make accessible color decisions</cite>. Anchors our own palette rationale. | CC BY 4.0 (Adobe Design blog) |
| S-DV4 | Apple HIG — Charts | https://developer.apple.com/design/human-interface-guidelines/charts | Anatomy nouns; chart-type-by-purpose taxonomy; accessibility expectations | Apple proprietary (reference only) |
| S-DV5 | Apple — Swift Charts framework | https://developer.apple.com/documentation/Charts | Compositional grammar (Mark, Scale, Axis) — adopt the *grammar*, not the framework | Apple proprietary (reference only) |
| S-DV6 | Apple WWDC22 "Hello Swift Charts" | https://developer.apple.com/videos/play/wwdc2022/10136/ | <cite index="26-42,26-43,26-44">In Swift Charts, you build charts by composition; visual elements like bars are called "marks"</cite>. Validates our anatomy-glossary approach. | Apple proprietary |
| S-DV7 | Observable Plot | https://observablehq.com/plot/ | Open-source grammar of graphics — closest to what we'd actually implement in JS | ISC (permissive) |
| S-DV8 | D3.js | https://d3js.org/ | Underlying primitives for any non-trivial chart we build ourselves | BSD-3 |
| S-DV9 | Visx (Airbnb) | https://airbnb.io/visx/ | React + D3 wrapper. Our likely production rendering library. | MIT |
| S-DV10 | Recharts | https://recharts.org/ | Higher-level React chart library. Alternative to Visx for fast cases. | MIT |
| S-DV11 | Tremor | https://tremor.so/ | React + Tailwind dashboard charts. Alternative; couples to its own design system. | Apache 2.0 |
| S-DV12 | Datawrapper Academy — chart-type-by-purpose | https://academy.datawrapper.de/category/16-chart-types | Journalism-grade decision tree (data shape → chart) | CC BY-NC |
| S-DV13 | ColorBrewer | https://colorbrewer2.org/ | Sequential and diverging palettes engineered for choropleths and heatmaps | Apache 2.0 |
| S-DV14 | Tableau "Which chart works" | https://www.tableau.com/learn/whitepapers/which-chart-or-graph-is-right-for-you | Decision-tree taxonomy used in our §8.x chart-selection section | Tableau proprietary (reference only) |
| S-DV15 | Vega-Lite | https://vega.github.io/vega-lite/ | Compositional grammar reference; complementary to Observable Plot | BSD-3 |

### World maps specifically

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-MAP1 | world-atlas (TopoJSON of Natural Earth) | https://github.com/topojson/world-atlas | Canonical TopoJSON source for country/region boundaries | ISC |
| S-MAP2 | Natural Earth | https://www.naturalearthdata.com/ | Public-domain raw data underlying world-atlas | Public domain |
| S-MAP3 | TopoJSON | https://github.com/topojson/topojson | Encoding format for geographic data | BSD-3 |
| S-MAP4 | Datawrapper — choropleth guide | https://academy.datawrapper.de/article/300-what-is-a-choropleth-map | Choropleth construction, palette, missing-data treatment | CC BY-NC |
| S-MAP5 | observable/d3-geo + projection canon | https://github.com/d3/d3-geo | Projections (Robinson, Equal Earth, Natural Earth, Winkel Tripel for global; Mercator only for navigation) | BSD-3 |

### Token architecture, themes, Figma sync

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-TOK1 | GitHub Primer Primitives | https://github.com/primer/primitives | <cite index="13-6,13-7,13-8">Token data stored as JSON, compiled with Style Dictionary, with light/dark modes and accessibility modes built on overrides</cite>. Validates our three-tier model and gives us the override-file pattern. | MIT |
| S-TOK2 | Primer Figma libraries doc | https://primer.style/product/getting-started/figma/ | <cite index="15-10,15-11">Styles and variables are two ways to use Primer Primitives in Figma; the goal is to move everything to variables</cite>. The variable-based approach is our model. | CC BY 4.0 |
| S-TOK3 | W3C Design Tokens Format | https://design-tokens.github.io/community-group/format/ | The standardised `$value`, `$type`, `$extensions` schema. <cite index="13-17">Per the W3C design token specs, the $extensions property is used for additional meta data</cite>. Adopt as our token-file format. | W3C Community licence |
| S-TOK4 | Tokens Studio (Figma plugin) | https://tokens.studio/ | Bidirectional Figma↔GitHub token sync mechanism | Free + paid tiers |
| S-TOK5 | Figma Variables API | https://www.figma.com/developers/api#variables | Programmatic access for our own sync pipeline | Figma developer terms |
| S-TOK6 | Style Dictionary | https://amzn.github.io/style-dictionary/ | The build pipeline we already use; basis for any token output transforms | Apache 2.0 |
| S-TOK7 | IBM Carbon — themes & tokens | https://carbondesignsystem.com/elements/color/tokens/ | Three-tier model in production at IBM scale | Apache 2.0 |

### Repo structure, governance, OSS

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-REP1 | Primer org on GitHub | https://github.com/primer | Multi-repo topology: `primitives` + `react` + `css` + `view-components` + `octicons` + `style` | MIT |
| S-REP2 | Primer components docs | https://primer.style/components/ | Per-component docs depth and structure for our docs site | CC BY 4.0 |
| S-REP3 | Primer Octicons | https://github.com/primer/octicons | Icon library governance — we use Lucide but the *governance pattern* is what we lift | MIT |
| S-REP4 | Polaris — open-source repo | https://github.com/Shopify/polaris | RFC process, contribution model, deprecation policy | MIT |

### Content design

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-CON1 | Shopify Polaris — Content | https://polaris.shopify.com/content/actionable-language | Button verb taxonomy, error-message construction, content patterns | MIT |
| S-CON2 | Atlassian Design System — Content | https://atlassian.design/content | Voice, tone, terminology glossary as a design layer | Atlassian proprietary (reference only) |
| S-CON3 | Mailchimp Content Style Guide | https://styleguide.mailchimp.com/ | Voice principles, grammar conventions, tone-by-context | CC BY-NC 4.0 |
| S-CON4 | Microsoft Writing Style Guide — AI content | https://learn.microsoft.com/en-us/style-guide/ai/ | Conventions for AI-product copy: how AI hedges, refuses, cites, explains | MIT-Microsoft Style |
| S-CON5 | UK gov design system — Content | https://design-system.service.gov.uk/styles/style/ | Plain-language conventions for compliance contexts (regulator-facing) | Open Government Licence |

### Telemetry and adoption

| ID | Source | URL | What to extract | Licence |
|----|--------|-----|-----------------|---------|
| S-TEL1 | Polaris adoption tracking pattern (talks/blog) | https://shopify.engineering/ | Server-side component usage analytics pattern; PII-safe instrumentation | Reference |
| S-TEL2 | Material Design — Telemetry & adoption | https://m3.material.io/foundations | Adoption metrics framework | Apache 2.0 |
| S-TEL3 | OpenTelemetry — JS SDK | https://opentelemetry.io/docs/instrumentation/js/ | Vendor-neutral telemetry standard for component instrumentation | Apache 2.0 |

---

## The atomic update list

Each update has: a stable **ID** (cited in the tracker), a one-line description, the **gap** it closes, **sources** consumed, the **expected outcome** (a verifiable artefact), and **owner**.

### F1 — Data Visualisation System

**Goal.** Elevate data viz from one paragraph to a full chapter of equal depth to typography or tokens. ~30 components, ~8000 words, world-map specification.

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U1.1** | Author new §8 "Data Visualisation System" replacing the current 5-subsection §8 with a full chapter | No first-class data layer in v4.1.1 | S-DV1, S-DV4, S-DV5, S-DV12, S-DV14 | New §8 in v4.2 with subsections §8.1 Taxonomy, §8.2 Anatomy, §8.3 Palettes, §8.4 Decision Rules, §8.5 States, §8.6 Accessibility, §8.7 Print, §8.8 Library Decision, §8.9 Sparklines, §8.10 Heatmaps, §8.11 Geographic, §8.12 Composite Patterns | Elena |
| **U1.2** | Build canonical chart-type taxonomy: categorical, comparison, distribution, composition, relationship, time, geographic, flow, part-to-whole | No catalogue of chart types or when to use each | S-DV12, S-DV14, S-DV4 | §8.1 with named-and-numbered chart types (~20), each with a one-line "use when" + "do not use when" | Elena |
| **U1.3** | Specify chart anatomy nouns and add to §7.0 glossary | Anatomy vocabulary doesn't extend to charts | S-DV4, S-DV5, S-DV6, S-DV7 | §7.0 glossary expanded with `plot-area`, `axis`, `gridline`, `legend`, `tooltip`, `mark`, `scale`, `annotation`, `rule-mark`, `label-collision-strategy`, `series`, `category`, `value-encoding` | Elena |
| **U1.4** | Specify three palette systems with role-token coverage: categorical (8 colours), sequential (single-hue), diverging (red↔white↔teal) | Only one palette (categorical) exists; sequential and diverging missing | S-DV1, S-DV2, S-DV3, S-DV13 | §8.3 with three palette tables, each with hex values, role tokens (e.g., `--chart-categorical-1` through `-8`, `--chart-sequential-50/100/.../900`, `--chart-diverging-low/...high`), contrast verification, colour-blindness verification | Elena + Priya |
| **U1.5** | Decision rules: data-shape → chart-type matrix, plus the §7.10.1 score-rule extended to charts | Designers re-invent chart-choice every time | S-DV12, S-DV14 | §8.4 decision matrix; default chart per data shape; named exceptions | Elena |
| **U1.6** | Per-chart-type state matrix: loading / empty / partial-data / error / no-permission / all-zero / single-data-point / too-many-series | Charts have no defined empty/error states; demos look broken | S-DV1 (state implications), S-CON1 (empty-state copy) | §8.5 — for each chart type, table of states + visual + copy + accessibility | Elena |
| **U1.7** | Per-chart-type accessibility specification: ARIA, data-table fallback, screen-reader summary auto-generation, colour-blindness verification, sonification optional | No chart accessibility documented; v4.1 a11y is component-only | S-DV6 (Apple's Swift Charts a11y model), S-TOK7 (Carbon a11y) | §8.6 with `role`, `aria-label`, `aria-describedby` patterns; rule that every chart must have a hidden `<table>` fallback | Elena + Priya |
| **U1.8** | Print variants per chart type (extends §8.5 in v4.1) | Print covered for components, not for charts | S-DV12 | §8.7 — for each chart type, monochrome variant, B&W-safe pattern fills, print legend | Elena |
| **U1.9** | Chart library decision: select Visx (or Recharts or Observable Plot) and document rationale | No library named; every component reinvents | S-DV7, S-DV9, S-DV10, S-DV11 | §8.8 with named library, version, rationale, list of charts that use it directly vs custom-wrap | Alex + Elena |
| **U1.10** | Geographic chapter: world map specification | "World map looks bad" — no projection spec, no TopoJSON source, no choropleth canon | S-MAP1, S-MAP2, S-MAP3, S-MAP4, S-MAP5 | §8.11 with: (a) projection rule (Equal Earth or Robinson default; Mercator only for navigation), (b) TopoJSON source (`world-atlas` from Natural Earth), (c) palette rule (sequential for choropleth, categorical for symbol map), (d) missing-data treatment, (e) label-collision strategy, (f) "ungeocodable data" state, (g) point-vs-area decision rule | Elena + Alex |
| **U1.11** | Sparkline + Micro-chart spec extension (v4.1 §8.3 was thin) | Sparklines in metric cards have no formal spec | S-DV4, S-DV5 | §8.9 expanded — width/height defaults, stroke conventions, baseline rules, colour rules, no-axis policy, accessibility wrapper | Elena |
| **U1.12** | Risk-Heatmap → general Heatmap specification (extends v4.1 §8.4) | Heatmap is RALIA-risk-only; need generic | S-DV12, S-DV13 | §8.10 with two specs: (a) Risk Heatmap (existing), (b) Generic Heatmap (sequential palette, value labels, axis labels, missing-cell treatment) | Elena |
| **U1.13** | Composite chart patterns: dashboard hero composition, time-comparison, distribution drilldown | Charts compose with each other; no patterns documented | S-DV1, recipe schema from §20.0 | §8.12 + 3 new pattern recipes per §20.0 schema (`dashboard-chart-row`, `time-comparison-chart`, `distribution-drilldown`) | Elena |
| **U1.14** | New `data-viz/` domain in `Risqbase-Inc/ui-components` with all primitives shipped | Domain mentioned in v4.1 §22.2 but empty | S-REP1, S-REP4 | New folder structure under `src/data-viz/` with components (BarChart, LineChart, AreaChart, ScatterChart, Heatmap, WorldMap, Sparkline, Gauge, MetricCard, etc.) and per-component story file | Priya + Alex |

### F2 — Signatures decoupled from RALIA

**Goal.** Remove "RALIA-only by accident". Promote universals to shared primitives. Create new `ai/` domain.

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U2.1** | Build a generic Gauge primitive in `data-viz/` accepting any 0–100 value, any palette, any role | Risk Gauge is RALIA-private; Cortex needs system-health gauges; marketing needs % stats | S-DV4 (Apple's Gauge anatomy roles), recipe schema | New shared `<Gauge>` component with `role` prop (`headline | summary | accessory | inline`), `palette` prop (defaults to teal), no compliance semantics. RALIA Risk Gauge becomes a configured wrapper. | Priya |
| **U2.2** | Refactor RALIA Risk Gauge to compose from the generic primitive | Risk Gauge owns logic that should be shared | S-DV4, S-DV5 | RALIA Risk Gauge in `Risqbase-Inc/Ralia` becomes ~60 lines wrapping the generic primitive with inherent/residual semantics + risk-band labels. Verified visually identical pre/post. | Priya |
| **U2.3** | Create new `ai/` domain in `Risqbase-Inc/ui-components` | v4.1.1 §22.2 says "no `ai/` domain"; this was wrong | S-CON4, S-REP1 | New `src/ai/` folder; package.json export `@risqbase-inc/ui-components/ai`; published in next minor version | Alex + Elena |
| **U2.4** | Promote Citation Chip family to `ai/` domain | Citation is a system value, not RALIA value | v4.1 §7.12, S-CON4 | Citation Chip moves from `Risqbase-Inc/Ralia` to `ui-components/ai/`. v4.1 §7.12 spec preserved verbatim. RALIA imports from public package; no behaviour change. | Priya |
| **U2.5** | Promote streaming-text primitive (`<StreamingText>`) to `ai/` | IRIS streaming is universal; only IRIS *character* is RALIA | v4.1 §6.5, S-CON4 | Generic `<StreamingText>` in `ai/` with token-by-token reveal, citation-chip slot, error-mid-stream state. IRIS-specific styling stays private. | Priya |
| **U2.6** | Promote prompt-chip primitive to `ai/` | Empty AI states need prompt suggestions everywhere | v4.1 §6.5 empty IRIS panel | `<PromptChip>` in `ai/`. Used by IRIS empty states and any future Cortex AI feature. | Priya |
| **U2.7** | Promote Long Operation pattern (without IRIS narration) to `core/` | Pattern is universal; IRIS narration variant is RALIA | v4.1 §7.13.1 | Generic `<LongOperation>` in `core/` with stepped pattern, cancel, background-able, reduced-motion. RALIA wraps it for IRIS-narrated variant. | Priya |
| **U2.8** | Update §22 (Repository & Package Architecture) to reflect new domain layout | Architecture section out of date | Self | §22.2 rewritten: domains are `core / data-viz / ai / marketing / tokens`; per-property import table updated | Elena |
| **U2.9** | Update §23 (Promotion Criteria) to mark all promoted components as `promoted: 7 May 2026` | Audit trail of promotions | Self | §23 with explicit promotion log: each component, date promoted, who triggered, justification | Elena |
| **U2.10** | Migrate RALIA assessment-outcome patterns to consume promoted primitives | Patterns reference RALIA-private components; should reference shared | v4.1 §20.2, recipe schema | DPIA/LIA/FRIA/Vendor outcome recipes' `composed_of:` updated to import from shared package; verified no functional regression | Elena + Priya |

### F3 — Content design as a first-class layer

**Goal.** Add §10.x subsections that do for words what §15 does for tokens. Compliance products live or die by language precision.

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U3.1** | New §10.5 "Content patterns" — error message, notification, empty-state, button verb taxonomy, confirmation language | Voice & Tone alone doesn't specify content patterns | S-CON1, S-CON2, S-CON3 | §10.5 with 6 pattern templates (situation/cause/recovery for errors; subject/verb/object for notifications; etc.), each with 5+ examples | Sophie + Elena |
| **U3.2** | New §10.6 "Canonical glossary" — assessment, risk, mitigated, compliance, etc. | Inconsistent terminology across surfaces | S-CON5, our own product audit | §10.6 with ~80 terms, each with: canonical form, prohibited synonyms, scope (where it applies) | Sophie |
| **U3.3** | New §10.7 "Help text patterns" — placeholder vs help-text-below vs info-tooltip vs inline explanation | When to use which is not documented; designers guess | S-CON1, S-CON2 | §10.7 decision rule + examples per surface | Sophie + Elena |
| **U3.4** | Extend §10.4 Number formatting to cover relative time, percent precision, currency, abbreviations | Current §10.4 only covers basic numerics | S-CON5 | §10.4 expanded — full table by data type (time, %, currency, count) and context (compact, default, comfortable) | Sophie |
| **U3.5** | New §10.8 "AI content rules" — how IRIS introduces citations, hedges low-confidence, asks clarifying questions, refuses | No spec for IRIS copy patterns | S-CON4, our own IRIS audit | §10.8 with 5 templates: introduction, hedge, refusal, clarification request, completion. Each with ~3 examples. Explicit prohibitions (no "I think", no apologetic openers, etc.) | Sophie + Elena |
| **U3.6** | New §10.9 "Localisation policy" — what's translated, what's not, how plurals work, RTL rules | i18n mentioned in §19.8 but content rules not specified | S-CON5 (UK gov plain-language), W3C i18n recommendations | §10.9 with policy + per-surface table | Sophie |
| **U3.7** | Update Pattern Recipe Schema (v4.1.1 §20.0) to require `voice_examples` populated from §10.5/§10.8 templates | Recipe schema requires `voice_examples` but doesn't anchor to canonical patterns | Self | §20.0 schema field doc updated; CI lint rule that `voice_examples` must reference §10.5/§10.8 template IDs | Elena |

### F4 — Component telemetry and adoption discipline

**Goal.** From "we have a system" to "we know our system is being used correctly."

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U4.1** | Specify telemetry event schema: component name, variant, surface, anonymised user-class, timestamp. No PII. No event content. | No telemetry exists; adoption is unobservable | S-TEL1, S-TEL2, S-TEL3 | New §15.7 "Telemetry" with event schema, opt-out policy, retention policy (30 days for raw, 1 year for aggregates), GDPR Article 6(1)(f) basis statement | Alex + Sophie |
| **U4.2** | Implement telemetry hooks in `core/` and `data-viz/` components | No instrumentation in any component | S-TEL3 | Each component fires `useComponentTelemetry()` on mount; centralised collector in `ui-components`; no-op in dev unless `RISQBASE_TELEMETRY=verbose` | Alex |
| **U4.3** | Build adoption dashboard (consume our own data product) | No view into which components are used where | S-TEL2 | Internal dashboard at `cortex.risqbase.com/admin/design-system-adoption` with per-component, per-product, per-variant counts and trend over 90 days | Alex |
| **U4.4** | Deprecation warning system | Deprecated components fail silently | S-REP4 | Components marked `@deprecated` log a warning in dev mode with migration path; CI check fails if any product imports a deprecated component without an explicit `// allow-deprecated: <reason>` comment | Alex |
| **U4.5** | Add adoption as a §23 promotion criterion | Promotion is currently approval-based, not evidence-based | Self | §23 amended: "promoted components must reach 80% of relevant surfaces in 90 days or be demoted back to private" | Elena |
| **U4.6** | Quarterly system review meeting tied to adoption dashboard | Governance is paper-only; no review cadence | S-REP4 | Calendar invite, fixed agenda template, recorded outcomes in `CHANGELOG.md` | Elena (chair) |

### F5 — Figma ↔ code token sync

**Goal.** Close the designer↔engineer loop. One source of truth visible from both sides.

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U5.1** | Adopt W3C Design Tokens Format for `tokens.json` source-of-truth | Current tokens are bespoke JSON; W3C is the standard | S-TOK3, S-TOK1, S-TOK6 | `tokens/` folder migrated to `$value` / `$type` / `$extensions` schema. Style Dictionary build re-pointed. Outputs unchanged. | Alex |
| **U5.2** | Add Figma `$extensions.org.risqbase.figma` metadata: collection, mode, scopes | Tokens have no Figma binding | S-TOK1, S-TOK5 | Each token annotated with Figma collection/mode/scopes per Primer convention | Alex |
| **U5.3** | Set up Tokens Studio (or custom Figma Variables API integration) for one-way GitHub→Figma sync | No Figma↔code sync | S-TOK4, S-TOK5 | CI job runs on `main` push that exports tokens to Figma Variables; designers see updated values within 5 min of merge | Alex |
| **U5.4** | Document Figma library structure mirroring code domains: Primitives / Core / Data-Viz / AI / Marketing | Designers don't know which Figma library maps to which code domain | S-TOK2, S-REP1 | §15.8 "Figma library structure" — table mapping Figma library to code domain | Elena + Alex |
| **U5.5** | Light/dark/high-contrast mode token files (per Primer convention) | Themes mentioned in v4.1 §15.2; not implemented | S-TOK1 | `tokens/themes/` with `light.json5`, `dark.json5`, `light.high-contrast.json5`, `dark.high-contrast.json5`. Override-only model — only changes from base mode. | Alex |
| **U5.6** | Token validation lint (Primer-style) | Names drift; no enforcement | S-TOK1, S-TOK6 | `npm run lint:tokens` — enforces kebab-case (or camelCase) naming, valid `$type`, valid `$value` reference resolution, no orphan tokens | Alex |
| **U5.7** | Update §17 verification checklist with token-sync rules | Checklist doesn't cover the new pipeline | Self | New checklist rows 53–60 covering U5.1–U5.6 outcomes | Elena |

### F6 — Cross-cutting (housekeeping that ties F1–F5 together)

| ID | Update | Gap closed | Sources | Expected outcome | Owner |
|----|--------|-----------|---------|------------------|-------|
| **U6.1** | Update §22.2 package domain structure to include `ai/` and `data-viz/` (with full content, not stub) | Sections currently stub | Self | §22.2 rewritten with each domain's contents listed | Elena |
| **U6.2** | Update §15.6 v4.1 token additions to v4.2: include all chart palette tokens, gauge primitive role tokens, citation-chip role tokens, telemetry-config tokens | Token list out of date | Self | §15.6 expanded with ~200 net new role tokens | Alex |
| **U6.3** | Add Verification Checklist rows for F1–F5 outcomes (rows 53–80) | Checklist doesn't cover new sections | Self | §17 expanded; CI runs check that every row has automated verification where possible | Elena |
| **U6.4** | Update Migration §16 with v4.1 → v4.2 actions | No upgrade path documented | Self | §16.2 added with one-row-per-update migration table | Elena |
| **U6.5** | Update package version: `1.1.1` → `1.2.0` (minor — additive); document version v4.1.1 → v4.2 | Version not bumped | Self | Version block updated; CHANGELOG entry | Alex + Elena |
| **U6.6** | Approve and ship v4.2 doc | n/a | Self | All approvers sign; doc posted to `design.risqbase.com/changelog/v4.2` (when site exists) | All |

---

## Audit Tracker

This is the contract. Every row is checked off as v4.2 ships. After v4.2 ships, audit against this same table — anything unchecked is a regression.

| Status | ID | Update | Owner | Verification |
|:---:|----|--------|-------|--------------|
| [ ] | **F1** | **Data Visualisation System** | | |
| [ ] | U1.1 | New §8 chapter authored (12 subsections) | Elena | §8 word count > 5000; 12 subsection headings present |
| [ ] | U1.2 | Chart-type taxonomy (~20 types) | Elena | §8.1 lists all 20+ types with use/avoid criteria |
| [ ] | U1.3 | Chart anatomy nouns added to §7.0 glossary | Elena | §7.0 contains `plot-area`, `axis`, `gridline`, `legend`, `tooltip`, `mark`, `scale`, `annotation`, `rule-mark`, `label-collision-strategy`, `series`, `category`, `value-encoding` |
| [ ] | U1.4 | Three palette systems (categorical, sequential, diverging) with role tokens | Elena + Priya | §8.3 has 3 palette tables + role tokens; contrast verified; colour-blindness verified |
| [ ] | U1.5 | Decision rules (data-shape → chart) | Elena | §8.4 decision matrix exists |
| [ ] | U1.6 | Per-chart-type state matrix (8 states × ~20 types) | Elena | §8.5 covers all chart types |
| [ ] | U1.7 | Per-chart-type accessibility spec | Elena + Priya | §8.6 covers all chart types; data-table fallback rule documented |
| [ ] | U1.8 | Print variants per chart type | Elena | §8.7 covers all chart types |
| [ ] | U1.9 | Library decision named (Visx/Recharts/etc.) | Alex + Elena | §8.8 names library + version + rationale |
| [ ] | U1.10 | World-map specification (projections, TopoJSON, palettes, missing data) | Elena + Alex | §8.11 covers all 7 sub-items in U1.10 outcome |
| [ ] | U1.11 | Sparkline + micro-chart spec | Elena | §8.9 expanded |
| [ ] | U1.12 | Generic heatmap spec (not just risk) | Elena | §8.10 covers both Risk Heatmap and Generic Heatmap |
| [ ] | U1.13 | Composite chart patterns added to §20 | Elena | 3 new pattern recipes per §20.0 schema |
| [ ] | U1.14 | `data-viz/` domain shipped in `ui-components` | Priya + Alex | `src/data-viz/` folder published to npm; `@risqbase-inc/ui-components/data-viz` import works |
| [ ] | **F2** | **Signatures decoupled from RALIA** | | |
| [ ] | U2.1 | Generic Gauge primitive in `data-viz/` | Priya | `<Gauge>` exported from public package; accepts `role` prop; no compliance semantics |
| [ ] | U2.2 | RALIA Risk Gauge refactored to wrap primitive | Priya | RALIA Risk Gauge component < 100 lines; visual regression test passes |
| [ ] | U2.3 | New `ai/` domain in `ui-components` | Alex + Elena | `src/ai/` folder published; v4.1.1 §22.2 statement reversed |
| [ ] | U2.4 | Citation Chip promoted to `ai/` | Priya | Imported from `@risqbase-inc/ui-components/ai`; RALIA repo no longer contains it |
| [ ] | U2.5 | StreamingText primitive promoted to `ai/` | Priya | `<StreamingText>` in `ai/`; IRIS uses it as a wrapped instance |
| [ ] | U2.6 | PromptChip promoted to `ai/` | Priya | `<PromptChip>` in `ai/` |
| [ ] | U2.7 | LongOperation promoted to `core/` | Priya | `<LongOperation>` in `core/`; RALIA wraps for IRIS-narrated variant |
| [ ] | U2.8 | §22 (Repository Architecture) rewritten | Elena | §22.2 lists 5 domains: core, data-viz, ai, marketing, tokens |
| [ ] | U2.9 | §23 (Promotion Criteria) updated with promotion log | Elena | §23 has explicit log entry for each promoted component |
| [ ] | U2.10 | RALIA outcome patterns migrated to shared primitives | Elena + Priya | DPIA/LIA/FRIA/Vendor recipes' `composed_of:` references shared package |
| [ ] | **F3** | **Content design as a first-class layer** | | |
| [ ] | U3.1 | New §10.5 Content patterns | Sophie + Elena | §10.5 with ≥6 templates, ≥5 examples each |
| [ ] | U3.2 | New §10.6 Canonical glossary | Sophie | §10.6 with ~80 terms |
| [ ] | U3.3 | New §10.7 Help text patterns | Sophie + Elena | §10.7 with decision rule + examples |
| [ ] | U3.4 | §10.4 Number formatting expanded | Sophie | §10.4 covers time, %, currency, count |
| [ ] | U3.5 | New §10.8 AI content rules | Sophie + Elena | §10.8 with 5 templates + prohibitions |
| [ ] | U3.6 | New §10.9 Localisation policy | Sophie | §10.9 with policy + table |
| [ ] | U3.7 | Recipe schema updated to require `voice_examples` reference §10 templates | Elena | §20.0 schema doc + CI lint rule |
| [ ] | **F4** | **Component telemetry and adoption** | | |
| [ ] | U4.1 | New §15.7 Telemetry event schema | Alex + Sophie | §15.7 with schema, opt-out, retention, GDPR basis |
| [ ] | U4.2 | Telemetry hooks implemented in `core/` and `data-viz/` | Alex | `useComponentTelemetry()` exists; called by all components in scope |
| [ ] | U4.3 | Adoption dashboard built | Alex | Live dashboard at internal URL with per-component data |
| [ ] | U4.4 | Deprecation warning system | Alex | Dev-mode warnings logged; CI check enforces |
| [ ] | U4.5 | §23 promotion criterion includes adoption threshold | Elena | §23 amended |
| [ ] | U4.6 | Quarterly review cadence | Elena | First review scheduled; agenda template in repo |
| [ ] | **F5** | **Figma ↔ code token sync** | | |
| [ ] | U5.1 | W3C Design Tokens Format adopted | Alex | `tokens/` migrated; build outputs unchanged |
| [ ] | U5.2 | Figma metadata added to all tokens | Alex | Every token has `$extensions.org.risqbase.figma` |
| [ ] | U5.3 | Tokens Studio / Figma Variables sync working | Alex | CI job exists; manual verification: change a token, confirm Figma update within 5 min |
| [ ] | U5.4 | §15.8 Figma library structure documented | Elena + Alex | §15.8 maps Figma libraries to code domains |
| [ ] | U5.5 | Light / dark / HC mode token files (override-only) | Alex | `tokens/themes/` populated |
| [ ] | U5.6 | Token validation lint | Alex | `npm run lint:tokens` exists; passes in CI |
| [ ] | U5.7 | §17 verification checklist updated | Elena | Rows 53–60 added |
| [ ] | **F6** | **Cross-cutting** | | |
| [ ] | U6.1 | §22.2 domain structure rewritten | Elena | §22.2 reflects all 5 domains |
| [ ] | U6.2 | §15.6 token additions list updated for v4.2 | Alex | §15.6 lists net-new role tokens (~200) |
| [ ] | U6.3 | §17 verification checklist expanded (rows 53–80) | Elena | Checklist covers all F1–F5 outcomes |
| [ ] | U6.4 | §16 migration table for v4.1 → v4.2 | Elena | §16.2 added |
| [ ] | U6.5 | Version bump (`1.1.1` → `1.2.0`; v4.1.1 → v4.2) + CHANGELOG | Alex + Elena | Package version updated; CHANGELOG entry exists |
| [ ] | U6.6 | v4.2 doc approved by all signatories + shipped | All | All approvers sign; doc shipped |

---

## Execution sequencing recommendation

Given solo-founder constraints (Elena is one person; Priya, Alex, Sophie are partial), v4.2 cannot ship as one atomic release. **Recommended phasing:**

| Phase | Ships | Why first | Approx duration |
|-------|-------|-----------|----------------|
| **v4.2-α** | U1.1–U1.14 (Data Viz chapter + `data-viz/` domain) + U6.1–U6.6 (cross-cutting) | Largest visible gap; unblocks Cortex; foundation for F2 | 4 weeks |
| **v4.2-β** | U2.1–U2.10 (signatures decoupled) | Depends on U1.1 (gauge primitive lives in `data-viz/`); architectural integrity | 2 weeks |
| **v4.2-γ** | U3.1–U3.7 (content design layer) + U5.1–U5.7 (Figma sync) | Independent of F1/F2; can run in parallel with α/β | 3 weeks |
| **v4.2-δ** | U4.1–U4.6 (telemetry + adoption) | Architectural; benefits compound over time but not blocking launch | 2 weeks |

**Total:** ~11 weeks if sequential; ~7 weeks if α/β and γ run in parallel. Realistic given solo-founder constraints: **8–10 weeks to ship v4.2 fully**.

If a hard launch date forces a cut, the irreducible minimum is **F1 + F2 + the cross-cutting (F6)** — those make the system credible to a buyer in a demo. F3–F5 can ship as v4.2.1 / v4.2.2 patches post-launch without embarrassment.

---

## Sign-off

| Role | Name | Status |
|------|------|--------|
| Principal Designer | Elena Vasquez | Authored plan |
| Frontend + UI | Priya Sharma | Pending review |
| Technical Lead | Alex Chen | Pending review |
| Growth & Success | Sophie Brennan | Pending review |
| CEO | Fiyin Adeleke | **Pending approval to begin execution** |

---

**Plan complete. Awaiting CEO approval before any v4.2 work begins.**

**END OF GOV-DS-2026-02-PLAN-420**
