import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import { X } from 'lucide-react'
import { useSystem } from '../store/system'
import { useWindows } from '../store/windows'
import { useLang } from '../lib/i18n'
import { store } from '../lib/hooks'
import { folders, appItems, resumeItem, type FsItem } from '../data/fs'
import { l } from '../data/content'
import { Wallpaper, wallpapers } from './Wallpaper'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'
import { WindowManager } from './WindowManager'
import { Spotlight } from './Spotlight'
import { ItemIcon, useOpenAction } from './ItemIcon'
import type { Bounds } from './Window'

const DOCK_SPACE = 84
const DOCK_SPACE_MOBILE = 84

const desktopItems: FsItem[] = [
  { ...appItems.about, id: 'd-about', name: l('Bogdan Starogorodtsev', 'Bogdan Starogorodtsev') },
  resumeItem,
  folders.home.items.find((i) => i.id === 'f-career')!,
  folders.home.items.find((i) => i.id === 'f-projects')!,
  folders.home.items.find((i) => i.id === 'f-photos')!,
  { ...appItems.contact, id: 'd-contact', name: l('Contact', 'Contact') },
  appItems.timeline,
  appItems.consulting,
]

type Props = { mobile: boolean; stage: 'desktop' | 'boot'; onRestart: () => void; onShutDown: () => void }

