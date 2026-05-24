import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Eye, LayoutDashboard, Shield, Users, FileText, 
  LogOut, Menu, X, ChevronDown, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/reviews', label: 'Reviews', icon: CheckCircle },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/profile', label: 'Profile', icon: Eye },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
    }
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-red-900 to-red-800 shadow-xl transform transition-transform duration-300 ease-in-out text-white',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static'
        )}
        style={{ width: '280px' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-red-700">
          <div className="flex items-center space-x-2 pointer-events-none">
            <Eye className="h-8 w-8 text-red-300" />
            <span className="text-xl font-bold">AI-Powered Eye Care</span>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-red-700 rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4 border-b border-red-700">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
            👑 Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex items-center space-x-3 px-6 py-3 mx-2 rounded-lg transition-colors',
                isActive(path)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-red-200 hover:bg-red-700 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-red-700 p-4">
          <div
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-700 cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-red-300">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-red-300" />
          </div>

          {isProfileOpen && (
            <div className="mt-2 space-y-1">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-200 hover:bg-red-700 hover:text-white rounded"
              >
                <Eye className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-300 hover:bg-red-700 hover:text-white rounded"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;