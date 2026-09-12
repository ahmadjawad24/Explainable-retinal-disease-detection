import { Outlet, Link, useLocation } from 'react-router-dom';
import { Eye, Home, Info, Briefcase, Phone, Menu, X, ChevronRight, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Clinical Services', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-xl shadow-xs text-white group-hover:scale-105 transition-transform">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-slate-900 tracking-tight">AI Eye Care</span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">Clinical</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Explainable Retinal Screening</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === path
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-100/70'
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="ml-4 pl-4 border-l border-slate-200 flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    location.pathname === path ? 'text-sky-600 bg-sky-50 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-sky-600" />
                    <span>{label}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
              <div className="pt-3 flex flex-col space-y-2 border-t border-slate-200 mt-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-2.5 text-slate-700 font-semibold bg-slate-100 rounded-xl text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Free Account
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
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2.5">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl text-white">
                  <Eye className="h-5 w-5" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">AI Eye Care System</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explainable clinical retinal disease detection platform utilizing deep learning and Grad-CAM visual attention mapping for ophthalmology decision support.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 text-[11px] text-sky-300 font-mono border border-slate-800">
                <span>ResNet50 / Grad-CAM / HIPAA Safe</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Screening Tests</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Diabetic Retinopathy (DR)</li>
                <li>Glaucoma / Cupping Evaluation</li>
                <li>Cataract Grading</li>
                <li>Pathological Myopia</li>
                <li>Healthy Retina Validation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">System Navigation</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link to="/" className="hover:text-sky-300 transition-colors">Home &amp; Screening</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-sky-300 transition-colors">About &amp; Leadership</Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-sky-300 transition-colors">Diagnostic Services</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-sky-300 transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-sky-300 transition-colors">Demo Login Portal</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contact &amp; Location</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Swabi, Pakistan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+92 348 2991158</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>info@aieyecare.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>Mon - Fri: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <p>© 2026 AI-Powered Eye Care. Explainable Retinal Disease Detection System.</p>
            <div className="flex space-x-4">
              <span>Medical AI Research & Decision Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
