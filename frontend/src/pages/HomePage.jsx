import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ticket, MessageSquare, Shield, Clock, ChevronRight } from 'lucide-react';
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Book a Ticket Using Chatbot",
      text: "Interact with our AI chatbot for personalized ticket booking.",
    },
    {
      icon: Shield,
      title: "Security & Convenience",
      text: "Your ticket is stored securely in your account for easy access.",
    },
    {
      icon: Clock,
      title: "Save Time",
      text: "No more waiting in long queues. Save time with online chatbot bookings.",
    },
  ];

  const museums = [
    {
      name: "The Louvre",
      location: "Paris, France",
      img: "https://www.theartlifegallery.com/blog/wp-content/uploads/2023/08/Image-01-1.jpg",
    },
    {
      name: "The British Museum",
      location: "London, UK",
      img: "https://cdn.londonandpartners.com/asset/british-museum_museum-frontage-image-courtesy-of-the-british-museum_f0b0a5a3c53f8fc1564868c561bd167c.jpg",
    },
    {
      name: "Metropolitan Museum",
      location: "New York, USA",
      img: "https://assets.simpleviewinc.com/simpleview/image/upload/q_75/v1/crm/newyorkstate/Facade_Met5th_62DB3BB2-193F-48A6-9FA62977A690DB11_306fa88b-c2be-fb5c-f679971ac40debdf.jpg",
    },
    {
      name: "The National Gallery",
      location: "London, England",
      img: "https://d.newsweek.com/en/full/1528161/7-best-museums-london.jpg?w=1200&f=c4a7fbfa16b0266a94f7dff69b55f4ad",
    },
    {
      name: "Uffizi Galleries",
      location: "Florence, Italy",
      img: "https://media.cntraveler.com/photos/5c421f204b27de229775c27d/16:9/w_2560,c_limit/GettyImages-511081519.jpg",
    },
    {
      name: "State Hermitage",
      location: "St. Petersburg, Russia",
      img: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    },
  ];

  const testimonials = [
    {
      name: "Alice Johnson",
      role: "Art Enthusiast",
      feedback: "Booking tickets was so easy, and the chatbot helped me find the best date to visit!",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      name: "Robert Chen",
      role: "Museum Member",
      feedback: "No hassle at the entrance. Showed my phone, and I was in!",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      name: "Clara Smith",
      role: "Tourist",
      feedback: "The chatbot felt like talking to a real assistant. Loved it!",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ];

  const steps = [
    {
      icon: "📝",
      title: "Sign Up",
      desc: "Create your account to get started with a few simple clicks.",
    },
    {
      icon: "🎯",
      title: "Choose Museum",
      desc: "Pick from a curated list of top museums around the world.",
    },
    {
      icon: "✅",
      title: "Book & Enjoy",
      desc: "Secure your spot instantly and enjoy your visit!",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Experience the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Museum Visits
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  className="relative group p-8 rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Museums Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Featured Museums
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {museums.map((museum, index) => (
              <motion.div
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={museum.img}
                    alt={museum.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{museum.name}</h3>
                  <p className="text-sm opacity-90">{museum.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group p-8 rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-4xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of users who are discovering art and culture through our platform.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;