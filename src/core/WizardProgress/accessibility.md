# WizardProgress — accessibility

## Contracts
- Renders as an `<ol>` for the `dots` / `numbered` / `vertical` styles, with `aria-current="step"` on the active item — the canonical pattern from WAI-ARIA APG.
- Renders as `role="progressbar"` for the `percentage` style with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- The numeric / check glyph is `aria-hidden="true"` — the step label carries the meaning.
- Auto-style picker: dots ≤ 4 · numbered 5–8 · vertical > 8. Override via the `style` prop if a designer asks for a specific treatment.

## Don't
- Don't switch styles dynamically within a single wizard session — that's confusing. Pick at mount and stay.
