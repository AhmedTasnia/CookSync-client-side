import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaUser, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import NavBar from '../Header/Navbar';
import Footer from '../Footer/Footer';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Collected Data:', data);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen jost-font bg-white flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">

          <div className="md:w-1/2 p-8 md:p-10 bg-red-50">
            <h2 className="text-3xl font-bold mb-6 text-[#630000]">Create Your Account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">


              <div className="flex items-center relative">
                <FaUser className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Your Name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}


              <div className="flex items-center relative">
                <FaEnvelope className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}


              <div className="flex items-center relative">
                <FaImage className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Photo URL"
                  {...register('photo', { required: 'Photo URL is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.photo && <p className="text-red-500 text-xs">{errors.photo.message}</p>}

              <div className="flex items-center relative">
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
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

              
              <p className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <a href="/SignUp" className="text-blue-600 hover:underline">
                  Login
                </a>
              </p>

             
              <button
                type="submit"
                className="w-full bg-red-800 text-white py-3 rounded-full hover:bg-[#630000] transition duration-200"
              >
                Sign Up
              </button>

              <button
                type="button"
                className="w-full bg-red-200 hover:bg-red-400 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
              >
                <FcGoogle className="text-xl" />
                Sign in with Google
              </button>
            </form>
          </div>

          <div className="md:w-1/2 bg-white flex items-center justify-center p-6">
            <img
              src="https://i.postimg.cc/T1KvHJNB/document-icon-comic-style-report-cartoon-vector-illustration-white-isolated-background-paper-sheet-s.avif"
              alt="Register illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
