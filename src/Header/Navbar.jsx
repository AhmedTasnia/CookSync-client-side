import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FiBell } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setIsLoggedIn(true);
    navigate("/SignUp");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const commonLinks = (
    <>
      <li>
        <NavLink to="/" className="hover:text-[#810000]">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/meals" className="hover:text-[#810000]">
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink to="/upcoming-meals" className="hover:text-[#810000]">
          Upcoming Meals
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="px-4 navbar shadow-sm bg-[#1B1717] text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3">

        {/* Left side: Hamburger + Logo */}
        <div className="flex items-center gap-4">

          {/* Mobile Hamburger */}
          <div className="lg:hidden dropdown dropdown-start">
            <label tabIndex={0} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="lucide-menu"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-white text-black rounded-xl w-52 space-y-1"
            >
              {commonLinks}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
              alt="logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold hidden lg:block">
              Cook <span className="text-2xl text-[#810000]">Sync</span>
            </h1>
          </Link>
        </div>

        {/* Right side: Notification & Auth */}
        <div className="flex items-center gap-4">
          <FiBell className="text-2xl hover:text-[#B8CFCE] cursor-pointer" />

          {!isLoggedIn ? (
            <button
              className="btn btn-sm bg-[#810000] text-white hover:bg-[#EAEFEF] hover:text-black border-0 rounded-full px-5"
              onClick={handleLoginClick}
            >
              Join Us
            </button>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar cursor-pointer"
              >
                <div className="w-10 rounded-full ring ring-offset-2 ring-[#810000]">
                  {/* Placeholder for profile image */}
                  <img src="https://i.pravatar.cc/40" alt="profile" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white text-black rounded-xl w-52"
              >
             <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-left w-full">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NavBar;
