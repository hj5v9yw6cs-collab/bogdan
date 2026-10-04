import type { AppId, WinParams } from '../store/windows'
import type { FileKind, FolderGlyph, IconKind } from '../components/icons'
import { employers, employerPeriod, experienceDocs, projectDocs, educationDocs, photos, l, type L, type Doc } from './content'

export type FsIcon =
  | { type: 'folder'; glyph?: FolderGlyph }
  | { type: 'file'; kind: FileKind; thumb?: string[] }
  | { type: 'app'; kind: IconKind }

export type FsAction = { app: AppId; params?: WinParams; key?: string } | { folder: FolderId }

export type FsItem = {
  id: string
  name: L
  icon: FsIcon
  action: FsAction
  kindLabel: L
  size?: string
  date?: string
  description?: L
  /** Extra search terms for Spotlight / Finder search. */
  keywords?: string
}

export type FolderId =
  | 'home' | 'about' | 'career' | 'experience' | 'projects' | 'education' | 'photos' | 'contact'
  | 'desktop' | 'applications' | 'trash'

export type Folder = { id: FolderId; name: L; glyph: FolderGlyph; items: FsItem[] }

const k = {
  folder: l('Папка', 'Folder'),
  pdf: l('PDF-документ', 'PDF Document'),
  txt: l('Текстовый документ', 'Plain Text'),
  md: l('Markdown', 'Markdown'),
  key: l('Презентация', 'Presentation'),
  app: l('Приложение', 'Application'),
  jpg: l('Изображение JPEG', 'JPEG image'),
  vcf: l('Визитная карточка', 'vCard'),
}

const docItem = (d: Doc): FsItem => ({
  id: `doc-${d.id}`,
  name: l(d.file, d.file),
  icon: { type: 'file', kind: d.kind === 'key' ? 'key' : d.kind === 'md' ? 'md' : d.file.endsWith('.pdf') ? 'pdf' : 'txt' },
  action: { app: 'doc', params: { doc: d.id }, key: `doc:${d.id}` },
  kindLabel: d.kind === 'key' ? k.key : d.kind === 'md' ? k.md : k.txt,
  size: `${(2 + d.body.join('').length / 400).toFixed(0)} KB`,
  date: '2026',
  description: d.subtitle ?? d.title,
})

export const resumeItem: FsItem = {
  id: 'resume', name: l('Bogdan_Starogorodtsev_Resume.pdf', 'Bogdan_Starogorodtsev_Resume.pdf'),
  icon: { type: 'file', kind: 'pdf' }, action: { app: 'resume' }, kindLabel: k.pdf, size: '184 KB', date: '2026',
  description: l('Резюме — 1 страница', 'Resume — 1 page'),
}

const appItem = (id: string, app: AppId, kind: IconKind, name: L, description?: L): FsItem => ({
  id, name, icon: { type: 'app', kind }, action: { app }, kindLabel: k.app, description,
})

export const appItems = {
  timeline: appItem('timeline', 'timeline', 'timeline', l('Career Timeline', 'Career Timeline'), l('Интерактивный путь: города и компании', 'Interactive path: cities and companies')),
  consulting: appItem('consulting', 'consulting', 'consulting', l('Career Consulting', 'Career Consulting'), l('Карьерные консультации', 'Career consultations')),
  contact: appItem('contact', 'contact', 'contacts', l('Contacts', 'Contacts'), l('Связаться со мной', 'Get in touch')),
  about: appItem('about', 'about', 'about', l('About Me', 'About Me'), l('Кто я и что делаю', 'Who I am and what I do')),
}

const folderLink = (id: FolderId, name: L, glyph: FolderGlyph, description?: L): FsItem => ({
  id: `f-${id}`, name, icon: { type: 'folder', glyph }, action: { folder: id }, kindLabel: k.folder, description,
})

export const folders: Record<FolderId, Folder> = {} as Record<FolderId, Folder>

const mainFolders: [FolderId, L, FolderGlyph, L][] = [
  ['about', l('About Me', 'About Me'), 'user', l('Кто такой Богдан', 'Who Bogdan is')],
  ['career', l('Career', 'Career'), 'career', l('Сбербанк → Т-Банк → Домиленд (Яндекс) → Т-Банк', 'Sberbank → T-Bank → Domilend (Yandex) → T-Bank')],
  ['experience', l('Experience', 'Experience'), 'experience', l('Сегменты, навыки, достижения', 'Segments, skills, achievements')],
  ['projects', l('Projects', 'Projects'), 'projects', l('Консалтинг, бренд, финансы', 'Consulting, brand, finance')],
  ['education', l('Education', 'Education'), 'education', l('Школа, колледжи, детство', 'School, colleges, childhood')],
  ['photos', l('Photos', 'Photos'), 'photos', l('Города и моменты', 'Cities and moments')],
  ['contact', l('Contact', 'Contact'), 'contact', l('Как связаться', 'How to reach me')],
]

