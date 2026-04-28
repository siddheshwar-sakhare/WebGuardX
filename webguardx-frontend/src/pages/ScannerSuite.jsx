import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ZapScan from "./ZapScan";
import NmapScan from "./NmapScan";
import ApiSecurityScan from "./ApiSecurityScan";
import SslScan from "./SslScan";
import { Shield, Zap, Network, Server, Lock } from "lucide-react";

const ScannerSuite = () => {
  const [activeSection, setActiveSection] = useState("zap");

  const sections = [
    { id: "zap", title: "ZAP Scan", icon: <Zap className="w-5 h-5" /> },
    { id: "nmap", title: "Network Scan", icon: <Network className="w-5 h-5" /> },
    { id: "api", title: "API Scan", icon: <Server className="w-5 h-5" /> },
    { id: "ssl", title: "SSL Analyzer", icon: <Lock className="w-5 h-5" /> },
  ];

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 100; // Account for Navbar
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full pt-24 px-4 sm:px-6 lg:px-8 gap-8 pb-20 relative">
        {/* SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Tools Suite
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === section.id
                      ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className={activeSection === section.id ? "text-indigo-600" : "text-slate-400"}>
                    {section.icon}
                  </div>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 space-y-16 lg:space-y-24 w-full max-w-4xl">
          <section id="zap" className="scroll-mt-28">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">OWASP ZAP Scanner</h2>
              <p className="text-slate-500 text-sm mt-1">Deep web application vulnerability analysis.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-6">
              <ZapScan isEmbedded={true} />
            </div>
          </section>

          <div className="border-t border-slate-200"></div>

          <section id="nmap" className="scroll-mt-28">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Infrastructure Port Scan</h2>
              <p className="text-slate-500 text-sm mt-1">Map your attack surface using Nmap.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-6">
              <NmapScan isEmbedded={true} />
            </div>
          </section>

          <div className="border-t border-slate-200"></div>

          <section id="api" className="scroll-mt-28">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">API Security Scanner</h2>
              <p className="text-slate-500 text-sm mt-1">Dynamically discover and test OpenAPI endpoints.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-6">
              <ApiSecurityScan isEmbedded={true} />
            </div>
          </section>

          <div className="border-t border-slate-200"></div>

          <section id="ssl" className="scroll-mt-28">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">SSL/TLS Deep Analyzer</h2>
              <p className="text-slate-500 text-sm mt-1">Evaluate SSL chains, ciphers, and HSTS headers.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-6">
              <SslScan isEmbedded={true} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ScannerSuite;
