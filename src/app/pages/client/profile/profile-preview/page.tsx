'use client';
import React, { useEffect, useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaMusic, 
  FaMicrophone, 
  FaGlobe, 
  FaHeadphones, 
  FaUserFriends,
  FaPlay,
  FaPause,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaSoundcloud,
  FaYoutube,
  FaArrowLeft
 } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { specialGothic } from '@/app/fonts';
import { ArtistFormData } from '@/app/pages/studio/types';
import { getProfile } from '@/app/pages/studio/services/api';
import ReviewsSection from '@/app/components/ReviewsSection';
import { Reviews } from '../../types';
import { deleteReview, getReviews, updateReview } from '../../service/api';
import { useRouter } from 'next/navigation'; // Added useRouter
import ClientBackdrop from '@/app/components/ClientBackdrop';
import YesNoModal from '@/app/components/YesNoModal';
import { useT } from '@/app/i18n/useT';



export default function ArtistProfilePage() {
  const t = useT();
  const [artistData, setArtistData] = useState<ArtistFormData>({
    fullName: '',
    artistName: '',
    avatarImage: '',
    bio: '',
    location: '',
    contact: {
      email: '',
      phone: '',
      instagram: '',
      soundcloud: '',
      youtube: ''
    },
    genres: [],
    instruments: [],
    demos: [
    ],
    collaborators: [],
    languages: [],
    experienceLevel: 'pro',
    yearsOfExperience: 0,
    availability: '',
    portfolio: []
  });

  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [artistId, setArtistId] = useState<number | null>(null);

  const [modalMode, setModalMode] = useState<null | 'edit' | 'delete'>(null);
  const [selectedReview, setSelectedReview] = useState<Reviews | null>(null);
  const [draftRating, setDraftRating] = useState<number>(5);
  const [draftComment, setDraftComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("artist_id") ?? localStorage.getItem("user_id");
    if (!raw) return;
    const id = Number(raw);
    if (!Number.isFinite(id)) return;
    setArtistId(id);
  }, []);

  useEffect(() => {
    if (!artistId) return;

    async function fetchProfileAndReviews() {
      try {
        const [profile, reviewsData] = await Promise.all([
          getProfile(artistId),
          getReviews(artistId),
        ]);
        setArtistData(profile);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfileAndReviews();
  }, [artistId]);


        const router = useRouter(); // Initialize router

  const closeModal = () => {
    setModalMode(null);
    setSelectedReview(null);
    setIsSubmittingReview(false);
  };

  const openDeleteModal = (review: Reviews) => {
    setSelectedReview(review);
    setModalMode('delete');
  };

  const openEditModal = (review: Reviews) => {
    setSelectedReview(review);
    setDraftRating(Number(review.rating) || 5);
    setDraftComment(String(review.comment ?? ''));
    setModalMode('edit');
  };

  const confirmDelete = async () => {
    if (!artistId || !selectedReview) return;
    const reviewId = Number(selectedReview.id);
    if (!Number.isFinite(reviewId)) return;

    setIsSubmittingReview(true);
    try {
      await deleteReview(artistId, reviewId);
      setReviews((prev) => prev.filter((r) => Number(r.id) !== reviewId));
      closeModal();
    } catch (err) {
      console.error(err);
      setIsSubmittingReview(false);
    }
  };

  const confirmEdit = async () => {
    if (!artistId || !selectedReview) return;
    const reviewId = Number(selectedReview.id);
    if (!Number.isFinite(reviewId)) return;

    setIsSubmittingReview(true);
    try {
      const updated = await updateReview(artistId, reviewId, {
        rating: draftRating,
        comment: draftComment,
      });

      setReviews((prev) =>
        prev.map((r) => (Number(r.id) === reviewId ? { ...r, ...updated } : r))
      );
      closeModal();
    } catch (err) {
      console.error(err);
      setIsSubmittingReview(false);
    }
  };
      

  const toggleDemoPlay = (index: number) => {
    setArtistData(prev => {
      const newDemos = [...prev.demos];
      
      // Pause all other demos
      newDemos.forEach((demo, i) => {
        if (i !== index) demo.playing = false;
      });
      
      // Toggle current demo
      newDemos[index].playing = !newDemos[index].playing;
      
      return { ...prev, demos: newDemos };
    });
  };

  const renderExperienceLevel = (level: string) => {
    switch(level) {
      case 'beginner': return t('profile.experienceLevels.beginner');
      case 'intermediate': return t('profile.experienceLevels.intermediate');
      case 'pro': return t('profile.experienceLevels.pro');
      default: return level;
    }
  };

  const renderPortfolioItem = (item: any, index: number) => {
    return (
      <motion.div 
        key={index}
        className="lux-card lux-rect lux-tilt h-65 w-50 p-4"
        whileHover={{ y: -5 }}
      >
        <div className="relative group">
          {item.type === 'image' && (
            <div className="w-40 h-40 flex items-center justify-center rounded-lg border border-white/10 bg-black/25">
              <div className="text-center">
                <div className="rounded-full border border-white/10 bg-white/5 p-3 inline-block mb-2">
                  <FaMusic className="text-xl" />
                </div>
                <p className="text-sm">{t('profile.portfolioTypes.image')}</p>
              </div>
            </div>
          )}
          {item.type === 'video' && (
            <div className="relative">
              <div className="w-40 h-40 flex items-center justify-center rounded-lg border border-white/10 bg-black/25">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-lg" />
                <FaPlay className="text-3xl text-white opacity-70" />
              </div>
            </div>
          )}
          {item.type === 'audio' && (
            <div className="w-40 h-40 flex items-center justify-center rounded-lg border border-white/10 bg-black/25">
              <div className="text-center">
                <div className="rounded-full border border-white/10 bg-white/5 p-3 inline-block mb-2">
                  <FaHeadphones className="text-xl" />
                </div>
                <p className="text-sm">{t('profile.portfolioTypes.audio')}</p>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <h4 className="font-semibold text-white">{item.title}</h4>
            <div className="text-xs text-gray-400 uppercase mt-1">
              {t(`profile.portfolioTypes.${item.type}`)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white p-4 sm:p-8 lux-rect">
      <ClientBackdrop />

      <YesNoModal
        open={modalMode === 'delete'}
        title={t('profilePreview.reviews.deleteTitle')}
        description={t('common.cannotBeUndone')}
        onYes={confirmDelete}
        onNo={closeModal}
        yesText={t('common.yes')}
        noText={t('common.no')}
        loading={isSubmittingReview}
      />

      <YesNoModal
        open={modalMode === 'edit'}
        title={t('profilePreview.reviews.editTitle')}
        description={t('profilePreview.reviews.editDescription')}
        onYes={confirmEdit}
        onNo={closeModal}
        yesText={t('common.yes')}
        noText={t('common.no')}
        loading={isSubmittingReview}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">{t('reviews.rating')}</label>
            <select
              className="lux-input w-full"
              value={draftRating}
              onChange={(e) => setDraftRating(Number(e.target.value))}
              disabled={isSubmittingReview}
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">{t('reviews.comment')}</label>
            <textarea
              className="lux-input w-full min-h-[110px]"
              value={draftComment}
              onChange={(e) => setDraftComment(e.target.value)}
              disabled={isSubmittingReview}
            />
          </div>
        </div>
      </YesNoModal>
             
      
      <div className="relative z-10 max-w-6xl mx-auto">

         {/* Back Button */}
              <button 
                onClick={() => router.back()} 
                className="lux-btn-ghost inline-flex items-center mb-6 px-4 py-2 text-sm font-medium text-white/85"
              >
                <FaArrowLeft className="mr-2" />
                {t('profile.backToDashboard')}
              </button>
        {/* Artist Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-8 mb-12 p-6 lux-card lux-rect lux-tilt"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-full">
              <div className="bg-gray-800 rounded-full p-1">
                <img 
                  src={artistData.avatarImage || '/artist/avatar.jpg'} 
                  alt={artistData.artistName} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <motion.h1 
              className={`text-3xl md:text-4xl font-bold mb-2 ${specialGothic.className}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {artistData.artistName}
              <span className="text-purple-400 text-xl font-normal ml-3">
                ({artistData.fullName})
              </span>
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-purple-400 mr-2" />
                <span>{artistData.location}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <span className="text-green-400">{t('common.available')}</span>
              </div>
              
              <div className="lux-chip border-purple-400/20 bg-purple-500/10 text-purple-100">
                {renderExperienceLevel(artistData.experienceLevel)}
              </div>
              
              {artistData.yearsOfExperience && (
                <div className="lux-chip border-blue-400/20 bg-blue-500/10 text-blue-100">
                  {artistData.yearsOfExperience} years experience
                </div>
              )}
            </motion.div>
            
            <motion.p 
              className="text-gray-400 max-w-2xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {artistData.bio}
            </motion.p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Genres & Instruments */}
            <motion.div 
              className="lux-card lux-rect lux-tilt p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaMusic className="mr-3 text-purple-400" /> Musical Expertise
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMusic className="mr-2 text-yellow-400" /> Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="lux-chip border-white/10 bg-white/5 text-white/85"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMicrophone className="mr-2 text-green-400" /> Instruments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artistData.instruments.map((instrument, index) => (
                      <span 
                        key={index} 
                        className="lux-chip border-white/10 bg-white/5 text-white/85"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Demo Tracks */}
            {artistData.demos.length > 0 && (
              <motion.div 
                className="lux-card lux-rect lux-tilt p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                  <FaHeadphones className="mr-3 text-blue-400" /> Demo Tracks
                </h2>
                
                <div className="space-y-4">
                  {artistData.demos.map((demo, index) => (
                    <div 
                      key={index} 
                      className="lux-card lux-rect p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{demo.title}</h3>
                          <p className="text-gray-400 text-sm">Track {index + 1} of {artistData.demos.length}</p>
                        </div>
                        
                        <button 
                          onClick={() => toggleDemoPlay(index)}
                          className={[
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            demo.playing ? 'lux-btn-metal' : 'lux-btn-ghost',
                          ].join(' ')}
                        >
                          {demo.playing ? <FaPause /> : <FaPlay className="ml-1" />}
                        </button>
                      </div>
                      
                      {demo.playing && (
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 30 }}
                          />
                        </div>
                      )}
                      
                      {demo.playing && (
                        <div className="flex justify-between text-gray-400 text-sm mt-2">
                          <span>1:25</span>
                          <span>3:45</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Portfolio */}
            <motion.div 
              className="lux-card lux-rect lux-tilt p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaMusic className="mr-3 text-yellow-400" /> {t('profilePreview.portfolioTitle')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artistData.portfolio.map((item, index) => (
                  <AnimatePresence key={index}>
                    {renderPortfolioItem(item, index)}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div 
              className="lux-card lux-rect lux-tilt p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${specialGothic.className}`}>
                <FaUserFriends className="mr-3 text-green-400" /> {t('profilePreview.contactArtistTitle')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                  <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <FaEnvelope className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t('common.email')}</p>
                    <p className="font-medium">{artistData.contact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                  <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <FaPhone className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t('common.phone')}</p>
                    <p className="font-medium">{artistData.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                  <div className="bg-pink-900/30 p-2 rounded-lg mr-3">
                    <FaInstagram className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t('common.instagram')}</p>
                    <p className="font-medium">{artistData.contact.instagram}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                  <div className="bg-orange-900/30 p-2 rounded-lg mr-3">
                    <FaSoundcloud className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t('common.soundcloud')}</p>
                    <p className="font-medium">{artistData.contact.soundcloud}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                  <div className="bg-red-900/30 p-2 rounded-lg mr-3">
                    <FaYoutube className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{t('common.youtube')}</p>
                    <p className="font-medium">{artistData.contact.youtube}</p>
                  </div>
                </div>
              </div>
              
              <button className={`w-full mt-6 py-3 lux-btn-metal font-bold ${specialGothic.className}`}>
                {t('profilePreview.sendBookingRequest')}
              </button>
            </motion.div>
            
            {/* Languages & Availability */}
            <motion.div 
              className="lux-card lux-rect lux-tilt p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                <FaGlobe className="mr-3 text-blue-400" /> {t('profilePreview.languagesAvailabilityTitle')}
              </h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">{t('profilePreview.languagesTitle')}</h3>
                <div className="flex flex-wrap gap-2">
                  {artistData.languages.map((lang, index) => (
                    <span 
                      key={index} 
                      className="lux-chip border-white/10 bg-white/5 text-white/85"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{t('profilePreview.availabilityTitle')}</h3>
                <div className="lux-card lux-rect p-4">
                  <p className="text-gray-300">{artistData.availability}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Collaborators */}
            {artistData.collaborators.length > 0 && (
              <motion.div 
                className="lux-card lux-rect lux-tilt p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold mb-4 flex items-center ${specialGothic.className}`}>
                  <FaUserFriends className="mr-3 text-green-400" /> {t('profilePreview.frequentCollaboratorsTitle')}
                </h2>
                
                <div className="space-y-3">
                  {artistData.collaborators.map((collab, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg border border-white/10 bg-black/25">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center mr-3 border border-white/10 bg-white/5">
                        <span className="text-xs">C{index + 1}</span>
                      </div>
                      <p className="font-medium">{collab}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            
          </div>

          
        </div>
        <br />
        <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewsSection reviews={reviews} onEdit={openEditModal} onDelete={openDeleteModal} />
            </motion.div>
      </div>
    </div>
  );
}
