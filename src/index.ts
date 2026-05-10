// Root barrel — re-exports every domain so v1.x consumers
// (`import { Button } from '@risqbase-inc/ui-components'`) keep working
// without any changes on their side. v4.2 also exposes per-domain
// sub-path imports per spec §22.2: `@risqbase-inc/ui-components/{core,
// ai, data-viz, content, tokens}`.

export * from './core'
export * from './ai'
export * from './data-viz'
export * from './content'
export * from './tokens'
