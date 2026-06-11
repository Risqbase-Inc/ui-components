---
name: CitationChip
domain: ai
layer: 2
state: stable
consumable: true
---

# CitationChip

Nine variants resolve through the `citation.*` token chain (v4.3 §4.2). The variant changes the surface tint, the border treatment, and the glyph — but the *footprint* is constant so chips line-wrap predictably in flowing prose. v4.3 §5.2, closes RALIA F-012 / F-025. v2.1.0 (Spec 05 Actions B + C): - Action B: aria-label combines variant description + visible label so SR users hear "Verified source: Art. 35(3)(c)" not just "Verified source". The sr-only suffix span was removed because its content is now in the aria-label (avoids double-announcement). - Action C (WCAG 2.5.8 Target Size — Minimum): the interactive chip bumps to py-1 (~26px tall) to clear the 24×24 minimum. Static (non-clickable) chips keep py-0.5 (~22px) for in-line typographic rhythm — they are not interactive controls and 2.5.8 does not apply. Gated on `typeof onOpen === 'function'`.

```ts
import { CitationChip } from '@risqbase-inc/ui-components/ai'
```

## API

- `type CitationVariant = | 'verified' | 'pending' | 'low-confidence' | 'retracted' | 'external' | 'multi-source' | 'ai-inferred' | 'retrieval-failed' | 'user-pinned'`
### `CitationChipProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `variant` | `CitationVariant` | yes |  |
| `label` | `ReactNode` | yes | Visible label, e.g. "EU AI Act Art. 6" or "[3]". When passed as a string the value is also folded into the chip's accessible name ("Verified source: EU AI Act Art. 6"). When passed as a non-string ReactNode (e.g. JSX), the consumer should also pass an explicit `aria-label` so the chip remains self-describing to SR users. |
| `sourceCount` | `number` | no | For variant='multi-source': how many sources back the citation. Renders as a small count pill and is appended to the accessible name ("Multiple sources: Art. 30, 3 sources"). |
| `onOpen` | `() => void` | no | Optional click handler — opens the source / preview. Presence of this prop is what makes the chip interactive; interactive chips render as a `<button>` and use the larger `py-1` padding (WCAG 2.5.8). |
| `aria-label` | `string` | no | Optional accessible description override. When unset, the chip computes its own from `variantDescription[variant] + ': ' + label` (v2.1.0 Spec 05 Action B). |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `CitationChip`

Resolves through the `citation-chip.*` component-tier tokens, which wrap the semantic `citation.*` chain.

| Token | Used for |
|---|---|
| `color.citation-chip.surface` | default surface |
| `color.citation-chip.surface-low-conf` | `low-confidence`, `retrieval-failed` surface |
| `color.citation-chip.border` | default border |
| `color.citation-chip.border-retracted` | `retracted` border |
| `color.citation-chip.text` | default text |
| `color.citation-chip.text-retracted` | `retracted`, `retrieval-failed` text |
| `color.citation-chip.icon` | glyph |
| `color.citation-chip.hover` | hover state overlay (only when `onOpen`) |
| `color.citation-chip.active` | pressed state overlay |
| `color.iris.accent-subtle` | `ai-inferred` surface, halo |
| `color.iris.accent` | `ai-inferred` / `user-pinned` border |
| `dimension.radius.sm` | chip radius (4px — compact for line-flow) |

## Accessibility contract

# CitationChip — accessibility

A chip that surfaces the provenance / confidence of an AI-generated claim. Without it, the user can't tell verified content from inference.

## Contracts

### Accessible name (v2.1.0 Spec 05 Action B)

The chip's accessible name combines the variant description with the visible label content. SR users hear the trust framing first ("Verified source", "AI-inferred connection", "Pinned by user") then the citation content. This is the inverse of sighted reading order — visual prominence carries the framing implicitly via colour + border; SR must carry it lexically.

