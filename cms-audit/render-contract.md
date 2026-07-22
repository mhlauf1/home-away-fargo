# Render Contract — Home Away From Home (`home-away-fargo`)

**Audited:** 2026-07-10 · **Companion:** `schema-inventory.json`, `REPORT.md`
**Purpose:** the post-projection data contract a replacement content adapter must satisfy. Shapes below are what components *receive after GROQ projection*, not what is stored.

Conventions: `?` = optional key; `RawImage`, `Button`, `DereferencedLink`, `PT` defined once in §2.1 and reused. Presence counts ("n=X; key k on Y of n") come from a read-only GROQ pass over all published page/service docs (2026-07-10). Route/page files not listed as drifted are **byte-identical to hound-3** (verified by `diff -rq`), so this contract intentionally mirrors the hound-3 render contract with HAFH deltas called out.

---

## 1. ROUTING MAP

| Route | File | Query | Slug → document | Notes |
|---|---|---|---|---|
| `/` | `frontend/app/page.tsx` | `homepageQuery` | hardcoded `slug.current == 'homepage'` on `page` | Renders `<PageBuilder>`; empty-state JSX ("Welcome to Home Away From Home") if no doc. `generateMetadata` refetches with `stega:false`; canonical `'/'` |
| `/[slug]` | `frontend/app/[slug]/page.tsx` | `getPageQuery` (`$slug`) | `page` by `slug.current == $slug` | `generateStaticParams` ← `pagesSlugs` (perspective `'published'`, `stega:false`). Slug `homepage` also reachable at `/homepage` — no exclusion. Canonical `/${slug}`. Missing doc → inline "Page not found" JSX with **HTTP 200** (`[slug]/page.tsx:45-52`), no `notFound()` |
| `/services/[slug]` | `frontend/app/services/[slug]/page.tsx` | `getServiceQuery` (`$slug`) | `service` by `slug.current == $slug` | `generateStaticParams` ← `serviceSlugs`. Extra top-level fields: `title`, `heading`, `shortDescription`. Canonical `/services/${slug}`. 4 live services incl. `cats` |
| Root layout (all routes) | `frontend/app/layout.tsx` | `settingsQuery` + `servicesNavQuery` | `settings` singleton (by `_type`, doc lives at UUID) + all services | See §5 |
| `/sitemap.xml` | `frontend/app/sitemap.ts` | `sitemapData` | all page+service with slugs | Host from request `headers()`; `noIndex` excluded (none set); `/services` prefix; priorities 1 / 0.8 / 0.7 |
| `/robots.txt` | `frontend/app/robots.ts` | none | — | Static; hardcoded `https://homeawayfargo.com/sitemap.xml` |
| `/studio/[[...tool]]` | `frontend/app/studio/[[...tool]]/{page,layout}.tsx` | none (NextStudio) | — | Embedded Studio from `frontend/sanity.config.ts`. **Deleted at migration** |
| `POST /api/contact` | `frontend/app/api/contact/route.ts` | none | — | Nodemailer ("Home Away From Home Website" sender); no CMS dependency |
| `GET /api/draft-mode/enable` | `frontend/app/api/draft-mode/enable/route.ts` | — | — | `defineEnableDraftMode`; **deleted at migration** |
| `GET/POST /api/webcam-auth` | `frontend/app/api/webcam-auth/route.ts` | none | — | Env password + hours gate; HMAC secret `WEBCAM_AUTH_SECRET` (fallback `'hafh-webcam'`); TZ America/Chicago; no CMS dependency |
| 404 / error | `frontend/app/not-found.tsx`, `error.tsx` | none | — | Static JSX, no fetch |

Non-page-builder renders: only `/sitemap.xml`, `/robots.txt`, `/studio`, the API routes, and not-found/error boundaries. Everything user-facing is `PageBuilder` → `BlockRenderer` (`frontend/app/components/{PageBuilder,BlockRenderer}.tsx`; BlockRenderer registers all 44 block types, eager set = hero, heroSplit, heroBanner, **heroMarquee**, heroMinimal, ctaBanner, galleryPage, pricingPageTabs, contactForm — `BlockRenderer.tsx:69`).

