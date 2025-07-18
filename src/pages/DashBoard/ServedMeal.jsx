import React, { useEffect, useState } from "react";
import { FaSearch, FaUtensils, FaCheckCircle } from "react-icons/fa";

const ServeMeals = () => {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMeals = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/requestedMeals?search=${query}`); // Your API must support search query param
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(searchQuery);
  }, [searchQuery]);

  const handleServe = async (mealId) => {
    try {
      const res = await fetch(`/api/requestedMeals/${mealId}/serve`, {
        method: "PATCH",
      });

      if (res.ok) {
        setMeals((prev) =>
          prev.map((meal) =>
            meal._id === mealId ? { ...meal, status: "Delivered" } : meal
          )
        );
        alert("Meal marked as Delivered!");
      } else {
        alert("Failed to serve meal");
      }
    } catch  {
      alert("Error updating meal status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        Serve Meals
      </h2>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by user email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#810000]"
        />
        <button
          className="flex items-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
          onClick={() => fetchMeals(searchQuery)}
        >
          <FaSearch />
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading requested meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No requested meals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#810000] text-white">
              <tr>
                <th className="p-3 text-left">Meal Title</th>
                <th className="p-3 text-center">User Email</th>
                <th className="p-3 text-center">User Name</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Serve</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(({ _id, title, userEmail, userName, status }) => (
                <tr
                  key={_id}
                  className="border-b border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{title}</td>
                  <td className="p-3 text-center">{userEmail}</td>
                  <td className="p-3 text-center">{userName}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "Delivered"
                          ? "bg-green-200 text-green-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {status !== "Delivered" ? (
                      <button
                        onClick={() => handleServe(_id)}
                        className="flex items-center justify-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
                      >
                        <FaUtensils />
                        Serve
                      </button>
                    ) : (
                      <span className="text-green-600 flex justify-center">
                        <FaCheckCircle size={20} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServeMeals;
