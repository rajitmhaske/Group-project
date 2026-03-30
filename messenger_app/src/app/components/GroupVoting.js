'use client'
import { useState } from 'react'

const INITIAL_POLLS = [
  {
    id: 'poll1',
    question: 'Which feature should we prioritize next sprint?',
    options: ['User authentication', 'Dashboard analytics', 'Mobile responsiveness', 'API rate limiting'],
    votes: { 'me': 1, 'user1': 0, 'user2': 2, 'user3': 1 },
    createdBy: 'User 1',
    createdAt: '2026-03-20',
    closed: true,
  },
  {
    id: 'poll2',
    question: 'When should we schedule our next group meeting?',
    options: ['Monday 2pm', 'Wednesday 4pm', 'Friday 10am'],
    votes: { 'me': 0, 'user1': 1, 'user3': 2 },
    createdBy: 'Me',
    createdAt: '2026-03-25',
    closed: false,
  },
  {
    id: 'poll3',
    question: 'Should we request a project extension?',
    options: ['Yes, we need more time', 'No, we can finish on time', 'Maybe, let\'s discuss first'],
    votes: { 'user2': 0, 'user4': 2 },
    createdBy: 'User 2',
    createdAt: '2026-03-28',
    closed: false,
  },
]

const MEMBERS = [
  { id: 'me', name: 'Me', color: '#7CCCDE' },
  { id: 'user1', name: 'User 1', color: '#2FA761' },
  { id: 'user2', name: 'User 2', color: '#A72F77' },
  { id: 'user3', name: 'User 3', color: '#A7412F' },
  { id: 'user4', name: 'User 4', color: '#A72F31' },
]

function PollCard({ poll, onVote, onClose }) {
  const totalVotes = Object.keys(poll.votes).length
  const optionCounts = poll.options.map((_, idx) =>
    Object.values(poll.votes).filter(v => v === idx).length
  )
  const maxVotes = Math.max(...optionCounts, 1)
  const myVote = poll.votes['me']
  const hasVoted = myVote !== undefined

  const votersByOption = poll.options.map((_, idx) =>
    Object.entries(poll.votes)
      .filter(([, v]) => v === idx)
      .map(([uid]) => MEMBERS.find(m => m.id === uid)?.name || uid)
  )

  return (
    <div className="poll-card">
      <div className="poll-card-header">
        <div className="poll-meta">
          <span className="poll-creator">{poll.createdBy}</span>
          <span className="poll-date">{poll.createdAt}</span>
          {poll.closed && <span className="poll-badge poll-badge--closed">Closed</span>}
          {!poll.closed && <span className="poll-badge poll-badge--active">Active</span>}
        </div>
        <h3 className="poll-question">{poll.question}</h3>
      </div>

      <div className="poll-options">
        {poll.options.map((opt, idx) => {
          const count = optionCounts[idx]
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
          const isWinning = count === maxVotes && count > 0
          const isMyChoice = myVote === idx

          return (
            <div key={idx} className={`poll-option ${isMyChoice ? 'poll-option--mine' : ''}`}>
              <div className="poll-option-top">
                <span className="poll-option-label">{opt}</span>
                <span className="poll-option-count">{count} vote{count !== 1 ? 's' : ''} · {pct}%</span>
              </div>
              <div className="poll-bar-bg">
                <div
                  className={`poll-bar-fill ${isWinning ? 'poll-bar-fill--winning' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {votersByOption[idx].length > 0 && (
                <div className="poll-voters">{votersByOption[idx].join(', ')}</div>
              )}
              {!poll.closed && !hasVoted && (
                <button className="poll-vote-btn" onClick={() => onVote(poll.id, idx)}>
                  Vote
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="poll-footer">
        <span className="poll-total">{totalVotes} / {MEMBERS.length} voted</span>
        {!poll.closed && (
          <button className="poll-close-btn" onClick={() => onClose(poll.id)}>Close Poll</button>
        )}
      </div>
    </div>
  )
}

function CreatePollModal({ onClose, onSave }) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const addOption = () => setOptions(o => [...o, ''])
  const updateOption = (i, val) => setOptions(o => o.map((x, idx) => idx === i ? val : x))
  const removeOption = (i) => setOptions(o => o.filter((_, idx) => idx !== i))

  const handleSave = () => {
    const cleanOpts = options.filter(o => o.trim())
    if (question.trim() && cleanOpts.length >= 2) {
      onSave({ question: question.trim(), options: cleanOpts })
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Create Poll</h2>
        <div className="modal-form-group">
          <label className="modal-label">Question</label>
          <input
            className="modal-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="What do you want to ask the group?"
          />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Options</label>
          {options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="modal-input"
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                style={{ flex: 1 }}
              />
              {options.length > 2 && (
                <button
                  className="modal-btn modal-btn--cancel"
                  style={{ padding: '8px 12px' }}
                  onClick={() => removeOption(i)}
                >✕</button>
              )}
            </div>
          ))}
          <button className="poll-add-option-btn" onClick={addOption}>+ Add Option</button>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={handleSave}>Create Poll</button>
        </div>
      </div>
    </div>
  )
}

export default function GroupVoting() {
  const [polls, setPolls] = useState(INITIAL_POLLS)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all') // all | active | closed

  const handleVote = (pollId, optionIdx) => {
    setPolls(prev => prev.map(p =>
      p.id === pollId ? { ...p, votes: { ...p.votes, me: optionIdx } } : p
    ))
  }

  const handleClose = (pollId) => {
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, closed: true } : p))
  }

  const handleCreate = ({ question, options }) => {
    const newPoll = {
      id: `poll-${Date.now()}`,
      question,
      options,
      votes: {},
      createdBy: 'Me',
      createdAt: new Date().toISOString().split('T')[0],
      closed: false,
    }
    setPolls(prev => [newPoll, ...prev])
  }

  const filtered = polls.filter(p => {
    if (filter === 'active') return !p.closed
    if (filter === 'closed') return p.closed
    return true
  })

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Group Voting & Decisions</h2>
          <p className="panel-subtitle">Create polls and reach group consensus</p>
        </div>
        <button className="panel-action-btn" onClick={() => setShowCreate(true)}>
          + New Poll
        </button>
      </div>

      <div className="filter-tabs">
        {['all', 'active', 'closed'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-tab-count">
              {f === 'all' ? polls.length : polls.filter(p => f === 'active' ? !p.closed : p.closed).length}
            </span>
          </button>
        ))}
      </div>

      <div className="panel-scroll">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <p>No polls yet. Create one to get the group's input!</p>
          </div>
        ) : (
          filtered.map(poll => (
            <PollCard key={poll.id} poll={poll} onVote={handleVote} onClose={handleClose} />
          ))
        )}
      </div>

      {showCreate && (
        <CreatePollModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
    </div>
  )
}
