// components/StudioCardGrid.jsx
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaMusic } from 'react-icons/fa';
import Link from 'next/link';

// Optional perks configuration for visual enhancements
const STUDIO_PERKS = {
  1: { name: 'Basic', badge: null },
  2: { name: 'Highlighted', badge: 'Pro', color: 'blue' },
  3: { name: 'Ranking Boost', badge: 'Boost', color: 'green' },
  4: { name: 'Featured', badge: 'Featured', color: 'purple' },
  5: { name: 'Priority', badge: 'Priority', color: 'orange' },
  6: { name: 'Analytics', badge: 'Analytics', color: 'teal' },
  7: { name: 'Headliner', badge: 'Headliner', color: 'red' },
  8: { name: 'Promo', badge: 'Promo', color: 'pink' },
  9: { name: 'Legend', badge: 'Legend', color: 'yellow' },
  10: { name: 'Elite', badge: 'Elite', color: 'gradient' }
};

const getBadgeColor = (perk) => {
  switch (perk?.color) {
    case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'teal': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'pink': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'gradient': return 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-purple-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getPerkBorderGlow = (level) => {
  if (level >= 10) return 'border-2 border-transparent bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 bg-clip-border shadow-[0_0_30px_rgba(147,51,234,0.4),0_0_60px_rgba(236,72,153,0.2)]';
  if (level >= 7) return 'border-2 border-transparent bg-gradient-to-r from-red-500/15 via-orange-500/15 to-yellow-500/15 bg-clip-border shadow-[0_0_25px_rgba(239,68,68,0.3)]';
  if (level >= 5) return 'border-2 border-transparent bg-gradient-to-r from-orange-500/12 via-amber-500/12 to-yellow-500/12 bg-clip-border shadow-[0_0_20px_rgba(251,146,60,0.25)]';
  if (level >= 3) return 'border-2 border-transparent bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 bg-clip-border shadow-[0_0_15px_rgba(34,197,94,0.2)]';
  if (level >= 2) return 'border-2 border-transparent bg-gradient-to-r from-blue-500/8 via-indigo-500/8 to-purple-500/8 bg-clip-border shadow-[0_0_12px_rgba(59,130,246,0.15)]';
  return 'border-2 border-neutral-400/20';
};

export const StudioCard = ({ studio, href, showPerks = true }) => {
  const level = studio?.level || 1;
  const perk = STUDIO_PERKS[level] || STUDIO_PERKS[1];
  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href, className: 'block' } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div 
        className={`bg-neutral-400/20 hover:bg-neutral-400/30 backdrop-blur-md rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${showPerks ? getPerkBorderGlow(level) : 'border-2 border-neutral-400/20'}`}
      >
        <div className="relative h-48">
          {studio.coverPhoto ? (
            <img 
              src={studio.coverPhoto} 
              alt={studio.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-[#1a1f1a] w-full h-full flex items-center justify-center">
              <FaMusic className="text-[#540D6E] text-4xl" />
            </div>
          )}

          {/* Avatar */}
          <div className="absolute -bottom-6 left-4">
            <div className="bg-[#0C0F0A] p-1 rounded-full">
              {studio.avatar ? (
                <img 
                  src={studio.avatar} 
                  alt={studio.name} 
                  className="w-12 h-12 rounded-full border-2 border-[#540D6E] object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1a1f1a] border-2 border-[#540D6E] flex items-center justify-center">
                  <FaMusic className="text-[#540D6E]" />
                </div>
              )}
            </div>
          </div>

          {/* Perk badge */}
          {showPerks && perk?.badge && (
            <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getBadgeColor(perk)}`}>
              <span>{perk.badge}</span>
            </div>
          )}
        </div>

        {/* Studio Info */}
        <div className="p-5 pt-8">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[#EAEAEA] font-bold text-lg font-special">{studio.name}</h3>
            <div className="flex items-center bg-[#1a1f1a] px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-[#EAEAEA] font-medium font-special-regular">{studio.rating}</span>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-[#540D6E] mr-2" />
            <span className="text-[#A0A0A0] text-sm font-special-regular">{studio.location}</span>
          </div>

          <div className="mb-4">
            <p className="text-[#EAEAEA] text-sm font-medium mb-2 font-special-regular">Studio Type</p>
            <div className="flex flex-wrap gap-2 font-special-regular">
              {(studio.types || []).map((type, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-[#540D6E] text-[#EAEAEA] text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#EAEAEA] text-sm font-medium mb-2 font-special-regular">Music Genres</p>
            <div className="flex flex-wrap gap-2">
              {(studio.genres || []).map((genre, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-[#1a1f1a] border border-[#540D6E] text-[#EAEAEA] text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const StudioCardGrid = ({ studios }) => {
  if (!studios || studios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-[#EAEAEA]">No studios found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} href={`/pages/client/studios/studio-details/${studio.id}`} />
        
      ))}
    </div>
  );
};

export default StudioCardGrid;