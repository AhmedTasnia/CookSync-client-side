import React, { useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

const upcomingMeals = [
  {
    id: 1,
    title: "Special Italian Pasta",
    image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif",
    date: "2025-08-01",
    rating: 4.7,
    likes: 12,
  },
  {
    id: 2,
    title: "Healthy Green Salad",
    image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif",
    date: "2025-08-05",
    rating: 4.5,
    likes: 8,
  },
  {
    id: 3,
    title: "Premium Steak",
    image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif",
    date: "2025-08-10",
    rating: 4.9,
    likes: 20,
  },
];

// Simulated user role (can be: Free / Silver / Gold / Platinum)
const userRole = "Gold";

const UpcomingMeals = () => {
  const navigate = useNavigate();
  const [likedMeals, setLikedMeals] = useState([]);
  const [meals, setMeals] = useState(upcomingMeals);

  const handleLike = (mealId) => {
    if (!["Silver", "Gold", "Platinum"].includes(userRole)) {
      alert("Only Premium members can like meals.");
      return;
    }
    if (likedMeals.includes(mealId)) return;

    setLikedMeals((prev) => [...prev, mealId]);
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId ? { ...meal, likes: meal.likes + 1 } : meal
      )
    );
  };

  return (

    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#630000]">Upcoming Meals</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="border border-[#630000] rounded-xl bg-white shadow-md hover:shadow-lg transition hover:-translate-y-1"
          >
            <img
              src={meal.image}
              alt={meal.title}
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-lg text-[#630000]">{meal.title}</h2>
              <p className="badge badge-outline">Date: {meal.date}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/meal/${meal.id}`)}
                  className="btn btn-outline bg-[#630000] text-white rounded-full px-6"
                >
                  View Details
                </button>
                <button
                  className={`btn rounded-full ${
                    likedMeals.includes(meal.id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleLike(meal.id)}
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
