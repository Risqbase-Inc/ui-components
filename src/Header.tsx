'use client'

import Link from 'next/link'
import { HeaderProps } from './types'

export function Header({ variant = 'risqbase', showLaunchDate = false }: HeaderProps) {
  const isRalia = variant === 'ralia'
  const logoText = isRalia ? 'RALIA' : 'RisqBase'
  const tagline = isRalia ? 'by RisqBase' : null
  const homeUrl = isRalia ? 'https://ralia.io' : 'https://risqbase.com'

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600">{logoText}</span>
            {tagline && <span className="text-gray-500 text-sm">{tagline}</span>}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isRalia ? (
              <>
                <Link href="/#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  About
                </Link>
                <Link href="https://ralia.io" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  RALIA
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {showLaunchDate && (
              <span className="hidden sm:block text-sm text-gray-500">
                Launching July 2026
              </span>
            )}
            <Link
              href={isRalia ? '/login' : '/signin'}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {isRalia ? 'Log in' : 'Sign In'}
            </Link>
            <Link
              href={isRalia ? '/signup' : '/get-started'}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isRalia ? 'Sign up' : 'Get Started'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
