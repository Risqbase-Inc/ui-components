# 06 · ArcDecoration

> **Closes**: M-01 (revised, Demo B §1) — the Concentric-Arc pattern as a marketing decoration primitive.
> **Composes with**: any hero composition (marketing + RALIA chrome + Practice + future product surfaces). Used by Demo B §1 marketing hero; Demo I §5 video close-frame; Demo D §3 (centre-node ring echo, decorative).
> **Visual reference**: `Marketing Demo B - Signature Surfaces.html` §1 + `audit-deliverable/redesigns/concentric-arc-pattern-redesign.html`.
> **Home**: `src/primitives/ArcDecoration/` — **new namespace** (rationale in cover §2.1).
> **Accessibility**: trivial; inline below.

---

## §1 What it is

A pure-decoration SVG primitive that renders 2–4 concentric arc fragments sharing an off-canvas centre. Stroke-stepped from 1px (outermost) to 4px (innermost), opacity-stepped 100% → 70% → 55% → 50% on a teal ramp, with a terminator on `--color-palette-stone-300`. Static — no rotation. Marketing-only motif; in-product motion is reserved for IrisThinking.

This is the visual signature that ties the marketing site to the RALIA product. It appears at decoration-density (once per hero, not three times per page) and is the most distinctive single visual the brand owns at this point.

---

## §2 TypeScript API

```ts
// src/primitives/ArcDecoration/types.ts

export type ArcPosition =
  | 'bottom-right'   // centre at (100% + 0px, 100% + 0px) from the parent box
  | 'top-right'      // centre at (100%, 0)
  | 'top-left'       // centre at (0, 0)
  | 'bottom-left'    // centre at (0, 100%)

export type ArcPalette = 'teal' | 'teal-on-dark' | 'stone'

export interface ArcDecorationProps {
  /** Off-canvas anchor of the implicit centre — defaults 'bottom-right' (Demo B canonical) */
  position?: ArcPosition
  /** Number of ring fragments — defaults 4 (per v4.3 §20 + BRIEF-429 V2 M-08) */
  rings?: 2 | 3 | 4
  /** Palette — 'teal' on light substrates, 'teal-on-dark' for inverse substrates (e.g. close-frame video), 'stone' for muted decorative use */
  palette?: ArcPalette
  /** SVG canvas size in px; defaults 480 */
  size?: number
  /** Override opacity ramp for the outermost ring; the rest of the ramp scales proportionally. Default 1.0 */
  baseOpacity?: number
  /** Optional rotation seed (in degrees) for the outermost ring; subsequent rings rotate by -15° each */
  rotationSeed?: number
  /** When true, render in motion (slow 60s ease rotation) — reserved for IrisThinking, not used in v2.1.0 marketing */
  animated?: boolean
  className?: string
}
```

All props optional. The Demo B canonical usage is `<ArcDecoration />` with no props.

---

## §3 Visual contract

### 3.1 Geometry

Per `redesigns/concentric-arc-pattern-redesign.html` §1 + Demo B §1:

| Ring | Radius (at size=480) | Stroke | Opacity | Token (teal palette) |
|---|---|---|---|---|
| 4 (outermost) | 440 | 1px | 1.0 | `--color-palette-teal-600` |
| 3 | 360 | 2px | 0.70 | `--color-palette-teal-500` |
| 2 | 280 | 3px | 0.55 | `--color-palette-teal-300` |
| 1 (innermost, terminator) | 200 | 4px | 0.50 | `--color-palette-stone-300` |

When `rings=3`, drop ring 3 (the inner-outer one). When `rings=2`, drop rings 2 and 3.

Each ring renders as a `<circle>` with `stroke-dasharray` chosen so only a 60° arc shows — the rest of the circle is invisible. The dasharray values lift verbatim from Demo B's hand-tuned values (260/2540, 220/2040, 170/1590, the innermost full-circle for the terminator).

### 3.2 Position math

For `position='bottom-right'` (default):

```
SVG container: width = height = size (e.g. 480px)
SVG positioned: position: absolute; right: -size/6; bottom: -size/6;
inner <g transform="translate(size, size)"> — centre is at (size, size) which sits off-canvas to the bottom-right
```

