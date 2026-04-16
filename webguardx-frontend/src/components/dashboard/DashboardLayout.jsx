import Navbar from "../Navbar";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import AnalyticsBoard from "./AnalyticsBoard";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* GAP AFTER NAVBAR */}
      <div className="pt-28 px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <DashboardHeader />
          <AnalyticsBoard />
          <StatsCards />
          <div className="grid md:grid-cols-2 gap-8">
            <RecentActivity />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
