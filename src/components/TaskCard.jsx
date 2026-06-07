const PRIORITY = {
  low:    { bg: '#D4EAD4', color: '#2F5232' },
  medium: { bg: '#D4DEF0', color: '#1E3A5F' },
  high:   { bg: '#F0D4D4', color: '#5F1E1E' },
}

export default function TaskCard({ task, onEdit }) {
  const badge = PRIORITY[task.priority] || PRIORITY.medium

  const formatDate = (d) => {
    if (!d) return null
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div style={{
      background: '#FAF8F3',
      border: '1px solid #C2CBBE',
      borderRadius: 12,
      padding: '14px 16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#2F3630',
          flex: 1,
          marginRight: 8,
          lineHeight: 1.4,
        }}>
          {task.title}
        </span>
        {onEdit && (
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#A3AD9B',
              fontSize: 18,
              padding: 0,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ···
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{
          background: badge.bg,
          color: badge.color,
          borderRadius: 20,
          padding: '2px 10px',
          fontSize: 11,
          fontWeight: 600,
        }}>
          {task.priority}
        </span>
        {task.due_date && (
          <span style={{ fontSize: 11, color: isOverdue ? '#4C5A46' : '#7C8B74' }}>
            {isOverdue ? '⚠ ' : ''}{formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  )
}
