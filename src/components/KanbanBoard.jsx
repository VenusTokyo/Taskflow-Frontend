import { useState, useMemo } from 'react'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

const COLUMNS = [
  { id: 'todo',        title: 'To Do'       },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done',        title: 'Done'        },
]

function DraggableTask({ task, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined,
        opacity: isDragging ? 0.35 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  )
}

function Column({ column, tasks, onAddTask, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    /* CSS class handles flex sizing; inline handles colours */
    <div
      ref={setNodeRef}
      className="kanban-col"
      style={{
        background: isOver ? '#D0CBC0' : '#F4F1EA',
        border: `2px solid ${isOver ? '#5F6F57' : '#C2CBBE'}`,
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 420,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#2F3630' }}>{column.title}</h3>
        <span style={{
          background: '#C2CBBE', color: '#3E463B',
          borderRadius: 20, padding: '2px 10px',
          fontSize: 12, fontWeight: 600,
        }}>
          {tasks.length}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(task => (
          <DraggableTask key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        style={{
          width: '100%', padding: '10px',
          background: 'transparent', border: '1px dashed #C2CBBE',
          borderRadius: 8, color: '#7C8B74',
          cursor: 'pointer', fontSize: 13, marginTop: 4,
        }}
      >
        + Add Task
      </button>
    </div>
  )
}

export default function KanbanBoard({ tasks, onAddTask, onEditTask, onUpdateStatus }) {
  const [activeTask, setActiveTask] = useState(null)

  const tasksByColumn = useMemo(() => ({
    todo:        tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done:        tasks.filter(t => t.status === 'done'),
  }), [tasks])

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over) return
    const newStatus = over.id
    if (COLUMNS.some(c => c.id === newStatus)) {
      const task = tasks.find(t => t.id === active.id)
      if (task && task.status !== newStatus) onUpdateStatus(active.id, newStatus)
    }
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* kanban-scroll enables horizontal swipe on mobile */}
      <div className="kanban-scroll">
        <div className="kanban-board">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id]}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
