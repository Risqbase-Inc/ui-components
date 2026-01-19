# @risqbase-inc/ui-components

Shared UI components for RisqBase products.

## Installation

```bash
npm install @risqbase-inc/ui-components
```

## Tailwind Preset

Add the preset to your `tailwind.config.js`:

```javascript
const risqbasePreset = require('@risqbase-inc/ui-components/tailwind.preset')

module.exports = {
  presets: [risqbasePreset],
  // ... rest of your config
}
```

## Components

### Footer

```tsx
import { Footer } from '@risqbase-inc/ui-components'

<Footer variant="risqbase" />  // For risqbase.com
<Footer variant="ralia" />     // For ralia.io
```

### Header

```tsx
import { Header } from '@risqbase-inc/ui-components'

<Header variant="risqbase" showLaunchDate={true} />
<Header variant="ralia" />
```

### Button

```tsx
import { Button, PrimaryButton, SecondaryButton, GhostButton } from '@risqbase-inc/ui-components'

<Button variant="primary" size="lg" href="/signup">Get Started</Button>
<PrimaryButton>Submit</PrimaryButton>
<SecondaryButton>Cancel</SecondaryButton>
<GhostButton>Learn More</GhostButton>
```

### Badge

```tsx
import { Badge, MostPopularBadge, NewBadge } from '@risqbase-inc/ui-components'

<Badge variant="default">Custom</Badge>
<MostPopularBadge />
<NewBadge />
```

### SectionEyebrow

```tsx
import { SectionEyebrow } from '@risqbase-inc/ui-components'

<SectionEyebrow>Features</SectionEyebrow>
```

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