The off-canvas anchor lets the arcs feel "ambient" rather than "drawn"; only the corner closest to the visual centre intersects the parent box.

For `position='top-left'`, `top-right`, `bottom-left`: flip the translate accordingly and adjust the dasharray rotation so the visible arc lands inside the parent box.

### 3.3 Palette table

| Token | `teal` | `teal-on-dark` | `stone` |
|---|---|---|---|
| Ring 4 | `--color-palette-teal-600` | `--color-palette-teal-300` | `--color-palette-stone-400` |
| Ring 3 | `--color-palette-teal-500` | `--color-palette-teal-200` | `--color-palette-stone-300` |
| Ring 2 | `--color-palette-teal-300` | `--color-palette-teal-100` | `--color-palette-stone-200` |
| Ring 1 (terminator) | `--color-palette-stone-300` | `rgba(255,255,255,0.4)` | `--color-palette-stone-400` |

`teal-on-dark` is the BRIEF-429 V2 close-frame variant (light teal on the teal-700/900 close-frame gradient).

---

## §4 Token chain

```
ring stroke              → var(--color-palette-{teal,stone}-{varies})
terminator stroke (default) → var(--color-palette-stone-300)
animated motion timing   → 60s linear infinite  (only when animated=true)
```

**Zero new tokens.**

---

## §5 States

| State | Notes |
|---|---|
| Default (static) | as drawn above |
| Animated | reserved; not used in v2.1.0 marketing. When `animated=true`, the outermost ring rotates 360° per 60s linear infinite; subsequent rings -120°/-180°/-240° to introduce visual depth. **Gate on `prefers-reduced-motion: no-preference`** — when motion is off, render static. |

---

## §6 Storybook stories

```
primitives/ArcDecoration
├── Default                       — bottom-right, 4 rings, teal palette
├── Three Rings                   — rings=3
├── Two Rings                     — rings=2
├── TopRight                      — position='top-right'
├── TopLeft                       — position='top-left'
├── BottomLeft                    — position='bottom-left'
├── OnDarkSubstrate               — palette='teal-on-dark' against --color-palette-teal-700 bg
├── StoneOnly                     — palette='stone'
├── Animated                      — animated=true; respects reduced-motion
├── SmallSize                     — size=240 — for compact embeds
├── LargeSize                     — size=720 — for full-bleed hero
└── InsideHero                    — composed with the actual Demo B hero card to verify visual integration
```

---

## §7 Accessibility (inline)

The component is decorative. No semantics.

```tsx
<svg
  aria-hidden="true"
  role="presentation"
  focusable="false"
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
>
  {/* ...rings... */}
</svg>
```

That's the complete contract.

Motion: animated variant respects `prefers-reduced-motion: reduce`. CSS-only animation; no JS timer.

---

## §8 Acceptance criteria

1. **Pixel match** — Default story renders within 4px of Demo B §1's hero arc artwork.
2. **Token compliance** — clean.
3. **Storybook** — 12 stories.
4. **Composition** — `InsideHero` story confirms `<ArcDecoration />` drops into the Demo B hero with no extra positioning work.
5. **Reduced-motion** — Animated story respects the system flag.

---

## §9 Open questions

- **Q1** — Should the off-canvas centre be exposed as an explicit `centerX` / `centerY` prop for advanced placement (Demo D's centre-node ring echo, e.g., needs the centre at SVG centre, not off-canvas)? **Recommend**: ship `position` enum only in v2.1.0; if Demo D's echo wants this, ImpactGraph renders its own inline ring rather than reusing ArcDecoration.
- **Q2** — Class-based vs prop-based palette swap. Could expose just `className` and let consumers override token references via CSS. Cleaner-feeling but less discoverable. **Recommend**: keep the `palette` enum — discoverable in IntelliSense, type-safe, three values is the entire reasonable surface area.
- **Q3** — The terminator (innermost) stroke is named after its purpose, not its position. Should it always be `--color-palette-stone-300` (the v4.3 canonical) or palette-dependent (e.g. white on dark)? **Decision**: palette-dependent; see §3.3.
