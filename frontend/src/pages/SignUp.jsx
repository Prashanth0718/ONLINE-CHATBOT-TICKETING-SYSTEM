import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle2, Landmark, Star, Sparkles, Ticket } from 'lucide-react';
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
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                 ease: "easeInOut"
               }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
            />
          <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
            }}
             transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
             }}
            className="absolute -bottom-20 -right-20 w-56 h-56 bg-violet-500/20 rounded-full blur-3xl"
          />
        {/* Main card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden border border-white/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >

          {/* Premium animated logo header */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] animate-gradient flex items-center justify-center relative overflow-hidden">
            {/* Animated background patterns */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              initial={{ backgroundPosition: '0% 0%' }}
              animate={{ backgroundPosition: '100% 100%' }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 2px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
            
            {/* Logo Container */}
            <motion.div 
              className="relative flex items-center gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Logo */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <Landmark className="w-8 h-8 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                </motion.div>
                
                {/* Animated ring */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-white/40 to-transparent"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>

              {/* Text Content */}
              <div className="flex flex-col items-start">
                <motion.h1
                  className="text-3xl font-bold text-white tracking-wide"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  MuseumGo
                </motion.h1>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium text-white/90">
                    Premium Access
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>

            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          </div>

          <div className="relative overflow-hidden">
            
            
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