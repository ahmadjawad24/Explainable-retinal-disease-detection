import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Eye, LayoutDashboard, ScanSearch, History, Calendar, User, 
  FileText, LogOut, Menu, X, Shield, Stethoscope
} from 'lucide-react';
import clsx from 'clsx';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/diagnose', label: 'New AI Diagnosis', icon: ScanSearch },
    { path: '/history', label: 'Screening History', icon: History },
    { path: '/reports', label: 'Medical Reports', icon: FileText },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/profile', label: 'My Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Clean Slate & Sky theme */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-white shadow-md transform transition-transform duration-300 ease-in-out border-r border-slate-200 flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static'
        )}
        style={{ width: '270px' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl text-white shadow-xs">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">AI Eye Care</span>
              <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider">Patient Portal</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 capitalize">
            Patient Mode
          </span>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin View</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-sm',
                isActive(path)
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}

          {/* If user is admin, provide quick jump to other portals */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-200">
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Admin Portals
              </p>
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-sky-600" />
                <span>Admin Control Center</span>
              </Link>
              <Link
                to="/doctor"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors"
              >
                <Stethoscope className="h-3.5 w-3.5 text-sky-600" />
                <span>Doctor Workspace</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile & Direct Logout */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-xs text-slate-900 truncate">{user?.name || 'Patient'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-slate-200 shadow-xs"
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
              Retinal Health Screening Dashboard
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

export default DashboardLayout;
