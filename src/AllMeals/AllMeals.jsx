import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

// Fake 100 meals for demo
const fakeMeals = Array.from({ length: 100 }).map((_, idx) => ({
  id: idx + 1,
  title: `Meal ${idx + 1}`,
  category: ["Breakfast", "Lunch", "Dinner"][idx % 3],
  image: "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif",
  rating: (Math.random() * (5 - 3) + 3).toFixed(1),
  price: Math.floor(Math.random() * 20) + 5,
}));

const AllMeals = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [visibleMeals, setVisibleMeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [displayIndex, setDisplayIndex] = useState(0);

  const limit = 9;

  const filterMeals = () => {
    let filtered = fakeMeals;

    if (searchQuery) {
      filtered = filtered.filter((meal) =>
        meal.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (category !== "All") {
      filtered = filtered.filter((meal) => meal.category === category);
    }
    filtered = filtered.filter(
      (meal) => meal.price >= priceRange[0] && meal.price <= priceRange[1]
    );

    return filtered;
  };

  const fetchMoreMeals = () => {
    const filteredMeals = filterMeals();
    const nextMeals = filteredMeals.slice(displayIndex, displayIndex + limit);
    setVisibleMeals((prev) => [...prev, ...nextMeals]);
    setDisplayIndex(displayIndex + limit);
    setHasMore(displayIndex + limit < filteredMeals.length);
  };

  useEffect(() => {
    const filteredMeals = filterMeals();
    setVisibleMeals(filteredMeals.slice(0, limit));
    setDisplayIndex(limit);
    setHasMore(limit < filteredMeals.length);
  }, [searchQuery, category, priceRange]);

  return (

      <div className="container mx-auto jost-font px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#630000]">Explore All Meals</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <input
            type="text"
            placeholder="Search Meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full md:max-w-xs"
          />

          <select
            className="select select-bordered w-full md:max-w-xs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>

          <select
            className="select select-bordered w-full md:max-w-xs"
            value={priceRange.join("-")}
            onChange={(e) =>
              setPriceRange(e.target.value.split("-").map(Number))
            }
          >
            <option value="0-100">All Prices</option>
            <option value="0-10">$0 - $10</option>
            <option value="10-20">$10 - $20</option>
            <option value="20-50">$20 - $50</option>
          </select>
        </div>

        <InfiniteScroll
          dataLength={visibleMeals.length}
          next={fetchMoreMeals}
          hasMore={hasMore}
          loader={<h4 className="text-center text-gray-500 my-6">Loading more meals...</h4>}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {visibleMeals.map((meal) => (
              <div
                key={meal.id}
                className="border border-[#630000] rounded-xl bg-white shadow-md hover:shadow-lg transition hover:-translate-y-1"
              >
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-56 object-cover rounded-t-xl"
                />
                <div className="p-4 space-y-3">
                  <h2 className="font-bold text-lg text-[#630000]">{meal.title}</h2>
                  <p className="badge badge-outline">{meal.category}</p>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <FaStar /> <span className="font-medium text-gray-700">{meal.rating}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">${meal.price}</p>
                  <button
                    onClick={() => navigate(`/meal/${meal.id}`)}
                    className="btn btn-outline bg-[#630000] text-white w-full rounded-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
  );
};

export default AllMeals;
