import { Link } from 'react-router-dom';
import { Eye, Shield, Zap, Users, Clock, Award, Activity, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Analysis',
      description: 'Get instant diagnostic results powered by state-of-the-art deep learning models',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: Shield,
      title: '94% Accuracy',
      description: 'Our AI models achieve 94% accuracy validated on thousands of eye images',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Expert Review',
      description: 'Certified ophthalmologists review all predictions for quality assurance',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Access eye screening anytime, anywhere from the comfort of your home',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const diseases = [
    { name: 'Diabetic Retinopathy', color: 'from-red-500 to-pink-600', icon: '⚠️' },
    { name: 'Glaucoma', color: 'from-purple-500 to-violet-600', icon: '🔴' },
    { name: 'Cataract', color: 'from-blue-500 to-cyan-600', icon: '☁️' },
    { name: 'Myopia', color: 'from-yellow-500 to-orange-600', icon: '👁️' },
    { name: 'Normal', color: 'from-green-500 to-emerald-600', icon: '✓' }
  ];

  const steps = [
    { num: '01', title: 'Upload Image', desc: 'Upload a clear fundus photograph of your eye' },
    { num: '02', title: 'AI Analysis', desc: 'Our AI analyzes the image in seconds' },
    { num: '03', title: 'Get Results', desc: 'Receive detailed diagnosis with confidence scores' },
    { num: '04', title: 'Expert Review', desc: 'Optionally send to a doctor for verification' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full border border-sky-500/30 mb-8">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="text-sky-300 text-sm font-medium">AI-Powered Healthcare Technology</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Smart Eye Disease</span>
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Detection System
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                Early detection saves sight. Our advanced AI system identifies eye diseases from 
                fundus images with <span className="text-sky-400 font-semibold">94% accuracy</span>, 
                helping you get the care you need faster.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-1 transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-gray-600 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-gray-500 transition-all"
                >
                  <span>Learn More</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-8 mt-12 pt-8 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">FDA Registered</span>
                </div>
              </div>
            </div>
            
            {/* Right - Hero Card */}
            <div className="relative z-10 hidden lg:block">
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur-xl opacity-30"></div>
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                  {/* Eye Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-full">
                        <Eye className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 text-sm font-medium">AI Analysis Complete</span>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Diagnosis</span>
                        <span className="text-red-400 font-bold">Diabetic Retinopathy</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-sky-400 font-bold">94.2%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Normal</p>
                        <p className="text-sm font-bold text-gray-400">12.3%</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Disease</p>
                        <p className="text-sm font-bold text-red-400">87.7%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '94%', label: 'Detection Accuracy', color: 'text-sky-600' },
              { value: '10K+', label: 'Images Analyzed', color: 'text-blue-600' },
              { value: '5', label: 'Disease Classes', color: 'text-purple-600' },
              { value: '24/7', label: 'Always Available', color: 'text-green-600' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-5xl lg:text-6xl font-bold mb-3 ${stat.color} group-hover:scale-105 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your eye disease screening in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-sky-200 to-transparent -translate-x-1/2"></div>
                )}
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="text-5xl font-bold bg-gradient-to-br from-sky-100 to-blue-100 bg-clip-text text-transparent mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Comprehensive Coverage</span>
              <h2 className="text-4xl lg:text-5xl font-bold mt-3 mb-6">
                Detects Multiple<br />
                <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Eye Conditions</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Our AI model is trained to identify five major eye conditions from fundus photographs, 
                helping in early detection and timely treatment.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-3 text-sky-400 font-semibold hover:text-sky-300 transition-colors"
              >
                <span>Start your free screening</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {diseases.map((disease, index) => (
                <div 
                  key={index}
                  className="group flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-sky-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${disease.color} rounded-xl flex items-center justify-center text-xl`}>
                      {disease.icon}
                    </div>
                    <span className="text-lg font-semibold">{disease.name}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 relative overflow-hidden">
        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <Award className="w-20 h-20 mx-auto mb-8 opacity-90" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Take Control of<br />Your Eye Health?
          </h2>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust AI-Powered Eye Care for early disease detection. 
            It's free, fast, and can potentially save your vision.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <Heart className="h-6 w-6" />
            <span>Start Free Screening Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;