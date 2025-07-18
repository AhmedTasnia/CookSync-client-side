import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaUtensils,
  FaListAlt,
  FaImage,
  FaClipboardList,
  FaDollarSign,
  FaUser,
  FaEnvelope,
  FaPlusCircle,
} from "react-icons/fa";
import { AuthContext } from "../../provider/AuthProvider";

const AddMeal = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const IMAGE_BB_API_KEY = "YOUR_IMAGE_BB_API_KEY"; // replace with your key

  const handleImageUpload = async (file) => {
    setUploadError("");
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
      } else {
        setUploadError("Failed to upload image");
      }
    } catch  {
      setUploadError("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    if (!imageUrl) {
      alert("Please upload an image before submitting");
      return;
    }

    const mealData = {
      title: formData.title,
      category: formData.category,
      image: imageUrl,
      ingredients: formData.ingredients,
      description: formData.description,
      price: parseFloat(formData.price),
      postTime: new Date().toISOString(),
      distributorName: user?.displayName || "",
      distributorEmail: user?.email || "",
      rating: 0,
      likes: 0,
      reviews_count: 0,
    };

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      if (response.ok) {
        alert("Meal added successfully!");
        reset();
        setImageUrl("");
      } else {
        alert("Failed to add meal");
      }
    } catch {
      alert("Error adding meal");
    }
  };

  return (
    <div className="max-w-5xl jost-font mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center">Add Meal</h2>
      <p className="text-center text-gray-700 mb-8 max-w-4xl mx-auto">
        Use this form to add new meal details including title, category, ingredients, and more.
        Upload an image and provide accurate information to help users discover delicious meals.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaUtensils /> Title
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#810000]"
            placeholder="Enter meal title"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaListAlt /> Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#810000]"
            defaultValue=""
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaImage /> Meal Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="w-full rounded-lg"
          />
          {imageUploading && (
            <p className="text-blue-600 mt-1">Uploading image...</p>
          )}
          {uploadError && <p className="text-red-600 mt-1">{uploadError}</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded meal"
              className="mt-3 w-48 h-32 object-cover rounded-lg mx-auto"
            />
          )}
        </div>

        {/* Ingredients */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaClipboardList /> Ingredients
          </label>
          <textarea
            {...register("ingredients", { required: "Ingredients are required" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#810000]"
            rows={3}
            placeholder="Separate ingredients by commas"
          />
          {errors.ingredients && (
            <p className="text-red-600 text-sm mt-1">{errors.ingredients.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaClipboardList /> Description
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#810000]"
            rows={4}
            placeholder="Describe the meal"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaDollarSign /> Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#810000]"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Distributor Name (readonly) */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaUser /> Distributor Name
          </label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Distributor Email (readonly) */}
        <div>
          <label className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
            <FaEnvelope /> Distributor Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || imageUploading}
          className="w-full flex items-center justify-center gap-2 bg-[#810000] text-white px-6 py-3 rounded-lg hover:bg-[#a30000] transition disabled:opacity-50"
        >
          <FaPlusCircle />
          {isSubmitting ? "Adding Meal..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
