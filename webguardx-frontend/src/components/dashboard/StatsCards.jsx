const stats = [
  { title: "Total Users", value: "1,240", color: "red" },
  { title: "Active Sessions", value: "320", color: "blue" },
  { title: "Reports", value: "87", color: "red" },
  { title: "Revenue", value: "₹42K", color: "blue" },
];

const StatsCards = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl p-6 bg-white border shadow-sm 
          ${item.color === "red" ? "border-red-100" : "border-blue-100"}`}
        >
          <p className="text-gray-500 text-sm">{item.title}</p>
          <h2
            className={`text-2xl font-bold mt-2
            ${item.color === "red" ? "text-red-500" : "text-blue-500"}`}
          >
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
