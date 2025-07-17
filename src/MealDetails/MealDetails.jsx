import React, { useState } from "react";
import { FaThumbsUp, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";
import Footer from "../Footer/Footer";
import NavBar from "../Header/Navbar";

const MealDetails = () => {
  const navigate = useNavigate();

  // Fake Data
  const meal = {
    id: "meal1",
    title: "Grilled Chicken Deluxe",
    image: "https://i.postimg.cc/jSNMd1Dn/chicken.jpg",
    distributor: "DineWell Foods Ltd.",
    description: "Perfectly grilled chicken served with fresh vegetables and a tangy sauce. Balanced, delicious, and healthy.",
    ingredients: ["Chicken Breast", "Broccoli", "Carrots", "Olive Oil", "Spices"],
    postTime: "2 days ago",
    rating: 4.8,
    initialLikes: 12,
    reviews: ["Excellent taste!", "Perfectly cooked chicken.", "Highly recommend this meal."],
  };

  const [likes, setLikes] = useState(meal.initialLikes);
  const [userLiked, setUserLiked] = useState(false);
  const [reviews, setReviews] = useState(meal.reviews);
  const [newReview, setNewReview] = useState("");

  const handleLike = () => {
    if (!userLiked) {
      setLikes(likes + 1);
      setUserLiked(true);
      // Here you would PATCH to your server endpoint to persist the like
    }
  };

  const handleRequestMeal = () => {
    // Mock POST for requesting the meal
    alert("Meal request submitted. Status: Pending.");
    navigate("/checkout/premium");
    // Ideally, post { user, mealId, status: "pending" }
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, newReview.trim()]);
      setNewReview("");
      // Here you would POST the review to your server
    }
  };

  return (
    <>
    <NavBar/>
    <div className="container mx-auto py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-[#630000] overflow-hidden">
        <img src={meal.image} alt={meal.title} className="w-full h-80 object-cover rounded-t-xl" />

        <div className="p-8 space-y-5">
          <h1 className="text-4xl font-bold text-[#630000]">{meal.title}</h1>

          <div className="text-gray-700 flex gap-4 items-center">
            <span className="badge badge-outline text-[#630000]">Distributor: {meal.distributor}</span>
            <span className="badge badge-outline">{meal.postTime}</span>
          </div>

          <p className="text-gray-600 leading-relaxed">{meal.description}</p>

          <div>
            <h2 className="text-xl font-semibold text-[#630000]">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-600">
              {meal.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-500" />
            <p className="font-semibold text-gray-700">{meal.rating} Rating</p>
          </div>

          <div className="flex gap-4 mt-6 grid grid-cols-2">
            <button
              onClick={handleLike}
              disabled={userLiked}
              className={`btn rounded-full px-6 ${userLiked ? "btn-disabled" : "bg-[#630000] text-white hover:bg-[#810000]"}`}
            >
              <FaThumbsUp /> {likes} Likes
            </button>
            <button
              onClick={handleRequestMeal}
              className="btn bg-[#630000] hover:bg-[#810000] text-white rounded-full px-8"
            >
              Request Meal
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-[#630000] p-8">
        <h2 className="text-2xl font-bold text-[#630000] mb-4">Reviews ({reviews.length})</h2>

        <div className="space-y-4 mb-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-base-200 rounded-xl p-4 text-gray-700">
              {review}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Write your review..."
            className="input input-bordered w-full"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <button onClick={handleAddReview} className="btn bg-[#630000] hover:bg-[#810000] text-white px-8 rounded-full">
            Post
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default MealDetails;
