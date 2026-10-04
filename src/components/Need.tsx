import { NEED, SHOW_NEED_MARKERS } from '../data/content'
import { useLang } from '../lib/i18n'

/** Visible marker for data Bogdan still has to provide. Hidden when SHOW_NEED_MARKERS = false. */
export function Need({ label, className = '' }: { label?: string; className?: string }) {
  const { tt } = useLang()
  if (!SHOW_NEED_MARKERS) return null
  return (
    <span
      title={NEED}
      className={`inline-flex items-center gap-1 rounded-full border border-dashed border-amber-500/60 bg-amber-400/10 px-2 py-px text-[10.5px] font-medium tracking-wide text-amber-600 dark:text-amber-400 align-middle whitespace-nowrap ${className}`}
    >
      <span className="size-1.5 rounded-full bg-amber-500" />
      {label ?? tt('нужны данные', 'data needed')}
    </span>
  )
}

/** Renders text, or a Need marker when the text is empty / contains the NEED token. */
export function TextOrNeed({ text, label }: { text: string | null | undefined; label?: string }) {
  if (!text || text.includes(NEED)) {
    const rest = text?.replace(NEED, '').trim()
    return <>{rest ? <>{rest} </> : null}<Need label={label} /></>
  }
  return <>{text}</>
}
