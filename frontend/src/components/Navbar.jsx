import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { motion } from "framer-motion";
import {
  Ticket,
  Landmark,
  Home,
  Calendar,
  MessageSquare,
  Ticket as TicketIcon,
  Settings,
  Map,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "Plan Visit", to: "/plan-visit", icon: Map },
    { name: "Chatbot", to: "/chatbot", icon: MessageSquare },
    { name: "My Tickets", to: "/my-tickets", icon: Ticket },
  ];

  if (role === "admin") {
    navItems.push({ name: "Book Ticket", to: "/book-ticket", icon: Calendar });
    navItems.push({ name: "Admin Panel", to: "/admin", icon: Settings });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              MuseumGo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const destination = isLoggedIn || item.to === "/" ? item.to : "/signin";
              return (
                <Link
                  key={item.name}
                  to={destination}
                  state={isLoggedIn ? {} : { from: item.to }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-all ${
                    location.pathname === item.to ? "text-blue-600 font-semibold" : "text-gray-600"
                  } hover:text-blue-600 hover:bg-blue-50`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button and Profile Dropdown */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && <ProfileDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Auth Buttons (always visible on desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const destination = isLoggedIn || item.to === "/" ? item.to : "/signin";
              return (
                <Link
                  key={item.name}
                  to={destination}
                  state={isLoggedIn ? {} : { from: item.to }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ${
                    location.pathname === item.to ? "text-blue-600 font-semibold" : "text-gray-700"
                  } hover:text-blue-600 hover:bg-blue-50`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Auth Buttons (in mobile view) */}
            {!isLoggedIn && (
              <div className="px-4 pt-2 flex flex-col space-y-2">
                <Link
                  to="/signin"
                  className="text-sm text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm text-white text-center py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;