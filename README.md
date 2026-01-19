# @risqbase-inc/ui-components

Shared UI components for RisqBase products.

## Installation

```bash
npm install @risqbase-inc/ui-components
```

## Usage

```tsx
import { Footer } from '@risqbase-inc/ui-components'

// For risqbase.com
<Footer variant="risqbase" />

// For ralia.io
<Footer variant="ralia" />
```

## Components

### Footer

The shared footer component used across all RisqBase properties.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'risqbase' \| 'ralia' | 'risqbase' | Which site variant to render |

## Development

```bash
npm install
npm run dev
```

## Publishing

```bash
npm run build
npm publish
```
