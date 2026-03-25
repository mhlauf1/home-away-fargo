# Current Milestone

## Milestone 2: Sanity Schema & Content Seeding

### Status
Not Started

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
- Content data is documented in @context/project-overview.md under "Content Status" and "Facility Quick Reference"
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
(No updates yet)
