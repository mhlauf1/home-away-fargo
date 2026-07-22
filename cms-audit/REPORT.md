# CMS Audit — Home Away From Home (`home-away-fargo`)

**Audited:** 2026-07-10 · **Model:** claude-fable-5 · **Companion files:** `cms-audit/schema-inventory.json`, `cms-audit/render-contract.md`

> Clone lineage: this repo was cloned from `hound-3` (Hound Around Resort). Drift vs hound-3 was established by **byte-level diff of both repos** (`diff -rq`), so every "identical to hound-3" claim below is mechanical, not judgment.

## Executive Summary

1. 54 schema types registered: 4 documents (`page`, `service`, `testimonial`, `webcam`), 1 settings singleton, 49 objects (44 page-builder blocks + `seo`, `button`, `link`, 2 PT types).
2. Schema drift vs hound-3 is tiny and additive: **3 new blocks** (`heroMarquee`, `expandingCardsRow`, `spacer`), **1 new field** (`ctaBanner.alignment`); everything else byte-identical (settings differs only in strings/field order).
3. Same 3 Portable Text configurations as hound-3 (`blockContent`, `blockContentTextOnly`, inline settings.description). Live PT content is minimal: **zero link annotations, zero inline images**, styles normal/h3/h4, marks `strong` only.
4. 8 GROQ queries in one file, all via `next-sanity` Live (`sanityFetch`); no webhook/revalidate route.
5. Live dataset is small and exceptionally clean: **60 total docs** — 7 pages, 4 services, 6 testimonials, **0 webcams**, 1 settings, 28 images, **zero drafts, zero orphaned types, zero dirty dual-value links** (all unlike hound-3).
6. 23 of 44 block types used live; 21 dead. Usage pattern diverges heavily from hound-3 (e.g. `serviceTabs`/`heroSplit`/`ctaStrip` dead here; `infoSection`/`teamGrid`/`pricingTable`/`valuePillars`/`pricingList` alive here).
7. **Every page and service has `seo` populated** (metaTitle + metaDescription) — but each metaTitle already ends in "| Home Away From Home", which the layout title template appends **again** (doubled suffix on every rendered title).
8. **Top risk #1:** the settings singleton lives at a UUID, not the `siteSettings` ID the Studio and presentation tool expect — the "Site Settings" desk entry opens an *empty* document; an unrun fix script sits in `scripts/`.
9. **Top risk #2:** the "Services" nav-injection magic label is inert (nav item renamed "Services and Pricing") — the services dropdown is CMS-authored children, not injected; new services won't auto-appear.
10. **Top risk #3:** dual-source pricing (hardcoded `pricingData.ts` calculators vs CMS tables) has already caused two rounds of paired code+CMS price edits on this site.

---

## Phase 0 — Repo Orientation

