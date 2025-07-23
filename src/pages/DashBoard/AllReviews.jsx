import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const fetchMeals = async () => {
  const res = await fetch("http://localhost:3000/api/meals");
  if (!res.ok) throw new Error("Failed to fetch meals");
  return res.json();
};

const fetchReviews = async () => {
  const res = await fetch("http://localhost:3000/api/reviews");
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

const deleteReview = async (id) => {
  const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
};

const AllReviews = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: meals = [],
    isLoading: mealsLoading,
    isError: mealsError,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
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

  if (mealsLoading || reviewsLoading) {
    return <div className="text-center py-10 text-gray-600">Loading data...</div>;
  }

  if (mealsError || reviewsError) {
    return <div className="text-center py-10 text-red-500">Failed to load data</div>;
  }

  const mealsMap = new Map(meals.map((meal) => [meal._id, meal]));

  const reviewsWithMealData = reviews.map((review) => {
    const meal = mealsMap.get(review.mealId);
    return {
      ...review,
      likes: meal?.likes || 0,
      reviews_count: meal?.reviews_count || 0,
    };
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        All Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <>
          {/* ✅ Table for medium and larger screens */}
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
                {reviewsWithMealData.map(({ _id, mealTitle, likes, reviews_count, mealId }) => (
                  <tr key={_id} className="border-b border-gray-300 hover:bg-gray-50 transition">
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

          {/* ✅ Card layout for small screens */}
          <div className="md:hidden space-y-4">
            {reviewsWithMealData.map(({ _id, mealTitle, likes, reviews_count, mealId }) => (
              <div key={_id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{mealTitle}</h3>
                <p className="mb-1"><span className="font-medium">Likes:</span> {likes}</p>
                <p className="mb-2"><span className="font-medium">Reviews:</span> {reviews_count}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(_id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                  <button
                    onClick={() => handleViewMeal(mealId)}
                    className="text-[#810000] hover:text-[#a30000] flex items-center gap-1"
                  >
                    <FaEye /> View
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
