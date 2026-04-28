import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Shield, Loader2, AlertTriangle, CheckCircle, Search, Server } from "lucide-react";

const ApiSecurityScan = ({ isEmbedded = false }) => {
  const [docsUrl, setDocsUrl] = useState("http://localhost:8080/v3/api-docs");
  const [baseUrl, setBaseUrl] = useState("http://localhost:8080");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startScan = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("http://localhost:8080/api/apiguard/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docsUrl, baseUrl }),
      });

      if (!response.ok) {
        throw new Error("Scan failed. Ensure OpenAPI URL is valid.");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "CRITICAL": return "bg-red-100 text-red-800 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className={!isEmbedded ? "min-h-screen bg-slate-50 text-slate-900 font-sans" : "w-full font-sans"}>
      {!isEmbedded && <Navbar />}
      <div className={!isEmbedded ? "pt-28 px-6 pb-12 max-w-7xl mx-auto space-y-8 animate-fade-in" : "pt-8 relative z-10 animate-fade-in"}>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                API Security Scanner
              </h1>
              <p className="text-slate-500 mt-1 max-w-xl text-sm leading-relaxed text-balance">
                Dynamically discover and test your OpenAPI endpoints for Broken Authentication, Data Exposure, and Missing Rate Limits.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-lg text-slate-800">Target Configuration</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">OpenAPI JSON URL</label>
                <input
                  type="text"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                  placeholder="http://localhost:8080/v3/api-docs"
                />
                <p className="text-xs text-slate-500">The endpoint serving your Swagger/OpenAPI JSON specification.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Target Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                  placeholder="http://localhost:8080"
                />
                <p className="text-xs text-slate-500">The root URL for making API requests.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={startScan}
                disabled={loading || !docsUrl || !baseUrl}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Security Checks...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Start API Scan
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3 mt-4">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-6 mt-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Scan Results</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200 ml-auto">
                {results.length} Endpoints Analysed
              </span>
            </div>

            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wider ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLevel}
                      </div>
                      <div className="font-mono text-slate-700 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        {result.endpoint}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Auth</span>
                        {result.brokenAuth ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Data Leak</span>
                        {result.dataExposure ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rate Limit</span>
                        {!result.rateLimited ? (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiSecurityScan;
