import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const AnalyticsBoard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get("http://localhost:1002/api/zap/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-gray-400 p-4 border border-gray-700/50 rounded-xl bg-darkCard animate-pulse h-64 flex items-center justify-center">Loading Analytics...</div>;
  if (!data) return null;

  const riskData = [
    { name: "High", value: data.riskDistribution.High || 0, color: "#f87171" },
    { name: "Medium", value: data.riskDistribution.Medium || 0, color: "#facc15" },
    { name: "Low", value: data.riskDistribution.Low || 0, color: "#4ade80" },
    { name: "Informational", value: data.riskDistribution.Informational || 0, color: "#38bdf8" },
  ];

  const barData = data.timeline.map((item, index) => ({
    name: `Scan ${data.timeline.length - index}`,
    alerts: item.alertsCount
  })).reverse();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 gap-8 mb-8"
    >
      <div className="bg-darkCard backdrop-blur-lg bg-opacity-80 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-gray-800">
        <h3 className="text-xl font-bold text-gray-100 mb-6">Risk Distribution</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                >
                {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-darkCard backdrop-blur-lg bg-opacity-80 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-gray-800">
        <h3 className="text-xl font-bold text-gray-100 mb-6">Recent Alerts Trend</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{fill: '#334155'}} />
                <Bar dataKey="alerts" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsBoard;
