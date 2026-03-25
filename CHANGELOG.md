# Changelog

All notable changes to the Hound Around Resort website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.6.0] — 2026-02-19

### Added

#### New Page Builder Blocks (2 new sections)
- **WhatsIncluded** — displays a list of included items/features for a service
- **RequirementsList** — lists requirements with optional CTA link

#### ProcessSteps Enhancements
- **Badge field** — optional text shown below step titles (e.g. "6:30 AM - 12:00 PM", "All Day")
- **Connecting line** — continuous horizontal line behind step circles on desktop (replaces per-gap segments)

### Changed

#### Navigation
- **Services dropdown** — "Services" is now a non-clickable dropdown trigger on both desktop and mobile; only the 3 service subpages (Daycare, Grooming, Boarding) are clickable links. Desktop uses `<button>`, mobile uses `<span>` instead of `<Link>`.

#### Layout & Spacing
- **Hero sections** — added `pt-18` top padding directly to Hero, HeroBanner, HeroMinimal, and HeroSplit instead of relying on a global `pt-[72px]` wrapper
- **`layout.tsx`** — removed `pt-[72px]` from `<main>` (hero sections now handle their own top spacing)
- **HeroMinimal** — increased desktop min-height to `md:min-h-[65vh]`
- **CtaStrip** — increased vertical padding from `py-8 lg:py-12` to `py-16 lg:py-24`
- **PricingCalculator** — tightened internal padding/spacing, added `mb-12 md:mb-20` bottom margin
- **Pricing calculators** — tightened grid gap from `lg:gap-12` to `lg:gap-10` across all 3 calculator variants
- **Footer** — removed `mt-12` top margin

#### UI Refinements
- **FaqAccordion** — redesigned from bordered rows to card-style items with rounded corners, white backgrounds, plus/minus toggle icons with terracotta accent on open state, adjusted typography sizing and weight

### Removed
- **Self Wash service** — deleted document and all references from Sanity
- **Services overview page** — deleted from Sanity (services are now accessed directly via nav dropdown)
- **Self-Wash footer link** — removed from the footer Services column

---

## [0.5.0] — 2026-02-18

### Added

#### Interactive Pricing Calculators
New `pricingCalculator` page builder block with three service-specific calculator variants. Pricing data is hardcoded from the real CSV data. Each calculator renders on a forest green background with inputs on the left and an animated output card on the right.

- **Daycare Calculator** — Full/half day toggle, 5/10/20-day package selection with per-package savings display, configurable day count for single-day bookings
- **Boarding Calculator** — Nightly rate with automatic extended-stay discount at 10+ nights (badge indicator), add-on checkboxes for medication ($3/day), puppy pads ($3/day), dry food ($4/day), chicken & rice ($6/day), included amenities list
- **Grooming Calculator** — Service type (Quick Bath / Full Bath / Full Groom), dog size filtered by availability per service, hair type toggle (hidden for Full Groom), add-ons (nail trim, teeth brushing, de-shed, ear cleaning, face trim) with size-aware pricing, estimated service duration, N/A handling for unavailable combos

#### New Files (9)
- `studio/src/schemaTypes/objects/pricingCalculator.ts` — Sanity schema with calculatorType, eyebrow, heading, subheading, CTA link, and tax note
- `frontend/app/hooks/useAnimatedNumber.ts` — requestAnimationFrame count-up hook with ease-out cubic easing (~400ms)
- `frontend/app/data/pricingData.ts` — All rates from CSVs with pure calculation functions returning totals, line items, savings, and metadata
- `frontend/app/components/pricing/CalculatorInputs.tsx` — Shared primitives: NumberStepper, RadioGroup, CheckboxGroup, ContactNotice
- `frontend/app/components/pricing/PriceOutputCard.tsx` — Cream output card with animated price, itemized breakdown, savings callout, includes list, time estimate, and CTA
- `frontend/app/components/pricing/DaycareCalculator.tsx`
- `frontend/app/components/pricing/BoardingCalculator.tsx`
- `frontend/app/components/pricing/GroomingCalculator.tsx`
- `frontend/app/components/sections/PricingCalculator.tsx` — Main section wrapper with two-column layout

