# PromptChip — accessibility

A button styled as a pill, used to seed Iris with a suggested starting prompt.

## Contracts
- Native `<button>` — keyboard, focus ring, accessible name from children.
- Hit target: padding (px-3 + py-1.5) + 14px text yields a ≥ 28px target — comfortably above the 24×24 floor.
- The icon is `aria-hidden="true"`; the chip's accessible name is its children.
- Focus ring uses `iris.accent-subtle` (closes RALIA F-049 — focus indicator on Iris surfaces).
