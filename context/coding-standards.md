# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types — use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused — one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions (contact form, newsletter, etc.)
- Fetch Sanity data directly in server components using GROQ queries
- Dynamic routes for service pages
- Static generation for all pages (ISR with Sanity webhook revalidation)

## Sanity CMS

- All user-facing content comes from Sanity — no hardcoded copy in components
- GROQ queries live in `src/lib/sanity/queries.ts`
- Sanity client config in `src/lib/sanity/client.ts`
- Type definitions generated from Sanity schema or manually maintained in `src/types/sanity.ts`
- Image URLs built with Sanity's image URL builder — never construct CDN URLs manually
- Portable Text rendered with `@portabletext/react` for rich text fields
- Schema files live in the `sanity/` directory at project root (Sanity Studio embedded in the Next.js project)

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for all colors, fonts, and spacing tokens
- No JavaScript-based Tailwind config allowed

### Theme token system

All three design themes (Hearthstone, Prairie Modern, Farmstead Blue) are defined as CSS custom property sets. Components use semantic token names, never raw hex values.

```css
@import "tailwindcss";

@theme {
  --color-primary: var(--theme-primary);
  --color-accent: var(--theme-accent);
  --color-surface: var(--theme-surface);
  --color-surface-alt: var(--theme-surface-alt);
  --color-text: var(--theme-text);
  --color-text-muted: var(--theme-text-muted);
  --font-heading: var(--theme-font-heading);
  --font-body: var(--theme-font-body);
}
```

- **Never use hardcoded color values** in components — always reference semantic tokens
- Theme switching is handled by swapping a `data-theme` attribute on `<html>` which activates the corresponding CSS custom property set
- The dev-only theme toggle widget is conditionally rendered based on `NEXT_PUBLIC_SHOW_THEME_TOGGLE`

## File Organization

```
src/
├── app/                          # Next.js app router pages
│   ├── (site)/                   # Main site route group
│   │   ├── page.tsx              # Homepage
│   │   ├── services/
│   │   │   ├── daycare/page.tsx
│   │   │   ├── boarding/page.tsx
│   │   │   ├── grooming/page.tsx
│   │   │   └── cats/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── about/page.tsx
│   │   ├── new-clients/page.tsx
│   │   ├── contact/page.tsx
│   │   └── webcams/page.tsx      # Conditional
│   ├── layout.tsx
│   └── globals.css               # Tailwind v4 config + theme tokens
├── components/
│   ├── layout/                   # Header, Footer, Nav, MobileMenu
│   ├── sections/                 # Page sections (Hero, ServiceCards, Stats, etc.)
│   ├── ui/                       # Reusable primitives (Button, Card, Accordion, etc.)
│   └── dev/                      # Dev-only components (ThemeToggle)
├── lib/
│   ├── sanity/
│   │   ├── client.ts             # Sanity client configuration
│   │   ├── queries.ts            # All GROQ queries
│   │   └── image.ts              # Image URL builder helper
│   ├── utils.ts                  # General utilities
│   └── constants.ts              # Site-wide constants
├── types/
│   └── sanity.ts                 # TypeScript types for Sanity documents
└── styles/
    └── themes/                   # Theme-specific CSS custom property sets
        ├── hearthstone.css
        ├── prairie-modern.css
        └── farmstead-blue.css

sanity/                           # Sanity Studio schemas
├── schemas/
│   ├── documents/                # Document types (service, pricing, faq, etc.)
│   └── objects/                  # Object types (portableText, imageWithAlt, etc.)
└── sanity.config.ts

public/
├── fonts/                        # Self-hosted font files if needed
├── illustrations/                # Sticker/badge SVGs and PNGs
└── images/                       # Static images (logo, fallbacks)
```

## Naming

- Components: PascalCase (`ServiceHero.tsx`)
- Files: Match component name or kebab-case for non-components
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no I or T prefix)
- CSS custom properties: kebab-case (`--color-primary`, `--theme-surface`)
- Sanity document types: camelCase (`servicePage`, `pricingTier`)

## Styling

- Tailwind CSS for all styling
- Use semantic theme tokens for all colors and fonts
- No inline styles
- Framer Motion for animations (page transitions, scroll reveals, hover effects)
- All animations respect `prefers-reduced-motion`

## Data Fetching

- Server components fetch directly from Sanity
- GROQ queries are the only way to read content — no REST API
- Use `next: { revalidate }` or on-demand revalidation via Sanity webhooks
- Validate contact form inputs with Zod

## Error Handling

- Graceful fallbacks for missing Sanity content (don't crash if a field is empty)
- 404 pages for invalid routes
- Loading states for any client-side data fetching

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- No Hound Around references in any user-facing content, meta tags, alt text, or comments

## Performance

- All images served through Sanity CDN with proper sizing (`w`, `h`, `fit`, `auto=format`)
- Use `next/image` with Sanity loader for optimized delivery
- Lazy load below-fold images and sections
- Font files preloaded for active theme only
- Lighthouse target: 90+ across all categories

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation for all interactive components (nav, accordions, pricing calculators)
- Color contrast meets WCAG AA minimum for all three themes
- Skip-to-content link
