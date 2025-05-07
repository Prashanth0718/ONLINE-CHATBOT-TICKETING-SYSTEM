import React from 'react';
import { motion } from 'framer-motion';
import { Book, Map, Clock, CreditCard, Camera, Coffee, Users, Info, Globe, Languages, Accessibility, Phone } from 'lucide-react';

const Guide = () => {
  const sections = [
    {
      title: "Before Your Visit",
      items: [
        {
          icon: Clock,
          title: "Plan Your Time",
          content: "Most visitors spend 2-3 hours exploring a museum. Consider the size of the museum and your interests when planning."
        },
        {
          icon: CreditCard,
          title: "Tickets & Pricing",
          content: "Book tickets in advance through our chatbot for the best rates and to avoid queues. Many museums offer free admission days."
        },
        {
          icon: Map,
          title: "Getting There",
          content: "Check the museum's location and transportation options. Most are accessible by public transport."
        }
      ]
    },
    {
      title: "During Your Visit",
      items: [
        {
          icon: Camera,
          title: "Photography Rules",
          content: "Check museum-specific photography policies. Flash photography is usually prohibited to protect artworks."
        },
        {
          icon: Coffee,
          title: "Facilities",
          content: "Most museums have cafés, restaurants, and gift shops. Lockers are often available for large bags."
        },
        {
          icon: Users,
          title: "Guided Tours",
          content: "Join guided tours for expert insights. Audio guides are available in multiple languages."
        }
      ]
    },
    {
      title: "Additional Services",
      items: [
        {
          icon: Accessibility,
          title: "Accessibility",
          content: "Wheelchair access, elevators, and special assistance available. Contact museums for specific requirements."
        },
        {
          icon: Languages,
          title: "Language Support",
          content: "Information materials and audio guides available in multiple languages."
        },
        {
          icon: Globe,
          title: "Virtual Tours",
          content: "Many museums offer virtual tours and online collections for remote exploration."
        }
      ]
    }
  ];

  const tips = [
    "Wear comfortable shoes for extended walking",
    "Check coat/bag check policies beforehand",
    "Download museum maps to your phone",
    "Consider visiting during off-peak hours",
    "Look for special exhibitions and events",
    "Join museum membership programs for benefits"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Museum Visitor's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Guide
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make the most of your museum experience with our comprehensive visitor's guide.
          </p>
        </motion.div>

        {/* Main Sections */}
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((item, index) => {
                const Icon = item.icon;
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Visitor Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <Phone className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">Our support team is available 24/7 to assist you with any questions.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="mailto:prashanthsn6363@gmail.com" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300">
              Email Support
            </a>
            <a href="tel:+916363690394" className="text-white border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300">
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Guide;