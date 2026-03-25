# Hound Around Resort — Interactive Pricing Calculators

## Specification for Service Page Components

---

# Overview

Each service page (Daycare, Boarding, Grooming) gets an interactive pricing calculator that helps customers estimate costs and encourages bookings. These components should feel modern, playful, and transparent — no hidden fees, no surprises.

---

# Design Specifications

## Visual Style

- **Background:** Dark forest green `#2D4A3E`
- **Card Background:** Cream `#FAF7F2` or White `#FFFFFF`
- **Accent Color:** Terracotta `#C4704B`
- **Text on Dark:** Cream `#FAF7F2`
- **Text on Light:** Charcoal `#3D3D3D`
- **Border Radius:** 16px on cards, 8px on inputs
- **Font:** Inter or Plus Jakarta Sans

## Layout

- Desktop: Two columns — inputs left, output card right
- Mobile: Stack vertically — inputs on top, output below
- Illustration or icon in top right corner of section

## Interactions

- Real-time calculation as inputs change
- Smooth number animations (count up/down)
- Subtle hover states on all interactive elements
- Clear focus states for accessibility

---

# Daycare Calculator

## Section Content

### Headline

```
Calculate your daycare costs
```

### Subheadline

```
Plan your pup's perfect schedule
```

---

## Inputs

### Input 1: Number of Dogs

```
How many dogs?

[1 dog ▼]

Options:
- 1 dog
- 2 dogs
- 3 dogs
- 4+ dogs (contact us)
```

### Input 2: Days Per Week

```
Days per week: [3]

───────────●─────────────────────
1    2    3    4    5

Helper text: "Most pet parents choose 2-3 days per week"
```

### Input 3: Day Type

```
○ Full Day (6+ hours) — $32/day
○ Half Day (under 6 hours) — $22/day

Helper text: "Half days are perfect for puppies or seniors"
```

---

## Output Card

### Single Dog

```
┌─────────────────────────────────────────┐
│         Your weekly estimate            │
│                                         │
│              $96/week                   │
│                                         │
│  Days per week                    3     │
│  Rate per day                   $32     │
│  Weekly cost                    $96     │
│  Monthly estimate              $384     │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  💡 Save with a Day Pass                │
│                                         │
│  10-Day Pass: $280 ($28/day)            │
│  You'd save: $40                        │
│                                         │
│  20-Day Pass: $520 ($26/day)            │
│  You'd save: $120                       │
│                                         │
│           [View All Packages →]         │
│                                         │
└─────────────────────────────────────────┘
```

### Multi-Dog (2 dogs example)

```
┌─────────────────────────────────────────┐
│         Your weekly estimate            │
│                                         │
│             $172/week                   │
│                                         │
│  Dogs                             2     │
│  Days per week                    3     │
│  ───────────────────────────────────    │
│  Dog 1 (Full Day × 3)           $96     │
│  Dog 2 (10% off × 3)            $86     │
│  ───────────────────────────────────    │
│  Weekly total                  $182     │
│  Multi-dog discount            -$10     │
│  You pay                       $172     │
│                                         │
│  Monthly estimate              $688     │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  🐕 Multi-dog families save 10%         │
│     on each additional dog!             │
│                                         │
│           [Book Orientation →]          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Pricing Data

```javascript
const daycareRates = {
  fullDay: 32,
  halfDay: 22,
  hourly: 6,

  // Multi-dog discount
  additionalDogDiscount: 0.1, // 10% off each additional dog

  // Packages (per dog)
  packages: {
    tenDay: {
      price: 280,
      perDay: 28,
      savings: 40,
    },
    twentyDay: {
      price: 520,
      perDay: 26,
      savings: 120,
    },
  },
}
```

---

## Calculation Logic

```javascript
function calculateDaycare(dogs, daysPerWeek, dayType) {
  const baseRate = dayType === 'full' ? daycareRates.fullDay : daycareRates.halfDay

  let weeklyTotal = 0

  for (let i = 0; i < dogs; i++) {
    if (i === 0) {
      // First dog at full price
      weeklyTotal += baseRate * daysPerWeek
    } else {
      // Additional dogs get 10% off
      const discountedRate = baseRate * (1 - daycareRates.additionalDogDiscount)
      weeklyTotal += discountedRate * daysPerWeek
    }
  }

  const monthlyEstimate = weeklyTotal * 4

  // Calculate package savings based on usage
  const daysPerMonth = daysPerWeek * 4
  const packageSavings = calculatePackageSavings(daysPerMonth, baseRate)

  return {
    weeklyTotal,
    monthlyEstimate,
    packageSavings,
    breakdown: generateBreakdown(dogs, daysPerWeek, baseRate),
  }
}
```

---

# Boarding Calculator

## Section Content

### Headline

```
Plan your dog's stay
```

### Subheadline

```
See exactly what your trip will cost
```

---

## Inputs

### Input 1: Number of Dogs

```
How many dogs?

