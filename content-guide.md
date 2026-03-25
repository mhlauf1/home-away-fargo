# Hound Around Resort — Content Guide

A warm, trust-focused copy reference for updating content in Sanity Studio. Organized by page and block type, with exact field names so you know where to paste.

> **Fields marked with ✨ are new** from the March 2026 schema update and are currently empty in Studio.

---

## 1. Voice & Tone Guidelines

### Brand Voice
Hound Around Resort is **warm, confident, and knowledgeable** — like a trusted friend who happens to be an expert in dog care. We speak like hospitality professionals, not corporate marketers.

### Quick Reference

| Do | Don't |
|---|---|
| "Your pup" / "your dog" / "your best friend" | "Pets" / "animals" / "canines" |
| "Our team" / "our caregivers" | "Staff" / "employees" / "workers" |
| "We'd love to meet them" | "Submit your inquiry" |
| "Schedule a Tour" / "Come See Us" | "Contact Us" / "Submit" |
| "Here's what to expect" | "Requirements and policies" |
| "Safe, supervised play" | "Managed pet containment" |
| "Since 20XX" / "Over X years" | Vague "experienced" claims |

### Tone Principles
1. **Warm first, professional second** — Write like you're talking to a neighbor, not filing a report.
2. **Reassure, don't lecture** — Parents worry. Acknowledge that and ease concerns.
3. **Show, don't tell** — "Supervised play groups of 10 or fewer" beats "we provide excellent care."
4. **Every page sells, softly** — Captions, FAQs, and even form labels are chances to build trust.
5. **Be specific** — Real numbers, real details, real names. Vague copy feels untrustworthy.

---

## 2. Homepage

### Hero (`hero` block)

| Field | Example Copy |
|---|---|
| `eyebrow` | `Cottage Grove's Trusted Dog Resort` |
| `heading` | `Where Every Tail Wags` |
| `subtext` | `Daycare, boarding, and grooming — all in one place. Your pup gets the care, play, and attention they deserve while you're away.` |
| `trustLine` | `Trusted by 500+ dog families in the Cottage Grove area` |

**Primary CTA** (`primaryCta`):
- `buttonText`: `Schedule a Tour`
- `link`: Page reference → Contact page with `queryString`: `?service=Daycare`

**Secondary CTA** (`secondaryCta`):
- `buttonText`: `View Webcams`
- `link`: Page reference → Webcams page

#### ✨ Trust Badges (`trustBadges` array)
Each badge has `icon` (Iconify name) and `text`:

| `icon` | `text` |
|---|---|
| `mdi:shield-check` | `Fully Insured & Licensed` |
| `mdi:account-group` | `Certified Pet Care Professionals` |
| `mdi:paw` | `10+ Years in Business` |
| `mdi:camera` | `Live Webcams — Watch Anytime` |
| `mdi:star` | `4.4★ on Google — 100+ Reviews` |

Pick 3–5 that feel strongest. These render as small icon+text badges below the hero CTA.

---

### CTA Banner (`ctaBanner` block)

| Field | Example Copy |
|---|---|
| `heading` | `Ready to Give Your Pup the Best Day Ever?` |
| `ratingText` | `4.4 stars — 100+ reviews on Google` |
| `showRating` | `true` |

**CTA** (`cta`):
- `buttonText`: `Book a Visit`
- `link`: Page reference → Contact page

**Alternative headings:**
- `Your Dog Deserves a Vacation, Too`
- `Come See Why Dogs Love It Here`
- `Let's Find the Perfect Plan for Your Pup`

---

### Feature Cards (`featureCards` block)

| Field | Example |
|---|---|
| `heading` | `Why Families Choose Hound Around` |
| `trustLine` | `Serving the Cottage Grove community since 20XX` |
| `darkMode` | `true` (forest green background) |

**Features** (`features` array):

