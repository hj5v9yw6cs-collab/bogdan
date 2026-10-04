/**
 * ════════════════════════════════════════════════════════════════════
 *  ВЕСЬ КОНТЕНТ САЙТА — В ЭТОМ ФАЙЛЕ.
 *  Компоненты ничего не знают о конкретных фактах: чтобы обновить сайт,
 *  меняйте только данные ниже (и кладите фото в /public/photos/).
 *
 *  Источники:
 *   • даты и должности — сведения о трудовой деятельности (выписка СФР),
 *     переданные Богданом;
 *   • биография и образование — со слов Богдана.
 *
 *  Правило: ничего не придумываем. Всё, чего нет в источниках, помечено
 *  NEED ('[NEED FROM BOGDAN]') или оставлено пустым ([] / null).
 *  Пустые поля и NEED отображаются на сайте как аккуратная пометка
 *  «нужны данные». Чтобы скрыть пометки перед публикацией — SHOW_NEED_MARKERS = false.
 * ════════════════════════════════════════════════════════════════════
 */

export type L = { ru: string; en: string }
export const l = (ru: string, en: string): L => ({ ru, en })

/** Маркер отсутствующих данных. Ищите по файлу: NEED */
export const NEED = '[NEED FROM BOGDAN]'
export const SHOW_NEED_MARKERS = true

/* ───────────────────────── Профиль ───────────────────────── */

export const profile = {
  name: l('Богдан Старогородцев', 'Bogdan Starogorodtsev'),
  shortName: l('Богдан', 'Bogdan'),
  birthDate: '2001-11-12',
  hometown: l('Зеленодольск, Республика Татарстан', 'Zelenodolsk, Republic of Tatarstan'),
  city: l('Москва', 'Moscow'),
  tagline: l('Карьера, бизнес и личный рост.', 'Career, business and personal growth.'),
  /** Текущая (последняя зафиксированная) позиция — см. employers → tbank. */
  currentRole: l('Ведущий менеджер по работе со средним и крупным бизнесом', 'Lead Manager, Mid & Large Business'),
  currentCompany: l('Т-Банк · Департамент Т-Бизнес', 'T-Bank · T-Business Department'),
  shortRole: l('Развитие бизнеса · Средний и крупный бизнес', 'Business Development · Mid & Large Business'),
  bio: l(
    'Родился в Зеленодольске. Йошкар-Ола, Казань, Самара, Москва — пять городов. В Сбербанке прошёл путь от мобильного менеджера по продажам до работы с ключевыми и корпоративными клиентами. Дальше — Т-Банк, средний и крупный бизнес, и развитие бизнеса в Домиленде.',
    'Born in Zelenodolsk. Yoshkar-Ola, Kazan, Samara, Moscow — five cities. At Sberbank I grew from mobile sales manager to working with key and corporate clients. Then T-Bank, mid and large business, and business development at Domilend.',
  ),
  /** Развёрнутое «о себе» — своими словами. */
  longBio: null as L | null, // NEED
  values: [] as L[], // NEED: 3–5 личных принципов
  status: l('строю следующую главу…', 'building the next chapter...'),
}

/* ───────────────────────── Контакты ───────────────────────── */
// NEED: заполните реальные контакты. Пустая строка = пометка «нужны данные».
export const contacts = {
  email: 'bogdanstarogorodcev@gmail.com',
  telegram: 'starogorodcev',
  instagram: 'starogorodcev',
  linkedin: '',
  site: 'bogdanstarogorodtsev.com',
}

/* ───────────────────────── Карьера ─────────────────────────
 * Записи — ровно как в выписке: дата, должность, подразделение.
 * kind: 'hire' — приём, 'promotion' — новая должность, 'transfer' — перевод,
 *       'end' — завершение работы.
 * segment — к какому этапу роста относится запись (см. segments).
 */

export type SegmentId = 'early' | 'sales' | 'premium' | 'corporate' | 'key' | 'midlarge' | 'bizdev'

