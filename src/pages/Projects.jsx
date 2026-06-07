import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '../components/Sidebar'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'
import api from '../lib/api'

const EMPTY_FORM = { title: '', description: '' }

export default function Projects() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | 'create' | 'edit' | 'delete'
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['projects'] })

  const createMutation = useMutation({
    mutationFn: data => api.post('/projects', data).then(r => r.data),
    onSuccess: () => { invalidate(); closeModal() },
    onError: err => setError(err.response?.data?.error || 'Failed to create project'),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/projects/${id}`, data).then(r => r.data),
    onSuccess: () => { invalidate(); closeModal() },
    onError: err => setError(err.response?.data?.error || 'Failed to update project'),
  })

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/projects/${id}`).then(r => r.data),
    onSuccess: () => { invalidate(); closeModal() },
  })

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setError('')
    setModal('create')
  }

  const openEdit = (project) => {
    setEditingProject(project)
    setForm({ title: project.title, description: project.description || '' })
    setError('')
    setModal('edit')
  }

  const openDelete = (project) => {
    setDeletingProject(project)
    setModal('delete')
  }

  const closeModal = () => {
    setModal(null)
    setEditingProject(null)
    setDeletingProject(null)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (modal === 'create') {
      createMutation.mutate(form)
    } else if (modal === 'edit') {
      editMutation.mutate({ id: editingProject.id, ...form })
    }
  }

  const isPending = createMutation.isPending || editMutation.isPending

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF8F3' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2F3630', margin: 0 }}>My Projects</h1>
          <button className="btn-primary" onClick={openCreate} style={{ padding: '10px 24px' }}>
            + New Project
          </button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <p style={{ color: '#7C8B74' }}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div style={{
            background: '#F4F1EA',
            border: '1px dashed #C2CBBE',
            borderRadius: 16,
            padding: '60px 24px',
            textAlign: 'center',
            color: '#7C8B74',
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 15 }}>No projects yet. Create your first one!</p>
            <button className="btn-primary" onClick={openCreate}>Create Project</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onEdit={openEdit} onDelete={openDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal === 'create' || modal === 'edit'}
        onClose={closeModal}
        title={modal === 'create' ? 'New Project' : 'Edit Project'}
      >
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
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Project name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : modal === 'create' ? 'Create Project' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete Project">
        <p style={{ color: '#3E463B', marginBottom: 24 }}>
          Are you sure you want to delete <strong>{deletingProject?.title}</strong>?
          This will also delete all its tasks and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={closeModal}>Cancel</button>
          <button
            className="btn-primary"
            style={{ background: '#4C5A46' }}
            onClick={() => deleteMutation.mutate(deletingProject.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