[ + ]  2 dogs  [ - ]

Helper text: "Dogs from the same family stay together!"
```

### Input 2: Number of Nights

```
Nights: [4]

───────────────●─────────────────
1  2  3  4  5  6  7  10  14+

Helper text: "Average stay is 3-4 nights"
```

### Input 3: Suite Type

```
○ Standard Suite — $33/night
   Best for dogs under 40 lbs

○ Large Suite — $40/night
   For dogs 40+ lbs or multiple dogs

Helper text: "Multi-dog families typically choose Large Suite"
```

### Input 4: Add Play? (Toggle)

```
Add daycare play during their stay?

[Yes, add play] ●───○ [No thanks]

+$16/day per dog — Recommended for stays 3+ nights
```

### Input 5: Add-Ons (Checkboxes)

```
Optional add-ons:

☐ Bath before pickup (+$25-45 based on size)
☐ Full groom before pickup (+$45-85 based on size)
☐ Extra potty breaks (+$5/day)
☐ Medication administration (+$5/day)
☐ Feeding special diet (+$0 — just bring their food!)
```

---

## Output Card

### Single Dog

```
┌─────────────────────────────────────────┐
│           Your stay total               │
│                                         │
│              $196                       │
│                                         │
│  Nights                           4     │
│  Suite (Standard)              $132     │
│  Daycare play (4 days)          $64     │
│  ───────────────────────────────────    │
│  Total                         $196     │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  ✓ Every stay includes:                 │
│    • Spacious suite with comfy bed      │
│    • Flat-screen TV for comfort         │
│    • Climate controlled rooms           │
│    • 24/7 webcam access                 │
│    • Lots of love from our staff        │
│                                         │
│           [Book This Stay →]            │
│                                         │
└─────────────────────────────────────────┘
```

### Multi-Dog (2 dogs, same suite)

```
┌─────────────────────────────────────────┐
│           Your stay total               │
│                                         │
│              $285                       │
│                                         │
│  Dogs                             2     │
│  Nights                           4     │
│  ───────────────────────────────────    │
│  Large Suite (4 nights)        $160     │
│  Dog 1 play (4 days)            $64     │
│  Dog 2 play (4 days)            $64     │
│  ───────────────────────────────────    │
│  Subtotal                      $288     │
│  Same-suite discount            -$3     │
│  ───────────────────────────────────    │
│  You pay                       $285     │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  🐕 Your dogs stay together!            │
│     Same suite, same comfort,           │
│     less stress for everyone.           │
│                                         │
│  ✓ Every stay includes:                 │
│    • Spacious suite with comfy bed      │
│    • Flat-screen TV for comfort         │
│    • Climate controlled rooms           │
│    • 24/7 webcam access                 │
│                                         │
│           [Book This Stay →]            │
│                                         │
└─────────────────────────────────────────┘
```

### Multi-Dog (2 dogs, separate suites)

```
┌─────────────────────────────────────────┐
│           Your stay total               │
│                                         │
│              $378                       │
│                                         │
│  Dogs                             2     │
│  Nights                           4     │
│  ───────────────────────────────────    │
│  Dog 1: Standard Suite         $132     │
│  Dog 1: Play (4 days)           $64     │
│  Dog 2: Standard Suite         $132     │
│  Dog 2: Play (4 days)           $64     │
│  ───────────────────────────────────    │
│  Subtotal                      $392     │
│  Multi-dog discount (10%)      -$14     │
│  ───────────────────────────────────    │
│  You pay                       $378     │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  💡 Want them together?                 │
│     Book a Large Suite & save $93       │
│     [Switch to shared suite →]          │
│                                         │
│           [Book This Stay →]            │
│                                         │
└─────────────────────────────────────────┘
```

---

## Pricing Data

```javascript
const boardingRates = {
  // Nightly rates
  standardSuite: 33, // up to 40 lbs
  largeSuite: 40, // 40+ lbs or multi-dog

  // Multi-dog pricing
  sameSuiteDiscount: 0.02, // Small discount for sharing
  separateSuiteDiscount: 0.1, // 10% off second dog's suite

  // Daily add-ons
  daycarePlay: 16, // per dog per day
  extraPotty: 5, // per day (shared)
  medication: 5, // per dog per day

  // One-time add-ons
  bath: {
    small: 25,
    medium: 35,
    large: 45,
  },
  fullGroom: {
    small: 45,
    medium: 55,
    large: 70,
    extraLarge: 85,
  },
}
```

---

## Calculation Logic

```javascript
function calculateBoarding(config) {
  const {dogs, nights, suiteType, sharedSuite, includePlay, addOns} = config

  let total = 0
  let breakdown = []

  // Calculate suite cost
  if (sharedSuite && dogs > 1) {
    // All dogs share one large suite
    const suiteCost = boardingRates.largeSuite * nights
    breakdown.push({label: `Large Suite (${nights} nights)`, cost: suiteCost})
    total += suiteCost
  } else {
    // Each dog gets their own suite
    const rate = suiteType === 'large' ? boardingRates.largeSuite : boardingRates.standardSuite

    for (let i = 0; i < dogs; i++) {
      let dogSuiteCost = rate * nights

      // Discount for additional dogs in separate suites
      if (i > 0) {
        dogSuiteCost *= 1 - boardingRates.separateSuiteDiscount
      }

      breakdown.push({label: `Dog ${i + 1}: Suite (${nights} nights)`, cost: dogSuiteCost})
      total += dogSuiteCost
    }
  }

  // Calculate play cost
  if (includePlay) {
    for (let i = 0; i < dogs; i++) {
      const playCost = boardingRates.daycarePlay * nights
      breakdown.push({label: `Dog ${i + 1}: Play (${nights} days)`, cost: playCost})
      total += playCost
    }
  }

  // Calculate add-ons
  addOns.forEach((addOn) => {
    total += addOn.cost
    breakdown.push({label: addOn.label, cost: addOn.cost})
  })

  return {total, breakdown}
}
```

---

## Multi-Dog UX Considerations

### When user selects 2+ dogs, show:

```
┌─────────────────────────────────────────┐
│  🐕 Multiple dogs? Nice!                │
│                                         │
│  How would you like them to stay?       │
│                                         │
│  ○ Together in one suite                │
│    One large suite, shared space        │
│    Best for dogs who love each other    │
│    💰 Most affordable option            │
│                                         │
│  ○ Separate suites                      │
│    Each dog gets their own space        │
│    Best for dogs who need alone time    │
│    10% off additional suites            │
│                                         │
└─────────────────────────────────────────┘
```

### Max dogs notice:

```
4+ dogs? We'd love to host your pack!
Please call us at 651-788-9797 to book.
```

---

# Grooming Calculator

## Section Content

### Headline

```
Build your perfect groom
```

### Subheadline

```
See exactly what your spa day costs
```

---

## Inputs

### Input 1: Number of Dogs

```
How many dogs?

