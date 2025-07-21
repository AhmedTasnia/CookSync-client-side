import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { FaThumbsUp, FaStar } from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // Fetch meal details
  useEffect(() => {
    fetch(`http://localhost:3000/api/meals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMeal(data);
        setLikes(data.likes || 0);
        setReviews(data.reviews || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!meal) {
    return <p className="text-center my-10">Loading meal details...</p>;
  }

  // ✅ Handle Like Function
  const handleLike = async () => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/login");
      return;
    }

    if (userLiked) return;

    try {
      const res = await fetch(`http://localhost:3000/api/meals/${meal._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (res.ok) {
        setLikes((prev) => prev + 1);
        setUserLiked(true);
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to like the meal.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong while liking.", "error");
    }
  };

  // ✅ Handle Meal Request
  const handleRequestMeal = async () => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/login");
      return;
    }

    const requestData = {
      userName: user.displayName,
      userEmail: user.email,
      mealId: meal._id,
      mealTitle: meal.title,
      distributorName: meal.distributorName,
      status: "Pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/mealRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (res.ok) {
        Swal.fire({
          title: "Request Submitted",
          text: "Request is pending approval.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Failed to submit request", "", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Something went wrong", "", "error");
    }
  };

  // ✅ Handle Add Review
  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, newReview.trim()]);
      setNewReview("");
    }
  };

  return (
    <div className="container mx-auto jost-font py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-[#630000] overflow-hidden">
        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-80 object-cover rounded-t-xl"
        />

        <div className="p-8 space-y-5">
          <h1 className="text-4xl font-bold text-[#630000]">{meal.title}</h1>

          <div className="text-gray-700 flex gap-4 items-center">
            <span className="badge badge-outline text-[#630000]">
              Distributor: {meal.distributorName}
            </span>
            <span className="badge badge-outline">{meal.postTime}</span>
          </div>

          <p className="text-gray-600 leading-relaxed">{meal.description}</p>

          <div>
            <h2 className="text-xl font-semibold text-[#630000]">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-600">
              {Array.isArray(meal.ingredients) ? (
                meal.ingredients.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>No ingredients available</li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-500" />
            <p className="font-semibold text-gray-700">{meal.rating} Rating</p>
          </div>

          <div className="gap-4 mt-6 grid grid-cols-2">
            <button
              onClick={handleLike}
              disabled={userLiked}
              className={`btn rounded-full px-6 ${
                userLiked
                  ? "btn-disabled"
                  : "bg-[#630000] text-white hover:bg-[#810000]"
              }`}
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

      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-[#630000] p-8">
        <h2 className="text-2xl font-bold text-[#630000] mb-4">
          Reviews ({reviews.length})
        </h2>

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
          <button
            onClick={handleAddReview}
            className="btn bg-[#630000] hover:bg-[#810000] text-white px-8 rounded-full"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
