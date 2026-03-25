# Current Milestone

## Milestone 2: Sanity Schema & Content Seeding

### Status
In Progress

### Goals
- Review existing Sanity schemas (copied from Hound Around) and verify they work for HAFH
- Add new schema types if needed (cat services, grooming team bios)
- Seed all "have now" content into Sanity:
  - Facility info (name, address, phone, email, hours, holidays)
  - All pricing data (daycare packages, boarding runs, cat services, grooming, exit baths)
  - Service descriptions (daycare, boarding, grooming, cat boarding)
  - FAQs (4 provided)
  - Testimonials (6 provided)
  - Booking info (Gingr app, invite code 393992)
  - Grooming manager credentials (Sheryl Wagner)
- Upload available photos to Sanity media library
- Verify all GROQ queries return correct data

### Notes
- Content data is documented in @context/intake-content.md (full intake form)
- Sanity project ID: `dafhmkyq`, dataset: `production`
- Schemas live in `studio/src/schemaTypes/`
- GROQ queries live in `frontend/sanity/lib/queries.ts`
- The page builder architecture means content is structured as pageBuilder arrays on page/service documents
- Keep schemas structurally aligned with Hound Around for future template extraction

### Definition of Done
- Sanity Studio loads with all seeded content
- All content renders on the site through GROQ queries
- No hardcoded content in components — everything from Sanity

### History
- 2026-03-24: Schema reviewed — no changes needed
- 2026-03-24: Fixed 3 hardcoded Hound Around phone numbers (651-788-9797 → 701-532-1618)
- 2026-03-24: Rewrote pricing calculator data + UI for HAFH pricing model
- 2026-03-24: Seeded all Sanity content (settings, 6 testimonials, 4 services, 7 pages)
- 2026-03-24: Deployed schema to cloud, published all documents
- 2026-03-24: Updated context docs (sanity-schema.md, intake-content.md)
