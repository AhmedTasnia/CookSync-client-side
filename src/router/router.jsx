import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../pages/Root/root';
import SignUp from '../JoinUs/SignUp';
import Register from '../JoinUs/Register';
import MealDetails from '../MealDetails/MealDetails';
import AllMeals from '../AllMeals/AllMeals';


export const router = createBrowserRouter([
  {
    path: "/",
    Component:Root,
    children: [
      {
        index: true,
        path: "/",
      },
    ]
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
  {
    path: "/AllMeals",
    Component: AllMeals,
  },
  
]);

  
