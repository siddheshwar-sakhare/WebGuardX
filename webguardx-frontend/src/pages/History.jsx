import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { DownloadCloud, FileText, Search, Filter } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get("http://localhost:1002/api/zap/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };
    fetchHistory();
  }, []);

  const handleDownload = (id, type) => {
    const token = localStorage.getItem("jwtToken");
    axios.get(`http://localhost:1002/api/zap/export/${id}/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
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
    <div className="min-h-screen bg-darkBg text-gray-200 font-sans selection:bg-neonBlue selection:text-white pt-24">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-neonBlue/10 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-neonPurple/10 to-transparent opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Scan History Directory</h1>
          <p className="text-gray-400">View and export all previous security and vulnerability assessments.</p>
        </div>

        <div className="bg-darkCard/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search target URL..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-gray-200 focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors text-gray-300">
              <Filter className="w-4 h-4" />
              Filter Results
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/40 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-gray-800">Scan ID</th>
                  <th className="p-4 font-semibold border-b border-gray-800">Target URL</th>
                  <th className="p-4 font-semibold border-b border-gray-800">Status</th>
                  <th className="p-4 font-semibold border-b border-gray-800">Date Logged</th>
                  <th className="p-4 font-semibold border-b border-gray-800 text-right">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No scan records found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="p-4 text-gray-400 font-mono text-sm">#{scan.id.substring(0, 8)}...</td>
                      <td className="p-4 text-neonBlue font-medium">{scan.targetUrl}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                          Complete
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(scan.scannedAt).toLocaleDateString()} at {new Date(scan.scannedAt).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDownload(scan.id, 'pdf')}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all"
                            title="Export PDF Report"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownload(scan.id, 'csv')}
                            className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 rounded-lg transition-all"
                            title="Export CSV Data"
                          >
                            <DownloadCloud className="w-4 h-4" />
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
