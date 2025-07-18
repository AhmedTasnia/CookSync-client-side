import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      <div className="bg-[#1B1C2B] rounded-2xl p-8">
        <h2 className="text-white text-xl font-bold">Admin Metrics</h2>
        <p className="text-white">User Count: 1024 | Revenue: $12k</p>
      </div>

      <div className="bg-[#1B1C2B] rounded-2xl p-8">
        <h2 className="text-white text-xl font-bold">Sales Activity</h2>
        <p className="text-white">Weekly Views: 12,560</p>
      </div>
    </div>
  );
};
export default AdminDashboard;