| `icon` | `title` | `description` |
|---|---|---|
| `mdi:shield-dog` | `Safe, Supervised Play` | `Small play groups with trained caregivers who know every dog by name. We never overcrowd — your pup gets the attention they deserve.` |
| `mdi:camera-outline` | `Live Webcams` | `Check in on your dog anytime from your phone. Our cameras stream all day so you never have to wonder how they're doing.` |
| `mdi:heart-pulse` | `Health-First Approach` | `Vaccination requirements, daily health checks, and sanitized play areas. We take your dog's wellbeing as seriously as you do.` |
| `mdi:clock-outline` | `Flexible Scheduling` | `Early drop-off, late pickup, half-day or full-day options. We work around your schedule, not the other way around.` |
| `mdi:home-heart` | `Home-Away-From-Home Boarding` | `Cozy suites, bedtime routines, and one-on-one tuck-in time. Your dog won't just be watched — they'll be cared for.` |
| `mdi:scissors-cutting` | `Professional Grooming` | `Bath, brush, trim, and nail care by experienced groomers who genuinely love dogs. They'll come home looking and feeling great.` |

**CTA** (`cta`):
- `buttonText`: `See Our Services`
- `link`: Page reference → Services or Daycare page

---

### Stats Bar (`statsBar` block)

**Stats** (`stats` array):

| `value` | `label` |
|---|---|
| `10+` | `Years of Experience` |
| `500+` | `Happy Dog Families` |
| `7` | `Live Webcams` |
| `4.4★` | `Google Rating` |

---

### Gallery Grid — Homepage (`galleryGrid` block)

| Field | Example |
|---|---|
| `eyebrow` | `A Day at Hound Around` |
| `heading` | `See What Your Pup's Day Looks Like` |
| `columns` | `3` |
| `enableLightbox` | `true` |
| `backgroundColor` | `cream` |

#### ✨ Image Captions (`caption` field on each image)
Captions should describe what's happening AND subtly sell. Examples:

- `Morning playgroup in our indoor arena — small groups, big fun`
- `Supervised outdoor play in our fully fenced yard`
- `Nap time in our climate-controlled boarding suites`
- `One-on-one attention from our trained care team`
- `Post-grooming glow-up — fresh, clean, and happy`
- `Water play day — a summer favorite`
- `Cozy cuddle time between play sessions`
- `Our team getting to know a new friend on their first day`

---

## 3. New Clients Page

Build this page with these blocks in order:

### Hero Banner (`heroBanner` block)

| Field | Example |
|---|---|
| `eyebrow` | `New to Hound Around?` |
| `heading` | `Welcome — We Can't Wait to Meet Your Pup` |
| `subtext` | `Getting started is easy. Here's everything you need to know before your dog's first visit.` |
| `overlayOpacity` | `medium` |
| `minHeight` | `standard` |

**CTA** (`primaryCta`):
- `buttonText`: `Schedule Your Free Tour`
- `link`: Page reference → Contact page

---

### Process Steps (`processSteps` block)

| Field | Example |
|---|---|
| `eyebrow` | `Getting Started` |
| `heading` | `Your First Visit in 4 Easy Steps` |
| `description` | `We make onboarding simple so you and your pup can feel comfortable from day one.` |
| `backgroundColor` | `sand` |

**Steps** (`steps` array):

| `badge` | `icon` | `title` | `description` |
|---|---|---|---|
| `Step 1` | `mdi:calendar-check` | `Book a Tour` | `Schedule a free visit so your dog can explore our facility and meet the team. We'll answer all your questions in person.` |
| `Step 2` | `mdi:file-document-check` | `Complete Your Profile` | `Fill out our quick enrollment form with your pup's details, vet info, and any special needs. Takes about 5 minutes.` |
| `Step 3` | `mdi:dog` | `Temperament Assessment` | `We'll do a gentle, supervised meet-and-greet to find the perfect play group match for your dog's size and personality.` |
| `Step 4` | `mdi:party-popper` | `First Day!` | `Drop off your pup and watch them settle right in. You'll get webcam access so you can check in anytime.` |

