import { useNavigate } from 'react-router-dom'

const STATUS_BADGE = {
  active:    { bg: '#D4EAD4', color: '#2F5232' },
  completed: { bg: '#D4DEF0', color: '#1E3A5F' },
  archived:  { bg: '#E7E1D6', color: '#7C8B74' },
}

function fmt(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate()
  const badge = STATUS_BADGE[project.status] || STATUS_BADGE.active

  return (
    <div style={{
      background: '#E7E1D6',
      border: '1px solid #C2CBBE',
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: '#2F3630',
            cursor: 'pointer',
            flex: 1,
          }}
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          {project.title}
        </h3>
        <span style={{
          background: badge.bg,
          color: badge.color,
          borderRadius: 20,
          padding: '3px 12px',
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {project.status}
        </span>
      </div>

      {project.description && (
        <p style={{
          margin: 0,
          color: '#7C8B74',
          fontSize: 13,
          lineHeight: 1.5,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {project.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 12, color: '#7C8B74' }}>
          {project.task_count ?? 0} task{project.task_count !== 1 ? 's' : ''} · {fmt(project.created_at)}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit(project)}
            style={{
              background: 'transparent',
              border: '1px solid #C2CBBE',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              color: '#3E463B',
              fontSize: 12,
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project)}
            style={{
              background: 'transparent',
              border: '1px solid #C2CBBE',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              color: '#4C5A46',
              fontSize: 12,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
