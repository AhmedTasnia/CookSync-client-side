import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSortAmountDown } from "react-icons/fa";

const AllMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(""); // 'likes' or 'reviews_count'

  const fetchMeals = async (sortBy = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meals${sortBy ? `?sort=${sortBy}` : ""}`); // Backend must support sort query
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(sortField);
  }, [sortField]);

  const handleDelete = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`/api/meals/${mealId}`, { method: "DELETE" });
      if (res.ok) {
        setMeals((prev) => prev.filter((meal) => meal._id !== mealId));
        alert("Meal deleted successfully");
      } else {
        alert("Failed to delete meal");
      }
    } catch  {
      alert("Error deleting meal");
    }
  };

  const handleUpdate = (mealId) => {
    window.location.href = `/update-meal/${mealId}`;
  };

  const handleView = (mealId) => {
    window.location.href = `/meals/${mealId}`;
  };

  return (
    <div className="max-w-6xl jost-font mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        All Meals
      </h2>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => setSortField("likes")}
          className="flex items-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
        >
          <FaSortAmountDown /> Sort by Likes
        </button>
        <button
          onClick={() => setSortField("reviews_count")}
          className="flex items-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
        >
          <FaSortAmountDown /> Sort by Reviews
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No meals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#810000] text-white">
              <tr>
                <th className="p-3 text-left">Meal Title</th>
                <th className="p-3 text-center">Likes</th>
                <th className="p-3 text-center">Reviews</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-center">Distributor</th>
                <th className="p-3 text-center">Update</th>
                <th className="p-3 text-center">Delete</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(
                ({
                  _id,
                  title,
                  likes,
                  reviews_count,
                  rating,
                  distributorName,
                }) => (
                  <tr
                    key={_id}
                    className="border-b border-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{title}</td>
                    <td className="p-3 text-center">{likes}</td>
                    <td className="p-3 text-center">{reviews_count}</td>
                    <td className="p-3 text-center">{rating.toFixed(1)}</td>
                    <td className="p-3 text-center">{distributorName}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleUpdate(_id)}
                        className="text-blue-600 hover:text-blue-800 rounded-full p-2 transition"
                        title="Update"
                      >
                        <FaEdit size={18} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(_id)}
                        className="text-red-600 hover:text-red-800 rounded-full p-2 transition"
                        title="Delete"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleView(_id)}
                        className="text-[#810000] hover:text-[#a30000] rounded-full p-2 transition"
                        title="View"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllMeals;