**CTA** (`cta`):
- `buttonText`: `Book Your Tour`
- `link`: Page reference → Contact page

---

### Requirements List (`requirementsList` block)

| Field | Example |
|---|---|
| `eyebrow` | `Before Your First Visit` |
| `heading` | `What Your Pup Needs` |
| `description` | `These keep every dog safe and healthy. If you have questions about any requirement, just ask — we're happy to help.` |
| `imagePosition` | `right` |
| `backgroundColor` | `cream` |

**Items** (`items` array — each has `text`):
- `Up-to-date rabies vaccination`
- `Current distemper/parvo (DHPP) vaccination`
- `Bordetella (kennel cough) vaccine — updated every 6 months`
- `Canine influenza vaccine (recommended)`
- `Flea and tick prevention — current within 30 days`
- `Spayed or neutered (required for dogs over 7 months)`
- `Completed enrollment form with emergency contact`

**Link** (`link`):
- `label`: `Download Our Enrollment Form`
- `link`: External URL to form PDF

---

### Split Content — What to Expect (`splitContent` block)

| Field | Example |
|---|---|
| `heading` | `What Your Dog's First Day Looks Like` |
| `body` | See rich text below |
| `imagePosition` | `right` |
| `backgroundColor` | `sand` |

**Body** (rich text / `blockContent`):

> We know the first day can feel nerve-wracking — for you and your pup. Here's how we make it great:
>
> Your dog will start with a calm introduction to our space, away from the main play area. Once they're comfortable, we'll introduce them to a small, compatible group with a dedicated caregiver nearby.
>
> Most dogs warm up within the first 30 minutes. By the end of the day, they're tired, happy, and ready to come back. You'll have webcam access the entire time, so you can watch their progress.
>
> Don't worry if the first day is short — we customize the schedule to your dog's comfort level.

**Link** (`link`):
- `label`: `Watch Our Webcams`
- `link`: Page reference → Webcams page

---

### FAQ Accordion (`faqAccordion` block)

| Field | Example |
|---|---|
| `eyebrow` | `Common Questions` |
| `heading` | `Everything You Want to Know` |

**FAQs** (`faqs` array):

**Q:** `What if my dog has never been to daycare before?`
**A:** `That's completely normal — most of our pups start as first-timers! We do a gentle, one-on-one introduction on their first day. They'll meet a small group of compatible dogs at their own pace, with a dedicated caregiver nearby the whole time. Most dogs settle in within the first 30 minutes.`

**Q:** `How do you group the dogs?`
**A:** `We group by size, energy level, and temperament — never just by breed. Play groups are kept small (around 10 or fewer dogs) so every pup gets the attention and supervision they need. If a dog needs a break, they always have access to quiet rest areas.`

**Q:** `Can I check on my dog during the day?`
**A:** `Absolutely! We have 7 live webcams — 3 indoor and 4 outdoor — streaming all day. You can watch from your phone, tablet, or computer anytime. It's one of the things our families love most.`

**Q:** `What vaccinations are required?`
**A:** `We require rabies, distemper/parvo (DHPP), and bordetella (updated every 6 months). Canine influenza is strongly recommended. We also ask that all dogs be current on flea/tick prevention. These requirements keep every dog in our care safe and healthy.`

**Q:** `What happens if my dog doesn't do well?`
**A:** `It happens, and it's okay! Some dogs need a few visits to feel at home. We'll work with you on a gradual introduction plan. If daycare truly isn't the right fit, we'll be honest about it and suggest alternatives — your dog's wellbeing always comes first.`

**Q:** `Do you administer medications?`
**A:** `Yes, our team can administer oral medications during your dog's stay. Just let us know the details on your enrollment form, and we'll make sure it's handled on schedule.`

---

### CTA Banner — Bottom (`ctaBanner` block)

| Field | Example |
|---|---|
| `heading` | `Ready to Get Started?` |
| `ratingText` | `4.4 stars — 100+ reviews on Google` |

