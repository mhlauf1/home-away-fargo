# Current Milestone

## Milestone 3: Core Pages — Homepage & Services

### Status
Complete

### Goals
- Populate homepage pageBuilder with hero, service cards, stats, testimonials, CTA
- Populate daycare page with hero, features, pricing calculator, FAQs, CTA
- Populate boarding page with hero, features, packing list, pricing calculator, FAQs, CTA
- Populate grooming page with hero, features, team grid (Sheryl Wagner), pricing calculator, CTA
- Populate cat services page with hero, features, requirements list, CTA
- Verify all pages render correctly across all three themes
- Ensure pricing calculators, FAQ accordions, and testimonials carousel are functional
- Responsive across desktop, tablet, mobile

### Notes
- All section components are already built from the Hound Around codebase
- Content comes from @context/intake-content.md
- Page/service documents exist in Sanity with empty pageBuilder arrays
- Pricing calculator data is hardcoded in `frontend/app/data/pricingData.ts` (already correct for HAFH)
- 6 testimonials already seeded as standalone documents

### Definition of Done
- All 5 pages (homepage + 4 services) fully built and populated with Sanity content
- Pricing calculators functional
- FAQ accordions functional
- Testimonials carousel functional
- Looks correct in all three themes
- Mobile responsive
- `npm run build` passes

### History
- 2026-03-25: Started M3, created branch `feature/core-pages`
- 2026-03-25: Seeded all 5 pageBuilder arrays (homepage + 4 services) via Sanity MCP
- 2026-03-25: Published all documents, verified rendering, build passes
