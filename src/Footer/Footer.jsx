import React from 'react';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1B1717] text-white py-8 px-4 jost-font">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        <div className="flex flex-col items-start">
          <img
              src="https://i.postimg.cc/SKZ0ZzdB/Asian-street-2.png"
            alt="Logo"
            className="w-32 mb-3"
          />
          <p className="text-white text-4xl">Cook Sync</p>
          <p className="text-gray-400 text-sm mt-2">Experience good food at your own place. </p>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col mt-4">
          <h4 className="text-sm text-gray-400 mb-2">Connect with us</h4>
          <p className="mb-1">Social media channels</p>
          <div className="flex gap-4 mt-2 text-white text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaGooglePlusG />
            <FaInstagram />
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='mt-4'>
          <h4 className="text-sm text-gray-400 mb-2 ">Newsletter sign up</h4>
          <p className="mb-2">Sign up for getting the experience</p>
          <div className="flex overflow-hidden rounded-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-white outline-white border-2 border-[#B8CFCE] bg-transparent focus:border-[#b19472] focus:ring-0"
            />
            <button className="bg-[#B8CFCE] px-4 py-2 text-white">Sign Up</button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Is this your website?{" "}
            <a href="#" className="text-[#b19472] underline">
              Claim your form
            </a>{" "}
            to manage and email your new subscribers!
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-sm text-gray-100 text-center mt-8">
        <p>© 2025 Product Review Theme by Cook Sync. All rights reserved.</p>
        <p>Proudly powered by Cook Sync.</p>
      </div>
    </footer>
  );
};

export default Footer;
