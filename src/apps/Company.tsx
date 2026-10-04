import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, MapPin, Route } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { Need, TextOrNeed } from '../components/Need'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { employers, employerById, employerPeriod, segments, type CareerRecord, type Employer, type EmployerId, type RecordKind } from '../data/content'

export const kindLabel: Record<RecordKind, [string, string]> = {
  hire: ['Приём', 'Hired'],
  promotion: ['Новая должность', 'New role'],
  transfer: ['Перевод', 'Transfer'],
  end: ['Завершение', 'Ended'],
}

export const segTitle = (id: string) => segments.find((s) => s.id === id)!

export default function Company() {
  const { win } = useWindow()
  const { open } = useWindows()
  const { t, tt } = useLang()
  const e = employerById[(win.params.company as EmployerId) ?? 'sber'] ?? employers[0]
  const idx = employers.indexOf(e)
  const p = employerPeriod(e)
  const roles = new Set(e.records.filter((r) => r.kind !== 'end' && !r.title.ru.includes('[NEED')).map((r) => r.title.ru)).size
  const go = (d: number) => {
    const n = employers[(idx + d + employers.length) % employers.length]
    open('company', { company: n.id }, `company:${n.id}`)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="relative flex-none text-white overflow-hidden grain" style={{ background: e.gradient }}>
        <Toolbar className="relative z-10 justify-end">
          <button className="tb-btn !text-white/80 hover:!bg-white/15" onClick={() => go(-1)} aria-label="Previous"><ChevronLeft size={17} /></button>
          <button className="tb-btn !text-white/80 hover:!bg-white/15" onClick={() => go(1)} aria-label="Next"><ChevronRight size={17} /></button>
        </Toolbar>
        <div className="relative z-10 px-7 pb-6 -mt-1">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/60">{e.folder}</div>
          <motion.h1 key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="serif text-[44px] sm:text-[52px] leading-[0.95] mt-2">{t(e.name)}</motion.h1>
          {e.parent && <div className="mt-2 inline-flex rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11.5px] font-medium">{t(e.parent)}</div>}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-white/80">
            <span>{p.from ? <>{p.from} — {p.current ? tt('по настоящее время', 'present') : p.to ?? <Need label={tt('дата окончания', 'end date')} />}</> : <Need label={tt('даты', 'dates')} />}</span>
            {e.id !== 'early' && <span>{e.records.filter((r) => r.kind !== 'end').length} {tt('кадровых записей', 'HR records')} · {roles} {tt(roles === 1 ? 'должность' : roles < 5 ? 'должности' : 'должностей', roles === 1 ? 'role' : 'roles')}</span>}
            {p.current && <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />{tt('текущее место работы', 'current employer')}</span>}
          </div>
        </div>
      </div>

      <div className="scroll flex-1 min-h-0 bg-win-solid">
        <div className="px-6 sm:px-7 py-6 max-w-[860px]">
          <p className="text-[14.5px] leading-relaxed text-ink-2 selectable">{t(e.summary)}</p>

          {e.id === 'sber' && <SberLadder e={e} />}

          <h2 className="eyebrow mt-8 mb-3">{tt('Записи из трудовой истории', 'Employment record')}</h2>
          <RecordList e={e} />

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <InfoCard title={tt('Обязанности', 'Responsibilities')}>
              {e.responsibilities.length ? <ul className="space-y-1.5">{e.responsibilities.map((r, i) => <li key={i}>{t(r)}</li>)}</ul> : <Need />}
            </InfoCard>
            <InfoCard title={tt('Достижения', 'Achievements')}>
              {e.achievements.length ? e.achievements.map((a) => <div key={a.value}><b className="text-ink">{a.value}</b> {t(a.label)}</div>) : <Need />}
            </InfoCard>
            <InfoCard title={tt('Чему научила компания', 'What it taught me')}>
              {e.lessons ? t(e.lessons) : <Need />}
            </InfoCard>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            <button className="btn-primary" onClick={() => open('timeline', { stage: e.id })}><Route size={15} />{tt('Открыть Career Timeline', 'Open Career Timeline')}</button>
            <button className="btn-ghost" onClick={() => open('resume')}>{tt('Резюме', 'Resume')} <ArrowUpRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-fill p-4 text-[12.5px] text-ink-2 leading-relaxed">
      <div className="text-[11px] font-semibold text-ink-3 mb-2">{title}</div>
      {children}
    </div>
  )
}

