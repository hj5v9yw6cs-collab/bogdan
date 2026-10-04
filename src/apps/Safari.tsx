import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, RotateCw, Share } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { PhotoArt } from '../components/PhotoArt'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { contacts, employers, employerPeriod, portraits, profile, projectDocs, services } from '../data/content'

const sections = ['about', 'career', 'projects', 'consulting', 'contact'] as const
type Sec = (typeof sections)[number] | 'home'

export default function Safari() {
  const { t, tt } = useLang()
  const { mobile } = useWindow()
  const { open } = useWindows()
  const page = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState<Sec>('home')
  const [hist, setHist] = useState<{ stack: Sec[]; i: number }>({ stack: ['home'], i: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { const id = setTimeout(() => setLoading(false), 650); return () => clearTimeout(id) }, [])

  // Track the section in view to update the address bar.
  useEffect(() => {
    const root = page.current
    if (!root) return
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (vis) setCurrent(vis.target.getAttribute('data-sec') as Sec)
    }, { root, threshold: [0.35, 0.6] })
    root.querySelectorAll('[data-sec]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (s: Sec, push = true) => {
    const el = page.current?.querySelector(`[data-sec="${s}"]`) as HTMLElement | null
    page.current?.scrollTo({ top: s === 'home' ? 0 : (el?.offsetTop ?? 0) - 56, behavior: 'smooth' })
    if (push) setHist(({ stack, i }) => ({ stack: [...stack.slice(0, i + 1), s], i: i + 1 }))
  }
  const nav = (d: number) => {
    const i = hist.i + d
    if (i < 0 || i >= hist.stack.length) return
    setHist({ ...hist, i })
    scrollTo(hist.stack[i], false)
  }
  const reload = () => { setLoading(true); page.current?.scrollTo({ top: 0 }); setTimeout(() => setLoading(false), 650) }

  const label: Record<(typeof sections)[number], string> = {
    about: tt('Обо мне', 'About'), career: tt('Карьера', 'Career'), projects: tt('Проекты', 'Projects'), consulting: tt('Консультации', 'Consulting'), contact: tt('Контакты', 'Contact'),
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <Toolbar className="bg-bar border-b border-line gap-1.5">
        <button className="tb-btn" disabled={hist.i === 0} onClick={() => nav(-1)} aria-label="Back"><ChevronLeft size={18} /></button>
        {!mobile && <button className="tb-btn" disabled={hist.i === hist.stack.length - 1} onClick={() => nav(1)} aria-label="Forward"><ChevronRight size={18} /></button>}
        <div className="flex-1 flex justify-center min-w-0" data-no-drag>
          <div className="relative w-full max-w-[460px] h-8 rounded-lg bg-fill-2 flex items-center justify-center gap-1.5 px-8 text-[12.5px] overflow-hidden">
            <Lock size={11} className="text-ink-3 flex-none" />
            <span className="truncate"><span className="text-ink">{contacts.site}</span>{current !== 'home' && <span className="text-ink-3">/{current}</span>}</span>
            <button className="absolute right-2 tb-btn h-6 min-w-6" onClick={reload} aria-label="Reload"><RotateCw size={12} /></button>
            {loading && <motion.span className="absolute left-0 bottom-0 h-[2px] bg-accent" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.6, ease: 'easeOut' }} />}
          </div>
        </div>
        {!mobile && <button className="tb-btn" onClick={() => navigator.clipboard?.writeText(`https://${contacts.site}`)} aria-label="Share"><Share size={15} /></button>}
      </Toolbar>

      <div ref={page} className={`scroll flex-1 min-h-0 bg-[#fafaf8] text-[#111] transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {/* Site nav */}
        <nav className="sticky top-0 z-10 bg-[#fafaf8]/85 backdrop-blur-xl border-b border-black/5">
          <div className="max-w-[980px] mx-auto px-6 h-14 flex items-center gap-6">
            <button onClick={() => scrollTo('home')} className="serif text-[20px] italic">B.S.</button>
            <div className="flex gap-5 text-[12.5px] text-black/60 overflow-x-auto no-scrollbar">
              {sections.map((s) => (
                <button key={s} onClick={() => scrollTo(s)} className={`whitespace-nowrap hover:text-black transition-colors ${current === s ? 'text-black font-medium' : ''}`}>{label[s]}</button>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section data-sec="home" className="max-w-[980px] mx-auto px-6 pt-14 pb-16 grid sm:grid-cols-[1.2fr_0.8fr] gap-10 items-end">
          <div>
            <div className="text-[11px] tracking-[0.22em] font-semibold text-black/45">PERSONAL WEBSITE</div>
            <h1 className="serif text-[56px] sm:text-[84px] leading-[0.88] mt-4 tracking-tight">Bogdan<br />Starogorodtsev</h1>
            <p className="serif italic text-[24px] text-black/60 mt-5">{t(profile.tagline)}</p>
            <div className="mt-7 flex flex-wrap gap-2 text-[12px]">
              {employers.filter((e) => e.id !== 'early').map((e) => (
                <span key={e.id} className="px-3 py-1 rounded-full border border-black/10 bg-white">{t(e.name)}</span>
              ))}
            </div>
          </div>
          <PhotoArt src={portraits.hero.src} palette={portraits.hero.palette} rounded="rounded-[22px]" className="aspect-[4/5] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]" position="50% 20%" />
        </section>

        <Section id="about" n="01" title={label.about}>
          <p className="text-[18px] leading-relaxed max-w-[680px]">{t(profile.bio)}</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-px bg-black/10 rounded-2xl overflow-hidden text-[13px]">
            {[[tt('Сейчас', 'Now'), t(profile.currentCompany)], [tt('Город', 'City'), t(profile.city)], [tt('Родом из', 'From'), t(profile.hometown)]].map(([k, v]) => (
              <div key={k} className="bg-white p-4"><div className="text-black/45 text-[11px]">{k}</div><div className="mt-1 font-medium">{v}</div></div>
            ))}
          </div>
        </Section>

        <Section id="career" n="02" title={label.career}>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {employers.map((e) => {
              const p = employerPeriod(e)
              return (
                <button key={e.id} onClick={() => open('company', { company: e.id }, `company:${e.id}`)} className="group w-full grid grid-cols-[70px_1fr_auto] sm:grid-cols-[110px_1fr_auto] items-center gap-4 py-5 text-left">
                  <span className="font-mono text-[12px] text-black/45">{p.from?.slice(-4) ?? '—'}{p.current ? ' —' : ''}</span>
                  <span>
                    <span className="serif text-[28px] sm:text-[34px] leading-none group-hover:italic transition-all" style={{ color: e.id === 'sber' ? '#16803a' : undefined }}>{t(e.name)}</span>
                    <span className="block text-[12.5px] text-black/55 mt-1">{e.parent ? t(e.parent) + ' · ' : ''}{e.records.filter((r) => r.kind !== 'end').length} {tt('записей', 'records')}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-black/30 group-hover:text-black group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </button>
              )
            })}
          </div>
          <button className="mt-5 text-[13px] underline underline-offset-4" onClick={() => open('timeline')}>{tt('Открыть Career Timeline →', 'Open Career Timeline →')}</button>
        </Section>

        <Section id="projects" n="03" title={label.projects}>
          <div className="grid sm:grid-cols-3 gap-3">
            {projectDocs.map((d) => (
              <button key={d.id} onClick={() => open('doc', { doc: d.id }, `doc:${d.id}`)} className="text-left rounded-2xl bg-white border border-black/10 p-5 hover:shadow-lg transition-shadow">
                <div className="text-[11px] text-black/45">{d.subtitle ? t(d.subtitle) : ''}</div>
                <div className="serif text-[24px] mt-2 leading-tight">{t(d.title)}</div>
                <p className="text-[12.5px] text-black/60 mt-2 line-clamp-3">{t(d.body[0])}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section id="consulting" n="04" title={label.consulting}>
          <div className="rounded-3xl bg-[#111] text-white p-7 sm:p-10">
            <div className="serif text-[34px] sm:text-[44px] leading-[0.95] max-w-[520px]">{tt('Карьерные консультации', 'Career consulting')}</div>
            <div className="mt-6 flex flex-wrap gap-2">
              {services.map((s) => <span key={s.id} className="px-3 py-1.5 rounded-full border border-white/20 text-[12.5px]">{t(s.title)}</span>)}
            </div>
            <button className="mt-8 h-10 px-5 rounded-full bg-[#f5d58a] text-black font-semibold text-[13px]" onClick={() => open('consulting', { book: '1' })}>Book a consultation</button>
          </div>
        </Section>

        <Section id="contact" n="05" title={label.contact}>
          <div className="grid sm:grid-cols-2 gap-6 items-end">
            <div className="serif text-[40px] sm:text-[56px] leading-[0.9]">Let’s talk.</div>
            <div className="text-[14px] space-y-2">
              <div className="flex justify-between border-b border-black/10 pb-2"><span className="text-black/45">Email</span>{contacts.email || <Need />}</div>
              <div className="flex justify-between border-b border-black/10 pb-2"><span className="text-black/45">Telegram</span>{contacts.telegram ? `@${contacts.telegram}` : <Need />}</div>
              <div className="flex justify-between border-b border-black/10 pb-2"><span className="text-black/45">Instagram</span>{contacts.instagram ? `@${contacts.instagram}` : <Need />}</div>
              <button className="mt-3 h-10 px-5 rounded-full bg-black text-white font-medium text-[13px]" onClick={() => open('contact')}>{tt('Написать', 'Write to me')}</button>
            </div>
          </div>
        </Section>

        <footer className="max-w-[980px] mx-auto px-6 py-10 text-[11.5px] text-black/40 flex justify-between">
          <span>© {new Date().getFullYear()} {t(profile.name)}</span>
          <span>{contacts.site}</span>
        </footer>
      </div>
    </div>
  )
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-sec={id} className="max-w-[980px] mx-auto px-6 py-14 border-t border-black/10">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="font-mono text-[11px] text-black/40">{n}</span>
        <h2 className="text-[11px] tracking-[0.22em] font-semibold uppercase">{title}</h2>
      </div>
      {children}
    </section>
  )
}
