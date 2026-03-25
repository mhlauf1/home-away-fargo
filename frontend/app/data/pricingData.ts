// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half'
export type DaycarePackage = 'single' | '5-day' | '10-day' | '20-day'

const daycareRates: Record<DaycarePackage, Record<DayType, {first: number; additional: number}>> = {
  single: {
    full: {first: 35, additional: 30},
    half: {first: 27, additional: 25},
  },
  '5-day': {
    full: {first: 33, additional: 28},
    half: {first: 33, additional: 28},
  },
  '10-day': {
    full: {first: 32, additional: 27},
    half: {first: 32, additional: 27},
  },
  '20-day': {
    full: {first: 31, additional: 26},
    half: {first: 31, additional: 26},
  },
}

const packageDays: Record<DaycarePackage, number | null> = {
  single: null,
  '5-day': 5,
  '10-day': 10,
  '20-day': 20,
}

export type DaycareInput = {
  dogs: number
  dayType: DayType
  pkg: DaycarePackage
  days: number // only used when pkg === 'single'
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
  perDayRate: number
}

export function calculateDaycare(input: DaycareInput): DaycareResult {
  const {dogs, dayType, pkg, days} = input
  const rate = daycareRates[pkg][dayType]
  const numDays = packageDays[pkg] ?? days
  const perDay = rate.first + Math.max(0, dogs - 1) * rate.additional
  const total = perDay * numDays

  const lineItems: LineItem[] = [
    {label: `1st dog × ${numDays} day${numDays > 1 ? 's' : ''}`, amount: rate.first * numDays},
  ]
  if (dogs > 1) {
    lineItems.push({
      label: `${dogs - 1} additional dog${dogs > 2 ? 's' : ''} × ${numDays} day${numDays > 1 ? 's' : ''}`,
      amount: rate.additional * (dogs - 1) * numDays,
    })
  }

  let savings: number | null = null
  if (pkg !== 'single') {
    const singleRate = daycareRates.single[dayType]
    const singleTotal = (singleRate.first + Math.max(0, dogs - 1) * singleRate.additional) * numDays
    savings = singleTotal - total
  }

  return {total, lineItems, savings, perDayRate: rate.first}
}

export type DaycarePerDogResult = {
  total: number
  lineItems: LineItem[]
  savings: number | null
}

export function calculateDaycarePerDog(input: {dogs: DaycareDogConfig[]}): DaycarePerDogResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0
  let totalSavings = 0
  let hasSavings = false

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const rate = daycareRates[dog.pkg][dog.dayType]
    const perDay = i === 0 ? rate.first : rate.additional
    const numDays = packageDays[dog.pkg] ?? dog.days
    const cost = perDay * numDays

    const pkgLabel = dog.pkg === 'single' ? '' : `, ${dog.pkg.replace('-', '-Day ')}Pkg`
    const dayTypeLabel = dog.dayType === 'full' ? 'Full Day' : 'Half Day'
    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    lineItems.push({
      label: `${dogLabel} — ${dayTypeLabel}${pkgLabel} (${numDays} day${numDays > 1 ? 's' : ''} @ $${perDay})`,
      amount: cost,
    })

    total += cost

    if (dog.pkg !== 'single') {
      const singleRate = daycareRates.single[dog.dayType]
      const singlePerDay = i === 0 ? singleRate.first : singleRate.additional
      totalSavings += singlePerDay * numDays - cost
      hasSavings = true
    }
  }

  return {total, lineItems, savings: hasSavings ? totalSavings : null}
}

// ─── Boarding ───────────────────────────────────────────────
export type BoardingAddOn = 'medication' | 'puppyPads' | 'dryFood' | 'chickenRice'

const boardingAddOns: Record<BoardingAddOn, {label: string; perDay: number}> = {
  medication: {label: 'Medication Administration', perDay: 3},
  puppyPads: {label: 'Puppy Pads', perDay: 3},
  dryFood: {label: 'Dry Food', perDay: 4},
  chickenRice: {label: 'Chicken & Rice', perDay: 6},
}

export const boardingAddOnOptions = Object.entries(boardingAddOns).map(([key, val]) => ({
  id: key as BoardingAddOn,
  label: val.label,
  perDay: val.perDay,
}))

export type BoardingInput = {
  dogs: number
  nights: number
  addOns: BoardingAddOn[]
}

export type BoardingDogConfig = {
  id: string
  nights: number
  addOns: BoardingAddOn[]
}

export type BoardingResult = {
  total: number
  lineItems: LineItem[]
  isExtendedStay: boolean
  nightlyRate: number
  includes: string[]
}