export function RecordList({ e, only }: { e: Employer; only?: number[] }) {
  const { t, tt } = useLang()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const list = e.records.map((r, i) => [r, i] as const).filter(([, i]) => !only || only.includes(i))
  return (
    <ol className="relative">
      {list.map(([r, i], n) => {
        const isOpen = openIdx === i
        const last = n === list.length - 1
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: n * 0.045, type: 'spring', stiffness: 400, damping: 32 }}
            className="relative pl-7"
          >
            {!last && <span className="absolute left-[7px] top-5 bottom-0 w-px bg-line" />}
            <span
              className="absolute left-0 top-[7px] size-[15px] rounded-full border-2 grid place-items-center"
              style={{ borderColor: r.kind === 'end' ? 'var(--c-ink-3)' : e.color, background: r.kind === 'promotion' || r.kind === 'hire' ? e.color : 'var(--c-win-solid)' }}
            />
            <button onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full text-left rounded-lg px-3 py-2 -ml-1 hover:bg-hover transition-colors group">
              <div className="flex items-center gap-2 text-[11.5px] text-ink-3">
                <span className="font-mono text-ink-2">{r.date ?? <Need label={tt('дата', 'date')} />}</span>
                <span className="size-0.5 rounded-full bg-ink-3" />
                <span>{tt(...kindLabel[r.kind])}</span>
                <ChevronDown size={13} className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''} opacity-0 group-hover:opacity-100`} />
              </div>
              <div className={`mt-0.5 text-[14px] font-medium ${r.kind === 'end' ? 'text-ink-2' : 'text-ink'}`}><TextOrNeed text={t(r.title)} /></div>
              {r.unit && <div className="text-[12.5px] text-ink-2">{t(r.unit)}</div>}
              {r.note && <div className="text-[12px] text-ink-3 mt-0.5">{t(r.note)}</div>}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <RecordDetails r={r} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ol>
  )
}

function RecordDetails({ r }: { r: CareerRecord }) {
  const { t, tt } = useLang()
  return (
    <div className="mx-2 mb-3 rounded-lg bg-fill border border-line p-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[12.5px]">
      <span className="text-ink-3">{tt('Этап роста', 'Growth stage')}</span><span>{t(segTitle(r.segment).title)}</span>
      {r.kind !== 'end' && (<>
        <span className="text-ink-3 flex items-center gap-1"><MapPin size={12} />{tt('Город', 'City')}</span><span>{r.city ? t(r.city) : <Need />}</span>
        <span className="text-ink-3">{tt('Задачи', 'Scope')}</span><span><Need /></span>
        <span className="text-ink-3">{tt('Результаты', 'Results')}</span><span><Need /></span>
      </>)}
      {r.kind === 'end' && !r.date && (<><span className="text-ink-3">{tt('Дата', 'Date')}</span><span><Need /></span></>)}
    </div>
  )
}

/** Sberbank — the key chapter: a growth staircase across segments. */
function SberLadder({ e }: { e: Employer }) {
  const { t, tt } = useLang()
  const steps = e.records.filter((r) => r.kind !== 'end')
  const n = steps.length
  return (
    <div className="mt-7 rounded-2xl border border-line bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="eyebrow">{tt('Рост внутри Сбербанка', 'Growth inside Sberbank')}</h2>
        <span className="text-[11.5px] text-ink-3">{steps[0].date} → {steps[n - 1].date}</span>
      </div>
      <div className="mt-5 flex items-end gap-1.5 sm:gap-2 h-[150px]">
        {steps.map((r, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${28 + (i / (n - 1)) * 72}%`, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 200, damping: 24 }}
            className="relative flex-1 rounded-t-md group"
            style={{ background: `color-mix(in oklab, ${e.color} ${35 + (i / (n - 1)) * 65}%, transparent)` }}
            title={`${r.date} — ${t(r.title)}`}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-ink-3 whitespace-nowrap">{r.date?.slice(-4)}</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-48 rounded-lg bg-win-solid border border-line shadow-xl p-2.5 text-[11.5px] opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="font-mono text-ink-3">{r.date}</div>
              <div className="font-medium mt-0.5">{t(r.title)}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 grid text-[10.5px] text-ink-3 font-medium" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
        {steps.map((r, i) => {
          const prev = steps[i - 1]
          return <span key={i} className="truncate pr-1">{!prev || prev.segment !== r.segment ? t(segTitle(r.segment).short) : ''}</span>
        })}
      </div>
    </div>
  )
}
