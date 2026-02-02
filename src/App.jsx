import { useEffect, useState, useRef, useCallback } from 'react'
import { Outlet, useParams, useNavigate, useMatches } from '@tanstack/react-router'
import { useAppDispatch, useAppState } from './hooks/useAppState'
import { Sidebar } from './components/Sidebar'
import { Reader } from './components/Reader'

export default function App() {
  const dispatch = useAppDispatch()
  const { scrollContainerRef } = useAppState()
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  const handleScroll = useCallback((e) => {
    const scrollY = e.target.scrollTop
    const delta = scrollY - lastScrollY.current
    if (Math.abs(delta) > 10) {
      setHeaderVisible(delta < 0 || scrollY < 50)
      lastScrollY.current = scrollY
    }
  }, [])

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
      <header className={`mobile-header${headerVisible ? '' : ' hidden'}`}>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="mobile-header-title">Pidgin</span>
      </header>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
      <Sidebar className={menuOpen ? 'open' : ''} onNavigate={() => setMenuOpen(false)} />
      <main className="reader" ref={scrollContainerRef} onScroll={handleScroll}>
        <Reader />
      </main>
    </div>
  )
}
