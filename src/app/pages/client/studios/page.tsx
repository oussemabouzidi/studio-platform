'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import StudioCardGrid from '../../../components/StudioCardGrid';
import PointsSection from '../../../components/PointsSection';
import ArtistProfileDropdown from '../../../components/ArtistProfileDropdown ';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaCalendarAlt, FaClock, FaMusic, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import NotificationDropdown from '@/app/components/NotificationDropdown';
import FavoritesLink from '@/app/components/FavoritesLink';
import {getAllStudios, getBookingsByArtist, getMiniProfile} from '../service/api'
import { Booking, Reviews, Studio } from '../types';

const StudiosPage = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [filteredStudios, setFilteredStudios] = useState(studios);
  const [activeTab, setActiveTab] = useState('search');
  const [filters, setFilters] = useState({
      location: '',
      genre: '',
      availability: [],
      services: [],
      amenities: [],
      priceRange: [0, 200],
      equipment: [],
      studioType: [],
      languages: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState<string | null>(null);

  // Artist profile data
  const [artistProfile, setArtistProfile] = useState({
    name: "Asap Rockey",
    artistName: "rockey",
    avatar: "/artist/avatar.jpg",
    preferences: {
      genres: ["Rock", "Electronic"],
      location: "New York",
      priceRange: [50, 120],
      equipment: ["Neumann U87", "SSL Console"]
    }
  });

  // Fetching studios
  useEffect(() => {
    async function fetchStudios() {
      try {
        const data = await getAllStudios();
        setStudios(data);
        console.log("studio data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudios();
  }, []);

  // Fetching bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const id = localStorage.getItem("user_id");
        const data = await getBookingsByArtist(id);
        setBookings(data);
        console.log("booking data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchBookings();
  }, []);


  // Fetching profile data
  useEffect(() => {
    async function fetchMiniProfile() {
      try {
        const id = localStorage.getItem("user_id");
        const data = await getMiniProfile(id);
        setArtistProfile(data);
        console.log("profile data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchMiniProfile();
  }, []);

  // Get recommended studios based on artist preferences
  const getRecommendedStudios = () => {
    return studios.filter(studio => {
      // Match genres: at least one genre in common
      const matchesGenres = studio.genres.some(genre => 
        artistProfile.preferences.genres.includes(genre)
      );
      
      // More flexible location matching
      const artistLocation = artistProfile.preferences.location.toLowerCase();
      const studioLocation = studio.location.toLowerCase();
      const matchesLocation = studioLocation.includes(artistLocation) || 
                            artistLocation.includes(studioLocation.split(',')[0]) ||
                            (artistLocation.includes('new york') && studioLocation.includes('ny'));
      
      // Match price: within the artist's price range
      const matchesPrice = studio.price >= artistProfile.preferences.priceRange[0] && 
                          studio.price <= artistProfile.preferences.priceRange[1];
      
      // Match equipment: at least one equipment in common
      const matchesEquipment = studio.equipment.some(eq => 
        artistProfile.preferences.equipment.includes(eq)
      );
      
      return matchesGenres && matchesLocation && matchesPrice && matchesEquipment;
    });
  };

  const recommendedStudios = getRecommendedStudios();

  // Filter studios based on search and filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = studios.filter(studio => {
        // Search term filter
        const matchesSearch = 
          studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          studio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          studio.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Filter by location
        const matchesLocation = filters.location 
          ? studio.location.toLowerCase().includes(filters.location.toLowerCase()) 
          : true;
        
        // Filter by genre
        const matchesGenre = filters.genre 
          ? studio.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase()))
          : true;
        
        // Filter by availability
        const matchesAvailability = filters.availability.length > 0
          ? filters.availability.every(day => studio.availability.includes(day))
          : true;
        
        // Filter by services
        const matchesServices = filters.services.length > 0
          ? filters.services.every(service => studio.types.includes(service))
          : true;
        
        // Filter by amenities
        const matchesAmenities = filters.amenities.length > 0
          ? filters.amenities.every(amenity => studio.amenities.includes(amenity))
          : true;
        
        // Filter by price range
        const matchesPrice = studio.price >= filters.priceRange[0] && studio.price <= filters.priceRange[1];
        
        // Filter by equipment
        const matchesEquipment = filters.equipment.length > 0
          ? filters.equipment.every(eq => studio.equipment.includes(eq))
          : true;
        
        // Filter by studio type
        const matchesStudioType = filters.studioType.length > 0
          ? filters.studioType.every(type => studio.types.includes(type))
          : true;
        
        // Filter by languages
        const matchesLanguages = filters.languages.length > 0
          ? filters.languages.every(lang => studio.languages.includes(lang))
          : true;
        
        return matchesSearch && matchesLocation && matchesGenre && matchesAvailability && 
               matchesServices && matchesAmenities && matchesPrice && matchesEquipment && 
               matchesStudioType && matchesLanguages;
      });
      
      setFilteredStudios(filtered);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [studios, searchTerm, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle multi-select filter changes
  const handleMultiSelectFilter = (filterName: string, value: string) => {
    setFilters(prev => {
      const currentArray: string[] = prev[filterName as keyof typeof prev] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [filterName]: updatedArray
      };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: '',
      genre: '',
      availability: [],
      services: [],
      amenities: [],
      priceRange: [0, 200],
      equipment: [],
      studioType: [],
      languages: []
    });
    setSearchTerm('');
  };

  // Toggle filter category
  const toggleFilterCategory = (category: string) => {
    setOpenFilterCategory(openFilterCategory === category ? null : category);
  };

  // Enhanced Dashboard Section with studio details
  const EnhancedDashboardSection = ({ bookings }: { bookings: Booking[] }) => {
    // Get studio details for each booking
    const bookingsWithStudioDetails = useMemo(() => {
      return bookings.map(booking => {
        const studio = studios.find(s => s.id === booking.studio.id);
        return {
          ...booking,
          studio: studio || {
            id: 0,
            name: "Unknown Studio",
            avatar: "/studio/avatar.png",
            location: "Location not available",
            genres: [],
            rating: 0,
            price: 0,
            equipment: []
          }
        };
      });
    }, [bookings, studios]);

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 font-special">My Bookings</h2>
          
          {bookingsWithStudioDetails.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-900/50 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-special-regular">No bookings yet</h3>
              <p className="text-gray-500 max-w-md mx-auto font-special-regular">
                You haven't made any bookings yet. Start exploring studios to book your first session.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingsWithStudioDetails.map((booking) => (
                <div key={booking.bookingId} className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50 transition-all hover:border-purple-500/50">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Studio Image */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <img
                        src={booking.studio.avatar}
                        alt={booking.studio.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    
                    <div className="flex-1">
                      {/* Studio Name and Rating */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white font-special">{booking.studio.name}</h3>
                          <div className="flex items-center text-gray-400 mt-2">
                            <FaMapMarkerAlt className="mr-2 text-purple-400" />
                            <span>{booking.studio.location}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === true ? 'bg-green-500/20 text-green-400' :
                            booking.status === false ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Studio Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {booking.studio.genres.slice(0, 3).map((genre, index) => (
                          <span key={index} className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1.5 rounded-full">
                            {genre}
                          </span>
                        ))}
                        {booking.studio.genres.length > 3 && (
                          <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full">
                            +{booking.studio.genres.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            Date
                          </p>
                          <p className="text-white">{new Date(booking.bookingDate).toLocaleDateString("en-CA")}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 flex items-center">
                            <FaClock className="mr-2" />
                            Time
                          </p>
                          <p className="text-white">{booking.bookingTime.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Studio Equipment Preview */}
                      <div className="mb-4">
                        <p className="text-gray-500 text-sm mb-2">Featured Equipment:</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.studio.equipment.slice(0, 2).map((item, index) => (
                            <span key={index} className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                          {booking.studio.equipment.length > 2 && (
                            <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                              +{booking.studio.equipment.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price and Rating */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-white">{booking.studio.rating}</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-purple-400 font-bold">${booking.studio.price}/hr</span>
                        </div>
                        <button className="text-sm bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl transition-all">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab navigation items
  const tabs = [
    { id: 'search', label: 'Search Studios', color: 'purple' },
    { id: 'dashboard', label: 'My Bookings', color: 'blue' },
    { id: 'points', label: 'My Points', color: 'yellow' },
  ];

  // Sample data for filter options
  const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const serviceOptions = ['Recording', 'Mixing', 'Mastering', 'Rehearsal', 'Live Sound'];
  const amenityOptions = ['WiFi', 'Parking', 'Kitchen', 'Lounge', 'Shower'];
  const equipmentOptions = ['Microphones', 'Monitors', 'MIDI Controllers', 'Drum Kits', 'Guitar Amps'];
  const studioTypeOptions = ['Professional', 'Home', 'Project', 'Commercial'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Japanese'];

  return (
      <div className="min-h-screen relative overflow-hidden bg-gray-900">
        {/* Enhanced Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#132257] to-[#777777] animate-gradient "></div>
          <div className="blur-3xl absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(126,34,206,0.15)_0%,_transparent_70%)] animate-pulse-slow"></div>
          <div className="blur-2xl absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#0f0f0f,#7e22ce,#0f0f0f,#2563eb,#0f0f0f)] opacity-30 animate-rotate"></div>
        </div>
        
        {/* Top Navigation Bar */}
        <div className="relative z-20 w-full">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

    {/* Logo - Left */}
    <div className="w-full md:w-[15%] flex justify-start">
      <img 
        src="/home/logo.png" 
        className="h-12 w-16 md:h-15 md:w-20 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] rounded-sm" 
        alt="Logo"  
      />
    </div>

    {/* Modern Tab Navigation - Center */}
    <div className="w-full md:w-[70%] flex justify-center">
      <div className="relative bg-gray-800/50 backdrop-blur-2xl rounded-full p-1 border border-gray-500 border-t-white/30 border-l-white/30 shadow-2xl w-full md:w-auto">
        <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`relative px-4 md:px-5 py-2.5 rounded-full text-sm font-special transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-white opacity-100 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                  : "text-white opacity-50 hover:text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Background highlight */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-600/30 backdrop-blur-3xl z-0"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Foreground text */}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))} 
        </div>
      </div>
    </div>

    {/* Right Section */}
    <div className="w-full md:w-[35%] flex justify-end items-center space-x-3">
      <div className="flex items-center space-x-2">
        <NotificationDropdown />
        <FavoritesLink />
      </div>
      
      <ArtistProfileDropdown
        artistProfile={{
          name: artistProfile.name,
          prenom: artistProfile.artistName,
          avatar: artistProfile.avatar
        }}
      />
    </div>
  </div>
</div>


      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced Header with Floating Effect */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all duration-300 font-special bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Discover Your Creative Space
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg font-special-regular"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find the perfect studio for your next masterpiece. Book, create, and grow.
          </motion.p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recommended Studios Section - Compact Version */}
              {recommendedStudios.length > 0 && (
                <motion.div 
                  className="mb-8 relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  onHoverStart={() => setExpanded(true)}
                  onHoverEnd={() => setExpanded(false)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center font-special">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Recommendations For You
                    </h2>
                    <p className="text-gray-500 text-xs hidden md:block">Based on your preferences</p>
                  </div>
                  
                  {/* Compact View (Always Visible) */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl border border-gray-500 border-t-white/30 border-l-white/30 md:p-8 shadow-2xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedStudios.slice(0, 3).map(studio => (
                        <div 
                          key={studio.id} 
                          className="bg-gray-900/50 backdrop-blur rounded-xl p-4 border border-gray-700/50 transition-all group-hover:opacity-0"
                        >
                          <div className="flex items-center mb-3">
                            <img 
                              src={studio.avatar} 
                              alt={studio.name}
                              className="w-12 h-12 rounded-full object-cover mr-3 border border-purple-500/50"
                            />
                            <div>
                              <h3 className="font-bold text-white text-sm">{studio.name}</h3>
                              <div className="flex items-center text-xs text-gray-400">
                                <FaMapMarkerAlt className="mr-1 text-purple-400" size={10} />
                                <span>{studio.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {studio.genres.slice(0, 2).map((genre, idx) => (
                              <span 
                                key={idx} 
                                className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full"
                              >
                                {genre}
                              </span>
                            ))}
                            {studio.genres.length > 2 && (
                              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                                +{studio.genres.length - 2}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" size={12} />
                              <span className="text-sm">{studio.rating}</span>
                            </div>
                            <span className="text-sm font-bold text-purple-400">${studio.price}/hr</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expandable Full View (Visible on Hover) */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        className="absolute top-0 left-0 w-full z-10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-lg rounded-xl border border-purple-500/50 p-6 shadow-2xl">
                          <h2 className="text-xl font-bold text-white flex items-center font-special-regular">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Recommended For You Based On Your Profile
                          </h2><br />
                          <StudioCardGrid studios={recommendedStudios} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Modern Filters Panel - Hidden on desktop, shown via hamburger on mobile */}
                  <div className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white font-special">Filters</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={resetFilters}
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Reset All
                          </button>
                          <button 
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setShowFilters(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Search Filter */}
                        <div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              placeholder="Search studios..."
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                              value={searchTerm}
                              onChange={handleSearch}
                            />
                          </div>
                        </div>
                        
                        {/* Location Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('location')}
                          >
                            <span className="text-sm font-medium text-white">Location</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'location' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'location' && (
                            <div className="mt-3">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                  <FaMapMarkerAlt className="h-4 w-4" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter location"
                                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                                  value={filters.location}
                                  onChange={(e) => handleFilterChange('location', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Genre Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('genre')}
                          >
                            <span className="text-sm font-medium text-white">Genre</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'genre' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'genre' && (
                            <div className="mt-3">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                  <FaMusic className="h-4 w-4" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Search genre"
                                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                                  value={filters.genre}
                                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Price Range Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('price')}
                          >
                            <span className="text-sm font-medium text-white">Price Range</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'price' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'price' && (
                            <div className="mt-3 space-y-4">
                              <div>
                                <label className="block text-xs text-gray-400 mb-2">
                                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                </label>
                                <div className="space-y-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    step="10"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                  />
                                  <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    step="10"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>$0</span>
                                  <span>$200</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                                    filters.priceRange[0] === 0 && filters.priceRange[1] === 100
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                  }`}
                                  onClick={() => handleFilterChange('priceRange', [0, 100])}
                                >
                                  Under $100
                                </button>
                                <button 
                                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                                    filters.priceRange[0] === 100 && filters.priceRange[1] === 200
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                  }`}
                                  onClick={() => handleFilterChange('priceRange', [100, 200])}
                                >
                                  Premium
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Availability Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('availability')}
                          >
                            <span className="text-sm font-medium text-white">Availability</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'availability' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'availability' && (
                            <div className="mt-3 space-y-2">
                              {availabilityOptions.map(day => (
                                <label key={day} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.availability.includes(day)}
                                    onChange={() => handleMultiSelectFilter('availability', day)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{day}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Services Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('services')}
                          >
                            <span className="text-sm font-medium text-white">Services</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'services' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'services' && (
                            <div className="mt-3 space-y-2">
                              {serviceOptions.map(service => (
                                <label key={service} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.services.includes(service)}
                                    onChange={() => handleMultiSelectFilter('services', service)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{service}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Amenities Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('amenities')}
                          >
                            <span className="text-sm font-medium text-white">Amenities</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'amenities' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'amenities' && (
                            <div className="mt-3 space-y-2">
                              {amenityOptions.map(amenity => (
                                <label key={amenity} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.amenities.includes(amenity)}
                                    onChange={() => handleMultiSelectFilter('amenities', amenity)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{amenity}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Equipment Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('equipment')}
                          >
                            <span className="text-sm font-medium text-white">Equipment</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'equipment' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'equipment' && (
                            <div className="mt-3 space-y-2">
                              {equipmentOptions.map(equipment => (
                                <label key={equipment} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.equipment.includes(equipment)}
                                    onChange={() => handleMultiSelectFilter('equipment', equipment)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{equipment}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Studio Type Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('studioType')}
                          >
                            <span className="text-sm font-medium text-white">Studio Type</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'studioType' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'studioType' && (
                            <div className="mt-3 space-y-2">
                              {studioTypeOptions.map(type => (
                                <label key={type} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.studioType.includes(type)}
                                    onChange={() => handleMultiSelectFilter('studioType', type)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{type}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Languages Filter */}
                        <div className="bg-gray-800/40 rounded-xl p-3">
                          <button 
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleFilterCategory('languages')}
                          >
                            <span className="text-sm font-medium text-white">Languages</span>
                            <FaChevronDown className={`transition-transform ${openFilterCategory === 'languages' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFilterCategory === 'languages' && (
                            <div className="mt-3 space-y-2">
                              {languageOptions.map(language => (
                                <label key={language} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.languages.includes(language)}
                                    onChange={() => handleMultiSelectFilter('languages', language)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{language}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Enhanced Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search studios by name, location, or genre..."
                          className="w-full bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                      <button 
                        className="lg:hidden bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl flex items-center justify-center transition-all font-special-regular"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? (
                          <>
                            <FaTimes className="h-5 w-5 mr-2" />
                            Hide Filters
                          </>
                        ) : (
                          <>
                            <FaFilter className="h-5 w-5 mr-2" />
                            Show Filters
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Horizontal Filter Bar for Desktop */}
                    <div className="hidden lg:flex flex-wrap gap-3 mb-6 bg-gray-900/70 backdrop-blur rounded-xl p-4 border border-gray-700/50 relative z-30">
                      {/* Location Filter */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('location')}
                        >
                          <FaMapMarkerAlt className="text-purple-400" />
                          Location
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'location' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'location' && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 min-w-[250px] shadow-2xl border border-gray-700">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <FaMapMarkerAlt className="h-4 w-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="Enter location"
                                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Genre Filter */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('genre')}
                        >
                          <FaMusic className="text-purple-400" />
                          Genre
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'genre' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'genre' && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 min-w-[250px] shadow-2xl border border-gray-700">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <FaMusic className="h-4 w-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="Search genre"
                                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                                value={filters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Price Range Filter */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('price')}
                        >
                          <span className="text-purple-400">$</span>
                          Price
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'price' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'price' && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 min-w-[300px] shadow-2xl border border-gray-700">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs text-gray-400 mb-2">
                                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                </label>
                                <div className="space-y-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    step="10"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                  />
                                  <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    step="10"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>$0</span>
                                  <span>$200</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                                    filters.priceRange[0] === 0 && filters.priceRange[1] === 100
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                  }`}
                                  onClick={() => handleFilterChange('priceRange', [0, 100])}
                                >
                                  Under $100
                                </button>
                                <button 
                                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                                    filters.priceRange[0] === 100 && filters.priceRange[1] === 200
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                  }`}
                                  onClick={() => handleFilterChange('priceRange', [100, 200])}
                                >
                                  Premium
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Availability Filter */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('availability')}
                        >
                          <FaCalendarAlt className="text-purple-400" />
                          Availability
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'availability' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'availability' && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 min-w-[200px] shadow-2xl border border-gray-700">
                            <div className="space-y-2">
                              {availabilityOptions.map(day => (
                                <label key={day} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.availability.includes(day)}
                                    onChange={() => handleMultiSelectFilter('availability', day)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Services Filter */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('services')}
                        >
                          <FaMusic className="text-purple-400" />
                          Services
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'services' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'services' && (
                          <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 min-w-[200px] shadow-2xl border border-gray-700">
                            <div className="space-y-2">
                              {serviceOptions.map(service => (
                                <label key={service} className="flex items-center text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={filters.services.includes(service)}
                                    onChange={() => handleMultiSelectFilter('services', service)}
                                    className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                  />
                                  <span className="ml-2">{service}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* More Filters Button */}
                      <div className="relative group">
                        <button 
                          className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                          onClick={() => toggleFilterCategory('more')}
                        >
                          <FaFilter className="text-purple-400" />
                          More Filters
                          <FaChevronDown className={`text-xs transition-transform ${openFilterCategory === 'more' ? 'rotate-180' : ''}`} />
                        </button>
                        {openFilterCategory === 'more' && (
                          <div className="absolute top-full right-0 mt-2 z-50 bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 w-[300px] shadow-2xl border border-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Amenities Filter */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">Amenities</h4>
                                <div className="space-y-2">
                                  {amenityOptions.map(amenity => (
                                    <label key={amenity} className="flex items-center text-xs text-gray-300">
                                      <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity)}
                                        onChange={() => handleMultiSelectFilter('amenities', amenity)}
                                        className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                      />
                                      <span className="ml-2">{amenity}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Equipment Filter */}
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">Equipment</h4>
                                <div className="space-y-2">
                                  {equipmentOptions.slice(0, 3).map(equipment => (
                                    <label key={equipment} className="flex items-center text-xs text-gray-300">
                                      <input
                                        type="checkbox"
                                        checked={filters.equipment.includes(equipment)}
                                        onChange={() => handleMultiSelectFilter('equipment', equipment)}
                                        className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700/50"
                                      />
                                      <span className="ml-2">{equipment}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Reset Filters Button */}
                      <button 
                        onClick={resetFilters}
                        className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 py-2 px-4 rounded-xl transition-all text-sm"
                      >
                        <FaTimes className="text-purple-400" />
                        Clear All Filters
                      </button>
                    </div>
                    
                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-special-regular text-white">
                          {filteredStudios.length} Studio{filteredStudios.length !== 1 ? 's' : ''} Found
                        </h2>
                        <p className="text-gray-500 text-sm fonts-pecial-regular">
                          {filters.location ? `in ${filters.location}` : 'Worldwide'} • 
                          {filters.genre ? ` ${filters.genre} genre` : ' All genres'}
                        </p>
                      </div>

                    </div>
                    
                    {/* Loading Skeleton */}
                    {loading && (
                      <div className="space-y-6">
                        {[1, 2, 3].map((item) => (
                          <motion.div 
                            key={item}
                            className="bg-gray-900/50 backdrop-blur rounded-2xl p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex flex-col md:flex-row gap-6 animate-pulse">
                              <div className="bg-gray-800 rounded-xl w-full md:w-64 h-48"></div>
                              <div className="flex-1 space-y-4">
                                <div className="h-6 bg-gray-800 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                                <div className="flex flex-wrap gap-2">
                                  {[1, 2, 3].map(tag => (
                                    <div key={tag} className="h-6 bg-gray-800 rounded-full w-16"></div>
                                  ))}
                                </div>
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    {/* Results */}
                    {!loading && filteredStudios.length > 0 ? (
                      <StudioCardGrid studios={filteredStudios} />
                    ) : !loading ? (
                      <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="bg-gray-900/50 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 极速24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 font-special-regular">No studios found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6 font-special-regular">
                          Try adjusting your search or filters. We couldn't find any studios matching your criteria.
                        </p>
                        <button 
                          onClick={resetFilters}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 font-special-regular"
                        >
                          Reset Filters
                        </button>
                      </motion.div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedDashboardSection bookings={bookings} />
            </motion.div>
          )}
          
          
          {/* Points Tab */}
          {activeTab === 'points' && (
            <motion.div
              key="points"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PointsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Global Styles for Animated Background */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 极速100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 20s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-rotate {
          animation: rotate 60s linear infinite;
        }
        
        /* Modern scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 15, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(126, 34, 206, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(极速126, 34, 206, 0.8);
        }
      `}</style>
    </div>
  );
};

export default StudiosPage;