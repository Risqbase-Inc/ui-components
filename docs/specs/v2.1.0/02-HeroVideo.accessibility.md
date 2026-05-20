# 02 · HeroVideo — Accessibility

> Companion to [02-HeroVideo.md](./02-HeroVideo.md).
> Audience: implementing engineer; Sarah G5 (QA).
> Critical surfaces: captions, autoplay, reduced-motion fallback, focus management, SR announcement of the storyboard grid.

---

## §1 Captions are not optional

WebVTT captions are a **required prop** on `HeroVideoProps`. There is no API path where the component renders without a `captions` URL. Rationale: BRIEF-429 V1 §1 declared captions the primary information channel for muted autoplay; V2 §6 Q6 added the 2×2 reduced-motion grid as the second carrier. Both require captioned beats; making `captions` required at the type level prevents accidental shipment without them.

If a consumer needs an uncaptioned video, they reach for `core/VideoEmbed` instead — that primitive remains uncaptioned-allowed for non-hero positions.

### 1.1 VTT contract

- File hosted same-origin as the page (CORS otherwise) OR served with `Access-Control-Allow-Origin: *`.
- Encoded UTF-8, no BOM.
- Includes the four beat cues + a poster cue at `00:00.000 → 00:00.100` carrying the video title (gives SR users a title before any beat plays).
- Each beat cue includes both the eyebrow and the body — eyebrow wrapped in `<c.eyebrow>…</c>` for VTT-CSS class targeting:

  ```
  WEBVTT

  00:00.000 --> 00:00.100
  <c.title>From prompt to signed audit trail in 60 seconds</c>

  00:00.500 --> 00:14.500
  <c.eyebrow>BEAT 1 · 0–15s</c>
  Ask IRIS. RALIA reads vendor, jurisdiction and classification, then surfaces the assessments to run.

  ...
  ```

- The poster cue's class `.title` is styled invisibly (`::cue(.title) { opacity: 0 }`) — it exists only to feed the title to assistive tech that scans VTT before play begins.

---

## §2 Autoplay rules

| Condition | Behaviour |
|---|---|
| Muted-autoplay supported + IntersectionObserver fires | Auto-play. No user gesture required. |
| Muted-autoplay denied (e.g. Safari low-power mode) | Show poster + play affordance; after 5s show "Tap to play" overlay text |
| User has `prefers-reduced-motion: reduce` | **Never autoplay.** Render the 2×2 fallback grid instead. |
| Tab is backgrounded mid-play | Browser default applies (most browsers pause). No additional intervention. |
| Multiple HeroVideo on the same page | (Marketing repo never does this, but defensively): only the one(s) intersecting the viewport autoplay; others stay in `idle`. |

The component never *un*mutes. Marketing hero videos are muted by design. Captions carry the meaning.

---

## §3 Reduced-motion fallback — 2 × 2 grid SR contract

When the grid replaces the video, the announcement order for screen-reader users is:

1. `aria-label` on the figure: `"{title}. Video unavailable in reduced-motion mode. Four-frame summary below."`
2. The 4 cells in order, each announced as:
   ```
   "Beat {n} of 4: {beat.eyebrow}. {beat.caption}."
   ```
3. The `figcaption` carries the `description` prop as a closing summary.

Markup:

```html
<figure
  role="figure"
  aria-labelledby="hv-title-{id}"
  aria-describedby="hv-desc-{id}"
>
  <h3 id="hv-title-{id}" class="sr-only">{title}</h3>
  <div class="hv-fallback-grid" role="list" aria-label="Four-frame video summary">
    <div role="listitem">
      <img src={beats[0].fallbackFrame} alt={beats[0].fallbackAlt ?? ''} />
      <p class="sr-only">Beat 1 of 4: {beats[0].eyebrow}. {beats[0].caption}.</p>
      <div aria-hidden="true">
        <span class="hv-fallback-eyebrow">{beats[0].eyebrow}</span>
        <p class="hv-fallback-caption">{beats[0].caption}</p>
      </div>
    </div>
    <!-- ...3 more -->
  </div>
  <figcaption id="hv-desc-{id}" class="sr-only">{description}</figcaption>
</figure>
```

The visible eyebrow + caption are `aria-hidden` because the sr-only `<p>` already carries them; double-announcement would be redundant.

---

## §4 Focus management

| Element | Tab order | Notes |
|---|---|---|
| Poster play affordance | 1st (when state is idle/paused/errored) | Native `<button>` semantics; `Enter`/`Space` activate |
| Video element | 2nd (when playing) | Native `<video>` controls=false; focus moves here for keyboard scrubbing if browser supports (most don't with controls off — acceptable). |
| Caption track toggle | Not focusable in v2.1.0 | Native browser caption controls handle this; we don't expose our own toggle UI. |
| Fallback grid cells | 1st through 4th (when in reduced-motion state) | Each cell is a `<button>` with no action (or, if an analytics consumer wants click-tracking, fires `onPlay` so it reads as "user wants the video despite reduced-motion") |

The play affordance is a `<button>`, not a `<div role="button">`. The poster image inside has `alt=""` (decorative); the button itself carries `aria-label="Play video: {title}"`.

---

## §5 Reduced-motion + the loading pulse

The placeholder play disc pulses when `state === 'loading'`. **Wrap in the standard media query**:

```css
@media (prefers-reduced-motion: no-preference) {
  .hv-play-disc--loading { animation: hv-pulse 1s ease-in-out infinite; }
}
```

Note: when `prefers-reduced-motion: reduce`, the component is already in `reduced-motion` state and renders the grid — the play disc isn't visible at all. The media-query wrap is defence-in-depth for the loading-pulse rule in case a future change exposes the placeholder under reduced-motion.

---

## §6 Colour contrast

| Surface | Min ratio | Verified |
|---|---|---|
| Caption text (white on rgba(0,0,0,0.65)) | 7:1 (AAA) | yes |
| Fallback caption body on `--color-surface-default` | 4.5:1 | inherits global text-default contract |
| Fallback eyebrow on grid bg `--color-iris-surface` | 4.5:1 | locked in v4.3 §iris-accent-on rule |
| Poster "Tap to play" overlay on dark scrim | 7:1 | white on rgba(0,0,0,0.5) — verify in implementation |
| Play disc + ring against any poster colour | 3:1 (non-text UI) | hard contrast independent of poster colour |

---

## §7 Test plan

1. **axe-core** — all 11 stories pass.
2. **Captions** — manually verify VTT renders in Chrome, Safari, Firefox. The eyebrow class styling is allowed to degrade in Firefox; the body must always render.
3. **Reduced-motion path** — Sarah G5 walks the storybook story with VoiceOver and confirms announcement order matches §3.
4. **Autoplay denial** — Sarah forces Safari low-power mode; confirms 5s timeout fires; "Tap to play" appears; activating it plays video successfully.
5. **Keyboard-only** — Sarah focuses the play disc with Tab; activates with Enter; video plays; focuses again with Tab through the page; reaches next focusable element after the embed without trap.
6. **Caption sizing** — at 375px viewport, in-video captions render at 16px; at 1280px, at 14px.
7. **Loop boundary** — Sarah plays for 2 hours on monitored loop; confirms `onLoopRestart` fires 120 times; confirms no observable visual seam at the boundary (BRIEF-429 V2 §5 acceptance criterion).
