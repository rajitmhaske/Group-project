'use client'
import { useState } from 'react'

const MEMBERS = [
  { id: 'me', name: 'Me', color: '#7CCCDE', lastActive: '2026-03-30', tasksComplete: 4, tasksTotal: 5 },
  { id: 'user1', name: 'User 1', color: '#2FA761', lastActive: '2026-03-30', tasksComplete: 3, tasksTotal: 4 },
  { id: 'user2', name: 'User 2', color: '#A72F77', lastActive: '2026-03-22', tasksComplete: 1, tasksTotal: 4 },
  { id: 'user3', name: 'User 3', color: '#A7412F', lastActive: '2026-03-29', tasksComplete: 2, tasksTotal: 3 },
  { id: 'user4', name: 'User 4', color: '#A72F31', lastActive: '2026-03-18', tasksComplete: 0, tasksTotal: 2 },
]

const TODAY = new Date('2026-03-30')
const daysSince = (dateStr) => {
  const d = new Date(dateStr)
  return Math.floor((TODAY - d) / (1000 * 60 * 60 * 24))
}

const TASKS_WITH_DEADLINES = [
  { id: 't1', title: 'API Development', assignee: 'User 2', finishDate: '2026-04-01', status: 'Ongoing' },
  { id: 't2', title: 'Front-end Dashboard', assignee: 'User 1', finishDate: '2026-04-02', status: 'Ongoing' },
  { id: 't3', title: 'Database Integration', assignee: 'Me', finishDate: '2026-04-10', status: 'Ongoing' },
  { id: 't4', title: 'Testing Suite', assignee: 'User 3', finishDate: '2026-03-25', status: 'Ongoing' },
  { id: 't5', title: 'Documentation', assignee: 'User 4', finishDate: '2026-03-20', status: 'Ongoing' },
  { id: 't6', title: 'Security Audit', assignee: 'User 2', finishDate: '2026-04-15', status: 'Pending' },
]

function daysUntil(dateStr) {
  const d = new Date(dateStr)
  return Math.floor((d - TODAY) / (1000 * 60 * 60 * 24))
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  )
}

function MemberRow({ member }) {
  const inactive = daysSince(member.lastActive) >= 5
  const pct = member.tasksTotal > 0 ? Math.round((member.tasksComplete / member.tasksTotal) * 100) : 0

  return (
    <div className={`member-progress-row ${inactive ? 'member-progress-row--inactive' : ''}`}>
      <div className="member-progress-info">
        <div className="member-dot" style={{ background: member.color }} />
        <span className="member-progress-name">{member.name}</span>
        {inactive && <span className="inactive-badge">Inactive {daysSince(member.lastActive)}d</span>}
      </div>
      <div className="member-progress-bar-area">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: member.color }} />
        </div>
        <span className="progress-pct">{pct}%</span>
      </div>
      <span className="member-tasks-count">{member.tasksComplete}/{member.tasksTotal} tasks</span>
    </div>
  )
}

function DeadlineRow({ task }) {
  const days = daysUntil(task.finishDate)
  const overdue = days < 0
  const urgent = days >= 0 && days <= 3

  return (
    <div className={`deadline-row ${overdue ? 'deadline-row--overdue' : urgent ? 'deadline-row--urgent' : ''}`}>
      <div className="deadline-info">
        <span className="deadline-title">{task.title}</span>
        <span className="deadline-assignee">{task.assignee}</span>
      </div>
      <div className={`deadline-badge ${overdue ? 'deadline-badge--overdue' : urgent ? 'deadline-badge--urgent' : 'deadline-badge--ok'}`}>
        {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
      </div>
    </div>
  )
}

export default function ProgressDashboard({ tasks }) {
  const allTasks = tasks ? [...(tasks.myself || []), ...(tasks.team || [])] : []
  const doneTasks = allTasks.filter(t => t.status === 'Done').length
  const totalTasks = allTasks.length || 1
  const groupProgress = Math.round((doneTasks / totalTasks) * 100)

  const inactiveMembers = MEMBERS.filter(m => daysSince(m.lastActive) >= 5)

  const allDeadlineTasks = [...TASKS_WITH_DEADLINES, ...allTasks.filter(t => t.finishDate && t.status !== 'Done')]
  const urgentTasks = allDeadlineTasks.filter(t => {
    const d = daysUntil(t.finishDate)
    return d <= 3
  }).sort((a, b) => daysUntil(a.finishDate) - daysUntil(b.finishDate))

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Group Progress Dashboard</h2>
          <p className="panel-subtitle">Real-time overview of team health and progress</p>
        </div>
        <div className="group-progress-ring">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" fill="none" stroke="var(--border-color)" strokeWidth="5" />
            <circle
              cx="30" cy="30" r="24" fill="none"
              stroke="var(--accent-primary)" strokeWidth="5"
              strokeDasharray={`${(groupProgress / 100) * 150.8} 150.8`}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
            <text x="30" y="35" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-primary)">{groupProgress}%</text>
          </svg>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={totalTasks} icon="📋" color="#7c4dff" sub={`${doneTasks} done`} />
        <StatCard label="Inactive Members" value={inactiveMembers.length} icon="😴" color={inactiveMembers.length > 0 ? '#ff9800' : '#4caf50'} sub="5+ days offline" />
        <StatCard label="Overdue Tasks" value={allDeadlineTasks.filter(t => daysUntil(t.finishDate) < 0).length} icon="🚨" color="#f44336" sub="past deadline" />
        <StatCard label="Due This Week" value={allDeadlineTasks.filter(t => { const d = daysUntil(t.finishDate); return d >= 0 && d <= 7 }).length} icon="⏰" color="#ff9800" sub="next 7 days" />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3 className="section-heading">Member Progress</h3>
          {MEMBERS.map(m => <MemberRow key={m.id} member={m} />)}
        </div>

        <div className="dashboard-section">
          <h3 className="section-heading">⚠️ Deadlines & Delays</h3>
          {urgentTasks.length === 0 ? (
            <div className="empty-state-small">All tasks are on track ✅</div>
          ) : (
            urgentTasks.slice(0, 6).map(t => <DeadlineRow key={t.id || t.title} task={t} />)
          )}
        </div>

        {inactiveMembers.length > 0 && (
          <div className="dashboard-section">
            <h3 className="section-heading">😴 Inactive Members</h3>
            {inactiveMembers.map(m => (
              <div key={m.id} className="inactive-member-row">
                <div className="member-dot" style={{ background: m.color }} />
                <span>{m.name}</span>
                <span className="inactive-days">Last seen {daysSince(m.lastActive)} days ago</span>
                <button className="nudge-btn">Nudge</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
