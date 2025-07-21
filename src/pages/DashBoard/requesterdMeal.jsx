import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2";

const RequestedMeals = () => {
  const { user } = useContext(AuthContext);

  const { data: meals = [], refetch } = useQuery({
    queryKey: ["requestedMeals", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`http://localhost:3000/api/mealRequests?userEmail=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch requested meals");
      return res.json();
    },
    enabled: !!user?.email,
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
        const res = await fetch(`http://localhost:3000/api/mealRequests/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire("Cancelled!", "Your meal request has been cancelled.", "success");
          refetch();
        } else {
          Swal.fire("Failed!", "Failed to cancel meal request.", "error");
        }
      } catch  {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Please login to see your requested meals.</p>;
  }

  if (meals.length === 0) {
    return <p className="text-center mt-10">You have no meal requests.</p>;
  }

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
                <tr key={meal._id}>
                  <td className="p-4">{meal.mealTitle || "No title"}</td>
                  <td className="p-4 text-center">{meal.likes ?? 0}</td>
                  <td className="p-4 text-center">{meal.reviews_count ?? 0}</td>
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

      {/* Card layout for small devices */}
      <div className="md:hidden space-y-4">
        {meals.map((meal) => (
          <div key={meal._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">{meal.mealTitle || "No title"}</h3>
            <p className="mt-2">
              <span className="font-medium">Likes:</span> {meal.likes ?? 0}
            </p>
            <p>
              <span className="font-medium">Reviews:</span> {meal.reviews_count ?? 0}
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
    </div>
  );
};

export default RequestedMeals;
