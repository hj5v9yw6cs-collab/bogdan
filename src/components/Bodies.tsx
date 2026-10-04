import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Check } from 'lucide-react'
import type { Alert, Item } from '../data/desktop'
import { contacts, education, employerById, employers, childhood, profile, services, NEED, isNeed, type CareerRecord } from '../data/content'
import { useLang } from '../lib/i18n'
import { Thumb } from './Thumb'
import { Need, TextOrNeed } from './Need'
import { PhotoArt } from './PhotoArt'
import { AppIcon } from './icons'
import { ResumeDocument, PAGE_W, PAGE_H, RESUME_PDF } from './ResumeDocument'

function Disclosure({ label, children, open: initial = true }: { label: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial)
  return (
    <div className="px-[10px]">
      <button className="flex items-center gap-[4px] py-[4px] text-[13px] font-medium text-black" onClick={() => setOpen((o) => !o)}>
        <ChevronDown size={12} strokeWidth={2.4} className={`text-black/45 transition-transform ${open ? '' : '-rotate-90'}`} />
        {label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="pb-[8px]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RecordLine({ r }: { r: CareerRecord }) {
  const { t, tt } = useLang()
  return (
    <div className="grid grid-cols-[78px_1fr] gap-[8px] text-[13px] leading-[1.3]">
      <span className="text-black/50 tabular-nums">{r.date ?? <Need label={tt('дата', 'date')} />}</span>
      <span className={r.kind === 'end' ? 'text-black/45' : 'text-black'}>
        <TextOrNeed text={t(r.title)} />
        {r.unit && <span className="text-black/55"> · {t(r.unit)}</span>}
        {r.kind !== 'end' && <span className="text-black/55"> · {r.city ? t(r.city) : <Need label={tt('город', 'city')} />}</span>}
        {r.note && <span className="text-black/45"> — {t(r.note)}</span>}
      </span>
    </div>
  )
}

/** "Information about: …" window body. */
export function InfoBody({ item }: { item: Item }) {
  const { t, tt } = useLang()
  const e = item.records ? employerById[item.records.employer] : null
  return (
    <div className="pb-[10px] select-text">
      <div className="flex items-center gap-[10px] p-[10px]">
        <Thumb t={item.thumb} size={50} />
        <div className="min-w-0 text-[13px] leading-[18px]">
          <div className="font-semibold text-black truncate">{t(item.title)}</div>
          <div className="text-black/80 truncate">{t(item.subtitle)}</div>
        </div>
      </div>

      {item.text.length > 0 && (
        <div className="mx-[10px] mb-[6px] bg-white px-[5px] py-[4px] text-[13px] leading-[1.22] text-[#555] space-y-[2px]">
          {item.text.map((p, i) => (
            <p key={i}>{p ? t(p) : <span className="inline-flex items-center gap-2">{tt('Что делал и чего добился —', 'What I did and achieved —')} <Need /></span>}</p>
          ))}
        </div>
      )}

      {item.actions && item.actions.length > 0 && (
        <div className="px-[10px] pb-[6px] flex flex-wrap gap-[8px]">
          {item.actions.map((a) => (
            <a key={a.href} href={a.href} target={a.download ? undefined : '_blank'} rel="noreferrer" download={a.download || undefined} className="mac-btn">{t(a.label)}</a>
          ))}
        </div>
      )}

      {item.id !== 'gallery' && item.id !== 'bin' && <Disclosure label={tt('Подробности:', 'Details:')}>
        <div className="pl-[16px] space-y-[4px] text-[13px] text-black">
          <div>{tt('Тип', 'Type')}: {t(item.type)}</div>
          {item.rows?.map((r, i) => (
            <div key={i}><span className="text-black/60">{t(r.k)}:</span> {r.v == null || (typeof r.v === 'string' && isNeed(r.v)) ? <Need /> : typeof r.v === 'string' ? r.v : t(r.v)}</div>
          ))}
          {e && item.records && (
            <div className="pt-[4px] space-y-[3px]">
              {item.records.idx.map((i) => <RecordLine key={i} r={e.records[i]} />)}
            </div>
          )}
        </div>
      </Disclosure>}

      {(item.preview?.length || item.resumePreview) && (
        <Disclosure label={tt('Превью:', 'Preview:')}>
          <div className="space-y-[10px] pt-[4px]">
            {item.resumePreview && <ResumePreview />}
            {item.preview?.map((p, i) => (
              <figure key={i}>
                <PhotoArt src={p.src} palette={p.palette} position={p.pos ?? '50% 30%'} label={p.src ? undefined : p.caption ? t(p.caption) : undefined} big rounded="rounded-[10px]" hint={false} className="w-full aspect-[4/3]" />
                {p.caption && p.src && <figcaption className="mt-[6px] bg-white px-[5px] py-[3px] text-[13px] text-[#555]">{t(p.caption)}</figcaption>}
              </figure>
            ))}
          </div>
        </Disclosure>
      )}
    </div>
  )
}

function ResumePreview() {
  const [w, setW] = useState(0)
  const scale = w ? w / PAGE_W : 0
  return (
    <div ref={(el) => { if (el && el.clientWidth !== w) setW(el.clientWidth) }} className="w-full rounded-[10px] overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" style={{ height: scale ? PAGE_H * scale : 300 }}>
      {scale > 0 && <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: PAGE_W }}><ResumeDocument /></div>}
    </div>
  )
}

