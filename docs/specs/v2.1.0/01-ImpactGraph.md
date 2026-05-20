# 01 · ImpactGraph + MarketingImpactGraph

> **Closes**: M-03 (HIGH) from Marketing Audit 2026-05-15 — /platform/horizon-iris shows the Impact Graph.
> **Composes with**: RALIA audit §11 HorizonIris Impact; v4.3 Badge band variants; CitationChip clause-edges; ArcDecoration centre echo.
> **Visual reference**: `Marketing Demo D - HorizonIris Impact Graph.html` §2 (full SVG composition) and `audit-deliverable/redesigns/horizoniris-impact-redesign.html`.
> **Home**: `src/data-viz/ImpactGraph/`
> **Variants shipped**: `ImpactGraph` (configurable primitive) + `MarketingImpactGraph` (constrained wrapper).
> **Accessibility**: see [01-ImpactGraph.accessibility.md](./01-ImpactGraph.accessibility.md) — non-obvious SVG patterns.

---

## §1 What it is

A radial graph composition where a **central alert node** is surrounded by **affected-entity nodes** arranged around it, with **labelled edges** (regulatory clauses) connecting centre to each entity. Categories of entity (DPIA, ROPA, Vendor, Training, …) cluster into angular sectors. Edge thickness encodes per-entity severity. Optional dashed cascade edges connect entities laterally where one downstream artefact triggers another.

This is the **signature differentiator visual** for RALIA — the single image that demonstrates "regulatory intelligence" without using the words. It is the screenshot that ends up in the EU AI Act announcement deck (per Demo D §3).

The v2.1.0 release ships **two layers**:

1. **`ImpactGraph`** — fully configurable primitive in `src/data-viz/`. Takes a fixture-shaped data object; lays out categories into angular sectors; computes node positions; routes labelled edges; handles collision avoidance for entity labels and clause labels. Engineered for HorizonIris's real-data path (post-1-July via the RALIA team).
2. **`MarketingImpactGraph`** — thin wrapper. Loads a curated fixture (default: the EDPB Guidelines 04/2026 narrative from Demo D), pins a fixed viewBox, locks the categories to the marketing canon (DPIA / ROPA / Vendor / Training), and renders without interactivity. This is what the marketing repo consumes; it can't drift from the demo because the fixture is the canon.

---

## §2 ImpactGraph — primitive API

### 2.1 TypeScript

```ts
// src/data-viz/ImpactGraph/types.ts

import type { CitationVariant } from '../../ai/CitationChip'

export type ImpactSeverity = 'very-high' | 'high' | 'medium' | 'low'
export type ImpactCategory = string  // free-form; consumer supplies palette mapping

export interface ImpactAlert {
  /** Mono-eyebrow line above the title; e.g. "EDPB · 2026-05-12" */
  source: string
  /** Two-line node title; e.g. ["Guidelines", "04/2026"] */
  title: [string, string]
  /** Severity ring colour around the centre node */
  severity: ImpactSeverity
  /** Optional plain-language summary surfaced in the SR a11y label */
  description?: string
}

export interface ImpactEntity {
  id: string
  category: ImpactCategory
  /** Two-letter glyph rendered in node body; e.g. "DPIA", "ROPA", "VEND", "CCL" */
  glyph: string
  /** Display name beneath node */
  name: string
  /** Per-entity severity, drives edge colour + node size */
  severity: ImpactSeverity
  /** Optional numeric annotation; e.g. "88 ↑34" rendered below name in mono */
  annotation?: string
  /** Clause label rendered on the edge — uses CitationChip vocabulary */
  clauseLabel: string
  /** Optional citation variant for the clause edge (default: 'verified') */
  clauseVariant?: CitationVariant
}

export interface ImpactCascade {
  /** Source entity id */
  from: string
  /** Target entity id */
  to: string
  /** Optional label rendered on the cascade arc */
  label?: string
}

export interface CategoryPalette {
  /** Category key (matches ImpactEntity.category) */
  key: ImpactCategory
  /** Token reference, e.g. "var(--color-chart-cat-1)" */
  color: string
  /** Angular sector centre, degrees clockwise from 12-o'clock */
  sectorCentre: number
  /** Sector half-width in degrees; nodes scatter within this wedge */
  sectorWidth: number
  /** Human label for the legend */
  label: string
}

export interface ImpactGraphProps {
  alert: ImpactAlert
  entities: ImpactEntity[]
  cascades?: ImpactCascade[]
  categories: CategoryPalette[]
  /** "Iris analysed N entities" attribution badge; omit to suppress */
  irisAttribution?: { count: number; verb?: string }
  /** width/height of the rendered SVG viewBox; defaults to 1100 × 460 (Demo D) */
  width?: number
  height?: number
  /** When true, suppress the chrome ring + legend (use inside a containing card) */
  bare?: boolean
  /** Click handler — fires with the entity that was clicked. Omit for static export. */
  onEntityClick?: (entity: ImpactEntity) => void
  /** Click handler for the centre alert node */
  onAlertClick?: () => void
  className?: string
  /** Override the structured SR summary; useful for marketing-frozen renders */
  ariaLabel?: string
}
```

