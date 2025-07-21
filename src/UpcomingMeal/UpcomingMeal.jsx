import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const userRole = "Gold";

const fetchUpcomingMeals = async () => {
  const res = await fetch("http://localhost:3000/api/upcomingMeals");
  if (!res.ok) {
    throw new Error("Failed to fetch upcoming meals");
  }
  return res.json();
};

const UpcomingMeals = () => {
  const [likedMeals, setLikedMeals] = useState([]);

  const { data: meals = [], isLoading, isError } = useQuery({
    queryKey: ["upcomingMeals"],
    queryFn: fetchUpcomingMeals,
  });

  const handleLike = (mealId) => {
    if (!["Silver", "Gold", "Platinum"].includes(userRole)) {
      alert("Only Premium members can like meals.");
      return;
    }
    if (likedMeals.includes(mealId)) return;

    setLikedMeals((prev) => [...prev, mealId]);
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading upcoming meals...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Failed to load meals.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#630000]">Upcoming Meals</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="border border-[#630000] rounded-xl bg-white shadow-md hover:shadow-lg transition hover:-translate-y-1"
          >
            <img
              src={meal.image}
              alt={meal.title}
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-lg text-[#630000]">{meal.title}</h2>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Category:</span> {meal.category || "N/A"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Ingredients:</span>{" "}
                {Array.isArray(meal.ingredients)
                  ? meal.ingredients.join(", ")
                  : meal.ingredients || "N/A"}
              </p>

              <p className="badge badge-outline">Date: {meal.date || "TBA"}</p>

              <div className="flex justify-end">
                <button
                  className={`btn rounded-full ${
                    likedMeals.includes(meal._id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleLike(meal._id)}
                >
                  <FaHeart /> {meal.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeals;
