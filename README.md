# @atoshniwal/ui

Personal UI component library built with React, Tailwind CSS, Framer Motion, and Radix UI primitives.

## Components

| Component | Description |
|---|---|
| `Button` | Multi-variant button (default, secondary, ghost, destructive, outline, link) with size options |
| `Input` | Styled text input with focus ring |
| `Label` | Form label wrapper |
| `Select` | Native `<select>` styled to match the design system |
| `Textarea` | Styled textarea |
| `Badge` | Inline pill / tag (default, secondary, outline variants) |
| `BottomSheet` | Spring-animated slide-up modal (Radix Dialog + Framer Motion) |
| `VoiceMicButton` | Microphone button wired to the Web Speech API |

## Hooks

| Hook | Description |
|---|---|
| `useVoiceInput` | Web Speech API wrapper — `toggle`, `stop`, `state`, `isSupported` |

## Utilities

| Export | Description |
|---|---|
| `cn` | `clsx` + `tailwind-merge` class combiner |
| `stringToHsl` | Deterministic HSL color from a string |
| `stringToHslPair` | Returns `{ bg, border, text }` HSL triplet for a string |
| `formatDate` | Locale date formatter (`en-IN`) |
| `getAge` | Integer age from a birth date string |

---

## Installation

```bash
# From local path (while developing)
npm install ../ui-kit

# or via npm once published
npm install @atoshniwal/ui
```

> The library ships **TypeScript source** (`src/`) — no build step required here.  
> Your project's bundler (Vite, Next.js, etc.) compiles it alongside your own code.

---

## Setup in a consuming project

### 1. Import the global CSS

In your app entry point (e.g. `main.tsx`):

```ts
import '@atoshniwal/ui/globals.css';
```

### 2. Configure Tailwind

Add the library's source to the Tailwind `content` list so its class names are included in your build:

```ts
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    // include library source so Tailwind doesn't purge the classes
    './node_modules/@atoshniwal/ui/src/**/*.{ts,tsx}',
  ],
  // ...
};
```

### 3. Alias resolution (Vite)

The library uses `@/` path aliases internally. Tell Vite to resolve them:

```ts
// vite.config.ts
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // your own aliases ...
      // point the library's @/ alias at its src/
      '@': resolve(__dirname, 'node_modules/@atoshniwal/ui/src'),
    },
  },
});
```

> If your project also uses `@/` for its own source, use a package-specific alias instead:
> ```ts
> '@atoshniwal/ui': resolve(__dirname, 'node_modules/@atoshniwal/ui/src'),
> ```
> and update the library imports accordingly.

---

## Usage

```tsx
import { Button, Input, Label, Badge, BottomSheet } from '@atoshniwal/ui';
import { useVoiceInput } from '@atoshniwal/ui';
import { cn, stringToHslPair, formatDate } from '@atoshniwal/ui';

// Basic form
<Label htmlFor="name">Name</Label>
<Input id="name" placeholder="Enter name" />
<Button variant="default">Submit</Button>

// Badge
<Badge variant="secondary">Active</Badge>

// Bottom sheet
<BottomSheet open={open} onClose={() => setOpen(false)} title="Edit Person">
  {/* ... */}
</BottomSheet>
```

---

## Design tokens

All colors and radius values are driven by CSS custom properties defined in `globals.css`. Override them in your own stylesheet to theme the components:

```css
:root {
  --primary: 221 83% 53%;   /* HSL values without hsl() wrapper */
  --radius: 0.75rem;
  /* ... */
}
```
