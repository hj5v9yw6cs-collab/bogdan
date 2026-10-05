import { useId, type ComponentType, type ReactNode } from 'react'
import {
  BriefcaseBusiness, Music2, Route, UserRound, Settings, User, Briefcase, Layers, Rocket, GraduationCap,
  Image as ImageIcon, AtSign, type LucideProps,
} from 'lucide-react'

/* All icons are original SVG drawings inspired by the macOS visual language — no Apple assets are used. */

export type IconKind =
  | 'finder' | 'safari' | 'mail' | 'photos' | 'calendar' | 'notes' | 'music' | 'terminal'
  | 'consulting' | 'contacts' | 'timeline' | 'preview' | 'trash' | 'settings' | 'about'
  | 'sheets' | 'crm' | 'slides' | 'warning' | 'instagram' | 'telegram' | 'lang'

function Tile({ size, children, defs, bg }: { size: number; children: ReactNode; defs?: ReactNode; bg: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="app-icon-svg" aria-hidden>
      <defs>
        {defs}
        <linearGradient id={`hl${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip${id}`}><rect x="6" y="6" width="88" height="88" rx="21" /></clipPath>
      </defs>
      <g clipPath={`url(#clip${id})`}>
        <rect x="6" y="6" width="88" height="88" fill={bg} />
        {children}
        <rect x="6" y="6" width="88" height="88" fill={`url(#hl${id})`} opacity=".55" />
      </g>
      <rect x="6.5" y="6.5" width="87" height="87" rx="20.5" fill="none" stroke="#000" strokeOpacity=".08" />
    </svg>
  )
}

const Glyph = ({ I, color = '#fff', size = 46, sw = 1.9 }: { I: ComponentType<LucideProps>; color?: string; size?: number; sw?: number }) => (
  <I x={50 - size / 2} y={50 - size / 2} width={size} height={size} color={color} strokeWidth={sw} />
)

