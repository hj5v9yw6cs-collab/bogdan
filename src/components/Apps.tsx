import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, Lock } from 'lucide-react'
import { certificates, employerById, life, motto, nonprofit, profile, publications, stages, story } from '../data/content'
import { fmtDate, folders, itemById, type Item } from '../data/desktop'
import { useWindows } from '../store/windows'
import { useLang } from '../lib/i18n'
import { Thumb } from './Thumb'
import { Need } from './Need'
import { PhotoArt } from './PhotoArt'

/** Opens an item the same way a desktop icon does. */
export function useOpenItem() {
  const { open } = useWindows()
  return (it: Item) => (it.open ? open(it.open.app, it.open.params, it.open.key) : open('info', { item: it.id }, `info:${it.id}`))
}

/* ───────── Finder-like folder ───────── */

export function FolderBody({ id }: { id: string }) {
  const { t, tt } = useLang()
  const openItem = useOpenItem()
  const f = folders[id]
  const [sel, setSel] = useState<string | null>(null)
  const kids = f.children.map((c) => itemById[c]).filter(Boolean)
  return (
    <div className="bg-white min-h-[220px] m-[10px] mt-[8px] rounded-[4px]">
      {f.intro && <p className="px-[14px] pt-[12px] text-[13px] leading-[1.35] text-[#555] select-text">{t(f.intro)}</p>}
      <div className="grid gap-x-[6px] gap-y-[14px] p-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
        {kids.map((it) => (
          <button
            key={it.id}
            className="flex flex-col items-center gap-[4px] outline-none"
            onClick={() => setSel(it.id)}
            onDoubleClick={() => openItem(it)}
            onKeyDown={(e) => e.key === 'Enter' && openItem(it)}
          >
            <div className={`p-[4px] rounded-[4px] ${sel === it.id ? 'bg-black/10' : ''}`}><Thumb t={it.thumb} size={56} /></div>
            <span className={`text-[12px] leading-[14px] text-center px-[4px] rounded-[3px] line-clamp-2 ${sel === it.id ? 'bg-[#0a5cd6] text-white' : 'text-black'}`}>{t(it.label)}</span>
          </button>
        ))}
      </div>
      {f.empty && (
        <div className="px-[14px] pb-[16px] text-[12.5px] text-black/55 flex flex-wrap items-center gap-[8px]">
          {kids.length === 0 || id === 'projects' ? <>{t(f.empty)} <Need /></> : null}
        </div>
      )}
      <div className="px-[14px] pb-[10px] text-[11px] text-black/40">{tt('Двойной клик — открыть', 'Double-click to open')} · {kids.length} {tt('объектов', 'items')}</div>
    </div>
  )
}

/* ───────── Notes.app ───────── */

type NoteId = 'story' | 'interests' | 'now'

