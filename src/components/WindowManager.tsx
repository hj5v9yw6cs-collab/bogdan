import { AnimatePresence } from 'motion/react'
import { useWindows } from '../store/windows'
import { apps } from '../apps/registry'
import { useLang } from '../lib/i18n'
import { Window, type Bounds } from './Window'

export function WindowManager({ bounds, mobile }: { bounds: Bounds; mobile: boolean }) {
  const { windows, focusedId } = useWindows()
  const { t } = useLang()
  if (!bounds.w || !bounds.h) return null
  return (
    <AnimatePresence>
      {windows.map((w) => {
        const def = apps[w.app]
        const App = def.component
        return (
          <Window
            key={w.id}
            win={w}
            title={t(def.title ? def.title(w.params) : def.name)}
            size={def.size}
            minSize={def.minSize}
            chrome={def.chrome}
            resizable={def.resizable}
            bounds={bounds}
            focused={focusedId === w.id}
            mobile={mobile}
          >
            <App />
          </Window>
        )
      })}
    </AnimatePresence>
  )
}