export const segments: { id: SegmentId; title: L; short: L }[] = [
  { id: 'early', title: l('Первые работы', 'First jobs'), short: l('Старт', 'Start') },
  { id: 'sales', title: l('Клиентский сервис и продажи', 'Client service & sales'), short: l('Продажи', 'Sales') },
  { id: 'premium', title: l('Премиальный сегмент', 'Premium segment'), short: l('Премиум', 'Premium') },
  { id: 'corporate', title: l('Корпоративные клиенты', 'Corporate clients'), short: l('Корпоративный', 'Corporate') },
  { id: 'key', title: l('Ключевые клиенты', 'Key clients'), short: l('Ключевые', 'Key') },
  { id: 'midlarge', title: l('Средний и крупный бизнес', 'Mid & large business'), short: l('СКБ', 'Mid & Large') },
  { id: 'bizdev', title: l('Развитие бизнеса', 'Business development'), short: l('BizDev', 'BizDev') },
]

export type RecordKind = 'hire' | 'promotion' | 'transfer' | 'end'

export type CareerRecord = {
  date: string | null // 'ДД.ММ.ГГГГ' — как в выписке
  kind: RecordKind
  title: L
  unit?: L
  city?: L | null // null = NEED
  segment: SegmentId
  note?: L
}

export type EmployerId = 'early' | 'sber' | 'tbank' | 'domilend'

export type Employer = {
  id: EmployerId
  index: string
  folder: string
  name: L
  parent?: L
  color: string
  gradient: string
  /** Кратко — только то, что следует из записей. */
  summary: L
  records: CareerRecord[]
  responsibilities: L[] // NEED
  achievements: { value: string; label: L }[] // NEED
  lessons: L | null // NEED
}

const sber: Employer = {
  id: 'sber',
  index: '01',
  folder: '01 — SBERBANK',
  name: l('Сбербанк', 'Sberbank'),
  color: '#21A038',
  gradient: 'linear-gradient(135deg,#0b3d24 0%,#16803a 50%,#21A038 75%,#9be15d 120%)',
  summary: l(
    'Главная школа карьеры. Девять кадровых записей и восемь должностей: от мобильного менеджера по продажам — через премиальный сегмент и корпоративных клиентов — к главному менеджеру по работе с ключевыми клиентами и корпоративным клиентам АПК в Самаре.',
    'The main school of my career. Nine HR records and eight positions: from mobile sales manager — through the premium segment and corporate clients — to chief key-client manager and corporate agribusiness clients in Samara.',
  ),
  records: [
    { date: '16.04.2021', kind: 'hire', segment: 'sales', city: null, title: l('Мобильный менеджер по продажам', 'Mobile Sales Manager') },
    { date: '24.09.2021', kind: 'promotion', segment: 'sales', city: null, title: l('Старший клиентский менеджер', 'Senior Client Manager') },
    { date: '04.03.2022', kind: 'promotion', segment: 'premium', city: null, title: l('Клиентский менеджер Премьер', 'Client Manager, Premier') },
    { date: '01.10.2022', kind: 'promotion', segment: 'premium', city: null, title: l('Персональный менеджер Премьер', 'Personal Manager, Premier') },
    { date: '18.10.2022', kind: 'transfer', segment: 'premium', city: null, title: l('Персональный менеджер Премьер', 'Personal Manager, Premier'), note: l('Перевод в другой дополнительный офис', 'Transfer to another branch office') },
    { date: '27.12.2022', kind: 'promotion', segment: 'corporate', city: null, title: l('Менеджер по привлечению корпоративных клиентов', 'Corporate Client Acquisition Manager') },
    { date: '16.01.2023', kind: 'promotion', segment: 'key', city: null, title: l('Старший менеджер по работе с ключевыми клиентами', 'Senior Key Account Manager') },
    { date: '12.07.2023', kind: 'promotion', segment: 'key', city: null, title: l('Главный менеджер по работе с ключевыми клиентами', 'Chief Key Account Manager') },
    { date: '14.10.2024', kind: 'transfer', segment: 'corporate', city: l('Самара', 'Samara'), title: l('Старший клиентский менеджер по работе с корпоративными клиентами АПК', 'Senior Client Manager, Corporate Agribusiness (APK) Clients') },
    { date: '01.04.2025', kind: 'end', segment: 'corporate', title: l('Завершение работы в Сбербанке', 'End of employment at Sberbank'), note: l('Со следующего дня — Т-Банк', 'Joined T-Bank the next day') },
  ],
  responsibilities: [],
  achievements: [],
  lessons: null,
}

