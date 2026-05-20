/**
 * Footer (canonical marketing) — public types.
 *
 * v2.1.1 supersedes the v2.0 `variant: 'risqbase' | 'ralia'` API. Authed-product
 * footers live in-product (e.g. RALIA's `AuthenticatedFooter`); this primitive
 * is the single source of truth for the public marketing surface.
 */

/**
 * One footer link entry.
 *
 * `external` opts into `target="_blank"` + `rel="noopener noreferrer"` for
 * off-site destinations. Defaults to internal Next.js routing.
 */
export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

/**
 * One grouped column under the nav grid.
 *
 * Heading renders as `<h3>` for screen-reader landmark traversal.
 */
export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterProps {
  /**
   * Override the default nav sections (Platform / Practice / Solutions / Company / Legal).
   * When omitted, the canonical marketing default ships.
   */
  sections?: FooterSection[]
  /**
   * Hrefs to suppress from the rendered footer — useful when a downstream
   * deployment hasn't yet shipped pages referenced by the canonical link map.
   *
   * Filtering is exact-match on `href`. Empty sections (all links hidden)
   * collapse entirely rather than rendering an orphan heading. The brand
   * column, copyright, and bottom-bar legal triad always render.
   *
   * @example
   * // Pre-launch marketing site that hasn't shipped Platform / Solutions / Pricing yet:
   * <Footer hiddenLinks={['/platform', '/platform/ai-compliance', '/solutions', '/pricing']} />
   */
  hiddenLinks?: string[]
  /**
   * Override the brand tagline shown beneath the wordmark.
   * Defaults to the canonical marketing copy.
   */
  tagline?: string
  /**
   * Override the copyright line. Defaults to the current year + `RisqBase d.o.o.`
   */
  copyrightHolder?: string
}