| Item | Value | Evidence |
|---|---|---|
| Repo / brand | `home-away-fargo` — Home Away From Home, pet daycare/boarding/grooming/cat services, Fargo ND. **Root `package.json` name is still `hound-3`** | `package.json:2`, `CLAUDE.md` |
| Structure | npm-workspaces monorepo: `studio/` + `frontend/` (same as hound-3) | root `package.json` |
| Framework | Next.js **16.1.1**, App Router, React 19.2.3, TS 5.9.3, Tailwind v4 (no `tailwind.config.ts` — hound-3's leftover was deleted here) | `frontend/package.json`, diff vs hound-3 |
| Sanity deps | `sanity ^5.1.0`, `next-sanity ^12.0.5`, `@sanity/image-url ^1.2.0`, `sanity-image ^1.0.0`, `@sanity/assist`, `@sanity/vision`, Unsplash plugin; plus `@next/third-parties ^16.1.1` (GTM) | both `package.json`s |
| ⚠️ `@portabletext/react` | Imported in 5 components but **not a direct dependency** — resolved transitively via `next-sanity` (same phantom as hound-3) | `frontend/package.json` vs imports in `sections/{FaqAccordion,SplitContent,FeatureList,ContentColumns,ContactForm}.tsx` |
| Project / dataset | `dafhmkyq` / `production` | `frontend/.env.local`, `studio/.env.local` (public identifiers) |
| API version | `2025-09-25` (default in `frontend/sanity/lib/api.ts:27`) | |
| Env vars (names only) | Sanity: `NEXT_PUBLIC_SANITY_{PROJECT_ID,DATASET,API_VERSION,STUDIO_URL}`, `SANITY_API_READ_TOKEN` (server-only, throws if missing); studio: `SANITY_STUDIO_{PROJECT_ID,DATASET,PREVIEW_URL,STUDIO_HOST}`; non-Sanity: `SMTP_HOST/PORT/USER/PASS/FROM`, `CONTACT_FORM_TO_EMAIL`, `WEBCAM_PASSWORD`, `WEBCAM_OPEN_HOUR`, `WEBCAM_CLOSE_HOUR`, **`WEBCAM_AUTH_SECRET` (new vs hound-3, HMAC secret, fallback `'hafh-webcam'`)** | `api.ts`, `token.ts`, `api/webcam-auth/route.ts:6-8` |
| Studio hosting | **Both**: standalone `studio/` workspace and embedded at `frontend/app/studio/[[...tool]]/page.tsx` (`transpilePackages:['studio']`). **Config drift:** `frontend/sanity.config.ts` is cleaned up (proper `/services/:slug` mainDocument + service locations); `studio/sanity.config.ts` still carries hound-3 template leftovers (`post` routes/locations for a nonexistent type, `studio/sanity.config.ts:38,66-79,101-118`) | |
| Plugins | presentationTool (enable `/api/draft-mode/enable`), structureTool (custom), Unsplash, AI Assist, Vision — same set in both configs | `studio/sanity.config.ts`, `frontend/sanity.config.ts` |
| Analytics wiring | GTM via `@next/third-parties` rendered **in `<body>`** (drift: hound-3 renders in `<head>`); CallTrackingMetrics `<Script async>`; GA4 gtag fallback only when no GTM | `frontend/app/layout.tsx:209-230` |

**Sanity directory map** — identical layout to hound-3: schemas `studio/src/schemaTypes/{documents,objects,singletons}/` + registry `index.ts` + desk `studio/src/structure/index.ts`; client/queries `frontend/sanity/lib/{api,client,token,live,queries,utils,image,types}.ts`; PT renderers `frontend/app/components/PortableText.tsx` + 5 bare renders; draft mode `frontend/app/api/draft-mode/enable/route.ts` + `frontend/app/actions.ts`; typegen artifact `sanity.schema.json` at repo root. One extra: **`scripts/migrate-settings-id.js`** (unrun — see Phase 5).

**Rendering strategy:** identical to hound-3 — every fetch via `sanityFetch` from `defineLive` (`frontend/sanity/lib/live.ts`), `<SanityLive/>` in `layout.tsx:238`, client `useCdn:true` + token + stega; `generateStaticParams` with `perspective:'published', stega:false`; metadata fetches `stega:false`. No ISR revalidate constants, no webhook route — `NOT FOUND`.

---

## Phase 1 — Schema Extraction

### 1a. Type census

All 54 types registered in `studio/src/schemaTypes/index.ts:56-115`; every file in `studio/src/schemaTypes/` is registered — no unregistered schema files. Desk structure identical to hound-3 (pluralized lists, `settings` + `assist.instruction.context` hidden, "Site Settings" pinned to document ID `siteSettings` — which **does not exist in the dataset**, see Phase 5).

| Kind | Types |
|---|---|
| singleton | settings (`singletons/settings.tsx`) |
| documents | page, service, testimonial, webcam (`documents/*.ts`) |
| shared objects | seo, button, link, blockContent (PT), blockContentTextOnly (PT) |
| page-builder blocks (44) | the 41 hound-3 blocks (callToAction, infoSection, hero, imageRow, featureCards, serviceTabs, statsBar, webcamPreview, testimonials, ctaBanner, splitContent, faqAccordion, pricingTable, teamGrid, galleryGrid, contactForm, heroSplit, heroBanner, heroMinimal, serviceCards, featureList, processSteps, contentColumns, iconGrid, videoSection, fullWidthMedia, ctaStrip, logoBar, pricingMatrix, pricingList, policyNotes, featureGrid, pricingCalculator, whatsIncluded, requirementsList, webcamGrid, galleryCarousel, galleryShowcase, galleryPage, valuePillars, pricingPageTabs) **+ heroMarquee, expandingCardsRow, spacer** |

**Schema drift vs hound-3 (complete list, from `diff -rq` of both schema trees):**

| File | Drift |
|---|---|
| `objects/heroMarquee.ts` | **NEW** — 12 fields: eyebrow, heading (req), headingAccent, subtext, primaryCta/secondaryCta (button), reviewRating (1–5), reviewText, trustLine, bubbleText (SVG circle badge), heroLogo (image+alt), marqueeImages (image[]+alt) |
| `objects/expandingCardsRow.ts` | **NEW** — eyebrow, heading (req), subheading, cards (min 2 max 4: image required **no alt field**, title req, subtext, link:button), backgroundColor (cream\|sand, init cream) |
| `objects/spacer.ts` | **NEW** — size (sm\|md\|lg\|xl radio, init md). Component maps sm and md to the same `h-16` |
| `objects/ctaBanner.ts` | **+`alignment`** (center\|left radio, init center; full-width layout only), `ctaBanner.ts:79-92` |
| `documents/page.ts` | pageBuilder 41 → **44** members |
| `documents/service.ts` | pageBuilder 39 → **42** members (still omits `galleryPage`, `pricingPageTabs`) |
| `singletons/settings.tsx` | strings only: initialValue 'Home Away From Home', footerText description, `ctmScriptUrl` field moved after `googleSiteVerification` with reworded description. **Field set identical** |
| everything else | byte-identical to hound-3 |

### 1b. Field-by-field breakdown

**Complete field-by-field breakdown — every field, validation rule (quoted), initialValue, hidden condition, hotspot flag, preview, consuming component, live-population note — is in `schema-inventory.json` (`documentTypes`, `objectTypes`, `settingsSingleton`).** Cross-cutting patterns (all inherited from hound-3): recurring block anatomy of `eyebrow` + required `heading` + content + optional `button` + `backgroundColor` radio (cream/sand/forest); Iconify icon-name strings rendered via `@iconify/react` (external `api.iconify.design` dependency, preconnected in layout); conditional hidden callbacks and custom validators identical to hound-3 (link require-when-selected pairs ×3, ogImage.alt required-if-asset, GA4/GTM regex warnings, `pricingCalculator.calculatorType` required-for-single-mode).

HAFH-specific field notes:

- `service` gained no fields, but `sticker`/`tabImage`/`tabCta` are **dead in practice** here: their only consumer (`serviceTabs`) has zero live usage and all 4 services leave them unset.
- `expandingCardsRow.cards[].image` is required but has **no alt field** — component falls back to `card.title` as alt (`ExpandingCardsRow.tsx:66`).
- `pricingPageTabs` remains the complexity peak (5-level nesting, reused `_type` names `pricingCategory`/`pricingTier`/`matrixTable`/`matrixRow`/`matrixCell`).

### 1c. Portable Text deep-dive

All three configs byte-identical to hound-3; full detail in `schema-inventory.json → portableTextConfigs`.

**Config 1 — `blockContent`**: unrestricted defaults (normal, h1–h6, blockquote; bullet/number; strong/em/code/underline/strike); one custom `link` annotation (`linkType` init `'href'`, `href`, `page` → **`page` refs only**, `openInNewTab`); custom `image` block member (hotspot, **no fields — no alt possible**). Used by: `infoSection.content`, `splitContent.body`, `faqAccordion.faqs[].answer`, `featureList.features[].body`, `contentColumns.columns[].body`, `contactForm.description`.

**Config 2 — `blockContentTextOnly`**: bare `{type:'block'}` → Sanity's **default** `{href}` link annotation (different shape from Config 1). Used by `callToAction.body` only (block unused live).

**Config 3 — `settings.description`**: styles/lists/decorators explicitly `[]`; custom link annotation same as Config 1. Only ever flattened via `toPlainText()` for the meta description (`layout.tsx:117`) — and **unset in live data**, so the default meta description is the empty string.

**Rendering — same critical split as hound-3:**

| Render site | Component map | Links render? | Inline images render? |
|---|---|---|---|
| `PortableText.tsx` (CustomPortableText) → `InfoSection.tsx`, `Cta.tsx` | `types.image` (w672 cover), `block.h1/h2` anchor headings (block `_key` as fragment), `marks.link` → `ResolvedLink`/`linkResolver` | ✅ | ✅ (alt always empty — no schema field) |
| `SplitContent.tsx`, `FaqAccordion.tsx`, `FeatureList.tsx`, `ContentColumns.tsx`, `ContactForm.tsx` | **none — bare `<PortableText>` from `@portabletext/react`** | ❌ plain text | ❌ unhandled |

**Live PT reality check (GROQ over all page/service docs, 2026-07-10):** zero link annotations, zero inline images anywhere. Styles used: `normal` everywhere; `h3` (infoSection content, contact page); `h4` (about splitContent). Marks used: `strong` only. All 10 FAQ answers are single normal blocks. → The bare-renderer risk is **latent, not active**, on this site. Serialization quirks: `FaqAccordion.tsx` flattens answers via `toPlainText` into FAQPage JSON-LD; `linkResolver` (`utils.ts:35-37`) backfills `linkType='href'`.

### 1d. Settings singleton

Same 22 fields as hound-3 (full per-field detail + live values in `schema-inventory.json → settingsSingleton`). Consumption concentrated in `frontend/app/layout.tsx` via `settingsQuery` (metadata, JSON-LD, GTM/CTM scripts, Header/Footer props).

Live-data status — **notably fuller than hound-3**: populated: title, tagline (dead field), logo (289×174 png), navItems (3, with CMS-authored dropdown children), ctaButton (→ contact page), footerTagline, footerColumns (2), footerText, footerTextLink (Embark), contactInfo (`hafhfacility@gmail.com`), yearEstablished (dead field), `gtmContainerId: GTM-P7N66QD2`, `ctmScriptUrl: //598475.tctm.co/t.js`, **localBusiness fully populated** (Kennel, address, phone, geo 46.8425/−96.8295, 3 hours rows, `$$`) → LocalBusiness JSON-LD emits on every page. Empty: description, favicon, ogImage, footerBottomLinks, footerSticker, ga4MeasurementId, googleSiteVerification; socialLinks is a **present-but-empty object `{}`**.

**Hardcoded values that belong in settings (migration cleanup items):**

| Value | File |
|---|---|
| Phone 701-532-1618 (4+ dogs notice) | `frontend/app/components/pricing/CalculatorInputs.tsx:194-195` |
| Domain `homeawayfargo.com` (sitemap URL) | `frontend/app/robots.ts:9` |
| **All calculator pricing** (incl. exit bath $49/$59/$69/$89, boarding +$39/dog) | `frontend/app/data/pricingData.ts` (285 lines) |
| Brand fallbacks / email branding / TextLogo wordmark / webcam prompt copy | `layout.tsx:99`, `api/contact/route.ts:55-62`, `TextLogo.tsx:9-16`, `sections/WebcamGrid.tsx:127` |
| SMS/MMS consent paragraph (hardcoded JSX) | `sections/ContactForm.tsx:183-190` |
| Grooming "starting at" disclaimer (duplicated with CMS pricingTable.description) | `pricing/GroomingCalculator.tsx:78-81` |
| **Cross-site leakage:** 'Boxers Bed & Biscuits' / 'Boxers facility' alt fallbacks | `sections/HeroMarquee.tsx:92` + marquee alt |
| Contact recipient + SMTP (env), webcam password/hours/HMAC secret (env), TZ America/Chicago | `api/contact/route.ts`, `api/webcam-auth/route.ts` |
| IPCamLive player URL template | `sections/WebcamEmbed.tsx:24` |
| `'Services'` magic nav label (inert — see Phase 4) | `layout.tsx:149` |

---

## Phase 2 — Query & Consumption Analysis

All 8 queries live in `frontend/sanity/lib/queries.ts`, captured **verbatim with fragments expanded** in `schema-inventory.json → queries`. Drift vs hound-3: `settingsQuery` adds explicit `ctmScriptUrl` (`queries.ts:53`); `pageBuilderExpansion` adds `heroMarquee` (`:167-171`) and `expandingCardsRow` (`:182-188`) conditionals. Everything else identical.

| Query | Used by | Types touched |
|---|---|---|
| `settingsQuery` | `layout.tsx` (metadata + layout) | settings (+page/service deref in links) |
| `getPageQuery` / `homepageQuery` | `[slug]/page.tsx` / `page.tsx` | page + all 44 blocks (+service, testimonial, webcam derefs) |
| `getServiceQuery` | `services/[slug]/page.tsx` | service + blocks |
| `pagesSlugs` / `serviceSlugs` | generateStaticParams | page / service |
| `sitemapData` | `sitemap.ts` | page + service (slug, _updatedAt, seo.noIndex) |
| `servicesNavQuery` | `layout.tsx` nav injection — **inert** (label mismatch) | service |

**Fetch config:** identical to hound-3 (Live everywhere; CDN on; token always; stega off for metadata/static-params; presentation-tool draft mode; webhooks `NOT FOUND`).

**Dead fields (code-level evidence):**

| Dead field | Evidence |
|---|---|
| `featureCards.darkMode` | typed but never destructured, `FeatureCards.tsx` (set `true` on all 4 live instances — inert) |
| `webcamPreview.webcamUrl` | typed but never destructured, `WebcamPreview.tsx` |
| `testimonials.googleReviewCount` | typed but never destructured, `Testimonials.tsx` (set live — inert) |
| `settings.tagline` | set live, never queried into a component (footer uses `footerTagline`) |
| `settings.yearEstablished` | in `settingsQuery`, set live, never rendered |
| `galleryShowcase.images[].caption` | schema-defined, never rendered |
| `service.heading` | populated on all 4 services but only a metadata-description fallback that never fires (seo.metaDescription set everywhere) |
| `service.sticker` / `tabImage` / `tabCta` | only consumer `serviceTabs` has zero live usage; unset on all 4 services |

Plus 21 block types with zero live usage (Phase 5).

---

## Phase 3 — Asset & Image Pipeline

- **Primary path (`sanity-image`):** `frontend/app/components/SanityImage.tsx` wraps `<SanityImage baseUrl={cdn.sanity.io/images/${projectId}/${dataset}/}>`; components pass `asset._ref` + `width` + optional `crop`/`hotspot`/`mode`. **Distinct widths:** 24, 28, 42, 80, 120, 128(+h128), 150, 160, 200, 400, 500, 600, 672, 700, 704, 880, 960, 1000, 1200, 1400 (grep of all `width={N}`). `next/image` is **not** used for CMS content (`next.config.ts` remotePatterns effectively unused).
- **OG images (`@sanity/image-url`):** `utils.ts:25` — `.width(1200).height(627).fit('crop')`. Currently never fires (no ogImage anywhere).
- **Lightbox (`@sanity/image-url`):** `image.ts:16-28` — `.width(1600).auto('format')` + natural dimensions **parsed from the `_ref` filename pattern** `/-(\d+)x(\d+)-/` for yet-another-react-lightbox (GalleryGrid/Carousel/Page/Showcase; only GalleryPage is live).
- **Hotspot/crop:** respected where components forward `crop`/`hotspot` (HeroMarquee marquee, ExpandingCardsRow, RequirementsList, SplitContent, etc.); `Cta.tsx` and `PortableText.tsx` pass only `crop`.
- **Alt text:** schema alt subfields on most content images. Gaps: `hero.heroImage`, `heroBanner.backgroundImage`, `videoSection.thumbnail`, `teamGrid.members[].image`, `serviceCards.cards[].image`, `callToAction.image` (hardcoded `alt="Demo image"`), **`expandingCardsRow.cards[].image` (new — falls back to card title)**, blockContent inline images (no field). Live data: all 12 gallery images and all 9 marquee images have alts; captions used nowhere.
- **Non-image files:** none (`sanity.fileAsset` = 0).
- **Non-Sanity images:** `frontend/public/illustrations/hero-left-dog.png`, `hero-right-image.png` (rendered by HeroMarquee), `frontend/public/images/bg-line.png`, `logo-no-bg.png`; `frontend/app/icon.svg` (actual favicon); studio thumbnails: **only 2 of 44** (`callToAction.webp`, `infoSection.webp`) — 42 broken insert-menu previews (Studio-only cosmetic).

---

## Phase 4 — Structural & Relational Map

**Reference graph** (all strong references; unchanged from hound-3 except the new button-carrying block):

```
serviceTabs.tabs[]            ──→ service      (block unused live)
testimonials.reviews[]        ──→ testimonial  (1 live instance, 6 refs)
link.page                     ──→ page | service   (standalone link object)
blockContent link.page        ──→ page             (PT annotation; none in live data)
settings.description link     ──→ page             (PT annotation; field unset)
expandingCardsRow.cards[].link.link.page ──→ page | service  (via button→link; 4 live refs → services)
webcamGrid ──(GROQ sibling subquery, no reference)──→ webcam  (0 docs)
settings   ──(link objects in nav/footer/cta)──→ page | service
```

- **Slug/routing:** `page.slug` → `/{slug}` (homepage pinned to slug `homepage`; also reachable at `/homepage` — no exclusion); `service.slug` → `/services/{slug}`. `linkResolver` (`utils.ts:31-56`) prefixes `/services/` when `pageType === 'service'`, appends optional `queryString`. **No sub-site — `subSite: null`.**
- **Navigation:** CMS-driven `settings.navItems`. The hound-3 magic-label injection (`label === 'Services'` → replace children with live service docs, `layout.tsx:148-160`) is **inert here**: the live label is "Services and Pricing" and its 4 dropdown children are CMS-authored page references. `servicesNavQuery` still executes every request. Footer fully CMS-driven (2 columns).
- **SEO:** shared `seo` object; fallback chain in JSON (`seoModel`). All 11 documents have metaTitle+metaDescription; **doubled title suffix** (metaTitle already carries "| Home Away From Home", template `%s | title` appends again — `[slug]/page.tsx:34` + `layout.tsx:113-116`). JSON-LD: LocalBusiness (**emitted** — settings.localBusiness populated), Organization (**live bug:** `logo: settings.logo.asset._ref` raw ref, `layout.tsx:184-186`), WebSite (`url` undefined — no metadataBase), FAQPage per faqAccordion (3 live). Canonicals hardcoded per route.
- **Redirects:** `NOT FOUND` (none in `next.config.ts`, no middleware, none in CMS).
- **Sitemap:** `app/sitemap.ts` from `sitemapData` (noIndex excluded; host from request headers). **Robots:** static, hardcoded `https://homeawayfargo.com/sitemap.xml`.
- **Theme note:** the three-theme system described in `context/` docs does not exist in code — `globals.css` defines a single `--theme-*` palette, no ThemeToggle/data-theme (docs stale, not a code issue).

---

## Phase 5 — Live Dataset Snapshot (project `dafhmkyq`, dataset `production`, read-only via Sanity MCP, 2026-07-10)

| Type | Published | Drafts |
|---|---|---|
| page | 7 | 0 |
| service | 4 | 0 |
| testimonial | 6 | 0 |
| webcam | **0** | 0 |
| settings | 1 (at UUID `0f056e49-…`, **not** `siteSettings`) | 0 |
| sanity.imageAsset | 28 | — |
| sanity.fileAsset | 0 | — |

Total 60 docs (incl. system/tooling: `sanity.previewUrlSecret`, `system.*` — do not migrate). **No orphaned types** (unlike hound-3's `gallery` draft).

- **Pages:** homepage, about, pricing, webcams, contact, new-clients, gallery. **Services:** daycare, boarding, grooming, **cats** (4th — drift vs hound-3).
- **Block usage: 23 of 44 used; 21 never used** (full lists in JSON `dataset_snapshot`). Notable drift vs hound-3 in both directions — dead here but alive there: `serviceTabs`, `heroSplit`, `heroBanner`, `ctaStrip`, `iconGrid`, `whatsIncluded`, `galleryGrid`, `galleryCarousel`; alive here but dead there: `infoSection`, `teamGrid`, `pricingTable`, `valuePillars`, `pricingList` (+ the 3 new blocks, all used).
- **Settings identity:** the desk structure pins `siteSettings`; the only doc is at a UUID. `scripts/migrate-settings-id.js` (repo root) was written to move it and **has not been run** — "Site Settings" in Studio opens an empty new doc; presentation `/` mainDocument filter matches nothing. Frontend unaffected (queries by `_type`).
- **Shape findings:** link data is **clean** — no dual-value/stale hrefs (every link has exactly one populated branch; hound-3's espn.com/google.com garbage pattern absent). One internal link stored as href: daycare hero secondaryCta `{linkType:'href', href:'/pricing#boarding'}` (fragment deep-link into pricingPageTabs). All external CTAs point at `booking.goose.pet/home-away-from-home/...` (Goose, not the Gingr app named in project docs). `teamGrid` member `certifications` is a single comma-separated string. `/webcams` page is live (seo'd, in sitemap) with an empty webcam grid behind its password gate.

---

## Phase 6 — Migration Risk Flags (priority order — full list with evidence in JSON `riskFlags`)

1. **HIGH — Settings singleton at wrong ID.** Only settings doc is at UUID `0f056e49-…`; Studio pin + presentation filter expect `siteSettings`; editing "Site Settings" in Studio risks a competing second doc. Unrun `scripts/migrate-settings-id.js`. Migrate from the UUID doc; fix identity or make embark-os id-agnostic.
2. **HIGH — Inert nav injection.** `label === 'Services'` no longer matches "Services and Pricing"; dropdown is CMS children. Adapter must reproduce the CMS-children path; do not port the magic-label logic (or port it knowingly — a label rename back would silently re-activate it).
3. **HIGH — Dual-source pricing.** `pricingData.ts` (calculators) vs CMS `pricingTable`/`pricingPageTabs` (display). Two documented rounds of paired edits on this site already. Single-source in embark-os.
4. **HIGH — Visual-editing coupling.** `sanityFetch` everywhere, stegaClean in 27 files, `useOptimistic`/`dataAttr`, presentation in two configs (see render-contract §4 for the deletion list).
5. **MEDIUM — Doubled title suffix** on every rendered page title (data already carries the brand suffix the template adds).
6. **MEDIUM — Organization JSON-LD raw `_ref` logo — live bug** (logo is set on this site, unlike hound-3).
7. **MEDIUM — Hollow site-wide SEO defaults** (no settings.description → empty meta description; no OG image anywhere; favicon from `app/icon.svg`).
8. **MEDIUM — Latent bare-PT renderer gap** (5 of 7 render sites drop link marks; currently zero links in content).
9. **MEDIUM — Cross-site leakage in code** (`HeroMarquee.tsx` "Boxers" alt fallbacks; root package named `hound-3`).
10. **MEDIUM —** Image-pipeline reproduction (20 widths, OG crop, `_ref`-encoded dimensions trick); Sanity typegen build dependency; three link shapes → one resolver.
11. **LOW —** `/webcams` live with 0 webcam docs; 42 missing Studio thumbnails; `studio/sanity.config.ts` `post` leftovers; `/pricing#boarding` href-style internal link; Spacer `sm`≡`md`; empty `socialLinks: {}`; dead fields table (Phase 2) and 21 unused blocks — drop, don't migrate.

---

## Final checklist

- [x] Every schema file in `studio/src/schemaTypes/` appears in the inventory; all registered in `index.ts` (cross-checked mechanically; no unregistered files)
- [x] Every field of every type listed (see `schema-inventory.json` — no "etc.")
- [x] Every GROQ query captured (8, verbatim with fragments expanded, in JSON)
- [x] Claims cite file paths; unknowns marked `NOT FOUND` (webhooks, redirects) — no `UNCERTAIN` items remaining
- [x] JSON validates (`python3 -m json.tool`) and top-level shape matches the hound-3 inventory (one additive key: `cloneLineage`)
