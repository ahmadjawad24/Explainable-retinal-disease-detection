import { Outlet, Link, useLocation } from 'react-router-dom';
import { Eye, Home, Info, Briefcase, Phone, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">AI-Powered</span>
                <span className="text-xl font-bold text-gray-800 ml-1">Eye Care</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    location.pathname === path
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="ml-4 flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 font-medium hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    location.pathname === path ? 'text-sky-600 bg-sky-50' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
              <div className="mt-4 flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="block text-center px-4 py-3 text-gray-700 font-medium bg-gray-50 rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-slate-950 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">AI-Powered</span>
                  <span className="text-lg font-bold text-white ml-1">Eye Care</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Advanced AI-powered eye disease detection system for early diagnosis and treatment. Protecting your vision with cutting-edge technology.
              </p>
              <div className="flex space-x-3 pt-2">
                {['facebook', 'twitter', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors">
                    <span className="text-sm capitalize">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-5 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                {navLinks.map(({ path, label }) => (
                  <li key={path}>
                    <Link to={path} className="text-gray-400 hover:text-sky-400 transition-colors flex items-center space-x-2">
                      <span>{label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-5 text-lg">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Diabetic Retinopathy Detection</li>
                <li>Glaucoma Screening</li>
                <li>Cataract Assessment</li>
                <li>Myopia Evaluation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-5 text-lg">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sky-400">📧</span>
                  </div>
                  <span>info@aieyecare.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sky-400">📞</span>
                  </div>
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sky-400">📍</span>
                  </div>
                  <span>Karachi, Pakistan</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">© 2024 AI-Powered Eye Care. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
