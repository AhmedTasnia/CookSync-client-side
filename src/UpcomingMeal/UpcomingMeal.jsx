import React, { useState, useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { secureFetch } from "../Hook/api";
import AuthContext from "../provider/AuthContext";

// Utility function to fetch upcoming meals
const fetchUpcomingMeals = async () => {
  const res = await fetch("http://localhost:3000/api/upcomingMeals");
  if (!res.ok) {
    throw new Error("Failed to fetch upcoming meals");
  }
  return res.json();
};

const UpcomingMeals = () => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate(); 


  const [likedMeals, setLikedMeals] = useState([]);

  const { data: dbUser = {} } = useQuery({
  queryKey: ["user", user?.email],
  queryFn: async () => {
    const res = await secureFetch(`http://localhost:3000/users/${user?.email}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch user data");
    }
    return res.data; // Axios-style response data
  },
  enabled: !!user?.email,
});

  const {
    data: meals = [], 
    isLoading, 
    isError, 
    refetch, 
  } = useQuery({
    queryKey: ["upcomingMeals"],
    queryFn: fetchUpcomingMeals, 
  });

  useEffect(() => {
    if (user?.email && meals.length > 0) {
      const initiallyLiked = meals
        .filter(meal => meal.likedUsers && meal.likedUsers.includes(user.email))
        .map(meal => meal._id);
      setLikedMeals(initiallyLiked);
    } else {
      setLikedMeals([]);
    }
  }, [user?.email, meals]); 

  const handleLike = async (mealId) => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/SignUp"); 
      return;
    }

    if (!["Silver", "Gold", "Platinum"].includes(dbUser?.badge)) {
      Swal.fire({
        icon: "warning",
        title: "Membership Required",
        text: "You need at least a Silver badge to like meals.",
        confirmButtonColor: "#810000",
      });
      return;
    }

    if (likedMeals.includes(mealId)) {
      Swal.fire("You have already liked this meal.", "", "info");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/upcomingMeals/${mealId}/like`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }), 
        }
      );

      const data = await res.json(); 
      if (res.ok) { 
        await refetch();

        if (data.message?.includes("published")) {
          Swal.fire(
            "🎉 Published!",
            "This meal reached 10 likes and has been published.",
            "success"
          );
          setLikedMeals((prev) => prev.filter(id => id !== mealId));
        } else {
          setLikedMeals((prev) => [...prev, mealId]);
          Swal.fire("✅ Liked!", data.message || "Your like was recorded.", "success");
        }
      } else {
        console.error("Server error response:", data);
        Swal.fire("Error", data.message || "Failed to like this meal.", "error");
      }
    } catch (err) {
      console.error("Client-side error during like:", err);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading upcoming meals...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Failed to load meals.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#630000]">
        Upcoming Meals
      </h1>
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
              <p className="badge badge-outline">
                Date: {meal.date ? new Date(meal.date).toLocaleDateString() : "TBA"}
              </p>
              <div className="flex justify-end">
                <button
                  className={`btn rounded-full flex items-center gap-2 px-4 py-2 ${
                    (likedMeals.includes(meal._id) || (meal.likedUsers && meal.likedUsers.includes(user?.email)))
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-white"
                  }`}
                  onClick={() => handleLike(meal._id)}
                  disabled={likedMeals.includes(meal._id) || (meal.likedUsers && meal.likedUsers.includes(user?.email))}
                >
                  <FaHeart /> {meal.likes || 0} 
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