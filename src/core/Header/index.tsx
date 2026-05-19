// `'use client'` removed in S1 cleanup — Header is purely presentational
// (no useState, no useEffect, no useRef, no browser APIs, no event
// handlers attached at render time). Re-add the directive if a future
// change introduces any client-only behaviour.

import Link from 'next/link'
import { TelemetryBeacon } from '../TelemetryBeacon'
import type { HeaderProps } from './types'

// Role tokens (spec §15.2; resolved values in dist/tokens.css). Two
// canonical neutral shifts vs v1.x light-mode pixels (flagged for S5
// baseline): `border-gray-100` → `border.subtle` (stone-100), and
// `text-gray-500`/`text-gray-600` → `text.subtle` (stone-500). Indigo
// values are unchanged.
const navLinkClasses =
  'text-[var(--color-header-nav-link-default)] hover:text-[var(--color-header-nav-link-hover)] transition-colors'

export function Header({ variant = 'risqbase', showLaunchDate = false }: HeaderProps) {
  const isRalia = variant === 'ralia'
  const logoText = isRalia ? 'RALIA' : 'RisqBase'
  const tagline = isRalia ? 'by RisqBase' : null

  return (
    <>
    <TelemetryBeacon component="Header" variant={variant} />
    <header className="bg-[var(--color-header-background)] border-b border-[var(--color-header-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[var(--color-header-logo)]">{logoText}</span>
            {tagline && <span className="text-[var(--color-header-tagline)] text-sm">{tagline}</span>}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isRalia ? (
              <>
                <Link href="/#features" className={navLinkClasses}>
                  Features
                </Link>
                <Link href="/pricing" className={navLinkClasses}>
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link href="/about" className={navLinkClasses}>
                  About
                </Link>
                <Link href="https://ralia.io" className={navLinkClasses}>
                  RALIA
                </Link>
                <Link href="/contact" className={navLinkClasses}>
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {showLaunchDate && (
              <span className="hidden sm:block text-sm text-[var(--color-header-launch-date)]">
                Launching July 2026
              </span>
            )}
            <Link
              href={isRalia ? '/login' : '/signin'}
              className={navLinkClasses}
            >
              {isRalia ? 'Log in' : 'Sign In'}
            </Link>
            <Link
              href={isRalia ? '/signup' : '/get-started'}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--color-header-cta-foreground)] bg-[var(--color-header-cta-background-default)] rounded-lg hover:bg-[var(--color-header-cta-background-hover)] transition-colors"
            >
              {isRalia ? 'Sign up' : 'Get Started'}
            </Link>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export type { HeaderProps, SiteVariant } from './types'
