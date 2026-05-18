# CitationChip — accessibility

A chip that surfaces the provenance / confidence of an AI-generated claim. Without it, the user can't tell verified content from inference.

## Contracts
- When `onOpen` is passed, the chip renders as a `<button>` with a 24×24 hit target satisfied by padding (text is ~18px tall plus py-0.5 + border).
- When `onOpen` is omitted, the chip renders as `<span role="note">` — read by screen readers without becoming a tab stop.
- The visual glyph is `aria-hidden="true"`. The variant meaning is appended as visually-hidden text (`<span className="sr-only">— Verified source</span>`), so a screen-reader hears "EU AI Act Art. 6 — Verified source".
- `retracted` content is styled with `line-through` — but the meaning is also surfaced via the sr-only suffix, satisfying WCAG 1.4.1 (Use of Color).
- Pass a custom `aria-label` to override the default variant description when the label alone is ambiguous (e.g. label = "[3]", aria-label = "Citation 3 — pending verification").

## Don't
- Don't strip `onOpen` to make the chip "not clickable" — pass `onOpen={undefined}` (omit the prop entirely) so the rendered element matches the intent.
