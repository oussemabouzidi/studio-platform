'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaMusic, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebookF, FaYoutube, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { 
  FaUser,
  FaHome,
  FaCalendarCheck,
  FaChartLine
} from 'react-icons/fa';

import { useRouter } from 'next/navigation';



export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter() ;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const studios = [
    {
      name: "Echo Sound Studios",
      location: "Brooklyn, NY",
      rating: 4.9,
      image: "/studio1.jpg"
    },
    {
      name: "Harmony Records",
      location: "Los Angeles, CA",
      rating: 4.8,
      image: "/studio2.jpg"
    },
    {
      name: "Urban Beats Lab",
      location: "Chicago, IL",
      rating: 4.7,
      image: "/studio3.jpg"
    },
    {
      name: "Vintage Vinyl Studio",
      location: "Nashville, TN",
      rating: 4.9,
      image: "/studio4.jpg"
    }
  ];

  const testimonials = [
    {
      text: "This platform completely transformed how I book studio time. Found my perfect recording space in minutes!",
      author: "Alex Turner",
      role: "Musician"
    },
    {
      text: "As a studio owner, Audio Alchemic has brought me consistent bookings and serious artists. The management tools are fantastic.",
      author: "Sarah Johnson",
      role: "Studio Owner"
    },
    {
      text: "The badge system keeps me coming back. I've earned discounts just by booking sessions through the platform!",
      author: "Marcus Lee",
      role: "Producer"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const GoToLogin = () =>{
    router.push('/pages/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-black/70 absolute inset-0 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/vedio/recording.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full h-20 z-50 transition-all duration-300  ${isScrolled ? 'bg-gray-900/90 backdrop-blur-2xl bg-opacity-50 py-2' : 'bg-transparent  py-4'}`}>
        <div className=" mr-8 ml-8 px-4  flex justify-between items-center">
          <div className="flex items-center h-20 w-20">
              <img src="/home/logo.png" />

    </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className={`hover:text-purple-400 transition-colors font-special `}>Studios</a>
            <a href="#" className={`hover:text-purple-400 transition-colors font-special `}>How It Works ?</a>
            <a href="#" className={`hover:text-purple-400 transition-colors font-special `}>Contact</a>
          </div>
          
          <div className="flex items-center">
            <button onClick={GoToLogin} className={`hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] text-white px-6 py-2 rounded-full transition-all duration-300 font-bold font-special `}>
              Get Started
            </button>
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 py-4 px-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className={`hover:text-purple-400 transition-colors font-special hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] `}>Studios</a>
              <a href="#" className={`hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]`}>How It Works ?</a>
              <a href="#" className={`hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]`}>Contact</a>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 mr-8">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center ml-5">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-special `}>
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">Next</span><br />

              Recording Studio <br />
              Found in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">Minutes</span>.
            </h1>
            <p className={`text-xl text-gray-300 mb-10 max-w-2xl font-special-regular `}>
              Discover the best recording spaces near you, book sessions instantly, and create your next masterpiece, all in 1 place
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={GoToLogin} className={`bg-gradient-to-r from-[#8A38F5] to-[#3C71E8] hover:from-purple-700 hover:to-blue-700 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 font-special shadow-lg hover:shadow-2xl  `}>
                Find a Studio
              </button>
              <button onClick={GoToLogin} className={`hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] bg-transparent border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 font-special `}>
                Join as a Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 font-special `}>How It Works ?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-special-regular">Simple steps to create, discover, and book recording sessions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-gray-800 rounded-2xl p-8 border hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-6">
                <span className={`text-2xl font-bold font-special `}>1</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 font-special `}>Sign Up</h3>
              <p className="text-gray-400 mb-6  font-specialRegular">Create an account as an artist or studio owner in just a few clicks.</p>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-800 rounded-2xl p-8 border hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r  from-purple-600 to-blue-600 flex items-center justify-center mb-6">
                <span className={`text-2xl font-bold font-special `}>2</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 font-special `}>Discover or Offer</h3>
              <p className="text-gray-400 mb-6  font-special-regular">Artists find perfect studios, studios showcase their services and spaces.</p>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-800 rounded-2xl p-8 border hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-6">
                <span className={`text-2xl font-bold font-special `}>3</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 font-special `}>Book & Create</h3>
              <p className={`text-gray-400 mb-6  font-special-regular`}>Book sessions instantly, manage your calendar, and focus on creating.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-800 to-gray-900">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className={`text-4xl font-bold mb-4 font-special `}>For Artists and Studios</h2>
      <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Dedicated experiences tailored for music creators and recording spaces</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Artist Card - Expanded */}
      <div className="bg-gray-800 rounded-2xl p-8 border hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-6">
              <FaMusic className="text-4xl" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 text-center font-special `}>Artists</h3>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-32 h-1 mb-6"></div>
          </div>
          
          <div className="flex-1">
            <p className={`text-gray-400 mb-6 font-special-regular `}>Everything you need to find, book, and create in the perfect studio environment.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaSearch className="text-purple-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Discover Studios</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Find the perfect recording space with detailed filters and reviews</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaCalendarAlt className="text-purple-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Instant Booking</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Reserve studio time 24/7 with real-time availability</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaUser className="text-purple-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Manage Sessions</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Track upcoming bookings, history, and payments in one place</p>
                </div>
              </div>
            </div>
            
            <button onClick={GoToLogin} className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 w-full font-special `}>
              Start Creating Today
            </button>
          </div>
        </div>
      </div>
      
      {/* Studio Card - Expanded */}
      <div className="bg-gray-800 rounded-2xl hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-6">
              <FaMapMarkerAlt className="text-4xl" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 text-center font-special `}>Studios</h3>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-32 h-1 mb-6"></div>
          </div>
          
          <div className="flex-1">
            <p className={`text-gray-400 mb-6 font-special-regular `}>Showcase your space, manage bookings, and connect with talented artists.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaHome className="text-blue-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Create Your Profile</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Showcase your studio with photos, amenities, and services</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaCalendarCheck className="text-blue-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Booking Management</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Handle reservations, payments, and scheduling efficiently</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaChartLine className="text-blue-400" />
                </div>
                <div className="ml-4">
                  <h4 className={`font-bold mb-1 font-special `}>Grow Your Business</h4>
                  <p className={`text-gray-500 text-sm font-special-regular `}>Reach new clients and maximize your studio's potential</p>
                </div>
              </div>
            </div>
            
            <button onClick={GoToLogin} className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 w-full font-special `}>
              List Your Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Featured Studios */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 font-special `}>Featured Studios</h2>
            <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Top-rated studios loved by artists worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {studios.map((studio, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="h-48 bg-gradient-to-r from-purple-900 to-blue-900 flex items-center justify-center rounded-xl m-2">
                  <div className="text-4xl">🎙️</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold font-special `}>{studio.name}</h3>
                      <p className={`text-gray-400 flex items-center font-special-regular `}>
                        <FaMapMarkerAlt className="mr-4" /> {studio.location}
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                      <FaStar className={`text-yellow-400 mr-1 font-special `} />
                      <span>{studio.rating}</span>
                    </div>
                  </div>
                  <button className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full transition-all duration-300 font-special `}>
                    View Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 font-special `}>What Our Community Says</h2>
            <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Real experiences from artists and studios using Audio Alchemic</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">❝</div>
                <p className={`text-xl italic mb-8 max-w-2xl font-special `}>{testimonials[currentSlide].text}</p>
                <div>
                  <p className={`font-bold text-lg font-special `}>{testimonials[currentSlide].author}</p>
                  <p className={`text-gray-400 font-special-regular `}>{testimonials[currentSlide].role}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <FaChevronLeft />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Banner */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-4 py-1 rounded-full mb-4 font-semibold font-special `}>
              New Feature
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className={`text-yellow-400 font-special `}>🌟 Earn Badges</span> for Every Booking!
            </h2>
            <p className={`text-xl text-purple-200 mb-8 max-w-2xl mx-auto font-special-regular `}>
              Unlock special discounts, priority booking, and exclusive perks as you create more music
            </p>
            <button className={`bg-white text-gray-900 hover:bg-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 font-special `}>
              Learn About Rewards
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  
                  <img src="/home/logo.png"  />
                </div>
                <span className={`text-2xl font-bold font-special `}>Audio Alchemic</span>
              </div>
              <p className={`text-gray-400 mb-6 font-special-regular `}>
                Connecting artists with perfect recording spaces since 2025.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebookF className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaYoutube className="text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-6 font-special `}>Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>About Us</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Careers</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Blog</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-6 font-special `}>Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Help Center</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Community</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Studio Resources</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Artist Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-6 font-special `}>Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Terms</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Privacy</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Cookie Policy</a></li>
                <li><a href="#" className={`text-gray-400 hover:text-white transition-colors font-special-regular `}>Licensing</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className={`text-gray-500 mb-4 md:mb-0 font-special-regular `}>
              &copy; 2025 Audio Alchemic. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className={`text-gray-500 mr-3 font-special `}>Language:</span>
              <button className={`px-3 py-1 bg-gray-800 rounded-lg mr-2 hover:bg-gray-700 font-special `}>🇬🇧 English</button>
              <button className={`px-3 py-1 bg-gray-800 rounded-lg mr-2 hover:bg-gray-700 font-special `}>🇫🇷 Français</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}