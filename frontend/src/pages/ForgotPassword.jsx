import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserCircle2, Mail, ArrowLeft } from 'lucide-react';
import Toast from "../components/ui/Toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backendURL}/api/auth/forgot-password`, { email });
      showToast("Password reset instructions sent to your email!");
      setEmail("");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send reset instructions.",
        "error"
      );
    } finally {
      setLoading(false);
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
        
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative">
              <div className="text-white font-medium flex items-center z-10">
                <UserCircle2 className="h-5 w-5 mr-2" />
                <span>Password Reset</span>
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
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Forgot Password?
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Enter your email address and we'll send you instructions to reset your password.
                </motion.p>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full relative overflow-hidden group py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300 shadow-md ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
                  }`}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative z-10">
                    {loading ? "Sending Instructions..." : "Send Reset Instructions"}
                  </span>
                </motion.button>

                <Link
                  to="/signin"
                  className="block text-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <motion.div
                    whileHover={{ x: -5 }}
                    className="inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </motion.div>
                </Link>
              </motion.form>
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

export default ForgotPassword;