// app/favorites/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { specialGothic } from '@/app/fonts';
import StudioCardGrid from '@/app/components/StudioCardGrid';
import { Studio } from '../../types';
import { getFavoriteStudio, getMiniProfile } from '../../service/api';
import ArtistProfileDropdown from '@/app/components/ArtistProfileDropdown ';
import NotificationDropdown from '@/app/components/NotificationDropdown';

const FavoritesPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [favoriteStudios, setfavoriteStudio] = useState<Studio[]>([]);

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
  })

  useEffect(() => {
    async function fetchMiniProfile() {
      try {
        const data = await getMiniProfile(1);
        setArtistProfile(data);
        console.log("profile data is working");
      } catch (err) {
        console.error(err);
      }
    }
    fetchMiniProfile();
  }, []);

  useEffect(() => {
    async function fetchFavStudio() {
      try {
          const data = await getFavoriteStudio(1);
          setfavoriteStudio(data);
          console.log("favorite studio data is working");
        } catch (err) {
          console.error(err);
        }
      }
    fetchFavStudio();
  }, []);

  const filteredStudios = favoriteStudios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          studio.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch ;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${specialGothic.className} mb-2`}>
              Favorite Studios
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Your saved studios for quick access
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search studios..."
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-full pl-10 pr-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <NotificationDropdown />
              <ArtistProfileDropdown artistProfile={{
                name: artistProfile.name,
                prenom: artistProfile.artistName,
                avatar: artistProfile.avatar
              }} />
            </div>
          </div>
        </div>

        {/* Favorite Studios Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredStudios.length > 0 ? (
              <StudioCardGrid studios={filteredStudios} />
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 sm:p-8 md:p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-900/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center">
                    <FaHeart className="text-xl sm:text-2xl md:text-3xl text-purple-400" />
                  </div>
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${specialGothic.className}`}>
                  No favorites yet
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-4 sm:mb-6">
                  You haven't saved any studios to your favorites. Start exploring studios and add them to your favorites for quick access.
                </p>
                <button 
                  onClick={() => router.push('/dashboard')} 
                  className={`px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 font-bold text-sm sm:text-base ${specialGothic.className}`}
                >
                  Browse Studios
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoritesPage;