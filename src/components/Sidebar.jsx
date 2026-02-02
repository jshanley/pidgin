import { useStats } from '../hooks/useAppState'
import { ConversationList } from './ConversationList'

export function Sidebar({ className = '', onNavigate }) {
  const stats = useStats()

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <h1>Pidgin</h1>
        <div className="corpus-label">corpus</div>
      </div>
      <div className="sidebar-content">
        <ConversationList onNavigate={onNavigate} />
      </div>
      <div className="sidebar-footer">
        {stats.turnCount} turns · {stats.paragraphCount} paragraphs · {stats.atomCount} atoms
      </div>
    </aside>
  )
}
