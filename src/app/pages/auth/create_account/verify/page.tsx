"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    // Save verification flag
    localStorage.setItem("isVerified", "true");

    // Redirect back to signup after short delay
    const timer = setTimeout(() => {
      router.push("/pages/auth/create_account");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-12 animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(147,51,234,0.8)]">
            <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
              <img 
                src="/home/logo.png" 
                alt="Audio Alchemic Logo" 
                className="w-20 h-20"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center font-special bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Audio Alchemic
        </h1>

        {/* Verification Animation */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-8 border-gray-700 rounded-full"></div>
          
          {/* Animated Ring */}
          <div
            className="absolute inset-0 border-8 border-transparent rounded-full animate-spin border-t-green-400 border-r-blue-500" 
            style={{ animationDuration: "1.5s" }}
          ></div>
          
          {/* Pulsating Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-ping"></div>
        </div>

        {/* Verification Message */}
        <p className="mt-8 text-lg text-green-300 font-special-regular animate-pulse">
          Verifying your account...
        </p>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-purple-500 filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-blue-500 filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-2/3 w-6 h-6 rounded-full bg-indigo-500 filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center">
        <p className="text-gray-500 font-special-regular">
          &copy; 2025 Audio Alchemic • Securing your creative journey
        </p>
      </footer>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(10deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