---

## 2. PROJECTION DELTA

Source of truth: `frontend/sanity/lib/queries.ts` (fragments `linkReference` :3-8, `linkFields` :10-15, `buttonFields` :57-62, `pageBuilderExpansion` :64-288).

### 2.1 Shared shapes (identical to hound-3)

```ts
// IMAGES ARE NEVER DEREFERENCED. No ->url, no lqip, no dimensions anywhere in
// queries.ts (sole exception: settings "faviconUrl": favicon.asset->url, §5 — unset live).
// Components receive the stored reference and build CDN URLs themselves from asset._ref
// (frontend/app/components/SanityImage.tsx; frontend/sanity/lib/image.ts).
type RawImage = {
  _type: 'image'
  asset: { _type: 'reference', _ref: string }   // 'image-<sha>-<W>x<H>-<ext>' — lightbox parses WxH from this (image.ts:23)
  crop?: {...sanity crop}
  hotspot?: {...sanity hotspot}
  alt?: string                                   // only where the schema defines an alt subfield
  caption?: string                               // gallery images only (unused in live data)
}

// LINKS: the one true dereference. Stored `page` reference is REPLACED by the
// target's slug string; `pageType` is ADDED. All other stored keys spread through.
type DereferencedLink = {                        // fragment `linkReference`
  _type: 'link'
  linkType?: 'href' | 'page'
  href?: string                                  // live data: goose.pet booking URLs + one '/pricing#boarding'
  page?: string | null                           // WAS {_ref} — NOW target slug.current
  pageType?: string | null                       // ADDED — target _type ('page' | 'service')
  queryString?: string                           // unset everywhere live
  openInNewTab?: boolean
}
// linkResolver (frontend/sanity/lib/utils.ts:31-56): href → link.href · page →
// `/${page}` or `/services/${page}` when pageType==='service' (+ queryString);
// missing linkType with href present coerced to 'href'.
// NOTE: unlike hound-3, live data has NO stale dual-value links.

type Button = { _type: 'button', buttonText?: string, link?: DereferencedLink }

// PORTABLE TEXT: stored block array passes through EXCEPT markDefs, where each
// link annotation gets the same page→slug replacement + pageType addition.
// Live PT contains zero markDefs and zero inline images (styles normal/h3/h4, marks strong).
type PT = PortableTextBlock[]
```

### 2.2 Per-query delta

**`settingsQuery`** — see §5. Delta vs hound-3: explicit `ctmScriptUrl` in the projection (`queries.ts:53`).

**`getPageQuery` / `homepageQuery`** — top level `{_id, _type, name, slug: {_type:'slug', current}, seo, pageBuilder}`. `pageBuilder` re-projection with per-`_type` conditional deltas:

| Block `_type` | Delta vs stored |
|---|---|
| callToAction | `button` → Button |
| infoSection | `content` markDefs deref (PT rule). Same hound-3 quirk: conditional lacks a leading `...` (`queries.ts:71-79`) — harmless, outer spread passes heading/subheading through |
| hero, heroSplit, **heroMarquee** (new) | `primaryCta`, `secondaryCta` → Button |
| heroBanner | `primaryCta` → Button |
| featureCards, ctaBanner, processSteps, fullWidthMedia, ctaStrip, featureGrid | `cta` → Button |
| serviceCards | `cards[].cta` → Button |
| **expandingCardsRow** (new) | `cards[].link` → Button (`queries.ts:182-188`) |
| serviceTabs | `tabs[]` refs → expanded service docs `{_id, title, slug:{current}, sticker:{asset,alt}, shortDescription, tabImage:{asset,crop,hotspot,alt}, tabCta:Button}` (dead live) |
| testimonials | `reviews[]` refs → expanded `{_id, quote, authorName, authorLabel, rating}` |
| splitContent, requirementsList | nested `link.link` → DereferencedLink |
| faqAccordion | `faqs[].answer` markDefs deref |
| contactForm | `description` markDefs deref |
| featureList, contentColumns | `features[]/columns[]` body markDefs deref + `cta` → Button |
| pricingTable | `categories[].tiers[].cta` → Button |
| pricingCalculator, pricingPageTabs | `ctaLink` → DereferencedLink |
| webcamGrid | **ADDED computed field** `webcams`: sibling subquery `*[_type=="webcam" && enabled==true] \| order(group asc, sortOrder asc){_id,name,cameraId,group,sortOrder}` — **empty array live (0 webcam docs)** |
| heroMinimal, statsBar*, spacer*, iconGrid, videoSection, logoBar, pricingMatrix, pricingList, policyNotes, whatsIncluded, galleryGrid, galleryCarousel, galleryShowcase, galleryPage, imageRow, teamGrid, valuePillars | pass-through `...` (*statsBar and spacer have no conditional at all — pure spread) |

