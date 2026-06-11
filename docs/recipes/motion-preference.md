---
id: motion-preference
layer_composition: "Layer 1 (core) — MotionProvider + Button/IconButton + text; no Layer 2/3 dependencies"
use_case: "Let a user explicitly choose reduced or full motion, persisted across sessions, layered on top of the OS prefers-reduced-motion signal"
trigger: "User opens display / accessibility settings, or follows an inline 'Reduce motion' affordance"
data_shape: "MotionPreference = 'full' | 'reduced'; persisted at localStorage['risqbase:motion']; absent key = follow OS signal"
composed_of:
  - MotionProvider (app root)
  - Button or IconButton (the toggle control)
  - text label + supporting copy (consumer-rendered)
states:
  - "system (default) — no stored override; prefers-reduced-motion decides"
  - "reduced — stored override 'reduced'; all DS animation collapses to static/opacity-only variants"
  - "full — stored override 'full'; full motion even where the OS requests reduced (explicit user action only)"
layout: "Single labelled row in a settings page (see settings-page recipe): label + supporting copy on the inline-start side, the control on the inline-end side. Inline affordances use a single secondary Button."
voice_examples:
  - template_id: "10.5.5"
    context: "settings row label + supporting copy for the motion control"
    rendered: "Reduce motion — fewer animations, same information."
  - template_id: "10.5.5"
    context: "supporting copy under the 'system' option, explaining the default"
    rendered: "Follow system setting. Your device currently asks for reduced motion."
anti_patterns:
  - "Don't ship a motion toggle that only affects some components — mount MotionProvider at the app root so the preference is global."
  - "Don't override an OS reduce-motion signal silently — only an explicit, labelled user control may call setMotionPreference('full')."
  - "Don't invent a third motion level — the contract is binary ('full' | 'reduced'); per-animation opt-outs fragment the guarantee."
  - "Don't persist the preference server-side only — the localStorage key is what the provider resolves before any network round-trip."
---

# Motion preference

A documented pattern, **not** an exported control. The design system
ships the plumbing — `MotionProvider`, `useReducedMotion()`,
`setMotionPreference()` (`core/`, promotion state `beta`, DS v4.4
D-110) — and each product composes its own toggle from existing
primitives so it sits naturally in that product's settings surface.

## Resolution order

1. **Explicit user choice** — `localStorage["risqbase:motion"]`
   (`MOTION_STORAGE_KEY`), values `'full' | 'reduced'`.
2. **OS signal** — `prefers-reduced-motion: reduce`.
3. **Default** — full motion.

`setMotionPreference(null)` clears the override and returns to the OS
default. Every mounted `MotionProvider` re-resolves live (same-tab
change event, cross-tab `storage` events, and media-query changes).

## The toggle

A labelled switch composed from existing primitives — a text label with
supporting copy, plus a `Button` group (or a single `IconButton` for
compact surfaces). Three options, mirroring the resolution order:
**System** (default), **Reduced**, **Full**.

```tsx
'use client'

import {
  MotionProvider,
  setMotionPreference,
  useReducedMotion,
  Button,
} from '@risqbase-inc/ui-components/core'

// App root — wrap once, every DS primitive below re-resolves live.
export function AppShell({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>
}

// Settings row — composed, not imported from the DS.
export function MotionSettingRow() {
  const reduced = useReducedMotion()
  return (
    <div role="group" aria-labelledby="motion-label">
      <div>
        <span id="motion-label">Reduce motion</span>
        <p>Fewer animations, same information. Currently: {reduced ? 'reduced' : 'full'}.</p>
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={() => setMotionPreference(null)}>
          System
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setMotionPreference('reduced')}>
          Reduced
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setMotionPreference('full')}>
          Full
        </Button>
      </div>
    </div>
  )
}
```

Mark the active option (e.g. `aria-pressed` on the active `Button`) so
the current state is programmatically determinable.

## Copy guidance

- Lead with the benefit, not the mechanism: "Reduce motion — fewer
  animations, same information." Never "disable CSS animations".
- The "system" option should say what the system currently asks for
  ("Your device currently asks for reduced motion") so the default is
  never a mystery.
- No exclamation marks, no "Are you sure?" (spec §21) — changing motion
  is reversible and needs no confirmation.

## What reduced mode does

| Primitive | Full | Reduced |
|---|---|---|
| `Skeleton` | gradient shimmer | static `surface.muted` fill |
| `IrisThinking` | concentric arc rotation | arcs hold position, opacity pulse |
| `StreamingText` | token-by-token cadence + cursor | instant reveal, no cursor (`onComplete` fires once) |
| `Toast` | entrance fade/slide | appears instantly |

CSS-only consumers can target the provider's wrapper attribute instead
of the hook: `[data-motion='reduced'] .thing { animation: none }`
(scanner rule R13 requires one of the two gates on any animated CSS).
