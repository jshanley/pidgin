import { marked } from 'marked'
import { UserIcon, AssistantIcon } from '../utils/icons'
import { highlightAtoms } from '../utils/highlightAtoms'
import { useAppState, useAppDispatch } from '../hooks/useAppState'

marked.setOptions({ gfm: true, breaks: true })

export function Turn({ turn, index }) {
  const { atoms, highlightedTurn } = useAppState()
  const dispatch = useAppDispatch()

  const rendered = marked.parse(turn.text)
  const highlighted = highlightAtoms(rendered, atoms)
  const Icon = turn.role === 'user' ? UserIcon : AssistantIcon
  const turnClass = turn.role === 'user' ? 'user-turn' : 'assistant-turn'
  const isHighlighted = highlightedTurn === index

  const handleAtomClick = (e) => {
    if (e.target.classList.contains('atom-highlight')) {
      e.stopPropagation()
      const term = e.target.dataset.atom
      dispatch({ type: 'SELECT_ATOM', term })
    }
  }

  return (
    <div
      className={`turn ${turnClass}${isHighlighted ? ' highlighted' : ''}`}
      data-turn={index}
    >
      <div className="turn-header">
        <div className={`turn-role ${turn.role}`}>
          <Icon />
          {turn.role}
        </div>
        <div className="turn-rule"></div>
      </div>
      <div
        className="turn-content"
        onClick={handleAtomClick}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
}
