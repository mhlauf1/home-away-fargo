# Template 3: "Elegant Cream" — Full Project Spec

**Project:** Hound Around Resort
**Template Direction:** Warm, elevated, editorial — cream + lavender + charcoal with serif typography and playful dog illustrations
**Stack:** Next.js 15 (App Router) + Sanity CMS + Tailwind CSS
**Base Template:** `sanity-template-nextjs-clean`

---

## 0. PROJECT STRUCTURE & SETUP

### Monorepo Structure

This project uses a **monorepo with npm workspaces**. The root `package.json` orchestrates two workspaces:

```
hound-3/
├── package.json          # Root — workspaces, shared scripts, dev tooling
├── frontend/             # Next.js 15 app (App Router, Tailwind CSS)
│   ├── package.json
│   ├── src/
│   │   ├── app/          # App Router pages & layouts
│   │   ├── components/   # React components (sections, UI, layout)
│   │   ├── lib/          # Utilities, Sanity client config
│   │   └── styles/       # Global CSS, Tailwind imports
│   ├── tailwind.config.ts
│   └── next.config.ts
├── studio/               # Sanity Studio
│   ├── package.json
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   └── src/
│       └── schemaTypes/  # All Sanity schemas (documents + blocks)
└── designs/              # ⬅ PUT YOUR DESIGN SCREENSHOTS HERE
    ├── hero.png
    ├── our-services.png
    ├── why-hound.png
    ├── stats.png
    ├── web-cams.png
    ├── testimonials.png
    ├── cta.png
    ├── embark.png
    └── footer.png
```

### Root Dependencies

```json
{
  "name": "hound-3",
  "workspaces": ["studio", "frontend"],
  "scripts": {
    "dev": "npm-run-all --parallel --print-label dev:*",
    "dev:next": "npm run dev --workspace=frontend",
    "dev:studio": "npm run dev --workspace=studio",
    "format": "prettier --cache --write .",
    "import-sample-data": "cd studio && sanity dataset import sample-data.tar.gz --replace",
    "lint": "npm run lint --workspace=frontend",
    "type-check": "npm run type-check --workspaces"
  },
  "devDependencies": {
    "@sanity/prettier-config": "^2.0.2",
    "npm-run-all2": "^5.0.2",
    "prettier": "^3.7.3"
  }
}
```

### Running the Project

```bash
# Install all workspace dependencies
npm install

# Start both Next.js frontend and Sanity Studio in parallel
npm run dev

# Frontend:  http://localhost:3000
# Studio:    http://localhost:3333
```

### Design Screenshots

**Important:** Copy your homepage section screenshots into a `designs/` folder at the project root. Claude Code can view these images directly to reference exact layouts, spacing, and visual details while building components.

```bash
# Create the designs folder and copy your screenshots in
mkdir -p designs

# The screenshots are:
# hero.png          — Navigation + hero section with headline, CTAs, orange swoosh
# our-services.png  — Tabbed services section (Daycare/Boarding/Grooming)
# why-hound.png     — Dark section with 4 feature cards + dog illustrations
# stats.png         — Lavender stats bar with 4 metric cards
# web-cams.png      — Webcam preview with password gate + blurred video
# testimonials.png  — Dark section with scrolling review cards
# cta.png           — Photo background CTA with headline + rating
# embark.png        — Lavender split section (Embark partnership)
# footer.png        — 4-column footer
```

When working with Claude Code, you can reference these directly:

```
"Look at designs/hero.png and build the Hero section component to match"
```

---

## 1. DESIGN TOKENS / STYLE GUIDE

### Colors

```
/* Core Palette */
--color-tan:              #FEFFEA;   /* Main page background — warm cream */
--color-pink:             #F0D7FF;   /* Accent sections (stats, embark) — soft lavender */
--color-dark:             #201A25;   /* Dark sections, heading text — near-black charcoal */
--color-white:            #FFFFFF;   /* Cards, overlays */

/* Semantic Mappings */
--color-bg-primary:       #FEFFEA;   /* Page background */
--color-bg-dark:          #201A25;   /* Dark section backgrounds */
--color-bg-lavender:      #F0D7FF;   /* Lavender section backgrounds */
--color-bg-card:          #FFFFFF;   /* Card surfaces */
--color-bg-card-dark:     #2A2430;   /* Cards on dark bg (slight lift from #201A25) — VERIFY */

--color-text-primary:     #201A25;   /* Headings on light bg */
--color-text-body:        #201A25;   /* Body copy on light bg */
--color-text-muted:       rgba(32, 26, 37, 0.70);  /* Subtext — dark/70% */
--color-text-on-dark:     #FEFFEA;   /* Headings on dark bg — cream */
--color-text-on-dark-sub: rgba(254, 255, 234, 0.70); /* Subtext on dark bg */

--color-cta-primary:      #F0D7FF;   /* Primary button fill — lavender */
--color-cta-primary-text: #201A25;   /* Button text on lavender */
--color-cta-outline:      #201A25;   /* Outline button border */
--color-cta-outline-text: #201A25;   /* Outline button text */

--color-accent-orange:    #E87830;   /* Decorative swoosh — NEEDS CONFIRM */
--color-border:           #201A25;   /* Borders, dividers */
--color-border-light:     rgba(32, 26, 37, 0.15); /* Subtle borders on light bg */
--color-border-dark:      rgba(254, 255, 234, 0.20); /* Subtle borders on dark bg */

--color-badge-text:       #201A25;   /* Section badge/eyebrow text */
--color-star:             #201A25;   /* Star rating icons */
--color-paw-accent:       #E87830;   /* Paw print icon in testimonial cards — orange */
```

