import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setMessage("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setMessage("❌ Registration failed. Try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300"
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          ✨ Create Your Free Account
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        {/* Message Display */}
        {message && (
          <p
            className={`text-center font-semibold text-sm mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            }`}
            disabled={loading}
          >
            {loading ? "Creating account..." : "🚀 Sign Up"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
