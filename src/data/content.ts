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

/** Города — без годов (годы проживания: NEED). */
export const cities: { id: string; name: L; note: L | null; years: string | null }[] = [
  { id: 'zel', name: l('Зеленодольск', 'Zelenodolsk'), years: null, note: l('Родной город. Школа и школа журналистики.', 'Hometown. School and a school of journalism.') },
  { id: 'yo', name: l('Йошкар-Ола', 'Yoshkar-Ola'), years: null, note: l('После школы — учёба в медицинском направлении. Здесь стало понятно, что медицина — не моё.', 'After school — studying medicine. This is where it became clear medicine was not my path.') },
  { id: 'kzn', name: l('Казань', 'Kazan'), years: null, note: null },
  { id: 'sam', name: l('Самара', 'Samara'), years: null, note: l('Сбербанк: корпоративные клиенты АПК (с 14.10.2024).', 'Sberbank: corporate agribusiness clients (from 14.10.2024).') },
  { id: 'msk', name: l('Москва', 'Moscow'), years: null, note: l('Т-Банк и возвращение к образованию — направление «Финансы».', 'T-Bank and a return to education — Finance.') },
]

/* ───────────────────────── My Story (образование как часть истории) ─────────────────────────
 * Названия учебных заведений на сайте не показываются — только история.
 */
export const story = {
  title: l('My Story', 'My Story'),
  path: l(
    'Школа → журналистика → медицина → первая работа → самостоятельная жизнь → карьера → финансы',
    'School → journalism → medicine → first job → living on my own → career → finance',
  ),
  paragraphs: [
    l('Я окончил школу. Ещё в Зеленодольске учился в школе журналистики.', 'I finished school. While still in Zelenodolsk, I studied at a school of journalism.'),
    l('После школы передо мной встал выбор дальнейшего пути. Я поступал в медицинские учебные заведения и в Москве, и в Йошкар-Оле — и в итоге остановился на Йошкар-Оле, начав учиться в медицинском направлении.', 'After school I had to choose what came next. I applied to medical schools in both Moscow and Yoshkar-Ola, and in the end chose Yoshkar-Ola and started studying medicine.'),
    l('Позже я понял, что медицина мне не откликается. Я забрал документы, начал работать и стал самостоятельно строить свой профессиональный путь.', 'Later I realised medicine did not resonate with me. I withdrew, started working and began building my professional path on my own.'),
    l('Спустя время я снова вернулся к образованию — уже в Москве, на направлении «Финансы».', 'Some time later I came back to education — this time in Moscow, studying Finance.'),
    l('Я не всегда шёл по прямой, но шаг за шагом находил своё направление.', 'My path was not always a straight line, but step by step I found my direction.'),
  ],
  /** Для резюме: только направление, без названий учебных заведений. */
  resumeLine: l('Направление «Финансы», Москва — поступление в 2026 году', 'Finance, Moscow — enrolled in 2026'),
}

/* ───────────────────────── Notes: интересы и жизнь вне работы ───────────────────────── */

export const motto = l('Мне всегда мало.', 'I always want more.')

export const life = {
  childhood: l(
    'В детстве занимался в музыкальной школе, ходил на гимнастику, позже — тяжёлой атлетикой. Всё это было на любительском уровне, и со временем я это оставил.',
    'As a kid I went to music school and gymnastics, and later did weightlifting. All of it was at an amateur level, and over time I let it go.',
  ),
  now: [
    l('Сейчас у меня гораздо больше разных интересов.', 'Today I have many more interests.'),
    l('Люблю выставки и музеи — особенно фотовыставки. Мне интересны архитектура и психология.', 'I love exhibitions and museums — especially photo exhibitions. I am into architecture and psychology.'),
    l('Смотрю фильмы в оригинале и потом обсуждаю их с друзьями. Читаю и художественную литературу, и книги по психологии и финансам.', 'I watch films in the original language and then discuss them with friends. I read fiction as well as books on psychology and finance.'),
    l('Смотрю влоги людей, которые путешествуют, — и сам хочу путешествовать чаще и больше.', 'I watch travel vlogs — and want to travel more and more often myself.'),
    l('Регулярно хожу в зал. Одно время играл в большой теннис. Люблю бассейн.', 'I go to the gym regularly. For a while I played tennis. I love swimming pools.'),
    l('Мне интересна одежда — но не столько сама одежда, сколько её происхождение: история брендов, биографии основателей, развитие компаний.', 'I am into clothing — less the clothes themselves than where they come from: brand history, founders’ biographies and how companies grow.'),
    l('Слежу за изменениями на рынке технологий: новые продукты, компании, идеи — и то, как меняется мир.', 'I follow the tech market: new products, companies, ideas — and how the world is changing.'),
  ],
  curiosity: [
    l('Я очень любознательный человек. Мне нравится узнавать что-то новое.', 'I am a very curious person. I love learning new things.'),
    l('Не люблю стоять на месте.', 'I don’t like standing still.'),
    l('Я голоден до новой информации, новых впечатлений и новых знакомств.', 'I am hungry for new information, new experiences and new people.'),
  ],
  thingsILike: ['Museums', 'Exhibitions', 'Photography', 'Cinema', 'Books', 'Travel', 'Architecture', 'Technology', 'Fashion & Brand History', 'Psychology', 'Finance'],
  curiousAbout: ['Architecture', 'Psychology', 'Technology', 'Cinema', 'Fashion', 'Brand History', 'Finance', 'Travel'],
  nextChapter: [
    l('Возвращение к образованию: направление «Финансы», Москва.', 'Back to education: Finance, Moscow.'),
    l('Карьерные консультации — делиться опытом с другими.', 'Career consulting — sharing experience with others.'),
  ],
}

