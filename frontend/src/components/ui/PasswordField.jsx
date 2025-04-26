import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ 
  label, 
  value, 
  onChange, 
  showPassword, 
  toggleShowPassword, 
  error, 
  required = false 
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-white bg-opacity-80 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 pr-10 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          }`}
          required={required}
        />
        
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-3.5 text-gray-500 hover:text-indigo-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
        
        {/* Password strength indicator only for the first password field */}
        {label.includes("Create") && value && !error && (
          <div className="mt-1.5">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              {value.length > 0 && (
                <motion.div 
                  className={`h-full ${getPasswordStrengthColor(value)}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${getPasswordStrength(value)}%` }}
                />
              )}
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span>Weak</span>
              <span>Strong</span>
            </div>
          </div>
        )}
      </div>

      {/* Error message with animation */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-1.5 flex items-start"
        >
          <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Password strength calculation
const getPasswordStrength = (password) => {
  let score = 0;
  
  // Basic length check
  if (password.length > 6) score += 20;
  if (password.length > 10) score += 20;
  
  // Check for different character types
  if (/[0-9]/.test(password)) score += 20; // contains number
  if (/[a-z]/.test(password)) score += 20; // contains lowercase
  if (/[A-Z]/.test(password)) score += 20; // contains uppercase
  if (/[^a-zA-Z0-9]/.test(password)) score += 20; // contains special char
  
  return Math.min(100, score);
};

// Get color based on password strength
const getPasswordStrengthColor = (password) => {
  const strength = getPasswordStrength(password);
  
  if (strength < 30) return 'bg-red-500';
  if (strength < 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default PasswordField;