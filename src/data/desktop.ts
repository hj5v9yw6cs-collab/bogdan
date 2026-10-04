/**
 * Рабочий стол: какие «файлы» лежат на столе, где они лежат и что показывают окна.
 * Факты берутся из content.ts — здесь только подача (обложки, расположение, подписи).
 *
 * Чтобы добавить иконку: добавьте объект в `items` и координаты в `layout`.
 */
import {
  l, type L, type EmployerId,
  bookingUrl, childhood, cities, contacts, education, employerById, photos, portraits, profile, segments, services, stages,
} from './content'
import type { IconKind } from '../components/icons'

export type Thumb =
  | { kind: 'photo'; src?: string; palette: [string, string, string]; pos?: string }
  | { kind: 'cover'; bg: string; ink: string; big: string; small?: string }
  | { kind: 'pdf' }
  | { kind: 'icon'; icon: IconKind }

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
}


/* ───────── Карьера: один «файл» на каждый этап ───────── */

const covers: Record<string, Thumb> = {
  'early-cc': { kind: 'cover', bg: 'linear-gradient(140deg,#e7e4dd,#a7a39b)', ink: '#151515', big: 'CALL\nCENTER', small: '2020' },
  'early-lp': { kind: 'cover', bg: 'linear-gradient(140deg,#3a3a3a,#0e0e0e)', ink: '#f2f2f2', big: 'LOSS\nPREV.', small: '2021' },
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
  'early-cc': l('Ситистафф', 'Citystaff'),
  'early-lp': l('Лабиринт-Волга', 'Labirint-Volga'),
  'sber-sales': l('Сбер · продажи', 'Sber · sales'),
  'sber-premium': l('Сбер · Премьер', 'Sber · Premier'),
  'sber-corp': l('Сбер · корпоратив', 'Sber · corporate'),
  'sber-key': l('Сбер · ключевые', 'Sber · key clients'),
  'sber-apk': l('Сбер · АПК', 'Sber · agribusiness'),
  'tbank-mid': l('Т-Банк 2025', 'T-Bank 2025'),
  domilend: l('Домиленд', 'Domilend'),
  'tbank-midlarge': l('Т-Банк · СКБ', 'T-Bank · mid & large'),
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
      `Вся трудовая история по выписке СФР: ранний опыт, девять записей в Сбербанке, Т-Банк и Домиленд. ${profile.currentRole.ru}, ${profile.currentCompany.ru}.`,
      `Full employment history from the official record: early jobs, nine records at Sberbank, T-Bank and Domilend. ${profile.currentRole.en}, ${profile.currentCompany.en}.`,
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
  {
    id: 'education',
    label: l('Образование', 'Education'),
    thumb: { kind: 'cover', bg: 'linear-gradient(140deg,#14213d,#3a5a99)', ink: '#ffffff', big: 'EDU', small: '2026' },
    title: l('Образование', 'Education'),
    subtitle: l('Школа, колледжи и следующая глава — финансы', 'School, colleges and the next chapter — finance'),
    text: [...education].reverse().map((e) => l(
      `${e.title.ru} — ${e.place.ru}${e.status ? `. ${e.status.ru}` : ''}.`,
      `${e.title.en} — ${e.place.en}${e.status ? `. ${e.status.en}` : ''}.`,
    )),
    type: l('Биография > Образование', 'Bio > Education'),
    rows: [...education].reverse().map((e) => ({ k: e.title, v: e.period })),
  },
  {
    id: 'sport',
    label: l('Спорт', 'Sport'),
    thumb: { kind: 'cover', bg: 'linear-gradient(140deg,#0f0c29,#302b63 60%,#24c6dc)', ink: '#ffffff', big: 'GYM', small: 'ЗЕЛЕНОДОЛЬСК' },
    title: l('Спорт', 'Sport'),
    subtitle: l('Детство · Зеленодольск', 'Childhood · Zelenodolsk'),
    text: [l(`${childhood[0].title.ru}, затем ${childhood[1].title.ru.toLowerCase()}.`, `${childhood[0].title.en}, then ${childhood[1].title.en.toLowerCase()}.`)],
    type: l('Биография > Детство', 'Bio > Childhood'),
  },
  {
    id: 'guitar',
    label: l('Гитара', 'Guitar'),
    thumb: { kind: 'cover', bg: 'linear-gradient(140deg,#3a1c71,#d76d77 60%,#ffaf7b)', ink: '#ffffff', big: 'GUI\nTAR', small: '♪' },
    title: l('Гитара', 'Guitar'),
    subtitle: l('Детство · Зеленодольск', 'Childhood · Zelenodolsk'),
    text: [l(`${childhood[2].title.ru}. ${childhood[2].note!.ru}.`, `${childhood[2].title.en}. ${childhood[2].note!.en}.`)],
    type: l('Биография > Детство', 'Bio > Childhood'),
  },
]

export const items: Item[] = [...stageItems, ...cityItems, ...photoItems, ...otherItems]
export const itemById = Object.fromEntries(items.map((i) => [i.id, i])) as Record<string, Item>

/* ───────── Окна из Dock ───────── */

export const gallery: Item = {
  id: 'gallery',
  label: l('Фото', 'Photos'),
  thumb: { kind: 'icon', icon: 'photos' },
  title: l('Галерея', 'Gallery'),
  subtitle: l('Портреты и моменты', 'Portraits and moments'),
  text: [],
  type: l('Фото', 'Photos'),
  preview: photos.filter((p) => p.src).map((p) => ({ src: p.src, palette: p.palette, caption: p.title })),
}

export const bin: Item = {
  id: 'bin',
  label: l('Корзина', 'Bin'),
  thumb: { kind: 'icon', icon: 'trash' },
  title: l('Незавершённые главы', 'Unfinished chapters'),
  subtitle: l('Тоже часть пути', 'Also part of the path'),
  text: education.filter((e) => e.status && /не завершено/i.test(e.status.ru)).map((e) => l(`${e.title.ru} — ${e.place.ru}.`, `${e.title.en} — ${e.place.en}.`))
    .concat(childhood.filter((c) => c.note).map((c) => l(`${c.title.ru}.`, `${c.title.en}.`))),
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
  [23, 19], [32, 22], [41, 27], [20, 32], [29, 37], [20, 47], [40, 41], [49, 33], [58, 19], [66, 15],
  [61, 32], [55, 45], [47, 54], [37, 57], [41, 68], [29, 50], [19, 61], [28, 64], [76, 30], [84, 37],
  [91, 46], [71, 50], [80, 57],
]

const order = [
  'early-cc', 'city-zel', 'sber-sales', 'city-yo', 'early-lp', 'sport', 'sber-premium', 'sber-corp', 'resume', 'p-studio',
  'sber-key', 'sber-apk', 'city-kzn', 'guitar', 'education', 'city-sam', 'p-boutique', 'city-msk', 'tbank-mid', 'domilend',
  'consulting', 'tbank-midlarge', 'p-tuxedo',
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
