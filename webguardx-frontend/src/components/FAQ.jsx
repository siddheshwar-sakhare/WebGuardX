import React, { useState } from 'react';
import { ChevronDown, Shield, Lock, Zap, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is WebGuardX?",
      answer: "WebGuardX is a comprehensive vulnerability scanning platform built with modern technologies including Spring Boot, React, MongoDB, and OWASP ZAP. It provides enterprise-grade security testing for web applications with real-time threat detection and detailed reporting.",
      icon: <Shield className="w-5 h-5" />,
      color: "blue"
    },
    {
      question: "How does scanning work?",
      answer: "The platform sends target URLs to the OWASP ZAP API, which performs comprehensive security testing including penetration testing, spider scanning, and active/passive vulnerability analysis. Results are analyzed, categorized by severity, and presented in an intuitive dashboard with actionable remediation steps.",
      icon: <Zap className="w-5 h-5" />,
      color: "red"
    },
    {
      question: "Is authentication secure?",
      answer: "Absolutely. We implement Google OAuth 2.0 for authentication and JWT (JSON Web Tokens) for secure session management. All data transmission is encrypted using industry-standard protocols, ensuring your credentials and scan data remain protected at all times.",
      icon: <Lock className="w-5 h-5" />,
      color: "blue"
    },
    {
      question: "Do I need technical knowledge to use WebGuardX?",
      answer: "No technical expertise required. Our platform is designed for both security professionals and non-technical users. The dashboard presents findings in clear, understandable language with visual severity indicators and step-by-step remediation guidance.",
      icon: <HelpCircle className="w-5 h-5" />,
      color: "red"
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-4">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700 tracking-wide">SUPPORT</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            Frequently Asked
            <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Everything you need to know about WebGuardX security platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 md:px-8 py-6 flex items-start md:items-center gap-4 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                  openFaq === index
                    ? faq.color === 'blue'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {faq.icon}
                </div>

                {/* Question Text */}
                <span className="flex-1 text-lg md:text-xl font-bold text-gray-900 pr-4">
                  {faq.question}
                </span>

                {/* Chevron */}
                <ChevronDown
                  className={`flex-shrink-0 w-6 h-6 transition-all duration-300 ${
                    openFaq === index 
                      ? 'rotate-180 ' + (faq.color === 'blue' ? 'text-blue-600' : 'text-red-600')
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
              </button>

              {/* Answer Panel */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-6 pt-2 pl-20 md:pl-24">
                  {/* Accent Line */}
                  <div className={`h-1 w-16 rounded-full mb-4 ${
                    faq.color === 'blue'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}></div>
                  
                  {/* Answer Text */}
                  <p className="text-gray-700 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Bottom Border Accent (only when open) */}
              {openFaq === index && (
                <div className={`h-1 w-full ${
                  faq.color === 'blue'
                    ? 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
                    : 'bg-gradient-to-r from-transparent via-red-500 to-transparent'
                } opacity-30`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-500/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Still have questions?
              </h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                Our security team is here to help. Get in touch and we'll answer any questions about WebGuardX.
              </p>
              <button className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;