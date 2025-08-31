'use client';
import { signIn } from "next-auth/react"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaFacebookF, FaArrowRight, FaGithub, FaApple, FaEnvelope, FaLock } from 'react-icons/fa';
import { AuroraBackground } from '@/app/components/aurora-background';
import {login} from '../service/api'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const res = await login(email, password);
    console.log(res);

    if (res.success) {
      // Save in localStorage
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("role", res.role);
      if (res.studio_id) {
        localStorage.setItem("studio_id", res.studio_id);
      }
      if (res.artist_id) {
        localStorage.setItem("artist_id", res.artist_id);
      }

      // Redirect
      if (res.role === "artist") {
        router.push("/pages/client/studios");
      } else {
        router.push("/pages/studio/dashboard");
      }
    }
  };



  const handleCreateAccount = () => {
    router.push('/pages/auth/create_account');
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-20 py-4">
        <div className="mr-8 ml-8 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/home/logo.png" alt="Logo" className="h-12" />
          </div>
        </div>
      </nav>

      {/* Centered Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800/20 backdrop-blur-2xl rounded-3xl 
                        border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl
                        relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-500/10 before:to-white/5 before:rounded-3xl before:-z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 font-special">
              Welcome Back
            </h1>
            <p className="text-blue-200 text-sm md:text-base font-special-regular ">Sign in to continue your creative journey</p>
          </div>

          {/* Enhanced Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-white/20 text-white rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40 text-sm font-special-regular"
            onClick={() => signIn("google")}>
              <FaGoogle className="text-blue-300 text-lg" />
              <span>Google</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-white/20 text-white rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40 text-sm font-special-regular"
            onClick={() => signIn("facebook")}>
              <FaFacebookF className="text-blue-300 text-lg" />
              <span>Facebook</span>
            </button>
                      </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-3 text-gray-400 text-xs md:text-sm font-special-regular">or continue with email</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Compact Login Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-blue-200 mb-1 text-xs md:text-sm font-special-regular">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-blue-900/20 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300">
                  <FaEnvelope className="text-sm" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-blue-200 mb-1 text-xs md:text-sm font-special-regular">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-blue-900/20 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300">
                  <FaLock className="text-sm" />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-xs md:text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded bg-blue-900/30 border-blue-500/30 text-blue-400 focus:ring-blue-400 h-4 w-4"
                />
                <span className="ml-2 text-blue-200 font-special-regular">Remember me</span>
              </label>
              
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors font-special-regular">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg  transition-all duration-200 shadow flex items-center justify-center gap-2 mt-4 text-sm md:text-base font-special"
            >
              Sign In <FaArrowRight className="text-sm" />
            </button>

            {/* Create Account */}
            <div className="text-center pt-4 border-t border-blue-500/20 mt-4">
              <p className="text-blue-300 text-sm font-special-regular">
                Don't have an account?{' '}
                <button 
                  onClick={handleCreateAccount}
                  className="text-blue-200 hover:text-white font-medium transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuroraBackground>
  );
}