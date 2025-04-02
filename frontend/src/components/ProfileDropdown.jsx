import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaCog, FaTicketAlt } from "react-icons/fa";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // To track clicks outside dropdown

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <FaUser className="text-xl text-gray-700" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
          <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
          <Link to="/profile" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <FaUser className="mr-2" /> My Profile
          </Link>
          <Link to="/my-tickets" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <FaTicketAlt className="mr-2" /> My Bookings
          </Link>
          <Link to="/admin" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <FaCog className="mr-2" /> Admin Panel
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded w-full"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
