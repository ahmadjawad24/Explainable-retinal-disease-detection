import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Cpu, ArrowRight, Layers, FileText } from 'lucide-react';

const SAMPLES = [
  {
    id: 'dr',
    title: 'Diabetic Retinopathy',
    tag: 'Microvascular Lesions',
    confidence: '94.8%',
    status: 'Needs Immediate Review',
    severity: 'High Priority',
    color: 'from-amber-500 to-rose-600',
    findings: 'Microaneurysms, hard exudates and cotton-wool spots localized in the superior macular arcades.',
    doctorNote: 'Consistent with moderate to severe NPDR. Dilated fundus examination and OCT recommended within 14 days.',
    primaryAttention: 'Macular Arcades & Posterior Pole'
  },
  {
    id: 'glaucoma',
    title: 'Glaucoma (Optic Neuropathy)',
    tag: 'Elevated Cup-to-Disc Ratio',
    confidence: '92.4%',
    status: 'Pathology Detected',
    severity: 'Urgent Evaluation',
    color: 'from-purple-500 to-indigo-600',
    findings: 'Marked neuroretinal rim thinning and cup-to-disc ratio exceeding 0.75 with inferior notch.',
    doctorNote: 'Initiate visual field perimetry test (Humphrey 24-2) and tonometry IOP monitoring.',
    primaryAttention: 'Optic Nerve Head & Lamina Cribrosa'
  },
  {
    id: 'normal',
    title: 'Normal Healthy Retina',
    tag: 'Clear Fundus Architecture',
    confidence: '98.1%',
    status: 'Normal Exam',
    severity: 'Routine Checkup',
    color: 'from-emerald-500 to-teal-600',
    findings: 'Optic disc margins sharp, cup-to-disc ratio 0.3, foveal reflex intact, no vascular abnormalities.',
    doctorNote: 'Retina appears completely healthy. Standard annual routine screening suggested.',
    primaryAttention: 'Homogeneous Vascular Distribution'
  }
];

