import { createContext, useCallback, useContext, useEffect, useRef, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { useWindows, type Win } from '../store/windows'

export type Bounds = { w: number; h: number }
export type Size = { w: number; h: number }

type WinCtx = {
  win: Win
  focused: boolean
  mobile: boolean
  startDrag: (e: RPointerEvent) => void
  toggleMax: () => void
  close: () => void
}

const WindowContext = createContext<WinCtx | null>(null)
export const useWindow = () => {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindow outside Window')
  return ctx
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.9 }
const MIN_VISIBLE = 96

type Props = {
  win: Win
  title: string
  size: Size
  minSize?: Size
  chrome: 'standard' | 'custom'
  bounds: Bounds
  focused: boolean
  mobile: boolean
  resizable?: boolean
  children: ReactNode
}

export function Window({ win, title, size, minSize = { w: 360, h: 260 }, chrome, bounds, focused, mobile, resizable = true, children }: Props) {
  const { close, focus, toggleMax } = useWindows()

  // Initial geometry: centered, cascaded by opening order.
  const init = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  if (!init.current) {
    const w = Math.min(size.w, bounds.w - 40)
    const h = Math.min(size.h, bounds.h - 30)
    const off = ((win.seq - 1) % 6) * 26
    init.current = {
      w, h,
      x: Math.max(10, Math.round((bounds.w - w) / 2) - 60 + off),
      y: Math.max(8, Math.round((bounds.h - h) / 2.6) - 20 + off),
    }
  }
  const x = useMotionValue(init.current.x)
  const y = useMotionValue(init.current.y)
  const w = useMotionValue(init.current.w)
  const h = useMotionValue(init.current.h)
  const restore = useRef(init.current)

  // Zoom / un-zoom with a spring.
  const mounted = useRef(false)
  const skipAnim = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    if (mobile) return
    if (skipAnim.current) { skipAnim.current = false; return }
    if (win.maximized) {
      restore.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() }
      animate(x, 0, spring); animate(y, 0, spring)
      animate(w, bounds.w, spring); animate(h, bounds.h, spring)
    } else {
      const r = restore.current
      animate(x, r.x, spring); animate(y, r.y, spring)
      animate(w, r.w, spring); animate(h, r.h, spring)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.maximized])

  // Keep windows reachable when the screen is resized.
  useEffect(() => {
    if (mobile) return
    if (win.maximized) { w.set(bounds.w); h.set(bounds.h); return }
    if (w.get() > bounds.w) w.set(Math.max(minSize.w, bounds.w - 20))
    if (h.get() > bounds.h) h.set(Math.max(minSize.h, bounds.h - 10))
    x.set(Math.min(Math.max(x.get(), -w.get() + MIN_VISIBLE), bounds.w - MIN_VISIBLE))
    y.set(Math.min(Math.max(y.get(), 0), bounds.h - 40))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds.w, bounds.h, mobile])

  const startDrag = useCallback((e: RPointerEvent) => {
    if (mobile || e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, input, textarea, a, select, label, [data-no-drag]')) return
    e.preventDefault()
    e.stopPropagation()
    focus(win.id)
    const layer = target.closest('.window')?.parentElement?.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    let ox = x.get()
    const oy = y.get()
    let pendingUnmax = win.maximized
    const move = (ev: PointerEvent) => {
      if (pendingUnmax) {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return
        // Dragging a zoomed window restores its size under the cursor.
        pendingUnmax = false
        const r = restore.current
        const cursorX = sx - (layer?.left ?? 0)
        const ratio = (cursorX - x.get()) / Math.max(1, w.get())
        w.set(r.w); h.set(r.h)
        ox = cursorX - ratio * r.w
        skipAnim.current = true
        toggleMax(win.id)
      }
      const nx = ox + (ev.clientX - sx)
      const ny = oy + (ev.clientY - sy)
      x.set(Math.min(Math.max(nx, -w.get() + MIN_VISIBLE), bounds.w - MIN_VISIBLE))
      y.set(Math.min(Math.max(ny, 0), bounds.h - 40))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.classList.remove('is-dragging')
    }
    document.body.classList.add('is-dragging')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [mobile, focus, toggleMax, win.id, win.maximized, x, y, w, h, bounds.w, bounds.h])

  const startResize = (dir: string) => (e: RPointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault(); e.stopPropagation()
    focus(win.id)
    const sx = e.clientX, sy = e.clientY
    const o = { x: x.get(), y: y.get(), w: w.get(), h: h.get() }
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy
      if (dir.includes('e')) w.set(Math.min(Math.max(minSize.w, o.w + dx), bounds.w - o.x))
      if (dir.includes('s')) h.set(Math.min(Math.max(minSize.h, o.h + dy), bounds.h - o.y))
      if (dir.includes('w')) {
        const nw = Math.min(Math.max(minSize.w, o.w - dx), o.x + o.w)
        w.set(nw); x.set(o.x + o.w - nw)
      }
      if (dir.includes('n')) {
        const nh = Math.min(Math.max(minSize.h, o.h - dy), o.y + o.h)
        h.set(nh); y.set(o.y + o.h - nh)
      }
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.classList.remove('is-dragging')
    }
    document.body.classList.add('is-dragging')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const ctx: WinCtx = {
    win, focused, mobile, startDrag,
    toggleMax: () => !mobile && toggleMax(win.id),
    close: () => close(win.id),
  }

  const style = mobile
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: win.z }
    : { left: x, top: y, width: w, height: h, zIndex: win.z }

  return (
    <WindowContext.Provider value={ctx}>
      <motion.section
        role="dialog"
        aria-label={title}
        className={`window ${focused ? 'is-focused' : ''} ${win.maximized || mobile ? 'is-max' : ''} ${mobile ? 'is-mobile' : ''}`}
        style={{ ...style, transformOrigin: mobile ? '50% 100%' : '50% 60%' }}
        initial={mobile ? { opacity: 0, y: 60, scale: 0.96 } : { opacity: 0, scale: 0.9, y: 14, filter: 'blur(6px)' }}
        animate={
          win.minimized
            ? { opacity: 0, scale: 0.18, y: bounds.h * 0.75, filter: 'blur(4px)', transition: { type: 'spring', stiffness: 320, damping: 34, filter: { duration: 0.2 } } }
            : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 460, damping: 34, mass: 0.8, filter: { duration: 0.2, ease: 'easeOut' } } }
        }
        exit={mobile ? { opacity: 0, y: 80, transition: { duration: 0.22 } } : { opacity: 0, scale: 0.94, filter: 'blur(4px)', transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
        onPointerDownCapture={() => focus(win.id)}
        onPointerDown={(e) => {
          // Custom-chrome windows: the whole top strip (incl. sidebars) drags the window, like macOS.
          if (chrome !== 'custom') return
          const top = (e.currentTarget as HTMLElement).getBoundingClientRect().top
          if (e.clientY - top < 52) startDrag(e)
        }}
        aria-hidden={win.minimized}
        data-minimized={win.minimized || undefined}
      >
        <TrafficLights chrome={chrome} id={win.id} mobile={mobile} />
        {chrome === 'standard' && (
          <header className="window-titlebar" onPointerDown={startDrag} onDoubleClick={ctx.toggleMax}>
            <span className="truncate">{title}</span>
          </header>
        )}
        <div className={`window-body ${chrome === 'standard' ? 'has-titlebar' : ''}`}>{children}</div>
        {resizable && !mobile && !win.maximized && (
          <>
            {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((d) => (
              <div key={d} className={`rz rz-${d}`} onPointerDown={startResize(d)} />
            ))}
          </>
        )}
      </motion.section>
    </WindowContext.Provider>
  )
}

