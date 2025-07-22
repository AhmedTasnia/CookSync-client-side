import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUtensils, FaCheckCircle, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const fetchRequestedMeals = async (search) => {

  const url = new URL("http://localhost:3000/api/requestedMeals/admin");
  if (search) {
    url.searchParams.append("search", search);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch requested meals");
  return res.json();
};

const ServeMeals = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // controlled input for search field
  const queryClient = useQueryClient();

  // Fetch meals with search param as queryKey to enable caching
  const {
    data: meals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["requestedMeals", search],
    queryFn: () => fetchRequestedMeals(search),
    keepPreviousData: true,
  });

  // Mutation to serve meal (PATCH)
  const serveMutation = useMutation({
    mutationFn: async (mealRequestId) => {
      const res = await fetch(
        `http://localhost:3000/api/requestedMeals/${mealRequestId}/serve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to serve meal");
      return res.json();
    },
    onSuccess: () => {
      Swal.fire("Served!", "Meal marked as Delivered!", "success");
      queryClient.invalidateQueries(["requestedMeals"]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to serve meal", "error");
    },
  });

  const handleServe = (mealRequestId) => {
    serveMutation.mutate(mealRequestId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim()); // trigger query refetch with new search
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        Serve Meals
      </h2>

      {/* Search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Search by user email or username..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#810000]"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
          disabled={isLoading}
        >
          <FaSearch />
          Search
        </button>
      </form>

      {isLoading ? (
        <p className="text-center text-gray-600 py-8">Loading requested meals...</p>
      ) : isError ? (
        <p className="text-center text-red-600 py-8">Error: {error.message}</p>
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
              {meals.map(({ _id, mealDetails, userEmail, userName, status }) => (
                <tr
                  key={_id}
                  className="border-b border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{mealDetails?.title || "No Title"}</td>
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
                        disabled={serveMutation.isLoading}
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
