import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Phone, CreditCard, Info, Calendar, Users, Coffee, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PlanVisit = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const museums = [
    {
      name: "The Louvre",
      location: "Paris, France",
      hours: "9:00 AM - 6:00 PM",
      price: "₹100",
      image: "https://www.theartlifegallery.com/blog/wp-content/uploads/2023/08/Image-01-1.jpg"
    },
    {
      name: "The British Museum",
      location: "London, UK",
      hours: "10:00 AM - 5:00 PM",
      price: "₹150",
      image: "https://cdn.londonandpartners.com/asset/british-museum_museum-frontage-image-courtesy-of-the-british-museum_f0b0a5a3c53f8fc1564868c561bd167c.jpg"
    },
    {
      name: "Metropolitan Museum",
      location: "New York, USA",
      hours: "10:00 AM - 5:30 PM",
      price: "₹200",
      image: "https://assets.simpleviewinc.com/simpleview/image/upload/q_75/v1/crm/newyorkstate/Facade_Met5th_62DB3BB2-193F-48A6-9FA62977A690DB11_306fa88b-c2be-fb5c-f679971ac40debdf.jpg"
    },
    {
      name: "The National Gallery",
      location: "London, England",
      hours: "10:30 AM - 6:00 PM",
      price: "₹250",
      image: "https://d.newsweek.com/en/full/1528161/7-best-museums-london.jpg?w=1200&f=c4a7fbfa16b0266a94f7dff69b55f4ad?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Uffizi Galleries",
      location: "Florence, Italy",
      hours: "8:15 AM - 6:50 PM",
      price: "₹300",
      image: "https://media.cntraveler.com/photos/5c421f204b27de229775c27d/16:9/w_2560,c_limit/GettyImages-511081519.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "State Hermitage",
      location: "St. Petersburg, Russia",
      hours: "10:30 AM - 6:00 PM",
      price: "₹350",
      image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
  ];

  const visitInfo = [
    {
      icon: Clock,
      title: "Opening Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday - Sunday: 10:00 AM - 8:00 PM",
        "Public Holidays: 10:00 AM - 5:00 PM"
      ]
    },
    {
      icon: CreditCard,
      title: "Admission Fees",
      details: [
        "Adults: Varies by museum",
        "Students (with ID): Discounted rates",
        "Children (under 12): Often free",
        "Seniors (65+): Discounted rates"
      ]
    },
    {
      icon: MapPin,
      title: "Locations",
      details: [
        "Multiple locations worldwide",
        "See museum details for specific addresses",
        "Interactive maps available"
      ]
    },
    {
      icon: Phone,
      title: "Contact",
      details: [
        "Email: info@museumgo.com",
        "Support: help@museumgo.com",
        "Phone: +1 (555) 123-4567"
      ]
    }
  ];

  const guidelines = [
    {
      icon: Camera,
      title: "Photography",
      text: "Photography policies vary by museum. Check individual museum guidelines."
    },
    {
      icon: Coffee,
      title: "Food & Drinks",
      text: "Most museums have cafés but restrict food in exhibition areas."
    },
    {
      icon: Users,
      title: "Group Visits",
      text: "Special rates and guided tours available for groups of 10 or more."
    },
    {
      icon: Info,
      title: "Accessibility",
      text: "All partner museums are wheelchair accessible with various support services."
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Featured
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Museums
              </motion.span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Explore our curated selection of world-renowned museums. Each offers unique experiences and masterpieces of human creativity.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {museums.map((museum, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={museum.image}
                    alt={museum.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{museum.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      {museum.location}
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      {museum.hours}
                    </p>
                    <p className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                      Price : {museum.price}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/chatbot')}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Book Tickets
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Visit Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {visitInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                  <ul className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-600">{detail}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Guidelines */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visitor Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guidelines.map((guideline, index) => {
                const Icon = guideline.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="flex items-start space-x-4"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{guideline.title}</h3>
                      <p className="text-gray-600">{guideline.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/guide"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <Info className="w-5 h-5 mr-2" />
                View Museum Guide
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanVisit;