import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaThumbsUp, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { secureFetch } from "../Hook/api";
import AuthContext from "../provider/AuthContext";

const fetchMealById = async (id) => {
  const res = await fetch(`https://cook-sync-server.vercel.app/api/meals/${id}`);
  if (!res.ok) throw new Error("Failed to fetch meal details");
  return res.json();
};

const fetchUserByEmail = async (email) => {
  
    const res = await secureFetch(`https://cook-sync-server.vercel.app/users/${email}`);
    return res.data();
};

const fetchReviews = async (mealId) => {
  const res = await fetch(`https://cook-sync-server.vercel.app/api/reviews/${mealId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

const updateMealDetails = async (mealId, updateData) => {
  const res = await fetch(`https://cook-sync-server.vercel.app/api/meals/${mealId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error("Failed to update meal");
  return res.json();
};

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState("");

  const { data: meal, isLoading, isError } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMealById(id),
  });

  const { data: userData,isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async() => {
      try{
        const res = await secureFetch(`https://cook-sync-server.vercel.app/users/${user.email}`);
        return res.data;
      }
      catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    },
    enabled: !!user?.email, // Only run if user is logged in
  });


  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
  });

  const likeMeal = useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://cook-sync-server.vercel.app/api/meals/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });
      if (!res.ok) throw new Error("Failed to like");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["meal", id]);
    },
  });

  const updateMeal = useMutation({
    mutationFn: ({ mealId, updateData }) => updateMealDetails(mealId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(["meal", id]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update meal details.", "error");
    },
  });

  const addReview = useMutation({
    mutationFn: async (review) => {
      const res = await fetch(`https://cook-sync-server.vercel.app/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error("Failed to add review");
      return res.json();
    },
    onSuccess: () => {
      setNewReview("");
      refetchReviews();
      updateMeal.mutate({
        mealId: id,
        updateData: { reviewCount: (meal.reviewCount || 0) + 1 },
      });

      Swal.fire("Review added!", "", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to add review.", "error");
    },
  });

  if (isLoading) return <p className="text-center my-10">Loading meal details...</p>;
  if (isError) return <p className="text-center my-10">Error loading meal details</p>;

  const handleLike = () => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/SignUp");
      return;
    }
    likeMeal.mutate();
  };

  const handleRequestMeal = async () => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/SignUp");
      return;
    }
    if (isUserLoading) {
      console.log("User data:", userData);
      return;
    }
    const badge = userData?.badge;
    console.log("User badge:", badge);
    // return;

    if (badge === "bronze") {
      Swal.fire('Warning', 'You need to upgrade your membership to request meals.', 'warning');
      navigate("/");
      return;
    }

    // If user has a valid badge, post their badge info with the request
    const requestData = {
      userName: user.displayName,
      userEmail: user.email,
      mealId: meal._id,
      mealTitle: meal.title,
      distributorName: meal.distributorName,
      status: "Pending",
      requestTime: new Date().toISOString(),
      userBadge: user.badge,
    };

    try {
      const res = await fetch("https://cook-sync-server.vercel.app/api/mealRequests", {
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

  const handleAddReview = () => {
    if (!user) {
      Swal.fire("Please login first", "", "warning");
      navigate("/SignUp");
      return;
    }

    if (newReview.trim() === "") {
      Swal.fire("Please enter a review before submitting.", "", "warning");
      return;
    }

    const reviewPayload = {
      userEmail: user.email,
      userName: user.displayName,
      mealId: meal._id,
      mealTitle: meal.title,
      distributorName: meal.distributorName,
      review: newReview.trim(),
      createdAt: new Date().toISOString(),
    };

    addReview.mutate(reviewPayload);
  };

  if (isLoading || isUserLoading) return <p className="text-center my-10">Loading...</p>;
// console.log("Meal data:", meal);
// console.log("User data:", userData);

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
              className="btn bg-[#630000] text-white hover:bg-[#810000] rounded-full"
              disabled={likeMeal.isLoading}
            >
              <FaThumbsUp /> {meal.likes || 0} Likes
            </button>
            <button
              onClick={handleRequestMeal}
              className="btn bg-[#630000] hover:bg-[#810000] text-white rounded-full"
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
          {reviews.length > 0 ? (
            reviews.map(({ _id, userName, review, createdAt }) => (
              <div key={_id} className="bg-base-200 rounded-xl p-4 text-gray-700">
                <p className="font-semibold">{userName}</p>
                <p className="italic text-sm text-gray-600">
                  {new Date(createdAt).toLocaleString()}
                </p>
                <p className="mt-2">{review}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <textarea
            rows={4}
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="textarea textarea-bordered resize-none"
            disabled={addReview.isLoading}
          ></textarea>
          <button
            onClick={handleAddReview}
            className="btn bg-[#630000] hover:bg-[#810000] text-white rounded-full px-6 self-end"
            disabled={addReview.isLoading}
          >
            {addReview.isLoading ? "Submitting..." : "Add Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
