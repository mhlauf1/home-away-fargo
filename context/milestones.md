# Milestones

## Overview

The HAFH website is built in milestones, not features. Each milestone represents a meaningful, deployable chunk of work. The site should be viewable on Vercel after every milestone.

---

## Milestone 1: Foundation & Theme System

**Status:** Complete (2026-03-24)
**Branch:** `feature/foundation` (merged to main)

### Goals
- Strip all Hound Around-specific content, images, and references from the cloned codebase
- Set up new Sanity project/dataset and connect it
- Implement the three-theme CSS custom property system (Hearthstone, Prairie Modern, Farmstead Blue)
- Load all three font pairings via Google Fonts
- Build the dev-only floating theme toggle widget
- Swap the logo to HAFH logo
- Update all meta tags, site title, favicon, OG images for HAFH
- Update `.env` / `.env.example` with HAFH-specific values
- Verify clean Vercel deployment with theme switching working

### Definition of Done
- Site deploys to Vercel with no Hound Around references anywhere
- Theme toggle switches between all three themes with smooth transitions
- All pages render without errors (content can be placeholder)
- `?theme=hearthstone` URL param works for shareable links

---

## Milestone 2: Sanity Schema & Content Seeding

**Status:** Complete (2026-03-24)
**Branch:** `content/sanity-seed` (merged to main)

### Goals
- Copy Sanity schemas from Hound Around
- Add new schema types if needed (cat services, grooming team bios)
- Seed all "have now" content into Sanity:
  - Facility info (name, address, phone, email, hours, holidays)
  - All pricing data (daycare packages, boarding runs, cat services, grooming, exit baths)
  - Service descriptions (daycare, boarding, grooming, cat boarding)
  - FAQs (4 provided)
  - Testimonials (6 provided)
  - Booking info (Gingr app, invite code)
  - Grooming manager credentials (Sheryl Wagner)
- Upload available photos to Sanity media library
- Verify all GROQ queries return correct data

### Definition of Done
- Sanity Studio loads with all seeded content
- All content renders on the site through GROQ queries
- No hardcoded content in components — everything from Sanity

---

## Milestone 3: Core Pages — Homepage & Services

**Status:** Complete (2026-03-25)
**Branch:** `feature/core-pages` (merged to main)

### Goals
- Homepage: hero, services overview, stats counter, photo scroll, testimonials, CTA
- Daycare page: hero, features grid, pricing calculator, FAQ accordion, CTA
- Boarding page: hero, features grid, packing list, pricing calculator, FAQ accordion, CTA
- Grooming page: hero, service menu, pricing calculator, grooming team bio section, CTA
- All pages use theme tokens and look correct in all three themes
- Responsive across desktop, tablet, mobile

### Definition of Done
- All four pages fully built and populated with Sanity content
- Pricing calculators functional
- FAQ accordions functional
- Looks correct in all three themes
- Mobile responsive

---

## Milestone 4: Supporting Pages

**Status:** Complete (2026-03-25)
**Branch:** `feature/supporting-pages` (merged to main)

### Goals
- Pricing page: comprehensive pricing tables/cards for all services
- Gallery page: photo grid with lightbox
- Contact page: contact form, map embed, hours, Gingr booking link
- About page: scaffolded with placeholder blocks (waiting on facility content)
- New Clients page: scaffolded with Gingr integration and placeholder blocks
- Webcams page: scaffolded (conditional on facility response)

### Definition of Done
- All supporting pages built
- Contact form functional (sends email or stores submission)
- Gallery lightbox works
- Placeholder sections clearly marked for future content
- All three themes look correct

---

## Milestone 5: Cat Services & Remaining Content

**Status:** Not Started
**Branch:** `feature/cat-services`

### Goals
- Implement cat services based on facility team's decision (own page or sections)
- Add any additional content received from facility team
- Fill in About page content when received
- Fill in New Clients process when received
- Add webcams page if confirmed
- Add daily schedule timelines to service pages when received

### Definition of Done
- Cat services properly integrated
- All received content populated
- No remaining `[PLACEHOLDER]` markers for content we've received

---

## Milestone 6: Polish & Launch Prep

**Status:** Not Started
**Branch:** `feature/polish`

### Goals
- Final theme selection with stakeholders (strip unused themes for production)
- SEO optimization (meta tags, structured data, sitemap.xml, robots.txt)
- Performance audit (Lighthouse 90+ all categories)
- Accessibility audit (WCAG AA compliance)
- Cross-browser testing
- Custom 404 page
- Sticker/badge illustrations placed throughout site
- Final content review with stakeholder approval
- DNS cutover plan from hafhfacility.com to homeawayfargo.com

### Definition of Done
- Single selected theme active in production
- Lighthouse 90+ across all categories
- All content approved by stakeholders
- DNS ready for cutover
- Dev theme toggle removed from production build

---

## Completed Milestones

### Milestone 4: Supporting Pages (2026-03-25)
- Pricing page: heroMinimal + pricingPageTabs (daycare table, boarding matrix, grooming matrix, all with calculators) + pricingList (cat/small animal pricing) + ctaBanner
- Gallery page: heroMinimal + galleryPage (scaffolded, no images yet) + ctaBanner
- Contact page: contactForm (5 fields: name, email, phone, service select, message) + contact info + map embed + 3 next steps
- About page: heroMinimal + splitContent (placeholder for founder story) + statsBar + valuePillars (4 values) + ctaBanner
- New Clients page: heroMinimal + processSteps (4 Gingr onboarding steps) + requirementsList (4 vaccinations) + faqAccordion (4 FAQs) + ctaBanner
- Webcams page: heroMinimal + webcamGrid (scaffolded, no webcam docs) + ctaBanner
- All content seeded via Sanity MCP tools and published
- No code changes needed — build passes clean

### Milestone 3: Core Pages — Homepage & Services (2026-03-25)
- Populated homepage pageBuilder: hero, service cards (4), stats bar, testimonials (6), CTA banner
- Populated daycare page: hero, feature cards (4), pricing calculator, FAQ accordion (3), CTA banner
- Populated boarding page: hero, feature cards (4), requirements list (4), pricing calculator, FAQ accordion (3), CTA banner
- Populated grooming page: hero, feature cards (4), team grid (Sheryl Wagner), pricing calculator, CTA banner
- Populated cat services page: hero, feature cards (4), requirements list (4), CTA banner
- All content seeded via Sanity MCP tools and published
- Build passes, all pages render with content across all three themes

### Milestone 2: Sanity Schema & Content Seeding (2026-03-24)
- Schema reviewed — no changes needed from Hound Around
- Fixed 3 hardcoded Hound Around phone numbers (651-788-9797 → 701-532-1618)
- Rewrote pricing calculator data + UI for HAFH pricing model
- Seeded all Sanity content (settings, 6 testimonials, 4 services, 7 pages)
- Deployed schema to cloud, published all documents

### Milestone 1: Foundation & Theme System (2026-03-24)
- Stripped all Hound Around references (17 replacements across 12 files)
- Connected HAFH Sanity project (`dafhmkyq`) with frontend and studio env files
- Built three-theme CSS custom property system (Hearthstone, Prairie Modern, Farmstead Blue)
- Loaded all font pairs: Lora/Nunito, Plus Jakarta Sans, Playfair Display/Inter
- Built dev-only ThemeToggle widget with `?theme=` URL param and localStorage
- Removed redundant Tailwind v3 JS config
- Deleted Hound Around docs, design images, and pricing CSVs
- Build passes, all pages render, theme switching works