### Typography

```
/* Font Families */
--font-serif:     'EB Garamond', Georgia, serif;       /* Headings, display text */
--font-sans:      'Geist', 'Inter', system-ui, sans-serif;  /* Body, UI, buttons */

/* Heading Scale (Serif — EB Garamond) */
--text-hero:      84px / 90% line-height / -1px letter-spacing / normal weight (400)
--text-h1:        84px / 90% / -1px / 400    /* Section main headings */
--text-h2:        56px / 95% / -0.5px / 400  /* Secondary headings like "Daycare" */
--text-h3:        36px / 110% / 0 / 400      /* Card headings, feature titles */
--text-h4:        24px / 120% / 0 / 400      /* Small serif headings */

/* Body Scale (Sans — Geist) */
--text-body-lg:   24px / 150% / 0 / 300 (light)     /* Hero subtext, section descriptions */
--text-body:      20px / 150% / 0 / 300 (light)     /* Standard body copy */
--text-body-sm:   16px / 150% / 0 / 400 (regular)   /* Card descriptions, footer text */
--text-caption:   14px / 140% / 0 / 400             /* Small print, trust lines */

/* Badge/Eyebrow (Sans — Geist) */
--text-badge:     14px / 100% / 10% letter-spacing / 400 / uppercase
                  /* "OUR SERVICES", "PEACE OF MIND", "COTTAGE GROVE'S PREMIER PET RESORT" */

/* Button Text (Sans — Geist) */
--text-button:    16px / 100% / 2% letter-spacing / 500 (medium)

/* Stat Numbers (Sans — Geist) */
--text-stat:      48px / 100% / -1px / 500 (medium)
--text-stat-label: 16px / 140% / 0 / 400
```

### Spacing & Layout

```
/* Container */
--container-max:      1200px;    /* Content max-width */
--container-padding:  24px;      /* Mobile side padding */
--container-padding-lg: 48px;    /* Desktop side padding */

/* Section Spacing */
--section-padding-y:  80px;      /* Vertical padding per section (mobile) */
--section-padding-y-lg: 120px;   /* Vertical padding per section (desktop) */
--section-gap:        0px;       /* Sections butt up against each other (curves create visual separation) */

/* Component Spacing */
--card-padding:       24px;
--card-gap:           16px;      /* Gap between cards in a grid */
--stack-gap:          16px;      /* Vertical gap between stacked elements */
--stack-gap-lg:       24px;

/* Border Radius */
--radius-sm:          8px;       /* Small elements, inputs */
--radius-md:          12px;      /* Cards, buttons, images */
--radius-lg:          24px;      /* Large cards, section overlays */
--radius-xl:          40px;      /* Hero image container, major section curves */
--radius-section:     48px;      /* The curved top of dark/lavender sections */

/* Shadows */
--shadow-card:        0 1px 3px rgba(32, 26, 37, 0.08);
--shadow-card-hover:  0 4px 12px rgba(32, 26, 37, 0.12);
```

### Buttons

```css
/* Primary CTA — Lavender filled */
.btn-primary {
  background: var(--color-cta-primary); /* #F0D7FF */
  color: var(--color-cta-primary-text); /* #201A25 */
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 14px 28px;
  border-radius: var(--radius-md); /* 12px */
  border: 1.5px solid var(--color-dark); /* Dark border around lavender */
  transition: all 0.2s ease;
}

/* Secondary CTA — Outline */
.btn-outline {
  background: transparent;
  color: var(--color-dark);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-dark);
}

/* Button on dark background */
.btn-primary-dark {
  /* Same as primary but border is lighter or absent */
  background: var(--color-cta-primary);
  color: var(--color-dark);
  border: 1.5px solid var(--color-pink);
}
```

