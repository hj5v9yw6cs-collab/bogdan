/**
 * Рабочий стол: какие «файлы» лежат на столе, где они лежат и что показывают окна.
 * Факты берутся из content.ts — здесь только подача (обложки, расположение, подписи).
 *
 * Чтобы добавить иконку: добавьте объект в `items` и координаты в `layout`.
 */
import {
  l, type L, type EmployerId,
  bookingUrl, certificates, cities, contacts, employerById, nonprofit, photos, portraits, profile, projects, publications, segments, services, stages, story,
} from './content'
import type { FolderGlyph, IconKind } from '../components/icons'
import type { AppId } from '../store/windows'

export type Thumb =
  | { kind: 'photo'; src?: string; palette: [string, string, string]; pos?: string }
  | { kind: 'cover'; bg: string; ink: string; big: string; small?: string }
  | { kind: 'pdf' }
  | { kind: 'icon'; icon: IconKind }
  | { kind: 'folder'; glyph?: FolderGlyph }
  | { kind: 'note' }

export type Row = { k: L; v: L | string | null }

export type Item = {
  id: string
  label: L
  thumb: Thumb
  title: L
  subtitle: L
  /** Абзацы описания; null → пометка «нужны данные». */
  text: (L | null)[]
  /** Строка «Тип» в разделе Details. */
  type: L
  rows?: Row[]
  /** Записи из трудовой истории, показываются в Details. */
  records?: { employer: EmployerId; idx: number[] }
  preview?: { src?: string; palette: [string, string, string]; caption?: L; pos?: string }[]
  resumePreview?: boolean
  actions?: { label: L; href: string; download?: boolean }[]
  /** If set, clicking the icon opens this window instead of the Info window. */
  open?: { app: AppId; params: Record<string, string>; key: string }
}

/** Folder contents: item ids shown in a Finder-like grid. */
export type FolderDef = { id: string; title: L; glyph: FolderGlyph; children: string[]; empty?: L; intro?: L; cover?: Thumb }


/* ───────── Карьера: один «файл» на каждый этап ───────── */

const covers: Record<string, Thumb> = {
  'sber-sales': { kind: 'cover', bg: 'linear-gradient(140deg,#0b3d24,#21a038)', ink: '#ffffff', big: 'СБЕР\n01', small: '2021' },
  'sber-premium': { kind: 'cover', bg: 'linear-gradient(140deg,#0d1f17,#1e3b2c 55%,#c9a96a)', ink: '#f3e2b8', big: 'PRE\nMIER', small: '2022' },
  'sber-corp': { kind: 'cover', bg: 'linear-gradient(140deg,#21a038,#b6ec7a)', ink: '#06210c', big: 'CORP', small: '2022' },
  'sber-key': { kind: 'cover', bg: 'radial-gradient(circle at 30% 25%,#8ef5a8,#0b6b33 72%)', ink: '#ffffff', big: 'KEY', small: '2023' },
  'sber-apk': { kind: 'cover', bg: 'linear-gradient(160deg,#f6dc8c,#d29a2c 55%,#1f8a3a)', ink: '#24160a', big: 'АПК', small: 'САМАРА 2024' },
  'tbank-mid': { kind: 'cover', bg: '#ffdd2d', ink: '#121212', big: 'Т', small: '2025' },
  domilend: { kind: 'cover', bg: 'linear-gradient(140deg,#240804,#c22a10 60%,#fc3f1d)', ink: '#ffffff', big: 'DOMI\nLEND', small: '2026' },
  'tbank-midlarge': { kind: 'cover', bg: '#121212', ink: '#ffdd2d', big: 'Т', small: '2026 —' },
}

const stageLabels: Record<string, L> = {
  'sber-sales': l('Клиентский менеджер', 'Client manager'),
  'sber-premium': l('Премьер', 'Premier'),
  'sber-corp': l('Корпоративные клиенты', 'Corporate clients'),
  'sber-key': l('Ключевые клиенты', 'Key clients'),
  'sber-apk': l('Крупный и средний бизнес', 'Large & mid business'),
  'tbank-mid': l('Средний бизнес', 'Middle business'),
  domilend: l('Домиленд · Яндекс', 'Domilend · Yandex'),
  'tbank-midlarge': l('Средний и крупный бизнес', 'Mid & large business'),
}

