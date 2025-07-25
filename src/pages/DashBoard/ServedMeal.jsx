import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUtensils, FaCheckCircle, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { secureFetch } from "../../Hook/api";

const ITEMS_PER_PAGE = 10;

const fetchRequestedMeals = async (search) => {
  const url = new URL("https://cook-sync-server.vercel.app/api/requestedMeals/admin");
  if (search) {
    url.searchParams.append("search", search);
  }

  try {
    const res = await secureFetch(url.toString());
    return res.data; // assuming secureFetch returns axios-like response
  } catch {
    throw new Error("Failed to fetch requested meals");
  }
};

const ServeMeals = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  const {
    data: meals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["requestedMeals", search],
    queryFn: () => fetchRequestedMeals(search),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const serveMutation = useMutation({
    mutationFn: async (mealRequestId) => {
      try {
        const res = await secureFetch(
          `https://cook-sync-server.vercel.app/api/requestedMeals/${mealRequestId}/serve`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }
        );
        return res.data;
      } catch {
        throw new Error("Failed to serve meal");
      }
    },
    onSuccess: () => {
      Swal.fire("Served!", "Meal marked as Delivered!", "success");
      queryClient.invalidateQueries(["requestedMeals", search]);
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
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const paginatedMeals = meals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-4 jost-font sm:p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-[#810000]">
        Serve Meals
      </h2>

      {/* Search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 mb-4 sm:mb-6"
      >
        <input
          type="search"
          placeholder="Search by user email or username..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:flex-grow px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#810000]"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000] disabled:opacity-60"
          disabled={isLoading || serveMutation.isLoading}
        >
          <FaSearch />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {isLoading ? (
        <p className="text-center text-gray-600 py-8">
          Loading requested meals...
        </p>
      ) : isError ? (
        <p className="text-center text-red-600 py-8">Error: {error.message}</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No requested meals found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-sm sm:text-base">
              <thead className="bg-[#810000] text-white">
                <tr>
                  <th className="p-2 sm:p-3 text-left">Meal Title</th>
                  <th className="p-2 sm:p-3 text-center">User Email</th>
                  <th className="p-2 sm:p-3 text-center">User Name</th>
                  <th className="p-2 sm:p-3 text-center">Status</th>
                  <th className="p-2 sm:p-3 text-center">Serve</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMeals.map(
                  ({ _id, mealTitle, userEmail, userName, status }) => (
                    <tr
                      key={_id}
                      className="border-b border-gray-300 hover:bg-gray-50 transition"
                    >
                      <td className="p-2 sm:p-3 break-words max-w-xs">
                        {mealTitle || "No Title"}
                      </td>
                      <td className="p-2 sm:p-3 text-center break-all">
                        {userEmail}
                      </td>
                      <td className="p-2 sm:p-3 text-center break-words">
                        {userName}
                      </td>
                      <td className="p-2 sm:p-3 text-center">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "Delivered"
                              ? "bg-green-200 text-green-700"
                              : "bg-yellow-200 text-yellow-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-center">
                        {status !== "Delivered" ? (
                          <button
                            onClick={() => handleServe(_id)}
                            className="flex items-center justify-center gap-2 bg-[#810000] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#a30000] disabled:opacity-60"
                            disabled={serveMutation.isLoading}
                          >
                            <FaUtensils />
                            <span className="hidden sm:inline">Serve</span>
                          </button>
                        ) : (
                          <span className="text-green-600 flex justify-center">
                            <FaCheckCircle size={20} />
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {/* <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div> */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === index + 1
                    ? "bg-[#810000] text-white"
                    : "bg-white text-[#810000] border-[#810000]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ServeMeals;
