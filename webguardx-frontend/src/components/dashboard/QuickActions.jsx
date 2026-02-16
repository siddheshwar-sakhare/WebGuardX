import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => navigate("/zap-scan")}
          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
        >
          Run Security Scan
        </button>

        <button className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
