import { useState, type CSSProperties } from 'react'
import { Camera } from 'lucide-react'
import { SHOW_NEED_MARKERS } from '../data/content'

/**
 * Shows a real photo when `src` exists, otherwise an editorial gradient placeholder.
 * Replacing a placeholder = dropping a file into /public/photos (see content.ts).
 */
export function PhotoArt({
  src, palette, label, sub, className = '', rounded = 'rounded-xl', big = false, position = 'center', hint = true, style,
}: {
  src?: string
  palette: [string, string, string]
  label?: string
  sub?: string
  className?: string
  rounded?: string
  big?: boolean
  position?: string
  /** Show the expected file path when the photo is missing. */
  hint?: boolean
  style?: CSSProperties
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [a, b, c] = palette
  const showImg = src && !failed
  return (
    <div title={src && failed ? `public${src}` : undefined} className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden ${rounded} ${className}`} style={{ background: `radial-gradient(120% 90% at 20% 10%, ${a} 0%, transparent 60%), radial-gradient(100% 80% at 90% 90%, ${c} 0%, transparent 55%), linear-gradient(160deg, ${a}, ${b} 55%, ${c})`, ...style }}>
      {showImg && (
        <img
          src={src}
          alt={label ?? ''}
          draggable={false}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: position }}
        />
      )}
      {!(showImg && loaded) && (
        <div className="absolute inset-0 grain">
          <svg className="absolute inset-0 size-full opacity-30 mix-blend-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0 70 Q25 55 50 68 T100 60 V100 H0 Z" fill="#fff" />
            <path d="M0 82 Q30 72 60 80 T100 76 V100 H0 Z" fill="#000" opacity=".5" />
          </svg>
          {src && failed && SHOW_NEED_MARKERS && hint && (
            <div className="absolute inset-0 grid place-items-center p-3">
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-black/45 backdrop-blur-md px-3 py-2 text-white text-center max-w-full">
                <Camera size={big ? 20 : 14} strokeWidth={1.8} />
                <span className={`font-mono leading-tight break-all ${big ? 'text-[11px]' : 'text-[9px]'}`}>public{src}</span>
              </div>
            </div>
          )}
          {label && !(src && failed && SHOW_NEED_MARKERS && hint) && (
            <div className="absolute left-0 right-0 bottom-0 p-3 text-white drop-shadow">
              <div className={`serif leading-none ${big ? 'text-[42px]' : 'text-[18px]'}`}>{label}</div>
              {sub && <div className={`${big ? 'text-[13px] mt-2' : 'text-[10px] mt-1'} opacity-80`}>{sub}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
