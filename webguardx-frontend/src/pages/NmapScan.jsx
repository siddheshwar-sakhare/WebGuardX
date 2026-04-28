import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Server, Activity, AlertCircle, CheckCircle2, ChevronDown, Network, ShieldCheck, Sliders, ChevronUp } from "lucide-react";

const NmapScan = ({ isEmbedded = false }) => {
  const [target, setTarget] = useState("");
  const [scanProfile, setScanProfile] = useState("QUICK"); // QUICK, FULL, OS_DETECT, CUSTOM
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [features, setFeatures] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced Options state
  const [options, setOptions] = useState({
    osDetection: false,
    versionDetection: false,
    vulnerabilityScan: false,
    firewallEvasion: false,
    sslTest: false,
    bruteForceCheck: false,
    udpScan: false,
  });
  const [customPorts, setCustomPorts] = useState("");
  const [scanSpeed, setScanSpeed] = useState(3);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get('/api/nmap/features');
        if (res.data && res.data.features) {
          setFeatures(res.data.features);
        }
      } catch (err) {
        console.error("Failed to fetch Nmap features", err);
      }
    };
    fetchFeatures();
  }, []);

  const handleOptionChange = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startScan = async () => {
    if (!target) {
      setError("Target IP or URL is required");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const requestBody = {
        target: target,
        scanSpeed: Number(scanSpeed),
        quickScan: scanProfile === "QUICK",
        fullScan: scanProfile === "FULL",
        osDetection: scanProfile === "OS_DETECT" || options.osDetection,
        versionDetection: scanProfile === "OS_DETECT" || options.versionDetection,
        vulnerabilityScan: options.vulnerabilityScan,
        firewallEvasion: options.firewallEvasion,
        sslTest: options.sslTest,
        bruteForceCheck: options.bruteForceCheck,
        udpScan: options.udpScan,
        customPorts: customPorts
      };

      const res = await api.post("/api/nmap/scan", requestBody);
      
      if (res.data && res.data.status !== "ERROR") {
        const mappedResult = {
          host: res.data.target || target,
          state: res.data.hostInfo?.status || "up",
          osDetect: res.data.osInfo?.name || "Unknown",
          ports: [
            ...(res.data.openPorts || []),
            ...(res.data.filteredPorts || []),
            ...(res.data.closedPorts || [])
          ]
        };
        setResult(mappedResult);
      } else {
        setError(res.data?.message || "Scan failed on the server.");
      }
    } catch (err) {
      console.error(err);
      setError("Network or server error while scanning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={!isEmbedded ? "min-h-screen bg-slate-50 text-slate-900 font-sans pb-20" : "w-full font-sans"}>
      {!isEmbedded && <Navbar />}

      <div className={!isEmbedded ? "pt-32 px-6 relative z-10 animate-fade-in" : "pt-8 relative z-10 animate-fade-in"}>
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* HEADER */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
              <Network className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-700">Network Reconnaissance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">Port Scan</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Map your attack surface using Nmap. Discover open ports, running services, and operational systems.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Target Host or IP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Server className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 192.168.1.100 or application.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Base Profile</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "QUICK", title: "Quick Scan", desc: "Top 100 ports" },
                    { id: "FULL", title: "Full Scan", desc: "All 65535 ports" },
                    { id: "OS_DETECT", title: "OS & Services", desc: "Aggressive recon" },
                    { id: "CUSTOM", title: "Custom", desc: "Use options below" }
                  ].map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => setScanProfile(profile.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        scanProfile === profile.id 
                          ? "bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500 text-indigo-900" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-semibold">{profile.title}</div>
                      <div className={`text-xs mt-1 ${scanProfile === profile.id ? "text-indigo-700" : "text-slate-500"}`}>
                        {profile.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ADVANCED OPTIONS TOGGLE */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full p-4 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    Advanced Scan Configurations
                  </div>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                {showAdvanced && (
                  <div className="p-5 border-t border-slate-200 bg-white grid md:grid-cols-2 gap-6 pb-6 shadow-inner">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Target Options</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.osDetection} onChange={() => handleOptionChange("osDetection")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">OS Detection (-O)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.versionDetection} onChange={() => handleOptionChange("versionDetection")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Version Detection (-sV)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.udpScan} onChange={() => handleOptionChange("udpScan")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">UDP Scan (-sU)</span>
                        </label>
                        <div className="pt-2">
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Custom Ports (e.g. 80,443,8080)</label>
                          <input 
                            value={customPorts} 
                            onChange={(e) => setCustomPorts(e.target.value)} 
                            placeholder="Leave empty for default"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Evasion & Profiling</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.firewallEvasion} onChange={() => handleOptionChange("firewallEvasion")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Firewall Evasion (-f -D)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.vulnerabilityScan} onChange={() => handleOptionChange("vulnerabilityScan")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Vulnerability Scan (--script vuln)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.sslTest} onChange={() => handleOptionChange("sslTest")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">SSL Tests (--script ssl-enum-ciphers)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={options.bruteForceCheck} onChange={() => handleOptionChange("bruteForceCheck")} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Brute Force Checks</span>
                        </label>
                        <div className="pt-2">
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Scan Speed Timing (T{scanSpeed})</label>
                          <input 
                            type="range" 
                            min="1" max="5" 
                            value={scanSpeed} 
                            onChange={(e) => setScanSpeed(e.target.value)}
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold px-1">
                            <span>T1 (Sneaky)</span>
                            <span>T3 (Normal)</span>
                            <span>T5 (Aggressive)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
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
                    Executing Nmap...
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6" />
                    Launch Scan
                  </>
                )}
              </button>

              {features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Available Scanner Capabilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RESULT */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
                <CheckCircle2 className="text-emerald-500 w-6 h-6" /> Scan Results for {result.host}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-sm">Host Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${result.state === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {result.state}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-sm">OS Detected</span>
                  <span className="font-semibold text-slate-900 text-sm">{result.osDetect || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Port</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">State</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Service</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.ports && result.ports.map((portInfo, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-medium text-indigo-600">{portInfo.port}/{portInfo.protocol}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${
                            portInfo.state === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            portInfo.state === 'filtered' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {portInfo.state}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {portInfo.service}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 hidden md:table-cell">
                          {portInfo.version || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!result.ports || result.ports.length === 0) && (
                  <div className="p-8 text-center text-slate-500">
                     No ports detected. Is the target up?
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NmapScan;
