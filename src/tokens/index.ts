// Tokens domain — TypeScript exports of design tokens (spec §15.1).
//
// `./generated` is emitted by `npm run build:tokens` (Style Dictionary
// + tools/tokens-build/index.js) from /tokens/**/*.json. The build chain
// runs tokens first, then tsup, so `generated.ts` is always present
// when the package is published.
//
// Consumers:
//   import { tokens } from '@risqbase-inc/ui-components/tokens'
//   tokens.color.brand.indigo[600] // "#4F46E5"

export { tokens } from './generated'
export type { Tokens } from './generated'
