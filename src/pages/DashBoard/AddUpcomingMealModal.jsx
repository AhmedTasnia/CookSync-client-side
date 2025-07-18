import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../provider/AuthProvider";

const AddUpcomingMealModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const IMAGE_BB_API_KEY = "YOUR_IMAGE_BB_API_KEY"; // Replace

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMAGE_BB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
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
        onClose();
      }
    } catch  {
      alert("Failed to add upcoming meal.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[#810000] text-white w-full max-w-lg p-8 rounded-2xl relative">
        <button
          onClick={onClose}
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
  );
};

export default AddUpcomingMealModal;
