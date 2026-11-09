import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, CalendarClock, Users, ClipboardList, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const dashboardCards = [
  { label: 'Total Users', key: 'totalUsers', icon: Users },
  { label: 'Managers', key: 'totalManagers', icon: Activity },
  { label: 'Tasks', key: 'totalTasks', icon: ClipboardList },
  { label: 'Pending', key: 'pendingTasks', icon: CalendarClock },
  { label: 'In Progress', key: 'inProgressTasks', icon: Activity },
  { label: 'Completed', key: 'completedTasks', icon: CheckCircle2 },
  { label: 'Overdue', key: 'overdueTasks', icon: AlertTriangle },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recent-activities'),
      ]);
      setStats(statsRes.data.stats);
      setActivities(activitiesRes.data.activities);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">System overview</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map(({ label, key, icon: Icon }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stats[key] ?? 0}</h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-800">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-800">{activity.title}</p>
                  <p className="text-sm text-slate-500">{activity.assignedTo?.fullName || 'Unassigned'} • {activity.status}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(activity.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-800">Key metrics</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Completion rate</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${stats.totalTasks ? ((stats.completedTasks || 0) / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tasks in progress</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${stats.totalTasks ? ((stats.inProgressTasks || 0) / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
