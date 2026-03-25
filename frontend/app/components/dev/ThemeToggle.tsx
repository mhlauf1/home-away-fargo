'use client'

import {useState, useEffect} from 'react'

const THEMES = [
  {id: 'hearthstone', label: 'Hearthstone', color: '#8B2D1E'},
  {id: 'prairie-modern', label: 'Prairie Modern', color: '#6B8F71'},
  {id: 'farmstead-blue', label: 'Farmstead Blue', color: '#1E3A5F'},
] as const

type ThemeId = (typeof THEMES)[number]['id']

function getInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return 'hearthstone'

  // URL param takes priority
  const params = new URLSearchParams(window.location.search)
  const urlTheme = params.get('theme') as ThemeId | null
  if (urlTheme && THEMES.some((t) => t.id === urlTheme)) return urlTheme

  // Then localStorage
  const stored = localStorage.getItem('hafh-theme') as ThemeId | null
  if (stored && THEMES.some((t) => t.id === stored)) return stored

  return 'hearthstone'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>('hearthstone')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
    setMounted(true)
  }, [])

  function switchTheme(id: ThemeId) {
    setTheme(id)
    document.documentElement.setAttribute('data-theme', id)
    localStorage.setItem('hafh-theme', id)

    // Update URL param without full navigation
    const url = new URL(window.location.href)
    url.searchParams.set('theme', id)
    window.history.replaceState({}, '', url.toString())
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-black/10">
      <span className="text-[11px] font-medium text-black/50 uppercase tracking-wider mr-1">
        Theme
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => switchTheme(t.id)}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
          className={`w-7 h-7 rounded-full border-2 transition-all ${
            theme === t.id ? 'border-black/60 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
          }`}
          style={{backgroundColor: t.color}}
        />
      ))}
    </div>
  )
}
