import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Search, Activity, CheckCircle, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen bg-darkBg text-gray-200 selection:bg-neonBlue selection:text-white font-sans pb-20">
      <Navbar />

      <div className="pt-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* HEADER */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-darkCard/80 border border-gray-700 rounded-full shadow-lg">
              <Zap className="w-5 h-5 text-neonBlue" />
              <span className="text-sm font-semibold tracking-wider text-gray-300">OWASP ZAP SCANNER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPurple">Vulnerability</span> Scan
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Initiate a deep comprehensive analysis of your web application to uncover critical security flaws before attackers do.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-darkCard/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(30,41,59,0.5)] border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonBlue/10 rounded-full blur-3xl"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Target URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-application.com"
                    className="w-full bg-gray-900/50 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neonBlue/50 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-2xl border border-gray-800 flex-1">
                <input
                  type="checkbox"
                  checked={activeScan}
                  onChange={() => setActiveScan(!activeScan)}
                  className="w-5 h-5 accent-neonRed bg-gray-800 border-gray-700 rounded"
                />
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium">Enable Active Scan</span>
                  <span className="text-xs text-red-400">Intrusive testing (Use only on authorized domains)</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={startScan}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-neonBlue to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Activity className="w-6 h-6 animate-pulse" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-6 h-6" />
                      Run Now
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
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-darkCard/80 border border-neonPurple text-neonPurple font-bold text-lg hover:bg-neonPurple/10 hover:shadow-[0_0_20px_rgba(192,132,252,0.4)] transition-all duration-300"
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
                  <div className="bg-darkCard p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-red-500">{result.results.filter(r => r.risk === "High").length}</span>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">High Risk</span>
                  </div>
                  <div className="bg-darkCard p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-yellow-500">{result.results.filter(r => r.risk === "Medium").length}</span>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Medium Risk</span>
                  </div>
                  <div className="bg-darkCard p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-green-400">{result.results.filter(r => r.risk === "Low").length}</span>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Low Risk</span>
                  </div>
                </div>

                {/* VULNERABILITIES */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="text-neonGreen w-6 h-6" /> Scan Findings
                  </h3>
                  
                  {result.results.slice(0, visibleCount).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-darkCard/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800 space-y-4 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-gray-100 pr-4">{item.testName}</h4>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                          item.risk === "High" ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                          item.risk === "Medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
                          item.risk === "Low" ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                          "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                        }`}>
                          {item.risk}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
                        {item.description}
                      </p>

                      <div className="bg-blue-900/10 p-4 rounded-xl text-sm text-blue-200 border border-blue-800/30">
                        <strong className="text-neonBlue">Solution / Recommendation:</strong> 
                        <div className="mt-1 opacity-90">{item.solution}</div>
                      </div>

                      <div className="flex items-center pt-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-neonPurple hover:text-white transition-colors"
                        >
                          → View Affected Parameter/Resource
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  {visibleCount < result.results.length && (
                    <div className="text-center pt-6">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
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
