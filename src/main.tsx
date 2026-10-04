import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import './index.css'
import App from './App'
import { LangProvider } from './lib/i18n'
import { SystemProvider } from './store/system'
import { WindowsProvider } from './store/windows'
import { ResumeDocument } from './apps/Resume'

// ?print=resume renders only the CV page — used to generate the downloadable PDF.
const printResume = new URLSearchParams(location.search).get('print') === 'resume'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <MotionConfig reducedMotion="user">
        {printResume ? (
          <div className="mac" data-theme="light" style={{ background: '#fff' }}><ResumeDocument /></div>
        ) : (
          <SystemProvider>
            <WindowsProvider>
              <App />
            </WindowsProvider>
          </SystemProvider>
        )}
      </MotionConfig>
    </LangProvider>
  </StrictMode>,
)