### 2.2 Layout algorithm

Engineering owns the layout. The contract:

- The **alert node** sits at the centre. It carries a ring whose stroke colour is `--color-band-{severity}-bg`. Default radius **68px** at 1100×460; scales proportionally with `width`.
- Each **category** owns an angular sector defined by `sectorCentre ± sectorWidth/2`. Entities of that category lay out along an arc inside the sector. Default radial distance: 1.6× the alert radius from centre.
- **Entity node size** maps from severity:

  | severity | radius |
  |---|---|
  | very-high | 24px |
  | high | 18px |
  | medium | 14px |
  | low | 11px |

  Each node also gets a soft halo at `opacity: 0.15` of the category colour, radius 1.6× node radius.

- **Edge colour** is `--color-band-{severity}-bg`. **Edge thickness** in px = `{very-high: 2.5, high: 2, medium: 1.5, low: 1.5}`. **Edge curve**: quadratic bezier whose control point sits along the radial line at half-distance, perturbed perpendicular by ±8px so adjacent edges in the same sector don't overlay.
- **Clause label** renders mid-edge in `--font-mono`, 9px, `--color-text-subtle`. Collision avoidance: if two labels in the same sector overlap, shorter label wins the midpoint; longer label shifts 12px along the edge toward the entity end.
- **Cascade edges** render as dashed lines, `stroke-dasharray: 4 4`, `opacity: 0.4`, colour `--color-text-subtle`. They route entity-to-entity, not through the centre.
- **Iris attribution badge** (top-left corner): pill, height 28px, width auto, `--color-iris-surface` fill, `--color-iris-accent-subtle` 1px border, lettermark disc on left at `--color-iris-accent`, label text in `--color-iris-accent-hover` at 10px medium.

### 2.3 States

| State | Visual | Notes |
|---|---|---|
| **Default** (static) | as above | Marketing-frozen via `MarketingImpactGraph`; consumers without click handlers get this |
| **Hover** (entity) | node halo opacity → 0.25; edge stroke-width +1px; clause label background lights up `--color-surface-default` with 1px `--color-border-default` ring | only when `onEntityClick` is provided |
| **Hover** (centre alert) | ring stroke-width 2 → 3; subtle pulse animation 1.4s ease-in-out infinite | only when `onAlertClick` is provided |
| **Focused** (keyboard) | 2px `--color-action-primary` outline ring at node-radius + 4px; visible focus ring per WCAG 2.4.7 | always when focusable |
| **Loading** | render alert node skeleton + 8 placeholder entity discs at category sector centres with `--color-skeleton-shimmer` | future state — not in v2.1.0 if data binding isn't wired |
| **Empty** | "No affected entities" centred text in `--color-text-subtle`; alert node still renders | edge case worth handling explicitly |
| **Error** | render alert node with `--color-band-very-high-bg` ring + the inline message "Could not load impact analysis" | when data fetch fails |

### 2.4 Token chain (verbatim — engineering must use these references)

