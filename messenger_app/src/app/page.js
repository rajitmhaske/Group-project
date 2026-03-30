'use client'

import { useState } from 'react'
import { ChatPanel, MessagesSidebar } from './components/chat'
import { UserAvatar } from './components/user'
import { PlusIcon, TrashIcon } from './components/icons'
import GroupSidebar from './components/GroupSidebar'
import GroupVoting from './components/GroupVoting'
import ProgressDashboard from './components/ProgressDashboard'
import WeeklyDiary from './components/WeeklyDiary'
import ContributionDashboard from './components/ContributionDashboard'
import StructuredTasks from './components/StructuredTasks'

const DEFAULT_USERS = [
  { id: 'user1', name: 'User 1', color: '#2FA761' },
  { id: 'user2', name: 'User 2', color: '#A72F77' },
  { id: 'user3', name: 'User 3', color: '#A7412F' },
  { id: 'user4', name: 'User 4', color: '#A72F31' },
]

const ME = { id: 'me', name: 'Me', color: '#7CCCDE' }

const INITIAL_GROUPS = [
  { id: 'grp1', name: 'INFO2222 Group Chat', memberIds: ['me', 'user1', 'user2', 'user3', 'user4'] },
]

const INITIAL_TASKS_GRP1 = {
  myself: [
    {
      id: 'db-integration',
      title: 'Database Integration',
      assignee: 'Me',
      status: 'Ongoing',
      description: 'Make database tables\nIntegrate data into database',
      startDate: '2026-01-01',
      finishDate: '2026-01-15',
      hasUrge: false,
    },
    {
      id: 'meeting-minutes',
      title: 'Meeting Minutes',
      assignee: 'Me',
      status: 'Done',
      description: 'Record meeting minutes for weekly meetings\nSummarise all notes',
      startDate: '2026-01-01',
      finishDate: '2026-01-10',
      hasUrge: false,
    },
  ],
  team: [
    {
      id: 'api-dev',
      title: 'API Development',
      assignee: 'User 2',
      status: 'Ongoing',
      description: 'Make API route endpoints\nConnect API endpoints to logic layer',
      startDate: '2026-01-05',
      finishDate: '2026-01-20',
      hasUrge: true,
    },
    {
      id: 'frontend-dashboard',
      title: 'Front-end Dashboard',
      assignee: 'User 1',
      status: 'Ongoing',
      description: 'Make dashboard component for front-end\nAdd styling to all features',
      startDate: '2026-01-08',
      finishDate: '2026-01-18',
      hasUrge: true,
    },
  ],
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    name: 'User 1',
    color: '#2FA761',
    status: 'Working on front-end',
    text: 'How are we doing for time, do we need to reduce our workload or request an extension?',
    isMine: false,
  },
  {
    id: 2,
    name: 'Me',
    color: '#7CCCDE',
    status: 'Working on database ...',
    text: "We're going ok, we should be on track to finish this by the end of the week",
    isMine: true,
  },
  {
    id: 3,
    name: 'User 2',
    color: '#A72F77',
    status: 'Working on API ...',
    text: "I might need some extra manpower on this task otherwise I think it'll be late",
    isMine: false,
  },
  {
    id: 4,
    name: 'User 1',
    color: '#2FA761',
    status: 'Working on front-end',
    text: "Yeah no worries, I can help out after I'm done this section",
    isMine: false,
  },
]

function TaskCard({ task, onOpenModal, onDelete, onUrge }) {
  return (
    <div className="task-card" onClick={() => onOpenModal(task)}>
      <div className="task-card-top-row">
        <h3 className="task-card-title">{task.title}</h3>
        <button
          className="task-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          title="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="task-card-body-row">
        <p className="task-card-description">{task.description}</p>
        <div className="task-card-meta-group">
          <span className="task-card-meta">Assignee: {task.assignee}</span>
          <span className="task-card-meta">Status: {task.status}</span>
        </div>
      </div>
      {task.hasUrge && (
        <button
          className="urge-btn"
          onClick={(e) => {
            e.stopPropagation()
            onUrge(task)
          }}
        >
          Urge Assignee
        </button>
      )}
    </div>
  )
}

function TasksPanel({ tasks, onOpenModal, onDelete, onUrge }) {
  return (
    <aside className="tasks-sidebar">
      <div className="tasks-header">
        <h1 className="sidebar-title">Tasks</h1>
        <button
          className="sidebar-toggle-btn"
          onClick={() => onOpenModal({})}
          title="Add new task"
        >
          <PlusIcon />
        </button>
      </div>

      <div className="tasks-scroll">
        <h2 className="tasks-section-title">Myself</h2>
        {tasks.myself.map((task) => (
          <TaskCard key={task.id} task={task} onOpenModal={onOpenModal} onDelete={onDelete} onUrge={onUrge} />
        ))}

        <h2 className="tasks-section-title">Team</h2>
        {tasks.team.map((task) => (
          <TaskCard key={task.id} task={task} onOpenModal={onOpenModal} onDelete={onDelete} onUrge={onUrge} />
        ))}
      </div>
    </aside>
  )
}