**CTA** (`cta`):
- `buttonText`: `Schedule Your Free Tour`
- `link`: Page reference → Contact page

---

## 4. Service Pages

### Daycare Page

#### Hero Split (`heroSplit` block)

| Field | Example |
|---|---|
| `eyebrow` | `Dog Daycare` |
| `heading` | `A Full Day of Play, Safely Supervised` |
| `body` | `Indoor and outdoor play areas, small groups matched by size and temperament, and trained caregivers who know every dog by name. Your pup comes home tired, happy, and ready for a nap.` |
| `imagePosition` | `right` |
| `backgroundColor` | `cream` |

**Primary CTA** (`primaryCta`):
- `buttonText`: `Schedule a Tour`
- `link`: Page reference → Contact page, `queryString`: `?service=Daycare`

**Secondary CTA** (`secondaryCta`):
- `buttonText`: `View Pricing`
- `link`: Page reference → Pricing page

#### What's Included (`whatsIncluded` block)

| Field | Example |
|---|---|
| `eyebrow` | `What's Included` |
| `heading` | `Every Daycare Visit Includes` |
| `description` | `No hidden fees, no surprise charges. Here's what your pup gets every time.` |
| `columns` | `3` |
| `backgroundColor` | `sand` |
| `iconColor` | `terracotta` |

**Items** (`items` array):

| `icon` | `title` | `description` |
|---|---|---|
| `mdi:paw` | `Supervised Group Play` | `Small groups matched by size and energy level, with dedicated caregivers watching every interaction.` |
| `mdi:weather-sunny` | `Outdoor Play Time` | `Fully fenced outdoor yards for fresh air, exploration, and sunshine (weather permitting).` |
| `mdi:bed` | `Rest Periods` | `Quiet nap times in comfortable crates so your dog can recharge between play sessions.` |
| `mdi:water` | `Fresh Water All Day` | `Clean water available at all times, both indoors and outdoors.` |
| `mdi:camera` | `Live Webcam Access` | `Watch your pup play in real time from your phone — 7 cameras streaming all day.` |
| `mdi:clipboard-check` | `Daily Report` | `A quick update on how your dog's day went — who they played with and how they did.` |

#### Pricing Calculator (`pricingCalculator` block)

| Field | Example |
|---|---|
| `calculatorType` | `daycare` |
| `eyebrow` | `Daycare Pricing` |
| `heading` | `Find the Right Plan for Your Schedule` |
| `subheading` | `Multi-day packages save you money. The more your pup comes, the less you pay per day.` |
| `ctaText` | `Book Daycare` |
| `ctaLink` | Page reference → Contact page, `queryString`: `?service=Daycare` |

---

### Boarding Page

#### Hero Split (`heroSplit` block)

| Field | Example |
|---|---|
| `eyebrow` | `Dog Boarding` |
| `heading` | `A Home Away From Home` |
| `body` | `Cozy private suites, supervised play during the day, and bedtime routines that help your dog feel safe. Whether it's one night or two weeks, your pup is in caring hands.` |
| `imagePosition` | `right` |
| `backgroundColor` | `cream` |

**Primary CTA** (`primaryCta`):
- `buttonText`: `Reserve a Suite`
- `link`: Page reference → Contact page, `queryString`: `?service=Boarding`

#### What's Included (`whatsIncluded` block)

| Field | Example |
|---|---|
| `eyebrow` | `What's Included` |
| `heading` | `Every Boarding Stay Includes` |
| `columns` | `3` |
| `backgroundColor` | `sand` |

**Items**:

