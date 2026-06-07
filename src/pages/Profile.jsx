import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '../components/Sidebar'
import api from '../lib/api'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function fmtDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function Profile() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', bio: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then(r => r.data),
  })

  useEffect(() => {
    if (user) setForm({ name: user.name || '', bio: user.bio || '' })
  }, [user])

  const updateMutation = useMutation({
    mutationFn: data => api.put('/users/me', data).then(r => r.data),
    onSuccess: (updated) => {
      qc.setQueryData(['me'], updated)
      setSuccess(true)
      setError('')
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: err => {
      setError(err.response?.data?.error || 'Failed to update profile')
      setSuccess(false)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF8F3' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2F3630', margin: '0 0 36px' }}>Profile</h1>

        <div style={{ maxWidth: 560 }}>
          {/* Avatar & Info */}
          <div style={{
            background: '#E7E1D6',
            border: '1px solid #C2CBBE',
            borderRadius: 20,
            padding: '32px 36px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: '#FFFFFF',
              flexShrink: 0,
              letterSpacing: '0.05em',
            }}>
              {initials(user?.name)}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2F3630', marginBottom: 4 }}>
                {user?.name || '—'}
              </div>
              <div style={{ fontSize: 14, color: '#7C8B74', marginBottom: 4 }}>{user?.email}</div>
              {user?.bio && (
                <div style={{ fontSize: 13, color: '#3E463B', marginBottom: 4 }}>{user.bio}</div>
              )}
              <div style={{ fontSize: 12, color: '#A3AD9B' }}>
                Member since {fmtDate(user?.created_at)}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div style={{
            background: '#F4F1EA',
            border: '1px solid #C2CBBE',
            borderRadius: 20,
            padding: '32px 36px',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2F3630', margin: '0 0 24px' }}>
              Edit Profile
            </h2>

            {success && (
              <div style={{
                background: '#D4EAD4', border: '1px solid #A4C4A4', borderRadius: 8,
                padding: '10px 14px', color: '#2F5232', marginBottom: 16, fontSize: 13,
              }}>
                Profile updated successfully.
              </div>
            )}

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
                padding: '10px 14px', color: '#4C5A46', marginBottom: 16, fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updateMutation.isPending}
                  style={{ padding: '10px 28px' }}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
