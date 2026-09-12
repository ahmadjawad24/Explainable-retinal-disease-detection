import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Eye, LayoutDashboard, ClipboardList, Calendar, Users, 
  LogOut, Menu, X, UserCheck, Shield
} from 'lucide-react';
import clsx from 'clsx';

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/doctor/reviews', label: 'Pending Reviews', icon: ClipboardList },
    { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { path: '/doctor/patients', label: 'Patient Roster', icon: Users },
    { path: '/doctor/profile', label: 'Doctor Profile', icon: UserCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Clean Deep Slate & Sky Theme */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out text-slate-200 border-r border-slate-800 flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static'
        )}
        style={{ width: '270px' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/doctor" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl text-white shadow-xs">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">AI Eye Care</span>
              <p className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">Clinician Workspace</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            Certified Clinician
          </span>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-sm',
                isActive(path, exact)
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}

          {/* If user is Admin inspecting Doctor portal, allow easy return to Admin */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Admin Portals
              </p>
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-sky-400" />
                <span>Admin Control Center</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-sky-400" />
                <span>Patient Diagnosis View</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile & Direct Logout */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-xs text-white truncate">{user?.name || 'Dr. Specialist'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.specialization || 'Ophthalmologist'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-slate-700/60"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Clinical Ophthalmology &amp; Grad-CAM Verification Portal
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Return to Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorLayout;
