import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bluetooth, Moon, Search, Sun, Volume2, Wifi, WifiOff, Radio, Monitor, Check } from 'lucide-react'
import { useNow, useClickOutside } from '../lib/hooks'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { useSystem } from '../store/system'
import { apps } from '../apps/registry'
import { wallpapers } from './Wallpaper'

type MenuId = 'apple' | 'app' | 'file' | 'edit' | 'view' | 'window' | 'help' | 'wifi' | 'battery' | 'cc' | 'clock' | null

type Item = { label: string; kbd?: string; action?: () => void; disabled?: boolean; checked?: boolean } | 'sep'

export function MenuBar({ mobile, onRestart, onShutDown, onShowHint }: { mobile: boolean; onRestart: () => void; onShutDown: () => void; onShowHint: () => void }) {
  const [open, setOpen] = useState<MenuId>(null)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(null), open !== null)
  const now = useNow(1000)
  const { lang, setLang, t, tt } = useLang()
  const win = useWindows()
  const sys = useSystem()
  const appName = win.focused ? t(apps[win.focused.app].name) : 'Finder'
  const loc = lang === 'ru' ? 'ru-RU' : 'en-US'

  const run = (fn?: () => void) => () => { setOpen(null); fn?.() }

  const menus: Record<'apple' | 'app' | 'file' | 'edit' | 'view' | 'window' | 'help', Item[]> = {
    apple: [
      { label: tt('Об этом Mac', 'About This Mac'), action: () => win.open('aboutmac') },
      'sep',
      { label: tt('О Богдане…', 'About Bogdan…'), action: () => win.open('about') },
      { label: tt('Резюме', 'Resume'), action: () => win.open('resume') },
      'sep',
      { label: tt('Закрыть все окна', 'Close All Windows'), kbd: '⌥⌘W', action: win.closeAll },
      { label: tt('Перезагрузить…', 'Restart…'), action: onRestart },
      { label: tt('Выключить…', 'Shut Down…'), action: onShutDown },
    ],
    app: [
      { label: tt(`О программе ${appName}`, `About ${appName}`), action: () => win.open('aboutmac') },
      'sep',
      { label: tt(`Скрыть ${appName}`, `Hide ${appName}`), kbd: '⌘H', action: () => win.focused && win.minimize(win.focused.id), disabled: !win.focused },
      { label: tt(`Завершить ${appName}`, `Quit ${appName}`), kbd: '⌘Q', action: () => win.focused && win.close(win.focused.id), disabled: !win.focused },
    ],
    file: [
      { label: tt('Новое окно Finder', 'New Finder Window'), kbd: '⌘N', action: () => win.open('finder', { path: 'home' }) },
      { label: tt('Открыть резюме', 'Open Resume'), kbd: '⌘O', action: () => win.open('resume') },
      { label: 'Career Timeline', action: () => win.open('timeline') },
      'sep',
      { label: tt('Закрыть окно', 'Close Window'), kbd: '⌘W', action: () => win.focused && win.close(win.focused.id), disabled: !win.focused },
    ],
    edit: [
      { label: tt('Отменить', 'Undo'), kbd: '⌘Z', disabled: true },
      { label: tt('Повторить', 'Redo'), kbd: '⇧⌘Z', disabled: true },
      'sep',
      { label: tt('Вырезать', 'Cut'), kbd: '⌘X', disabled: true },
      { label: tt('Копировать', 'Copy'), kbd: '⌘C', action: () => document.execCommand('copy') },
      { label: tt('Выбрать всё', 'Select All'), kbd: '⌘A', disabled: true },
    ],
    view: [
      { label: tt('Светлое оформление', 'Light Appearance'), checked: sys.theme === 'light', action: () => sys.set('theme', 'light') },
      { label: tt('Тёмное оформление', 'Dark Appearance'), checked: sys.theme === 'dark', action: () => sys.set('theme', 'dark') },
      'sep',
      ...wallpapers.map<Item>((w, i) => ({ label: w.name, checked: sys.wallpaper === i, action: () => sys.set('wallpaper', i) })),
      'sep',
      { label: 'Русский', checked: lang === 'ru', action: () => setLang('ru') },
      { label: 'English', checked: lang === 'en', action: () => setLang('en') },
    ],
    window: [
      { label: tt('Свернуть', 'Minimize'), kbd: '⌘M', action: () => win.focused && win.minimize(win.focused.id), disabled: !win.focused },
      { label: tt('Увеличить', 'Zoom'), action: () => win.focused && win.toggleMax(win.focused.id), disabled: !win.focused || mobile },
      'sep',
      ...(win.windows.length
        ? win.windows.map<Item>((w) => ({ label: t(apps[w.app].title ? apps[w.app].title!(w.params) : apps[w.app].name), checked: win.focusedId === w.id, action: () => win.focus(w.id) }))
        : [{ label: tt('Нет открытых окон', 'No Windows'), disabled: true } as Item]),
    ],
    help: [
      { label: tt('Как пользоваться этим Mac', 'How to use this Mac'), action: onShowHint },
      { label: tt('Связаться с Богданом', 'Contact Bogdan'), action: () => win.open('contact') },
      { label: 'Terminal: help', action: () => win.open('terminal') },
    ],
  }

  const leftMenus: [Exclude<MenuId, null>, ReactNode][] = mobile
    ? [['apple', <Logo key="l" />], ['app', <b key="a">{appName}</b>]]
    : [
      ['apple', <Logo key="l" />], ['app', <b key="a">{appName}</b>], ['file', tt('Файл', 'File')], ['edit', tt('Правка', 'Edit')],
      ['view', tt('Вид', 'View')], ['window', tt('Окно', 'Window')], ['help', tt('Справка', 'Help')],
    ]

  return (
    <div ref={ref} className="menubar absolute inset-x-0 top-0 z-[5000] h-[var(--menubar-h)] flex items-center justify-between px-2 text-[13px]"
      style={{ background: 'var(--menubar-bg)', color: 'var(--menubar-ink)', backdropFilter: 'blur(30px) saturate(160%)', WebkitBackdropFilter: 'blur(30px) saturate(160%)' }}>
      <div className="flex items-center h-full">
        {leftMenus.map(([id, label]) => (
          <div key={id} className="relative h-full">
            <button
              className={`h-full px-2.5 rounded-[5px] flex items-center ${open === id ? 'bg-white/25 dark-ink' : ''}`}
              onClick={() => setOpen(open === id ? null : id)}
              onPointerEnter={() => open && open !== id && ['apple', 'app', 'file', 'edit', 'view', 'window', 'help'].includes(open) && setOpen(id)}
            >{label}</button>
            <AnimatePresence>
              {open === id && <MenuList items={menus[id as keyof typeof menus]} run={run} />}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex items-center h-full gap-0.5">
        <button className="h-full px-2 text-[11px] font-semibold tracking-wide" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} title={tt('Сменить язык', 'Switch language')}>
          <span className="rounded-[4px] border border-current/60 px-1 py-px leading-none">{lang.toUpperCase()}</span>
        </button>
        {!mobile && (
          <Tray id="battery" open={open} setOpen={setOpen} icon={<Battery />} panel={
            <Panel className="w-[230px]">
              <div className="flex justify-between font-semibold"><span>{tt('Аккумулятор', 'Battery')}</span><span>87%</span></div>
              <div className="text-ink-3 text-[12px] mt-1">{tt('Источник питания: амбиции', 'Power Source: Ambition')}</div>
              <div className="h-px bg-line my-2" />
              <div className="text-[12px] text-ink-2">{tt('Энергоёмкие приложения: Career Timeline', 'Using Significant Energy: Career Timeline')}</div>
            </Panel>
          } />
        )}
        <Tray id="wifi" open={open} setOpen={setOpen} icon={sys.wifi ? <Wifi size={15} strokeWidth={2.2} /> : <WifiOff size={15} strokeWidth={2.2} />} panel={
          <Panel className="w-[260px]">
            <div className="flex items-center justify-between font-semibold">Wi‑Fi<Toggle on={sys.wifi} onChange={(v) => sys.set('wifi', v)} /></div>
            {sys.wifi && (
              <>
                <div className="h-px bg-line my-2" />
                <div className="text-[11px] text-ink-3 font-semibold mb-1">{tt('Известная сеть', 'Known Network')}</div>
                <Net name="Bogdan's iPhone" active />
                <div className="text-[11px] text-ink-3 font-semibold mt-2 mb-1">{tt('Другие сети', 'Other Networks')}</div>
                <Net name="Sber_Office" /><Net name="T-Business_5G" /><Net name="Moscow_Free_WiFi" />
              </>
            )}
          </Panel>
        } />
        {!mobile && <button className="h-full px-2" onClick={() => { setOpen(null); sys.setSpotlight(true) }} aria-label="Spotlight"><Search size={14} strokeWidth={2.4} /></button>}
        <Tray id="cc" open={open} setOpen={setOpen} icon={<CCIcon />} panel={<ControlCenter />} />
        <Tray id="clock" open={open} setOpen={setOpen} icon={
          <span className="tabular-nums whitespace-nowrap">
            {!mobile && <>{now.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' })}&nbsp;&nbsp;</>}
            {now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}
          </span>
        } panel={<MiniCalendar now={now} onOpen={() => { setOpen(null); win.open('calendar') }} />} />
      </div>
    </div>
  )
}

function Logo() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" aria-label="Menu" className="-mt-px">
      <text x="7" y="12.5" textAnchor="middle" fontSize="14" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" fontWeight="600" fill="currentColor">B</text>
    </svg>
  )
}

function MenuList({ items, run }: { items: Item[]; run: (fn?: () => void) => () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.12 }}
      className="menu absolute left-0 top-[calc(100%+3px)]"
    >
      {items.map((it, i) =>
        it === 'sep' ? <div key={i} className="menu-sep" /> : (
          <button key={i} disabled={it.disabled} className="menu-item" onClick={run(it.action)}>
            <span className="flex items-center gap-1.5"><span className="w-3">{it.checked && <Check size={12} strokeWidth={3} />}</span>{it.label}</span>
            {it.kbd && <span className="kbd">{it.kbd}</span>}
          </button>
        ),
      )}
    </motion.div>
  )
}

