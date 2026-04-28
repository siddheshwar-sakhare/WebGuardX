import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { DownloadCloud, FileText, Search, Filter } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/zap/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };
    fetchHistory();
  }, []);

  const handleDownload = (id, type) => {
    api.get(`/api/zap/export/${id}/${type}`, {
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scan_report_${id}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  const filteredHistory = history.filter(scan => 
    scan.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-24 pb-20">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50 to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-50 to-transparent opacity-60 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-10 pt-8 animate-fadeInUp">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Scan History Directory</h1>
          <p className="text-slate-500 text-lg">View, filter, and export your previous security assessments.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search target URL..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium placeholder-slate-400 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm">
              <Filter className="w-4 h-4" />
              Filter Results
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Scan ID</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Target URL</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Logged</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-16 text-center text-slate-500 font-medium">
                      No scan records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="p-5 text-slate-500 font-mono text-sm max-w-[120px] truncate">#{scan.id.substring(0, 8)}...</td>
                      <td className="p-5 text-indigo-600 font-semibold">{scan.targetUrl}</td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wide rounded-full border border-emerald-200">
                          Complete
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">
                        {new Date(scan.scannedAt).toLocaleDateString()} <span className="opacity-70 text-sm ml-1">{new Date(scan.scannedAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDownload(scan.id, 'pdf')}
                            className="p-2 bg-white text-red-600 border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm"
                            title="Export PDF Report"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDownload(scan.id, 'csv')}
                            className="p-2 bg-white text-emerald-600 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg transition-all shadow-sm"
                            title="Export CSV Data"
                          >
                            <DownloadCloud className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
