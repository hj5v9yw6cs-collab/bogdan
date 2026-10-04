import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Download, Minus, Plus, Printer } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { Need } from '../components/Need'
import { PhotoArt } from '../components/PhotoArt'
import { useLang } from '../lib/i18n'
import { contacts, education, employers, employerPeriod, portraits, profile, isNeed } from '../data/content'
import { kindLabel } from './Company'

/** Path of the downloadable CV. Replace the file in /public to update it. */
export const RESUME_PDF = '/Bogdan_Starogorodtsev_Resume.pdf'
const PAGE_W = 794

export default function Resume() {
  const { mobile } = useWindow()
  const { tt } = useLang()
  const wrap = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setFit(Math.min(1, (el.clientWidth - (mobile ? 24 : 64)) / PAGE_W)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [mobile])
  const scale = fit * zoom

  return (
    <div className="flex flex-col h-full min-h-0">
      <Toolbar className="bg-bar border-b border-line">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold truncate">Bogdan_Starogorodtsev_Resume.pdf</div>
          <div className="text-[11px] text-ink-3">{tt('Страница 1 из 1', 'Page 1 of 1')}</div>
        </div>
        {!mobile && (
          <div className="flex items-center gap-0.5" data-no-drag>
            <button className="tb-btn" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} aria-label="Zoom out"><Minus size={15} /></button>
            <span className="w-10 text-center text-[11.5px] text-ink-2 tabular-nums">{Math.round(scale * 100)}%</span>
            <button className="tb-btn" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} aria-label="Zoom in"><Plus size={15} /></button>
            <button className="tb-btn" onClick={() => window.open(RESUME_PDF, '_blank')} aria-label="Print"><Printer size={15} /></button>
          </div>
        )}
        <a href={RESUME_PDF} download className="btn-primary h-8 px-3.5 text-[12px]" data-no-drag><Download size={14} />Download CV</a>
      </Toolbar>
      <div ref={wrap} className="scroll flex-1 min-h-0 bg-[#8e8e93]/25 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
          style={{ width: PAGE_W * scale, height: 1123 * scale }}
          className="mx-auto"
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }} className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]">
            <ResumeDocument />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/** The A4 page itself — also used to render the PDF (see ?print=resume). */
export function ResumeDocument() {
  const { t, tt } = useLang()
  const order = ['tbank', 'domilend', 'sber', 'early'] as const
  return (
    <article className="resume-page bg-white text-[#1d1d1f] selectable" style={{ width: PAGE_W, minHeight: 1123, padding: '56px 60px', fontSize: 11.5, lineHeight: 1.5 }}>
      <header className="flex items-start gap-6 pb-6 border-b border-black/10">
        <PhotoArt src={portraits.avatar.src} palette={portraits.avatar.palette} rounded="rounded-full" className="size-[84px] flex-none" position={portraits.avatar.position} hint={false} />
        <div className="flex-1">
          <h1 className="serif text-[40px] leading-none tracking-tight">{t(profile.name)}</h1>
          <div className="mt-2 text-[13px] font-medium">{t(profile.currentRole)}</div>
          <div className="text-[12px] text-black/55">{t(profile.currentCompany)} · {t(profile.city)}</div>
        </div>
        <div className="text-right text-[11px] text-black/60 space-y-0.5 pt-1">
          <div>{contacts.email || <Need label="email" />}</div>
          <div>{contacts.telegram ? `t.me/${contacts.telegram}` : <Need label="telegram" />}</div>
          <div>{contacts.site}</div>
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-black/45 mb-3">{tt('ОПЫТ РАБОТЫ', 'EXPERIENCE')}</h2>
        <div className="space-y-5">
          {order.map((id) => {
            const e = employers.find((x) => x.id === id)!
            const p = employerPeriod(e)
            return (
              <div key={id} className="grid grid-cols-[120px_1fr] gap-4">
                <div className="text-[11px] text-black/55 pt-0.5">
                  <div className="font-semibold text-black" style={{ color: id === 'sber' ? '#16803a' : undefined }}>{t(e.name)}</div>
                  {e.parent && <div>{t(e.parent)}</div>}
                  <div className="font-mono text-[10px] mt-0.5">{p.from ? <>{p.from.slice(3)} — {p.current ? tt('н.в.', 'now') : p.to ? p.to.slice(3) : <Need label={tt('дата', 'date')} />}</> : <Need label={tt('даты', 'dates')} />}</div>
                </div>
                <ul className="space-y-1">
                  {e.records.map((r, i) => (
                    <li key={i} className={`grid grid-cols-[70px_1fr] gap-3 ${r.kind === 'end' ? 'text-black/45' : ''}`}>
                      <span className="font-mono text-[10px] text-black/50 pt-[2px]">{r.date ?? '—'}</span>
                      <span>
                        {isNeed(r.title.ru) ? <Need /> : <b className="font-semibold">{t(r.title)}</b>}
                        {r.unit && <span className="text-black/60"> · {t(r.unit)}</span>}
                        {r.city && <span className="text-black/60"> · {t(r.city)}</span>}
                        {r.kind === 'transfer' && <span className="text-black/45"> — {r.note ? t(r.note).toLowerCase() : tt(...kindLabel[r.kind]).toLowerCase()}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-black/45 mb-3">{tt('ОБРАЗОВАНИЕ', 'EDUCATION')}</h2>
        <div className="space-y-1.5">
          {[...education].reverse().map((ed) => (
            <div key={ed.id} className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-mono text-[10px] text-black/50 pt-[2px]">{ed.period ?? '—'}</span>
              <span><b className="font-semibold">{t(ed.title)}</b> <span className="text-black/60">· {t(ed.place)}</span>{ed.status && <span className="text-black/45"> — {t(ed.status).toLowerCase()}</span>}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-[10px] font-semibold tracking-[0.18em] text-black/45 mb-2">{tt('НАВЫКИ', 'SKILLS')}</h2>
          <Need />
        </div>
        <div>
          <h2 className="text-[10px] font-semibold tracking-[0.18em] text-black/45 mb-2">{tt('ДОСТИЖЕНИЯ', 'ACHIEVEMENTS')}</h2>
          <Need />
        </div>
      </section>

      <footer className="mt-10 pt-4 border-t border-black/10 flex justify-between text-[10px] text-black/40">
        <span>{t(profile.hometown)} → {t(profile.city)}</span>
        <span>{contacts.site}</span>
      </footer>
    </article>
  )
}