```
// Category palette default mapping (consumers override via `categories` prop)
DPIA      → var(--color-chart-cat-1)   // indigo-600
ROPA      → var(--color-chart-cat-4)   // emerald-500
Vendor    → var(--color-chart-cat-3)   // amber-500
Training  → var(--color-chart-cat-6)   // rose-500

// Edge / ring severity
very-high → var(--color-band-very-high-bg)
high      → var(--color-band-high-bg)
medium    → var(--color-band-medium-bg)
low       → var(--color-band-low-bg)
cascade   → var(--color-text-subtle)   // dashed

// Centre alert
surface     → var(--color-surface-inverse)
text        → var(--color-text-on-inverse)
text-meta   → var(--color-text-on-inverse-subtle)
ring        → var(--color-band-{severity}-bg)

// Iris attribution
bg          → var(--color-iris-surface)
border      → var(--color-iris-accent-subtle)
disc        → var(--color-iris-accent)
text        → var(--color-iris-accent-hover)

// Edge labels
font        → var(--font-mono) 9px / letter-spacing 0.04em
colour      → var(--color-text-subtle)
```

**Zero new tokens.** Every value resolves through the v4.3 shipped palette.

### 2.5 Storybook stories

```
data-viz/ImpactGraph
├── Default                            — Demo D fixture (EDPB Guidelines 04/2026)
├── EmptyCategories                    — all categories present, zero entities
├── SingleCategory                     — only DPIA entities; layout collapses to one sector
├── ManyEntities                       — 30 entities across 4 categories; stress label collision
├── WithCascades                       — Demo D fixture + 3 dashed cascade edges
├── WithoutIrisAttribution             — Demo D fixture, irisAttribution prop omitted
├── ConfigurableCategories             — RALIA-app preview: 5 categories incl. "Policies"
├── Severity_VeryHigh                  — centre alert + 4 very-high edges; visual stress test
├── Severity_Low                       — centre alert + 8 low edges; thin-stroke legibility
├── Interactive                        — onEntityClick + onAlertClick wired; tests focus ring
├── ErrorState                         — fetch error fallback
└── EmptyState                         — alert with zero entities
```

---

## §3 MarketingImpactGraph — wrapper API

### 3.1 TypeScript

```ts
// src/data-viz/ImpactGraph/MarketingImpactGraph.tsx

import { ImpactGraph } from './ImpactGraph'

export interface MarketingImpactGraphProps {
  /** Fixture key. v2.1.0 ships one: 'edpb-04-2026'. Add additional fixtures
   *  here as marketing produces new alert narratives. */
  fixture?: 'edpb-04-2026'
  /** Show the screenshot-chrome wrapper (URL bar + title) per Demo D */
  withChrome?: boolean
  /** Show the legend strip below the graph */
  withLegend?: boolean
  className?: string
}
```

### 3.2 Behaviour

- Loads the named fixture from `src/data-viz/ImpactGraph/fixtures/`.
- Renders inside the screenshot-chrome wrapper (browser dots + URL bar) when `withChrome` is `true` (default true). The chrome matches Demo D pixel-for-pixel: `--color-surface-muted` chrome bar, `--color-surface-default` URL pill, 10px mono URL text in `--color-text-subtle`.
- Passes no click handlers to the inner `ImpactGraph` — the marketing render is static.
- Locks `width=1100 height=460` to match Demo D.
- Sets `ariaLabel` explicitly to the structured summary: `"Impact graph showing {alert.title}: {N} affected entities — {category counts}."`.

### 3.3 Composition example (post-migration marketing repo)

```tsx
// /platform/horizon-iris/page.tsx — after wholesale migration

import { MarketingImpactGraph } from '@risqbase-inc/ui-components'

export default function HorizonIrisPage() {
  return (
    <>
      <HorizonIrisHero />
      <div className="px-8 max-w-[1280px] mx-auto">
        <MarketingImpactGraph fixture="edpb-04-2026" withChrome withLegend />
      </div>
      <HorizonIrisCapabilities variant="secondary" />
    </>
  )
}
```

