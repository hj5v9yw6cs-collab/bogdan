import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useWindows } from '../store/windows'
import { useLang } from '../lib/i18n'
import { useIsMobile } from '../lib/hooks'
import { certificates, portraits, publications } from '../data/content'
import { alerts, bin, desktopOrder, folders, itemById, layout, links } from '../data/desktop'
import { Thumb } from './Thumb'
import { Panel } from './Panel'
import { AlertBody, InfoBody } from './Bodies'
import { CertBody, FolderBody, NotesBody, PressBody, TimelineBody } from './Apps'
import { AppIcon, type IconKind } from './icons'

/** The whole site: a full-screen desktop with scattered "files", Get-Info windows and a Dock. */
export function Desk() {
  const mobile = useIsMobile()
  const root = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ro = new ResizeObserver(() => setBounds({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={root} className="desk fixed inset-0 overflow-hidden select-none" style={{ height: '100dvh' }}>
      <Wallpaper />
      {bounds.w > 0 && (
        <>
          <Icons bounds={bounds} mobile={mobile} />
          <Windows bounds={bounds} mobile={mobile} />
        </>
      )}
      <Dock mobile={mobile} />
    </div>
  )
}

function Wallpaper() {
  // Close-up portrait as the desktop picture: softened and darkened so white labels stay readable.
  return (
    <div className="absolute inset-0 bg-[#1b1b1d] pointer-events-none overflow-hidden">
      <motion.img
        src={portraits.avatar.src}
        alt=""
        draggable={false}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: '50% 38%', filter: 'blur(6px) saturate(0.9)' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,12,0.30) 0%, rgba(10,10,12,0.18) 45%, rgba(10,10,12,0.55) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 45%, transparent 45%, rgba(10,10,12,0.55) 100%)' }} />
      <div className="absolute inset-0 grain opacity-70" />
    </div>
  )
}

