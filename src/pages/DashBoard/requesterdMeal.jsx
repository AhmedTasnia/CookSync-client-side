import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";
import Pagination from "../../Components/Pagination/Pagination";

const fetchRequestedMeals = async (email) => {
  const res = await secureFetch(`https://cook-sync-server.vercel.app/api/mealRequests?userEmail=${encodeURIComponent(email)}`);
  return res.data;
};

const fetchAllMeals = async () => {
  const res = await secureFetch("https://cook-sync-server.vercel.app/api/meals");
  return res.data;
};

const fetchAllReviews = async () => {
  const res = await secureFetch("https://cook-sync-server.vercel.app/api/reviews");
  return res.data;
};

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: requestedMeals = [],
    refetch,
    isLoading: loadingRequests,
    isError: errorRequests,
  } = useQuery({
    queryKey: ["requestedMeals", user?.email],
    queryFn: () => fetchRequestedMeals(user.email),
    enabled: !!user?.email,
  });

  const {
    data: allMeals = [],
    isLoading: loadingMeals,
    isError: errorMeals,
  } = useQuery({
    queryKey: ["allMeals"],
    queryFn: fetchAllMeals,
  });

  const {
    data: allReviews = [],
    isLoading: loadingReviews,
    isError: errorReviews,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: fetchAllReviews,
  });

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this cancellation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await secureFetch(`https://cook-sync-server.vercel.app/api/mealRequests/${id}`, {
          method: "DELETE",
        });

        if (res.status === 200) {
          Swal.fire("Cancelled!", "Your meal request has been cancelled.", "success");
          refetch();
        } else {
          Swal.fire("Failed!", "Failed to cancel meal request.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (!user)
    return <p className="text-center mt-10">Please login to see your requested meals.</p>;
  if (loadingRequests || loadingMeals || loadingReviews)
    return <p className="text-center mt-10">Loading your requested meals...</p>;
  if (errorRequests || errorMeals || errorReviews)
    return <p className="text-center mt-10 text-red-500">Failed to load data.</p>;
  if (requestedMeals.length === 0)
    return <p className="text-center mt-10">You have no meal requests.</p>;

  const enrichedMeals = requestedMeals.map((mealReq) => {
    const meal = allMeals.find((m) => m._id === mealReq.mealId);
    const reviewsCount = allReviews.filter((r) => r.mealId === mealReq.mealId).length;

    return {
      ...mealReq,
      likes: meal?.likes || 0,
      reviews_count: reviewsCount,
      mealTitle: meal?.title || mealReq.mealTitle || "Unknown Meal",
    };
  });

  // Pagination logic
  const totalPages = Math.ceil(enrichedMeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeals = enrichedMeals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto jost-font bg-white rounded-xl shadow-md p-8 mt-6">
      <h2 className="text-3xl text-red-900 text-center font-bold mb-6">My Requested Meals</h2>

      {/* Table for medium+ devices */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#810000] text-white">
              <tr>
                <th className="p-4 text-left">Meal Title</th>
                <th className="p-4 text-center">Likes</th>
                <th className="p-4 text-center">Reviews</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMeals.map((meal) => (
                <tr key={meal._id}>
                  <td className="p-4">{meal.mealTitle}</td>
                  <td className="p-4 text-center">{meal.likes}</td>
                  <td className="p-4 text-center">{meal.reviews_count}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        meal.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : meal.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {meal.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCancel(meal._id)}
                      className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-800 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for small devices */}
      <div className="md:hidden space-y-4 mt-4">
        {paginatedMeals.map((meal) => (
          <div
            key={meal._id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{meal.mealTitle}</h3>
            <p className="mt-2">
              <span className="font-medium">Likes:</span> {meal.likes}
            </p>
            <p>
              <span className="font-medium">Reviews:</span> {meal.reviews_count}
            </p>
            <p className="my-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  meal.status === "Approved"
                    ? "bg-green-100 text-green-600"
                    : meal.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {meal.status}
              </span>
            </p>
            <button
              onClick={() => handleCancel(meal._id)}
              className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-800 transition w-full"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default RequestedMeals;