export function calculateBoarding(input: BoardingInput): BoardingResult {
  const {dogs, nights, addOns} = input
  const isExtendedStay = nights >= 10
  const firstDogRate = isExtendedStay ? 50 : 55
  const additionalDogRate = isExtendedStay ? 45 : 50

  const firstDogTotal = firstDogRate * nights
  const additionalTotal = Math.max(0, dogs - 1) * additionalDogRate * nights

  const lineItems: LineItem[] = [
    {label: `1st dog × ${nights} night${nights > 1 ? 's' : ''} @ $${firstDogRate}/night`, amount: firstDogTotal},
  ]
  if (dogs > 1) {
    lineItems.push({
      label: `${dogs - 1} additional dog${dogs > 2 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''} @ $${additionalDogRate}/night`,
      amount: additionalTotal,
    })
  }

  let addOnTotal = 0
  for (const addOn of addOns) {
    const info = boardingAddOns[addOn]
    const cost = info.perDay * nights * dogs
    addOnTotal += cost
    lineItems.push({
      label: `${info.label} ($${info.perDay}/day × ${dogs} dog${dogs > 1 ? 's' : ''})`,
      amount: cost,
    })
  }

  return {
    total: firstDogTotal + additionalTotal + addOnTotal,
    lineItems,
    isExtendedStay,
    nightlyRate: firstDogRate,
    includes: ['Indoor/outdoor play', 'Supervised group play', 'Feeding (your food)', 'Bedding provided'],
  }
}

export type BoardingPerDogResult = {
  total: number
  lineItems: LineItem[]
  isExtendedStay: boolean
  includes: string[]
}

export function calculateBoardingPerDog(input: {dogs: BoardingDogConfig[]}): BoardingPerDogResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0
  let anyExtended = false

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const isExtended = dog.nights >= 10
    if (isExtended) anyExtended = true
    const rate = i === 0
      ? (isExtended ? 50 : 55)
      : (isExtended ? 45 : 50)
    const cost = rate * dog.nights

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    lineItems.push({
      label: `${dogLabel} — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night`,
      amount: cost,
    })
    total += cost

    for (const addOn of dog.addOns) {
      const info = boardingAddOns[addOn]
      const addOnCost = info.perDay * dog.nights
      lineItems.push({
        label: `${dogLabel} — ${info.label} ($${info.perDay}/day)`,
        amount: addOnCost,
      })
      total += addOnCost
    }
  }

  return {
    total,
    lineItems,
    isExtendedStay: anyExtended,
    includes: ['Indoor/outdoor play', 'Supervised group play', 'Feeding (your food)', 'Bedding provided'],
  }
}

// ─── Grooming ───────────────────────────────────────────────
export type GroomingService = 'quickBath' | 'fullBath' | 'fullGroom'
export type DogSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type HairType = 'short' | 'long'
export type GroomingAddOn =
  | 'nailTrim'
  | 'nailTrimGrind'
  | 'nailGrind'
  | 'feetTrim'
  | 'sanitaryTrim'
  | 'earCleaning'
  | 'glandExpression'
  | 'blowDry'
  | 'brushOut'
  | 'teethBrushing'
  | 'deShed'
  | 'faceTrim'
  | 'mattingFee'
  | 'handlingFee'
  | 'dirtyDogFee'
  | 'lateFee'
export type GroomingMode = 'fullService' | 'alaCarte'
export type DogConfig = {id: string; size: DogSize; hairType: HairType}

const groomingRates: Record<GroomingService, Partial<Record<DogSize, Partial<Record<HairType, number | null>>>>> = {
  quickBath: {
    s: {short: 25, long: 35},
    m: {short: 30, long: 45},
    l: {short: 35, long: 55},
    xl: {short: 50, long: null},
  },
  fullBath: {
    xs: {short: 40, long: 45},
    s: {short: 50, long: 55},
    m: {short: 60, long: 65},
    l: {short: 75, long: 80},
    xl: {short: 90, long: 95},
  },
  fullGroom: {
    xs: {short: 70, long: 70},
    s: {short: 75, long: 75},
    m: {short: 85, long: 85},
    l: {short: 110, long: 110},
    xl: {short: 130, long: 130},
  },
}

const groomingAddOns: Record<GroomingAddOn, {label: string; price: number; priceL?: number; note?: string}> = {
  nailTrim: {label: 'Nail Trim', price: 17},
  nailTrimGrind: {label: 'Nail Trim & Grind', price: 22},
  nailGrind: {label: 'Nail Grind', price: 17},
  feetTrim: {label: 'Feet Trim', price: 12},
  sanitaryTrim: {label: 'Sanitary Trim', price: 12},
  earCleaning: {label: 'Ear Cleaning', price: 12},
  glandExpression: {label: 'Gland Expression', price: 17},
  blowDry: {label: 'Blow Dry', price: 20},
  brushOut: {label: 'Brush Out', price: 20, note: 'Starting at'},
  teethBrushing: {label: 'Teeth Brushing', price: 15},
  deShed: {label: 'De-Shed Treatment', price: 24, priceL: 28},
  faceTrim: {label: 'Face Trim', price: 15},
  mattingFee: {label: 'Matting Fee', price: 15, note: 'Starting at'},
  handlingFee: {label: 'Handling Fee', price: 10, note: 'Starting at'},
  dirtyDogFee: {label: 'Dirty Dog Fee (double wash)', price: 10},
  lateFee: {label: 'Late Fee', price: 1, note: 'Per minute'},
}

