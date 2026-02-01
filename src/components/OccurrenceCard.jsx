import { marked } from 'marked'
import { UserIcon, AssistantIcon } from '../utils/icons'
import { highlightAtoms } from '../utils/highlightAtoms'
import { useAppState, useAppDispatch } from '../hooks/useAppState'

export function OccurrenceCard({ chunk }) {
  const { conversations, atoms } = useAppState()
  const dispatch = useAppDispatch()

  const convTitle = conversations.find(c => c.filename === chunk.source)?.title || chunk.source
  const rendered = highlightAtoms(marked.parse(chunk.text), atoms)
  const scaleLabel = chunk.scale === 'paragraph' ? 'paragraph' : 'turn'
  const Icon = chunk.role === 'user' ? UserIcon : AssistantIcon

  const handleClick = () => {
    const convIndex = conversations.findIndex(c => c.filename === chunk.source)
    if (convIndex >= 0) {
      dispatch({ type: 'SELECT_CONVERSATION', index: convIndex })
      setTimeout(() => {
        dispatch({ type: 'HIGHLIGHT_TURN', turnIndex: chunk.turnIndex })
        const el = document.querySelector(`.turn[data-turn="${chunk.turnIndex}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 50)
    }
  }

  return (
    <div className="occurrence-card" onClick={handleClick}>
      <div className="source">
        <span className={`role-icon ${chunk.role}`}>
          <Icon />
        </span>
        <span className="conv-title">{convTitle}</span>
        <span className="scale-label">{scaleLabel}</span>
      </div>
      <div className="text" dangerouslySetInnerHTML={{ __html: rendered }} />
    </div>
  )
}
