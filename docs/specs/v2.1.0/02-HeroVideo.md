# 02 · HeroVideo

> **Closes**: BRIEF-429 v2 implementation — homepage hero video. Marketing repo currently has no production video-embed pattern; this is it.
> **Composes with**: existing `core/VideoEmbed` (subsumed but not deprecated), ArcDecoration (close-frame decoration), CitationChip vocabulary (in caption track timeline tooling).
> **Visual reference**: `Marketing Demo I - Hero Video Concept V2.html` (and companion brief `audit-deliverable/BRIEF-429-VIDEO-V2-CONCEPT.md`, V2 is canonical).
> **Home**: `src/marketing/HeroVideo/` — new namespace (rationale in cover §2.1).
> **Accessibility**: see [02-HeroVideo.accessibility.md](./02-HeroVideo.accessibility.md) — captions, autoplay, reduced-motion, focus management.

---

## §1 What it is

A lazy-loaded, muted-autoplay-on-visibility, captioned, looping product-walkthrough video embed sized for marketing hero positions (16:9, full-bleed inside its column). Subsumes the basic `core/VideoEmbed` (which stays in main as a lower-level primitive for non-hero embeds) and adds:

- **2 × 2 static storyboard fallback** for `prefers-reduced-motion: reduce` users.
- **Iris-surface placeholder** (teal-50) on lazy-load — not the indigo-100 default of `core/VideoEmbed`. (See `08-VideoEmbed-token-swap.md` for the corresponding base-component patch.)
- **Caption track with beat-aware styling** — eyebrow + body line per beat, iris-teal eyebrow colour per BRIEF-429 V2 §6 Q7 resolution.
- **Loop-handshake-friendly architecture** — the component exposes `onLoopRestart` so the embedding page can co-ordinate with sibling animations if needed.

---

## §2 TypeScript API

```ts
// src/marketing/HeroVideo/types.ts

export interface HeroVideoBeat {
  /** Beat index (0-based); also the index into the 2×2 fallback grid */
  index: 0 | 1 | 2 | 3
  /** Mono eyebrow shown above the caption body */
  eyebrow: string
  /** Caption body line */
  caption: string
  /** Start time in seconds */
  startSec: number
  /** End time in seconds */
  endSec: number
  /** Path to the static fallback frame (16:9 PNG/WebP) */
  fallbackFrame: string
  /** Optional plain-text alt for the fallback frame; used by SR when motion is off */
  fallbackAlt?: string
}

export interface HeroVideoSource {
  src: string
  type: 'video/mp4' | 'video/webm' | string
}

export type HeroVideoState =
  | 'idle'        // before IntersectionObserver fires
  | 'loading'    // muted-autoplay request in flight
  | 'playing'   // video is playing
  | 'paused'    // user-paused
  | 'errored'   // load failed; fallback shown
  | 'reduced-motion'  // prefers-reduced-motion: reduce active; fallback grid shown
  | 'looped'    // a loop just completed; emits onLoopRestart

export interface HeroVideoProps {
  /** One or more sources for <video> children */
  sources: HeroVideoSource[]
  /** Poster image (16:9). Shown before lazy-load fires + on error + as VTT poster cue */
  poster: string
  /** WebVTT caption track URL — required, not optional */
  captions: string
  /** Beat metadata; 4 beats required for the storyboard fallback */
  beats: [HeroVideoBeat, HeroVideoBeat, HeroVideoBeat, HeroVideoBeat]
  /** Title (used for aria-label + fallback figcaption) */
  title: string
  /** Plain-language description used by SR users and motion-reduced viewers */
  description: string
  /** Loop forever (default true). When false, video stops on the close frame. */
  loop?: boolean
  /** Margin (px) added around the embed when IntersectionObserver decides to start.
   *  Default 200px — lets the video begin loading just before it enters the viewport. */
  rootMargin?: number
  /** Aspect ratio override; default '16/9'. Marketing has no use case for non-16:9
   *  but the prop is here so future product surfaces can reuse. */
  aspectRatio?: string
  /** Show captions on by default (browser-respected). Default: true. */
  captionsDefault?: boolean
  /** Callbacks (analytics-friendly; binding is consumer-side) */
  onPlay?: () => void
  onPause?: () => void
  onProgress?: (currentSec: number) => void
  onComplete?: () => void
  onLoopRestart?: () => void
  className?: string
}
```

---

## §3 Behaviour contract

### 3.1 Lifecycle

