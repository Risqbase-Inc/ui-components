# Changelog

## Unreleased

### Design System v4.3 — package side, addendum 2 (iris.accent-on contrast contract + R11)

Resolves the contrast finding surfaced by PR #51's `verify:contrast` script. Claude Design's call: accept the 3.74:1 ratio (don't darken `iris.accent`), constrain where the white glyph applies, enforce via a new scanner rule.

- **New token `iris.accent-on-dark`** → `stone-900`. Computes to **4.67:1** on `iris.accent` (teal-600) — clears AA Normal. Carries a `contrastPair` annotation so the verifier picks it up. The `iris.accent-on` token (white) stays at 3.74:1 with a contract update in its `$description` constraining it to AA Large + Non-Text uses.
- **Spec doc — `docs/design-system/v4.3/RisqBase-DS-v4.3-Comprehensive.md` §4.2 contrast contract** — table of approved / not-approved surface categories, rationale for keeping teal-600, and pointers to the enforcement mechanisms.
- **Scanner rule R11** — new in v4.3. `docs/design-system/v4.3/scanner-rule-r11.md` is the canonical rule definition; `scripts/scanner-rules/r11-iris-accent-on.mjs` is the reference detection implementation (regex-based; emits `error` for clear violations, `warn` for ambiguous). Consumer scanners (RALIA, marketing) import or copy the function into their `scripts/lib/design-rules.mjs`. The package's `files` array now publishes `scripts/scanner-rules/` so consumers pick up rule updates through their normal version bump.
- **Primitive docs** — `IrisThinking/accessibility.md` and `PromptChip/accessibility.md` now reference the §4.2 contract. The package's own primitives don't violate R11 (verified: `node scripts/scanner-rules/r11-iris-accent-on.mjs src → no violations`); the contract is for consumer compositions that use Iris-accent backgrounds.

Out of scope (consumer-repo work):
- Updates to the 10 RALIA redesigns (`audit-deliverable/redesigns/*.html`) — live in `Risqbase-Inc/Ralia`.
- Updates to the 8 marketing demos — live in the marketing-site repo.
- Wiring R11 into consumer-side `scripts/lib/design-rules.mjs` + CI — happens in each consumer scanner.
- Baseline generation for existing showcase violations — each consumer regenerates against its own tree.

### Design System v4.3 — package side, addendum (Claude Design strategic decisions)

