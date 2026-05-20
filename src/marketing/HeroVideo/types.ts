// HeroVideo TypeScript API — verbatim from docs/specs/v2.1.0/02-HeroVideo.md §2.

/**
 * Beat metadata. Four beats are required for the 2×2 reduced-motion
 * fallback grid. Each beat owns one quadrant in the grid and one cue
 * range in the VTT track.
 */
export interface HeroVideoBeat {
  /** Beat index (0-based); also the index into the 2×2 fallback grid. */
  index: 0 | 1 | 2 | 3
  /** Mono eyebrow shown above the caption body (e.g. "BEAT 1 · 0–15s"). */
  eyebrow: string
  /** Caption body line — the narrative carrier when muted-autoplay is the playback mode. */
  caption: string
  /** Start time in seconds. */
  startSec: number
  /** End time in seconds. */
  endSec: number
  /** Path to the static fallback frame image (16:9 PNG/WebP). */
  fallbackFrame: string
  /**
   * Plain-text alternative for the fallback frame; used by screen readers
   * when motion is off. Defaults to the empty string (decorative — the
   * sr-only beat caption already carries the meaning).
   */
  fallbackAlt?: string
}

export interface HeroVideoSource {
  src: string
  type: 'video/mp4' | 'video/webm' | string
}

export type HeroVideoState =
  /** Before IntersectionObserver fires. Poster + iris-surface scrim visible. */
  | 'idle'
  /** Muted-autoplay request in flight. */
  | 'loading'
  /** Video is playing. */
  | 'playing'
  /** User-paused (poster + centred play disc reappears). */
  | 'paused'
  /** Load failed or autoplay denied beyond retry window; "Tap to play" affordance shown. */
  | 'errored'
  /** prefers-reduced-motion: reduce active on mount — 2×2 fallback grid shown, no video element. */
  | 'reduced-motion'
  /** Transient — fires alongside onLoopRestart at the loop boundary; resolves to 'playing' next frame. */
  | 'looped'

export interface HeroVideoProps {
  /** One or more sources for `<video>` children. */
  sources: HeroVideoSource[]
  /** Poster image (16:9). Shown before lazy-load fires + on error + as VTT poster cue. */
  poster: string
  /** WebVTT caption track URL — required, not optional (per accessibility contract §1). */
  captions: string
  /** Beat metadata; exactly 4 beats required for the storyboard fallback grid. */
  beats: [HeroVideoBeat, HeroVideoBeat, HeroVideoBeat, HeroVideoBeat]
  /** Title (used for aria-label + fallback figcaption). */
  title: string
  /** Plain-language description used by SR users and motion-reduced viewers. */
  description: string
  /** Loop forever (default true). When false, video stops on the close frame. */
  loop?: boolean
  /**
   * Margin (px) added around the embed when IntersectionObserver decides
   * to start loading. Default 200 — lets the video begin loading just
   * before it enters the viewport.
   */
  rootMargin?: number
  /**
   * Aspect ratio override; default '16/9'. Marketing has no use case for
   * non-16:9 today but the prop is here so future product surfaces can
   * reuse the wrapper.
   */
  aspectRatio?: string
  /** Show captions on by default (browser-respected). Default: true. */
  captionsDefault?: boolean
  /** Fires on each successful play() — including loop restarts. */
  onPlay?: () => void
  /** Fires when the video pauses (user-initiated or browser-initiated). */
  onPause?: () => void
  /**
   * Fires on every native `timeupdate` event (browser cadence, typically
   * ~250ms). Spec §8 Q4 recommendation: pass through raw; consumers
   * throttle if they need a coarser cadence.
   */
  onProgress?: (currentSec: number) => void
  /** Fires when the video reaches its end (only meaningful when loop=false). */
  onComplete?: () => void
  /**
   * Fires at the exact frame boundary when a loop restarts. Consumers
   * synchronising sibling animations (e.g. an ArcDecoration timed to the
   * close-frame substrate handshake — spec §3.5) hook in here.
   */
  onLoopRestart?: () => void
  className?: string
}
