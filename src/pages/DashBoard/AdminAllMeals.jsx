import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEye, FaEdit, FaSortAmountDown } from "react-icons/fa";

const fetchMeals = async (sortBy = "") => {
  const url = `http://localhost:3000/api/meals${sortBy ? `?sort=${sortBy}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch meals: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

const AdminAllMeals = () => {
  const [sortField, setSortField] = useState("");
  const queryClient = useQueryClient();

  const {
    data: meals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals", sortField],
    queryFn: () => fetchMeals(sortField),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const handleDelete = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/meals/${mealId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Meal deleted successfully");
        queryClient.invalidateQueries(["meals"]);
      } else {
        alert("Failed to delete meal");
      }
    } catch {
      alert("Error deleting meal");
    }
  };

  const handleUpdate = (mealId) => {
    window.location.href = `/update-meal/${mealId}`;
  };

  const handleView = (mealId) => {
    window.location.href = `/meals/${mealId}`;
  };

  if (isLoading) return <p className="text-center py-8">Loading meals...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 py-8">
        Error loading meals: {error.message}
      </p>
    );
  if (meals.length === 0)
    return <p className="text-center py-8">No meals found.</p>;

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
                      className="flex items-center gap-2 bg-red-50 text-blue-900 px-4 py-1 rounded-lg hover:bg-red-800 transition"
                    >
                      <FaEdit size={18} />Update
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(_id)}
                      className="flex items-center gap-2 bg-red-50 text-red-800 px-4 py-1 rounded-lg hover:bg-red-800 transition"
                    >
                      <FaTrashAlt size={18} />Delete
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    {/* <button
                      onClick={() => handleView(_id)}
                      className="flex items-center gap-2 text-[#810000] hover:text-[#a30000] rounded-full p-2 transition"
                      title="View"
                    >
                      <FaEye size={18} />Details
                    </button> */}
                    <button
                      onClick={() => handleView(_id)}
                      className="flex items-center gap-2 bg-red-50 text-[#810000] px-4 py-1 rounded-lg  hover:text-[#a30000]transition"
                    >
                      <FaEye size={18} />Details
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllMeals;