const tbank: Employer = {
  id: 'tbank',
  index: '02',
  folder: '02 — T-BANK',
  name: l('Т-Банк', 'T-Bank'),
  color: '#FFDD2D',
  gradient: 'linear-gradient(135deg,#141416 0%,#2c2c2e 45%,#6b5a12 85%,#FFDD2D 130%)',
  summary: l(
    'Департамент Т-Бизнес, Москва. Два периода работы: сначала — средний бизнес, затем возвращение уже в направление среднего и крупного бизнеса. Это текущая (последняя зафиксированная) позиция.',
    'T-Business Department, Moscow. Two periods: first — middle business, then a return to mid & large business. This is the current (latest recorded) position.',
  ),
  records: [
    { date: '02.04.2025', kind: 'hire', segment: 'midlarge', city: l('Москва', 'Moscow'), title: l('Ведущий менеджер по работе со средним бизнесом', 'Lead Manager, Middle Business'), unit: l('Департамент Т-Бизнес', 'T-Business Department') },
    { date: '30.09.2025', kind: 'end', segment: 'midlarge', title: l('Завершение первого периода работы', 'End of the first period') },
    { date: '25.05.2026', kind: 'hire', segment: 'midlarge', city: l('Москва', 'Moscow'), title: l('Ведущий менеджер по работе со средним и крупным бизнесом', 'Lead Manager, Mid & Large Business'), unit: l('Департамент Т-Бизнес', 'T-Business Department'), note: l('Текущая позиция по данным выписки', 'Current position per the official record') },
  ],
  responsibilities: [],
  achievements: [],
  lessons: null,
}

const domilend: Employer = {
  id: 'domilend',
  index: '03',
  folder: '03 — YANDEX / DOMILEND',
  name: l('Домиленд', 'Domilend'),
  parent: l('Направление Яндекса', 'A Yandex business unit'),
  color: '#FC3F1D',
  gradient: 'linear-gradient(135deg,#240804 0%,#a3230d 55%,#FC3F1D 85%,#ffb199 125%)',
  summary: l(
    'Домиленд — направление Яндекса. Развитие бизнеса: сначала в отделе развития PropTech-партнёрств, затем — в отделе развития бизнеса.',
    'Domilend is a Yandex business unit. Business development: first in the PropTech Partnerships department, then in the Business Development department.',
  ),
  records: [
    { date: '17.02.2026', kind: 'hire', segment: 'bizdev', city: null, title: l('Менеджер по развитию бизнеса', 'Business Development Manager'), unit: l('Отдел развития PropTech-партнёрств', 'PropTech Partnerships Development') },
    { date: '01.04.2026', kind: 'transfer', segment: 'bizdev', city: null, title: l('Менеджер по развитию бизнеса', 'Business Development Manager'), unit: l('Отдел развития бизнеса', 'Business Development Department'), note: l('Перевод', 'Transfer') },
    { date: '10.04.2026', kind: 'end', segment: 'bizdev', title: l('Завершение работы', 'End of employment') },
  ],
  responsibilities: [],
  achievements: [],
  lessons: null,
}

const early: Employer = {
  id: 'early',
  index: '04',
  folder: '04 — OTHER EXPERIENCE',
  name: l('Ранний опыт', 'Early experience'),
  color: '#8E8E93',
  gradient: 'linear-gradient(135deg,#1c1c1e 0%,#3a3a3c 60%,#8e8e93 120%)',
  summary: l(
    'Первые работы до Сбербанка (2020–2021): контакт-центр ООО «СИТИСТАФФ» и предотвращение потерь в ООО «ЛАБИРИНТ-ВОЛГА». С 16.04.2021 — Сбербанк.',
    'First jobs before Sberbank (2020–2021): a contact center at CITYSTAFF LLC and loss prevention at LABIRINT-VOLGA LLC. From 16.04.2021 — Sberbank.',
  ),
  // По выписке СФР. Города — NEED.
  records: [
    { date: '10.06.2020', kind: 'hire', segment: 'early', city: null, title: l('Оператор-специалист контакт-центра', 'Contact Center Specialist'), unit: l('ООО «СИТИСТАФФ»', 'CITYSTAFF LLC') },
    { date: '06.11.2020', kind: 'end', segment: 'early', title: l('Завершение работы', 'End of employment') },
    { date: '16.11.2020', kind: 'hire', segment: 'early', city: null, title: l('Оператор-специалист контакт-центра', 'Contact Center Specialist'), unit: l('ООО «СИТИСТАФФ»', 'CITYSTAFF LLC'), note: l('Повторный приём', 'Rehired') },
    { date: '15.12.2020', kind: 'end', segment: 'early', title: l('Завершение работы', 'End of employment') },
    { date: '22.01.2021', kind: 'hire', segment: 'early', city: null, title: l('Специалист по предотвращению потерь', 'Loss Prevention Specialist'), unit: l('ООО «ЛАБИРИНТ-ВОЛГА»', 'LABIRINT-VOLGA LLC') },
    { date: '31.03.2021', kind: 'end', segment: 'early', title: l('Завершение работы', 'End of employment') },
  ],
  responsibilities: [],
  achievements: [],
  lessons: null,
}