---

## 2. HOMEPAGE SECTION MAP (Top to Bottom)

| #   | Section          | Block Type         | Background                  | Key Elements                                                                                                     |
| --- | ---------------- | ------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | **Navigation**   | `header` (global)  | Transparent → tan           | Logo, nav links, "Book Now" purple CTA                                                                           |
| 2   | **Hero**         | `hero`             | Tan with photo inset        | Eyebrow badge, serif H1, subtext, 2 CTAs, trust line, dog illustrations, orange swoosh                           |
| 3   | **Photo Strip**  | `imageRow`         | Tan                         | Row of facility/dog photos (partially visible at bottom of hero screenshot)                                      |
| 4   | **Why Hound**    | `featureCardsDark` | Dark (#201A25)              | Bold serif H1, 4 feature cards (icon + heading + description), CTA, trust line, dog illustrations, curved top    |
| 5   | **Our Services** | `serviceTabs`      | Tan                         | Eyebrow, serif H2, tab navigation (Daycare/Boarding/Grooming), split content (text + photo per tab), CTA per tab |
| 6   | **Stats**        | `statsBar`         | Lavender (#F0D7FF)          | 4 stat cards in a row, logo centered below, decorative white curves                                              |
| 7   | **Webcams**      | `webcamPreview`    | Tan                         | Eyebrow, serif H2, split (password form + blurred video preview)                                                 |
| 8   | **Testimonials** | `testimonialsDark` | Dark (#201A25)              | Dog icon, serif H2, horizontal scroll cards, Google rating badge, curved top                                     |
| 9   | **CTA Section**  | `ctaBanner`        | Tan (with hero-style photo) | Photo background, dog icon, serif H1, CTA button, star rating + review count, decorative curves                  |
| 10  | **Embark**       | `splitContent`     | Lavender (#F0D7FF)          | Large serif H1, body text, "Learn more" link, Embark logo badge, facility photo                                  |
| 11  | **Footer**       | `footer` (global)  | Tan with pink top border    | 4-column: brand, services, company, contact. Copyright bar.                                                      |

---

## 3. SECTION-BY-SECTION COMPONENT SPECS

### 3.1 Navigation (Global Header)

```
Layout:         Fixed/sticky, full-width
Background:     Transparent on hero, tan scroll state
Height:         ~72px
Logo:           "Hound Around" serif + "RESORT" sans-serif small caps below
                Left-aligned inside rounded container/pill
Nav Links:      "Services ▾" (dropdown), "About Us", "Web Cams", "Pricing"
                Font: Geist, 16px, regular
                Color: dark on light
CTA:            "Book Now" — purple filled button, right-aligned
Mobile:         Hamburger menu
Decorative:     The nav appears to sit inside a subtle rounded border container
```

**Sanity Fields:** Site Settings document (logo, nav items array, CTA button)

---

### 3.2 Hero

```
Layout:         Centered text, full-width
Background:     Tan (#FEFFEA)
Decorative:     Orange swooping curve across top-right
                White curved lines at left and right edges
                Dog illustration doodles (scattered)

Content Stack (centered):
  1. Eyebrow badge:   "COTTAGE GROVE'S PREMIER PET RESORT" — uppercase Geist, 10% tracking
  2. Heading:          "The place your dog actually wants to go." — EB Garamond, 84px, 90% LH
  3. Subtext:          3 lines of descriptive copy — Geist Light, 20px, centered
  4. Button Group:     [Schedule Free Orientation (purple)] [View Pricing (outline)] — side by side
  5. Trust Line:       "Trusted by hundreds of Cottage Grove families" — Geist, 14px, muted

Photo:          Below the text block — partial reveal of a lifestyle photo
                (woman with dog) — this may be a separate image row
Dog Illos:      Large doodle dog left side, small dog icon right of buttons
```

**Sanity Fields:**

```
hero {
  eyebrow: string
  heading: string
  subtext: text
  primaryCta: { label, url }
  secondaryCta: { label, url }
  trustLine: string
  backgroundImage: image (optional — for the CTA variant)
  heroImage: image (the photo below)
}
```

---

### 3.3 Photo Strip (Image Row)

```
Layout:         Full-width horizontal row of images
Background:     Tan
Images:         3-5 photos, rounded corners (12px), slight overlap or tight gap
                Mix of: dogs playing, facility interior, grooming, staff
Behavior:       Static on desktop, horizontal scroll on mobile
```

**Sanity Fields:**

```
imageRow {
  images: array of image with alt text
}
```

---

### 3.4 Why Hound (Feature Cards on Dark)

```
Layout:         Full-width dark section with curved/rounded top edge
Background:     Dark (#201A25)
Decorative:     White swooping curve across section
                Cute dog face illustrations (top-right)

Content:
  1. Heading:     "Suites, not kennels. There's a difference." — EB Garamond, 84px, cream text
  2. Card Grid:   4 cards in a row (responsive: 2x2 on tablet, stacked on mobile)

     Each Card:
       - Icon:       Line icon (Iconify) — webcam, bed, play, family
       - Heading:    EB Garamond, ~24px, lavender/cream text
       - Body:       Geist, 16px, light, muted cream text
       - Background: Slight glass/dark card (rgba lift from bg)
       - Border:     Subtle light border (cream/20%)
       - Radius:     12px
       - Padding:    24px

  3. CTA:         "Schedule Free Orientation" — purple button
  4. Trust Line:  "Trusted by hundreds of Cottage Grove families" — cream, muted
```

**Sanity Fields:**

```
featureCards {
  heading: string
  features: array of {
    icon: string (iconify name)
    title: string
    description: text
  }
  cta: { label, url }
  trustLine: string
  darkMode: boolean (true)
}
```

---

### 3.5 Our Services (Tabbed Section)

```
Layout:         Centered, contained width
Background:     Tan (#FEFFEA)

Content:
  1. Eyebrow:     "OUR SERVICES" — uppercase badge
  2. Heading:      "One place for everything your dog needs" — EB Garamond, ~56px, italic feel
  3. Tab Bar:      Horizontal tabs: "Daycare" | "Boarding" | "Grooming"
                   Active tab: dark text + underline (2px solid)
                   Inactive: muted text, no underline
                   Font: Geist, 20px
                   Divider: full-width 1px line below tabs

  4. Tab Content:  Split layout (text left, image right — or vice versa)
     Left:
       - Service Title: EB Garamond, ~48px
       - Description:   Geist Light, 18px, 2-3 lines
       - CTA:           "View More Details" — purple button
     Right:
       - Photo:         Rounded corners (12-16px), large (~50% width)
                        e.g., close-up of happy yellow lab

  5. Behavior:     Tab click swaps content (no page reload)
                   Consider subtle fade/slide transition
```

**Sanity Fields:**

```
serviceTabs {
  eyebrow: string
  heading: string
  tabs: array of reference -> service document
  /* Each service doc has: title, slug, shortDescription, tabImage, tabCta */
}
```

---

### 3.6 Stats Bar

```
Layout:         Full-width lavender section
Background:     Lavender (#F0D7FF)
Decorative:     White swooping curves (same motif as other sections)

Content:
  1. Stat Cards:   4 in a row, centered
     Each Card:
       - Background: white (#FFFFFF)
       - Border:     1px solid subtle (light border)
       - Radius:     12px
       - Padding:    24px 32px
       - Number:     "12+", "8,000", "4.4 ★", "365" — Geist Medium, 48px
       - Label:      "Years of Care", "SqFt Play Space", "Google Rating", "Days a Year"
                     Geist Regular, 16px

  2. Logo:         "Hound Around RESORT" centered below cards — serif + sans lockup
```

**Sanity Fields:**

```
statsBar {
  stats: array of {
    value: string (allows "12+", "4.4 ★" etc.)
    label: string
  }
  showLogo: boolean
}
```

---

### 3.7 Webcam Preview

```
Layout:         Centered, contained
Background:     Tan (#FEFFEA)

Content:
  1. Eyebrow:     "PEACE OF MIND" — uppercase badge
  2. Heading:      "Watch the fun unfold, live" — EB Garamond, ~56px, italic
  3. Split:        Two cards side by side (50/50)

     Left Card:
       - Background: white
       - Border:     1px solid dark border, rounded (12-16px)
       - Content:    Password input field (lavender bg) + "Submit" button (outline)
       - This is a login gate for webcam access

     Right Card:
       - Background: Blurred facility photo (the actual webcam feed area)
       - Overlay:    Play button icon (circle with triangle)
       - Caption:    "Enter your password to view live footage" — centered bottom
       - Radius:     12-16px
```

**Sanity Fields:**

```
webcamPreview {
  eyebrow: string
  heading: string
  previewImage: image (blurred facility shot)
  passwordProtected: boolean
  webcamUrl: url (actual feed URL)
}
```

---

### 3.8 Testimonials (Dark Section)

```
Layout:         Full-width dark section with curved/rounded top
Background:     Dark (#201A25)

Content:
  1. Icon:        Small dog silhouette icon — cream color, centered
  2. Heading:     "Don't take our word for it" — EB Garamond, ~64px, cream, centered
  3. Card Slider: Horizontal scrolling row of testimonial cards

     Each Card:
       - Background: cream (#FEFFEA) or white
       - Radius:     12px
       - Padding:    24px
       - Width:      ~280px (fixed, allows peek of next card)
       - Paw Icon:   Orange paw print icon (top of card, centered or left)
       - Quote:      Geist, 16px, regular, dark text, with quotation marks
       - Attribution: Name + descriptor — Geist, 14px, muted
                      e.g., "Michon B., Multi-dog family"

  4. Badge:       "★★★★☆ 4.4 On Google Review" — pill-shaped, dark bg with light border
                  Centered below cards

  Behavior:      CSS horizontal scroll with snap, or JS carousel
                 Cards partially visible at edges (peek effect)
```

**Sanity Fields:**

```
testimonials {
  heading: string
  reviews: array of reference -> testimonial document
  /* Each testimonial: quote, authorName, authorLabel, rating */
  googleRating: string
  googleReviewCount: number
}
```

---

### 3.9 CTA Banner (Secondary Hero)

```
Layout:         Full-width, centered text over photo background
Background:     Lifestyle photo (woman with dog) with slight overlay
                Rounded corners on the photo container (~24px)
                Sits on tan background

Content:
  1. Dog Icon:    Line-drawn dog icon, white, centered top
  2. Heading:     "Care that does more for your pet. And you." — EB Garamond, ~64px, white
  3. CTA:         "Schedule Free Orientation" — purple button with dark border
  4. Trust:       "★★★★★ 2000+ 5 Star Reviews" — white, centered
  5. Decorative:  White curved lines at edges (same motif)
```

**Sanity Fields:**

```
ctaBanner {
  heading: string
  backgroundImage: image
  cta: { label, url }
  showRating: boolean
  ratingText: string
}
```

---

### 3.10 Embark Section (Split Content)

```
Layout:         Split — text left (50%), image right (50%)
Background:     Lavender (#F0D7FF)

Left Side:
  1. Heading:    "Backed by the best" — EB Garamond, 84px, dark text
  2. Body:       2-3 lines about Embark/Cadence — Geist Light, 18px
  3. Link:       "Learn more about Embark" — underlined, dark, Geist
  4. Badge:      Embark Pet Services circular logo/seal

Right Side:
  1. Image:      Facility exterior/interior photo — rounded corners (16-24px)
                 Shows modern glass building with turf play area
```

**Sanity Fields:**

```
splitContent {
  heading: string
  body: portableText
  link: { label, url }
  badge: image (optional logo/seal)
  image: image
  imagePosition: 'left' | 'right'
  backgroundColor: 'tan' | 'lavender' | 'dark'
}
```

---

### 3.11 Footer (Global)

```
Layout:         Full-width, 4-column grid
Background:     Tan (#FEFFEA)
Top Border:     Thin lavender/pink accent line at very top

Columns:
  1. Brand:       Logo lockup ("Hound Around" serif + "RESORT" sans)
                  Tagline: "Your dog's home away from home..." — Geist, 14px, muted
  2. Services:    "Services" heading (Geist, 16px, bold)
                  Links: Daycare, Boarding, Grooming, Self-Wash
  3. Company:     "Company" heading
                  Links: About Us, Pricing, Webcams, New Clients
  4. Contact:     "Contact" heading
                  Address: 8607 W Point Douglas Rd S, Cottage Grove, MN 55201
                  Phone: 641-525-4923
                  Email: contact@houndaroundresort.com

Bottom Bar:     © 2026 Hound Around Resort. Part of the Embark Pet Services family.
                Right: Privacy Policy | Terms of Service
```

**Sanity Fields:** Part of `siteSettings` document

---

## 4. DECORATIVE SYSTEM (Signature Elements)

This template has a strong decorative identity. These elements repeat across sections:

### 4.1 Swooping Curves

- **White curves** on dark and lavender sections
- **Orange curve** on hero
- **Implementation:** SVG paths, positioned absolutely, overflow hidden on section containers
- **Pattern:** Gentle S-curves that span the full width, 2-3px stroke weight
- These should be **reusable SVG components** with color props

### 4.2 Section Transition Curves

- Dark sections and the testimonial section have **rounded top corners** (~48px radius)
- Creates a layered, overlapping feel between sections
- **Implementation:** `border-radius: 48px 48px 0 0` on section wrapper, with negative margin to overlap previous section slightly

### 4.3 Dog Illustrations

Three distinct styles needed:

1. **Line-drawn icon** — Simple white outline of a dog (hero top, CTA section) — SVG
2. **Cartoon faces** — Cute dog face stickers (golden retriever, white dog with pink ears) — PNG/SVG assets
3. **Doodle dogs** — Larger playful dog drawings near hero — PNG/SVG assets

### 4.4 Paw Print Icons

- Orange paw prints on testimonial cards
- Could be an Iconify icon or custom SVG

---

## 5. ASSET REQUIREMENTS

### Images Needed

| Asset                   | Type  | Usage                          | Notes                               |
| ----------------------- | ----- | ------------------------------ | ----------------------------------- |
| Hero lifestyle photo    | Photo | Hero section, CTA banner       | Woman with dog, outdoor, blue sky   |
| Facility interior shots | Photo | Embark section, webcam preview | Modern glass building, turf areas   |
| Dog portraits           | Photo | Service tabs (1 per service)   | Happy dogs, close-up, warm lighting |
| Photo strip images      | Photo | Image row section              | 3-5 mixed facility/dog photos       |
| Team/staff photos       | Photo | About page (future)            | Candid, with dogs                   |

### SVG/Illustration Assets

| Asset                          | Type    | Usage                              |
| ------------------------------ | ------- | ---------------------------------- |
| Dog line icon (outline)        | SVG     | Hero, CTA, testimonials header     |
| Dog face stickers (2-3 breeds) | SVG/PNG | Why Hound section, hero decorative |
| Swooping curve (white)         | SVG     | Dark sections, stats, hero         |
| Swooping curve (orange)        | SVG     | Hero accent                        |
| Paw print icon                 | SVG     | Testimonial cards                  |
| Embark Pet Services seal       | SVG/PNG | Embark section                     |
| Hound Around logo lockup       | SVG     | Nav, footer, stats                 |

### Icons (Iconify)

| Icon             | Usage                            |
| ---------------- | -------------------------------- |
| Webcam / monitor | Why Hound: "Live Webcams"        |
| Bed / suite      | Why Hound: "Suites, Not Kennels" |
| Play / triangle  | Why Hound: "Play Included"       |
| Family / people  | Why Hound: "Family Owned"        |
| Star (filled)    | Ratings                          |
| Chevron down     | Nav dropdown                     |
| Menu / hamburger | Mobile nav                       |

---

## 6. TAILWIND CONFIGURATION

```js
// frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tan: "#FEFFEA",
        lavender: "#F0D7FF",
        dark: "#201A25",
        "dark-card": "#2A2430",
        "accent-orange": "#E87830", // CONFIRM THIS HEX
        "cta-purple": "#F0D7FF",
        "border-light": "rgba(32, 26, 37, 0.15)",
        "border-dark": "rgba(254, 255, 234, 0.20)",
        "text-muted": "rgba(32, 26, 37, 0.70)",
        "text-muted-dark": "rgba(254, 255, 234, 0.70)",
      },
      fontFamily: {
        serif: ["EB Garamond", "Georgia", "serif"],
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["84px", { lineHeight: "90%", letterSpacing: "-1px" }],
        "h1": ["84px", { lineHeight: "90%", letterSpacing: "-1px" }],
        "h2": ["56px", { lineHeight: "95%", letterSpacing: "-0.5px" }],
        "h3": ["36px", { lineHeight: "110%", letterSpacing: "0" }],
        "h4": ["24px", { lineHeight: "120%", letterSpacing: "0" }],
        "body-lg": ["24px", { lineHeight: "150%" }],
        "body": ["20px", { lineHeight: "150%" }],
        "body-sm": ["16px", { lineHeight: "150%" }],
        "caption": ["14px", { lineHeight: "140%" }],
        "badge": ["14px", { lineHeight: "100%", letterSpacing: "0.1em" }],
        "stat": ["48px", { lineHeight: "100%", letterSpacing: "-1px" }],
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "24px",
        "xl": "40px",
        "section": "48px",
      },
      maxWidth: {
        "container": "1200px",
      },
      spacing: {
        "section": "80px",
        "section-lg": "120px",
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 7. SANITY SCHEMA ARCHITECTURE

### Document Types

```
studio/src/schemaTypes/
├── documents/
│   ├── page.ts              # Page builder pages
│   ├── service.ts           # Daycare, Boarding, Grooming, Self-Wash
│   ├── testimonial.ts       # Individual review/quote
│   ├── teamMember.ts        # Staff bios
│   ├── pricingTier.ts       # Pricing items
│   ├── faq.ts               # FAQ items
│   └── siteSettings.ts      # Global config (singleton)
└── blocks/
    ├── hero.ts              # Hero with eyebrow, heading, CTAs, trust line
    ├── imageRow.ts          # Horizontal photo strip
    ├── featureCards.ts      # Icon + title + description grid (dark or light)
    ├── serviceTabs.ts       # Tabbed services with split content
    ├── statsBar.ts          # Stats row with optional logo
    ├── webcamPreview.ts     # Password-gated webcam section
    ├── testimonials.ts      # Scrollable review cards
    ├── ctaBanner.ts         # Photo background CTA section
    ├── splitContent.ts      # 50/50 text + image (Embark section, reusable)
    ├── faqAccordion.ts      # FAQ section (for inner pages)
    ├── pricingTable.ts      # Pricing comparison (for pricing page)
    ├── contactForm.ts       # Contact/scheduling form
    ├── teamGrid.ts          # Team member cards (for about page)
    └── galleryGrid.ts       # Photo gallery grid (for service pages)
```

### Block Schema Example (Hero)

```ts
// studio/src/schemaTypes/blocks/hero.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow Text', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subtext', title: 'Subtext', type: 'text', rows: 3}),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        {name: 'label', type: 'string', title: 'Label'},
        {name: 'url', type: 'string', title: 'URL'},
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        {name: 'label', type: 'string', title: 'Label'},
        {name: 'url', type: 'string', title: 'URL'},
      ],
    }),
    defineField({name: 'trustLine', title: 'Trust Line', type: 'string'}),
    defineField({name: 'heroImage', title: 'Hero Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'backgroundImage', title: 'Background Image (optional)', type: 'image'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero', subtitle: 'Hero Section'}
    },
  },
})
```

---

## 8. PAGE COMPOSITIONS

### Homepage (`/`)

```
hero
imageRow
featureCards (dark: "Why Hound")
serviceTabs
statsBar (lavender)
webcamPreview
testimonials (dark)
ctaBanner
splitContent (lavender: "Embark")
```

### About Us (`/about`)

```
hero (variant: shorter, about-focused)
splitContent ("Our Story" — tan)
teamGrid
statsBar (lavender)
testimonials (dark)
ctaBanner
```

### Service Pages (`/services/[slug]`)

```
hero (variant: service-specific heading + image)
splitContent (service details)
featureCards (service-specific features)
galleryGrid (facility photos)
pricingTable (service pricing)
faqAccordion (service FAQs)
ctaBanner
```

### Webcams (`/webcams`)

```
hero (variant: minimal)
webcamPreview (full version — multiple camera feeds)
ctaBanner
```

### Pricing (`/pricing`)

```
hero (variant: minimal)
pricingTable (all services)
faqAccordion
ctaBanner
```

### Contact (`/contact`)

```
hero (variant: minimal)
contactForm (with map)
statsBar
```

---

## 9. RESPONSIVE BREAKPOINTS

```
Mobile:     < 640px    (1 column, stacked)
Tablet:     640-1024px (2 columns where applicable)
Desktop:    > 1024px   (full layout as designed)

