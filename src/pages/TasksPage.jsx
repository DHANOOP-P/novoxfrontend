import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data.tasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', form);
      toast.success('Task created');
      setForm({ title: '', description: '', assignedTo: '', priority: 'Medium', status: 'Pending', dueDate: '' });
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Tasks</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Task management</h1>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-800">Create task</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="rounded-xl border border-slate-300 px-3 py-2.5" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="Assigned user ID" className="rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-2" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="min-h-28 rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-2" />
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button type="submit" className="md:col-span-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white">Create task</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-800">Recent tasks</h2>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.assignedTo?.fullName ?? 'Unassigned'} • Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700">{task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
