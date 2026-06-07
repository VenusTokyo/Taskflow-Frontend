import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import StatCard from '../components/StatCard'
import api from '../lib/api'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const STATUS_BADGE = {
  active:    { bg: '#D4EAD4', color: '#2F5232' },
  completed: { bg: '#D4DEF0', color: '#1E3A5F' },
  archived:  { bg: '#E7E1D6', color: '#7C8B74' },
}

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then(r => r.data),
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get('/users/stats').then(r => r.data),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })

  const recentProjects = projects?.slice(0, 3) || []

  return (
    <AppLayout>
      {/* Greeting */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2F3630', margin: '0 0 6px' }}>
          {greeting()}, {user?.name?.split(' ')[0] || '—'}.
        </h1>
        <p style={{ color: '#7C8B74', margin: 0, fontSize: 15 }}>
          Here&apos;s what&apos;s happening across your projects.
        </p>
      </div>

      {/* Stats — responsive grid instead of flex */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 16,
        marginBottom: 48,
      }}>
        <StatCard label="Total Projects" value={stats?.totalProjects ?? '—'} />
        <StatCard label="Total Tasks"    value={stats?.totalTasks    ?? '—'} />
        <StatCard label="Completed"      value={stats?.completedTasks ?? '—'} />
        <StatCard label="Overdue"        value={stats?.overdueTasks  ?? '—'} />
      </div>

      {/* Recent Projects */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2F3630', margin: 0 }}>Recent Projects</h2>
          <button onClick={() => navigate('/projects')} className="btn-secondary" style={{ padding: '8px 18px' }}>
            View all
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div style={{
            background: '#F4F1EA',
            border: '1px dashed #C2CBBE',
            borderRadius: 16,
            padding: '40px 24px',
            textAlign: 'center',
            color: '#7C8B74',
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 15 }}>No projects yet.</p>
            <button className="btn-primary" onClick={() => navigate('/projects')}>
              Create your first project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {recentProjects.map(p => {
              const badge = STATUS_BADGE[p.status] || STATUS_BADGE.active
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  style={{
                    background: '#E7E1D6',
                    border: '1px solid #C2CBBE',
                    borderRadius: 16,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#2F3630', flex: 1, marginRight: 8 }}>
                      {p.title}
                    </h3>
                    <span style={{
                      background: badge.bg, color: badge.color,
                      borderRadius: 20, padding: '2px 10px',
                      fontSize: 11, fontWeight: 600, flexShrink: 0,
                    }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 14px', color: '#7C8B74', fontSize: 13, lineHeight: 1.5 }}>
                    {p.description || 'No description.'}
                  </p>
                  <span style={{
                    background: '#C2CBBE', color: '#3E463B',
                    borderRadius: 20, padding: '2px 10px',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {p.task_count ?? 0} task{p.task_count !== 1 ? 's' : ''}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
