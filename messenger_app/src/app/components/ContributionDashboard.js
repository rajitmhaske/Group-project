'use client'
import { useState } from 'react'

const MEMBERS = [
  { id: 'me', name: 'Me', color: '#7CCCDE', avatar: '🧑‍💻' },
  { id: 'user1', name: 'User 1', color: '#2FA761', avatar: '👩‍🎨' },
  { id: 'user2', name: 'User 2', color: '#A72F77', avatar: '👨‍🔧' },
  { id: 'user3', name: 'User 3', color: '#A7412F', avatar: '👩‍🔬' },
  { id: 'user4', name: 'User 4', color: '#A72F31', avatar: '🧑‍📊' },
]

const INITIAL_CONTRIBUTIONS = [
  { id: 'c1', memberId: 'me', type: 'commit', description: 'Implemented user auth module', date: '2026-03-30', points: 15 },
  { id: 'c2', memberId: 'user1', type: 'design', description: 'Created responsive navigation component', date: '2026-03-30', points: 12 },
  { id: 'c3', memberId: 'user2', type: 'commit', description: 'Fixed race condition in message sync', date: '2026-03-29', points: 18 },
  { id: 'c4', memberId: 'me', type: 'review', description: 'Reviewed and merged User 1\'s PR', date: '2026-03-29', points: 8 },
  { id: 'c5', memberId: 'user3', type: 'docs', description: 'Updated API documentation', date: '2026-03-28', points: 6 },
  { id: 'c6', memberId: 'user1', type: 'commit', description: 'Dashboard UI components', date: '2026-03-28', points: 14 },
  { id: 'c7', memberId: 'user2', type: 'meeting', description: 'Led sprint planning meeting', date: '2026-03-27', points: 7 },
  { id: 'c8', memberId: 'me', type: 'commit', description: 'Database schema migrations', date: '2026-03-26', points: 20 },
  { id: 'c9', memberId: 'user3', type: 'commit', description: 'Added unit tests for auth module', date: '2026-03-25', points: 10 },
  { id: 'c10', memberId: 'user1', type: 'review', description: 'Code review for API endpoints', date: '2026-03-24', points: 9 },
  { id: 'c11', memberId: 'user4', type: 'docs', description: 'Meeting minutes week 2', date: '2026-03-22', points: 4 },
  { id: 'c12', memberId: 'user2', type: 'commit', description: 'API endpoint scaffolding', date: '2026-03-20', points: 11 },
]

const CONTRIBUTION_TYPES = {
  commit: { label: 'Code Commit', icon: '💻', color: '#7c4dff' },
  review: { label: 'Code Review', icon: '🔍', color: '#3d5afe' },
  design: { label: 'Design', icon: '🎨', color: '#e91e63' },
  docs: { label: 'Documentation', icon: '📝', color: '#4caf50' },
  meeting: { label: 'Meeting', icon: '🗣️', color: '#ff9800' },
  test: { label: 'Testing', icon: '🧪', color: '#00bcd4' },
  other: { label: 'Other', icon: '⭐', color: '#9e9e9e' },
}

function getBadge(points) {
  if (points >= 80) return { label: 'Champion', icon: '👑', color: '#FFD700' }
  if (points >= 60) return { label: 'Expert', icon: '🏆', color: '#C0C0C0' }
  if (points >= 40) return { label: 'Pro', icon: '🥇', color: '#CD7F32' }
  if (points >= 20) return { label: 'Active', icon: '⚡', color: '#7c4dff' }
  return { label: 'Starter', icon: '🌱', color: '#4caf50' }
}

function getLevel(points) {
  return Math.floor(points / 10) + 1
}

