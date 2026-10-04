import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, Inbox, PenSquare, Reply, Send, Star } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { TextOrNeed } from '../components/Need'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { mails } from '../data/content'

export default function Mail() {
  const { t, tt } = useLang()
  const { mobile } = useWindow()
  const { open } = useWindows()
  const [sel, setSel] = useState<string | null>(mobile ? null : mails[0]?.id ?? null)
  const [read, setRead] = useState<Set<string>>(new Set())
  const m = mails.find((x) => x.id === sel) ?? null
  const unread = mails.filter((x) => x.unread && !read.has(x.id)).length

  const pick = (id: string) => { setSel(id); setRead((r) => new Set(r).add(id)) }

  const list = (
    <div className={`${mobile ? 'w-full' : 'w-[290px]'} flex-none flex flex-col border-r border-line min-h-0`}>
      <Toolbar inset={mobile} className={mobile ? '' : 'pl-4'}>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold">{tt('Входящие', 'Inbox')}</div>
          <div className="text-[11px] text-ink-3">{unread ? `${unread} ${tt('непрочитанных', 'unread')}` : tt('Все прочитаны', 'All read')}</div>
        </div>
        <button className="tb-btn" onClick={() => open('contact')} aria-label="Compose"><PenSquare size={16} /></button>
      </Toolbar>
      <div className="scroll flex-1 min-h-0 border-t border-line">
        {mails.map((x, i) => {
          const isUnread = x.unread && !read.has(x.id)
          const active = sel === x.id && !mobile
          return (
            <motion.button
              key={x.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => pick(x.id)}
              className={`relative w-full text-left px-4 py-3 border-b border-line ${active ? 'bg-accent text-white' : 'hover:bg-hover'}`}
            >
              {isUnread && <span className={`absolute left-1.5 top-[18px] size-2 rounded-full ${active ? 'bg-white' : 'bg-accent'}`} />}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[13px] truncate">{t(x.from)}</span>
                {x.placeholder && <span className={`text-[9.5px] uppercase tracking-wider px-1 rounded ${active ? 'bg-white/20' : 'bg-amber-400/20 text-amber-600'}`}>{tt('пример', 'sample')}</span>}
                <span className={`ml-auto text-[11px] ${active ? 'text-white/80' : 'text-ink-3'}`}>{x.date}</span>
              </div>
              <div className="text-[12.5px] truncate mt-0.5">{t(x.subject)}</div>
              <div className={`text-[12px] line-clamp-2 mt-0.5 ${active ? 'text-white/75' : 'text-ink-3'}`}>{t(x.preview)}</div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  const reader = (
    <div className="flex-1 min-w-0 flex flex-col bg-win-solid min-h-0">
      <Toolbar inset={mobile} className={`justify-end ${mobile ? '' : 'pl-4'}`}>
        {mobile && <button className="tb-btn mr-auto" onClick={() => setSel(null)}><ChevronLeft size={17} />{tt('Входящие', 'Inbox')}</button>}
        <button className="tb-btn" onClick={() => open('contact')} aria-label="Reply"><Reply size={16} /></button>
        <button className="tb-btn" aria-label="Star"><Star size={15} /></button>
      </Toolbar>
      <AnimatePresence mode="wait">
        {m ? (
          <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="scroll flex-1 min-h-0 border-t border-line px-6 sm:px-8 py-6">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-[#a1a1a6] to-[#6e6e73] grid place-items-center text-white font-semibold">{t(m.from)[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[14px]">{t(m.from)} <span className="font-normal text-ink-3 text-[12px]">· {t(m.role)}</span></div>
                <div className="text-[12px] text-ink-3">{tt('Кому', 'To')}: Bogdan Starogorodtsev</div>
              </div>
              <div className="text-[12px] text-ink-3">{m.date}</div>
            </div>
            <h2 className="text-[20px] font-semibold mt-6">{t(m.subject)}</h2>
            <div className="mt-4 text-[14px] leading-relaxed text-ink-2 whitespace-pre-line selectable"><TextOrNeed text={t(m.body)} /></div>
            <div className="mt-8 flex gap-2">
              <button className="btn-primary" onClick={() => open('consulting')}><Send size={14} />{tt('Записаться на консультацию', 'Book a consultation')}</button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 grid place-items-center text-ink-3 border-t border-line"><div className="flex flex-col items-center gap-2"><Inbox size={28} strokeWidth={1.4} />{tt('Нет выбранного письма', 'No message selected')}</div></div>
        )}
      </AnimatePresence>
    </div>
  )

  if (mobile) return <div className="flex h-full min-h-0 bg-win-solid">{m ? reader : list}</div>
  return (
    <div className="flex h-full min-h-0">
      <div className="flex bg-side">{list}</div>
      {reader}
    </div>
  )
}
