# ClientGrid — accessibility

A responsive grid of client cards. Spec §7.

## Markup

- The grid is a `<section>` with `aria-labelledby` pointing at the heading (`bare={false}`) or no landmark when `bare={true}`.
- Cards live in a `<ul role="list">`; each card is an `<article>` with `aria-labelledby` + `aria-describedby` pointing at name and meta paragraphs.
- The visible meta paragraph is followed by an `sr-only` span carrying the alert sentence when applicable, so SR users hear the full statement: `"{name}. {subline}. Residual {N}{, up/down N from last week}{, secondary stat}{, N high/medium-severity alert(s)}."`.

## Interactive states

- **Card-only interactive** (`onClientClick`): the `<article>` is wrapped in a `<button>` whose `aria-label` carries the full sentence plus `" Activate to open."`. The inner `aria-labelledby` / `aria-describedby` are dropped to avoid duplicate announcements.
- **Pill-only interactive** (`onAlertClick`): the alert pill is a `<button>` with its own `aria-label` (`"{count} {sev}-severity alert(s) for {name}. Activate to filter."`) and `event.stopPropagation` on click. The card chrome stays presentational.
- **Both supplied (invalid)**: dev-mode console warning; production fallback treats card-click as the only handler. Nested buttons would be a structural a11y violation.

## Avatar

Avatar tile is `aria-hidden="true"` — the glyph is decorative; the name is already in the SR sentence.

## Delta direction

The delta arrow (↑/↓) is `aria-hidden`; the SR sentence carries the word ("up 20 from last week"). Colour reinforces but is not the sole channel.

## Focus order

- Heading action (if present)
- Each card in DOM order
- Alert pill within each card (if `onAlertClick` is supplied) — receives focus after the card-wrapper button
- The grid does not loop or trap focus.

## Empty states

- Attention mode with zero alerts: a `✓` glyph (aria-hidden) + text-default message. The glyph reuses `--color-band-very-low-bg` for the "improving" semantic.
- All mode with zero clients: text message + optional `headingAction`.
- Loading: `role="presentation" aria-hidden="true"` cards; AT skips the loading block.

## Colour contrast

| Surface | Min | Status |
|---|---|---|
| Name on card bg | 4.5:1 | `text-default` on `card.background.default` — locked v4.3 |
| Subline on card bg | 4.5:1 | `text-subtle` on `card.background.default` — verified v4.3 |
| Avatar glyph (white) on chart-cat tokens | 4.5:1 | all six cat tokens verified v4.3 |
| Alert pill (high) | 4.5:1 | white on `band.very-high.bg` — verified |
| Alert pill (medium) | 4.5:1 | `band.medium.text` on `band.medium.bg` — verified |

## Don't

- Don't combine `onClientClick` with `onAlertClick` — nested buttons. The component will warn + fall back; consumers should pick one model per surface.
- Don't read the delta arrow as the primary signal. The SR sentence carries the word; colour reinforces.
- Don't set `mode="attention"` then hand-filter the clients prop. The component does the attention filter itself; pre-filtering produces a misleading `"Requires your attention · N clients"` count.

## Verified

- axe-core clean on Default, AllMode, InteractiveCards, InteractivePill, Loading, EmptyAttention stories during implementation.
- Sarah G5 to re-baseline in Chromatic regression sweep + record SR walkthrough.