**`getServiceQuery`** — same pageBuilder expansion; top level `{_id, _type, title, slug, heading, shortDescription, seo, pageBuilder}`.

**`sitemapData`** — `{"slug": slug.current, _type, _updatedAt, "noIndex": seo.noIndex}`.
**`pagesSlugs`/`serviceSlugs`** — `{"slug": slug.current}`. **`servicesNavQuery`** — `{_id, title, "slug": slug.current}` ordered `title asc` (fetched every request; consumed only by inert injection, §5).

### 2.3 Before/after sketch — homepage `heroMarquee` block (real data, doc `72d57169-…`)

```jsonc
// STORED (raw dataset)                             // RECEIVED by HeroMarquee.tsx (post-projection)
{                                                   {
  "_key": "…", "_type": "heroMarquee",                "_key": "…", "_type": "heroMarquee",
  "eyebrow": "…", "heading": "…",                     "eyebrow": "…", "heading": "…",
  "subtext": "…",                                     "subtext": "…",
  "reviewRating": 5, "reviewText": "…",               "reviewRating": 5, "reviewText": "…",
  "trustLine": "…",                                   "trustLine": "…",
  "marqueeImages": [ /* 9 × RawImage+alt */ ],        "marqueeImages": [ /* unchanged pass-through */ ],
  "primaryCta": {                                     "primaryCta": {
    "_type": "button",                                  "_type": "button",
    "buttonText": "Book Now",                           "buttonText": "Book Now",
    "link": {                                           "link": {
      "_type": "link",                                    "_type": "link",
      "linkType": "href",                                 "linkType": "href",
      "href": "https://booking.goose.pet/…",              "href": "https://booking.goose.pet/…",
      "openInNewTab": true                                "openInNewTab": true,
    }                                                     "page": null, "pageType": null   // ← ADDED (null: no ref)
  },                                                    }
  "secondaryCta": {                                   },
    "…link": {                                        "secondaryCta": { "…link": {
      "linkType": "page",                                 "linkType": "page",
      "page": {"_ref": "94ef277a-…",                      "page": "pricing",     // ← _ref REPLACED by slug
               "_type": "reference"}                      "pageType": "page"     // ← ADDED
    }                                                 } }
  }                                                 }
}
// Page wrapper: {_id, _type:"page", name:"Homepage", slug:{_type:"slug","current":"homepage"},
//   "seo": {metaTitle:"Home Away From Home | Pet Daycare, Boarding & Grooming in Fargo, ND", metaDescription:"…"},
//   pageBuilder:[heroMarquee, expandingCardsRow, splitContent, statsBar, testimonials, spacer, ctaBanner, spacer]}
```

---

## 3. BLOCK PROPS CONTRACT (23 live block types)

Every block component receives `{block, index: number, pageId: string, pageType: string}` from `BlockRenderer.tsx` (`index` drives eager loading/animation; `pageId`/`pageType` only feed `dataAttr` overlays — dead weight post-migration). Shapes below are the `block` prop. Presence from the 2026-07-10 dataset; **any key below count n is optional-in-practice; components null-guard every field.**

