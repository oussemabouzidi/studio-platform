// app/favorites/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Studio } from '../../types';
import { getFavoriteStudio, getMiniProfile } from '../../service/api';
import NotificationDropdown from '@/app/components/NotificationDropdown';
import { specialGothic } from '@/app/fonts';
import StudioCardGrid from '@/app/components/StudioCardGrid';
import ArtistProfileDropdown from '@/app/components/ArtistProfileDropdown ';
import ClientBackdrop from '@/app/components/ClientBackdrop';
import LuxSpinner from '@/app/components/LuxSpinner';
import EmptyFavoritesState from '@/app/components/EmptyFavoritesState';
import { useT } from '@/app/i18n/useT';

const FavoritesPage = () => {
  const router = useRouter();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteStudios, setfavoriteStudio] = useState<Studio[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

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
        const rawArtistId = localStorage.getItem("artist_id");
        if (!rawArtistId) return;

        const artistId = Number(rawArtistId);
        if (!Number.isFinite(artistId)) return;

        const data = await getMiniProfile(artistId);
        setArtistProfile(data);
        console.log("profile data is working");
      } catch (err) {
        // Keep the page usable even if profile fetch fails (avoid noisy console errors).
      }
    }
    fetchMiniProfile();
  }, []);

  useEffect(() => {
    async function fetchFavStudio() {
      try {
          setIsLoadingFavorites(true);
          const rawArtistId = localStorage.getItem("artist_id");
          if (!rawArtistId) {
            setfavoriteStudio([]);
            return;
          }

          const artistId = Number(rawArtistId);
          if (!Number.isFinite(artistId)) {
            setfavoriteStudio([]);
            return;
          }

          const data = await getFavoriteStudio(artistId);
          setfavoriteStudio(data);
          console.log("favorite studio data is working");
        } catch (err) {
          console.error(err);
          setfavoriteStudio([]);
        } finally {
          setIsLoadingFavorites(false);
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
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white p-4 sm:p-6 md:p-8 lux-rect">
      <ClientBackdrop />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/pages/client/studios')}
          className="lux-btn-ghost inline-flex items-center mb-4 sm:mb-6 px-4 py-2 text-sm font-medium text-white/85"
        >
          <FaArrowLeft className="mr-2" />
          {t('common.backToStudios')}
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${specialGothic.className} mb-2`}>
              {t('common.favoritesTitle')}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {t('common.favoritesSubtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchStudiosPlaceholder')}
                className="lux-input w-full pl-10 pr-4 py-3 sm:py-4 placeholder-white/35"
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
            {isLoadingFavorites ? (
              <div className="lux-card lux-rect p-6 sm:p-8 md:p-12 text-center">
                <LuxSpinner label={t('favorites.loadingFavorites')} />
              </div>
            ) : filteredStudios.length > 0 ? (
              <StudioCardGrid studios={filteredStudios} />
            ) : (
              <EmptyFavoritesState browseHref="/pages/client/studios" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoritesPage;
