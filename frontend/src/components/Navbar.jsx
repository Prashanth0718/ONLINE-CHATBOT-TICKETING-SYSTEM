import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-1">
          <span className="text-red-500">🎟️</span>
          <span>TicketBooking</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/book-ticket" className="hover:text-blue-400 transition">Book Ticket</Link>
          <Link to="/chatbot" className="hover:text-blue-400 transition">Chatbot</Link>
          <Link to="/my-tickets" className="hover:text-blue-400 transition">My Tickets</Link>
          {role === "admin" && (
            <Link to="/admin" className="hover:text-blue-400 transition">Admin Panel</Link>
          )}
        </div>

        {/* Auth / Profile Options */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                🔑 Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                📝 Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
