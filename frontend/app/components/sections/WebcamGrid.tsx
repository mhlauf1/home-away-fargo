'use client'

import {useState, useEffect, FormEvent} from 'react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import WebcamEmbed from '@/app/components/sections/WebcamEmbed'

type Webcam = {
  _id: string
  name: string
  cameraId: string
  group: string
  sortOrder?: number
}

type WebcamGridProps = {
  block: {
    heading?: string
    subtext?: string
    trustMessage?: string
    showGroupHeaders?: boolean
    webcams?: Webcam[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function WebcamGrid({block}: WebcamGridProps) {
  const {heading, subtext, trustMessage, showGroupHeaders = true, webcams = []} = block

  const [authStatus, setAuthStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated' | 'outsideHours'
  >('loading')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/webcam-auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.outsideHours) {
          setAuthStatus('outsideHours')
        } else {
          setAuthStatus(data.authenticated ? 'authenticated' : 'unauthenticated')
        }
      })
      .catch(() => setAuthStatus('unauthenticated'))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/webcam-auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password}),
      })
      const data = await res.json()

      if (data.outsideHours) {
        setAuthStatus('outsideHours')
      } else if (data.authenticated) {
        setAuthStatus('authenticated')
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const indoor = webcams.filter((w) => w.group === 'indoor')
  const outdoor = webcams.filter((w) => w.group === 'outdoor')

  // Loading state
  if (authStatus === 'loading') {
    return (
      <section className="bg-cream">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-[80px] lg:py-[120px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
          </div>
        </div>
      </section>
    )
  }

  // Outside operating hours
  if (authStatus === 'outsideHours') {
    return (
      <section className="bg-cream">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-[80px] lg:py-[120px]">
          <FadeIn>
            <div className="max-w-md mx-auto text-center">
              {heading && (
                <h2 className="text-forest text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[95%] mb-4">
                  {heading}
                </h2>
              )}
              <p className="text-charcoal/70 text-[16px] md:text-[18px] leading-relaxed">
                Our webcams are available daily from 8:30 AM to 4:30 PM. Please check back during
                operating hours.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    )
  }

  // Password form
  if (authStatus === 'unauthenticated') {
    return (
      <section className="bg-cream">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-[80px] lg:py-[120px]">
          <FadeIn>
            <div className="max-w-md mx-auto text-center">
              {heading && (
                <h2 className="text-forest text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[95%] mb-4">
                  {heading}
                </h2>
              )}
              <p className="text-charcoal/70 text-[16px] md:text-[18px] mb-8">
                Enter the password provided by Home Away From Home to view our live camera feeds.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-sand bg-white px-4 py-3 text-[16px] text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  required
                />
                {error && <p className="text-red-600 text-[14px]">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-terracotta px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:opacity-60"
                >
                  {submitting ? 'Checking...' : 'View Cameras'}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    )
  }

  // Authenticated — show cameras
  return (
    <section className="bg-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-[80px] lg:py-[120px]">
        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14">
            {heading && (
              <h2 className="text-forest text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[95%] mb-4">
                {heading}
              </h2>
            )}
            {subtext && (
              <p className="text-charcoal/70 text-[16px] md:text-[18px] max-w-[600px] mx-auto">
                {subtext}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Trust message banner */}
        {trustMessage && (
          <FadeIn delay={0.1}>
            <div className="mb-10 lg:mb-14 mx-auto max-w-3xl text-center bg-forest/5 border border-forest/10 rounded-lg px-6 py-4">
              <p className="text-[15px] md:text-[16px] text-forest/80 leading-relaxed">
                {trustMessage}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Indoor cameras */}
        {indoor.length > 0 && (
          <div className="mb-12">
            {showGroupHeaders && (
              <FadeIn>
                <h3 className="text-forest text-[24px] md:text-[28px] font-semibold mb-6">
                  Indoor Play Areas
                </h3>
              </FadeIn>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indoor.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}

        {/* Outdoor cameras */}
        {outdoor.length > 0 && (
          <div>
            {showGroupHeaders && (
              <FadeIn>
                <h3 className="text-forest text-[24px] md:text-[28px] font-semibold mb-6">
                  Outdoor Play Areas
                </h3>
              </FadeIn>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outdoor.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}

        {webcams.length === 0 && (
          <p className="text-center text-charcoal/50 text-[16px]">
            No cameras are currently available.
          </p>
        )}
      </div>
    </section>
  )
}
