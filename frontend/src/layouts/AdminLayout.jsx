import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Eye, LayoutDashboard, CheckCircle, Users, FileText, 
  LogOut, Menu, X, User, ExternalLink, Stethoscope
} from 'lucide-react';
import clsx from 'clsx';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/reviews', label: 'Reviews & Scans', icon: CheckCircle },
    { path: '/admin/users', label: 'User Directory', icon: Users },
    { path: '/reports', label: 'Clinical Reports', icon: FileText },
    { path: '/profile', label: 'My Account', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Clean Slate & Sky Palette */}
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
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl text-white shadow-sm">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">AI Eye Care</span>
              <p className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">System Administration</p>
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
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Admin Control Center
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
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
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}

          {/* Quick Cross-Role Navigation */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cross-Portal Preview
            </p>
            <Link
              to="/dashboard"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-sky-400" />
                <span>Patient Screening</span>
              </span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>
            <Link
              to="/doctor"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Stethoscope className="h-3.5 w-3.5 text-sky-400" />
                <span>Doctor Workspace</span>
              </span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>
          </div>
        </nav>

        {/* User Profile & Direct Logout */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@aiyecare.com'}</p>
              </div>
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-xs sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-700">Role:</span>
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-bold">Admin</span>
            </div>
          </div>

          {/* Quick Navigation / Portal Switcher */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
              <Link
                to="/admin"
                className="px-3 py-1 rounded-lg bg-white text-slate-900 font-semibold shadow-xs"
              >
                Admin Panel
              </Link>
              <Link
                to="/doctor"
                className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              >
                Doctor Portal
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              >
                Patient Portal
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
