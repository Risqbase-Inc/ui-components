// R13 positive fixture: properly gated animation — must NOT be flagged.
import { useReducedMotion } from '../../../src/core/MotionProvider'
export function CleanSpinner() {
  const reduced = useReducedMotion()
  return <div className={reduced ? '' : 'animate-spin motion-reduce:animate-none'} />
}
