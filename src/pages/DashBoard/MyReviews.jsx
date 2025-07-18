import React, { useState } from "react";

const MyReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      mealTitle: "Grilled Chicken Salad",
      likes: 34,
      review: "Very tasty and healthy!",
    },
    {
      id: 2,
      mealTitle: "Vegetarian Pizza",
      likes: 50,
      review: "Loved the cheesy crust!",
    },
    {
      id: 3,
      mealTitle: "Beef Steak",
      likes: 23,
      review: "Perfectly cooked, highly recommend.",
    },
  ]);

  const handleEdit = (id) => {
    alert(`Edit review for meal ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirm) {
      setReviews(reviews.filter((review) => review.id !== id));
    }
  };

  const handleViewMeal = (id) => {
    alert(`View details for meal ID: ${id}`);
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
                <th className="p-4 text-center">Likes</th>
                <th className="p-4 text-center">Review</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t border-gray-200">
                  <td className="p-4">{review.mealTitle}</td>
                  <td className="p-4 text-center">{review.likes}</td>
                  <td className="p-4 text-center">{review.review}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(review.id)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md w-full sm:w-[100px] text-center hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md w-full sm:w-[100px] text-center hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewMeal(review.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md w-full sm:w-[100px] text-center hover:bg-blue-600"
                    >
                      View Meal
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
            key={review.id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{review.mealTitle}</h3>
            <p className="mt-2">
              <span className="font-medium">Likes:</span> {review.likes}
            </p>
            <p className="my-2">
              <span className="font-medium">Review:</span> {review.review}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleEdit(review.id)}
                className="bg-yellow-400 text-white px-3 py-1 rounded-md w-full sm:w-auto hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md w-full sm:w-auto hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewMeal(review.id)}
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
