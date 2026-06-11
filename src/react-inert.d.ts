// `inert` shipped in React 19 (the dev runtime here) but @types/react is
// pinned to 18, which doesn't know the prop yet. Gallery stories use it to
// take presentational duplicate instances out of BOTH the a11y tree and
// the tab order (aria-hidden alone leaves focusables reachable —
// axe aria-hidden-focus). Remove when @types/react@19 lands.
import 'react'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    inert?: boolean
  }
}
