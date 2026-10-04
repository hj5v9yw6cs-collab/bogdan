import { motion } from 'motion/react'
import { useWindow } from '../components/Window'
import { TextOrNeed } from '../components/Need'
import { useLang } from '../lib/i18n'
import { allDocs } from '../data/content'

/** TextEdit-like viewer for documents in Finder. */
export default function Doc() {
  const { win } = useWindow()
  const { t } = useLang()
  const d = allDocs.find((x) => x.id === win.params.doc) ?? allDocs[0]
  return (
    <div className="scroll h-full bg-win-solid selectable">
      <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-[620px] mx-auto px-8 py-9">
        <div className="eyebrow">{d.file}</div>
        <h1 className="serif text-[40px] leading-none mt-3">{t(d.title)}</h1>
        {d.subtitle && <p className="text-ink-2 text-[14px] mt-2">{t(d.subtitle)}</p>}
        <div className="h-px bg-line my-6" />
        <div className="space-y-3 text-[14.5px] leading-relaxed">
          {d.body.map((p, i) => <p key={i}><TextOrNeed text={t(p)} /></p>)}
        </div>
        {d.tags && (
          <div className="mt-7 flex flex-wrap gap-1.5">
            {d.tags.map((x) => <span key={x} className="px-2.5 py-1 rounded-full bg-fill border border-line text-[11.5px] text-ink-2">{x}</span>)}
          </div>
        )}
      </motion.article>
    </div>
  )
}