| `icon` | `title` | `description` |
|---|---|---|
| `mdi:home-heart` | `Private Suite` | `Your dog gets their own clean, comfortable space — not a kennel run. Climate-controlled and cozy.` |
| `mdi:paw` | `Full-Day Daycare` | `Boarding dogs join our regular play groups during the day, so they stay active and social.` |
| `mdi:moon-waning-crescent` | `Bedtime Routine` | `Lights-down, one-on-one tuck-in time with a caregiver. We follow your dog's home routine as closely as possible.` |
| `mdi:food-apple` | `Meal Service` | `We follow your feeding schedule exactly. Bring your dog's food and we'll handle the rest.` |
| `mdi:camera` | `Webcam Access` | `Check in during the day from your phone. See your dog playing, resting, and having a great time.` |
| `mdi:pill` | `Medication Administration` | `Our trained team can handle daily medications on your dog's schedule.` |

---

### Grooming Page

#### Hero Split (`heroSplit` block)

| Field | Example |
|---|---|
| `eyebrow` | `Dog Grooming` |
| `heading` | `Fresh, Clean, and Feeling Great` |
| `body` | `Professional grooming by people who genuinely love dogs. From a quick bath to a full spa day, your pup will look and feel their best.` |
| `imagePosition` | `right` |
| `backgroundColor` | `cream` |

**Primary CTA** (`primaryCta`):
- `buttonText`: `Book Grooming`
- `link`: Page reference → Contact page, `queryString`: `?service=Grooming`

#### Process Steps (`processSteps` block)

| Field | Example |
|---|---|
| `eyebrow` | `The Grooming Experience` |
| `heading` | `What to Expect` |
| `description` | `Every groom starts with a conversation about your dog's needs and ends with a happy, handsome pup.` |
| `backgroundColor` | `cream` |

**Steps**:

| `badge` | `icon` | `title` | `description` |
|---|---|---|---|
| `Step 1` | `mdi:chat-outline` | `Consultation` | `We'll talk about your dog's coat type, any skin sensitivities, and exactly how you'd like them to look.` |
| `Step 2` | `mdi:shower-head` | `Bath & Brush` | `Premium shampoo, conditioner, and thorough brushing. We take our time — no rushing.` |
| `Step 3` | `mdi:content-cut` | `Cut & Style` | `Breed-appropriate or custom cuts by experienced groomers who know how to keep dogs calm and comfortable.` |
| `Step 4` | `mdi:star-outline` | `Finishing Touches` | `Nail trim, ear cleaning, teeth brushing, and a bandana. Your pup leaves looking (and smelling) amazing.` |

---

## 5. Contact Page

### Contact Form (`contactForm` block)

| Field | Example |
|---|---|
| `eyebrow` | `Get in Touch` |
| `heading` | `Let's Talk About Your Pup` |
| `description` | `Whether you have questions, want to schedule a tour, or are ready to enroll — we'd love to hear from you. Fill out the form and we'll get back to you within one business day.` |
| `submitButtonText` | `Send Message` |
| `successMessage` | `Thank you! We'll get back to you within one business day.` |

#### ✨ Next Steps (`nextSteps` array)
Rendered as numbered steps below the form. Each has `title` and `description`:

| `title` | `description` |
|---|---|
| `We'll Reach Out` | `A team member will respond within one business day to answer your questions.` |
| `Schedule a Tour` | `We'll set up a time for you and your pup to visit and explore the facility.` |
| `Meet & Greet` | `Your dog will do a quick temperament assessment so we can find their perfect play group.` |

---

## 6. About Page

### Split Content — Our Story (`splitContent` block)

| Field | Example |
|---|---|
| `heading` | `Our Story` |
| `imagePosition` | `right` |
| `backgroundColor` | `cream` |

**Body** (rich text):

> Hound Around Resort started with a simple idea: dogs deserve better than a cage and a bowl of water while their families are away.
>
> Since [year], we've grown from a small passion project into Cottage Grove's most trusted dog care facility — but the heart of what we do hasn't changed. Every dog here gets the same care, attention, and love we'd want for our own.
>
> Our team isn't just trained; they're dog people through and through. The kind of people who remember your dog's favorite toy, notice when they're having an off day, and send you a photo just because.
>
> We're not the biggest facility, and that's by design. Smaller means we know every dog, every family, and every preference. That's how we like it.