- **`<TelemetryBeacon>` stub landed.** New no-op primitive at `core/TelemetryBeacon` — production no-op, dev `console.debug` gated on `NEXT_PUBLIC_TELEMETRY_DEBUG=1`. All 25 primitives (5 v4.2.1 + 20 v4.3) now emit a mount beacon. When the collector lands (audit U4.2 / U4.3), the dispatch wires in at the Beacon — no component-side change.
- **Modal / Drawer / Sheet rebased on `@radix-ui/react-dialog`.** Public API unchanged (`open` / `onClose` / `title` / `aria-label` / `dismissOnBackdrop` / `dismissOnEsc`). The hand-rolled `Overlay.tsx` is deleted; Radix handles focus trap, focus restoration, ARIA wiring, scroll-lock, and pointer suppression on background siblings. The `inertBackground` prop is removed (Radix's `modal=true` default supersedes; nested overlays don't need it).
- **`ChartContainer` rebased on visx@^3** (honouring v4.2.1 audit row A1's pin). `line` / `bar` / `sparkline` use `@visx/scale`, `@visx/shape`, `@visx/group`. `heatmap` / `area` / `choropleth` / `metric-card` deferred to v4.4 unlock by importing the matching visx package; no architecture change.
- **`iris.*` namespace retained.** Confirmed canonical; no `ai.character.*` rebase.
- **Packaging shape** — Radix Dialog + visx land as `peerDependencies`, not runtime `dependencies`. `@radix-ui/react-dialog` is **required** (every consumer of `Modal` / `Drawer` / `Sheet` needs it). The three visx packages (`@visx/group`, `@visx/scale`, `@visx/shape`) are flagged **optional** in `peerDependenciesMeta` — consumers that never import `ChartContainer` aren't forced to install them. All four are mirrored in `devDependencies` so local builds, tests, and Storybook keep resolving. This is the standard packaging shape for a React UI library that wraps third-party primitives (mirrors Radix-derived libs, MUI, Chakra, Mantine, shadcn).

### Design System v4.3 — package side (`@risqbase-inc/ui-components@2.0.0`)

**MAJOR**. Implements the package half of GOV-DS-2026-02 v4.3 (CEO-approved 18 May 2026). The docs site (`design.risqbase.com`), telemetry dashboard, consumer migrations (RALIA, marketing), and Layer-3 showcase pages land in separate PRs per spec §9 / §11.

#### Three-layer model

- Layer 1 / Layer 2 / Layer 3 separation codified per v4.3 §2. Domain barrels (`/core`, `/ai`, `/data-viz`) are the public surface. Root barrel is **soft-deprecated** — dev builds emit a one-shot console warning; removal target v5.0 (§9.2).

#### New components — 20 primitives across three domains

**`/core` (Layer 1) — 12 new + extended Badge.**
- `IconButton` (3 sizes × 3 variants, hit target ≥ 24×24 — closes RALIA F-015 / F-028 / F-037 / F-050).
- `SkipLink` (closes RALIA F-053 + WCAG 2.4.1).
- `Card` (3 variants × 4 padding levels, 16px default radius — closes RALIA F-060).
- `Callout` (5 intents, replaces left-border-accent — closes RALIA F-002 + marketing C-05).
- `Skeleton` (5 variants, motion-reduce safe — closes RALIA F-004).
- `EmptyState` (8 variants — closes RALIA F-020 / F-055).
- `WizardProgress` (auto-style by step count — closes RALIA F-010).
- `Modal`, `Drawer`, `Sheet` (shared focus-trap + scrim + Esc + body inert — closes RALIA F-046).
- `Toast` + `ToastViewport` (focus-aware quadrant positioner — closes RALIA F-054, WCAG 2.4.11).
- `Badge` extended with `band-very-low` / `band-low` / `band-medium` / `band-high` / `band-very-high` variants + `BandBadge` wrapper (closes RALIA F-018).

**`/ai` (Layer 2) — 5 new.**
- `CitationChip` (9 variants — closes RALIA F-012 / F-025).
- `IrisThinking` (3-arc rotation, reduced-motion fallback — closes RALIA F-011 / F-051).
- `StreamingText` (constant 35 tok/s cadence — closes O-006).
- `PromptChip` (Iris-accent halo on hover).
- `ClientScopeBanner` (persistent below-header strip — closes RALIA F-043).

**`/data-viz` (Layer 2) — 3 new.**
- `Gauge` (generic stroked-arc, 4 sizes, 3 palettes — closes v4.2 audit U2.1).
- `RiskGauge` (compliance-semantics wrapper: dual-ring + band-derivation + delta pill — closes v4.2 audit U2.2).
- `ChartContainer` (`line` / `bar` / `sparkline` ship in v4.3; `heatmap` / `area` / `choropleth` / `metric-card` deferred to v4.4 per v4.1 §8.1.1).

#### Tokens

- **New `iris.*` semantic namespace** (9 tokens: `accent`, `accent-hover`, `accent-subtle`, `accent-on`, `surface`, `streamhead`, `thinking-outer`, `thinking-mid`, `thinking-inner`). Resolves through the teal palette but named explicitly so RALIA / Cortex / future products can re-bind the Iris character per product without touching primitives.
- **Badge band variants** — `tokens/component/badge.json` extended with 15 `band.*` tokens (5 bands × 3 properties: background / foreground / border).
- **New component-tier token files:** `card.json`, `callout.json`, `citation-chip.json`, `gauge.json`, `iris-thinking.json`.

#### Tailwind preset

- `font-sans` default updated to lead with Geist / Geist Sans (canonical primary per v4.3 §4.5); `font-mono` defaults to Geist Mono.
- New `keyframes` and `animation` entries: `skeleton-shimmer`, `streamhead-blink`, `iris-thinking-rotate`, `iris-thinking-rotate-reverse`, `iris-thinking-pulse`.

#### Resolutions

- **D-001** Button radius ratified at 12px (`rounded-xl` / `--dimension-radius-button-default`).
- **D-002** Header logo weight ratified at `font-bold`.
- **D-003** Footer surface ratified at `surface-inverse` (stone-900).

#### Spec

- `docs/design-system/v4.3/RisqBase-DS-v4.3-Comprehensive.md` recorded as the canonical reference (GOV-DS-2026-02 v4.3, CEO-approved 18 May 2026).

### Documentation

### Documentation

- **Design System v4.2.1 — Complete.** All 14 spec-side gaps closed across 11 PRs (#17–#27) on 2026-05-11 + housekeeping PR landing the rename + tracker reconciliation. Documentation-only patch; no `@risqbase-inc/ui-components` version bump. Resolution log + outstanding handoffs in [`docs/design-system/v4.2.1/v4.2.1-COMPLETE.md`](docs/design-system/v4.2.1/v4.2.1-COMPLETE.md).
  - **P2 governance hygiene (G1–G4):** §8.5.6 sonification deferral, §16.2 marketing→content rename, §17 row-count drift note, §18 doc-site status note.
  - **P1 audit-flagged (A1–A7):** §8.7 visx@^3.0.0 library pin, §10.3.3 number-formatting (4 typed tables), §15.1 + §15.8.4 Figma `$extensions` key, §20.0.1 voice_examples template binding, §23.7 promotion log (5 rows), §8.16 print variants for all 28 chart types, §8.17 three composite recipes.
  - **P0 substrate (T1–T3):** §15.6 token enumeration (241 tokens authored; 38 TBD primitives queued for Claude Design), §8.1.1 chart taxonomy (7 → 28 active types + 11-row decision matrix), §10.6 canonical glossary (14 → 84 entries across 6 sub-categories).
- **Section-ID corrections** (5) recorded in `v4.2.1-COMPLETE.md` resolution log — patch plan's section IDs vs as-shipped spec.
- **Tracker-table reconciliation** — 6 row-state mismatches between entry-section headers and bottom tracker fixed in the housekeeping PR.
- `docs/design-system/v4.2/audit.md` "What needs honest attention before v4.2.1" updated to reference the completion document.
- `docs/design-system/v4.2/v4.2.1-backlog.md` (a working list maintained across S1 cleanup PRs) absorbed into the patch plan and removed.
- **BRIEF-401 — DS implementation audit + value-pass.** `docs/briefs/BRIEF-401-DS-IMPL-AUDIT.md` commissions the next slice of work: the v4.2.1 outstanding handoffs (38 TBD primitive hex values, dark + HC + print theme values, `scopes[]` patch per A7) plus a full system audit against the spec. Two-agent split: Claude Design produces artefacts, Claude Code lands them as PRs.

## [1.4.0](https://github.com/Risqbase-Inc/ui-components/compare/v1.3.0...v1.4.0) (2026-05-14)


### Features

* design site v1 — Claude Design import (replaces [#40](https://github.com/Risqbase-Inc/ui-components/issues/40) prototype) ([1709d7e](https://github.com/Risqbase-Inc/ui-components/commit/1709d7ee45a9c41fb958b2691816aea1b9ec657e))
* design site v1 — Claude Design import (supersedes [#40](https://github.com/Risqbase-Inc/ui-components/issues/40)) ([#42](https://github.com/Risqbase-Inc/ui-components/issues/42)) ([d0992e2](https://github.com/Risqbase-Inc/ui-components/commit/d0992e29df789375ec4fa48826ec3b26b0d6a93f))
* **design-site:** import favicon — current r|ↄ brand mark ([ddcb942](https://github.com/Risqbase-Inc/ui-components/commit/ddcb942dc1a65c52e1dbbe630b3c0700c89100b2))
* **design-site:** recover lost commits + close v4.2.1 G5 ([#45](https://github.com/Risqbase-Inc/ui-components/issues/45)) ([2bebb33](https://github.com/Risqbase-Inc/ui-components/commit/2bebb332f237a86af87734340aee1c45b3e0dbbd))
* design-system v1 site + RisqBase d.o.o. registered office in Footer ([18185bc](https://github.com/Risqbase-Inc/ui-components/commit/18185bc9c6a2fbeec7b1bfac1efb76f6db20f63a))
* design-system v1 site + RisqBase d.o.o. registered office in Footer ([#40](https://github.com/Risqbase-Inc/ui-components/issues/40)) ([4eed2a0](https://github.com/Risqbase-Inc/ui-components/commit/4eed2a0c4c481c59669237ec68fd5a9645974f7c))
* **tokens:** add scopes[] to semantic + component figma extensions (BRIEF-401) ([#34](https://github.com/Risqbase-Inc/ui-components/issues/34)) ([d83c774](https://github.com/Risqbase-Inc/ui-components/commit/d83c774fca6affc90bbcca4a014d3f8e06850493))


### Bug Fixes

* **design-site:** rename Cortex to RisqBase operations externally ([03f3184](https://github.com/Risqbase-Inc/ui-components/commit/03f3184085028d320be7c8a5b3e9042e9f73a7ca))


### Documentation

* mark v4.2.1 G5 resolved + add Chromatic changelog entry ([fec4a97](https://github.com/Risqbase-Inc/ui-components/commit/fec4a9762d73d52be2ccd1e2c321e4a930b5795c))

## 1.3.0 (pending tag) — Design System v4.2

S1 of the v4.2 implementation programme is the largest single sprint in the package's history: ~1,800 lines of new and changed code across `src/`, `tokens/`, and `tools/`, plus the W3C-format token corpus, the Style Dictionary build pipeline, and the SSR-safe theming infrastructure. This release ships those changes; subsequent v4.2 sprints (S2 — data-viz, S3 — ai, S4 — content/dark/HC, S5 — Figma, S6 — consumer migration) layer additional v1.3.x and v1.4.x releases on top.

### Added

**Sub-path imports** (spec §22.2)

- `src/` restructured into domain folders (`core/`, `ai/`, `data-viz/`, `content/`, `tokens/`, `primitives/`). Consumers can import from sub-paths:
  - `@risqbase-inc/ui-components/core` — the five v1.x components plus theming primitives.
  - `@risqbase-inc/ui-components/tokens` — typed design tokens.
  - `@risqbase-inc/ui-components/ai`, `/data-viz`, `/content` — empty placeholders today; reserved for S2 (data-viz), S3 (ai), S4 (content). Imports resolve cleanly from S1 onwards.
  - `primitives/` is intentionally internal-only.

**Design tokens — three-tier W3C corpus**

- ~150+ tokens authored as W3C Design Tokens Format JSON across primitive, semantic, and component tiers in `tokens/`.
- Style Dictionary build pipeline (`npm run build:tokens`) emits four artefacts: `dist/tokens.css`, `dist/tailwind-tokens.js`, `dist/figma-tokens.json`, and `src/tokens/generated.ts`.
- Schema lint (`npm run lint:tokens`) rejects W3C violations and unresolved `{token.path}` references.
- See `tokens/README.md` for authoring guidance.

**Theming infrastructure** (spec §15.2.1, plan D11)

- `data-theme` attribute on `<html>` is the single switch for `light` | `dark` | `hc`. CSS custom properties cascade off the attribute; theme swaps require no React re-render.
- New public API (exported from both root and `/core`):
  - `setTheme(theme)` — runtime mode setter; persists to `localStorage`. SSR-safe (no-op on server).
  - `getTheme()` — read the active mode (returns `'light'` during SSR).
  - `themeInitScript` — ~280-byte SSR-safe init string. Inline as the **first** `<script>` in `<head>` to avoid flash-of-wrong-theme on reload.
  - `THEME_STORAGE_KEY` — `localStorage` key name (`'risqbase-ds-theme'`) for consumer integrations.
  - `Theme` — exported type alias: `'light' | 'dark' | 'hc'`.
- Light values shipped now; dark and HC token overrides are stub layers (`tokens/themes/{dark,hc}.json`) that G4 fills in S4. Until then, `setTheme('dark')` renders light values.
- See `docs/theming.md` for the consumer integration guide.

**Toolchain**

- `npm run lint:tokens` — schema lint over `tokens/**/*.json`.
- `npm run build:tokens` — Style Dictionary build, runs first in `npm run build`.

### Changed

- Header, Footer, Button, Badge, SectionEyebrow migrated to consume role tokens via Tailwind arbitrary values (e.g. `bg-[var(--color-action-primary)]`). Migration is structural; no visual change is intended at light-mode parity (Chromatic verifies in G5).
- Stone-* (warm) neutral palette per spec §1; replaces `gray-*` references in component classNames where applicable.
- ESLint configuration moved into `package.json#eslintConfig` (single source of truth). `@typescript-eslint` remains at v6.21.0; the v8 upgrade is in flight in G1's parallel PR and will close behind it.

### Backwards compatibility

- Every v1.x export remains at the package root: `import { Button } from '@risqbase-inc/ui-components'` continues to work for all five components and for the new theme primitives. Sub-path imports are additive — no consumer is forced to migrate.
- The Tailwind preset (`@risqbase-inc/ui-components/tailwind.preset`) is unchanged in shape; new role tokens layer in.

### Known gaps closing in later sprints

- `dist/tokens.css` ships `[data-theme="dark"]` and `[data-theme="hc"]` as stub blocks today — switching modes will render light values until G4 fills the overrides in S4 (per `implementation-plan.md` §6 R3). No consumer code change is required when those values land.
- `.github/workflows/publish.yml` is gated by `if: false` pending the `apps/docs` path and monorepo-tool decision; the npm-publish-on-`v*.*.*`-tag flow is wired but not yet active. Owner: G1 (G1).

### Documentation

This release lands alongside documentation that has shipped to `main` separately:

- v4.2 spec, plan, audit, and v4.2 README — PR #2.
- v4.2 implementation plan — PR #4.
- DevOps stubs (workflow scaffolding, Vercel placeholder, CODEOWNERS) — PR #3.
- Per-component `tokens.md` content — PR #9 (Frontend).

In this PR (`s1/cleanup-3-doc-consistency`):

- `notes/gov-id-format.md` flipped from `PENDING VERIFICATION` to **VERIFIED**; canonical format is `GOV-DS-<YEAR>-<SEQ>[-<DOC-TYPE>-<VERSION>]` with `<VERSION>` rendered dotted (e.g. `4.2`, not `420`).
- `plan.md` and `audit.md` Document IDs corrected to `GOV-DS-2026-02-PLAN-4.2` and `GOV-DS-2026-02-AUDIT-4.2`.
- `notes/audit-row-counts.md` and `notes/glossary-scope.md` carried forward from PR #11.
- `implementation-plan.md` row-count reconciliation carried forward from PR #11 (§1 executive summary, §4 heading, §7 DoD).
- `README.md` (repo root) refreshed: install, sub-path imports, theme API, build commands, available components, design-system reference.

### Tracking

- v4.2 supersedes v4.1.1 at the document level.
- v4.2.1 patch backlog is enumerated in `docs/design-system/v4.2/implementation-plan.md` §8 (motion tokens, sonification reconciliation, U1.9 chart-library decision, glossary term list, Figma metadata extension key, plus the historical `-420` strings preserved in PR #2's commit message footer — repo working tree is clean).

## 1.2.0 — 2026-02-03

- Initial Header, Footer, Button, Badge, SectionEyebrow components.
- Tailwind preset with brand colours (indigo-600 primary).
- Documented in `CLAUDE.md`.

## 1.1.1 — earlier 2026

- Footer legal-links route correction (always `risqbase.com`).

## 1.0.0 and earlier

See git tags `v1.0.0` through `v1.1.0` for prior history.
