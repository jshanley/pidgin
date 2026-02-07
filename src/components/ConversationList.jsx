import { useNavigate, useParams } from '@tanstack/react-router'
import { slugify } from '../utils/slugify'
import { useAppState } from '../hooks/useAppState'

export function ConversationList({ onNavigate }) {
  const { conversations } = useAppState()
  const navigate = useNavigate()
  const params = useParams({ strict: false })

  const handleClick = (slug) => {
    navigate({ to: '/conversations/$slug', params: { slug } })
    onNavigate?.()
  }

  return (
    <>
      {conversations.map((conv) => {
        const slug = slugify(conv.title)
        const isActive = params.slug === slug
        return (
          <div
            key={conv.filename}
            className={`conversation-item${isActive ? ' active' : ''}`}
            onClick={() => handleClick(slug)}
          >
            <div className="title">{conv.title}</div>
          </div>
        )
      })}
    </>
  )
}
