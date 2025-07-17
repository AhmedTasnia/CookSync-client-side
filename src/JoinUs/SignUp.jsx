import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from 'react-router';
import NavBar from '../Header/Navbar';
import Footer from '../Footer/Footer';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log('Collected Data:', data);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen jost-font flex items-center justify-center bg-white px-2">
        <div className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">

          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-8 rounded-l-3xl">
            <img
              src="https://i.postimg.cc/mgXYw24h/tablet-login-concept-illustration-114360-7863.avif"
              alt="Login illustration"
              className="w-3/4 md:w-full h-auto object-contain"
            />
          </div>

          <div className="w-full md:w-1/2 bg-red-50 p-6 md:p-10 rounded-r-3xl">
            <h2 className="text-3xl font-semibold text-[#630000] mb-2">Cook Sync</h2>
            <p className="text-sm text-gray-600 mb-6">Hey! Enter your details to sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

              <div className="text-right -mt-3">
                <button type="button" className="text-sm text-red-500 hover:underline">Forgot password?</button>
              </div>

              <button
                type="button"
                className="w-full bg-red-200 hover:bg-red-400 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
              >
                <FcGoogle className="text-2xl" />
                <span className="font-medium">Login with Google</span>
              </button>

              <button
                type="submit"
                className="w-full bg-red-800 text-white py-3 rounded-full hover:bg-[#630000] transition duration-200"
              >
                Login
              </button>

              <Link to="/register" className="w-full md:w-auto block">
                <p className="mt-4 text-sm text-center text-gray-600">
                  Don’t have an account? <span className="text-blue-600 hover:underline">Create new account</span>
                </p>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
