import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEye, FaEdit, FaSortAmountDown } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

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
  const navigate = useNavigate();

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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#810000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/meals/${mealId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        Swal.fire("Deleted!", "Meal has been deleted.", "success");
        queryClient.invalidateQueries(["meals"]);
      } else {
        Swal.fire("Failed!", "Failed to delete meal.", "error");
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleUpdate = (mealId) => {
    navigate(`/update-meal/${mealId}`);
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
                      className="flex items-center gap-2 bg-red-50 text-blue-900 px-4 py-1 rounded-lg hover:bg-blue-200 transition"
                    >
                      <FaEdit size={18} />Update
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(_id)}
                      className="flex items-center gap-2 bg-red-50 text-red-800 px-4 py-1 rounded-lg hover:bg-red-200 transition"
                    >
                      <FaTrashAlt size={18} />Delete
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => navigate(`/meal/${_id}`)}
                      className="flex items-center gap-2 bg-red-50 text-[#810000] px-4 py-1 rounded-lg hover:bg-red-200 transition"
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
