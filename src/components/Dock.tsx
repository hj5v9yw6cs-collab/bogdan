import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { AppIcon, type IconKind } from './icons'
import { useWindows, type AppId } from '../store/windows'
import { apps, dockApps, dockExtras } from '../apps/registry'
import { useLang } from '../lib/i18n'

const BASE = 50
const MAX = 84
const RANGE = 140

type Entry = { id: string; label: string; icon: IconKind; app?: AppId; onClick: () => void; running: boolean }

export function Dock({ mobile, show }: { mobile: boolean; show: boolean }) {
  const mouseX = useMotionValue(Infinity)
  const { windows, open, focus, focusedId } = useWindows()
  const { t, tt } = useLang()

  const activate = (app: AppId) => {
    const ws = windows.filter((w) => w.app === app)
    if (!ws.length) return open(app)
    // Cycle / restore like macOS: bring the top-most window of the app to front.
    const top = ws.reduce((a, b) => (a.z > b.z ? a : b))
    if (top.minimized || focusedId !== top.id) focus(top.id)
    else open(app)
  }

  const mk = (app: AppId): Entry => ({ id: app, label: t(apps[app].name), icon: apps[app].icon, app, running: windows.some((w) => w.app === app), onClick: () => activate(app) })
  const main = (mobile ? (['finder', 'safari', 'photos', 'mail', 'terminal'] as AppId[]) : dockApps).map(mk)
  const extras = mobile ? [] : dockExtras.map(mk)
  const minimized = windows.filter((w) => w.minimized && !mobile)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="absolute bottom-1.5 inset-x-0 z-[4000] flex justify-center pointer-events-none"
        >
          <div
            onMouseMove={(e) => !mobile && mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="dock pointer-events-auto flex items-end gap-1.5 sm:gap-2 px-2 pb-1.5 pt-1.5 rounded-[22px] glass"
            style={{ height: (mobile ? 64 : BASE + 16) }}
          >
            {main.map((e) => <DockItem key={e.id} e={e} mouseX={mouseX} mobile={mobile} />)}
            {!mobile && <div className="w-px self-stretch my-1.5 bg-[var(--c-ink-3)] opacity-40" />}
            {extras.map((e) => <DockItem key={e.id} e={e} mouseX={mouseX} mobile={mobile} />)}
            {minimized.map((w) => (
              <DockItem key={w.id} mouseX={mouseX} mobile={mobile} e={{ id: w.id, label: t(apps[w.app].name), icon: apps[w.app].icon, onClick: () => focus(w.id), running: false }} mini />
            ))}
            {!mobile && <DockItem e={{ id: 'trash', label: tt('Корзина', 'Trash'), icon: 'trash', onClick: () => open('finder', { path: 'trash' }), running: false }} mouseX={mouseX} mobile={mobile} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockItem({ e, mouseX, mobile, mini }: { e: Entry; mouseX: MotionValue<number>; mobile: boolean; mini?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hover, setHover] = useState(false)
  const [bounce, setBounce] = useState(0)
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - r.left - r.width / 2 : Infinity
  })
  const sizeRaw = useTransform(dist, [-RANGE, 0, RANGE], [BASE, MAX, BASE])
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 170, damping: 14 })
  const base = mobile ? 52 : BASE

  return (
    <motion.button
      ref={ref}
      aria-label={e.label}
      style={mobile ? { width: base, height: base } : { width: size, height: size }}
      className="relative flex-none outline-none"
      onMouseDown={(ev) => ev.preventDefault()}
      tabIndex={-1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => { if (!e.running) setBounce((b) => b + 1); e.onClick() }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        key={bounce}
        className="size-full"
        animate={bounce ? { y: [0, -18, 0, -8, 0] } : undefined}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={`size-full ${mini ? 'p-1.5' : ''}`}>
          <IconFill kind={e.icon} />
        </div>
      </motion.div>
      {e.running && <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 size-1 rounded-full bg-[var(--c-ink)] opacity-80" />}
      <AnimatePresence>
        {hover && !mobile && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[12px] font-medium glass-strong text-[var(--c-ink)] shadow-lg border border-[var(--glass-border)]"
          >
            {e.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function IconFill({ kind }: { kind: IconKind }) {
  return (
    <div className="size-full [&>svg]:size-full">
      <AppIcon kind={kind} size={100} />
    </div>
  )
}
