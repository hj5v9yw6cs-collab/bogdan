import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, PenSquare } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { TextOrNeed } from '../components/Need'
import { useLang } from '../lib/i18n'
import { notes } from '../data/content'

export default function Notes() {
  const { t, tt } = useLang()
  const { mobile } = useWindow()
  const [sel, setSel] = useState<string | null>(mobile ? null : notes[0].id)
  const n = notes.find((x) => x.id === sel)

  const list = (
    <div className={`${mobile ? 'w-full' : 'w-[240px] bg-side border-r border-line'} flex-none flex flex-col min-h-0`}>
      <Toolbar inset={mobile} className={mobile ? '' : 'pl-[84px]'}>
        <span className="text-[13px] font-semibold flex-1">{tt('Заметки', 'Notes')}</span>
        <button className="tb-btn" aria-label="New"><PenSquare size={15} /></button>
      </Toolbar>
      <div className="scroll flex-1 px-2.5">
        {notes.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={`w-full text-left rounded-lg px-3 py-2.5 mb-0.5 ${sel === x.id && !mobile ? 'bg-[#ffd60a]/40' : 'hover:bg-hover'}`}>
            <div className="font-semibold text-[13px] truncate">{t(x.title)}</div>
            <div className="text-[12px] text-ink-3 truncate"><span className="text-ink-2">{t(x.date)}</span> {t(x.body[1])}</div>
          </button>
        ))}
      </div>
    </div>
  )
  const page = n && (
    <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0 flex flex-col bg-win-solid">
      <Toolbar inset={mobile}>
        {mobile && <button className="tb-btn" onClick={() => setSel(null)}><ChevronLeft size={17} />{tt('Заметки', 'Notes')}</button>}
      </Toolbar>
      <div className="scroll flex-1 px-8 pb-8 selectable">
        <div className="text-center text-[11px] text-ink-3 mb-5">{t(n.date)}</div>
        <h1 className="text-[24px] font-bold">{t(n.body[0])}</h1>
        {n.body.slice(1).map((p, i) => <p key={i} className="text-[14.5px] leading-relaxed mt-2.5"><TextOrNeed text={t(p)} /></p>)}
      </div>
    </motion.div>
  )
  if (mobile) return <div className="flex h-full min-h-0 bg-win-solid">{n ? page : list}</div>
  return <div className="flex h-full min-h-0">{list}{page}</div>
}