function Tray({ id, open, setOpen, icon, panel }: { id: Exclude<MenuId, null>; open: MenuId; setOpen: (m: MenuId) => void; icon: ReactNode; panel: ReactNode }) {
  return (
    <div className="relative h-full">
      <button className={`h-full px-2 rounded-[5px] flex items-center ${open === id ? 'bg-white/25' : ''}`} onClick={() => setOpen(open === id ? null : id)}>{icon}</button>
      <AnimatePresence>
        {open === id && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            className="absolute right-0 top-[calc(100%+4px)] origin-top-right"
          >
            {panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`menu p-3 text-[13px] ${className}`}>{children}</div>
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative w-[34px] h-[20px] rounded-full transition-colors ${on ? 'bg-accent' : 'bg-fill-2'}`} role="switch" aria-checked={on}>
      <motion.span layout transition={{ type: 'spring', stiffness: 700, damping: 35 }} className={`absolute top-[2px] size-4 rounded-full bg-white shadow ${on ? 'right-[2px]' : 'left-[2px]'}`} />
    </button>
  )
}

function Net({ name, active }: { name: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span className={`size-6 rounded-full grid place-items-center ${active ? 'bg-accent text-white' : 'bg-fill-2 text-ink-2'}`}><Wifi size={12} strokeWidth={2.4} /></span>
      <span className="flex-1">{name}</span>
    </div>
  )
}

function Battery() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-label="Battery">
      <rect x=".5" y=".5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity=".5" />
      <rect x="2" y="2" width="15.5" height="8" rx="1.6" fill="currentColor" />
      <path d="M23 4v4c.8-.3 1.3-1 1.3-2S23.8 4.3 23 4z" fill="currentColor" fillOpacity=".5" />
    </svg>
  )
}

function CCIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="Control Center">
      <rect x="1" y="2.5" width="14" height="4.5" rx="2.25" /><circle cx="12.75" cy="4.75" r="1.2" fill="currentColor" />
      <rect x="1" y="9" width="14" height="4.5" rx="2.25" /><circle cx="3.25" cy="11.25" r="1.2" fill="currentColor" />
    </svg>
  )
}

function ControlCenter() {
  const sys = useSystem()
  const { tt, lang, setLang } = useLang()
  const tile = 'rounded-2xl bg-white/45 dark:bg-white/10 border border-white/40 shadow-sm'
  const Circle = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
    <button onClick={onClick} className={`size-7 rounded-full grid place-items-center transition-colors ${on ? 'bg-accent text-white' : 'bg-fill-2 text-ink'}`}>{children}</button>
  )
  return (
    <div className="menu p-2.5 w-[300px] grid grid-cols-2 gap-2.5">
      <div className={`${tile} p-2.5 row-span-2 space-y-2.5`}>
        <div className="flex items-center gap-2"><Circle on={sys.wifi} onClick={() => sys.set('wifi', !sys.wifi)}><Wifi size={14} /></Circle><div className="leading-tight"><div className="text-[12px] font-semibold">Wi‑Fi</div><div className="text-[10.5px] text-ink-3">{sys.wifi ? "Bogdan's iPhone" : tt('Выкл.', 'Off')}</div></div></div>
        <div className="flex items-center gap-2"><Circle on={sys.bluetooth} onClick={() => sys.set('bluetooth', !sys.bluetooth)}><Bluetooth size={14} /></Circle><div className="leading-tight"><div className="text-[12px] font-semibold">Bluetooth</div><div className="text-[10.5px] text-ink-3">{sys.bluetooth ? tt('Вкл.', 'On') : tt('Выкл.', 'Off')}</div></div></div>
        <div className="flex items-center gap-2"><Circle on={sys.airdrop} onClick={() => sys.set('airdrop', !sys.airdrop)}><Radio size={14} /></Circle><div className="leading-tight"><div className="text-[12px] font-semibold">AirDrop</div><div className="text-[10.5px] text-ink-3">{sys.airdrop ? tt('Для всех', 'Everyone') : tt('Только контакты', 'Contacts Only')}</div></div></div>
      </div>
      <button onClick={() => sys.set('theme', sys.theme === 'dark' ? 'light' : 'dark')} className={`${tile} p-2.5 flex items-center gap-2 text-left`}>
        <span className={`size-7 rounded-full grid place-items-center ${sys.theme === 'dark' ? 'bg-accent text-white' : 'bg-fill-2'}`}>{sys.theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}</span>
        <span className="text-[12px] font-semibold leading-tight">{sys.theme === 'dark' ? tt('Тёмная тема', 'Dark Mode') : tt('Светлая тема', 'Light Mode')}</span>
      </button>
      <button onClick={() => sys.set('focus', !sys.focus)} className={`${tile} p-2.5 flex items-center gap-2 text-left`}>
        <span className={`size-7 rounded-full grid place-items-center ${sys.focus ? 'bg-[#5e5ce6] text-white' : 'bg-fill-2'}`}><Moon size={14} fill={sys.focus ? 'currentColor' : 'none'} /></span>
        <span className="text-[12px] font-semibold leading-tight">{tt('Фокус', 'Focus')}<span className="block text-[10.5px] font-normal text-ink-3">{sys.focus ? tt('Не беспокоить', 'Do Not Disturb') : tt('Выкл.', 'Off')}</span></span>
      </button>
      <div className={`${tile} p-2.5 col-span-2`}>
        <div className="text-[12px] font-semibold mb-1.5">{tt('Дисплей', 'Display')}</div>
        <div className="flex items-center gap-2"><Sun size={13} className="text-ink-3" /><input aria-label="Brightness" type="range" min={0.4} max={1} step={0.01} value={sys.brightness} onChange={(e) => sys.set('brightness', +e.target.value)} className="flex-1 accent-white" /></div>
      </div>
      <div className={`${tile} p-2.5 col-span-2`}>
        <div className="text-[12px] font-semibold mb-1.5">{tt('Звук', 'Sound')}</div>
        <div className="flex items-center gap-2"><Volume2 size={13} className="text-ink-3" /><input aria-label="Volume" type="range" min={0} max={1} step={0.01} value={sys.volume} onChange={(e) => sys.set('volume', +e.target.value)} className="flex-1 accent-white" /></div>
      </div>
      <div className={`${tile} p-2.5 col-span-2`}>
        <div className="text-[12px] font-semibold mb-2 flex items-center gap-1.5"><Monitor size={13} />{tt('Обои', 'Wallpaper')}</div>
        <div className="flex gap-2">
          {wallpapers.map((w, i) => (
            <button key={w.name} onClick={() => sys.set('wallpaper', i)} title={w.name} className={`h-10 flex-1 rounded-lg ring-2 transition ${sys.wallpaper === i ? 'ring-accent' : 'ring-transparent'}`} style={{ background: `linear-gradient(160deg, ${w.layers[0]}, ${w.layers[2]} 50%, ${w.layers[4]})` }} />
          ))}
        </div>
      </div>
      <div className={`${tile} p-2 col-span-2 flex items-center justify-between`}>
        <span className="text-[12px] font-semibold pl-1">{tt('Язык', 'Language')}</span>
        <div className="flex rounded-lg bg-fill p-0.5">
          {(['ru', 'en'] as const).map((v) => <button key={v} onClick={() => setLang(v)} className={`h-6 px-3 rounded-md text-[11.5px] font-semibold ${lang === v ? 'bg-win-solid shadow-sm' : 'text-ink-2'}`}>{v.toUpperCase()}</button>)}
        </div>
      </div>
    </div>
  )
}

function MiniCalendar({ now, onOpen }: { now: Date; onOpen: () => void }) {
  const { lang, tt } = useLang()
  const loc = lang === 'ru' ? 'ru-RU' : 'en-US'
  const y = now.getFullYear(), m = now.getMonth()
  const first = (new Date(y, m, 1).getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const wd = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(loc, { weekday: 'narrow' }))
  return (
    <div className="menu p-3.5 w-[250px]">
      <div className="text-[11px] text-ink-3 capitalize">{now.toLocaleDateString(loc, { weekday: 'long' })}</div>
      <div className="flex items-baseline justify-between">
        <div className="text-[15px] font-semibold capitalize">{now.toLocaleDateString(loc, { month: 'long', year: 'numeric' })}</div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 mt-3 text-center text-[11px]">
        {wd.map((d, i) => <div key={i} className="text-ink-3 font-semibold">{d}</div>)}
        {Array.from({ length: first }).map((_, i) => <div key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
          <div key={d} className={`mx-auto size-6 grid place-items-center rounded-full tabular-nums ${d === now.getDate() ? 'bg-[#ff3b30] text-white font-semibold' : ''}`}>{d}</div>
        ))}
      </div>
      <button className="btn-ghost w-full h-8 mt-3 text-[12px]" onClick={onOpen}>{tt('Открыть Календарь', 'Open Calendar')}</button>
    </div>
  )
}
