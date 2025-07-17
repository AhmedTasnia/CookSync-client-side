import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FiBell } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const commonLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-[#810000] underline pb-1" : "text-white"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) =>
            isActive ? "text-[#810000] underline pb-1" : "text-white"
          }
        >
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/upcoming-meals"
          className={({ isActive }) =>
            isActive ? "text-[#810000] underline pb-1" : "text-white"
          }
        >
          Upcoming Meals
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="px-4 navbar shadow-sm jost-font bg-[#1B1717] text-white">
      <div className="container mx-auto flex justify-between items-center">

        <div className="flex items-center gap-2 ml-2">
          <NavLink to="/">
            <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
              alt="logo"
              className="h-15 w-15 rounded-full object-cover"
            />
          </NavLink>
          <h1 className="text-xl jost-font font-bold hidden lg:block">
            Cook <span className="text-2xl text-[#810000] jost-font-bold "> Sync</span>
          </h1>
        </div>

        <div className="hidden lg:flex">
          <ul className="flex items-center gap-6">{commonLinks}</ul>
        </div>

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
              <div tabIndex={0} role="button" className="avatar cursor-pointer">
                <div className="w-10 rounded-full ring ring-offset-2 ring-[]">
                  
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 text-black"
              >
                <li className="font-semibold text-center cursor-default">
                  
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
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
