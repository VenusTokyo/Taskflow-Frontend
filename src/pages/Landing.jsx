import { useNavigate } from 'react-router-dom'
import './Landing.css'

const TASKS = [
  { label: 'Finalize onboarding flow', done: true,  badge: 'High',   badgeClass: 'badge-high' },
  { label: 'Review API docs',          done: true,  badge: 'Medium', badgeClass: 'badge-med'  },
  { label: 'Design system audit',      done: false, badge: 'High',   badgeClass: 'badge-high' },
  { label: 'Write release notes',      done: false, badge: 'Low',    badgeClass: 'badge-low'  },
  { label: 'QA testing — v2.1',        done: false, badge: 'Medium', badgeClass: 'badge-med'  },
]

const STATS = [
  { num: '12k+', label: 'Teams using TaskFlow' },
  { num: '98%',  label: 'Customer satisfaction rate' },
  { num: '4.9★', label: 'Average product rating' },
]

const FEATURES = [
  {
    icon: '📁',
    title: 'Projects',
    desc: 'Organize your work into clear, structured projects with titles, descriptions, and status tracking.',
  },
  {
    icon: '✅',
    title: 'Tasks',
    desc: 'Break work into tasks with priority levels, due dates, and a visual kanban board for clarity.',
  },
  {
    icon: '👥',
    title: 'Team-ready',
    desc: 'Built with collaboration in mind. A clean interface that keeps everyone on the same page.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="lp">

        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">TaskFlow</div>
          <div className="nav-links">
            <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn-primary"   onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">Project management</div>
            <h1 className="hero-h1">
              Manage your work,<br /><em>beautifully.</em>
            </h1>
            <p className="hero-sub">
              TaskFlow brings your projects and tasks together in one calm, focused
              space — so you can do your best thinking.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-lg"   onClick={() => navigate('/register')}>Get Started</button>
              <button className="btn-secondary-lg" onClick={() => navigate('/login')}>Sign In</button>
            </div>
          </div>

          <div>
            <div className="hero-card">
              <div className="hero-card-label">Active tasks — Q4 Sprint</div>
              {TASKS.map(t => (
                <div className="task-row" key={t.label}>
                  <div className={`task-check${t.done ? ' done' : ''}`}>
                    {t.done && '✓'}
                  </div>
                  <span className={`task-text${t.done ? ' done' : ''}`}>{t.label}</span>
                  <span className={`task-badge ${t.badgeClass}`}>{t.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats">
          {STATS.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="features">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">What's included</div>
              <h2 className="section-h2">Everything you need to stay focused</h2>
            </div>
            <p className="section-desc">
              A calm, structured workspace for individuals and teams who care about doing great work.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div>
            <div className="cta-eyebrow">Get started today</div>
            <h2 className="cta-h2">Your work, <em>organised</em> at last.</h2>
          </div>
          <div className="cta-right">
            <button className="btn-cta-primary"   onClick={() => navigate('/register')}>Create free account</button>
            <button className="btn-cta-secondary" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-logo">TaskFlow</div>
          <div className="footer-copy">© 2025 TaskFlow. All rights reserved.</div>
        </footer>

    </div>
  )
}