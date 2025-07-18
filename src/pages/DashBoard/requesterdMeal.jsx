import React, { useState } from "react";

const RequestedMeals = () => {
  const [meals, setMeals] = useState([
    {
      id: 1,
      title: "Grilled Chicken Salad",
      likes: 34,
      reviews_count: 12,
      status: "Pending",
    },
    {
      id: 2,
      title: "Vegetarian Pizza",
      likes: 50,
      reviews_count: 20,
      status: "Approved",
    },
    {
      id: 3,
      title: "Beef Steak",
      likes: 23,
      reviews_count: 9,
      status: "Rejected",
    },
  ]);

  const handleCancel = (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this meal request?");
    if (confirm) {
      setMeals(meals.filter((meal) => meal.id !== id));
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-xl shadow-md p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6">My Requested Meals</h2>

      {/* Table for medium+ devices */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Meal Title</th>
                <th className="p-4 text-center">Likes</th>
                <th className="p-4 text-center">Reviews</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id} className="border-t border-gray-200">
                  <td className="p-4">{meal.title}</td>
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
                      onClick={() => handleCancel(meal.id)}
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

      {/* Card layout for small devices */}
      <div className="md:hidden space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="border rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{meal.title}</h3>
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
              onClick={() => handleCancel(meal.id)}
              className="bg-red-400 text-white px-4 py-1 rounded-md hover:bg-red-800 transition w-full"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestedMeals;
