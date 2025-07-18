import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from API (replace with your actual endpoint)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews"); // adjust your API path here
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        alert("Review deleted successfully");
      } else {
        alert("Failed to delete review");
      }
    } catch  {
      alert("Error deleting review");
    }
  };

  const handleViewMeal = (mealId) => {
    // Redirect or open modal to view meal details
    window.location.href = `/meals/${mealId}`;
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading reviews...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">
        All Reviews
      </h2>
      {reviews.length === 0 ? (
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
              {reviews.map(({ _id, mealTitle, likes, reviews_count, mealId }) => (
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
      )}
    </div>
  );
};

export default AllReviews;