export const mainFolderItems = mainFolders.map(([id, name, glyph, d]) => folderLink(id, name, glyph, d))

folders.home = { id: 'home', name: l('Богдан', 'Bogdan'), glyph: 'user', items: mainFolderItems }

folders.about = {
  id: 'about', name: l('About Me', 'About Me'), glyph: 'user',
  items: [
    { ...appItems.about, id: 'about-txt', name: l('About Me.txt', 'About Me.txt'), icon: { type: 'file', kind: 'txt' }, kindLabel: k.txt, size: '4 KB' },
    resumeItem,
    { id: 'portrait', name: l('Portrait.jpg', 'Portrait.jpg'), icon: { type: 'file', kind: 'jpg', thumb: ['#f2f2f2', '#9a9a9a', '#111111'] }, action: { app: 'photos', params: { photo: 'p-studio' } }, kindLabel: k.jpg },
    appItems.timeline,
  ],
}

folders.career = {
  id: 'career', name: l('Career', 'Career'), glyph: 'career',
  items: [
    ...employers.map<FsItem>((c) => {
      const p = employerPeriod(c)
      return {
        id: `co-${c.id}`, name: l(c.folder, c.folder), icon: { type: 'folder', glyph: 'career' },
        action: { app: 'company', params: { company: c.id }, key: `company:${c.id}` },
        kindLabel: k.folder, date: p.from ? `${p.from.slice(-4)}${p.current ? ' —' : ''}` : '—', description: c.summary,
        keywords: `${c.name.ru} ${c.name.en} ${c.parent ? c.parent.ru + ' ' + c.parent.en : ''}`,
      }
    }),
    appItems.timeline,
  ],
}

folders.experience = { id: 'experience', name: l('Experience', 'Experience'), glyph: 'experience', items: [...experienceDocs.map(docItem), resumeItem] }
folders.projects = { id: 'projects', name: l('Projects', 'Projects'), glyph: 'projects', items: [...projectDocs.map(docItem), appItems.consulting] }
folders.education = { id: 'education', name: l('Education', 'Education'), glyph: 'education', items: educationDocs.map(docItem) }
folders.photos = {
  id: 'photos', name: l('Photos', 'Photos'), glyph: 'photos',
  items: photos.map<FsItem>((p) => ({
    id: `ph-${p.id}`, name: l(`${p.title.ru}.jpg`, `${p.title.en}.jpg`), icon: { type: 'file', kind: 'jpg', thumb: p.palette },
    action: { app: 'photos', params: { photo: p.id } }, kindLabel: k.jpg, size: '—', date: p.year ?? undefined, description: p.caption ?? undefined,
  })),
}
folders.contact = {
  id: 'contact', name: l('Contact', 'Contact'), glyph: 'contact',
  items: [
    { ...appItems.contact, id: 'vcf', name: l('Bogdan Starogorodtsev.vcf', 'Bogdan Starogorodtsev.vcf'), icon: { type: 'file', kind: 'vcf' }, kindLabel: k.vcf, size: '1 KB' },
    appItems.consulting,
    appItem('mail', 'mail', 'mail', l('Mail', 'Mail'), l('Отзывы и сообщения', 'Reviews and messages')),
  ],
}

folders.desktop = {
  id: 'desktop', name: l('Рабочий стол', 'Desktop'), glyph: 'none',
  items: [appItems.about, resumeItem, mainFolderItems[1], mainFolderItems[3], mainFolderItems[5], appItems.timeline, appItems.consulting, appItems.contact],
}

folders.applications = {
  id: 'applications', name: l('Программы', 'Applications'), glyph: 'none',
  items: [
    appItem('a-finder', 'finder', 'finder', l('Finder', 'Finder')),
    appItem('a-safari', 'safari', 'safari', l('Safari', 'Safari')),
    appItem('a-mail', 'mail', 'mail', l('Mail', 'Mail')),
    appItem('a-photos', 'photos', 'photos', l('Photos', 'Photos')),
    appItem('a-calendar', 'calendar', 'calendar', l('Calendar', 'Calendar')),
    appItem('a-notes', 'notes', 'notes', l('Notes', 'Notes')),
    appItem('a-music', 'music', 'music', l('Music', 'Music')),
    appItem('a-terminal', 'terminal', 'terminal', l('Terminal', 'Terminal')),
    appItem('a-preview', 'resume', 'preview', l('Preview', 'Preview')),
    appItems.timeline, appItems.consulting, appItems.contact,
  ],
}

folders.trash = { id: 'trash', name: l('Корзина', 'Trash'), glyph: 'none', items: [] }

export const allItems: FsItem[] = Object.values(folders).flatMap((f) => f.items)
