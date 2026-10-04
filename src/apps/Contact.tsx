import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AtSign, Briefcase as Linkedin, Camera as Instagram, Check, Mail, MessageCircle, Send } from 'lucide-react'
import { Toolbar } from '../components/Window'
import { PhotoArt } from '../components/PhotoArt'
import { Need } from '../components/Need'
import { useLang } from '../lib/i18n'
import { contacts, portraits, profile } from '../data/content'

export function useSubmit() {
  const [sent, setSent] = useState(false)
  const submit = (subject: string, body: string) => {
    // No backend yet: hand the message to the visitor's mail client when an email is configured.
    if (contacts.email) window.location.href = `mailto:${contacts.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return { sent, setSent, submit }
}

export default function Contact() {
  const { t, tt } = useLang()
  const formRef = useRef<HTMLFormElement>(null)
  const { sent, setSent, submit } = useSubmit()

  const rows = [
    { icon: Mail, label: 'Email', value: contacts.email, href: contacts.email && `mailto:${contacts.email}` },
    { icon: MessageCircle, label: 'Telegram', value: contacts.telegram && `@${contacts.telegram}`, href: contacts.telegram && `https://t.me/${contacts.telegram}` },
    { icon: Instagram, label: 'Instagram', value: contacts.instagram && `@${contacts.instagram}`, href: contacts.instagram && `https://instagram.com/${contacts.instagram}` },
    { icon: Linkedin, label: 'LinkedIn', value: contacts.linkedin, href: contacts.linkedin && `https://linkedin.com/in/${contacts.linkedin}` },
  ]

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    submit(`Website: ${f.get('name')}`, `${f.get('message')}\n\n— ${f.get('name')}, ${f.get('reply')}`)
  }

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-win-solid">
      <div className="absolute inset-x-0 top-0 z-10"><Toolbar /></div>
      <div className="scroll flex-1 min-h-0">
        <div className="relative h-[150px] bg-gradient-to-br from-[#d7b48f] via-[#b08a66] to-[#5e4733] grain" />
        <div className="px-6 sm:px-8 -mt-14 relative">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
            <PhotoArt src={portraits.avatar.src} palette={portraits.avatar.palette} rounded="rounded-full" className="size-[104px] ring-4 ring-win-solid shadow-xl" position="50% 30%" hint={false} />
          </motion.div>
          <h1 className="serif text-[34px] leading-none mt-4">{t(profile.name)}</h1>
          <div className="text-[13px] text-ink-2 mt-1.5">Career / Business Development</div>
          <div className="text-[12px] text-ink-3">{t(profile.currentCompany)} · {t(profile.city)}</div>

          <div className="mt-5 flex gap-2">
            <button className="btn-primary" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><Send size={14} />Let’s talk</button>
            {contacts.telegram && <a className="btn-ghost" href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noreferrer">Telegram</a>}
          </div>

          <div className="mt-6 rounded-xl border border-line divide-y divide-line overflow-hidden">
            {rows.map(({ icon: I, label, value, href }) => (
              <div key={label} className="flex items-center gap-3 px-4 h-12 bg-fill/50">
                <I size={16} className="text-ink-3" strokeWidth={1.8} />
                <span className="w-24 text-[12px] text-ink-3">{label}</span>
                {value ? <a href={href || undefined} target="_blank" rel="noreferrer" className="text-[13px] text-accent truncate hover:underline">{value}</a> : <Need />}
              </div>
            ))}
          </div>

          <form ref={formRef} onSubmit={onSubmit} className="mt-8 mb-10 scroll-mt-16">
            <div className="eyebrow mb-3">{tt('Написать сообщение', 'Send a message')}</div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-line bg-fill p-8 text-center">
                  <div className="mx-auto size-12 rounded-full bg-emerald-500 grid place-items-center text-white"><Check size={22} /></div>
                  <div className="mt-3 font-semibold">{tt('Сообщение подготовлено', 'Message ready')}</div>
                  <p className="text-[12.5px] text-ink-2 mt-1">{contacts.email ? tt('Откроется ваш почтовый клиент.', 'Your mail app will open.') : tt('Форма в демо-режиме — канал доставки ещё не подключён.', 'Demo mode — delivery channel not connected yet.')}</p>
                  {!contacts.email && <div className="mt-2"><Need label={tt('куда отправлять заявки', 'where to deliver messages')} /></div>}
                  <button type="button" className="btn-ghost mt-4 h-8" onClick={() => setSent(false)}>{tt('Новое сообщение', 'New message')}</button>
                </motion.div>
              ) : (
                <motion.div key="form" className="grid gap-2.5">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <input name="name" required className="field" placeholder={tt('Имя', 'Name')} />
                    <div className="relative"><AtSign size={14} className="absolute left-3 top-3 text-ink-3" /><input name="reply" required className="field pl-8" placeholder={tt('Email или Telegram', 'Email or Telegram')} /></div>
                  </div>
                  <textarea name="message" required rows={4} className="field" placeholder={tt('Чем я могу помочь?', 'How can I help?')} />
                  <button className="btn-primary justify-self-start">{tt('Отправить', 'Send')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  )
}
