import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FiBell } from "react-icons/fi";
import AuthContext from "../../provider/AuthContext";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/SignUp"); // or "/auth/login" if you prefer
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/");
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const commonLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-red-500 underline pb-1" : "text-white"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/AllMeals"
          className={({ isActive }) =>
            isActive ? "text-red-500 underline pb-1" : "text-white"
          }
        >
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/UpcomingMeals"
          className={({ isActive }) =>
            isActive ? "text-red-500 underline pb-1" : "text-white"
          }
        >
          Upcoming Meals
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="px-4 navbar shadow-sm bg-[#1B1717] jost-font text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3">
        <div className="flex items-center gap-4">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#333446] rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              {commonLinks}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
              alt="logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold hidden lg:block">
              Cook <span className="text-3xl text-[#810000]">Sync</span>
            </h1>
          </Link>
        </div>

        <div className="hidden lg:flex">
          <ul className="flex gap-10 items-center justify-center">{commonLinks}</ul>
        </div>

        <div className="flex items-center gap-4 relative">
          <FiBell className="text-2xl hover:text-[#B8CFCE] cursor-pointer" />

          {!user ? (
            <button
              className="btn btn-sm bg-[#810000] text-white hover:bg-[#EAEFEF] hover:text-black border-0 rounded-full px-5"
              onClick={handleLoginClick}
            >
              Join Us
            </button>
          ) : (
            <>
              <button
                onClick={toggleDropdown}
                className="avatar cursor-pointer focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-10 rounded-full ring ring-offset-2 ring-[#810000]">
                  <img
                    src={user.photoURL || "https://i.pravatar.cc/40"}
                    alt="profile"
                    className="object-cover"
                  />
                </div>
              </button>

              {dropdownOpen && (
                <ul
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white text-black rounded-xl w-52 absolute right-0"
                  onClick={() => setDropdownOpen(false)}
                >
                  <li>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200 rounded-t-lg">
                      Dashboard
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogout} className="text-left w-full bg-red-600 px-4 py-2 hover:bg-gray-200 rounded-b-lg">
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
