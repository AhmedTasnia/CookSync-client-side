import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Root from "../pages/Root/root";
import SignUp from "../Components/JoinUs/SignUp";
import MealDetails from "../Components/MealDetails/MealDetails";
import Register from "../Components/Register/Register";
import AllMeals from "../AllMeals/AllMeals";
import UpcomingMeals from "../UpcomingMeal/UpcomingMeal";
import HomeLayout from "../layouts/HomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: Root,
      },
      {
        path: "/AllMeals",
        Component: AllMeals,
      },
      {
        path: "/UpcomingMeals",
        Component: UpcomingMeals,
      },
    ],
  },
  {
    path: "/SignUp",
    Component: SignUp,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/mealDetails",
    Component: MealDetails,
  },
]);
