import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router"; // make sure you're using react-router-dom v6+

const fetchMeals = async ({ pageParam = 0, queryKey }) => {
  const [_key, searchQuery, category, priceRange] = queryKey;
  const [min, max] = priceRange;

  const params = new URLSearchParams({
    search: searchQuery || "",
    category: category || "All",
    priceMin: min.toString(),
    priceMax: max.toString(),
    skip: pageParam.toString(),
    limit: "9",
  });

  const res = await fetch(`https://cook-sync-server.vercel.app/api/meals?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }
  return res.json();
};

const AllMeals = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["meals", searchQuery, category, priceRange],
    queryFn: fetchMeals,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flat().length;
      return lastPage.length === 0 ? undefined : loaded;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [searchQuery, category, priceRange, refetch]);

  const visibleMeals = data?.pages.flat() || [];

  // Handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePriceChange = (e) =>
    setPriceRange(e.target.value.split("-").map(Number));

  return (
    <div className="container mx-auto jost-font px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#630000]">
        Explore All Meals
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
        <input
          type="text"
          placeholder="Search Meals..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input input-bordered w-full md:max-w-xs"
        />

        <select
          className="select select-bordered w-full md:max-w-xs"
          value={category}
          onChange={handleCategoryChange}
        >
          <option>All</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>

        <select
          className="select select-bordered w-full md:max-w-xs"
          value={priceRange.join("-")}
          onChange={handlePriceChange}
        >
          <option value="0-100">All Prices</option>
          <option value="0-10">$0 - $10</option>
          <option value="10-20">$10 - $20</option>
          <option value="20-50">$20 - $50</option>
        </select>
      </div>

      {isLoading && <p className="text-center">Loading meals...</p>}
      {isError && (
        <p className="text-center text-red-500">
          Error: {error.message || "Something went wrong"}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <InfiniteScroll
            dataLength={visibleMeals.length}
            next={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            loader={
              <h4 className="text-center text-gray-500 my-6">
                Loading more meals...
              </h4>
            }
          >
            <div className="grid md:grid-cols-3 gap-8">
              {visibleMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="border border-[#630000] rounded-xl bg-white shadow-md hover:shadow-lg transition hover:-translate-y-1"
                >
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-56 object-cover rounded-t-xl"
                  />
                  <div className="p-4 space-y-3">
                    <h2 className="font-bold text-lg text-[#630000]">
                      {meal.title}
                    </h2>
                    <p className="badge badge-outline">{meal.category}</p>
                    <div className="flex items-center gap-2 text-yellow-500">
                      <FaStar />{" "}
                      <span className="font-medium text-gray-700">
                        {meal.rating}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      ${meal.price}
                    </p>
                    <button
                      onClick={() => navigate(`/meal/${meal._id}`)}
                      className="btn btn-outline bg-[#630000] text-white w-full rounded-full"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>

          {isFetchingNextPage && (
            <p className="text-center my-6 text-gray-500">Fetching more...</p>
          )}
        </>
      )}
    </div>
  );
};

export default AllMeals;
