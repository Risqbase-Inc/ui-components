# UI Components Library - Claude Memory File

> **Purpose**: Persistent memory for Claude Code sessions on the shared UI components library.
> **Last Updated**: 2026-02-03
> **Current Version**: 1.2.0
> **Package**: `@risqbase-inc/ui-components`

---

## PROJECT OVERVIEW

**Name**: RisqBase UI Components
**Repository**: `Risqbase-Inc/ui-components`
**Package**: `@risqbase-inc/ui-components`
**Registry**: GitHub npm (npm.pkg.github.com)
**License**: MIT (public)

### What This Library Does

A shared UI component library for all RisqBase products providing:
1. **Header** - Consistent site header with navigation
2. **Footer** - Consistent site footer
3. **Buttons** - Primary, Secondary, Ghost button variants
4. **Badges** - Labels and status indicators
5. **Typography** - Section eyebrows and text components
6. **Tailwind Preset** - Brand colours and typography

---

## TEAM ROSTER (RELEVANT)

| Name | Role | Quality Gate | Relevance |
|------|------|--------------|-----------|
| **Elena Vasquez** | Principal Designer | G4 - UX | Design system owner |
| **Alex Chen** | Technical Lead | G1 - Architecture | Code review, architecture |
| **Priya Sharma** | Frontend Specialist | Reports to Alex | UI implementation |
| **Fiyin Adeleke** | CEO | G7 - Final Approval | Design approvals |

---

## TECH STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.x | Type safety |
| React | 18+ | Peer dependency |
| Next.js | 13+ | Peer dependency |
| tsup | 8.x | Build tool |

### Package Configuration

```json
{
  "name": "@risqbase-inc/ui-components",
  "version": "1.2.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist", "tailwind.preset.js"],
  "peerDependencies": {
    "next": ">=13.0.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

---

## DESIGN SYSTEM COMPLIANCE

**Reference Document**: GOV-DS-2026-01
**Location**: `/Users/fiyinfoluwaadeleke/Documents/risqbase-com/docs/DESIGN-SYSTEM-BASELINE.md`
**Status**: MANDATORY - NO DEVIATIONS PERMITTED

### Brand Colours (Tailwind Preset)

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Primary | `#4F46E5` | `indigo-600` | Logos, CTAs, links |
| Primary Hover | `#4338CA` | `indigo-700` | Hover states |
| Primary Light | `#E0E7FF` | `indigo-100` | Icon backgrounds |

### PROHIBITED Colours

- `blue-600` - NOT our brand
- `blue-500` - NOT our brand
- `gray-900` for logos - Logos MUST be `indigo-600`

### Typography

Font: Geist Sans (configured via preset)

---

## COMPONENTS

### Header

```tsx
import { Header } from '@risqbase-inc/ui-components'

// For risqbase.com
<Header variant="risqbase" showLaunchDate={true} />

// For ralia.io
<Header variant="ralia" />
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'risqbase' \| 'ralia'` | `'risqbase'` | Which site variant |
| `showLaunchDate` | `boolean` | `false` | Show launch date banner |

**File**: `/src/Header.tsx`

### Footer

```tsx
import { Footer } from '@risqbase-inc/ui-components'

// For risqbase.com
<Footer variant="risqbase" />

// For ralia.io
<Footer variant="ralia" />
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'risqbase' \| 'ralia'` | `'risqbase'` | Which site variant |

**File**: `/src/Footer.tsx`

### Button

```tsx
import { Button, PrimaryButton, SecondaryButton, GhostButton } from '@risqbase-inc/ui-components'

<Button variant="primary" size="lg" href="/signup">Get Started</Button>
<PrimaryButton>Submit</PrimaryButton>
<SecondaryButton>Cancel</SecondaryButton>
<GhostButton>Learn More</GhostButton>
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `href` | `string` | - | If provided, renders as link |
| `children` | `ReactNode` | - | Button content |

**File**: `/src/Button.tsx`

### Badge

```tsx
import { Badge, MostPopularBadge, NewBadge } from '@risqbase-inc/ui-components'

<Badge variant="default">Custom</Badge>
<Badge variant="most-popular">Most Popular</Badge>
<Badge variant="new">New</Badge>
<Badge variant="coming-soon">Coming Soon</Badge>

// Shorthand components
<MostPopularBadge />
<NewBadge />
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'most-popular' \| 'new' \| 'coming-soon'` | `'default'` | Badge style |
| `children` | `ReactNode` | - | Badge content |

**File**: `/src/Badge.tsx`

### SectionEyebrow

```tsx
import { SectionEyebrow } from '@risqbase-inc/ui-components'

<SectionEyebrow>Features</SectionEyebrow>
```

**Styling**: `text-indigo-600 font-semibold text-sm uppercase tracking-wider`

**File**: `/src/SectionEyebrow.tsx`

---

## FILE STRUCTURE

```
/src/
├── Badge.tsx           # Badge component
├── Button.tsx          # Button components
├── Footer.tsx          # Footer component
├── Header.tsx          # Header component
├── SectionEyebrow.tsx  # Section eyebrow component
├── types.ts            # TypeScript types
└── index.ts            # Exports

/dist/                  # Built output (do not edit)
├── index.js            # CommonJS build
├── index.mjs           # ES Module build
└── index.d.ts          # Type definitions

tailwind.preset.js      # Tailwind configuration preset
```

---

## TAILWIND PRESET

**File**: `/tailwind.preset.js`

```javascript
const risqbasePreset = require('@risqbase-inc/ui-components/tailwind.preset')

module.exports = {
  presets: [risqbasePreset],
  // ... rest of your config
}
```

### What the Preset Includes

- Brand colours (indigo-600 as primary)
- Font family (Inter / Geist Sans)
- Standard spacing and sizing

---

## DEVELOPMENT

### Setup

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Watches for changes and rebuilds automatically.

### Build

```bash
npm run build
```

Outputs to `/dist/` directory.

### Lint

```bash
npm run lint
```

---

## PUBLISHING

### Prerequisites

1. Ensure `.npmrc` has GitHub Packages authentication
2. Bump version in `package.json`
3. Build the package

### Publish

```bash
npm run build
npm publish
```

### Registry

Published to GitHub Packages: `https://npm.pkg.github.com`

### Consuming Projects

Projects need `.npmrc` with:

```
@risqbase-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

---

## RELATED REPOSITORIES

| Repository | Purpose | Uses This Package |
|------------|---------|-------------------|
| `Risqbase-Inc/Ralia` | RALIA platform (ralia.io) | Yes |
| `Risqbase-Inc/RisqBase` | Marketing website (risqbase.com) | Yes |
| `Risqbase-Inc/internal-tools` | Cortex (cortex.risqbase.com) | Yes |

---

## KEY FILES

| Purpose | Location |
|---------|----------|
| This Memory File | `/CLAUDE.md` |
| Package Config | `/package.json` |
| Main Exports | `/src/index.ts` |
| Type Definitions | `/src/types.ts` |
| Tailwind Preset | `/tailwind.preset.js` |
| README | `/README.md` |

---

## VERSIONING

### Current Version: 1.2.0

When making changes:
1. **Patch** (1.2.x): Bug fixes, no API changes
2. **Minor** (1.x.0): New features, backwards compatible
3. **Major** (x.0.0): Breaking changes

### Update Checklist

1. Make changes in `/src/`
2. Run `npm run lint`
3. Run `npm run build`
4. Test locally in consuming project
5. Bump version in `package.json`
6. Commit and push
7. Publish: `npm publish`
8. Update consuming projects

---

## APPROVAL CHAIN

All design changes require:
1. Elena Vasquez (G4 - UX) - Design review
2. Alex Chen (G1 - Architecture) - Code review
3. Fiyin Adeleke (G7) - For breaking changes only

---

## SESSION NOTES

_Use this section to leave notes for future sessions_

### 2026-02-03

- Created CLAUDE.md memory file for ui-components library
- Documented all components and their props
- Documented publishing workflow
- Noted GOV-DS-2026-01 as authoritative design system

---

*End of Memory File*