Key Responsive Notes:
- Hero heading: 84px → 48px → 36px
- H2 headings: 56px → 36px → 28px
- Feature cards: 4-col → 2-col → 1-col
- Service tabs: horizontal tabs → maybe accordion on mobile
- Stat cards: 4-col → 2x2 → stacked
- Testimonial cards: horizontal scroll on all sizes (CSS snap)
- Split content: side-by-side → stacked (image on top)
- Footer: 4-col → 2x2 → stacked
- Section padding: 120px → 80px → 60px
```

---

## 10. DEVELOPMENT NOTES

### Font Loading

```tsx
// frontend/src/app/layout.tsx
import {EB_Garamond} from 'next/font/google'
import localFont from 'next/font/local'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

// Geist is available as a local font from Vercel
// The nextjs-sanity-clean template may already include Geist —
// check frontend/src/app/fonts/ or install via next/font/google
const geist = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-sans',
  display: 'swap',
})
```

### Decorative Curves Implementation

The swooping curves should be:

1. **SVG components** with configurable color and position props
2. **Absolutely positioned** within relatively positioned section containers
3. **`overflow: hidden`** on section containers to clip curves
4. Consider a `<DecorativeCurve />` component with variants: `top-left`, `top-right`, `bottom-left`, etc.

### Section Wrapper Pattern

```tsx
// frontend/src/components/sections/SectionWrapper.tsx
<section
  className={cn(
    'relative overflow-hidden',
    bg === 'dark' && 'bg-dark text-tan rounded-t-section -mt-8',
    bg === 'lavender' && 'bg-lavender',
    bg === 'tan' && 'bg-tan',
  )}