function AddContributionModal({ onClose, onSave }) {
  const [memberId, setMemberId] = useState('me')
  const [type, setType] = useState('commit')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState(10)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSave = () => {
    if (!description.trim()) return
    onSave({ memberId, type, description, points: Number(points), date })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Log Contribution</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label className="modal-label">Member</label>
            <select className="modal-select" value={memberId} onChange={e => setMemberId(e.target.value)}>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label className="modal-label">Type</label>
            <select className="modal-select" value={type} onChange={e => setType(e.target.value)}>
              {Object.entries(CONTRIBUTION_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Description</label>
          <input className="modal-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="What was contributed?" />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label className="modal-label">Points (1-25)</label>
            <input type="number" className="modal-input" min="1" max="25" value={points} onChange={e => setPoints(e.target.value)} />
          </div>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label className="modal-label">Date</label>
            <input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={handleSave}>Log It</button>
        </div>
      </div>
    </div>
  )
}

export default function ContributionDashboard() {
  const [contributions, setContributions] = useState(INITIAL_CONTRIBUTIONS)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const handleAdd = (contrib) => {
    setContributions(prev => [{ ...contrib, id: `c-${Date.now()}` }, ...prev])
  }

  // Calculate stats per member
  const memberStats = MEMBERS.map(m => {
    const contribs = contributions.filter(c => c.memberId === m.id)
    const totalPoints = contribs.reduce((s, c) => s + c.points, 0)
    return { ...m, contribs, totalPoints }
  }).sort((a, b) => b.totalPoints - a.totalPoints)

  const totalPoints = memberStats.reduce((s, m) => s + m.totalPoints, 0) || 1

  const recentContribs = [...contributions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)

  const selected = selectedMember ? memberStats.find(m => m.id === selectedMember) : null

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Contribution Dashboard</h2>
          <p className="panel-subtitle">Track, gamify and celebrate team contributions</p>
        </div>
        <button className="panel-action-btn" onClick={() => setShowAdd(true)}>+ Log Contribution</button>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard">
        {memberStats.map((m, rank) => {
          const pct = Math.round((m.totalPoints / totalPoints) * 100)
          const badge = getBadge(m.totalPoints)
          const level = getLevel(m.totalPoints)
          return (
            <div
              key={m.id}
              className={`leaderboard-row ${rank === 0 ? 'leaderboard-row--first' : ''} ${selectedMember === m.id ? 'leaderboard-row--selected' : ''}`}
              onClick={() => setSelectedMember(selectedMember === m.id ? null : m.id)}
            >
              <div className="leaderboard-rank">
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
              </div>
              <div className="leaderboard-avatar" style={{ background: m.color }}>{m.avatar}</div>
              <div className="leaderboard-info">
                <div className="leaderboard-name-row">
                  <span className="leaderboard-name">{m.name}</span>
                  <span className="leaderboard-badge" style={{ color: badge.color }}>{badge.icon} {badge.label}</span>
                  <span className="leaderboard-level">Lv.{level}</span>
                </div>
                <div className="leaderboard-bar-row">
                  <div className="contrib-bar-bg">
                    <div className="contrib-bar-fill" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                  <span className="contrib-pct">{pct}%</span>
                  <span className="contrib-pts">{m.totalPoints}pts</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Member detail */}
      {selected && (
        <div className="member-detail-panel">
          <div className="member-detail-header">
            <span style={{ fontSize: 24 }}>{selected.avatar}</span>
            <h3 className="member-detail-name">{selected.name}</h3>
            <span className="member-detail-pts">{selected.totalPoints} pts total</span>
          </div>
          <div className="contrib-type-breakdown">
            {Object.entries(CONTRIBUTION_TYPES).map(([k, v]) => {
              const count = selected.contribs.filter(c => c.type === k).length
              if (count === 0) return null
              return (
                <div key={k} className="contrib-type-chip" style={{ borderColor: v.color }}>
                  {v.icon} {v.label} <strong>{count}</strong>
                </div>
              )
            })}
          </div>
          <div className="member-recent-contribs">
            {selected.contribs.slice(0, 5).map(c => {
              const ct = CONTRIBUTION_TYPES[c.type] || CONTRIBUTION_TYPES.other
              return (
                <div key={c.id} className="recent-contrib-row">
                  <span className="rc-icon">{ct.icon}</span>
                  <span className="rc-desc">{c.description}</span>
                  <span className="rc-pts">+{c.points}pts</span>
                  <span className="rc-date">{c.date}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="dashboard-section" style={{ marginTop: 20 }}>
        <h3 className="section-heading">Recent Contributions</h3>
        {recentContribs.map(c => {
          const member = MEMBERS.find(m => m.id === c.memberId)
          const ct = CONTRIBUTION_TYPES[c.type] || CONTRIBUTION_TYPES.other
          return (
            <div key={c.id} className="recent-contrib-row recent-contrib-row--full">
              <div className="member-dot" style={{ background: member?.color }} />
              <span className="rc-member">{member?.name}</span>
              <span className="rc-icon">{ct.icon}</span>
              <span className="rc-desc">{c.description}</span>
              <span className="rc-pts contrib-pts-badge">+{c.points}pts</span>
              <span className="rc-date">{c.date}</span>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <AddContributionModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
    </div>
  )
}