#### Edge Cases
- 4+ dogs shows "Contact us at 651-788-9797" with phone link
- Quick Bath + XL + Long Hair = N/A with disabled CTA and explanation
- Quick Bath has no XS size — auto-filtered and valid size auto-selected on service switch
- Large totals formatted with commas
- `aria-live="polite"` on animated price for screen reader announcements

### Changed
- `studio/src/schemaTypes/index.ts` — registered `pricingCalculator`
- `studio/src/schemaTypes/documents/page.ts` — added `pricingCalculator` to pageBuilder
- `studio/src/schemaTypes/documents/service.ts` — added `pricingCalculator` to pageBuilder
- `frontend/app/components/BlockRenderer.tsx` — imported and mapped PricingCalculator component
- `frontend/sanity/lib/queries.ts` — added GROQ expansion for `ctaLink` field
- `frontend/app/globals.css` — added focus-visible styles for dark background inputs
- `frontend/app/components/Footer.tsx` — added top margin spacing

---

## [0.4.0] — 2026-02-17

### Added

#### Pricing Page — Full Build from CSV Data

The client emailed 3 images containing all of their real pricing information for daycare, boarding, grooming, add-ons, and policies. The images were uploaded to Claude, which extracted and structured the data into 5 CSV files. Those CSVs were dropped into `price-data/` and Claude Code handled the rest — schema design, component builds, data import — in a single session.

**Workflow:**
1. Client sent 3 photos of their printed pricing sheets via email
2. Uploaded images to Claude, which parsed the pricing data into structured CSV files
3. Added the CSVs to `price-data/` in the repo
4. Claude Code analyzed each CSV's data shape and designed matching Sanity schemas
5. Built 3 new page builder block schemas, 3 React components, wired everything up
6. Imported all CSV data directly into Sanity via MCP tools as page builder blocks on the `/pricing` page
7. Published the document — pricing page live with all real data

#### New Sanity Schemas (3 new page builder blocks)
- **`pricingMatrix`** (`studio/src/schemaTypes/objects/pricingMatrix.ts`) — For grooming's size x hair-type price grids. Supports multiple tables, each with column headers, labeled rows, and cells containing a value and optional note. Includes footnotes array and cream/sand background options.
- **`pricingList`** (`studio/src/schemaTypes/objects/pricingList.ts`) — For simple service-to-price lists (a la carte grooming, boarding add-ons). Each item has service name, price, and optional note. Supports 1 or 2-column layout with cream/sand backgrounds.
- **`policyNotes`** (`studio/src/schemaTypes/objects/policyNotes.ts`) — For grouped policy/disclaimer callout cards. Categories each contain a list of policy strings. Supports cream/sand/forest backgrounds.

#### New React Components (3 new)
- **`PricingMatrix.tsx`** — HTML `<table>` with forest-green header row, alternating row stripes, terracotta prices, cell notes as small italic text. Empty cells render as muted dashes. Mobile: `overflow-x-auto` with sticky first column for row labels. FadeIn animation per table.
- **`PricingList.tsx`** — Dotted-leader rows (service name ... price) with flex layout. Notes appear as small muted text below service name. Optional 2-column grid via `lg:grid-cols-2`. Staggered FadeIn on items.
- **`PolicyNotes.tsx`** — Responsive grid of rounded cards (1-3 columns based on category count). Each policy has an info-circle SVG icon in terracotta. Supports cream/sand/forest backgrounds with adaptive text colors for dark mode.

#### Pricing Data Files
- `price-data/daycare-boarding.csv` — Daycare (5 tiers) and boarding (3 tiers) with 1-dog and additional-dog pricing
- `price-data/grooming.csv` — 3 grooming service types across hair type and size, 24 price points
- `price-data/grooming-alacarte.csv` — 17 a la carte grooming services with prices and notes
- `price-data/boarding-addons.csv` — 4 boarding add-on services with per-day pricing
- `price-data/policies.csv` — 8 policies across 3 categories (Boarding, Daycare, Grooming)
- `price-data/prices-with-tax.csv` — Internal reference data (not displayed on website)

