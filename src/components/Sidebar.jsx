import { useAppState, useAppDispatch, useStats } from '../hooks/useAppState'
import { ConversationList } from './ConversationList'
import { AtomsList } from './AtomsList'

export function Sidebar() {
  const { currentTab } = useAppState()
  const dispatch = useAppDispatch()
  const stats = useStats()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Pidgin</h1>
        <div className="corpus-label">corpus</div>
      </div>
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab${currentTab === 'conversations' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'conversations' })}
        >
          Conversations
        </button>
        <button
          className={`sidebar-tab${currentTab === 'atoms' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'atoms' })}
        >
          Atoms
        </button>
      </div>
      <div className="sidebar-content">
        {currentTab === 'conversations' ? <ConversationList /> : <AtomsList />}
      </div>
      <div className="sidebar-footer">
        {stats.turnCount} turns · {stats.paragraphCount} paragraphs · {stats.atomCount} atoms
      </div>
    </aside>
  )
}
