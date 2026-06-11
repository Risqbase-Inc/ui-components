import Link from 'next/link'
import { TelemetryBeacon } from '../TelemetryBeacon'
import type { FooterLink, FooterProps, FooterSection } from './types'

/**
 * Canonical marketing footer (v2.1.1).
 *
 * Ported from the marketing site's `MarketingFooter` (authoritative per CEO
 * directive 2026-05-20). Single shared surface across all RisqBase public
 * properties. Authed-product footers stay in-product.
 *
 * Tokens (see `tokens.md`): consumes the color.footer.* role tokens via
 * CSS custom properties — the v4.4 brand-mark PR-A sweep retired the
 * v2.1.1 raw utility classes and the inline web-font wordmark (the mark
 * is now the frozen brand-mark v3 outline, guarded by scanner rule R15).
 */

// ─── Default link map (canonical) ────────────────────────────────────────────
// Exported so downstream consumers can introspect / extend.

export const DEFAULT_PLATFORM_LINKS: FooterLink[] = [
  { label: 'Platform Overview', href: '/platform' },
  { label: 'AI Compliance', href: '/platform/ai-compliance' },
  { label: 'Privacy Compliance', href: '/platform/privacy-compliance' },
  { label: 'HorizonIris', href: '/platform/horizon-iris' },
  { label: 'Operations', href: '/platform/operations' },
]

export const DEFAULT_PRACTICE_LINKS: FooterLink[] = [
  { label: 'Practice Overview', href: '/practice' },
  { label: 'Practice Pricing', href: '/pricing/practice' },
  { label: 'Get Started', href: '/practice/get-started' },
]

export const DEFAULT_SOLUTIONS_LINKS: FooterLink[] = [
  { label: 'Solutions Overview', href: '/solutions' },
  { label: 'For DPOs', href: '/platform/privacy-compliance' },
  { label: 'For CISOs', href: '/platform/operations' },
  { label: 'For Consultancies', href: '/practice' },
  { label: 'For Legal Teams', href: '/platform/ai-compliance' },
  { label: 'For Enterprises', href: '/platform' },
]

export const DEFAULT_COMPANY_LINKS: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Founding Members', href: '/founding-members' },
  { label: 'Security', href: '/security' },
  { label: 'Contact', href: '/contact' },
]

export const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Governance', href: '/governance' },
  { label: 'Responsible AI', href: '/responsible-ai' },
  { label: 'Responsible Use', href: '/responsible-use' },
]

export const DEFAULT_SECTIONS: FooterSection[] = [
  { title: 'Platform', links: DEFAULT_PLATFORM_LINKS },
  { title: 'Practice', links: DEFAULT_PRACTICE_LINKS },
  { title: 'Solutions', links: DEFAULT_SOLUTIONS_LINKS },
  { title: 'Company', links: DEFAULT_COMPANY_LINKS },
  { title: 'Legal', links: DEFAULT_LEGAL_LINKS },
]

// Bottom-bar legal triad — always rendered (never filtered by hiddenLinks)
// since these pages MUST exist on any production marketing deployment for
// GDPR / consent reasons.
const BOTTOM_BAR_LEGAL: FooterLink[] = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function Footer({
  sections,
  hiddenLinks,
  tagline = 'Integrated compliance intelligence for digital regulation, privacy and AI governance teams.',
  copyrightHolder = 'RisqBase d.o.o.',
}: FooterProps = {}) {
  const currentYear = new Date().getFullYear()
  const hidden = new Set(hiddenLinks ?? [])

  // Apply hidden-link filtering. Empty sections collapse entirely.
  const visibleSections = (sections ?? DEFAULT_SECTIONS)
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => !hidden.has(link.href)),
    }))
    .filter((section) => section.links.length > 0)

  return (
    <>
      <TelemetryBeacon component="Footer" version="2.1.1" />
      <footer className="bg-[var(--color-footer-background)]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main row: brand left, nav columns right */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left: Brand + tagline */}
            <div className="lg:w-[280px] flex-shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-[var(--color-footer-logo)]"
                aria-label="RisqBase home"
              >
                {/* Brand mark v3 — frozen outline, identical geometry to public/mark.svg
                    (keep in sync); themes via currentColor from the footer-logo token. */}
                <svg
                  viewBox="0 0 160 160"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  className="h-6 w-6 shrink-0"
                >
                  <path d="M22.1 108V52.3h14.8l.3 11.2q1.7-5.9 4.9-8.6 3.2-2.6 8.4-2.6h5.1v12.9h-5.1q-6.6 0-9.7 2.7t-3.1 8.8V108zm39.2 15.6V34.2h15.3v89.4zm48.3-14.3q8.5 0 14.9-3.6t9.9-10.2 3.5-15.3q0-8.8-3.5-15.4t-9.9-10.2-14.9-3.6Q98.3 51 91 56.9q-7.4 5.8-8.7 16l16.1.7q.8-5.1 3.7-7.8 3-2.7 7.5-2.7 5.8 0 9 4.5 3.2 4.4 3.2 12.6 0 8.1-3.2 12.6t-9 4.5q-4.7 0-7.6-2.8t-3.6-8.3l-16.1.6q1.2 10.3 8.6 16.4 7.3 6.1 18.7 6.1"/>
                </svg>
                <span className="text-base font-semibold">RisqBase</span>
              </Link>
              <p className="text-xs text-[var(--color-footer-meta)] mt-4 leading-relaxed max-w-[240px]">{tagline}</p>
            </div>

            {/* Right: Nav columns */}
            {visibleSections.length > 0 && (
              <nav
                aria-label="Footer navigation"
                className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-8"
              >
                {visibleSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-[var(--color-footer-heading)] mb-3">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-[var(--color-footer-link-default)] hover:text-[var(--color-footer-link-hover)] transition-colors"
                            {...(link.external
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-footer-divider)] mt-12" />

          {/* Bottom bar: copyright + legal left, language selector right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs text-[var(--color-footer-meta)]">
                &copy; {currentYear} {copyrightHolder}
              </span>
              {BOTTOM_BAR_LEGAL.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--color-footer-link-default)] hover:text-[var(--color-footer-link-hover)] transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language indicator */}
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-footer-meta)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              English
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}

export type { FooterProps, FooterLink, FooterSection } from './types'
