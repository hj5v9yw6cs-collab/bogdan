import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { store } from '../lib/hooks'

export type Theme = 'light' | 'dark'
export type Power = 'off' | 'booting' | 'on'

type Settings = {
  theme: Theme
  wallpaper: number
  brightness: number
  volume: number
  wifi: boolean
  bluetooth: boolean
  airdrop: boolean
  focus: boolean
}

type Ctx = Settings & {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  power: Power
  setPower: (p: Power) => void
  spotlight: boolean
  setSpotlight: (v: boolean) => void
}

const SystemContext = createContext<Ctx | null>(null)

const defaults: Settings = {
  theme: 'light',
  wallpaper: 0,
  brightness: 1,
  volume: 0.6,
  wifi: true,
  bluetooth: true,
  airdrop: false,
  focus: false,
}

function load(): Settings {
  try {
    const raw = store.get('bs-settings')
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  return { ...defaults, theme: prefersDark ? 'dark' : 'light', wallpaper: prefersDark ? 1 : 0 }
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)
  const [power, setPower] = useState<Power>('booting')
  const [spotlight, setSpotlight] = useState(false)

  useEffect(() => {
    const { brightness: _b, ...persist } = settings
    void _b
    store.set('bs-settings', JSON.stringify(persist))
  }, [settings])

  const set = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => {
      const next = { ...s, [key]: value }
      // Dynamic wallpaper: Dawn ↔ Night follow the appearance (Graphite stays as chosen).
      if (key === 'theme' && s.wallpaper !== 2) next.wallpaper = value === 'dark' ? 1 : 0
      return next
    })
  }, [])

  const value = useMemo<Ctx>(() => ({ ...settings, set, power, setPower, spotlight, setSpotlight }), [settings, set, power, spotlight])
  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const ctx = useContext(SystemContext)
  if (!ctx) throw new Error('useSystem outside SystemProvider')
  return ctx
}
