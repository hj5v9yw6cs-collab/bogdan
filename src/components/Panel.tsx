import { useRef, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import { useWindows, type Win } from '../store/windows'

type Props = {
  win: Win
  title: string
  width: number
  height?: number
  bounds: { w: number; h: number }
  mobile: boolean
  dark?: boolean
  focused: boolean
  children: ReactNode
}

/** macOS "Get Info"-style window: compact title bar, draggable, focus & z-order from the store. */
export function Panel({ win, title, width, height, bounds, mobile, dark, focused, children }: Props) {
  const { close, focus } = useWindows()
  // On phones the vertical Dock sits on the left, so windows open to its right.
  const DOCK = 70
  const w = Math.min(width, bounds.w - (mobile ? DOCK + 8 : 40))
  const h = height ? Math.min(height, bounds.h - (mobile ? 90 : 120)) : undefined

  // Cascade new windows around the centre, like the reference.
  const init = useRef<{ x: number; y: number } | null>(null)
  if (!init.current) {
    const j = ((win.seq * 97) % 9) - 4
    init.current = mobile
      ? { x: DOCK, y: Math.round(bounds.h * 0.06) + ((win.seq % 3) * 14) }
      : {
          x: Math.round(Math.min(Math.max(16, (bounds.w - w) / 2 + j * 46), bounds.w - w - 16)),
          y: Math.round(Math.min(Math.max(24, bounds.h * 0.06 + ((win.seq * 53) % 5) * 22), bounds.h - (h ?? 300) - 110)),
        }
  }
  const x = useMotionValue(init.current.x)
  const y = useMotionValue(init.current.y)
  const big = useRef(false)

  const startDrag = (e: RPointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    focus(win.id)
    const sx = e.clientX, sy = e.clientY, ox = x.get(), oy = y.get()
    const move = (ev: PointerEvent) => {
      x.set(Math.min(Math.max(ox + ev.clientX - sx, -w + 80), bounds.w - 80))
      y.set(Math.min(Math.max(oy + ev.clientY - sy, 0), bounds.h - 40))
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const zoom = () => {
    // Green light: centre the window (macOS-like "fit"), toggled.
    big.current = !big.current
    const s = { type: 'spring' as const, stiffness: 420, damping: 36 }
    if (big.current) { animate(x, Math.round((bounds.w - w) / 2), s); animate(y, 16, s) }
    else { animate(x, init.current!.x, s); animate(y, init.current!.y, s) }
  }

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      className={`absolute flex flex-col overflow-hidden ${dark ? 'panel-dark' : 'panel'} ${focused ? 'is-focused' : ''}`}
      style={{ left: x, top: y, width: w, height: h, maxHeight: bounds.h - 24, zIndex: win.z }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 520, damping: 34 } }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
      onPointerDownCapture={() => focus(win.id)}
    >
      <header className="panel-bar" onPointerDown={startDrag} onDoubleClick={zoom}>
        {!dark && <div className="flex gap-[8px] items-center" onMouseDown={(e) => e.preventDefault()}>
          <button aria-label="Close" className="light bg-[#ff5f57]" onClick={() => close(win.id)} />
          <button aria-label="Minimize" className="light bg-[#febc2e]" onClick={() => close(win.id)} />
          <button aria-label="Zoom" className="light bg-[#28c840]" onClick={zoom} />
        </div>}
        <div className={`truncate ${dark ? 'mx-auto text-[11px] text-white/60 font-normal' : 'ml-[22px]'}`}>{title}</div>
      </header>
      {!dark && <div className="mx-[10px] h-px bg-black/15 shrink-0" />}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain panel-scroll">{children}</div>
    </motion.section>
  )
}
