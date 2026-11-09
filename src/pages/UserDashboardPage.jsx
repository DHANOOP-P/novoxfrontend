import { useEffect, useState } from 'react';
import { ListTodo, Clock3, CheckCircle2, AlertTriangle, CalendarDays } from 'lucide-react';
import api from '../services/api';

export default function UserDashboardPage() {
  const [stats, setStats] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/tasks?limit=5'),
      ]);
      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600">My dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your task overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total tasks" value={stats.totalTasks ?? 0} icon={ListTodo} />
        <MetricCard label="Pending" value={stats.pendingTasks ?? 0} icon={Clock3} />
        <MetricCard label="In Progress" value={stats.inProgressTasks ?? 0} icon={ListTodo} />
        <MetricCard label="Completed" value={stats.completedTasks ?? 0} icon={CheckCircle2} />
        <MetricCard label="Overdue" value={stats.overdueTasks ?? 0} icon={AlertTriangle} />
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-800">Upcoming deadlines</h2>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-800">{task.title}</p>
                <p className="text-sm text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <span className="badge bg-blue-100 text-blue-700">{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