| Block | Component | Resolved `block` shape (post-projection) | Live presence (n; notable gaps) |
|---|---|---|---|
| heroMarquee | `sections/HeroMarquee.tsx` | `{eyebrow?, heading, headingAccent?, subtext?, primaryCta?: Button, secondaryCta?: Button, reviewRating?: number, reviewText?, trustLine?, bubbleText?, heroLogo?: RawImage+alt, marqueeImages?: (RawImage+alt)[]}` — also renders 2 hardcoded public/ illustrations; "Boxers" alt fallbacks | n=1 (homepage); headingAccent, bubbleText, heroLogo absent; 9 marquee images |
| hero | `sections/Hero.tsx` | `{eyebrow?, heading, subtext?, primaryCta?: Button, secondaryCta?: Button, reviewRating?: number, reviewText?, trustLine?, heroImage?: RawImage}` | n=4 (all services); **heroImage/reviewRating/reviewText/trustLine absent on all** — text-only heroes; secondaryCta 3/4 |
| heroMinimal | `sections/HeroMinimal.tsx` | `{eyebrow?, rating?: string, heading, headingAccent?, subtext?, backgroundColor?}` | n=3 (webcams, about, gallery); rating/headingAccent/backgroundColor absent on all |
| expandingCardsRow | `sections/ExpandingCardsRow.tsx` | `{eyebrow?, heading?, subheading?, cards?: Array<{_key, image?: RawImage (no alt — component uses title), title?, subtext?, link?: Button}>, backgroundColor?: 'cream'\|'sand'}` | n=1 (homepage); 4 cards, all full, links → 4 service page-refs |
| spacer | `sections/Spacer.tsx` | `{size?: 'sm'\|'md'\|'lg'\|'xl'}` (sm ≡ md ≡ h-16) | n=15; sizes live: sm×5, md×9, xl×1 |
| splitContent | `sections/SplitContent.tsx` | `{heading, body?: PT, link?: {label?, link?: DereferencedLink}, badge?: RawImage+alt, image?: RawImage+alt, stickerImage?: RawImage+alt, imagePosition?, backgroundColor?}` | n=2 (homepage forest, about cream); link/badge/stickerImage absent on both |
| statsBar | `sections/StatsBar.tsx` | `{stats?: Array<{_key, value, label}>, showLogo?: boolean}` | n=2; 4 stats each, showLogo true |
| testimonials | `sections/Testimonials.tsx` | `{icon?: RawImage+alt, heading, reviews?: Array<{_id, quote, authorName, authorLabel?, rating?}>, googleRating?: string}` (googleReviewCount arrives, dead) | n=1; icon absent; 6 reviews |
| ctaBanner | `sections/CtaBanner.tsx` | `{heading, icon?: RawImage+alt, stickerImage?: RawImage+alt, backgroundImage?: RawImage+alt, sideImage?: RawImage+alt, cta?: Button, alignment?: 'center'\|'left' (NEW field), showRating?: boolean, ratingText?}` — sideImage presence switches layout (never live) | n=10; backgroundImage 6/10, cta 10/10, alignment explicitly set 1/10, showRating true 1/10, ratingText 1/10; icon/stickerImage/sideImage 0/10 |
| faqAccordion | `sections/FaqAccordion.tsx` | `{eyebrow?, heading, faqs?: Array<{_key, question, answer?: PT}>}` + FAQPage JSON-LD via toPlainText | n=3 (daycare 3, boarding 3, new-clients 4); full |
| featureCards | `sections/FeatureCards.tsx` | `{heading, subheading?, stickerLeft?: RawImage+alt, stickerRight?: RawImage+alt, features?: Array<{_key, icon?: IconifyName, title, description?}>, cta?: Button, trustLine?}` (darkMode arrives, dead) | n=4 (one per service); 4 features each; stickers/cta/trustLine absent on all |
| requirementsList | `sections/RequirementsList.tsx` | `{eyebrow?, heading, description?, items?: Array<{_key, text?}>, link?: {label?, link?: DereferencedLink}, image?: RawImage+alt, imagePosition?, backgroundColor?}` | n=3 (boarding, cats, new-clients); 4 items + image each; link absent on all |
| processSteps | `sections/ProcessSteps.tsx` | `{eyebrow?, heading, description?, steps?: Array<{_key, title, badge?, description?, icon?: IconifyName}>, cta?: Button, backgroundColor?}` | n=1 (new-clients); 4 steps, cta present |
| infoSection | `components/InfoSection.tsx` | `{heading?, subheading?, content?: PT}` — rendered via **CustomPortableText** (links/images WOULD work here) | n=1 (contact); 7 blocks, h3+normal, strong marks |
| contactForm | `sections/ContactForm.tsx` | `{eyebrow?, heading, description?: PT, formFields?: Array<{_key, fieldName, label, type?: 'text'\|'email'\|'tel'\|'textarea'\|'select', required?: boolean, options?: string[]}>, submitButtonText?, successMessage?, showMap?: boolean, mapEmbedUrl?, image?: RawImage+alt, address?, phone?, email?, nextSteps?: Array<{_key, title, description?}>}` — reads `?service=` searchParam; appends hardcoded SMS-consent JSX | n=1 (contact); image absent; description/mapEmbedUrl present (both absent in hound-3); 5 fields, 3 nextSteps |
| teamGrid | `sections/TeamGrid.tsx` | `{eyebrow?, heading?, members?: Array<{_key, name, role?, bio?, certifications?: string (comma-separated), image?: RawImage}>}` | n=1 (grooming); 1 member (Sheryl Wagner), **no image**, certifications string |
| pricingTable | `sections/PricingTable.tsx` | `{eyebrow?, heading?, description?, categories?: Array<{_key, categoryName?, tiers?: Array<{_key, name, price?, description?, features?: string[], highlighted?: boolean, cta?: Button}>}>}` | n=3 (daycare 1cat/5 tiers, boarding 3cat/7, grooming 1cat/4); tier CTAs 0; features on all tiers; grooming description carries disclaimer + mobile-grooming note |
| pricingCalculator | `sections/PricingCalculator.tsx` | `{displayMode?: 'single'\|'tabbed', calculatorType?: 'daycare'\|'boarding'\|'grooming', eyebrow?, heading, subheading?, ctaText?, ctaLink?: DereferencedLink, taxNote?}` — **prices from `app/data/pricingData.ts`, NOT the block** | n=3 (one per dog service); all displayMode 'single', all fields present, ctaLink → goose.pet |
| pricingPageTabs | `sections/PricingPageTabs.tsx` | `{eyebrow?, heading, description?, defaultTab?: 'daycare'\|'boarding'\|'grooming', services?: Array<{_key, serviceKey, pricingDisplay?: 'table'\|'matrix', tableData?: {categories?: […pricingTable shape], description?}, matrixData?: {description?, tables?: Array<{_key, tableName?, tableDescription?, columnHeaders?: string[], rows?: Array<{_key, rowLabel?, cells?: Array<{_key, value?, note?}>}>}>, footnotes?: string[]}, showCalculator?: boolean}>, ctaText?, ctaLink?: DereferencedLink, taxNote?}` — `/pricing#boarding` fragment selects tabs | n=1 (pricing); daycare=table, boarding+grooming=matrix, showCalculator all true |
| pricingList | `sections/PricingList.tsx` | `{eyebrow?, heading?, description?, items?: Array<{_key, service, price?, note?}>, columns?: 1\|2, backgroundColor?}` | n=1 (pricing, "Small Animal Pricing", 1 item) |
| galleryPage | `sections/GalleryPage.tsx` | `{heading?, subtext?, images?: (RawImage+alt+caption)[], layout?: 'grid'\|'single', backgroundColor?}` | n=1 (gallery); **heading & subtext absent**; 12 images all with alt, no captions |
| webcamGrid | `sections/WebcamGrid.tsx` | `{heading?, subtext?, trustMessage?, showGroupHeaders?: boolean, webcams: Array<{_id, name, cameraId, group, sortOrder?}>}` — `webcams` query-injected, pre-filtered/sorted | n=1 (webcams); all copy fields present; **webcams = [] (0 docs)** — renders empty grid behind password gate |
| valuePillars | `sections/ValuePillars.tsx` | `{eyebrow?, heading?, description?, pillars?: Array<{_key, metric, title, description?}>, columns?: 2\|3\|4, accentImage?: RawImage+alt, backgroundColor?}` | n=1 (about); 3 pillars, columns 3 |