const stageItems: Item[] = stages.map((s) => {
  const e = employerById[s.employer]
  const recs = s.records.map((i) => e.records[i])
  const roles = recs.filter((r) => r.kind !== 'end').map((r) => r.title)
  const seg = segments.find((x) => x.id === s.segment)!
  const first = recs.find((r) => r.date)?.date
  const last = [...recs].reverse().find((r) => r.date)?.date
  const dedupe = (xs: string[]) => xs.filter((v, i) => i === 0 || v !== xs[i - 1])
  const roleLine = dedupe(roles.map((r) => r.ru))
  const roleLineEn = dedupe(roles.map((r) => r.en))
  return {
    id: s.id,
    label: stageLabels[s.id],
    thumb: covers[s.id],
    title: s.label,
    subtitle: e.parent ? l(`${e.name.ru} · ${e.parent.ru}`, `${e.name.en} · ${e.parent.en}`) : e.name,
    text: [
      l(
        `${first ?? ''}${last && last !== first ? ` — ${last}` : ''}${s.current ? ' — по настоящее время' : ''}. ${roleLine.join(' → ')}.`,
        `${first ?? ''}${last && last !== first ? ` — ${last}` : ''}${s.current ? ' — present' : ''}. ${roleLineEn.join(' → ')}.`,
      ),
      ...(s.id === 'sber-sales' ? [e.summary] : []),
      ...(s.id === 'tbank-midlarge' ? [l('Текущая позиция по данным выписки СФР.', 'Current position per the official employment record.')] : []),
      null, // NEED: что делал и чего добился на этом этапе
    ],
    type: l(`Карьера > ${e.name.ru} > ${seg.title.ru}`, `Career > ${e.name.en} > ${seg.title.en}`),
    records: { employer: s.employer, idx: s.records },
  }
})

/* ───────── Биография ───────── */

const cityPhotos: Record<string, [string, string, string]> = Object.fromEntries(photos.filter((p) => p.album === 'cities').map((p) => [p.id, p.palette]))

const cityItems: Item[] = cities.map((c, i) => ({
  id: `city-${c.id}`,
  label: c.name,
  thumb: { kind: 'cover', bg: `linear-gradient(150deg, ${cityPhotos[c.id][0]}, ${cityPhotos[c.id][1]} 55%, ${cityPhotos[c.id][2]})`, ink: '#ffffff', big: c.name.ru.slice(0, 3).toUpperCase(), small: `${i + 1}/5` },
  title: c.name,
  subtitle: l(`Город ${i + 1} из 5 · Зеленодольск → Москва`, `City ${i + 1} of 5 · Zelenodolsk → Moscow`),
  text: [c.note],
  type: l('Биография > Города', 'Bio > Cities'),
  rows: [{ k: l('Годы', 'Years'), v: c.years }],
  preview: [{ palette: cityPhotos[c.id], caption: c.name }],
}))

const photoItems: Item[] = [
  { id: 'p-studio', label: l('Портрет', 'Portrait') },
  { id: 'p-tuxedo', label: l('Black tie', 'Black tie') },
  { id: 'p-boutique', label: l('Style', 'Style') },
].map(({ id, label }) => {
  const p = photos.find((x) => x.id === id)!
  return {
    id,
    label,
    thumb: { kind: 'photo', src: p.src, palette: p.palette, pos: id === 'p-studio' ? portraits.hero.position : '50% 25%' },
    title: p.title,
    subtitle: profile.name,
    text: [p.caption],
    type: l('Фото > Портреты', 'Photos > Portraits'),
    preview: [{ src: p.src, palette: p.palette }],
  }
})

