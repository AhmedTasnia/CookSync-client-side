import React, { useContext, useState, useEffect } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(null); // Will hold "admin" or "user"

  // Fetch user info including role from backend by email
  useEffect(() => {
    if (!user?.email) return;

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const userData = await res.json();

        if (userData && userData.role) {
          setRole(userData.role);

          // Navigate based on role
          if (userData.role === "admin") {
            navigate("/dashboard/adminProfile", { replace: true });
          } else {
            navigate("/dashboard/userProfile", { replace: true });
          }
        } else {
          // If no role found, fallback to user dashboard
          setRole("user");
          navigate("/dashboard/userProfile", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // fallback navigation
        setRole("user");
        navigate("/dashboard/userProfile", { replace: true });
      }
    };

    fetchUserRole();
  }, [user, navigate]);

  // Define links for admin and user
  const adminLinks = [
    { to: "/dashboard/adminProfile", label: "Admin Profile", icon: <FaUserCircle /> },
    { to: "/dashboard/manageUsers", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/addMeal", label: "Add Meal", icon: <FaUtensils /> },
    { to: "/dashboard/adminAllMeals", label: "All Meals", icon: <FaClipboardList /> },
    { to: "/dashboard/AllReviews", label: "All Reviews", icon: <FaComments /> },
    { to: "/dashboard/serveMeals", label: "Serve Meals", icon: <FaUtensils /> },
    { to: "/dashboard/upcomingMealsAdmin", label: "Upcoming Meals", icon: <FaClipboardList /> },
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

  // Show loading or nothing until role is fetched
  if (!role) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-screen h-screen jost-font bg-gray-50 relative">
      {/* Hamburger for small devices */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl text-[#810000]">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 lg:static top-0 left-0 h-screen w-64 bg-[#1B1717] text-white p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto`}
      >
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
              alt="logo"
              className="h-15 w-12 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold">
              Cook <span className="text-3xl text-[#810000]">Sync</span>
            </h1>
          </Link>

          <div className="flex flex-col items-center mb-10 mt-10">
            <img
              src={user?.photoURL || "https://i.postimg.cc/3x1f5z6C/user.png"}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
            />
            <p className="font-semibold mt-4 text-white">{user?.displayName || "User"}</p>
            <p className="text-sm text-gray-300">{user?.email || "user@example.com"}</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3">
              {(isAdmin ? adminLinks : userLinks).map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-full transition ${
                        isActive
                          ? "bg-[#810000] text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
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

        <button
          onClick={handleExit}
          className="flex items-center justify-center gap-2 text-red-400 hover:text-red-500 font-semibold px-4 py-2 mt-6 rounded-full border border-red-400 hover:bg-red-800 hover:bg-opacity-10 transition"
        >
          <FaSignOutAlt size={18} />
          Exit
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
