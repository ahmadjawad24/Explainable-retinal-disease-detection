import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Eye, Mail, Lock, ArrowRight, Loader, Shield, Zap, Clock, ArrowLeft } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
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
        toast.success('Login successful! Redirecting...');
        
        setTimeout(() => {
          const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
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
          toast.error('Incorrect password! Please try again.');
        } else if (errorMessage.toLowerCase().includes('not found') ||
                   errorMessage.toLowerCase().includes('does not exist')) {
          toast.error('Account not found! Please check your email.');
        } else if (errorMessage.toLowerCase().includes('deactivated') ||
                   errorMessage.toLowerCase().includes('inactive') ||
                   errorMessage.toLowerCase().includes('disabled')) {
          toast.error('Your account has been deactivated. Contact support.');
        } else if (errorMessage.toLowerCase().includes('server') ||
                   errorMessage.toLowerCase().includes('connection') ||
                   errorMessage.toLowerCase().includes('network')) {
          toast.error('Server error! Please try again later.');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection error! Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-500 hover:text-sky-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to access your personalized dashboard</p>
      </div>

      {/* Benefits */}
      <div className="flex justify-center space-x-6 mb-8">
        {[
          { icon: Shield, text: 'Secure' },
          { icon: Zap, text: 'Fast' },
          { icon: Clock, text: '24/7' },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-gray-400">
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="Email address"
            disabled={isLoading}
          />
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 placeholder-gray-400 pr-12"
            placeholder="Password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="text-center mt-8 text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-sky-600 font-bold hover:text-sky-700 hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
};

export default Login;