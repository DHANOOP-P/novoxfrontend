import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Users, LogOut, KanbanSquare, BriefcaseBusiness } from 'lucide-react';
import useAuthStore from '../store/authStore';

const navItems = [
  { label: 'Overview', to: '/dashboard/overview', icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Manager View', to: '/dashboard/manager', icon: BriefcaseBusiness, roles: ['manager'] },
  { label: 'User View', to: '/dashboard/user', icon: ListTodo, roles: ['user'] },
  { label: 'Board', to: '/dashboard/board', icon: KanbanSquare, roles: ['admin', 'manager', 'user'] },
  { label: 'Users', to: '/dashboard/users', icon: Users, roles: ['admin', 'manager'] },
  { label: 'Tasks', to: '/dashboard/tasks', icon: ListTodo, roles: ['admin', 'manager', 'user'] },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 border-r border-slate-200 bg-slate-900 text-slate-100">
        <div className="p-6">
          <div className="text-2xl font-bold tracking-tight">Novox</div>
          <p className="mt-2 text-sm text-slate-400">Task management system</p>
        </div>
        <nav className="space-y-2 p-4">
          {navItems.map(({ label, to, icon: Icon, roles }) => {
            if (!roles.includes(user?.role)) return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-slate-800 p-4">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Signed in as</div>
          <div className="font-medium text-white">{user?.fullName}</div>
          <div className="text-sm text-slate-400">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