function Icons({ bounds, mobile }: { bounds: { w: number; h: number }; mobile: boolean }) {
  const { t } = useLang()
  const { windows, open, close, focus, focusedId } = useWindows()
  const [sel, setSel] = useState<string | null>(null)
  const size = mobile ? 52 : 60

  const activate = (id: string) => {
    setSel(id)
    const it = itemById[id]
    const key = it.open?.key ?? `info:${id}`
    const w = windows.find((x) => x.id === key)
    if (!w) (it.open ? open(it.open.app, it.open.params, key) : open('info', { item: id }, key))
    else if (focusedId === key) close(key)
    else focus(key)
  }

  return (
    <div className="absolute inset-0" onPointerDown={(e) => { if (e.target === e.currentTarget) setSel(null) }}>
      {desktopOrder.map((id, i) => {
        const it = itemById[id]
        const [px, py] = mobile ? layout[id].m : layout[id].d
        const selected = sel === id
        return (
          <motion.div
            key={id}
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{ left: -px / 100 * bounds.w + 30, right: (1 - px / 100) * bounds.w - 30, top: -py / 100 * bounds.h + 20, bottom: (1 - py / 100) * bounds.h - 60 }}
            onDragStart={() => setSel(id)}
            onTap={() => activate(id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.03, type: 'spring', stiffness: 380, damping: 26 }}
            whileDrag={{ zIndex: 5 }}
            className="absolute flex flex-col items-center cursor-default touch-none"
            style={{ left: `${px}%`, top: `${py}%`, width: mobile ? 96 : 132, marginLeft: mobile ? -48 : -66, marginTop: -size / 2 }}
            role="button"
            tabIndex={0}
            aria-label={t(it.label)}
            onKeyDown={(e) => e.key === 'Enter' && activate(id)}
          >
            <div className={`p-[4px] rounded-[4px] border ${selected ? 'bg-black/25 border-white/40' : 'border-transparent'}`}>
              <Thumb t={it.thumb} size={size} />
            </div>
            <span className={`icon-label mt-[3px] ${selected ? 'is-selected' : ''}`}>{t(it.label)}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

function Windows({ bounds, mobile }: { bounds: { w: number; h: number }; mobile: boolean }) {
  const { windows, focusedId, close } = useWindows()
  const { t, tt } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && focusedId) close(focusedId) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusedId, close])

  return (
    <AnimatePresence>
      {windows.map((w) => {
        const focused = focusedId === w.id
        if (w.app === 'alert') {
          const a = alerts.find((x) => x.id === w.params.alert)!
          return (
            <Panel key={w.id} win={w} title={t(a.app)} width={350} bounds={bounds} mobile={mobile} dark focused={focused}>
              <AlertBody a={a} onClose={() => close(w.id)} />
            </Panel>
          )
        }
        const info = tt('Информация', 'Information about')
        if (w.app === 'notes') {
          return (
            <Panel key={w.id} win={w} title="Notes" width={640} height={470} bounds={bounds} mobile={mobile} focused={focused}>
              <NotesBody key={w.nonce} initial={w.params.note} mobile={mobile} />
            </Panel>
          )
        }
        if (w.app === 'folder') {
          const f = folders[w.params.folder]
          return (
            <Panel key={w.id} win={w} title={t(f.title)} width={560} bounds={bounds} mobile={mobile} focused={focused}>
              <FolderBody id={f.id} />
            </Panel>
          )
        }
        if (w.app === 'cert') {
          const c = certificates.find((x) => x.id === w.params.cert)!
          return (
            <Panel key={w.id} win={w} title={`Preview — ${t(c.title)}`} width={620} height={640} bounds={bounds} mobile={mobile} focused={focused}>
              <CertBody id={c.id} />
            </Panel>
          )
        }
        if (w.app === 'press') {
          const p = publications.find((x) => x.id === w.params.pub)!
          return (
            <Panel key={w.id} win={w} title={`Safari — ${p.source}`} width={600} bounds={bounds} mobile={mobile} focused={focused}>
              <PressBody id={p.id} />
            </Panel>
          )
        }
        if (w.app === 'timeline') {
          return (
            <Panel key={w.id} win={w} title="Career Timeline" width={600} bounds={bounds} mobile={mobile} focused={focused}>
              <TimelineBody />
            </Panel>
          )
        }
        const item = w.params.item === 'bin' ? bin : itemById[w.params.item]
        return (
          <Panel key={w.id} win={w} title={`${info}: ${t(item.title)}`} width={576} height={item.preview?.length || item.resumePreview ? 560 : undefined} bounds={bounds} mobile={mobile} focused={focused}>
            <InfoBody item={item} />
          </Panel>
        )
      })}
    </AnimatePresence>
  )
}

type DockEntry = { id: string; icon: IconKind; tip: string; onClick: () => void } | 'sep'

function Dock({ mobile }: { mobile: boolean }) {
  const { open } = useWindows()
  const { t, tt, lang, setLang } = useLang()
  const go = (href: string) => () => { if (href) window.open(href, href.startsWith('mailto:') ? '_self' : '_blank') }

  const entries: DockEntry[] = [
    ...alerts.map((a) => ({ id: a.id, icon: a.icon as IconKind, tip: t(a.app), onClick: () => open('alert', { alert: a.id }, `alert:${a.id}`) })),
    'sep',
    { id: 'notes', icon: 'notes', tip: 'Notes', onClick: () => open('notes', {}, 'notes') },
    { id: 'photos', icon: 'photos', tip: tt('Фото', 'Photos'), onClick: () => open('folder', { folder: 'photos' }, 'folder:photos') },
    { id: 'press', icon: 'safari', tip: tt('Пресса', 'Press'), onClick: () => open('folder', { folder: 'press' }, 'folder:press') },
    'sep',
    { id: 'instagram', icon: 'instagram', tip: 'Instagram', onClick: go(links.instagram) },
    { id: 'telegram', icon: 'telegram', tip: 'Telegram', onClick: go(links.telegram) },
    { id: 'mail', icon: 'mail', tip: tt('Почта', 'Mail'), onClick: go(links.mail) },
    'sep',
    { id: 'lang', icon: 'lang', tip: lang === 'ru' ? 'English' : 'Русский', onClick: () => setLang(lang === 'ru' ? 'en' : 'ru') },
    { id: 'bin', icon: 'trash', tip: tt('Корзина', 'Bin'), onClick: () => open('info', { item: 'bin' }, 'info:bin') },
  ]

  return (
    <motion.nav
      initial={mobile ? { x: -90, opacity: 0 } : { y: 90, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 28 }}
      className={`dock-bar absolute z-[100000] flex ${mobile ? 'flex-col left-[14px] top-1/2 -translate-y-1/2 px-[7px] py-[10px] gap-[10px]' : 'left-1/2 -translate-x-1/2 bottom-[48px] px-[12px] py-[9px] gap-[12px] items-center'}`}
    >
      {entries.map((e, i) =>
        e === 'sep' ? (
          <span key={`s${i}`} className={mobile ? 'h-px w-[30px] mx-auto bg-black/15' : 'w-px h-[40px] bg-black/15'} />
        ) : (
          <DockButton key={e.id} e={e} mobile={mobile} />
        ),
      )}
    </motion.nav>
  )
}

function DockButton({ e, mobile }: { e: Exclude<DockEntry, 'sep'>; mobile: boolean }) {
  const [hover, setHover] = useState(false)
  const size = mobile ? 40 : 44
  return (
    <button
      aria-label={e.tip}
      className="relative outline-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={(ev) => ev.preventDefault()}
      onClick={e.onClick}
    >
      <motion.span className="block [&>svg]:size-full" style={{ width: size, height: size }} whileTap={{ scale: 0.9 }}>
        <AppIcon kind={e.icon} size={size} />
      </motion.span>
      <AnimatePresence>
        {hover && !mobile && (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="dock-tip absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+20px)]"
          >
            {e.tip}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
