import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'

export type AppId = 'info' | 'alert' | 'cv'

export type WinParams = Record<string, string>

export type Win = {
  id: string
  app: AppId
  params: WinParams
  z: number
  minimized: boolean
  maximized: boolean
  /** Bumped every time the window is re-opened, so apps can react to new params. */
  nonce: number
  /** Order of opening, used for cascading new windows. */
  seq: number
}

type State = { windows: Win[]; z: number; seq: number }

type Action =
  | { type: 'open'; app: AppId; params?: WinParams; key?: string }
  | { type: 'close'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'toggleMax'; id: string }
  | { type: 'closeAll' }

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'open': {
      const id = a.key ?? a.app
      const z = state.z + 1
      const existing = state.windows.find((w) => w.id === id)
      if (existing) {
        return {
          ...state,
          z,
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, params: { ...w.params, ...a.params }, minimized: false, z, nonce: w.nonce + 1 } : w,
          ),
        }
      }
      const seq = state.seq + 1
      return {
        z,
        seq,
        windows: [...state.windows, { id, app: a.app, params: a.params ?? {}, z, minimized: false, maximized: false, nonce: 0, seq }],
      }
    }
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.id !== a.id) }
    case 'minimize':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) }
    case 'focus': {
      const target = state.windows.find((w) => w.id === a.id)
      if (!target || (target.z === state.z && !target.minimized)) return state
      const z = state.z + 1
      return { ...state, z, windows: state.windows.map((w) => (w.id === a.id ? { ...w, z, minimized: false } : w)) }
    }
    case 'toggleMax':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, maximized: !w.maximized } : w)) }
    case 'closeAll':
      return { ...state, windows: [] }
  }
}

type Ctx = {
  windows: Win[]
  focusedId: string | null
  focused: Win | null
  open: (app: AppId, params?: WinParams, key?: string) => void
  close: (id: string) => void
  minimize: (id: string) => void
  focus: (id: string) => void
  toggleMax: (id: string) => void
  closeAll: () => void
  isOpen: (app: AppId) => boolean
}

const WindowsContext = createContext<Ctx | null>(null)

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], z: 10, seq: 0 })

  const open = useCallback((app: AppId, params?: WinParams, key?: string) => dispatch({ type: 'open', app, params, key }), [])
  const close = useCallback((id: string) => dispatch({ type: 'close', id }), [])
  const minimize = useCallback((id: string) => dispatch({ type: 'minimize', id }), [])
  const focus = useCallback((id: string) => dispatch({ type: 'focus', id }), [])
  const toggleMax = useCallback((id: string) => dispatch({ type: 'toggleMax', id }), [])
  const closeAll = useCallback(() => dispatch({ type: 'closeAll' }), [])

  const value = useMemo<Ctx>(() => {
    const visible = state.windows.filter((w) => !w.minimized)
    const focused = visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)) : null
    return {
      windows: state.windows,
      focused,
      focusedId: focused?.id ?? null,
      open, close, minimize, focus, toggleMax, closeAll,
      isOpen: (app) => state.windows.some((w) => w.app === app),
    }
  }, [state.windows, open, close, minimize, focus, toggleMax, closeAll])

  return <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
}

export function useWindows() {
  const ctx = useContext(WindowsContext)
  if (!ctx) throw new Error('useWindows outside WindowsProvider')
  return ctx
}
