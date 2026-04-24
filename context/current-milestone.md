# Current Milestone

## Client Corrections — Round 3 (Go-Live Prep)

### Status
In progress

### Goals
Address Brian's go-live note: remove the About tab from the homepage. Tighten related placeholders ahead of a midnight go-live on 2026-04-21.

### Changes
- Nav: removed top-level "About" item (desktop + mobile)
- Footer: removed "About" link from the Information column
- Homepage splitContent "About Us" block: removed the "Learn more about us" CTA so it no longer drives users to the orphaned, placeholder-only About page
- Homepage statsBar: `Established: 2022` → `2017` (Round 2 open item, now resolved)

### Definition of Done
- About no longer appears in nav or footer on any page
- Homepage "About Us" blurb renders with no trailing CTA
- Homepage statsBar reads 2017
- 2 Sanity docs re-published (settings, homepage)

### Open items surfaced to Brian
- Gallery page is still empty — photos pending Tonya
- About page itself remains in Sanity with `[PLACEHOLDER: Our Story]` content; it is now orphaned from nav/footer/homepage, but the `/about` URL is still reachable directly. Decide whether to delete the page doc, noindex it, or leave it as a cheap shell in case the founder story arrives post-launch.
- Webcams page is scaffolded only (no webcam docs seeded). Not linked from nav or footer, so no user impact.
- "How to Join" wording tweak — owner handling directly

### Follow-up (last call from Brian, 2026-04-21)
Brian relayed two Tonya concerns before go-live:
1. Any residual "24/7 coverage" claim — needs to be removed
2. Established date 2022 → 2017

Audit findings: homepage was already clean. Stale/false content was isolated to the orphaned `/about` page.

#### Changes
- About page `heroMinimal.subtext`: "Since 2022, we've been providing…" → "Since 2017, we've been providing…"
- About page `statsBar`: `Established: 2022` → `2017`
- About page `valuePillars`: removed the "On-Site Care / 24/7" pillar (description claimed "never left unattended / around the clock"), reduced layout from 4 columns to 3

Branch: `fix/client-corrections-round-3-followup`

### History
- 2026-04-21: Brian's go-live note: drop the ABOUT tab; homepage blurb is sufficient. Continuing on branch `fix/client-corrections-round-2`.
- 2026-04-21: Unset navItems[About] and footerColumns[Information].links[About] on settings; unset the homepage splitContent `link` field; corrected homepage statsBar year to 2017; published settings + homepage.
- 2026-04-21: Tonya follow-up — patched About page (2022 → 2017 in hero subtext + statsBar; removed 24/7 "On-Site Care" valuePillar, 4-col → 3-col); published About page.

---

## Round 4 — Tonya's final go-live list (2026-04-24)

### Status
Awaiting user review before commit. Working on `main` (no branch, per user request).

### Changes
- **Late boarding pickup fee** ($25 → $29): `page` (pricing) `pricingPageTabs` → boarding service `matrixData.footnotes[1]` now reads "Late pickup after 1:30 PM on weekends incurs a $29 fee (same as half day of daycare)"
- **Grooming pricing disclaimer — added "behavior"**: both in Sanity (`service` grooming → `pricingTable.description`) and code (`frontend/app/components/pricing/GroomingCalculator.tsx:80`)
- **Mobile grooming note**: appended "We also offer mobile grooming — call or ask an associate for details." to the grooming service page `pricingTable.description`
- **Exit bath prices** $45/$55/$65/$85 → $49/$59/$69/$89 in three places:
  - `frontend/app/data/pricingData.ts` `exitBath` rates (drives the grooming calculator)
  - `service` (grooming) `pricingTable.categories[].tiers[].description` ("Exit Bath $49/$59/$69/$89.")
  - `page` (pricing) `pricingPageTabs` → grooming service → matrix "Exit Bath" cells
- **Contact email**: `settings.contactInfo.email` → `hafhfacility@gmail.com` (was `contactus@hafhfacility.com`). Rendered site-wide via Footer, layout structured data, and contact page.

### Sanity docs republished
- `page` (pricing, id `94ef277a-9ea2-4dc5-a024-22091cd9e424`)
- `service` (grooming, id `4b2c89ee-542d-4190-8800-62df0640ccb0`)
- `settings` (id `0f056e49-7b45-4c84-84e6-f7ddf3abb654`)

---

## Previous: Client Corrections — Round 2

### Status
Complete

### Changes
- Boarding additional-dog rate: $29 → $39 (code + both Sanity pricing tables)
- Homepage About section: replaced "Closed major holidays." with 365-day / limited-lobby-hours copy
- Uploaded new HAFH logo (dog + cat silhouettes with wordmark) to Sanity and wired it into `settings.logo`
- Fixed boarding service page's "View Pricing" CTA to deep-link `/pricing#boarding` (was landing on the daycare tab)
- Boarding pricing tab intro: "Boarding That Feels Like Home — Transparent Pricing, Exceptional Care"
- Grooming service page hero: "Your Best Friend deserves a Spa Day"
- Grooming pricing tab intro: "Professional Grooming by Certified Experts" (moved from grooming service page)
- Cats service page: removed hero "View Pricing" CTA and removed the inline Cat Care Pricing section
- Pricing page: removed 3 feline rows from the pricingList; renamed block to "Small Animal Pricing" with updated description (Small Animal Boarding row retained)
- Nav: renamed "Services" → "Services and Pricing" (desktop + mobile); removed standalone "Pricing" top-level nav item + footer Information-column Pricing link

### History
- 2026-04-20: Started Round 2 on branch `fix/client-corrections-round-2`
- 2026-04-20: Patched + published 6 Sanity docs (settings, homepage, boarding, grooming, cats, pricing), uploaded new logo asset, updated `boardingAdditionalDogRate` in `pricingData.ts`, build passes, HTML QA passes