```
mount
  → state = 'idle' (poster + iris-surface scrim visible)
  → IntersectionObserver({ rootMargin: '200px 0px 200px 0px' })
  → on first intersect-true:
      → load <video src=…>
      → state = 'loading'
      → attempt .play() with muted=true, playsInline=true
      → on play success: state = 'playing'
      → on play failure (autoplay denied / network): state = 'errored'; show poster + caption "Tap to play"

  → on loop end (HTMLMediaElement 'ended' + loop=true → 'seeked' to 0):
      → fire onLoopRestart
      → state = 'looped' briefly; resolves back to 'playing' next frame

  → if prefers-reduced-motion: reduce on mount:
      → skip IntersectionObserver entirely
      → state = 'reduced-motion'
      → render 2×2 fallback grid + captions

unmount
  → pause + cleanup IntersectionObserver
```

### 3.2 The 2 × 2 fallback grid

Activated when:
- `prefers-reduced-motion: reduce` matches on mount, OR
- The user-agent denies muted-autoplay AND the user does not tap play within 5 seconds (graceful fallback), OR
- Video network load errors out after one retry.

Layout: 2 columns × 2 rows of `beats[]`. Each cell is the same 16:9 aspect as the parent embed but at quarter size. Each cell contains:

```
┌────────────────────────────────────┐
│                                    │
│   [fallback frame image]           │
│                                    │
│                                    │
└────────────────────────────────────┘
  BEAT 1 · 0–15s
  Ask IRIS. RALIA reads vendor,
  jurisdiction and classification…
```

Above each cell, eyebrow text in `--font-mono` 10px `--color-iris-accent-hover` letter-spacing 0.08em uppercase. Below: caption body in `--font-sans` 14px (desktop) / 16px (mobile — note: caption text grows on smaller screens, not shrinks) `--color-text-default` line-height 1.45.

The grid background is `--color-iris-surface` (matches the placeholder; reinforces the substrate). Cell backgrounds are `--color-surface-default` with 1px `--color-border-subtle`. Gap between cells: 16px.

### 3.3 Placeholder + chrome

Before lazy-load fires, the embed surface is the **poster image** scaled to fill the 16:9 frame, overlaid with:

- A centred play affordance: 48px filled circle in `--color-iris-accent`, white triangle play glyph, 4px white outer ring at `--color-iris-surface` 80% opacity.
- A bottom-left captions-on indicator (white "CC" glyph on 24px black 40%-opacity pill) if `captionsDefault=true`.
- The placeholder background colour fills any letterboxing: `--color-iris-surface`.

When `state === 'loading'`, the play affordance pulses (1s ease-in-out infinite, opacity 0.6 ↔ 1) — **gated on `prefers-reduced-motion`** so it stays static when motion is off.

When `state === 'errored'`, the play affordance is replaced with a small alert glyph + text "Tap to play". Tapping kicks off a manual play() attempt.

### 3.4 Caption rendering

WebVTT is the source-of-truth. Browser-native caption rendering is used (no custom subtitle overlay). The component ensures:

- The `<track kind="captions" srclang="en" default={captionsDefault}>` element is present.
- The VTT file includes the four beat cues plus a **poster cue** at `00:00.000 → 00:00.100` carrying the title — this gives SR users the title even before any beat has played.
- Cue styling is customised via VTT CSS:
  ```
  ::cue { background: rgba(0,0,0,0.65); color: var(--color-text-on-inverse); font-family: var(--font-sans); font-size: 16px; padding: 4px 10px; }
  ::cue(.eyebrow) { color: var(--color-iris-accent-subtle); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; }
  ```
  Engineering verifies cross-browser support; if Safari doesn't honour `::cue(.eyebrow)`, fall back to merging eyebrow + body into one cue and styling the prefix inline (`<c.eyebrow>BEAT 1</c>\n…`).

### 3.5 Loop architecture (BRIEF-429 V2 §5)

V2 loop is a **product handshake**, not a scrim handshake:

- Beat 4 close (47.5s–48s): signed-log fades to teal-50 substrate.
- Close frame (58s–60s): centred tagline + indigo CTA pill over teal substrate; ArcDecoration at 30% opacity in lower-right.
- Loop boundary (60s → 0s): close frame's teal-50 substrate IS Beat 1's dashboard background. Foreground swaps (tagline+CTA fade out, dashboard chrome fades in); ground does not move.

The HeroVideo component does not enforce the visual handshake — that's the video file's job. The component's contribution: `onLoopRestart` fires at the exact frame boundary so a consumer wanting to sync (e.g. an ArcDecoration animation timed to the close frame) can hook in.

---

## §4 Token chain