const otherItems: Item[] = [
  {
    id: 'resume',
    label: l('Резюме.pdf', 'Resume.pdf'),
    thumb: { kind: 'pdf' },
    title: l('Bogdan_Starogorodtsev_Resume.pdf', 'Bogdan_Starogorodtsev_Resume.pdf'),
    subtitle: l('PDF · 1 страница', 'PDF · 1 page'),
    text: [l(
      `Карьерная история по выписке СФР: девять записей в Сбербанке, Т-Банк и Домиленд. ${profile.currentRole.ru}, ${profile.currentCompany.ru}.`,
      `Career history from the official record: nine records at Sberbank, T-Bank and Domilend. ${profile.currentRole.en}, ${profile.currentCompany.en}.`,
    )],
    type: l('Документы > Резюме', 'Documents > Resume'),
    resumePreview: true,
    actions: [{ label: l('Скачать CV', 'Download CV'), href: '/Bogdan_Starogorodtsev_Resume.pdf', download: true }],
  },
  {
    id: 'consulting',
    label: l('Career Consulting', 'Career Consulting'),
    thumb: { kind: 'cover', bg: 'radial-gradient(circle at 80% 15%,rgba(245,213,138,.55),transparent 55%),linear-gradient(140deg,#262a3b,#09090c)', ink: '#f5d58a', big: 'CAREER\nCONSULT', small: '1:1' },
    title: l('Career Consulting', 'Career Consulting'),
    subtitle: l('Карьерные консультации', 'Career consultations'),
    text: services.map((s) => l(`${s.title.ru} — ${s.text.ru}`, `${s.title.en} — ${s.text.en}`)),
    type: l('Услуги > Консультации', 'Services > Consulting'),
    rows: services.map((s) => ({ k: s.title, v: s.price })),
    actions: bookingUrl ? [{ label: l('Book a consultation', 'Book a consultation'), href: bookingUrl }] : [],
  },
]

/* ───────── Nonprofit, архив, заметки ───────── */

const archiveItems: Item[] = [
  {
    id: 'nonprofit',
    label: nonprofit.short,
    thumb: { kind: 'cover', bg: 'linear-gradient(150deg,#fff3d6,#f2b544 55%,#c8641c)', ink: '#3a1d06', big: 'FOOD\nBANK', small: '2025 — 2026' },
    title: nonprofit.role,
    subtitle: nonprofit.org,
    text: [nonprofit.description, nonprofit.note],
    type: l(`${nonprofit.badge.ru} > Фандрайзинг`, `${nonprofit.badge.en} > Fundraising`),
    actions: nonprofit.file ? [{ label: l('Открыть файл', 'Open file'), href: nonprofit.file }] : [],
    rows: [
      { k: l('Период', 'Period'), v: nonprofit.period },
      { k: l('Роль', 'Role'), v: nonprofit.role },
      { k: l('Направления', 'Focus'), v: l(nonprofit.areas.map((a) => a.ru).join(', '), nonprofit.areas.map((a) => a.en).join(', ')) },
    ],
  },
  {
    id: 'timeline',
    label: l('Карьера', 'Career'),
    thumb: { kind: 'icon', icon: 'timeline' },
    title: l('Career Timeline', 'Career Timeline'), subtitle: profile.name, text: [], type: l('Карьера', 'Career'),
    open: { app: 'timeline', params: {}, key: 'timeline' },
  },
  {
    id: 'my-story',
    label: l('Моя история', 'My Story'),
    thumb: { kind: 'note' },
    title: story.title, subtitle: profile.name, text: [], type: l('Notes', 'Notes'),
    open: { app: 'notes', params: { note: 'story' }, key: 'notes' },
  },
  {
    id: 'contact',
    label: l('Контакты', 'Contact'),
    thumb: { kind: 'icon', icon: 'contacts' },
    title: profile.name,
    subtitle: l('Карьера · бизнес · развитие', 'Career / Business Development'),
    text: [l('Самый быстрый способ связаться — Telegram.', 'The fastest way to reach me is Telegram.')],
    type: l('Контакты', 'Contact'),
    rows: [
      { k: l('Email', 'Email'), v: contacts.email || null },
      { k: l('Telegram', 'Telegram'), v: contacts.telegram ? `@${contacts.telegram}` : null },
      { k: l('Instagram', 'Instagram'), v: contacts.instagram ? `@${contacts.instagram}` : null },
    ],
    actions: [
      ...(contacts.telegram ? [{ label: l('Написать в Telegram', 'Message on Telegram'), href: `https://t.me/${contacts.telegram}` }] : []),
      ...(contacts.email ? [{ label: l('Написать на почту', 'Send an email'), href: `mailto:${contacts.email}` }] : []),
    ],
  },
]

