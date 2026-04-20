# Current Milestone

## Client Corrections — Round 2

### Status
Complete

### Goals
Implement Brian's second round of copy, pricing, nav, and logo corrections before advancing to M5.

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

### Definition of Done
- All 14 items from Brian's email addressed or explicitly deferred (gallery photos, "How to Join" wording both deferred)
- `npm run build` passes
- Programmatic HTML verification across 5 routes: homepage, /services/boarding, /services/grooming, /services/cats, /pricing
- All 6 modified Sanity docs published

### Open items
- Homepage statsBar `Established: 2022` is still wrong — CLAUDE.md + `settings.yearEstablished` both say 2017. Not in Brian's list for Round 2, flagging for a separate quick fix.
- Gallery photos pending Tonya
- "How to Join" wording tweak — owner is handling directly

### History
- 2026-04-20: Started Round 2 on branch `fix/client-corrections-round-2`
- 2026-04-20: Patched + published 6 Sanity docs (settings, homepage, boarding, grooming, cats, pricing), uploaded new logo asset, updated `boardingAdditionalDogRate` in `pricingData.ts`, build passes, HTML QA passes