function TaskModal({ task, onClose, onSave, members }) {
  const [title, setTitle] = useState(task?.title || '')
  const [startDate, setStartDate] = useState(task?.startDate || '')
  const [finishDate, setFinishDate] = useState(task?.finishDate || '')
  const [assignee, setAssignee] = useState(task?.assignee || 'Me')
  const [status, setStatus] = useState(task?.status || 'Ongoing')
  const [description, setDescription] = useState(task?.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...task,
      id: task?.id || `task-${Date.now()}`,
      title,
      startDate,
      finishDate,
      assignee,
      status,
      description,
      hasUrge: task?.hasUrge || false
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{task?.id ? 'Edit Task' : 'New Task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Title</label>
            <input
              type="text"
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="modal-form-group" style={{ flex: 1 }}>
              <label className="modal-label">Start Date</label>
              <input
                type="date"
                className="modal-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="modal-form-group" style={{ flex: 1 }}>
              <label className="modal-label">Finish Date</label>
              <input
                type="date"
                className="modal-input"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="modal-form-group" style={{ flex: 1 }}>
              <label className="modal-label">Assignee</label>
              <select
                className="modal-select"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                {members.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="modal-form-group" style={{ flex: 1 }}>
              <label className="modal-label">Status</label>
              <select
                className="modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Description</label>
            <textarea
              className="modal-input"
              style={{ minHeight: '100px', resize: 'none' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List requirements here..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn--done">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function GanttView({ tasks, users, onOpenModal }) {
  const allTasks = [...tasks.myself, ...tasks.team].filter(t => t.startDate && t.finishDate)
  if (allTasks.length === 0) {
    return (
      <div className="gantt-area">
        <div className="gantt-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>No tasks with dates to display</span>
        </div>
      </div>
    )
  }

  const parse = (d) => {
    const x = new Date(d)
    return isNaN(x.getTime()) ? null : x
  }

  const addDays = (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }
  const diffDays = (a, b) => Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)))

  const minStart = new Date(Math.min(...allTasks.map(t => parse(t.startDate)?.getTime() || Infinity)))
  const maxFinish = new Date(Math.max(...allTasks.map(t => parse(t.finishDate)?.getTime() || -Infinity)))

  const rangeStart = addDays(minStart, -1)
  const rangeEnd = addDays(maxFinish, 1)
  const totalDays = Math.max(1, diffDays(rangeStart, rangeEnd))

  const ticks = []
  for (let d = new Date(rangeStart); d <= rangeEnd; d = addDays(d, 1)) {
    ticks.push(new Date(d))
  }
  const fmtDay = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const isMonthBoundary = (d) => d.getDate() === 1

  const usersByName = Object.fromEntries([["Me", ME], ...users.map(u => [u.name, u])])
  const rows = [ME, ...users]

  const toPercent = (date) => {
    const daysFromStart = Math.min(totalDays, Math.max(0, diffDays(rangeStart, date)))
    return (daysFromStart / totalDays) * 100
  }

  const baseRowHeight = 44
  const laneHeight = 34
  const headerHeight = 28

  const rowData = rows.map(user => {
    const userTasks = allTasks.filter(t => {
      if (t.assignee === 'Me') return user.id === ME.id
      const u = usersByName[t.assignee]
      return u ? u.id === user.id : false
    }).map(t => ({
      ...t,
      _s: parse(t.startDate) || rangeStart,
      _e: parse(t.finishDate) || rangeStart,
    })).sort((a, b) => (a._s - b._s) || (a._e - b._e))

    const lanes = []
    const laidOut = []
    userTasks.forEach(t => {
      const left = toPercent(t._s)
      const right = toPercent(t._e)
      let laneIdx = 0
      for (laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
        if (left >= lanes[laneIdx] + 0.5) break
      }
      if (laneIdx === lanes.length) lanes.push(right)
      else lanes[laneIdx] = right
      laidOut.push({ task: t, left, width: Math.max(2, right - left), laneIdx })
    })

    const heightPx = baseRowHeight + Math.max(0, lanes.length - 1) * laneHeight
    return { user, laidOut, heightPx }
  })

  return (
    <div className="gantt-area">
      <div className="gantt-container">
        <div className="gantt-user-column">
          <div style={{ height: headerHeight }} />
          {rowData.map(({ user, heightPx }) => (
            <div key={user.id} className="gantt-user-card" style={{ height: heightPx }}>
              <UserAvatar color={user.color} size={32} />
              <span className="gantt-user-name">{user.name}</span>
            </div>
          ))}
        </div>

        <div className="gantt-grid-wrapper">
          <div className="gantt-row" style={{ height: headerHeight, gridTemplateColumns: `repeat(${ticks.length}, 1fr)` }}>
            {ticks.map((t, idx) => (
              <div key={idx} className={`gantt-cell ${isMonthBoundary(t) ? 'gantt-cell--month-boundary' : ''}`} style={{ position: 'relative' }}>
                <div className="gantt-header-label" style={{ position: 'absolute', top: 6, left: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                  {fmtDay(t)}
                </div>
              </div>
            ))}
          </div>

          {rowData.map(({ user, laidOut, heightPx }) => (
            <div key={user.id} className="gantt-row" style={{ height: heightPx, gridTemplateColumns: `repeat(${ticks.length}, 1fr)` }}>
              {ticks.map((_, i) => (
                <div key={i} className="gantt-cell" />
              ))}
              {laidOut.map(({ task, left, width, laneIdx }) => (
                <div
                  key={task.id}
                  className="gantt-task-bar"
                  style={{ left: `calc(${left}% + 2px)`, width: `calc(${width}% - 8px)`, top: 8 + laneIdx * laneHeight }}
                  onClick={() => onOpenModal(task)}
                  title={`${task.title}  ${fmtDay(task._s)}  ${fmtDay(task._e)}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NewUserModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#2FA761')
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New User</h2>
        <div className="modal-form-group">
          <label className="modal-label">Name</label>
          <input className="modal-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="User name" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Color</label>
          <input className="modal-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={() => { if (name.trim()) { onSave({ id: `user-${Date.now()}`, name: name.trim(), color }); onClose(); } }}>Create</button>
        </div>
      </div>
    </div>
  )
}

function NewGroupModal({ onClose, onSave, users }) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(new Set(users.map(u => u.id)))
  const toggle = (id) => {
    const s = new Set(selected)
    if (s.has(id)) s.delete(id); else s.add(id)
    setSelected(s)
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Group</h2>
        <div className="modal-form-group">
          <label className="modal-label">Group Name</label>
          <input className="modal-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Members</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {users.map(u => (
              <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggle(u.id)} /> {u.name}
              </label>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Me is included automatically</div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={() => {
            const ids = Array.from(selected)
            if (name.trim() && ids.length) { onSave({ id: `grp-${Date.now()}`, name: name.trim(), memberIds: ['me', ...ids] }); onClose(); }
          }}>Create</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [users, setUsers] = useState(DEFAULT_USERS)
  const [groups, setGroups] = useState(INITIAL_GROUPS)

  const [activeView, setActiveView] = useState('chat')
  const [selectedChat, setSelectedChat] = useState('group:grp1')
  const [taskModal, setTaskModal] = useState(null)
  const [createUserModal, setCreateUserModal] = useState(false)
  const [createGroupModal, setCreateGroupModal] = useState(false)
  const [activeGroupTab, setActiveGroupTab] = useState(null) // null = chat/gantt view

  const [tasksByGroup, setTasksByGroup] = useState({ grp1: INITIAL_TASKS_GRP1 })

  const [messagesByChat, setMessagesByChat] = useState(() => {
    const map = { 'group:grp1': INITIAL_MESSAGES }
    users.forEach(u => { map[`user:${u.id}`] = [] })
    return map
  })

  const currentMessages = messagesByChat[selectedChat] || []

  const handleSendMessage = (text) => {
    setMessagesByChat(prev => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        {
          id: Date.now(),
          name: 'Me',
          color: ME.color,
          status: 'Online',
          text,
          isMine: true
        },
      ]
    }))
  }

  const ensureChatThread = (id) => {
    setMessagesByChat(prev => (prev[id] ? prev : { ...prev, [id]: [] }))
  }

  const handleSelectChat = (id) => {
    ensureChatThread(id)
    setSelectedChat(id)
    if (!id.startsWith('group:')) {
      setActiveView('chat')
      setActiveGroupTab(null)
    }
  }

  const toggleGantt = () => {
    if (selectedChat.startsWith('group:')) {
      setActiveGroupTab(null)
      setActiveView((v) => (v === 'chat' ? 'gantt' : 'chat'))
    }
  }

  const handleTabChange = (tab) => {
    setActiveGroupTab(tab)
    setActiveView('chat')
  }

  const handleSaveTaskToGroup = (groupId) => (savedTask) => {
    setTasksByGroup(prev => {
      const groupTasks = prev[groupId] || { myself: [], team: [] }
      const isMyTask = savedTask.assignee === 'Me'
      const category = isMyTask ? 'myself' : 'team'
      const otherCategory = isMyTask ? 'team' : 'myself'

      const filteredPrevCategory = (groupTasks[category] || []).filter(t => t.id !== savedTask.id)
      const filteredOtherCategory = (groupTasks[otherCategory] || []).filter(t => t.id !== savedTask.id)

      return {
        ...prev,
        [groupId]: {
          [category]: [...filteredPrevCategory, savedTask],
          [otherCategory]: filteredOtherCategory
        }
      }
    })
    setTaskModal(null)
  }

  const handleDeleteTaskFromGroup = (groupId) => (id) => {
    setTasksByGroup(prev => ({
      ...prev,
      [groupId]: {
        myself: (prev[groupId]?.myself || []).filter(t => t.id !== id),
        team: (prev[groupId]?.team || []).filter(t => t.id !== id)
      }
    }))
  }

  const handleUrgeAssignee = (task) => {
    const assigneeName = task.assignee
    const user = users.find(u => u.name === assigneeName)
    const targetChat = assigneeName === 'Me' ? 'group:grp1' : (user ? `user:${user.id}` : 'group:grp1')
    const messageText = `Reminder: ${task.title}  please provide an update.`

    setMessagesByChat(prev => ({
      ...prev,
      [targetChat]: [
        ...(prev[targetChat] || []),
        {
          id: Date.now(),
          name: 'Me',
          color: ME.color,
          status: 'Automated message',
          text: messageText,
          isMine: true,
        }
      ]
    }))
  }

  const selectedGroupId = selectedChat.startsWith('group:') ? selectedChat.replace('group:', '') : null
  const selectedGroup = groups.find(g => g.id === selectedGroupId)
  const groupMembers = selectedGroup ? ['Me', ...users.filter(u => selectedGroup.memberIds.includes(u.id)).map(u => u.name)] : []
  const groupTasks = selectedGroupId ? (tasksByGroup[selectedGroupId] || { myself: [], team: [] }) : null

  const isGroup = selectedChat.startsWith('group:')

  return (
    <div className="app-layout">
      <MessagesSidebar
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onToggleGantt={toggleGantt}
        isGanttView={activeView === 'gantt'}
        USERS={users}
        groups={groups}
        onOpenCreateUser={() => setCreateUserModal(true)}
        onOpenCreateGroup={() => setCreateGroupModal(true)}
      />

      {/* Group tools sidebar - only show when a group is selected */}
      {isGroup && (
        <GroupSidebar
          activeTab={activeGroupTab}
          onTabChange={handleTabChange}
        />
      )}

      {/* Main content area */}
      {isGroup && activeGroupTab ? (
        <div className="group-panel-area">
          {activeGroupTab === 'voting' && <GroupVoting />}
          {activeGroupTab === 'progress' && <ProgressDashboard tasks={groupTasks} />}
          {activeGroupTab === 'diary' && <WeeklyDiary />}
          {activeGroupTab === 'contributions' && <ContributionDashboard />}
          {activeGroupTab === 'structured-tasks' && <StructuredTasks />}
        </div>
      ) : (
        <ChatPanel
          selectedChat={selectedChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onToggleGantt={toggleGantt}
          USERS={users}
          isGanttView={activeView === 'gantt'}
          ganttContent={selectedGroupId ? <GanttView tasks={groupTasks} users={users.filter(u => selectedGroup.memberIds.includes(u.id))} onOpenModal={setTaskModal} /> : null}
          tasksPanel={selectedGroupId ? <TasksPanel tasks={groupTasks} onOpenModal={setTaskModal} onDelete={handleDeleteTaskFromGroup(selectedGroupId)} onUrge={handleUrgeAssignee} /> : null}
        />
      )}

      {taskModal !== null && selectedGroupId && !activeGroupTab && (
        <TaskModal
          task={taskModal}
          members={groupMembers}
          onClose={() => setTaskModal(null)}
          onSave={handleSaveTaskToGroup(selectedGroupId)}
        />
      )}

      {createUserModal && (
        <NewUserModal
          onClose={() => setCreateUserModal(false)}
          onSave={(newUser) => {
            setUsers(prev => [...prev, newUser])
            setMessagesByChat(prev => ({ ...prev, [`user:${newUser.id}`]: [] }))
          }}
        />
      )}

      {createGroupModal && (
        <NewGroupModal
          users={users}
          onClose={() => setCreateGroupModal(false)}
          onSave={(newGroup) => {
            setGroups(prev => [...prev, newGroup])
            setMessagesByChat(prev => ({ ...prev, [`group:${newGroup.id}`]: [] }))
            setTasksByGroup(prev => ({ ...prev, [newGroup.id]: { myself: [], team: [] } }))
          }}
        />
      )}
    </div>
  )
}
