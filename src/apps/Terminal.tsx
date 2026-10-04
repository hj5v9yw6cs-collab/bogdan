import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { useWindow } from '../components/Window'
import { useLang } from '../lib/i18n'
import { useWindows, type AppId } from '../store/windows'
import { ageFrom, contacts, employers, employerPeriod, profile, cities, NEED } from '../data/content'

type Line = { kind: 'in' | 'out'; text: ReactNode }

const PROMPT = 'bogdan@macbook ~ %'

export default function Terminal() {
  const { lang, t, tt, setLang } = useLang()
  const { open, close } = useWindows()
  const { win } = useWindow()
  const [lines, setLines] = useState<Line[]>(() => [
    { kind: 'out', text: `Last login: ${new Date().toDateString()} on ttys001` },
    { kind: 'out', text: <span className="text-[#8e8e93]">{tt('Введите', 'Type')} <b className="text-[#5ac8fa]">help</b> {tt('чтобы увидеть команды.', 'to see available commands.')}</span> },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const ref = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => { scroller.current?.scrollTo({ top: 1e6 }) }, [lines])
  useEffect(() => { ref.current?.focus() }, [])

  const apps: Record<string, AppId> = { finder: 'finder', safari: 'safari', mail: 'mail', photos: 'photos', calendar: 'calendar', notes: 'notes', music: 'music', resume: 'resume', timeline: 'timeline', contact: 'contact', consulting: 'consulting', about: 'about' }

  const run = (raw: string): ReactNode | null => {
    const [cmd, ...args] = raw.trim().split(/\s+/)
    switch (cmd?.toLowerCase()) {
      case '': return null
      case 'help':
        return (
          <div className="grid grid-cols-[110px_1fr] gap-x-3">
            {[
              ['whoami', tt('кто я', 'who am I')], ['career', tt('карьерный путь', 'career path')], ['sber', tt('все должности в Сбербанке', 'all Sberbank roles')],
              ['location', tt('где я сейчас', 'where I am')], ['route', tt('маршрут по городам', 'city route')], ['status', tt('статус', 'status')],
              ['contact', tt('контакты', 'contacts')], ['open <app>', tt('открыть приложение', 'open an app')], ['neofetch', tt('системная информация', 'system info')],
              ['lang ru|en', tt('сменить язык', 'switch language')], ['clear', tt('очистить', 'clear')], ['exit', tt('закрыть терминал', 'close terminal')],
            ].map(([c, d]) => (<Fragment key={c}><span className="text-[#5ac8fa]">{c}</span><span className="text-[#a1a1a6]">{d}</span></Fragment>))}
          </div>
        )
      case 'whoami': return t(profile.name)
      case 'career':
        return (
          <div>
            {employers.filter((e) => e.id !== 'early').map((e) => {
              const p = employerPeriod(e)
              return <div key={e.id}><span style={{ color: e.color }}>●</span> {t(e.name)}{e.parent ? ` (${t(e.parent)})` : ''} <span className="text-[#8e8e93]">{p.from?.slice(-4)}{p.current ? ' → now' : ''}</span></div>
            })}
          </div>
        )
      case 'sber': {
        const sber = employers.find((e) => e.id === 'sber')!
        return <div>{sber.records.filter((r) => r.date).map((r, i) => <div key={i}><span className="text-[#30d158]">{r.date}</span>  {t(r.title)}{r.note ? <span className="text-[#8e8e93]"> — {t(r.note)}</span> : null}</div>)}</div>
      }
      case 'location': return t(profile.city)
      case 'route': return cities.map((c) => t(c.name)).join(' → ')
      case 'status': return <span className="text-[#ffd60a]">{t(profile.status)}</span>
      case 'contact': case 'contacts':
        return (
          <div>
            <div>email     {contacts.email || <span className="text-[#ff9f0a]">{NEED}</span>}</div>
            <div>telegram  {contacts.telegram ? '@' + contacts.telegram : <span className="text-[#ff9f0a]">{NEED}</span>}</div>
            <div className="text-[#8e8e93]">{tt('или', 'or')}: open contact</div>
          </div>
        )
      case 'open': {
        const a = apps[(args[0] ?? '').toLowerCase()]
        if (!a) return tt(`Не найдено приложение: ${args[0] ?? ''}. Доступны: `, `App not found: ${args[0] ?? ''}. Available: `) + Object.keys(apps).join(', ')
        open(a)
        return tt(`Открываю ${args[0]}…`, `Opening ${args[0]}…`)
      }
      case 'neofetch':
        return (
          <div className="flex gap-5">
            <pre className="text-[#30d158] leading-tight">{`   ____  \n  | __ ) \n  |  _ \\ \n  | |_) |\n  |____/ `}</pre>
            <div>
              <div><b className="text-[#30d158]">bogdan</b>@<b className="text-[#30d158]">macbook</b></div>
              <div className="text-[#8e8e93]">-----------------</div>
              <div><span className="text-[#30d158]">OS</span>: BogdanOS {lang === 'ru' ? '(Москва)' : '(Moscow)'}</div>
              <div><span className="text-[#30d158]">Uptime</span>: {ageFrom(profile.birthDate)} {tt('лет', 'years')}</div>
              <div><span className="text-[#30d158]">Host</span>: {t(profile.hometown)}</div>
              <div><span className="text-[#30d158]">Packages</span>: Sberbank (9), T-Bank (2), Domilend (2)</div>
              <div><span className="text-[#30d158]">Shell</span>: ambition 1.0</div>
            </div>
          </div>
        )
      case 'lang': {
        const v = args[0]?.toLowerCase()
        if (v === 'ru' || v === 'en') { setLang(v); return v === 'ru' ? 'Язык: русский' : 'Language: English' }
        return 'usage: lang ru|en'
      }
      case 'sudo': return tt('Пароль не требуется. Просто напишите мне: open contact', 'No password needed. Just reach out: open contact')
      case 'ls': return 'About_Me  Career  Experience  Projects  Education  Photos  Contact  Resume.pdf'
      case 'pwd': return '/Users/bogdan'
      case 'date': return new Date().toString()
      case 'echo': return args.join(' ')
      case 'exit': close(win.id); return null
      default: return tt(`zsh: команда не найдена: ${cmd}`, `zsh: command not found: ${cmd}`)
    }
  }

  const submit = () => {
    const v = input
    setHist((h) => (v.trim() ? [...h, v] : h))
    setHi(-1)
    setInput('')
    if (v.trim() === 'clear') { setLines([]); return }
    const out = run(v)
    setLines((ls) => [...ls, { kind: 'in', text: v }, ...(out != null ? [{ kind: 'out' as const, text: out }] : [])])
  }

  return (
    <div ref={scroller} className="scroll h-full bg-[#141416]/95 text-[#e5e5ea] font-mono text-[12.5px] leading-[1.6] p-3 select-text" onClick={() => ref.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {l.kind === 'in' ? (<><span className="text-[#30d158]">{PROMPT}</span> {l.text}</>) : l.text}
        </div>
      ))}
      <div className="flex">
        <span className="text-[#30d158] whitespace-pre">{PROMPT} </span>
        <input
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'ArrowUp') { e.preventDefault(); const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); if (hist[n] !== undefined) { setHi(n); setInput(hist[n]) } }
            if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi + 1; if (hi >= 0 && n < hist.length) { setHi(n); setInput(hist[n]) } else { setHi(-1); setInput('') } }
          }}
          className="flex-1 bg-transparent outline-none caret-[#e5e5ea] min-w-0"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
        />
      </div>
      <QuickChips onRun={(c) => { setInput(''); const out = run(c); setLines((ls) => [...ls, { kind: 'in', text: c }, ...(out != null ? [{ kind: 'out' as const, text: out }] : [])]) }} />
    </div>
  )
}

function QuickChips({ onRun }: { onRun: (c: string) => void }) {
  const { mobile } = useWindow()
  if (!mobile) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-4">
      {['whoami', 'career', 'sber', 'location', 'status', 'help'].map((c) => (
        <button key={c} onClick={() => onRun(c)} className="px-2.5 py-1 rounded-md bg-white/10 text-[#e5e5ea]">{c}</button>
      ))}
    </div>
  )
}