---

### Icon Grid — Core Values (`iconGrid` block)

| Field | Example |
|---|---|
| `eyebrow` | `What We Stand For` |
| `heading` | `Our Core Values` |
| `columns` | `3` |
| `backgroundColor` | `sand` |

**Items** (`items` array):

| `icon` | `title` | `description` |
|---|---|---|
| `mdi:shield-heart` | `Safety First, Always` | `Every decision we make starts with one question: is this safe for the dogs? From our play group sizes to our vaccination requirements, safety is non-negotiable.` |
| `mdi:account-heart` | `Real, Genuine Care` | `We don't just watch dogs — we build relationships with them. Our team knows every pup's name, personality, and quirks.` |
| `mdi:eye` | `Radical Transparency` | `Live webcams, daily reports, and honest communication. We want you to see exactly what your dog's day looks like.` |
| `mdi:lightbulb-outline` | `Always Improving` | `We invest in ongoing training, better equipment, and new ideas because your dog deserves the best — not just good enough.` |
| `mdi:handshake` | `Community Focused` | `We're proud to be part of the Cottage Grove community and to support the families and dogs who make it special.` |
| `mdi:dog` | `Dog-First Decisions` | `If a dog needs a break, they get a break. If a group is too big, we split it. Your dog's wellbeing always comes before our convenience.` |

---

### Team Grid (`teamGrid` block)

| Field | Example |
|---|---|
| `eyebrow` | `The People Behind the Paws` |
| `heading` | `Meet Our Team` |

**Members** (`members` array) — write bios in third person, keep them warm and personal:

| Field | Guidance |
|---|---|
| `name` | Full first name or first + last |
| `role` | Keep it friendly: `Lead Caregiver`, `Grooming Specialist`, `Owner & Founder` |
| `bio` | 2–3 sentences. Include how long they've been with Hound Around, what they love about the work, and a personal dog detail. |
| ✨ `certifications` | Comma-separated: `Pet First Aid & CPR, Fear Free Certified` |

**Example bio:**

> **Sarah** — *Owner & Founder*
> Sarah started Hound Around in 20XX after years of wishing there was a place she'd actually trust with her own dogs. When she's not at the facility, she's hiking with her two rescue labs, Cooper and Penny.
> **Certifications:** `Pet First Aid & CPR, Fear Free Certified, CPDT-KA`

---

## 7. Webcams Page

### Hero Banner (`heroBanner` block)

| Field | Example |
|---|---|
| `eyebrow` | `Live Cameras` |
| `heading` | `See What Your Dog Is Up to Right Now` |
| `subtext` | `7 live cameras streaming all day. Check in from your phone, tablet, or computer — anytime you want.` |
| `overlayOpacity` | `medium` |
| `minHeight` | `standard` |

---

### Webcam Grid (`webcamGrid` block)

| Field | Example |
|---|---|
| `heading` | `Live Webcams` |
| `subtext` | `Our cameras stream live during business hours. Click any camera to enlarge or go full screen.` |
| `showGroupHeaders` | `true` |

#### ✨ Trust Message (`trustMessage`)
`We believe in full transparency. These unedited, live camera feeds let you see exactly how your dog spends their day — the play, the naps, and everything in between.`

**Alternative trust messages:**
- `Nothing to hide, everything to show. Watch your pup's day unfold in real time.`
- `Transparency is one of our core values. These live feeds are always on, always real — because you deserve to see your dog's day for yourself.`

---

## 8. Gallery Page

### Gallery Page (`galleryPage` block) or Gallery Grid (`galleryGrid`)

| Field | Example |
|---|---|
| `heading` | `Life at Hound Around` |
| `subtext` | `Real moments from real days. No stock photos, no staging — just happy dogs doing their thing.` |
| `layout` | `grid` |
| `backgroundColor` | `cream` |

#### ✨ Caption Examples
Captions should describe the moment AND subtly communicate value:

