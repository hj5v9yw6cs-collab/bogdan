import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { employers, type Employer, type CareerRecord } from '../data/content'

type Ev = { date: Date; e: Employer; r: CareerRecord }

const parse = (d: string) => { const [dd, mm, yy] = d.split('.').map(Number); return new Date(yy, mm - 1, dd) }

export default function Calendar() {
  const { t, tt, lang } = useLang()
  const { mobile } = useWindow()
  const { open } = useWindows()
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [dir, setDir] = useState(1)

  const events = useMemo<Ev[]>(() => employers.flatMap((e) => e.records.filter((r) => r.date).map((r) => ({ date: parse(r.date!), e, r }))).sort((a, b) => +a.date - +b.date), [])

  const y = cursor.getFullYear(), m = cursor.getMonth()
  const first = (new Date(y, m, 1).getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const cells = Array.from({ length: 42 }, (_, i) => i - first + 1)
  const loc = lang === 'ru' ? 'ru-RU' : 'en-US'
  const monthName = cursor.toLocaleDateString(loc, { month: 'long', year: 'numeric' })
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(loc, { weekday: 'short' }))
  const go = (d: number) => { setDir(d); setCursor(new Date(y, m + d, 1)) }
  const jump = (d: Date) => { setDir(d > cursor ? 1 : -1); setCursor(new Date(d.getFullYear(), d.getMonth(), 1)) }
  const evOn = (day: number) => events.filter((v) => v.date.getFullYear() === y && v.date.getMonth() === m && v.date.getDate() === day)

  return (
    <div className="flex h-full min-h-0">
      {!mobile && (
        <aside className="w-[240px] flex-none bg-side border-r border-line flex flex-col min-h-0">
          <div className="h-[52px]" />
          <div className="px-4 pb-2 text-[11px] font-semibold text-ink-3">{tt('Карьерные даты', 'Career dates')}</div>
          <div className="scroll flex-1 px-2.5 pb-3">
            {events.map((v, i) => (
              <button key={i} onClick={() => jump(v.date)} className="w-full text-left flex gap-2.5 px-2 py-1.5 rounded-md hover:bg-hover">
                <span className="mt-1.5 size-2 rounded-full flex-none" style={{ background: v.e.color }} />
                <span className="min-w-0">
                  <span className="block text-[11px] text-ink-3 font-mono">{v.r.date}</span>
                  <span className="block text-[12px] leading-snug truncate">{t(v.e.name)} · {t(v.r.title)}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-line">
            <button className="btn-primary w-full h-9" onClick={() => open('consulting', { book: '1' })}>Book a consultation</button>
          </div>
        </aside>
      )}
      <div className="flex-1 min-w-0 flex flex-col bg-win-solid">
        <Toolbar inset={mobile} className={mobile ? '' : 'pl-5'}>
          <div className="serif text-[24px] capitalize flex-1 leading-none">{monthName}</div>
          <button className="tb-btn" onClick={() => go(-1)} aria-label="Previous"><ChevronLeft size={17} /></button>
          <button className="tb-btn px-2.5 text-[12px] font-medium" onClick={() => jump(new Date(today.getFullYear(), today.getMonth(), 1))}>{tt('Сегодня', 'Today')}</button>
          <button className="tb-btn" onClick={() => go(1)} aria-label="Next"><ChevronRight size={17} /></button>
        </Toolbar>
        <div className="grid grid-cols-7 border-y border-line text-[11px] text-ink-3 text-right">
          {weekdays.map((w) => <div key={w} className="px-2 py-1.5 capitalize">{w}</div>)}
        </div>
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={`${y}-${m}`}
              custom={dir}
              initial={{ y: dir * 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -dir * 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
              className="absolute inset-0 grid grid-cols-7 grid-rows-6"
            >
              {cells.map((d, i) => {
                const inMonth = d >= 1 && d <= days
                const isToday = inMonth && d === today.getDate() && m === today.getMonth() && y === today.getFullYear()
                const evs = inMonth ? evOn(d) : []
                return (
                  <div key={i} className={`border-r border-b border-line p-1 min-w-0 overflow-hidden ${i % 7 >= 5 ? 'bg-fill/60' : ''}`}>
                    <div className="flex justify-end">
                      <span className={`text-[12px] size-6 grid place-items-center rounded-full ${isToday ? 'bg-[#ff3b30] text-white font-semibold' : inMonth ? '' : 'text-ink-3/50'}`}>{inMonth ? d : ''}</span>
                    </div>
                    {evs.map((v, k) => (
                      <button key={k} onClick={() => open('company', { company: v.e.id }, `company:${v.e.id}`)} title={`${t(v.e.name)} — ${t(v.r.title)}`} className="w-full text-left mt-0.5 rounded px-1 py-0.5 text-[10.5px] leading-tight truncate" style={{ background: `color-mix(in oklab, ${v.e.color} 22%, transparent)`, color: 'var(--c-ink)' }}>
                        {t(v.e.name)} · {t(v.r.title)}
                      </button>
                    ))}
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
