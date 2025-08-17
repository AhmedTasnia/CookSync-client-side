import { motion } from "framer-motion";

const Info = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-[#810000] mb-4 mt-12"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Welcome to our hostel! We are more than just a place to stay – we are
          a community that values comfort, security, and a homely environment
          for every guest. Our mission is to provide quality accommodation at
          affordable prices while ensuring a friendly and inclusive atmosphere.
        </motion.p>
      </div>

      {/* Hostel Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card bg-base-100 shadow-xl border"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-800">Our Vision</h2>
            <p className="text-gray-600">
              To create a safe, peaceful, and modern living space where guests
              feel at home while being part of a vibrant hostel community.
            </p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card bg-base-100 shadow-xl border"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-800">Facilities</h2>
            <p className="text-gray-600">
              Our hostel offers spacious rooms, 24/7 security, Wi-Fi,
              study-friendly spaces, healthy meals, and recreational areas for
              relaxation.
            </p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card bg-base-100 shadow-xl border"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-800">Why Choose Us?</h2>
            <p className="text-gray-600">
              We combine affordability with quality service, ensuring every
              guest enjoys a supportive environment that feels like family.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Additional Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-5xl mx-auto mt-16 text-center"
      >
        <h2 className="text-2xl font-semibold text-[#810000] mb-4">
          Our Commitment
        </h2>
        <p className="text-gray-600">
          At our hostel, we don’t just provide rooms – we provide an experience. 
          Whether you are a student, traveler, or working professional, we ensure 
          that your stay is memorable, safe, and filled with positive energy. 
          Join us and be a part of our family today!
        </p>
      </motion.div>
    </div>
  );
};

export default Info;
