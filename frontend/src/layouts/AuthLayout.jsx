import { Outlet, Link } from 'react-router-dom';
import { Eye, Activity, ShieldCheck, HeartPulse, Stethoscope, Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Side - Medical Branding & Value Highlights */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-800 via-slate-900 to-sky-950 relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white">
        {/* Soft Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="bg-teal-500/20 border border-teal-400/30 p-2.5 rounded-xl backdrop-blur-md">
              <Eye className="h-7 w-7 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">AI Eye Care</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">Clinical AI</span>
              </div>
              <p className="text-xs text-slate-300">Explainable Retinal Disease Screening</p>
            </div>
          </Link>
        </div>

        {/* Center Presentation */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-teal-200 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Multi-Class Neural Network with Grad-CAM Explainability</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mb-5">
            Preserving Vision Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-300">Intelligent Diagnostics</span>
          </h2>

          <p className="text-slate-300 text-base leading-relaxed max-w-lg mb-8">
            Empowering patients and ophthalmologists with rapid retinal classification for Diabetic Retinopathy, Glaucoma, Cataract, and Myopia with visual heatmap verification.
          </p>

          {/* Key Value Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Activity className="w-5 h-5 text-teal-400 mb-2" />
              <div className="text-xl font-bold text-white">94.2%</div>
              <div className="text-xs text-slate-400">Diagnostic Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xl font-bold text-white">Grad-CAM</div>
              <div className="text-xs text-slate-400">Explainable Heatmaps</div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-400" />
            <span>Built for clinical decision support</span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-400" />
            <span>Ophthalmologist Verified</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="bg-teal-600 p-2 rounded-xl text-white">
                <Eye className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-slate-900">AI Eye Care</span>
            </Link>
          </div>

          <Outlet />

          <p className="text-center mt-8 text-xs text-slate-400">
            Protected by medical-grade data encryption and role-based access control.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
