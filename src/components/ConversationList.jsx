import { formatDate } from '../utils/formatDate'
import { useAppState, useAppDispatch } from '../hooks/useAppState'

export function ConversationList() {
  const { conversations, currentConversation } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <>
      {conversations.map((conv, i) => (
        <div
          key={conv.filename}
          className={`conversation-item${currentConversation === i ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SELECT_CONVERSATION', index: i })}
        >
          <div className="title">{conv.title}</div>
          <div className="meta">
            {formatDate(conv.frontmatter.date)} · {conv.turns.length} turns
          </div>
        </div>
      ))}
    </>
  )
}
