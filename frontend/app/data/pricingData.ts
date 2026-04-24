// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half'
export type DaycarePackage = 'single' | '5-day' | '10-day' | '20-day' | '30-day'

export type PackageMeta = {
  days: number | null
  fullRate: number
  halfRate: number
  label: string
  badge?: string
  validity?: string
  note?: string
}

export const daycarePackages: Record<DaycarePackage, PackageMeta> = {
  single: {
    days: null,
    fullRate: 39,
    halfRate: 29,
    label: 'Single Day',
  },
  '5-day': {
    days: 5,
    fullRate: 35,
    halfRate: 26,
    label: 'Starter Pack',
    badge: 'New Guests',
    validity: '30 days',
    note: 'First-time guests only',
  },
  '10-day': {
    days: 10,
    fullRate: 33,
    halfRate: 24.5,
    label: '10-Day Package',
    badge: 'Most Popular',
    validity: '90 days',
  },
  '20-day': {
    days: 20,
    fullRate: 31,
    halfRate: 23,
    label: '20-Day Package',
    badge: 'Best Value',
    validity: '6 months',
  },
  '30-day': {
    days: 30,
    fullRate: 29,
    halfRate: 21.5,
    label: '30-Day Package',
    badge: 'Premium',
    validity: '9 months',
  },
}

export type DaycareDogConfig = {
  id: string
  dayType: DayType
  pkg: DaycarePackage
  days: number
}

export type LineItem = {label: string; amount: number}

export type DaycareResult = {
  total: number
  lineItems: LineItem[]
  savings: number | null
  perVisitRate: number
}

export function calculateDaycarePerDog(input: {dogs: DaycareDogConfig[]}): DaycareResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0
  let totalSavings = 0
  let hasSavings = false

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const meta = daycarePackages[dog.pkg]
    const rate = dog.dayType === 'full' ? meta.fullRate : meta.halfRate
    const numDays = meta.days ?? dog.days
    const cost = rate * numDays

    const pkgLabel = dog.pkg === 'single' ? '' : ` — ${meta.label}`
    const dayTypeLabel = dog.dayType === 'full' ? 'Full Day' : 'Half Day'
    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    lineItems.push({
      label: `${dogLabel} — ${dayTypeLabel}${pkgLabel} (${numDays} day${numDays > 1 ? 's' : ''} @ $${rate})`,
      amount: cost,
    })

    total += cost

    if (dog.pkg !== 'single') {
      const singleRate = dog.dayType === 'full' ? daycarePackages.single.fullRate : daycarePackages.single.halfRate
      totalSavings += singleRate * numDays - cost
      hasSavings = true
    }
  }

  const firstDog = dogs[0]
  const firstMeta = daycarePackages[firstDog.pkg]
  const perVisitRate = firstDog.dayType === 'full' ? firstMeta.fullRate : firstMeta.halfRate

  return {total, lineItems, savings: hasSavings ? totalSavings : null, perVisitRate}
}

// ─── Boarding ───────────────────────────────────────────────
export type RoomType = 'regular' | 'small' | 'vip' | 'bank'

export type RoomMeta = {
  label: string
  rate: number
  description: string
  note?: string
}

export const boardingRooms: Record<RoomType, RoomMeta> = {
  regular: {
    label: 'Regular Run',
    rate: 69,
    description: '5×5',
  },
  small: {
    label: 'Small Run',
    rate: 59,
    description: '3×5',
  },
  vip: {
    label: 'VIP Run',
    rate: 79,
    description: '4×6 private outdoor run',
  },
  bank: {
    label: 'Bank Kennel',
    rate: 49,
    description: 'Subject to availability',
    note: 'Manager approval required',
  },
}

export const boardingAdditionalDogRate = 39

export type BoardingDogConfig = {
  id: string
  nights: number
  roomType: RoomType
}

export type BoardingResult = {
  total: number
  lineItems: LineItem[]
  nightlyRate: number
  includes: string[]
}

export function calculateBoardingPerDog(input: {dogs: BoardingDogConfig[]}): BoardingResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const room = boardingRooms[dog.roomType]
    const isAdditional = i > 0
    const rate = isAdditional ? boardingAdditionalDogRate : room.rate
    const cost = rate * dog.nights

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    const rateLabel = isAdditional
      ? `Additional dog — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
      : `${room.label} (${room.description}) — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`
    lineItems.push({
      label: `${dogLabel} — ${rateLabel}`,
      amount: cost,
    })
    total += cost
  }

  const firstRoom = boardingRooms[dogs[0].roomType]

  return {
    total,
    lineItems,
    nightlyRate: firstRoom.rate,
    includes: ['Supervised group play', 'Indoor/outdoor play areas', 'Kuranda bed', 'Clean, secure kennel run'],
  }
}

// ─── Cat Services ───────────────────────────────────────────
export const catPricing = {
  daycare: 35,
  boardingFirst: 44,
  boardingAdditional: 22,
}

// ─── Grooming ───────────────────────────────────────────────
export type GroomingService = 'fullGrooming' | 'exitBath'
export type DogSize = 's' | 'm' | 'l' | 'xl'

export const groomingRates: Record<GroomingService, Record<DogSize, number>> = {
  fullGrooming: {
    s: 85,
    m: 105,
    l: 135,
    xl: 165,
  },
  exitBath: {
    s: 49,
    m: 59,
    l: 69,
    xl: 89,
  },
}

export const sizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'X-Large',
}

export const shortSizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'XL',
}

export const serviceLabels: Record<GroomingService, string> = {
  fullGrooming: 'Full Grooming',
  exitBath: 'Exit Bath',
}

export const serviceIncludes: Record<GroomingService, string[]> = {
  fullGrooming: [],
  exitBath: [
    'Nail trim',
    'Ear cleaning',
    'Shampoo & conditioner',
    'Hand dry',
    'Brush out',
    'Bandana & cologne',
  ],
}

export type DogConfig = {id: string; size: DogSize}

export type GroomingResult = {
  total: number
  lineItems: LineItem[]
  includes: string[]
  isStartingAt: boolean
}

export function calculateGrooming(input: {
  service: GroomingService
  dogs: DogConfig[]
}): GroomingResult {
  const {service, dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const price = groomingRates[service][dog.size]
    total += price

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1} (${shortSizeLabels[dog.size]})` : shortSizeLabels[dog.size]
    lineItems.push({
      label: `${dogLabel} — ${serviceLabels[service]}`,
      amount: price,
    })
  }

  return {
    total,
    lineItems,
    includes: serviceIncludes[service],
    isStartingAt: service === 'fullGrooming',
  }
}