export default function RetinalVideoWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSample, setSelectedSample] = useState(SAMPLES[0]);
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'original'

  const steps = [
    { title: '1. Fundus Capture', icon: Eye, desc: 'High-res image ingestion' },
    { title: '2. Neural Inference', icon: Cpu, desc: 'Feature map extraction' },
    { title: '3. Grad-CAM Overlay', icon: Layers, desc: 'Explainable visual evidence' },
    { title: '4. Clinical Review', icon: FileText, desc: 'Doctor verified treatment plan' }
  ];

  // Auto-progress video playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
      {/* Video Bar Header */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Interactive Pipeline Simulation</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 text-[11px] font-mono border border-teal-700/50">LIVE DEMO</span>
            </h3>
            <p className="text-xs text-slate-400">Step through the end-to-end explainable AI screening workflow</p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title={isPlaying ? "Pause automated demo" : "Play automated demo"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
            <span>{isPlaying ? 'Pause' : 'Play Walkthrough'}</span>
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(true); }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Restart simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progress Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800 bg-slate-950/40">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => { setActiveStep(idx); setIsPlaying(false); }}
              className={`px-4 py-3 text-left transition-all relative flex items-center space-x-3 cursor-pointer ${
                isActive
                  ? 'bg-teal-950/40 text-teal-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{step.title}</div>
                <div className="text-[11px] text-slate-400 hidden sm:block">{step.desc}</div>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-sky-400"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport */}
      <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Retinal Canvas / Heatmap Display */}
        <div className="lg:col-span-7">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-700 bg-black shadow-inner flex items-center justify-center group">
            {/* SVG Visual Retinal Fundus Simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
                <defs>
                  {/* Fundus eyeball gradient */}
                  <radialGradient id="fundusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#871a10" />
                    <stop offset="60%" stopColor="#4d0904" />
                    <stop offset="100%" stopColor="#150201" />
                  </radialGradient>

                  {/* Optic Disc */}
                  <radialGradient id="opticDisc" cx="45%" cy="45%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </radialGradient>

                  {/* Grad-CAM Heatmap Radial */}
                  <radialGradient id="heatmapThermal" cx="60%" cy="55%" r="45%">
                    <stop offset="0%" stopColor="rgba(239, 68, 68, 0.88)" />
                    <stop offset="35%" stopColor="rgba(249, 115, 22, 0.75)" />
                    <stop offset="65%" stopColor="rgba(234, 179, 8, 0.55)" />
                    <stop offset="85%" stopColor="rgba(14, 165, 233, 0.35)" />
                    <stop offset="100%" stopColor="rgba(2, 132, 199, 0.0)" />
                  </radialGradient>

                  <filter id="blurFilter">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>

                {/* Eyeball Fundus Base */}
                <circle cx="200" cy="150" r="140" fill="url(#fundusGrad)" />

                {/* Optic Disc (Nasal side) */}
                <circle cx="140" cy="150" r="24" fill="url(#opticDisc)" opacity="0.9" />
                <circle cx="140" cy="150" r="12" fill="#fffbeb" opacity="0.8" />

                {/* Retinal Blood Vessels (Arcades) */}
                <path d="M 140 150 Q 150 100, 220 80 T 310 95" fill="none" stroke="#2b0200" strokeWidth="4.5" opacity="0.85" />
                <path d="M 140 150 Q 180 90, 260 70 T 330 85" fill="none" stroke="#991b1b" strokeWidth="2.5" opacity="0.9" />
                <path d="M 140 150 Q 160 200, 230 220 T 320 205" fill="none" stroke="#2b0200" strokeWidth="4.5" opacity="0.85" />
                <path d="M 140 150 Q 190 210, 270 230 T 340 215" fill="none" stroke="#991b1b" strokeWidth="2.5" opacity="0.9" />
                <path d="M 140 150 Q 120 120, 90 90" fill="none" stroke="#7f1d1d" strokeWidth="2.5" opacity="0.8" />
                <path d="M 140 150 Q 110 180, 85 210" fill="none" stroke="#7f1d1d" strokeWidth="2.5" opacity="0.8" />

                {/* Macular Center */}
                <circle cx="250" cy="150" r="16" fill="#2d0502" opacity="0.85" />
                <circle cx="250" cy="150" r="4" fill="#fbbf24" opacity="0.6" />

                {/* Phase 3 & 4 or user toggled heatmap: Show Grad-CAM Overlay */}
                {(activeStep >= 2 || viewMode === 'heatmap') && (
                  <g filter="url(#blurFilter)">
                    {selectedSample.id === 'dr' && (
                      <>
                        <circle cx="240" cy="130" r="55" fill="url(#heatmapThermal)" />
                        <circle cx="270" cy="160" r="45" fill="url(#heatmapThermal)" opacity="0.85" />
                      </>
                    )}
                    {selectedSample.id === 'glaucoma' && (
                      <circle cx="140" cy="150" r="58" fill="url(#heatmapThermal)" />
                    )}
                    {selectedSample.id === 'normal' && (
                      <circle cx="200" cy="150" r="60" fill="rgba(16, 185, 129, 0.45)" />
                    )}
                  </g>
                )}

                {/* Phase 2: Neural Scan Line */}
                {activeStep === 1 && (
                  <g>
                    <line x1="60" y1="0" x2="60" y2="300" stroke="#38bdf8" strokeWidth="3" opacity="0.8">
                      <animate attributeName="x1" from="70" to="330" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="x2" from="70" to="330" dur="2s" repeatCount="indefinite" />
                    </line>
                    <rect x="0" y="0" width="400" height="300" fill="#0284c7" opacity="0.08" />
                  </g>
                )}
              </svg>
            </div>

            {/* Overlaid Annotation Chips */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-mono text-teal-300 border border-white/10">
                ResNet50 + Grad-CAM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-mono text-slate-300 border border-white/10">
                Resolution: 512x512
              </span>
            </div>

            {/* Scan Phase Badge in Viewport */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
                {activeStep === 0 && 'Phase 1: Raw Fundus Photograph Ingested'}
                {activeStep === 1 && 'Phase 2: Neural Feature Maps Extracting...'}
                {activeStep === 2 && 'Phase 3: Grad-CAM Explainable Heatmap Active'}
                {activeStep === 3 && 'Phase 4: Clinical Diagnostic Confirmation'}
              </div>

              {/* Toggle Heatmap button */}
              <button
                onClick={() => setViewMode(viewMode === 'heatmap' ? 'original' : 'heatmap')}
                className="pointer-events-auto px-3 py-1.5 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
              >
                {viewMode === 'heatmap' ? 'Hide Heatmap' : 'Show Grad-CAM'}
              </button>
            </div>
          </div>

          {/* Sample Switcher */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Select Test Pathology:</span>
            <div className="flex gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSample(s)}
                  className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    selectedSample.id === s.id
                      ? 'bg-teal-900/50 border-teal-500 text-teal-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Diagnostic Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Diagnostic Class</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold bg-gradient-to-r ${selectedSample.color} text-white`}>
                {selectedSample.confidence} Confidence
              </span>
            </div>
            <h4 className="text-xl font-bold text-white mb-1">{selectedSample.title}</h4>
            <p className="text-xs text-teal-400 font-medium mb-3">{selectedSample.tag}</p>
            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
              {selectedSample.findings}
            </p>
          </div>

          {/* Attention Mapping Details */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>Primary Attention Anchor:</span>
              <span className="text-slate-200 font-semibold">{selectedSample.primaryAttention}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Heatmap Distribution:</span>
              <span className="text-teal-400 font-mono">Jet Color Normalized</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Inference Latency:</span>
              <span className="text-slate-200 font-mono">180ms</span>
            </div>
          </div>

          {/* Doctor Verification Card */}
          <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 text-xs">
            <div className="flex items-center space-x-2 text-teal-300 font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Attending Ophthalmologist Note</span>
            </div>
            <p className="text-slate-300 italic mb-2">"{selectedSample.doctorNote}"</p>
            <div className="text-[11px] text-teal-400 font-medium">Verified by Dr. Ahmed Khan, Vitreoretinal Specialist</div>
          </div>
        </div>
      </div>
    </div>
  );
}
