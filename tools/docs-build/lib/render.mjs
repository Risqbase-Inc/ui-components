// Renderers: turn extracted data into the HTML fragments that templates
// expect. Kept separate from extractors so unit-testable in isolation.

import { escapeHtml } from './extractors.mjs'

/* ─────────────────────────── changelog ───────────────────────────────── */

// Renders changelog.html's <article> stream + <aside> nav. Matches the
// existing page's class structure (.entry, .head, .body) so styles.css
// untouched.

export function renderChangelogEntries(entries) {
  return entries.map(renderEntry).join('\n\n')
}

function renderEntry(e) {
  const pillClass = e.kind === 'unreleased' ? 'pill pill-deferred' : 'pill pill-new'
  const pillLabel = e.kind === 'unreleased' ? 'UNRELEASED' : e.version
  return `<article id="${escapeHtml(e.id)}" class="card entry" style="margin-bottom: 32px;">
  <div class="head">
    <div class="row">
      <div>
        <span class="${pillClass}" style="margin-bottom: 8px;"><i></i> ${escapeHtml(pillLabel)}</span>
        <h2>${escapeHtml(e.title)}</h2>
      </div>
      <div class="meta" style="text-align:right; align-self:flex-end;">
        ${e.date ? `<span>${escapeHtml(e.date)}</span>` : e.kind === 'unreleased' ? '<span>Unreleased</span>' : ''}
        ${e.version && e.kind === 'released' ? `${e.date ? '<span>·</span>' : ''}<span>v${escapeHtml(e.version)}</span>` : ''}
      </div>
    </div>
  </div>
  <div class="body">
    ${e.html}
  </div>
</article>`
}

export function renderChangelogNav(entries) {
  if (entries.length === 0) return '<li>No entries</li>'
  return entries
    .map(
      (e) =>
        `<li><a href="#${escapeHtml(e.id)}">${escapeHtml(e.date || (e.kind === 'released' ? 'v' + e.version : 'Unreleased'))} · ${escapeHtml(e.title)}</a></li>`,
    )
    .join('\n      ')
}

/* ─────────────────────────── components grid ─────────────────────────── */

// Renders a card per component. Domain folders are the source of truth;
// per-component metadata (one-line description, import path) is derived
// mechanically — no separate hand-maintained registry.

const DOMAIN_IMPORT_PATH = {
  core: '@risqbase-inc/ui-components/core',
  ai: '@risqbase-inc/ui-components/ai',
  'data-viz': '@risqbase-inc/ui-components/data-viz',
  marketing: '@risqbase-inc/ui-components/marketing',
}

export function renderComponentGrid(domain, components) {
  if (components.length === 0) {
    return `<p style="color: var(--color-text-subtle); font-size: 14px;">No components in <code>${escapeHtml(domain)}</code> yet — coming in a later release.</p>`
  }
  const cards = components
    .map(
      (name) => `
    <div class="card comp-card" id="${slugifyComponentId(name)}">
      <div class="preview" style="font-family: var(--font-mono); font-size: 13px; color: var(--color-text-subtle);">
        ${escapeHtml(name)}
      </div>
      <div class="meta">
        <h3>${escapeHtml(name)}</h3>
        <p><code>import { ${escapeHtml(name)} } from '${escapeHtml(DOMAIN_IMPORT_PATH[domain] || domain)}'</code></p>
      </div>
    </div>`,
    )
    .join('\n')
  return `<div class="card-grid cols-3" style="margin-top:24px;">${cards}\n  </div>`
}

export function renderComponentNav(components) {
  if (components.length === 0) return '<li><em>none yet</em></li>'
  return components
    .map((name) => `<li><a href="#${slugifyComponentId(name)}">${escapeHtml(name)}</a></li>`)
    .join('\n      ')
}

function slugifyComponentId(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/* ─────────────────────────── themes ──────────────────────────────────── */

// Human-readable theme list. Print is intentionally not in the Theme union
// (it's a print-media-query in tokens.css, not a `data-theme=` value).
const THEME_LABELS = {
  light: 'light',
  dark: 'dark',
  hc: 'HC',
}

export function renderThemeList(themes) {
  return themes.map((t) => THEME_LABELS[t] || t).join(' · ')
}
