'use client'

import {useState} from 'react'

type WebcamEmbedProps = {
  cameraId: string
  name: string
}

export default function WebcamEmbed({cameraId, name}: WebcamEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="rounded-lg overflow-hidden bg-white border border-border-light shadow-sm">
      <div className="relative aspect-video bg-[#1a1a1a]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-full border-3 border-cream/30 border-t-cream animate-spin" />
            <span className="text-cream/50 text-[13px]">Loading camera…</span>
          </div>
        )}
        <iframe
          src={`https://g1.ipcamlive.com/player/player.php?alias=${cameraId}&autoplay=1&mute=1&disablenavigation=1`}
          title={name}
          allow="autoplay; fullscreen"
          allowFullScreen={true}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-charcoal text-[14px] font-medium">{name}</p>
      </div>
    </div>
  )
}
