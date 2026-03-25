'use client'

import {useState, useMemo, useCallback} from 'react'
import {ModeToggle, DogCard, AddDogButton, RadioGroup, CheckboxGroup} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {
  calculateGroomingFullService,
  calculateGroomingAlaCarte,
  getAvailableSizes,
  isHairTypeRelevant,
  groomingAddOnOptions,
  sizeLabels,
  serviceLabels,
} from '@/app/data/pricingData'
import type {
  GroomingService,
  DogSize,
  GroomingAddOn,
  GroomingMode,
  DogConfig,
} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type GroomingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

let dogIdCounter = 1

function createDog(size: DogSize = 'm'): DogConfig {
  return {id: String(dogIdCounter++), size, hairType: 'short'}
}

export default function GroomingCalculator({ctaText, ctaLink, taxNote}: GroomingCalculatorProps) {
  const [mode, setMode] = useState<GroomingMode>('fullService')
  const [dogs, setDogs] = useState<DogConfig[]>(() => [createDog()])
  const [service, setService] = useState<GroomingService>('fullBath')
  const [selectedItems, setSelectedItems] = useState<GroomingAddOn[]>([])

  const availableSizes = useMemo(() => getAvailableSizes(service), [service])
  const showHairType = isHairTypeRelevant(service)

  const handleServiceChange = useCallback(
    (v: string) => {
      const newService = v as GroomingService
      setService(newService)
      const newSizes = getAvailableSizes(newService)
      setDogs((prev) =>
        prev.map((dog) => {
          if (!newSizes.includes(dog.size)) {
            return {...dog, size: newSizes[0]}
          }
          return dog
        }),
      )
    },
    [],
  )

  const handleUpdateDog = useCallback((index: number, updated: DogConfig) => {
    setDogs((prev) => prev.map((d, i) => (i === index ? updated : d)))
  }, [])

  const handleRemoveDog = useCallback((index: number) => {
    setDogs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddDog = useCallback(() => {
    setDogs((prev) => {
      if (prev.length >= 3) return prev
      return [...prev, createDog(prev[prev.length - 1].size)]
    })
  }, [])

  const fullServiceResult = useMemo(
    () => calculateGroomingFullService({service, dogs}),
    [service, dogs],
  )

  const alaCarteResult = useMemo(
    () => calculateGroomingAlaCarte({dogs, selectedItems}),
    [dogs, selectedItems],
  )

  const isFullService = mode === 'fullService'
  const total = isFullService ? fullServiceResult.total : alaCarteResult.total
  const lineItems = isFullService ? fullServiceResult.lineItems : alaCarteResult.lineItems
  const isUnavailable = isFullService ? fullServiceResult.isUnavailable : false
  const unavailableMessage = isFullService ? fullServiceResult.unavailableMessage : null
  const includes = isFullService ? fullServiceResult.includes : undefined
  const timeEstimate = isFullService ? fullServiceResult.timeEstimate : undefined
  const emptyAlaCarte = !isFullService && selectedItems.length === 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <ModeToggle mode={mode} onChange={setMode} />

        {isFullService && (
          <RadioGroup
            label="Service Type"
            options={Object.entries(serviceLabels).map(([value, label]) => ({label, value}))}
            value={service}
            onChange={handleServiceChange}
          />
        )}

        {/* Dog Cards */}
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[13px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
          </span>
          {dogs.map((dog, i) => (
            <DogCard
              key={dog.id}
              dog={dog}
              index={i}
              total={dogs.length}
              showHairType={isFullService ? showHairType : false}
              availableSizes={isFullService ? availableSizes : (['xs', 's', 'm', 'l', 'xl'] as DogSize[])}
              onUpdate={(updated) => handleUpdateDog(i, updated)}
              onRemove={() => handleRemoveDog(i)}
            />
          ))}
          {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
        </div>

        {!isFullService && (
          <CheckboxGroup
            label="Services"
            options={groomingAddOnOptions.map((a) => {
              const hasLargeDog = dogs.some((d) => d.size === 'l' || d.size === 'xl')
              const price = hasLargeDog && a.priceL ? `$${a.priceL}` : `$${a.price}`
              const allSameSize = dogs.every((d) => d.size === dogs[0].size)
              const showRange = !allSameSize && a.priceL
              const priceStr = showRange ? `$${a.price}–$${a.priceL}` : price
              const detail = a.note ? `${priceStr} (${a.note})` : priceStr
              return {
                id: a.id,
                label: a.label,
                detail,
              }
            })}
            selected={selectedItems}
            onChange={(selected) => setSelectedItems(selected as GroomingAddOn[])}
          />
        )}
      </div>

      {/* Output */}
      <PriceOutputCard
        total={total}
        lineItems={lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        disabled={isUnavailable}
        disabledMessage={unavailableMessage}
        includes={includes}
        timeEstimate={timeEstimate}
        emptyMessage={emptyAlaCarte ? 'Select services above to see pricing.' : undefined}
      />
    </div>
  )
}
