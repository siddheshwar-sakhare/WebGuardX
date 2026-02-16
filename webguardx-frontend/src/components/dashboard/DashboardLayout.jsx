import Navbar from "../Navbar";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* GAP AFTER NAVBAR */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <DashboardHeader />
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