/** Порядок папок в Finder → Career. */
export const employers: Employer[] = [sber, tbank, domilend, early]
export const employerById = Object.fromEntries(employers.map((e) => [e.id, e])) as Record<EmployerId, Employer>

/* ───────── Карьерная история (Career Timeline) ─────────
 * Этапы собраны из записей выше. Каждый этап открывается с подробностями.
 * records — индексы записей работодателя, входящих в этап.
 */
export type Stage = {
  id: string
  year: string
  employer: EmployerId
  label: L
  segment: SegmentId
  records: number[]
  current?: boolean
}

export const stages: Stage[] = [
  { id: 'early-cc', year: '2020', employer: 'early', label: l('Контакт-центр · СИТИСТАФФ', 'Contact center · CITYSTAFF'), segment: 'early', records: [0, 1, 2, 3] },
  { id: 'early-lp', year: '2021', employer: 'early', label: l('Предотвращение потерь · ЛАБИРИНТ-ВОЛГА', 'Loss prevention · LABIRINT-VOLGA'), segment: 'early', records: [4, 5] },
  { id: 'sber-sales', year: '2021', employer: 'sber', label: l('Мобильные продажи → клиентский менеджер', 'Mobile Sales → Client Manager'), segment: 'sales', records: [0, 1] },
  { id: 'sber-premium', year: '2022', employer: 'sber', label: l('Премьер · премиальный сегмент', 'Premier · Premium segment'), segment: 'premium', records: [2, 3, 4] },
  { id: 'sber-corp', year: '2022', employer: 'sber', label: l('Корпоративные клиенты', 'Corporate clients'), segment: 'corporate', records: [5] },
  { id: 'sber-key', year: '2023', employer: 'sber', label: l('Ключевые клиенты', 'Key clients'), segment: 'key', records: [6, 7] },
  { id: 'sber-apk', year: '2024', employer: 'sber', label: l('Корпоративные клиенты АПК · Самара', 'Corporate agribusiness · Samara'), segment: 'corporate', records: [8, 9] },
  { id: 'tbank-mid', year: '2025', employer: 'tbank', label: l('Средний бизнес', 'Middle business'), segment: 'midlarge', records: [0, 1] },
  { id: 'domilend', year: '2026', employer: 'domilend', label: l('Развитие бизнеса', 'Business development'), segment: 'bizdev', records: [0, 1, 2] },
  { id: 'tbank-midlarge', year: '2026 —', employer: 'tbank', label: l('Средний и крупный бизнес', 'Mid & large business'), segment: 'midlarge', records: [2], current: true },
]

/** Траектория роста — для визуализации «не просто смена работодателей». */
export const growthArc: SegmentId[] = ['sales', 'premium', 'corporate', 'key', 'midlarge', 'bizdev']

/** Города — без годов (годы проживания: NEED). */
export const cities: { id: string; name: L; note: L | null; years: string | null }[] = [
  { id: 'zel', name: l('Зеленодольск', 'Zelenodolsk'), years: null, note: l('Родной город. Школа №4, школа журналистики, гимнастика, тяжёлая атлетика и музыкальная школа.', 'Hometown. School No. 4, a journalism school, gymnastics, weightlifting and music school.') },
  { id: 'yo', name: l('Йошкар-Ола', 'Yoshkar-Ola'), years: null, note: l('Переезд после школы. Медицинский колледж, направление «Фельдшер».', 'Moved here after school. Medical college, paramedic program.') },
  { id: 'kzn', name: l('Казань', 'Kazan'), years: null, note: null },
  { id: 'sam', name: l('Самара', 'Samara'), years: null, note: l('Сбербанк: корпоративные клиенты АПК (с 14.10.2024).', 'Sberbank: corporate agribusiness clients (from 14.10.2024).') },
  { id: 'msk', name: l('Москва', 'Moscow'), years: null, note: l('Т-Банк, Домиленд и Московский колледж бизнес-технологий («Финансы», 2026).', 'T-Bank, Domilend and Moscow College of Business Technologies (Finance, 2026).') },
]