#### CMS Content — Pricing Page
Injected 5 page builder blocks onto the existing `/pricing` page via Sanity MCP:
1. **Daycare & Boarding Rates** (pricingTable) — 2 categories: Daycare with 5 tiers (Full Day, Half Day, 5/10/20 Day Packages) and Boarding with 3 tiers (1-9 Nights, 10+ Nights, No Show Fee). All include additional dog pricing.
2. **Grooming Services** (pricingMatrix) — 3 tables: Quick Bath (4 sizes x 2 hair types), Full Service Bath (5 sizes x 2 hair types), Full Service Groom (5 sizes, all hair types). Includes 2 footnotes about Quick Bath restrictions and cancellation policy.
3. **A La Carte Services** (pricingList) — 17 grooming add-on items in 2-column layout with notes on variable-price services.
4. **Boarding Add-Ons** (pricingList) — 4 items in 1-column layout on sand background.
5. **Policies & Notes** (policyNotes) — 3 category cards (Boarding: 3 policies, Daycare: 2 policies, Grooming: 3 policies) on sand background.

### Changed
- `studio/src/schemaTypes/index.ts` — registered 3 new schema types (pricingMatrix, pricingList, policyNotes)
- `studio/src/schemaTypes/documents/page.ts` — added 3 new types to pageBuilder `of` array
- `studio/src/schemaTypes/documents/service.ts` — added 3 new types + heroMinimal to pageBuilder `of` array
- `frontend/app/components/BlockRenderer.tsx` — imported and mapped 3 new components (PricingMatrix, PricingList, PolicyNotes)
- `frontend/sanity/lib/queries.ts` — added 3 GROQ expansion clauses (pricingMatrix, pricingList, policyNotes) to `pageBuilderExpansion`
- `frontend/sanity.types.ts` — regenerated with new schema types
- `studio/sanity.types.ts` — regenerated with new schema types

---

## [0.3.0] — 2026-02-17

### Added

#### New Page Builder Blocks (11 new sections)
- **heroSplit** — 2-column hero with text+CTAs on one side, image on the other; reversible image position (left/right), 3 background color options (cream/sand/forest)
- **heroBanner** — Full-width background image hero with gradient overlay; configurable overlay opacity (light/medium/heavy) and min-height (standard/tall/fullscreen)
- **serviceCards** — Grid of image-topped cards with descriptions and arrow-link CTAs; configurable 2/3/4 columns, hover shadow transitions
- **featureList** — Alternating image+text rows with auto-numbering (01, 02, etc.); blockContent body with PortableText, optional per-feature CTAs
- **processSteps** — Numbered horizontal steps with connecting lines on desktop, vertical stack on mobile; supports Iconify icons in step circles, 2-6 steps
- **contentColumns** — Flexible 2 or 3-column layout with optional images, blockContent body, and CTAs per column
- **iconGrid** — Compact icon+title+description grid using Iconify; 2/3/4 columns with light and dark (forest) bg variants
- **videoSection** — YouTube/Vimeo embed with thumbnail + play button overlay; full-width and split (text+video) layouts; auto-parses video URLs into embed format
- **fullWidthMedia** — Full-bleed background image with overlay text and CTA; gradient direction follows text alignment (left/center/right)
- **ctaStrip** — Compact single-row CTA bar with heading, subtext, and button; 4 bg options including terracotta with adaptive button styling
- **logoBar** — Partner/certification logo display in grid or marquee mode; logos display as grayscale with color on hover, optional link per logo

#### Sanity Schema Files (11 new)
- `studio/src/schemaTypes/objects/heroSplit.ts`
- `studio/src/schemaTypes/objects/heroBanner.ts`
- `studio/src/schemaTypes/objects/serviceCards.ts`
- `studio/src/schemaTypes/objects/featureList.ts`
- `studio/src/schemaTypes/objects/processSteps.ts`
- `studio/src/schemaTypes/objects/contentColumns.ts`
- `studio/src/schemaTypes/objects/iconGrid.ts`
- `studio/src/schemaTypes/objects/videoSection.ts`
- `studio/src/schemaTypes/objects/fullWidthMedia.ts`
- `studio/src/schemaTypes/objects/ctaStrip.ts`
- `studio/src/schemaTypes/objects/logoBar.ts`

