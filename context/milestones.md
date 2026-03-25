# Milestones

## Overview

The HAFH website is built in milestones, not features. Each milestone represents a meaningful, deployable chunk of work. The site should be viewable on Vercel after every milestone.

---

## Milestone 1: Foundation & Theme System

**Status:** Not Started
**Branch:** `feature/foundation`

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

**Status:** Not Started
**Branch:** `content/sanity-seed`

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

**Status:** Not Started
**Branch:** `feature/core-pages`

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

**Status:** Not Started
**Branch:** `feature/supporting-pages`

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

(None yet)
