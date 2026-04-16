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

  if (loading) return <div className="text-slate-400 font-medium p-4 border border-slate-200 border-dashed rounded-2xl bg-white animate-pulse h-64 flex items-center justify-center shadow-sm">Loading Analytics...</div>;
  if (!data) return null;

  const riskData = [
    { name: "High", value: data.riskDistribution.High || 0, color: "#ef4444" },
    { name: "Medium", value: data.riskDistribution.Medium || 0, color: "#f59e0b" },
    { name: "Low", value: data.riskDistribution.Low || 0, color: "#10b981" },
    { name: "Informational", value: data.riskDistribution.Informational || 0, color: "#3b82f6" },
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
      className="grid lg:grid-cols-2 gap-8 mb-8"
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk Distribution</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                >
                {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontWeight: '500', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ color: '#0f172a' }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Alerts Trend</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', fontWeight: '500', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  cursor={{fill: '#f8fafc'}} 
                />
                <Bar dataKey="alerts" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsBoard;
