import { useState } from 'react'
import { UserAvatar } from './user'
import { PlusIcon } from './icons'

function ChatMessage({ message }) {
  return (
    <div className={`chat-message-wrapper ${message.isMine ? 'chat-message-wrapper--mine' : ''}`}>
      <div className={`chat-bubble ${message.isMine ? 'chat-bubble--mine' : ''}`}>
        <div className="chat-bubble-header">
          {!message.isMine && <UserAvatar color={message.color} size={42} />}
          {message.isMine && <UserAvatar color={message.color} size={42} />}
          <span className="chat-sender-name">{message.name}</span>
          <span className="chat-sender-status">{message.status}</span>
        </div>
        <p className="chat-bubble-text">{message.text}</p>
      </div>
    </div>
  )
}

export function ChatPanel({
  selectedChat,
  messages,
  onSendMessage,
  onToggleGantt,
  USERS,
  isGanttView,
  ganttContent,
  tasksPanel,
}) {
  const [input, setInput] = useState('')
  const isGroup = selectedChat?.startsWith('group:')

  const title = (() => {
    if (isGroup) return 'Group'
    const userId = selectedChat?.replace('user:', '')
    return USERS.find((u) => u.id === userId)?.name || ''
  })()

  const color = (() => {
    if (isGroup) return '#572FA7'
    const userId = selectedChat?.replace('user:', '')
    return USERS.find((u) => u.id === userId)?.color || '#888'
  })()

  const handleSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="chat-area">
      <div className="chat-layout-wrapper">
        <div className="chat-messaging-column">
          <div
            className={`chat-header-bar ${isGroup ? 'chat-header-bar--clickable' : ''}`}
            onClick={isGroup ? onToggleGantt : undefined}
            style={{ cursor: isGroup ? 'pointer' : 'default' }}
          >
            <UserAvatar color={color} size={42} />
            <span className="chat-header-title">{title}</span>
          </div>

          {isGanttView && isGroup ? (
            <div className="gantt-view-container">{ganttContent}</div>
          ) : (
            <>
              <div className="chat-messages-container">
                <div className="chat-messages-inner">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                </div>
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <div className="chat-input-outer">
                  <div className="chat-input-inner">
                    <input
                      type="text"
                      className="chat-input-field"
                      placeholder="Type a message and press Enter"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="chat-send-btn">
                  <PlusIcon />
                </button>
              </form>
            </>
          )}
        </div>

        {!isGanttView && tasksPanel && <div className="chat-tasks-column">{tasksPanel}</div>}
      </div>
    </div>
  )
}

export function MessagesSidebar({
  selectedChat,
  onSelectChat,
  onToggleGantt,
  isGanttView,
  USERS,
  groups,
  onOpenCreateUser,
  onOpenCreateGroup,
}) {
  const isGroup = selectedChat?.startsWith('group:')

  return (
    <aside className="messages-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Messages</h1>
        <div
          className="sidebar-toggle-btn"
          title={isGroup && isGanttView ? 'Back to chat' : 'Gantt (groups only)'}
        >
          {isGroup && (isGanttView ? <span className="gantt-active-bar" /> : <PlusIcon />)}
        </div>
      </div>

      <div className="contacts-panel">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            marginBottom: 6,
          }}
        >
          <span className="contact-name" style={{ color: '#9aa0a6' }}>
            Groups
          </span>
          <button
            className="sidebar-toggle-btn"
            onClick={onOpenCreateGroup}
            title="New group"
          >
            <PlusIcon />
          </button>
        </div>
        {(groups || []).map((g) => (
          <button
            key={g.id}
            className={`contact-item contact-item--group ${selectedChat === `group:${g.id}` ? 'contact-item--active' : ''}`}
            onClick={() => onSelectChat(`group:${g.id}`)}
          >
            <UserAvatar color="#572FA7" size={42} />
            <span className="contact-name">{g.name}</span>
          </button>
        ))}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px 0',
            marginTop: 8,
          }}
        >
          <span className="contact-name" style={{ color: '#9aa0a6' }}>
            Direct Messages
          </span>
          <button
            className="sidebar-toggle-btn"
            onClick={onOpenCreateUser}
            title="New user"
          >
            <PlusIcon />
          </button>
        </div>
        {USERS.map((user) => (
          <button
            key={user.id}
            className={`contact-item ${selectedChat === `user:${user.id}` ? 'contact-item--active' : ''}`}
            onClick={() => onSelectChat(`user:${user.id}`)}
          >
            <UserAvatar color={user.color} size={42} />
            <span className="contact-name">{user.name}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
