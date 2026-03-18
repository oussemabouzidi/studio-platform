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
import BackgroundAudioToggle from '@/app/components/BackgroundAudioToggle';
import { useT } from '@/app/i18n/useT';



export default function HomePage() {
  const t = useT();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter() ;

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    // Let the page paint before scrolling (especially when coming from another route).
    window.setTimeout(() => scrollToSection(hash), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studios = [
    {
      name: "Echo Sound Studios",
      location: "Brooklyn, NY",
      rating: 4.9,
      image: "/studio/cover.jpg"
    },
    {
      name: "Harmony Records",
      location: "Los Angeles, CA",
      rating: 4.8,
      image: "/studio/cover2.jpg"
    },
    {
      name: "Urban Beats Lab",
      location: "Chicago, IL",
      rating: 4.7,
      image: "/studio/cover.jpg"
    },
    {
      name: "Vintage Vinyl Studio",
      location: "Nashville, TN",
      rating: 4.9,
      image: "/studio/cover2.jpg"
    }
  ];

  const testimonials = [
    {
      text: "This platform completely transformed how I book studio time. Found my perfect recording space in minutes!",
      author: "Alex Turner",
      role: "Musician"
    },
    {
      text: "As a studio owner, Audio Alchemic has brought me consistent bookings and serious artists. The management tools are fantastic.",
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
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden lux-rect">
      <BackgroundAudioToggle />

      {/* Navbar */}
      <nav className={`fixed w-full h-20 z-50 transition-all duration-300  ${isScrolled ? 'bg-black/70 backdrop-blur-2xl border-b border-white/10 py-2' : 'bg-transparent  py-4'}`}>
        <div className=" mr-8 ml-8 px-4  flex justify-between items-center">
          <div className="flex items-center h-20 w-20">
              <img src="/home/Logo.png" alt="Audio Alchemic" />

    </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#studios"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("studios");
              }}
              className={`hover:text-purple-400 transition-colors font-special `}
            >
              {t("home.navStudios")}
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
              className={`hover:text-purple-400 transition-colors font-special `}
            >
              {t("home.navHowItWorks")}
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className={`hover:text-purple-400 transition-colors font-special `}
            >
              {t("home.navContact")}
            </a>
          </div>
          
            <div className="flex items-center">
              <button onClick={GoToLogin} className={`hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] text-white px-6 py-2 rounded-full transition-all duration-300 font-bold font-special `}>
              {t("common.getStarted")}
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
          <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 py-4 px-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#studios"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("studios");
                }}
                className={`hover:text-purple-400 transition-colors font-special hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] `}
              >
                {t("home.navStudios")}
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
                className={`hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]`}
              >
                {t("home.navHowItWorks")}
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className={`hover:text-purple-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]`}
              >
                {t("home.navContact")}
              </a>
              <button
                onClick={GoToLogin}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 mr-8"
              >
                {t("common.signIn")}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero — Visual Story Intro */}
      <section className="relative z-10 min-h-[100dvh] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/65" />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-95"
          >
            <source src="/vedio/recording.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-gray-950" />
        </div>

        <div className="relative z-10 lux-container py-28 sm:py-32">
          <div data-reveal suppressHydrationWarning className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="lux-chip border-white/10 bg-black/35 text-white/75">
                {t("home.heroBadge")}
              </span>
              <span className="text-xs text-white/55 font-special-regular">
                {t("home.heroKicker")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.02] font-special">
              {t("home.heroTitleA")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]">
                {t("home.heroTitleB")}
              </span>
              .
            </h1>

            <p className="text-lg sm:text-xl text-gray-200/90 mb-10 max-w-2xl font-special-regular">
              {t("home.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={GoToLogin}
                className="lux-btn-metal px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] font-special shadow-lg hover:shadow-2xl"
              >
                {t("home.ctaStart")}
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="lux-btn-ghost px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 font-special"
              >
                {t("home.ctaWatch")}
              </button>
            </div>

            <div className="mt-12 flex items-center gap-3 text-white/65 text-sm font-special-regular">
              <span className="h-px w-10 bg-white/15" />
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-white transition-colors"
              >
                Scroll to Chapter 01
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Story — How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 py-20 sm:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 scroll-mt-24"
      >
        <div className="lux-container">
          <div className="text-center mb-14 sm:mb-16" data-reveal suppressHydrationWarning>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-special">
              A visual flow for serious work
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-special-regular">
              Each step is designed to feel cinematic—minimal clicks, clear choices, and premium details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sticky media (chapter mood) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28" data-reveal suppressHydrationWarning style={{ ['--reveal-delay' as any]: '90ms' }}>
              <div className="lux-card lux-rect overflow-hidden p-0">
                <div className="relative">
                  <img
                    src="/studio/cover.jpg"
                    alt="Studio atmosphere"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied) return;
                      img.dataset.fallbackApplied = "1";
                      img.src = "/studio/cover2.jpg";
                    }}
                    className="w-full aspect-[4/3] object-cover opacity-90 lux-media"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
                  <div className="absolute inset-0 pointer-events-none opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:44px_44px]" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-white/55 font-special-regular">Now playing</div>
                      <div className="text-xl text-white font-special">The Session</div>
                    </div>
                    <div className="lux-chip border-white/10 bg-black/25 text-white/75">
                      Luxury • Fast • Focused
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-300 font-special-regular">
                    Scroll through the chapters to see how we guide your booking from discovery to delivery.
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  k: '01',
                  title: 'Find the room that fits your sound',
                  copy: 'Search by vibe, gear, location, and availability—then preview the space like a cinematic catalog.',
                  bullets: ['Curated studios', 'Smart filters', 'High-end visuals'],
                },
                {
                  k: '02',
                  title: 'Pick a time—fast and human',
                  copy: 'Clear time slots, real pricing, and a booking dialog that stays smooth on mobile.',
                  bullets: ['Fewer clicks', 'Human dates', 'Bold CTAs'],
                },
                {
                  k: '03',
                  title: 'Know what you’re walking into',
                  copy: 'Explore the setup. Tap gear hotspots and take a virtual tour when available.',
                  bullets: ['Interactive gear', 'Premium details', 'Confidence before you arrive'],
                },
                {
                  k: '04',
                  title: 'Create, review, repeat',
                  copy: 'A premium loop: track your bookings, earn perks, and keep building momentum.',
                  bullets: ['Bookings dashboard', 'Rewards & badges', 'Artist profile'],
                },
              ].map((chapter, idx) => (
                <div
                  key={chapter.k}
                  data-reveal
                  suppressHydrationWarning
                  style={{ ['--reveal-delay' as any]: `${120 + idx * 70}ms` }}
                  className="lux-card lux-rect lux-tilt p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-white/55 font-special-regular">Chapter {chapter.k}</div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-special">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/80 font-special">
                      {chapter.k}
                    </div>
                  </div>

                  <p className="text-gray-300 mt-4 font-special-regular">{chapter.copy}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {chapter.bullets.map((b) => (
                      <span key={b} className="lux-chip border-white/10 bg-black/25 text-white/75">
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button onClick={GoToLogin} className="lux-btn-metal px-5 py-2.5 text-sm font-medium">
                      Continue
                    </button>
                    <button
                      onClick={() => scrollToSection('studios')}
                      className="lux-btn-ghost px-5 py-2.5 text-sm font-medium"
                    >
                      See featured studios
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 sm:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
  <div className="lux-container">
    <div className="text-center mb-14 sm:mb-16" data-reveal suppressHydrationWarning>
      <h2 className={`text-4xl sm:text-5xl font-bold mb-4 font-special `}>Choose your path</h2>
      <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Two premium experiences—one platform for creators and studios.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Artist Card - Expanded */}
      <div data-reveal suppressHydrationWarning style={{ ['--reveal-delay' as any]: '90ms' }} className="lux-card lux-rect lux-tilt p-8">
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
            
            <button onClick={GoToLogin} className="lux-btn-metal w-full px-6 py-3 rounded-full font-medium transition-all duration-300 font-special">
              Start Creating Today
            </button>
          </div>
        </div>
      </div>
      
      {/* Studio Card - Expanded */}
      <div data-reveal suppressHydrationWarning style={{ ['--reveal-delay' as any]: '160ms' }} className="lux-card lux-rect lux-tilt p-8">
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
            
            <button onClick={GoToLogin} className="lux-btn-metal w-full px-6 py-3 rounded-full font-medium transition-all duration-300 font-special">
              List Your Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Featured Studios */}
      <section
        id="studios"
        className="relative z-10 py-20 sm:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 scroll-mt-24"
      >
        <div className="lux-container">
          <div className="text-center mb-14 sm:mb-16" data-reveal suppressHydrationWarning>
            <h2 className={`text-4xl font-bold mb-4 font-special `}>Featured Studios</h2>
            <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Top-rated studios loved by artists worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {studios.map((studio, index) => (
              <div
                key={index}
                data-reveal
                suppressHydrationWarning
                style={{ ['--reveal-delay' as any]: `${80 + index * 70}ms` }}
                className="lux-card lux-rect lux-tilt overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={studio.image}
                    alt={studio.name}
                    className="h-48 w-full object-cover opacity-90 lux-media"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55" />
                  <div className="absolute top-3 right-3 lux-chip border-white/10 bg-black/35 text-white/80">
                    <FaStar className="text-yellow-400" /> {studio.rating}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-xl font-bold font-special `}>{studio.name}</h3>
                  <p className={`text-gray-400 flex items-center font-special-regular mt-2`}>
                    <FaMapMarkerAlt className="mr-2 text-purple-400" /> {studio.location}
                  </p>

                  <button
                    type="button"
                    onClick={GoToLogin}
                    className="mt-5 w-full lux-btn-metal px-4 py-2.5 rounded-full transition-all duration-300 font-special"
                  >
                    View Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 sm:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="lux-container">
          <div className="text-center mb-14 sm:mb-16" data-reveal suppressHydrationWarning>
            <h2 className={`text-4xl font-bold mb-4 font-special `}>What Our Community Says</h2>
            <p className={`text-gray-400 max-w-2xl mx-auto font-special-regular `}>Real experiences from artists and studios using Audio Alchemic</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div data-reveal suppressHydrationWarning className="lux-card lux-rect p-8">
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
                className="lux-btn-ghost w-12 h-12 rounded-full flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft />
              </button>
              <button 
                onClick={nextSlide}
                className="lux-btn-ghost w-12 h-12 rounded-full flex items-center justify-center"
                aria-label="Next testimonial"
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
      <footer
        id="contact"
        className="relative z-10 bg-gray-900 border-t border-gray-800 pt-16 pb-8 scroll-mt-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  
                  <img src="/home/Logo.png"  />
                </div>
                <span className={`text-2xl font-bold font-special `}>Audio Alchemic</span>
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
              &copy; 2025 Audio Alchemic. All rights reserved.
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
