'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleSignIn = () => {
    console.log('Sign in:', { email, password, role: selectedRole });
    // Add your authentication logic here
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
    // Navigate to registration page or show registration form
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Left Side - Logo and App Name */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">L</div>
          </div>
          <h1 className="text-5xl font-bold tracking-wide">Labz</h1>
          <p className="text-purple-100 mt-2 text-lg">Your Creative Platform</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Create Account Button */}
          <div className="text-right mb-8">
            <button
              onClick={handleCreateAccount}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 font-medium">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <p className="text-gray-700 font-medium">Choose your role:</p>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="artist"
                    checked={selectedRole === 'artist'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                    selectedRole === 'artist' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}>
                    <span className="font-medium">Artist</span>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="studio"
                    checked={selectedRole === 'studio'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                    selectedRole === 'studio' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}>
                    <span className="font-medium">Studio</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Sign In
            </button>
          </div>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}