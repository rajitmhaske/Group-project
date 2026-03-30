'use client'
import { useState } from 'react'

const MEMBERS = ['Me', 'User 1', 'User 2', 'User 3', 'User 4']

const PRIORITIES = {
  critical: { label: 'Critical', color: '#f44336', icon: '🔴' },
  high: { label: 'High', color: '#ff9800', icon: '🟠' },
  medium: { label: 'Medium', color: '#ffeb3b', icon: '🟡' },
  low: { label: 'Low', color: '#4caf50', icon: '🟢' },
}

const STATUSES = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done']

const INITIAL_TASKS = [
  {
    id: 'st1', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', assignee: 'Me', priority: 'high', status: 'In Progress', sprint: 1, storyPoints: 8, dueDate: '2026-04-05', tags: ['devops', 'automation'], subtasks: [{ id: 'sub1', title: 'Configure GitHub Actions', done: true }, { id: 'sub2', title: 'Set up staging environment', done: false }],
  },
  {
    id: 'st2', title: 'User authentication flow', description: 'Implement JWT-based auth with refresh tokens', assignee: 'Me', priority: 'critical', status: 'Review', sprint: 1, storyPoints: 13, dueDate: '2026-04-01', tags: ['backend', 'security'], subtasks: [{ id: 'sub3', title: 'Login endpoint', done: true }, { id: 'sub4', title: 'JWT middleware', done: true }, { id: 'sub5', title: 'Refresh token logic', done: false }],
  },
  {
    id: 'st3', title: 'Dashboard component', description: 'Build reusable dashboard UI with charts and stats', assignee: 'User 1', priority: 'high', status: 'In Progress', sprint: 2, storyPoints: 10, dueDate: '2026-04-08', tags: ['frontend', 'ui'], subtasks: [{ id: 'sub6', title: 'Stats cards', done: true }, { id: 'sub7', title: 'Charts integration', done: false }],
  },
  {
    id: 'st4', title: 'REST API endpoints', description: 'Create all CRUD endpoints for core data models', assignee: 'User 2', priority: 'critical', status: 'In Progress', sprint: 2, storyPoints: 15, dueDate: '2026-04-02', tags: ['backend', 'api'], subtasks: [],
  },
  {
    id: 'st5', title: 'Database optimization', description: 'Add indexes and optimize slow queries', assignee: 'User 3', priority: 'medium', status: 'Backlog', sprint: 3, storyPoints: 5, dueDate: '2026-04-15', tags: ['database'], subtasks: [],
  },
  {
    id: 'st6', title: 'Write unit tests', description: 'Achieve 80% code coverage across all modules', assignee: 'User 3', priority: 'high', status: 'Todo', sprint: 2, storyPoints: 8, dueDate: '2026-04-10', tags: ['testing'], subtasks: [],
  },
  {
    id: 'st7', title: 'Mobile responsiveness', description: 'Ensure all pages work on mobile devices', assignee: 'User 1', priority: 'medium', status: 'Backlog', sprint: 3, storyPoints: 6, dueDate: '2026-04-20', tags: ['frontend', 'mobile'], subtasks: [],
  },
  {
    id: 'st8', title: 'Security vulnerability audit', description: 'Run OWASP checklist and fix any issues found', assignee: 'User 2', priority: 'critical', status: 'Backlog', sprint: 3, storyPoints: 10, dueDate: '2026-04-18', tags: ['security'], subtasks: [],
  },
]

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [assignee, setAssignee] = useState(task?.assignee || 'Me')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [status, setStatus] = useState(task?.status || 'Backlog')
  const [sprint, setSprint] = useState(task?.sprint || 1)
  const [storyPoints, setStoryPoints] = useState(task?.storyPoints || 5)
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [tags, setTags] = useState(task?.tags?.join(', ') || '')
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSub, setNewSub] = useState('')

  const addSubtask = () => {
    if (newSub.trim()) {
      setSubtasks(s => [...s, { id: `sub-${Date.now()}`, title: newSub.trim(), done: false }])
      setNewSub('')
    }
  }

  const toggleSubtask = (id) => {
    setSubtasks(s => s.map(st => st.id === id ? { ...st, done: !st.done } : st))
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: task?.id || `st-${Date.now()}`,
      title: title.trim(),
      description,
      assignee,
      priority,
      status,
      sprint: Number(sprint),
      storyPoints: Number(storyPoints),
      dueDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      subtasks,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{task?.id ? 'Edit Task' : 'New Task'}</h2>

        <div className="modal-form-group">
          <label className="modal-label">Title</label>
          <input className="modal-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title..." />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Description</label>
          <textarea className="modal-input" style={{ minHeight: 80 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="What needs to be done?" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="modal-form-group">
            <label className="modal-label">Assignee</label>
            <select className="modal-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
              {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Priority</label>
            <select className="modal-select" value={priority} onChange={e => setPriority(e.target.value)}>
              {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Status</label>
            <select className="modal-select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="modal-form-group">
            <label className="modal-label">Sprint</label>
            <input type="number" className="modal-input" min="1" max="10" value={sprint} onChange={e => setSprint(e.target.value)} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Story Points</label>
            <input type="number" className="modal-input" min="1" max="21" value={storyPoints} onChange={e => setStoryPoints(e.target.value)} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Due Date</label>
            <input type="date" className="modal-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Tags</label>
          <input className="modal-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="frontend, backend, bug..." />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Subtasks</label>
          <div className="subtasks-list">
            {subtasks.map(st => (
              <div key={st.id} className="subtask-row">
                <input type="checkbox" checked={st.done} onChange={() => toggleSubtask(st.id)} />
                <span style={{ textDecoration: st.done ? 'line-through' : 'none', color: st.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{st.title}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input className="modal-input" style={{ flex: 1 }} value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubtask()} placeholder="Add subtask..." />
              <button className="modal-btn modal-btn--done" style={{ padding: '8px 12px' }} onClick={addSubtask}>Add</button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={handleSave}>Save Task</button>
        </div>
      </div>
    </div>
  )
}

function KanbanCard({ task, onEdit, onDelete }) {
  const priority = PRIORITIES[task.priority] || PRIORITIES.medium
  const daysLeft = task.dueDate ? Math.floor((new Date(task.dueDate) - new Date('2026-03-30')) / (1000 * 60 * 60 * 24)) : null
  const subtasksDone = task.subtasks.filter(s => s.done).length
  const subtasksTotal = task.subtasks.length

  return (
    <div className="kanban-card" onClick={() => onEdit(task)}>
      <div className="kanban-card-priority" style={{ background: priority.color }} />
      <div className="kanban-card-header">
        <span className="kanban-priority-icon">{priority.icon}</span>
        <span className="kanban-sp-badge">{task.storyPoints}sp</span>
      </div>
      <div className="kanban-card-title">{task.title}</div>
      {task.description && <div className="kanban-card-desc">{task.description.slice(0, 60)}...</div>}
      <div className="kanban-card-tags">
        {task.tags.map(t => <span key={t} className="kanban-tag">#{t}</span>)}
      </div>
      <div className="kanban-card-footer">
        <span className="kanban-assignee">👤 {task.assignee}</span>
        {subtasksTotal > 0 && <span className="kanban-subtasks">☑ {subtasksDone}/{subtasksTotal}</span>}
        {daysLeft !== null && (
          <span className={`kanban-due ${daysLeft < 0 ? 'kanban-due--overdue' : daysLeft <= 3 ? 'kanban-due--urgent' : ''}`}>
            {daysLeft < 0 ? `${Math.abs(daysLeft)}d over` : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
          </span>
        )}
      </div>
      <button className="kanban-delete-btn" onClick={e => { e.stopPropagation(); onDelete(task.id) }}>✕</button>
    </div>
  )
}

export default function StructuredTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [editTask, setEditTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState('kanban') // kanban | list
  const [filterSprint, setFilterSprint] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')

  const sprints = [...new Set(tasks.map(t => t.sprint))].sort()

  const filtered = tasks.filter(t => {
    if (filterSprint !== 'all' && t.sprint !== Number(filterSprint)) return false
    if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false
    return true
  })

  const handleSave = (task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id)
      return exists ? prev.map(t => t.id === task.id ? task : t) : [task, ...prev]
    })
    setEditTask(null)
    setShowModal(false)
  }

  const handleDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const handleEdit = (task) => {
    setEditTask(task)
    setShowModal(true)
  }

  const totalSP = filtered.reduce((s, t) => s + t.storyPoints, 0)
  const doneSP = filtered.filter(t => t.status === 'Done').reduce((s, t) => s + t.storyPoints, 0)

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Structured Task System</h2>
          <p className="panel-subtitle">Kanban board with sprints, story points & priorities</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`view-toggle-btn ${view === 'kanban' ? 'view-toggle-btn--active' : ''}`} onClick={() => setView('kanban')}>📋 Kanban</button>
          <button className={`view-toggle-btn ${view === 'list' ? 'view-toggle-btn--active' : ''}`} onClick={() => setView('list')}>📄 List</button>
          <button className="panel-action-btn" onClick={() => { setEditTask(null); setShowModal(true) }}>+ New Task</button>
        </div>
      </div>

      {/* Filters & stats */}
      <div className="task-filters">
        <select className="modal-select" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }} value={filterSprint} onChange={e => setFilterSprint(e.target.value)}>
          <option value="all">All Sprints</option>
          {sprints.map(s => <option key={s} value={s}>Sprint {s}</option>)}
        </select>
        <select className="modal-select" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }} value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
          <option value="all">All Members</option>
          {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="sprint-progress">
          <span className="sprint-progress-label">{doneSP}/{totalSP} story points</span>
          <div className="progress-bar-bg" style={{ width: 120 }}>
            <div className="progress-bar-fill" style={{ width: `${totalSP > 0 ? (doneSP / totalSP) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="kanban-board">
          {STATUSES.map(status => {
            const colTasks = filtered.filter(t => t.status === status)
            return (
              <div key={status} className="kanban-column">
                <div className="kanban-column-header">
                  <span className="kanban-column-title">{status}</span>
                  <span className="kanban-column-count">{colTasks.length}</span>
                </div>
                <div className="kanban-column-body">
                  {colTasks.map(task => (
                    <KanbanCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                  {colTasks.length === 0 && <div className="kanban-empty">Drop tasks here</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="task-list">
          <div className="task-list-header">
            <span>Task</span><span>Assignee</span><span>Priority</span><span>Status</span><span>Sprint</span><span>Due</span><span>SP</span>
          </div>
          {filtered.map(task => {
            const p = PRIORITIES[task.priority]
            const daysLeft = task.dueDate ? Math.floor((new Date(task.dueDate) - new Date('2026-03-30')) / (1000 * 60 * 60 * 24)) : null
            return (
              <div key={task.id} className="task-list-row" onClick={() => handleEdit(task)}>
                <span className="task-list-title">{task.title}</span>
                <span>{task.assignee}</span>
                <span style={{ color: p.color }}>{p.icon} {p.label}</span>
                <span><span className={`status-chip status-chip--${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></span>
                <span>Sprint {task.sprint}</span>
                <span className={daysLeft !== null && daysLeft < 0 ? 'text-overdue' : daysLeft !== null && daysLeft <= 3 ? 'text-urgent' : ''}>{task.dueDate || '—'}</span>
                <span>{task.storyPoints}sp</span>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
