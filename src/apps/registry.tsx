import type { ComponentType } from 'react'
import type { AppId, WinParams } from '../store/windows'
import type { IconKind } from '../components/icons'
import { allDocs, employerById, l, type EmployerId, type L } from '../data/content'
import Finder from './Finder'
import Safari from './Safari'
import Mail from './Mail'
import Photos from './Photos'
import Calendar from './Calendar'
import Notes from './Notes'
import Music from './Music'
import Terminal from './Terminal'
import Resume from './Resume'
import Company from './Company'
import Timeline from './Timeline'
import Contact from './Contact'
import Consulting from './Consulting'
import About from './About'
import Doc from './Doc'
import AboutMac from './AboutMac'

export type AppDef = {
  name: L
  icon: IconKind
  component: ComponentType
  size: { w: number; h: number }
  minSize?: { w: number; h: number }
  chrome: 'standard' | 'custom'
  resizable?: boolean
  title?: (p: WinParams) => L
}

export const apps: Record<AppId, AppDef> = {
  finder: { name: l('Finder', 'Finder'), icon: 'finder', component: Finder, size: { w: 920, h: 560 }, minSize: { w: 520, h: 340 }, chrome: 'custom' },
  safari: { name: l('Safari', 'Safari'), icon: 'safari', component: Safari, size: { w: 1040, h: 680 }, minSize: { w: 520, h: 360 }, chrome: 'custom' },
  mail: { name: l('Mail', 'Mail'), icon: 'mail', component: Mail, size: { w: 900, h: 560 }, minSize: { w: 620, h: 360 }, chrome: 'custom' },
  photos: { name: l('Photos', 'Photos'), icon: 'photos', component: Photos, size: { w: 940, h: 620 }, minSize: { w: 520, h: 360 }, chrome: 'custom' },
  calendar: { name: l('Calendar', 'Calendar'), icon: 'calendar', component: Calendar, size: { w: 960, h: 620 }, minSize: { w: 560, h: 420 }, chrome: 'custom' },
  notes: { name: l('Notes', 'Notes'), icon: 'notes', component: Notes, size: { w: 760, h: 500 }, minSize: { w: 520, h: 320 }, chrome: 'custom' },
  music: { name: l('Music', 'Music'), icon: 'music', component: Music, size: { w: 740, h: 500 }, minSize: { w: 600, h: 440 }, chrome: 'custom' },
  terminal: { name: l('Terminal', 'Terminal'), icon: 'terminal', component: Terminal, size: { w: 640, h: 400 }, minSize: { w: 380, h: 220 }, chrome: 'standard', title: () => l('bogdan — -zsh — 80×24', 'bogdan — -zsh — 80×24') },
  resume: { name: l('Preview', 'Preview'), icon: 'preview', component: Resume, size: { w: 780, h: 720 }, minSize: { w: 420, h: 360 }, chrome: 'custom' },
  company: {
    name: l('Career', 'Career'), icon: 'timeline', component: Company, size: { w: 820, h: 680 }, minSize: { w: 480, h: 400 }, chrome: 'custom',
    title: (p) => { const e = employerById[p.company as EmployerId]; return e ? l(e.folder, e.folder) : l('Career', 'Career') },
  },
  timeline: { name: l('Career Timeline', 'Career Timeline'), icon: 'timeline', component: Timeline, size: { w: 980, h: 680 }, minSize: { w: 560, h: 440 }, chrome: 'custom' },
  contact: { name: l('Contacts', 'Contacts'), icon: 'contacts', component: Contact, size: { w: 560, h: 680 }, minSize: { w: 400, h: 420 }, chrome: 'custom' },
  consulting: { name: l('Career Consulting', 'Career Consulting'), icon: 'consulting', component: Consulting, size: { w: 860, h: 700 }, minSize: { w: 460, h: 420 }, chrome: 'custom' },
  about: { name: l('About Me', 'About Me'), icon: 'about', component: About, size: { w: 940, h: 640 }, minSize: { w: 520, h: 420 }, chrome: 'custom' },
  doc: {
    name: l('TextEdit', 'TextEdit'), icon: 'notes', component: Doc, size: { w: 640, h: 560 }, minSize: { w: 380, h: 300 }, chrome: 'standard',
    title: (p) => { const d = allDocs.find((x) => x.id === p.doc); return d ? l(d.file, d.file) : l('TextEdit', 'TextEdit') },
  },
  aboutmac: { name: l('Об этом Mac', 'About This Mac'), icon: 'settings', component: AboutMac, size: { w: 300, h: 470 }, chrome: 'custom', resizable: false },
}

export const dockApps: AppId[] = ['finder', 'safari', 'mail', 'photos', 'calendar', 'notes', 'music', 'terminal']
export const dockExtras: AppId[] = ['timeline', 'consulting']