const certItems: Item[] = certificates.map((c) => ({
  id: `cert-${c.id}`,
  label: c.title,
  thumb: c.pages[0] ? { kind: 'photo', src: c.pages[0], palette: ['#f4f4f4', '#d9d9d9', '#9a9a9a'] } : { kind: 'pdf' },
  title: c.title, subtitle: c.organization, text: [c.description], type: l('Сертификаты', 'Certificates'),
  open: { app: 'cert', params: { cert: c.id }, key: `cert:${c.id}` },
}))

const pressItems: Item[] = publications.map((p) => ({
  id: `press-${p.id}`,
  label: l(`${p.source} — ${fmtDate(p.date)}`, `${p.source} — ${fmtDate(p.date)}`),
  thumb: p.image ? { kind: 'photo', src: p.image, palette: ['#e9e9f2', '#3346a3', '#111'], pos: '78% 50%' } : { kind: 'cover', bg: '#111', ink: '#fff', big: p.source.slice(0, 3).toUpperCase() },
  title: p.title, subtitle: l(p.source, p.source), text: [p.description], type: l('Пресса', 'Press'),
  open: { app: 'press', params: { pub: p.id }, key: `press:${p.id}` },
}))

const projectItems: Item[] = projects.map((p) => ({
  id: `project-${p.id}`, label: p.title, thumb: { kind: 'cover', bg: '#222', ink: '#fff', big: p.title.en.slice(0, 4).toUpperCase() },
  title: p.title, subtitle: profile.name, text: [p.description], type: l('Проекты', 'Projects'),
  actions: p.url ? [{ label: l('Открыть', 'Open'), href: p.url }] : [],
}))

export function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export const folders: Record<string, FolderDef> = {
  sber: {
    id: 'sber', title: employerById.sber.name, glyph: 'career', intro: employerById.sber.summary,
    children: stages.filter((s) => s.employer === 'sber').map((s) => s.id),
    cover: { kind: 'cover', bg: 'linear-gradient(140deg,#0b3d24,#21a038)', ink: '#ffffff', big: 'СБЕР', small: '2021 — 2025' },
  },
  tbank: {
    id: 'tbank', title: employerById.tbank.name, glyph: 'career', intro: employerById.tbank.summary,
    children: stages.filter((s) => s.employer === 'tbank').map((s) => s.id),
    cover: { kind: 'cover', bg: '#ffdd2d', ink: '#121212', big: 'Т', small: '2025 —' },
  },
  photos: { id: 'photos', title: l('Фото', 'Photos'), glyph: 'photos', children: photoItems.map((i) => i.id) },
  cities: { id: 'cities', title: l('Города', 'Cities'), glyph: 'photos', children: cityItems.map((i) => i.id) },
  certificates: { id: 'certificates', title: l('Сертификаты', 'Certificates'), glyph: 'education', children: certItems.map((i) => i.id), empty: l('Здесь появятся сертификаты и документы об обучении в Сбере.', 'Sber certificates and training documents will appear here.') },
  press: { id: 'press', title: l('Пресса', 'Press'), glyph: 'contact', children: pressItems.map((i) => i.id) },
  projects: { id: 'projects', title: l('Проекты', 'Projects'), glyph: 'projects', children: ['consulting', ...projectItems.map((i) => i.id)], empty: l('Другие проекты', 'More projects') },
}

