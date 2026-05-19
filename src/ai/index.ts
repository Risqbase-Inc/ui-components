// AI — Layer-2 domain primitives for AI surfaces (spec §3, v4.3 §5.2).
//
// The components here are public, MIT-licensed building blocks. The
// *characters* that consume them — Iris in RALIA, and any future
// character in Cortex — are product configurations (Layer 3) and
// remain in their respective product repos.

export { CitationChip } from './CitationChip'
export { IrisThinking } from './IrisThinking'
export { StreamingText } from './StreamingText'
export { PromptChip } from './PromptChip'
export { ClientScopeBanner } from './ClientScopeBanner'

export type { CitationChipProps, CitationVariant } from './CitationChip/types'
export type { IrisThinkingProps, IrisThinkingSize } from './IrisThinking/types'
export type { StreamingTextProps } from './StreamingText/types'
export type { PromptChipProps } from './PromptChip/types'
export type { ClientScopeBannerProps, ClientScopeState } from './ClientScopeBanner/types'
