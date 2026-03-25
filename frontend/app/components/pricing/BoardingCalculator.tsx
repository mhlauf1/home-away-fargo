'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, CheckboxGroup, AddDogButton, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateBoardingPerDog, boardingAddOnOptions} from '@/app/data/pricingData'
import type {BoardingAddOn, BoardingDogConfig} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type BoardingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

let dogIdCounter = 1

function createDog(): BoardingDogConfig {
  return {id: String(dogIdCounter++), nights: 1, addOns: []}
}

export default function BoardingCalculator({ctaText, ctaLink, taxNote}: BoardingCalculatorProps) {
  const [dogs, setDogs] = useState<BoardingDogConfig[]>(() => [createDog()])

  const handleUpdateDog = useCallback((index: number, updates: Partial<BoardingDogConfig>) => {
    setDogs((prev) => prev.map((d, i) => (i === index ? {...d, ...updates} : d)))
  }, [])

  const handleRemoveDog = useCallback((index: number) => {
    setDogs((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddDog = useCallback(() => {
    setDogs((prev) => {
      if (prev.length >= 3) return prev
      return [...prev, createDog()]
    })
  }, [])

  const result = useMemo(
    () => calculateBoardingPerDog({dogs}),
    [dogs],
  )

  if (dogs.length > 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="space-y-6">
          <ContactNotice />
        </div>
        <PriceOutputCard
          total={0}
          lineItems={[]}
          ctaText="Call Us"
          ctaLink={{_type: 'link', linkType: 'href', href: 'tel:6517889797'}}
          taxNote={taxNote}
          disabled
          disabledMessage="Please call for custom pricing for 4+ dogs."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="block text-cream/70 font-sans text-[13px] font-medium uppercase tracking-wider">
            {dogs.length > 1 ? 'Your Dogs' : 'Your Dog'}
          </span>
          {dogs.map((dog, i) => (
            <BoardingDogCard
              key={dog.id}
              dog={dog}
              index={i}
              total={dogs.length}
              onUpdate={(updates) => handleUpdateDog(i, updates)}
              onRemove={() => handleRemoveDog(i)}
            />
          ))}
          {dogs.length < 3 && <AddDogButton onClick={handleAddDog} />}
        </div>
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        includes={result.includes}
        badge={result.isExtendedStay ? 'Extended Stay' : null}
      />
    </div>
  )
}

// ─── Boarding Dog Card ──────────────────────────────────────
type BoardingDogCardProps = {
  dog: BoardingDogConfig
  index: number
  total: number
  onUpdate: (updates: Partial<BoardingDogConfig>) => void
  onRemove: () => void
}

function BoardingDogCard({dog, index, total, onUpdate, onRemove}: BoardingDogCardProps) {
  const isExtended = dog.nights >= 10

  return (
    <div className="bg-forest-card border border-border-dark rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[14px] font-medium text-cream">
          {total > 1 ? `Dog ${index + 1}` : 'Your Dog'}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="font-sans text-[12px] text-cream/40 hover:text-terracotta-light transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <NumberStepper
        label="Nights"
        value={dog.nights}
        min={1}
        max={30}
        onChange={(v) => onUpdate({nights: v})}
        badge={isExtended ? 'Extended stay rate!' : null}
      />

      <CheckboxGroup
        label="Add-Ons"
        options={boardingAddOnOptions.map((a) => ({
          id: a.id,
          label: a.label,
          detail: `$${a.perDay}/day`,
        }))}
        selected={dog.addOns}
        onChange={(selected) => onUpdate({addOns: selected as BoardingAddOn[]})}
      />
    </div>
  )
}