[ + ]  1 dog  [ - ]

Helper text: "Book multiple dogs & save time — we'll groom them together!"
```

### Input 2: Dog Size (per dog if multiple)

```
Dog size:

○ Small — under 25 lbs
○ Medium — 25-50 lbs
○ Large — 50-80 lbs
○ Extra Large — 80+ lbs

Helper text: "Not sure? We'll confirm at check-in"
```

For multiple dogs:

```
Dog 1: [Medium ▼]
Dog 2: [Small ▼]

[+ Add another dog]
```

### Input 3: Service Type

```
What service?

○ Bath & Brush — $30-60
   Wash, dry, brush, ears, nails

○ Full Groom — $45-85
   Everything above + haircut

○ Deluxe Spa — $60-110
   Full groom + premium treatments

Helper text: "Full grooms recommended every 4-6 weeks"
```

### Input 4: Add-Ons (Checkboxes)

```
Customize your groom:

☐ De-shedding treatment (+$15)
   "Game changer for heavy shedders"

☐ Teeth brushing (+$10)
   "Fresh breath guaranteed"

☐ Nail grinding vs clipping (+$5)
   "Smoother finish, less scratching"

☐ Flea & tick treatment (+$15)
   "Prevention is key"

☐ Blueberry facial (+$10)
   "Brightens and refreshes"

☐ Pawdicure with balm (+$12)
   "Moisturized, healthy paws"
