import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaMedal } from "react-icons/fa";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";

const fetchUserProfile = async (email) => {
  const res = await secureFetch(`http://localhost:3000/users/${email}`);
  return res.data; // Axios style: data property contains the response body
};

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: () => fetchUserProfile(user.email),
    enabled: !!user?.email,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto jost-font bg-[#810000] text-white rounded-xl shadow-md p-4 sm:p-8 mt-8 sm:mt-14 text-center">
        Loading profile...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-3xl mx-auto jost-font bg-[#810000] text-white rounded-xl shadow-md p-4 sm:p-8 mt-8 sm:mt-14 text-center">
        User profile not found.
      </div>
    );
  }

  const badgeColors = {
    gold: "text-yellow-400",
    bronze: "text-orange-400",
    silver: "text-gray-400",
    default: "text-gray-300",
  };

  return (
    <div className="max-w-3xl mx-auto jost-font bg-[#810000] text-white rounded-xl shadow-md p-4 sm:p-8 mt-8 sm:mt-14">
      {/* Header */}
      <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">My Profile</h2>

      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <img
          src={profile.photo || user?.photoURL || "https://i.postimg.cc/3x1f5z6C/user.png"}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary object-cover"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-200">
          {profile.name || user?.displayName || "Your Name"}
        </h3>
        <p className="text-gray-300 text-sm sm:text-base">{profile.email || user?.email || "your@email.com"}</p>
      </div>

      {/* Badges Section */}
      <div className="mt-8 sm:mt-10 text-center">
        <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Your Badges</h4>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {/* Display user's badge */}
          <div className="flex flex-col items-center">
            <FaMedal
              size={32}
              className={`sm:size-[40px] ${
                badgeColors[profile.badge?.toLowerCase()] || badgeColors.default
              }`}
            />
            <span className="mt-1 sm:mt-2 font-semibold text-gray-300 text-sm sm:text-base">
              {profile.badge ? profile.badge.charAt(0).toUpperCase() + profile.badge.slice(1) : "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
