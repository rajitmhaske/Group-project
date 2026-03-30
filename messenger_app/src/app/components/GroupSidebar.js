'use client'

const TABS = [
  { id: 'voting', label: 'Voting & Decisions', icon: '🗳️' },
  { id: 'progress', label: 'Progress Dashboard', icon: '📊' },
  { id: 'diary', label: 'Weekly Diary', icon: '📔' },
  { id: 'contributions', label: 'Contributions', icon: '🏆' },
  { id: 'structured-tasks', label: 'Task Board', icon: '📋' },
]

export default function GroupSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="group-sidebar">
      <div className="group-sidebar-header">
        <span className="group-sidebar-title">Group Tools</span>
      </div>
      <nav className="group-sidebar-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`group-sidebar-tab ${activeTab === tab.id ? 'group-sidebar-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="group-sidebar-icon">{tab.icon}</span>
            <span className="group-sidebar-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
