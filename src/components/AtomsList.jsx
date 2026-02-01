import { useMemo } from 'react'
import { useAppState, useAppDispatch } from '../hooks/useAppState'

export function AtomsList() {
  const { atoms, atomOccurrences, currentAtom } = useAppState()
  const dispatch = useAppDispatch()

  const sorted = useMemo(() => {
    return [...atoms].sort((a, b) => {
      const countA = atomOccurrences.get(a.term)?.length || 0
      const countB = atomOccurrences.get(b.term)?.length || 0
      return countB - countA
    })
  }, [atoms, atomOccurrences])

  if (atoms.length === 0) {
    return <div className="empty-state">No atoms defined</div>
  }

  return (
    <>
      <div className="atoms-header">Named concepts</div>
      {sorted.map(atom => {
        const count = atomOccurrences.get(atom.term)?.length || 0
        return (
          <div
            key={atom.term}
            className={`atom-item${currentAtom === atom.term ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_ATOM', term: atom.term })}
          >
            <span className="term">{atom.term}</span>
            <span className="count">{count} passages</span>
          </div>
        )
      })}
    </>
  )
}
