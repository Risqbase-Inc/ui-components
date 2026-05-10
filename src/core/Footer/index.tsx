import Link from 'next/link'
import type { FooterProps } from './types'

// Role tokens (spec §15.2; resolved values in dist/tokens.css). Canonical
// neutral shifts vs v1.x light-mode pixels (flagged for S5 baseline):
//   bg-gray-900     → surface.inverse        (stone-900)
//   text-gray-400   → text.on-inverse-subtle (stone-400)
//   text-gray-500   → text.on-inverse-subtle (stone-400)
//   border-gray-800 → border.inverse         (stone-700)
// Indigo logo and white heading values are unchanged.
const linkClasses =
  'text-[var(--color-footer-link-default)] hover:text-[var(--color-footer-link-hover)] transition-colors'
const headingClasses = 'text-[var(--color-footer-heading)] font-semibold mb-4'
const metaClasses = 'text-[var(--color-footer-meta)]'

export function Footer({ variant = 'risqbase' }: FooterProps) {
  const logoText = variant === 'ralia' ? 'RALIA' : 'RisqBase'
  const tagline = variant === 'ralia' ? 'by RisqBase' : null

  return (
    <footer className="bg-[var(--color-footer-background)]">
      {/* Navigation Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product Column */}
          <div>
            <h3 className={headingClasses}>Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href={variant === 'ralia' ? '/#features' : '/features'} className={linkClasses}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={linkClasses}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className={headingClasses}>Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://risqbase.com/about" className={linkClasses}>
                  About RisqBase
                </Link>
              </li>
              {variant === 'risqbase' && (
                <li>
                  <Link href="https://ralia.io/about" className={linkClasses}>
                    About RALIA
                  </Link>
                </li>
              )}
              {variant === 'ralia' && (
                <li>
                  <Link href="/about" className={linkClasses}>
                    About RALIA
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className={linkClasses}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className={headingClasses}>Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://risqbase.com/privacy" className={linkClasses}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/terms" className={linkClasses}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/cookies" className={linkClasses}>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/security" className={linkClasses}>
                  Security
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/governance" className={linkClasses}>
                  Governance
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/responsible-ai" className={linkClasses}>
                  Responsible AI
                </Link>
              </li>
              <li>
                <Link href="https://risqbase.com/responsible-use" className={linkClasses}>
                  Responsible Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className={headingClasses}>Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className={linkClasses}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="mailto:support@risqbase.com" className={linkClasses}>
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-footer-divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold text-[var(--color-footer-logo)]">
                {logoText}
              </Link>
              {tagline && <span className={`${metaClasses} ml-2`}>{tagline}</span>}
              <p className={`${metaClasses} text-sm mt-1`}>
                © 2026 RisqBase d.o.o. All rights reserved.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              <span className={`${metaClasses} text-sm flex items-center`}>
                <span className="mr-1">🇪🇺</span> Made in the EU
              </span>
              <span className={`${metaClasses} text-sm`}>
                EU AI Act Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export type { FooterProps } from './types'
