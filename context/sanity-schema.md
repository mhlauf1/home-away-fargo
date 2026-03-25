# Sanity Schema Reference

> **This file is a living document.** Update it whenever the Sanity schema changes so Claude Code always has an accurate picture of the content model.

## Status

Schema not yet set up. Will be copied from Hound Around Resort and modified for HAFH.

## Sanity Project Details

- **Project ID:** (TBD — will be set up during Milestone 1)
- **Dataset:** `production`
- **Studio URL:** (TBD)
- **API version:** `2024-01-01` (or latest stable)

## Expected Document Types

Based on the Hound Around schema, the following document types are expected. Update this section once schemas are in place.

### From Hound Around (copy directly)
- `siteSettings` — Global site config (name, logo, contact info, social links, hours)
- `servicePage` — Service page content (hero, description, features, CTA)
- `pricingTier` — Individual pricing items (name, price, description, category)
- `faq` — FAQ items (question, answer, associated service)
- `testimonial` — Customer reviews (quote, author name, rating, service type)
- `galleryImage` — Gallery photos (image, caption, category)
- `page` — Generic page content (about, new clients, etc.)

### New for HAFH (may need to add)
- `teamMember` — Staff bios (name, role, photo, credentials, bio text) — for grooming team section
- `catService` — Cat-specific service content (if cat services get their own page)

### Object Types (reusable)
- `portableText` — Rich text with block content
- `imageWithAlt` — Image with alt text and optional caption
- `cta` — Call-to-action (label, link, style variant)
- `facilityStat` — Stat counter item (number, label, suffix)

## GROQ Query Patterns

All queries should follow the Hound Around pattern and live in `src/lib/sanity/queries.ts`.

```groq
// Example: Get all pricing tiers for a service category
*[_type == "pricingTier" && category == $category] | order(sortOrder asc) {
  _id,
  name,
  price,
  description,
  perVisitPrice,
  validityPeriod,
  isPopular
}
```

## Notes

- Keep schemas structurally aligned with Hound Around for future multi-site template extraction
- Don't add fields you don't need yet — only add what the current content requires
- If you need to rename a field from Hound Around's schema, document the mapping here so the template extraction knows about it
