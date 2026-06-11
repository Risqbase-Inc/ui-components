---
name: ArcDecoration
domain: primitives
layer: 1
state: stable
consumable: true
---

# ArcDecoration

Pure-decoration SVG primitive. 2–4 concentric arc fragments sharing an off-canvas centre. Visual signature that ties the marketing site to the RALIA product (Spec 06 §1). A11y: aria-hidden + role="presentation"; no semantics, no tab stop. Motion: animated=true rotates the outermost ring 60s linear infinite. Gated on `prefers-reduced-motion: no-preference` via CSS — when reduced, the animation is suppressed and the static frame remains. This component is server-renderable (no useState, no useEffect). Centre-translate per position. The SVG canvas is `size × size`; we translate the ring-group to put the implicit centre off-canvas in the chosen corner. Marketing default is 'bottom-right' (Demo B).

```ts
import { ArcDecoration } from '@risqbase-inc/ui-components/primitives'
```

## API

- `type ArcPosition = | 'bottom-right' // centre at (100% + 0px, 100% + 0px) from the parent box | 'top-right' // centre at (100%, 0) | 'top-left' // centre at (0, 0) | 'bottom-left'`
- `type ArcPalette = 'teal' | 'teal-on-dark' | 'stone'`
### `ArcDecorationProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `position` | `ArcPosition` | no | Off-canvas anchor of the implicit centre — defaults 'bottom-right' (Demo B canonical). |
| `rings` | `2 \| 3 \| 4` | no | Number of ring fragments — defaults 4 (per v4.3 §20 + BRIEF-429 V2 M-08). When 4, the terminator accent dot also renders. |
| `palette` | `ArcPalette` | no | Palette — 'teal' on light substrates, 'teal-on-dark' for inverse substrates, 'stone' for muted decorative use. |
| `size` | `number` | no | SVG canvas size in px; defaults 480. |
| `baseOpacity` | `number` | no | Override opacity for the outermost ring; the rest of the ramp scales proportionally. Default 1.0. |
| `rotationSeed` | `number` | no | Optional rotation seed (degrees) for the outermost ring; subsequent rings shift by Demo B's progression (-15°, -13°, -12°). |
| `animated` | `boolean` | no | When true, render in motion (slow 60s ease rotation) — reserved for IrisThinking, not used in v2.1.0 marketing. |
| `hideTerminatorDot` | `boolean` | no | When true, suppress the terminator accent dot even at rings=4. Default false. |
| `className` | `string` | no |  |

