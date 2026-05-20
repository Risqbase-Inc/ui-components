'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { hasCurrentChild, isCurrentPath } from './lib/isCurrent'
import { useHeaderDropdown } from './NavDropdownContext'
import type { NavGroup } from './types'

// Disclosure-pattern dropdown (Spec 07-a11y §1: NOT menu pattern).
// `<button aria-expanded>` trigger + hidden panel of `<a>` links.
//
// Behaviour (Spec 07 §4):
//  - Click trigger → toggle.
//  - Click outside → close.
//  - ESC → close + restore focus to trigger.
//  - Click link inside → close (link navigates).
//  - Click another open trigger → single-open invariant via context.
//
// Tab handling per Spec 07-a11y §2: native browser Tab traversal —
// not a focus trap. Tab from trigger moves to first link; Tab from
// last link leaves the panel without closing.
//
// Animation: 120ms fade-in + translateY. Suppressed under
// `prefers-reduced-motion: reduce` via CSS only.

export interface HeaderNavDropdownProps extends NavGroup {
  currentPath?: string
}

const triggerBase =
  'inline-flex items-center gap-1 text-[var(--color-header-nav-link-default)] hover:text-[var(--color-header-nav-link-hover)] transition-colors bg-transparent border-0 cursor-pointer p-0 font-inherit'

const triggerActive =
  'text-[var(--color-text-default)] border-b-2 border-[var(--color-action-primary)] pb-1'

const itemClasses =
  'block px-3 py-2 rounded-[var(--dimension-radius-md,6px)] text-sm font-medium text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:ring-offset-2'

const itemActive = 'underline underline-offset-2 decoration-2 decoration-[var(--color-action-primary)]'

export function HeaderNavDropdown({
  label,
  items,
  eyebrow,
  currentPath,
}: HeaderNavDropdownProps) {
  const reactId = useId()
  const ownId = `header-dropdown-${reactId}`
  const panelId = `${ownId}-panel`

  // Local open state — also wires into the optional single-open context
  // so two dropdowns can't be open simultaneously.
  const ctx = useHeaderDropdown()
  const [localOpen, setLocalOpen] = useState(false)
  const open = ctx ? ctx.openId === ownId : localOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (ctx) {
        ctx.setOpenId(next ? ownId : null)
      } else {
        setLocalOpen(next)
      }
    },
    [ctx, ownId],
  )

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const childHrefs = items.map((i) => i.href)
  const childIsCurrent = hasCurrentChild(childHrefs, currentPath)

  // ESC closes + restores focus to trigger.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Only consume the key if the active element is inside our
      // trigger or panel — avoids stealing ESC from sibling
      // overlays/modals (Spec 07-a11y §2.2).
      const active = document.activeElement
      const inside =
        (triggerRef.current && triggerRef.current.contains(active as Node | null)) ||
        (panelRef.current && panelRef.current.contains(active as Node | null))
      if (!inside) return
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, setOpen])

  // Outside-click closes (mousedown — Spec 07-a11y §3 explains why).
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, setOpen])

  const onToggle = () => setOpen(!open)
  const onItemClick = () => setOpen(false)

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={childIsCurrent ? 'page' : undefined}
        onClick={onToggle}
        className={childIsCurrent ? `${triggerBase} ${triggerActive}` : triggerBase}
      >
        <span>{label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          width={12}
          height={12}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 120ms ease-out',
          }}
        >
          <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        data-open={open ? 'true' : 'false'}
        // G4 FU-13 (HDR-3): `max-w` clamp prevents panel from overflowing
        // the right viewport edge at 375px (RALIA platform low-end
        // breakpoint) when a trigger sits near the right of the header.
        // 32px reserves the standard 16px gutter on each side. min-w
        // still wins inside the clamp.
        className="risqbase-header-dropdown-panel absolute left-0 mt-2 min-w-[240px] max-w-[calc(100vw-32px)] z-50"
        style={{
          background: 'var(--color-surface-default)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--dimension-radius-lg, 12px)',
          boxShadow: 'var(--shadow-floating)',
          padding: 12,
        }}
      >
        {/* Animation CSS — co-located so the component is drop-in. */}
        <style>{`
          .risqbase-header-dropdown-panel {
            opacity: 0;
            transform: translateY(-4px);
            transition: opacity 120ms ease-out, transform 120ms ease-out;
          }
          .risqbase-header-dropdown-panel[data-open='true'] {
            opacity: 1;
            transform: translateY(0);
          }
          @media (prefers-reduced-motion: reduce) {
            .risqbase-header-dropdown-panel { transition: none; }
          }
        `}</style>
        {eyebrow && (
          <p
            aria-hidden="true"
            className="m-0 mb-2"
            style={{
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-subtle)',
            }}
          >
            {eyebrow}
          </p>
        )}
        <ul role="list" className="m-0 p-0 list-none flex flex-col gap-0.5">
          {items.map((item) => {
            const active = isCurrentPath(item.href, currentPath)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={active ? `${itemClasses} ${itemActive}` : itemClasses}
                  aria-current={active ? 'page' : undefined}
                  onClick={onItemClick}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
