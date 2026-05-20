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
 * Tokens (see `tokens.md`):
 *   bg-stone-900 / text-gray-400 / text-indigo-400 / border-gray-800
 *   currently inline pixel values; semantic tokens consumed where present.
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
      <footer className="bg-stone-900" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main row: brand left, nav columns right */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left: Brand + tagline */}
            <div className="lg:w-[280px] flex-shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5"
                aria-label="RisqBase home"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <text
                    x="80"
                    y="120"
                    textAnchor="middle"
                    fontFamily="'Helvetica Neue', Arial, sans-serif"
                    fontSize="120"
                    fontWeight="700"
                    fill="#4F46E5"
                  >
                    r|ↄ
                  </text>
                </svg>
                <span className="text-base font-semibold text-indigo-400">RisqBase</span>
              </Link>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-[240px]">{tagline}</p>
            </div>

            {/* Right: Nav columns */}
            {visibleSections.length > 0 && (
              <nav
                aria-label="Footer navigation"
                className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-8"
              >
                {visibleSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-white mb-3">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
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
          <div className="border-t border-gray-800 mt-12" />

          {/* Bottom bar: copyright + legal left, language selector right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs text-gray-400">
                &copy; {currentYear} {copyrightHolder}
              </span>
              {BOTTOM_BAR_LEGAL.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language indicator */}
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
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
