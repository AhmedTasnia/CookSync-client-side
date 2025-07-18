import React, { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import {
  FaUserCircle,
  FaUsers,
  FaUtensils,
  FaClipboardList,
  FaComments,
  FaMoneyCheckAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const isAdmin = user?.email === "admin@gmail.com";


  const adminLinks = [
    { to: "/dashboard/adminProfile", label: "Admin Profile", icon: <FaUserCircle /> },
    { to: "/dashboard/manageUsers", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/addMeal", label: "Add Meal", icon: <FaUtensils /> },
    { to: "/dashboard/allMeals", label: "All Meals", icon: <FaClipboardList /> },
    { to: "/dashboard/AllReviews", label: "All Reviews", icon: <FaComments /> },
    { to: "/dashboard/serveMeals", label: "Serve Meals", icon: <FaUtensils /> },
    { to: "/dashboard/upcomingMeals", label: "Upcoming Meals", icon: <FaClipboardList /> },
  ];

  const userLinks = [
    { to: "/dashboard/userProfile", label: "My Profile", icon: <FaUserCircle /> },
    { to: "/dashboard/requestedMeals", label: "Requested Meals", icon: <FaUtensils /> },
    { to: "/dashboard/myReviews", label: "My Reviews", icon: <FaComments /> },
    { to: "/dashboard/paymentHistory", label: "Payment History", icon: <FaMoneyCheckAlt /> },
  ];

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen jost-font bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B1717] text-white shadow-md flex flex-col p-6 justify-between">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
              alt="logo"
              className="h-15 w-12 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold  lg:block">
              Cook <span className="text-3xl text-[#810000]">Sync</span>
            </h1>
          </Link>

          {/* User Image Center */}
          <div className="flex flex-col items-center mb-10 mt-10">
            <img
              src={user?.photoURL || "https://i.postimg.cc/3x1f5z6C/user.png"}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
            />
            <p className="font-semibold mt-4 text-white">{user?.displayName || "User"}</p>
            <p className="text-sm text-gray-300">{user?.email || "user@example.com"}</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-3">
              {(isAdmin ? adminLinks : userLinks).map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-full transition ${
                        isActive
                          ? "bg-[#810000] text-white"
                          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`
                    }
                  >
                    <span className="text-lg">{icon}</span>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 font-semibold px-4 py-2 mt-6 rounded-full border border-red-500 hover:bg-red-100 transition"
        >
          <FaSignOutAlt size={18} />
          Exit
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