| Variant + label | SR announcement |
|---|---|
| `verified` · "Art. 35(3)(c)" | "Verified source: Art. 35(3)(c)" |
| `pending` · "EDPB 04/2026" | "Verification pending: EDPB 04/2026" |
| `ai-inferred` · "implied by ROPA 12" | "AI-inferred (no citation): implied by ROPA 12" |
| `multi-source` · "Art. 30" with `sourceCount=3` | "Multiple sources: Art. 30, 3 sources" |
| `retracted` · "Art. 35(3)(c)" | "Retracted source: Art. 35(3)(c)" |
| `user-pinned` · "Internal memo 2026-Q1" | "Pinned by user: Internal memo 2026-Q1" |

### Target size (v2.1.0 Spec 05 Action C — WCAG 2.5.8)

Interactive chips (those with `onOpen` provided) render with `py-1` for a rendered height of ~26px, clearing the 24×24 minimum target-size requirement. Static chips (no `onOpen`) keep `py-0.5` (~22px) — they are not interactive controls and WCAG 2.5.8 does not apply.

### Element + role

- When `onOpen` is passed, the chip renders as a `<button type="button">` with the computed accessible name as `aria-label`.
- When `onOpen` is omitted, the chip renders as a bare `<span>` with the same `aria-label` — read by screen readers without becoming a tab stop. (v2.1.1 G4 FU-10 / CC-1: the `role="note"` previously applied to the non-interactive variant was removed; `note` is an ARIA 1.2 landmark and a long prose passage with 20+ inline chips would pollute landmark-jump navigation in NVDA / JAWS. The chip remains announced by AT via the `aria-label`.)
- The visual glyph is `aria-hidden="true"`.
- The multi-source count pill is `aria-hidden="true"` because the count is already part of the accessible name.
- `retracted` content is styled with `line-through` — but the meaning is also surfaced via the accessible name ("Retracted source: …"), satisfying WCAG 1.4.1 (Use of Color).
- Pass a custom `aria-label` to override the computed name when the label alone is ambiguous, or when the label is a non-string ReactNode (e.g. JSX containing icons).

### Non-string labels

When `label` is a non-string ReactNode, only the variant description goes into the accessible name; the label content is omitted from the announcement. Always pass an explicit `aria-label` in this case so the chip remains self-describing.

### Duplicate-string edge case

For variants whose semantics imply unavailability (`retracted`, `retrieval-failed`), pass the original citation label (e.g. "Art. 35(3)(c)") when possible. The variant description is added automatically by the chip; passing redundant text in `label` (e.g. `<CitationChip variant="retrieval-failed" label="Source unavailable" />`) causes harmless double-announcement ("Retrieval failed: Source unavailable"). Tolerated but not preferred.

### G4 FU-14 (CC-2) — `ai-inferred` dashed-border legibility note (v2.1.1 sweep, 2026-05-20)

The `ai-inferred` variant uses a 1px dashed border. On high-DPI displays (retina,
Surface, modern Android phones) Chromium and Safari sub-pixel-anti-alias 1px
dashed strokes which can blur the dash gaps and read as solid at default zoom.
Verified manually at 100% browser zoom on:

- macOS Safari 18 retina — dashes visible
- macOS Chrome 134 retina — dashes visible
- iOS Safari 18 (iPhone 15, 3× DPR) — dashes visible
- Windows 11 Chrome non-retina @ 1.0× DPR — dashes visible

If a future browser refresh blurs the pattern, swap to `border-dotted` (slightly
chunkier) or `border-2 border-dashed` (defeats the in-line typographic rhythm —
last resort).

## Don't

- Don't strip `onOpen` to make the chip "not clickable" — pass `onOpen={undefined}` (omit the prop entirely) so the rendered element matches the intent (and the target-size + padding match).
- Don't re-introduce an `sr-only` suffix span repeating the variant description; it would double-announce now that the description is in the `aria-label`.
