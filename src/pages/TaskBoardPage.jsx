import { useEffect, useState } from 'react';
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';

const columns = [
  { key: 'Pending', title: 'Pending' },
  { key: 'In Progress', title: 'In Progress' },
  { key: 'Completed', title: 'Completed' },
];

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data.tasks || []);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    const nextStatus = over.id;
    if (!activeTask || activeTask.status === nextStatus) return;

    try {
      await api.patch(`/tasks/${activeTask._id}/status`, { status: nextStatus });
      setTasks((prev) => prev.map((task) => (task._id === activeTask._id ? { ...task, status: nextStatus } : task)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Board</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kanban board</h1>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 xl:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn key={column.key} title={column.title} status={column.key} tasks={tasks.filter((task) => task.status === column.key)} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function BoardColumn({ title, status, tasks }) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={`card min-h-[420px] p-4 ${isOver ? 'border-blue-300 bg-blue-50' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">No tasks</div> : tasks.map((task) => <TaskCard key={task._id} task={task} />)}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-800">{task.title}</p>
          <p className="text-xs text-slate-500">{task.assignedTo?.fullName || 'Unassigned'}</p>
        </div>
        <span className="badge bg-blue-100 text-blue-700">{task.priority}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{task.description.slice(0, 90)}...</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        <span>{task.status}</span>
      </div>
    </div>
  );
}
