'use client'
import { useState } from 'react'

const INITIAL_ENTRIES = [
  {
    id: 'entry1',
    date: '2026-03-30',
    title: 'Sprint Review & Planning',
    content: `We wrapped up Sprint 2 today with a productive review session. The team demonstrated the API endpoints to stakeholders who seemed impressed with the progress. User 2 walked through the authentication flow and User 1 showed off the new dashboard UI.\n\nFor Sprint 3, we've committed to finishing the database integration and starting mobile testing. Main blockers discussed were the third-party payment API integration which is taking longer than expected.\n\nMorale is high. Everyone showed up and contributed. Looking forward to the next sprint!`,
    author: 'Me',
    mood: '😊',
    tags: ['sprint', 'review', 'planning'],
  },
  {
    id: 'entry2',
    date: '2026-03-28',
    title: 'Productive Coding Session',
    content: `Long session today — started at 10am and didn't stop until 6pm. Managed to push 3 major commits:\n\n1. Refactored the user authentication module\n2. Added input validation across all forms\n3. Fixed the notorious race condition in the message sync logic\n\nUser 3 helped debug the race condition — wouldn't have spotted it without a second pair of eyes. The codebase is starting to feel much cleaner.\n\nNote to self: remember to update the API documentation before next standup.`,
    author: 'Me',
    mood: '💪',
    tags: ['coding', 'bugfix', 'refactor'],
  },
  {
    id: 'entry3',
    date: '2026-03-25',
    title: 'Tough Day - Hitting Blockers',
    content: `Struggled today. The database migration script keeps failing in the staging environment but works fine locally. Spent 4 hours chasing what turned out to be a timezone encoding issue in the timestamp columns.\n\nUser 4 hasn't responded to messages in 3 days which is starting to concern the group. We may need to redistribute their tasks if they don't check in soon.\n\nOn the bright side, User 1 submitted a PR for the responsive navigation — it looks really polished. Approved and merged it before EOD.`,
    author: 'Me',
    mood: '😤',
    tags: ['blockers', 'database', 'team'],
  },
  {
    id: 'entry4',
    date: '2026-03-22',
    title: 'Kickoff Week Retrospective',
    content: `Looking back at our first two weeks: we've made solid progress but there are things to improve.\n\nWINS: Got the project scaffolding done ahead of schedule. Good communication in the group chat. Everyone contributed to the initial design doc.\n\nIMPROVE: We need better task distribution. Some people have too much, others too little. Also need to improve our commit messages — half of them just say "fix stuff".\n\nDecided to move standups from 9am to 11am to accommodate different schedules. Should help with attendance.`,
    author: 'Me',
    mood: '🤔',
    tags: ['retrospective', 'planning', 'team'],
  },
]

const MOODS = ['😊', '💪', '😤', '🤔', '😴', '🎉', '😰', '🚀']

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function EntryCard({ entry, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const preview = entry.content.slice(0, 150) + (entry.content.length > 150 ? '...' : '')

  return (
    <div className="diary-entry-card">
      <div className="diary-entry-header" onClick={() => setExpanded(!expanded)}>
        <div className="diary-entry-meta">
          <span className="diary-mood">{entry.mood}</span>
          <div>
            <div className="diary-entry-title">{entry.title}</div>
            <div className="diary-entry-date">{formatDate(entry.date)} · {entry.author}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="diary-tags">
            {entry.tags.map(t => <span key={t} className="diary-tag">#{t}</span>)}
          </div>
          <span className="diary-expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      <div className={`diary-entry-body ${expanded ? 'diary-entry-body--expanded' : ''}`}>
        {expanded ? (
          <pre className="diary-content">{entry.content}</pre>
        ) : (
          <p className="diary-preview">{preview}</p>
        )}
      </div>

      <div className="diary-entry-actions">
        <button className="diary-action-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Collapse' : 'Read more'}
        </button>
        <button className="diary-action-btn diary-action-btn--edit" onClick={() => onEdit(entry)}>
          ✏️ Edit
        </button>
        <button className="diary-action-btn diary-action-btn--delete" onClick={() => onDelete(entry.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

function EntryModal({ entry, onClose, onSave }) {
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])
  const [mood, setMood] = useState(entry?.mood || '😊')
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '')

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return
    onSave({
      id: entry?.id || `entry-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      date,
      mood,
      author: 'Me',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{entry?.id ? 'Edit Entry' : 'New Diary Entry'}</h2>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label className="modal-label">Date</label>
            <input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Mood</label>
            <div className="mood-picker">
              {MOODS.map(m => (
                <button
                  key={m}
                  className={`mood-btn ${mood === m ? 'mood-btn--active' : ''}`}
                  onClick={() => setMood(m)}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Title</label>
          <input className="modal-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Entry title..." />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Content</label>
          <textarea
            className="modal-input"
            style={{ minHeight: 180, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your diary entry here..."
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-label">Tags (comma-separated)</label>
          <input className="modal-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="sprint, coding, team..." />
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--done" onClick={handleSave}>Save Entry</button>
        </div>
      </div>
    </div>
  )
}

export default function WeeklyDiary() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [editEntry, setEditEntry] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const handleSave = (entry) => {
    setEntries(prev => {
      const exists = prev.find(e => e.id === entry.id)
      if (exists) return prev.map(e => e.id === entry.id ? entry : e)
      return [entry, ...prev]
    })
    setEditEntry(null)
    setShowModal(false)
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const filtered = entries
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase()) || e.tags.some(t => t.includes(search.toLowerCase())))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Group by month
  const grouped = {}
  filtered.forEach(e => {
    const key = new Date(e.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e)
  })

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Weekly Diary</h2>
          <p className="panel-subtitle">Track your progress, thoughts and team updates</p>
        </div>
        <button className="panel-action-btn" onClick={() => { setEditEntry(null); setShowModal(true) }}>
          + New Entry
        </button>
      </div>

      <div className="diary-search-bar">
        <input
          className="diary-search-input"
          placeholder="🔍 Search entries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="panel-scroll">
        {Object.keys(grouped).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📔</div>
            <p>No entries yet. Start documenting your journey!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, monthEntries]) => (
            <div key={month} className="diary-month-group">
              <div className="diary-month-header">{month}</div>
              {monthEntries.map(entry => (
                <EntryCard key={entry.id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <EntryModal
          entry={editEntry}
          onClose={() => { setShowModal(false); setEditEntry(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
