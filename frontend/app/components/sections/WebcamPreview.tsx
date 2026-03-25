'use client'

import {useState} from 'react'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type WebcamPreviewProps = {
  block: {
    eyebrow?: string
    heading?: string
    previewImage?: {asset?: {_ref: string}; crop?: any}
    passwordProtected?: boolean
    webcamUrl?: string
  }
  index: number
  pageId: string
  pageType: string
}

export default function WebcamPreview({block}: WebcamPreviewProps) {
  const {eyebrow, heading, previewImage, passwordProtected} = block
  const [password, setPassword] = useState('')

  return (
    <section className="bg-cream">
      <div className="px-8 md:px-24 py-[80px] lg:py-[120px]">
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14">
            {eyebrow && <Badge className="mb-4">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[95%]">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 lg:gap-4 items-center">
            {/* Password form */}
            {passwordProtected && (
              <div className="border border-forest flex w-full items-center rounded-lg p-8 h-full">
                <div className="space-y-4 w-full px-12">
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-sand/40 text-center border border-border-light rounded-sm font-sans text-[16px] placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sand"
                  />
                  <Button variant="outline" className="w-full">
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {/* Preview image */}
            {previewImage?.asset?._ref && (
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  id={previewImage.asset._ref}
                  alt="Webcam preview"
                  width={600}
                  crop={previewImage.crop}
                  className="w-full object-cover aspect-video blur-sm"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#2D4A3E">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="absolute bottom-3 inset-x-0 text-center font-sans text-[13px] text-white/80">
                  Enter your password to view live footage
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
