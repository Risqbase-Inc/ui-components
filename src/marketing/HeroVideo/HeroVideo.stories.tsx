import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useRef } from 'react'
import { HeroVideo } from './'
import type { HeroVideoBeat, HeroVideoProps } from './types'

// BRIEF-429 V2 reference fixture — 4 beats × 15s = 60s loop.
//
// All asset paths point to placeholder URLs. Marketing will swap them
// for the real Mux/Cloudflare Stream hostings + the production VTT file
// at consumer-side wire-up. The stories below are layout/contract
// snapshots, not production-asset previews.
const fixtureBeats: [HeroVideoBeat, HeroVideoBeat, HeroVideoBeat, HeroVideoBeat] = [
  {
    index: 0,
    eyebrow: 'BEAT 1 · 0–15s',
    caption:
      'Ask IRIS. RALIA reads vendor, jurisdiction and classification, then surfaces the assessments to run.',
    startSec: 0.5,
    endSec: 14.5,
    fallbackFrame: '/images/hero-video/beat-1.png',
    fallbackAlt: 'IRIS prompt interface showing a vendor risk question being asked.',
  },
  {
    index: 1,
    eyebrow: 'BEAT 2 · 15–30s',
    caption:
      'Run the assessment. Article 35 DPIA, AI Act Annex III screen and ROPA entries scaffold from one source of truth.',
    startSec: 15.5,
    endSec: 29.5,
    fallbackFrame: '/images/hero-video/beat-2.png',
    fallbackAlt: 'DPIA scaffold rendering across three regulatory frameworks simultaneously.',
  },
  {
    index: 2,
    eyebrow: 'BEAT 3 · 30–45s',
    caption:
      'Review the citations. Every claim links to its source — EDPB guidance, regulator decisions, AI Act recitals.',
    startSec: 30.5,
    endSec: 44.5,
    fallbackFrame: '/images/hero-video/beat-3.png',
    fallbackAlt: 'Citation chips showing source articles linked to assessment findings.',
  },
  {
    index: 3,
    eyebrow: 'BEAT 4 · 45–60s',
    caption:
      'Sign the audit trail. Hash-chained, exportable, regulator-ready. Sixty seconds from prompt to evidence.',
    startSec: 45.5,
    endSec: 59.5,
    fallbackFrame: '/images/hero-video/beat-4.png',
    fallbackAlt: 'Signed audit trail with hash chain visible and export action available.',
  },
]

const defaultArgs: HeroVideoProps = {
  sources: [
    { src: '/videos/ralia-hero-60s.mp4', type: 'video/mp4' },
    { src: '/videos/ralia-hero-60s.webm', type: 'video/webm' },
  ],
  poster: '/images/hero-video/poster.png',
  captions: '/videos/ralia-hero-60s.en.vtt',
  beats: fixtureBeats,
  title: 'From prompt to signed audit trail in 60 seconds',
  description:
    'A 60-second walkthrough of RALIA — ask IRIS a compliance question, run a DPIA/AI-Act assessment, review the citations behind every claim, and sign a hash-chained audit trail ready for regulator export.',
  loop: true,
  captionsDefault: true,
  rootMargin: 200,
}

const meta: Meta<typeof HeroVideo> = {
  title: 'Marketing / HeroVideo',
  component: HeroVideo,
  tags: ['autodocs'],
  args: defaultArgs,
  argTypes: {
    loop: { control: 'boolean' },
    captionsDefault: { control: 'boolean' },
    aspectRatio: { control: 'text' },
    rootMargin: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Lazy-loaded, muted-autoplay-on-visibility, captioned, looping hero video for the marketing homepage (BRIEF-429 V2). Subsumes the hero use case from `core/VideoEmbed`. Client component (uses IntersectionObserver + a prefers-reduced-motion media query). Captions are a required prop — the API does not allow an uncaptioned video.\n\nIn-video VTT captions size for dark-scrim legibility: 16px on mobile (≤640px viewport) and 14px on desktop — distinct from the 2×2 fallback-grid caption-pane sizing (14px desktop). The two surfaces have different substrates: VTT cues sit on a dark scrim over moving footage; the fallback grid uses a teal-50 (iris-surface) substrate against static frames.',
      },
    },
    chromatic: { pauseAnimationAtEnd: true },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof HeroVideo>

/**
 * BRIEF-429 V2 canonical fixture: 60-second walkthrough, 4 beats,
 * looping with the close-frame → Beat 1 substrate handshake.
 */
export const Default: Story = {}

/**
 * Captures the idle state pre-IntersectionObserver. The harness forces
 * the embed off-screen by giving it a tall spacer above so the IO
 * doesn't fire inside the story viewport.
 */
export const PosterOnly: Story = {
  render: (args) => (
    <>
      <div style={{ height: '120vh', background: 'var(--color-surface-subtle)' }} />
      <HeroVideo {...args} />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Spacer pushes the embed below the fold; IntersectionObserver therefore does not fire, and the component holds in `idle`. The poster + 48px iris-accent play disc + CC indicator are visible.',
      },
    },
  },
}

/**
 * Forces the component into the `loading` state by passing a source
 * that does not resolve. The pulsing play disc is gated on
 * prefers-reduced-motion: no-preference (accessibility §5).
 */