/* ───────────────────────── Образование и биография ───────────────────────── */

export type EduItem = { id: string; title: L; place: L; period: string | null; status: L | null; note?: L }

export const education: EduItem[] = [
  { id: 'school', title: l('МБОУ СОШ №4', 'Secondary School No. 4'), place: l('Зеленодольский муниципальный район, Республика Татарстан', 'Zelenodolsk district, Republic of Tatarstan'), period: null, status: null },
  { id: 'journalism', title: l('Школа журналистики', 'School of Journalism'), place: l('Зеленодольск', 'Zelenodolsk'), period: null, status: null },
  { id: 'medical', title: l('Йошкар-Олинский медицинский колледж', 'Yoshkar-Ola Medical College'), place: l('Йошкар-Ола · направление «Фельдшер»', 'Yoshkar-Ola · Paramedic program'), period: null, status: l('Обучение не завершено', 'Not completed') },
  { id: 'mkbt', title: l('Московский колледж бизнес-технологий', 'Moscow College of Business Technologies'), place: l('Москва · направление «Финансы»', 'Moscow · Finance program'), period: '2026', status: l('Поступление в 2026 году', 'Enrolled in 2026') },
]

export const childhood: { id: string; title: L; note: L | null }[] = [
  { id: 'gym', title: l('Гимнастика', 'Gymnastics'), note: null },
  { id: 'lift', title: l('Тяжёлая атлетика', 'Weightlifting'), note: null },
  { id: 'guitar', title: l('Музыкальная школа, класс гитары', 'Music school, guitar'), note: l('Обучение не завершено', 'Not completed') },
]

/* ───────────────────────── Документы (Finder) ───────────────────────── */

export type Doc = {
  id: string
  file: string
  kind: 'txt' | 'md' | 'key'
  title: L
  subtitle?: L
  body: L[] // абзацы; строка NEED → пометка «нужны данные»
  tags?: string[]
}

export const experienceDocs: Doc[] = [
  {
    id: 'segments', file: 'Segments.md', kind: 'md',
    title: l('С кем я работал', 'Who I have worked with'),
    subtitle: l('По названиям должностей из выписки', 'Based on job titles in the official record'),
    body: [
      l('Розничные клиенты — мобильные продажи и клиентский сервис (Сбербанк, 2021).', 'Retail clients — mobile sales and client service (Sberbank, 2021).'),
      l('Премиальный сегмент — «Премьер» (Сбербанк, 2022).', 'Premium segment — “Premier” (Sberbank, 2022).'),
      l('Корпоративные клиенты — привлечение и работа с АПК (Сбербанк, 2022, 2024).', 'Corporate clients — acquisition and agribusiness (Sberbank, 2022, 2024).'),
      l('Ключевые клиенты (Сбербанк, 2023).', 'Key clients (Sberbank, 2023).'),
      l('Средний и крупный бизнес (Т-Банк, 2025–2026).', 'Mid & large business (T-Bank, 2025–2026).'),
      l('PropTech-партнёрства и развитие бизнеса (Домиленд, 2026).', 'PropTech partnerships and business development (Domilend, 2026).'),
    ],
    tags: ['Retail', 'Premium', 'Corporate', 'Key Accounts', 'SME', 'BizDev'],
  },
  {
    id: 'skills', file: 'Skills.txt', kind: 'txt',
    title: l('Навыки', 'Skills'),
    body: [l(NEED, NEED)],
  },
  {
    id: 'achievements', file: 'Achievements.md', kind: 'md',
    title: l('Достижения', 'Achievements'),
    body: [l(NEED, NEED)],
  },
]

