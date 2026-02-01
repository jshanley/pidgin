import { useEffect } from 'react'
import { AppStateProvider, useAppDispatch } from './hooks/useAppState'
import { Sidebar } from './components/Sidebar'
import { Reader } from './components/Reader'
import './App.css'

function AppContent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/dist/index.json')
        if (!res.ok) throw new Error('Could not load index. Run: npm run build:index')
        const index = await res.json()

        const atomOccurrences = new Map()
        for (const [term, indices] of Object.entries(index.occurrences)) {
          atomOccurrences.set(term, indices)
        }

        dispatch({
          type: 'LOAD_DATA',
          conversations: index.conversations,
          chunks: index.chunks,
          atoms: index.terms,
          atomOccurrences
        })

        if (index.conversations.length > 0) {
          dispatch({ type: 'SELECT_CONVERSATION', index: 0 })
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }

    loadData()
  }, [dispatch])

  return (
    <div className="layout">
      <Sidebar />
      <main className="reader">
        <Reader />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  )
}
