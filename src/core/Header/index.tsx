// Header is purely presentational: no useState, no useEffect, no useRef,
// no browser APIs in this file. The v2.1.0 dropdown additions live in
// `./NavDropdown.tsx` (a 'use client' island gated to the dropdown
// sub-tree only) and in `./NavDropdownContext.tsx` (also client). The
// surrounding chrome stays server-rendered per Spec 07 §2.3 +
// cover §2.3.
//
// Re-add 'use client' to this file ONLY if a future change introduces
// client behaviour to the chrome itself.

import Link from 'next/link'
import { TelemetryBeacon } from '../TelemetryBeacon'
import { HeaderNavDropdown } from './NavDropdown'
import { HeaderDropdownProvider } from './NavDropdownContext'
import { HeaderNavLink } from './NavLink'
import type { HeaderProps, NavEntry, NavGroup, SiteVariant } from './types'

// Default nav entries per variant. Back-compat surface for v1.x / v2.0
// consumers who do not pass `navEntries`.
const defaultEntries: Record<SiteVariant, NavEntry[]> = {
  risqbase: [
    { label: 'About', href: '/about' },
    { label: 'RALIA', href: 'https://ralia.io' },
    { label: 'Contact', href: '/contact' },
  ],
  ralia: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
  ],
}

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry && Array.isArray((entry as { items?: unknown }).items)
}

export function Header({
  variant = 'risqbase',
  showLaunchDate = false,
  navEntries,
  currentPath,
}: HeaderProps) {
  const isRalia = variant === 'ralia'
  const logoText = isRalia ? 'RALIA' : 'RisqBase'
  const tagline = isRalia ? 'by RisqBase' : null
  const entries = navEntries ?? defaultEntries[variant]
  // Wrap nav in the dropdown provider only when at least one entry is a
  // group — keeps the provider (and its 'use client' boundary) out of
  // the tree for pure-link headers (v2.0.0 callers).
  const needsProvider = entries.some(isNavGroup)

  const navContent = (
    <nav className="hidden md:flex items-center space-x-8">
      {entries.map((entry) =>
        isNavGroup(entry) ? (
          <HeaderNavDropdown
            key={`group:${entry.label}`}
            label={entry.label}
            items={entry.items}
            eyebrow={entry.eyebrow}
            currentPath={currentPath}
          />
        ) : (
          <HeaderNavLink
            key={`link:${entry.href}`}
            label={entry.label}
            href={entry.href}
            currentPath={currentPath}
          />
        ),
      )}
    </nav>
  )

  return (
    <>
      <TelemetryBeacon component="Header" variant={variant} />
      <header className="bg-[var(--color-header-background)] border-b border-[var(--color-header-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[var(--color-header-logo)]">{logoText}</span>
              {tagline && (
                <span className="text-[var(--color-header-tagline)] text-sm">{tagline}</span>
              )}
            </Link>

            {/* Navigation */}
            {needsProvider ? (
              <HeaderDropdownProvider>{navContent}</HeaderDropdownProvider>
            ) : (
              navContent
            )}

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {showLaunchDate && (
                <span className="hidden sm:block text-sm text-[var(--color-header-launch-date)]">
                  Launching July 2026
                </span>
              )}
              <Link
                href={isRalia ? '/login' : '/signin'}
                className="text-[var(--color-header-nav-link-default)] hover:text-[var(--color-header-nav-link-hover)] transition-colors"
              >
                {isRalia ? 'Log in' : 'Sign In'}
              </Link>
              <Link
                href={isRalia ? '/signup' : '/get-started'}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--color-header-cta-foreground)] bg-[var(--color-header-cta-background-default)] rounded-full hover:bg-[var(--color-header-cta-background-hover)] transition-colors"
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

export type { HeaderProps, NavEntry, NavGroup, NavLink, SiteVariant } from './types'