export const projectDocs: Doc[] = [
  {
    id: 'consulting', file: 'Career Consulting.key', kind: 'key',
    title: l('Career Consulting', 'Career Consulting'),
    subtitle: l('Карьерные консультации', 'Career consultations'),
    body: [
      l('Консультации по карьере: аудит, подготовка к интервью, стратегия, резюме и смена трека.', 'Career consulting: audit, interview prep, strategy, CV and career transitions.'),
      l('Опыт — 9 кадровых записей в Сбербанке и путь от розницы до среднего и крупного бизнеса.', 'Experience — 9 HR records at Sberbank and a path from retail to mid & large business.'),
    ],
    tags: ['Consulting', '1:1'],
  },
  {
    id: 'brand', file: 'Personal Brand.md', kind: 'md',
    title: l('Личный бренд', 'Personal brand'),
    subtitle: l('Этот сайт', 'This website'),
    body: [
      l('Этот Mac — интерактивная история карьеры: Finder, Timeline, Resume и Terminal вместо обычного резюме.', 'This Mac is an interactive career story: Finder, Timeline, Resume and Terminal instead of a regular CV.'),
    ],
    tags: ['Brand'],
  },
  {
    id: 'finance', file: 'Finance.md', kind: 'md',
    title: l('Финансы', 'Finance'),
    subtitle: l('Следующая глава', 'The next chapter'),
    body: [
      l('2026 — поступление в Московский колледж бизнес-технологий на направление «Финансы».', '2026 — enrolled in the Finance program at Moscow College of Business Technologies.'),
    ],
    tags: ['Finance', 'Growth'],
  },
]

export const educationDocs: Doc[] = [
  ...education.map<Doc>((e) => ({
    id: `edu-${e.id}`, file: `${e.title.en.replace(/[^A-Za-z0-9 ]/g, '').trim()}.txt`, kind: 'txt',
    title: e.title, subtitle: e.place,
    body: [
      e.period ? l(`Период: ${e.period}`, `Period: ${e.period}`) : l(`Период: ${NEED}`, `Period: ${NEED}`),
      ...(e.status ? [e.status] : []),
    ],
  })),
  {
    id: 'childhood', file: 'Childhood.md', kind: 'md',
    title: l('Детство', 'Childhood'), subtitle: l('Зеленодольск', 'Zelenodolsk'),
    body: childhood.map((c) => (c.note ? l(`${c.title.ru} — ${c.note.ru.toLowerCase()}`, `${c.title.en} — ${c.note.en.toLowerCase()}`) : c.title)),
  },
]

export const allDocs: Doc[] = [...experienceDocs, ...projectDocs, ...educationDocs]

/* ───────────────────────── Фото ─────────────────────────
 * Чтобы заменить placeholder: положите файл в /public/photos/ и укажите src: '/photos/kazan.jpg'.
 * caption/year: null → «нужны данные».
 */
export type Photo = {
  id: string
  album: 'cities' | 'work' | 'life'
  title: L
  caption: L | null
  year: string | null
  src?: string
  palette: [string, string, string]
}

export const albums = [
  { id: 'all' as const, name: l('Все фото', 'Library') },
  { id: 'cities' as const, name: l('Города', 'Cities') },
  { id: 'work' as const, name: l('Работа', 'Work') },
  { id: 'life' as const, name: l('Жизнь', 'Life') },
]

/**
 * Портреты Богдана. Положите файлы с ЭТИМИ именами в /public/photos/ —
 * сайт подхватит их автоматически. Пока файла нет, показывается заглушка.
 */
export const portraits = {
  /** Ч/б студийный портрет в солнцезащитных очках — главный (About, Safari, About This Mac). */
  hero: { src: '/photos/portrait-studio.jpg', position: '66% 18%', palette: ['#f2f2f2', '#9a9a9a', '#111111'] as [string, string, string] },
  /** Портрет анфас — аватар (Contacts, Resume, Mail). */
  avatar: { src: '/photos/portrait-face.jpg', position: '50% 35%', palette: ['#efe9e1', '#b9a999', '#2a2a2a'] as [string, string, string] },
}

