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
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMeal, setEditingMeal] = useState(null);
  const queryClient = useQueryClient();
  const itemsPerPage = 10;
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

  const handleEditClick = (meal) => {
    setEditingMeal(meal);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/meals/${editingMeal._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editingMeal.title,
        distributorName: editingMeal.distributorName,
        rating: parseFloat(editingMeal.rating),
        price: parseFloat(editingMeal.price),
      }),
    });
    if (res.ok) {
      Swal.fire("Success!", "Meal updated successfully.", "success");
      queryClient.invalidateQueries(["meals"]);
      setEditingMeal(null);
    } else {
      Swal.fire("Error!", "Failed to update meal.", "error");
    }
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = meals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(meals.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md">
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

      <div className="overflow-x-auto hidden lg:block">
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
            {currentItems.map((meal) => (
              <tr
                key={meal._id}
                className="border-b border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="p-3">{meal.title}</td>
                <td className="p-3 text-center">{meal.likes}</td>
                <td className="p-3 text-center">{meal.reviews_count}</td>
                <td className="p-3 text-center">{meal.rating?.toFixed(1)}</td>
                <td className="p-3 text-center">{meal.distributorName}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEditClick(meal)}
                    className="flex items-center gap-2 bg-red-50 text-blue-900 px-4 py-1 rounded-lg hover:bg-blue-200 transition"
                  >
                    <FaEdit size={18} />Update
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex items-center gap-2 bg-red-50 text-red-800 px-4 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaTrashAlt size={18} />Delete
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => navigate(`/meal/${meal._id}`)}
                    className="flex items-center gap-2 bg-red-50 text-[#810000] px-4 py-1 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaEye size={18} />Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-6">
        {currentItems.map((meal) => (
          <div key={meal._id} className="border rounded-xl shadow-md p-4 space-y-2">
            <h3 className="text-xl font-semibold text-[#810000]">{meal.title}</h3>
            <p>Likes: <span className="font-medium">{meal.likes}</span></p>
            <p>Reviews: <span className="font-medium">{meal.reviews_count}</span></p>
            <p>Rating: <span className="font-medium">{meal.rating?.toFixed(1)}</span></p>
            <p>Distributor: <span className="font-medium">{meal.distributorName}</span></p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleEditClick(meal)}
                className="flex items-center gap-1 bg-blue-50 text-blue-900 px-3 py-1 rounded-lg hover:bg-blue-100 text-sm"
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(meal._id)}
                className="flex items-center gap-1 bg-red-50 text-red-800 px-3 py-1 rounded-lg hover:bg-red-100 text-sm"
              >
                <FaTrashAlt /> Delete
              </button>
              <button
                onClick={() => navigate(`/meal/${meal._id}`)}
                className="flex items-center gap-1 bg-red-50 text-[#810000] px-3 py-1 rounded-lg hover:bg-red-100 text-sm"
              >
                <FaEye /> Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Update Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Update Meal</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingMeal.title}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, title: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Distributor Name</label>
                <input
                  type="text"
                  value={editingMeal.distributorName}
                  onChange={(e) =>
                    setEditingMeal({
                      ...editingMeal,
                      distributorName: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editingMeal.rating}
                  onChange={(e) =>
                    setEditingMeal({
                      ...editingMeal,
                      rating: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingMeal.price}
                  onChange={(e) =>
                    setEditingMeal({
                      ...editingMeal,
                      price: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMeal(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#810000] text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllMeals;
