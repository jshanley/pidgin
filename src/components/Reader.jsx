import { useEffect, useRef, memo } from 'react'
import { useParams, useNavigate, useLocation } from '@tanstack/react-router'
import { marked } from 'marked'
import { formatDate } from '../utils/formatDate'
import { slugify } from '../utils/slugify'
import { highlightAtoms } from '../utils/highlightAtoms'
import { UserIcon, AssistantIcon, ToolIcon } from '../utils/icons'
import { useAppState } from '../hooks/useAppState'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { scrollToElement } from '../hooks/useScrollSpy'

marked.setOptions({ gfm: true, breaks: true })

export function Reader() {
  const { conversations, atoms, activeSection, setActiveSection, scrollContainerRef } = useAppState()
  const params = useParams({ strict: false })
  const navigate = useNavigate()
  const location = useLocation()
  const isScrollingRef = useRef(false)
  const activeId = useScrollSpy(scrollContainerRef, 'section[id]', conversations.length > 0)

  const targetSlug = params.slug

  // Update URL when scroll spy detects new section (replaceState behavior)
  useEffect(() => {
    // Don't update URL while programmatic scroll is in progress
    if (isScrollingRef.current) return
    if (activeId && activeId !== activeSection) {
      setActiveSection(activeId)
      // Only update URL if we're on a conversations route
      if (location.pathname.startsWith('/conversations')) {
        navigate({
          to: '/conversations/$slug',
          params: { slug: activeId },
          replace: true // replaceState, no history
        })
      }
    }
  }, [activeId, activeSection, setActiveSection, navigate, location.pathname])

  // Scroll to target conversation on route change
  useEffect(() => {
    if (targetSlug && conversations.length > 0 && scrollContainerRef.current) {
      const el = document.getElementById(targetSlug)
      if (el) {
        isScrollingRef.current = true
        setActiveSection(targetSlug)
        scrollToElement(el, scrollContainerRef.current, 400)
        // Re-enable scroll spy after animation completes
        setTimeout(() => {
          isScrollingRef.current = false
        }, 450)
      }
    }
  }, [targetSlug, conversations.length, scrollContainerRef, setActiveSection])

  if (conversations.length === 0) {
    return <div className="empty-state">Loading...</div>
  }

  return (
    <div className="corpus">
      {conversations.map(conv => (
        <ConversationSection key={conv.filename} conversation={conv} atoms={atoms} />
      ))}
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
  const Icon = turn.role === 'tool' ? ToolIcon : turn.role === 'user' ? UserIcon : AssistantIcon
  const turnClass = turn.role === 'tool' ? 'tool-turn' : turn.role === 'user' ? 'user-turn' : 'assistant-turn'
  const roleLabel = turn.role === 'tool' && turn.toolName ? `tool (${turn.toolName})` : turn.role

  return (
    <div className={`turn ${turnClass}`}>
      <div className="turn-icon">
        <Icon />
      </div>
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