const folderItems: Item[] = Object.values(folders).map((f) => ({
  id: `f-${f.id}`, label: f.title, thumb: f.cover ?? { kind: 'folder', glyph: f.glyph }, title: f.title, subtitle: profile.name, text: [], type: l('Папка', 'Folder'),
  open: { app: 'folder', params: { folder: f.id }, key: `folder:${f.id}` },
}))

export const items: Item[] = [...stageItems, ...cityItems, ...photoItems, ...otherItems, ...archiveItems, ...certItems, ...pressItems, ...projectItems, ...folderItems]
export const itemById = Object.fromEntries(items.map((i) => [i.id, i])) as Record<string, Item>

/* ───────── Окна из Dock ───────── */

export const bin: Item = {
  id: 'bin',
  label: l('Корзина', 'Bin'),
  thumb: { kind: 'icon', icon: 'trash' },
  title: l('Корзина', 'Bin'),
  subtitle: l('Пусто', 'Empty'),
  text: [l('Корзина пуста.', 'The bin is empty.')],
  type: l('Корзина', 'Bin'),
}

export type Alert = { id: string; app: L; icon: 'sheets' | 'crm' | 'slides' | 'warning'; text: L; button: L }

/** Шуточные «системные» диалоги из Dock, как на референсе. */
export const alerts: Alert[] = [
  { id: 'sheets', icon: 'sheets', app: l('Таблицы', 'Sheets'), text: l('ВПР вернула #Н/Д. Похоже, данные снова лежат на соседнем листе.', 'VLOOKUP returned #N/A. Looks like the data is on another sheet again.'), button: l('Проверить ещё раз', 'Check again') },
  { id: 'crm', icon: 'crm', app: l('CRM', 'CRM'), text: l('Все карточки клиентов заполнены. Система подозревает, что это сон.', 'Every client card is filled in. The system suspects it is a dream.'), button: l('Ущипнуть себя', 'Pinch myself') },
  { id: 'slides', icon: 'slides', app: l('Презентации', 'Slides'), text: l('Слайд 37 из 12. Кажется, это была «короткая» презентация.', 'Slide 37 of 12. Looks like this was a “short” presentation.'), button: l('Сократить', 'Cut it down') },
  { id: 'error', icon: 'warning', app: l('Ошибка', 'Error'), text: l('Отпуск не найден. Попробуйте позже.', 'Vacation not found. Please try again later.'), button: l('Вернуться к работе', 'Back to work') },
]

export const links = {
  instagram: contacts.instagram ? `https://instagram.com/${contacts.instagram}` : '',
  telegram: contacts.telegram ? `https://t.me/${contacts.telegram}` : '',
  mail: contacts.email ? `mailto:${contacts.email}` : '',
}

/* ───────── Расположение иконок (центр иконки в % экрана) ───────── */

const desktopSlots: [number, number][] = [
  [27, 24], [40, 30], [52, 21], [63, 34], [33, 45], [19, 39], [61, 14], [72, 22], [46, 50], [23, 58],
  [36, 64], [79, 46], [89, 31], [66, 57],
]

const order = [
  'f-sber', 'f-tbank', 'domilend', 'nonprofit', 'timeline', 'my-story', 'resume', 'f-photos', 'f-cities', 'f-certificates',
  'f-press', 'f-projects', 'consulting', 'contact',
]

// Mobile: a loose three-column scatter to the right of the vertical Dock.
const mobileSlots: [number, number][] = order.map((_, i) => {
  const col = i % 3
  const row = Math.floor(i / 3)
  const nudge = ((i * 37) % 5) - 2
  return [37 + col * 23 + nudge * 0.5, 5 + row * 11.3 + (col === 1 ? 5 : 0)]
})

export const layout: Record<string, { d: [number, number]; m: [number, number] }> = Object.fromEntries(
  order.map((id, i) => [id, { d: desktopSlots[i], m: mobileSlots[i] }]),
)
export const desktopOrder = order
