import { NavLink, useNavigate } from 'react-router-dom'
import { removeToken, removeUser } from '../lib/auth'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/profile', label: 'Profile' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    removeToken()
    removeUser()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#F4F1EA',
      borderRight: '1px solid #C2CBBE',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 16px',
      flexShrink: 0,
    }}>
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2F3630', margin: 0 }}>TaskFlow</h2>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 16px',
              borderRadius: 8,
              color: isActive ? '#2F3630' : '#7C8B74',
              background: isActive ? '#E7E1D6' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        style={{
          background: 'transparent',
          border: '1px solid #C2CBBE',
          borderRadius: 8,
          padding: '10px 16px',
          color: '#7C8B74',
          cursor: 'pointer',
          fontSize: 13,
          textAlign: 'left',
          width: '100%',
        }}
      >
        Logout
      </button>
    </aside>
  )
}
