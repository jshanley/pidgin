import { createContext, useContext, useReducer, useMemo } from 'react'

const AppStateContext = createContext(null)
const AppDispatchContext = createContext(null)

const initialState = {
  conversations: [],
  readings: [],
  chunks: [],
  atoms: [],
  atomOccurrences: new Map(),
  currentTab: 'conversations'
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        conversations: action.conversations,
        readings: action.readings || [],
        chunks: action.chunks,
        atoms: action.atoms,
        atomOccurrences: action.atomOccurrences
      }
    case 'SET_TAB':
      return {
        ...state,
        currentTab: action.tab
      }
    default:
      return state
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const contextValue = useMemo(() => state, [state])

  return (
    <AppStateContext.Provider value={contextValue}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)
  if (!context) throw new Error('useAppDispatch must be used within AppStateProvider')
  return context
}

export function useStats() {
  const { chunks, atoms } = useAppState()
  return useMemo(() => ({
    turnCount: chunks.filter(c => c.scale === 'turn').length,
    paragraphCount: chunks.filter(c => c.scale === 'paragraph').length,
    atomCount: atoms.length
  }), [chunks, atoms])
}