export function Desktop({ mobile, stage, onRestart, onShutDown }: Props) {
  const sys = useSystem()
  const { windows } = useWindows()
  const layer = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState<Bounds>({ w: 0, h: 0 })
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const ready = stage === 'desktop'
  const [hint, setHint] = useState(() => store.get('bs-hint') !== 'done')

  useLayoutEffect(() => {
    const el = layer.current
    if (!el) return
    const ro = new ResizeObserver(() => setBounds({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Dismiss the welcome hint after the first interaction.
  useEffect(() => {
    if (windows.length && hint) { setHint(false); store.set('bs-hint', 'done') }
  }, [windows.length, hint])

  const anyMaxed = windows.some((w) => w.maximized && !w.minimized)
  const wp = wallpapers[sys.wallpaper % wallpapers.length]
  const darkWall = sys.wallpaper % wallpapers.length === 1

  return (
    <div
      className="mac absolute inset-0 overflow-hidden"
      data-theme={sys.theme}
      style={{ ['--menubar-ink' as string]: darkWall || sys.theme === 'dark' ? '#fff' : '#111', ['--menubar-bg' as string]: darkWall || sys.theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)' }}
      onPointerMove={(e) => {
        if (mobile) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
    >
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.08, filter: 'blur(20px)' }} animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}>
        <Wallpaper index={sys.wallpaper} mx={mx} my={my} />
        <Wordmark dark={darkWall} show={ready} mobile={mobile} accent={wp.layers[4]} />
      </motion.div>

      <AnimatePresence>{ready && <MenuBarIn mobile={mobile} onRestart={onRestart} onShutDown={onShutDown} onShowHint={() => setHint(true)} />}</AnimatePresence>

      {/* Desktop area below the menu bar */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: 'var(--menubar-h)' }}>
        <DesktopIcons show={ready} mobile={mobile} />
        <AnimatePresence>{ready && hint && <WelcomeHint mobile={mobile} onClose={() => { setHint(false); store.set('bs-hint', 'done') }} />}</AnimatePresence>
        <div ref={layer} className="absolute inset-x-0 top-0 pointer-events-none [&>*]:pointer-events-auto" style={{ bottom: anyMaxed && !mobile ? 0 : mobile ? DOCK_SPACE_MOBILE : DOCK_SPACE }}>
          <WindowManager bounds={bounds} mobile={mobile} />
        </div>
      </div>

      <Dock mobile={mobile} show={ready && !(anyMaxed && !mobile)} />
      {ready && <TipNotification />}
      <Spotlight />
      <div className="pointer-events-none absolute inset-0 z-[9000] bg-black transition-opacity duration-200" style={{ opacity: 1 - sys.brightness }} />
    </div>
  )
}

function MenuBarIn(props: { mobile: boolean; onRestart: () => void; onShutDown: () => void; onShowHint: () => void }) {
  return (
    <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 30 }} className="absolute inset-x-0 top-0 z-[5000]">
      <MenuBar {...props} />
    </motion.div>
  )
}

/** Large editorial name on the wallpaper — the "brand" of this Mac. */
function Wordmark({ dark, show, mobile, accent }: { dark: boolean; show: boolean; mobile: boolean; accent: string }) {
  const { tt } = useLang()
  void accent
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.5, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
      className={`absolute pointer-events-none select-none ${mobile ? 'left-5 right-5 bottom-[118px]' : 'left-[4.5%] bottom-[17%]'}`}
      style={{ color: dark ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.95)', textShadow: '0 2px 30px rgba(0,0,0,0.18)' }}
    >
      <div className={`font-semibold tracking-[0.28em] opacity-80 ${mobile ? 'text-[9.5px]' : 'text-[11px]'}`}>{tt('ЦИФРОВОЙ MACBOOK', 'THE MACBOOK OF')}</div>
      <div className={`serif leading-[0.86] mt-2 ${mobile ? 'text-[46px]' : 'text-[clamp(48px,7.2vw,112px)]'}`}>Bogdan<br />Starogorodtsev</div>
      <div className={`mt-3 opacity-85 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>Sberbank → T-Bank → Domilend · Yandex → T-Bank</div>
    </motion.div>
  )
}

function DesktopIcons({ show, mobile }: { show: boolean; mobile: boolean }) {
  const { t } = useLang()
  const openAction = useOpenAction()
  const [sel, setSel] = useState<string | null>(null)
  const area = useRef<HTMLDivElement>(null)

  if (mobile) {
    return (
      <div className="absolute inset-x-0 top-0 px-4 pt-5 grid grid-cols-4 gap-y-5 gap-x-2 z-[1]">
        {desktopItems.map((it, i) => (
          <motion.button
            key={it.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={show ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 400, damping: 24 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1.5"
            onClick={() => openAction(it.action)}
          >
            <ItemIcon icon={it.icon} size={58} />
            <span className="text-[11px] leading-tight text-white text-center font-medium line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_0_8px_rgba(0,0,0,0.35)] break-all">{t(it.name).replace('Bogdan_Starogorodtsev_', '')}</span>
          </motion.button>
        ))}
      </div>
    )
  }

  return (
    <div ref={area} className="absolute inset-0 z-[1]" onPointerDown={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
      <div className="absolute right-3 top-3 flex flex-col flex-wrap-reverse content-start gap-1 h-[calc(100%-110px)]">
        {desktopItems.map((it, i) => (
          <motion.div
            key={it.id}
            drag
            dragMomentum={false}
            dragConstraints={area}
            dragElastic={0.05}
            initial={{ opacity: 0, x: 24 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.55 + i * 0.06, type: 'spring', stiffness: 380, damping: 28 }}
            whileDrag={{ scale: 1.06, zIndex: 50, opacity: 0.85 }}
            onPointerDown={() => setSel(it.id)}
            onDoubleClick={() => openAction(it.action)}
            onKeyDown={(e) => e.key === 'Enter' && openAction(it.action)}
            tabIndex={0}
            role="button"
            aria-label={t(it.name)}
            className="w-[96px] flex flex-col items-center gap-1 p-1 outline-none cursor-default"
          >
            <div className={`rounded-md p-1 ${sel === it.id ? 'bg-black/25 ring-1 ring-white/30' : ''}`}>
              <ItemIcon icon={it.icon} size={56} />
            </div>
            <span className={`max-w-full px-1.5 rounded text-[11.5px] leading-tight text-center font-medium text-white break-words line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_0_8px_rgba(0,0,0,0.35)] ${sel === it.id ? 'bg-[var(--c-accent)] [text-shadow:none]' : ''}`}>
              {t(it.name)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function WelcomeHint({ mobile, onClose }: { mobile: boolean; onClose: () => void }) {
  const { tt } = useLang()
  const { open } = useWindows()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { delay: 1.1, type: 'spring', stiffness: 260, damping: 26, filter: { delay: 1.1, duration: 0.3 } } }}
      exit={{ opacity: 0, y: -10, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.18 } }}
      className={`absolute z-[20] ${mobile ? 'left-3 right-3 top-[268px]' : 'left-1/2 top-[9%] -translate-x-1/2 w-[400px]'}`}
    >
      <div className="glass-strong rounded-2xl border border-[var(--glass-border)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] p-5 text-[var(--c-ink)]">
        <button className="absolute right-3 top-3 tb-btn h-6 min-w-6" onClick={onClose} aria-label="Close"><X size={14} /></button>
        <div className="serif text-[28px] leading-none">{tt('Добро пожаловать в мой Mac.', 'Welcome to my Mac.')}</div>
        <p className="text-[13px] text-ink-2 mt-2">{tt('Исследуйте мою карьеру.', 'Explore my career.')} {mobile ? tt('Нажмите на любую иконку.', 'Tap any icon.') : tt('Дважды кликните по иконке на рабочем столе или выберите приложение в Dock.', 'Double-click a desktop icon or pick an app in the Dock.')}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="btn-primary h-8 text-[12px]" onClick={() => open('finder', { path: 'career' })}>{tt('Открыть Career', 'Open Career')}</button>
          <button className="btn-ghost h-8 text-[12px]" onClick={() => open('about')}>{tt('Обо мне', 'About me')}</button>
          {!mobile && <span className="text-[11px] text-ink-3 self-center ml-auto">⌘ Space — Spotlight</span>}
        </div>
      </div>
    </motion.div>
  )
}

function TipNotification() {
  const { tt } = useLang()
  const { open } = useWindows()
  const { focus } = useSystem()
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (store.get('bs-tip') === 'done') return
    const a = setTimeout(() => setShow(true), 9000)
    return () => clearTimeout(a)
  }, [])
  useEffect(() => {
    if (!show) return
    const b = setTimeout(() => { setShow(false); store.set('bs-tip', 'done') }, 9000)
    return () => clearTimeout(b)
  }, [show])
  return (
    <AnimatePresence>
      {show && !focus && (
        <motion.button
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={() => { setShow(false); store.set('bs-tip', 'done'); open('timeline', { stage: 'sber-sales' }) }}
          className="absolute right-3 top-[calc(var(--menubar-h)+10px)] z-[4500] w-[340px] max-w-[calc(100%-24px)] text-left glass-strong rounded-2xl border border-[var(--glass-border)] shadow-xl p-3 flex gap-3 text-[var(--c-ink)]"
        >
          <div className="size-9 flex-none [&>svg]:size-full"><TimelineMini /></div>
          <div className="min-w-0">
            <div className="flex justify-between text-[12px]"><b>Career Timeline</b><span className="text-ink-3">{tt('сейчас', 'now')}</span></div>
            <div className="text-[12.5px] text-ink-2 leading-snug">{tt('9 кадровых записей в Сбербанке — посмотрите, как выглядел рост.', '9 HR records at Sberbank — see what the growth looked like.')}</div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function TimelineMini() {
  return <ItemIcon icon={{ type: 'app', kind: 'timeline' }} size={36} />
}
