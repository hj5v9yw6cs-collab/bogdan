import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Compass, FileUser, MessagesSquare, Repeat, ScanSearch, X } from 'lucide-react'
import { Toolbar, useWindow } from '../components/Window'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { bookingUrl, cities, employers, services } from '../data/content'
import { useSubmit } from './Contact'

const icons = { ScanSearch, MessagesSquare, Compass, FileUser, Repeat }

export default function Consulting() {
  const { t, tt } = useLang()
  const { win } = useWindow()
  const [sel, setSel] = useState<string>(services[0].id)
  const [booking, setBooking] = useState(false)

  useEffect(() => { if (win.params.book) setBooking(true) }, [win.nonce, win.params.book])

  const sber = employers.find((e) => e.id === 'sber')!
  const stats = [
    [String(sber.records.filter((r) => r.date && r.kind !== 'end').length), tt('кадровых записей в Сбербанке', 'HR records at Sberbank')],
    ['6', tt('сегментов: от розницы до СКБ', 'segments: retail to mid & large')],
    [String(cities.length), tt('городов', 'cities')],
    ['3', tt('компании', 'companies')],
  ]

  const book = () => (bookingUrl ? window.open(bookingUrl, '_blank') : setBooking(true))

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-win-solid">
      <div className="scroll flex-1 min-h-0">
        <div className="relative text-white overflow-hidden grain" style={{ background: 'radial-gradient(90% 120% at 85% 0%, rgba(245,213,138,.35), transparent 55%), linear-gradient(150deg,#23263a,#0b0b10 70%)' }}>
          <Toolbar />
          <div className="relative z-10 px-7 sm:px-9 pb-9">
            <div className="text-[11px] tracking-[0.2em] font-semibold text-[#f5d58a]">CAREER CONSULTING</div>
            <h1 className="serif text-[44px] sm:text-[56px] leading-[0.92] mt-3 max-w-[560px]">{tt('Карьера — это продукт. Её можно проектировать.', 'A career is a product. It can be designed.')}</h1>
            <p className="text-white/70 text-[14px] mt-4 max-w-[520px] leading-relaxed">{tt('Консультации от человека, который прошёл путь от мобильного менеджера по продажам до работы со средним и крупным бизнесом.', 'Consulting from someone who went from mobile sales manager to working with mid & large business.')}</p>
            <button className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#f5d58a] text-[#1a1a1a] font-semibold text-[13px] hover:brightness-105 active:scale-[.98] transition" onClick={book}>
              Book a consultation <ArrowRight size={15} />
            </button>
            <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
              {stats.map(([v, k]) => (
                <div key={k} className="bg-black/30 backdrop-blur p-3.5">
                  <div className="serif text-[30px] leading-none">{v}</div>
                  <div className="text-[11px] text-white/60 mt-1.5 leading-snug">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-8">
          <div className="eyebrow mb-4">{tt('Форматы', 'Services')}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {services.map((s, i) => {
              const I = icons[s.icon]
              const active = sel === s.id
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSel(s.id)}
                  className={`text-left rounded-2xl p-5 border transition-colors ${active ? 'border-accent bg-sel' : 'border-line bg-fill hover:bg-fill-2'} ${i === services.length - 1 && services.length % 2 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="size-10 rounded-xl bg-gradient-to-br from-[#2a2d3e] to-[#0b0b10] grid place-items-center text-[#f5d58a] shadow"><I size={19} strokeWidth={1.8} /></span>
                    <span className={`size-5 rounded-full border grid place-items-center ${active ? 'bg-accent border-accent text-white' : 'border-line'}`}>{active && <Check size={12} />}</span>
                  </div>
                  <div className="mt-4 font-semibold text-[15px]">{t(s.title)}</div>
                  <p className="text-[12.5px] text-ink-2 mt-1.5 leading-relaxed">{t(s.text)}</p>
                  <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-3">
                    <span>{s.duration ? t(s.duration) : <Need label={tt('длительность', 'duration')} />}</span>
                    <span>{s.price ?? <Need label={tt('цена', 'price')} />}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="btn-primary h-11 px-6" onClick={book}>Book a consultation <ArrowRight size={15} /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {booking && <BookingSheet initial={sel} onClose={() => setBooking(false)} />}
      </AnimatePresence>
    </div>
  )
}

function BookingSheet({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t, tt } = useLang()
  const { sent, submit } = useSubmit()
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    submit(`Consultation: ${f.get('service')}`, `${f.get('message')}\n\n${tt('Дата', 'Date')}: ${f.get('date')}\n— ${f.get('name')}, ${f.get('reply')}`)
  }
  return (
    <motion.div className="absolute inset-0 z-30 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
        className="w-full sm:max-w-[440px] bg-win-solid rounded-t-2xl sm:rounded-2xl shadow-2xl border border-line p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[16px]">Book a consultation</div>
          <button className="tb-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {sent ? (
          <div className="py-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} className="mx-auto size-14 rounded-full bg-emerald-500 grid place-items-center text-white"><Check size={26} /></motion.div>
            <div className="mt-4 font-semibold">{tt('Заявка подготовлена', 'Request ready')}</div>
            <p className="text-[12.5px] text-ink-2 mt-1">{tt('Демо-режим: подключите канал записи в content.ts → bookingUrl.', 'Demo mode: connect a booking channel in content.ts → bookingUrl.')}</p>
            <div className="mt-2"><Need label={tt('ссылка для записи', 'booking link')} /></div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-2.5 mt-4">
            <select name="service" defaultValue={initial} className="field">
              {services.map((s) => <option key={s.id} value={s.id}>{t(s.title)}</option>)}
            </select>
            <input name="name" required className="field" placeholder={tt('Имя', 'Name')} />
            <input name="reply" required className="field" placeholder={tt('Email или Telegram', 'Email or Telegram')} />
            <input name="date" type="date" className="field" />
            <textarea name="message" rows={3} className="field" placeholder={tt('Коротко о запросе', 'Briefly about your request')} />
            <button className="btn-primary h-10 mt-1">{tt('Отправить заявку', 'Send request')}</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
