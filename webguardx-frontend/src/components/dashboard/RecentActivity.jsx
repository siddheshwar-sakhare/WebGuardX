import { useEffect, useState } from "react";
import axios from "axios";
import { DownloadCloud, FileText } from "lucide-react";

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
    <div className="bg-darkCard backdrop-blur-lg border border-gray-800 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <h3 className="font-semibold text-gray-100 mb-4 text-xl">
        Recent Scans
      </h3>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent scans found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((scan) => (
            <li key={scan.id} className="flex justify-between items-center bg-gray-800/40 p-3 rounded-lg hover:bg-gray-800/80 transition-colors">
              <div>
                <p className="text-gray-300 text-sm font-medium">{scan.targetUrl}</p>
                <p className="text-gray-500 text-xs">{new Date(scan.scannedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(scan.id, 'pdf')}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all"
                  title="Export PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownload(scan.id, 'csv')}
                  className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 rounded-lg transition-all"
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
