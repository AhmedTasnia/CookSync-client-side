import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../pages/Root/root';
import SignUp from '../JoinUs/SignUp';
import Register from '../JoinUs/Register';


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
  
]);

  
