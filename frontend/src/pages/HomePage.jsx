import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Loader from "../components/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "TicketBooking - Explore & Book Effortlessly";
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2020/11/header2.jpg?fit=1300%2C731&ssl=1')",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-extrabold tracking-wider drop-shadow-md animate-fadeInUp">
            Explore & Book Museum Tickets Effortlessly
          </h1>
          <p className="text-xl mt-4 opacity-90 animate-fadeInUp delay-200">
            Seamless online booking with AI-powered chatbot assistance.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link
              to="/signup"
              className="px-6 py-3 text-lg bg-gradient-to-r from-gold to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
            >
              Get Started 🚀
            </Link>
            <button
              onClick={() => scroll.scrollTo(500, { smooth: true })}
              className="px-6 py-3 text-lg border-2 border-white text-white hover:bg-gold hover:border-gold transition-all font-semibold rounded-full shadow-md hover:scale-105"
            >
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* "We Help You" Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-8">We Make Ticket Booking Effortless</h2>
          <p className="text-lg text-gray-600 mb-12">
            Experience a seamless and effortless way to book your museum tickets with our intelligent chatbot assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Features */}
            {[
              { icon: "fas fa-lightbulb", title: "Clear Understanding", text: "We simplify ticketing, ensuring you understand each step clearly." },
              { icon: "fas fa-globe", title: "Language Accessibility", text: "Book your tickets in multiple languages for a comfortable experience." },
              { icon: "fas fa-headset", title: "24/7 Assistance", text: "Our AI-powered chatbot guides you step-by-step, anytime." },
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                <i className={`${feature.icon} text-5xl text-gold mb-4`}></i>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "This platform made booking tickets so easy! The chatbot was super helpful.", name: "Alex Johnson" },
              { text: "I loved the multilingual support. Booking in my native language was a game-changer!", name: "Priya Sharma" },
              { text: "Secure payments and instant booking confirmation. Highly recommend!", name: "David Lee" },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <h3 className="text-lg font-semibold mt-3">- {testimonial.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
