import { useEffect } from 'react'
import { Outlet, useParams, useNavigate, useMatches } from '@tanstack/react-router'
import { useAppDispatch, useAppState } from './hooks/useAppState'
import { Sidebar } from './components/Sidebar'
import { Reader } from './components/Reader'

export default function App() {
  const dispatch = useAppDispatch()
  const { scrollContainerRef } = useAppState()

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}dist/index.json`)
        if (!res.ok) throw new Error('Could not load index. Run: npm run build:index')
        const index = await res.json()

        const atomOccurrences = new Map()
        for (const [term, indices] of Object.entries(index.occurrences)) {
          atomOccurrences.set(term, indices)
        }

        dispatch({
          type: 'LOAD_DATA',
          conversations: index.conversations,
          readings: index.readings || [],
          chunks: index.chunks,
          atoms: index.terms,
          atomOccurrences
        })
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }

    loadData()
  }, [dispatch])

  return (
    <div className="layout">
      <Sidebar />
      <main className="reader" ref={scrollContainerRef}>
        <Reader />
      </main>
    </div>
  )
}
