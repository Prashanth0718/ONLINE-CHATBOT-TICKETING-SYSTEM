import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCog,
  FaTicketAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuth();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
      >
        <FaUser className="text-xl text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 shadow-lg rounded-lg py-2 z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <FaUser className="mr-2" /> My Profile
          </Link>
          <Link
            to="/my-tickets"
            className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <FaTicketAlt className="mr-2" /> My Bookings
          </Link>
          {role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition"
            >
              <FaCog className="mr-2" /> Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-400 hover:bg-gray-700 rounded w-full transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
