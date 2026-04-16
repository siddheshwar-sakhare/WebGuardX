import { useEffect, useState } from "react";
import axios from "axios";
import { DownloadCloud, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecentActivity = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get("http://localhost:1002/api/zap/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.slice(0, 5)); // Last 5 scans
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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 text-lg">
          Recent Scans
        </h3>
        <Link to="/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
          <p className="text-slate-500 text-sm font-medium">No recent scans found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((scan) => (
            <li key={scan.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-xl hover:bg-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-slate-900 text-sm font-bold">{scan.targetUrl}</p>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">{new Date(scan.scannedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(scan.id, 'pdf')}
                  className="p-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg border border-slate-200 transition-all shadow-sm"
                  title="Export PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownload(scan.id, 'csv')}
                  className="p-2 bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 transition-all shadow-sm"
                  title="Export CSV"
                >
                  <DownloadCloud className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
