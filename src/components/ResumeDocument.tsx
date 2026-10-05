import { Need } from './Need'
import { PhotoArt } from './PhotoArt'
import { useLang } from '../lib/i18n'
import { contacts, employers, employerPeriod, nonprofit, portraits, profile, isNeed } from '../data/content'

/** Path of the downloadable CV. Replace the file in /public to update it. */
export const RESUME_PDF = '/Bogdan_Starogorodtsev_Resume.pdf'
export const PAGE_W = 794
export const PAGE_H = 1123

const transferLabel: [string, string] = ['перевод', 'transfer']

/** The A4 page itself — also used to render the PDF (see ?print=resume). */
export function ResumeDocument() {
  const { t, tt } = useLang()
  const order = ['tbank', 'domilend', 'sber'] as const
  return (
    <article className="resume-page bg-white text-[#1d1d1f] selectable" style={{ width: PAGE_W, minHeight: 1123, padding: '56px 60px', fontSize: 11.5, lineHeight: 1.5 }}>
      <header className="flex items-start gap-6 pb-6 border-b border-black/10">
        <PhotoArt src={portraits.hero.src} palette={portraits.hero.palette} rounded="rounded-full" className="size-[84px] flex-none" position="60% 17%" zoom={1.9} hint={false} />
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
                        {r.kind === 'transfer' && <span className="text-black/45"> — {r.note ? t(r.note).toLowerCase() : tt(...transferLabel)}</span>}
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
        <h2 className="text-[10px] font-semibold tracking-[0.18em] text-black/45 mb-3">{tt('ПАРАЛЛЕЛЬНЫЙ ОПЫТ', 'PARALLEL EXPERIENCE')}</h2>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <span className="font-mono text-[10px] text-black/50 pt-[2px]">{nonprofit.period}</span>
          <span><b className="font-semibold">{t(nonprofit.role)}</b> <span className="text-black/60">· {t(nonprofit.org)}</span><br /><span className="text-black/60">{t(nonprofit.description)}</span></span>
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
