import { Outlet, Link } from 'react-router-dom';
import { Eye, Activity, Shield, Clock, CheckCircle, Zap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Eye className="h-10 w-10 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold">AI-Powered</span>
              <span className="text-2xl font-light ml-2">Eye Care</span>
            </div>
          </Link>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Advanced AI-Driven<br />
            <span className="text-sky-300">Eye Disease Detection</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-lg">
            Experience next-generation healthcare technology that detects eye diseases with 94% accuracy using state-of-the-art deep learning models.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Activity, title: 'Real-time Analysis', desc: 'Get instant diagnosis results' },
              { icon: Shield, title: 'Expert Review', desc: 'Verified by certified doctors' },
              { icon: Clock, title: '24/7 Available', desc: 'Access care anytime, anywhere' },
              { icon: CheckCircle, title: 'High Accuracy', desc: '94% detection accuracy' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <div className="bg-sky-400/30 p-2 rounded-lg">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex space-x-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <p className="text-4xl font-bold">10K+</p>
              <p className="text-white/70">Scans Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50+</p>
              <p className="text-white/70">Expert Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-bold">94%</p>
              <p className="text-white/70">Accuracy Rate</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Auth Form (Fully Covered) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="bg-gradient-to-br from-sky-600 to-blue-700 p-3 rounded-xl">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">AI-Powered</span>
                <span className="text-xl font-light text-gray-600 ml-1">Eye Care</span>
              </div>
            </Link>
          </div>

          {/* Auth Form - No Card Container */}
          <Outlet />

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-gray-400">
            © 2024 AI-Powered Eye Care. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
