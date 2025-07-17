import React from "react";
import { useNavigate } from "react-router";
import { FaMedal, FaCrown, FaGem, FaCheckCircle } from "react-icons/fa";

const MembershipPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (packageName) => {
    navigate(`/checkout/${packageName}`);
  };

  return (
    <div className="container mx-auto bg-gradient-to-br bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#630000] mb-4">Choose Your Membership</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upgrade to enjoy premium features tailored for every lifestyle and need.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Silver */}
          <div
            onClick={() => handleNavigate("Silver")}
            className="cursor-pointer text-center bg-red-50 rounded-lg p-8 shadow-md hover:shadow-lg transition"
          >
            <FaMedal className="text-5xl text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Silver</h2>
            <p className="text-lg text-gray-600 mb-6">$19 / month</p>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Basic Meal Access
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Limited Requests
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Basic Support
              </p>
            </div>
          </div>

          {/* Gold */}
          <div
            onClick={() => handleNavigate("Gold")}
            className="cursor-pointer text-center bg-yellow-50 rounded-lg p-8 shadow-md hover:shadow-lg transition border-2 border-yellow-400"
          >
            <FaCrown className="text-5xl text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">Gold</h2>
            <p className="text-lg text-gray-600 mb-6">$39 / month</p>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Full Meal Access
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Unlimited Requests
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Priority Support
              </p>
            </div>
          </div>

          {/* Platinum */}
          <div
            onClick={() => handleNavigate("Platinum")}
            className="cursor-pointer text-center bg-red-50 rounded-lg p-8 shadow-md hover:shadow-lg transition"
          >
            <FaGem className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Platinum</h2>
            <p className="text-lg text-gray-600 mb-6">$59 / month</p>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Premium Meals
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> Personal Chef Access
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> 24/7 Concierge Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
