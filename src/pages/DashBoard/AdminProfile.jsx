import React, { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  // Fallback image if user has no photoURL
  const profileImage = user?.photoURL || "https://i.postimg.cc/yYqy5hdX/admin-avatar.png";

  // Dummy meals count for now (you can later fetch this from your database)
  const mealsAdded = 42;

  return (
    <div className="max-w-3xl jost-font mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <img
          src={profileImage}
          alt="Admin Avatar"
          className="w-32 h-32 rounded-full border-4 border-blue-300 object-cover"
        />
        <h2 className="text-2xl font-bold">{user?.displayName || "Admin User"}</h2>
        <p className="text-gray-500">{user?.email || "admin@example.com"}</p>
        <div className="bg-red-50 text-red-700 font-semibold px-6 py-3 rounded-xl mt-4">
          Meals Added: {mealsAdded}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
