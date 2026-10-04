import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search } from 'lucide-react'
import { useSystem } from '../store/system'
import { useLang } from '../lib/i18n'
import { allItems, type FsItem } from '../data/fs'
import { ItemIcon, useOpenAction } from './ItemIcon'

export function Spotlight() {
  const { spotlight, setSpotlight } = useSystem()
  const { t, tt } = useLang()
  const openAction = useOpenAction()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Space' || e.key === 'k')) { e.preventDefault(); setSpotlight(!spotlight) }
      if (e.key === 'Escape' && spotlight) setSpotlight(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [spotlight, setSpotlight])

  useEffect(() => { if (spotlight) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 30) } }, [spotlight])

  const results = useMemo(() => {
    const uniq = new Map<string, FsItem>()
    for (const it of allItems) {
      const key = JSON.stringify(it.action)
      if (!uniq.has(key)) uniq.set(key, it)
    }
    const list = [...uniq.values()]
    const s = q.trim().toLowerCase()
    if (!s) return list.filter((x) => x.icon.type !== 'file' || x.icon.kind === 'pdf').slice(0, 7)
    const score = (x: FsItem) => {
      if ((t(x.name) + ' ' + (x.keywords ?? '')).toLowerCase().includes(s)) return 2
      if ((x.description ? t(x.description) : '').toLowerCase().includes(s)) return 1
      return 0
    }
    return list.map((x) => [x, score(x)] as const).filter(([, sc]) => sc > 0).sort((a, b) => b[1] - a[1]).map(([x]) => x).slice(0, 8)
  }, [q, t])

  const go = (it?: FsItem) => { if (!it) return; setSpotlight(false); openAction(it.action) }

  return (
    <AnimatePresence>
      {spotlight && (
        <motion.div className="absolute inset-0 z-[6000]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSpotlight(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 520, damping: 36 }}
            className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[min(640px,92%)] rounded-2xl glass-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-[var(--glass-border)] overflow-hidden text-[var(--c-ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-14">
              <Search size={20} className="text-ink-3" />
              <input
                ref={input}
                value={q}
                onChange={(e) => { setQ(e.target.value); setI(0) }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(results.length - 1, x + 1)) }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)) }
                  if (e.key === 'Enter') go(results[i])
                }}
                placeholder={tt('Поиск Spotlight', 'Spotlight Search')}
                className="flex-1 bg-transparent outline-none text-[20px] font-light placeholder:text-ink-3"
              />
            </div>
            {results.length > 0 && (
              <div className="border-t border-line p-1.5 max-h-[340px] overflow-auto">
                {!q && <div className="px-3 pt-1 pb-1.5 text-[11px] font-semibold text-ink-3">{tt('Подсказки Siri', 'Siri Suggestions')}</div>}
                {results.map((r, k) => (
                  <button key={r.id} onMouseEnter={() => setI(k)} onClick={() => go(r)} className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left ${k === i ? 'bg-accent text-white' : ''}`}>
                    <ItemIcon icon={r.icon} size={26} />
                    <span className="flex-1 min-w-0 truncate text-[13.5px]">{t(r.name)}</span>
                    <span className={`text-[11.5px] truncate max-w-[45%] ${k === i ? 'text-white/75' : 'text-ink-3'}`}>{r.description ? t(r.description) : t(r.kindLabel)}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
