import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import NavBar from '../Header/Navbar';
import Footer from '../Footer/Footer';
import { auth } from '../../firebase/firebase.config';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../provider/AuthProvider';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const { register: formRegister, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const { setUser } = useContext(AuthContext);

  const saveUserToDB = async (user) => {
    const newUser = {
      name: user.displayName || "No name",
      email: user.email,
      photo: user.photoURL || "",
      role: "user"
    };

    await fetch('http://localhost:3000/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
  };

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setPhotoURL(data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL || "",
      });

      setUser(user);
      await saveUserToDB(user); // ✅ Save to MongoDB after profile update

      reset();
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        confirmButtonColor: '#630000',
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Registration Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setUser(result.user);
        await saveUserToDB(result.user); // ✅ Save Google user to MongoDB
        Swal.fire({
          icon: "success",
          title: `Logged in as ${result.user.displayName}`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Google sign-in failed",
          text: error.message,
        });
      });
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
                  {...formRegister('name', { required: 'Name is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

              <div className="flex items-center relative">
                <FaEnvelope className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="Your Email"
                  {...formRegister('email', { required: 'Email is required' })}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

              <div className="relative flex items-center">
                <FaImage className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center relative">
                <FaLock className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...formRegister('password', { required: 'Password is required' })}
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
                <a href="/login" className="text-blue-600 hover:underline">
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
                onClick={handleGoogleSignIn}
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