function TrafficLights({ chrome, id, mobile }: { chrome: 'standard' | 'custom'; id: string; mobile: boolean }) {
  const { close, minimize, toggleMax } = useWindows()
  return (
    <div className={`traffic ${chrome === 'custom' ? 'is-custom' : ''}`} data-no-drag onMouseDown={(e) => e.preventDefault()}>
      <button aria-label="Close" className="tl tl-close" onClick={(e) => { e.stopPropagation(); close(id) }}>
        <svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg>
      </button>
      <button aria-label="Minimize" className="tl tl-min" onClick={(e) => { e.stopPropagation(); minimize(id) }}>
        <svg viewBox="0 0 12 12"><path d="M2.8 6h6.4" /></svg>
      </button>
      <button aria-label="Zoom" className="tl tl-max" disabled={mobile} onClick={(e) => { e.stopPropagation(); toggleMax(id) }}>
        <svg viewBox="0 0 12 12"><path d="M3.6 8.4V4.4l4 4z" /><path d="M8.4 3.6v4l-4-4z" /></svg>
      </button>
    </div>
  )
}

/** Drag region + toolbar for windows with custom chrome (Finder, Mail, Safari…). */
export function Toolbar({ children, className = '', inset = true }: { children?: ReactNode; className?: string; inset?: boolean }) {
  const { startDrag, toggleMax } = useWindow()
  return (
    <div className={`toolbar ${inset ? 'pl-[84px]' : ''} ${className}`} onPointerDown={startDrag} onDoubleClick={(e) => {
      if ((e.target as HTMLElement).closest('button, input, a, [data-no-drag]')) return
      toggleMax()
    }}>
      {children}
    </div>
  )
}
