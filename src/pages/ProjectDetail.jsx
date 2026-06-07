import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import KanbanBoard from '../components/KanbanBoard'
import Modal from '../components/Modal'
import api from '../lib/api'

const EMPTY_TASK = { title: '', description: '', priority: 'medium', dueDate: '', status: 'todo' }
const EMPTY_PROJECT_FORM = { title: '', description: '', status: 'active' }

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [taskModal, setTaskModal] = useState(null) // null | 'create' | 'edit'
  const [projModal, setProjModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState(EMPTY_TASK)
  const [projForm, setProjForm] = useState(EMPTY_PROJECT_FORM)
  const [taskError, setTaskError] = useState('')
  const [projError, setProjError] = useState('')

  const { data: currentProject, isLoading: projLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.data),
  })

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.get(`/tasks/project/${id}`).then(r => r.data),
  })

  const invalidateTasks    = () => qc.invalidateQueries({ queryKey: ['tasks', id] })
  const invalidateProjects = () => {
    qc.invalidateQueries({ queryKey: ['project', id] })
    qc.invalidateQueries({ queryKey: ['projects'] })
  }

  const createTaskMutation = useMutation({
    mutationFn: data => api.post('/tasks', data).then(r => r.data),
    onSuccess: () => { invalidateTasks(); closeTaskModal() },
    onError: err => setTaskError(err.response?.data?.error || 'Failed to create task'),
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id: tid, ...data }) => api.put(`/tasks/${tid}`, data).then(r => r.data),
    onSuccess: () => { invalidateTasks(); closeTaskModal() },
    onError: err => setTaskError(err.response?.data?.error || 'Failed to update task'),
  })

  const deleteTaskMutation = useMutation({
    mutationFn: tid => api.delete(`/tasks/${tid}`).then(r => r.data),
    onSuccess: () => invalidateTasks(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id: tid, status }) => api.put(`/tasks/${tid}`, { status }).then(r => r.data),
    onSuccess: () => invalidateTasks(),
  })

  const updateProjectMutation = useMutation({
    mutationFn: data => api.put(`/projects/${id}`, data).then(r => r.data),
    onSuccess: () => { invalidateProjects(); setProjModal(false) },
    onError: err => setProjError(err.response?.data?.error || 'Failed to update project'),
  })

  const openAddTask = (status) => { setTaskForm({ ...EMPTY_TASK, status }); setTaskError(''); setTaskModal('create') }
  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({ title: task.title, description: task.description || '', priority: task.priority, dueDate: task.due_date || '', status: task.status })
    setTaskError('')
    setTaskModal('edit')
  }
  const closeTaskModal = () => { setTaskModal(null); setEditingTask(null); setTaskError('') }

  const openEditProject = () => {
    if (!currentProject) return
    setProjForm({ title: currentProject.title, description: currentProject.description || '', status: currentProject.status })
    setProjError('')
    setProjModal(true)
  }

  const handleTaskSubmit = (e) => {
    e.preventDefault()
    setTaskError('')
    if (taskModal === 'create') createTaskMutation.mutate({ ...taskForm, projectId: id })
    else updateTaskMutation.mutate({ id: editingTask.id, ...taskForm })
  }

  const handleProjectSubmit = (e) => {
    e.preventDefault()
    updateProjectMutation.mutate(projForm)
  }

  if (projLoading || tasksLoading) {
    return (
      <AppLayout>
        <p style={{ color: '#7C8B74' }}>Loading...</p>
      </AppLayout>
    )
  }

  if (!currentProject) {
    return (
      <AppLayout>
        <p style={{ color: '#4C5A46', marginBottom: 16 }}>Project not found.</p>
        <button className="btn-secondary" onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Project header */}
      <div style={{ marginBottom: 36 }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            background: 'none', border: 'none', color: '#7C8B74', cursor: 'pointer',
            fontSize: 13, padding: 0, marginBottom: 16,
          }}
        >
          ← Back to Projects
        </button>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2F3630', margin: '0 0 8px' }}>
              {currentProject.title}
            </h1>
            {currentProject.description && (
              <p style={{ color: '#7C8B74', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                {currentProject.description}
              </p>
            )}
          </div>
          <button className="btn-secondary" onClick={openEditProject} style={{ flexShrink: 0, padding: '8px 20px' }}>
            Edit Project
          </button>
        </div>
      </div>

      {/* Kanban — has its own scroll wrapper for mobile */}
      <KanbanBoard
        tasks={tasks}
        onAddTask={openAddTask}
        onEditTask={openEditTask}
        onUpdateStatus={(taskId, newStatus) => updateStatusMutation.mutate({ id: taskId, status: newStatus })}
      />

      {/* Task Modal */}
      <Modal
        isOpen={taskModal === 'create' || taskModal === 'edit'}
        onClose={closeTaskModal}
        title={taskModal === 'create' ? 'Add Task' : 'Edit Task'}
      >
        {taskError && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '10px 14px', color: '#4C5A46', marginBottom: 16, fontSize: 13,
          }}>
            {taskError}
          </div>
        )}
        <form onSubmit={handleTaskSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Task title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Optional details..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Priority</label>
              <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <div>
              {taskModal === 'edit' && (
                <button
                  type="button"
                  onClick={() => { deleteTaskMutation.mutate(editingTask.id); closeTaskModal() }}
                  style={{
                    background: 'transparent', border: 'none', color: '#7C8B74',
                    cursor: 'pointer', fontSize: 13, padding: 0,
                  }}
                >
                  Delete task
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn-secondary" onClick={closeTaskModal}>Cancel</button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
              >
                {createTaskMutation.isPending || updateTaskMutation.isPending
                  ? 'Saving...'
                  : taskModal === 'create' ? 'Add Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={projModal} onClose={() => setProjModal(false)} title="Edit Project">
        {projError && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '10px 14px', color: '#4C5A46', marginBottom: 16, fontSize: 13,
          }}>
            {projError}
          </div>
        )}
        <form onSubmit={handleProjectSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={projForm.title}
              onChange={e => setProjForm({ ...projForm, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={projForm.description}
              onChange={e => setProjForm({ ...projForm, description: e.target.value })}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={projForm.status} onChange={e => setProjForm({ ...projForm, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={() => setProjModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={updateProjectMutation.isPending}>
              {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}
