import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader, Shield, CheckCircle2, UserCheck, Stethoscope, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Handle browser back button
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate('/');
    };
    
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    toast.success(`Loaded ${email.split('@')[0]} credentials`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful! Redirecting to your portal...');
        
        setTimeout(() => {
          const user = result.user || JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
          if (user.role === 'admin') {
            navigate('/admin');
          } else if (user.role === 'doctor') {
            navigate('/doctor');
          } else {
            navigate('/dashboard');
          }
        }, 500);
      } else {
        const errorMessage = result.message || 'Login failed';
        
        if (errorMessage.toLowerCase().includes('password') || 
            errorMessage.toLowerCase().includes('incorrect') ||
            errorMessage.toLowerCase().includes('wrong')) {
          toast.error('Incorrect password. Please verify and try again.');
        } else if (errorMessage.toLowerCase().includes('not found') ||
                   errorMessage.toLowerCase().includes('does not exist')) {
          toast.error('Account not found. Please check your email or create an account.');
        } else if (errorMessage.toLowerCase().includes('deactivated') ||
                   errorMessage.toLowerCase().includes('inactive') ||
                   errorMessage.toLowerCase().includes('disabled')) {
          toast.error('Your account has been deactivated. Please contact support.');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-teal-600 transition-colors mb-6 group text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Home</span>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Secure Medical Portal</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sign In to AI Eye Care</h1>
        <p className="text-slate-600 text-sm mt-1">Access your retinal scan history, diagnostic reviews, and specialist consultations.</p>
      </div>

      {/* One-Click Demo Accounts Quick Bar */}
      <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Instant Demo Logins</span>
          </span>
          <span className="text-[11px] text-slate-500">1-click autofill</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('patient@aiyecare.com', 'patient123')}
            className="px-2.5 py-2 text-xs font-medium bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-slate-700 hover:text-teal-800 transition-all flex flex-col items-center justify-center gap-1 shadow-xs"
          >
            <span className="font-semibold text-teal-700">Patient</span>
            <span className="text-[10px] text-slate-500">John Doe</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('doctor1@aiyecare.com', 'doctor123')}
            className="px-2.5 py-2 text-xs font-medium bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-slate-700 hover:text-teal-800 transition-all flex flex-col items-center justify-center gap-1 shadow-xs"
          >
            <span className="font-semibold text-teal-700">Doctor</span>
            <span className="text-[10px] text-slate-500">Dr. Khan</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin@aiyecare.com', 'admin123')}
            className="px-2.5 py-2 text-xs font-medium bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-slate-700 hover:text-teal-800 transition-all flex flex-col items-center justify-center gap-1 shadow-xs"
          >
            <span className="font-semibold text-teal-700">Admin</span>
            <span className="text-[10px] text-slate-500">SysAdmin</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
              placeholder="e.g., patient@aiyecare.com"
              disabled={isLoading}
              required
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast('For demo accounts, use password "patient123", "doctor123", or "admin123"')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
            >
              Need hint?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-11 py-3 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader className="h-4.5 w-4.5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Reassurance Badges */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-slate-100 text-slate-500 text-xs">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>HIPAA & Encrypted</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Explainable AI</span>
        </span>
      </div>

      {/* Register Link */}
      <p className="text-center mt-6 text-sm text-slate-600">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-teal-700 font-semibold hover:text-teal-800 hover:underline">
          Register for free
        </Link>
      </p>
    </div>
  );
};

export default Login;
