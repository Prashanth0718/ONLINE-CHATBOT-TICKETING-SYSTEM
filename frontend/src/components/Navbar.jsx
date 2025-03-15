import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, role, logout } = useAuth();

  if (isLoggedIn === undefined) return null; // Prevents rendering issues

  return (
    <nav className="bg-blue-600 shadow-md py-3 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          🎟️ TicketBooking
        </Link>

        <div className="space-x-4">
          <Link to="/" className="text-white hover:underline">Home</Link>
          <Link to="/book-ticket" className="text-white hover:underline">Book Ticket</Link>

          {!isLoggedIn ? (
            <Link to="/login" className="text-white hover:underline">Login</Link>
          ) : (
            <>
              {role === "user" && (
                <Link to="/my-tickets" className="text-white hover:underline">My Tickets</Link>
              )}
              {role === "admin" && (
                <Link to="/admin-dashboard" className="text-white hover:underline">Admin Panel</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
