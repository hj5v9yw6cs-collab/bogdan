import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'

const ASPECT = 1.58

function useScreenSize() {
  const calc = () => {
    const vw = window.innerWidth, vh = window.innerHeight
    const padX = vw > 1400 ? 64 : 28
    const reserved = 28 + 22 + 46 // top pad + base + caption
    const maxW = Math.min(vw - padX * 2, 1680)
    const maxH = vh - reserved
    // screen + bezels (≈3.4% of width)
    let w = Math.min(maxW / 1.034, (maxH / 1.054) * ASPECT)
    w = Math.max(560, w)
    return { w: Math.round(w), h: Math.round(w / ASPECT) }
  }
  const [s, setS] = useState(calc)
  useEffect(() => {
    const on = () => setS(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return s
}

/** A minimal, original MacBook-style frame around the interactive screen. */
export function MacBook({ children, lidOn }: { children: ReactNode; lidOn: boolean }) {
  const { w, h } = useScreenSize()
  const bezel = Math.max(10, Math.round(w * 0.017))
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center"
    >
      {/* Lid */}
      <div
        className="relative rounded-[22px] p-[2px]"
        style={{
          background: 'linear-gradient(180deg,#5c5d62 0%,#2b2c30 6%,#1d1e21 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 50px 120px -30px rgba(0,0,0,0.9), 0 30px 60px -40px rgba(120,140,255,0.15)',
        }}
      >
        <div className="relative rounded-[20px] bg-[#050506]" style={{ padding: bezel }}>
          {/* Notch with camera */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-[9999] h-[18px] w-[150px] max-w-[18%] rounded-b-[10px] bg-[#050506] flex items-center justify-center" style={{ top: bezel - 1 }}>
            <span className="size-[6px] rounded-full bg-[#1a1d2a] ring-1 ring-[#2a2e40]" />
          </div>
          <div className="relative overflow-hidden rounded-[8px] bg-black" style={{ width: w, height: h }}>
            {children}
            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-[9998] bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_35%)]" />
            <motion.div className="pointer-events-none absolute inset-0 z-[9997] bg-black" initial={{ opacity: 1 }} animate={{ opacity: lidOn ? 0 : 1 }} transition={{ duration: 0.6 }} />
          </div>
          <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 text-[8px] tracking-[0.3em] text-white/25 font-medium select-none">BOGDANBOOK PRO</div>
        </div>
      </div>
      {/* Base */}
      <div className="relative" style={{ width: w + bezel * 2 + 120, height: 20 }}>
        <div className="absolute inset-x-0 top-0 h-[14px] rounded-b-[16px] rounded-t-[3px]" style={{ background: 'linear-gradient(180deg,#d6d7db 0%,#a9abb1 45%,#6f7177 100%)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)' }}>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[6px] w-[150px] rounded-b-[8px]" style={{ background: 'linear-gradient(180deg,#8b8d93,#b9bbc0)' }} />
        </div>
        <div className="absolute left-[6%] right-[6%] top-[14px] h-[4px] rounded-b-full bg-black/60 blur-[1px]" />
      </div>
    </motion.div>
  )
}
