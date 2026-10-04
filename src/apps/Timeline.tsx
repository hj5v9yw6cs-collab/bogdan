import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ArrowRight, MapPin, X } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { cities, employerById, growthArc, segments, stages, type Stage } from '../data/content'
import { RecordList, segTitle } from './Company'

type Tab = 'career' | 'growth' | 'cities'

export default function Timeline() {
  const { win, mobile } = useWindow()
  const { tt } = useLang()
  const [tab, setTab] = useState<Tab>('career')

  useEffect(() => { if (win.params.stage) setTab('career') }, [win.nonce, win.params.stage])

  const tabs: [Tab, string][] = [['career', tt('Карьера', 'Career')], ['growth', tt('Рост', 'Growth')], ['cities', tt('Города', 'Cities')]]
  return (
    <div className="flex flex-col h-full min-h-0 bg-win-solid">
      <Toolbar className="justify-center">
        <div className={`${mobile ? 'ml-auto' : 'mx-auto'} flex rounded-lg bg-fill p-0.5 border border-line`} data-no-drag>
          <LayoutGroup id={`tl-${win.id}`}>
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className="relative h-7 px-3.5 text-[12.5px] font-medium rounded-md">
                {tab === id && <motion.span layoutId="pill" className="absolute inset-0 rounded-md bg-win-solid shadow-sm border border-line" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <span className={`relative ${tab === id ? 'text-ink' : 'text-ink-2'}`}>{label}</span>
              </button>
            ))}
          </LayoutGroup>
        </div>
      </Toolbar>
      <div className="flex-1 min-h-0 border-t border-line relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} className="absolute inset-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {tab === 'career' && <CareerTab initial={win.params.stage} />}
            {tab === 'growth' && <GrowthTab />}
            {tab === 'cities' && <CitiesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function CareerTab({ initial }: { initial?: string }) {
  const { t, tt } = useLang()
  const { mobile } = useWindow()
  const { open } = useWindows()
  const firstId = initial ? stages.find((s) => s.id === initial || s.employer === initial)?.id : undefined
  const [sel, setSel] = useState<string | null>(firstId ?? (mobile ? null : 'sber-sales'))
  const stage = stages.find((s) => s.id === sel) ?? null

  return (
    <div className="flex h-full min-h-0">
      <div className="scroll flex-1 min-w-0 px-6 sm:px-8 py-7">
        <div className="eyebrow">Career</div>
        <h1 className="serif text-[34px] sm:text-[40px] leading-none mt-2">{tt('Карьерная история', 'Career story')}</h1>
        <p className="text-ink-2 text-[13px] mt-2 max-w-md">{tt('Не смена работодателей, а последовательный рост: от розницы до среднего и крупного бизнеса. Нажмите на этап, чтобы открыть детали.', 'Not just changing employers — a consistent progression from retail to mid & large business. Click a stage for details.')}</p>
        <ol className="mt-7 relative">
          {stages.map((s, i) => {
            const e = employerById[s.employer]
            const active = sel === s.id
            const isSber = s.employer === 'sber'
            return (
              <motion.li key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <button
                  onClick={() => setSel(active ? null : s.id)}
                  className={`group w-full grid grid-cols-[64px_18px_1fr] sm:grid-cols-[84px_22px_1fr] items-stretch text-left rounded-xl transition-colors ${active ? 'bg-fill-2' : 'hover:bg-hover'}`}
                >
                  <span className="serif text-[22px] sm:text-[26px] leading-none pt-3.5 pl-3 text-ink-2 group-hover:text-ink tabular-nums">{s.year}</span>
                  <span className="relative flex justify-center">
                    <span className={`absolute w-px bg-line ${i === 0 ? 'top-5' : 'top-0'} ${i === stages.length - 1 ? 'h-5' : 'bottom-0'}`} />
                    <span className="relative mt-[18px] size-3 rounded-full ring-4 ring-win-solid" style={{ background: e.color }} />
                  </span>
                  <span className="py-3 pr-3 min-w-0">
                    <span className={`block text-[11px] font-semibold tracking-[0.16em] ${isSber ? '' : 'text-ink-3'}`} style={isSber ? { color: e.color } : undefined}>
                      {t(e.name).toUpperCase()}{e.parent ? <span className="text-ink-3 font-medium tracking-normal"> · {t(e.parent)}</span> : null}
                    </span>
                    <span className="block text-[15px] font-medium mt-0.5">{t(s.label)}</span>
                    <span className="flex items-center gap-2 mt-1">
                      {t(segTitle(s.segment).title) !== t(s.label) && <span className="text-[11px] px-1.5 py-px rounded bg-fill border border-line text-ink-2">{t(segTitle(s.segment).title)}</span>}
                      {s.current && <span className="text-[11px] px-1.5 py-px rounded bg-emerald-500/15 text-emerald-600">{tt('сейчас', 'now')}</span>}
                    </span>
                  </span>
                </button>
                {mobile && (
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                        <div className="py-3"><StageDetails s={s} onOpen={() => open('company', { company: s.employer }, `company:${s.employer}`)} /></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.li>
            )
          })}
        </ol>
      </div>

      {!mobile && (
        <AnimatePresence>
          {stage && (
            <motion.aside
              key="panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="flex-none border-l border-line overflow-hidden bg-side"
            >
              <div className="scroll h-full w-[340px] p-5">
                <AnimatePresence mode="wait">
                  <motion.div key={stage.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.16 }}>
                    <div className="flex justify-end -mb-2"><button className="tb-btn" onClick={() => setSel(null)} aria-label="Close"><X size={15} /></button></div>
                    <StageDetails s={stage} onOpen={() => open('company', { company: stage.employer }, `company:${stage.employer}`)} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function StageDetails({ s, onOpen }: { s: Stage; onOpen: () => void }) {
  const { t, tt } = useLang()
  const e = employerById[s.employer]
  return (
    <div>
      <div className="rounded-xl p-4 text-white grain relative overflow-hidden" style={{ background: e.gradient }}>
        <div className="relative z-10">
          <div className="text-[10.5px] font-semibold tracking-[0.16em] text-white/70">{s.year}</div>
          <div className="serif text-[28px] leading-none mt-1">{t(e.name)}</div>
          <div className="text-[12.5px] text-white/85 mt-1.5">{t(s.label)}</div>
        </div>
      </div>
      <div className="mt-4">
        <RecordList e={e} only={s.records} />
      </div>
      <button className="btn-ghost w-full mt-3 h-9" onClick={onOpen}>{tt('Открыть папку компании', 'Open company folder')} <ArrowRight size={14} /></button>
    </div>
  )
}

function GrowthTab() {
  const { t, tt } = useLang()
  const { open } = useWindows()
  const steps = growthArc.map((id) => {
    const seg = segments.find((s) => s.id === id)!
    const st = stages.filter((s) => s.segment === id)
    return { seg, st }
  })
  return (
    <div className="scroll h-full px-6 sm:px-8 py-7">
      <div className="eyebrow">Growth</div>
      <h1 className="serif text-[34px] sm:text-[40px] leading-none mt-2">{tt('Траектория роста', 'Growth trajectory')}</h1>
      <p className="text-ink-2 text-[13px] mt-2 max-w-lg">{tt('От клиентского сервиса и продаж — к премиальному сегменту, корпоративным и ключевым клиентам, среднему и крупному бизнесу и развитию бизнеса.', 'From client service and sales — to the premium segment, corporate and key clients, mid & large business and business development.')}</p>

      <div className="mt-8 flex items-end gap-2 sm:gap-3 min-h-[300px]">
        {steps.map(({ seg, st }, i) => (
          <motion.div
            key={seg.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 26 }}
            className="flex-1 min-w-0 flex flex-col"
          >
            <div className="text-[11px] sm:text-[12px] font-semibold leading-tight mb-2 min-h-[30px]">{t(seg.title)}</div>
            <div className="rounded-t-xl border border-b-0 border-line bg-gradient-to-b from-fill-2 to-fill p-2 flex flex-col gap-1.5" style={{ height: 80 + i * 40 }}>
              {st.map((s) => {
                const e = employerById[s.employer]
                return (
                  <button key={s.id} onClick={() => open('company', { company: e.id }, `company:${e.id}`)} className="text-left rounded-md bg-win-solid/80 border border-line px-2 py-1 hover:scale-[1.03] transition-transform">
                    <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full flex-none" style={{ background: e.color }} /><span className="text-[10.5px] font-semibold truncate">{t(e.name)}</span></div>
                    <div className="text-[10px] text-ink-3 font-mono">{s.year}</div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="h-px bg-line" />
      <div className="flex justify-between text-[10.5px] text-ink-3 mt-2"><span>2021</span><span>2026</span></div>
    </div>
  )
}

function CitiesTab() {
  const { t, tt } = useLang()
  const [sel, setSel] = useState('zel')
  const c = cities.find((x) => x.id === sel)!
  return (
    <div className="scroll h-full px-6 sm:px-8 py-7">
      <div className="eyebrow">Route</div>
      <h1 className="serif text-[34px] sm:text-[40px] leading-none mt-2">{tt('Пять городов', 'Five cities')}</h1>
      <p className="text-ink-2 text-[13px] mt-2">{tt('Из Зеленодольска в Москву.', 'From Zelenodolsk to Moscow.')}</p>

      <div className="relative mt-10">
        <svg className="absolute left-0 right-0 top-[11px] w-full h-[2px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 2">
          <motion.line x1="0" y1="1" x2="100" y2="1" stroke="var(--c-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
        </svg>
        <div className="relative flex justify-between">
          {cities.map((x, i) => (
            <motion.button key={x.id} onClick={() => setSel(x.id)} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.18, type: 'spring', stiffness: 400, damping: 22 }} className="flex flex-col items-center gap-2 w-14 sm:w-24">
              <span className={`size-6 rounded-full grid place-items-center transition-all ${sel === x.id ? 'bg-accent scale-110 shadow-[0_0_0_6px_var(--c-sel)]' : 'bg-win-solid border-2 border-accent'}`}>
                {sel === x.id && <MapPin size={12} className="text-white" />}
              </span>
              <span className={`text-[11px] sm:text-[12.5px] text-center leading-tight ${sel === x.id ? 'font-semibold text-ink' : 'text-ink-2'}`}>{t(x.name)}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-10 rounded-2xl border border-line bg-fill p-6 max-w-xl">
          <div className="eyebrow">{String(cities.indexOf(c) + 1).padStart(2, '0')} / 05</div>
          <div className="serif text-[34px] leading-none mt-2">{t(c.name)}</div>
          <div className="text-[12px] text-ink-3 mt-2">{tt('Годы', 'Years')}: {c.years ?? <Need />}</div>
          <p className="text-[14px] text-ink-2 mt-3 leading-relaxed">{c.note ? t(c.note) : <Need />}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
