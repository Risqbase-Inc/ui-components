# 07 · Header polish — Dropdown + aria-current

> **Closes**: Demo E item (3) and (4): "(3) dropdown hover→click, (4) aria-current". Marketing repo Header wrapper currently hand-rolls these; v2.1.0 lifts the behaviour into the published `core/Header` so the marketing wrapper can be dropped.
> **Composes with**: existing `core/Header` (in-place patch — no API break); marketing repo `Header` wrapper (target for deletion post-v2.1.0).
> **Visual reference**: `Marketing Demo E - Header and Footer.html`.
> **Home**: `src/core/Header/` — patch existing; add `Header/NavDropdown.tsx` as a client island.
> **Accessibility**: see [07-Header-polish.accessibility.md](./07-Header-polish.accessibility.md) — disclosure pattern, ESC handling, focus restoration.

---

## §1 Scope of the patch

Two additions to existing `src/core/Header/`:

1. **`aria-current` on nav links** — when a link's `href` matches the current pathname, emit `aria-current="page"`. Visual: link gets a 2px underline in `--color-action-primary` + bumped text colour to `--color-text-default`.
2. **Dropdown nav links** — a nav link can declare itself a "menu" with sub-items. Click toggles a disclosure; ESC closes; outside-click closes; focus restores to the trigger on close.

The existing Header stays presentational. The dropdown is opt-in: pass dropdown configs and a sub-tree client island activates for those entries only. Headers with no dropdown configs continue to server-render as today.

---

## §2 TypeScript API delta

Existing `types.ts`:

```ts
// src/core/Header/types.ts (CURRENT)
export type SiteVariant = 'risqbase' | 'ralia'
export interface HeaderProps {
  variant?: SiteVariant
  showLaunchDate?: boolean
}
```

v2.1.0 additions:

```ts
// src/core/Header/types.ts (v2.1.0)
export type SiteVariant = 'risqbase' | 'ralia'

export interface NavLink {
  label: string
  href: string
}

export interface NavGroup {
  label: string
  /** When present, the nav entry becomes a click-toggle disclosure */
  items: NavLink[]
  /** Optional eyebrow rendered above the dropdown panel; e.g. "PLATFORM" */
  eyebrow?: string
}

export type NavEntry = NavLink | NavGroup

export interface HeaderProps {
  variant?: SiteVariant
  showLaunchDate?: boolean
  /** Override nav entries; default is the variant's canonical set (back-compat) */
  navEntries?: NavEntry[]
  /** Current pathname for aria-current matching. When omitted, the Header
   *  attempts to read from next/navigation usePathname (in Next.js apps).
   *  Pass explicitly for testing or non-Next consumers. */
  currentPath?: string
}
```

Existing callers (no `navEntries`, no `currentPath`) get the v2.0.0 behaviour plus aria-current matching against `usePathname()`. Zero breaking changes.

---

## §3 Visual contract

### 3.1 aria-current=page styling

| State | Visual |
|---|---|
| Default link | `--color-header-nav-link-default` (existing) |
| `aria-current="page"` | colour → `--color-text-default`; 2px solid `--color-action-primary` border-bottom; padding-bottom 4px to keep baseline alignment |
| Hover (current or not) | colour → `--color-header-nav-link-hover` (existing) |

### 3.2 Dropdown trigger

Renders as the existing nav link plus a chevron suffix:

```
Platform ▾
```

- Chevron: 12×12 SVG, currentColor, inline-block, margin-left 4px, vertical-align 1px.
- When open: chevron rotates 180° (transform).
- When trigger has `aria-current` (a child of the dropdown matches), apply the underline as above.

### 3.3 Dropdown panel

When open:

```
┌──────────────────────────────────────────┐
│  PLATFORM                                │  ← eyebrow, mono 10px uppercase --color-text-subtle
│                                          │
│  HorizonIris                             │  ← item, 14px 500 --color-text-default
│  Practice Cockpit                        │
│  Knowledge Bank                          │
│                                          │
└──────────────────────────────────────────┘
```

- Container: 1px solid `--color-border-default`, radius `--dimension-radius-lg`, bg `--color-surface-default`, `--shadow-floating`, min-width 240px.
- Positioned: absolute, top: 100% + 8px, left: 0 (relative to the trigger).
- Padding: 12px.
- Eyebrow: mono 10px `--color-text-subtle`, letter-spacing 0.08em, margin-bottom 8px. Omitted when `eyebrow` is unset.
- Items: 14px / 500 / `--color-text-default`, padding 8px 12px, radius `--dimension-radius-md`. Hover: bg `--color-surface-muted`. Focus: 2px `--color-action-primary` outline, 2px offset.
- Items separated by 2px gap (visual; not rendered as divider).

### 3.4 Animation

Panel transitions: opacity 0 → 1 + translateY(-4px) → 0 over 120ms ease-out. **Gate on `prefers-reduced-motion`** — when reduced, snap-in.

---

## §4 Behaviour contract

