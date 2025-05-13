import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-8"
          >
            Experience Museums
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Like Never Before
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10"
          >
            Book your museum visits with our AI-powered chatbot. Get personalized recommendations and skip the queues.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/chatbot"
              className="group flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Book Now
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="group px-6 py-3 text-base font-semibold text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-300"
            >
             <motion.div
                whileHover={{ x: 5 }}
                className="inline-flex items-center"
             >
              Learn More
              <ArrowRight className="w-8 h-4 mr-2" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              ['100+', 'Museums'],
              ['50K+', 'Monthly Visitors'],
              ['99%', 'Satisfaction Rate'],
              ['24/7', 'Support'],
            ].map(([stat, label]) => (
              <div key={label} className="mx-auto text-center">
                <div className="text-3xl font-bold text-blue-600">{stat}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;