import { motion, useSpring, type MotionValue, useTransform } from 'motion/react'

export const wallpapers = [
  { name: 'Volga Dawn', bg: '#f4c9b8', layers: ['#f7d9c4', '#e9a8a6', '#b67fb0', '#6f68b8', '#2e3a87'] },
  { name: 'Moscow Night', bg: '#0b0d22', layers: ['#1b1f4a', '#2c2a6e', '#5b3b8f', '#a24c8c', '#f08a6b'] },
  { name: 'Graphite', bg: '#d9d9d9', layers: ['#e6e6e6', '#bdbdbd', '#8a8a8a', '#4d4d4d', '#1a1a1a'] },
]

const waves = [
  'M0 520 C 260 420 520 640 820 520 S 1300 360 1600 470 V1000 H0 Z',
  'M0 610 C 300 520 560 720 900 600 S 1360 470 1600 560 V1000 H0 Z',
  'M0 700 C 320 620 640 800 980 690 S 1400 580 1600 650 V1000 H0 Z',
  'M0 800 C 360 720 700 880 1040 790 S 1420 700 1600 760 V1000 H0 Z',
]

/** Original abstract wallpaper (SVG) with a subtle pointer parallax. */
export function Wallpaper({ index, mx, my }: { index: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const w = wallpapers[index % wallpapers.length]
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const x1 = useTransform(sx, (v) => v * -10)
  const y1 = useTransform(sy, (v) => v * -6)
  const x2 = useTransform(sx, (v) => v * -20)
  const y2 = useTransform(sy, (v) => v * -10)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: w.bg }}>
      <motion.svg className="absolute -inset-[4%] w-[108%] h-[108%]" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ x: x1, y: y1 }} aria-hidden>
        <defs>
          <linearGradient id={`sky${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={w.layers[0]} />
            <stop offset="1" stopColor={w.layers[1]} />
          </linearGradient>
          <radialGradient id={`sun${index}`} cx=".72" cy=".28" r=".45">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id={`soft${index}`}><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <rect width="1600" height="1000" fill={`url(#sky${index})`} />
        <rect width="1600" height="1000" fill={`url(#sun${index})`} />
      </motion.svg>
      <motion.svg className="absolute -inset-[4%] w-[108%] h-[108%]" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ x: x2, y: y2 }} aria-hidden>
        <g filter={`url(#soft${index})`}>
          {waves.map((d, i) => (
            <path key={i} d={d} fill={w.layers[i + 1]} opacity={0.92} />
          ))}
        </g>
      </motion.svg>
      <div className="absolute inset-0 grain opacity-60" />
    </div>
  )
}
