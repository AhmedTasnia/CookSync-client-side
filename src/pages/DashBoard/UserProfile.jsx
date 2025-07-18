import React, { useContext } from "react";
import { FaMedal } from "react-icons/fa";
import { AuthContext } from "../../provider/AuthProvider";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto jost-font bg-[#810000] text-white rounded-xl shadow-md p-4 sm:p-8 mt-8 sm:mt-14">
      {/* Header */}
      <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">My Profile</h2>

      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <img
          src={user?.photoURL || "https://i.postimg.cc/3x1f5z6C/user.png"}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary object-cover"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-200">
          {user?.displayName || "Your Name"}
        </h3>
        <p className="text-gray-300 text-sm sm:text-base">{user?.email || "your@email.com"}</p>
      </div>

      {/* Badges Section */}
      <div className="mt-8 sm:mt-10 text-center">
        <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Your Badges</h4>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <FaMedal size={32} className="sm:size-[40px] text-yellow-500" />
            <span className="mt-1 sm:mt-2 font-semibold text-gray-300 text-sm sm:text-base">Gold</span>
          </div>
          <div className="flex flex-col items-center">
            <FaMedal size={32} className="sm:size-[40px] text-orange-400" />
            <span className="mt-1 sm:mt-2 font-semibold text-gray-300 text-sm sm:text-base">Bronze</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
