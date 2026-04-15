# Current Milestone

## Milestone 4: Supporting Pages

### Status
Complete

### Goals
- Pricing page: comprehensive pricing tables/cards for all services (daycare, boarding, grooming, cats)
- Gallery page: scaffolded with heading/subtext (awaiting facility photos)
- Contact page: functional contact form with fields, contact info, map embed, next steps
- About page: scaffolded with placeholder blocks (awaiting facility content)
- New Clients page: onboarding process steps, vaccination requirements, FAQs
- Webcams page: scaffolded (conditional on facility response)

### Notes
- No code changes needed — all 40+ section components already built from Hound Around codebase
- All content seeded via Sanity MCP tools (patch_document_from_json append operations)
- Gallery page has no images yet — facility team needs to provide photos
- About page has `[PLACEHOLDER]` markers for founder story and team content
- Webcams page scaffolded but no webcam documents exist yet
- Contact form API route exists at `/api/contact` (nodemailer) — needs SMTP env vars configured for production
- Map embed URL is a placeholder — should be updated with actual Google Maps embed

### Definition of Done
- All 6 supporting pages built and populated with Sanity content
- Contact form functional (UI and submission endpoint)
- Pricing page shows all service pricing with interactive calculators
- New Clients page has onboarding steps, vaccination requirements, and FAQs
- Placeholder sections clearly marked for future content
- All three themes look correct
- `npm run build` passes

### History
- 2026-03-25: Started M4, created branch `feature/supporting-pages`
- 2026-03-25: Seeded all 6 pageBuilder arrays via Sanity MCP
  - Pricing: heroMinimal + pricingPageTabs (3 tabs with calculators) + pricingList (cats) + ctaBanner
  - Gallery: heroMinimal + galleryPage + ctaBanner (no images yet)
  - Contact: contactForm (5 form fields, contact info, map, 3 next steps)
  - About: heroMinimal + splitContent (placeholder) + statsBar + valuePillars (4) + ctaBanner
  - New Clients: heroMinimal + processSteps (4) + requirementsList (4) + faqAccordion (4) + ctaBanner
  - Webcams: heroMinimal + webcamGrid + ctaBanner
- 2026-03-25: Published all 6 documents, build passes
