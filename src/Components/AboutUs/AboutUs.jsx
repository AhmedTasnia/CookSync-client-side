import React from "react";
import { useNavigate } from "react-router";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleJoinUs = () => {
    navigate("/SignUp");
  };

  return (
    <div className="container mx-auto bg-gradient-to-r from-[#fff7f7] via-[#fff1f1] to-[#ffecec] jost-font flex items-center bg- justify-center bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-5 py-20">
        <div className="space-y-7 text-[#630000]">
          <h1 className="text-4xl md:text-5xl font-extrabold border-b-4 border-[#630000] text-[#630000] inline-block pb-2">
            ABOUT US
          </h1>
          <p className="text-lg italic text-gray-700">
            Welcome to Cook Sync, a modern hostel meal management system with a focus on quality and satisfaction.
          </p>
          <p className="text-[#1B1717] leading-relaxed">
            We invite you to explore a smarter way to manage hostel meals. Whether you're a student enjoying daily meals or an admin managing operations, our system makes it simple. Share feedback, view meal plans, and experience better dining.
          </p>
          <button
            onClick={handleJoinUs}
            className="ml-2 px-8 py-3 rounded-full bg-[#630000] text-white hover:bg-[#810000] hover:text-white transition"
          >
            Join Us
          </button>
        </div>

        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute top-5 left-5 w-full h-full border-2 border-[#630000]"></div>

          <div className="relative border-4 border-[#630000]">
            <img
              src="https://i.postimg.cc/TPvJWRDB/premium-photo-1673108852141-e8c3c22a4a22.jpg"
              alt="About Us"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