#### React Components (11 new)
- `frontend/app/components/sections/HeroSplit.tsx`
- `frontend/app/components/sections/HeroBanner.tsx`
- `frontend/app/components/sections/ServiceCards.tsx`
- `frontend/app/components/sections/FeatureList.tsx`
- `frontend/app/components/sections/ProcessSteps.tsx` — client component (Iconify)
- `frontend/app/components/sections/ContentColumns.tsx`
- `frontend/app/components/sections/IconGrid.tsx` — client component (Iconify)
- `frontend/app/components/sections/VideoSection.tsx` — client component (useState for play toggle)
- `frontend/app/components/sections/FullWidthMedia.tsx`
- `frontend/app/components/sections/CtaStrip.tsx`
- `frontend/app/components/sections/LogoBar.tsx` — client component (marquee animation)

#### CSS
- `@keyframes marquee` animation (translateX 0 → -50% over 30s) for logoBar marquee mode
- `animate-marquee` Tailwind utility

#### Email
- Replaced Resend with Nodemailer for contact form email routing via SMTP
- Env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_FORM_TO_EMAIL`

### Changed
- `studio/src/schemaTypes/index.ts` — registered 11 new schema types
- `studio/src/schemaTypes/documents/page.ts` — added 11 new types to pageBuilder `of` array
- `studio/src/schemaTypes/documents/service.ts` — added 11 new types to pageBuilder `of` array
- `frontend/app/components/BlockRenderer.tsx` — imported and mapped 11 new components
- `frontend/sanity/lib/queries.ts` — added 8 GROQ expansion clauses to `pageBuilderExpansion` (heroSplit, heroBanner, serviceCards, featureList, processSteps, contentColumns, fullWidthMedia, ctaStrip) using existing `buttonFields` and `linkReference` fragments
- `frontend/app/globals.css` — added marquee keyframes and utility

---

## [0.1.0] — 2026-02-05

### Added

#### Design System (Phase 1)
- EB Garamond serif font (headings) via `next/font/google` with CSS variable `--font-serif`
- Geist Sans font (body/UI) via `geist` npm package with CSS variable `--font-geist-sans`
- Full Hound Around color palette in Tailwind v4 `@theme` block: tan (#FEFFEA), lavender (#F0D7FF), dark (#201A25), dark-card (#2A2430), accent-orange (#E87830), cream, border-light, border-dark, text-muted, text-muted-dark
- Custom font size tokens: hero, h1, h2, h3, h4, body-lg, body, body-sm, caption, badge, stat, button
- Spacing tokens: section (80px), section-lg (120px)
- Border radius tokens: sm (8px), md (12px), lg (24px), xl (40px), section (48px)
- Shadow tokens: card, card-hover
- Base layer styles: serif headings (weight 400), sans body (weight 300)
- Container utility: max-width 1200px, centered, 1.5rem padding
- UI component: `Button.tsx` — primary (lavender fill) and outline variants, supports `link` prop for CTA routing
- UI component: `Badge.tsx` — uppercase eyebrow/label text (14px, 10% letter-spacing)
- UI component: `SectionWrapper.tsx` — configurable background (tan/lavender/dark), optional curved top with 48px radius
- UI component: `DecorativeCurve.tsx` — SVG placeholder curves, configurable color (white/orange/cream) and position
- Installed `geist` and `@iconify/react` dependencies

#### Sanity Schemas (Phase 2)
- Document type: `service` — title, slug, shortDescription, tabImage, tabCta (used by serviceTabs block)
- Document type: `testimonial` — quote, authorName, authorLabel, rating (1-5)
- Page builder block: `hero` — eyebrow, heading, subtext, primaryCta, secondaryCta, trustLine, heroImage, backgroundImage
- Page builder block: `imageRow` — images array with alt text (1-6 images)
- Page builder block: `featureCards` — heading, features array (icon/title/description), cta, trustLine, darkMode toggle
- Page builder block: `serviceTabs` — eyebrow, heading, tabs (references to service documents)
- Page builder block: `statsBar` — stats array (value string + label), showLogo toggle
- Page builder block: `webcamPreview` — eyebrow, heading, previewImage, passwordProtected toggle, webcamUrl
- Page builder block: `testimonials` — heading, reviews (references to testimonial documents), googleRating, googleReviewCount
- Page builder block: `ctaBanner` — heading, backgroundImage, cta, showRating toggle, ratingText
- Page builder block: `splitContent` — heading, body (blockContent), link, badge image, image, imagePosition (left/right), backgroundColor (tan/lavender/dark)
- All 9 new block types registered in `page.ts` pageBuilder array (alongside existing callToAction + infoSection)
- All 11 new types registered in `studio/src/schemaTypes/index.ts`
- Settings singleton expanded with: logo, navItems (with dropdown children), ctaButton, footerTagline, footerColumns (with links), contactInfo (address/phone/email), footerText

#### Header & Footer (Phase 3)
- Header: sticky, 72px height, transparent-to-tan scroll transition, logo in rounded pill container ("Hound Around" serif + "RESORT" sans small-caps), desktop nav with dropdown support, "Book Now" CTA button, mobile hamburger menu with slide-out panel
- Footer: lavender accent line at top, 4-column responsive grid (brand + tagline, dynamic link columns from settings, contact info), copyright bottom bar with Privacy Policy / Terms of Service links
- Expanded `settingsQuery` GROQ to fetch all nav/footer data with fully dereferenced links
- Layout fetches settings and passes to Header/Footer as props

#### Homepage Sections (Phase 4)
- `Hero.tsx` — centered content stack (badge, serif H1, subtext, dual CTAs, trust line), decorative curves, dog doodle SVG placeholder, hero image with rounded corners, responsive typography (84px → 56px → 36px)
- `ImageRow.tsx` — horizontal flex row of images, rounded-md corners, overflow-x scroll with snap on mobile
- `FeatureCards.tsx` — dark bg (#201A25) with curved top (48px radius, -mt-12 overlap), left-aligned heading, 4-card grid (dark-card bg, cream/20% border, Iconify icons), CTA + trust line, decorative curves and dog face SVG placeholders
- `ServiceTabs.tsx` — client component with tab state, eyebrow + heading, tab bar with underline indicator, 50/50 split content (text + image per tab), data from dereferenced service documents
- `StatsBar.tsx` — lavender bg, 4 white stat cards (large number + label), logo lockup centered below, decorative curves
- `WebcamPreview.tsx` — client component with password form state, eyebrow + heading, 50/50 split (password input card + blurred preview image with play button overlay)
- `Testimonials.tsx` — dark bg with curved top, dog icon, serif heading, horizontal scroll cards (cream bg, orange paw icon, quote, attribution), Google rating pill badge
- `CtaBanner.tsx` — photo background with dark overlay in rounded container on tan bg, centered content (dog icon, heading, CTA, star rating line), decorative curves
- `SplitContent.tsx` — configurable bg (tan/lavender/dark), 50/50 grid with flippable image position, portable text body, link, optional badge image
- All 9 components registered in `BlockRenderer.tsx`

#### Homepage Assembly (Phase 5)
- `homepageQuery` GROQ — fetches page with slug "homepage", expands all 11 block types with proper field projections, dereferences service and testimonial references
- Updated `getPageQuery` with same block expansions for non-homepage pages
- Rewrote `app/page.tsx` to fetch homepage via `homepageQuery` and render through `PageBuilder`, with fallback message if no homepage exists
- Updated `app/[slug]/page.tsx` to use new design system, removed Onboarding dependency

### Changed
- `frontend/app/layout.tsx` — replaced Inter + IBM Plex Mono fonts with EB Garamond + Geist Sans, changed `bg-white text-black` to `bg-tan text-dark`, removed `pt-24` from section wrapper, added `pt-[72px]` to main for fixed header clearance, removed `demo` import
- `frontend/app/globals.css` — complete rewrite of `@theme` block from template defaults to Hound Around design tokens, updated base layer styles for serif headings and sans body
- `frontend/tailwind.config.ts` — simplified to content paths and typography plugin only (theme now lives in CSS)
- `studio/src/schemaTypes/documents/page.ts` — pageBuilder array expanded from 2 types to 11
- `studio/src/schemaTypes/singletons/settings.tsx` — expanded with nav, footer, and contact fields; removed `post` link option from description annotations; removed demo initial values import
- `studio/src/schemaTypes/objects/link.ts` — removed `post` link type option and post reference field (blog removed)
- `studio/src/schemaTypes/objects/blockContent.tsx` — removed `post` link type option and post reference field
- `frontend/sanity/lib/queries.ts` — complete rewrite: expanded settingsQuery, added homepageQuery, added pageBuilderExpansion fragment with all block type projections, removed post-related queries, removed `post` from linkReference
- `frontend/sanity/lib/types.ts` — `DereferencedLink.linkType` changed to `string` (was `'href' | 'page' | 'post'`) to avoid type mismatches with generated types
- `frontend/sanity/lib/utils.ts` — removed `post` case from `linkResolver` switch
- `frontend/app/components/Cta.tsx` — replaced tile image background pattern with solid bg tint (tile images removed)
- `frontend/app/sitemap.ts` — simplified to pages only, removed post handling

### Removed
- **Blog support entirely:**
  - `studio/src/schemaTypes/documents/post.ts` — post document schema
  - `studio/src/schemaTypes/documents/person.ts` — person/author document schema
  - `frontend/app/posts/` — entire blog route directory (listing + [slug] pages)
  - `frontend/app/components/Posts.tsx` — blog post listing component
  - `frontend/app/components/Avatar.tsx` — author avatar component
  - `frontend/app/components/Date.tsx` — date formatting component
  - Post-related GROQ queries: `allPostsQuery`, `morePostsQuery`, `postQuery`, `postPagesSlugs`, `postFields` fragment
- **Template demo files:**
  - `frontend/app/components/GetStartedCode.tsx`
  - `frontend/app/components/SideBySideIcons.tsx`
  - `frontend/app/components/Onboarding.tsx`
  - `frontend/sanity/lib/demo.ts`
- **Template tile assets:**
  - `frontend/public/images/tile-1-black.png`
  - `frontend/public/images/tile-1-white.png`
  - `frontend/public/images/tile-grid-black.png`
  - `frontend/public/images/tile-grid-white.png`

#### CMS Content Setup (Phase 6)
- Created homepage page document in Sanity with slug `homepage`
- Added Hero block with eyebrow, heading, subtext, dual CTAs, trust line, and background image
- Added CTA Banner block with heading, background image, CTA button, and Google rating
- Added Service Tabs block with eyebrow, heading, and references to 3 service documents (Daycare, Boarding, Grooming)
- Created 3 service documents with titles, descriptions, tab images, and CTAs
- Uploaded all section images to Sanity assets
- Deployed schema to Sanity cloud
- Added CORS origin `http://localhost:3000` with credentials for local development

### Fixed
- Removed `post` type reference from `blockContent.tsx` link annotations that caused `Unknown type: post` schema extraction error after blog removal
- Fixed homepage slug mismatch: query expected `homepage` but document had auto-generated `home` slug

---

## [0.0.0] — 2026-01-XX

### Added
- Initial project from `sanity-template-nextjs-clean` starter
- Sanity v5 Studio with presentation tool, AI assist, Unsplash plugin, GROQ Vision
- Next.js 16 App Router with React 19, Tailwind CSS v4
- Page builder with `callToAction` and `infoSection` blocks
- Blog support with posts, authors, and rich text content
- Visual editing via Presentation Tool + draft mode
- Settings singleton for site title, description, OG image
