/**
 * Theming — `data-theme` attribute on `<html>` swaps the active token set.
 *
 * Three modes (spec §15.2.1, plan D11): `light` | `dark` | `hc`.
 * Tokens live as CSS custom properties; `dist/tokens.css` defines the
 * defaults at `:root, [data-theme="light"]` and overrides at
 * `[data-theme="dark"]` / `[data-theme="hc"]`. PR #2 of S1 ships the
 * pipeline; values for dark + HC arrive in S4.
 *
 * Consumers do two things:
 *   1. Inline the `themeInitScript` constant in <head> as the very
 *      first script tag, so the active mode is applied before paint
 *      (no flash-of-wrong-theme on reload).
 *   2. Use `setTheme(theme)` from a settings UI.
 */

export type Theme = 'light' | 'dark' | 'hc'

export const THEME_STORAGE_KEY = 'risqbase-ds-theme'

/**
 * SSR-safe inline script. ≤30 lines, no dependencies, runs synchronously
 * in <head> before first paint. Reads `localStorage` (if a user picked a
 * theme) and falls back to `prefers-color-scheme` (no signal for HC at
 * the OS level today, so HC is opt-in via `setTheme`).
 *
 * Use as:
 *   import { themeInitScript } from '@risqbase-inc/ui-components/core'
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t!=='light'&&t!=='dark'&&t!=='hc')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`

/**
 * Change the active theme at runtime. Persists to localStorage so the
 * SSR-safe resolver picks it up on subsequent loads.
 *
 * Safe to call during SSR (no-op when `window` is undefined).
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode / quota exceeded — ignore; the in-memory swap below
    // still works for this session.
  }
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * Read the currently active theme. Returns `'light'` during SSR.
 */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const value = document.documentElement.getAttribute('data-theme')
  return value === 'dark' || value === 'hc' ? value : 'light'
}
