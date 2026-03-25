# Webcam Page Integration Spec — Hound Around Resort

## Instructions for Claude Code

**BEFORE writing any code**, explore the existing codebase thoroughly:

1. Read through the entire project structure — `frontend/`, `studio/`, and all config files
2. Understand the existing Sanity schema architecture (document types, page builder blocks, how `BlockRenderer` maps block types to components)
3. Read the existing GROQ queries in `lib/sanity/queries.ts`
4. Review the existing component patterns, styling conventions, and CSS custom properties in `globals.css`
5. Check what Sanity plugins and dependencies are already installed
6. Look at how existing pages fetch data and render page builder blocks

**Extend existing patterns. Do not replace or restructure what's already there.**

---

## Overview

Add a `/webcams` page to the Hound Around Resort website that displays 7 live camera feeds from IPCamLive. The cameras are grouped into Indoor (3) and Outdoor (4) areas. The page should be fully manageable via Sanity CMS so the team can reorder cameras, update names, or toggle feeds on/off without code changes.

---

## Camera Data

All 7 cameras are hosted on IPCamLive (Bravas system). The embed URL pattern is consistent:

**Iframe embed:**

```
https://g1.ipcamlive.com/player/player.php?alias={CAMERA_ID}&autoplay=1&mute=1&disablenavigation=1
```

**Snapshot/thumbnail image:**

```
https://g1.ipcamlive.com/player/snapshot.php?alias={CAMERA_ID}
```

### Camera List

| #   | Camera ID       | Display Name            | Group   |
| --- | --------------- | ----------------------- | ------- |
| 1   | `604dbc7f006f8` | Indoor Small Play Area  | Indoor  |
| 2   | `604dbcd4d05e6` | Indoor Play Area Cam 2  | Indoor  |
| 3   | `604dbd2bdc62d` | Indoor Play Area Cam 3  | Indoor  |
| 4   | `604dbd748c62e` | Outdoor Play Area Cam 1 | Outdoor |
| 5   | `604dbdbd8b406` | Outdoor Play Area Cam 2 | Outdoor |
| 6   | `604dbe2479bd0` | Outdoor Play Area Cam 3 | Outdoor |
| 7   | `665ce350b6bee` | Outdoor Play Area       | Outdoor |

### Embed Parameters (already configured)

- `autoplay=1` — Video starts playing immediately on load
- `mute=1` — Audio is muted by default (no kennel noise)
- `disablenavigation=1` — Prevents viewers from navigating to other IPCamLive cameras

---

## Sanity Schema

### Option A: Webcam Document Type (Recommended)

Create a `webcam` document type so each camera is its own manageable document. This gives the team full control to add/remove/reorder cameras from the Studio.

```ts
// studio/src/schemas/documents/webcam.ts
import {defineType, defineField} from 'sanity'
import {VideoIcon} from '@sanity/icons' // or use an appropriate icon

export default defineType({
  name: 'webcam',
  title: 'Webcam',
  type: 'document',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Camera Name',
      type: 'string',
      description: 'Display name shown on the website (e.g., "Indoor Small Play Area")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cameraId',
      title: 'IPCamLive Camera ID',
      type: 'string',
      description: 'The alias/ID from IPCamLive (e.g., "604dbc7f006f8")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Camera Group',
      type: 'string',
      options: {
        list: [
          {title: 'Indoor', value: 'indoor'},
          {title: 'Outdoor', value: 'outdoor'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within their group',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Toggle to show/hide this camera on the website',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [
        {field: 'group', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      group: 'group',
      enabled: 'enabled',
    },
    prepare({title, group, enabled}) {
      return {
        title: title || 'Untitled Camera',
        subtitle: `${group === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}${enabled === false ? ' (disabled)' : ''}`,
      }
    },
  },
})
```

**Register this schema** in the studio's schema index file (wherever existing document types are registered — check the existing pattern).

### Page Builder Block: Webcam Grid

If the project uses a page builder pattern with a `BlockRenderer`, also create a `webcamGrid` block type so the webcam section can be added to any page via the page builder:

