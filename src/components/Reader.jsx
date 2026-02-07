import { memo, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { marked } from 'marked'
import { formatDate } from '../utils/formatDate'
import { slugify } from '../utils/slugify'
import { highlightAtoms } from '../utils/highlightAtoms'
import { useAppState } from '../hooks/useAppState'

marked.setOptions({ gfm: true, breaks: true })

export function Reader() {
  const { conversations, atoms } = useAppState()
  const params = useParams({ strict: false })
  const navigate = useNavigate()

  useEffect(() => {
    document.querySelector('.reader')?.scrollTo(0, 0)
  }, [params.slug])

  if (conversations.length === 0) {
    return <div className="empty-state">Loading...</div>
  }

  const conversation = params.slug
    ? conversations.find(c => slugify(c.title) === params.slug)
    : conversations[0]

  if (!conversation) {
    return <div className="empty-state">Conversation not found</div>
  }

  return (
    <div className="corpus">
      <ConversationSection conversation={conversation} atoms={atoms} />
    </div>
  )
}

const ConversationSection = memo(function ConversationSection({ conversation, atoms }) {
  const slug = slugify(conversation.title)

  return (
    <section id={slug} className="conversation-section">
      <header className="reader-header">
        <h1>{conversation.title}</h1>
        <div className="reader-meta">
          {conversation.frontmatter.date && (
            <span>{formatDate(conversation.frontmatter.date)}</span>
          )}
          {conversation.frontmatter.follows && (
            <span>follows: {conversation.frontmatter.follows}</span>
          )}
        </div>
      </header>
      <article className="turns">
        {conversation.turns.map((turn, i) => (
          <Turn key={i} turn={turn} atoms={atoms} />
        ))}
      </article>
    </section>
  )
})

const Turn = memo(function Turn({ turn, atoms }) {
  const rendered = marked.parse(turn.text)
  const highlighted = highlightAtoms(rendered, atoms)
  const turnClass = turn.role === 'tool' ? 'tool-turn' : turn.role === 'user' ? 'user-turn' : 'assistant-turn'
  const roleLabel = turn.role === 'tool' && turn.toolName ? `tool (${turn.toolName})` : turn.role

  return (
    <div className={`turn ${turnClass}`}>
      <div className="turn-header">
        <div className={`turn-role ${turn.role}`}>
          {roleLabel}
        </div>
        <div className="turn-rule"></div>
      </div>
      <div
        className="turn-content"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
})
