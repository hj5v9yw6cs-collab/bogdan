import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { L } from '../data/content'

export type Lang = 'ru' | 'en'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: L) => string; tt: (ru: string, en: string) => string }
const LangContext = createContext<Ctx | null>(null)

const read = (): Lang => {
  try {
    const v = localStorage.getItem('bs-lang')
    if (v === 'ru' || v === 'en') return v
  } catch { /* storage unavailable */ }
  return 'ru'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(read)
  const setLang = useCallback((v: Lang) => {
    setLangState(v)
    try { localStorage.setItem('bs-lang', v) } catch { /* ignore */ }
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (v) => v[lang],
    tt: (ru, en) => (lang === 'ru' ? ru : en),
  }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang outside LangProvider')
  return ctx
}