- **Click trigger** → toggle open/closed.
- **Click another trigger while one is open** → close the open one, open the new one (single-open invariant).
- **Click inside the panel** (on a link) → close the panel; link navigates as usual.
- **Click outside the panel** → close.
- **ESC** → close. Restore focus to the trigger.
- **Tab from trigger while open** → focus moves to the first item in the panel.
- **Tab from last item** → focus exits the panel; panel stays open (it's a disclosure, not a focus trap).
- **Shift+Tab from first item** → focus returns to the trigger; panel stays open.

Hover does **not** open the panel. The 2026-05-19 audit's Demo E item (3) was explicit: hover→click. Hover-to-open is hostile to keyboard and touch.

---

## §5 Token chain

```
aria-current underline   → var(--color-action-primary)
aria-current text        → var(--color-text-default)
panel bg                 → var(--color-surface-default)
panel border             → var(--color-border-default)
panel shadow             → var(--shadow-floating)            // v4.4 derived (see 00b-v4.4-token-extension.md)
panel item text          → var(--color-text-default)
panel item hover bg      → var(--color-surface-muted)
panel eyebrow text       → var(--color-text-subtle)
focus outline            → var(--color-action-primary)
```

**Zero new primitive tokens.** The dropdown panel references `--shadow-floating`, which is a v4.4 derived token (see [`00b-v4.4-token-extension.md`](./00b-v4.4-token-extension.md)).

---

## §6 Storybook stories

```
core/Header
├── RisqBaseDefault                  — existing v2.0.0 baseline (visual no-change)
├── RaliaDefault                     — existing v2.0.0 baseline
├── WithCurrentPath                  — pass currentPath='/pricing'; verify aria-current renders correctly
├── WithDropdown                     — navEntries with one NavGroup ('Platform' → 3 items)
├── WithMultipleDropdowns            — two NavGroup entries; verify single-open invariant
├── DropdownOpen                     — open by default for visual review; Chromatic snapshot
├── DropdownWithCurrentChild         — current pathname matches an item *inside* a dropdown; trigger underlines
├── KeyboardWalkthrough              — render with an instrument that exercises Tab/ESC; used by Sarah for a11y regression
├── DropdownReducedMotion            — verifies no transition under reduced-motion
├── KeyboardWalkthroughReducedMotion — union of the two above (per G4 REFINE 7.1) — catches regressions where reduced-motion handling breaks specifically under keyboard nav, which manual a11y walkthroughs surface late
└── LaunchDate                       — existing variant; verify it composes with dropdown
```

---

## §7 Implementation hint — client island

To preserve the presentational-by-default Header convention, isolate dropdown state to a client component:

```tsx
// src/core/Header/index.tsx  (stays presentational)

import { HeaderNavDropdown } from './NavDropdown' // 'use client'
import { HeaderNavLink } from './NavLink'

export function Header({ variant = 'risqbase', showLaunchDate, navEntries, currentPath }: HeaderProps) {
  const entries = navEntries ?? defaultEntries[variant]
  return (
    <header>
      {/* ...logo, brand... (unchanged) */}
      <nav>
        {entries.map(entry =>
          'items' in entry
            ? <HeaderNavDropdown key={entry.label} {...entry} currentPath={currentPath} />
            : <HeaderNavLink key={entry.href} {...entry} currentPath={currentPath} />
        )}
      </nav>
      {/* ...cta... */}
    </header>
  )
}

// ---

// src/core/Header/NavDropdown.tsx
'use client'

export function HeaderNavDropdown({ label, eyebrow, items, currentPath }: NavGroup & { currentPath?: string }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasCurrent = items.some(i => i.href === currentPath)

  // ESC, outside-click, focus restoration — see a11y companion
  // Single-open: a parent context tracks "which dropdown is open" and forces close on others
  // ...

  return (/* ...trigger + panel... */)
}
```

The `'use client'` boundary is a single file. The rest of the Header is server-rendered.

---

## §8 Acceptance criteria

1. **No visual regression** on existing Header stories (Chromatic clean diff outside the new behaviour).
2. **aria-current** renders correctly when pathname matches a direct link or any child of a dropdown.
3. **Dropdown UX** — all behaviours in §4 pass manual walkthrough.
4. **Storybook** — 10 stories present.
5. **A11y** — meets the contract in `07-Header-polish.accessibility.md`.
6. **Token compliance** — clean.
7. **Marketing repo** — after this lands and the marketing migration PR runs, the hand-rolled Header wrapper in `risqbase-com` can be deleted with zero behaviour change. Verify this with Priya.

---

## §9 Open questions

- **Q1 — Single-open invariant.** Implementing requires a context provider wrapping all dropdowns. Worth the indirection? **Recommend**: yes. UX is materially better; cost is one provider in the Header and a few lines of useEffect.
- **Q2 — Sub-menus.** Two-level dropdowns (a NavGroup item that itself opens a panel). **Not in scope for v2.1.0.** Document the API as flat; future v2.x can add a recursive NavGroup if a product surface demands it.
- **Q3 — Mobile.** Below 768px the existing Header hides the nav. Dropdowns inherit this; mobile gets a hamburger panel which is **also out of scope for v2.1.0**. The 25 May launch site doesn't have a mobile nav requirement per Sophie. Flag as v2.2 candidate.
- **Q4 — Active-by-prefix matching.** Should `/platform/horizon-iris` set aria-current on `/platform` (the dropdown trigger) as well as on the specific item? **Recommend**: yes. The trigger gets `aria-current="page"` whenever any child matches OR the trigger's own href is a prefix of the current pathname.
