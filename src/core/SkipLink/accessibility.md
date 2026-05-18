# SkipLink — accessibility

Satisfies WCAG 2.4.1 Bypass Blocks (A). Mount as the first focusable element inside the App shell, immediately after `<body>` opens.

## Contracts
- Hidden from sighted-mouse users via `sr-only`; revealed on `:focus` via `not-sr-only` + fixed positioning so it overlays the page chrome.
- `href` points to a real focus target — the consumer must set `tabIndex={-1}` on a containing element (e.g. `<main id="main-content" tabIndex={-1}>`) so Enter moves keyboard focus, not just the viewport.
- Focus ring inherits from `--color-border-focus`.

## Pair with
- `<main id="main-content" tabIndex={-1}>` — the destination must accept programmatic focus.
