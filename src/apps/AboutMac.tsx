import { Fragment } from 'react'
import { motion } from 'motion/react'
import { PhotoArt } from '../components/PhotoArt'
import { useLang } from '../lib/i18n'
import { useWindows } from '../store/windows'
import { ageFrom, cities, employers, portraits, profile } from '../data/content'

export default function AboutMac() {
  const { t, tt } = useLang()
  const { open } = useWindows()
  const sber = employers.find((e) => e.id === 'sber')!
  const rows: [string, string][] = [
    [tt('Процессор', 'Chip'), `Zelenodolsk ${tt('(Татарстан)', '(Tatarstan)')}`],
    [tt('Память', 'Memory'), `${sber.records.filter((r) => r.date && r.kind !== 'end').length} ${tt('записей в Сбербанке', 'Sberbank records')}`],
    [tt('Загрузочный диск', 'Startup disk'), t(profile.city)],
    [tt('Маршрут', 'Route'), `${cities.length} ${tt('городов', 'cities')}`],
    [tt('Аптайм', 'Uptime'), `${ageFrom(profile.birthDate)} ${tt('лет', 'years')}`],
    ['macOS', 'BogdanOS · Next Chapter'],
  ]
  return (
    <div className="h-full bg-win-solid flex flex-col items-center px-8 pt-10 pb-7 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <PhotoArt src={portraits.hero.src} palette={portraits.hero.palette} rounded="rounded-full" className="size-[110px] shadow-xl" position="50% 18%" hint={false} />
      </motion.div>
      <div className="text-[22px] font-semibold mt-5">MacBook Bogdan</div>
      <div className="text-[12px] text-ink-3">{t(profile.name)}</div>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px] text-left">
        {rows.map(([k, v]) => (<Fragment key={k}><dt className="text-right text-ink-2">{k}</dt><dd>{v}</dd></Fragment>))}
      </dl>
      <button className="btn-ghost h-8 mt-6 text-[12px]" onClick={() => open('about')}>{tt('Подробнее…', 'More Info…')}</button>
      <div className="mt-auto text-[10.5px] text-ink-3 pt-4">™ & © 2001–{new Date().getFullYear()} Bogdan Starogorodtsev</div>
    </div>
  )
}
