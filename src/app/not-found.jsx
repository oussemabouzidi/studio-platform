'use client';
import React from 'react';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-black/70 absolute inset-0 z-10"></div>
        
      </div>

      {/* Navbar */}
      <nav className="fixed w-full h-20 z-50  bg-opacity-50 py-2">
        <div className="mr-8 ml-8 px-4 flex justify-between items-center">
          <div className="flex items-center h-20 w-20">
            <img src="/home/logo.png" alt="Audio Alchemic Logo" className="h-12" />
          </div>
          
          
          <button 
            onClick={() => router.push('/pages/home')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] text-white px-6 py-2 rounded-full transition-all duration-300 font-bold font-special"
          >
            Return Home
          </button>
        </div>
      </nav>

      {/* 404 Content */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Animated 404 text */}
            <div className="relative mb-12">
              <h3 className="text-[12rem] md:text-[8rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-special drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                404
              </h3>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-special">
              Oops! Page Not Found
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-special-regular">
              The page you're looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 font-special shadow-lg hover:shadow-2xl"
              >
                <FaArrowLeft /> Go Back
              </button>
              
              <button
                onClick={() => router.push('/pages/home')}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border-2 border-purple-600 text-purple-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 font-special"
              >
                <FaHome /> Homepage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-purple-500 filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-blue-500 filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-2/3 w-6 h-6 rounded-full bg-indigo-500 filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
      
      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0 font-special-regular">
              &copy; 2025 Audio Alchemic. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-gray-500 mr-3 font-special">Error 404: Page Not Found</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}