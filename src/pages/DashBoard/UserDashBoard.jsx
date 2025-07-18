import React from 'react';

const UserDashboard = () => {
  return (
    <div className="space-y-10">
      <div className="bg-[#1B1C2B] rounded-2xl p-8">
        <h2 className="text-white text-xl font-bold">Performance</h2>
        <p className="text-white">76% Income | 44% Spending</p>
      </div>

      <div className="bg-[#1B1C2B] rounded-2xl p-8">
        <h2 className="text-white text-xl font-bold">Engagement</h2>
        <div className="grid grid-cols-4 gap-6 text-center">
          <div className="bg-white p-4 rounded-lg text-black">This Day: 133</div>
          <div className="bg-white p-4 rounded-lg text-black">This Week: 471</div>
          <div className="bg-white p-4 rounded-lg text-black">This Month: 929</div>
          <div className="bg-white p-4 rounded-lg text-black">Pending: 233</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;