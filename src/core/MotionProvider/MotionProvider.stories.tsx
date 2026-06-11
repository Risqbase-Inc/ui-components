import type { Meta, StoryObj } from '@storybook/react'
import { MotionProvider, setMotionPreference, useReducedMotion } from './'
import { Button } from '../Button'
import { Skeleton } from '../Skeleton'
import { Toast } from '../Toast'
import { IrisThinking } from '../../ai/IrisThinking'
import { StreamingText } from '../../ai/StreamingText'

const meta: Meta<typeof MotionProvider> = {
  title: 'Core / MotionProvider',
  component: MotionProvider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof MotionProvider>

function PreferenceReadout() {
  const reduced = useReducedMotion()
  return (
    <p style={{ margin: 0, fontSize: 14 }}>
      Resolved preference: <strong>{reduced ? 'reduced' : 'full'}</strong>
    </p>
  )
}

// The documented toggle pattern (docs/recipes/motion-preference.md):
// explicit user choice → localStorage → every provider re-resolves live.
export const UserOverride: Story = {
  render: () => (
    <MotionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
        <PreferenceReadout />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={() => setMotionPreference('full')}>
            Full motion
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setMotionPreference('reduced')}>
            Reduce motion
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setMotionPreference(null)}>
            Use system setting
          </Button>
        </div>
        <Skeleton variant="card" />
        <IrisThinking />
      </div>
    </MotionProvider>
  ),
}

// --- each migrated primitive under a story-level forced preference ---

export const ReducedSkeleton: Story = {
  render: () => (
    <MotionProvider forcedPreference="reduced">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
        <Skeleton variant="row" />
        <Skeleton variant="card" />
        <Skeleton variant="circle" />
      </div>
    </MotionProvider>
  ),
}

export const ReducedIrisThinking: Story = {
  render: () => (
    <MotionProvider forcedPreference="reduced">
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <IrisThinking size="sm" />
        <IrisThinking size="md" />
        <IrisThinking size="lg" />
      </div>
    </MotionProvider>
  ),
}

export const ReducedStreamingText: Story = {
  render: () => (
    <MotionProvider forcedPreference="reduced">
      <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
        {/* All tokens reveal immediately; no streamhead cursor. */}
        <StreamingText
          tokens={'Records of processing activities under GDPR Art. 30 must be maintained.'.split(' ')}
        />
      </p>
    </MotionProvider>
  ),
}

export const ReducedToast: Story = {
  render: () => (
    <MotionProvider forcedPreference="reduced">
      <Toast
        toast={{
          id: 't-reduced',
          intent: 'success',
          title: 'Saved',
          description: 'No entrance animation under reduced motion.',
        }}
        onDismiss={() => undefined}
      />
    </MotionProvider>
  ),
}
