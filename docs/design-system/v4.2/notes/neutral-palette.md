# Neutral palette — stone, not gray

**G4 decision · 2026-05-10 · Keep stone**

S1 cleanup migrated `Header`, `Footer`, `Badge` from Tailwind `gray-*`
to `stone-*`. This is spec-canonical, not an inference.

## Spec lineage

- §1 (Colour): "**Neutrals:** Warm stone palette (stone-50–stone-900).
  **Prohibited:** `gray-*`, `stone-400` for text."
- §15.6 token enumerations resolve through `stone-*` (gauge track
  stone-200, citation surface stone-50, chart axis stone-200).
- §7.10–7.13 component snippets reference `text-stone-{500,900}`,
  `border-stone-200` directly.

No spec passage uses `gray-*`.

## Pixel impact (stone is warmer than gray at every step)

| Was (gray) | Now (stone) | Surface |
|---|---|---|
| `#F3F4F6` (100) | `#F5F5F4` (100) | Header border, badge subtle |
| `#6B7280` (500) | `#78716C` (500) | Subtle text, footer link |
| `#111827` (900) | `#1C1917` (900) | Footer background |

RALIA, RisqBase, Cortex consumers should re-baseline Chromatic on the
next pass — G5 (G5) on watch for S5 baseline. No consumer code
changes: components consume role tokens via CSS variables.
