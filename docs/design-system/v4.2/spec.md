# RisqBase Design System v4.2

**Document ID:** GOV-DS-2026-02
**Version:** 4.2
**Classification:** MANDATORY
**Date:** 7 May 2026
**Prepared by:** G4 (Design) (Principal Designer)
**Contributors:** Frontend (reports to G1) (Frontend + UI), G1 (Architecture) (Technical Lead), G8 (Growth) (Growth & Customer Success)
**Approved by:** CEO (CEO)
**Supersedes:** v4.1, v4.1.1 patch, v4.0, v4.0.1 patch, all prior versions
**Package version:** `@risqbase-inc/ui-components@1.2.0` (minor — additive)

> **System scope.** The RisqBase Design System is the parent design baseline for **all** RisqBase products: RALIA (ralia.io), RisqBase marketing (risqbase.com), and Cortex ([internal admin]). Product-specific signature components remain product-specific only when they cannot be expressed without product-specific semantics; the *system* is RisqBase-wide.

**v4.2 scope.** Consolidates v4.1 + v4.1.1 patch into a single authoritative document and lands six fundamental improvements identified in the post-v4.1.1 audit:

| # | Improvement | Sections affected |
|---|-------------|-------------------|
| **F1** | First-class **Data Visualisation System** | §7.0 (anatomy nouns), §8 (full chapter), §15 (chart palette tokens), §17 (checklist), §22 (`data-viz/` domain) |
| **F2** | Signatures **decoupled from RALIA** — generic Gauge primitive, new `ai/` domain, Citation Chip + StreamingText + PromptChip + LongOperation promoted | §6, §7.11, §7.12, §7.13.1, §22, §23 |
| **F3** | **Content design** as a first-class layer | §10 (full expansion: §10.5 Content patterns, §10.6 Glossary, §10.7 Help text, §10.8 AI rules, §10.9 Localisation) |
| **F4** | **Component telemetry and adoption discipline** | §15.7 (telemetry), §18.3 (review cadence), §23 (adoption-as-promotion-criterion) |
| **F5** | **Figma ↔ code token sync** | §15.1 (W3C Design Tokens Format), §15.2 (theme files), §15.8 (Figma library structure), §17 (lint) |
| **F6** | Cross-cutting consolidation | §22.2 (5-domain layout), §15.6 (token additions), §16.2 (migration), §17 (checklist rows 53–80) |

v4.2 is a **non-breaking minor revision** at the package level (`1.1.1` → `1.2.0`). At the document level, it supersedes v4.1.1 by re-publishing — every reader has one document to consume, not a baseline plus three patches.

This is the canonical world-class baseline. All subsequent revisions are deltas to v4.2.

---

## Table of Contents

0. Design Philosophy & Reading List
1. Colour System
2. Typography
3. Spacing & Density
4. Elevation & Depth
5. Motion & Keyboard
6. IRIS Visual Identity
7. Component Specifications
   - 7.0 Component Anatomy Glossary
   - 7.1–7.9 Existing components
   - 7.10 Metric / KPI Cards
   - 7.11 Gauge primitive family (shared) and Risk Gauge (RALIA-configured)
   - 7.12 Citation Chip family (now `ai/` shared)
   - 7.13 Loading states (incl. promoted Long Operation)
   - 7.14–7.16 Errors, state matrices, first-run states
8. **Data Visualisation System** *(new chapter)*
9. Print & PDF Specifications
10. **Voice, Tone & Content Design** *(expanded)*
11. Iconography
12. Brand Expression
13. Responsive Design
14. Dark Mode Pathway
15. Token Implementation *(W3C format, themes, Figma sync, telemetry)*
16. Migration from v4.1 to v4.2
17. Verification Checklist
18. Governance
19. Accessibility
20. Patterns
21. Prohibited Patterns
22. Repository & Package Architecture *(5 domains incl. `ai/` and full `data-viz/`)*
23. Promotion Criteria *(now adoption-evidence-based)*

---

## 0. Design Philosophy & Reading List

RisqBase products are used by DPOs, legal counsel, compliance officers, and operations teams at serious organisations. The visual design communicates **authority, precision, and intelligence** while remaining warm enough to use daily.

### 0.1 Five principles

1. **Restrained colour, deliberate accent.** Indigo is the brand. Everything else is neutral. Colour beyond indigo carries meaning.
2. **Typographic hierarchy does the heavy lifting.** Size, weight, tracking, and measure create structure. Colour is secondary.
3. **Motion serves function.** Every animation communicates a state change.
4. **Information density is a feature.** The system supports compact, default, and comfortable density modes. Power users control their own density.
5. **Keyboard-first.** Every action reachable by mouse is reachable by keyboard. Professionals who use these products 4+ hours daily deserve fluency, not just accessibility.

### 0.2 Four signature elements

Brand identifiers that, in isolation, identify the system:

1. **Iris Teal** — the IRIS accent colour, rooted in the eye/perception metaphor. No competitor uses teal for AI.
2. **The Gauge family** — generic stroked-arc primitive (shared) and the RALIA Risk Gauge configuration with inherent/residual delta (RALIA-configured). The dual-ring delta encoding is the canonical headline; no competitor encodes mitigation visually.
3. **The Citation Chip family** — verified, pending, low-confidence, retracted, external, multi-source. Promoted to the shared `ai/` domain in v4.2 because citation is a system value, not a RALIA value.
4. **The Concentric-Arc Pattern** — brand surfaces only; extends the gauge geometry to non-app surfaces.

### 0.3 Reading list

The RisqBase Design System is informed by deep study of the public canon. Where v4.x adopts a convention from one of these systems, the relevant section cites it inline. This is a transparency note, not an endorsement of dependency.

| System | Studied for | Licence |
|--------|-------------|---------|
| Apple Human Interface Guidelines | Signature-element treatment; Gauge, Badge, Chart sections; restraint | Proprietary (read-only reference) |
| Apple Swift Charts | Compositional grammar (Mark, Scale, Axis); chart anatomy | Proprietary (read-only reference) |
| Linear | Keyboard-first interaction; command palette; navigation grammar | Closed-source (public docs) |
| Adobe Spectrum | Per-component accessibility documentation; ARIA pattern depth; **data-viz palette taxonomy** | Apache 2.0 |
| IBM Carbon | Token architecture; themes; contextual and role tokens | Apache 2.0 |
| Shopify Polaris | Patterns layer; content-and-code parity; recipe model; **content design as a layer** | MIT |
| GitHub Primer | Repo topology; W3C Design Tokens Format; Figma↔code sync; OSS governance for small teams | MIT |
| Observable Plot | Open-source grammar of graphics — closest to our actual chart implementation | ISC |
| Datawrapper Academy | Chart-type-by-purpose taxonomy; choropleth construction | CC BY-NC |
| W3C Design Tokens Community Group | Token format specification (`$value`, `$type`, `$extensions`) | W3C Community licence |

---

## 1. Colour System

*Sections §1.1 through §1.9 are retained from v3.1 in full. Key facts:*

