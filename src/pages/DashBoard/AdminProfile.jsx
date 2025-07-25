import React, { useContext, useEffect, useState } from "react";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [mealsAdded, setMealsAdded] = useState(0);

  const profileImage = user?.photoURL || "https://i.postimg.cc/yYqy5hdX/admin-avatar.png";

  useEffect(() => {
    if (!user?.email) return;

    const fetchMeals = async () => {
      try {
        const res = await secureFetch("https://cook-sync-server.vercel.app/api/meals");
        // Since secureFetch is axios-like, data is in res.data
        const meals = res.data || [];
        const adminMeals = meals.filter(meal => meal.distributorEmail === user.email);
        setMealsAdded(adminMeals.length);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchMeals();
  }, [user?.email]);

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
