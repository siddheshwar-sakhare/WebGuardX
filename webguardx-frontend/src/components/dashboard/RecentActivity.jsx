const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      <ul className="space-y-3 text-gray-600 text-sm">
        <li>• New user registered</li>
        <li>• Report uploaded</li>
        <li>• Password changed</li>
        <li>• Subscription updated</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
