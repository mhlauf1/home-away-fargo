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

### History
- 2026-04-21: Brian's go-live note: drop the ABOUT tab; homepage blurb is sufficient. Continuing on branch `fix/client-corrections-round-2`.
- 2026-04-21: Unset navItems[About] and footerColumns[Information].links[About] on settings; unset the homepage splitContent `link` field; corrected homepage statsBar year to 2017; published settings + homepage.

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
