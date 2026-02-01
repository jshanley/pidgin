import { useStats } from '../hooks/useAppState'
import { ConversationList } from './ConversationList'

export function Sidebar() {
  const stats = useStats()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Pidgin</h1>
        <div className="corpus-label">corpus</div>
      </div>
      <div className="sidebar-content">
        <ConversationList />
      </div>
      <div className="sidebar-footer">
        {stats.turnCount} turns · {stats.paragraphCount} paragraphs · {stats.atomCount} atoms
      </div>
    </aside>
  )
}
