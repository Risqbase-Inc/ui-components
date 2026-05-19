import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface PromptChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Prompt copy — the chip is the label. */
  children: ReactNode
  /** Optional leading icon (e.g. lightbulb). */
  icon?: ReactNode
}
