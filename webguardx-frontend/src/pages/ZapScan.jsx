import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const ZapScan = () => {

  const [url, setUrl] = useState("");
  const [activeScan, setActiveScan] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(5);

  // POST: Start Scan
  const startScan = async () => {
    if (!url) {
      setError("Target URL is required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await api.post("/api/zap/scan", {
        url,
        activeScan,
      });

      setResult(res.data);
     setVisibleCount(3);

    //   setResult(res.data);
    } catch (err) {
      setError("Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* GAP BELOW FIXED NAVBAR */}
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h1 className="text-2xl font-semibold text-gray-800">
              Vulnerability Scan
            </h1>
            <p className="text-gray-500 mt-1">
              Run automated OWASP ZAP security scans
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
            <div>
              <label className="text-sm text-gray-600">Target URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={activeScan}
                onChange={() => setActiveScan(!activeScan)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-gray-700">
                Enable Active Scan (Intrusive)
              </span>
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              onClick={startScan}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Scanning..." : "Start Scan"}
            </button>
          </div>

          {/* RESULT */}
         {result && result.results && (
  <div className="space-y-6">

    {/* SUMMARY */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Scan Summary
      </h2>

      <div className="flex gap-6 text-sm">
        <div className="text-red-600 font-medium">
          Medium: {result.results.filter(r => r.risk === "Medium").length}
        </div>
        <div className="text-yellow-600 font-medium">
          Low: {result.results.filter(r => r.risk === "Low").length}
        </div>
        <div className="text-gray-600 font-medium">
          Informational: {result.results.filter(r => r.risk === "Informational").length}
        </div>
      </div>
    </div>

    {/* VULNERABILITIES */}
   {result.results.slice(0, visibleCount).map((item, index) => (

      <div
        key={index}
        className="bg-white p-6 rounded-2xl shadow-sm border space-y-3"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {item.testName}
          </h3>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.risk === "Medium"
                ? "bg-red-100 text-red-600"
                : item.risk === "Low"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.risk}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {item.description}
        </p>

        <div className="bg-blue-50 p-3 rounded-xl text-sm text-blue-700">
          <strong>Solution:</strong> {item.solution}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 underline"
        >
          View Affected Resource
        </a>
      </div>
    ))}
    {visibleCount < result.results.length && (
  <div className="text-center mt-4">
    <button
      onClick={() => setVisibleCount(prev => prev + 5)}
      className="px-4 py-2 border rounded-xl"
    >
      Load More
    </button>
  </div>
)}

  </div>
)}


        </div>
      </div>
    </div>
  );
};

/* SMALL STAT CARD */
const StatCard = ({ label, value, color }) => {
  const colors = {
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className={`p-4 rounded-xl ${colors[color]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default ZapScan;
