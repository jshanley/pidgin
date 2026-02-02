import { useNavigate } from '@tanstack/react-router'
import { formatDate } from '../utils/formatDate'
import { slugify } from '../utils/slugify'
import { useAppState } from '../hooks/useAppState'

export function ConversationList({ onNavigate }) {
  const { conversations, activeSection } = useAppState()
  const navigate = useNavigate()

  const handleClick = (slug) => {
    navigate({ to: '/conversations/$slug', params: { slug } })
    onNavigate?.()
  }

  return (
    <>
      {conversations.map((conv) => {
        const slug = slugify(conv.title)
        const isActive = activeSection === slug
        return (
          <div
            key={conv.filename}
            className={`conversation-item${isActive ? ' active' : ''}`}
            onClick={() => handleClick(slug)}
          >
            <div className="title">{conv.title}</div>
            <div className="meta">
              {formatDate(conv.frontmatter.date)} · {conv.turns.length} turns
            </div>
          </div>
        )
      })}
    </>
  )
}
