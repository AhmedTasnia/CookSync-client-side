import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaArrowUp, FaTimes, FaUtensils } from "react-icons/fa";
import { AuthContext } from "../../provider/AuthProvider";

const MealUpcoming = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const IMAGE_BB_API_KEY = "YOUR_IMAGE_BB_API_KEY"; // Replace

  const fetchUpcomingMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upcomingMeals?sort=likes");
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch upcoming meals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMeals();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMAGE_BB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
      }
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    if (!imageUrl) {
      alert("Upload an image first.");
      return;
    }
    const mealData = {
      title: formData.title,
      category: formData.category,
      image: imageUrl,
      ingredients: formData.ingredients,
      description: formData.description,
      price: parseFloat(formData.price),
      distributorName: user?.displayName || "",
      distributorEmail: user?.email || "",
      likes: 0,
      reviews_count: 0,
      rating: 0,
    };
    try {
      const res = await fetch("/api/upcomingMeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      if (res.ok) {
        alert("Upcoming meal added!");
        reset();
        setImageUrl("");
        setShowModal(false);
        fetchUpcomingMeals();
      }
    } catch  {
      alert("Failed to add upcoming meal.");
    }
  };

  const handlePublish = async (mealId) => {
    try {
      const res = await fetch(`/api/upcomingMeals/${mealId}/publish`, {
        method: "PATCH",
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((meal) => meal._id !== mealId));
        alert("Meal published to All Meals!");
      } else {
        alert("Failed to publish meal");
      }
    } catch  {
      alert("Error publishing meal");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 jost-font bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#810000]">Upcoming Meals</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
        >
          <FaPlus /> Add Upcoming Meal
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading upcoming meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming meals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#810000] text-white">
              <tr>
                <th className="p-3 text-left">Meal Title</th>
                <th className="p-3 text-center">Likes</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Publish</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(({ _id, title, likes, category }) => (
                <tr key={_id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                  <td className="p-3">{title}</td>
                  <td className="p-3 text-center">{likes}</td>
                  <td className="p-3 text-center">{category}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handlePublish(_id)}
                      className="flex items-center justify-center gap-2 bg-[#810000] text-white px-4 py-2 rounded-lg hover:bg-[#a30000]"
                    >
                      <FaArrowUp /> Publish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#810000] text-white w-full max-w-lg p-8 rounded-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl mb-4 text-center">Add Upcoming Meal</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                {...register("title", { required: "Title required" })}
                className="w-full rounded-lg px-4 py-2 bg-white text-black"
              />
              <select
                {...register("category", { required: "Category required" })}
                className="w-full rounded-lg px-4 py-2 bg-white text-black"
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="w-full"
              />
              {imageUploading && <p>Uploading image...</p>}
              <textarea
                placeholder="Ingredients"
                {...register("ingredients", { required: "Ingredients required" })}
                className="w-full rounded-lg px-4 py-2 bg-white text-black"
                rows={2}
              />
              <textarea
                placeholder="Description"
                {...register("description", { required: "Description required" })}
                className="w-full rounded-lg px-4 py-2 bg-white text-black"
                rows={3}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                {...register("price", { required: "Price required" })}
                className="w-full rounded-lg px-4 py-2 bg-white text-black"
              />
              <button
                type="submit"
                className="w-full bg-white text-[#810000] font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FaUtensils /> Add Meal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealUpcoming;