**Play & Socialization:**
- `Morning playgroup getting started — small groups mean safer, happier play`
- `Best friends since day one — our matching process works`
- `Supervised tug-of-war in the indoor arena`
- `Learning to share is part of the fun`

**Outdoor:**
- `Exploring our fully fenced outdoor play yard`
- `Summer water play — always a crowd favorite`
- `Catching some sunshine between play sessions`
- `Our agility equipment keeps active dogs engaged`

**Rest & Comfort:**
- `Naptime in our climate-controlled rest area`
- `Quiet time with a cozy blanket — recharging for round two`
- `Every dog gets downtime built into their day`

**Care & Attention:**
- `One-on-one cuddle time with a caregiver`
- `Our team greeting a new friend on their very first day`
- `Post-grooming glow — clean, fluffy, and proud of it`
- `Health check before joining the morning play group`

**Boarding:**
- `Settling into a private boarding suite for the night`
- `Bedtime routine — lights low, belly rubs, goodnight`
- `Morning stretch before heading out to play`

---

## 9. Pricing Page

### What's Included — Value Framing (`whatsIncluded` block)

| Field | Example |
|---|---|
| `eyebrow` | `What You Get` |
| `heading` | `More Than Just a Place to Stay` |
| `description` | `Every visit includes everything listed below — no surprise fees, no upsells. Just great care included in every package.` |
| `columns` | `3` |
| `backgroundColor` | `cream` |

---

### Split Content — Why Hound Around (`splitContent` block)

| Field | Example |
|---|---|
| `heading` | `Why Families Choose Us Over Kennels` |
| `imagePosition` | `left` |
| `backgroundColor` | `sand` |

**Body** (rich text):

> **Small groups, not crowded runs.** We cap our play groups at around 10 dogs and match by size and temperament. Your dog isn't just supervised — they're known.
>
> **Real suites, not cages.** Our boarding dogs sleep in private, climate-controlled rooms with cozy bedding — not stacked kennels.
>
> **Trained caregivers, not part-time workers.** Every team member is trained in dog behavior, pet first aid, and our safety protocols before they ever interact with a dog.
>
> **Full transparency.** Seven live webcams, daily updates, and an open-door policy. Come visit anytime.

---

## 10. Global — Settings & Sitewide Content

### Settings (Singleton: `siteSettings`)

| Field | Value |
|---|---|
| `title` | `Hound Around Resort` |
| `footerTagline` | `Cottage Grove's trusted home for happy, healthy dogs.` |
| ✨ `yearEstablished` | The year you opened (e.g. `2012`) |
| ✨ `socialLinks.facebook` | Your Facebook page URL |
| ✨ `socialLinks.instagram` | Your Instagram profile URL |
| ✨ `socialLinks.google` | Your Google Business Profile URL |

**Logo** (`logo`): Upload your logo image. Used in the header and footer.

**Contact Info** (`contactInfo`):
| Field | Notes |
|---|---|
| `address` | Full street address, city, state, zip |
| `phone` | Format: `(651) 555-1234` |
| `email` | e.g. `info@houndaroundresort.com` |

**Footer Text** (`footerText`):
`© 2026 Hound Around Resort. All rights reserved.`

---

### Navigation (`navItems` array in Settings)

Recommended nav structure:

| `label` | Link | Children |
|---|---|---|
| `Services` | — (has children) | `Daycare` → daycare page, `Boarding` → boarding page, `Grooming` → grooming page |
| `New Clients` | → New Clients page | — |
| `Webcams` | → Webcams page | — |
| `Gallery` | → Gallery page | — |
| `About` | → About page | — |
| `Pricing` | → Pricing page | — |

**Header CTA** (`ctaButton`):
- `buttonText`: `Book Now`
- `link`: Page reference → Contact page

---

### Testimonials — Replacing Placeholders

The current testimonial documents have placeholder data. Create real `testimonial` documents in Studio:

