'use client'

import { useEffect } from 'react'
import type { TelemetryBeaconProps } from './types'

// No-op stub for the adoption-telemetry contract (DS v4.3 §7.3, audit
// rows U4.2 / U4.3). Components emit mount events regardless of whether
// the collector is alive — instrument first, route later. Same pattern
// as Segment / Amplitude / OpenTelemetry.
//
// Behaviour today:
//   - production: no-op
//   - development with NEXT_PUBLIC_TELEMETRY_DEBUG=1: console.debug
//
// When the collector lands, it replaces the emit call with a real
// dispatch — no component code changes. The Beacon itself stays a
// client component so server-rendered primitives can keep their RSC
// posture (they just render `<TelemetryBeacon/>` as a child).

export function TelemetryBeacon({ component, version = '2.0.0', variant, meta }: TelemetryBeaconProps) {
  useEffect(() => {
    if (typeof process === 'undefined' || !process.env) return
    if (process.env.NODE_ENV === 'production') return
    if (process.env.NEXT_PUBLIC_TELEMETRY_DEBUG !== '1') return
    // eslint-disable-next-line no-console
    console.debug('[RBDS telemetry]', {
      component,
      version,
      variant,
      meta,
      ts: Date.now(),
    })
  }, [component, version, variant, meta])
  return null
}

export type { TelemetryBeaconProps } from './types'