/** Dark "system alert" — the joke dialogs from the Dock. */
export function AlertBody({ a, onClose }: { a: Alert; onClose: () => void }) {
  const { t } = useLang()
  return (
    <div className="px-[14px] pt-[12px] pb-[12px]">
      <div className="flex gap-[14px] items-start">
        <div className="size-[40px] shrink-0 [&>svg]:size-full"><AppIcon kind={a.icon} size={40} /></div>
        <p className="text-[11.5px] leading-[1.35] text-white/90 pt-[4px]">{t(a.text)}</p>
      </div>
      <div className="flex justify-end mt-[12px]">
        <button className="h-[22px] px-[10px] rounded-[5px] bg-[#2a62d9] text-white text-[11.5px] hover:brightness-110 active:brightness-95" onClick={onClose}>{t(a.button)}</button>
      </div>
    </div>
  )
}

/** Notes-style CV window: sidebar sections + checklist content. */
export function CVBody() {
  const { t, tt, lang } = useLang()
  const [tab, setTab] = useState<'about' | 'cv' | 'interests'>('about')
  const allRecords = employers.flatMap((e) => e.records.filter((r) => r.date).map((r) => ({ e, r })))
  const toDate = (d: string) => { const [dd, mm, yy] = d.split('.').map(Number); return +new Date(yy, mm - 1, dd) }
  allRecords.sort((a, b) => toDate(b.r.date!) - toDate(a.r.date!))
  const interests = [
    l2('Финансы — Московский колледж бизнес-технологий, 2026', 'Finance — Moscow College of Business Technologies, 2026'),
    l2('Карьерное развитие и консультации', 'Career development and consulting'),
    ...childhood.map((c) => c.title),
    education.find((e) => e.id === 'journalism')!.title,
  ]
  const tabs: [typeof tab, string, string][] = [
    ['about', tt('Обо мне', 'About me'), String(services.length + 3)],
    ['cv', 'CV', String(allRecords.length)],
    ['interests', tt('Интересы', 'Interests'), '∞'],
  ]
  return (
    <div className="flex h-full min-h-[380px]">
      <aside className="w-[110px] shrink-0 px-[8px] pt-[10px]">
        {tabs.map(([id, label, n]) => (
          <button key={id} onClick={() => setTab(id)} className={`w-full flex justify-between items-center px-[8px] py-[6px] border-b border-black/10 text-[12.5px] text-left ${tab === id ? 'bg-black/[0.06] rounded-[4px]' : ''}`}>
            <span className="text-black">{label}</span><span className="text-black/45 text-[12px]">{n}</span>
          </button>
        ))}
      </aside>
      <div className="flex-1 min-w-0 bg-white px-[14px] py-[12px] text-[12.5px] leading-[1.3] text-black overflow-y-auto select-text" key={tab + lang}>
        {tab === 'about' && (
          <>
            <p>{t(profile.bio)}</p>
            <p className="mt-[10px]">{tt('Чем могу помочь…', 'I can help with…')}</p>
            <Checklist items={services.map((s) => `${t(s.title)} — ${s.price ?? NEED}`)} />
            <div className="mt-[12px] space-y-[2px]">
              <ContactLine label="Email" value={contacts.email} href={`mailto:${contacts.email}`} />
              <ContactLine label="Telegram" value={contacts.telegram && `@${contacts.telegram}`} href={`https://t.me/${contacts.telegram}`} />
              <ContactLine label="Instagram" value={contacts.instagram && `@${contacts.instagram}`} href={`https://instagram.com/${contacts.instagram}`} />
            </div>
          </>
        )}
        {tab === 'cv' && (
          <>
            <p>{t(profile.currentRole)} · {t(profile.currentCompany)}</p>
            <a href={RESUME_PDF} download className="mac-btn mt-[8px] inline-flex">{tt('Скачать CV (PDF)', 'Download CV (PDF)')}</a>
            <Checklist items={allRecords.map(({ e, r }) => `${r.date} — ${t(e.name)}: ${t(r.title)}${r.unit ? ` · ${t(r.unit)}` : ''}`)} />
          </>
        )}
        {tab === 'interests' && (
          <>
            <p>{tt('Чем живу помимо работы', 'Beyond work')}</p>
            <Checklist items={interests.map((x) => t(x))} />
            <div className="mt-[10px]"><Need label={tt('другие интересы', 'more interests')} /></div>
          </>
        )}
      </div>
    </div>
  )
}

const l2 = (ru: string, en: string) => ({ ru, en })

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-[8px] space-y-[5px]">
      {items.map((x, i) => (
        <li key={i} className="flex gap-[7px] items-start">
          <span className="mt-[1px] size-[13px] shrink-0 rounded-full bg-[#f4b630] grid place-items-center"><Check size={9} strokeWidth={3.4} className="text-white" /></span>
          <span><TextOrNeed text={x} /></span>
        </li>
      ))}
    </ul>
  )
}

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex gap-[8px]"><span className="w-[70px] text-black/50">{label}</span>{value ? <a className="text-[#0a5cd6] hover:underline" href={href} target="_blank" rel="noreferrer">{value}</a> : <Need />}</div>
  )
}