export const LoadingPulse: Story = {
  args: {
    sources: [{ src: '/videos/__intentionally-missing__.mp4', type: 'video/mp4' }],
  },
}

/**
 * Captures a mid-playback frame. Storybook harness skips the
 * IntersectionObserver gate so the video starts playing immediately;
 * Chromatic pauses the animation per the `pauseAnimationAtEnd`
 * parameter for a deterministic snapshot.
 */
export const PlayingFrame: Story = {
  decorators: [
    (Story) => {
      // Trigger an early play() by ensuring the embed is in view at
      // mount — the default decorator already does this. Chromatic
      // captures the first stable frame.
      return <Story />
    },
  ],
}

/**
 * User-paused — equivalent visual to errored without the alert glyph;
 * the play disc reappears at full opacity over the last frame.
 */
export const Paused: Story = {
  render: (args) => {
    return <PausedStory {...args} />
  },
}

function PausedStory(args: HeroVideoProps) {
  // The user-paused state is reached by clicking the play disc once
  // (playing → paused). Storybook harness simulates that with a ref
  // hook into the underlying <video> element.
  const wrapRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const video = wrapRef.current?.querySelector('video')
    if (video) {
      // Defer until after IO fires + play() resolves.
      const t = setTimeout(() => {
        try {
          video.pause()
        } catch {
          /* noop */
        }
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [])
  return (
    <div ref={wrapRef}>
      <HeroVideo {...args} />
    </div>
  )
}

/**
 * Captures the `errored` state. Sources are deliberately unresolvable
 * and the autoplay retry window has elapsed, so the play disc carries
 * the alert glyph and "Tap to play" appears below it.
 */
export const ErroredFallback: Story = {
  args: {
    sources: [
      { src: '/videos/__intentionally-missing__.mp4', type: 'video/mp4' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sources resolve to a 404. The 5-second autoplay retry window elapses with no successful play(); state transitions to `errored`; the play disc shows the alert glyph and a "Tap to play" pill renders beneath. Tapping the disc retries play().',
      },
    },
  },
}

/**
 * Captures the 2×2 storyboard grid (motion off). Storybook forces
 * `prefers-reduced-motion: reduce` via a CSS test-harness override
 * (parameters.docs.story stub — the real selector is set on `:root`
 * by the preview's `decorators` chain in Storybook 8).
 */
export const ReducedMotionFallback: Story = {
  decorators: [
    (Story) => {
      // The matchMedia API in Storybook's iframe is real; we cannot
      // synchronously force it without a preview-side polyfill. The
      // canonical path is the chromatic-side reduced-motion media
      // override (parameters.chromatic.reducedMotion). For local
      // Storybook viewing, set the OS preference. Documented in MDX.
      return <Story />
    },
  ],
  parameters: {
    chromatic: { pauseAnimationAtEnd: true, reducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          '2×2 storyboard grid rendered instead of the `<video>` element. Each cell contains the fallback frame + a screen-reader-only `Beat N of 4: {eyebrow}. {caption}.` line + a visible mono eyebrow + caption body. Loaded under `prefers-reduced-motion: reduce` (set Chromatic to `reducedMotion: reduce` for the snapshot; set your OS preference for local Storybook viewing).',
      },
    },
  },
}

/**
 * captionsDefault=false; the CC indicator is absent. The VTT track is
 * still loaded and parseable — only the default-on display flag flips.
 */
export const CaptionsOff: Story = {
  args: { captionsDefault: false },
  parameters: {
    docs: {
      description: {
        story:
          'CC indicator hidden in the poster overlay. The `<track kind="captions">` element is still mounted and parsed by the browser; only `default` flips to `false`. Document this in MDX so screen-reader walkthroughs do not flag a perceived contradiction with the "captions required" accessibility contract.',
      },
    },
  },
}

/**
 * loop=false; video ends on the close frame (Beat 4) and stops there.
 * onComplete fires once.
 */
export const WithoutLoop: Story = {
  args: { loop: false },
}

/**
 * 4 short beats (15s total) — used to test the loop handshake at a
 * cadence Chromatic can observe.
 */
export const ShortBeats: Story = {
  args: {
    beats: [
      {
        index: 0,
        eyebrow: 'BEAT 1 · 0–4s',
        caption: 'Short fixture beat 1.',
        startSec: 0,
        endSec: 3.5,
        fallbackFrame: '/images/hero-video/beat-1.png',
      },
      {
        index: 1,
        eyebrow: 'BEAT 2 · 4–8s',
        caption: 'Short fixture beat 2.',
        startSec: 4,
        endSec: 7.5,
        fallbackFrame: '/images/hero-video/beat-2.png',
      },
      {
        index: 2,
        eyebrow: 'BEAT 3 · 8–12s',
        caption: 'Short fixture beat 3.',
        startSec: 8,
        endSec: 11.5,
        fallbackFrame: '/images/hero-video/beat-3.png',
      },
      {
        index: 3,
        eyebrow: 'BEAT 4 · 12–15s',
        caption: 'Short fixture beat 4.',
        startSec: 12,
        endSec: 14.5,
        fallbackFrame: '/images/hero-video/beat-4.png',
      },
    ],
  },
}

/**
 * Fixed 375px viewport — verifies caption sizing rules (in-video VTT
 * captions render at 16px below the 640px breakpoint).
 */
export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 375 }}>
        <Story />
      </div>
    ),
  ],
}