Dead blocks (schema+component exist, zero live instances — adapter may skip): callToAction, imageRow, serviceTabs, webcamPreview, galleryGrid, heroSplit, heroBanner, serviceCards, featureList, contentColumns, iconGrid, videoSection, fullWidthMedia, ctaStrip, logoBar, pricingMatrix, policyNotes, featureGrid, whatsIncluded, galleryCarousel, galleryShowcase (21).

---

## 4. PREVIEW/EDITING COUPLING INVENTORY

Surface area that exists only for Sanity live preview / visual editing — the deletion list at migration:

**Infrastructure (whole files):**

| File | Coupling |
|---|---|
| `frontend/sanity/lib/live.ts` | `defineLive` → `sanityFetch` + `SanityLive` (the fetch layer itself) |
| `frontend/sanity/lib/client.ts` | `stega: {studioUrl}` on the client |
| `frontend/sanity/lib/token.ts`, `api.ts` | token + `studioUrl` for edit-intent links |
| `frontend/sanity/lib/utils.ts:58-67` | `dataAttr` / `createDataAttribute` |
| `frontend/app/api/draft-mode/enable/route.ts` | `defineEnableDraftMode` |
| `frontend/app/actions.ts` | `disableDraftMode` server action |
| `frontend/app/components/DraftModeToast.tsx` | `useDraftModeEnvironment` from `next-sanity/hooks` |
| `frontend/app/client-utils.ts` | `handleError` for `<SanityLive/>` CORS toasts |
| `frontend/app/studio/[[...tool]]/{page,layout}.tsx`, `frontend/sanity.config.ts`, `frontend/sanity.cli.ts` | embedded Studio + typegen config |
| `frontend/app/layout.tsx` (:20-33, 136, 232-238) | `draftMode()`, `VisualEditing`, `DraftModeToast`, `SanityLive` |