```

---

## Output Card

### Single Dog

```
┌─────────────────────────────────────────┐
│          Your groom total               │
│                                         │
│              $80                        │
│                                         │
│  Service: Full Groom                    │
│  Size: Medium                     $55   │
│  ───────────────────────────────────    │
│  Add: De-shedding                +$15   │
│  Add: Teeth brushing             +$10   │
│  ───────────────────────────────────    │
│  Total                           $80    │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  ✓ Full Groom includes:                 │
│    • Bath with premium shampoo          │
│    • Blow dry & brush out               │
│    • Haircut & styling                  │
│    • Ear cleaning                       │
│    • Nail trim                          │
│    • Bandana or bow                     │
│                                         │
│  ⏱️ Estimated time: 2-3 hours           │
│                                         │
│          [Book Grooming →]              │
│                                         │
└─────────────────────────────────────────┘
```

### Multi-Dog (2 dogs)

```
┌─────────────────────────────────────────┐
│          Your groom total               │
│                                         │
│             $130                        │
│                                         │
│  Dogs                             2     │
│  ───────────────────────────────────    │
│  Dog 1: Full Groom (Medium)      $55    │
│    + De-shedding                 +$15   │
│  Dog 2: Bath & Brush (Small)     $30    │
│    + Teeth brushing              +$10   │
│  ───────────────────────────────────    │
│  Subtotal                       $110    │
│  Multi-dog discount (10%)              │
│  on Dog 2 service               -$3     │
│  ───────────────────────────────────    │
│  You pay                        $107    │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  🐕 Grooming both at once?              │
│     Drop off together, pick up          │
│     gorgeous — we'll text when ready!   │
│                                         │
│  ⏱️ Estimated time: 3-4 hours           │
│                                         │
│          [Book Grooming →]              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Pricing Data

```javascript
const groomingRates = {
  // Base services by size
  bathBrush: {
    small: 30,
    medium: 40,
    large: 50,
    extraLarge: 60,
  },
  fullGroom: {
    small: 45,
    medium: 55,
    large: 70,
    extraLarge: 85,
  },
  deluxeSpa: {
    small: 60,
    medium: 75,
    large: 90,
    extraLarge: 110,
  },

  // Add-ons (flat rate)
  addOns: {
    deShedding: 15,
    teethBrushing: 10,
    nailGrinding: 5,
    fleaTick: 15,
    blueberryFacial: 10,
    pawdicure: 12,
  },

  // Multi-dog discount
  additionalDogDiscount: 0.1, // 10% off service (not add-ons)

  // Time estimates (minutes)
  timeEstimates: {
    bathBrush: {small: 60, medium: 75, large: 90, extraLarge: 120},
    fullGroom: {small: 90, medium: 120, large: 150, extraLarge: 180},
    deluxeSpa: {small: 120, medium: 150, large: 180, extraLarge: 210},
  },
}
```

---

## Calculation Logic

```javascript
function calculateGrooming(dogs) {
  // dogs = [{ size: 'medium', service: 'fullGroom', addOns: ['deShedding'] }, ...]

  let total = 0
  let breakdown = []
  let totalTime = 0

  dogs.forEach((dog, index) => {
    // Get base service price
    let servicePrice = groomingRates[dog.service][dog.size]

    // Apply discount to additional dogs (service only, not add-ons)
    if (index > 0) {
      servicePrice *= 1 - groomingRates.additionalDogDiscount
    }

    breakdown.push({
      label: `Dog ${index + 1}: ${formatServiceName(dog.service)} (${dog.size})`,
      cost: servicePrice,
    })
    total += servicePrice

    // Add add-ons at full price
    dog.addOns.forEach((addOn) => {
      const addOnPrice = groomingRates.addOns[addOn]
      breakdown.push({
        label: `  + ${formatAddOnName(addOn)}`,
        cost: addOnPrice,
      })
      total += addOnPrice
    })

    // Calculate time
    totalTime += groomingRates.timeEstimates[dog.service][dog.size]
  })

  return {
    total,
    breakdown,
    estimatedTime: formatTime(totalTime),
  }
}
```

---

# Claude Code Implementation Prompt

Copy this entire prompt to Claude Code:

