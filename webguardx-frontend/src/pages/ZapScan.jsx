import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Search, Activity, CheckCircle, AlertTriangle, Globe } from "lucide-react";

const ZapScan = () => {
  const [url, setUrl] = useState("");
  const [activeScan, setActiveScan] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const startScan = async () => {
    if (!url) {
      setError("Target URL is required");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const res = await api.post("/api/zap/scan", { url, activeScan });
      setResult(res.data);
      setVisibleCount(5);
    } catch (err) {
      setError("Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-20">
      <Navbar />

      <div className="pt-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* HEADER */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase">OWASP ZAP SCANNER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Vulnerability</span> Scan
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Initiate a deep comprehensive analysis of your web application to uncover critical security flaws before attackers do.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Target URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-application.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                <input
                  type="checkbox"
                  checked={activeScan}
                  onChange={() => setActiveScan(!activeScan)}
                  className="w-5 h-5 accent-indigo-600 bg-white border-slate-300 rounded cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold">Enable Active Scan</span>
                  <span className="text-xs text-slate-500 font-medium">Warning: Intrusive testing (Use only on authorized domains)</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={startScan}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 text-white font-medium text-lg hover:bg-slate-800 disabled:opacity-70 transition-all shadow-sm"
                >
                  {loading ? (
                    <>
                      <Activity className="w-6 h-6 animate-spin-slow" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-6 h-6" />
                      Execute DAST Scan
                    </>
                  )}
                </button>
                <button
                  onClick={async () => {
                    if (!url) { setError("Target URL is required"); return; }
                    try {
                      await api.post("/api/zap/schedule", { url, activeScan, scheduleType: "DAILY" });
                      alert("Scan scheduled successfully! Will run daily in the background.");
                    } catch (e) { setError("Failed to schedule."); }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-lg hover:bg-indigo-50 transition-all"
                >
                  Schedule Daily
                </button>
              </div>
            </div>
          </motion.div>

          {/* RESULT */}
          <AnimatePresence>
            {result && result.results && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* SUMMARY */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-red-500 drop-shadow-sm">{result.results.filter(r => r.risk === "High").length}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">High Risk</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-amber-500 drop-shadow-sm">{result.results.filter(r => r.risk === "Medium").length}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Medium Risk</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-emerald-500 drop-shadow-sm">{result.results.filter(r => r.risk === "Low").length}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Low Risk</span>
                  </div>
                </div>

                {/* VULNERABILITIES */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
                    <CheckCircle className="text-emerald-500 w-6 h-6" /> Scan Findings
                  </h3>
                  
                  {result.results.slice(0, visibleCount).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <h4 className="font-bold text-lg text-slate-900">{item.testName}</h4>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                          item.risk === "High" ? "bg-red-50 text-red-700 border border-red-200" :
                          item.risk === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          item.risk === "Low" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}>
                          {item.risk}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                        {item.description}
                      </p>

                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-sm text-slate-700">
                        <strong className="text-slate-900 block mb-1">Recommendation:</strong> 
                        <div className="leading-relaxed whitespace-pre-wrap">{item.solution}</div>
                      </div>

                      <div className="flex items-center pt-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                        >
                          View Affected Resource &rarr;
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  {visibleCount < result.results.length && (
                    <div className="text-center pt-6">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="px-6 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Load More Findings
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ZapScan;
