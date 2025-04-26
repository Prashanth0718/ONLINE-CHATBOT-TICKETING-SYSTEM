import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-gray-300 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
