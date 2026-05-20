# PromptChip — accessibility

A button styled as a pill, used to seed Iris with a suggested starting prompt.

## Contracts
- Native `<button>` — keyboard, focus ring, accessible name from children.
- Hit target: padding (px-3 + py-1.5) + 14px text yields a ≥ 28px target — comfortably above the 24×24 floor.
- The icon is `aria-hidden="true"`; the chip's accessible name is its children.
- Focus ring uses `iris.accent-subtle` (closes RALIA F-049 — focus indicator on Iris surfaces).

## Iris contrast contract (DS v4.3 §4.2)

`PromptChip` renders dark text (`text.default`) on a white surface — well clear of any contrast threshold. The Iris-accent halo on hover/focus is the only iris-tinted surface in play, and is non-text (3:1 floor applies).

If a consumer customises the chip to use `iris.accent` as a *filled* background (instead of the default white + halo treatment), the label text must follow the §4.2 contract — `iris.accent-on` at AA Large only, otherwise `iris.accent-on-dark`. Scanner rule R11 enforces this in consumer scanners.
