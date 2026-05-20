# 07 · Header polish — Accessibility

> Companion to [07-Header-polish.md](./07-Header-polish.md).
> Audience: implementing engineer; Sarah G5.
> Patterns: ARIA disclosure pattern (not menu pattern); ESC + outside-click handling; focus restoration; single-open invariant.

---

## §1 Disclosure, not menu

The dropdown is an **ARIA disclosure** (`aria-expanded` on the trigger), **not** an `aria-haspopup="menu"` widget. Rationale: the panel contains nav links (`<a>`), not menu items. Menu-pattern semantics imply roving tabindex and arrow-key navigation between *menuitems*; a list of links uses native Tab traversal. The disclosure pattern is the right ARIA contract for "click this button to reveal a list of links."

Reference: WAI-ARIA Authoring Practices · Disclosure (Show/Hide).

### 1.1 Trigger markup

```html
<button
  type="button"
  aria-expanded="false"
  aria-controls="header-dropdown-panel-{id}"
  aria-current={hasCurrentChild ? 'page' : undefined}
>
  Platform
  <svg aria-hidden="true">{/* chevron */}</svg>
</button>
```

### 1.2 Panel markup

```html
<div
  id="header-dropdown-panel-{id}"
  hidden  {/* present when closed; absent when open */}
>
  <p class="dropdown-eyebrow" aria-hidden="true">PLATFORM</p>
  <ul role="list">
    <li><a href="/platform/horizon-iris" aria-current={currentPath==='/platform/horizon-iris' ? 'page' : undefined}>HorizonIris</a></li>
    <li><a href="/platform/practice-cockpit">Practice Cockpit</a></li>
    <li><a href="/platform/knowledge-bank">Knowledge Bank</a></li>
  </ul>
</div>
```

The eyebrow is `aria-hidden="true"` because the list semantics + the trigger label already carry the grouping. Repeating "PLATFORM" to SR users would be noise.

---

## §2 Keyboard contract

| Key | When | Action |
|---|---|---|
| `Enter` / `Space` | focus on trigger | Toggle the panel. `aria-expanded` flips. |
| `Tab` | focus on open trigger | Move focus to the first link in the panel. Panel stays open. |
| `Tab` | focus on last link in panel | Move focus to the next focusable element after the panel. Panel **stays open**. |
| `Shift+Tab` | focus on first link in open panel | Move focus to the trigger. Panel stays open. |
| `Esc` | focus anywhere inside trigger+panel | Close the panel. Restore focus to the trigger. |
| any printable key | focus inside panel | Native browser behaviour; no type-ahead implemented |

`Esc` is the only key that closes the panel via keyboard. Tab does not close — leaving the panel without closing supports flows where a user tabs through to verify the panel contents then continues elsewhere.

### 2.1 Focus restoration

When the panel closes via:

| Trigger | Focus goes to |
|---|---|
| `Esc` | The trigger button (always). |
| Click outside | Wherever the user clicked. If they clicked into a focusable element, that element. The trigger does not steal focus. |
| Click on a link inside | The link navigates; document scrolls; the new page's focus is the consumer app's problem (Next.js default). |
| Click the trigger again | The trigger (it received the click). |

### 2.2 ESC propagation

`ESC` is handled at the document level via a `keydown` listener attached when any dropdown is open. The handler calls `e.stopPropagation()` so it doesn't bubble into modal-close handlers above the Header. **Important**: if the Header sits inside a modal, the same `ESC` should not close both — implement priority: dropdown closes first, modal closes on the next press. Document this gotcha in MDX.

---

## §3 Outside-click

When a dropdown is open, attach a `mousedown` listener on `document`. If the event target is **not** inside the trigger or the panel, close the dropdown. Use `mousedown`, not `click`, to avoid the small race where a click inside the panel followed by re-render causes the click-target to be outside the panel.

```ts
useEffect(() => {
  if (!open) return
  const handler = (e: MouseEvent) => {
    if (panelRef.current?.contains(e.target as Node)) return
    if (triggerRef.current?.contains(e.target as Node)) return
    setOpen(false)
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [open])
```

---

## §4 Single-open invariant

Two dropdowns open simultaneously is bad UX. Implementation:

```tsx
// In Header/index.tsx
const [openId, setOpenId] = useState<string | null>(null)

return (
  <HeaderDropdownContext.Provider value={{ openId, setOpenId }}>
    {/* ... */}
  </HeaderDropdownContext.Provider>
)
```

Each `HeaderNavDropdown` reads the context and self-closes when `openId !== ownId`. The trigger calls `setOpenId(open ? null : ownId)`.

---

## §5 Reduced-motion

Panel fade-in animation respects `prefers-reduced-motion: reduce`:

```css
.header-dropdown-panel {
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 120ms ease-out, transform 120ms ease-out;
}
.header-dropdown-panel[data-open='true'] {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .header-dropdown-panel { transition: none; }
}
```

---

## §6 aria-current — multi-match precedence

If both a top-level link (`/platform`) and a panel item (`/platform/horizon-iris`) match the current path:

- The panel item gets `aria-current="page"` (most specific).
- The trigger gets `aria-current="page"` too (parent-of-current convention).
- The trigger's visual underline still renders.

SR will announce "current page" once per element. This is acceptable — the trigger's role as "container of the current page" is meaningful navigation context.

If only the trigger's own href matches (no panel items match):

- Only the trigger gets `aria-current="page"`.

If only a panel item matches:

- Both the trigger (parent-of-current) and the item get `aria-current="page"`.

The matching function lives in `src/core/Header/lib/isCurrent.ts` and is exported for testing.

---

## §7 Colour contrast

| Surface | Min | Notes |
|---|---|---|
| Panel text on panel bg | 4.5:1 | text-default on surface-default — locked |
| Panel hover-bg text | 4.5:1 | text-default on surface-muted — verified v4.3 |
| aria-current underline against header bg | 3:1 (non-text UI) | indigo-600 on header-background — verified |
| Trigger chevron currentColor | inherits from link colour | n/a |

---

## §8 Test plan

1. **axe-core** — every story passes.
2. **Keyboard walkthrough** — Sarah G5 walks the `KeyboardWalkthrough` story and confirms §2.
3. **VoiceOver / NVDA** — Sarah confirms trigger announces "Platform, button, collapsed" → activates → "expanded"; tabbing announces each link with `aria-current` when applicable.
4. **Outside-click** — Sarah opens dropdown, clicks elsewhere on the page, dropdown closes.
5. **Esc** — Sarah opens dropdown, presses Esc, focus returns to trigger, dropdown closes.
6. **Single-open** — Sarah opens dropdown A, then clicks dropdown B trigger; A closes, B opens.
7. **Reduced-motion** — system flag on; no fade-in.
8. **Path-prefix matching** — `currentPath='/platform/horizon-iris'`; both the `/platform` trigger and the `/platform/horizon-iris` item carry `aria-current="page"`.