>
  <div className="max-w-container mx-auto px-6 py-section lg:py-section-lg">{children}</div>
  {showCurve && <DecorativeCurve variant={curveVariant} />}
</section>
```

### Frontend Component Architecture

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, global styles
│   ├── page.tsx                # Homepage — fetches page builder blocks
│   ├── about/page.tsx
│   ├── services/[slug]/page.tsx
│   ├── webcams/page.tsx
│   ├── pricing/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Global nav
│   │   ├── Footer.tsx          # Global footer
│   │   └── MobileNav.tsx       # Slide-out mobile menu
│   ├── sections/               # Page builder block components
│   │   ├── SectionWrapper.tsx  # Reusable bg + curve wrapper
│   │   ├── Hero.tsx
│   │   ├── ImageRow.tsx
│   │   ├── FeatureCards.tsx
│   │   ├── ServiceTabs.tsx
│   │   ├── StatsBar.tsx
│   │   ├── WebcamPreview.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CtaBanner.tsx
│   │   ├── SplitContent.tsx
│   │   ├── FaqAccordion.tsx
│   │   ├── PricingTable.tsx
│   │   ├── ContactForm.tsx
│   │   ├── TeamGrid.tsx
│   │   └── GalleryGrid.tsx
│   ├── ui/                     # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx           # Eyebrow text component
│   │   ├── Card.tsx
│   │   └── DecorativeCurve.tsx # SVG swooping curves
│   └── PageBuilder.tsx         # Renders array of blocks → components
├── lib/
│   ├── sanity.client.ts        # Sanity client config
│   ├── sanity.queries.ts       # GROQ queries
│   └── utils.ts                # cn() helper, etc.
└── styles/
    └── globals.css             # Tailwind imports + CSS variables
```

