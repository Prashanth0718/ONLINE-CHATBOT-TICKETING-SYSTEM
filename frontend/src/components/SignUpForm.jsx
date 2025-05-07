import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FormField from './ui/FormField';
import PasswordField from './ui/PasswordField';

const SignUpForm = ({ navigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: null }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "❌ Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://museumgo-backend.onrender.com/api/auth/register", {
        name,
        email,
        phone,
        address,
        dob,
        city,
        country,
        password,
      });

      setMessage("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      if (error.response && error.response.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center font-medium text-sm mb-6 ${
            message.includes("✅") 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </motion.div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            error={fieldErrors.name}
            required
          />
          
          <FormField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            error={fieldErrors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearFieldError("phone");
            }}
            error={fieldErrors.phone}
            required
          />
          
          <FormField
            label="Date of Birth"
            type="date"
            value={dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setDob(e.target.value);
              clearFieldError("dob");
            }}
            error={fieldErrors.dob}
            required
          />
        </div>

        <FormField
          label="Address"
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            clearFieldError("address");
          }}
          error={fieldErrors.address}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="City"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              clearFieldError("city");
            }}
            error={fieldErrors.city}
          />
          
          <FormField
            label="Country"
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              clearFieldError("country");
            }}
            error={fieldErrors.country}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PasswordField
            label="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}  
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
            error={fieldErrors.password}
            required
          />
          
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirmPassword");
            }}
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={fieldErrors.confirmPassword}
            required
          />
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
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-200"
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <div className="relative z-10 flex items-center justify-center">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your account...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21.0672 12C21.0672 16.9706 16.9706 21.0672 12 21.0672C7.02944 21.0672 2.93276 16.9706 2.93276 12C2.93276 7.02944 7.02944 2.93276 12 2.93276C16.9706 2.93276 21.0672 7.02944 21.0672 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Account
                </span>
              )}
            </div>
          </button>
        </motion.div>
        
        <p className="text-xs text-center text-gray-500 mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
            Privacy Policy
          </a>
        </p>
      </form>
    </>
  );
};

export default SignUpForm;