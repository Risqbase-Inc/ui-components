'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// Single-open invariant context (Spec 07-a11y §4). Tracks which
// dropdown is open by id. Each HeaderNavDropdown reads the context and
// self-closes when openId !== ownId.
//
// Default (no provider) lets dropdowns operate independently — handy
// for isolated Storybook stories.

interface HeaderDropdownContextValue {
  openId: string | null
  setOpenId: (id: string | null) => void
}

const HeaderDropdownContext = createContext<HeaderDropdownContextValue | null>(null)

export function HeaderDropdownProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const value = useMemo(() => ({ openId, setOpenId }), [openId])
  return <HeaderDropdownContext.Provider value={value}>{children}</HeaderDropdownContext.Provider>
}

export function useHeaderDropdown() {
  return useContext(HeaderDropdownContext)
}
