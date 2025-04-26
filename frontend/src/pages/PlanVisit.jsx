// PlanVisit.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, CreditCard, Info, Calendar, Users, Coffee, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PlanVisit = () => {
  const navigate = useNavigate();
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
        "Adults: $20",
        "Students (with ID): $15",
        "Children (under 12): Free",
        "Seniors (65+): $15"
      ]
    },
    {
      icon: MapPin,
      title: "Location",
      details: [
        "123 Museum Street",
        "Art City, AC 12345",
        "Located in Downtown"
      ]
    },
    {
      icon: Phone,
      title: "Contact",
      details: [
        "Phone: +1 (555) 123-4567",
        "Email: info@museum.com",
        "Support: help@museum.com"
      ]
    }
  ];

  const guidelines = [
    {
      icon: Camera,
      title: "Photography",
      text: "Photography without flash is permitted in most areas. Some exhibitions may have restrictions."
    },
    {
      icon: Coffee,
      title: "Food & Drinks",
      text: "Food and beverages are not allowed in exhibition areas. Visit our café for refreshments."
    },
    {
      icon: Users,
      title: "Group Visits",
      text: "Groups of 10 or more should book in advance for special rates and guided tours."
    },
    {
      icon: Info,
      title: "Accessibility",
      text: "The museum is fully accessible. Wheelchairs are available free of charge."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plan Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Museum Visit
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make the most of your visit with our comprehensive guide. Book tickets, check opening hours, and discover everything you need to know.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: Calendar,
              title: "Book Tickets",
              description: "Reserve your spot and skip the queue",
              link: "/chatbot",
              color: "from-blue-600 to-indigo-600"
            },
            {
              icon: Users,
              title: "Group Bookings",
              description: "Special rates for groups of 10+",
              link: "/contact",
              color: "from-purple-600 to-pink-600"
            },
            {
              icon: Info,
              title: "Museum Guide",
              description: "Download our digital guide",
              link: "/guide",
              color: "from-green-600 to-teal-600"
            }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </Link>
            )
          })}
        </motion.div>

        {/* Visit Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {visitInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visitor Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{guideline.title}</h3>
                    <p className="text-gray-600">{guideline.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanVisit;