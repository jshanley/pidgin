import { formatDate } from '../utils/formatDate'
import { useAppState } from '../hooks/useAppState'
import { Turn } from './Turn'
import { OccurrenceCard } from './OccurrenceCard'

export function Reader() {
  const { conversations, currentConversation, currentAtom, atoms, atomOccurrences, chunks } = useAppState()

  if (currentConversation !== null) {
    return <ConversationView conversation={conversations[currentConversation]} />
  }

  if (currentAtom !== null) {
    const atom = atoms.find(a => a.term === currentAtom)
    const indices = atomOccurrences.get(currentAtom) || []
    return <AtomView atom={atom} indices={indices} chunks={chunks} />
  }

  return <div className="empty-state">Select a conversation</div>
}

function ConversationView({ conversation }) {
  const metaParts = []
  if (conversation.frontmatter.date) {
    metaParts.push(<span key="date">{formatDate(conversation.frontmatter.date)}</span>)
  }
  if (conversation.frontmatter.follows) {
    metaParts.push(<span key="follows">follows: {conversation.frontmatter.follows}</span>)
  }

  return (
    <div className="reader-inner">
      <header className="reader-header">
        <h1>{conversation.title}</h1>
        {metaParts.length > 0 && <div className="reader-meta">{metaParts}</div>}
      </header>
      <article className="turns">
        {conversation.turns.map((turn, i) => (
          <Turn key={i} turn={turn} index={i} />
        ))}
      </article>
    </div>
  )
}

function AtomView({ atom, indices, chunks }) {
  return (
    <div className="reader-inner">
      <header className="reader-header">
        <h1>{atom?.term}</h1>
        <div className="reader-meta">
          <span>{indices.length} occurrence{indices.length !== 1 ? 's' : ''}</span>
          {atom?.source && (
            <span>named in: {atom.source.replace('.md', '').replace(/-/g, ' ')}</span>
          )}
        </div>
      </header>
      <div className="occurrences">
        {indices.length === 0 ? (
          <div className="empty-state">No occurrences found</div>
        ) : (
          indices.map(index => (
            <OccurrenceCard key={index} chunk={chunks[index]} />
          ))
        )}
      </div>
    </div>
  )
}
