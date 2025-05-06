import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { UserCircle2, Eye, EyeOff, Ticket } from 'lucide-react';
import Toast from '../components/ui/Toast';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.role);
      showToast("Successfully signed in!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login failed:", error);
      showToast(
        error.response?.data?.message ||
        "Invalid email or password. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: resetEmail
      });
      showToast("Password reset instructions sent to your email!");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      showToast(
        error.response?.data?.message || 
        "Failed to process password reset request",
        "error"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-0 w-16 h-16 bg-violet-500/20 rounded-full blur-xl"></div>
        
        {/* Main card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative overflow-hidden">
            {/* Header with gradient */}
            <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative">
              <div className="text-white font-medium flex items-center z-10">
                <Ticket className="h-5 w-5 mr-2" />
                <span>Museum Experience</span>
              </div>
            </div>
            
            <div className="px-8 py-8">
              <div className="flex flex-col items-center mb-8">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                >
                  <UserCircle2 size={40} className="text-white" />
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Welcome Back
                </motion.h2>
                
                <motion.div 
                  className="text-gray-500 text-center space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>
                    New to our museum?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                      Create an account
                    </Link>
                  </p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {showForgotPassword ? (
                  <motion.form
                    key="reset"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleForgotPassword}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-white/80 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-200 group-hover:border-blue-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <motion.button
                        type="submit"
                        disabled={resetLoading}
                        className="flex-1 relative overflow-hidden group py-3 rounded-xl text-white font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
                      >
                        {resetLoading ? "Sending..." : "Reset Password"}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 py-3 rounded-xl text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                      >
                        Back to Login
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSignIn}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-white/80 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-200 group-hover:border-blue-400"
                          required
                        />
                      </div>

                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-white/80 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200 group-hover:border-blue-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <motion.div 
                      className="pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full relative overflow-hidden group py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300 shadow-md ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
                        }`}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                        <div className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Signing in...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Ticket className="w-5 h-5 mr-2" />
                              Sign In
                            </span>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SignIn;