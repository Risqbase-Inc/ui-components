import Link from 'next/link'
import { FooterProps } from './types'

export function Footer({ variant = 'risqbase' }: FooterProps) {
  const logoText = variant === 'ralia' ? 'RALIA' : 'RisqBase'
  const tagline = variant === 'ralia' ? 'by RisqBase' : null

  return (
    <footer className="bg-gray-900">
      {/* Navigation Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href={variant === 'ralia' ? '/#features' : '/features'} className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://risqbase.com/about" className="text-gray-400 hover:text-white transition-colors">
                  About RisqBase
                </Link>
              </li>
              {variant === 'risqbase' && (
                <li>
                  <Link href="https://ralia.io/about" className="text-gray-400 hover:text-white transition-colors">
                    About RALIA
                  </Link>
                </li>
              )}
              {variant === 'ralia' && (
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About RALIA
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/governance" className="text-gray-400 hover:text-white transition-colors">
                  Governance
                </Link>
              </li>
              <li>
                <Link href="/responsible-ai" className="text-gray-400 hover:text-white transition-colors">
                  Responsible AI
                </Link>
              </li>
              <li>
                <Link href="/responsible-use" className="text-gray-400 hover:text-white transition-colors">
                  Responsible Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="mailto:support@risqbase.com" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                {logoText}
              </Link>
              {tagline && <span className="text-gray-500 ml-2">{tagline}</span>}
              <p className="text-gray-500 text-sm mt-1">
                © 2026 RisqBase d.o.o. All rights reserved.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-sm flex items-center">
                <span className="mr-1">🇪🇺</span> Made in the EU
              </span>
              <span className="text-gray-500 text-sm">
                EU AI Act Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
