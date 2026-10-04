import { useCallback, useEffect, useRef, useState } from 'react'
import { Desktop } from './components/Desktop'
import { BootScreen, type Phase } from './components/Boot'
import { useIsMobile } from './lib/hooks'
import { useWindows } from './store/windows'

const visited = () => { try { return sessionStorage.getItem('bs-booted') === '1' } catch { return false } }

export default function App() {
  const mobile = useIsMobile()
  const { closeAll } = useWindows()
  const [phase, setPhase] = useState<Phase>('black')
  const quick = useRef(visited())
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const boot = useCallback((fast: boolean) => {
    clear()
    setPhase('black')
    later(() => setPhase('boot'), fast ? 250 : 300)
    later(() => { setPhase('desktop'); try { sessionStorage.setItem('bs-booted', '1') } catch { /* ignore */ } }, fast ? 1150 : 2100)
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

  // Full-screen desktop on every device — the browser window is the Mac screen.
  return <div className="fixed inset-0 bg-black overflow-hidden" style={{ height: '100dvh' }}>{screen}</div>
}