export function AppIcon({ kind, size = 56 }: { kind: IconKind; size?: number }) {
  const id = useId().replace(/:/g, '')
  const g = (name: string) => `${name}${id}`
  switch (kind) {
    case 'finder':
      return (
        <Tile size={size} bg="#e9f3ff" defs={<>
          <linearGradient id={g('f')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3fb2ff" /><stop offset="1" stopColor="#0a63f0" /></linearGradient>
          <linearGradient id={g('f2')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6fbff" /><stop offset="1" stopColor="#cfe2f8" /></linearGradient>
        </>}>
          <rect x="6" y="6" width="88" height="88" fill={`url(#${g('f2')})`} />
          <path d="M6 6 H54 C46 26 44 44 50 56 C44 60 42 74 46 94 H6 Z" fill={`url(#${g('f')})`} />
          <circle cx="33" cy="40" r="4.2" fill="#0b2545" />
          <circle cx="67" cy="40" r="4.2" fill="#0b2545" />
          <path d="M28 66 Q50 80 72 66" fill="none" stroke="#0b2545" strokeWidth="4" strokeLinecap="round" />
        </Tile>
      )
    case 'safari': {
      const ticks = Array.from({ length: 36 }, (_, i) => i * 10)
      return (
        <Tile size={size} bg="#fff" defs={
          <radialGradient id={g('s')} cx=".5" cy=".35" r=".7"><stop offset="0" stopColor="#5fd0ff" /><stop offset="1" stopColor="#0a5fe0" /></radialGradient>
        }>
          <circle cx="50" cy="50" r="38" fill={`url(#${g('s')})`} />
          {ticks.map((a) => (
            <line key={a} x1="50" y1="14" x2="50" y2={a % 30 === 0 ? 20 : 17} stroke="#fff" strokeOpacity=".85" strokeWidth={a % 30 === 0 ? 1.6 : 1} transform={`rotate(${a} 50 50)`} />
          ))}
          <g transform="rotate(45 50 50)">
            <path d="M50 22 L55 50 L45 50 Z" fill="#ff3b30" />
            <path d="M50 78 L55 50 L45 50 Z" fill="#fff" />
          </g>
          <circle cx="50" cy="50" r="2.4" fill="#fff" />
        </Tile>
      )
    }
    case 'mail':
      return (
        <Tile size={size} bg={`url(#${g('m')})`} defs={
          <linearGradient id={g('m')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4cc2ff" /><stop offset="1" stopColor="#0b63e5" /></linearGradient>
        }>
          <rect x="20" y="30" width="60" height="42" rx="6" fill="#fff" />
          <path d="M22 33 L50 54 L78 33" fill="none" stroke="#9ac7f5" strokeWidth="3" strokeLinejoin="round" />
        </Tile>
      )
    case 'photos': {
      const petals = ['#ffb800', '#ff7a00', '#ff2d55', '#bf5af2', '#5e5ce6', '#0a84ff', '#30d158', '#a4e400']
      return (
        <Tile size={size} bg="#fff">
          {petals.map((c, i) => (
            <ellipse key={c} cx="50" cy="31" rx="10" ry="17" fill={c} opacity=".78" style={{ mixBlendMode: 'multiply' }} transform={`rotate(${i * 45} 50 50)`} />
          ))}
        </Tile>
      )
    }
    case 'calendar': {
      const now = new Date()
      const wd = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
      return (
        <Tile size={size} bg="#fff">
          <text x="50" y="33" textAnchor="middle" fontSize="13" fontWeight="600" fill="#ff3b30" fontFamily="Inter, system-ui" letterSpacing=".5">{wd}</text>
          <text x="50" y="77" textAnchor="middle" fontSize="44" fontWeight="400" fill="#1d1d1f" fontFamily="Inter, system-ui" letterSpacing="-2">{now.getDate()}</text>
        </Tile>
      )
    }
    case 'notes':
      return (
        <Tile size={size} bg="#fbfbf8" defs={
          <linearGradient id={g('n')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe066" /><stop offset="1" stopColor="#f7c600" /></linearGradient>
        }>
          <rect x="6" y="6" width="88" height="27" fill={`url(#${g('n')})`} />
          <line x1="6" y1="33" x2="94" y2="33" stroke="#c9a400" strokeDasharray="2 3" strokeWidth="1.2" />
          {[48, 60, 72, 84].map((y) => <line key={y} x1="16" y1={y} x2="84" y2={y} stroke="#d5d5d0" strokeWidth="1.5" />)}
        </Tile>
      )
    case 'music':
      return (
        <Tile size={size} bg={`url(#${g('mu')})`} defs={
          <linearGradient id={g('mu')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6b81" /><stop offset="1" stopColor="#f5203f" /></linearGradient>
        }>
          <Glyph I={Music2} size={48} sw={2.1} />
        </Tile>
      )
    case 'terminal':
      return (
        <Tile size={size} bg={`url(#${g('t')})`} defs={
          <linearGradient id={g('t')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a3e" /><stop offset="1" stopColor="#111113" /></linearGradient>
        }>
          <rect x="14" y="16" width="72" height="68" rx="8" fill="#0b0b0c" stroke="#ffffff22" />
          <text x="22" y="44" fontSize="17" fontWeight="600" fill="#e5e5ea" fontFamily="JetBrains Mono, monospace">&gt;_</text>
        </Tile>
      )
    case 'consulting':
      return (
        <Tile size={size} bg={`url(#${g('c')})`} defs={<>
          <linearGradient id={g('c')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2d3e" /><stop offset="1" stopColor="#09090c" /></linearGradient>
          <radialGradient id={g('cg')} cx=".75" cy=".2" r=".7"><stop offset="0" stopColor="#f5d58a" stopOpacity=".45" /><stop offset="1" stopColor="#f5d58a" stopOpacity="0" /></radialGradient>
        </>}>
          <rect x="6" y="6" width="88" height="88" fill={`url(#${g('cg')})`} />
          <Glyph I={BriefcaseBusiness} color="#f5d58a" size={44} sw={1.7} />
        </Tile>
      )
    case 'contacts':
      return (
        <Tile size={size} bg={`url(#${g('ct')})`} defs={
          <linearGradient id={g('ct')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7b48f" /><stop offset="1" stopColor="#9a7350" /></linearGradient>
        }>
          <rect x="22" y="16" width="56" height="68" rx="6" fill="#fff8ef" />
          <Glyph I={UserRound} color="#9a7350" size={36} sw={2} />
          {[30, 50, 70].map((y) => <rect key={y} x="78" y={y - 5} width="6" height="10" rx="2" fill="#fff8ef" opacity=".7" />)}
        </Tile>
      )
    case 'timeline':
      return (
        <Tile size={size} bg={`url(#${g('tl')})`} defs={
          <linearGradient id={g('tl')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#3b1fa8" /></linearGradient>
        }>
          <Glyph I={Route} size={46} sw={2} />
        </Tile>
      )
    case 'preview':
      return (
        <Tile size={size} bg={`url(#${g('p')})`} defs={
          <linearGradient id={g('p')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f4f6" /><stop offset="1" stopColor="#d5d5db" /></linearGradient>
        }>
          <rect x="26" y="16" width="48" height="64" rx="4" fill="#fff" stroke="#00000018" />
          {[28, 36, 44, 52].map((y) => <rect key={y} x="33" y={y} width={y === 28 ? 22 : 34} height="3" rx="1.5" fill="#c7c7cc" />)}
          <rect x="44" y="62" width="40" height="18" rx="5" fill="#ff3b30" />
          <text x="64" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter, system-ui">PDF</text>
        </Tile>
      )
    case 'settings':
      return (
        <Tile size={size} bg={`url(#${g('st')})`} defs={
          <linearGradient id={g('st')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c7c7cc" /><stop offset="1" stopColor="#7c7c80" /></linearGradient>
        }>
          <Glyph I={Settings} size={50} sw={1.6} color="#2c2c2e" />
        </Tile>
      )
    case 'about':
      return (
        <Tile size={size} bg={`url(#${g('a')})`} defs={
          <linearGradient id={g('a')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1d1d1f" /><stop offset="1" stopColor="#3a3a40" /></linearGradient>
        }>
          <text x="50" y="64" textAnchor="middle" fontSize="44" fill="#f5f5f7" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic">BS</text>
        </Tile>
      )
    case 'sheets':
      return (
        <Tile size={size} bg={`url(#${g('sh')})`} defs={
          <linearGradient id={g('sh')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2fbf71" /><stop offset="1" stopColor="#0e7a43" /></linearGradient>
        }>
          <rect x="22" y="24" width="56" height="52" rx="5" fill="#fff" />
          {[37, 50, 63].map((y) => <line key={y} x1="22" y1={y} x2="78" y2={y} stroke="#0e7a43" strokeOpacity=".35" strokeWidth="1.6" />)}
          {[41, 59].map((x) => <line key={x} x1={x} y1="24" x2={x} y2="76" stroke="#0e7a43" strokeOpacity=".35" strokeWidth="1.6" />)}
          <rect x="22" y="24" width="56" height="13" rx="5" fill="#0e7a43" opacity=".85" />
        </Tile>
      )
    case 'crm':
      return (
        <Tile size={size} bg={`url(#${g('cr')})`} defs={
          <linearGradient id={g('cr')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5b8cff" /><stop offset="1" stopColor="#2337c6" /></linearGradient>
        }>
          <path d="M24 28 H76 L58 52 V72 L42 78 V52 Z" fill="#fff" />
        </Tile>
      )
    case 'slides':
      return (
        <Tile size={size} bg={`url(#${g('sl')})`} defs={
          <linearGradient id={g('sl')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a3c" /><stop offset="1" stopColor="#e2541b" /></linearGradient>
        }>
          <rect x="20" y="26" width="60" height="40" rx="4" fill="#fff" />
          <rect x="28" y="50" width="7" height="10" fill="#e2541b" />
          <rect x="39" y="42" width="7" height="18" fill="#e2541b" />
          <rect x="50" y="35" width="7" height="25" fill="#e2541b" />
          <line x1="50" y1="66" x2="50" y2="76" stroke="#fff" strokeWidth="3" />
          <line x1="40" y1="78" x2="60" y2="78" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Tile>
      )
    case 'warning':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="app-icon-svg" aria-hidden>
          <defs><linearGradient id={g('w')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe066" /><stop offset="1" stopColor="#f5b400" /></linearGradient></defs>
          <path d="M50 12 Q54 12 56 16 L92 80 Q95 88 86 88 H14 Q5 88 8 80 L44 16 Q46 12 50 12 Z" fill={`url(#${g('w')})`} stroke="#d99a00" strokeWidth="1.5" />
          <rect x="45.5" y="36" width="9" height="30" rx="4.5" fill="#1d1d1f" />
          <circle cx="50" cy="76" r="5" fill="#1d1d1f" />
        </svg>
      )
    case 'instagram':
      return (
        <Tile size={size} bg={`url(#${g('ig')})`} defs={
          <radialGradient id={g('ig')} cx=".3" cy="1.05" r="1.2"><stop offset="0" stopColor="#fdd56b" /><stop offset=".35" stopColor="#f5793a" /><stop offset=".6" stopColor="#d6249f" /><stop offset="1" stopColor="#5a3fd6" /></radialGradient>
        }>
          <rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#fff" strokeWidth="6" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="#fff" strokeWidth="6" />
          <circle cx="65.5" cy="34.5" r="3.6" fill="#fff" />
        </Tile>
      )
    case 'telegram':
      return (
        <Tile size={size} bg={`url(#${g('tg')})`} defs={
          <linearGradient id={g('tg')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3fb5f2" /><stop offset="1" stopColor="#1c8ad6" /></linearGradient>
        }>
          <path d="M22 49 L74 28 Q78 27 77 31 L68 72 Q67 76 63 74 L50 64 L43 71 Q41 72 41 70 L42 59 L66 37 L37 55 L24 51 Q20 50 22 49 Z" fill="#fff" />
        </Tile>
      )
    case 'lang':
      return (
        <Tile size={size} bg="#f4f4f6">
          <circle cx="50" cy="50" r="26" fill="none" stroke="#1d1d1f" strokeWidth="4" />
          <ellipse cx="50" cy="50" rx="11" ry="26" fill="none" stroke="#1d1d1f" strokeWidth="4" />
          <line x1="24" y1="50" x2="76" y2="50" stroke="#1d1d1f" strokeWidth="4" />
        </Tile>
      )
    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="app-icon-svg" aria-hidden>
          <defs>
            <linearGradient id={g('tr')} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e5e5ea" stopOpacity=".55" /><stop offset=".5" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#d1d1d6" stopOpacity=".55" /></linearGradient>
          </defs>
          <path d="M24 22 H76 L70 88 Q69 92 65 92 H35 Q31 92 30 88 Z" fill={`url(#${g('tr')})`} stroke="#ffffffaa" strokeWidth="1.5" />
          {[36, 44, 50, 56, 64].map((x) => <line key={x} x1={x} y1="28" x2={x + (x - 50) * 0.08} y2="86" stroke="#8e8e93" strokeOpacity=".35" strokeWidth="1.4" />)}
          <ellipse cx="50" cy="22" rx="27" ry="4" fill="#d1d1d6" stroke="#ffffffbb" />
        </svg>
      )
  }
}

/* ───────────── Folder & file icons ───────────── */

export type FolderGlyph = 'user' | 'career' | 'experience' | 'projects' | 'education' | 'photos' | 'contact' | 'none'
const folderGlyphs: Record<Exclude<FolderGlyph, 'none'>, ComponentType<LucideProps>> = {
  user: User, career: Briefcase, experience: Layers, projects: Rocket, education: GraduationCap, photos: ImageIcon, contact: AtSign,
}

export function FolderIcon({ size = 64, glyph = 'none' }: { size?: number; glyph?: FolderGlyph }) {
  const id = useId().replace(/:/g, '')
  const G = glyph !== 'none' ? folderGlyphs[glyph] : null
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="app-icon-svg" aria-hidden>
      <defs>
        <linearGradient id={`fb${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4aa8f0" /><stop offset="1" stopColor="#2f8be0" /></linearGradient>
        <linearGradient id={`ff${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0ff" /><stop offset="1" stopColor="#5ab4f6" /></linearGradient>
      </defs>
      <path d="M10 26 Q10 20 16 20 H38 Q41 20 43 22.5 L47 27 H84 Q90 27 90 33 V78 Q90 84 84 84 H16 Q10 84 10 78 Z" fill={`url(#fb${id})`} />
      <path d="M10 36 Q10 32 14 32 H86 Q90 32 90 36 V78 Q90 84 84 84 H16 Q10 84 10 78 Z" fill={`url(#ff${id})`} />
      <path d="M10.5 36 Q10.5 32.5 14 32.5 H86" stroke="#fff" strokeOpacity=".55" fill="none" />
      {G && <G x={37} y={46} width={26} height={26} color="#2c7fcf" strokeWidth={2.2} opacity={0.75} />}
    </svg>
  )
}

export type FileKind = 'pdf' | 'txt' | 'md' | 'key' | 'jpg' | 'vcf'
const fileColors: Record<FileKind, string> = { pdf: '#ff3b30', txt: '#8e8e93', md: '#5e5ce6', key: '#ff9f0a', jpg: '#34c759', vcf: '#a2845e' }

export function FileIcon({ size = 64, kind, thumb }: { size?: number; kind: FileKind; thumb?: string[] }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="app-icon-svg" aria-hidden>
      <defs>
        <clipPath id={`pc${id}`}><path d="M22 8 H62 L80 26 V88 Q80 92 76 92 H24 Q20 92 20 88 V12 Q20 8 24 8 Z" /></clipPath>
        {thumb && (
          <linearGradient id={`tg${id}`} x1="0" y1="0" x2="1" y2="1">
            {thumb.map((c, i) => <stop key={i} offset={i / Math.max(1, thumb.length - 1)} stopColor={c} />)}
          </linearGradient>
        )}
      </defs>
      <path d="M22 8 H62 L80 26 V88 Q80 92 76 92 H24 Q20 92 20 88 V12 Q20 8 22 8 Z" fill="#fff" stroke="#00000022" />
      {thumb ? (
        <g clipPath={`url(#pc${id})`}><rect x="20" y="8" width="60" height="84" fill={`url(#tg${id})`} /></g>
      ) : (
        [34, 42, 50, 58, 66].map((y) => <rect key={y} x="28" y={y} width={y === 34 ? 24 : 44} height="3" rx="1.5" fill="#e0e0e5" />)
      )}
      <path d="M62 8 V22 Q62 26 66 26 H80" fill="#f2f2f5" stroke="#00000022" />
      <rect x="24" y="72" width={kind.length * 9 + 12} height="15" rx="4" fill={fileColors[kind]} />
      <text x={30} y="83.5" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Inter, system-ui">{kind.toUpperCase()}</text>
    </svg>
  )
}