export const photos: Photo[] = [
  { id: 'p-studio', album: 'life', title: l('Портрет', 'Portrait'), caption: null, year: null, src: portraits.hero.src, palette: portraits.hero.palette },
  { id: 'p-boutique', album: 'life', title: l('Портрет · бутик', 'Portrait · boutique'), caption: null, year: null, src: '/photos/portrait-boutique.jpg', palette: ['#1e3a44', '#e2522b', '#f4f1ec'] },
  { id: 'p-tuxedo', album: 'life', title: l('Black tie', 'Black tie'), caption: null, year: null, src: '/photos/portrait-tuxedo.jpg', palette: ['#141414', '#f5f5f5', '#c9a36a'] },
  { id: 'p-face', album: 'life', title: l('Анфас', 'Headshot'), caption: null, year: null, src: portraits.avatar.src, palette: portraits.avatar.palette },
  { id: 'zel', album: 'cities', title: l('Зеленодольск', 'Zelenodolsk'), caption: l('Родной город', 'Hometown'), year: null, palette: ['#f6d365', '#fda085', '#5b3b6e'] },
  { id: 'yo', album: 'cities', title: l('Йошкар-Ола', 'Yoshkar-Ola'), caption: null, year: null, palette: ['#a1c4fd', '#c2e9fb', '#3d5a80'] },
  { id: 'kzn', album: 'cities', title: l('Казань', 'Kazan'), caption: null, year: null, palette: ['#0f2027', '#2c5364', '#e0c3fc'] },
  { id: 'sam', album: 'cities', title: l('Самара', 'Samara'), caption: null, year: null, palette: ['#ff9a8b', '#ff6a88', '#2a1e5c'] },
  { id: 'msk', album: 'cities', title: l('Москва', 'Moscow'), caption: null, year: null, palette: ['#141e30', '#243b55', '#f8b26a'] },
  { id: 'w-sber', album: 'work', title: l('Сбербанк', 'Sberbank'), caption: null, year: null, palette: ['#0b3d24', '#21a038', '#d9f99d'] },
  { id: 'w-tbank', album: 'work', title: l('Т-Банк', 'T-Bank'), caption: null, year: null, palette: ['#1c1c1e', '#3a3a3c', '#ffdd2d'] },
  { id: 'w-domilend', album: 'work', title: l('Домиленд', 'Domilend'), caption: null, year: null, palette: ['#200122', '#6f0000', '#fc3f1d'] },
  { id: 'l-sport', album: 'life', title: l('Спорт', 'Sport'), caption: l('Гимнастика и тяжёлая атлетика', 'Gymnastics and weightlifting'), year: null, palette: ['#0f0c29', '#302b63', '#24c6dc'] },
  { id: 'l-music', album: 'life', title: l('Гитара', 'Guitar'), caption: l('Музыкальная школа', 'Music school'), year: null, palette: ['#3a1c71', '#d76d77', '#ffaf7b'] },
]

/* ───────────────────────── Консультации ─────────────────────────
 * Описания услуг — продуктовый текст. Цена и длительность: null = NEED.
 */
export const services = [
  { id: 'audit', icon: 'ScanSearch', title: l('Career Audit', 'Career Audit'), duration: null as L | null, price: 'TBD' as string | null, text: l('Разбор текущей карьерной точки: сильные стороны, пробелы и реальные варианты роста.', 'A review of where you are now: strengths, gaps and realistic growth options.') },
  { id: 'interview', icon: 'MessagesSquare', title: l('Interview Preparation', 'Interview Preparation'), duration: null as L | null, price: 'TBD' as string | null, text: l('Подготовка к собеседованию: тренировочное интервью, разбор ответов и обратная связь.', 'Interview prep: a mock interview, answer review and feedback.') },
  { id: 'strategy', icon: 'Compass', title: l('Career Strategy', 'Career Strategy'), duration: null as L | null, price: 'TBD' as string | null, text: l('Карьерная стратегия: цели, траектория и конкретный план действий.', 'Career strategy: goals, trajectory and a concrete action plan.') },
  { id: 'cv', icon: 'FileUser', title: l('CV / Personal Brand', 'CV / Personal Brand'), duration: null as L | null, price: 'TBD' as string | null, text: l('Упаковка опыта: резюме, профиль и история, которую хочется рассказать.', 'Positioning your experience: CV, profile and a story worth telling.') },
  { id: 'transition', icon: 'Repeat', title: l('Career Transition', 'Career Transition'), duration: null as L | null, price: 'TBD' as string | null, text: l('Смена трека: из сегмента в сегмент, из компании в компанию, из города в город.', 'Switching tracks: between segments, companies and cities.') },
] as const

/**
 * Куда ведёт «Book a consultation». По умолчанию — Telegram из contacts.
 * Пока username не указан — открывается встроенная форма (заявка уходит на email).
 * Позже можно заменить на Cal.com: bookingUrl = 'https://cal.com/...'
 */
