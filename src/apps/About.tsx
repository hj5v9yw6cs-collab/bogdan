import { motion } from 'motion/react'
import { ArrowUpRight, FileText, Route, Send } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { PhotoArt } from '../components/PhotoArt'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { ageFrom, childhood, cities, portraits, profile } from '../data/content'

const fade = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 + i * 0.06, type: 'spring' as const, stiffness: 300, damping: 30 } })

export default function About() {
  const { t, tt, lang } = useLang()
  const { open } = useWindows()
  const { mobile } = useWindow()
  const birth = new Date(profile.birthDate).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-win-solid">
      <div className="absolute inset-x-0 top-0 z-10"><Toolbar /></div>
      <div className="scroll flex-1 min-h-0">
        <div className={`grid ${mobile ? '' : 'grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'} min-h-full`}>
          <motion.div initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} className={`relative ${mobile ? 'h-[420px]' : 'min-h-full'}`}>
            <PhotoArt src={portraits.hero.src} palette={portraits.hero.palette} rounded="" className="absolute inset-0" position={portraits.hero.position} label={mobile ? undefined : 'B.S.'} big />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute left-5 bottom-5 text-white">
              <div className="text-[10.5px] tracking-[0.2em] font-semibold opacity-75">{tt('ЗЕЛЕНОДОЛЬСК → МОСКВА', 'ZELENODOLSK → MOSCOW')}</div>
            </div>
          </motion.div>

          <div className="px-7 sm:px-10 pt-16 pb-10">
            <motion.div {...fade(0)} className="eyebrow">About Me</motion.div>
            <motion.h1 {...fade(1)} className="serif text-[46px] sm:text-[56px] leading-[0.92] mt-3">{t(profile.name)}</motion.h1>
            <motion.p {...fade(2)} className="serif italic text-[22px] text-ink-2 mt-3">{t(profile.tagline)}</motion.p>

            <motion.dl {...fade(3)} className="mt-7 grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-line bg-line text-[12.5px]">
              {[
                [tt('Сейчас', 'Now'), <>{t(profile.currentRole)}<div className="text-ink-3">{t(profile.currentCompany)}</div></>],
                [tt('Город', 'City'), t(profile.city)],
                [tt('Родной город', 'Hometown'), t(profile.hometown)],
                [tt('Дата рождения', 'Born'), <>{birth} <span className="text-ink-3">· {ageFrom(profile.birthDate)} {tt('лет', 'y.o.')}</span></>],
              ].map(([k, v], i) => (
                <div key={i} className="bg-win-solid p-3.5">
                  <dt className="text-[11px] text-ink-3">{k}</dt>
                  <dd className="mt-1 font-medium leading-snug">{v}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.p {...fade(4)} className="mt-6 text-[14px] leading-relaxed text-ink-2 selectable">{t(profile.bio)}</motion.p>
            {profile.longBio ? <motion.p {...fade(5)} className="mt-3 text-[14px] leading-relaxed text-ink-2">{t(profile.longBio)}</motion.p> : <div className="mt-3"><Need label={tt('развёрнутое «о себе»', 'long bio')} /></div>}

            <motion.div {...fade(5)} className="mt-7">
              <div className="eyebrow mb-2.5">{tt('Маршрут', 'Route')}</div>
              <div className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
                {cities.map((c, i) => (
                  <span key={c.id} className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-fill border border-line">{t(c.name)}</span>
                    {i < cities.length - 1 && <span className="text-ink-3">→</span>}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div {...fade(6)} className="mt-6">
              <div className="eyebrow mb-2.5">{tt('Детство', 'Childhood')}</div>
              <div className="flex flex-wrap gap-1.5 text-[12.5px]">
                {childhood.map((c) => <span key={c.id} className="px-2.5 py-1 rounded-full bg-fill border border-line">{t(c.title)}</span>)}
              </div>
            </motion.div>

            <motion.div {...fade(7)} className="mt-6">
              <div className="eyebrow mb-2.5">{tt('Ценности', 'Values')}</div>
              {profile.values.length ? <ul className="text-[13px] space-y-1">{profile.values.map((v, i) => <li key={i}>— {t(v)}</li>)}</ul> : <Need />}
            </motion.div>

            <motion.div {...fade(8)} className="mt-8 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => open('timeline')}><Route size={15} />{tt('Карьерный путь', 'Career path')}</button>
              <button className="btn-ghost" onClick={() => open('resume')}><FileText size={15} />{tt('Резюме', 'Resume')}</button>
              <button className="btn-ghost" onClick={() => open('contact')}><Send size={14} />{tt('Связаться', 'Contact')}<ArrowUpRight size={13} /></button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
