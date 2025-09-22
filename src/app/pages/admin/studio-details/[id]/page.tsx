// app/studio-details/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaStar, FaMusic, FaHeadphones, FaWifi, FaCoffee, FaParking, 
  FaCalendarAlt, FaClock, FaUserFriends, FaMapMarkerAlt, FaLanguage,
  FaHeart, FaRegHeart
} from 'react-icons/fa';
import { FaStar as FaStarSolid, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import BookingDialog from '@/app/components/BookingDialog';

type Studio = {
  id: number;
  name: string;
  avatar: string;
  coverPhoto: string;
  rating: number;
  location: string;
  types: string[];
  genres: string[];
  price: number;
  amenities: string[];
  equipment: string[];
  languages: string[];
  availability: string[];
  description?: string;
  contact?: {
    email: string;
    phone: string;
    website: string;
    instagram: string;
    soundcloud: string;
    youtube: string;
  };
  services?: {
    name: string;
    description: string;
    price: string;
    priceType: string;
    duration: string;
    maxCapacity: string;
    availableTimes: string;
    tags: string;
  }[];
  rules?: string;
  cancellationPolicy?: string;
};

const StudioDetailsPage = ({ params }: { params: { id: string } }) => {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Add favorite state

  // Sample studio data with extended details
  const studiosData: Studio[] = [
    {
      id: 1,
      name: "Harmony Studios",
      avatar: "/studio/avatar.png",
      coverPhoto: "/studio/cover.jpg",
      rating: 4.8,
      location: "Brooklyn, NY",
      types: ["Recording", "Mixing"],
      genres: ["Rock", "Jazz", "Blues"],
      price: 75,
      amenities: ["WiFi", "Coffee", "Parking"],
      equipment: ["Neumann U87", "SSL Console", "Genelec Monitors"],
      languages: ["English", "Spanish"],
      availability: ["Mon", "Wed", "Fri"],
      description: "Professional recording studio with state-of-the-art equipment and acoustically treated rooms. Perfect for bands, solo artists, and voice-over work.",
      contact: {
        email: "info@harmonystudios.com",
        phone: "+1 (555) 123-4567",
        website: "www.harmonystudios.com",
        instagram: "@harmonystudios",
        soundcloud: "soundcloud.com/harmonystudios",
        youtube: "youtube.com/harmonystudios"
      },
      services: [
        {
          name: "Recording Session",
          description: "Professional recording with engineer",
          price: "75",
          priceType: "hour",
          duration: "60",
          maxCapacity: "5",
          availableTimes: "9AM-9PM",
          tags: "recording, mixing"
        },
        {
          name: "Mixing & Mastering",
          description: "Professional audio post-production",
          price: "100",
          priceType: "track",
          duration: "",
          maxCapacity: "",
          availableTimes: "9AM-6PM",
          tags: "mixing, mastering"
        }
      ],
      rules: "No food or drinks in the studio. Smoking allowed only in designated areas outside.",
      cancellationPolicy: "24-hour notice required for cancellations. 50% charge for late cancellations."
    },
  ];

  // Add these to your component state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Alex Johnson",
      rating: 5,
      comment: "Amazing studio with top-notch equipment! The sound engineer really knew his stuff and helped us get the perfect sound for our EP.",
      date: "2025-08-15"
    },
    {
      id: 2,
      user: "Maria Garcia",
      rating: 4,
      comment: "The acoustics in this studio are incredible. We recorded our jazz album here and couldn't be happier with the results. Will definitely return!",
      date: "2025-07-28"
    }
  ]);

  const [userReview, setUserReview] = useState(null);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < Math.floor(rating)) {
        return <FaStarSolid key={i} />;
      } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
        return <FaStarHalfAlt key={i} />;
      } else {
        return <FaRegStar key={i} className="text-gray-500" />;
      }
    });
  };

  // Function to handle adding a review
  /*const handleAddReview = () => {
    if (newReviewRating === 0 || newReviewComment.trim() === '') return;
    
    const newReview = {
      id: reviews.length + 1,
      user: "You", // In a real app, this would come from user data
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    // Set as user's review
    setUserReview(newReview);
    
    // Reset form
    setNewReviewRating(0);
    setNewReviewComment('');
  };*/



  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundStudio = studiosData.find(s => s.id === parseInt(params.id));
      setStudio(foundStudio || null);
      setLoading(false);
      
      // Simulate checking if studio is favorite
      // In a real app, this would come from an API
      setIsFavorite(Math.random() > 0.5); // Random favorite status for demo
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Studio Not Found</h1>
          <p className="text-gray-400 mb-6">The studio you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Browse Studios
          </a>
        </div>
      </div>
    );
  }

  // Render star rating
  const renderRatingStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < Math.floor(studio.rating) ? "text-yellow-400" : "text-gray-600"} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-96 w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studio.coverPhoto})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="bg-gray-800 border-4 border-gray-700 rounded-xl w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
              <img 
                src={studio.avatar} 
                alt={studio.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-white">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">{studio.name}</h1>

              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-lg">
                  {renderRatingStars()}
                </div>
                <span className="text-gray-400">({studio.rating})</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <p className="text-gray-300">{studio.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
              {['overview', 'services', 'equipment', 'amenities', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">About {studio.name}</h2>
                  <p className="text-gray-300 mb-6">
                    {studio.description || "Professional recording studio with state-of-the-art equipment."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaMusic className="text-purple-400" /> Studio Types
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.types.map((type, index) => (
                          <span 
                            key={index} 
                            className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaHeadphones className="text-blue-400" /> Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-cyan-400" /> Availability
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.availability.map((day, index) => (
                          <span 
                            key={index} 
                            className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded-full text-sm"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaLanguage className="text-yellow-400" /> Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.languages.map((lang, index) => (
                          <span 
                            key={index} 
                            className="bg-yellow-900/40 text-yellow-300 px-3 py-1 rounded-full text-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {studio.rules && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-white mb-3">Studio Rules</h3>
                      <p className="text-gray-300">{studio.rules}</p>
                    </div>
                  )}
                  
                  {studio.cancellationPolicy && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-white mb-3">Cancellation Policy</h3>
                      <p className="text-gray-300">{studio.cancellationPolicy}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && studio.services && studio.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Services & Pricing</h2>
                  
                  <div className="space-y-6">
                    {studio.services.map((service, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                            <p className="text-gray-400 mt-2">{service.description}</p>
                            
                            {service.tags && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {service.tags.split(',').map((tag, i) => (
                                  <span 
                                    key={i} 
                                    className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="md:text-right">
                            <div className="text-2xl font-bold text-white">
                              ${service.price}
                              <span className="text-gray-500 text-sm font-normal ml-1">
                                /{service.priceType}
                              </span>
                            </div>
                            
                            {service.duration && (
                              <div className="flex items-center gap-2 mt-2 text-gray-400 md:justify-end">
                                <FaClock />
                                <span>{service.duration} minutes</span>
                              </div>
                            )}
                            
                            {service.maxCapacity && (
                              <div className="flex items-center gap-2 mt-1 text-gray-400 md:justify-end">
                                <FaUserFriends />
                                <span>Max {service.maxCapacity} people</span>
                              </div>
                            )}
                            
                            {service.availableTimes && (
                              <div className="mt-3">
                                <span className="text-sm bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                                  Available: {service.availableTimes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Equipment Tab */}
              {activeTab === 'equipment' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Studio Equipment</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {studio.equipment.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-cyan-900/30 p-2 rounded-lg">
                            <FaHeadphones className="text-cyan-400" />
                          </div>
                          <span className="text-white">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Amenities & Facilities</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {studio.amenities.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-900/30 p-2 rounded-lg">
                            {item === "WiFi" && <FaWifi className="text-purple-400" />}
                            {item === "Coffee" && <FaCoffee className="text-purple-400" />}
                            {item === "Parking" && <FaParking className="text-purple-400" />}
                            {/* Add more icons as needed */}
                          </div>
                          <span className="text-white">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                  
                  
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {/* User's review if exists */}
                    {userReview && (
                      <div className="bg-gray-900/50 p-5 rounded-xl border border-purple-500/30 relative">
                        <div className="absolute top-4 right-30 bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm">
                          Your Review
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">You</h3>
                            <div className="flex text-yellow-400 mt-1">
                              {renderStars((userReview as any).rating)}
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">{(userReview as any).date}</span>
                        </div>
                        
                        <p className="text-gray-300 mt-4">{(userReview as any).comment}</p>
                      </div>
                    )}
                    
                    {/* Other reviews */}
                    {reviews.map((review, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-900/50 p-5 rounded-xl border border-gray-700"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{review.user}</h3>
                            <div className="flex text-yellow-400 mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        
                        <p className="text-gray-300 mt-4">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Right Column - Booking Card */}
          <div>
            <div className="sticky top-24 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">Booking Details</h2>
                
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Starting Price</h3>
                  <p className="text-2xl font-bold text-white">${studio.price} <span className="text-gray-500 text-sm font-normal">/ hour</span></p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {studio.availability.map((day, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Studio Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {studio.types.map((type, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    onClick={() => setShowBookingDialog(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
              
              {studio.contact && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-gray-300">{studio.contact.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-gray-300">{studio.contact.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Website</p>
                      <a 
                        href={`https://${studio.contact.website}`} 
                        className="text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {studio.contact.website}
                      </a>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                      {studio.contact.instagram && (
                        <a 
                          href={`https://instagram.com/${studio.contact.instagram}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-400"
                        >
                          Instagram
                        </a>
                      )}
                      
                      {studio.contact.soundcloud && (
                        <a 
                          href={`https://${studio.contact.soundcloud}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          SoundCloud
                        </a>
                      )}
                      
                      {studio.contact.youtube && (
                        <a 
                          href={`https://${studio.contact.youtube}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      {showBookingDialog && studio.services && (
        <BookingDialog 
          studio={studio}
          services={studio.services}
          onClose={() => setShowBookingDialog(false)}
        />
      )}

      {/* Fixed Book Now Button (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">

          <button
            onClick={() => setShowBookingDialog(true)}
            className="flex-1 ml-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioDetailsPage;