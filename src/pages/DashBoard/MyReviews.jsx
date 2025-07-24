import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { secureFetch } from "../../Hook/api"; 
import AuthContext from "../../provider/AuthContext";

const fetchReviews = async () => {
  const res = await secureFetch("http://localhost:3000/api/reviews");
  if (res.status !== 200) throw new Error("Failed to fetch reviews");
  return res.data;
};

const fetchMeals = async () => {
  const res = await secureFetch("http://localhost:3000/api/meals");
  if (res.status !== 200) throw new Error("Failed to fetch meals");
  return res.data;
};

const deleteReview = async (id) => {
  const res = await secureFetch(`http://localhost:3000/api/reviews/${id}`, {
    method: "DELETE",
  });
  if (res.status !== 200) throw new Error("Failed to delete review");
  return res.data;
};

const AllReviews = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch reviews, enabled only if user.email is available
  const {
    data: allReviews = [],
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    enabled: !!user?.email,
  });

  // Fetch meals independently
  const {
    data: meals = [],
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
    error: errorMeals,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });

  // Mutation for deleting a review
  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      Swal.fire("Deleted!", "Review has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete review.", "error");
    },
  });

  // Handle delete button click with confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(id);
      }
    });
  };

  // Handle view meal button click (navigate to meal page)
  const handleViewMeal = (mealId) => {
    if (mealId) {
      navigate(`/meal/${mealId}`);
    } else {
      Swal.fire("Error", "Meal ID not found.", "error");
    }
  };

  // Show loading if user or data not ready
  if (!user) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading user info...
      </div>
    );
  }

  if (isLoadingReviews || isLoadingMeals) {
    return <div className="text-center py-10 text-gray-600">Loading data...</div>;
  }

  // Show error message if any error occurs
  if (isErrorReviews || isErrorMeals) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load data: {(errorReviews || errorMeals)?.message || "Unknown error"}
      </div>
    );
  }

  // Filter reviews for current user (case insensitive)
  const myReviews = allReviews.filter(
    (review) =>
      review.userEmail?.trim().toLowerCase() === user.email.trim().toLowerCase()
  );

  // Map reviews with meal data and counts
  const reviewsWithStats = myReviews.map((review) => {
    const meal = meals.find((m) => m._id === review.mealId);
    const reviewsCount = allReviews.filter((r) => r.mealId === review.mealId).length;

    return {
      ...review,
      likes: meal?.likes || 0,
      reviews_count: reviewsCount,
      mealTitle: meal?.title || review.mealTitle || "Unknown Meal",
    };
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        My Reviews
      </h2>

      {reviewsWithStats.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <>
          {/* Table for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-[#810000] text-white">
                <tr>
                  <th className="p-3 text-left">Meal Title</th>
                  <th className="p-3 text-center">Likes</th>
                  <th className="p-3 text-center">Reviews Count</th>
                  <th className="p-3 text-center">Delete</th>
                  <th className="p-3 text-center">View Meal</th>
                </tr>
              </thead>
              <tbody>
                {reviewsWithStats.map(({ _id, mealTitle, likes, reviews_count, mealId }) => (
                  <tr
                    key={_id}
                    className="border-b border-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{mealTitle}</td>
                    <td className="p-3 text-center">{likes}</td>
                    <td className="p-3 text-center">{reviews_count}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(_id)}
                        className="text-red-600 hover:text-red-800 rounded-full p-2 transition"
                        title="Delete Review"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleViewMeal(mealId)}
                        className="text-[#810000] hover:text-[#a30000] rounded-full p-2 transition"
                        title="View Meal"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="md:hidden space-y-4">
            {reviewsWithStats.map(({ _id, mealTitle, likes, reviews_count, mealId }) => (
              <div
                key={_id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-[#810000]">{mealTitle}</h3>
                <p className="text-sm text-gray-700">
                  <strong>Likes:</strong> {likes}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Review Count:</strong> {reviews_count}
                </p>
                <div className="flex justify-end gap-4 mt-3">
                  <button
                    onClick={() => handleViewMeal(mealId)}
                    className="text-[#810000] hover:text-[#a30000]"
                    title="View Meal"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Review"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllReviews;
