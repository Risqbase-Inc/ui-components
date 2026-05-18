// Root barrel — re-exports every domain so v1.x consumers
// (`import { Button } from '@risqbase-inc/ui-components'`) keep working
// without any changes on their side. v2.0 (DS v4.3 §9.2) soft-deprecates
// the root barrel; in dev builds we emit a console warning recommending
// migration to domain barrels. Removal target: v5.0.

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
  // Once-per-process dev warning. Wrapped in a global flag check so HMR
  // / multi-import scenarios don't spam the console.
  const g = globalThis as unknown as { __RBDS_ROOT_BARREL_WARNED__?: boolean }
  if (!g.__RBDS_ROOT_BARREL_WARNED__) {
    g.__RBDS_ROOT_BARREL_WARNED__ = true
    // eslint-disable-next-line no-console
    console.warn(
      '[@risqbase-inc/ui-components] The root barrel is soft-deprecated as of v2.0 (DS v4.3 §9.2). ' +
        'Prefer domain imports: @risqbase-inc/ui-components/core, /ai, /data-viz, /tokens. ' +
        'Root-barrel imports are scheduled for removal in v5.0.'
    )
  }
}

export * from './core'
export * from './ai'
export * from './data-viz'
export * from './content'
export * from './tokens'