export const bookingUrl: string = contacts.telegram ? `https://t.me/${contacts.telegram}` : ''

/* ───────────────────────── Mail (отзывы) ─────────────────────────
 * placeholder: true — шаблон, на сайте помечается как «пример».
 * Замените реальными отзывами и уберите placeholder.
 */
export const mails = [
  { id: 'm1', placeholder: true, from: l('Клиент', 'Client'), role: l('Пример письма', 'Sample message'), subject: l('Career consultation request', 'Career consultation request'), preview: l('Здесь будет запрос на консультацию…', 'A consultation request will appear here…'), date: '09:41', unread: true, body: l(`Здесь будет реальное письмо-запрос на консультацию.\n\n${NEED}`, `A real consultation request will appear here.\n\n${NEED}`) },
  { id: 'm2', placeholder: true, from: l('Клиент', 'Client'), role: l('Пример отзыва', 'Sample review'), subject: l('Great meeting', 'Great meeting'), preview: l('Здесь будет отзыв после встречи…', 'A review after a meeting will appear here…'), date: l('Вчера', 'Yesterday').ru, unread: true, body: l(`Здесь будет реальный отзыв после встречи.\n\n${NEED}`, `A real post-meeting review will appear here.\n\n${NEED}`) },
  { id: 'm3', placeholder: true, from: l('Клиент', 'Client'), role: l('Пример отзыва', 'Sample review'), subject: l('Thank you for the advice', 'Thank you for the advice'), preview: l('Здесь будет благодарность за совет…', 'A thank-you note will appear here…'), date: '02.10', unread: false, body: l(`Здесь будет реальный отзыв.\n\n${NEED}`, `A real review will appear here.\n\n${NEED}`) },
]

/* ───────────────────────── Notes ───────────────────────── */

export const notes = [
  { id: 'n1', title: l('Маршрут', 'The route'), date: l('Сегодня', 'Today'), body: [l('Маршрут', 'The route'), l('Зеленодольск → Йошкар-Ола → Казань → Самара → Москва', 'Zelenodolsk → Yoshkar-Ola → Kazan → Samara → Moscow'), l('Розница → Премьер → корпоративные → ключевые → средний и крупный бизнес → развитие бизнеса', 'Retail → Premier → corporate → key → mid & large business → business development')] },
  { id: 'n2', title: l('Детство', 'Childhood'), date: l('Вчера', 'Yesterday'), body: [l('Детство', 'Childhood'), l('Гимнастика, потом тяжёлая атлетика.', 'Gymnastics, then weightlifting.'), l('Музыкальная школа — класс гитары (не окончил).', 'Music school — guitar (did not finish).'), l('Школа журналистики в Зеленодольске.', 'School of journalism in Zelenodolsk.')] },
  { id: 'n3', title: l('Принципы', 'Principles'), date: l('—', '—'), body: [l('Принципы', 'Principles'), l(NEED, NEED)] },
]

/* ───────────────────────── Music (декоративный плеер) ───────────────────────── */

export const tracks = [
  { title: 'Deep Work', artist: 'Focus', len: 214, colors: ['#ff5f6d', '#ffc371'] },
  { title: 'Night Drive', artist: 'Moscow', len: 187, colors: ['#4568dc', '#b06ab3'] },
  { title: 'Volga', artist: 'Zelenodolsk', len: 242, colors: ['#11998e', '#38ef7d'] },
  { title: 'Next Chapter', artist: 'Bogdan', len: 201, colors: ['#232526', '#fc3f1d'] },
]

/* ───────────────────────── Хелперы ───────────────────────── */

export const isNeed = (v: string | null | undefined) => v == null || v === '' || v.includes(NEED)

export function ageFrom(iso: string, now = new Date()) {
  const b = new Date(iso)
  let a = now.getFullYear() - b.getFullYear()
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--
  return a
}

export const yearOf = (date: string | null) => (date ? date.slice(-4) : null)

/** Период работодателя по записям: «04.2021 — …». */
export function employerPeriod(e: Employer): { from: string | null; to: string | null; current: boolean } {
  const dated = e.records.filter((r) => r.date)
  const from = dated[0]?.date ?? null
  const last = e.records[e.records.length - 1]
  const current = last.kind !== 'end' && last.date != null
  return { from, to: current ? null : last.date, current }
}
