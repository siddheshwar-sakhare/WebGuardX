import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Lock, Activity, ShieldCheck, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SslScan = ({ isEmbedded = false }) => {
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState(443);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startScan = async () => {
    if (!hostname) {
      setError("Hostname is required");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const res = await api.post("/api/ssl/analyze", { hostname, port: Number(port) });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Scan failed. Ensure the host is reachable and serving SSL/TLS.");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (grade === "A-")                  return "text-teal-600 bg-teal-50 border-teal-200";
    if (grade === "B")                   return "text-blue-500 bg-blue-50 border-blue-200";
    if (grade === "C")                   return "text-amber-500 bg-amber-50 border-amber-200";
    if (grade === "F")                   return "text-red-600 bg-red-50 border-red-200";
    if (grade === "INVALID_CERT")        return "text-orange-600 bg-orange-50 border-orange-200";
    if (grade === "EXPIRED_CERT")        return "text-red-700 bg-red-50 border-red-200";
    if (grade === "SELF_SIGNED")         return "text-amber-700 bg-amber-50 border-amber-200";
    if (grade === "NO_HTTPS")            return "text-slate-500 bg-slate-100 border-slate-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const getGradeLabel = (grade) => {
    const labels = {
      "A+": "Excellent", "A": "Good", "A-": "Good",
      "B": "Fair", "C": "Weak", "F": "Failing",
      "INVALID_CERT": "Invalid Cert",
      "EXPIRED_CERT": "Expired Cert",
      "SELF_SIGNED":  "Self-Signed",
      "NO_HTTPS":     "No HTTPS",
    };
    return labels[grade] ?? grade;
  };

  return (
    <div className={!isEmbedded ? "min-h-screen bg-slate-50 text-slate-900 font-sans pb-20" : "w-full font-sans"}>
      {!isEmbedded && <Navbar />}

      <div className={!isEmbedded ? "pt-32 px-6 relative z-10 animate-fade-in" : "pt-8 relative z-10 animate-fade-in"}>
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* HEADER */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-700">Cryptography Scan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              SSL/TLS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Deep Analyzer</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Evaluate SSL certificate chains, cipher suite strengths, and secure transport headers to ensure robust encryption.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Target Hostname</label>
                  <input
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    placeholder="e.g. your-application.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Port</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="443"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{typeof error === 'string' ? error : JSON.stringify(error)}</span>
                </div>
              )}

              <button
                onClick={startScan}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 text-white font-medium text-lg hover:bg-slate-800 disabled:opacity-70 transition-all shadow-sm"
              >
                {loading ? (
                  <>
                    <Activity className="w-6 h-6 animate-spin-slow" />
                    Probing SSL/TLS...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    Launch Deep Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RESULT */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className={`col-span-2 md:col-span-1 p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center ${getGradeColor(result.grade)}`}>
                    <span className="text-4xl font-black drop-shadow-sm leading-tight">{result.grade}</span>
                    <span className="text-xs font-bold uppercase tracking-widest mt-1 opacity-70">{getGradeLabel(result.grade)}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-50">Overall Grade</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-3xl font-black text-slate-800">{result.score}/100</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Security Score</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-3xl font-black text-slate-800">{result.chain?.length || 0}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Certs in Chain</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-3xl font-black text-slate-800">{result.ciphers?.length || 0}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Ciphers Supported</span>
                  </div>
                  {/* CT Log Status */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                    {result.ctLogStatus === "LOGGED" && (
                      <span className="text-emerald-600 text-2xl font-black">✓ Logged</span>
                    )}
                    {result.ctLogStatus === "NOT_FOUND" && (
                      <span className="text-red-600 text-2xl font-black">✗ Missing</span>
                    )}
                    {(result.ctLogStatus === "UNAVAILABLE" || !result.ctLogStatus) && (
                      <span className="text-amber-500 text-2xl font-black">? Unknown</span>
                    )}
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">CT Log Status</span>
                  </div>
                </div>

                {/* WARNINGS */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2 mb-4">
                      <ShieldAlert className="w-5 h-5" /> Security Warnings
                    </h3>
                    <ul className="space-y-2">
                      {result.warnings.map((warn, i) => (
                        <li key={i} className="flex items-start gap-2 text-rose-700 text-sm font-medium">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CERTIFICATE CHAIN */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-lg text-slate-800">Certificate Chain</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Subject</th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Issuer</th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Valid Until</th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Days Left</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.chain?.map((cert, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-slate-900 break-all max-w-[200px]">
                              {cert.subject}
                              {cert.isSelfSigned && <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] uppercase font-bold">Self Signed</span>}
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600 break-all max-w-[200px]">{cert.issuer}</td>
                            <td className="py-4 px-6 text-sm text-slate-600">{new Date(cert.notAfter).toLocaleDateString()}</td>
                            <td className={`py-4 px-6 text-sm font-bold text-right ${cert.daysRemaining < 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                              {cert.daysRemaining}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CIPHER SUITES */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-lg text-slate-800">Supported Cipher Suites</h2>
                  </div>
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                        <tr className="border-b border-slate-200">
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Cipher Name</th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Protocol</th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.ciphers?.map((cipher, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-6 text-sm font-mono text-slate-700">{cipher.name}</td>
                            <td className="py-3 px-6 text-sm text-slate-500 font-medium">{cipher.protocol}</td>
                            <td className="py-3 px-6">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase ${
                                cipher.grade === 'SECURE' ? 'bg-emerald-100 text-emerald-700' :
                                cipher.grade === 'WEAK' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {cipher.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SslScan;
