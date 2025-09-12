'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheck, FaEnvelope, FaLock, FaUser, FaIdCard, FaMusic, FaBuilding } from 'react-icons/fa';
import { createAccount, login } from '../service/api';
import { AuroraBackground } from '@/app/components/aurora-background';

export default function CreateAccountPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = form, 1 = email sent, 2 = account type selection
  const router = useRouter();  


  useEffect(() => {
    if (localStorage.getItem("isVerified") === "true") {
      setCurrentStep(2);
    }
  }, []);

  const handleVerification = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    // Simulate email sending
    setTimeout(async () => {
      setIsLoading(false);
      
      const account_id = await createAccount(firstName, lastName, email , password);
      console.log(account_id);
      const res = await login(email, password);
      if (res.success) {
        localStorage.setItem("user_id", res.user_id);
        localStorage.setItem("role", res.role);
      }
      setCurrentStep(1);
      console.log('Verification email sent to:', email);
    }, 2000);

    // === Send verification email ===
    await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Verify your email",
        text: `Hello ${firstName}, please verify your email by clicking this link: https://your-app.com/verify?email=${email}`,
        html: `
          <h2>Hello ${firstName},</h2>
          <p>Thanks for registering. Please verify your email by clicking the button below:</p>
          <a href="http://localhost:3000/pages/auth/create_account/verify" 
             style="display:inline-block;padding:10px 20px;background:#0070f3;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        `,
      }),
    });

    console.log("Verification email sent to:", email);
  };

  const handleBackToLogin = () => {
    router.push('/pages/auth/login');
  };

  // Handle account type selection
  const handleAccountTypeSelect = (type: string) => {
    if (type === 'artist') {
      router.push('/pages/auth/create_account_artist');
    } else {
      router.push('/pages/auth/create_account_studio');
    }
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

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-800/20 backdrop-blur-2xl rounded-3xl 
                        border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl
                        relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-500/10 before:to-white/5 before:rounded-3xl before:-z-10">
            
            {/* Step 0: Registration Form */}
            {currentStep === 0 && (
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 font-special">
                    Create Account
                  </h1>
                  <p className="text-blue-200 text-sm md:text-base font-special-regular">Join our community of creators</p>
                </div>

                <div className="space-y-4">
                  {/* Name Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* First Name */}
                    <div>
                      <label className="block text-blue-200 mb-1 text-xs md:text-sm font-special-regular">First Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 pl-10 bg-blue-900/20 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white"
                          required
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300">
                          <FaUser className="text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-blue-200 mb-1 text-xs md:text-sm font-special-regular">Last Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 pl-10 bg-blue-900/20 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white"
                          required
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300">
                          <FaIdCard className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

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
                    <p className="text-xs text-blue-300 mt-1">Minimum 6 characters</p>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-blue-200 mb-1 text-xs md:text-sm font-special-regular">Confirm Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2.5 pl-10 bg-blue-900/20 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-sm text-white ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-300 bg-red-900/20' 
                            : ''
                        }`}
                        required
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-300">
                        <FaLock className="text-sm" />
                      </div>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Create Account Button */}
                  <button
                    onClick={handleVerification}
                    disabled={isLoading}
                    className={`w-full py-3 font-medium rounded-lg transition-all duration-200 shadow flex items-center justify-center gap-2 mt-2 text-sm md:text-base ${
                      isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white '
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 font-special "></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center pt-4 border-t border-blue-500/20 mt-4">
                    <p className="text-blue-300 text-sm font-special-regular">
                      Already have an account?{' '}
                      <button 
                        onClick={handleBackToLogin}
                        className="text-blue-200 hover:text-white font-medium transition-colors font-special-regular"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Email Sent Confirmation */}
            {currentStep === 1 && (
              <div className="text-center space-y-4">
                {/* Success Icon */}
                <div className="w-14 h-14 mx-auto bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/30">
                  <FaCheck className="text-xl text-green-400" />
                </div>

                {/* Success Message */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-special-regular">Check Your Email!</h3>
                  <p className="text-blue-200 text-sm mb-3 font-special-regular">
                    We've sent a verification link to your email address
                  </p>
                  <p className="font-semibold text-cyan-300 text-sm md:text-base mb-4">{email}</p>
                  <p className="text-xs text-blue-300 font-special-regular">
                    Click the link in the email to verify your account and continue.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow text-sm font-special-regular"
                >
                  Continue to Account Setup
                </button>
              </div>
            )}

            {/* Step 2: Account Type Selection */}
            {currentStep === 2 && (
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 font-special">
                  Select Account Type
                </h1>
                <p className="text-blue-200 text-sm md:text-base font-special-regular mb-8">Choose how you'll use our platform</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Artist Option */}
                  <div 
                    className="group bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-blue-900/40 hover:border-cyan-400/50"
                    onClick={() => handleAccountTypeSelect('artist')}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:from-purple-700 group-hover:to-blue-700 transition-all">
                        <FaMusic className="text-3xl text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-special-regular">Artist</h3>
                    <p className="text-blue-200 text-sm mb-4 font-special-regular">I create music and content</p>
                    <div className="text-cyan-300 flex items-center justify-center gap-1 font-special-regular">
                      Select <FaArrowRight className="text-xs mt-0.5" />
                    </div>
                  </div>

                  {/* Studio Option */}
                  <div 
                    className="group bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-blue-900/40 hover:border-cyan-400/50"
                    onClick={() => handleAccountTypeSelect('studio')}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:from-purple-700 group-hover:to-blue-700 transition-all">
                        <FaBuilding className="text-3xl text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-special-regular">Studio</h3>
                    <p className="text-blue-200 text-sm mb-4 font-special-regular">I represent a studio or label</p>
                    <div className="text-cyan-300 flex items-center justify-center gap-1 font-special-regular">
                      Select <FaArrowRight className="text-xs mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="mt-8 text-blue-300 hover:text-white text-sm transition-colors font-special-regular"
                >
                  Back to Email Confirmation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