export const groomingAddOnOptions = Object.entries(groomingAddOns).map(([key, val]) => ({
  id: key as GroomingAddOn,
  label: val.label,
  price: val.price,
  priceL: val.priceL,
  note: val.note,
}))

export const sizeLabels: Record<DogSize, string> = {
  xs: 'XS (0–14 lbs)',
  s: 'Small (15–29 lbs)',
  m: 'Medium (30–55 lbs)',
  l: 'Large (55–89 lbs)',
  xl: 'XL (90+ lbs)',
}

export const shortSizeLabels: Record<DogSize, string> = {
  xs: 'XS',
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'XL',
}

export const serviceLabels: Record<GroomingService, string> = {
  quickBath: 'Quick Bath',
  fullBath: 'Full Service Bath',
  fullGroom: 'Full Service Groom',
}

export function getAvailableSizes(service: GroomingService): DogSize[] {
  return Object.keys(groomingRates[service]) as DogSize[]
}

export function isHairTypeRelevant(service: GroomingService): boolean {
  return service !== 'fullGroom'
}

const fullServiceIncludes: Record<GroomingService, string[]> = {
  quickBath: ['Bath & towel dry'],
  fullBath: ['Full bath & blow dry', 'Nail trim', 'Ear cleaning', 'Brush out'],
  fullGroom: ['Full bath & blow dry', 'Nail trim', 'Ear cleaning', 'Brush out', 'Haircut'],
}

const timeEstimates: Record<GroomingService, string> = {
  quickBath: '30–45 min',
  fullBath: '1–1.5 hrs',
  fullGroom: '2–3 hrs',
}

export type GroomingFullServiceResult = {
  total: number
  lineItems: LineItem[]
  includes: string[]
  timeEstimate: string
  isUnavailable: boolean
  unavailableMessage: string | null
}

export function calculateGroomingFullService(input: {
  service: GroomingService
  dogs: DogConfig[]
}): GroomingFullServiceResult {
  const {service, dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const sizeRates = groomingRates[service][dog.size]
    if (!sizeRates) {
      return {
        total: 0,
        lineItems: [],
        includes: [],
        timeEstimate: '',
        isUnavailable: true,
        unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[dog.size]} dogs.`,
      }
    }
    const effectiveHairType = isHairTypeRelevant(service) ? dog.hairType : 'short'
    const price = sizeRates[effectiveHairType]
    if (price === null || price === undefined) {
      return {
        total: 0,
        lineItems: [],
        includes: [],
        timeEstimate: '',
        isUnavailable: true,
        unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[dog.size]} dogs with ${effectiveHairType} hair.`,
      }
    }
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
    includes: fullServiceIncludes[service],
    timeEstimate: timeEstimates[service],
    isUnavailable: false,
    unavailableMessage: null,
  }
}

export type GroomingAlaCarteResult = {
  total: number
  lineItems: LineItem[]
}

export function calculateGroomingAlaCarte(input: {
  dogs: DogConfig[]
  selectedItems: GroomingAddOn[]
}): GroomingAlaCarteResult {
  const {dogs, selectedItems} = input
  if (selectedItems.length === 0) {
    return {total: 0, lineItems: []}
  }

  const lineItems: LineItem[] = []
  let total = 0

  const allSameSize = dogs.every((d) => d.size === dogs[0].size)

  for (const addOn of selectedItems) {
    const info = groomingAddOns[addOn]

    if (allSameSize || !info.priceL) {
      const isLarge = dogs[0].size === 'l' || dogs[0].size === 'xl'
      const price = isLarge && info.priceL ? info.priceL : info.price
      const cost = price * dogs.length
      total += cost
      lineItems.push({
        label: dogs.length > 1 ? `${info.label} × ${dogs.length}` : info.label,
        amount: cost,
      })
    } else {
      for (let i = 0; i < dogs.length; i++) {
        const isLarge = dogs[i].size === 'l' || dogs[i].size === 'xl'
        const price = isLarge && info.priceL ? info.priceL : info.price
        total += price
        lineItems.push({
          label: `${info.label} — Dog ${i + 1} (${shortSizeLabels[dogs[i].size]})`,
          amount: price,
        })
      }
    }
  }

  return {total, lineItems}
}
