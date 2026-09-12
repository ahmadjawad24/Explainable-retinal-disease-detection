import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader, Shield, CheckCircle2, ArrowLeft, Stethoscope, HeartHandshake, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    specialization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuthStore();
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

  const handleRoleSelect = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole,
      specialization: selectedRole === 'doctor' ? (formData.specialization || 'Ophthalmology') : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.role === 'doctor' && !formData.specialization) {
      toast.error('Please select your medical specialization');
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };
      
      if (formData.role === 'doctor' && formData.specialization) {
        registerData.specialization = formData.specialization;
      }
      
      const result = await register(registerData);
      
      if (result.success) {
        toast.success(`Account created successfully! Welcome, ${formData.name}`);
        
        setTimeout(() => {
          if (formData.role === 'doctor') {
            navigate('/doctor');
          } else {
            navigate('/dashboard');
          }
        }, 500);
      } else {
        const errorMessage = result.message || 'Registration failed';
        if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('exists')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network or server connection error. Please try again.');
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
          <span>Quick Patient & Physician Onboarding</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Your Account</h1>
        <p className="text-slate-600 text-sm mt-1">Start screening retinal scans and receiving AI-assisted clinical insights.</p>
      </div>

      {/* Role Selector Pill */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('patient')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              formData.role === 'patient'
                ? 'bg-white text-teal-700 shadow-xs border border-teal-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>Patient / Individual</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('doctor')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              formData.role === 'doctor'
                ? 'bg-white text-teal-700 shadow-xs border border-teal-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Ophthalmologist / Doctor</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
              placeholder={formData.role === 'doctor' ? 'e.g., Dr. Amina Tariq' : 'e.g., Jane Miller'}
              disabled={isLoading}
              required
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
              placeholder="e.g., name@domain.com"
              disabled={isLoading}
              required
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Doctor Specialization */}
        {formData.role === 'doctor' && (
          <div>
            <label className="block text-xs font-semibold text-teal-900 mb-1">
              Medical Specialization
            </label>
            <div className="relative">
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-teal-50/50 border border-teal-200 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 text-sm shadow-xs cursor-pointer"
                required
              >
                <option value="Ophthalmology">Ophthalmology Generalist</option>
                <option value="Retina Specialist">Vitreoretinal Specialist</option>
                <option value="Glaucoma Specialist">Glaucoma Specialist</option>
                <option value="Cornea Specialist">Cornea & Refractive Surgery</option>
                <option value="Pediatric Ophthalmology">Pediatric Ophthalmology</option>
                <option value="General Physician">General Physician / Optometrist</option>
              </select>
              <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
                placeholder="Min 6 chars"
                disabled={isLoading}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-hidden transition-all text-slate-900 placeholder-slate-400 text-sm shadow-xs"
                placeholder="Repeat password"
                disabled={isLoading}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3.5 px-6 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader className="h-4.5 w-4.5 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo alternative */}
      <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-xs text-slate-600">
          Want to explore instantly without signing up?{' '}
          <Link to="/login" className="text-teal-700 font-semibold hover:underline">
            Use a 1-click demo account
          </Link>
        </p>
      </div>

      {/* Login Link */}
      <p className="text-center mt-5 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="text-teal-700 font-semibold hover:text-teal-800 hover:underline">
          Sign In here
        </Link>
      </p>
    </div>
  );
};

export default Register;