export function NotesBody({ initial, mobile }: { initial?: string; mobile: boolean }) {
  const { t, tt } = useLang()
  const notes: { id: NoteId; title: string; preview: string }[] = [
    { id: 'story', title: t(story.title), preview: t(motto) },
    { id: 'interests', title: tt('Что мне интересно', 'What I’m into'), preview: life.interests.slice(0, 4).map((x) => t(x.title)).join(', ') },
    { id: 'now', title: tt('Сейчас мне интересно', 'Curious about right now'), preview: t(life.curiousNow[0]) },
  ]
  const valid = notes.some((n) => n.id === initial) ? (initial as NoteId) : null
  const [sel, setSel] = useState<NoteId | null>(valid ?? (mobile ? null : 'story'))
  const list = (
    <aside className={`${mobile ? 'w-full' : 'w-[190px] border-r border-black/10'} shrink-0 py-[8px] px-[8px]`}>
      {notes.map((n) => (
        <button key={n.id} onClick={() => setSel(n.id)} className={`w-full text-left rounded-[6px] px-[10px] py-[7px] ${sel === n.id && !mobile ? 'bg-[#ffd60a]/45' : 'hover:bg-black/[0.04]'}`}>
          <div className="text-[12.5px] font-semibold truncate">{n.title}</div>
          <div className="text-[11.5px] text-black/50 truncate">{n.preview}</div>
        </button>
      ))}
    </aside>
  )
  const page = sel && (
    <div className="flex-1 min-w-0 bg-white px-[18px] py-[14px] text-[13px] leading-[1.45] select-text">
      {mobile && <button className="text-[12.5px] text-[#d4a400] mb-[8px] flex items-center" onClick={() => setSel(null)}><ChevronLeft size={14} />{tt('Заметки', 'Notes')}</button>}
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
          <NotePage id={sel} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
  if (mobile) return <div className="flex min-h-[380px] bg-[#f7f6f2]">{sel ? page : list}</div>
  return <div className="flex min-h-[400px] h-full bg-[#f7f6f2]">{list}{page}</div>
}

function NotePage({ id }: { id: NoteId }) {
  const { t, tt } = useLang()
  const h = (x: string) => <h2 className="text-[20px] font-bold mb-[8px]">{x}</h2>
  switch (id) {
    case 'story':
      return (
        <>
          <div className="text-[34px] leading-[1.05] font-black tracking-[-0.02em] mb-[12px]">{t(motto)}</div>
          <p>{t(profile.bio)}</p>
          <p className="mt-[6px]">{t(life.character)}</p>
          <div className="h-px bg-black/10 my-[14px]" />
          {h(t(story.title))}
          <p className="text-[12px] text-black/50 mb-[10px]">{t(story.path)}</p>
          {story.paragraphs.map((p, i) => <p key={i} className={`mt-[6px] ${i === story.paragraphs.length - 1 ? 'font-semibold' : ''}`}>{t(p)}</p>)}
        </>
      )
    case 'interests':
      return (
        <>
          {h(tt('Что мне интересно', 'What I’m into'))}
          <p>{t(life.interestsIntro)}</p>
          <dl className="mt-[10px] space-y-[8px]">
            {life.interests.map((x) => (
              <div key={x.title.ru}>
                <dt className="font-semibold">{t(x.title)}</dt>
                <dd className="text-black/70">{t(x.text)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-[14px] text-black/55">{t(life.childhood)}</p>
        </>
      )
    case 'now':
      return (
        <>
          {h(tt('Сейчас мне интересно', 'Curious about right now'))}
          <p className="text-[18px] font-semibold leading-[1.3]">{t(life.curiousNow[0])}</p>
          <p className="mt-[8px]">{t(life.curiousNow[1])}</p>
        </>
      )
  }
}

/* ───────── Preview.app: certificate ───────── */

export function CertBody({ id }: { id: string }) {
  const { t, tt } = useLang()
  const c = certificates.find((x) => x.id === id)!
  const [page, setPage] = useState(0)
  const n = c.pages.length
  const isPdf = /\.pdf$/i.test(c.file)
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[6px] px-[10px] py-[6px] text-[12px] text-black/70">
        <span className="truncate flex-1">{c.file.split('/').pop()}</span>
        {n > 1 && (
          <>
            <button className="p-[3px] rounded hover:bg-black/10 disabled:opacity-30" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
            <span className="tabular-nums">{page + 1} / {n}</span>
            <button className="p-[3px] rounded hover:bg-black/10 disabled:opacity-30" disabled={page === n - 1} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
          </>
        )}
        <a href={c.file} download className="mac-btn ml-[6px]"><Download size={12} className="mr-[4px]" />{tt('Оригинал', 'Original')}</a>
      </div>
      <div className="flex-1 min-h-[300px] bg-[#7d7d80]/30 grid place-items-center p-[12px]">
        {n > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img key={page} src={c.pages[page]} alt={t(c.title)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-h-[440px] max-w-full object-contain bg-white shadow-[0_6px_24px_rgba(0,0,0,0.3)]" />
          </AnimatePresence>
        ) : isPdf ? (
          <iframe src={c.file} title={t(c.title)} className="w-full h-[440px] bg-white" />
        ) : (
          <img src={c.file} alt={t(c.title)} className="max-h-[440px] max-w-full object-contain bg-white shadow-[0_6px_24px_rgba(0,0,0,0.3)]" />
        )}
      </div>
      <div className="p-[10px] text-[13px] space-y-[3px] select-text">
        <div className="font-semibold">{t(c.title)}</div>
        <div className="text-black/70">{t(c.organization)} · {c.date ?? <Need label={tt('дата', 'date')} />}</div>
        <div className="text-[#555]">{c.description ? t(c.description) : <Need label={tt('описание', 'description')} />}</div>
      </div>
    </div>
  )
}

/* ───────── Safari: publication ───────── */

export function PressBody({ id }: { id: string }) {
  const { t, tt } = useLang()
  const p = publications.find((x) => x.id === id)!
  return (
    <div className="pb-[12px]">
      <div className="mx-[10px] mt-[8px] mb-[10px] h-[26px] rounded-[7px] bg-black/[0.07] flex items-center justify-center gap-[5px] text-[12px] text-black/70 px-[10px]">
        <Lock size={10} className="shrink-0" /><span className="truncate">{p.url.replace(/^https?:\/\//, '')}</span>
      </div>
      <div className="mx-[10px] rounded-[10px] overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
        {p.image && <PhotoArt src={p.image} palette={['#e9e9f2', '#3346a3', '#111111']} rounded="" hint={false} className="w-full aspect-[1200/630]" />}
        <div className="p-[14px] select-text">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-black/50">{p.source} · {fmtDate(p.date)}</div>
          <h3 className="text-[19px] leading-[1.2] font-bold mt-[6px]">{t(p.title)}</h3>
          <p className="text-[13px] text-[#555] mt-[8px]">{t(p.description)}</p>
          <a href={p.url} target="_blank" rel="noreferrer" className="mac-btn mt-[12px] h-[28px] px-[14px] text-[13px]">{tt('Read article', 'Read article')} <ArrowUpRight size={14} className="ml-[4px]" /></a>
        </div>
      </div>
    </div>
  )
}

/* ───────── Career Timeline ───────── */

const groupOf = (employer: string) =>
  employer === 'sber' ? 'СБЕР' : employer === 'tbank' ? 'Т-БАНК' : 'ДОМИЛЕНД · ЯНДЕКС'

export function TimelineBody() {
  const { t, tt } = useLang()
  const openItem = useOpenItem()
  const firstNp = stages.findIndex((s) => s.id === 'tbank-mid')
  const span = stages.length - firstNp
  return (
    <div className="bg-white m-[10px] mt-[8px] rounded-[4px] p-[14px] select-text">
      <div className="text-[11px] font-semibold tracking-[0.14em] text-black/45">{tt('КАРЬЕРНЫЙ ПУТЬ', 'CAREER PATH')}</div>
      <div className="grid grid-cols-[1fr_150px] sm:grid-cols-[1fr_190px] gap-x-[12px] mt-[10px]">
        {stages.map((s, i) => {
          const e = employerById[s.employer]
          const newGroup = i === 0 || groupOf(stages[i - 1].employer) !== groupOf(s.employer) || stages[i - 1].employer !== s.employer
          return (
            <div key={s.id} className="col-start-1 relative pl-[18px]" style={{ gridRow: i + 1 }}>
              <span className="absolute left-[4px] top-0 bottom-0 w-px bg-black/15" />
              <span className="absolute left-0 top-[18px] size-[9px] rounded-full" style={{ background: e.color === '#FFDD2D' ? '#e0b800' : e.color }} />
              {newGroup && <div className="text-[10.5px] font-bold tracking-[0.12em] text-black/45 pt-[8px]">{groupOf(s.employer)}</div>}
              <button className="w-full text-left rounded-[5px] px-[6px] py-[5px] -ml-[6px] hover:bg-black/[0.05]" onClick={() => openItem(itemById[s.id])}>
                <span className="text-[11.5px] text-black/45 tabular-nums mr-[8px]">{s.year}</span>
                <span className="text-[13px] font-medium">{t(s.label)}</span>
                {s.current && <span className="ml-[6px] text-[10.5px] px-[5px] rounded bg-emerald-500/15 text-emerald-700">{tt('сейчас', 'now')}</span>}
              </button>
            </div>
          )
        })}
        <button
          className="col-start-2 self-stretch rounded-[8px] border border-dashed border-[#c8641c]/60 bg-[#fff3d6]/60 p-[10px] text-left hover:bg-[#fff3d6]"
          style={{ gridRow: `${firstNp + 1} / span ${span}` }}
          onClick={() => openItem(itemById.nonprofit)}
        >
          <div className="text-[10px] font-bold tracking-[0.12em] text-[#c8641c]">{t(nonprofit.badge)}</div>
          <div className="text-[11.5px] text-black/50 mt-[4px] tabular-nums">{nonprofit.period}</div>
          <div className="text-[13px] font-semibold mt-[2px]">{t(nonprofit.short)}</div>
          <div className="text-[12.5px] text-black/70">{t(nonprofit.role)}</div>
          <div className="text-[11px] text-black/45 mt-[6px]">{tt('Параллельно основной карьере', 'In parallel with the main career')}</div>
        </button>
      </div>
    </div>
  )
}

