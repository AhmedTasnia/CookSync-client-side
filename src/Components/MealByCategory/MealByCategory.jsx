import React, { useState } from "react";
import { FaStar, FaUtensils, FaCoffee, FaHamburger, FaConciergeBell } from "react-icons/fa";
import { useNavigate } from "react-router";

const mealsData = {
  Breakfast: [
    { id: "b1", title: "Pancakes Delight", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.5, price: "$5.99" },
    { id: "b2", title: "Healthy Oats", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.2, price: "$4.50" },
    { id: "b3", title: "Fresh Sandwich", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.0, price: "$6.00" },
  ],
  Lunch: [
    { id: "l1", title: "Grilled Chicken", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.8, price: "$8.50" },
    { id: "l2", title: "Pasta Special", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.6, price: "$7.99" },
    { id: "l3", title: "Veggie Salad", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.4, price: "$6.25" },
  ],
  Dinner: [
    { id: "d1", title: "Steak Dinner", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.9, price: "$12.99" },
    { id: "d2", title: "Seafood Platter", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.7, price: "$14.50" },
    { id: "d3", title: "Ramen Bowl", image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif", rating: 4.5, price: "$9.99" },
  ],
};

const allMeals = [...mealsData.Breakfast, ...mealsData.Lunch, ...mealsData.Dinner];

const MembershipCard = () => {
    const [activeTab, setActiveTab] = useState("Breakfast");
    const navigate = useNavigate();

    const icons = {
        Breakfast: <FaCoffee className="text-2xl text-white " />,
        Lunch: <FaHamburger className="text-2xl text-white" />,
        Dinner: <FaUtensils className="text-2xl text-white" />,
        All: <FaConciergeBell className="text-2xl text-white" />,
    };

    const mealsToShow = activeTab === "All" ? allMeals : mealsData[activeTab];

    return (
        <div className="container mx-auto bg-base-100 jost-font py-8 px-2 sm:px-4 md:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#630000]">
                Our Meals Categories
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-10 mb-8 md:mb-12 text-lg sm:text-xl md:text-3xl text-[#1B1717]">
                {["Breakfast", "Lunch", "Dinner", "All"].map((tab) => (
                    <button
                        key={tab}
                        className={`
                            btn rounded-full jost-font px-6 sm:px-8 md:px-10 transition duration-300
                            ${activeTab === tab
                                ? "bg-red-700 text-white shadow-lg border-none"
                                : "bg-[#630000] text-white hover:bg-[#810000] hover:text-white"}
                            flex items-center gap-2 sm:gap-3 text-base sm:text-lg
                        `}
                        onClick={() => setActiveTab(tab)}
                    >
                        {icons[tab]}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                {mealsToShow.map((meal) => (
                    <div
                        key={meal.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-1 duration-300 border-2 border-[#630000] flex flex-col"
                    >
                        <div className="overflow-hidden rounded-t-2xl">
                            <img
                                src={meal.image}
                                alt={meal.title}
                                className="h-48 sm:h-56 md:h-64 w-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                            <h2 className="text-lg sm:text-xl font-bold text-[#630000]">{meal.title}</h2>
                            <div className="flex items-center gap-1 sm:gap-2 text-yellow-500">
                                <FaStar /> <span className="font-medium text-gray-700">{meal.rating}</span>
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-gray-700">{meal.price}</p>
                            <button
                                onClick={() => navigate(`/meal/${meal.id}`)}
                                className="btn btn-outline bg-[#630000] text-white w-full rounded-full border-[#630000] hover:bg-white hover:text-[#630000] mt-auto"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembershipCard;
