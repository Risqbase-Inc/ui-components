// Path-matching helper for aria-current. Exported for testing and to
// keep the matching logic in one place per Spec 07-a11y §6.
//
// Rules:
//   - Exact match → current
//   - Prefix match (currentPath starts with `${href}/`) → current
//     (covers parent-of-current convention)
//   - href === '/' only matches the exact root path (otherwise every
//     pathname would match '/')
//   - href === '' → never matches

export function isCurrentPath(href: string, currentPath: string | undefined): boolean {
  if (!currentPath || !href) return false
  if (href === currentPath) return true
  if (href === '/') return currentPath === '/'
  // External URLs (e.g. https://ralia.io) never match.
  if (/^https?:\/\//i.test(href)) return false
  // Same-prefix path-segment match.
  return currentPath.startsWith(`${href}/`)
}

/**
 * Does any link within the group match the current path? Used by the
 * dropdown trigger to know whether to render aria-current="page" /
 * the active underline as the "parent of current" indicator.
 */
export function hasCurrentChild(
  hrefs: readonly string[],
  currentPath: string | undefined,
): boolean {
  if (!currentPath) return false
  return hrefs.some((h) => isCurrentPath(h, currentPath))
}
