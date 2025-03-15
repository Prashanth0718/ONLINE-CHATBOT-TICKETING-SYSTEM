import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🎟️ Welcome to Museum Ticket Booking</h1>
        <p className="text-lg text-gray-600 mb-6">Book tickets for your favorite museums easily.</p>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/my-tickets"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            My Tickets
          </Link>
        </div>
      </div>

      {/* ✅ Updated Image URL */}
      <div className="mt-10 max-w-4xl">
        <img
          src="https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=400&fit=crop"
          alt="Museum"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default HomePage;
