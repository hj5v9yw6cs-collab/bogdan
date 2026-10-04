import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { MacBook } from './components/MacBook'
import { Desktop } from './components/Desktop'
import { BootScreen, type Phase } from './components/Boot'
import { useIsMobile } from './lib/hooks'
import { useLang } from './lib/i18n'
import { useWindows } from './store/windows'

const visited = () => { try { return sessionStorage.getItem('bs-booted') === '1' } catch { return false } }

export default function App() {
  const mobile = useIsMobile()
  const { tt } = useLang()
  const { closeAll } = useWindows()
  const [phase, setPhase] = useState<Phase>('black')
  const quick = useRef(visited())
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const boot = useCallback((fast: boolean) => {
    clear()
    setPhase('black')
    later(() => setPhase('boot'), fast ? 250 : mobile ? 300 : 900)
    later(() => { setPhase('desktop'); try { sessionStorage.setItem('bs-booted', '1') } catch { /* ignore */ } }, fast ? 1150 : mobile ? 2100 : 2900)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile])

  useEffect(() => { boot(quick.current); return clear }, [boot])

  const skip = () => { clear(); setPhase('desktop') }
  const restart = () => { closeAll(); setPhase('black'); later(() => boot(true), 500) }
  const shutDown = () => { clear(); closeAll(); setPhase('black'); later(() => setPhase('off'), 600) }

  const screen = (
    <>
      <Desktop mobile={mobile} stage={phase === 'desktop' ? 'desktop' : 'boot'} onRestart={restart} onShutDown={shutDown} />
      <BootScreen phase={phase} quick={quick.current} onSkip={skip} onPowerOn={() => boot(true)} />
    </>
  )

  if (mobile) {
    return <div className="fixed inset-0 bg-black overflow-hidden" style={{ height: '100dvh' }}>{screen}</div>
  }

  return (
    <div className="stage fixed inset-0 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(60%_50%_at_50%_40%,#1d1e2a_0%,#0b0b10_55%,#050507_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(120,130,200,0.08),transparent)]" />
      <div className="relative">
        <MacBook lidOn={phase !== 'black'}>{screen}</MacBook>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'desktop' ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative mt-4 text-[10.5px] tracking-[0.32em] text-white/35 font-medium select-none text-center"
      >
        THE MACBOOK OF BOGDAN STAROGORODTSEV <span className="mx-2 text-white/20">·</span> {tt('ИНТЕРАКТИВНОЕ ПОРТФОЛИО', 'INTERACTIVE PORTFOLIO')}
      </motion.div>
    </div>
  )
}