```
Build three interactive pricing calculator components for a dog resort website. Each calculator should be a separate, reusable React component with TypeScript.

## Design System

Colors:
- Background: Dark forest green #2D4A3E
- Card: White #FFFFFF or Cream #FAF7F2
- Primary accent: Terracotta #C4704B
- Text on dark: Cream #FAF7F2
- Text on light: Charcoal #3D3D3D
- Success/savings: #22C55E

Typography:
- Font: Inter or Plus Jakarta Sans
- Headline: 32-40px, font-weight 600
- Numbers: 48-56px, font-weight 700
- Body: 16px, font-weight 400
- Labels: 14px, font-weight 500

Spacing & Layout:
- Card border radius: 16px
- Input border radius: 8px
- Section padding: 80px vertical
- Desktop: 2 columns (inputs left, output right)
- Mobile: Stack vertically
- Gap between elements: 24px

Interactions:
- Animate number changes smoothly (use framer-motion or similar)
- Slider should feel smooth and responsive
- Hover states on all interactive elements
- Focus states for accessibility

## Component 1: DaycareCalculator

Props:
- onBook?: () => void (callback when CTA clicked)

State:
- dogs: number (1-3, default 1)
- daysPerWeek: number (1-5, default 3)
- dayType: 'full' | 'half' (default 'full')

Pricing logic:
- Full day: $32, Half day: $22
- Additional dogs: 10% off each
- Show package savings (10-day: $280, 20-day: $520)

Output shows:
- Weekly total
- Monthly estimate (weekly × 4)
- Multi-dog breakdown if applicable
- Package savings callout

## Component 2: BoardingCalculator

Props:
- onBook?: () => void

State:
- dogs: number (1-4, default 1)
- nights: number (1-14, default 3)
- suiteType: 'standard' | 'large' (default 'standard')
- sharedSuite: boolean (default true, only shown if dogs > 1)
- includePlay: boolean (default true)
- addOns: string[] (selected add-on IDs)

Pricing logic:
- Standard suite: $33/night, Large suite: $40/night
- Daycare play: $16/day per dog
- Shared suite: small discount, dogs stay together
- Separate suites: 10% off additional dog suites
- Add-ons: bath $25-45, groom $45-85, extra potty $5/day, meds $5/day

Special UX:
- When dogs > 1, show "Together or separate?" selector
- Show "dogs stay together!" messaging for shared suite
- If separate suites selected, show savings if they switch to shared

Output shows:
- Total stay cost
- Itemized breakdown
- What's included list
- Multi-dog savings if applicable

## Component 3: GroomingCalculator

Props:
- onBook?: () => void

State:
- dogs: Array<{ size: string, service: string, addOns: string[] }>
- Default: [{ size: 'medium', service: 'fullGroom', addOns: [] }]

Pricing logic:
- Bath & Brush: $30/40/50/60 (S/M/L/XL)
- Full Groom: $45/55/70/85
- Deluxe Spa: $60/75/90/110
- Add-ons: deShedding $15, teethBrushing $10, nailGrinding $5, fleaTick $15, blueberryFacial $10, pawdicure $12
- Additional dogs: 10% off base service

Special UX:
- Allow adding/removing dogs
- Each dog can have different size/service/add-ons
- Show estimated time based on services selected

Output shows:
- Total groom cost
- Per-dog breakdown with their selections
- What's included based on service type
- Estimated time

## File Structure

/components/pricing/
  DaycareCalculator.tsx
  BoardingCalculator.tsx
  GroomingCalculator.tsx
  PricingCard.tsx (shared output card component)
  PricingSlider.tsx (shared slider component)
  pricingData.ts (all rates and config)
  types.ts (TypeScript interfaces)

## Additional Requirements

1. All components should be fully accessible (ARIA labels, keyboard navigation)
2. Mobile-first responsive design
3. Use Tailwind CSS for styling
4. Animate number changes with counting effect
5. Include subtle micro-interactions (hover, focus, active states)
6. Export all components from an index.ts barrel file
7. Include JSDoc comments for props

Please build all three components with the shared utilities and make them production-ready.
```

---

# Multi-Dog Discount Summary

| Service                 | Multi-Dog Benefit                        |
| ----------------------- | ---------------------------------------- |
| **Daycare**             | 10% off each additional dog              |
| **Boarding (shared)**   | Dogs stay together in one suite          |
| **Boarding (separate)** | 10% off each additional suite            |
| **Grooming**            | 10% off base service for additional dogs |

---

# Copy for Multi-Dog Messaging

## Daycare

- "Multi-dog families save 10% on each additional pup!"
- "Bring the whole pack — the more the merrier (and cheaper)."

## Boarding

- "Your dogs stay together! Same suite, same comfort, less stress."
- "Multi-dog families save when booking together."
- "Dogs from the same family can share a suite — they'll love it."

## Grooming

- "Book all your pups at once — we'll groom them together!"
- "Multi-dog families get 10% off additional grooms."
- "Drop off together, pick up gorgeous."

---

# Edge Cases to Handle

1. **4+ dogs:** Show "Contact us" message instead of calculator
2. **14+ nights boarding:** Show "Extended stay? Call for special rates"
3. **Breed-specific grooming:** Add note "Pricing may vary for breeds requiring special handling"
4. **Puppies under 6 months:** Note about vaccination requirements
5. **Senior dogs:** Mention special accommodations available

---

_Pricing Calculator Specification for Hound Around Resort_
_Last updated: February 2026_
