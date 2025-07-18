import React from "react";
import { createBrowserRouter } from "react-router"; // ✅ Use react-router-dom, not react-router
import Root from "../pages/Root/root";
import SignUp from "../Components/JoinUs/SignUp";
import MealDetails from "../Components/MealDetails/MealDetails";
import Register from "../Components/Register/Register";
import AllMeals from "../AllMeals/AllMeals";
import UpcomingMeals from "../UpcomingMeal/UpcomingMeal";
import HomeLayout from "../layouts/HomeLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";
import UserDashBoard from "../pages/DashBoard/UserDashBoard";
import AdminDashBoard from "../pages/DashBoard/AdminDashBoard";

// New imports for Dashboard

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: "/AllMeals",
        element: <AllMeals />,
      },
      {
        path: "/UpcomingMeals",
        element: <UpcomingMeals />,
      },
      {
        path: "/mealDetails",
        element: <MealDetails />,
      },
    ],
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    Component: DashBoardLayout ,
    children: [
      {
        path: "user",
        Component: UserDashBoard,
      },
      {
        path: "admin",
        Component: AdminDashBoard,
      },
      
    ],
  },
]);
