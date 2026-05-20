# Header — accessibility

Header includes the `<header>` landmark, an accessible logo (text wordmark), visible focus rings on all nav links and CTAs (§5.8.1), and a skip-link target downstream (§5.8.2). The v2.1.0 dropdown additions follow the ARIA **disclosure** pattern — NOT the menu pattern (Spec 07-a11y §1).

## Disclosure pattern (v2.1.0)

When a nav entry is a `NavGroup` (has `items`), the trigger renders as a `<button type="button">` with `aria-expanded` and `aria-controls`. The panel is a `<div>` of `<a>` links (`role="list"` + `<li><a>`).

- `<a>` links use native Tab traversal — no roving tabindex.
- ESC closes + restores focus to the trigger.
- Outside-click closes (via `mousedown` listener — see Spec 07-a11y §3 for the race-condition rationale).
- Single-open invariant via `HeaderDropdownProvider` context (Spec 07-a11y §4): opening one closes any other.

## aria-current

- `currentPath` prop drives matching via `isCurrentPath` (`src/core/Header/lib/isCurrent.ts`).
- A link's exact-match OR `currentPath.startsWith('${href}/')` triggers `aria-current="page"` (parent-of-current convention).
- For a `NavGroup`, the trigger gets `aria-current="page"` whenever any child matches.
- External URLs (`https://…`) never match.
- `href="/"` matches only the exact root.

## Reduced motion

The dropdown panel fade-in (120ms, opacity + translateY) is suppressed under `prefers-reduced-motion: reduce` via CSS only. No JS coupling — works for users who toggle the system preference mid-session.

## ESC propagation

ESC on a dropdown calls `e.stopPropagation()` so it does not bubble into sibling modal-close handlers. If the Header sits inside a modal, dropdown closes first; subsequent ESC closes the modal.

## Test plan (Sarah G5)

1. **axe-core** clean on every story.
2. **Keyboard walkthrough** via `KeyboardWalkthrough` story: trigger announces "Platform, button, collapsed" → Enter expands → Tab → first link focused → Shift+Tab → trigger.
3. **VoiceOver / NVDA** confirms aria-current announces "current page" on the active link AND on the dropdown trigger when a child matches.
4. **Outside-click** closes.
5. **ESC** closes + focus on trigger.
6. **Single-open** via `WithMultipleDropdowns`.
7. **Reduced-motion** via `DropdownReducedMotion` + `KeyboardWalkthroughReducedMotion`.
8. **Path-prefix matching** via `DropdownWithCurrentChild` (`currentPath='/platform/horizon-iris'`; both the `/platform` trigger and the `/platform/horizon-iris` item carry `aria-current="page"`).
