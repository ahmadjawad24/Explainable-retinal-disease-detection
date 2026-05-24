import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Eye, User, Mail, Lock, ArrowRight, Loader, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters');
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      if (formData.role === 'doctor' && formData.specialization) {
        registerData.specialization = formData.specialization;
      }
      
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to AI-Powered Eye Care!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        const errorMessage = result.message || 'Registration failed';
        
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('exists') || 
             errorMessage.toLowerCase().includes('already') ||
             errorMessage.toLowerCase().includes('taken'))) {
          toast.error('Email already registered! Please use a different email or login.');
        } else if (errorMessage.toLowerCase().includes('password')) {
          toast.error('Password requirements not met. Please try again.');
        } else if (errorMessage.toLowerCase().includes('server') ||
                   errorMessage.toLowerCase().includes('connection') ||
                   errorMessage.toLowerCase().includes('network')) {
          toast.error('Server error! Please try again later.');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500">Join AI-Powered Eye Care today</p>
      </div>

      {/* Benefits */}
      <div className="flex justify-center space-x-6 mb-8">
        {[
          { icon: Shield, text: 'Secure' },
          { icon: CheckCircle, text: 'Free' },
          { icon: Eye, text: 'AI-Powered' },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-gray-400">
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="Full Name"
            disabled={isLoading}
          />
        </div>

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
        </div>

        {/* Role Selection */}
        <div className="relative">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option value="patient">👤 I'm a Patient</option>
            <option value="doctor">👨‍⚕️ I'm a Doctor</option>
          </select>
        </div>

        {/* Specialization (only for doctors) */}
        {formData.role === 'doctor' && (
          <div className="relative">
            <select
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-sky-50 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
              required
            >
              <option value="">Select your specialization</option>
              <option value="MBBS">MBBS - Bachelor of Medicine</option>
              <option value="FCPS">FCPS - Fellow of College of Physicians and Surgeons</option>
              <option value="MD">MD - Doctor of Medicine</option>
              <option value="MS">MS - Master of Surgery</option>
              <option value="DO">DO - Doctor of Osteopathy</option>
              <option value="Ophthalmology">Ophthalmology Specialist</option>
              <option value="Retina Specialist">Retina Specialist</option>
              <option value="Glaucoma Specialist">Glaucoma Specialist</option>
              <option value="Cornea Specialist">Cornea Specialist</option>
              <option value="Pediatric Ophthalmology">Pediatric Ophthalmology</option>
              <option value="Neuro-Ophthalmology">Neuro-Ophthalmology</option>
              <option value="Oculoplastics">Oculoplastics Surgeon</option>
              <option value="General Physician">General Physician</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 placeholder-gray-400 pr-12"
            placeholder="Password (min 6 characters)"
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

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="Confirm Password"
            disabled={isLoading}
          />
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Terms */}
      <p className="text-center mt-6 text-xs text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-sky-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>
      </p>

      {/* Login Link */}
      <p className="text-center mt-6 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-sky-600 font-bold hover:text-sky-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;