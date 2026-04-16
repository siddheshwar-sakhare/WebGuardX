import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What exactly is WebGuardX?",
      answer: "WebGuardX is an enterprise-grade platform that automates Dynamic Application Security Testing (DAST). By wrapping the powerful OWASP ZAP engine in a modern React & Spring Boot architecture, it provides deep security analysis and reporting without the massive learning curve."
    },
    {
      question: "How does the scanning engine work?",
      answer: "When a target URL is submitted, the backend proxies the request to our isolated OWASP ZAP instances. It performs active spidering to map the application surface, followed by active scanning which injects payloads to test for XSS, SQLi, CSRF, and hundreds of other vulnerabilities."
    },
    {
      question: "Is my authentication data secure?",
      answer: "Yes. WebGuardX delegates primary authentication to Google Identity Services via OAuth 2.0. Internal platform sessions are managed using hardened JWTs with strict expiration policies, meaning we never store raw passwords."
    },
    {
      question: "Can I export scan reports for compliance?",
      answer: "Absolutely. Scan histories are securely retained, and you can delve into each vulnerability, exporting the findings in various formats suitable for compliance audits (like SOC2) and developer remediation tracking."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Answers to your questions
          </h2>
          <p className="text-lg text-slate-500">
            Learn the technical details behind WebGuardX security scanning.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-base font-semibold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    openFaq === index ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-slate-500 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Still have questions?</h3>
              <p className="text-slate-500 text-sm mt-1">Our engineering team is happy to assist you.</p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQ;