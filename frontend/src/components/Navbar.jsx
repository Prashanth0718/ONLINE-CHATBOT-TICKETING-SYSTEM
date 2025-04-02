import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import ProfileDropdown from "./ProfileDropdown"; // Import the dropdown

const Navbar = () => {
  const { isLoggedIn, role } = useAuth(); // Get authentication info from context
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
        <span className="text-red-500">🎟️ Ticket</span>Booking
      </Link>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/book-ticket" className="text-gray-700 hover:text-blue-600">Book Ticket</Link>
        <Link to="/chatbot" className="text-gray-700 hover:text-blue-600">Chatbot</Link>
        <Link to="/my-tickets" className="text-gray-700 hover:text-blue-600">My Tickets</Link>
        
        {/* Only show Admin Panel link if the user is an admin */}
        {role === "admin" && (
          <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin Panel</Link>
        )}
      </div>

      {/* Auth / Profile Options */}
      <div className="space-x-4">
        {isLoggedIn ? (
          <ProfileDropdown /> // Show profile dropdown if logged in
        ) : (
          <>
            <Link to="/signin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              🔑 Sign In
            </Link>
            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              📝 Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
