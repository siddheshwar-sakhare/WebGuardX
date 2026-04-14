import React, { useState } from 'react';
import { Shield, Zap, Lock, FileSearch, ChevronDown, ArrowRight, Eye, CheckCircle } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import FAQ from "../components/FAQ";

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      number: "01",
      title: "Login Securely",
      description: "Authenticate with Google OAuth for secure, hassle-free access to your dashboard.",
      color: "red"
    },
    {
      number: "02",
      title: "Scan Website",
      description: "Enter your URL and let OWASP ZAP engine perform comprehensive vulnerability analysis.",
      color: "blue"
    },
    {
      number: "03",
      title: "View Security Report",
      description: "Get detailed insights with severity ratings, exploit details, and fix recommendations.",
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-darkBg text-gray-200 overflow-hidden pt-24 font-sans selection:bg-neonBlue selection:text-white">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-neonRed/10 via-transparent to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-neonBlue/10 via-transparent to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-neonPurple/10 to-neonBlue/10 opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fadeInUp">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-darkCard/50 backdrop-blur-md rounded-full border border-gray-800">
                  <Shield className="w-4 h-4 text-neonRed" />
                  <span className="text-sm font-semibold text-gray-300 tracking-wide">ENTERPRISE SECURITY PLATFORM</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                  <span className="text-white">
                    Protect Your Web
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonRed to-neonBlue">
                    Applications
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl font-light">
                  Advanced vulnerability scanning powered by <span className="font-semibold text-white">OWASP ZAP</span>. 
                  Identify security threats, receive actionable insights, and fortify your digital infrastructure with confidence.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="group px-8 py-4 bg-gradient-to-r from-neonRed to-red-700 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(248,113,113,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                    Start Scanning
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 bg-darkCard/80 backdrop-blur-md text-white font-semibold rounded-xl border border-gray-700 hover:border-neonBlue hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    View Dashboard
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 pt-8 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neonGreen" />
                    <span className="text-sm text-gray-400 font-medium">OWASP Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neonGreen" />
                    <span className="text-sm text-gray-400 font-medium">SOC 2 Certified</span>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="relative lg:block hidden">
                <div className="relative z-10 bg-darkCard/50 backdrop-blur-xl p-12 rounded-3xl border border-gray-800 shadow-2xl">
                  <div className="space-y-6">
                    {/* Shield Illustration */}
                    <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-neonRed to-neonBlue rounded-full opacity-20 blur-2xl animate-pulse"></div>
                      <Shield className="w-48 h-48 text-transparent stroke-neonRed stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" />
                      <Lock className="absolute w-24 h-24 text-neonBlue" />
                    </div>
                    
                    {/* Code Lines */}
                    <div className="space-y-3 bg-[#0a0f1c] p-6 rounded-xl font-mono text-xs border border-gray-800 shadow-inner">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-neonGreen">$ webguardx scan --url https://example.com</div>
                      <div className="text-neonBlue">→ Initializing OWASP ZAP engine...</div>
                      <div className="text-yellow-400">→ Scanning for vulnerabilities...</div>
                      <div className="text-neonGreen">✓ Scan complete: 0 high-risk issues found</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto border-t border-gray-800 pt-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Security in Three Simple Steps
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                From authentication to actionable insights in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-darkCard/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-gray-600 hover:-translate-y-2 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-black text-2xl mb-6 ${
                      step.color === 'red'
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    }`}>
                      {step.number}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
   
        <Footer />
      </div>
    </div>
  );
};

export default Home;