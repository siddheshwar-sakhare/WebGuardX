import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="bg-gray-950 text-white min-h-screen">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="text-center py-24 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
//         <h1 className="text-5xl font-bold mb-6">
//           Secure Your Web Applications with WebGuardX
//         </h1>
//         <p className="text-lg text-gray-400 max-w-2xl mx-auto">
//           WebGuardX is a modern cybersecurity platform that integrates OWASP ZAP
//           to detect vulnerabilities in web applications and provide risk-based
//           analysis reports.
//         </p>

//         <Link
//           to="/login"
//           className="inline-block mt-8 bg-blue-600 px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
//         >
//           Start Scanning
//         </Link>
//       </section>

//       <Features />
//       <FAQ />
//       <Footer />
//     </div>
//   );
// };

// export default Home;


import React, { useState } from 'react';
import { Shield, Zap, Lock, FileSearch, ChevronDown, ArrowRight, Eye, CheckCircle } from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Vulnerability Scanning",
      description: "Continuous monitoring of your web applications with instant alerts for security threats and vulnerabilities.",
      color: "red"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "OWASP ZAP Integration",
      description: "Powered by industry-leading OWASP ZAP engine for comprehensive security testing and analysis.",
      color: "blue"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure JWT Authentication",
      description: "Enterprise-grade authentication with Google OAuth integration for seamless and secure access.",
      color: "red"
    },
    {
      icon: <FileSearch className="w-8 h-8" />,
      title: "Detailed Security Reports",
      description: "In-depth analysis with actionable insights, vulnerability rankings, and remediation guidelines.",
      color: "blue"
    }
  ];

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

  const faqs = [
    {
      question: "What is WebGuardX?",
      answer: "WebGuardX is a comprehensive web application security platform that leverages OWASP ZAP to scan websites for vulnerabilities, provide detailed security reports, and help developers and security teams protect their digital assets from potential threats."
    },
    {
      question: "How does vulnerability scanning work?",
      answer: "Our platform integrates with OWASP ZAP to perform automated security testing. It crawls your website, simulates various attack vectors, and identifies vulnerabilities like SQL injection, XSS, CSRF, and security misconfigurations. The entire process is automated and provides results in minutes."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard JWT authentication, encrypted data transmission, and secure Google OAuth integration. Your scan data is encrypted at rest and in transit, and we never store sensitive credentials or personal information beyond what's necessary for authentication."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "No technical expertise required! WebGuardX is designed for both security professionals and non-technical users. Our intuitive dashboard presents findings in clear language, with visual indicators and actionable recommendations that anyone can understand and implement."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden pt-24">
      {/* Background Effects */}
      <Navbar />
      <div className="fixed  inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-red-50 via-transparent to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-50 via-transparent to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-50/20 to-blue-50/20 opacity-30 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-blue-50 rounded-full border border-red-100">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700 tracking-wide">ENTERPRISE SECURITY PLATFORM</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Protect Your Web
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Applications
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl font-light">
                Advanced vulnerability scanning powered by <span className="font-semibold text-gray-900">OWASP ZAP</span>. 
                Identify security threats, receive actionable insights, and fortify your digital infrastructure with confidence.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 flex items-center gap-2">
                  Start Scanning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  View Dashboard
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 font-medium">OWASP Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 font-medium">SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 font-medium">GDPR Ready</span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative lg:block hidden">
              <div className="relative z-10 bg-gradient-to-br from-gray-50 to-white p-12 rounded-3xl border border-gray-200 shadow-2xl">
                <div className="space-y-6">
                  {/* Shield Illustration */}
                  <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-blue-600 rounded-full opacity-10 blur-2xl animate-pulse"></div>
                    <Shield className="w-48 h-48 text-transparent stroke-red-600 stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" />
                    <Lock className="absolute w-24 h-24 text-blue-600" />
                  </div>
                  
                  {/* Code Lines */}
                  <div className="space-y-3 bg-gray-900 p-6 rounded-xl font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-green-400">$ webguardx scan --url https://example.com</div>
                    <div className="text-blue-400">→ Initializing OWASP ZAP engine...</div>
                    <div className="text-yellow-400">→ Scanning for vulnerabilities...</div>
                    <div className="text-green-400">✓ Scan complete: 0 high-risk issues found</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full opacity-10 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
     <Features /> 

      {/* How It Works Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-black text-gray-900 tracking-tight">
              Security in Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              From authentication to actionable insights in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines - Desktop Only */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-blue-200 to-red-200 -z-10"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gray-200 hover:-translate-y-2">
                  {/* Number Badge */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-black text-2xl mb-6 ${
                    step.color === 'red'
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  }`}>
                    {step.number}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {step.description}
                  </p>

                  {/* Decorative Gradient */}
                  <div className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full opacity-10 blur-2xl ${
                    step.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
       <FAQ />
    <Footer />
        </div>
  );
};

export default Home;