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
- When `onOpen` is omitted, the chip renders as `<span role="note">` with the same `aria-label` — read by screen readers without becoming a tab stop.
- The visual glyph is `aria-hidden="true"`.
- The multi-source count pill is `aria-hidden="true"` because the count is already part of the accessible name.
- `retracted` content is styled with `line-through` — but the meaning is also surfaced via the accessible name ("Retracted source: …"), satisfying WCAG 1.4.1 (Use of Color).
- Pass a custom `aria-label` to override the computed name when the label alone is ambiguous, or when the label is a non-string ReactNode (e.g. JSX containing icons).

### Non-string labels

When `label` is a non-string ReactNode, only the variant description goes into the accessible name; the label content is omitted from the announcement. Always pass an explicit `aria-label` in this case so the chip remains self-describing.

### Duplicate-string edge case

For variants whose semantics imply unavailability (`retracted`, `retrieval-failed`), pass the original citation label (e.g. "Art. 35(3)(c)") when possible. The variant description is added automatically by the chip; passing redundant text in `label` (e.g. `<CitationChip variant="retrieval-failed" label="Source unavailable" />`) causes harmless double-announcement ("Retrieval failed: Source unavailable"). Tolerated but not preferred.

## Don't

- Don't strip `onOpen` to make the chip "not clickable" — pass `onOpen={undefined}` (omit the prop entirely) so the rendered element matches the intent (and the target-size + padding match).
- Don't re-introduce an `sr-only` suffix span repeating the variant description; it would double-announce now that the description is in the `aria-label`.
