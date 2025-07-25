import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaArrowUp, FaTimes, FaUtensils } from "react-icons/fa";
import Swal from "sweetalert2";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AddUpcomingMealModal = ({ onClose, onMealAdded }) => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        Swal.fire("Success", "Image uploaded successfully!", "success");
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    if (!imageUrl) {
      Swal.fire("Oops", "Please upload an image first.", "warning");
      return;
    }

    const mealData = {
      title: formData.title,
      category: formData.category,
      image: imageUrl,
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      description: formData.description,
      price: parseFloat(formData.price),
      distributorName: user?.displayName || "",
      distributorEmail: user?.email || "",
      likes: 0,
      reviewCount: 0,
      rating: 0,
    };

    try {
      const res = await secureFetch(`${BACKEND_URL}/api/upcomingMeals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      if (res.status === 201 || res.status === 200) {
        Swal.fire("Success", "Upcoming meal added!", "success");
        reset();
        setImageUrl("");
        onClose();
        onMealAdded();
      } else {
        Swal.fire("Error", "Failed to add meal", "error");
      }
    } catch {
      Swal.fire("Error", "Network or server error", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[#810000] text-white w-full max-w-lg p-8 rounded-2xl relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl mb-4 text-center">Add Upcoming Meal</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" placeholder="Title" {...register("title", { required: "Title required" })} className="w-full rounded-lg px-4 py-2 bg-white text-black" />
          {errors.title && <p className="text-yellow-400 text-sm">{errors.title.message}</p>}

          <select {...register("category", { required: "Category required" })} className="w-full rounded-lg px-4 py-2 bg-white text-black">
            <option value="">Select Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          {errors.category && <p className="text-yellow-400 text-sm">{errors.category.message}</p>}

          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="w-full" disabled={uploading} />
          {uploading && <p>Uploading image...</p>}
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-full rounded-lg mt-2 mb-2" />}

          <textarea placeholder="Ingredients (comma separated)" {...register("ingredients", { required: "Ingredients required" })} className="w-full rounded-lg px-4 py-2 bg-white text-black" rows={2} />
          {errors.ingredients && <p className="text-yellow-400 text-sm">{errors.ingredients.message}</p>}

          <textarea placeholder="Description" {...register("description", { required: "Description required" })} className="w-full rounded-lg px-4 py-2 bg-white text-black" rows={3} />
          {errors.description && <p className="text-yellow-400 text-sm">{errors.description.message}</p>}

          <input type="number" step="0.01" placeholder="Price" {...register("price", { required: "Price required" })} className="w-full rounded-lg px-4 py-2 bg-white text-black" />
          {errors.price && <p className="text-yellow-400 text-sm">{errors.price.message}</p>}

          <button type="submit" className="w-full bg-white text-[#810000] font-semibold py-2 rounded-lg flex items-center justify-center gap-2" disabled={uploading}>
            <FaUtensils /> Add Meal
          </button>
        </form>
      </div>
    </div>
  );
};

const MealUpcoming = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("User in MealUpcoming:", user);

  const fetchUpcomingMeals = async () => {
    setLoading(true);
    try {
      const res = await secureFetch(`${BACKEND_URL}/api/upcomingMeals?sort=likes`);
      if (res.status !== 200) throw new Error("Failed to fetch meals");
      setMeals(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error", "Failed to fetch upcoming meals.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMeals();
  }, []);

  const handlePublish = async (mealId) => {
    try {
      const res = await secureFetch(`${BACKEND_URL}/api/upcomingMeals/${mealId}/publish`, {
        method: "PATCH",
      });
      if (res.status !== 200) throw new Error("Failed to publish meal");
      setMeals((prev) => prev.filter((meal) => meal._id !== mealId));
      Swal.fire("Success", `Meal published successfully`, "success");
    } catch (error) {
      console.error("Publish error:", error);
      Swal.fire("Error", "Error publishing meal", "error");
    }
  };

  const totalPages = Math.ceil(meals.length / itemsPerPage);
  const paginatedMeals = meals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 jost-font bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-[#810000]">Upcoming Meals</h2>

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#810000] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#a30000] text-sm sm:text-base">
          <FaPlus /> Add Upcoming Meal
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading upcoming meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming meals found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-sm sm:text-base">
              <thead className="bg-[#810000] text-white">
                <tr>
                  <th className="p-2 sm:p-3 text-left">Meal Title</th>
                  <th className="p-2 sm:p-3 text-center">Likes</th>
                  <th className="p-2 sm:p-3 text-center">Category</th>
                  <th className="p-2 sm:p-3 text-center">Publish</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMeals.map(({ _id, title, likes, category }) => (
                  <tr key={_id} className="border-b border-red-800 hover:bg-gray-50 transition">
                    <td className="p-2 sm:p-3">{title}</td>
                    <td className="p-2 sm:p-3 text-center">{likes}</td>
                    <td className="p-2 sm:p-3 text-center">{category}</td>
                    <td className="p-2 sm:p-3 text-center">
                      <button onClick={() => handlePublish(_id)} className="flex items-center justify-center gap-2 bg-[#810000] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#a30000] text-xs sm:text-base">
                        <FaArrowUp /> Publish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === index + 1
                    ? "bg-[#810000] text-white"
                    : "bg-white text-[#810000] border-[#810000]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <AddUpcomingMealModal onClose={() => setShowModal(false)} onMealAdded={fetchUpcomingMeals} />
      )}
    </div>
  );
};

export default MealUpcoming;