- **Brand:** Indigo-600 (#4F46E5). Reserved for CTAs, logo, links only.
- **AI accent:** Iris Teal-600 (#0D9488). IRIS identity, AI features. Tokens named `--iris-*`.
- **Neutrals:** Warm stone palette (stone-50 through stone-900).
- **Semantic tokens:** Full `--surface-*`, `--text-*`, `--border-*`, `--action-*`, `--status-*` layer. v4.1 added a third role-token tier above these (§15).
- **Module accents:** Unique hue per type, contrast-audited. DPIA=fuchsia, LIA=emerald, TIA=amber-700, FRIA=rose, CA=cyan, ACI=violet, ROPA=stone, ARA=pink. Operations: Incidents=red, DSR=sky, Vendors=orange, Training=lime-700, HI=blue.
- **Risk-band palette (canonical):** Low=emerald-600, Medium=amber-600, High=red-600, Critical=red-800. Used **system-wide** for risk classification regardless of module — see §8 and §8.10.
- **v4.2: chart palette systems.** v4.1 specified one palette ("8 colours ordered for perceptual difference") which is now the *categorical* palette. v4.2 adds two more palettes — **sequential** and **diverging** — full specification in §8.3 (Data Visualisation System) and tokens in §15.6.
- **Contrast:** All pairings meet WCAG 2.1 AA. Placeholder uses stone-500 (not stone-400).
- **Prohibited:** `gray-*`, `stone-400` for text, indigo for categorisation dots.

---

## 2. Typography

*Sections §2.1 through §2.6 are retained from v3.1 in full. Key facts:*

- **Font:** Geist Sans / Geist Mono.
- **Weights:** Regular (400), Medium (500), Semibold (600 for h1/display only).
- **Scale:** Display 30px, h1 24px, h2 18px, h3 16px, h4 14px, label 14px, caption 12px. All with `tracking-tight` above 18px.
- **Numerics:** `tabular-nums` mandatory on all numeric data — including chart axis labels, gauge centre values, and sparkline endpoint labels (§8.2).
- **Measure:** `max-w-prose` (65ch) on body text. `max-w-[50ch]` on help text.

---

## 3. Spacing & Density

### 3.1–3.2 Spacing Rhythm

*Retained from v3.1.* Base unit 4px. Tokens from `--space-xs` (4px) to `--space-3xl` (48px).

### 3.3 Layout Density Modes

A global `data-density` attribute scales spacing tokens across the entire layout.

| Mode | Attribute | Scale Factor | Who uses it |
|------|-----------|-------------|-------------|
| Compact | `data-density="compact"` | 0.75x | Power users, dense dashboards, audit logs |
| Default | `data-density="default"` | 1x | Standard usage |
| Comfortable | `data-density="comfortable"` | 1.25x | Onboarding, presentation mode |

Implementation per v4.1 §3.3.

### 3.4 Density Cascade to Components

Global `data-density` cascades automatically to components that internally use spacing tokens — including tables, forms, cards, **and chart components per §8** (axis label spacing, legend spacing, marker hit-targets).

**Tables specifically.** The table densities specified in §7.5 (compact/default/comfortable) are bound to `data-density` by default.

**Chart components specifically (v4.2).** Charts inherit `data-density` for non-visual spacing only — legend padding, axis-label gap, tooltip padding. They do **not** inherit it for the chart canvas itself; chart visual proportions remain stable so a "compact" chart and a "comfortable" chart of the same data render identically in the plot area.

**Rule of thumb.** Local override wins over global. Never both at once for the same element.

---

## 4. Elevation & Depth

*Retained from v3.1.* Four levels: Surface (none), Raised (1px), Floating (4px), Overlay (8px). Every shadow pairs with a border.

---

## 5. Motion & Keyboard

### 5.1–5.7 Motion Language

*Retained from v3.1.* Reactive/system/overlay categories. Lead/follow choreography. Reduced motion preserves functional transitions.

### 5.8 Keyboard & Focus System

*Retained from v3.2; expanded in v4.1 §5.9 (Command Palette) and v4.1.1 §5.8.3 (Keyboard Grammar).*

#### 5.8.1 Focus Rings

| Element | Focus-visible ring | Focus (mouse) |
|---------|-------------------|---------------|
| Buttons | `ring-2 ring-indigo-500 ring-offset-2` | No visible ring |
| Inputs | `ring-2 ring-indigo-500/20` + `border-indigo-500` | Same (always visible on inputs) |
| Cards (interactive) | `ring-2 ring-indigo-500 ring-offset-2` | No visible ring |
| Table rows | `ring-2 ring-indigo-500 ring-offset-[-2px]` (inset) | No visible ring |
| Links | `ring-2 ring-indigo-500 ring-offset-1` | No visible ring |
| IRIS FAB | `ring-2 ring-teal-500 ring-offset-2` | No visible ring |
| **Chart marks (v4.2)** | `outline: 2px solid var(--ring-focus); outline-offset: 2px` | No visible outline |

Use `:focus-visible` for keyboard focus, `:focus:not(:focus-visible)` to suppress mouse focus.

#### 5.8.2 Skip Links

First focusable element on every page is a visually-hidden skip link to `#main-content`, revealed on focus with the indigo brand pill style.

#### 5.8.3 Keyboard Shortcuts (Linear-inspired, grammar declared)

Shortcuts are first-class. Every primary surface and every primary action has a documented shortcut. Discoverability is mandatory: pressing `?` anywhere opens the cheatsheet; no shortcut may exist without appearing there.

##### 5.8.3.1 Grammar (four verbs)

Once a user learns the grammar, they can predict shortcuts they have never seen.

| Verb | Pattern | Meaning | Examples |
|------|---------|---------|----------|
| **Go to** | `g <letter>` (sequenced) | Navigate to a destination | `g d` Dashboard, `g a` Assessments, `g k` Knowledge Bank |
| **Find/run** | `Cmd/Ctrl+K` (modifier) | Open the command palette | Single key — palette is the universal verb-router |
| **Act on focus** | single letter (no modifier) | Operate on the currently focused item | `e` edit, `c` comment, `s` star, `x` toggle selection, `j`/`k` move focus |
| **Submit/save** | `Cmd/Ctrl+Enter` or `Cmd/Ctrl+S` (modifier) | Commit work in a form, composer, or modal | Always modified — never a single key |

**Why these four verbs and not more.** Adding a fifth verb dilutes muscle memory. New actions map to one of the four; if they cannot, the action itself is reconsidered before a new verb is invented.

**Why `g` is sequenced and act-on-focus is single-key.** Sequencing prevents collisions with text input. Single-key act-on-focus is reserved for surfaces where text input is not active. Forms and composers absorb single-key presses as text by default; `Escape` to leave a form re-enables single-key shortcuts.

**Mid-sequence indicator.** When the user has pressed `g` and is awaiting the next key, a subtle indicator appears bottom-right: `g —` with a 1.2s timeout countdown.

**Verb canon for `Cmd/Ctrl+K` results.** Result categories in priority order: Navigate · Recent · Run · Ask IRIS · Help. The "Ask IRIS" slot is the explicit graceful-degradation path: if the palette finds nothing, IRIS does.

##### 5.8.3.2 Cross-product destination map

The RisqBase Design System serves three products. **A `g <letter>` shortcut resolves to the analogous destination in whichever product the user is currently in.**

| Letter | RALIA (ralia.io) | Cortex ([internal admin]) | RisqBase marketing |
|--------|------------------|------------------------------|---------------------|
| `g d` | Dashboard | Dashboard (operations overview) | (n/a — no shortcuts on marketing) |
| `g a` | Assessments | Audits | n/a |
| `g h` | Horizon Intelligence | (reserved — Horizon when shared) | n/a |
| `g k` | Knowledge Bank | Knowledge (Cortex docs) | n/a |
| `g s` | Settings | Settings | n/a |
| `g t` | Team | Team | n/a |
| `g i` | Inbox / Notifications | Inbox / Notifications | n/a |

**Rule.** A letter is reserved across all products. A user who learns `g k` once never has to relearn it. Adding a new shortcut requires assignment in all products simultaneously, or formal reservation (unbound but not reassigned). Assignment is approved by G4, recorded in this table, and surfaced in the cheatsheet of every product within the same release.

##### 5.8.3.3 Full shortcut catalogue

**Global commands:**

| Shortcut | Action |
|----------|--------|
| `?` | Open keyboard shortcut cheatsheet |
| `Cmd/Ctrl+K` | Open command palette (§5.9) |
| `Cmd/Ctrl+/` | Focus search |
| `i` | Toggle IRIS panel |
| `n` | New (context-sensitive) |
| `Escape` | Close modal / panel / dropdown / cancel inline edit |
| `Tab` / `Shift+Tab` | Move focus forward / backward |

**Context shortcuts:**

| Surface | Shortcut | Action |
|---------|----------|--------|
| Any list | `j` / `k` | Next / previous item |
| Any list | `Enter` | Open selected item |
| Any list | `x` | Toggle selection |
| Assessment detail | `e` | Edit current section |
| Assessment detail | `c` | Comment |
| Assessment detail | `s` | Star / pin |
| IRIS panel | `Cmd/Ctrl+Enter` | Send message |
| IRIS panel | `Up arrow` | Previous prompt (in composer) |
| Modal | `Escape` | Close |
| Form | `Cmd/Ctrl+S` | Save (when applicable) |
| Form | `Cmd/Ctrl+Enter` | Submit |
| **Chart (v4.2)** | `Tab` | Move focus into the chart |
| **Chart (v4.2)** | `Arrow keys` | Move focus between marks |
| **Chart (v4.2)** | `Enter` / `Space` | Activate the focused mark (open detail, drill down) |
| **Chart (v4.2)** | `Escape` | Exit chart focus, return to surrounding flow |
| **Chart (v4.2)** | `t` | Toggle data-table fallback view (per §8.6) |

**Display convention.** Modifier keys render in canonical order: `Cmd → Ctrl → Alt/Opt → Shift → Letter`. Display the platform-correct modifier (`⌘` on macOS, `Ctrl` on Windows/Linux) detected from `navigator.platform`. Always pair the symbol with its name on first display in any tooltip: `⌘K (Cmd+K)`.

**Cheatsheet modal.** Opens with `?`. Lists all shortcuts grouped by section: Navigation, Commands, List, Forms, IRIS, **Chart**. `rounded-2xl shadow-overlay`, 560px max-width. Search box at top. Shortcuts inside the cheatsheet are rendered as `<kbd>` elements with `bg-stone-100 border border-stone-200 rounded px-1.5 text-xs font-mono`.

#### 5.8.4 Roving Tabindex

For composite widgets (tab bars, menus, table rows, **chart-mark groups**), use roving tabindex. Container has `tabindex="0"`; arrow keys move between items; only the active item carries `tabindex="0"`; Home/End jump to first/last.

#### 5.8.5 Focus-within for Compound Widgets

Form groups, card actions, and chart legends use `:focus-within` to highlight the parent.

### 5.9 Command Palette

*Retained from v4.1 in full.* Centred palette via `Cmd/Ctrl+K`. Result categories: Navigate / Recent / Actions / Search / Help. Implements WAI-ARIA combobox pattern.

---

## 6. IRIS Visual Identity

### 6.1–6.4 IRIS Brand, State Machine, Links, CTA

*Retained from v3.1.* Teal accent, 6-state machine (idle/thinking/streaming/error/offline/alert), "Ask IRIS" link pattern, indigo-600 when IRIS is a primary CTA.

### 6.5 IRIS Streaming Visual Contract

*Retained from v3.2 in full.* Five-stage sequence: Thinking → first token → citations fade in → complete + feedback → error mid-stream. Empty IRIS panel: centred "I" lettermark in `teal-100`, prompt chips below.

### 6.6 IRIS as a configured instance of `ai/` primitives (v4.2)

In v4.1.1 the IRIS components were RALIA-private. In v4.2, the **machinery** is promoted to the shared `ai/` domain (§22.2); the **identity** stays private.

| Layer | Where it lives | What it is |
|-------|---------------|-----------|
| `<StreamingText>` primitive | `@risqbase-inc/ui-components/ai` (shared, MIT) | Token-by-token reveal, citation-chip slot, error-mid-stream state, `aria-live="polite"` wrapper |
| `<PromptChip>` primitive | `@risqbase-inc/ui-components/ai` (shared, MIT) | Pre-filled prompt suggestion pill |
| `<CitationChip>` family | `@risqbase-inc/ui-components/ai` (shared, MIT) | All six states per §7.12 |
| `<LongOperation>` primitive | `@risqbase-inc/ui-components/core` (shared, MIT) | Generic stepped pattern with cancel — without IRIS narration |
| **IRIS character** | `Risqbase-Inc/Ralia` (private) | The "I" lettermark, conversation memory shape, RALIA-specific personality, `<IrisFab>`, `<IrisPanel>` |

The IRIS character composes from the shared primitives. RALIA owns the character; any RisqBase product gets the machinery for free. When Cortex needs an AI feature, it imports the same `<StreamingText>` and `<CitationChip>` and applies its own character on top.

This decoupling is the substance of F2. Three years of RALIA-only signature work becomes the foundation any product can build on.

---

## 7. Component Specifications

### 7.0 Component Anatomy Glossary

Component specifications are easier to write, read, and reuse when their parts share names. This glossary is the canonical noun list. New components compose from these nouns; new variants reuse them; the documentation site renders anatomy diagrams labelled with these nouns and nothing else. The list is normative.

#### 7.0.1 Container nouns

| Noun | Definition |
|------|-----------|
| **surface** | The outermost background of the component (card, modal body, panel) |
| **chrome** | Trim around content — header strip, footer strip, side rail |
| **canvas** | The interior region inside chrome where the primary content sits |
| **gutter** | Internal padding between surface edge and content |
| **rail** | A vertical strip running the full height of a component |
| **strip** | A horizontal version of a rail |
| **divider** | A 1px line separating regions inside a component |
| **affordance** | Any element communicating "you can act here" — corner ribbons, hover overlays, expand glyphs |

#### 7.0.2 Track and arc nouns (gauges, sliders, progress, charts)

| Noun | Definition |
|------|-----------|
| **track** | The inactive portion of any progress visual — always stone-200 per §7.11 |
| **arc** | The active portion of a radial progress visual — teal-600 by default per §7.11 |
| **bar** | The active portion of a linear progress visual; also a chart mark per §7.0.10 |
| **thumb** | The draggable element on a slider |
| **tick** | A discrete marker along a track or bar |
| **terminus** | The leading and trailing endpoints of an arc or bar (rounded by default) |
| **segment** | One of multiple discrete arcs or bars sharing a track |

#### 7.0.3 Label and value nouns

| Noun | Definition |
|------|-----------|
| **eyebrow** | The small label above a primary heading (uppercase tracking-wider) |
| **title** | The primary heading of a component or section |
| **subtitle** | The secondary line directly below a title |
| **caption** | Tertiary metadata in `text-xs text-stone-500` |
| **centre-value** | The numeric value rendered inside the centre of a gauge |
| **band-label** | The risk-band severity word ("Medium", "High") rendered below a gauge |
| **delta-pill** | The pill-shaped indicator below a dual-ring gauge showing the inherent→residual delta |
| **metadata-strip** | Horizontal row of caption-sized key/value pairs |

#### 7.0.4 Action nouns

| Noun | Definition |
|------|-----------|
| **trigger** | The element that opens or activates a secondary surface |
| **dismiss** | The element that closes a secondary surface |
| **primary** | The main action of a region — exactly one per §21.8 |
| **secondary** | A supporting action of equal-or-lesser weight |
| **tertiary** | A subordinate action rendered as a text link, never as a button |
| **overflow** | The `•••` menu trigger for actions beyond the primary/secondary set |

#### 7.0.5 State indicator nouns

| Noun | Definition |
|------|-----------|
| **dot** | A 6–8px filled circle indicating status, module, or unread state |
| **badge** | A pill carrying a status word, count, or category — per §7.4 |
| **indicator** | An icon-and-colour pair carrying a state |
| **glyph** | A non-icon symbolic mark (chevron, arrow, ellipsis) |
| **ring** | A focus or selection outline drawn around an element |
| **highlight** | A background tint indicating selection (`bg-indigo-50`) |

#### 7.0.6 IRIS-specific nouns

| Noun | Definition |
|------|-----------|
| **lettermark** | The square IRIS "I" mark — 24px standard, 16px in dense surfaces |
| **streamhead** | The leading cursor during IRIS streaming response (`▍`) |
| **citation chip** | The inline source-reference pill — see §7.12 |
| **prompt chip** | A pre-filled prompt suggestion in IRIS empty states |

#### 7.0.7 Pattern-level nouns (composition)

| Noun | Definition |
|------|-----------|
| **hero** | The top fold of a screen — the highest-importance region above any list/table |
| **fold** | A horizontal section of a screen separated from neighbours by significant whitespace |
| **shelf** | A horizontal scrolling row of similar items inside a fold |
| **rail** (page-level) | A persistent right-or-left column carrying secondary content |
| **footer-bar** | A sticky bottom bar carrying primary actions |

#### 7.0.8 Chart anatomy nouns (v4.2)

These nouns are the canonical vocabulary for the Data Visualisation System (§8). Every chart component, chart pattern, and chart documentation page references only these nouns.

| Noun | Definition |
|------|-----------|
| **plot-area** | The interior rectangular region where data marks are drawn — bounded by axes, excludes axis labels and legend |
| **axis** | A scale-bearing line at the edge of the plot-area; chart has 0–4 (top, right, bottom, left) |
| **gridline** | A faint line inside the plot-area aligned to an axis tick |
| **legend** | The key mapping series colours / shapes to labels |
| **tooltip** | An on-hover/focus overlay revealing the value at a specific data point |
| **mark** | A single visual element representing one data point — bar, line segment, dot, area patch (per Apple Swift Charts convention) |
| **series** | A collection of marks sharing a single visual encoding (one colour, one shape) representing one logical group |
| **category** | A discrete grouping along a categorical axis (a bar's x-position label, a pie wedge label) |
| **value-encoding** | The mapping rule from a data value to a visual property (length, position, colour, area) |
| **scale** | The mathematical transform between data values and visual coordinates (linear, log, ordinal, time) |
| **annotation** | A non-data overlay calling out a specific value, range, or event (a line, a label, a band) |
| **rule-mark** | A horizontal or vertical reference line spanning the plot-area (e.g., "target", "threshold", "median") |
| **label-collision-strategy** | The rule governing how axis or data labels behave when they would overlap (truncate, rotate, hide-alternate, smart-place) |
| **null-marker** | The visual treatment for missing data — a hatched cell, a dashed segment, a "no data" annotation |

#### 7.0.9 Why this glossary exists

Apple's HIG works across forty years of platforms because a "thumb" on a slider in iOS is the same noun as a "thumb" on a tvOS slider. New variants compose from a stable vocabulary.

For RisqBase specifically: with three properties consuming one design system, the glossary is the cross-product translator. A "centre-value" on a RALIA Risk Gauge means the same thing as a "centre-value" on a Cortex operational gauge. A "plot-area" in a RALIA assessment chart is the same plot-area in a Cortex audit-log chart and a marketing-site stat block. Anatomy diagrams on `design.risqbase.com` label parts using only these nouns — no synonyms, no aliases.

#### 7.0.10 Adding a new noun

Approval by G4. Recorded in this section. Cannot duplicate or alias an existing noun.

### 7.1–7.9 Existing Components

*Retained from v3.1:* Buttons, Cards, Inputs, Badges, Tables (3 densities, bound to global density per §3.4), Forms (field anatomy, validation timing), Toasts, Empty States, Navigation (breadcrumbs, tabs, segmented control).

### 7.10 Metric / KPI Cards

**Anatomy (top to bottom):**

| Element | Specification |
|---------|--------------|
| Label (eyebrow) | `text-xs font-normal text-stone-500 uppercase tracking-wider` |
| Centre-value | `text-2xl font-semibold text-stone-900 tabular-nums mt-1` |
| Delta (optional) | `text-xs font-medium mt-1` + trend arrow. Positive: `text-emerald-600` + `↑`. Negative: `text-red-600` + `↓`. Neutral: `text-stone-500` + `→` |
| Sparkline (optional) | 64px wide × 24px tall, stroke-width 1.5, colour matches delta. Per §8.9 |
| Caption (period) | `text-xs text-stone-400 mt-1` (e.g., "vs last month") |

**Size variants:**

| Size | Value text | Card padding | Use |
|------|-----------|-------------|-----|
| Hero | `text-4xl` | `p-6` | Dashboard top-level KPIs (1–3 per row) |
| Default | `text-2xl` | `p-5` | Standard metric cards (3–4 per row) |
| Compact | `text-lg` | `p-3` | Inline metrics within sections |

**Inverted semantics.** For risk scores, high = bad. Use `data-invert-trend="true"` to flip colours: rising values show red, falling show green.

**Drill-down.** If clickable: `cursor-pointer hover:shadow-raised` and a `ChevronRight` indicator (`w-3.5 h-3.5 text-stone-400`) at top-right.

#### 7.10.1 Score Display Decision Rule (canonical)

> **Compliance, risk, and coverage scores use the Gauge primitive (§7.11). Counts, deltas, durations, and money use the Metric Card.**

| Data type | Component |
|-----------|-----------|
| Risk score (residual, inherent, overall) | Gauge — Single or Dual-Ring (RALIA Risk Gauge configuration) |
| Compliance coverage % | Gauge — Single (generic primitive) |
| Assessment completeness % | Gauge — Single (generic primitive) |
| System health %, uptime %, audit-readiness % (Cortex) | Gauge — Single (generic primitive) |
| Conversion %, signup-rate % (marketing dashboards) | Gauge — Single (generic primitive) |
| Count of open DSRs, DPIAs, incidents | Metric Card |
| Currency, fines, budget | Metric Card |
| Time-to-completion, age, duration | Metric Card |
| Trend over time (any of the above) | Metric Card with sparkline |

If the value can be expressed as 0–100 and represents **how much of something is good or done**, gauge. If the value is a **count, currency, or duration**, card.

### 7.11 The Gauge family — generic primitive (shared) + Risk Gauge (RALIA-configured)

In v4.1.1, the Risk Gauge was RALIA-private; a "generic stroked-arc primitive" was named but not built. In v4.2, the **generic Gauge primitive ships in `@risqbase-inc/ui-components/data-viz`**, and the **RALIA Risk Gauge becomes a configured wrapper** that adds inherent/residual semantics, risk-band labelling, and assessment-context defaults.

This is the substance of F2. Cortex needs system-health gauges. Marketing needs "% of customers" stat gauges. Both get the primitive for free; neither has to know what a "DPIA" is.

#### 7.11.1 Generic Gauge primitive (shared, MIT)

**Location:** `@risqbase-inc/ui-components/data-viz/Gauge`.

**API:**

```ts
interface GaugeProps {
  value: number;                    // 0–100
  role: 'headline' | 'summary' | 'accessory' | 'inline';  // controls size
  variant?: 'single' | 'dual';      // default 'single'
  innerValue?: number;              // required when variant = 'dual'
  palette?: 'teal' | 'indigo' | 'stone';  // default 'teal'
  centreLabel?: string;             // optional below centre-value
  bandLabel?: { text: string; tone: 'emerald' | 'amber' | 'red' };  // optional
  deltaPill?: { text: string; tone: 'emerald' | 'amber' | 'stone' };  // optional, dual only
  ariaLabel: string;                // required
  ariaValueText?: string;           // overrides default "N out of 100"
  onClick?: () => void;             // when present, gauge becomes interactive
}
```

**Anatomy (using §7.0 nouns):**

- `track`: 6px stroke, stone-200 (4px on `inline` role)
- `arc`: 6px stroke, palette-600 (4px on `inline`), ease-out reveal 500ms
- `centre-value`: tabular-nums centred; size scales with role
- Below centre: optional `caption` (centreLabel)
- Below gauge: optional `band-label` in band tone
- Below band: optional `delta-pill` (dual variant only)

**Roles → sizes:**

| Role | Diameter | centre-value text | Use |
|------|----------|-------------------|-----|
| `headline` | 160px | `text-3xl` | Hero — assessment scorecard, regulator PDF cover, marketing hero stat |
| `summary` | 120px | `text-2xl` | Dashboard tile, list-detail panel |
| `accessory` | 80px | `text-xl` | Card, report section |
| `inline` | 48px | n/a (value renders right of gauge) | Table cell, list row, audit log |

**Variant: single.** One arc representing one value 0–100.

**Variant: dual.** Outer arc is `value` in `palette-stone-500`; inner arc 14px inboard is `innerValue` in `palette-{palette}-600`; 8px gap between rings. Mount animation: outer fills first (500ms), then inner (500ms with 200ms delay), then `delta-pill` fades in (1100ms total). Tells a story.

**Cross-cutting rules:**

- `track` is always stone-200. Never coloured.
- `arc` colour is **palette-600 by default**. The risk-band palette (emerald/amber/red) is reserved for `band-label` text below the gauge, never for `arc` itself.
- No gradient fills. Solid stroke only.
- No text inside the arc beyond `centre-value` + optional `centreLabel`.
- Do not stretch. Gauge renders only at one of the four canonical diameters.

#### 7.11.2 Generic Gauge — accessibility (Spectrum-inspired depth)

| Concern | Specification |
|---------|---------------|
| Role | `role="meter"` |
| Range | `aria-valuemin="0" aria-valuemax="100"` |
| Current value | `aria-valuenow="{value}"` |
| Human-readable description | `aria-valuetext="{ariaValueText ?? `${value} out of 100`}{bandLabel ? `, ${bandLabel.text}` : ''}"` |
| Dual variant | Two `role="meter"` elements wrapped in `role="group"` with `aria-labelledby` pointing to a visible heading |
| Reduced motion | Arcs render to final position without sweep |
| Forced colors | Arcs render in `CanvasText`; severity carried by adjacent `band-label` text |
| Focus | Gauge is focusable only when `onClick` is set; rendered as a `<button>` wrapper with full keyboard activation |
| Screen-reader announcement | Reads the `aria-valuetext`, never the visual stroke |

#### 7.11.3 RALIA Risk Gauge — configured instance (RALIA-private)

**Location:** `Risqbase-Inc/Ralia` (private).

**Implementation.** A thin wrapper (~80 lines) around the generic Gauge primitive that adds RALIA-specific semantics:

```tsx
interface RiskGaugeProps {
  inherent?: number;     // 0–100
  residual: number;      // 0–100, mandatory
  size: 'xl' | 'lg' | 'md' | 'sm';   // maps to role
  showInherent?: boolean;            // defaults true if inherent is provided
  // No palette prop — RALIA Risk Gauge is always teal
}
```

Internal rules:

- `size: 'xl'` (160px) — used on assessment scorecard hero and regulator PDF cover. Always dual.
- `size: 'lg'` (120px) — dashboard, list detail panel. Dual when both values exist.
- `size: 'md'` (80px) — cards, report sections.
- `size: 'sm'` (48px) — table cells, list rows, audit-log entries. Single only; value renders right of gauge.
- `band-label` derived from residual value: 0–24 = "Low" emerald, 25–49 = "Medium" amber, 50–74 = "High" red, 75–100 = "Critical" red-darker.
- `delta-pill` derived from `inherent - residual`: positive = `↓ {n} pts mitigated` teal-700 on teal-50; zero = `→ no change` stone-500 on stone-50.
- No external palette prop. Risk Gauge is always teal — preserves teal as the system's signature.

**Visual contract.** Pre/post v4.2 visual regression: identical. The wrapper changes the implementation, not the pixels.

#### 7.11.4 Other gauge configurations (v4.2)

The same primitive supports any product-specific gauge by adjusting palette + labels.

| Configuration | Lives in | Distinguishing |
|---------------|----------|---------------|
| **Cortex System Health Gauge** | Cortex (private) | Palette teal; `bandLabel` derived from SLA bands |
| **Marketing stat gauge** | Marketing (private) | Palette indigo; renders larger — `headline` role only |
| **Generic completeness gauge** | Anywhere | Default palette teal, no band-label |

Any future gauge is a configured instance, not a new primitive. Adding a new visual gauge variant requires G4's approval and updates §7.11.

### 7.12 The Citation Chip family — promoted to `ai/` (v4.2)

The inline source-reference indicator on AI-generated content. Co-equal signature with the Gauge family.

**v4.2 promotion.** Citation Chip is promoted from `Risqbase-Inc/Ralia` to `@risqbase-inc/ui-components/ai`. The full v4.1.1 specification is preserved verbatim; only the import path changes.

**Why.** Citation is a system value, not a RALIA value. Any AI feature in any RisqBase product needs to cite sources — Cortex's audit-log AI summariser, marketing's AI-assisted help search, any future product. Keeping Citation Chip RALIA-private was an accident of which product shipped first, not a principled architectural choice.

#### 7.12.1 Default state (verified citation)

```
Container: inline-flex items-center gap-1.5
           bg-white border border-stone-200 rounded-lg
           px-2 py-0.5 text-xs text-stone-600
           hover:border-stone-300 hover:bg-stone-50
           transition-colors cursor-pointer
           focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1

Icon: FileText (w-3 h-3 text-stone-400, strokeWidth 1.5)
Text: "{document name}, {section}" — truncated at 30ch with title tooltip
Activation: Click or Enter/Space — opens document at referenced section in a side panel.
```

#### 7.12.2 State matrix

| State | Visual | When |
|-------|--------|------|
| **Default (verified)** | White bg, stone border, FileText icon | AI retrieved a citation with high confidence |
| **Pending** | Stone-50 bg, stone border, `Loader2` icon spinning | Citation being fetched |
| **Low confidence** | Stone-50 bg, stone border, `AlertTriangle` icon stone-400, dashed border | AI returned citation with confidence < threshold |
| **Retracted** | Stone-50 bg, stone-300 border, strikethrough text, `XCircle` icon stone-400 | Citation withdrawn after fact-check or document deletion |
| **External (web)** | White bg, stone border, `ExternalLink` icon | Source is a web URL |
| **Hover (any state)** | Tooltip per §7.12.4 | Cursor over chip |
| **Focus-visible** | Ring per §5.8.1 | Keyboard navigation |
| **Active (pressed)** | `bg-stone-100` 100ms | Click in progress |

#### 7.12.3 Multi-source pattern

When a single AI assertion is supported by multiple citations, render up to 3 chips inline followed by an overflow chip:

```
[Citation 1] [Citation 2] [Citation 3] [+4 more ▾]
```

Click expands inline below the assertion in a `flex-wrap gap-1.5` container.

#### 7.12.4 Hover tooltip (excerpt preview)

On hover or keyboard focus, a tooltip appears 4px above the chip:

```
Container: rounded-lg shadow-floating bg-white border border-stone-200
           p-3 max-w-[360px] text-xs text-stone-700
Header: document name + section in text-stone-900 font-medium
Body: 2–3 line excerpt of the cited passage, italicised in text-stone-600
Footer: "Open in Knowledge Bank →" in text-indigo-600
Delay: 400ms before show, instant hide
```

Keyboard-accessible: `Tab` to chip → tooltip auto-shows.

#### 7.12.5 Print variant

In `@media print`:

```
Default → [Doc Name, §3.2]
Low confidence → [Doc Name, §3.2 — confidence: low]
Retracted → [retracted]
External → [Doc Name, URL]
```

Inline text uses `text-stone-700`, no border, no background, slightly smaller than body (`0.85em`). The citation list at the end of the report renders the full document title + URL anchored to the same `[n]` references.

#### 7.12.6 Failed retrieval state

If AI asserts something but retrieval fails (no citation could be linked), the assertion is wrapped in a stone-50 callout:

```
bg-stone-50 border-l-4 border-amber-500 p-3 rounded-r-lg
text-stone-700 text-sm
Icon: AlertCircle (text-amber-600 inline)
Suffix: "Source not yet retrieved. " + "Retry" link in text-teal-600.
```

Mandatory — never display an unsourced AI claim as if it were sourced.

#### 7.12.7 Accessibility (Spectrum-inspired depth)

| Concern | Specification |
|---------|---------------|
| Element | `<button type="button">` |
| Label | `aria-label="View source: {document}, {section}"` |
| Low confidence | Append " — low confidence" to `aria-label` |
| Retracted | Append " — citation retracted" to `aria-label`; `aria-disabled="true"`; not focusable in tab order |
| External | Append " — opens external link" to `aria-label`; icon receives `aria-hidden="true"` |
| Multi-source overflow | Overflow chip `aria-expanded="true|false"`; expanded list has `role="region" aria-label="Additional citations"` |
| Tooltip | `role="tooltip"`; chip has `aria-describedby` pointing to tooltip id |
| Pending | `aria-busy="true"`; not activatable until resolved |
| Failed retrieval callout | Container `role="note"`; "Retry" link is a real `<button>` |

### 7.13 Loading States

*Retained from v3.2.* Skeleton, inline spinner, optimistic UI, long task, streaming, stale data, button loading.

#### 7.13.1 Long Operation Pattern — promoted to `core/` (v4.2)

For DPIA generation, ROPA scans, IRIS deep analysis, bulk imports, and any compliance operation that takes 10s or longer.

**v4.2 promotion.** The generic stepped-pattern primitive is promoted from `Risqbase-Inc/Ralia` to `@risqbase-inc/ui-components/core`. The IRIS-narrated variant remains a RALIA wrapper that adds streaming step labels (per §6.5).

**Generic primitive (`<LongOperation>`, shared, MIT):**

```
Container: rounded-xl border border-stone-200 bg-white p-6 max-w-md
Header (title): text-base font-medium text-stone-900 — operation title
Subtitle: text-sm text-stone-500 — context
Step list: vertical, gap-3
  Each step:
    Indicator: Loader2 spinning (active) | CheckCircle2 (complete) | Circle (pending)
    Label: text-sm text-stone-700 (active) | text-stone-500 (complete) | text-stone-400 (pending)
    Optional duration caption: text-xs text-stone-400 right-aligned
Caption (elapsed): text-xs text-stone-500 below list — "Elapsed: 0:23"
Dismiss link: text-stone-500 hover:text-stone-700, appears after 3s
```

**Step copy convention.** Present-progressive verbs, no jargon. Maximum five steps. Sentence case. Examples in §10.5.

**Background-able variant.** For operations >30s, after 15s show a "Run in background" link. Clicking dismisses the modal and surfaces a persistent toast in the bottom-right with progress bar.

**IRIS-narrated wrapper (RALIA-private).** When the operation is AI-driven and IRIS is the actor, the active step label streams new tokens via `aria-live="polite"`, mirroring §6.5 streaming contract. Use only for genuinely IRIS-generated processes. Imported as `<IrisLongOperation>` from `Risqbase-Inc/Ralia`.

**Cancellation.** Pressing Cancel or Escape after 3s sends a cancellation request. Show "Cancelling…" for up to 5s, then either "Cancelled" toast or "Could not cancel" with explanation.

**Reduced motion.** Spinners replaced with pulsing dot. Step transitions instant.

### 7.14 Error & Feedback Patterns

*Retained from v3.2 in full.* See §10.5 for v4.2-canonical error message construction.

### 7.15 Component States Matrix

*Retained from v3.2 in full.*

### 7.16 First-Run & Zero States

*Retained from v4.1.* Universal first-run anatomy + canonical first-run views table + onboarding overlay. Copy in the table is now anchored to §10.5/§10.7 templates.

---
## 8. Data Visualisation System

### 8.0 Why this chapter exists

v4.1 specified one chart palette token (`--data-cat-1` through `--data-cat-8`) and noted that "charts use `tabular-nums`". That was the entirety of the data-visualisation guidance. In v4.2 the post-audit gap list named **First-class data-viz system** as the single largest documentation gap.

This chapter closes that gap. It establishes:

- A **chart-type taxonomy** with explicit choose-this-not-that rules (Datawrapper-inspired)
- A **compositional grammar** matching the actual implementation (`@visx`, Observable Plot, Apple Swift Charts model)
- Three **chart palettes** — categorical, sequential, diverging — with full token specifications (Spectrum-inspired)
- **Chart anatomy** using §7.0.8 nouns
- **Chart states** — empty, loading, error, partial, no-data — for every chart type
- **Chart accessibility** — keyboard navigation, screen-reader narratives, data-table fallback, contrast, motion
- **Risk-band visualisations** — including the choropleth world map for Horizon Intelligence
- A **first-class component family** under `@risqbase-inc/ui-components/data-viz`

After v4.2 ships, no chart anywhere in any RisqBase product is produced without referencing this chapter.

### 8.1 Chart-type taxonomy (Datawrapper-inspired)

Every chart in any RisqBase product must be classifiable as exactly one of the canonical types below. If a proposed chart cannot be classified, the chart is reconsidered before a new type is invented.

#### 8.1.1 The canonical chart types

Twenty-eight active types plus four deferred-to-v5, organised by **what question the chart answers**. Each type carries: one-line `use when`, one-line `do not use when`, anatomy noun set (cross-referenced to §7.0 + §8.2 marks), accessibility row in §8.5, and a decision-matrix row reference in §8.1.2. Deferrals are explicit, not silent.

This taxonomy is **the menu** — products choose from it, they do not invent new types without G4 approval (§8.1.3 governs additions). Sources: Datawrapper chart-type taxonomy, Apple Swift Charts grammar, Observable Plot model, Cleveland-McGill perceptual ranking.

##### Comparison — "how do these categories compare?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Bar (vertical)** | 2–12 discrete categories, short labels (≤12 chars) | Categories >12 — use horizontal bar | `plot-area`, `axis`, `gridline`, `BarMark`, `series`, `category`, `value-encoding` | §8.5.1 | DM-1 |
| **Bar (horizontal)** | 8–40 categories OR category labels >12 chars | Fewer than 5 categories — use vertical bar | as above with axis orientation swap | §8.5.1 | DM-2 |
| **Grouped bar** | Comparing 2–4 sub-series across 2–8 categories | More than 4 sub-series — use small-multiples bar layout; more than 8 categories — use heatmap | as bar, plus inner `series` grouping; legend mandatory | §8.5.1 | DM-3 |
| **Lollipop** | Same shape as bar but values cluster at similar magnitudes (visual differentiation is the lollipop head, not the bar height) | When precise magnitude reading matters more than ranking — use bar | `plot-area`, `axis`, `RuleMark` (stem), `DotMark` (head), `category`, `value-encoding` | §8.5.1 | DM-1 |
| **Dot plot** | Comparing values across categories where zero is meaningful and bars feel heavy (e.g., scores, counts, age) | Negative values — use bar with diverging axis | `plot-area`, `axis`, `DotMark`, `series`, `category`, `value-encoding` | §8.5.1 | DM-1 |

##### Distribution — "how is this value spread across observations?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Histogram** | Showing the frequency distribution of a continuous variable (binned) | The variable is discrete — use bar | `plot-area`, `axis`, `BarMark` (binned), `gridline`, `annotation` (bin width), `value-encoding` | §8.5.1 | DM-4 |
| **Box plot** | Showing five-number summary (min/Q1/median/Q3/max) and outliers across 2–12 groups | The reader is unfamiliar with quartile notation — use violin or annotated bar with mean | `plot-area`, `axis`, `RegionMark` (box), `RuleMark` (whiskers/median), `DotMark` (outliers), `category` | §8.5.1 | DM-4 |
| **Violin** | Showing distribution shape (not just summary stats) across groups | Sample size is small (n<30) — distribution shape is noise; use box plot | `plot-area`, `axis`, `RegionMark` (kernel-density silhouette), `category`, `value-encoding` | §8.5.1 | DM-4 |
| **Density curve** | Comparing the shape of two or three continuous distributions | More than three overlapping curves — use small-multiples histogram | `plot-area`, `axis`, `LineMark` (smoothed), `RegionMark` (filled, low-opacity), `series`, `value-encoding` | §8.5.1 | DM-4 |

##### Composition — "how does the whole break down?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Stacked bar** | 2–6 mutually-exclusive components, exact totals matter | Components don't sum to a meaningful total — use grouped bar | `plot-area`, `axis`, `BarMark` (stacked), `series`, `legend`, `value-encoding` | §8.5.1 | DM-5 |
| **Stacked area** | Time-series with cumulative decomposition into 2–6 series | Single series — use line; non-time x-axis — use stacked bar | `plot-area`, `axis`, `AreaMark` (stacked), `series`, `legend` | §8.5.1 | DM-7 |
| **Treemap** | Hierarchical part-to-whole with 10–50 leaves where ranking matters more than exact values | Fewer than 10 leaves — use bar; more than 50 — readability collapses | `plot-area`, `RegionMark` (nested rectangles), `TextMark` (labels), `annotation` (size scale) | §8.5.1 | DM-6 |
| **Sunburst** | Hierarchical part-to-whole emphasising the hierarchy itself (parent-child paths) | A flat list — use bar; readability across >3 hierarchy levels — use treemap | `plot-area`, `RegionMark` (radial nested wedges), `TextMark` (labels), `scale` (angular) | §8.5.1 | DM-6 |
| **Waffle** | Part-to-whole at small scale (single value as ~100 unit-squares) | More than three categories — readability collapses; use stacked-bar-100% | `plot-area`, `RegionMark` (unit grid), `legend`, `value-encoding` | §8.5.1 | DM-5 |

##### Relationship — "do these two variables correlate?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Scatter** | Two continuous variables, 10–10,000 observations, looking for correlation/clusters/outliers | Three or more dimensions needed — use small-multiples scatter; not bubble (§8.1.3) | `plot-area`, `axis` (x + y), `DotMark`, `annotation` (trend line where applicable), `value-encoding` | §8.5.1 | DM-8 |
| **Paired bar** | Comparing two values per category side-by-side (e.g., before/after, plan/actual) | More than 2 values per category — use grouped bar | `plot-area`, `axis`, `BarMark` (paired), `series` (2-only), `legend` | §8.5.1 | DM-3 |

*Bubble is prohibited per §8.1.3 (area encoding misperceived by ~30%). Three-dimensional relationships should use small-multiples scatter or a heatmap with a sized-marker mark.*

##### Time — "how does this change over time?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Line** | 2+ points along a continuous (usually time) axis, 1–8 series | Categorical x-axis with no order — use bar; 8+ series — use small-multiples | `plot-area`, `axis`, `LineMark`, `series`, `legend`, `gridline`, `tooltip` | §8.5.1 | DM-7 |
| **Area** | Cumulative total over time, broken down by 2–6 series (stacked) | Single series — use line; non-time x-axis — use stacked bar | `plot-area`, `axis`, `AreaMark` (stacked), `series`, `legend`, `gridline` | §8.5.1 | DM-7 |
| **Sparkline** | Inline supporting context next to a metric card, showing direction at a glance | Standalone — use line with axes | `LineMark` (no axes, no legend), `value-encoding` only | §8.5.1 | DM-9 |
| **Candlestick** *(deferred to v5)* | Financial OHLC time-series | — | — | — | — |

##### Geographic — "how does this value differ by place?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Choropleth** | Quantitative value per polygon (country, region, postcode area); reader compares regions | Point data — use symbol map; polygon counts ≤5 — use bar | `plot-area`, `ChoroplethMark`, `legend` (sequential scale), `tooltip`, `null-marker` (missing-data polygon) | §8.5.1 + §8.10.x | DM-10 |
| **Symbol map** | Point-located data (events, sites, addresses); reader scans density | Aggregable data — use choropleth; quantitative comparison across regions — use choropleth | `plot-area`, `DotMark` (sized + coloured), `legend`, `tooltip` | §8.5.1 | DM-10 |
| **Flow map** *(deferred to v5)* | Origin-destination flows over geography | — | — | — | — |

##### Part-to-whole — "what share is each component?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Donut (≤2 wedges only)** | Single binary share (e.g., "60% complete / 40% remaining"). Above 2 wedges, §8.1.3 prohibits — collapses to Gauge per §7.11 | More than 2 wedges — angle/area read badly; use stacked-bar-100% or bar | `plot-area`, `RegionMark` (2 wedges), `TextMark` (centre value), `legend` | §8.5.1 | DM-5 |
| **Waffle** | Small-scale part-to-whole, 2–3 categories, totals add to 100 | More than 3 categories — see Composition row above | (see Composition / Waffle) | §8.5.1 | DM-5 |
| **Stacked-bar-100%** | Comparing the proportional breakdown across 2–12 categories where exact magnitudes don't matter | Magnitudes matter — use stacked bar (absolute) | `plot-area`, `axis` (normalised to 100%), `BarMark` (stacked-normalised), `series`, `legend` | §8.5.1 | DM-5 |

##### Single-value — "what is the headline number?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Metric card** | One value (with optional delta), full-text label, no trend shape needed | Trend shape matters — add a sparkline below the value, or upgrade to gauge | `TextMark` (value + label + optional delta-pill), `value-encoding` | §8.5.1 + §7.10 | DM-9 |
| **Gauge** | Score / progress / coverage value on a fixed 0–100 (or other bounded) scale, optionally with risk-band | Unbounded value — use metric card; multiple values — use small-multiples gauge | (see §7.11 generic Gauge primitive) | §8.5.1 + §7.11 | DM-9 |
| **Sparkbar** | Inline supporting context where multiple discrete values matter (vs Sparkline for continuous trend) | Continuous trend — use sparkline | `BarMark` (no axes, no legend), `value-encoding` only | §8.5.1 | DM-9 |

##### Flow — "how do entities move between states?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Funnel** | Sequential stage-by-stage conversion (e.g., assessment lifecycle steps where each stage is a subset of the previous) | Stages are not strictly nested — use grouped bar | `plot-area`, `RegionMark` (stage bars, decreasing width), `TextMark` (counts + drop-off %), `annotation` | §8.5.1 | DM-11 |
| **Sankey** *(deferred to v5)* | Multi-stage flow with branching/joining (energy flow, customer journey) | — | — | — | — |

##### Heatmap — "how do two dimensions interact?"

| Type | Use when | Do not use when | Anatomy (§7.0 / §8.2) | A11y | DM |
|------|---------|----------------|----------------------|:---:|:---:|
| **Heatmap (categorical)** | Two categorical dimensions intersecting (e.g., likelihood × impact 5×5 matrix; vendor × control coverage) | Continuous data on one axis — use line or scatter | `plot-area`, `axis` (x + y categorical), `HeatmapMark`, `legend` (sequential or diverging), `tooltip`, `TextMark` (in-cell value) | §8.5.1 + §8.11.x | DM-3 |

#### 8.1.2 Decision matrix — data shape to canonical type

Before producing any chart, the author answers three "do we even need a chart?" questions in writing (in the pattern recipe under `composed_of`):

1. **What single sentence is this chart meant to support?** If you cannot write the sentence, you cannot draw the chart.
2. **Could a single number, a sentence, or a sparkline answer the same question?** If yes, use that instead.
3. **Will the reader be looking for a value, a comparison, a trend, a distribution, a relationship, a composition, a flow, or a geographic pattern?** This selects the chart type via the matrix below.

This test is mandatory in pattern recipes that contain `composed_of: [chart, ...]`. Reviewers (G4) reject pattern PRs that skip it.

| DM | Data shape | Canonical type(s) | Fallback if criteria don't fit |
|:---:|------------|--------------------|--------------------------------|
| **DM-1** | Single series, 2–12 discrete categories, short labels | Bar (vertical), lollipop, dot plot | Horizontal bar (DM-2) when labels >12 chars or categories >12 |
| **DM-2** | Single series, 8–40 categories OR long labels | Bar (horizontal) | Treemap when ranking matters more than exact values and N > 40 |
| **DM-3** | Multi-series across categories (2–4 series, 2–8 categories) | Grouped bar, paired bar, heatmap (when both dimensions categorical) | Small-multiples bar when series > 4 |
| **DM-4** | Continuous variable, distribution shape matters | Histogram (binned), box plot (summary), violin (shape), density curve (shape + overlay) | Box plot when audience is statistical; histogram when audience is general |
| **DM-5** | Part-to-whole composition (single value or per-category) | Stacked bar, waffle (small), stacked-bar-100%, donut (≤2 wedges only) | Bar table when component count > 6 |
| **DM-6** | Hierarchical part-to-whole | Treemap (ranking matters), sunburst (hierarchy matters) | Indented bar list when hierarchy is shallow (≤2 levels) and order matters |
| **DM-7** | Time series, continuous trend | Line (1–8 series), area (cumulative, stacked) | Small-multiples line when series > 8 |
| **DM-8** | Two continuous variables, correlation/cluster/outlier hunting | Scatter (with optional trend annotation) | Heatmap (2D categorical version) when both variables become categorical |
| **DM-9** | Single value, optionally with direction or trend | Metric card (just value), gauge (bounded scale), sparkline (trend shape), sparkbar (discrete values inline) | Bar table when N values > 8 and inline doesn't fit |
| **DM-10** | Geographic value per region or per point | Choropleth (per polygon), symbol map (per point) | Bar list of top-N regions when geographic context isn't load-bearing |
| **DM-11** | Sequential conversion / drop-off stages | Funnel | Stacked-bar-100% when stages aren't strictly nested |

**Reading rule.** If two data shapes apply (e.g., time series across categories), prefer the row that captures the **primary question** the chart answers. If still ambiguous, prefer the canonical type with the higher Cleveland-McGill perceptual rank (position-along-common-scale > length > angle/area).

#### 8.1.3 Charts you may *never* produce

| Type | Why prohibited |
|------|----------------|
| **Pie chart** | The eye reads angle and area badly. Always use bar instead. The only exception is the Risk Gauge, which is not a pie chart — it is a single-arc dial showing one value 0–100. |
| **Donut chart with > 2 wedges** | Same reason. Two-wedge donuts (e.g., "60% complete / 40% remaining") collapse to a Single-Value Gauge per §7.11. |
| **3D anything** | Distorts the value-encoding. There is no scenario where a 3D chart in RisqBase is correct. |
| **Word clouds** | Encodes word frequency in font size — unreadable, and tends to mask risk signals in noise. |
| **Radar / spider chart** | Visually compelling, mathematically dishonest — area scales with the square of values, exaggerating outliers. Use a small-multiples bar layout instead. |
| **Dual-axis line chart with unrelated series** | Two y-scales sharing one plot-area implies a relationship the data does not support. If two metrics genuinely belong in one chart, normalise to a shared scale or use small multiples. |
| **Bubble chart** | Area encoding is misperceived by ~30%. If three dimensions truly need to coexist, use a small-multiples scatter or a heatmap with a sized-marker mark. |

This list is normative. Adding to it requires G4's approval. **Removing** from it requires unanimous approval from G4, Frontend, and G1.

### 8.2 Compositional grammar (Apple Swift Charts / Observable Plot model)

Charts are not opaque components. They are compositions of **scales + marks + axes + annotations** over a data array. The component library exposes that grammar — a single `<Chart>` element that takes children, mirroring `Chart { BarMark(...) }` in Swift Charts and `Plot.plot({ marks: [Plot.barY(...)] })` in Observable Plot.

#### 8.2.1 Data shape

Every chart consumes a `data: T[]` array. Each element is a row. There is no "wide" format. If your data is wide, pivot it before passing.

#### 8.2.2 Marks (using §7.0.8 nouns)

| Mark | Renders | Encodes |
|------|---------|---------|
| `<BarMark>` | `bar` (vertical or horizontal) | Length = numeric value; position = category |
| `<LineMark>` | A `series` of connected `mark` segments | Position = (time, value); colour = series identity |
| `<AreaMark>` | A filled region under one or more lines | Same as line, plus stack semantics |
| `<DotMark>` | Discrete `mark` dots | Position = (x, y); size optional |
| `<RuleMark>` | A horizontal or vertical reference line | Threshold, target, median, "now" |
| `<RegionMark>` | A shaded vertical band | Highlighted period (incident window, fiscal year) |
| `<TextMark>` | Inline data label adjacent to a `mark` | Annotation |
| `<ChoroplethMark>` | A region (country/admin-1) filled by a value | Geographic value-encoding (§8.10) |
| `<HeatmapMark>` | A cell in a 2D categorical grid | (cat-x, cat-y) → value-encoding |

Every mark accepts `aria-label` (per-mark) and is keyboard-focusable in chart focus mode (per §8.5).

#### 8.2.3 Scales

| Scale | When | Spec |
|-------|------|------|
| `linear` | Numeric continuous | Default y-scale for bar / line / area / dot |
| `time` | Date or datetime | Default x-scale for line / area when x is time |
| `band` | Discrete category | Default x-scale for bar |
| `log` | Wide range, multiplicative | Only when `min/max` ratio > 100 and the author has stated *why* in the pattern recipe |
| `ordinal` | Ordered category | Risk bands (Low → Critical), severity tiers |

Linear scales must include zero unless deliberately suppressed for a documented reason recorded in the pattern recipe. Time scales render in the user's locale via `Intl.DateTimeFormat`.

#### 8.2.4 Axes

Axes default to:

- Tick labels in `text-xs text-stone-500 tabular-nums`
- Axis line in `border-stone-200`
- Gridline in `border-stone-100` (renders only on numeric axes)
- Axis title (rare) in `text-xs text-stone-700` rotated -90° on y-axis

`label-collision-strategy` per §7.0.8:
- Time axis: hide-alternate, then rotate -45°, then truncate with title tooltip
- Categorical axis (vertical bar): rotate -45° at 6+ categories, switch to horizontal bar at 12+
- Numeric axis: smart-place to avoid overlap; never rotate

#### 8.2.5 Annotations

`<RuleMark>` and `<TextMark>` are the only annotation types. They render *above* gridlines, *below* data marks. Annotation colour is stone-600 by default, never a category colour. To highlight a threshold use `--status-warning` (amber) or `--status-error` (red) explicitly.

### 8.3 Chart palettes (Spectrum-inspired)

Three palettes. Each has explicit usage rules. **Do not use one palette in another's situation.**

#### 8.3.1 Categorical palette (8 hues)

For unordered categories — module types, vendor categories, incident classes.

| Slot | Token | Hex | Source |
|------|-------|-----|--------|
| 1 | `--chart-cat-1` | `#0D9488` | teal-600 |
| 2 | `--chart-cat-2` | `#4F46E5` | indigo-600 |
| 3 | `--chart-cat-3` | `#A21CAF` | fuchsia-700 |
| 4 | `--chart-cat-4` | `#0E7490` | cyan-700 |
| 5 | `--chart-cat-5` | `#7C3AED` | violet-600 |
| 6 | `--chart-cat-6` | `#BE185D` | rose-700 |
| 7 | `--chart-cat-7` | `#0369A1` | sky-700 |
| 8 | `--chart-cat-8` | `#9D174D` | pink-800 |

Ordering is by perceptual difference, not hue order. Use slots in sequence — first series → slot 1; second → slot 2; etc. Wrap with redundant encoding (pattern, dash style) at slot 9+.

**Never use the categorical palette to encode a value.** It carries no ordinal meaning.

**Never use risk-band colours (emerald/amber/red) as categorical slots.** Risk-band semantics are reserved.

#### 8.3.2 Sequential palette (5 steps, teal-anchored)

For a continuous value — % completion, count, density, score where higher = more.

| Step | Token | Hex |
|------|-------|-----|
| 1 (low) | `--chart-seq-1` | `#CCFBF1` (teal-100) |
| 2 | `--chart-seq-2` | `#5EEAD4` (teal-300) |
| 3 | `--chart-seq-3` | `#14B8A6` (teal-500) |
| 4 | `--chart-seq-4` | `#0F766E` (teal-700) |
| 5 (high) | `--chart-seq-5` | `#134E4A` (teal-900) |

Use 3 steps for low-resolution choropleths, 5 for high. Never interpolate continuously — discrete steps only. Below the lowest step, use `--surface-muted` with a hatched fill for null-marker per §7.0.8.

**Indigo sequential variant** (`--chart-seq-alt-{1..5}`, indigo-100 → indigo-900) is available when the chart sits next to teal IRIS content and the palettes would otherwise read as the same series.

#### 8.3.3 Diverging palette (5 steps, neutral-centred)

For a value with a meaningful midpoint — a delta from baseline, sentiment, "good vs bad" axis. Centre is neutral, not a colour.

| Step | Token | Hex | Meaning |
|------|-------|-----|---------|
| -2 (worst) | `--chart-div-n2` | `#991B1B` (red-800) | Strongly negative |
| -1 | `--chart-div-n1` | `#FCA5A5` (red-300) | Negative |
| 0 (neutral) | `--chart-div-0` | `#E7E5E4` (stone-200) | At baseline / no signal |
| +1 | `--chart-div-p1` | `#6EE7B7` (emerald-300) | Positive |
| +2 (best) | `--chart-div-p2` | `#065F46` (emerald-800) | Strongly positive |

Used in heatmaps showing change-from-baseline; never used to colour categorical series.

#### 8.3.4 Risk-band palette (system-wide, ordinal)

The canonical risk severity colours. Used **only** for risk classification — gauges, risk heatmaps, threshold annotations, regulatory risk tables. Never used for non-risk data.

| Band | Token | Hex |
|------|-------|-----|
| Low | `--risk-low` | `#059669` (emerald-600) |
| Medium | `--risk-medium` | `#D97706` (amber-600) |
| High | `--risk-high` | `#DC2626` (red-600) |
| Critical | `--risk-critical` | `#991B1B` (red-800) |

Risk-band colours are paired with the band-label text — colour is never the only signal. The 5×5 risk matrix in §8.11 demonstrates the canonical use.

#### 8.3.5 Palette-collision rules

- One chart, one palette family. Never mix categorical + sequential in the same plot-area.
- The risk-band palette overrides any other palette when the data dimension is risk severity. A bar chart of "DPIA count by risk band" uses risk-band colours, not categorical.
- Marketing site charts may use the indigo-sequential variant exclusively (no teal) when the chart is on a marketing-only page; auth'd-app charts default to teal.

### 8.4 Chart anatomy and defaults (using §7.0 nouns)

Every chart, regardless of type, has the following structure and visual defaults.

| Part | Default |
|------|---------|
| `surface` | White, `rounded-xl border border-stone-200 shadow-raised` |
| `chrome` (header) | 16px gutter; contains `eyebrow`, `title`, optional `caption`, optional `overflow` menu top-right |
| `plot-area` | Flush to chrome bottom; 16px top gutter, 24px right gutter, 8px bottom gutter (above x-axis), 32px left gutter (right of y-axis) at default density |
| `axis` (x, y) | Axis line `border-stone-200` 1px; tick labels `text-xs text-stone-500 tabular-nums`; gridlines `border-stone-100` |
| `legend` | Below plot-area in horizontal flex `gap-4`; each entry: `dot` (8×8) + label `text-xs text-stone-700`. Above plot-area only when chart is small (under 240px wide). |
| `tooltip` | Floating overlay, `rounded-lg shadow-floating bg-white border border-stone-200 p-2.5 text-xs`, max-width 280px, animates in 100ms ease-out |
| `mark` | Default fill from active palette; `mark` opacity 1; on hover, sibling marks fade to 0.4 opacity, focused mark stays 1 |
| `annotation` | Stone-600 by default; thresholds use `--status-warning` or `--status-error` |
| `null-marker` | Hatched fill (`background: repeating-linear-gradient(45deg, #F5F5F4, #F5F5F4 4px, #E7E5E4 4px, #E7E5E4 8px)`); included in legend with label "No data" |

#### 8.4.1 Sizes and roles

Mirror Gauge's role pattern.

| Role | Min height | Use |
|------|-----------|-----|
| `headline` | 320px | Hero region of dashboard or assessment outcome |
| `summary` | 200px | Standard dashboard tile |
| `accessory` | 120px | Card-embedded, sidebar |
| `inline` | 64px (sparkline only) | Inside metric card |

A chart smaller than 320px omits a legend if it has 1 series; legend is required at 2+ series regardless of size.

#### 8.4.2 Density

Per §3.4: chart `plot-area` proportions are stable across density modes. Only the gutter, axis-label spacing, and legend padding scale.

### 8.5 Chart accessibility

Charts are the most-failed accessibility surface in the industry. v4.2 specifies the bar — every chart in RisqBase clears it.

#### 8.5.1 Five mandatory provisions

Every chart implements all five.

| # | Provision | Specification |
|---|-----------|---------------|
| 1 | **Title and short description** | Chart container has `role="figure"` and `aria-labelledby` pointing to a visible title; a `<figcaption>` carries a 1–2 sentence summary of what the chart shows |
| 2 | **Keyboard navigation** | Chart focusable on Tab; arrow keys move between marks; Enter/Space activates focused mark; Escape exits focus; Tab from chart moves to next surface element |
| 3 | **Screen-reader narrative** | Live region (`aria-live="polite"`) announces the focused mark's series, category, value (e.g., "Bar chart, DPIA count by quarter, Q3 2025: 14 assessments, up from 9 in Q2") |
| 4 | **Data-table fallback** | Pressing `t` (per §5.8.3.3) toggles the chart visualisation for an equivalent `<table>`. Fallback table is also revealed when `prefers-reduced-motion: reduce` is set on first render |
| 5 | **Contrast and not-only-colour** | All marks meet 3:1 against `surface`; series differentiated by colour + shape (line marks: dash style; dot marks: shape; bar marks: pattern fill at series 9+); risk-band always paired with text label |

#### 8.5.2 Per-mark accessibility

Every mark has a per-mark `aria-label` describing series, category, and value:

```
"Q3 2025, DPIA, 14 assessments"
```

Not:

```
"14"
```

The screen-reader experience is a tour of the data, not a recital of numbers.

#### 8.5.3 Reduced motion

`prefers-reduced-motion: reduce` sets:

- All entry animations to 0ms (marks render in final position)
- Tooltips appear instantly on focus (no fade)
- Data-table fallback rendered alongside the chart by default (so the user does not have to discover the toggle)

#### 8.5.4 Forced colors

In Windows High Contrast Mode (`forced-colors: active`):

- Marks render in `CanvasText`
- Focus ring renders in `Highlight`
- Series differentiation falls entirely to shape/dash/pattern — colour cannot be relied on
- Tooltips render with `Canvas` background and `CanvasText` text and 1px `CanvasText` border

#### 8.5.5 The data-table fallback

The fallback is a real `<table>` with `<caption>` matching the chart title, `<thead>` for category headers, `<tbody>` rows for each data point, and `tabular-nums` numeric cells. It is implemented by the chart component — the consumer does not author it. The chart container exposes the table via shadow DOM (`<chart-component>` element) or as a sibling element with `aria-hidden="false"` when active and `aria-hidden="true"` when the visual chart is shown.

#### 8.5.6 Sonification (deferred)

Sonification — audio rendering of chart data alongside the visual representation — was scoped in plan U1.7 and is **deferred to v4.3**. Chart components must not foreclose it: any instrumentation surface (per-mark focus events, accessible value-text emission via `aria-valuenow`/`aria-valuetext`, reduced-motion gating in §8.5.3, forced-colors gating in §8.5.4) must remain reachable so the v4.3 sonification layer can wrap a chart without component refactoring. When v4.3 lands, sonification ships as an opt-in accessibility provision (sixth row in §8.5.1) with a defined audio-cue model, volume control, and a `prefers-reduced-motion`-aware fallback.

### 8.6 Chart states

Every chart has six possible states. The component handles all six; the consumer never hand-rolls one.

| State | When | Visual |
|-------|------|--------|
| **Loading** | Data fetching | Skeleton matching final layout — title shimmer, plot-area shimmer at expected proportions, no axis ticks; `aria-busy="true"` |
| **Empty (no data)** | Query returned 0 rows | Centred icon (`BarChart3`) in stone-300, eyebrow "No data", caption "{user-friendly explanation per §10}", primary action when applicable |
| **Empty (filtered out)** | Query returned 0 rows because of an active filter | Centred icon + "No data matches your filters", "Clear filters" link in indigo-600 |
| **Partial** | Some series missing or some categories null | Chart renders with `null-marker` on missing values; `aria-describedby` references a `note` element listing what's missing |
| **Error** | Fetch failed | Centred `AlertCircle` in stone-400, eyebrow "Couldn't load chart", body "{error message per §10.5.4}", "Retry" button in indigo-600. `role="alert"` |
| **Stale** | Data is older than its freshness threshold | Plot renders normally; below the `caption` in the chrome a stone-50 strip reads "Updated {n} hours ago — refresh" with a refresh icon. Per §7.13 stale-data pattern |

Default empty/error/stale copy comes from §10.5; consumers may override with product-specific phrasing.

### 8.7 Chart components in `@risqbase-inc/ui-components/data-viz`

**Charting library: `visx@^3.0.0`** *(decision D9, `implementation-plan.md`; audit U1.9 fill)*

`@visx` is the React-D3 bridge: it ships D3's scales, shapes, axes, and geometric primitives as React components with full SSR support and per-primitive tree-shaking. It does not impose a chart shape; the design-system components below impose the shape via composition.

**Why Visx over alternatives.**

| Considered | Rejected because |
|------------|-----------------|
| Recharts | High-level API ergonomic for prototypes but the prescribed look-and-feel forces escape hatches at the rate of one per non-trivial chart. Abstraction tax is unsustainable for a design-system component shipping seven canonical chart types. |
| Observable Plot | Elegant grammar-of-graphics API but DOM-only output (no SSR-safe initial render). Still pre-1.0 with breaking API churn. |
| Nivo | Same abstraction-tax pattern as Recharts; heavier bundle. |
| Direct D3 (no React bridge) | Too low-level — every chart becomes from-scratch React-D3 integration work. Well-trodden patterns but not free. |

**Component-by-component Visx contact surface.**

| Component | Visx-wrapped | Direct D3 | RisqBase composition only |
|-----------|:---:|:---:|:---:|
| `<Chart>` | — | — | ✓ |
| `<BarChart>`, `<HorizontalBarChart>` | `@visx/shape`, `@visx/scale`, `@visx/axis` | — | composition |
| `<LineChart>`, `<AreaChart>` | `@visx/shape`, `@visx/scale` | — | composition |
| `<Sparkline>` | `@visx/shape` | — | composition |
| `<Heatmap>` | `@visx/heatmap` | — | composition |
| `<ChoroplethMap>` | partial | `topojson-client` (no Visx geo primitive) | composition |
| `<Gauge>` | — | `d3-arc` (svg-arc only) | ✓ |
| `<MetricCard>` | — | — | ✓ (not a chart) |
| Marks (`<BarMark>`, `<LineMark>`, etc.) | wrap Visx mark primitives | — | composition |

**Version pin.** `visx@^3.0.0` is recorded in `package.json#peerDependencies` (consumer-supplied, like React) and locked in CI via `package-lock.json`. Upgrade to `4.x` is a major design-system version: visual regression suite re-baselines.

---

The library ships these components in v4.2. All are MIT-licensed shared code; product-specific extensions live in product repos.

| Component | What it is | Status |
|-----------|-----------|--------|
| `<Chart>` | Composition root — accepts marks, scales, axes as children | v4.2 (new, stable) |
| `<BarChart>` | Convenience: vertical bar with sensible defaults | v4.2 (new, stable) |
| `<HorizontalBarChart>` | Convenience: horizontal bar | v4.2 (new, stable) |
| `<LineChart>` | Convenience: time-series line | v4.2 (new, stable) |
| `<AreaChart>` | Convenience: stacked or unstacked area | v4.2 (new, stable) |
| `<Sparkline>` | §8.9 — inline only | v4.2 (new, stable) |
| `<Heatmap>` | §8.11 risk matrix and similar 2D categorical | v4.2 (new, stable) |
| `<ChoroplethMap>` | §8.10 world map for Horizon Intelligence and similar | v4.2 (new, beta — see §8.10.7) |
| `<Gauge>` | §7.11 generic primitive | v4.2 (new, stable; Gauge moved into data-viz) |
| `<MetricCard>` | §7.10 | v4.2 (existing, retained) |
| Marks: `<BarMark>`, `<LineMark>`, `<AreaMark>`, `<DotMark>`, `<RuleMark>`, `<RegionMark>`, `<TextMark>`, `<ChoroplethMark>`, `<HeatmapMark>` | §8.2.2 | v4.2 (new, stable) |

Implementation notes:

- Built on `@visx` primitives + `d3-scale` + `d3-shape`. No `recharts`, no `chart.js`, no `nivo` — the abstraction tax is too high for the level of control the rest of this chapter demands.
- All components are tree-shakable. Importing `<BarChart>` does not pull in `<ChoroplethMap>`'s topojson dependencies.
- TypeScript strict; `data` is generic — `<BarChart<MyRow>>`.
- Server-render-safe — all charts render to inert SVG on the server with the data-table fallback as a `<noscript>` sibling.

### 8.8 Bar, line, area conventions

Beyond the grammar in §8.2, these specific conventions apply.

#### 8.8.1 Bar charts

- Bar fill: 100% opacity. No gradient. No outline.
- Bar gap: `band(0.2)` — i.e., 20% of band width is gap between bars. Adjust to 0.3 for charts narrower than 320px.
- Single-series bar: all bars use `--chart-cat-1` unless the bar represents a risk band (then risk-band palette).
- Multi-series bar: stacked when categories are mutually exclusive; grouped when not.
- Negative values: bars extend below the zero line, which is rendered explicitly in `border-stone-300`.
- Bar ordering for categorical x: by value descending unless the category has a natural order (alphabet, severity, time period). Pattern recipe records which.

#### 8.8.2 Line charts

- Stroke width 2px; 1.5px for sparklines; 2.5px on `headline` size.
- Line endpoints: dot mark at first and last data point in the series colour at full opacity.
- Connecting null values: lines break at null. Never interpolate across nulls. Annotate the gap with a stone-300 dashed segment if the gap is significant.
- Hover/focus: focused point shows a `dot` mark in series colour with 4px stroke white halo; tooltip pinned to point.

#### 8.8.3 Area charts

- Single-series area: fill at 12% opacity of the line stroke colour, line at 100% opacity above.
- Stacked area: stack from bottom in the series order (most-stable series at bottom). Tooltip shows individual values *and* stack total.
- Never use stacked area for percentages summing to 100% unless that is exactly what you mean — and even then, prefer a horizontal stacked bar.

### 8.9 Sparkline

Inline-only mini chart per §7.10. Component: `<Sparkline>`.

| Property | Spec |
|----------|------|
| Container | 64×24px default; `inline-block` |
| Stroke | 1.5px, colour matches the metric card delta tone (emerald / red / stone) |
| Endpoint dot | 3px filled circle on last data point in stroke colour |
| Fill | None |
| Axes | None |
| Tooltip | None (the metric card carries the value) |
| Accessibility | `role="img"` with `aria-label="Trend for {label}: {summary phrase}"` (e.g., "Trend for open DPIAs: declining over the last 12 weeks") |

Sparklines never render alone. They are always paired with a Metric Card or table cell that carries the canonical value. A standalone trend visualisation is a `<LineChart>` with axes.

### 8.10 Choropleth — risk-band world map (Horizon Intelligence canon)

The Horizon Intelligence "world risk map" is the most prominent geographic chart in the system. v4.1 specified it loosely; v4.2 establishes it as the canonical choropleth pattern.

#### 8.10.1 Use case

Display a value per country (or admin-1 region within select countries) where colour encodes either:

- Risk band (Low / Medium / High / Critical) — most common
- A continuous metric (count of DSRs received per country, vendor density)

#### 8.10.2 Source data

- Country boundaries from **Natural Earth 1:50m Admin 0**, simplified via `mapshaper` to ~30% original size, exported as TopoJSON.
- ISO 3166-1 alpha-2 codes as the join key. Never join on country name — too fragile across spellings.
- Topology lives in `@risqbase-inc/ui-components/data-viz/maps/world-50m.topojson`. Loaded once and shared.

#### 8.10.3 Projection

- **Equal Earth** (`d3-geo` `geoEqualEarth`). Equal-area, low distortion at high latitudes, visually familiar.
- **Never** Mercator. Mercator inflates high-latitude regions; using it for a risk map overstates Northern Europe and understates equatorial regions.
- Antarctica clipped above 80°S. Greenland rendered at true scale (Equal Earth handles this correctly without Mercator's distortion).

#### 8.10.4 Encoding

| Mode | Palette | Step count | Null treatment |
|------|---------|-----------|----------------|
| Risk band | Risk-band palette §8.3.4 | 4 (Low → Critical) | `null-marker` hatched fill |
| Sequential continuous | Sequential palette §8.3.2 | 5 | `null-marker` hatched fill |

Country borders: 0.5px stroke `stone-300`. Disputed borders rendered as 0.5px dashed `stone-300` and annotated in the chart's `figcaption` per §8.5.1 — RisqBase takes no political position on disputed regions; the rendering choice is documented.

#### 8.10.5 Interaction

- Hover: country fills 100% opacity, siblings 60%; tooltip shows country name + value + band
- Click: drilldown to a country detail panel (consumer-controlled)
- Keyboard: `Tab` enters; `arrow keys` move focus to the geographically nearest country (using centroid distance); `Enter` activates
- Screen reader: announces "{country}, {band}, {value}" on focus

#### 8.10.6 Legend

Required. Renders below the map in horizontal flex; each entry is a `dot` (12×12 square) + label. Legend includes a "No data" entry with the hatched fill swatch.

#### 8.10.7 Beta status (honest disclosure)

`<ChoroplethMap>` ships in v4.2 as **beta**. Reasons:

- The disputed-borders rendering needs review by G8's team for any customer-facing political sensitivity in the Horizon roll-out
- Equal Earth bundle adds ~40KB gzipped — needs review against the marketing site's perf budget
- The "geographically nearest" keyboard navigation algorithm needs UX testing with screen-reader users

Beta means: usable in production, but the API may have a documented breaking change before promotion to stable. Per §23, beta components are pinned in their consumers via exact-version imports and reviewed in the next quarterly cadence.

### 8.11 Heatmap — the 5×5 risk matrix (canonical)

The likelihood × impact risk matrix is a regulatory expectation in DPIA, FRIA, and TIA outcomes. v4.2 specifies the canonical visual.

#### 8.11.1 Anatomy

- 5 columns (Impact: Negligible → Severe), 5 rows (Likelihood: Rare → Almost Certain)
- Cell size: 64×64px at `summary` role, 96×96px at `headline`, 40×40px at `accessory`
- Cell colour: risk-band palette §8.3.4, derived from the cell's product-of-axes severity per the standard 5×5 matrix
- Axis labels: `text-xs text-stone-700` left of rows, below columns
- Cell markers: each placed assessment renders as a `dot` mark inside the cell; multi-assessment cells show `[count]` instead

#### 8.11.2 Cell content

Each cell may show:

- Its band label (`Low`, `Medium`, `High`, `Critical`) — rendered tabular-nums, white text, semibold
- A count of assessments in that cell

Not both — the heatmap is a heatmap, not a card grid.

#### 8.11.3 Interaction

Click a cell → list panel opens to the right showing assessments at that risk position. Keyboard navigation: arrows move focus cell-to-cell; Enter opens the list.

#### 8.11.4 Accessibility

The heatmap has a mandatory data-table fallback (per §8.5.5) showing every assessment by ID, name, likelihood, impact, and band. Screen-reader narrative on cell focus: "Likelihood {row}, Impact {col}, {band}, {count} assessments".

### 8.12 Marketing-site charts

The marketing site (risqbase.com) consumes the same `data-viz/` components. Differences:

- Default palette is the **indigo-sequential** variant (§8.3.2) rather than teal — preserves teal as the in-app IRIS signature on marketing surfaces too
- Chart roles default to `headline` (marketing pages have one chart per fold, not five)
- No keyboard navigation `t` toggle — marketing visitors are not power users; the data-table fallback is rendered alongside on every chart, behind a `details` disclosure

### 8.13 Charts and IRIS

When IRIS produces a chart inline (e.g., as part of a streaming response per §6.5), the chart ships through these specific extensions of the contract:

- The chart's `<figcaption>` is generated by IRIS and may stream after the chart is rendered, mirroring the streaming contract
- The chart cites its data via `<CitationChip>` elements adjacent to the chart's `caption` — same chip family as cited text
- If the underlying data is incomplete or low-confidence, the chart enters its **partial** state per §8.6 with a low-confidence citation chip per §7.12.2

### 8.14 What this chapter does not specify (deferred)

- **Complex statistical visualisations** — boxplots, violin plots, kernel-density. Not currently needed; defer to v4.3 if the need arises.
- **Geospatial point-density** (heat maps over geographic coordinates) — defer; current geographic data is country-level.
- **Animated chart transitions across page navigations** — would require a global motion contract beyond §5; defer.
- **3D anything** — never, per §8.1.3.

### 8.15 Lint and verification

Per §17 (rows 53–63), CI lints the following:

- No bare colour values inside chart implementations — all colours come from chart palette tokens
- No prohibited chart types (§8.1.3)
- Every chart has a non-empty `aria-labelledby` / `aria-label`
- Every chart provides a data-table fallback (component test)
- Every pattern recipe whose `composed_of` includes a chart has the §8.1.2 three-question block populated

---
## 9. Print & PDF Specifications

*Retained from v3.1 in full.* Page setup A4/Letter, 18mm margins. Tabular-nums on all numeric data. Print-only `.print-only` and screen-only `.screen-only` utility classes. Citation rendering per §7.12.5. Risk gauges render in print using the same arc geometry — no PNG fallback.

---

## 10. Voice, Tone & Content Design

In v4.1 this chapter was a one-page voice-and-tone summary. In v4.2 content design is a first-class layer of the system, parallel to colour and typography. This is the substance of F3.

The reasoning: at three properties × ~120 components × ~14 patterns, the volume of in-product copy already exceeds what one designer can review per release. Without a content layer, copy drifts: error messages don't match across products; help text contradicts itself; AI-generated outputs read in a different voice than the surrounding UI. A content layer makes copy reproducible — same way tokens make colour reproducible.

### 10.1 Voice (constant across products)

RisqBase's voice is **clear, calm, and credible**. We sound like a senior compliance professional explaining a complex situation to a peer — not like an enthusiastic startup, not like a regulator, not like a chatbot.

| Trait | We are | We are not |
|-------|--------|-----------|
| Clarity | Concrete, specific | Vague, hedged |
| Calm | Measured, declarative | Alarming, urgent without cause |
| Credible | Cite the source, name the limit | Performatively confident, evasive about uncertainty |
| Warmth | Polite, human | Familiar, jokey, exclamatory |
| Authority | Knowledgeable, decisive when sure | Opinionated, lecturing |

Voice is constant. Tone shifts.

### 10.2 Tone (varies by context)

| Context | Tone | Example feel |
|---------|------|--------------|
| First-run / empty state | Welcoming, instructive | "Start your first DPIA — IRIS will walk you through it" |
| Standard task UI | Neutral, transactional | "Save changes" |
| Success | Brief, factual | "DPIA published" |
| Warning | Direct, specific | "This change will reset 4 dependent assessments" |
| Error (user fixable) | Helpful, accountable | "We couldn't save — your session expired. Sign in to continue." |
| Error (system fault) | Honest, apologetic, actionable | "Something went wrong on our end. Try again, or contact support if this keeps happening." |
| Destructive confirmation | Sober, exact | "Delete 12 assessments. This cannot be undone." |
| Regulator-facing PDF | Formal, complete-sentence prose | Per §9 |
| IRIS in conversation | Warm, qualified, source-anchored | Per §10.8 |

Tone matrices for new surfaces: choose the closest row above. New rows added by G8's approval.

### 10.3 Style (mechanical rules)

| Rule | Form |
|------|------|
| Sentence case for everything except proper nouns | "Add a vendor" not "Add A Vendor" |
| Oxford comma | Always |
| Numerals 0–9 spelled out in prose | "Five DPIAs are open" — but tabular contexts always use digits |
| Dates | "7 May 2026" in body text; ISO `2026-05-07` in audit logs and tables |
| Times | 24-hour with timezone in audit logs (`14:30 UTC`); 12-hour with am/pm in body text |
| Percentages | "78%" — no space |
| Currency | Symbol-prefixed with locale: `£1,200`, `$1,200`, `€1,200` |
| Quotation marks | Curly `"…"` and `'…'` in prose; straight `"..."` in code |
| Em dash | No surrounding spaces — like this. (The longer dash is em.) |
| En dash | For ranges: `2024–2026` |
| Lists in body | Capitalise the first word; period only if items are full sentences |
| UI element references | Bold the element name on first reference: "Click **Save changes**" |
| Keyboard shortcuts in body | Render as `<kbd>` per §5.8.3 |
| Product names | RisqBase, RALIA, Cortex, IRIS — never "Risqbase", "Ralia", "Iris" |

#### 10.3.1 Locale variants

We write in **British English** in product chrome and documentation by default (organisation, behaviour, customise, recognise). The marketing site uses the locale of the visitor (auto-detected); regulator-facing PDFs use the locale specified in the customer's account settings (en-GB, en-US, fr-FR, de-DE in v4.2).

#### 10.3.2 We do not

- Use exclamation marks in transactional UI ("Welcome!" → "Welcome")
- Use emoji in product chrome (the IRIS lettermark is the only system glyph)
- Write headlines that promise without delivering ("Compliance, simplified" — no)
- Anthropomorphise IRIS beyond first-person plural in suggestions ("We found 3 DPIAs that may need updates" — yes; "I think you should…" — no)
- Apologise unprompted ("Sorry to bother you" — no)
- Use "please" in button copy ("Please save" → "Save")
- Use "just" or "simply" — they minimise the user's effort

### 10.4 Headings and labels

| Element | Pattern | Example |
|---------|---------|---------|
| Page title (H1) | Noun phrase | "Assessments" |
| Section heading (H2) | Noun phrase or imperative | "Risk drivers" / "Add a vendor" |
| Card title | Noun phrase | "Open DPIAs" |
| Eyebrow | All caps, single word or short phrase | "OUTCOME" / "LAST UPDATED" |
| Form label | Noun phrase, no colon | "Assessment owner" |
| Helper text | Sentence fragment, no period | "Used for regulator notifications" |
| Required indicator | Asterisk after label, with `aria-required="true"` | "Assessment owner *" |
| Optional indicator | "(optional)" suffix in caption-grey | "Notes (optional)" |
| Button (primary) | Verb-led | "Publish" / "Save changes" / "Run analysis" |
| Button (destructive) | Verb-led, exact | "Delete 12 assessments" — never "Delete all" |
| Link | Noun phrase or verb-led, no underline of "click here" | "View audit log" not "Click here for the audit log" |
| Empty-state title | Noun phrase | "No vendors yet" |
| Empty-state body | One sentence, instructive | "Add your first vendor to start tracking processor-controller relationships." |

### 10.5 Content patterns (Polaris-inspired)

Like component patterns (§20), content patterns are reusable templates with named slots. Each pattern specifies a problem, a template, examples, and gotchas.

#### 10.5.1 Confirmation dialog content

```
Pattern ID: content-confirmation-dialog
Slots:
  - Title: "{Verb} {object}{?}" — Question form OR declarative depending on severity
  - Body: 1–2 sentences. State the consequence. Specify what will and will not happen.
  - Primary button: Verb that matches the title, exact ("Delete 12 assessments")
  - Secondary button: "Cancel" (always)

Severity matrix:
  - Routine: declarative title, neutral body. "Discard draft? Your changes will not be saved. [Discard] [Cancel]"
  - Significant: question title, consequence body. "Publish this DPIA? It will become visible to all reviewers and trigger 4 notifications. [Publish] [Cancel]"
  - Destructive: declarative + exact title, irreversibility body. "Delete 12 assessments. This cannot be undone. The audit trail will retain a record of the deletion. [Delete 12 assessments] [Cancel]"
```

#### 10.5.2 Toast / inline confirmation content

```
Pattern ID: content-toast
Slots:
  - Headline: 2–6 words. Past tense for completion. ("Vendor added" / "Assessment published")
  - Optional caption: 1 short sentence with relevant detail. ("Now visible to 4 reviewers")
  - Optional action: undo / view (verb-led)

Tone:
  - Success: factual past tense, no exclamation
  - Info: neutral present
  - Warning: specific cause, recommended action
```

#### 10.5.3 Empty state content

```
Pattern ID: content-empty-state
Slots:
  - Eyebrow (optional): Surface name in caps
  - Title: Noun phrase. What is missing OR welcoming verb. ("No vendors yet" / "Start your first DPIA")
  - Body: 1–2 sentences. Why this matters + what to do.
  - Primary action: Verb-led button

Three flavours:
  - First-run (never had data): welcoming, instructive
  - Filtered (had data, query removes it): neutral, "Clear filters" link
  - System empty (genuinely zero rows): neutral, optional "Add" action
```

#### 10.5.4 Error message content

The most-failed copy surface in software. v4.2 specifies a strict template.

```
Pattern ID: content-error-message
Required answer to all three:
  1. What happened? (Past tense, not blameful)
  2. Why? (Cause, in the user's words — never the stack trace)
  3. What now? (Specific next step the user can take)

Templates:
  - Validation error: "{Field} {must|cannot|should} {condition}." → "Email must include an @ symbol."
  - Permission error: "You don't have permission to {action}. {Owner|Admin} can grant access." → "You don't have permission to publish this DPIA. The assessment owner can grant access."
  - Network error: "We couldn't reach our servers. Check your connection and try again." (No technical detail.)
  - Server error: "Something went wrong on our end. Try again, or contact support if this keeps happening." Include a support reference ID.
  - Conflict error: "{Specific conflict}. {Specific resolution}." → "This assessment was edited by Frontend 30 seconds ago. Refresh to see the latest version."
  - Not-found: "We couldn't find {what they were looking for}. {Likely cause} — {remediation}." → "We couldn't find that vendor. It may have been removed. View the vendor list →"

Forbidden:
  - "Error" / "Oops" / "Whoops" / "Something happened"
  - HTTP status codes in user-facing copy ("400 Bad Request") — translate to plain language
  - Stack traces — log to telemetry, never display
  - "Please contact your administrator" without saying which administrator or why
  - "Try again later" without estimating when
```

#### 10.5.5 Help text content

```
Pattern ID: content-help-text
Constraints:
  - Maximum 50 words
  - Sentence-case prose
  - Answers ONE question — do not bundle "what is this AND how do I use it AND when is it required"
  - Links to fuller documentation in Knowledge Bank when more is needed

Slot: "{Definition or instruction}. {Optional: When required.} {Optional: link to Knowledge Bank.}"

Examples:
  - "Used for regulator notifications. Cannot be a personal email. [Why →]"
  - "The legal basis under GDPR Article 6. Required when processing personal data."
  - "Inherent risk before mitigations. IRIS calculates this automatically; you can override. [How →]"
```

#### 10.5.6 IRIS prompt-suggestion content

```
Pattern ID: content-iris-prompt-chip
Constraints:
  - Maximum 8 words
  - Verb-led ("Summarise this assessment", "Find similar DPIAs")
  - Specific to the surface — never a generic "Ask anything"
  - Five chips maximum per surface

Examples (assessment outcome surface):
  - "Summarise the residual risk drivers"
  - "Compare to similar DPIAs"
  - "Generate the regulator-facing summary"
  - "List outstanding actions"
  - "Show all citations"
```

#### 10.5.7 Long-operation step labels

Per §7.13.1. Present-progressive verbs, sentence case, no jargon, max 5 steps:

```
Examples:
  - "Reviewing the processing description"
  - "Checking against Article 35(7)"
  - "Drafting the outcome statement"
  - "Generating citations"
  - "Finalising"

Forbidden:
  - "Loading…" (which step? Loading what?)
  - "Initializing…" (jargon)
  - "Step 1 of 5" (the list already shows position)
```

### 10.6 Glossary

The canonical RisqBase glossary lives at `design.risqbase.com/glossary` and is mirrored in the package `@risqbase-inc/ui-components/content/glossary.json` (v4.2 new). It contains every domain term used in product chrome:

| Term | Definition | First use |
|------|-----------|----------|
| Assessment | A documented evaluation of a processing activity against a regulatory framework | DPIA, FRIA, etc are assessment types |
| DPIA | Data Protection Impact Assessment (GDPR Article 35) | spelled out on first reference per surface |
| LIA | Legitimate Interests Assessment | spelled out on first reference per surface |
| FRIA | Fundamental Rights Impact Assessment (EU AI Act) | spelled out on first reference per surface |
| TIA | Transfer Impact Assessment (Schrems II) | spelled out on first reference per surface |
| ROPA | Record of Processing Activities (GDPR Article 30) | spelled out on first reference per surface |
| Inherent risk | Risk before mitigations are applied | (in context) |
| Residual risk | Risk after mitigations are applied | (in context) |
| Risk band | The severity classification: Low, Medium, High, Critical | system-wide |
| IRIS | RisqBase's AI compliance assistant | proper noun, no expansion |
| Citation | A reference to a verified source supporting an AI assertion | per §7.12 |
| Vendor | A third party processing personal data on behalf of a controller | (in context) |
| Owner | The person accountable for an assessment, vendor, or document | (in context) |
| Reviewer | A person reviewing an assessment without ownership | (in context) |

**Acronym rule:** spelled out on first reference *per surface*, not first reference per session. The user reading the assessment list should not need to remember an acronym defined three pages ago. After first reference on a given surface, the acronym alone is acceptable.

**Forbidden synonyms.** Once a term is in the glossary, do not use synonyms in product chrome:

- "Assessment" — never "evaluation", "review", "report" when referring to an assessment
- "Vendor" — never "supplier", "third party", "processor" interchangeably (each has a specific glossary meaning)
- "Owner" — never "creator", "author", "lead" for the same role

The glossary is the source of truth. Linting in v4.3+ may catch term violations in source.

### 10.7 Help text

Help is layered. The user gets the right depth without leaving the surface unless they ask for it.

| Layer | Surface | Limit |
|-------|---------|-------|
| **Inline label/helper** | Below or beside a field | Per §10.5.5 — 50 words max |
| **Tooltip** | On hover/focus of a `?` icon next to a label | 50 words max, plus optional "Learn more →" link |
| **Sidebar help panel** | Right rail, opened by `?` shortcut on a surface | Up to 500 words; renders Markdown; deeplinks to Knowledge Bank |
| **Knowledge Bank article** | Standalone page accessed via `g k` | Unlimited; canonical depth |

A new field requires inline help at minimum. A new surface requires inline help **and** a Knowledge Bank article. G8's team owns the Knowledge Bank.

### 10.8 AI / IRIS-specific content rules

IRIS speaks in the same voice as the rest of the product (§10.1) but with extra constraints because it is generative.

#### 10.8.1 Hedging and confidence

| Confidence | Phrasing |
|-----------|----------|
| High (cited, verified) | Declarative: "Article 35(7) requires a description of the processing." |
| Medium (cited, partial match) | Qualified: "Based on similar DPIAs, the residual risk is likely Medium." |
| Low (uncited or stale) | Hedged + flag: "I'm not confident about this — the cited document is more than 12 months old." |
| No source | Explicit refusal: "I don't have a source for that. Try rephrasing, or check the Knowledge Bank." |

IRIS never asserts a fact without an associated `<CitationChip>` per §7.12. If retrieval fails, IRIS renders the failed-retrieval callout per §7.12.6 — the assertion is wrapped, not deleted.

#### 10.8.2 Forbidden IRIS phrasings

| Forbidden | Why | Use instead |
|-----------|-----|-------------|
| "I'm sorry, but I can't…" | Submissive register | "I can't do that. Here's what I can do: …" |
| "As an AI…" | Breaking the surface to refer to itself | "I don't have a source for that." |
| "Let me think about that…" | Performative — IRIS streams; thinking is the streaming | (omit; the streamhead does this work) |
| "Great question!" | Sycophancy | (omit) |
| "I think…" | First-person opinion | "Based on {source}, …" |
| "Probably" / "I'd guess" | Vague hedging | Specific qualifier: "with low confidence", "based on a 6-month-old document" |

#### 10.8.3 IRIS in regulator-facing outputs

When IRIS authors content that will be exported to a regulator (per §9 PDFs), the additional rules apply:

- Every assertion is cited (not just the conclusions)
- Hedged language is replaced with explicit confidence levels in the citation
- The regulator-facing PDF renders an "AI-assisted authorship" notice on the cover page per §9 — disclosure is mandatory

### 10.9 Localisation

v4.2 ships with British English as the primary product locale; en-US, fr-FR, de-DE for regulator-facing PDFs. Future locales are added as customers require.

#### 10.9.1 Localisation contract

- Every string lives in `@risqbase-inc/ui-components/content/strings.{locale}.json`. No hard-coded strings in component source.
- Strings are keyed by `domain.context.key` (e.g., `assessment.outcome.publish_button`).
- ICU MessageFormat for plurals and gendered phrasings.
- Length-sensitive strings (button labels, badge text) carry a `maxChars` annotation; CI lints strings that overflow it.
- Right-to-left support: layout uses logical CSS properties (`margin-inline-start`, `text-align: start`) — no `left`/`right`. Charts mirror axis position in RTL but never mirror the data marks themselves (a bar chart still reads "more = longer", regardless of language direction).

#### 10.9.2 Translation governance

- English source is the canonical version. Translators receive English + screenshot context + glossary entries.
- Translated terms for glossary entries (§10.6) are reviewed by a domain expert in that locale before merging — compliance terms are legally consequential and cannot be machine-translated.
- IRIS responses honour the user's locale only when the underlying retrieval data is available in that locale; otherwise IRIS responds in the source-data language with an explanation.

### 10.10 Content review cadence

G8's team reviews:

- All new component copy at PR review (every release)
- All new pattern recipes' `voice_examples` field (every release)
- The full glossary, twice yearly
- All error messages globally, once yearly (template drift is the most common content-debt accumulator)

---

## 11. Iconography

*Retained from v3.1.* Lucide React. Stroke 1.5px (1.75px at 24px+). Sizes 14/16/20/24px. Indigo for primary actions, stone-600 for default, severity colours only when paired with a label. Never decorative — every icon supports an action or a state.

---

## 12. Brand Expression

*Retained from v3.1.* Logo (the IRIS lettermark + RisqBase wordmark), the Concentric-Arc Pattern (extends gauge geometry to brand surfaces only — never inside product chrome), photography rules, brand hierarchy across the three properties.

---

## 13. Responsive Design

*Retained from v3.1.* Breakpoints `sm`, `md`, `lg`, `xl`, `2xl` per Tailwind defaults. Mobile-first authoring. Tables collapse to card lists below `md`; charts maintain `summary` role minimum across all breakpoints.

---

## 14. Dark Mode Pathway

v4.1 specified dark mode as v4.x scoped via `data-theme="dark"`. v4.2 ships dark **and** high-contrast modes alongside the default light mode — the implementation plan locks this in D11 ("Modes shipped in v4.2: Light + dark + HC. No mode deferral") and S4 carries the value-fill work (audit row U5.5, primary owner G4, reviewer G1).

The infrastructure (theming `data-theme` swap, override layer in the token build pipeline, lint rule that themes may only override existing tokens) lands in S1; the dark + HC values land in S4 once data-viz §8 colour roles are fully enumerated. Three-mode visual-regression baselines gate S5; consumer migration in S6 publishes against three-mode green.

> **Spec edit history.** This section was rewritten on 2026-05-10 (PR-cleanup-3-design, G4) to reconcile the spec with the executed implementation plan. The pre-edit text deferred dark + HC to v4.3; the implementation plan and S1 token-build pipeline already commit to shipping all three modes in v4.2. See `v4.2.1-backlog.md` § "Spec edits made during S1 cleanup" for the rationale and full edit log.

---

## 15. Token Implementation

v4.2 adopts the **W3C Design Tokens Format Module** (`$value`, `$type`, `$extensions`) as the canonical token source format. This is the substance of F5: tokens are now expressible identically in Figma and in code, opening up the round-trip sync.

### 15.1 Token format (W3C Design Tokens Community Group)

All tokens live in `tokens/` at the root of `@risqbase-inc/ui-components` as JSON files following the W3C format:

```jsonc
// tokens/color/brand.json
{
  "color": {
    "brand": {
      "indigo": {
        "$value": "#4F46E5",
        "$type": "color",
        "$description": "Primary brand colour — CTAs, logo, links",
        "$extensions": {
          "com.risqbase.role": ["action.primary", "brand.primary"],
          "com.risqbase.contrastPair": "color.surface.default",
          "com.risqbase.figma": {
            "collection": "primitive",
            "mode": "default",
            "scopes": ["ALL_FILLS", "STROKE_COLOR", "TEXT_FILL"]
          }
        }
      }
    }
  }
}
```

| Field | Spec |
|-------|------|
| `$value` | The literal token value (hex, dimension, font, etc.) |
| `$type` | One of: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `shadow`, `border`, `transition` (W3C set) |
| `$description` | Short prose definition; appears in docs site and Figma |
| `$extensions.com.risqbase.role` | Which semantic role(s) this token may fulfill; CI verifies that role tokens reference primitives whose roles include the role |
| `$extensions.com.risqbase.contrastPair` | The default surface this token is paired against; CI verifies WCAG contrast against it |
| `$extensions.com.risqbase.figma` | Figma binding metadata for the F5 sync pipeline (§15.8). Required on every token published to Figma. Structure: `{ collection, mode, scopes[] }` |

**The Figma binding extension (`com.risqbase.figma`) — field detail.**

| Field | Type | Spec |
|-------|------|------|
| `collection` | `"primitive" \| "semantic" \| "component" \| "_proposed"` | Which Figma Variable collection holds the published variable. Mirrors the three-tier hierarchy in §15.2 plus the `_proposed` staging collection from §15.8.2. |
| `mode` | `"default" \| "light" \| "dark" \| "hc" \| "print"` | Which Figma mode this value applies to. `default` is used for the single-mode primitive collection (raw colour hexes, dimensions); `light`/`dark`/`hc`/`print` are used for the semantic and component collections, which carry one value per mode (per §15.2.1 Theme files). |
| `scopes[]` | Figma scope strings | Where in the Figma UI the variable is picker-eligible. Color scopes: `ALL_FILLS`, `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR`, `EFFECT_COLOR`. Dimension scopes: `WIDTH_HEIGHT`, `GAP`, `STROKE_FLOAT`, `EFFECT_FLOAT`, `OPACITY`, `FONT_SIZE`, `LINE_HEIGHT`, `LETTER_SPACING`, `PARAGRAPH_SPACING`, `PARAGRAPH_INDENT`. Use `ALL_SCOPES` if a variable should apply everywhere of its type. |

**Why this matters.** The Figma Variables REST API requires explicit collection/mode/scope bindings on every published variable. Without these in the JSON source, `figma-publish` (§15.8.4) would have to infer them — which produces non-deterministic Figma libraries and breaks the round-trip guarantee. The whole F5 sync programme builds on this key.

A build step (`tokens-build`) compiles the W3C JSON to:

1. CSS custom properties in `dist/tokens.css`
2. TypeScript constants in `dist/tokens.ts`
3. Tailwind config extension in `dist/tailwind-tokens.js`
4. Figma Variables JSON in `dist/figma-tokens.json` (per §15.8)

No source consumes the JSON directly. All consumers consume one of the four built outputs.

### 15.2 Three token tiers (Carbon-inspired)

Retained from v4.1 — three tiers of indirection.

| Tier | Example | Purpose |
|------|---------|---------|
| **Primitive** | `color.brand.indigo` = `#4F46E5` | Raw value |
| **Semantic** | `color.action.primary` = `{color.brand.indigo}` | Contextual alias |
| **Role** | `color.button.primary.background` = `{color.action.primary}` | Component-level token |

Component code references **role tokens only**. Role tokens reference semantic; semantic references primitive. Refactoring the indigo brand colour means changing one primitive — every role token cascades.

#### 15.2.1 Theme files (Carbon-inspired)

Themes are token-set overrides that swap primitive values:

| Theme | File | Status |
|-------|------|--------|
| Default (light) | `tokens/themes/light.json` *(implicit; primitive/semantic/component layers are the light source)* | Stable (v4.2 — S1) |
| Dark | `tokens/themes/dark.json` | Stub in v4.2 S1 (file present, intentionally empty); values land v4.2 S4 (impl-plan §4 row U5.5, owner G4, reviewer G1) |
| Print | `tokens/themes/print.json` | Stable (v4.2) — used for §9 PDFs |
| High-contrast | `tokens/themes/hc.json` | Stub in v4.2 S1 (file present, intentionally empty); values land v4.2 S4 (impl-plan §4 row U5.5, owner G4, reviewer G1) |

Themes never define new tokens — they only override values. A token added in `light.json` must also exist in every other theme file or the build fails. The S1 lint rule (`tools/tokens-build/lint.js`) enforces this for the dark and HC files even while they are empty.

> **Spec edit history.** This subsection was rewritten on 2026-05-10 (PR-cleanup-3-design, G4, gate G4) to reconcile the spec with the executed implementation plan. Pre-edit, this table marked dark and HC as "Stub only (v4.3)"; post-edit, the table reflects the phased v4.2 value-fill (S1 infrastructure + empty stub files; S4 values). The high-contrast filename also updated from `high-contrast.json` to `hc.json` to match what S1 actually shipped (`tokens/themes/hc.json`). See `v4.2.1-backlog.md` § "Spec edits made during S1 cleanup" for the full edit log.

### 15.3 Token naming canon

`{category}.{group}.{property}.{state?}.{variant?}`. Examples:

- `color.button.primary.background.default`
- `color.button.primary.background.hover`
- `dimension.spacing.md`
- `duration.motion.reactive`

Maximum 5 segments. State and variant are optional but ordered as shown.

### 15.4 Component → role token mapping

Every component in `@risqbase-inc/ui-components` has a `tokens.md` file alongside its source listing the role tokens it consumes. Reviewers verify changes to a component touch only the listed tokens or update the list. CI lints this in v4.3.

### 15.5 Existing tokens (v4.1 retained)

The full v4.1 token catalogue (semantic colour, spacing, motion, typography) is retained verbatim. v4.2 adds the data-viz and chart palette tokens below.

### 15.6 New tokens in v4.2

#### 15.6.1 Chart palette tokens

```
color.chart.cat.{1..8}        # categorical, §8.3.1
color.chart.seq.{1..5}        # sequential teal, §8.3.2
color.chart.seq.alt.{1..5}    # sequential indigo, §8.3.2
color.chart.div.{n2,n1,0,p1,p2}  # diverging, §8.3.3
color.risk.{low,medium,high,critical}   # canonical risk-band, §8.3.4
color.chart.axis              # stone-200
color.chart.gridline          # stone-100
color.chart.tooltip.surface   # white
color.chart.tooltip.border    # stone-200
color.chart.null              # null-marker hatched fill colour-stop
```

#### 15.6.2 Gauge primitive tokens (now in `data-viz/`)

```
color.gauge.track             # stone-200
color.gauge.arc.teal          # teal-600
color.gauge.arc.indigo        # indigo-600
color.gauge.arc.stone         # stone-500 (dual-ring outer)
dimension.gauge.diameter.headline    # 160px
dimension.gauge.diameter.summary     # 120px
dimension.gauge.diameter.accessory   # 80px
dimension.gauge.diameter.inline      # 48px
dimension.gauge.stroke.default       # 6px
dimension.gauge.stroke.inline        # 4px
duration.gauge.reveal                # 500ms
```

#### 15.6.3 Citation chip tokens (now in `ai/`)

```
color.citation.surface.default    # white
color.citation.surface.lowConf    # stone-50
color.citation.border.default     # stone-200
color.citation.border.retracted   # stone-300
color.citation.text.default       # stone-600
color.citation.text.retracted     # stone-400
```

#### 15.6.4 Density tokens

```
dimension.density.scale.compact      # 0.75
dimension.density.scale.default      # 1
dimension.density.scale.comfortable  # 1.25
```

### 15.7 Component telemetry (F4)

v4.2 adds component-usage telemetry. The system was previously blind to which components were used where, by whom, and how often — making promotion decisions (§23) and deprecation decisions speculative.

#### 15.7.1 What we measure

Per component, per release, across all three properties:

| Metric | What it tells us |
|--------|------------------|
| **Mount count** | How often is this component rendered? |
| **Distinct surface count** | How many different surfaces include it? |
| **Variant distribution** | Which props/variants are actually used vs declared? |
| **Stale prop count** | Which props are documented but never passed? |
| **Override frequency** | How often do consumers pass `className`/`style` to override design? — high overrides = the component doesn't fit the need |
| **Error rate** | How often does the component throw or render its error boundary? |

#### 15.7.2 What we do not measure

| Not measured | Why |
|--------------|-----|
| User identity, session ID, or any PII | This is a compliance product. We do not become an example of what we tell customers not to do. |
| Content of inputs, form values, IRIS prompts | Same. Telemetry is structural, not content-bearing. |
| Click-stream / heatmap / session replay | Not the goal. We are measuring component health, not user behaviour. |
| Marketing-site visitor telemetry | Marketing has its own analytics (Plausible) — not this system. |

#### 15.7.3 How we measure

A lightweight `<TelemetryBeacon>` wrapper auto-injected by the build at the root of every shared component. Once per session per component, it sends `{component_name, version, props_keys, surface_pathname, override_keys, error_count}` to a self-hosted aggregation endpoint. Sampled at 5%.

Storage: 90 days, aggregated to monthly counts after 30. No raw events are retained beyond 30 days.

Customers can opt out via account-level "telemetry" toggle; the toggle is on by default for paying customers, off by default for free-tier (because the telemetry value is not high enough to justify even structural data collection from non-paying users).

#### 15.7.4 What we do with the data

| Output | Cadence |
|--------|---------|
| Per-component health dashboard at `internal.risqbase.com/ds-health` | Live |
| Quarterly **adoption report** to G4, Frontend, G1, G8 | Quarterly |
| Promotion eligibility — `experimental` → `beta` → `stable` requires adoption thresholds (§23) | At each promotion review |
| Deprecation decisions — components below adoption thresholds for 2 consecutive quarters surface as deprecation candidates | Quarterly |

#### 15.7.5 Privacy and disclosure

Customer-facing privacy notice at `risqbase.com/privacy` lists telemetry data categories. Customer Data Processing Agreements include the telemetry as a sub-processor data flow. Sub-processor list (`risqbase.com/sub-processors`) names the aggregation infrastructure.

This is non-trivial. We are a compliance product. A telemetry programme that breaches our own customer DPA terms is a category of incident we do not survive. G8's team owns disclosure language. G1's team owns the technical implementation. Both must sign off before v4.2.0 ships.

### 15.8 Figma ↔ code token sync (F5)

v4.1 had no formal Figma library — designers worked in shared files but the link to code tokens was manual. v4.2 establishes the bidirectional sync.

#### 15.8.1 Figma library structure

The `RisqBase Design System` Figma library is organised to mirror the package:

```
RisqBase Design System (Figma library)
├── Foundations
│   ├── Color (variables, sourced from tokens/color/*.json)
│   ├── Typography (variables, sourced from tokens/typography/*.json)
│   ├── Spacing (variables, sourced from tokens/spacing/*.json)
│   ├── Shadow (variables, sourced from tokens/shadow/*.json)
│   └── Motion (notes only — Figma cannot represent motion)
├── Components / core
│   └── Buttons, Cards, Inputs, Badges, Tables, Forms, Toasts, Empty states, Navigation
├── Components / ai
│   └── CitationChip (all 6 states), StreamingText, PromptChip, IRIS lettermark
├── Components / data-viz
│   └── Gauge (all roles × variants), Chart shells (Bar, Line, Area, Heatmap, Choropleth), MetricCard, Sparkline
├── Patterns
│   └── Each §20 pattern as a Figma component
└── Brand
    └── Logo lockups, Concentric-Arc Pattern, photography style examples
```

Figma components are 1:1 with React components in the package. A new React component requires its Figma counterpart in the same release; a Figma component without a code counterpart is a stub and labelled as such.

#### 15.8.2 Token sync direction

| Token type | Direction | Mechanism |
|-----------|-----------|-----------|
| Color, Spacing, Typography, Shadow | **Code → Figma** (one-way, code is canonical) | `tokens-build` produces `dist/figma-tokens.json` per W3C format; CI publishes it via the Figma Variables REST API to the `RisqBase` Figma file on every merge to main |
| Component layout, props | **Code → Figma** (manual) | Designers update Figma components when React components change; reviewer (G4) verifies parity in PR review |
| New token proposals | **Figma → code** (proposal flow) | Designers propose new tokens by creating a Figma variable in a `_proposed/` collection; G4 reviews; on approval, the token is added to W3C JSON source and the proposed Figma variable is moved into the canonical collection by the next sync |

Code is canonical because code is what the customer sees. Figma drifts from code over a quarter; code never drifts from itself.

#### 15.8.3 Versioning

Figma library version follows the package version. A `1.2.0` package release is paired with a `1.2.0` Figma library publication. Designers consume the published library version; pulling un-published changes requires explicit consent.

#### 15.8.4 Tooling

- `tokens-build`: TypeScript script in `tools/tokens-build/`. Reads W3C JSON, emits CSS / TS / Tailwind / Figma JSON.
- `figma-publish`: Node script that posts the Figma JSON to the Figma Variables REST API. Requires the `FIGMA_TOKEN` secret in CI.
- `figma-diff`: Local script for designers to see the diff between their local Figma state and the published code tokens.
- `lint:recipes-voice` *(v4.2.1; implementation deferred to engineering programme)*: TypeScript script that walks every recipe in `apps/docs/content/patterns/**/*.mdx`, asserts each `voice_examples[]` entry carries a `template_id` matching `^10\.[58]\.\d+$`, and resolves the ID against a generated `§10.5`/`§10.8` template index. Fails the build on any unbound `voice_examples` entry. See §20.0.1.

CI gates: a token added to JSON without a corresponding `$description` and `$extensions.com.risqbase.role` fails the build. A token whose value violates its `contrastPair` minimum WCAG ratio fails the build. **Any token whose `$extensions` includes `com.risqbase.role` published from the `semantic` or `component` tier must also include `com.risqbase.figma` with `collection`, `mode`, and `scopes`** (per §15.1) — the lint rule fails the build if the binding is absent. Primitive-tier tokens may omit the figma binding when they are pure substrate (not published to Figma); when they are surfaced as Figma variables, the binding is required.

---
## 16. Migration from v4.1 to v4.2

v4.2 is non-breaking at the package level. No `1.x` consumer is forced to update. All changes are additive or rename-with-alias.

### 16.1 What changed

| Category | Change | Impact |
|----------|--------|--------|
| Package | `1.1.1` → `1.2.0` (minor) | Additive |
| Domain | New `ai/` domain in `@risqbase-inc/ui-components` | Additive |
| Domain | New `data-viz/` domain in `@risqbase-inc/ui-components` | Additive |
| Component | `<Gauge>` (generic primitive) added to `data-viz/` | Additive |
| Component | `<RiskGauge>` (RALIA wrapper) becomes a thin wrapper over `<Gauge>` — same props, same visual output | No-op for consumers |
| Component | `<CitationChip>`, `<StreamingText>`, `<PromptChip>` moved from `Risqbase-Inc/Ralia` → `@risqbase-inc/ui-components/ai`. Old import paths re-export from new location for v4.x. | Soft deprecation; warning console message |
| Component | `<LongOperation>` (generic, no IRIS narration) added to `core/` | Additive |
| Tokens | Chart palette tokens (`color.chart.*`, `color.risk.*`) added | Additive |
| Tokens | All tokens migrated to W3C Design Tokens Format JSON | Build-tool-only; no consumer change |
| Tokens | New `tokens-build`, `figma-publish`, `figma-diff` scripts | Tooling-only |
| Telemetry | New `<TelemetryBeacon>` auto-injection at component root | Default-on for paying customers; opt-out flag exposed |
| Content | `@risqbase-inc/ui-components/content` package added with strings, glossary | Additive |
| Documentation | v4.1 + v4.1.1 patch consolidated into one v4.2 document | Reading-only |

### 16.2 Migration steps for consumer apps

Consumers should plan one PR per migration step; each step is independently mergeable.

| Step | What | Required by |
|------|------|-------------|
| 1 | Update `@risqbase-inc/ui-components` to `^1.2.0` | v4.3 |
| 2 | Replace `import { CitationChip } from '@risqbase-inc/ralia'` with `import { CitationChip } from '@risqbase-inc/ui-components/ai'` (the old path is aliased through v4.x) | v5.0 |
| 3 | Replace any custom risk-band colour values with `color.risk.*` tokens | v5.0 |
| 4 | Replace any hand-rolled chart code with `data-viz/` components | v5.0 |
| 5 | If consumer custom-styles `<Gauge>`, audit that `palette` prop covers the case | v5.0 |
| 6 | Adopt the W3C JSON tokens as authoring source (optional — only relevant if the consumer extends the token set) | optional |
| 7 | The `marketing/` domain proposed in plan U2.8 ships as `content/` in v4.2 (see §22.2). The semantic shift is intentional: `content/` is content-design tooling (voice-aware copy primitives, content patterns, locale-aware formatters) rather than component primitives for a specific surface. No code action for existing consumers; future consumers authoring against `content/` should use that path rather than `marketing/` | informational |

### 16.3 Visual regression contract

Every component shipped in v4.1 renders identically in v4.2 by default. CI runs the existing visual regression suite plus 27 new test cases for the new `data-viz/` and promoted `ai/` components. Any pre-v4.2 customer screenshot is reproducible with v4.2.

The exception: charts. v4.1 had no shared chart components, so consumers' hand-rolled charts continue to work but are not under regression cover. Consumers migrating to `data-viz/` may see intentional visual changes — those are improvements, not regressions, and are documented per-component in the migration guide on `design.risqbase.com/migration/v4.2`.

---

## 17. Verification Checklist

Every PR touching design-system code, design-system documentation, or any consuming surface is verified against this checklist. CI lints the items marked **(lint)**; reviewers verify the rest. Items 1–44 are unchanged from v4.1; items 45–52 are unchanged from v4.1.1; items 53–80 are new in v4.2.

> **Row-count note (v4.2.1 hygiene).** The v4.2 plan named "rows 53–60" — a net of seven new verification items. The spec ships **twenty-eight new items (rows 53–80)** because the F1 data-visualisation chapter (eight new rows alone), the F3 voice-and-content expansion (six new rows), and the F5 Figma-sync programme (four new rows) each carried more verification weight than the plan estimated. Net positive but undocumented when v4.2 published; recorded here so future drift between plan and verification checklist count is acknowledged in the publishing PR rather than left as an audit-time discovery. Convention going forward: any version that expands the checklist by more than 25 % of plan estimate flags the drift in this prefatory note.

| # | Rule | v |
|---|------|---|
| 1 | No `gray-*` Tailwind utilities (lint) | v3.1 |
| 2 | No `text-stone-400` for body text (lint) | v3.1 |
| 3 | All numeric values use `tabular-nums` (lint) | v3.1 |
| 4 | `text-wrap: pretty` on prose, `balance` on headings | v3.1 |
| 5 | Maximum two text colours per surface | v3.1 |
| 6 | Indigo only used for CTAs, brand, and links | v3.1 |
| 7 | Module accents only on dots, badges, and rails | v3.1 |
| 8 | All numeric prose written in tabular-nums when ≥ 4 digits | v3.1 |
| 9 | Every surface answers: who, what, where, when | v3.1 |
| 10 | All clickable elements have `cursor-pointer` | v3.1 |
| 11 | All inputs reach 44px tap target | v3.1 |
| 12 | Forms validate on blur (not on each keystroke) | v3.1 |
| 13 | Loading states never block the entire UI; use skeletons | v3.1 |
| 14 | Toasts auto-dismiss; never carry destructive actions | v3.1 |
| 15 | Empty states pair an explanation with a primary action | v3.1 |
| 16 | Confirmations exact (never "Are you sure?") | v3.1 |
| 17 | Destructive actions require a typed confirmation when irreversible | v3.1 |
| 18 | All animations honour `prefers-reduced-motion` (lint) | v3.1 |
| 19 | Every component has a focus-visible state (lint) | v3.1 |
| 20 | Tab order follows visual order (manual test) | v3.1 |
| 21 | Print stylesheet renders cleanly on A4 and Letter | v3.1 |
| 22 | All citations in print include the source URL | v3.1 |
| 23 | Keyboard shortcut `?` opens cheatsheet on every authenticated surface | v3.2 |
| 24 | All shortcuts appear in the cheatsheet | v3.2 |
| 25 | All shortcuts honour the four-verb grammar (§5.8.3.1) | v4.1.1 |
| 26 | All `g <letter>` shortcuts resolve cross-product | v4.1.1 |
| 27 | Voice and tone match §10.1 / §10.2 (G8 review) | v3.1 |
| 28 | Sentence case throughout (no Title Case) | v3.1 |
| 29 | All product names spelled correctly | v3.1 |
| 30 | British English throughout product chrome | v3.1 |
| 31 | All non-glyph icons are Lucide React | v3.1 |
| 32 | Icons paired with labels for severity contexts | v3.1 |
| 33 | Concentric-Arc Pattern only on brand surfaces | v3.1 |
| 34 | All breakpoints mobile-first | v3.1 |
| 35 | Tables collapse to card lists below `md` | v3.1 |
| 36 | Component documentation uses only §7.0 glossary nouns | v4.1.1 |
| 37 | Citation chips in all six states render correctly | v4.1 |
| 38 | All AI assertions cite a source via `<CitationChip>` | v4.1 |
| 39 | Failed-retrieval callout used when AI assertion has no source | v4.1 |
| 40 | All gauges use `role="meter"` with `aria-valuetext` | v4.1.1 |
| 41 | All long operations use `<LongOperation>` (or `<IrisLongOperation>` when AI-driven) | v4.1 |
| 42 | All token references go through the role tier (no semantic or primitive consumed in component code) | v4.1 |
| 43 | All four theme files present and lint-clean: light + print stable in S1; dark + HC stubs in S1 (empty, lint-validated); dark + HC values land in S4 (impl-plan U5.5) | v4.2 |
| 44 | All patterns documented per §20.0 recipe schema | v4.1.1 |
| 45 | Pattern `composed_of` references only components and §7.0 nouns | v4.1.1 |
| 46 | Pattern `keyboard` references only §5.8.3.1 verbs | v4.1.1 |
| 47 | Pattern `accessibility` block exists for all `status: stable` patterns | v4.1.1 |
| 48 | Sibling patterns are first-class entries, not nested | v4.1.1 |
| 49 | Every pattern has `voice_examples` populated (≥3) | v4.1.1 |
| 50 | Every pattern has `last_reviewed` within last 12 months | v4.1.1 |
| 51 | Every component has a `tokens.md` listing role tokens consumed | v4.1.1 |
| 52 | Every component has a `Risqbase-Inc/ui-components` test story | v4.1.1 |
| 53 | Every chart classifies as one of §8.1.1 canonical types | v4.2 |
| 54 | No prohibited chart types per §8.1.3 (lint) | v4.2 |
| 55 | Every chart container has `role="figure"` and `aria-labelledby` (lint) | v4.2 |
| 56 | Every chart provides a data-table fallback (component test) | v4.2 |
| 57 | Every chart's pattern recipe answers the §8.1.2 three-question block | v4.2 |
| 58 | Chart palette tokens used; no bare hex in chart code (lint) | v4.2 |
| 59 | Categorical palette never used to encode a value | v4.2 |
| 60 | Risk-band palette only used for risk classification | v4.2 |
| 61 | Charts honour `prefers-reduced-motion` and `forced-colors` | v4.2 |
| 62 | Choropleth uses Equal Earth projection; never Mercator (lint) | v4.2 |
| 63 | Every chart respects the per-mark `aria-label` series-category-value pattern | v4.2 |
| 64 | All copy follows §10.5 content patterns | v4.2 |
| 65 | Error messages answer all three of §10.5.4 (what / why / what now) | v4.2 |
| 66 | Glossary terms used; no forbidden synonyms in product chrome | v4.2 |
| 67 | Acronyms spelled out on first reference per surface | v4.2 |
| 68 | Help text ≤ 50 words per §10.5.5 | v4.2 |
| 69 | IRIS hedging matches §10.8.1 confidence table | v4.2 |
| 70 | No forbidden IRIS phrasings (§10.8.2) | v4.2 |
| 71 | All localised strings live in `content/strings.{locale}.json` (lint) | v4.2 |
| 72 | Layout uses logical CSS properties (no `left`/`right`) (lint) | v4.2 |
| 73 | All tokens in W3C format with `$description` and `$extensions.com.risqbase.role` (lint) | v4.2 |
| 74 | Every token's `contrastPair` meets WCAG AA (lint) | v4.2 |
| 75 | New token added to all theme files or build fails (lint) | v4.2 |
| 76 | Figma library version matches package version | v4.2 |
| 77 | Figma component exists for every code component, or labelled stub | v4.2 |
| 78 | Telemetry beacon present at root of every shared component (lint) | v4.2 |
| 79 | Telemetry never sends PII, content, or session-replay data (review) | v4.2 |
| 80 | Customer DPA + sub-processor list reflects telemetry programme | v4.2 |

---

## 18. Governance

> **Doc-site status (v4.2.1 hygiene).** `design.risqbase.com` is **live as a placeholder** today (a single static page hosted on Vercel, project `design`). The full content-and-code parity site described in §18.1 is part of S6 of the v4.2 implementation programme (see `implementation-plan.md` §5.3). Until S6 ships, references to `design.risqbase.com/changelog/v4.2`, `design.risqbase.com/migration/v4.2`, `design.risqbase.com/accessibility`, and any other deep links elsewhere in this spec resolve to the placeholder. F4 audit rows (telemetry, adoption) depend on this site being live; they cannot pass verification before S6 publishes.

### 18.1 Content-and-code parity (Polaris-inspired)

Every component, pattern, and token has a docs page on `design.risqbase.com`. Each page renders rationale on the left and implementation on the right. The two are authored together; a PR that ships code without docs, or docs without code, fails CI.

### 18.2 Versioning (semver applied to a design system)

| Change | Version bump |
|--------|--------------|
| New component, new pattern, new token | Minor |
| Removing a component, renaming a token, removing a pattern field | Major |
| Changing a token value | Minor (because it cascades) — but visual regression suite must be updated |
| Internal refactor of a component (no API change) | Patch |
| Documentation-only change | Patch |

The package and the design-system document version in lock-step. v4.2 = `1.2.0`. v5.0 will be a major because the v4.x deprecation aliases for `Risqbase-Inc/ralia` paths will be removed.

### 18.3 Review cadence (F4)

Component health and adoption (per §15.7 telemetry) is reviewed on a fixed cadence. Each review produces a short written outcome appended to `design.risqbase.com/governance/reviews`.

| Review | Cadence | Owner | Output |
|--------|---------|-------|--------|
| **Quarterly Adoption Review** | Q1, Q2, Q3, Q4 | G4 | Per-component adoption report; promotion / deprecation candidates list |
| **Twice-yearly Glossary Review** | Q1, Q3 | G8 | Glossary diff; locale variant updates |
| **Annual Error-message audit** | Q4 | G8 | All error messages globally audited against §10.5.4 |
| **Annual Token Audit** | Q1 | Frontend | Every token's contrastPair, role assignment, and adoption count |
| **Per-release Visual Regression** | Every release | Frontend | Visual regression sign-off |
| **Per-release Pattern Recipe Lint** | Every release | G4 | Recipe schema CI report |

A component that has not been mounted in any production surface for two consecutive Quarterly Adoption Reviews surfaces as a deprecation candidate. Deprecation requires a `2.x` major bump with the standard 6-month deprecation window.

### 18.4 Approvers

| Domain | Approver |
|--------|----------|
| Visual / motion / typography | G4 |
| Implementation / API / build / tokens | Frontend, G1 |
| Content / voice / glossary | G8 |
| Privacy / telemetry programme | G8 + G1 (joint) |
| Cross-product policy | CEO |

Single-owner approval is sufficient within a domain; cross-domain changes require both owners. Major-version changes require CEO's explicit sign-off.

### 18.5 Contributor governance (Primer-inspired, sized for a small team)

Internal contributors raise PRs against `Risqbase-Inc/ui-components`. External contributions (open-source domain repos only — `core/`, `ai/`, `data-viz/`) require:

- A signed CLA (handled via `cla-assistant.io`)
- A linked issue describing the problem
- Conformance to all checklist items in §17 that apply to the change

External contributors do not have merge rights; only Frontend, G1, and G4 do. The bar for accepting external code is high — the design system is not a commons, it is a product.

---

## 19. Accessibility

### 19.1 Conformance level

WCAG 2.1 Level AA across the entire system. Specific features (§19.3) target Level AAA where feasible.

### 19.2 Statement structure (parent and product accessibility statements)

Each property publishes its own accessibility statement, plus the design system carries a parent statement:

| Property | Statement URL | Owner |
|----------|---------------|-------|
| RisqBase Design System | `design.risqbase.com/accessibility` | G4 |
| RALIA | `ralia.io/accessibility` | RALIA team |
| Cortex | `[internal admin]/accessibility` | Cortex team |
| RisqBase marketing | `risqbase.com/accessibility` | Marketing |

Each product statement inherits from the design system statement and supplements with product-specific known issues. The design system statement is updated on every release; product statements at minimum quarterly.

### 19.3 Per-component accessibility (Spectrum-inspired)

Every component in `@risqbase-inc/ui-components` has an `accessibility.md` file alongside its source covering:

| Section | Required content |
|---------|-----------------|
| Roles and labels | ARIA role, naming pattern |
| Keyboard | All supported keys and the resulting behaviour |
| Focus management | Roving tabindex, focus trap, focus restore on close |
| Screen reader | What is announced, in what order, when |
| Reduced motion | What changes when `prefers-reduced-motion: reduce` |
| Forced colors | What changes in Windows High Contrast |
| Contrast | All colour pairings with WCAG ratio |
| Known limitations | Honest disclosure |

Existing v4.1 components have these files; new v4.2 components ship with them or do not ship.

### 19.4 Testing

| Test | Mechanism | Cadence |
|------|-----------|---------|
| Automated axe-core | CI on every PR | Per PR |
| Pa11y CI | CI on every PR — broader than axe | Per PR |
| NVDA + JAWS + VoiceOver manual sweep | Internal | Quarterly |
| External a11y audit | Independent third-party | Annually |

The annual external audit findings are appended to the accessibility statement with their remediation plan and target date.

---

## 20. Patterns

### 20.0 Pattern Recipe Schema

*Retained from v4.1.1 in full.* Every pattern is a structured recipe with frontmatter (`id`, `title`, `visibility`, `status`, `problem`, `when_to_use`, `when_not_to_use`, `composed_of`, `layout`, `voice_examples`, optional `variants`, `related`, `keyboard`, `accessibility`, `last_reviewed`, `owner`).

#### 20.0.1 `voice_examples` — template-bound (v4.2.1 patch)

Every entry in a recipe's `voice_examples[]` array must carry a `template_id` referencing a canonical content template from §10.5 (content patterns) or §10.8 (AI / IRIS-specific content rules). Without the binding, §10 is decorative — recipes can drift to ad-hoc copy and the voice & tone work never lands as enforcement.

```yaml
# Recipe example — assessment-outcome-dpia
voice_examples:
  - template_id: "10.5.4"           # required — references the empty-state template
    context: "no DPIAs found in current quarter"
    rendered: "No DPIAs in this period. New assessments will appear here."
  - template_id: "10.8.2"           # required — references the AI-hedge template
    context: "IRIS-summarised risk band, confidence < 0.7"
    rendered: "Based on partial evidence, this looks like a high-risk activity."
```

| Field | Required | Spec |
|-------|:---:|------|
| `template_id` | ✓ | Must match a `^10\.[58]\.\d+$` pattern. The template definition lives in §10.5 (e.g., `10.5.4` = empty-state) or §10.8 (e.g., `10.8.2` = AI hedge phrase). CI verifies the ID resolves to a real template. |
| `context` | ✓ | One-sentence description of when this example renders. Used by reviewers + the docs site. |
| `rendered` | ✓ | The verbatim copy that surfaces in the UI in this context. CI verifies it conforms to the named template's structure. |

**CI gate (v4.2.1).** The `lint:recipes-voice` script (queued in §15.8.4 tooling) fails on any recipe whose `voice_examples[]` entry omits `template_id` or whose `template_id` does not resolve to a §10.5/§10.8 template. Implementation is deferred to the engineering programme (`implementation-plan.md` §5.3); the spec contract is binding from v4.2.1.

### 20.1 Pattern Index

| # | Pattern ID | Visibility | Problem solved |
|---|-----------|-----------|----------------|
| 20.2a | `assessment-outcome-dpia` | RALIA-private | DPIA outcome page for regulator-facing audience |
| 20.2b | `assessment-outcome-lia` | RALIA-private | LIA outcome page with three-pillar test summary |
| 20.2c | `assessment-outcome-fria` | RALIA-private | FRIA outcome page with rights-impact matrix |
| 20.2d | `assessment-outcome-vendor` | RALIA-private | Vendor risk outcome page |
| 20.3 | `regulator-facing-report-cover` | RALIA-private | PDF cover page for regulator submissions |
| 20.4 | `audit-log-entry` | Public | Single immutable-log event |
| 20.5 | `iris-conversation-in-flow` | RALIA-private | Inline IRIS conversation in a workflow |
| 20.6 | `dashboard-hero-composition` | Public | Top of a dashboard with one hero plus support |
| 20.7 | `two-pane-detail-view` | Public | List + detail layout |
| 20.8 | `wizard-step` | Public | One step of a multi-step flow |
| 20.9 | `notification-alert-item` | Public | Alert item in any list |
| 20.10 | `settings-page` | Public | Form-heavy configuration |
| 20.11 | `inline-confirmation` | Public | Confirm a significant action without a modal |
| 20.12 | `bulk-actions-bar` | Public | Operate on multiple selected list items |
| 20.13 | `keyboard-cheatsheet-panel` | Public | Surface and discover all shortcuts |
| 20.14 | `dashboard-chart-tile` | Public | A chart embedded in a dashboard tile (v4.2 new) |
| 20.15 | `world-risk-map` | Public | The Horizon Intelligence choropleth pattern (v4.2 new) |
| 20.16 | `risk-matrix` | RALIA-private | The 5×5 likelihood-impact heatmap (v4.2 new) |

The full recipe for each pattern lives at `design.risqbase.com/patterns/{id}`; this document carries the index only.

---

## 21. Prohibited Patterns

*Retained from v3.1 + v4.1 additions.* Highlights:

- No `gray-*` colour values
- No emoji in product chrome (the IRIS lettermark is the only system glyph)
- No exclamation marks in transactional UI
- No "Are you sure?" confirmation language
- No animation on every state change — animation must communicate
- No infinite spinners — every loading state has a duration estimate or skeleton
- No alerts that block work without explaining why
- No more than one primary action per region (§21.8)
- No nested modals
- No carousels for primary content
- No prohibited chart types (§8.1.3) — pie, donut > 2 wedges, 3D, word cloud, radar, dual-axis line, bubble
- No bare hex values in component or chart code
- No hard-coded strings — all copy via `content/strings.*.json`
- No `left` / `right` CSS — use logical properties

### 21.8 The single-primary-action rule

Each region has exactly one primary action. The primary is the answer to "what is the user most likely to want to do here?" Other actions in the region are secondary (button) or tertiary (text link). Two primaries in one region is the most common cause of a confused interface.

---

## 22. Repository & Package Architecture

### 22.1 Repos

| Repo | Visibility | Licence | Content |
|------|-----------|---------|---------|
| `Risqbase-Inc/ui-components` | Public | MIT | The shared design-system code: `core/`, `ai/`, `data-viz/`, `content/`, `tokens/` |
| `Risqbase-Inc/design-docs` | Public | CC BY-NC | The text of this design system, the docs site, the Figma export of brand assets |
| `Risqbase-Inc/Ralia` | Private | Proprietary | RALIA product and RALIA-private components (IRIS character, RiskGauge wrapper, RALIA-private patterns) |
| `Risqbase-Inc/Cortex` | Private | Proprietary | Cortex product |
| `Risqbase-Inc/risqbase-marketing` | Private | Proprietary | risqbase.com |

The shared package and docs are public to enable open-source adoption (the Polaris/Primer model). Customer-facing product code is private. The licence split — MIT for code, CC BY-NC for docs — prevents competitors from cloning the documented system as their own product while leaving the code freely reusable.

### 22.2 Five domains in `@risqbase-inc/ui-components` (v4.2)

```
@risqbase-inc/ui-components/
├── core/           # Universally applicable UI primitives
├── ai/             # Components for AI-feature surfaces
├── data-viz/       # Charts, gauges, sparklines, the data-vis system
├── content/        # Strings, glossary, i18n
├── tokens/         # W3C JSON tokens, theme files, build outputs
├── icons/          # Lucide re-exports + RisqBase glyphs
├── patterns/       # Pattern recipes (data only — patterns are compositions)
└── tools/          # tokens-build, figma-publish, figma-diff
```

Each domain is independently importable: `import { Button } from '@risqbase-inc/ui-components/core'`, `import { Gauge } from '@risqbase-inc/ui-components/data-viz'`, etc. Tree-shaking guarantees that importing one domain does not pull others.

#### 22.2.1 What lives where

| Domain | Rule | Examples |
|--------|------|----------|
| `core/` | Components that any app could use, with no AI semantics, no chart semantics | Button, Card, Input, Badge, Table, Form, Toast, Modal, EmptyState, LongOperation (generic), Navigation primitives |
| `ai/` | Components specifically supporting AI features — citation, streaming, prompts | CitationChip (all 6 states), StreamingText, PromptChip, the IRIS lettermark glyph (the IRIS *character* lives in RALIA) |
| `data-viz/` | Charts, gauges, sparklines | Chart, BarChart, LineChart, AreaChart, Sparkline, Heatmap, ChoroplethMap, Gauge, MetricCard, all marks |
| `content/` | Strings, glossary, content patterns (data only) | strings.en-GB.json, strings.en-US.json, glossary.json, content patterns as MDX |
| `tokens/` | Tokens, themes, build outputs | color/, dimension/, typography/, themes/light.json, themes/print.json |

#### 22.2.2 Promotion path between domains

| From | To | When |
|------|-----|------|
| Product-private | `core/` | When the component has shipped in 2+ properties and adoption thresholds met (§23) |
| Product-private (AI feature) | `ai/` | Same, where the component is AI-specific |
| Product-private (chart) | `data-viz/` | Same, where the component is chart-specific |
| `core/` | `ai/` or `data-viz/` | If a component's primary use case turns out to be domain-specific |

A new domain (a sixth) is added only with CEO's approval. Five is the working ceiling — more domains fragment imports without aiding navigation.

### 22.3 The IRIS character (still RALIA-private)

The IRIS *character* — the `<IrisFab>`, the `<IrisPanel>`, the conversation memory, the personality voice — remains in `Risqbase-Inc/Ralia`. The *machinery* (CitationChip, StreamingText, PromptChip, LongOperation) is now in `ai/` and `core/`.

When Cortex builds an AI feature, it imports the machinery from `@risqbase-inc/ui-components/ai` and provides its own character and personality. There is no expectation that Cortex will re-use IRIS — IRIS is RALIA's character. The contract is: machinery is shared, character is product.

### 22.4 Versioning across domains

All five domains version as one. `@risqbase-inc/ui-components@1.2.0` ships `core/@1.2.0`, `ai/@1.2.0`, `data-viz/@1.2.0`, etc. Domains are organisational, not independent.

### 22.5 Build, lint, test (Primer-inspired)

| Concern | Tool |
|---------|------|
| Build | `tsup` (single config, multi-entry per domain) |
| Lint (code) | `eslint` with internal `eslint-plugin-risqbase-ds` enforcing checklist items 1–80 where automatable |
| Lint (tokens) | `style-dictionary` config + custom validators for §15.6 rules |
| Test (unit) | `vitest` |
| Test (visual regression) | Chromatic |
| Test (a11y) | `axe-core` integrated into Storybook |
| Documentation site | Astro with MDX rendering of pattern recipes |

CI is GitHub Actions. Every PR runs the full suite plus the §17 automated checklist.

---

## 23. Promotion Criteria — adoption-evidence-based (v4.2)

In v4.1 promotion to `core/` required two-property adoption, sound API, accessibility documentation, and G4's approval. v4.2 makes this **adoption-evidence-based** — promotion requires telemetry-confirmed adoption metrics, not just two checkboxes ticked on a form.

This is the substance of F4. It closes the loop with §15.7 telemetry: we collect usage data; we use it to make promotion and deprecation decisions; we publish those decisions.

### 23.1 Status tiers

| Tier | Meaning | API stability | Visual stability | Where it lives |
|------|---------|--------------|------------------|----------------|
| `experimental` | Try it; we may delete it | None | None | Product-private repo |
| `beta` | Use it; API may change once before stable | Documented breaking change with 1-cycle notice | Same | Shared package, marked `beta` |
| `stable` | Production-ready; semver guarantees | Major-bump for API change | Visual regression covered | Shared package |
| `deprecated` | Don't add new usage; remove by next major | Same as stable until removed | Same | Shared package, marked `deprecated` |

### 23.2 Promotion: experimental → beta

Component eligible to enter the shared package as `beta` when:

- ✅ Used on at least one production surface for **30+ days**
- ✅ Telemetry shows mount count > 100 in the last 30 days
- ✅ Has a `<TelemetryBeacon>` integrated
- ✅ Passes all relevant §17 checklist items
- ✅ Has `accessibility.md` and `tokens.md` files
- ✅ Has Storybook stories covering all variants
- ✅ Author + G4 sign off

### 23.3 Promotion: beta → stable

Component eligible for `stable` when:

- ✅ All `beta` criteria still met
- ✅ Used on **2+ properties** (at least 2 of: RALIA, Cortex, marketing)
- ✅ Telemetry shows mount count > 1,000 in the last 90 days
- ✅ Telemetry shows ≤ 5% surfaces using `className`/`style` overrides — high override rate signals the component does not fit its use cases
- ✅ Telemetry shows no error boundary trips in the last 30 days
- ✅ Visual regression suite covers all variants
- ✅ External a11y audit clean OR known limitations documented
- ✅ Two cycles with no API changes
- ✅ G4, Frontend, G1 sign off

### 23.4 Demotion / deprecation

Stable component deprecated when:

- ⚠️ Telemetry shows mount count < 50 across all properties for **2 consecutive Quarterly Adoption Reviews** (per §18.3), OR
- ⚠️ A successor component supersedes its use cases entirely, OR
- ⚠️ A fundamental API or visual change requires breaking semver — better to deprecate and ship a successor

Deprecation requires:

- 6-month notice in CHANGELOG
- Console warning on every mount during the deprecation window
- Migration guide in `design.risqbase.com/migration/`
- Removal in next major version

### 23.5 The discipline

The point of adoption-evidence-based promotion is to keep the system honest about what is actually used. A library full of stable components that nobody renders is debt; a library that promotes only what is actually adopted stays sized to its team.

It also resists the seductive failure mode where designers and engineers ship beautiful components that solve theoretical problems. Telemetry tells the truth: if it's not mounted, it's not solving a real problem. Either find the real problem, or remove it.

### 23.6 Override-frequency as design signal

A component whose `className`/`style` override rate exceeds 15% of mounts is failing as an abstraction — consumers are reaching past the API to fix the design themselves. The Quarterly Adoption Review surfaces these. The remedy is one of:

1. Add a prop covering the common override
2. Redesign the component to fit the use cases
3. Acknowledge the override pattern and document it as supported

Doing nothing is not an option — every quarter the override rate stays high, the component drifts further from the system's intent.

### 23.7 Promotion log

Every promotion across the four tier transitions in §23.1 — experimental → beta, beta → stable, RALIA-private → shared, deprecated → removed — is recorded here in the same release as the promotion ships. The log is the audit trail for §23's adoption-evidence-based discipline: a future "why is this shared?" or "when did this stabilise?" question is answered by reading this section.

| Component | Source | Target domain | Version | Triggered by | Justification |
|-----------|--------|---------------|---------|--------------|---------------|
| **Gauge (generic primitive)** | RALIA-private (`Risqbase-Inc/Ralia`) | `@risqbase-inc/ui-components/data-viz` | v4.2 | F2 + Cortex operational-gauge need | The dual-ring inherent/residual delta encoding is RisqBase-distinctive (§7.11), but the *underlying* stroked-arc primitive — track + arc + terminus + centre-value — is generic. Cortex needs gauges for operational health; the marketing site uses gauges for quantified value claims. Promoting keeps the dual-ring encoding RALIA-configured while letting other products consume the primitive. RALIA Risk Gauge becomes a ~60-line wrapper. |
| **Citation Chip** | RALIA-private (`Risqbase-Inc/Ralia`) | `@risqbase-inc/ui-components/ai` | v4.2 | F2 + cross-product AI need | Every AI feature across the three products renders citations the same way — source pill, hover popover with full reference, click to permalink. The interaction is the AI surface's load-bearing trust contract (§6.5). RALIA's v4.1.1 implementation is preserved verbatim; only the import path changes (§16.2 step 2). |
| **StreamingText** | RALIA-private (`Risqbase-Inc/Ralia`) | `@risqbase-inc/ui-components/ai` | v4.2 | F2 + the IRIS streaming contract becomes systemic | Token-by-token reveal with citation-chip slot, error-mid-stream state, and `aria-live="polite"` wrapper. The streaming-text shape itself is system-level (per §6.5); IRIS branding stays in RALIA via composition. |
| **PromptChip** | RALIA-private (`Risqbase-Inc/Ralia`) | `@risqbase-inc/ui-components/ai` | v4.2 | F2 + cross-product prompt-suggestion need | Pre-filled prompt-suggestion pill. Cortex uses it for triage suggestions; marketing site uses it for try-this-prompt CTAs. |
| **LongOperation (stepped-pattern primitive)** | RALIA-private (`Risqbase-Inc/Ralia`) | `@risqbase-inc/ui-components/core` | v4.2 | F2 + long-running-task UX is universal | The generic stepped-pattern primitive (per §7.13.1) is for any operation with a known step sequence and indeterminate completion time. The IRIS-narrated variant (streaming step labels via `aria-live="polite"`) remains a RALIA wrapper. |

**Promotion protocol — for future promotions.** Each row above was authored by G4 in the same PR that shipped the promotion. The discipline going forward:

1. **At promotion-time**, the PR author adds one row to this table with all six fields. No "TBD" entries; a promotion without a log row fails review.
2. **At quarterly adoption review** (§23.5), G4 reviews the log against telemetry: did the promoted component get the cross-product adoption the justification claimed? Components that didn't are flagged in §23.4 for demotion.
3. **At major-version boundaries**, the log is read end-to-end as the canonical "what shared this major" story; mismatches between log entries and shipped components trigger a hygiene pass before the major publishes.

---

## Approval Block

| Role | Name | Date | Status |
|------|------|------|--------|
| Principal Designer | G4 (Design) | 7 May 2026 | Authored v4.2 |
| Frontend + UI | Frontend (reports to G1) | 7 May 2026 | Reviewed |
| Technical Lead | G1 (Architecture) | 7 May 2026 | Reviewed |
| Growth & Customer Success | G8 (Growth) | 7 May 2026 | Reviewed |
| CEO | CEO | 7 May 2026 | Approved |

**Document version:** v4.2
**Package version:** `@risqbase-inc/ui-components@1.2.0`
**Supersedes:** v4.1, v4.1.1 patch, v4.0.1 patch, v4.0, all prior versions

---

**END OF GOV-DS-2026-02 v4.2**
