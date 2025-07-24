import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="flex justify-center mt-6 gap-2 flex-wrap">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            currentPage === index + 1
              ? "bg-[#810000] text-white"
              : "bg-white text-[#810000] border-[#810000]"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