```ts
// studio/src/schemas/blocks/webcamGrid.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'webcamGrid',
  title: 'Webcam Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Live Webcams',
    }),
    defineField({
      name: 'subtext',
      title: 'Section Subtext',
      type: 'text',
      rows: 3,
      initialValue:
        'Check in on your pup anytime. Our live cameras let you see the fun as it happens across our indoor and outdoor play areas.',
    }),
    defineField({
      name: 'showGroupHeaders',
      title: 'Show Indoor/Outdoor Group Headers',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Webcam Grid', subtitle: 'Live Camera Feeds'}
    },
  },
})
```

**Register this block type** in the page builder's block array (wherever existing blocks like `hero`, `featureCards`, etc. are listed).

---

## Seed Data

After deploying the schema, seed the 7 webcam documents into Sanity. Create a seed script or manually add them in the Studio:

```ts
// scripts/seed-webcams.ts (or .js)
// Run with: npx sanity exec scripts/seed-webcams.ts --with-env-variables
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const webcams = [
  {name: 'Indoor Small Play Area', cameraId: '604dbc7f006f8', group: 'indoor', sortOrder: 1},
  {name: 'Indoor Play Area Cam 2', cameraId: '604dbcd4d05e6', group: 'indoor', sortOrder: 2},
  {name: 'Indoor Play Area Cam 3', cameraId: '604dbd2bdc62d', group: 'indoor', sortOrder: 3},
  {name: 'Outdoor Play Area Cam 1', cameraId: '604dbd748c62e', group: 'outdoor', sortOrder: 1},
  {name: 'Outdoor Play Area Cam 2', cameraId: '604dbdbd8b406', group: 'outdoor', sortOrder: 2},
  {name: 'Outdoor Play Area Cam 3', cameraId: '604dbe2479bd0', group: 'outdoor', sortOrder: 3},
  {name: 'Outdoor Play Area', cameraId: '665ce350b6bee', group: 'outdoor', sortOrder: 4},
]

async function seed() {
  for (const cam of webcams) {
    await client.createOrReplace({
      _id: `webcam-${cam.cameraId}`,
      _type: 'webcam',
      ...cam,
      enabled: true,
    })
    console.log(`✅ Seeded: ${cam.name}`)
  }
}

seed().catch(console.error)
```

---

## GROQ Query

Add to the existing queries file (e.g., `lib/sanity/queries.ts`):

```ts
// Fetch all enabled webcams, grouped and sorted
export const webcamsQuery = groq`
  *[_type == "webcam" && enabled == true] | order(group asc, sortOrder asc) {
    _id,
    name,
    cameraId,
    group,
    sortOrder,
  }
`
```

---

## Frontend Components

### WebcamEmbed Component

A reusable component that renders a single camera feed in a responsive iframe container:

```tsx
// src/components/blocks/WebcamEmbed.tsx

interface WebcamEmbedProps {
  cameraId: string
  name: string
}

export function WebcamEmbed({cameraId, name}: WebcamEmbedProps) {
  // Build the embed URL with all parameters
  const embedUrl = `https://g1.ipcamlive.com/player/player.php?alias=${cameraId}&autoplay=1&mute=1&disablenavigation=1`

  return (
    <div className="webcam-card">
      {/* 16:9 aspect ratio container */}
      <div className="webcam-iframe-wrapper">
        <iframe
          src={embedUrl}
          title={`Live webcam: ${name}`}
          allow="autoplay"
          allowFullScreen
          frameBorder="0"
          loading="lazy"
        />
      </div>
      <p className="webcam-label">{name}</p>
    </div>
  )
}
```

**Styling guidance** (adapt to match existing CSS conventions — CSS modules, Tailwind, or CSS custom properties):

```css
.webcam-card {
  border-radius: var(--radius, 8px);
  overflow: hidden;
  background: var(--color-white, #ffffff);
  border: 1px solid var(--color-border, rgba(59, 43, 40, 0.1));
}

/* 16:9 aspect ratio container for responsive iframes */
.webcam-iframe-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  background: #1a1a1a; /* Dark bg while loading */
}

