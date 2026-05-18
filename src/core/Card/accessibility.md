# Card — accessibility

Card is a non-interactive presentational container. It does not add ARIA roles by default; the consumer composes the semantics.

## Contracts
- If a card is the entire activation target (e.g. clickable summary card), wrap or replace it with a `<button>` / `<a>` — don't add `onClick` to the `<div>`.
- If a card contains a heading, place the heading as the first child so screen-reader users land on a meaningful label.
- Sufficient contrast between `--color-card-background-*` and `--color-text-default` is verified by tokens (see `tokens.md`).
