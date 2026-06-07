import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'
import { setToken, setUser } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setToken(data.token)
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F4F1EA 0%, #E7E1D6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2F3630', margin: '0 0 8px' }}>TaskFlow</h1>
          <p style={{ color: '#7C8B74', margin: 0, fontSize: 15 }}>Welcome back</p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '12px 16px',
            color: '#4C5A46',
            marginBottom: 20,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: 13, fontSize: 15 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#7C8B74', fontSize: 13 }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#5F6F57', textDecoration: 'none', fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
