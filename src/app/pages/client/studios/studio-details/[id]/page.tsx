// app/studio-details/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingDialog from '../../../../../components/BookingDialog';
import StudioTour360, { StudioTourScene } from '@/app/components/StudioTour360';
import { useI18n } from '@/app/i18n/I18nProvider';
import { useT } from '@/app/i18n/useT';
import { 
  FaStar, FaMusic, FaHeadphones, FaWifi, FaCoffee, FaParking, 
  FaCalendarAlt, FaClock, FaUserFriends, FaMapMarkerAlt, FaLanguage,
  FaHeart, FaRegHeart, FaInstagram, FaYoutube,
  FaArrowLeft
} from 'react-icons/fa';
import { FaStar as FaStarSolid, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Studio_details } from '../../../types';
import { useParams } from 'next/navigation';
import { addFavorite, createReview, getStudioDetailsById, getReviews } from '../../../service/api';
import { useRouter } from 'next/navigation';
import { formatHumanDateSmart, formatHumanTimeRange } from '@/app/lib/datetime';
import ClientBackdrop from '@/app/components/ClientBackdrop';
import LuxSpinner from '@/app/components/LuxSpinner';




const StudioDetailsPage = () => {
  const { locale } = useI18n();
  const t = useT();

  const router = useRouter();
  const params = useParams();
  const id = params?.id; 

  const toHttpsUrl = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return "";
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    return `https://${cleaned}`;
  };

  const instagramUrl = (raw: string) => {
    const cleaned = raw.trim().replace(/^@/, "");
    if (!cleaned) return "";
    if (/^https?:\/\//i.test(cleaned) || cleaned.includes("instagram.com")) {
      return toHttpsUrl(cleaned);
    }
    return `https://instagram.com/${cleaned}`;
  };

  const youtubeUrl = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return "";
    if (
      /^https?:\/\//i.test(cleaned) ||
      cleaned.includes("youtube.com") ||
      cleaned.includes("youtu.be")
    ) {
      return toHttpsUrl(cleaned);
    }
    return toHttpsUrl(cleaned);
  };

  const [studio, setStudio] = useState<Studio_details | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  // Add these to your component state
  const [reviews, setReviews] = useState<any[]>([]);

  const [userReview, setUserReview] = useState({
      id: 0,
      user: "",
      rating: 0,
      comment: "",
      date: ""
    });
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  const [userId, setUserId] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("user_id"));
    setArtistId(localStorage.getItem("artist_id"));
  }, []);

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
  const handleAddReview = () => {
    if (newReviewRating === 0 || newReviewComment.trim() === '') return;
    if (!artistId) return;
    
    const newReview = {
      id: reviews.length + 1,
      user: t('common.you'), // In a real app, this would come from user data
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };


    

    const backendReview = {
      artist_id: Number(artistId),
      studio_id: Number(id),
      rating: Number(newReviewRating),
      comment: newReviewComment,
      review_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    

    createReview(backendReview)    
    // Set as user's review
    setUserReview(newReview);
    
    // Reset form
    setNewReviewRating(0);
    setNewReviewComment('');
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if(isFavorite == false){
      if (!artistId) return;
      const favorite = { 
        artist_id: Number(artistId), 
        studio_id: Number(id)
      }

      addFavorite(favorite);
    }
  };


  // fetch studio details
  useEffect(() => {
    let cancelled = false;

    const fetchStudioDetails = async () => {
      if (!id) {
        setStudio(null);
        setLoading(true);
        return;
      }

      setLoading(true);
      const studioId = parseInt(id as string, 10);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = await getStudioDetailsById(studioId);
        if (cancelled) return;
        setStudio(data ?? null);
        setIsFavorite(Math.random() > 0.5);
      } catch (err) {
        console.error(err);
        if (!cancelled) setStudio(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStudioDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // fetch reviews for this studio
  useEffect(() => {
    if (!id) return;
    const studioId = parseInt(id as string, 10);
    async function fetchReviews(studioId: number) {
      try {
        const data = await getReviews(studioId);
        const mapped = (data || []).map((item: any) => ({
          id: item.id,
          user: item.user_id ? `User ${item.user_id}` : 'Anonymous',
          rating: item.rating,
          comment: item.comment,
          date: item.date,
        }));
        setReviews(mapped);
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    }
    fetchReviews(studioId);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-950 flex items-center justify-center lux-rect">
        <ClientBackdrop />
        <div className="relative z-10">
          <LuxSpinner label={t('studioDetails.loadingStudio')} />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-950 flex flex-col items-center justify-center p-4 lux-rect">
        <ClientBackdrop />
        <div className="relative z-10 lux-card lux-rect p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">{t('studioDetails.notFoundTitle')}</h1>
          <p className="text-gray-400 mb-6">{t('studioDetails.notFoundBody')}</p>
          <a 
            href="/" 
            className="lux-btn-metal inline-flex items-center justify-center px-6 py-3"
          >
            {t('common.browseStudios')}
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
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white lux-rect">
      <ClientBackdrop />
       {/* Back Button */}
              <button 
                onClick={() => router.back()} 
                className="relative z-10 lux-btn-ghost inline-flex items-center mb-6 mt-8 ml-5 px-4 py-2 text-sm font-medium text-white/85"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>  
      {/* Cover Photo */}
      <div className="relative h-64 md:h-96 w-full">
              
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studio.coverPhoto})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-gray-950">
           
          </div>
          
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="lux-card lux-rect w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden border-white/10 bg-black/30">
              <img 
                src={studio.avatar} 
                alt={studio.name} 
                className="w-full h-full object-cover lux-media"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="text-white">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">{studio.name}</h1>
                {/* Favorite Button */}
                <button 
                  onClick={toggleFavorite}
                  className="ml-4 lux-btn-ghost p-2 rounded-full"
                  aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
                >
                  {isFavorite ? (
                    <FaHeart className="text-xl text-purple-400" />
                  ) : (
                    <FaRegHeart className="text-xl text-gray-400" />
                  )}
                </button>
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
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
              {['overview', 'tour', 'services', 'equipment', 'amenities', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={
                    activeTab === tab
                      ? 'lux-btn-metal px-4 py-2 text-sm font-medium'
                      : 'lux-btn-ghost px-4 py-2 text-sm font-medium text-white/80'
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`studioDetails.tabs.${tab}`)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="lux-card lux-rect p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {t('studioDetails.aboutTitle', { studio: studio.name })}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {studio.description || t('studioDetails.defaultDescription')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaMusic className="text-purple-400" /> {t('studioDetails.studioTypes')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.types.map((type, index) => (
                          <span 
                            key={index} 
                            className="lux-chip border-white/10 bg-black/30 text-white/75"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaHeadphones className="text-purple-400" /> {t('studioDetails.genres')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="lux-chip border-white/10 bg-black/30 text-white/75"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-400" /> {t('studios.availability')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.availability.map((day, index) => (
                          <span 
                            key={index} 
                            className="lux-chip border-white/10 bg-black/30 text-white/75"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <FaLanguage className="lux-icon-metal" /> {t('studios.languages')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {studio.languages.map((lang, index) => (
                          <span 
                            key={index} 
                            className="lux-chip border-white/10 bg-black/30 text-white/75"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {studio.rules && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-white mb-3">{t('studioDetails.studioRules')}</h3>
                      <p className="text-gray-300">{studio.rules}</p>
                    </div>
                  )}
                  
                  {studio.cancellationPolicy && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{t('studioDetails.cancellationPolicy')}</h3>
                      <p className="text-gray-300">{studio.cancellationPolicy}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tour Tab */}
              {activeTab === 'tour' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{t('tour360.title')}</h2>
                      <p className="text-gray-400 mt-1">
                        {t('studioDetails.tourSubtitle')}
                      </p>
                    </div>
                  </div>

                  <StudioTour360
                    scenes={(() => {
                      const scenes = studio.virtualTour?.scenes ?? [];
                      if (scenes.length > 0) return scenes as StudioTourScene[];
                      // Fallback: use the cover photo for an “immersive pan” experience
                      const fallbackUrl = studio.coverPhoto || studio.avatar || '/studio/studio.jpg';
                      return [
                        {
                          id: 'main-room',
                          title: t('studioDetails.tourMainRoom'),
                          imageUrl: fallbackUrl,
                        },
                      ];
                    })()}
                    equipment={studio.equipment ?? []}
                    defaultSceneId={studio.virtualTour?.scenes?.[0]?.id}
                  />
                </motion.div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && studio.services && studio.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">{t('studioDetails.servicesPricing')}</h2>
                  
                      <div className="space-y-6">
                    {studio.services.map((service, index) => (
                      <div 
                        key={index} 
                        className="lux-card lux-rect lux-tilt p-5"
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
                                <span>{t('studioDetails.maxPeople', { count: service.maxCapacity })}</span>
                              </div>
                            )}
                            
                            {service.availableTimes && (
                              <div className="mt-3">
                                <span className="text-sm bg-black/30 border border-white/10 text-white/75 px-2 py-1 rounded">
                                  Available: {formatHumanTimeRange(service.availableTimes)}
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
                  <h2 className="text-2xl font-bold text-white mb-6">{t('studioDetails.studioEquipment')}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {studio.equipment.map((item, index) => (
                      <div 
                        key={index} 
                        className="lux-card lux-rect lux-tilt p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-black/30 border border-white/10 p-2 rounded-lg">
                            <FaHeadphones className="text-blue-400" />
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
                  <h2 className="text-2xl font-bold text-white mb-6">{t('studioDetails.amenitiesFacilities')}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {studio.amenities.map((item, index) => (
                      <div 
                        key={index} 
                        className="lux-card lux-rect lux-tilt p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-black/30 border border-white/10 p-2 rounded-lg">
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
                  <h2 className="text-2xl font-bold text-white mb-6">{t('studioDetails.customerReviews')}</h2>
                  
                  {/* Add Review Form */}
                  <div className="lux-card lux-rect p-5 mb-6 bg-black/20">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('studioDetails.addYourReview')}</h3>
                    
                    <div className="space-y-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-gray-400 mb-2">{t('studioDetails.yourRating')}</label>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="text-yellow-400 text-xl focus:outline-none"
                            >
                              {star <= newReviewRating ? (
                                <FaStarSolid />
                              ) : (
                                <FaRegStar className="text-gray-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Comment */}
                      <div>
                        <label className="block text-gray-400 mb-2">{t('studioDetails.yourReview')}</label>
                        <textarea
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="lux-input min-h-[110px] resize-y"
                          rows={3}
                          placeholder={t('studioDetails.reviewPlaceholder')}
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddReview}
                          className="lux-btn-metal px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={newReviewRating === 0 || newReviewComment.trim() === ''}
                        >
                          {t('studioDetails.submitReview')}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {/* User's review if exists */}
                    {userReview && (userReview.rating > 0 || userReview.comment.trim() !== '') && (
  <div className="lux-card lux-rect p-5 relative border-purple-500/30 bg-black/20">
    <div className="absolute top-4 right-35 bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm">
      {t('studioDetails.yourReview')}
    </div>
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{t('common.you')}</h3>
        <div className="flex text-yellow-400 mt-1">
          {renderStars(userReview.rating)}
        </div>
      </div>
      <span className="text-gray-500 text-sm">{formatHumanDateSmart(userReview.date)}</span>
    </div>
    
    <p className="text-gray-300 mt-4">{userReview.comment}</p>
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
                          <span className="text-gray-500 text-sm">{formatHumanDateSmart(review.date)}</span>
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
            <div className="sticky top-24 lux-card lux-rect p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">{t('studioDetails.bookingDetails')}</h2>
                {/* Favorite button in booking card */}
                <button 
                  onClick={toggleFavorite}
                  className="lux-btn-ghost p-2 rounded-full"
                  aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
                >
                  {isFavorite ? (
                    <FaHeart className="text-xl text-purple-400" />
                  ) : (
                    <FaRegHeart className="text-xl text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">{t('studioDetails.startingPrice')}</h3>
                  <p className="text-2xl font-bold text-white">
                    ${studio.price}{' '}
                    <span className="text-gray-500 text-sm font-normal">
                      {t('studioDetails.perHour')}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">{t('studios.availability')}</h3>
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
                  <h3 className="text-gray-400 text-sm mb-1">{t('studioDetails.studioTypes')}</h3>
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
                    className="lux-btn-metal w-full py-3 font-semibold"
                  >
                    {t('studioDetails.bookNow')}
                  </button>
                </div>
              </div>
              
              {studio.contact && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">{t('studioDetails.contactInformation')}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">{t('common.email')}</p>
                      <p className="text-gray-300">{studio.contact.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">{t('common.phone')}</p>
                      <p className="text-gray-300">{studio.contact.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">{t('common.website')}</p>
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
                          href={instagramUrl(studio.contact.instagram)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-btn-ghost inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-black/25 hover:bg-white/5"
                          aria-label={t('common.instagram')}
                        >
                          <FaInstagram className="text-xl text-[#E1306C]" />
                          <span className="sr-only">{t('common.instagram')}</span>
                        </a>
                      )}
                      
                      {studio.contact.soundcloud && (
                        <a 
                          href={`https://${studio.contact.soundcloud}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          {t('common.soundcloud')}
                        </a>
                      )}
                      
                      {studio.contact.youtube && (
                        <a 
                          href={youtubeUrl(studio.contact.youtube)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-btn-ghost inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-black/25 hover:bg-white/5"
                          aria-label={t('common.youtube')}
                        >
                          <FaYoutube className="text-xl text-[#FF0000]" />
                          <span className="sr-only">{t('common.youtube')}</span>
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/65 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={toggleFavorite}
            className="lux-btn-ghost p-3 rounded-full"
            aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
          >
            {isFavorite ? (
              <FaHeart className="text-xl text-purple-400" />
            ) : (
              <FaRegHeart className="text-xl text-gray-400" />
            )}
          </button>
                <button
            onClick={() => setShowBookingDialog(true)}
                  className="lux-btn-metal flex-1 ml-4 py-3 font-semibold"
                >
                  {t('studioDetails.bookNow')}
                </button>
        </div>
      </div>
    </div>
  );
};

export default StudioDetailsPage;
