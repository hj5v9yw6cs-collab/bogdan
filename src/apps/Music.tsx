import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, SkipBack, SkipForward, Volume1 } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { useLang } from '../lib/i18n'
import { useSystem } from '../store/system'
import { tracks } from '../data/content'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** A visual player — no audio is streamed. Replace `tracks` in content.ts with a real playlist. */
export default function Music() {
  const { tt } = useLang()
  const { mobile } = useWindow()
  const { volume, set } = useSystem()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const tr = tracks[i]

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos((p) => {
      if (p + 1 >= tr.len) { setI((x) => (x + 1) % tracks.length); return 0 }
      return p + 1
    }), 1000)
    return () => clearInterval(id)
  }, [playing, tr.len])

  const go = (d: number) => { setI((x) => (x + d + tracks.length) % tracks.length); setPos(0) }

  return (
    <div className="flex flex-col h-full min-h-0 bg-win-solid">
      <Toolbar><span className="text-[13px] font-semibold">{tt('Музыка', 'Music')}</span></Toolbar>
      <div className={`flex-1 min-h-0 flex ${mobile ? 'flex-col' : ''} gap-6 px-6 pb-6`}>
        <div className={`${mobile ? '' : 'w-[260px]'} flex-none flex flex-col`}>
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: playing ? 1 : 0.94 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="aspect-square rounded-2xl shadow-2xl relative overflow-hidden grain"
            style={{ background: `linear-gradient(135deg, ${tr.colors[0]}, ${tr.colors[1]})` }}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
              <div className="serif text-[34px] leading-none">{tr.title}</div>
              <div className="text-[12px] opacity-80 mt-1">{tr.artist}</div>
            </div>
          </motion.div>
          <div className="mt-4">
            <div className="h-1 rounded-full bg-fill-2 overflow-hidden"><div className="h-full bg-ink-2 transition-[width] duration-1000 ease-linear" style={{ width: `${(pos / tr.len) * 100}%` }} /></div>
            <div className="flex justify-between text-[10.5px] text-ink-3 mt-1 tabular-nums"><span>{fmt(pos)}</span><span>-{fmt(tr.len - pos)}</span></div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <button className="tb-btn" onClick={() => go(-1)} aria-label="Previous"><SkipBack size={20} fill="currentColor" /></button>
            <button className="size-12 rounded-full bg-ink text-win-solid grid place-items-center active:scale-95 transition" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button className="tb-btn" onClick={() => go(1)} aria-label="Next"><SkipForward size={20} fill="currentColor" /></button>
          </div>
          <div className="flex items-center gap-2 mt-3 text-ink-3"><Volume1 size={14} /><input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => set('volume', +e.target.value)} className="flex-1 accent-[var(--c-ink-2)]" /></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="eyebrow mb-2">{tt('Плейлист', 'Playlist')} · Focus</div>
          {tracks.map((x, k) => (
            <button key={x.title} onClick={() => { setI(k); setPos(0); setPlaying(true) }} className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left ${k === i ? 'bg-fill-2' : 'hover:bg-hover'}`}>
              <span className="w-5 text-center text-[11.5px] text-ink-3">
                {k === i && playing ? <span className="inline-flex gap-[2px] items-end h-3">{[0, 1, 2].map((b) => <motion.span key={b} className="w-[3px] bg-[#fa2d48] rounded-sm" animate={{ height: ['30%', '100%', '45%'] }} transition={{ repeat: Infinity, duration: 0.8, delay: b * 0.15, repeatType: 'mirror' }} />)}</span> : k + 1}
              </span>
              <span className="size-9 rounded-md flex-none" style={{ background: `linear-gradient(135deg, ${x.colors[0]}, ${x.colors[1]})` }} />
              <span className="min-w-0 flex-1"><span className="block text-[13px] truncate">{x.title}</span><span className="block text-[11.5px] text-ink-3">{x.artist}</span></span>
              <span className="text-[11.5px] text-ink-3 tabular-nums">{fmt(x.len)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
