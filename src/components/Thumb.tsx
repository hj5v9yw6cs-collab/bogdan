import type { Thumb as T } from '../data/desktop'
import { PhotoArt } from './PhotoArt'
import { AppIcon, FolderIcon } from './icons'

/** Square "cover" thumbnail used for desktop icons and window headers. */
export function Thumb({ t, size }: { t: T; size: number }) {
  if (t.kind === 'photo') {
    return <PhotoArt src={t.src} palette={t.palette} position={t.pos} rounded="rounded-[2px]" hint={false} className="shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.35)]" style={{ width: size, height: size }} />
  }
  if (t.kind === 'icon') {
    return <div className="shrink-0 [&>svg]:size-full" style={{ width: size, height: size }}><AppIcon kind={t.icon} size={size} /></div>
  }
  if (t.kind === 'folder') {
    return <div className="shrink-0 [&>svg]:size-full" style={{ width: size, height: size }}><FolderIcon glyph={t.glyph} size={size} /></div>
  }
  if (t.kind === 'note') {
    return (
      <div className="shrink-0 relative rounded-[3px] bg-[#fffdf3] shadow-[0_1px_3px_rgba(0,0,0,0.35)] overflow-hidden" style={{ width: size * 0.82, height: size, marginInline: size * 0.09 }}>
        <div className="h-[22%] bg-gradient-to-b from-[#ffe066] to-[#f7c600]" />
        {[0.38, 0.52, 0.66, 0.8].map((y) => <div key={y} className="absolute left-[12%] right-[12%] h-px bg-black/15" style={{ top: `${y * 100}%` }} />)}
      </div>
    )
  }
  if (t.kind === 'pdf') {
    return (
      <div className="shrink-0 grid place-items-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 48 60" style={{ height: size, width: size * 0.8 }} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" aria-hidden>
          <path d="M3 1 H32 L45 14 V57 Q45 59 43 59 H3 Q1 59 1 57 V3 Q1 1 3 1 Z" fill="#fff" stroke="#00000030" />
          <path d="M32 1 V12 Q32 14 34 14 H45" fill="#f1f1f3" stroke="#00000030" />
          {[20, 25, 30, 35].map((y) => <rect key={y} x="8" y={y} width={y === 20 ? 18 : 30} height="2" rx="1" fill="#d6d6db" />)}
          <rect x="6" y="43" width="22" height="10" rx="2.5" fill="#ff3b30" />
          <text x="17" y="50.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="-apple-system, Inter, sans-serif">PDF</text>
        </svg>
      </div>
    )
  }
  const lines = t.big.split('\n')
  const fs = Math.round(size * (lines.length > 1 ? 0.2 : t.big.length <= 1 ? 0.62 : t.big.length <= 3 ? 0.3 : 0.22))
  return (
    <div
      className="shrink-0 relative overflow-hidden rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.35)] grain"
      style={{ width: size, height: size, background: t.bg, color: t.ink }}
    >
      <div className="absolute inset-0 flex flex-col justify-center px-[9%] font-black leading-[0.9] tracking-[-0.02em]" style={{ fontSize: fs }}>
        {lines.map((x, i) => <span key={i}>{x}</span>)}
      </div>
      {t.small && <div className="absolute left-[9%] bottom-[7%] font-semibold tracking-[0.06em] opacity-80" style={{ fontSize: Math.max(5, Math.round(size * 0.1)) }}>{t.small}</div>}
    </div>
  )
}
