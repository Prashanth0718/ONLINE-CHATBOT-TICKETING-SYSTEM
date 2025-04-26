import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle2, Sparkles, Ticket } from 'lucide-react';
import SignUpForm from '../components/SignUpForm';

const SignUp = () => {
  const navigate = useNavigate();
  
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
                  Create Your Account
                </motion.h2>
                
                <motion.p 
                  className="text-gray-500 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Already have an account?{" "}
                  <Link to="/signin" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Sign in
                  </Link>
                </motion.p>
              </div>
              
              <SignUpForm navigate={navigate} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;