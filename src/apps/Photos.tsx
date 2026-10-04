import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Images, MapPin, Briefcase, Heart, X } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { PhotoArt } from '../components/PhotoArt'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { albums, photos } from '../data/content'

type AlbumId = (typeof albums)[number]['id']
const albumIcon = { all: Images, cities: MapPin, work: Briefcase, life: Heart }

export default function Photos() {
  const { win, mobile } = useWindow()
  const { t, tt } = useLang()
  const [album, setAlbum] = useState<AlbumId>('all')
  const [viewer, setViewer] = useState<string | null>(null)

  useEffect(() => {
    if (win.params.photo) { setAlbum('all'); setViewer(win.params.photo) }
    else if (win.params.album) setAlbum(win.params.album as AlbumId)
  }, [win.nonce, win.params.photo, win.params.album])

  const list = album === 'all' ? photos : photos.filter((p) => p.album === album)
  const idx = list.findIndex((p) => p.id === viewer)
  const cur = idx >= 0 ? list[idx] : null
  const step = (d: number) => setViewer(list[(idx + d + list.length) % list.length].id)

  useEffect(() => {
    if (!cur) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'Escape') setViewer(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="flex h-full min-h-0">
      {!mobile && (
        <aside className="w-[188px] flex-none bg-side border-r border-line pt-[52px] px-2.5">
          <div className="px-2 pb-1 text-[11px] font-semibold text-ink-3">{tt('Медиатека', 'Library')}</div>
          {albums.map((a) => {
            const I = albumIcon[a.id]
            return (
              <button key={a.id} onClick={() => { setAlbum(a.id); setViewer(null) }} className={`w-full flex items-center gap-2.5 h-7 px-2 rounded-md text-[13px] ${album === a.id ? 'bg-fill-2' : 'hover:bg-hover'}`}>
                <I size={15} className="text-accent" strokeWidth={1.8} />{t(a.name)}
                <span className="ml-auto text-[11px] text-ink-3">{a.id === 'all' ? photos.length : photos.filter((p) => p.album === a.id).length}</span>
              </button>
            )
          })}
        </aside>
      )}
      <div className="flex-1 min-w-0 flex flex-col bg-win-solid relative">
        <Toolbar inset={mobile} className={mobile ? '' : 'pl-5'}>
          <div className="font-semibold text-[13px]">{t(albums.find((a) => a.id === album)!.name)}</div>
          <div className="text-[12px] text-ink-3">{list.length} {tt('фото', 'photos')}</div>
          {mobile && (
            <select value={album} onChange={(e) => setAlbum(e.target.value as AlbumId)} className="ml-auto h-7 rounded-md bg-fill border border-line text-[12px] px-2" data-no-drag>
              {albums.map((a) => <option key={a.id} value={a.id}>{t(a.name)}</option>)}
            </select>
          )}
        </Toolbar>
        <div className="scroll flex-1 min-h-0 px-3 pb-4">
          <motion.div layout className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? 104 : 150}px, 1fr))` }}>
            <AnimatePresence>
              {list.map((p, i) => (
                <motion.button
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), type: 'spring', stiffness: 420, damping: 32 }}
                  onClick={() => setViewer(p.id)}
                  className="relative aspect-square group outline-none"
                >
                  <motion.div layoutId={`ph-${win.id}-${p.id}`} className="absolute inset-0">
                    <PhotoArt src={p.src} palette={p.palette} label={t(p.title)} sub={p.year ?? undefined} rounded="rounded-md" className="size-full" position="50% 25%" />
                  </motion.div>
                  <span className="absolute inset-0 rounded-md ring-0 group-hover:ring-2 ring-accent/60 transition-all" />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence>
          {cur && (
            <motion.div className="absolute inset-0 z-20 bg-black/92 backdrop-blur-xl flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="h-[52px] flex items-center justify-between pl-[84px] pr-3 text-white/90">
                <div className="text-[13px] font-semibold truncate">{t(cur.title)}</div>
                <button className="tb-btn !text-white/80 hover:!bg-white/10" onClick={() => setViewer(null)} aria-label="Close"><X size={17} /></button>
              </div>
              <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-14">
                <motion.div layoutId={`ph-${win.id}-${cur.id}`} key={cur.id} className="relative h-full max-h-full aspect-[4/5] max-w-full">
                  <PhotoArt src={cur.src} palette={cur.palette} label={t(cur.title)} big rounded="rounded-lg" className="size-full shadow-2xl" />
                </motion.div>
                <button onClick={() => step(-1)} className="absolute left-3 size-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white" aria-label="Previous"><ChevronLeft size={18} /></button>
                <button onClick={() => step(1)} className="absolute right-3 size-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white" aria-label="Next"><ChevronRight size={18} /></button>
              </div>
              <div className="p-4 text-center text-white/80 text-[12.5px] min-h-[56px] [&_span]:!text-amber-300">
                {cur.caption ? t(cur.caption) : <Need label={tt('подпись', 'caption')} />}
                <span className="mx-2 opacity-40">·</span>
                {cur.year ?? <Need label={tt('год', 'year')} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
