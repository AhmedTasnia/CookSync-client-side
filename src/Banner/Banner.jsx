import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { Typewriter } from "react-simple-typewriter";

const bannerSlides = [
  {
    title: "🍽️ Delicious Meals Every Day!",
    subtitle:
      "Manage your hostel dining experience with ease — view meals, share reviews, and stay updated with upcoming menus.",
    image:
      "https://i.postimg.cc/zBLvzNPc/top-view-table-full-delicious-food-composition-23-2149141352.avif",
  },
  {
    title: "🏠 Streamline Your Hostel Life!",
    subtitle:
      "From meal management to student feedback, everything you need for a better hostel experience is here.",
    image:
      "https://i.postimg.cc/xjz8B0mk/flat-lay-mexican-food-23-2148140227.jpg",
  },
  {
    title: "👨‍🍳 Your Meals. Your Feedback.",
    subtitle:
      "Discover daily meals, share your reviews, and manage your dining experience — all in one place.",
    image: "https://i.postimg.cc/bv5YFMNH/360-F-252388016-Kj-Pn-B9vgl-SCu-UJAum-CDNbm-Mz-Gdz-PAuc-K.jpg",
  },
];

const Banner = () => {
  return (
    <div className="w-full .jost-font">
      <Fade arrows={false} autoplay={true} duration={5000} pauseOnHover={false}>
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className="relative h-[80vh] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 text-center text-white px-4 w-full max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4">
                <Typewriter
                  key={index}
                  words={[slide.title]}
                  loop={1}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </h1>
              <p className="text-lg md:text-xl drop-shadow-md mb-8">
                {slide.subtitle}
              </p>

              <div className="flex items-center justify-center">
                <input
                  type="text"
                  placeholder="Search for any product..."
                  className="rounded-full py-3 px-6 w-[70%] bg-[#1B1717] text-[#EEEBDD] max-w-md outline-none"
                />
                <button className="ml-2 px-8 py-3 rounded-full bg-[#630000] text-white hover:bg-[#810000] hover:text-white transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default Banner;
