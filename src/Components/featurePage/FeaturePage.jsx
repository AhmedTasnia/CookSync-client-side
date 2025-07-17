import React from "react";
import { GiFarmTractor, GiPartyPopper } from "react-icons/gi";
import { GiKnifeFork } from "react-icons/gi";
import { GiCook } from "react-icons/gi";
import { FaRegSmileBeam } from "react-icons/fa";

const FeaturePage = () => {
  return (
    <div className="container mx-auto flex flex-col justify-center bg-gradient-to-r from-[#fff7f7] via-[#fff1f1] to-[#ffecec] py-20">
      <div className="max-w-7xl mx-auto text-center px-5">
        <h1 className="text-5xl font-bold text-[#630000] mb-14">
          Why Choose Us?
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {/* Feature 1 */}
          <div className="flex flex-col items-center space-y-4">
            <GiFarmTractor className="text-6xl text-[#630000]" />
            <h2 className="text-xl font-semibold text-[#630000]">Local Ingredients</h2>
            <p className="text-gray-600 max-w-xs text-center">
              We source our ingredients locally to ensure freshness and sustainability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center space-y-4">
            <GiKnifeFork className="text-6xl text-[#630000]" />
            <h2 className="text-xl font-semibold text-[#630000]">Haute Cuisine</h2>
            <p className="text-gray-600 max-w-xs text-center">
              Experience top-tier dining with meals crafted by passionate professionals.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center space-y-4">
            <GiCook className="text-6xl text-[#630000]" />
            <h2 className="text-xl font-semibold text-[#630000]">Passionate Chefs</h2>
            <p className="text-gray-600 max-w-xs text-center">
              Our chefs are committed to excellence and creativity in every dish.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center space-y-4">
            <GiPartyPopper className="text-6xl text-[#630000]" />
            <h2 className="text-xl font-semibold text-[#630000]">Happy Clients</h2>
            <p className="text-gray-600 max-w-xs text-center">
              We prioritize customer satisfaction through quality and care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
