# Project Overview

## What This Is

This is the website for **Home Away From Home**, a pet daycare, boarding, and grooming facility located at 5390 51st Ave S Suite A, Fargo, ND 58104. The site lives at **homeawayfargo.com**.

Home Away From Home (HAFH) is one of ~10 facilities in the **Embark Pet Services** portfolio, a pet care roll-up platform operated by **Cadence Private Capital**. Lauf Studio (lauf.co) owns the design system, tech stack, and infrastructure for all Embark portfolio websites.

## Repository Origin

**This repo was cloned from the Hound Around Resort codebase** (`mhlauf1/hound-3` on GitHub), the first Embark site we built and the design/technical reference for all future builds. The git history was wiped for a clean start — this is its own repo (`mhlauf1/home-away-fargo`), not a GitHub fork.

### How this repo was created

```bash
git clone https://github.com/mhlauf1/hound-3.git home-away-fargo
cd home-away-fargo
rm -rf .git
git init
git add .
git commit -m "Initial commit from Hound Around design system"
git remote add origin https://github.com/mhlauf1/home-away-fargo.git
git branch -M main
git push -u origin main
```

### What this means in practice

- The component library, page structures, layout patterns, and Sanity integration patterns all originated from the Hound Around build
- The design system (colors, fonts, spacing, illustrations) is being **completely reskinned** for HAFH — same bones, different skin
- The Sanity schemas are copied from Hound Around and may receive minor additions (cat services, grooming team bios) but should stay structurally aligned for future multi-site template extraction

### Future: Template repository pattern

After HAFH ships, the plan is to convert the Hound Around repo (`hound-3`) into a **GitHub template repository** (Settings → General → "Template repository"). Future Embark sites can then be created with "Use this template" on GitHub — same file structure, no commit history, clean starting point every time. HAFH is the second data point that will inform what goes into that template vs. what's location-specific.

### Critical rules for this repo

- **Never reference Hound Around in user-facing content.** No leftover copy, image alt text, meta tags, or comments mentioning Hound Around, Cottage Grove, or any Hound Around-specific details
- **Never hardcode Hound Around URLs, Sanity project IDs, or API keys.** All environment-specific values must come from `.env`
- **Preserve component architecture.** When modifying a component, keep the same prop interface and data-fetching pattern unless there is a clear reason to change it. These patterns will become a shared template
- **Document any structural divergence.** If HAFH requires a component or page pattern that Hound Around doesn't have (e.g., cat services page, grooming team bio section), note it clearly so it can be backported to the template later

## The Embark Network Context

HAFH is the **second** website in what will become a portfolio of 8-10 Embark facility sites, all built on the same design system and tech stack. Decisions made here directly impact future builds:

- **Barks & Rec** (Hastings) — future
- **Boxers Bed & Biscuits** — future
- **Kingdom Canine** — future
- **Wags Stay N Play** (Moorhead, MN) — in queue
- **Canine Country Club** (West Des Moines, IA) — migration only, no rebuild
- **Rio Grooming School & Salon** — future

The long-term goal is extracting a shared Embark site template where each location is a config layer (design tokens + CMS content) on top of a common component library. HAFH is the second data point that will inform that extraction.

## Tech Stack

