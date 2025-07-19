import React from "react";
import { createBrowserRouter } from "react-router";
import Root from "../pages/Root/root";
import SignUp from "../Components/JoinUs/SignUp";
import MealDetails from "../Components/MealDetails/MealDetails";
import Register from "../Components/Register/Register";
import AllMeals from "../AllMeals/AllMeals";
import UpcomingMeals from "../UpcomingMeal/UpcomingMeal";
import HomeLayout from "../layouts/HomeLayout";
import DashBoardLayout from "../layouts/DashBoardLayout";

// These are the pages you said you want:
import UserProfile from "../pages/DashBoard/UserProfile";
import AdminProfile from "../pages/DashBoard/AdminProfile";
import RequestedMeals from "../pages/DashBoard/requesterdMeal";
import MyReviews from "../pages/DashBoard/MyReviews";
import PaymentHIstory from "../pages/DashBoard/PaymentHIstory";
import ManageUser from "../pages/DashBoard/ManageUser";
import AllReviews from "../pages/DashBoard/AllReviews";
import AddMeal from "../pages/DashBoard/AddMeal";
import ServedMeal from "../pages/DashBoard/ServedMeal";
import MealUpcoming from "../pages/DashBoard/Mealupcoming";
import CheckoutPage from "../Components/Checkout/Checkout";
import AdminAllMeals from "../pages/DashBoard/AdminAllMeals";

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
        path: "AllMeals",
        element: <AllMeals />,
      },
      {
        path: "UpcomingMeals",
        element: <UpcomingMeals />,
      },
      {
        path: "mealDetails",
        element: <MealDetails />,
      },
      {
        path: "/checkout/:packageName",
        element: <CheckoutPage />,
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
    element: <DashBoardLayout />,
    children: [
      {
        path: "userProfile",
        element: <UserProfile />,
      },
      {
        path: "adminProfile",
        element: <AdminProfile />,
      },
      {
        path: "requestedMeals",
        element: <RequestedMeals />,
      },
      {
        path: "myReviews",
        element: <MyReviews />,
      },
      {
        path: "paymentHistory",
        element: <PaymentHIstory />,
      },
      {
        path: "manageUsers",
        element: <ManageUser />,
      },
      {
        path: "adminAllMeals",
        element: <AdminAllMeals />,
      },
      {
        path: "allReviews",
        element: <AllReviews />,
      },

      {
        path: "addMeal",
        element: <AddMeal />,
      },
      {
        path: "serveMeals",
        element: <ServedMeal />,
      },
      {
        path: "upcomingMealsAdmin",
        element: <MealUpcoming />,
      },
    ],
  },
]);