### 3.4 Storybook stories

```
data-viz/MarketingImpactGraph
├── Default                  — Demo D fixture, with chrome, with legend
├── WithoutChrome            — bare graph, no browser frame
├── WithoutLegend            — chrome on, legend off — for tighter embeds
└── BareEmbed                — withChrome=false, withLegend=false — for use inside another card
```

---

## §4 Fixture format

Marketing fixtures live in `src/data-viz/ImpactGraph/fixtures/<key>.ts` and export a typed `ImpactGraphProps`-shaped object minus `categories` (the wrapper supplies the canon palette). One ships in v2.1.0:

```ts
// src/data-viz/ImpactGraph/fixtures/edpb-04-2026.ts
export const edpb_04_2026: Omit<ImpactGraphProps, 'categories'> = {
  alert: {
    source: 'EDPB · 2026-05-12',
    title: ['Guidelines', '04/2026'],
    severity: 'very-high',
    description:
      'EDPB Guidelines 04/2026 narrowed Article 35(3)(c) for public-area monitoring. ' +
      'Any DPIA whose scope includes CCTV, biometric access, or footfall analytics needs re-evaluation.',
  },
  entities: [
    /* 14 entities — 5 DPIA, 2 ROPA, 4 Vendor, 2 Training — lifted verbatim from Demo D §2 */
  ],
  cascades: [
    { from: 'vend-secucorp', to: 'dpia-footfall-retail', label: undefined }, // dashed cascade
  ],
  irisAttribution: { count: 14 },
}
```

The canonical category palette ships alongside:

```ts
// src/data-viz/ImpactGraph/fixtures/marketing-categories.ts
export const marketingCategories: CategoryPalette[] = [
  { key: 'DPIA',     color: 'var(--color-chart-cat-1)', sectorCentre: 0,   sectorWidth: 120, label: 'DPIA' },
  { key: 'ROPA',     color: 'var(--color-chart-cat-4)', sectorCentre: 90,  sectorWidth: 70,  label: 'ROPA' },
  { key: 'Vendor',   color: 'var(--color-chart-cat-3)', sectorCentre: 180, sectorWidth: 100, label: 'Vendor' },
  { key: 'Training', color: 'var(--color-chart-cat-6)', sectorCentre: 270, sectorWidth: 70,  label: 'Training' },
]
```

---

## §5 Acceptance criteria

A v2.1.0 PR implementing this spec is mergeable when:

1. **Pixel match** — `MarketingImpactGraph` with default props renders within 4px tolerance of Demo D §2's graph composition at 1100×460 (Chromatic baseline).
2. **Token compliance** — token-lint passes with **zero** `--color-` references outside the v4.3 chain. (No raw hex, no Tailwind palette classes.)
3. **A11y compliance** — meets the contract in `01-ImpactGraph.accessibility.md`; axe-core clean; manual SR walkthrough recorded by Sarah G5.
4. **Storybook coverage** — all 12 `ImpactGraph` stories + all 4 `MarketingImpactGraph` stories present. MDX doc-block written.
5. **Configurability proof** — the `ConfigurableCategories` story renders 5 categories without code changes to the component.
6. **No regressions** — Chromatic shows zero changes outside the new `data-viz/ImpactGraph/` directory.

---

## §6 Open questions for Elena G4 review

- **Q1** — Should we ship a `cascade` clause-label slot? Demo D's one cascade edge is unlabelled, but the data model allows it. Engineering preference: include `label?: string` on `ImpactCascade` from the start (no API change later).
- **Q2** — Edge curve perturbation direction (perpendicular ±8px): deterministic from edge index or randomised at layout time? Deterministic is testable; randomised looks more organic. **Recommend**: deterministic with a stable hash on `entity.id` for reproducibility.
- **Q3** — Cascade edge clause-labels and CitationChip rendering: should cascade labels render *as* CitationChips (with verified/external/etc. variants) or just as text? The marketing fixture renders them as plain text. Recommend keeping cascade labels as text and reserving the CitationChip variant slot for the *primary* clause edge only.