| Category | Choice |
|----------|--------|
| Framework | Next.js (React 19) |
| Language | TypeScript |
| CMS | Sanity.io |
| Hosting | Vercel |
| DNS | Cloudflare |
| CSS | Tailwind CSS v4 |
| Animations | Framer Motion |
| Fonts | Google Fonts (theme-dependent) |
| Domain Registrar | GoDaddy (Peter Mark's account) |

## Design System — Three-Theme Architecture

HAFH ships with **three selectable design themes** during development. Each theme defines a complete set of design tokens (colors, fonts, border radii, spacing feel). A floating dev-only toggle widget lets stakeholders switch between themes on the live preview.

### Theme: Hearthstone
- **Vibe:** Warm, cozy, rustic — pulled from the barn-red siding and stone accents of the physical facility
- **Palette:** Barn red (#8B2D1E), warm stone (#C4835A), wheat (#D4A76A), cream (#F5EDE0), dark walnut (#2C2418), denim blue (#3B6E8A)
- **Fonts:** Serif headings (Lora or Merriweather), rounded sans body (Nunito or DM Sans)

### Theme: Prairie Modern
- **Vibe:** Clean, contemporary, airy — warm but lifted
- **Palette:** Sage (#6B8F71), terracotta (#C67D52), warm white (#F7F3ED), sand (#E8DFD1), charcoal warm (#3D3A35), mint (#A8C4B8)
- **Fonts:** Rounded sans throughout (Plus Jakarta Sans or similar)

### Theme: Farmstead Blue
- **Vibe:** Confident, established — navy + gold from the outdoor play structures and sky
- **Palette:** Navy (#1E3A5F), sky blue (#3B7BC0), gold wheat (#D4A24E), cream (#FAF6EF), dark brown (#2A2520), rust accent (#E86F45)
- **Fonts:** Bold serif headings (Playfair Display or Libre Baskerville), geometric sans body (Inter or Work Sans)

### Theme implementation

- All three palettes defined as CSS custom property sets in Tailwind v4's `@theme` directive
- Every color reference in components uses semantic tokens (`--color-primary`, `--color-accent`, `--color-surface`, etc.), never hardcoded hex values
- Theme switching swaps the active CSS custom property set + font-family tokens
- The toggle widget only renders in development/preview builds (controlled by env var)
- Theme selection persists via URL param (`?theme=hearthstone`) for shareable preview links

### Sticker/badge illustration system

Like Hound Around, HAFH uses custom illustrated stickers/badges throughout the site (service icons, section accents, decorative elements). These will be HAFH-specific illustrations that match each theme's personality. Illustrations are managed in Sanity as image assets.

## Site Structure

```
homeawayfargo.com/
├── / (Homepage)
├── /services/
│   ├── /daycare
│   ├── /boarding
│   ├── /grooming
│   └── /cats (TBD — may be standalone page or sections within daycare/boarding)
├── /pricing
├── /gallery
├── /about
├── /new-clients
├── /contact
└── /webcams (conditional — only if facility has webcams)
```

### Nav structure

- **Services dropdown:** Daycare · Boarding · Grooming · Cat Services
- **Top-level:** Pricing · Gallery · About · New Clients
- **CTA button:** Contact / Book a Visit

### Page pattern (inherited from Hound Around)

Each service page follows a consistent component pattern:
1. Hero section (headline, description, photo, CTA buttons)
2. Feature/differentiator grid (icon cards highlighting key selling points)
3. Pricing calculator (interactive, pulls from Sanity)
4. "How it works" timeline (step-by-step day walkthrough)
5. FAQ accordion (pulls from Sanity)
6. Bottom CTA band

Homepage ties it together with: hero, services overview cards, stats counter, photo scroll, differentiators grid, gallery preview, testimonials carousel, and CTA band.

## Content Status

### Have now (can populate in Sanity immediately)
- All pricing data (daycare packages, boarding runs, cat services, grooming tiers, exit baths)
- Hours of operation (weekday, weekend, holidays, late pickup policy)
- Basic facility info (name, address, phone, email, year opened, service area)
- Service descriptions (daycare, boarding, grooming, cat boarding)
- 4 FAQs (vaccinations, boarding checklist, temperament testing, tours)
- 6 five-star testimonials
- Booking system info (Gingr Pet Parent App, invite code 393992)
- ~8 facility photos (exterior, outdoor yards, indoor play, dogs)
- Grooming manager credentials (Sheryl Wagner — NDSU Vet Tech, AKC SAFE certified, etc.)

### Waiting on facility team
- About page content (founder story, team info, community narrative)
- Team photos / headshots
- Daily schedule timelines (daycare and boarding "how it works" steps)
- New client onboarding process details
- Webcam availability and embed details
- Cat services prominence decision (own page vs. section)
- Additional photos (boarding runs, grooming area, cats, front desk)
- Cancellation policy details
- Social media links
- Google Business Profile info

## Facility Quick Reference

- **Name:** Home Away From Home
- **Address:** 5390 51st Ave S Suite A, Fargo, ND 58104
- **Phone:** 701-532-1618
- **Email:** contactus@hafhfacility.com
- **Year established:** 2017
- **Service area:** Fargo, Moorhead, West Fargo, Dilworth, and surrounding Fargo-Moorhead communities
- **Play areas:** 4 indoor, 3 outdoor
- **Booking:** Gingr Pet Parent App (invite code: 393992)
- **Grooming manager:** Sheryl Wagner
- **Services:** Dog daycare, dog boarding, cat daycare, cat boarding, grooming (full service + exit bath), small animal boarding
