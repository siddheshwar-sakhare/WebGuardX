import React, { useEffect, useState } from 'react';
import { Shield, Lock, Activity, Target, CheckCircle2, ChevronRight, FileCode2 } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import FAQ from "../components/FAQ";

const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Background Decorative Mesh - Clean & Professional */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
        {/* Soft top gradient */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent"></div>
        {/* Subtle glow spots */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-50/40 blur-[100px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-50/40 blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 xl:px-0 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
              
              {/* Left Content */}
              <div className={`flex-1 space-y-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Enterprise Class Security</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                  Secure your apps <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                    with confidence.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                  WebGuardX provides deep vulnerability scanning using the powerful OWASP ZAP engine. Detect threats, analyze risks, and ship secure code faster.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Start Free Scan
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    View Enterprise Demo
                  </button>
                </div>

                <div className="pt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> SOC2 Compliant
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> OAuth 2.0 Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> API Access
                  </div>
                </div>
              </div>

              {/* Right Illustration - Clean Dashboard Window */}
              <div className={`flex-1 w-full max-w-2xl mx-auto ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="relative animate-float rounded-2xl bg-white border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
                  
                  {/* MacOS Style Header */}
                  <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="mx-auto bg-white border border-slate-200 rounded-md px-24 py-1 text-xs text-slate-400 font-medium flex items-center gap-2 shadow-sm">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      scanner.webguardx.io
                    </div>
                  </div>
                  
                  {/* Clean Dashboard Content */}
                  <div className="p-8 bg-white space-y-6">
                    {/* Status Target Card */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <Target className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Target</p>
                          <p className="font-medium text-slate-900">api.production-env.com</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Scanning
                      </div>
                    </div>

                    {/* Progress Area */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Active Scan Progress</span>
                        <span className="text-slate-900 font-semibold">68%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-2 rounded-full w-[68%] transition-all duration-1000 ease-in-out relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                        </div>
                      </div>
                    </div>

                    {/* Vulnerabilities Detected */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                        <p className="text-red-600 text-2xl font-bold">2</p>
                        <p className="text-xs font-medium text-red-600 uppercase tracking-wide mt-1">High Risk</p>
                      </div>
                      <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                        <p className="text-amber-600 text-2xl font-bold">14</p>
                        <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mt-1">Medium Risk</p>
                      </div>
                    </div>

                    {/* Terminal execution log mimic */}
                    <div className="rounded-lg bg-slate-900 p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <div className="text-slate-400 space-y-1">
                        <p><span className="text-emerald-400">→</span> Injecting payload modules...</p>
                        <p><span className="text-emerald-400">→</span> Testing SQLi constraints... <span className="text-white">[SAFE]</span></p>
                        <p><span className="text-sky-400 opacity-70">Running DOM XSS analyzer on /login branch</span></p>
                        <p className="text-amber-400">! Warning: Missing CSP header detected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Flow */}
        <section className="bg-slate-50 py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Automated security from commit to deploy
              </h2>
              <p className="text-slate-500 text-lg">
                We've abstracted the complexity of enterprise security testing into three simple, manageable stages. No security expertise required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Authenticate Securely", desc: "Connect instantly with Enterprise SSO or Google OAuth 2.0 to access your isolated workspace.", icon: <Lock className="w-6 h-6" /> },
                { title: "Execute Scans", desc: "Define your targets. We automatically map endpoints and execute deep OWASP-compliant active scans.", icon: <Activity className="w-6 h-6" /> },
                { title: "Analyze & Remediate", desc: "Receive beautifully formatted reports highlighting vulnerabilities alongside specific code remediation steps.", icon: <FileCode2 className="w-6 h-6" /> }
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Features />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Home;