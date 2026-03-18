'use client';
import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">

      {/* Content */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-12 animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(147,51,234,0.8)]">
            <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
              <img 
                src="/home/Logo.png" 
                alt="Audio Alchemic Logo" 
                className="w-20 h-20"
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center font-special bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Audio Alchemic
        </h1>

        {/* Loading Animation */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-8 border-gray-700 rounded-full"></div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 border-8 border-transparent rounded-full animate-spin border-t-purple-500 border-r-blue-500" 
               style={{ animationDuration: '1.5s' }}>
          </div>
          
          {/* Pulsating Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping"></div>
        </div>

        {/* Loading Message */}
        <p className="mt-8 text-lg text-purple-300 font-special-regular animate-pulse">
          Creating your audio experience...
        </p>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-purple-500 filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-blue-500 filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-6 h-6 rounded-full bg-indigo-500 filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center">
        <p className="text-gray-500 font-special-regular">
          &copy; 2025 Audio Alchemic • Loading your creative space
        </p>
      </footer>


    </div>
  );
}