```
// Substrate + placeholder
embed bg              → var(--color-iris-surface)        // teal-50
placeholder play disc → var(--color-iris-accent)         // teal-600
placeholder ring      → rgba(255,255,255, 0.8)           // hard-coded; substrate-agnostic

// Captions
cue bg                → rgba(0, 0, 0, 0.65)              // hard-coded; VTT contract
cue text              → var(--color-text-on-inverse)
cue eyebrow text      → var(--color-iris-accent-subtle)

// Fallback grid
grid bg               → var(--color-iris-surface)
cell bg               → var(--color-surface-default)
cell border           → var(--color-border-subtle)
eyebrow               → var(--color-iris-accent-hover)
body                  → var(--color-text-default)

// CTA in close-frame (rendered by the video file itself; spec'd here for handshake)
close-frame pill bg   → #FFFFFF (white)
close-frame pill text → var(--color-action-primary)      // indigo-600
```

**Zero new tokens.** Reuses v4.3 chain.

---

## §5 States

| State | Visual |
|---|---|
| `idle` | Poster + play disc + CC indicator |
| `loading` | Poster + pulsing play disc (motion-respected) |
| `playing` | Video element visible; native browser caption rendering on |
| `paused` | Video frame visible; centred play disc reappears at full opacity |
| `errored` | Poster + alert glyph + "Tap to play" label |
| `reduced-motion` | 2×2 fallback grid; no video element loaded |
| `looped` (transient) | Identical to `playing`; lasts one frame; only observable via `onLoopRestart` callback |

---

## §6 Storybook stories

```
marketing/HeroVideo
├── Default                            — BRIEF-429 V2 fixture (60s loop, 4 beats)
├── PosterOnly                         — captures the idle state pre-IntersectionObserver
├── LoadingPulse                       — captures the loading state with pulsing play disc
├── PlayingFrame                       — captures mid-playback frame with caption visible
├── Paused                             — captures the user-paused state
├── ErroredFallback                    — captures the "Tap to play" error state
├── ReducedMotionFallback              — captures the 2×2 storyboard grid (motion off)
├── CaptionsOff                        — captionsDefault=false; CC indicator absent
├── WithoutLoop                        — loop=false; ends on close frame
├── ShortBeats                         — 4 short beats (15s total) to test loop handshake
└── MobileViewport                     — fixed 375px viewport; verifies caption sizing rules
```

The `ReducedMotionFallback` story uses Storybook's `parameters.chromatic.delay` + a CSS override to force the media query match — engineering owns the test-harness shim.

---

## §7 Acceptance criteria

1. **Behaviour** — IntersectionObserver-gated lazy-load works in all modern browsers; muted-autoplay succeeds in Chrome/Safari/Firefox; gracefully falls back to the play-affordance error state on autoplay denial.
2. **Captions** — `<track kind="captions">` present; VTT file loads; ::cue styling renders correctly in Chrome/Safari (Firefox is allowed to render plain captions if `::cue(.eyebrow)` is unsupported — degradation is graceful).
3. **Reduced-motion** — system flag respected; 2×2 grid renders; no video element mounted; SR announcement includes title + description + all 4 captions.
4. **Token compliance** — token-lint clean.
5. **Storybook coverage** — all 11 stories present.
6. **Chromatic** — clean diffs except for the new directory.
7. **A11y** — passes the contract in `02-HeroVideo.accessibility.md`.

---

## §8 Open questions for Elena G4 review

- **Q1 — Hosting handshake.** BRIEF-429 §1 hedges Mux vs Cloudflare Stream. The component is hosting-agnostic (accepts plain `<source>` URLs), but if Mux ships an adaptive HLS manifest, do we want an `hls?: string` prop that, when present, takes precedence over `sources` and triggers hls.js loading? **Recommend**: ship without HLS support in v2.1.0; add `hls?` in v2.2 if Mux is chosen.
- **Q2 — Autoplay denial UX.** Current spec: show "Tap to play" after 5s of failed autoplay. Should it be immediate? 5s lets the user notice the video and tap, before the error message implies broken-ness. **Recommend**: keep 5s; expose `autoplayRetryDelayMs` prop if Sophie wants to tune it later.
- **Q3 — Mobile caption sizing.** Spec says 16px on mobile, 14px on desktop (caption text grows on small screens, not shrinks). Confirm with Elena this matches her Demo I caption pane decision — Demo I's caption-pane uses 17.5px throughout regardless of viewport, so this is a small deviation for the in-video VTT rendering. The rationale: in-video captions sit on a dark scrim and need extra weight on smaller surfaces.
- **Q4 — `onProgress` cadence.** Fire on every `timeupdate` (250ms-ish browser-defaults) or throttle to 1s? Analytics doesn't need millisecond resolution; UI animations co-ordinated to playback might. **Recommend**: pass through every `timeupdate` event raw and let the consumer throttle.
