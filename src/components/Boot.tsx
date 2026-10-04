import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '../lib/i18n'

export type Phase = 'black' | 'boot' | 'desktop' | 'off'

/** Minimal boot screen: monogram + progress bar. Click to skip. */
export function BootScreen({ phase, quick, onSkip, onPowerOn }: { phase: Phase; quick: boolean; onSkip: () => void; onPowerOn: () => void }) {
  const { tt } = useLang()
  return (
    <AnimatePresence>
      {phase === 'boot' && (
        <motion.div
          key="boot"
          className="absolute inset-0 z-[9500] bg-black flex flex-col items-center justify-center cursor-default"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          onClick={onSkip}
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="serif italic text-white text-[64px] leading-none">B</motion.div>
          <div className="mt-10 h-[5px] w-[180px] max-w-[40%] rounded-full bg-white/20 overflow-hidden">
            <motion.div className="h-full bg-white rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: quick ? 0.7 : 1.7, ease: [0.4, 0, 0.2, 1] }} />
          </div>
        </motion.div>
      )}
      {phase === 'off' && (
        <motion.button
          key="off"
          className="absolute inset-0 z-[9500] bg-black flex flex-col items-center justify-center gap-3 text-white/50 text-[13px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onPowerOn}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3v8" /><path d="M6.3 6.3a8 8 0 1 0 11.4 0" /></svg>
          {tt('Нажмите, чтобы включить', 'Click to power on')}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