/* ───────────────────────── Nonprofit — параллельная линия ───────────────────────── */

export const nonprofit = {
  id: 'foodbank',
  badge: l('NONPROFIT EXPERIENCE', 'NONPROFIT EXPERIENCE'),
  org: l('Благотворительный фонд «Банк еды „Русь“»', 'Food Bank “Rus” charity foundation'),
  short: l('Банк еды «Русь»', 'Food Bank “Rus”'),
  role: l('Фандрайзер', 'Fundraiser'),
  period: '2025 — 2026',
  description: l(
    'В 2025–2026 годах занимался фандрайзингом в благотворительном фонде «Банк еды „Русь“», помогая привлекать денежные средства на поддержку людей, нуждающихся в продовольственной помощи.',
    'In 2025–2026 I worked as a fundraiser for the Food Bank “Rus” charity foundation, helping raise money to support people in need of food assistance.',
  ),
  note: l('Отдельный опыт, параллельный основной карьерной линии.', 'A separate experience, running in parallel to the main career line.'),
  areas: [
    l('Фандрайзинг', 'Fundraising'),
    l('Привлечение пожертвований', 'Raising donations'),
    l('Коммуникация с людьми', 'Communicating with people'),
    l('Презентация идеи', 'Presenting the idea'),
    l('Социальная ответственность', 'Social responsibility'),
  ],
  // NEED: точные даты, город, результаты — только если Богдан их предоставит
  exactDates: null as string | null,
}

/* ───────────────────────── Certificates (Сбер) ─────────────────────────
 * Каждый сертификат — один объект. Файлы кладите в /public/certificates/.
 *   pages — картинки страниц для просмотра (jpg/png/webp), по порядку;
 *   file  — оригинал для скачивания (pdf или изображение).
 * Если pages пустой, а file — PDF, он откроется во встроенном просмотрщике браузера.
 * Всё, чего нет на документе, — NEED.
 */
export type Certificate = {
  id: string
  title: L
  organization: L
  date: string | null
  description: L | null
  file: string
  pages: string[]
}

export const certificates: Certificate[] = [
  // NEED: сканы сертификатов Сбера — добавить после загрузки, данные взять из самих документов
]

/* ───────────────────────── Press / Publications ───────────────────────── */

export type Publication = {
  id: string
  source: string
  title: L
  date: string // ГГГГ-ММ-ДД
  url: string
  description: L
  image?: string
}

export const publications: Publication[] = [
  {
    id: 'blueprint-41633',
    source: 'The Blueprint',
    title: l(
      'Богдан Старогородцев назначен ведущим менеджером по работе со средним и крупным бизнесом в Т-Банк',
      'Богдан Старогородцев назначен ведущим менеджером по работе со средним и крупным бизнесом в Т-Банк',
    ),
    date: '2026-09-02',
    url: 'https://theblueprint.ru/career/41633',
    description: l(
      'Публикация о назначении на позицию ведущего менеджера по работе со средним и крупным бизнесом в Т-Банк.',
      'A piece on the appointment as Lead Manager, Mid & Large Business at T-Bank.',
    ),
    image: '/press/blueprint-41633.webp',
  },
]

/* ───────────────────────── Projects ───────────────────────── */
// NEED: собственные проекты Богдана. Пока в папке только Career Consulting.
export const projects: { id: string; title: L; description: L | null; url?: string }[] = []

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

/* ───────────────────────── Хелперы ───────────────────────── */

export const isNeed = (v: string | null | undefined) => v == null || v === '' || v.includes(NEED)

export function ageFrom(iso: string, now = new Date()) {
  const b = new Date(iso)
  let a = now.getFullYear() - b.getFullYear()
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--
  return a
}

/** Период работодателя по записям: «04.2021 — …». */
export function employerPeriod(e: Employer): { from: string | null; to: string | null; current: boolean } {
  const dated = e.records.filter((r) => r.date)
  const from = dated[0]?.date ?? null
  const last = e.records[e.records.length - 1]
  const current = last.kind !== 'end' && last.date != null
  return { from, to: current ? null : last.date, current }
}
