import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Brain, 
  Shield, 
  Activity, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Target, 
  Sparkles, 
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const Home = () => {
  // Simple, fast sample selector (lightweight, zero lag)
  const [activeTab, setActiveTab] = useState('dr');

  const previewCases = {
    dr: {
      name: 'Diabetic Retinopathy',
      stage: 'Moderate Non-Proliferative (NPDR)',
      confidence: '95.4%',
      status: 'Action Recommended',
      statusClass: 'bg-rose-50 text-rose-700 border-rose-200',
      findings: 'Microaneurysms detected in macula area',
      vesselColor: '#0284c7',
      opticColor: '#e0f2fe'
    },
    glaucoma: {
      name: 'Glaucoma',
      stage: 'Suspect Optic Neuropathy',
      confidence: '92.8%',
      status: 'Specialist Review Advised',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-200',
      findings: 'Cup-to-disc ratio 0.74 (superior rim thinning)',
      vesselColor: '#0284c7',
      opticColor: '#bae6fd'
    },
    cataract: {
      name: 'Cataract',
      stage: 'Nuclear Sclerotic Grade 2',
      confidence: '96.1%',
      status: 'Clinical Evaluation Needed',
      statusClass: 'bg-sky-50 text-sky-700 border-sky-200',
      findings: 'Optical density attenuation in central lens',
      vesselColor: '#0369a1',
      opticColor: '#e0f2fe'
    },
    normal: {
      name: 'Healthy Retina',
      stage: 'Physiological Baseline',
      confidence: '98.5%',
      status: 'Normal Findings',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      findings: 'Clear vascular arcades, intact foveal pit',
      vesselColor: '#0284c7',
      opticColor: '#f0f9ff'
    }
  };

  const currentCase = previewCases[activeTab];

  const stats = [
    { value: '94.2%', label: 'Diagnostic Accuracy', icon: Target },
    { value: '10,000+', label: 'Fundus Scans Analyzed', icon: Eye },
    { value: '5+', label: 'Detectable Pathologies', icon: Brain },
    { value: '< 2 Mins', label: 'Instant AI Report', icon: Clock },
  ];

  const conditions = [
    {
      title: 'Diabetic Retinopathy',
      subtitle: 'Microvascular Complications',
      description: 'Identifies microaneurysms, hemorrhages, and macular edema before perceptible vision impairment.',
      icon: Eye,
      tag: 'High Priority'
    },
    {
      title: 'Glaucoma',
      subtitle: 'Optic Nerve Neuropathy',
      description: 'Measures cup-to-disc ratio and neuroretinal rim thinning to catch intraocular pressure damage early.',
      icon: Activity,
      tag: 'Silent Risk'
    },
    {
      title: 'Cataract',
      subtitle: 'Lens Clouding & Opacity',
      description: 'Detects crystalline lens opacification and optical scatter affecting visual clarity and contrast.',
      icon: Sparkles,
      tag: 'Common'
    },
    {
      title: 'Pathological Myopia',
      subtitle: 'Degenerative Changes',
      description: 'Detects posterior staphyloma and chorioretinal atrophy linked to high axial elongation.',
      icon: Brain,
      tag: 'Structural'
    },
    {
      title: 'Healthy Retina',
      subtitle: 'Normal Eye Physiology',
      description: 'Confirms intact retinal vessels, crisp disc margins, and clear foveal reflex for peace of mind.',
      icon: CheckCircle,
      tag: 'Baseline'
    }
  ];

  const steps = [
    {
      num: '1',
      title: 'Upload Fundus Photo',
      description: 'Upload standard color retinal imagery captured via clinic fundus cameras or handheld adapters.'
    },
    {
      num: '2',
      title: 'Deep AI Analysis',
      description: 'Trained neural network evaluates microvasculature, optic disc cupping, and macular integrity.'
    },
    {
      num: '3',
      title: 'Explainable Heatmap',
      description: 'Grad-CAM visual overlays substantiate the prediction so you can see exactly where the AI looked.'
    },
    {
      num: '4',
      title: 'Doctor Sign-Off',
      description: 'Certified ophthalmologists review flagged scans and provide clinical treatment recommendations.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section - Clean Light Aesthetic with Slate & Sky Palette */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Clear Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span>AI-Powered Retinal Screening &amp; Grad-CAM Analysis</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Early Retinal Disease Detection with <span className="text-sky-600">Explainable AI</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Upload retinal fundus images for fast, highly accurate screening of Diabetic Retinopathy, Glaucoma, and Cataracts. Validated by certified ophthalmologists with visual heatmap transparency.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center space-x-2 text-sm"
                >
                  <span>Start Free Screening</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold transition-all text-sm border border-slate-200"
                >
                  <span>Sign In / Live Portals</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4 text-sky-600" />
                  <span>94.2% AI Validation</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4 text-sky-600" />
                  <span>Grad-CAM Explainability</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4 text-sky-600" />
                  <span>Doctor Verification Workflow</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean, Lightweight Preview Card (No Heavy Canvas) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Retinal Analysis Preview
                    </span>
                  </div>
                  <span className="text-xs font-mono text-sky-400">AI Model: ResNet-50</span>
                </div>

                {/* Tab Switcher */}
                <div className="my-4">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Test Disease Case:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                    {[
                      { id: 'dr', label: 'Retinopathy' },
                      { id: 'glaucoma', label: 'Glaucoma' },
                      { id: 'cataract', label: 'Cataract' },
                      { id: 'normal', label: 'Healthy' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all truncate text-center ${
                          activeTab === tab.id
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clean Eye Graphic Representation */}
                <div className="relative h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 300 160" className="w-full h-full">
                    {/* Retinal Disc Background */}
                    <circle cx="150" cy="80" r="70" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                    
                    {/* Optic Disc */}
                    <circle cx="110" cy="80" r="18" fill={currentCase.opticColor} />
                    <circle cx="110" cy="80" r="9" fill="#0284c7" />

                    {/* Retinal Vasculature */}
                    <path d="M 110 80 Q 140 40 180 35 T 220 45" fill="none" stroke={currentCase.vesselColor} strokeWidth="2.5" />
                    <path d="M 110 80 Q 140 120 185 125 T 225 115" fill="none" stroke={currentCase.vesselColor} strokeWidth="2.5" />
                    <path d="M 110 80 Q 85 50 60 45" fill="none" stroke={currentCase.vesselColor} strokeWidth="2" />
                    <path d="M 110 80 Q 85 110 60 115" fill="none" stroke={currentCase.vesselColor} strokeWidth="2" />

                    {/* Macula / Fovea */}
                    <circle cx="175" cy="80" r="10" fill="#0369a1" />
                    <circle cx="175" cy="80" r="3" fill="#38bdf8" />
                  </svg>

                  {/* Heatmap Overlay Indicator */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Grad-CAM Focus: Macular Arch
                  </div>
                </div>

                {/* Diagnostic Details */}
                <div className="mt-4 bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Classification</p>
                      <h4 className="text-base font-bold text-white">{currentCase.name}</h4>
                    </div>
                    <span className="text-sm font-bold text-sky-400">{currentCase.confidence} Confidence</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {currentCase.findings}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{currentCase.stage}</span>
                    <Link
                      to="/login"
                      className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Try Diagnosis</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - Clean White Card */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 rounded-xl">
                <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-sky-100">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Test Portals for Admin, Doctor & Patient - Direct Frictionless Access */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Instant Role Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              Explore All Three User Workspaces
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Log in directly or test individual portals designed specifically for patients, clinicians, and system administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Patient Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Patient Portal</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Upload eye scans, inspect instant AI predictions, view Grad-CAM heatmaps, and download medical PDF reports.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono mb-4">
                  <p><strong>Demo:</strong> patient@test.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Patient Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Doctor Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Doctor Workspace</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Triage patient scans, examine Grad-CAM attention regions, approve diagnoses, and formulate treatment plans.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono mb-4">
                  <p><strong>Demo:</strong> doctor1@aiyecare.com</p>
                  <p><strong>Password:</strong> doctor123</p>
                </div>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Launch Doctor Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Admin Control Center Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Admin Control Center</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Oversee system telemetry, verify medical credentials, inspect scan volumes, and manage user permissions.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono mb-4">
                  <p><strong>Demo:</strong> admin@aiyecare.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Admin Center</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Conditions We Detect Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Pathology Scope
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              Conditions We Screen Early
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Deep convolutional networks detect subtle microvascular and structural shifts across standard fundus photography.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {conditions.map((condition, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center">
                      <condition.icon className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-slate-700 border border-slate-200">
                      {condition.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{condition.title}</h3>
                  <p className="text-xs font-semibold text-sky-600 mb-2">{condition.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {condition.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-sky-600">
                  <Link to="/diagnose" className="hover:text-sky-700 flex items-center gap-1">
                    <span>Screen scan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-slate-400 font-mono text-[10px]">Grad-CAM Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple 4-Step Process */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Workflow
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              How AI Eye Care Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From fundus capture to specialist-approved diagnostic verification in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 font-extrabold text-base flex items-center justify-center mx-auto mb-4 border border-sky-100">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-500/30">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Protect Vision with Early AI Screening
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Accessible retinal evaluation with explainable Grad-CAM heatmaps and certified ophthalmologist second opinions.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold text-xs transition-all shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs border border-slate-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
