# ClientScopeBanner — accessibility

A persistent landmark below the header on every Practice route. Always visible — never hidden under "Settings".

## Contracts
- `role="region"` + `aria-label="Active scope"` — addressable as a landmark by screen-reader users.
- The shield glyph is `aria-hidden="true"`; meaning lives in the state label ("Workspace view" / "Client scope" / etc.) and the verified-timestamp suffix.
- When the scope changes mid-session (state transition workspace → client), the host page should announce the change via a polite live region elsewhere — the banner itself is a static landmark, not a notifier.
- "Switch" / "Details" are real `<button>` elements with focus rings.

## Don't
- Don't conditionally hide this on mobile to save vertical space. Tenant isolation is a safety surface; if vertical space is tight, condense (state + client only).