.webcam-iframe-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.webcam-label {
  padding: 12px 16px;
  font-family: var(--font-sans, 'Geist', sans-serif);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-dark-brown, #3b2b28);
  text-align: center;
}
```

### WebcamGrid Component

The main section component that groups cameras into Indoor and Outdoor:

```tsx
// src/components/blocks/WebcamGrid.tsx
import {WebcamEmbed} from './WebcamEmbed'

interface Webcam {
  _id: string
  name: string
  cameraId: string
  group: 'indoor' | 'outdoor'
  sortOrder: number
}

interface WebcamGridProps {
  heading?: string
  subtext?: string
  showGroupHeaders?: boolean
  webcams: Webcam[]
}

export function WebcamGrid({
  heading = 'Live Webcams',
  subtext = 'Check in on your pup anytime. Our live cameras let you see the fun as it happens across our indoor and outdoor play areas.',
  showGroupHeaders = true,
  webcams,
}: WebcamGridProps) {
  const indoorCams = webcams.filter((cam) => cam.group === 'indoor')
  const outdoorCams = webcams.filter((cam) => cam.group === 'outdoor')

  return (
    <section className="webcam-section">
      <div className="webcam-section-container">
        {/* Section header */}
        <div className="webcam-section-header">
          {heading && <h1 className="webcam-heading">{heading}</h1>}
          {subtext && <p className="webcam-subtext">{subtext}</p>}
        </div>

        {/* Indoor cameras */}
        {indoorCams.length > 0 && (
          <div className="webcam-group">
            {showGroupHeaders && <h2 className="webcam-group-heading">Indoor Play Areas</h2>}
            <div className="webcam-grid">
              {indoorCams.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}

        {/* Outdoor cameras */}
        {outdoorCams.length > 0 && (
          <div className="webcam-group">
            {showGroupHeaders && <h2 className="webcam-group-heading">Outdoor Play Areas</h2>}
            <div className="webcam-grid">
              {outdoorCams.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```

**Styling guidance:**

```css
.webcam-section {
  padding: 80px 0;
  background: var(--color-light-tan, #fef5ef);
}

.webcam-section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.webcam-section-header {
  text-align: center;
  margin-bottom: 48px;
}

.webcam-heading {
  font-family: var(--font-serif, 'Libre Caslon Text', serif);
  font-size: clamp(36px, 5vw, 56px);
  color: var(--color-brown, #703527);
  margin-bottom: 16px;
}

.webcam-subtext {
  font-family: var(--font-sans, 'Geist', sans-serif);
  font-size: 18px;
  color: var(--color-dark-brown, #3b2b28);
  opacity: 0.7;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
}

.webcam-group {
  margin-bottom: 48px;
}

.webcam-group:last-child {
  margin-bottom: 0;
}

.webcam-group-heading {
  font-family: var(--font-serif, 'Libre Caslon Text', serif);
  font-size: 28px;
  color: var(--color-dark-brown, #3b2b28);
  margin-bottom: 24px;
}

/* Responsive grid:
   - 1 column on mobile (<640px)
   - 2 columns on tablet (640px–1024px)
   - 3 columns on desktop (>1024px) — this keeps them large enough to actually see
   
   NOTE: Do NOT show all 7 in a single row. Max 3 per row keeps the feeds watchable.
*/
.webcam-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .webcam-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .webcam-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Page Implementation

### Option A: Dedicated `/webcams` Route Page

If the webcams page is a standalone route (not built with the page builder):

```tsx
// src/app/webcams/page.tsx
import {sanityFetch} from '@/lib/sanity/client' // or however the project fetches data
import {webcamsQuery} from '@/lib/sanity/queries'
import {WebcamGrid} from '@/components/blocks/WebcamGrid'

export const metadata = {
  title: 'Live Webcams | Hound Around Resort',
  description:
    'Watch your dog play in real-time with our live indoor and outdoor webcams at Hound Around Resort in Cottage Grove, MN.',
}

export default async function WebcamsPage() {
  const webcams = await sanityFetch({query: webcamsQuery})

  return (
    <WebcamGrid
      heading="Live Webcams"
      subtext="Check in on your pup anytime. Our live cameras let you see the fun as it happens across our indoor and outdoor play areas."
      showGroupHeaders={true}
      webcams={webcams}
    />
  )
}
```

### Option B: Page Builder Block (if using BlockRenderer)

If the project uses a `BlockRenderer` pattern, register `webcamGrid` as a renderable block:

```tsx
// In BlockRenderer.tsx (or wherever blocks are mapped to components)
// Add to the block type switch/map:

case 'webcamGrid':
  // Fetch webcams data — this block queries its own data since webcams
  // are separate documents, not inline in the page builder
  const webcams = await sanityFetch({ query: webcamsQuery })
  return (
    <WebcamGrid
      heading={block.heading}
      subtext={block.subtext}
      showGroupHeaders={block.showGroupHeaders}
      webcams={webcams}
    />
  )
```

**Note:** If the BlockRenderer is a client component or doesn't support async data fetching inline, you may need to fetch webcams at the page level and pass them down, or create a wrapper component that handles the fetch. Follow whatever pattern exists in the codebase for blocks that query external document types.

---

## Design Integration Notes

This project uses **Template 5 — "Warm Editorial"** design system:

- **Serif font:** Libre Caslon Text (headings)
- **Sans font:** Geist (body, labels)
- **Colors:** light-tan `#FEF5EF` (bg), brown `#703527` (headlines), dark-brown `#3B2B28` (body), orange `#E37C3C` (accents), green `#B7E1C4`, white `#FFFFFF`
- **Border radius:** 8px
- **Section padding:** ~80px vertical

**Important:** These are reference values. Always check `globals.css` or the Tailwind config for the actual CSS custom properties and use those instead of hardcoding hex values. The existing codebase may define these as `--color-brown`, `--bg-primary`, or similar. Match the existing naming convention.

### Animation (if Framer Motion is used in the project)

If the project already uses Framer Motion for scroll-triggered animations, apply the same pattern to the webcam grid:

- Fade-in + slight upward translate on scroll into view for the section header
- Stagger the camera cards with a short delay between each (e.g., 0.1s stagger)
- Match the existing easing and duration values used elsewhere in the project

Do NOT add Framer Motion if it's not already in the project's dependencies.

---

## Performance Considerations

- **`loading="lazy"`** on all iframes — critical since there are 7 video embeds. Only the visible ones should load initially.
- **Dark placeholder background** (`#1a1a1a`) on the iframe wrapper so it doesn't flash white while loading.
- Consider wrapping each iframe in an `IntersectionObserver` to only set the `src` when the camera scrolls into view. This prevents all 7 streams from connecting simultaneously on page load. This is optional but recommended for performance.

### Optional: Click-to-Load Pattern

For better performance, consider showing the snapshot thumbnail image instead of the live iframe by default, and loading the live stream on click:

```
Snapshot URL: https://g1.ipcamlive.com/player/snapshot.php?alias={CAMERA_ID}
```

This would show a static preview image with a "▶ Watch Live" overlay button. Clicking it swaps the image for the live iframe. This significantly reduces page load time since only clicked cameras stream. **This is optional — implement only if performance is a concern with 7 simultaneous streams.**

---

## Checklist

- [ ] Create `webcam` document type in Sanity schema
- [ ] Create `webcamGrid` page builder block type in Sanity schema
- [ ] Register both schemas in the studio config
- [ ] Seed the 7 webcam documents (via script or manually in Studio)
- [ ] Add GROQ query for webcams
- [ ] Build `WebcamEmbed` component
- [ ] Build `WebcamGrid` component
- [ ] Wire up the `/webcams` page (or add block to page builder)
- [ ] Add `loading="lazy"` to all iframes
- [ ] Test responsive layout (1-col mobile, 2-col tablet, 3-col desktop)
- [ ] Verify all 7 camera feeds load and autoplay muted
- [ ] Add page to navigation (if not already there)
- [ ] Verify design matches Template 5 warm editorial aesthetic
