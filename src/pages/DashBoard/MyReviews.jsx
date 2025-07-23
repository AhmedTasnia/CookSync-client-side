import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

// Fetch all reviews
const fetchReviews = async () => {
  const res = await fetch("http://localhost:3000/api/reviews");
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

// Fetch all meals
const fetchMeals = async () => {
  const res = await fetch("http://localhost:3000/api/meals");
  if (!res.ok) throw new Error("Failed to fetch meals");
  return res.json();
};

// Delete review
const deleteReview = async (id) => {
  const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
};

const AllReviews = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch reviews
  const {
    data: allReviews = [],
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  // Fetch meals
  const {
    data: meals = [],
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });

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

  const handleViewMeal = (mealId) => {
    if (mealId) {
      navigate(`/meal/${mealId}`);
    } else {
      Swal.fire("Error", "Meal ID not found.", "error");
    }
  };

  if (isLoadingReviews || isLoadingMeals) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (isErrorReviews || isErrorMeals) {
    return (
      <div className="text-center py-10 text-red-500">Failed to load data</div>
    );
  }

  // Filter reviews by logged-in user
  const myReviews = allReviews.filter(
    (review) => review.userEmail === user?.email
  );

  const reviewsWithStats = myReviews.map((review) => {
    const meal = meals.find((m) => m._id === review.mealId);
    const reviewsCount = allReviews.filter(
      (r) => r.mealId === review.mealId
    ).length;

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
        <div className="overflow-x-auto">
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
              {reviewsWithStats.map(
                ({ _id, mealTitle, likes, reviews_count, mealId }) => (
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
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