**Structural components:**

- `frontend/app/components/PageBuilder.tsx` — `useOptimistic` (from `next-sanity/hooks`) drag-and-drop reconciliation + `dataAttr` wrapper
- `frontend/app/components/BlockRenderer.tsx` — per-block `data-sanity={dataAttr(...)}` attribute (the only reason `pageId`/`pageType` props exist)

**`sanityFetch` callers (replace with adapter calls):** `app/layout.tsx`, `app/page.tsx`, `app/[slug]/page.tsx`, `app/services/[slug]/page.tsx`, `app/sitemap.ts`.

**`stegaClean()` callers (grep, 27 files — hound-3's 25 + ExpandingCardsRow + RequirementsList):** `Cta.tsx` and sections/ `ContactForm, ContentColumns, CtaStrip, ExpandingCardsRow, FeatureGrid, FeatureList, FullWidthMedia, GalleryCarousel, GalleryGrid, GalleryPage, GalleryShowcase, HeroBanner, HeroMinimal, HeroSplit, IconGrid, LogoBar, PolicyNotes, PricingList, PricingMatrix, ProcessSteps, RequirementsList, ServiceCards, SplitContent, ValuePillars, VideoSection, WhatsIncluded` — each on enum-ish fields (`backgroundColor`/`layout`/`imagePosition`/…) because stega pollutes string comparison. Adapter returning clean strings makes every call a no-op → delete.

`NOT FOUND`: no other draft/preview mechanism.

---

## 5. SHARED SHELL DATA (layout.tsx / Header / Footer)

`frontend/app/layout.tsx` fetches twice per request (plus once more in `generateMetadata` with `stega:false`):

**A. `settingsQuery` → `settings` singleton** (matched by `_type`, doc lives at UUID `0f056e49-…`). Post-projection shape delivered, annotated with live values:

```jsonc
{
  // metadata (generateMetadata, layout.tsx:94-133)
  "title": "Home Away From Home",              // template `%s | title` — NOTE: page metaTitles already carry the suffix → doubled
  "description": null,                         // PT, unset live → meta description '' (toPlainText path)
  "ogImage": null,                             // unset → no OG image, no metadataBase, JSON-LD urls undefined
  "faviconUrl": null,                          // only asset-URL deref in codebase; unset → app/icon.svg serves
  "googleSiteVerification": null,

  // scripts (layout.tsx:209-230)
  "gtmContainerId": "GTM-P7N66QD2",            // @next/third-parties GoogleTagManager (in <body> — drift vs hound-3's <head>) + noscript iframe
  "ga4MeasurementId": null,                    // gtag fallback only when NO gtmContainerId
  "ctmScriptUrl": "//598475.tctm.co/t.js",     // <Script async afterInteractive>

  // JSON-LD (layout.tsx:35-92, 169-208)
  "localBusiness": {                           // POPULATED (unlike hound-3) → LocalBusiness JSON-LD on every page
    "businessName": "Home Away From Home", "businessType": "Kennel",
    "address": {street, city:"Fargo", state:"ND", zip:"58104", country:"US"},
    "phone": "701-532-1618",
    "geoCoordinates": {latitude: 46.8425, longitude: -96.8295},
    "businessHours": [{days:"Mo-Fr",open:"07:00",close:"19:00"}, {days:"Sa",…}, {days:"Su",…}],
    "priceRange": "$$"
  },
  "socialLinks": {},                           // present-but-empty object → sameAs []
  "logo": RawImage,                            // SET (289×174 png). Header/Footer render via SanityImage;
                                               // Organization JSON-LD emits logo as RAW asset._ref — LIVE BUG (layout.tsx:184-186)

  // Header props (components/Header.tsx {navItems, ctaButton, logo})
  "navItems": [                                // 3 items
    { "label": "Services and Pricing",         // ← NOT 'Services': injection at layout.tsx:148-160 does NOT fire.
      "children": [                            //    Dropdown children are CMS-authored page references:
        {label:"Dog Daycare",  link: DereferencedLink→/services/daycare},
        {label:"Dog Boarding", link: →/services/boarding},
        {label:"Grooming",     link: →/services/grooming},
        {label:"Cat Services", link: →/services/cats} ] },
    { "label": "Gallery",     "link": DereferencedLink→/gallery },
    { "label": "New Clients", "link": DereferencedLink→/new-clients }
  ],
  "ctaButton": Button,                         // "Contact Us" → page ref /contact (clean single-branch link)

  // Footer props (components/Footer.tsx)
  "footerTagline": "Proudly serving pet families in Fargo, Moorhead, West Fargo, Dilworth…",
  "footerColumns": [                           // 2 columns, all page-ref links
    {title:"Services",    links: [Dog Daycare, Dog Boarding, Grooming, Cat Services]},
    {title:"Information", links: [Gallery, New Clients, Contact]}   // About/Pricing removed in client rounds
  ],
  "contactInfo": {address:"5390 51st Ave S Suite A, Fargo, ND 58104", phone:"701-532-1618", email:"hafhfacility@gmail.com"},
  "footerText": "© 2026 Home Away From Home. All rights reserved.",
  "footerTextLink": {label:"Embark Pet Services", href:"https://www.embarkpetservices.com/"},
  "footerBottomLinks": null,                   // unset
  "footerSticker": null,                       // unset
  "yearEstablished": 2017,                     // fetched, never consumed — drop
  "tagline": "…"                               // arrives via `...` spread — never consumed, drop
}
```

All link objects inside navItems/footer follow the `DereferencedLink` deref (`linkFields` at every nesting level, `queries.ts:17-55`). Footer resolves via its own wrapper around the same `linkResolver`.

**B. `servicesNavQuery` → `[{_id, title, slug: string}]`** ordered by title — fetched every request, but its only consumer (the `'Services'` label injection, `layout.tsx:148-160`) never fires on this site's data. **Adapter decision:** either drop this fetch + the injection entirely and trust CMS-authored nav children (current live behavior), or make service-driven nav an explicit feature — do not port the magic label.

Adapter contract for the shell: one call returning the settings shape above (links pre-resolved to DereferencedLink) — the services list is only needed if the injection feature is kept.

---

*Every shape above was verified against `frontend/sanity/lib/queries.ts`, the consuming components (byte-diffed against hound-3 to isolate HAFH drift), and the live dataset `dafhmkyq/production` (read-only, 2026-07-10). Fields marked absent-in-live-data are schema-valid and code-handled; the adapter must still support them.*
