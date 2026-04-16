import React from "react";
import { Shield, Zap, Database, Lock, Search, AlertOctagon } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Automated DAST Scanning",
      desc: "Fully integrated with OWASP ZAP to dynamically test and expose deep application flaws automatically.",
    },
    {
      icon: <AlertOctagon className="w-5 h-5" />,
      title: "Intelligent Risk Engine",
      desc: "Automatically maps CVEs and ranks vulnerabilities with precision to reduce noise and false positives.",
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Immutable Audit Logs",
      desc: "Store detailed execution histories securely in MongoDB, delivering compliance-ready reporting for regulators.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Enterprise Identity Guard",
      desc: "Google OAuth 2.0 with hardened JWT session management keeps your internal platform access strictly airtight.",
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Continuous Monitoring",
      desc: "Schedule recurring scans seamlessly to ensure new code deployments do not introduce massive security regressions.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "DevSecOps Integration",
      desc: "Export findings as structured JSON or CSV, integrating flawlessly into your existing CI/CD operational pipelines.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything you need to secure your infrastructure.
            </h2>
            <p className="text-lg text-slate-500">
              Engineered for absolute precision and built for fast-moving developers.
            </p>
          </div>
          <button className="whitespace-nowrap text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1">
            View all features <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
