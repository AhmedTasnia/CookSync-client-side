import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import Swal from "sweetalert2";
import AuthContext from "../../provider/AuthContext";

const AddMeal = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const mutation = useMutation({
    mutationFn: async (mealData) => {
      const res = await fetch("https://cook-sync-server.vercel.app/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      if (!res.ok) throw new Error("Failed to add meal");
      return res.json();
    },
    onSuccess: () => {
    queryClient.invalidateQueries(["meals"]);
    reset();
    setImageUrl("");
    Swal.fire({
      icon: "success",
      title: "Meal Added!",
      text: "Your meal has been successfully added.",
      confirmButtonColor: "#810000",
    });
  },
  onError: () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong while adding the meal.",
      confirmButtonColor: "#810000",
    });
  },
  });

  // ✅ Image Upload (Cloudinary)
  const handleImageUpload = async (file) => {
    setUploadError("");
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        setUploadError("Failed to upload image");
      }
    } catch (error) {
      setUploadError("Failed to upload image");
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  // ✅ Submit
  const onSubmit = (formData) => {
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

    mutation.mutate(mealData);
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
          {imageUploading && <p className="text-blue-600 mt-1">Uploading image...</p>}
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

        {/* Distributor Name */}
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

        {/* Distributor Email */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || imageUploading || mutation.isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#810000] text-white px-6 py-3 rounded-lg hover:bg-[#a30000] transition disabled:opacity-50"
        >
          <FaPlusCircle />
          {mutation.isLoading ? "Adding Meal..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
