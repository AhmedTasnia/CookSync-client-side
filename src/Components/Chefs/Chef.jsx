import React, { useState } from "react";
import { motion } from "framer-motion";

const chefs = [
  {
    name: "Chef Gordon Flame",
    specialty: "Grilled Cuisine",
    image: "https://i.pravatar.cc/150?img=12",
    bio: "Expert in open-fire cooking, blending modern techniques with traditional flavors.",
    details:
      "Chef Gordon has won multiple Michelin stars for his unique grilled cuisine. He is passionate about sourcing local ingredients and creating unforgettable dining experiences.",
  },
  {
    name: "Chef Maria Spice",
    specialty: "Italian & Mediterranean",
    image: "https://i.pravatar.cc/150?img=32",
    bio: "Passionate about pasta, pizza, and authentic Mediterranean dishes with a modern twist.",
    details:
      "Chef Maria specializes in handmade pasta and wood-fired pizza. Her dishes are inspired by her grandmother’s traditional recipes with a modern twist.",
  },
  {
    name: "Chef Kenji Tanaka",
    specialty: "Japanese Fusion",
    image: "https://i.pravatar.cc/150?img=50",
    bio: "Master of sushi, ramen, and contemporary Japanese cuisine with creative plating.",
    details:
      "Chef Kenji blends traditional Japanese flavors with modern presentation techniques. He is known for his innovative sushi rolls and ramen bowls.",
  },
  {
    name: "Chef Aisha Rahman",
    specialty: "Middle Eastern Delights",
    image: "https://i.pravatar.cc/150?img=45",
    bio: "Specializes in aromatic spices, rich curries, and slow-cooked Middle Eastern dishes.",
    details:
      "Chef Aisha is renowned for her ability to balance spices perfectly. Her slow-cooked lamb and aromatic rice dishes are among her most famous creations.",
  },
];

const Chefs = () => {
  const [selectedChef, setSelectedChef] = useState(null);

  return (
    <div className="bg-[#1B1717] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-10 mt-20"
        >
          Meet Our <span className="text-[#810000]">Chefs</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {chefs.map((chef, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="card bg-[#333446] shadow-xl text-white hover:shadow-2xl border border-[#810000] rounded-2xl"
            >
              <figure className="px-6 pt-6">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="rounded-full w-32 h-32 object-cover border-4 border-[#810000]"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-xl font-bold text-[#B8CFCE]">
                  {chef.name}
                </h2>
                <p className="italic text-[#EAEFEF]">{chef.specialty}</p>
                <p className="text-sm text-gray-300 mt-2">{chef.bio}</p>
                <div className="card-actions mt-4">
                  <button
                    className="btn btn-sm bg-[#810000] text-white rounded-full hover:bg-[#B8CFCE] hover:text-black px-5"
                    onClick={() => setSelectedChef(chef)}
                  >
                    Know More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedChef && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#333446] text-white p-6 rounded-2xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 relative"
          >
            <button
              onClick={() => setSelectedChef(null)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={selectedChef.image}
                alt={selectedChef.name}
                className="w-32 h-32 rounded-full border-4 border-[#810000] object-cover"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold text-[#B8CFCE]">
                  {selectedChef.name}
                </h2>
                <p className="italic text-[#EAEFEF]">
                  {selectedChef.specialty}
                </p>
                <p className="mt-4 text-gray-300">{selectedChef.details}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Chefs;
