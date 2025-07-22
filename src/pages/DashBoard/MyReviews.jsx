import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";

const fetchReviewsByEmail = async (email) => {
  const res = await fetch(`http://localhost:3000/api/reviews/user/${email}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Correct Hook

  const { data: reviews = [], isLoading, isError, error } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: () => fetchReviewsByEmail(user.email),
    enabled: !!user?.email,
  });

  if (!user) {
    return <p>Please login to see your reviews.</p>;
  }

  if (isLoading) return <p>Loading reviews...</p>;
  if (isError) return <p>Error loading reviews: {error.message}</p>;
  if (reviews.length === 0) return <p>No reviews found.</p>;

  const handleEdit = (id) => {
    Swal.fire({
      icon: "info",
      title: "Edit Feature",
      text: `Edit review for ID: ${id}`,
      confirmButtonColor: "#630000",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#630000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `Review for ID: ${id} has been deleted.`,
          confirmButtonColor: "#630000",
        });
       
      }
    });
  };

  const handleViewMeal = (mealId) => {
    navigate(`/meal/${mealId}`); 
  };

  return (
    <div className="container mx-auto bg-white rounded-xl shadow-md p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6">My Meal Reviews</h2>

      {/* Table for medium+ devices */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Meal Title</th>
                <th className="p-4 text-center">Review</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="border-t border-gray-200">
                  <td className="p-4">{review.mealTitle}</td>
                  <td className="p-4 text-center">{review.review}</td>
                  <td className="p-4 flex justify-center gap-6">
                    <button
                      onClick={() => handleEdit(review._id)}
                     className="flex items-center gap-1 bg-blue-50 text-blue-900 px-3 py-1 rounded-lg hover:bg-blue-100 text-sm"
                       >
                       <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex items-center gap-1 bg-red-50 text-red-800 px-3 py-1 rounded-lg hover:bg-red-100 text-sm"
                       >
                      <FaTrashAlt /> Delete
                    </button>
                    <button
                      onClick={() => handleViewMeal(review.mealId)}
                      className="flex items-center gap-1 bg-red-50 text-[#810000] px-3 py-1 rounded-lg hover:bg-red-100 text-sm"
                        >
                       <FaEye /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout for small devices */}
      <div className="md:hidden space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{review.mealTitle}</h3>
            <p className="mt-2">
              <span className="font-medium">Review:</span> {review.review}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleEdit(review._id)}
                className="bg-yellow-400 text-white px-3 py-1 rounded-md w-full sm:w-auto hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md w-full sm:w-auto hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewMeal(review.mealId)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md w-full sm:w-auto hover:bg-blue-600"
              >
                View Meal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