| Field | Guidance |
|---|---|
| `quote` | 2–3 sentences. Specific details sell ("Cooper used to be anxious..." not "Great place!"). Include the dog's name. |
| `authorName` | First name + last initial: `Sarah M.` |
| `authorLabel` | `Dog parent to [dog name]` or `[Dog name]'s human` |
| `rating` | `5` |

**Example testimonials:**

> "We were nervous about leaving Cooper for the first time, but the team at Hound Around made it so easy. He was playing with new friends within 20 minutes, and I could watch the whole thing on the webcams. Now he gets excited every time we pull into the parking lot."
> — **Sarah M.**, *Dog parent to Cooper*

> "The difference between Hound Around and the kennel we used to use is night and day. Bella comes home happy and tired — not stressed and barking. The small play groups and one-on-one attention really make a difference."
> — **Mike R.**, *Dog parent to Bella*

> "I love that I can check the webcams during my lunch break. It puts my mind at ease knowing exactly what Luna is up to. The staff clearly loves what they do."
> — **Jen L.**, *Dog parent to Luna*

---

### Fixing Placeholder Links

These items currently have placeholder or incorrect links in Studio. Update them:

| Location | Current Issue | Fix |
|---|---|---|
| Homepage Hero `primaryCta` | Points to external placeholder | Page ref → Contact page |
| Homepage Hero `secondaryCta` | Points to external placeholder | Page ref → Webcams page |
| Homepage `ctaBanner` CTA | Points to external placeholder | Page ref → Contact page |
| Footer column links | All point to homepage | Update to actual page references |
| Service page CTAs | Check all `queryString` values | Should be `?service=Daycare`, `?service=Boarding`, or `?service=Grooming` |

---

## Quick Reference: Iconify Icon Names

These are all in the `mdi` (Material Design Icons) set. Use the full name in the `icon` field in Studio:

| Icon | Name | Good For |
|---|---|---|
| 🛡️ | `mdi:shield-check` | Safety, insurance, licensing |
| 🐾 | `mdi:paw` | General dog/pet care |
| 🐕 | `mdi:dog` | Dog-specific features |
| 👥 | `mdi:account-group` | Team, staff, groups |
| 📷 | `mdi:camera` | Webcams, transparency |
| ⭐ | `mdi:star` | Reviews, ratings |
| ❤️ | `mdi:heart` | Care, love, values |
| 🏠 | `mdi:home-heart` | Boarding, home-like |
| ✂️ | `mdi:scissors-cutting` | Grooming |
| 🕐 | `mdi:clock-outline` | Scheduling, hours |
| 📋 | `mdi:clipboard-check` | Reports, requirements |
| 🌡️ | `mdi:thermometer` | Climate control |
| 💊 | `mdi:pill` | Medications |
| 🍎 | `mdi:food-apple` | Feeding, meals |
| 🌙 | `mdi:moon-waning-crescent` | Bedtime, overnight |
| ☀️ | `mdi:weather-sunny` | Outdoor, sunshine |
| 💧 | `mdi:water` | Water, hydration |
| 🛁 | `mdi:shower-head` | Bathing |
| 💡 | `mdi:lightbulb-outline` | Ideas, improvement |
| 🤝 | `mdi:handshake` | Community, trust |
| 👁️ | `mdi:eye` | Transparency, watching |
| 📅 | `mdi:calendar-check` | Booking, scheduling |
| 📄 | `mdi:file-document-check` | Forms, enrollment |
| 🎉 | `mdi:party-popper` | Celebrations, first day |
| 💬 | `mdi:chat-outline` | Consultation, communication |
| ✨ | `mdi:star-outline` | Finishing touches, quality |
| 🛏️ | `mdi:bed` | Rest, nap areas |
| 🩺 | `mdi:heart-pulse` | Health, wellness |
| 🐕‍🦺 | `mdi:shield-dog` | Dog safety |
| 💝 | `mdi:shield-heart` | Safety + care |
| 🧑‍🤝‍🧑 | `mdi:account-heart` | Personal care |
