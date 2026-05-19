export type IrisThinkingSize = 'sm' | 'md' | 'lg'

export interface IrisThinkingProps {
  size?: IrisThinkingSize
  /** Accessible label — defaults to "Thinking". */
  label?: string
  className?: string
}
