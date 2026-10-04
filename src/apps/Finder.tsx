import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, Monitor, AppWindow, House, Trash2, ChevronRight as Chevron } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { ItemIcon, useOpenAction } from '../components/ItemIcon'
import { folders, allItems, mainFolderItems, type FolderId, type FsItem } from '../data/fs'
import { useLang } from '../lib/i18n'
import { FolderIcon } from '../components/icons'

const isFolderId = (v: string | undefined): v is FolderId => !!v && v in folders

export default function Finder() {
  const { win, mobile } = useWindow()
  const { t, tt } = useLang()
  const openAction = useOpenAction()
  const start: FolderId = isFolderId(win.params.path) ? win.params.path : 'home'
  const [hist, setHist] = useState<{ stack: FolderId[]; i: number }>({ stack: [start], i: 0 })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [sidebar, setSidebar] = useState(!mobile)
  const current = hist.stack[hist.i]
  const folder = folders[current]

  const go = (id: FolderId) => {
    if (id === current) return
    setHist(({ stack, i }) => ({ stack: [...stack.slice(0, i + 1), id], i: i + 1 }))
    setSelected(null)
    setQuery('')
    if (mobile) setSidebar(false)
  }

  // Re-opening Finder with a new path (from desktop / dock) navigates.
  useEffect(() => {
    if (win.nonce > 0 && isFolderId(win.params.path)) go(win.params.path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.nonce])

  const items = useMemo(() => {
    if (!query.trim()) return folder.items
    const q = query.trim().toLowerCase()
    const seen = new Set<string>()
    return allItems.filter((it) => {
      const hit = (t(it.name) + ' ' + (it.keywords ?? '') + ' ' + (it.description ? t(it.description) : '')).toLowerCase().includes(q)
      if (!hit || seen.has(it.id)) return false
      seen.add(it.id)
      return true
    })
  }, [query, folder, t])

  const openItem = (it: FsItem) => {
    if ('folder' in it.action) go(it.action.folder)
    else openAction(it.action)
  }

  const sel = items.find((i) => i.id === selected) ?? null
  const showPreview = !mobile && view === 'grid'

  const fav: [FolderId, string, typeof House][] = [
    ['home', tt('Богдан', 'Bogdan'), House],
    ['desktop', tt('Рабочий стол', 'Desktop'), Monitor],
    ['applications', tt('Программы', 'Applications'), AppWindow],
  ]

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: mobile ? 210 : 196, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            className={`${mobile ? 'absolute inset-y-0 left-0 z-20 shadow-2xl bg-win-solid' : 'relative bg-side'} flex-none border-r border-line overflow-hidden`}
          >
            <div className="scroll h-full pt-[52px] pb-3 px-2.5 w-[196px]">
              <SideGroup label={tt('Избранное', 'Favorites')}>
                {fav.map(([id, label, I]) => (
                  <SideItem key={id} active={current === id} onClick={() => go(id)} icon={<I size={15} strokeWidth={1.8} className="text-accent" />} label={label} />
                ))}
              </SideGroup>
              <SideGroup label={tt('Папки', 'Folders')}>
                {mainFolderItems.map((f) => {
                  const id = (f.action as { folder: FolderId }).folder
                  return <SideItem key={id} active={current === id} onClick={() => go(id)} icon={<FolderIcon size={17} />} label={t(f.name)} />
                })}
              </SideGroup>
              <SideGroup label={tt('Места', 'Locations')}>
                <SideItem active={current === 'trash'} onClick={() => go('trash')} icon={<Trash2 size={15} strokeWidth={1.8} className="text-accent" />} label={tt('Корзина', 'Trash')} />
              </SideGroup>
              <SideGroup label={tt('Теги', 'Tags')}>
                {[['#ff453a', 'Career'], ['#ff9f0a', 'Growth'], ['#30d158', 'Finance'], ['#0a84ff', 'Consulting']].map(([c, n]) => (
                  <div key={n} className="flex items-center gap-2.5 px-2 h-7 text-[13px] text-ink-2">
                    <span className="size-2.5 rounded-full" style={{ background: c }} />{n}
                  </div>
                ))}
              </SideGroup>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col bg-win-solid">
        <Toolbar inset={!sidebar || mobile} className={sidebar && !mobile ? 'pl-3' : ''}>
          <div className="flex items-center gap-0.5">
            <button className="tb-btn" onClick={() => setSidebar((s) => !s)} aria-label="Sidebar">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x=".7" y=".7" width="16.6" height="12.6" rx="2.5" /><path d="M6.5 1v12" /></svg>
            </button>
            <button className="tb-btn" disabled={hist.i === 0} onClick={() => setHist((h) => ({ ...h, i: h.i - 1 }))} aria-label="Back"><ChevronLeft size={18} /></button>
            <button className="tb-btn" disabled={hist.i === hist.stack.length - 1} onClick={() => setHist((h) => ({ ...h, i: h.i + 1 }))} aria-label="Forward"><ChevronRight size={18} /></button>
          </div>
          <div className="font-semibold text-[13px] truncate min-w-0 flex-1">{query ? tt('Поиск', 'Search') : t(folder.name)}</div>
          {!mobile && (
            <div className="flex items-center rounded-md bg-fill p-0.5" data-no-drag>
              <button className="tb-btn h-6" data-active={view === 'grid'} onClick={() => setView('grid')} aria-label="Icons"><LayoutGrid size={15} /></button>
              <button className="tb-btn h-6" data-active={view === 'list'} onClick={() => setView('list')} aria-label="List"><List size={15} /></button>
            </div>
          )}
          <label className="relative flex items-center" data-no-drag>
            <Search size={13} className="absolute left-2 text-ink-3" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tt('Поиск', 'Search')} className="h-7 w-28 sm:w-40 rounded-md bg-fill pl-7 pr-2 text-[12.5px] outline-none focus:ring-3 focus:ring-sel border border-line" />
          </label>
        </Toolbar>

        <div className="flex flex-1 min-h-0 border-t border-line">
          <div className="scroll flex-1 min-w-0" onClick={() => setSelected(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current + view + (query ? 'q' : '')}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="min-h-full"
              >
                {current === 'home' && !query && <HomeHeader />}
                {items.length === 0 ? (
                  <div className="h-60 grid place-items-center text-ink-3 text-center px-6">
                    {current === 'trash' && !query ? tt('Корзина пуста. Здесь нет места сомнениям.', 'Trash is empty. No room for doubts here.') : tt('Ничего не найдено', 'No results')}
                  </div>
                ) : view === 'grid' || mobile ? (
                  <div className="grid gap-x-2 gap-y-4 p-5" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? 92 : 108}px, 1fr))` }}>
                    {items.map((it, i) => (
                      <motion.button
                        key={it.id}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.025, 0.3), type: 'spring', stiffness: 500, damping: 32 }}
                        className="group flex flex-col items-center gap-1.5 rounded-lg p-1.5 outline-none"
                        onClick={(e) => { e.stopPropagation(); if (mobile) openItem(it); else setSelected(it.id) }}
                        onDoubleClick={() => openItem(it)}
                      >
                        <div className={`rounded-lg p-1.5 transition-colors ${selected === it.id ? 'bg-fill-2' : 'group-hover:bg-fill'}`}>
                          <ItemIcon icon={it.icon} size={60} />
                        </div>
                        <span className={`max-w-full px-1.5 py-px rounded text-[12px] leading-tight text-center line-clamp-2 break-words ${selected === it.id ? 'bg-accent text-white' : ''}`}>
                          {t(it.name)}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <table className="w-full text-[12.5px]">
                    <thead className="sticky top-0 bg-win-solid/90 backdrop-blur text-ink-2 text-left">
                      <tr className="border-b border-line">
                        <th className="font-medium py-1.5 pl-5">{tt('Имя', 'Name')}</th>
                        <th className="font-medium py-1.5">{tt('Дата', 'Date')}</th>
                        <th className="font-medium py-1.5">{tt('Размер', 'Size')}</th>
                        <th className="font-medium py-1.5 pr-4">{tt('Тип', 'Kind')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr
                          key={it.id}
                          onClick={(e) => { e.stopPropagation(); setSelected(it.id) }}
                          onDoubleClick={() => openItem(it)}
                          className={selected === it.id ? 'bg-accent text-white' : i % 2 ? 'bg-fill' : ''}
                        >
                          <td className="py-1 pl-5"><div className="flex items-center gap-2"><ItemIcon icon={it.icon} size={20} /><span className="truncate">{t(it.name)}</span></div></td>
                          <td className={`py-1 ${selected === it.id ? '' : 'text-ink-2'}`}>{it.date ?? '—'}</td>
                          <td className={`py-1 ${selected === it.id ? '' : 'text-ink-2'}`}>{it.size ?? '—'}</td>
                          <td className={`py-1 pr-4 ${selected === it.id ? '' : 'text-ink-2'}`}>{t(it.kindLabel)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {showPreview && (
            <aside className="hidden @container lg:flex w-[230px] flex-none border-l border-line flex-col items-center p-5 text-center bg-win-solid/40 [@media(min-width:1100px)]:flex">
              <AnimatePresence mode="wait">
                {sel ? (
                  <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col items-center w-full">
                    <ItemIcon icon={sel.icon} size={112} />
                    <div className="mt-4 font-semibold text-[14px] break-words">{t(sel.name)}</div>
                    <div className="text-ink-3 text-[12px] mt-0.5">{t(sel.kindLabel)}{sel.size ? ` · ${sel.size}` : ''}</div>
                    {sel.description && <p className="text-ink-2 text-[12.5px] mt-3 leading-relaxed">{t(sel.description)}</p>}
                    <button className="btn-primary mt-5 h-8 text-[12px]" onClick={() => openItem(sel)}>{tt('Открыть', 'Open')}</button>
                  </motion.div>
                ) : (
                  <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-auto text-ink-3 text-[12px]">
                    {tt('Выберите объект для просмотра', 'Select an item to preview')}
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>
          )}
        </div>

        {/* Path bar */}
        <div className="h-7 flex-none border-t border-line flex items-center gap-1 px-4 text-[11.5px] text-ink-2 bg-bar">
          <span className="flex items-center gap-1 hover:text-ink cursor-default" onClick={() => go('home')}><FolderIcon size={13} />Macintosh HD</span>
          <Chevron size={11} className="text-ink-3" />
          <span className="hover:text-ink cursor-default" onClick={() => go('home')}>{tt('Богдан', 'Bogdan')}</span>
          {current !== 'home' && (<><Chevron size={11} className="text-ink-3" /><span className="text-ink truncate">{t(folder.name)}</span></>)}
          <span className="ml-auto text-ink-3">{items.length} {tt('объектов', 'items')}</span>
        </div>
      </div>
    </div>
  )
}

function HomeHeader() {
  const { tt } = useLang()
  return (
    <div className="px-6 pt-6 pb-1">
      <div className="eyebrow">/Users/bogdan</div>
      <div className="serif text-[30px] leading-none mt-2">{tt('Богдан Старогородцев', 'Bogdan Starogorodtsev')}</div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-ink-2">
        {['Sberbank', 'T-Bank', 'Yandex'].map((c, i) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-fill border border-line text-ink">{c}</span>
            {i < 2 && <span className="text-ink-3">→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

function SideGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="px-2 pb-1 text-[11px] font-semibold text-ink-3">{label}</div>
      {children}
    </div>
  )
}

function SideItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 h-7 px-2 rounded-md text-[13px] text-left transition-colors ${active ? 'bg-fill-2' : 'hover:bg-hover'}`}>
      <span className="w-[18px] grid place-items-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}
