# 🍽️ Cook Sync - Premium Meal Management Platform

Welcome to **Cook Sync**, a full-stack web application for managing and subscribing to premium meals. Whether you're a regular user or an admin, this platform is designed to provide a rich and responsive user experience across all devices.

---

## 🔑 Admin Demo Credentials

- **Username/Email:** admin@gmail.com  
- **Password:** 147741

---

## 🌐 Live Site URL

👉 [Visit Live Website](https://mealmania.live)

---

## ✨ Key Features

- ✅ **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices.
- ✅ **Persistent Login**: Users remain logged in even after refreshing protected/private pages.
- ✅ **Protected Routes**: Separate user and admin dashboards with route protection.
- ✅ **Secure Auth**: Firebase-based login and registration with JWT authentication.
- ✅ **Role Management**: Admin and user role control with restricted access.
- ✅ **TanStack Query (React Query)**: Efficient and fast data fetching for all GET operations.
- ✅ **Stripe Payment Integration**: Purchase premium plans (Silver, Gold, Platinum) securely.
- ✅ **Sweet Alerts & Toasts**: Smooth UI notifications for all CRUD and auth operations.
- ✅ **Image Upload via ImageBB**: Admins can upload meal images through ImageBB.
- ✅ **MongoDB Search, Filter, Sorting & Pagination**: Server-side optimization for performance.
- ✅ **Infinite Scrolling**: Seamless loading of meals with infinite scroll components.
- ✅ **JWT & Axios Interceptors**: Persistent authentication across client routes.

---

## 🔐 Environment Variables

- Used `.env` files in both `client/` and `server/` to store sensitive credentials:
  - Firebase API keys
  - MongoDB URI
  - Stripe Secret Key
- `.env` files are excluded from version control using `.gitignore`.

---

## 🧩 Pages & Modules Overview

### 1. 🏠 Home Page
- Responsive Navbar: Logo, links, user profile with dropdown
- Hero Banner: Search meals
- Meals by Category: Breakfast, Lunch, Dinner, All
- Membership Cards: Silver, Gold, Platinum → Checkout route
- Additional Sections: Testimonials, Benefits
- Footer with useful links

### 2. 🍱 Meal Detail Page
- Meal information, likes, ingredients, reviews, request meal button (requires login)
- Users can like and request meals based on their package

### 3. 📋 Meals Page
- Search by name (server-side)
- Filter by category and price range
- Infinite scrolling of meal cards

### 4. ⏳ Upcoming Meals Page
- Display upcoming meals (only premium users can like)
- Publish logic for admins: auto-publish after 10 likes

### 5. 💳 Checkout Page (Private)
- Stripe integration for package subscription
- Assign user badge (Bronze → Silver/Gold/Platinum)
- Confirmation message after payment

### 6. 👥 Join Us (Login/Register)
- React Hook Form for validation
- Social Login options
- New users get Bronze Badge by default

---

## 🧑‍💼 User Dashboard (Private)

- **My Profile**: View name, email, and badge
- **Requested Meals**: Track requested meals with status
- **My Reviews**: Manage own reviews (edit/delete)
- **Payment History**: View all package purchase records

---

## 🛠 Admin Dashboard (Private & Role-Protected)

- **Admin Profile**: Meal count, name, email
- **Manage Users**: Promote to admin, see subscriptions
- **Add Meal**: Upload via ImageBB, use react-hook-form
- **All Meals**: View/update/delete/sort meals
- **Serve Meals**: Deliver requested meals (status: delivered)
- **All Reviews**: Moderate reviews
- **Upcoming Meals**: Publish to main meals after 10+ likes

---

## ⚙️ Technologies Used

- **Frontend:** React, React Router, Tailwind CSS, TanStack Query, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** Firebase Auth (JWT stored in localStorage)
- **Payment:** Stripe
- **Image Hosting:** ImageBB
- **Notifications:** React Hot Toast / SweetAlert2
- **Pagination & Infinite Scroll:** react-infinite-scroll-component
- **Secure Routes:** PrivateRoute & AdminRoute components

---

## 📦 Installation (For Local Development)

### 🔧 Server Setup
```bash
cd server
npm install
touch .env 
npm run dev