### Testimonial Scroll

```css
.testimonial-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
}
.testimonial-scroll > * {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 280px;
}
```

---

## 11. CLAUDE CODE KICKOFF PROMPT

> **Paste this into Claude Code after initializing the project:**
>
> I'm building a Next.js 15 + Sanity website for Hound Around Resort (dog daycare/boarding/grooming in Cottage Grove, MN). This is a monorepo with npm workspaces — `frontend/` (Next.js 15, App Router, Tailwind CSS) and `studio/` (Sanity Studio). It was initialized from the `sanity-template-nextjs-clean` template.
>
> **Read these first:**
>
> - `TEMPLATE-3-SPEC.md` in the project root — complete design spec with tokens, schemas, section breakdowns
> - `designs/` folder — screenshots of every homepage section for visual reference
>
> The spec covers:
>
> - Complete design token system (colors, typography, spacing)
> - Tailwind config with custom theme
> - 11 homepage sections with exact specs (reference `designs/*.png` for each)
> - Sanity schema architecture (documents + page builder blocks)
> - Page compositions for all routes
> - Responsive breakpoints
>
> **Build order:**
>
> 1. Update `frontend/tailwind.config.ts` with the custom theme from the spec
> 2. Set up font loading (EB Garamond + Geist) in `frontend/src/app/layout.tsx`
> 3. Create Sanity schemas in `studio/src/schemaTypes/` (document types + page builder blocks)
> 4. Build homepage sections one at a time — look at the matching screenshot in `designs/` for each:
>    - `designs/hero.png` → Hero component
>    - `designs/why-hound.png` → Feature Cards (dark) component
>    - `designs/our-services.png` → Service Tabs component
>    - `designs/stats.png` → Stats Bar component
>    - `designs/web-cams.png` → Webcam Preview component
>    - `designs/testimonials.png` → Testimonials (dark) component
>    - `designs/cta.png` → CTA Banner component
>    - `designs/embark.png` → Split Content component
>    - `designs/footer.png` → Footer component
>
> The design aesthetic is: warm cream (#FEFFEA) backgrounds, lavender (#F0D7FF) accent sections, dark charcoal (#201A25) sections, EB Garamond serif headings, Geist sans body, playful dog illustrations, and signature swooping decorative curves between sections.
>
> **Workspace commands:**
>
> - `npm run dev` — runs both frontend and studio in parallel
> - Frontend code lives in `frontend/src/`
> - Sanity schemas live in `studio/src/schemaTypes/`

---

## OPEN ITEMS / NEEDS CONFIRMATION

- [ ] **Orange accent hex** — I estimated `#E87830`, please confirm
- [ ] **CTA button purple** — Is it exactly `#F0D7FF` (same as section bg) or a slightly different shade?
- [ ] **Dog illustration assets** — Will you supply these or should we source/generate them?
- [ ] **Decorative SVG curves** — Do you have these as assets or should we draw them in code?
- [ ] **Stats "4.4 ★" label** — Should read "Google Rating" instead of "SqFt Play Space"?
- [ ] **Webcam integration** — What webcam service/provider? Need to know embed format
- [ ] **Booking/scheduling** — What tool? (GingrApp, PetExec, custom form, etc.)
